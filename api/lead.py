"""Vercel function: every form on technext.asia becomes a lead in the Odoo CRM (technext.odoo.com).

POST /api/lead with the form's fields as JSON (site.js tnPostForm; the only place a form goes).
The lead is tagged "Website" plus the form it came from, gets source "Website" ("Paid Ads" when the visit
came from an ad click) / medium "Website", department (sales team) "Marketing Dept", salesperson Jeric
(ODOO_SALESPERSON), and every lead @mentions jeric@technext.asia (ODOO_NOTIFY_EMAILS), so Odoo emails him. The Odoo API key lives only in the Vercel env var ODOO_API_KEY, never in this public repo.
"""
import html
import json
import os
import re
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler

ODOO = os.environ.get("ODOO_URL", "https://technext.odoo.com").rstrip("/")
KEY = os.environ.get("ODOO_API_KEY", "")
NOTIFY_EMAILS = [x.strip() for x in os.environ.get("ODOO_NOTIFY_EMAILS", "jeric@technext.asia").split(",") if x.strip()]
ORIGINS = ("https://technext.asia", "https://www.technext.asia")
SALESPERSON = os.environ.get("ODOO_SALESPERSON", "jeric@technext.asia")  # login of the user every lead goes to
DEPARTMENT = "Marketing Dept"          # website + social leads; direct / referral / messaging go to "Sales Dept"
MEDIUM_NAME = "Website"
# an ad click leaves one of these in the landing URL -> source "Paid Ads", otherwise "Website"
AD_CLICK = re.compile(r"[?&](gclid|gbraid|wbraid|utm_medium=(cpc|ppc|paid[a-z_]*|ads?))(=|&|$)", re.I)

# form "source" field -> short tag name
FORMS = [
    ("quotation", "Quotation builder"),
    ("get started", "Free website offer (/get-started)"),
    ("free website", "Free website offer (/free-website-with-odoo)"),
    ("contact", "Contact page"),
    ("let's talk", "Let's Talk panel"),
]
LABELS = {"name": "Name", "company": "Company", "email": "Email", "phone": "Phone", "topic": "Interested in",
          "message": "Message", "team_size": "Team size", "country": "Country", "current_website": "Current website",
          "scope_summary": "Quotation scope", "apps": "Odoo apps", "users": "Users", "hosting": "Hosting",
          "services": "Services", "timeline": "Timeline", "source": "Form", "page": "Page",
          "referrer": "Came from", "landing": "First page of the visit"}
SKIP = {"_subject", "_template", "_captcha", "_honey", "_next", "_cc", "_autoresponse"}


def rpc(model, method, **kw):
    req = urllib.request.Request(f"{ODOO}/json/2/{model}/{method}", data=json.dumps(kw).encode(),
                                 headers={"Authorization": f"bearer {KEY}", "Content-Type": "application/json",
                                          "User-Agent": "technext-website-forms/1.0"})
    for wait in (1.5, 3, 0):                              # odoo.com answers bursts with 429: back off and retry
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                return json.loads(r.read() or b"null")
        except urllib.error.HTTPError as e:
            if e.code != 429 or not wait:
                raise
            time.sleep(wait)


_IDS = {}  # tag / utm ids, kept while the function instance stays warm


def find_or_create(model, name):
    if (model, name) not in _IDS:
        ids = rpc(model, "search", domain=[["name", "=", name]], limit=1)
        _IDS[model, name] = ids[0] if ids else rpc(model, "create", vals_list=[{"name": name}])[0]
    return _IDS[model, name]


def notify_partners():
    """Odoo partners for NOTIFY_EMAILS (Jeric), looked up once per warm instance."""
    if "notify" not in _IDS:
        _IDS["notify"] = [p for e in NOTIFY_EMAILS for p in rpc(
            "res.partner", "search_read", domain=[["email", "=ilike", e]], fields=["name", "email"], limit=1)]
    return _IDS["notify"]


def lookup(model, domain):
    """First matching id or False; a miss is not cached, so a team created later is picked up."""
    key = (model, json.dumps(domain))
    if key not in _IDS:
        ids = rpc(model, "search", domain=domain, limit=1)
        if not ids:
            return False
        _IDS[key] = ids[0]
    return _IDS[key]


def clean(v, n=2000):
    return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", str(v)).strip()[:n]


def form_tag(source):
    s = (source or "").lower()
    return next((tag for key, tag in FORMS if key in s), "Other form")


def make_lead(p):
    name, email, phone, company = (clean(p.get(k, ""), 200) for k in ("name", "email", "phone", "company"))
    form = form_tag(p.get("source"))
    what = clean(p.get("topic") or form, 80)
    lines = [f"{LABELS.get(k, k.replace('_', ' ').capitalize())}: {clean(v)}"
             for k, v in p.items() if k not in SKIP and str(v).strip()]
    lines = [part for line in lines for part in line.split("\n") if part.strip()]
    # one at a time: parallel calls trip odoo.com's rate limit (429)
    tag_web, tag_form = find_or_create("crm.tag", "Website"), find_or_create("crm.tag", "Web form: " + form)
    paid = any(AD_CLICK.search(str(p.get(k, ""))) for k in ("landing", "page"))
    source = find_or_create("utm.source", "Paid Ads" if paid else "Website")
    medium = find_or_create("utm.medium", MEDIUM_NAME)
    team = lookup("crm.team", [["name", "=", DEPARTMENT]])
    vals = {
        "type": "lead",
        "user_id": False,                                  # Jeric is set last (see below)
        "team_id": team,
        "name": f"Website: {what} - {company or name or email}"[:200],
        "contact_name": name, "partner_name": company, "email_from": email, "phone": phone,
        "description": "".join(f"<p>{html.escape(line)}</p>" for line in lines),  # html field: one line per field
        "tag_ids": [[6, 0, [tag_web, tag_form]]],
        "source_id": source,
        "medium_id": medium,
    }
    lead = rpc("crm.lead", "create", vals_list=[vals])[0]
    people = notify_partners()
    if people:                                             # a real @mention in the chatter + an email to each
        at = " ".join(f'<a href="/odoo/res.partner/{p["id"]}" class="o_mail_redirect" data-oe-id="{p["id"]}" '
                      f'data-oe-model="res.partner">@{html.escape(p["name"])}</a> ({html.escape(p["email"])})'
                      for p in people)
        who = html.escape(f"{company or name} ({email or phone})")
        rpc("crm.lead", "message_post", ids=[lead], partner_ids=[p["id"] for p in people], message_type="comment",
            subtype_xmlid="mail.mt_comment", body_is_html=True,
            body=f"<p>{at} New website lead from the {html.escape(form)}: {who}. Please follow up.</p>")
    # salesperson last: the API user may only see its own / unassigned leads, so it hands the lead over at the end
    try:
        user = lookup("res.users", [["login", "=ilike", SALESPERSON]])
        if user:
            rpc("crm.lead", "write", ids=[lead], vals={"user_id": user})
    except Exception as e:                                 # the lead is filed and Jeric notified either way
        print("salesperson not set:", repr(e)[:300])
    return lead


class handler(BaseHTTPRequestHandler):
    def _send(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.headers.get("Origin", "") not in ORIGINS:
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
            return self._send(200, {"ok": True, "lead": make_lead(p)})
        except Exception as e:                             # the visitor is shown sales@technext.asia to email instead
            print("odoo lead failed:", repr(e)[:500])
            return self._send(502, {"ok": False, "error": "crm"})

    def do_GET(self):
        self._send(405, {"ok": False})
