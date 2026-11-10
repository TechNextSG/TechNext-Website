# -*- coding: utf-8 -*-
"""/bir-adviser-call (owner 22 Oct 2026): "more lean on BIR, title should be a question hook to viewer, the content
will change base on clients needs". 3 Nov 2026, owner: "more focus on bir cas" - CAS / CBA is the default need (first).

NEEDS: one entry per client need, in picker order. The first is the default (what crawlers and visitors without ?need=
see). Picking a need (or arriving with ?need=<key> from an ad) swaps the H1 question, the answer line, the lead, the
Today / In Odoo pair and the live sample Odoo panel, and sets "Biggest BIR headache" in the form. Fields:
  key      URL value (?need=key) and data-need value
  chip     picker label
  option   the form's "Biggest BIR headache" option (must match an <option> exactly)
  h1       the question hook (plain text, no markup)
  answer   the short answer under it (the <em> line)
  lead     two sentences on what we do for this need (OFFER, a short adviser-call line, is added after it)
  today    the pain, one sentence
  odoo     the same thing in Odoo, one sentence
  panel    a PANEL-shaped dict for industry_fx.panel_markup(): sample data, labelled "Sample data" on screen
Facts follow the BIR CAS page (bir-cas.html) and its sources (RMO 9-2021, RMC 5-2021). 3 Nov 2026, owner: CAS is the
priority, no e-invoicing - the "Am I covered?" and "E-invoicing" needs were removed (old ?need= links fall back to cas).
Never "BIR-accredited", "compliant" or "certified" for software; no prices; Odoo is never free.
"""

# 28 Oct 2026, owner: no more free website offer.
OFFER = "Keep your current system: we plug Odoo in beside it, with a written quote first. The adviser meeting has no charge."

NEEDS = [
    dict(key="cas", chip="CAS / CBA", option="CAS / CBA registration",
         h1="Start your BIR CAS requirements today.",
         answer="Keep your system. Odoo plugs in, and your CAS papers print from it.",
         lead="A computerized accounting system (CAS) or computerized books of accounts (CBA) needs its own BIR registration, with a system description, sample books and sample outputs. We set Odoo up with you first, so every paper comes from the system you will actually use, and go through the details with your accountant. You register your CAS at your RDO.",
         today="A system description and sample outputs to prepare, from a system that was never set up for them.",
         odoo="The process flow, sample invoices and Books of Accounts print from your configured Odoo.",
         panel=dict(app="documents", title="CAS / CBA application pack", sub="Prepared from your configured Odoo", steps=["Odoo set up", "Samples printed", "Checked with accountant", "You file at your RDO"],
                    kpis=[("Sample outputs", 12, "", "", 0), ("Books of Accounts", 6, "", "", 0), ("Process flows", 5, "", "", 0)],
                    mid=("table", ["Document", "Source", "Status"], [
                        ("Process flow", "Your Odoo set-up", ("Drafting", "Done", "warn")),
                        ("Sample invoices", "Printed from Odoo", ("Drafting", "Done", "warn")),
                        ("Books of Accounts", "Journals and ledger", ("Drafting", "Done", "warn"))]),
                    post=dict(app="accountant", title="Cash receipts book", ref="Sample output · October 2026", rows=[("Dr", "Cash in bank", "56,000.00"), ("Cr", "Receivable", "56,000.00")]),
                    chips=["Process flow", "Sample outputs", "Books of Accounts"])),
    dict(key="2307", chip="2307s", option="2307s and withholding",
         h1="Stop typing 2307 certificates every quarter.",
         answer="Odoo makes them from the bills you already post.",
         lead="Odoo's Philippine localisation generates BIR 2306 and 2307 certificates from the vendor bills you post with withholding tax. We set up your ATC codes and withholding taxes, so the QAP comes from the same entries.",
         today="Certificates are re-typed every quarter and chased one supplier at a time.",
         odoo="Each bill carries its ATC code, and the 2307 comes from it, per payee.",
         panel=dict(app="accountant", title="Vendor bill", sub="BILL/2026/0318 · Reyes Steelworks Inc.", steps=["Draft", "Posted", "Paid", "2307 issued"],
                    kpis=[("Bill amount", 480000, "₱", "", 0), ("Expanded withholding", 9600, "₱", "", 0), ("Payees this quarter", 38, "", "", 0)],
                    mid=("table", ["Step", "Detail", "Status"], [
                        ("Withholding", "WC120 · 2% · ₱9,600.00", ("Computed", None, "ok")),
                        ("2307 certificate", "Q4 2026 · per payee", ("Draft", "Generated", "warn")),
                        ("Sent to the payee", "By email from Odoo", ("Pending", "Sent", "info"))]),
                    post=dict(app="accountant", title="Journal entry", ref="BILL/2026/0318", rows=[("Dr", "Project cost", "480,000.00"), ("Cr", "Withholding tax payable", "9,600.00"), ("Cr", "Payables", "470,400.00")]),
                    chips=["ATC per line", "2307 per payee", "Feeds the QAP"])),
    dict(key="reports", chip="SLSP · SAWT · QAP", option="SLSP, SAWT, QAP at quarter-end",
         h1="Do your SLSP, SAWT and QAP still start in a spreadsheet?",
         answer="In Odoo they come straight from your books.",
         lead="Odoo builds the SLSP, SAWT and QAP from the entries you already post, with DAT exports for the BIR's tools and the 2550Q VAT summary. They are built from the same entries as your ledger, so you reconcile once instead of rebuilding them each quarter.",
         today="The lists are rebuilt from exports the week they are due, then checked again when the totals don't agree.",
         odoo="The lists come from the same entries as your books, with the DAT files exported for your accountant's review.",
         panel=dict(app="accountant", title="BIR reports", sub="Q3 2026 · Sample Trading Corp.", steps=["Entries posted", "Totals checked", "DAT exported", "Accountant's review"],
                    kpis=[("Customers in the SLSP", 1284, "", "", 0), ("Payees in the QAP", 57, "", "", 0), ("Withholding agents in the SAWT", 38, "", "", 0)],
                    mid=("table", ["Report", "Lines", "File"], [
                        ("SLSP · Sales", "1,284", ("Building", "DAT exported", "warn")),
                        ("SLSP · Purchases", "642", ("Building", "DAT exported", "warn")),
                        ("SAWT and QAP", "38 · 57", ("Building", "DAT exported", "warn"))]),
                    post=dict(app="accountant", title="2550Q VAT summary", ref="Q3 2026 · from the same entries", bal="Built from your books",
                              rows=[("+", "Output VAT", "912,480.00"), ("−", "Input VAT", "604,320.00"), ("=", "VAT payable", "308,160.00")]),
                    chips=["SLSP, SAWT, QAP as DAT", "2550Q summary", "Built from your books"])),
    dict(key="branches", chip="Branches", option="Branches invoicing differently",
         h1="Does every branch invoice its own way?",
         answer="One Odoo, one invoice flow for every branch.",
         lead="Every branch has its own BIR branch code. In one Odoo database each branch keeps its own invoice series, and head office sees every branch in one set of books.",
         today="Each outlet has its own series, layout or spreadsheet, and head office merges them.",
         odoo="Every branch uses the same invoice flow with its own series, in one set of books.",
         panel=dict(app="account", title="Invoices by branch", sub="One database · head office and two branches", steps=["Head office", "Cebu", "Davao", "Consolidated"],
                    kpis=[("Branches", 3, "", "", 0), ("Invoices this month", 806, "", "", 0), ("Invoice layouts", 1, "", "", 0)],
                    mid=("table", ["Branch", "Series", "Invoices"], [
                        ("Head office · 00000", "INV/HO/", "412"),
                        ("Cebu · 00001", "INV/CEB/", "236"),
                        ("Davao · 00002", "INV/DVO/", "158")]),
                    post=dict(app="accountant", title="Sales by branch", ref="October 2026 · one set of books", bal="One ledger",
                              rows=[("·", "Sales, head office", "4,120,000.00"), ("·", "Sales, Cebu", "2,360,000.00"), ("·", "Sales, Davao", "1,580,000.00")]),
                    chips=["Series per branch", "Same invoice flow", "Head office sees all"])),
    dict(key="audit", chip="Audit / LOA", option="Audit or LOA preparation",
         h1="Could you answer a Letter of Authority this week?",
         answer="In Odoo, the documents stay with the record.",
         lead="When a Letter of Authority arrives, the work is finding the documents. In Odoo every posted entry keeps its history and attachments, and the Books of Accounts print from the same data.",
         today="Days of digging through folders, inboxes and old files.",
         odoo="Posted entries keep their history and attachments, and the journals print as Books of Accounts.",
         panel=dict(app="accountant", title="Customer invoice", sub="INV/2026/0412 · posted 14 Oct 2026", steps=["Created", "Posted", "Paid", "Period locked"],
                    kpis=[("Attachments", 3, "", "", 0), ("Changes logged", 5, "", "", 0), ("Linked records", 4, "", "", 0)],
                    mid=("table", ["Document", "Type", "Kept"], [
                        ("Invoice INV/2026/0412", "PDF", ("Attached", None, "ok")),
                        ("Delivery receipt DR-0291", "PDF", ("Attached", None, "ok")),
                        ("Customer PO-0188", "PDF", ("Attached", None, "ok"))]),
                    post=dict(app="accountant", title="History", ref="Kept on the record", bal="History kept",
                              rows=[("·", "Created by Accounting", "12 Oct"), ("·", "Posted", "14 Oct"), ("·", "Payment matched", "20 Oct")]),
                    chips=["History on every entry", "Attachments kept", "Books print from Odoo"])),
]


# ---------------------------------------------------------------------------------------------- rendering (build.py -> tokens())
# The page template (_src/pages/bir-adviser-call.html) carries {{FW_NEEDS_*}} tokens; build.py hands the content to tokens().
# The static HTML is rendered for NEEDS[0] (what crawlers and no-JS visitors see); assets/js/pages/fw-needs.js swaps the rest.
import html as _html
import json as _json
import re as _re

import industry_fx as _IFX


def _e(s: str) -> str:
    return _html.escape(s, quote=True)


def chips_html() -> str:
    """The picker's radio chips (inside .fx-chips): the default need is checked."""
    return "".join(
        f'<label><input type="radio" name="fw-need" value="{_e(n["key"])}"{" checked" if i == 0 else ""}><span>{_e(n["chip"])}</span></label>'
        for i, n in enumerate(NEEDS))


def panes_html() -> str:
    """One live sample Odoo panel per need; only the default is shown (the others carry hidden)."""
    return "\n".join(
        f'      <div class="fw-pane" id="fw-p-{_e(n["key"])}" data-need="{_e(n["key"])}"{"" if i == 0 else " hidden"}>\n{_IFX.panel_markup(n["panel"])}\n      </div>'
        for i, n in enumerate(NEEDS))


def options_html() -> str:
    """The form's "Biggest BIR headache" options, in NEEDS order; the default need is selected."""
    return '<option value="">Choose one</option>' + "".join(
        f'<option{" selected" if i == 0 else ""}>{_e(n["option"])}</option>' for i, n in enumerate(NEEDS))


def data_json() -> str:
    """The data block fw-needs.js reads (an array, so picker order survives integer-like keys such as 2307)."""
    arr = [{k: n[k] for k in ("key", "chip", "option", "h1", "answer", "lead", "today", "odoo")} for n in NEEDS]
    s = _json.dumps(arr, ensure_ascii=False, separators=(",", ":"))
    s = s.replace("</", "<\\/").replace("<!--", "<\\u0021--")   # both are valid JSON escapes, so the block can never close its own <script>
    return f'<script type="application/json" id="fw-needs-data">{s}</script>'


_TOKENS = {
    "H1": lambda: _e(NEEDS[0]["h1"]),
    "ANSWER": lambda: _e(NEEDS[0]["answer"]),
    "LEAD": lambda: _e(NEEDS[0]["lead"]),
    "OFFER": lambda: _e(OFFER),
    "TODAY": lambda: _e(NEEDS[0]["today"]),
    "ODOO": lambda: _e(NEEDS[0]["odoo"]),
    "CHIP": lambda: _e(NEEDS[0]["chip"]),
    "KEY": lambda: _e(NEEDS[0]["key"]),
    "CHIPS": chips_html,
    "PANES": panes_html,
    "OPTIONS": options_html,
    "DATA": data_json,
}
_TOKEN_RE = _re.compile(r"\{\{FW_NEEDS_([A-Z0-9]+)\}\}")


def tokens(content: str) -> str:
    """Replace every {{FW_NEEDS_<NAME>}} in a page's content. An unknown name fails the build instead of shipping a raw token."""
    return _TOKEN_RE.sub(lambda m: _TOKENS[m.group(1)](), content)
