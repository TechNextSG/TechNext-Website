"""Local test for api/lead.py's required "Company website" (24 Nov 2026). Odoo is stubbed: nothing is sent anywhere.

    python _src/test_lead_website.py
"""
import importlib.util
import io
import json
import os
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
os.environ.setdefault("ODOO_API_KEY", "test-key-not-real")
os.environ.pop("META_CAPI_TOKEN", None)
os.environ.pop("TURNSTILE_SECRET_KEY", None)
spec = importlib.util.spec_from_file_location("lead", ROOT / "api" / "lead.py")
lead = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lead)
sys.path.insert(0, str(ROOT / "_src"))
import sitedata  # noqa: E402

CALLS = []


def fake_rpc(model, method, **kw):
    CALLS.append((model, method, kw))
    if method == "search":
        return [7]
    if method == "create":
        return [4242]
    if method == "read":
        return [{}]
    if method == "search_count":
        return 1
    if method == "search_read":
        return [{"id": 43, "name": "TechNext", "email": "hello@technext.asia"}] if model == "res.partner" else []
    return True


lead.rpc = fake_rpc
REAL_BOOKING_EVENT = lead.booking_event
lead.time.sleep = lambda s: None

BASE = {"name": "Maria Santos", "company": "Santos Trading Corp", "email": "maria@santostrading.ph",
        "phone": "0917 123 4567", "source": "BIR CAS for accountants (lander)", "page": "https://technext.asia/bir-call"}


def creates():
    return [kw["vals_list"][0] for m, meth, kw in CALLS if m == "crm.lead" and meth == "create"]


class WebsiteRule(unittest.TestCase):
    GOOD = ["abc.com", "www.abc.com.ph", "https://abc.com", "http://abc.com/about-us", "abc.co", "sub.domain.org/x?y=1"]
    BAD = ["abc", "abc com", "abc .com", ".com", "abc.", "www", "my company.com", "a..b"]

    def test_server_rule(self):
        for v in self.GOOD:
            self.assertTrue(lead.website_ok(v), v)
        for v in self.BAD:
            self.assertFalse(lead.website_ok(v), v)
        self.assertFalse(lead.website_ok(""))                      # required (owner, 24 Nov 2026)

    def test_same_rule_as_the_forms(self):
        """The forms' pattern attribute (anchored like the browser does) agrees with the server on the trimmed value."""
        rx = re.compile("^(?:" + sitedata.WEBSITE_PATTERN + ")$")
        for v in self.GOOD + self.BAD:
            self.assertEqual(bool(rx.match(v)), lead.website_ok(v), v)
        self.assertIn("required", Path(ROOT / "get-started.html").read_text(encoding="utf-8").split('id="gs-website"')[1][:200])
        self.assertTrue(rx.match("  abc.com  "))                   # the browser allows spaces around; site.js trims

    def test_normalise_trims(self):
        self.assertEqual(lead.website_of({"website": "  abc.com \n"}), "abc.com")
        self.assertEqual(lead.website_of({}), "")
        self.assertEqual(lead.website_of({"website": None}), "")


class LeadVals(unittest.TestCase):
    def setUp(self):
        CALLS.clear()
        lead._IDS.clear()
        lead.booking_event = REAL_BOOKING_EVENT

    def test_create_has_website_field_and_line(self):
        l, after = lead.make_lead(dict(BASE, website="  santostrading.ph "))
        self.assertEqual(l, 4242)
        vals = creates()[0]
        self.assertEqual(vals["website"], "santostrading.ph")
        self.assertIn("<li><b>Company name:</b> Santos Trading Corp</li><li><b>Website:</b> santostrading.ph</li>",
                      vals["description"])
        # contact group, not "What they need"
        contact = vals["description"].split("<p><b>What they need")[0]
        self.assertIn("Website:", contact)
        self.assertEqual(vals["description"].count("<b>Website:</b>"), 1)
        # the hello@ note (follow-up) shows it too
        after()
        notes = [kw["body"] for m, meth, kw in CALLS if meth == "message_post"]
        self.assertTrue(notes and "<b>Website:</b> santostrading.ph" in notes[0])

    def test_no_website_booking_backup_still_filed(self):
        """The booking backup lead stays lenient: no website -> still filed, no website field, no line."""
        lead.booking_event = lambda *a, **k: False
        _, after = lead.make_lead(dict(BASE, source="Discovery call booking"))
        after()
        vals = creates()[0]
        self.assertNotIn("website", vals)
        self.assertNotIn("Website:", vals["description"])

    def test_every_form_kind(self):
        for source in ("Let's Talk panel · /", "Audit guide download", "Meeting request", "BIR adviser call"):
            CALLS.clear()
            lead.make_lead(dict(BASE, source=source, website="abc.com"))
            self.assertEqual(creates()[0]["website"], "abc.com", source)

    def test_booking_backup_lead(self):
        """tn-booking.js sends website like company. No calendar event -> backup lead carries it; an odd value is
        kept in the notes only."""
        p = dict(BASE, source="Discovery call booking", website="santostrading.ph")
        l, after = lead.make_lead(p)
        self.assertIsNone(l)
        lead.booking_event = lambda *a, **k: False
        after()
        vals = creates()[0]
        self.assertEqual(vals["website"], "santostrading.ph")
        self.assertIn("<b>Website:</b> santostrading.ph", vals["description"])
        self.assertIn("Booking not confirmed", json.dumps([c for c in CALLS if c[0] == "crm.tag"]))
        CALLS.clear()
        _, after = lead.make_lead(dict(p, website="santos trading"))
        after()
        vals = creates()[0]
        self.assertNotIn("website", vals)
        self.assertIn("<b>Website:</b> santos trading", vals["description"])

    def test_booking_merge_fills_opportunity(self):
        """Odoo filed the booking: its opportunity gets the website (when empty) and the "Booking form details" note."""
        lead.booking_event = lambda *a, **k: 99
        real = lead.rpc

        def rpc(model, method, **kw):
            if model == "calendar.event" and method == "read":
                CALLS.append((model, method, kw))
                return [{"opportunity_id": [555, "Opp"]}]
            if model == "crm.lead" and method == "read":
                CALLS.append((model, method, kw))
                return [{"partner_name": "Santos Trading Corp", "website": False}]
            return real(model, method, **kw)
        lead.rpc = rpc
        try:
            _, after = lead.make_lead(dict(BASE, source="Discovery call booking", website="santostrading.ph"))
            after()
        finally:
            lead.rpc = real
        writes = [kw for m, meth, kw in CALLS if m == "crm.lead" and meth == "write"]
        self.assertEqual(writes[0]["ids"], [555])
        self.assertEqual(writes[0]["vals"].get("website"), "santostrading.ph")
        self.assertNotIn("partner_name", writes[0]["vals"])          # Odoo had it already
        note = [kw["body"] for m, meth, kw in CALLS if meth == "message_post"][0]
        self.assertIn("Booking form details", note)
        self.assertIn("<b>Website:</b> santostrading.ph", note)


class Handler(unittest.TestCase):
    """do_POST through a fake request: a bad website on a site form is refused before Odoo is called."""

    def post(self, p, origin="https://technext.asia"):
        body = json.dumps(p).encode()
        h = lead.handler.__new__(lead.handler)
        h.headers = {"Origin": origin, "Content-Length": str(len(body)), "X-Forwarded-For": "203.0.113.9"}
        h.rfile, h.wfile = io.BytesIO(body), io.BytesIO()
        h.client_address = ("203.0.113.9", 0)
        out = {}
        h.send_response = lambda code: out.setdefault("code", code)
        h.send_header = lambda *a: None
        h.end_headers = lambda: None
        h.do_POST()
        return out["code"], json.loads(h.wfile.getvalue().decode())

    def setUp(self):
        CALLS.clear()
        lead.RECENT.clear()
        lead.booking_event = lambda *a, **k: False

    def test_bad_website_refused(self):
        code, j = self.post(dict(BASE, website="my company"))
        self.assertEqual((code, j.get("error"), j.get("field")), (400, "website", "website"))
        self.assertEqual(CALLS, [])

    def test_booking_never_refused_over_website(self):
        code, j = self.post(dict(BASE, source="Discovery call booking", website="my company"),
                            origin="https://technext.odoo.com")
        self.assertNotEqual(j.get("error"), "website")

    def test_existing_rules_unchanged(self):
        code, j = self.post(dict(BASE, company="", website="abc.com"))
        self.assertEqual(j.get("error"), "company")
        code, j = self.post(dict(BASE, phone="12", website="abc.com"))
        self.assertEqual((j.get("error"), j.get("field")), ("contact", "phone"))

    def test_missing_website_refused(self):
        for p in (dict(BASE), dict(BASE, website=""), dict(BASE, website="   ")):
            code, j = self.post(p)
            self.assertEqual((code, j.get("error"), j.get("field")), (400, "website", "website"))
        self.assertEqual(CALLS, [])

    def test_booking_without_website_not_refused(self):
        code, j = self.post(dict(BASE, source="Discovery call booking"), origin="https://technext.odoo.com")
        self.assertNotEqual(j.get("error"), "website")
        self.assertEqual(code, 200)

    def test_good_website_passes_the_check(self):
        for w in ("abc.com", "  www.abc.com.ph  ", "https://abc.com/about"):
            lead.RECENT.clear()
            code, j = self.post(dict(BASE, website=w))
            self.assertNotEqual(j.get("error"), "website", w)    # goes on to the security check (no ticket here)


if __name__ == "__main__":
    unittest.main(verbosity=2)
