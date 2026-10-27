"""Vercel function: every form on technext.asia becomes a lead in the Odoo CRM (technext.odoo.com).

POST /api/lead with the form's fields as JSON (site.js tnPostForm; the only place a form goes).
The lead is named "<form> - <what they need> - <company>", tagged "Website" plus the form it came from, and
filled in field by field: contact, company, email, phone in +63 / +65 form, country, job position. Source /
medium / campaign come from where the visit started (utm_* tags, ad click ids, the referrer): "Paid Ads",
"Email" (newsletters), the social network, otherwise "Website". Department (sales team) is "Marketing Dept",
or "Sales Team" until that exists. The lead stays UNASSIGNED (ODOO_SALESPERSON empty) so everyone with
Sales access sees it; Jeric picks it up by setting himself as salesperson. Internal notes hold the answers in
three short groups (what they need / about them / how they found us) plus the full links at the bottom; every
lead @mentions jeric@technext.asia (ODOO_NOTIFY_EMAILS) with a short summary, and Jeric plus ODOO_COPY_EMAILS
(hello@technext.asia) get it by email. Likely spam is tagged "Possible spam", never dropped. The Odoo API key
lives only in the Vercel env var ODOO_API_KEY, never in this public repo.
"""
import html
import http.client
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

ODOO = os.environ.get("ODOO_URL", "https://technext.odoo.com").rstrip("/")
KEY = os.environ.get("ODOO_API_KEY", "")
NOTIFY_EMAILS = [x.strip() for x in os.environ.get("ODOO_NOTIFY_EMAILS", "jeric@technext.asia").split(",") if x.strip()]
ORIGINS = ("https://technext.asia", "https://www.technext.asia")
# technext.odoo.com hosts a copy of the site and the discovery-call booking page; both post here (CORS)
CORS_ORIGINS = ("https://technext.odoo.com",)
COPY_EMAILS = [x.strip() for x in os.environ.get("ODOO_COPY_EMAILS", "hello@technext.asia").split(",") if x.strip()]
# login every lead is assigned to; empty = unassigned. Rico (the API user, Sales "Own Documents Only") cannot
# see a lead assigned to someone else, so leads stay unassigned until Rico gets "All Documents" access.
SALESPERSON = os.environ.get("ODOO_SALESPERSON", "")
# first active sales team that exists ("Website" team is archived); direct / referral / messaging -> "Sales Dept"
DEPARTMENTS = ("Marketing Dept", "Sales Team")
SPAM_TAG = "Possible spam"
# an ad click leaves one of these in the landing URL -> source "Paid Ads"
AD_CLICK = re.compile(r"[?&](gclid|gbraid|wbraid|fbclid_ad|msclkid|utm_medium=(cpc|ppc|paid[a-z_]*|ads?))(=|&|$)", re.I)
EMAIL_HINT = re.compile(r"e-?mail|newsletter|brevo|sendinblue|mailchimp|sendibm|edm", re.I)
SOCIAL = (("facebook", "Facebook"), ("fb.", "Facebook"), ("instagram", "Instagram"), ("linkedin", "LinkedIn"),
          ("lnkd.in", "LinkedIn"), ("youtube", "YouTube"), ("youtu.be", "YouTube"))

# form "source" field (or the page) -> form name, used for the tag "Web form: <name>" and the lead title
FORMS = [
    ("bir", "BIR adviser call"),                   # older copies of the page still say "Free website with Odoo page (BIR)"
    ("quotation", "Quotation builder"),
    ("get started", "Free website offer (/get-started)"),
    ("free website", "Free website offer (/free-website-with-odoo)"),
    ("contact", "Contact page"),
    ("let's talk", "Let's Talk panel"),
    ("discovery call", "Discovery call booking"),
]
SHORT = {"Free website offer (/get-started)": "Free website offer", "Let's Talk panel": "Let's Talk",
         "Free website offer (/free-website-with-odoo)": "Free website offer", "Quotation builder": "Quotation"}
LABELS = {"topic": "Interested in", "bir_pain": "Needs", "message": "Message", "apps": "Odoo apps", "users": "Users",
          "hosting": "Hosting", "services": "Services", "timeline": "Timeline", "scope_summary": "Quotation scope",
          "team_size": "Team size", "current_website": "Current website", "call_time": "Best time to call",
          "slot": "Meeting time", "job_title": "Role", "industry": "Industry", "branches": "Branches",
          "annual_sales": "Gross annual sales", "accounting_system": "Books today",
          "cas_status": "Registered for CAS or CBA", "country": "Country", "consent": "Privacy consent"}
NEED = ("topic", "bir_pain", "message", "apps", "users", "hosting", "services", "timeline", "scope_summary",
        "team_size", "current_website", "call_time", "slot")
ABOUT = ("job_title", "industry", "branches", "annual_sales", "accounting_system", "cas_status", "country")
QUOTE_FIELDS = ("apps", "users", "hosting", "services", "timeline")
# kept out of the notes: in their own lead fields already, internal codes, or the tracking group
SKIP = {"_subject", "_template", "_captcha", "_honey", "_next", "_cc", "_autoresponse", "name", "email", "phone",
        "company", "source", "need", "page", "landing", "referrer"}
# pitches that arrive through the forms (paid features, SEO / followers sellers) and faker-style test data
SPAM_TEXT = re.compile(r"cover story|paid (feature|placement|article)|guest post|backlinks?|\bSEO (services|package)|"
                       r"followers|first page of google|crypto|casino|loan offer", re.I)
FAKE_COMPANY = re.compile(r"^[A-Z][a-z]+, [A-Z][a-z]+ and [A-Z][a-z]+$")


_CONN = None  # one HTTPS connection to Odoo, reused while the instance is warm (no new TLS handshake per call)
HOST = urllib.parse.urlsplit(ODOO).netloc


def rpc(model, method, **kw):
    global _CONN
    body = json.dumps(kw).encode()
    headers = {"Authorization": f"bearer {KEY}", "Content-Type": "application/json",
               "User-Agent": "technext-website-forms/1.0"}
    for wait in (1.5, 3, 0):                              # odoo.com answers bursts with 429: back off and retry
        for attempt in (1, 2):                            # Odoo may have closed the idle connection: reconnect once
            try:
                if _CONN is None:
                    _CONN = http.client.HTTPSConnection(HOST, timeout=15)
                _CONN.request("POST", f"/json/2/{model}/{method}", body, headers)
                r = _CONN.getresponse()
                data = r.read()
                break
            except (http.client.HTTPException, OSError):
                _CONN = None
                if attempt == 2:
                    raise
        if r.status == 429 and wait:
            time.sleep(wait)
            continue
        if r.status >= 400:
            raise urllib.error.HTTPError(f"{ODOO}/json/2/{model}/{method}", r.status,
                                         data[:300].decode(errors="replace"), r.headers, None)
        return json.loads(data or b"null")


_IDS = {}  # tag / utm ids, kept while the function instance stays warm


def find_or_create(model, name):
    if (model, name) not in _IDS:
        ids = rpc(model, "search", domain=[["name", "=", name]], limit=1)
        _IDS[model, name] = ids[0] if ids else rpc(model, "create", vals_list=[{"name": name}])[0]
    return _IDS[model, name]


def partners(emails):
    """Odoo partners for these emails, looked up once per warm instance."""
    key = ("partners",) + tuple(emails)
    if key not in _IDS:
        _IDS[key] = [p for e in emails for p in rpc(
            "res.partner", "search_read", domain=[["email", "=ilike", e]], fields=["name", "email"], limit=1)]
    return _IDS[key]


def lookup(model, domain):
    """First matching id or False; a miss is remembered for 5 minutes, so a team created later is picked up."""
    key = (model, json.dumps(domain))
    hit = _IDS.get(key)
    if hit is None or (hit is False and time.time() > _IDS.get(key + ("until",), 0)):
        ids = rpc(model, "search", domain=domain, limit=1)
        _IDS[key] = ids[0] if ids else False
        _IDS[key + ("until",)] = time.time() + 300
    return _IDS[key]


def clean(v, n=2000):
    return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", str(v)).strip()[:n]


def form_tag(source, page=""):
    s = (source or "").lower()
    if "/bir-adviser-call" in (page or ""):
        return "BIR adviser call"
    return next((tag for key, tag in FORMS if key in s), "Other form")


def phone_format(phone, country):
    """Typed number -> international form: 0995 390 4694 (PH) -> +63 995 390 4694, 9123 4567 (SG) -> +65 9123 4567.
    Anything it cannot read for sure is kept exactly as typed."""
    d = re.sub(r"\D", "", phone)
    c = (country or "").lower()
    if re.fullmatch(r"(63|0)?9\d{9}", d) and (c in ("", "philippines") or phone.lstrip().startswith(("+63", "09", "63"))):
        n = d[-10:]
        return f"+63 {n[:3]} {n[3:6]} {n[6:]}"
    if re.fullmatch(r"(65)?[689]\d{7}", d) and (c == "singapore" or phone.lstrip().startswith("+65")):
        n = d[-8:]
        return f"+65 {n[:4]} {n[4:]}"
    return re.sub(r"\s+", " ", phone).strip()


def visit(p):
    """Where the visit started: (source name, medium name, campaign or "", one-line summary for the notes)."""
    land, page, ref = (clean(p.get(k, ""), 600) for k in ("landing", "page", "referrer"))
    q = {}
    for url in (page, land):                               # the first page of the visit wins
        q.update({k: v[0] for k, v in urllib.parse.parse_qs(urllib.parse.urlsplit(url).query).items()})
    us, um, uc = (q.get(k, "").strip()[:80] for k in ("utm_source", "utm_medium", "utm_campaign"))
    ref_host = urllib.parse.urlsplit(ref).netloc.lower()
    if any(AD_CLICK.search(u) for u in (land, page)):
        src, med, how = "Paid Ads", "Website", "Ad click"
    elif EMAIL_HINT.search(f"{us} {um}") or (not us and EMAIL_HINT.search(ref_host)):
        src, med, how = "Email", "Email", "Email campaign"
    elif (net := next((n for k, n in SOCIAL if k in f"{us.lower()} {ref_host}"), None)):
        src, med, how = net, "Social Media", net
    else:
        src, med = "Website", "Website"
        how = (f"Referred by {ref_host}" if ref_host and "technext" not in ref_host else "Website visit")
    if src == "Website" and ("google." in ref_host or "bing." in ref_host):
        how = "Search (" + ref_host.replace("www.", "") + ")"
    bits = [b for b in (uc and f'"{uc}"', um and um != med.lower() and um, q.get("utm_content", "")[:60]) if b]
    return src, med, uc, how + (" - " + ", ".join(bits) if bits else "")


def short_url(url):
    u = urllib.parse.urlsplit(url)
    return (u.netloc.replace("www.", "") + u.path) if u.netloc else url


def spam_reason(p, name, email, company):
    text = " ".join(clean(p.get(k, "")) for k in ("message", "topic", "company"))
    if SPAM_TEXT.search(text):
        return "sales pitch (" + SPAM_TEXT.search(text).group(0) + ")"
    if FAKE_COMPANY.match(company) and email.split("@")[-1].lower() in ("hotmail.com", "gmail.com", "yahoo.com", "outlook.com"):
        return "made-up company name with a free email address"
    if len(re.findall(r"https?://", text)) >= 3:
        return "message full of links"
    return ""


def keep_typed(lead, name, phone):
    """An email that matches an existing Odoo contact links that contact, and Odoo then overwrites the
    typed name and phone with the contact's. Put back what the visitor typed."""
    want = {k: v for k, v in (("contact_name", name), ("phone", phone)) if v}
    if not want:
        return
    got = rpc("crm.lead", "read", ids=[lead], fields=list(want))
    if got and any(got[0].get(k) != v for k, v in want.items()):
        rpc("crm.lead", "write", ids=[lead], vals=want)


def booking_lead(email, tries=8, wait=1.5):
    """The opportunity Odoo's appointment app creates for a discovery-call booking (it appears a moment
    after the booking form is sent). False when it never shows up or the API user cannot see it."""
    for i in range(tries):
        since = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time() - 600))
        ids = rpc("crm.lead", "search", domain=[["email_from", "=ilike", email], ["create_date", ">=", since],
                                                ["name", "ilike", "Booking"]], order="id desc", limit=1)
        if ids:
            return ids[0]
        time.sleep(wait)
    return False


def summary(p, form):
    """The answers in three groups, as (heading, [(label, value)]) - same order in the notes and the @Jeric note."""
    vals = {k: clean(v) for k, v in p.items() if k not in SKIP and str(v).strip()}
    if any(vals.get(k) for k in QUOTE_FIELDS):
        vals.pop("scope_summary", None)                    # the summary repeats them
    if vals.get("bir_pain"):
        vals.pop("topic", None)                            # the BIR page's topic is the same need, shorter
    elif vals.get("topic"):
        vals["topic"] = re.sub(r"^Need:\s*", "", vals["topic"])
    if vals.get("country", "").lower() == "other":
        vals.pop("country")
    label = lambda k: LABELS.get(k, k.replace("_", " ").capitalize())
    need = [(label(k), vals.pop(k)) for k in NEED if k in vals]
    about = [(label(k), vals.pop(k)) for k in ABOUT if k in vals]
    consent = vals.pop("consent", "")
    need += [(label(k), v) for k, v in vals.items()]       # any field added to a form later still shows up
    src, med, campaign, how = visit(p)
    found = [("Came from", how)]
    page, land = clean(p.get("page", ""), 600), clean(p.get("landing", ""), 600)
    found.append(("Form on", f"{form} - {short_url(page)}" if page else form))
    if land and short_url(land) != short_url(page):
        found.append(("First page", short_url(land)))
    links = [(k, v) for k, v in (("Page", page), ("First page of the visit", land),
                                 ("Referrer", clean(p.get("referrer", ""), 600)), ("Privacy consent", consent)) if v]
    return [("What they need", need), ("About them", about), ("How they found us", found)], links, (src, med, campaign)


def as_html(groups, links=()):
    out = "".join(f"<p><b>{html.escape(h)}</b></p><ul>" + "".join(
        f"<li>{html.escape(k)}: {html.escape(v)}</li>" for k, v in rows) + "</ul>" for h, rows in groups if rows)
    if links:
        out += "<p><small>Full links: " + " | ".join(f"{html.escape(k)}: {html.escape(v)}" for k, v in links) + "</small></p>"
    return out


def make_lead(p):
    name, email, company = (clean(p.get(k, ""), 200) for k in ("name", "email", "company"))
    country = clean(p.get("country", ""), 80)
    phone = phone_format(clean(p.get("phone", ""), 200), country)
    country = "" if country.lower() == "other" else country
    form = form_tag(p.get("source"), p.get("page"))
    groups, links, (src_name, med_name, campaign) = summary(p, form)
    need = next((v for k, v in groups[0][1] if k in ("Needs", "Interested in")), "")
    spam = spam_reason(p, name, email, company)
    title = " - ".join(x for x in (SHORT.get(form, form), need[:60], company or name or email) if x)
    # one at a time: parallel calls trip odoo.com's rate limit (429)
    tags = [find_or_create("crm.tag", "Website"), find_or_create("crm.tag", "Web form: " + form)]
    if spam:
        tags.append(find_or_create("crm.tag", SPAM_TAG))
    team = next((t for t in (lookup("crm.team", [["name", "=", d]]) for d in DEPARTMENTS) if t), False)
    vals = {
        "type": "lead",
        "user_id": False,                                  # a salesperson, if any, is set last (see below)
        "team_id": team,
        "name": title[:200],
        "contact_name": name, "partner_name": company, "email_from": email, "phone": phone,
        "description": as_html(groups, links),             # html field, shown as Internal Notes
        "tag_ids": [[6, 0, tags]],
        "source_id": find_or_create("utm.source", src_name),
        "medium_id": find_or_create("utm.medium", med_name),
    }
    if p.get("job_title"):
        vals["function"] = clean(p["job_title"], 120)
    if country:
        vals["country_id"] = lookup("res.country", [["name", "=ilike", country]])
    if campaign:
        try:                                               # a campaign the API user cannot create never blocks the lead
            vals["campaign_id"] = find_or_create("utm.campaign", campaign)
        except Exception as e:
            print("campaign not set:", repr(e)[:300])
    info = (form, name, email, phone, company, country, groups, spam)
    if form == "Discovery call booking" and email:
        # Odoo's appointment app files the booking itself: enrich that opportunity instead of adding a second lead
        def after():
            found = booking_lead(email)
            if found:
                upd = {k: v for k, v in vals.items()
                       if k in ("partner_name", "tag_ids", "source_id", "medium_id", "campaign_id", "country_id", "team_id") and v}
                rpc("crm.lead", "write", ids=[found], vals=upd)
                rpc("crm.lead", "message_post", ids=[found], body_is_html=True, message_type="comment",
                    subtype_xmlid="mail.mt_note", body="<p>Booking form details:</p>" + as_html(groups, links))
                lead = found
            else:                                          # not visible to the API user: file it as a lead of its own
                lead = rpc("crm.lead", "create", vals_list=[vals])[0]
            keep_typed(lead, name, phone)
            follow_up(lead, *info)
        return None, after
    lead = rpc("crm.lead", "create", vals_list=[vals])[0]

    def after():
        keep_typed(lead, name, phone)
        follow_up(lead, *info)
    return lead, after


def follow_up(lead, form, name, email, phone, company, country, groups, spam):
    """The @Jeric note + emails (and a salesperson, if set). Runs after the visitor has their answer."""
    people, copies = partners(NOTIFY_EMAILS), partners(COPY_EMAILS)
    if people or copies:                                   # @mention Jeric; Jeric + copies get the summary by email
        at = " ".join(f'<a href="/odoo/res.partner/{p["id"]}" class="o_mail_redirect" data-oe-id="{p["id"]}" '
                      f'data-oe-model="res.partner">@{html.escape(p["name"])}</a> ({html.escape(p["email"])})'
                      for p in people)
        who = " &middot; ".join(html.escape(x) for x in (company, country) if x)
        reach = " &middot; ".join(html.escape(x) for x in (email, phone) if x)
        flag = f"<p><b>Looks like spam:</b> {html.escape(spam)}. Check before replying.</p>" if spam else ""
        body = (f"<p>{at} New lead from the <b>{html.escape(form)}</b>. Please follow up.</p>{flag}"
                f"<p><b>{html.escape(name or email)}</b>{' &middot; ' + who if who else ''}<br>{reach}</p>"
                + as_html([(h, [r for r in rows if r[0] != "Country"]) for h, rows in groups]))  # country is up top
        rpc("crm.lead", "message_post", ids=[lead], partner_ids=list({p["id"] for p in people + copies}),
            message_type="comment", subtype_xmlid="mail.mt_comment", body_is_html=True,
            context={"mail_notify_author": True},          # the copy goes to Rico, who is also the API user
            body=body)
    # salesperson last: the API user may only see its own / unassigned leads, so it hands the lead over at the end
    if SALESPERSON:
        try:
            user = lookup("res.users", [["login", "=ilike", SALESPERSON]])
            if user:
                rpc("crm.lead", "write", ids=[lead], vals={"user_id": user})
        except Exception as e:                             # the lead is filed and Jeric notified either way
            print("salesperson not set:", repr(e)[:300])


class handler(BaseHTTPRequestHandler):
    def _cors(self):
        origin = self.headers.get("Origin", "")
        if origin in CORS_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
            self.send_header("Access-Control-Max-Age", "86400")
            self.send_header("Vary", "Origin")

    def do_OPTIONS(self):
        self.send_response(204 if self.headers.get("Origin", "") in CORS_ORIGINS else 403)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _send(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        self.wfile.flush()

    def do_POST(self):
        if self.headers.get("Origin", "") not in ORIGINS + CORS_ORIGINS:
            return self._send(403, {"ok": False, "error": "origin"})
        n = int(self.headers.get("Content-Length") or 0)
        if not 0 < n <= 20000:
            return self._send(413, {"ok": False, "error": "size"})
        try:
            p = json.loads(self.rfile.read(n))
            assert isinstance(p, dict)
        except Exception:
            return self._send(400, {"ok": False, "error": "json"})
        if p.get("_honey"):
            return self._send(200, {"ok": True})            # bots get the normal answer, nothing is filed
        if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+$", str(p.get("email", ""))) and not str(p.get("phone", "")).strip():
            return self._send(400, {"ok": False, "error": "contact"})
        if not KEY:
            return self._send(503, {"ok": False, "error": "not configured"})
        try:
            lead, after = make_lead(p)
        except Exception as e:                             # the visitor is shown sales@technext.asia to email instead
            print("odoo lead failed:", repr(e)[:500])
            return self._send(502, {"ok": False, "error": "crm"})
        self._send(200, {"ok": True, "lead": lead})        # the lead is saved: thank the visitor now
        try:
            after()
        except Exception as e:                             # the lead exists; only the note / emails are missing
            print("odoo follow-up failed:", repr(e)[:500])

    def do_GET(self):
        self._send(405, {"ok": False})
