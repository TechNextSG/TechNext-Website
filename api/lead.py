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
import hashlib
import hmac
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

# form "source" field (or the page) -> form name (no free website offer since 28 Oct 2026: old copies are "Retired offer page"), used for the tag "Web form: <name>" and the lead title
FORMS = [
    ("bir", "BIR adviser call"),                   # older copies of the page still say "Free website with Odoo page (BIR)"
    ("quotation", "Quotation builder"),
    ("get started", "Retired offer page (/get-started)"),
    ("free website", "Retired offer page (/free-website-with-odoo)"),
    ("contact", "Contact page"),
    ("let's talk", "Let's Talk panel"),
    ("discovery call", "Discovery call booking"),
]
SHORT = {"Retired offer page (/get-started)": "Retired offer page", "Let's Talk panel": "Let's Talk",
         "Retired offer page (/free-website-with-odoo)": "Retired offer page", "Quotation builder": "Quotation"}
# each answer is shown as "<the form's question>: <answer>"; FORM_LABELS has the wording a form asks differently
LABELS = {"name": "Name", "company": "Company", "email": "Work email", "phone": "Phone",
          "topic": "I'm interested in", "bir_pain": "What do you need most?", "message": "Message",
          "apps": "Which Odoo apps?", "users": "How many users?", "hosting": "Hosting", "services": "Services needed",
          "timeline": "Timeline", "scope_summary": "Quotation scope",
          "team_size": "Team size", "current_website": "Current website", "call_time": "Best time to call",
          "slot": "Meeting time", "job_title": "Role", "industry": "Industry", "branches": "Branches",
          "annual_sales": "Gross annual sales", "accounting_system": "Books today",
          "cas_status": "Registered for CAS or CBA", "country": "Country", "consent": "Privacy consent"}
FORM_LABELS = {
    "BIR adviser call": {"name": "Full name", "phone": "Mobile number",
                         "message": "Message"},
    "Retired offer page (/get-started)": {"topic": "I want", "message": "Your current website"},
    "Quotation builder": {"message": "Anything else"},
}
NEED = ("topic", "bir_pain", "message", "apps", "users", "hosting", "services", "timeline", "scope_summary",
        "team_size", "current_website", "call_time", "slot")
ABOUT = ("job_title", "industry", "branches", "annual_sales", "accounting_system", "cas_status", "country")
QUOTE_FIELDS = ("apps", "users", "hosting", "services", "timeline")
# kept out of the notes: in their own lead fields already, internal codes, or the tracking group
SKIP = {"_subject", "_template", "_captcha", "_honey", "_next", "_cc", "_autoresponse", "name", "email", "phone",
        "company", "source", "need", "page", "landing", "referrer", "_split", "_followup", "_sig", "_timing",
        "_eid", "_fbc", "_fbp", "_consent", "_cap", "_cap_a"}
# pitches that arrive through the forms (paid features, SEO / followers sellers) and faker-style test data
SPAM_TEXT = re.compile(r"cover story|paid (feature|placement|article)|guest post|backlinks?|\bSEO (services|package)|"
                       r"followers|first page of google|crypto|casino|loan offer", re.I)
FAKE_COMPANY = re.compile(r"^[A-Z][a-z]+, [A-Z][a-z]+ and [A-Z][a-z]+$")
# 31 Oct: a bot in a real browser (it solves the security code) files made-up Vietnamese leads, also as forged
# discovery-call bookings. TechNext sells in PH and SG only, so Vietnamese text, +84 phones and .vn emails are dropped.
VIET_CHARS = re.compile("[ăđơưĂĐƠƯẠ-ỹ]")
VIET_WORDS = re.compile(r"\b(cong ty|tnhh|toi muon|chung toi|bao gia|giai phap|doanh nghiep|nguoi dung|"
                        r"vui long|xin chao|cho toi|tim hieu|nguyen van)\b", re.I)


_CONN = None  # one HTTPS connection to Odoo, reused while the instance is warm (no new TLS handshake per call)
HOST = urllib.parse.urlsplit(ODOO).netloc
TIMES = []    # this request's Odoo calls: [name, status, ms]; sent back only when the request asks (_timing)
WARM = False  # False on the first request a fresh instance serves (a cold start)


def rpc(model, method, **kw):
    global _CONN
    body = json.dumps(kw).encode()
    headers = {"Authorization": f"bearer {KEY}", "Content-Type": "application/json",
               "User-Agent": "technext-website-forms/1.0"}
    for wait in (1.5, 3, 0):                              # odoo.com answers bursts with 429: back off and retry
        for attempt in (1, 2):                            # Odoo may have closed the idle connection: reconnect once
            t0 = time.monotonic()
            try:
                if _CONN is None:
                    _CONN = http.client.HTTPSConnection(HOST, timeout=15)
                _CONN.request("POST", f"/json/2/{model}/{method}", body, headers)
                r = _CONN.getresponse()
                data = r.read()
                TIMES.append([f"{model}.{method}", r.status, round((time.monotonic() - t0) * 1000)])
                break
            except (http.client.HTTPException, OSError):
                TIMES.append([f"{model}.{method}", "reconnect", round((time.monotonic() - t0) * 1000)])
                _CONN = None
                if attempt == 2:
                    raise
        if r.status == 429 and wait:
            TIMES.append(["sleep (429)", 0, round(wait * 1000)])
            time.sleep(wait)
            continue
        if r.status >= 400:
            raise urllib.error.HTTPError(f"{ODOO}/json/2/{model}/{method}", r.status,
                                         data[:300].decode(errors="replace"), r.headers, None)
        return json.loads(data or b"null")


_IDS = {}  # tag / utm ids, kept while the function instance stays warm
# creating a lead the normal way took ~8 s (timed 28 Oct): Odoo logs "Lead created", subscribes the API user and
# sends follower mails inside the call. The lead, its notes and the @Jeric note are the same without them.
QUIET = {"tracking_disable": True, "mail_create_nolog": True, "mail_create_nosubscribe": True, "mail_notrack": True}


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
    rows = [("Came from", how), ("Campaign", uc), ("Channel", um if um != med.lower() else ""),
            ("Link clicked", q.get("utm_content", "")[:60])]
    return src, med, uc, [(k, v) for k, v in rows if v]


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


def bot_lead(p):
    """Why this post is the Vietnamese lead bot (nothing is filed), or "" for a real visitor."""
    text = " ".join(str(v) for k, v in p.items() if k not in SKIP and isinstance(v, (str, int, float)))
    if VIET_CHARS.search(text):
        return "vietnamese text"
    if VIET_WORDS.search(text):
        return "vietnamese words"
    if re.sub(r"[^\d+]", "", str(p.get("phone", ""))).startswith(("+84", "0084", "84")) and \
            len(re.sub(r"\D", "", str(p.get("phone", "")))) == 11:
        return "+84 phone"
    if str(p.get("email", "")).strip().lower().endswith(".vn"):
        return ".vn email"
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


def summary(p, form, contact):
    """Everything as bulleted groups, (heading, [(label, value)]): contact / what they need / about them / how they
    found us / full links - same order in the notes and the @Jeric note (which leaves out the full links)."""
    vals = {k: clean(v) for k, v in p.items() if k not in SKIP and str(v).strip()}
    vals.pop("job_title", None)                            # in the contact group
    vals.pop("country", None)
    if any(vals.get(k) for k in QUOTE_FIELDS):
        vals.pop("scope_summary", None)                    # the summary repeats them
    if vals.get("bir_pain"):
        vals.pop("topic", None)                            # the BIR page's topic is the same need, shorter
    elif vals.get("topic"):
        vals["topic"] = re.sub(r"^Need:\s*", "", vals["topic"])
    label = lambda k: question(form, k)
    need = [(label(k), vals.pop(k)) for k in NEED if k in vals]
    about = [(label(k), vals.pop(k)) for k in ABOUT if k in vals]
    consent = vals.pop("consent", "")
    need += [(label(k), v) for k, v in vals.items()]       # any field added to a form later still shows up
    src, med, campaign, found = visit(p)
    page, land = clean(p.get("page", ""), 600), clean(p.get("landing", ""), 600)
    found += [("Form", form)] + [("Page", short_url(page))] * bool(page)
    if land and short_url(land) != short_url(page):
        found.append(("First page", short_url(land)))
    links = [(k, v) for k, v in (("Page", page), ("First page of the visit", land),
                                 ("Referrer", clean(p.get("referrer", ""), 600)), ("Privacy consent", consent)) if v]
    groups = [("Contact", contact), ("What they need", need), ("About them", about), ("How they found us", found),
              ("Full links", links)]
    return groups, (src, med, campaign)


def question(form, key):
    return FORM_LABELS.get(form, {}).get(key) or LABELS.get(key) or key.replace("_", " ").capitalize()


def as_html(groups):
    """Each group as a bold heading with one "Question: Answer" bullet per answer; empty groups are left out."""
    return "".join(f"<p><b>{html.escape(h)}</b></p><ul>" + "".join(
        f"<li><b>{html.escape(k)}:</b> {html.escape(v)}</li>" for k, v in rows) + "</ul>" for h, rows in groups if rows)


def parse(p):
    """The form's answers, worked out without calling Odoo (make_lead and the follow-up request both use it)."""
    name, email, company = (clean(p.get(k, ""), 200) for k in ("name", "email", "company"))
    country = clean(p.get("country", ""), 80)
    phone = phone_format(clean(p.get("phone", ""), 200), country)
    country = "" if country.lower() == "other" else country
    form = form_tag(p.get("source"), p.get("page"))
    contact = [(question(form, k), v) for k, v in (("name", name), ("company", company), ("job_title", clean(p.get("job_title", ""), 120)),
                                                  ("email", email), ("phone", phone), ("country", country)) if v]
    groups, (src_name, med_name, campaign) = summary(p, form, contact)
    need = re.sub(r"^Need:\s*", "", clean(p.get("bir_pain") or p.get("topic") or "", 60))
    spam = spam_reason(p, name, email, company)
    return name, email, company, country, phone, form, groups, src_name, med_name, campaign, need, spam


# Meta Conversions API: the booking page (technext.odoo.com) fires the browser Lead only after cookie consent, so the
# server sends the same Lead too (same event_id = Meta counts it once). Only requests that carry "_eid" (the booking
# page) are sent; hashed email/phone only with cookie consent, otherwise just the ad click id (fbc) + IP/UA.
# Off until META_CAPI_TOKEN (Events Manager > dataset > Settings > Conversions API > Generate access token) is set.
CAPI_PIXEL = os.environ.get("META_PIXEL_ID", "1959782781295555")
CAPI_TOKEN = os.environ.get("META_CAPI_TOKEN", "")


def capi_lead(p, email, phone, ip, ua):
    eid = clean(p.get("_eid", ""), 80)
    if not (CAPI_TOKEN and eid):
        return
    sha = lambda v: hashlib.sha256(v.strip().lower().encode()).hexdigest()
    user = {"client_ip_address": ip[:64], "client_user_agent": ua[:400]}
    fbc = clean(p.get("_fbc", ""), 300)
    if re.match(r"fb\.1\.\d+\.[\w-]+$", fbc):
        user["fbc"] = fbc
    if p.get("_consent") == "yes":
        if email:
            user["em"] = [sha(email)]
        digits = re.sub(r"\D", "", phone or "")
        if digits:
            user["ph"] = [sha("63" + digits[1:] if digits.startswith("0") else digits)]
        if re.match(r"fb\.1\.\d+\.\d+$", clean(p.get("_fbp", ""), 80)):
            user["fbp"] = p["_fbp"]
    event = {"event_name": "Lead", "event_time": int(time.time()), "event_id": eid, "action_source": "website",
             "event_source_url": clean(p.get("page", ""), 600), "user_data": user,
             "custom_data": {"content_name": clean(p.get("source", ""), 80)}}
    body = urllib.parse.urlencode({"data": json.dumps([event]), "access_token": CAPI_TOKEN}).encode()
    try:
        urllib.request.urlopen(f"https://graph.facebook.com/v21.0/{CAPI_PIXEL}/events", data=body, timeout=4).read()
    except Exception as e:                                 # measurement only: never blocks the lead
        print("capi failed:", repr(e)[:300])


# CAPTCHA (31 Oct 2026, owner): every site form asks for a typed code after it is filled in (site.js captchaStep).
# GET /api/lead?captcha=1 returns the code as a distorted SVG plus a signed token; nothing is stored, the token
# carries its expiry and an HMAC of the answer. Every lead must send a valid token + answer, except NO_CAPTCHA_FORMS:
# the discovery-call booking (tn-booking.js on technext.odoo.com), where Odoo's appointment app has filed it already.
# The technext.odoo.com copy of the site falls back to Odoo's own form when refused (odoo-bridge.js), until re-synced.
# 31 Oct later: a bot read the answer out of the first version (the letters were SVG <text>) and reused one solved
# token for a burst of leads. Now the letters are drawn as jittered strokes in a shuffled path (no text to read),
# a token works once, each sender IP may file LEAD_RATE leads per LEAD_WINDOW, and a post that names none of our
# forms ("Other form") is answered OK but never filed.
CAP_CHARS = "ACDEFHJKMNPRTUVWXY34679"     # no look-alikes (0/O, 1/I/L, 2/Z, 5/S, 8/B)
CAP_TTL = 600
NO_CAPTCHA_FORMS = ("Discovery call booking",)
LEAD_RATE, LEAD_WINDOW = 3, 600
USED_TOKENS = {}   # nonce -> expiry, this warm instance
RECENT = {}        # sender ip -> [lead times], this warm instance
# stroke font on a 10 x 14 grid (y down): each character is a list of polylines
GLYPHS = {
    "A": [[(0, 14), (5, 0), (10, 14)], [(2.5, 8), (7.5, 8)]],
    "C": [[(10, 2), (7, 0), (3, 0), (0, 4), (0, 10), (3, 14), (7, 14), (10, 12)]],
    "D": [[(0, 0), (0, 14), (6, 14), (10, 10), (10, 4), (6, 0), (0, 0)]],
    "E": [[(10, 0), (0, 0), (0, 14), (10, 14)], [(0, 7), (7, 7)]],
    "F": [[(10, 0), (0, 0), (0, 14)], [(0, 7), (7, 7)]],
    "H": [[(0, 0), (0, 14)], [(10, 0), (10, 14)], [(0, 7), (10, 7)]],
    "J": [[(10, 0), (10, 10), (7, 14), (3, 14), (0, 11)]],
    "K": [[(0, 0), (0, 14)], [(10, 0), (0, 8)], [(3, 6), (10, 14)]],
    "M": [[(0, 14), (0, 0), (5, 8), (10, 0), (10, 14)]],
    "N": [[(0, 14), (0, 0), (10, 14), (10, 0)]],
    "P": [[(0, 14), (0, 0), (7, 0), (10, 2), (10, 5), (7, 7), (0, 7)]],
    "R": [[(0, 14), (0, 0), (7, 0), (10, 2), (10, 5), (7, 7), (0, 7)], [(5, 7), (10, 14)]],
    "T": [[(0, 0), (10, 0)], [(5, 0), (5, 14)]],
    "U": [[(0, 0), (0, 10), (3, 14), (7, 14), (10, 10), (10, 0)]],
    "V": [[(0, 0), (5, 14), (10, 0)]],
    "W": [[(0, 0), (2.5, 14), (5, 5), (7.5, 14), (10, 0)]],
    "X": [[(0, 0), (10, 14)], [(10, 0), (0, 14)]],
    "Y": [[(0, 0), (5, 7), (10, 0)], [(5, 7), (5, 14)]],
    "3": [[(0, 1), (3, 0), (8, 0), (10, 2), (10, 5), (7, 7), (3, 7)], [(7, 7), (10, 9), (10, 12), (8, 14), (3, 14), (0, 13)]],
    "4": [[(7, 14), (7, 0), (0, 10), (10, 10)]],
    "6": [[(9, 1), (6, 0), (3, 0), (0, 4), (0, 11), (3, 14), (7, 14), (10, 11), (10, 9), (7, 7), (3, 7), (0, 9)]],
    "7": [[(0, 0), (10, 0), (4, 14)]],
    "9": [[(10, 5), (7, 7), (3, 7), (0, 5), (0, 3), (3, 0), (7, 0), (10, 3), (10, 10), (7, 14), (3, 14), (1, 13)]],
}


def _cap_mac(exp, nonce, answer):
    secret = (os.environ.get("CAPTCHA_SECRET") or KEY or "dev").encode()
    return hmac.new(secret, f"cap:{exp}:{nonce}:{answer.upper()}".encode(), hashlib.sha256).hexdigest()[:32]


def captcha():
    import math, secrets
    rnd = secrets.SystemRandom()
    answer = "".join(rnd.choice(CAP_CHARS) for _ in range(5))
    exp, nonce = int(time.time()) + CAP_TTL, secrets.token_hex(8)
    strokes = []
    for i, ch in enumerate(answer):                      # each letter: own size, slant, turn, jittered points
        s = rnd.uniform(2.3, 2.7)
        a, k = math.radians(rnd.uniform(-22, 22)), rnd.uniform(-0.25, 0.25)
        ox, oy = 14 + i * 36 + rnd.uniform(-3, 3), 14 + rnd.uniform(-5, 5)
        for line in GLYPHS[ch]:
            pts = []
            for x, y in line:
                x, y = (x - 5 + k * (y - 7)) * s, (y - 7) * s
                x, y = x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a)
                pts.append((ox + 12 + x + rnd.uniform(-1, 1), oy + 17 + y + rnd.uniform(-1, 1)))
            strokes.append(pts)
    for _ in range(4):                                   # short stray strokes in the same ink
        x, y = rnd.uniform(0, 190), rnd.choice([rnd.uniform(3, 9), rnd.uniform(55, 61)])
        strokes.append([(x, y), (x + rnd.uniform(-8, 8), y + rnd.uniform(-3, 3))])
    rnd.shuffle(strokes)                                 # drawing order says nothing about reading order
    d = " ".join("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) for pts in strokes)
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64" width="200" height="64" role="img" '
             'aria-label="Security code image"><rect width="200" height="64" rx="10" fill="#eef3fb"/>']
    for _ in range(6):                                   # light noise curves
        parts.append(f'<path d="M0 {rnd.randint(6, 58)} Q100 {rnd.randint(0, 64)} 200 {rnd.randint(6, 58)}" '
                     f'stroke="#{rnd.choice(["9db4dc", "b9c8e4", "7f9bcf"])}" stroke-width="{rnd.choice([1, 1.5, 2])}" fill="none"/>')
    parts.append(f'<path d="{d}" stroke="#1d4f9e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>')
    for _ in range(40):                                  # speckles
        parts.append(f'<circle cx="{rnd.randint(0, 200)}" cy="{rnd.randint(0, 64)}" r="{rnd.choice([.8, 1, 1.3])}" fill="#5a7fc0" opacity=".5"/>')
    parts.append("</svg>")
    return {"ok": True, "svg": "".join(parts), "token": f"{exp}.{nonce}.{_cap_mac(exp, nonce, answer)}"}


def captcha_ok(token, answer):
    try:
        exp, nonce, mac = str(token).split(".")
        if int(exp) < time.time() or nonce in USED_TOKENS:
            return False
    except ValueError:
        return False
    answer = re.sub(r"\s+", "", str(answer or ""))[:12]
    if not (answer and hmac.compare_digest(mac, _cap_mac(exp, nonce, answer))):
        return False
    now = time.time()
    for n in [n for n, e in USED_TOKENS.items() if e < now]:
        del USED_TOKENS[n]
    USED_TOKENS[nonce] = int(exp)
    return True


def rate_ok(ip):
    now = time.time()
    hits = [t for t in RECENT.get(ip, []) if t > now - LEAD_WINDOW]
    if len(hits) >= LEAD_RATE:
        RECENT[ip] = hits
        return False
    RECENT[ip] = hits + [now]
    if len(RECENT) > 5000:
        RECENT.clear()
    return True


def sign(lead):
    """Proof that this server filed the lead, so only the visitor's own follow-up request can add the note."""
    return hmac.new(KEY.encode(), f"lead:{lead}".encode(), hashlib.sha256).hexdigest()[:32]


def make_lead(p):
    name, email, company, country, phone, form, groups, src_name, med_name, campaign, need, spam = parse(p)
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
        "description": as_html(groups),                    # html field, shown as Internal Notes
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
    info = (form, groups, spam)
    if form == "Discovery call booking" and email:
        # Odoo's appointment app files the booking itself: enrich that opportunity instead of adding a second lead
        def after():
            found = booking_lead(email)
            if found:
                upd = {k: v for k, v in vals.items()
                       if k in ("partner_name", "tag_ids", "source_id", "medium_id", "campaign_id", "country_id", "team_id") and v}
                rpc("crm.lead", "write", ids=[found], vals=upd)
                rpc("crm.lead", "message_post", ids=[found], body_is_html=True, message_type="comment",
                    subtype_xmlid="mail.mt_note", body="<p><b>Booking form details</b></p>" + as_html(groups))
                lead = found
            else:                                          # not visible to the API user: file it as a lead of its own
                lead = rpc("crm.lead", "create", vals_list=[vals], context=QUIET)[0]
            keep_typed(lead, name, phone)
            follow_up(lead, *info)
        return None, after
    lead = rpc("crm.lead", "create", vals_list=[vals], context=QUIET)[0]

    def after():
        keep_typed(lead, name, phone)
        follow_up(lead, *info)
    return lead, after


def follow_up(lead, form, groups, spam):
    """The @Jeric note + emails (and a salesperson, if set). Runs after the visitor has their answer."""
    people, copies = partners(NOTIFY_EMAILS), partners(COPY_EMAILS)
    if people or copies:                                   # @mention Jeric; Jeric + copies get the summary by email
        at = " ".join(f'<a href="/odoo/res.partner/{p["id"]}" class="o_mail_redirect" data-oe-id="{p["id"]}" '
                      f'data-oe-model="res.partner">@{html.escape(p["name"])}</a> ({html.escape(p["email"])})'
                      for p in people)
        flag = [("Check first", [("Possible spam", spam)])] if spam else []
        body = (f"<p>{at} New lead from the <b>{html.escape(form)}</b>. Please follow up.</p>"
                + as_html(flag + [g for g in groups if g[0] != "Full links"]))      # full links stay in the notes
        rpc("crm.lead", "message_post", ids=[lead], partner_ids=list({p["id"] for p in people + copies}),
            message_type="comment", subtype_xmlid="mail.mt_comment", body_is_html=True,
            context={"mail_notify_author": True,          # the copy goes to Rico, who is also the API user
                     "mail_notify_force_send": False},  # emails go to the mail queue (~10 s saved, timed 28 Oct)
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
        if getattr(self, "_timing", False):              # where the time went (diagnostics; no lead data in it)
            obj = dict(obj, t={"cold": self._cold, "total_ms": round((time.monotonic() - self._t0) * 1000),
                               "calls": list(TIMES)})
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
        global WARM
        self._t0, self._cold, WARM = time.monotonic(), not WARM, True
        TIMES.clear()
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
        self._timing = bool(p.get("_timing"))
        if p.get("_honey"):
            return self._send(200, {"ok": True})            # bots get the normal answer, nothing is filed
        if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+$", str(p.get("email", ""))) and not str(p.get("phone", "")).strip():
            return self._send(400, {"ok": False, "error": "contact"})
        tag = form_tag(str(p.get("source", "")), str(p.get("page", "")))
        ip = (self.headers.get("X-Forwarded-For") or self.client_address[0] or "").split(",")[0].strip()
        if not p.get("_followup"):
            if tag == "Other form":                        # none of our forms sent it: a script; nothing is filed
                print("dropped unknown form from", ip[:64], sorted(p)[:12])
                return self._send(200, {"ok": True})
            why = bot_lead(p)
            if why:                                        # the bot gets the normal answer, nothing is filed
                print("dropped bot lead:", why, ip[:64])
                return self._send(200, {"ok": True})
            booking = tag in NO_CAPTCHA_FORMS and self.headers.get("Origin", "") in CORS_ORIGINS
            if not booking and not captcha_ok(p.get("_cap", ""), p.get("_cap_a", "")):
                return self._send(400, {"ok": False, "error": "captcha"})
            if not rate_ok(ip):
                print("rate limited", ip[:64])
                return self._send(429, {"ok": False, "error": "rate"})
        if not KEY:
            return self._send(503, {"ok": False, "error": "not configured"})
        if p.get("_followup"):                             # step 2 of a split submit: the @Jeric note, emails, typed name
            try:
                lead = int(p["_followup"])
            except (TypeError, ValueError):
                return self._send(400, {"ok": False, "error": "lead"})
            if not hmac.compare_digest(str(p.get("_sig", "")), sign(lead)):
                return self._send(403, {"ok": False, "error": "sig"})
            name, _, _, _, phone, form, groups, _, _, _, _, spam = parse(p)
            try:
                keep_typed(lead, name, phone)
                follow_up(lead, form, groups, spam)
            except Exception as e:
                print("odoo follow-up failed:", repr(e)[:500])
                return self._send(502, {"ok": False, "error": "crm"})
            return self._send(200, {"ok": True})
        try:
            lead, after = make_lead(p)
        except Exception as e:                             # the visitor is shown sales@technext.asia to email instead
            print("odoo lead failed:", repr(e)[:500])
            return self._send(502, {"ok": False, "error": "crm"})
        if lead and p.get("_split"):
            # Vercel only sends the reply once this function returns, so the note and emails (several seconds)
            # would keep the visitor on "Sending...". site.js sends them as a second request instead.
            return self._send(200, {"ok": True, "lead": lead, "f": sign(lead)})
        self._send(200, {"ok": True, "lead": lead})        # the lead is saved: thank the visitor now
        ip = (self.headers.get("X-Forwarded-For") or self.client_address[0] or "").split(",")[0].strip()
        capi_lead(p, clean(p.get("email", ""), 200), clean(p.get("phone", ""), 60), ip, self.headers.get("User-Agent", ""))
        try:
            after()
        except Exception as e:                             # the lead exists; only the note / emails are missing
            print("odoo follow-up failed:", repr(e)[:500])

    def do_GET(self):
        if "captcha=" in urllib.parse.urlsplit(self.path).query:
            return self._send(200, captcha())
        self._send(405, {"ok": False})
