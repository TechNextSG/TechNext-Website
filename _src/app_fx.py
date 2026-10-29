# -*- coding: utf-8 -*-
"""Odoo app pages, futuristic glass layer (22 Oct 2026). Replaces app_worlds.py (the cartoon "counting house / port /
showroom" world heroes of Accounting, Inventory and Sales). build.app_page() calls into this module for the three
animated glass posting ledgers (same facts the world sections carried), the Philippine BIR panels and one-line BIR notes.
Styles: assets/css/pages/apps-fx.css. Behaviour: assets/js/pages/apps-fx.js. Tokens ({{icon:x}}, {{odoo:m:n}}, {{ROOT}})
are expanded by build.render()."""

MEET = ('<a class="btn btn-primary btn-lg" data-meet href="https://technext.odoo.com/appointment/discovery-call-with-technext-2?invite_token=914012541b1242c1ae832faa66a6efdc&filter_appointment_type_ids=%5B2%5D&" '
        'target="_blank" rel="noopener">Book a discovery call {{icon:arrow}}</a>')
MEET_WHITE = MEET.replace("btn btn-primary btn-lg", "btn btn-white btn-lg")


def _bold(md: str) -> str:
    out, on = "", False
    for part in md.split("**"):
        out += (f"<b>{part}</b>" if on else part)
        on = not on
    return out


# ---------------------------------------------------------------- posting ledgers (Accounting, Sales, Inventory)
# row = (icon token, station, sample reference, what Odoo does (**bold** = the station's key words), status)
LEDGERS = {
    "accountant": {
        "name": "Accounting", "tag": "Posting ledger",
        "h2": "Six steps, one set of books.",
        "lead": "Every step below lands in the same ledger in Odoo Accounting. The entries are sample data; your own accounts, taxes and journals go in yours.",
        "rows": [
            ("{{icon:bank}}", "Bank reconciliation", "BNK/2026/0042", "**Bank reconciliation**: statement lines matched to invoices and bills, ready to validate.", "Matched"),
            ("{{icon:receipt}}", "Customer invoices", "INV/2026/0107", "**Customer invoices** sent from Odoo, with payment status on each one.", "Sent"),
            ("{{icon:file}}", "Vendor bills", "BILL/2026/0212", "**Vendor bills** matched to purchase orders and receipts, then paid in batches.", "Paid"),
            ("{{icon:layers}}", "GST and BIR reports", "TAX/2026/Q3", "**Tax reports**: GST in Singapore and BIR reports in the Philippines, built from the entries you already posted.", "To review"),
            ("{{icon:calendar}}", "Month-end", "CLOSE/2026/10", "**Month-end** as a checklist: accruals, reconciliations, lock date.", "Locked"),
            ("{{icon:bars}}", "Reports", "REP/2026/10", "**Reports** straight from the ledger: profit and loss, balance sheet, cash.", "Reported"),
        ],
        "total": "Balanced",
        "outro": "Invoices, bills, the bank and the close, in **one ledger**.",
    },
    "sale": {
        "name": "Sales", "tag": "Quote-to-cash ledger",
        "h2": "Six steps, one order.",
        "lead": "From the quotation to the dashboard, nothing is re-typed: each step below uses the lines of the one before. The records are sample data; your products, prices and approvals go in yours.",
        "rows": [
            ("{{odoo:sale:20}}", "Quotation", "S00042", "A **quotation** with your products, prices and optional extras, built in minutes.", "Sent"),
            ("{{icon:layers}}", "Pricelists", "PL/Reseller", "**Pricelists** per customer group, currency and quantity, applied automatically.", "Applied"),
            ("{{icon:check}}", "Sign and pay", "S00042 · portal", "The customer **signs and pays online**, and the quote becomes an order.", "Signed"),
            ("{{icon:receipt}}", "Sales order", "S00042", "Confirmed, it's a **sales order**: nothing re-typed.", "Confirmed"),
            ("{{icon:truck}}", "Deliver and invoice", "WH/OUT/0042", "The order creates the **delivery** and the **invoice**, from the same lines.", "Invoiced"),
            ("{{icon:bars}}", "Dashboard", "Sales · Oct", "The **sales dashboard**: by rep, by product, by month, live.", "Live"),
        ],
        "total": "Order closed",
        "outro": "Quote, sign, deliver, invoice, **no re-typing**.",
    },
    "stock": {
        "name": "Inventory", "tag": "Movement ledger",
        "h2": "Six moves, every one tracked.",
        "lead": "Every receipt, move and count below is logged against a location. The records are sample data; your warehouses, bins and routes go in yours.",
        "rows": [
            ("{{icon:truck}}", "Receipts", "WH/IN/0017", "**Receipts** checked against the purchase order at the dock.", "Received"),
            ("{{icon:pin}}", "Locations", "WH/Stock/A5-03", "**Locations**: every shelf and bin has an address, so stock is never lost.", "Stored"),
            ("{{icon:check}}", "Picking", "WH/PICK/0031", "**Picking** with a barcode scanner, in route order.", "Picked"),
            ("{{icon:bag}}", "Pack and ship", "WH/OUT/0042", "**Pack and ship**: shipping labels and carrier tracking from Odoo.", "Shipped"),
            ("{{icon:refresh}}", "Replenishment", "Min 20 · Max 60", "**Replenishment**: reorder rules raise purchases before stock runs out.", "Reordered"),
            ("{{icon:bars}}", "Counts", "WH/INV/0006", "**Cycle counts** by location, with every adjustment logged.", "Counted"),
        ],
        "total": "Stock tracked",
        "outro": "Received, put away, picked, packed, counted.",
    },
}


def ledger_html(mod: str) -> str:
    """The animated glass posting ledger for Accounting, Sales or Inventory ("" for every other app)."""
    d = LEDGERS.get(mod)
    if not d:
        return ""
    rows = "".join(
        f'<li class="apx-led-row" style="--k:{k}"><span class="apx-led-no">{k + 1:02d}</span>'
        f'<span class="apx-led-st">{ic}<span><b>{st}</b><small>{ref}</small></span></span>'
        f'<span class="apx-led-say">{_bold(say)}</span>'
        f'<span class="apx-led-ok"><i aria-hidden="true"></i>{ok}</span></li>'
        for k, (ic, st, ref, say, ok) in enumerate(d["rows"]))
    return f'''<section class="section fx-sec fx-sec--alt apx-led-sec" id="ledger">
  <div class="container">
    <div class="sec-head reveal"><h2>{d["h2"]}</h2><p class="lead">{d["lead"]}</p></div>
    <div class="apx-ledger reveal" data-apx-ledger>
      <i class="apx-led-beam" aria-hidden="true"></i>
      <div class="apx-led-top"><p class="apx-led-t">{{{{odoo:{mod}:22}}}}<b>Odoo {d["name"]} · {d["tag"].lower()}</b></p><span class="fx-tag">Sample data</span></div>
      <div class="apx-led-head" aria-hidden="true"><span>No.</span><span>Step</span><span>What Odoo {d["name"]} does</span><span>Status</span></div>
      <ol class="apx-led-rows">{rows}</ol>
      <p class="apx-led-total"><span class="apx-led-bal"><i aria-hidden="true"></i>{d["total"]}</span><span>{_bold(d["outro"])}</span></p>
    </div>
  </div>
</section>'''


# ---------------------------------------------------------------- Philippines: BIR
# Facts only from the project brief (PRODUCT.md): books for CAS/CBA registration, 2307 per payee, SLSP/SAWT/QAP, 2550Q,
# EOPT invoice rules, e-invoicing by 31 Dec 2026 for covered taxpayers, no EIS connection in Odoo (assessed and quoted
# separately; TechNext has not built one), Odoo 20 payroll: 1601-C items, 2316, 1604-C worksheets + Alphalist DAT.
BIR_CHIPS = {
    "accountant": [("CAS / CBA books", "Books set up for your own registration"), ("2307 and 2306", "Withholding certificates"), ("SLSP, SAWT, QAP", "DAT files from your entries"), ("2550Q", "Quarterly VAT summary")],
    "account": [("EOPT invoices", "Invoice rules, a series per branch"), ("E-invoicing", "Planned with covered taxpayers, 31 Dec 2026"), ("EIS connection", "Not built into Odoo; assessed and quoted separately")],
    "hr_payroll": [("1601-C", "Items for the monthly return of tax withheld on pay"), ("2316", "Certificate report for each employee"), ("1604-C", "Worksheets and the Alphalist DAT file")],
    "point_of_sale": [("EOPT invoices", "POS invoices can carry the EOPT fields"), ("Accounting", "The day's takings post to Odoo Accounting"), ("E-invoicing", "Planned for covered taxpayers, 31 Dec 2026")],
}
BIR_LINES = {
    "pos_restaurant": ("In the Philippines, restaurant POS invoices can carry the EOPT invoice fields, and the day's takings post to Odoo Accounting for your BIR reports. Your POS units need their own BIR registration, which you apply for. For covered taxpayers we also plan for e-invoicing by 31 December 2026.",
                       "eopt-invoice-requirements-odoo", "What a BIR invoice must show"),
    "website_sale": ("Online orders in the Philippines become invoices set up for the BIR invoice rules under the EOPT Act, and covered taxpayers prepare for e-invoicing by 31 December 2026. Odoo has no built-in connection to the BIR's EIS, and TechNext has not built one. If you are covered, we assess the options with you and quote any connection separately.",
                     "eopt-invoice-requirements-odoo", "What a BIR invoice must show"),
    "purchase": ("In the Philippines, vendor bills with withholding tax posted in Odoo are the source of the 2307 certificates you issue per payee and of the SLSP and QAP reports for the BIR.",
                 "bir-form-2307-odoo", "BIR Form 2307 explained"),
    "hr_expense": ("In the Philippines, approved expenses post to Odoo Accounting with their VAT, so the receipts you claim feed the SLSP purchases list and the 2550Q VAT summary built from your posted entries.",
                   "bir-slsp-summary-list-sales-purchases-odoo", "The BIR SLSP and how Odoo exports it"),
}


def bir_panel_html(mod: str, text: str, post: str, post_label: str) -> str:
    """The "For Philippine companies: BIR" block (accounting, invoicing, payroll, point of sale): a dark glass panel."""
    chips = "".join(f'<li><b>{a}</b><span>{b}</span></li>' for a, b in BIR_CHIPS[mod])
    return f'''<section class="section fx-sec bir-block apx-bir-sec" id="bir">
  <div class="container">
    <div class="apx-bir reveal">
      <div class="apx-bir-l">
        <h2>For Philippine companies: BIR</h2>
        <p class="lead">{text}</p>
        <p class="apx-bir-links">Read <a href="{{{{ROOT}}}}odoo/philippines.html">Odoo in the Philippines</a> and <a href="{{{{ROOT}}}}blog/{post}.html">{post_label}</a>.</p>
        <div class="actions">{MEET_WHITE}</div>
      </div>
      <div class="apx-bir-r">
        <p class="apx-bir-h">What this app prepares <span class="fx-tag">Sample data</span></p>
        <ul class="apx-bir-list">{chips}</ul>
      </div>
    </div>
  </div>
</section>'''


def bir_line_html(mod: str) -> str:
    """One factual BIR line (restaurant POS, eCommerce, Purchase, Expenses), linking /odoo/philippines."""
    if mod not in BIR_LINES:
        return ""
    text, post, label = BIR_LINES[mod]
    return f'''<section class="section fx-sec apx-birline-sec bir-block" id="bir">
  <div class="container">
    <div class="apx-birline reveal">
      {{{{icon:receipt}}}}
      <p><b>For Philippine companies.</b> {text} Read <a href="{{{{ROOT}}}}odoo/philippines.html">Odoo in the Philippines</a> and <a href="{{{{ROOT}}}}blog/{post}.html">{label}</a>.</p>
    </div>
  </div>
</section>'''
