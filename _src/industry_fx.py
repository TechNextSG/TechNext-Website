# -*- coding: utf-8 -*-
"""Futuristic template of the eight industry pages (22 Oct 2026 redesign).

The cartoon "world" heroes, Nexi's in-content poses and the vignette flow are gone. Each industry page now has:
  hero_html(key)    H1 + lead + "Book a discovery call" on the left, a live glass Odoo-style panel on the right
                    (sample data: a record, its status bar, count-ups, lines or bars, and the journal entry it posts)
  proof_html(key)   one strip under the hero: Odoo Ready Partner, the first phase, where we deliver from
  intro_html(key)   the "in one paragraph" answer as a glass card
  flow_html(key)    the workflow as a scroll-revealed chain of glass Odoo record cards on a glowing data line

build.py calls these from {{INDUSTRY_HERO:key}}, {{INDUSTRY_INTRO:key}} and {{INDUSTRY_FLOW:key}}. Behaviour: assets/js/pages/industry-fx.js,
styles: assets/css/pages/industry-fx.css (on top of home-fx.css). Everything shown is sample data and is labelled as such.
"""
import html as _html

import industries as IX

MEET = ('<a class="btn btn-primary btn-lg" data-meet href="https://technext.odoo.com/book/c82cf8a9" target="_blank" rel="noopener">'
        'Book a discovery call {{icon:arrow}}</a>')
QUOTE = '<a class="btn btn-ghost btn-lg" href="{{ROOT}}quotation.html">Get a quotation</a>'


def icon(n: str) -> str:
    return "{{icon:" + n + "}}"


def odoo(app: str, size: int) -> str:
    return "{{odoo:" + app + ":" + str(size) + "}}"


def app_ic(st: dict, size: int) -> str:
    """The step's Odoo app icon, or a bare line icon (never on a tile)."""
    return odoo(st["app"], size) if st.get("app") else icon(st["icon"])


def esc(s: str) -> str:
    return _html.escape(s, quote=True)


# ---------------------------------------------------------------------------------------------- hero copy
HERO = {
    "retail": {
        "h1": "Tills, stock and accounts that agree with each other.",
        "lead": "Point of Sale that works offline, stock shared across stores and online, and daily takings posted to Accounting without a spreadsheet in between.",
        "apps": [("point_of_sale", "Point of Sale"), ("stock", "Inventory"), ("accountant", "Accounting"), ("purchase", "Purchase"), ("website_sale", "eCommerce")],
        "first": "Start with one store"},
    "fnb": {
        "h1": "From the order to the kitchen to the books, in one system.",
        "lead": "Point of Sale that talks to the kitchen, recipes that deplete stock as dishes sell, purchasing from suppliers on par levels, and each outlet's takings posted to Accounting the same night.",
        "apps": [("pos_restaurant", "POS Restaurant"), ("mrp", "Manufacturing"), ("stock", "Inventory"), ("purchase", "Purchase"), ("accountant", "Accounting")],
        "first": "Start with one outlet"},
    "manufacturing": {
        "h1": "Know what it costs to make, before you quote it.",
        "lead": "Bills of materials drive component demand, work orders track the floor, and every finished unit carries its real cost into stock and the ledger.",
        "apps": [("mrp", "Manufacturing"), ("stock", "Inventory"), ("purchase", "Purchase"), ("quality_control", "Quality"), ("accountant", "Accounting")],
        "first": "Send us one product's BoM"},
    "construction": {
        "h1": "Every project's cost and margin, while it is still running.",
        "lead": "Purchase orders, subcontractor claims, site materials and labour hours land on the project they belong to, so the margin is visible before hand-over, not after the final account.",
        "apps": [("project", "Project"), ("purchase", "Purchase"), ("accountant", "Accounting"), ("hr_timesheet", "Timesheets"), ("stock", "Inventory")],
        "first": "Bring one live project"},
    "medical": {
        "h1": "Stock, purchasing and books, per branch, in one system.",
        "lead": "Consumables and medicines tracked by lot and expiry, purchasing centralised, and each clinic's accounts kept clean without a separate spreadsheet per site.",
        "apps": [("stock", "Inventory"), ("purchase", "Purchase"), ("accountant", "Accounting"), ("point_of_sale", "Point of Sale"), ("appointment", "Appointments")],
        "first": "Bring one branch's numbers"},
    "travel": {
        "h1": "Know the margin on every booking.",
        "lead": "Quotations that turn into confirmed bookings, supplier costs recorded against the same job, and invoices in the customer's currency, so margin is visible before the trip, not after the audit.",
        "apps": [("sale", "Sales"), ("purchase", "Purchase"), ("accountant", "Accounting"), ("crm", "CRM"), ("event", "Events &amp; Rental")],
        "first": "Show us one recent booking end to end"},
    "ecommerce": {
        "h1": "Orders in, stock out, payouts reconciled.",
        "lead": "Whether orders come from your own store or a marketplace, they should reserve real stock, print the right labels and land in the books with fees and payouts matched.",
        "apps": [("website_sale", "eCommerce"), ("stock", "Inventory"), ("accountant", "Accounting"), ("purchase", "Purchase"), ("helpdesk", "Helpdesk")],
        "first": "Tell us where orders come from today"},
    "health-wellness": {
        "h1": "Bookings, memberships and retail on one client record.",
        "lead": "Every client has one record with their bookings, membership, retail purchases and invoices, so the front desk sees the whole picture and finance gets clean numbers.",
        "apps": [("appointment", "Appointments"), ("sale_subscription", "Subscriptions"), ("point_of_sale", "Point of Sale"), ("stock", "Inventory"), ("accountant", "Accounting")],
        "first": "Show us one week of bookings"},
}

# ---------------------------------------------------------------------------------------------- hero panel
# steps: the record's status bar (4 states). kpis: (label, value, prefix, suffix, decimals). mid: ("table", head, rows) with rows
# (cells..., chip) or ("bars", rows) with rows (label, value text, offset, width, kind). chip = (text, text after posting or None, tone).
# post: the journal entry the record posts (Dr/Cr rows). chips: what lights up once it is posted.
PANEL = {
    "retail": dict(
        app="point_of_sale", title="Point of Sale", sub="Orchard store · POS/2026/0412", steps=["Open", "Selling", "Closing", "Posted"],
        kpis=[("Orders today", 148, "", "", 0), ("Takings", 3480, "S$ ", "", 0), ("Reorders raised", 3, "", "", 0)],
        mid=("table", ["Product", "Sold", "On hand"], [
            ("Linen shirt", "6", "14", ("Transfer raised", None, "warn")),
            ("Ceramic mug", "9", "62"),
            ("Canvas tote", "4", "31")]),
        post=dict(app="accountant", title="Journal entry", ref="POS/2026/0412", rows=[("Dr", "Cash", "1,340.00"), ("Dr", "Card clearing", "2,140.00"), ("Cr", "Sales and GST", "3,480.00")]),
        chips=["Stock moved", "Takings posted", "Cards matched"]),
    "fnb": dict(
        app="pos_restaurant", title="Restaurant POS", sub="Lantern Kitchen · Table T7", steps=["Ordered", "Cooking", "Served", "Posted"],
        kpis=[("Covers today", 312, "", "", 0), ("Average bill", 38.5, "S$ ", "", 2), ("Food cost", 29.4, "", "%", 1)],
        mid=("table", ["Dish", "Station", "Ticket"], [
            ("2 × Laksa", "Wok", ("Cooking", "Ready", "warn")),
            ("10 × Chicken satay", "Grill", ("Cooking", "Ready", "warn")),
            ("1 × Iced lime tea", "Bar", ("Cooking", "Ready", "warn"))]),
        post=dict(app="accountant", title="Journal entry", ref="Outlet 1 · POS/2026/0091", rows=[("Dr", "Cash", "1,980.00"), ("Dr", "Card and QR", "4,260.00"), ("Cr", "Sales and GST", "6,240.00")]),
        chips=["Kitchen display", "Ingredients deducted", "Takings posted"]),
    "manufacturing": dict(
        app="mrp", title="Manufacturing", sub="MO/0412 · 40 × Shelf unit", steps=["Planned", "Making", "Checked", "Costed"],
        kpis=[("Units done", 26, "", " / 40", 0), ("Quality checks", 3, "", " / 3", 0), ("Unit cost", 186.4, "S$ ", "", 2)],
        mid=("bars", [
            ("Components", "S$ 118.60", 0, .636, "a"),
            ("Labour", "S$ 41.20", .636, .221, "b"),
            ("Overhead", "S$ 26.60", .857, .143, "c")]),
        post=dict(app="accountant", title="Journal entry", ref="MO/0412 · 40 units", rows=[("Dr", "Finished goods", "7,456.00"), ("Cr", "Raw materials", "4,744.00"), ("Cr", "Labour and overhead", "2,712.00")]),
        chips=["Bill of materials", "Work orders", "Real unit cost"]),
    "construction": dict(
        app="project", title="Project", sub="JOB-0231 · Tower B fit-out · PHP", steps=["Won", "Budgeted", "Running", "Claimed"],
        kpis=[("Budget", 12.4, "₱", "M", 1), ("Cost to date", 7.9, "₱", "M", 1), ("Progress", 64, "", "%", 0)],
        mid=("bars", [
            ("Materials", "₱3.4M of ₱4.8M", 0, .71, "a"),
            ("Labour", "₱1.9M of ₱3.1M", 0, .61, "a"),
            ("Subcontract", "₱2.6M of ₱4.5M", 0, .58, "a")]),
        post=dict(app="accountant", title="Subcontractor bill", ref="BILL/2026/0318 · Reyes Steelworks Inc.", rows=[("Dr", "Project cost, JOB-0231", "480,000.00"), ("Cr", "Withholding tax, 2307", "9,600.00"), ("Cr", "Payables", "470,400.00")]),
        chips=["Progress claim", "Retention held", "2307 per payee"]),
    "medical": dict(
        app="stock", title="Inventory", sub="Branch A · Saline 0.9%", steps=["Received", "Alert", "Picked", "Billed"],
        kpis=[("Lots expiring in 60 days", 23, "", "", 0), ("Branches on one stock", 3, "", "", 0), ("Unpaid invoices", 14.2, "S$ ", "k", 1)],
        mid=("table", ["Lot", "Expires", "On hand"], [
            ("17A", "28 Feb 2027", "40", ("Picked first", None, "warn")),
            ("24B", "30 Sep 2027", "160"),
            ("31C", "31 Mar 2028", "220")]),
        post=dict(app="accountant", title="Invoice", ref="INV/2026/0158 · Branch A", rows=[("Dr", "Receivable", "1,240.00"), ("Cr", "Services, Branch A", "1,240.00")]),
        chips=["FEFO picking", "Expiry alerts", "Books per branch"]),
    "travel": dict(
        app="sale", title="Quotation", sub="S0158 · Tokyo, 6 nights, 4 travellers", steps=["Quoted", "Deposit", "Booked", "Closed"],
        kpis=[("Selling price", 9840, "S$ ", "", 0), ("Deposit paid", 2952, "S$ ", "", 0), ("Margin", 18, "", "%", 0)],
        mid=("bars", [
            ("Selling price", "S$ 9,840", 0, 1, "a"),
            ("Hotels, ¥ 412,000", "−S$ 3,625", .632, .368, "cost"),
            ("Flights", "−S$ 3,240", .302, .33, "cost"),
            ("Rail and transfers", "−S$ 1,204", .18, .122, "cost"),
            ("Margin", "S$ 1,771", 0, .18, "gain")]),
        post=dict(app="accountant", title="Supplier bill", ref="Hotel · paid in yen", rows=[("Dr", "Hotel cost", "3,611.20"), ("Dr", "Exchange difference", "14.28"), ("Cr", "Bank, ¥ 412,000", "3,625.48")]),
        chips=["Deposit by link", "Multi-currency", "Margin per trip"]),
    "ecommerce": dict(
        app="website_sale", title="eCommerce", sub="Parcel Lane · Order #1042", steps=["Paid", "Picked", "Shipped", "Invoiced"],
        kpis=[("Orders today", 184, "", "", 0), ("Ready to ship", 62, "", "", 0), ("Items below minimum", 9, "", "", 0)],
        mid=("table", ["Order", "Channel", "Status"], [
            ("#1042 · 2 × Mug", "Web store", ("Paid", "Shipped", "info")),
            ("#LZ-88123 · 1 × Shirt", "Lazada", ("Paid", "Shipped", "info")),
            ("#TT-55021 · 3 × Tote", "TikTok Shop", ("Paid", "Shipped", "info"))]),
        post=dict(app="account", title="Invoice", ref="INV/2026/1042 · issued", rows=[("Dr", "Payment received", "49.80"), ("Cr", "Sales", "45.69"), ("Cr", "GST", "4.11")]),
        chips=["Stock reserved", "Payout matched", "Locked after issue", "PH: e-invoice by 31 Dec 2026"]),
    "health-wellness": dict(
        app="sale_subscription", title="Subscriptions", sub="Willow &amp; Stone · SUB/0186 · Gold", steps=["Booked", "Checked in", "Renewed", "Posted"],
        kpis=[("Active members", 1240, "", "", 0), ("Renewals this month", 186, "", "", 0), ("Retail sales today", 2.3, "S$ ", "k", 1)],
        mid=("bars", [
            ("Vinyasa flow · Tue 07:00", "12 of 14", 0, .857, "a"),
            ("HIIT · Tue 18:30", "16 of 16 · 3 waiting", 0, 1, "full"),
            ("Pilates · Wed 09:00", "9 of 12", 0, .75, "a")]),
        post=dict(app="accountant", title="Renewal invoice", ref="SUB/0186 · S$ 189 a month", rows=[("Dr", "Card payment", "189.00"), ("Cr", "Membership revenue", "173.39"), ("Cr", "GST", "15.61")]),
        chips=["Packages tracked", "Memberships renew", "Front desk check-in"]),
}


def _fmt(v: float, dec: int) -> str:
    return f"{v:,.{dec}f}"


def _chip(c, bare: bool = False) -> str:
    if not c:
        return ""
    a, b, tone = c
    if b:
        return (f'<span class="ixf-chip ixf-sw" data-tone="{tone}"><span class="ixf-sa">{a}</span><span class="ixf-sb" aria-hidden="true">{b}</span></span>')
    return f'<span class="ixf-chip" data-tone="{tone}">{a}</span>'


def _mid_html(mid) -> str:
    if mid[0] == "table":
        head, n = mid[1], len(mid[1])
        th = "".join(f'<th scope="col"{"" if i == 0 else " class=\"n\""}>{h}</th>' for i, h in enumerate(head))
        rows = ""
        for r, row in enumerate(mid[2]):
            cells, extra = row[:n], (row[n] if len(row) > n else None)
            tds = ""
            for i, c in enumerate(cells):
                body = _chip(c) if isinstance(c, tuple) else c
                if i == 0 and extra:
                    body += " " + _chip(extra)
                tds += f'<td{"" if i == 0 else " class=\"n\""}>{body}</td>'
            rows += f'<tr class="ixf-r" style="--r:{r}">{tds}</tr>'
        return f'<table class="ixf-tbl"><thead><tr>{th}</tr></thead><tbody>{rows}</tbody></table>'
    rows = ""
    for r, (lab, val, o, w, kind) in enumerate(mid[1]):
        rows += (f'<li class="ixf-r ixf-brow" style="--r:{r}" data-k="{kind}"><span class="ixf-bl">{lab}</span><span class="ixf-bv">{val}</span>'
                 f'<span class="ixf-bt" aria-hidden="true"><i style="--o:{o};--w:{w}"></i></span></li>')
    return f'<ul class="ixf-bars">{rows}</ul>'


def hero_html(key: str) -> str:
    h, p, d = HERO[key], PANEL[key], IX.IND[key]
    kpis = "".join(
        f'<div class="ixf-k" style="--r:{i}"><dt>{lab}</dt><dd data-count="{v}" data-pre="{esc(pre)}" data-suf="{esc(suf)}" data-dec="{dec}">{esc(pre)}{_fmt(v, dec)}{esc(suf)}</dd></div>'
        for i, (lab, v, pre, suf, dec) in enumerate(p["kpis"]))
    steps = "".join(f'<li class="ixf-seg" style="--r:{i}">{s}</li>' for i, s in enumerate(p["steps"]))
    post = p["post"]
    led = "".join(f'<li style="--r:{i}"><i>{dc}</i><span>{lab}</span><b>{amt}</b></li>' for i, (dc, lab, amt) in enumerate(post["rows"]))
    chips = "".join(f'<li style="--r:{i}">{c}</li>' for i, c in enumerate(p["chips"]))
    apps = "".join(f'<a href="{{{{ROOT}}}}odoo/apps/{a}.html">{odoo(a, 20)}{n}</a>' for a, n in h["apps"])
    label = f'Sample Odoo screen: {p["title"]}, {p["sub"]}'
    return f'''<section class="fx-hero ixf-hero" aria-labelledby="ixf-h1">
  <div class="fx-field" aria-hidden="true"><i class="fx-orb fx-orb--a"></i><i class="fx-orb fx-orb--b"></i></div>
  <div class="container fx-hero-in">
    <div class="ixf-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="{{{{ROOT}}}}index.html">Home</a><span>Industries</span><span>{d["name"]}</span></nav>
      <h1 id="ixf-h1">{h["h1"]}</h1>
      <p class="fx-lead">{h["lead"]}</p>
      <div class="actions ixf-act">{MEET}{QUOTE}</div>
      <div class="ixf-apps" aria-label="Apps we switch on">{apps}</div>
    </div>
    {panel_html(key)}
  </div>
</section>

<section class="fx-proof ixf-proof" aria-label="At a glance">
  <div class="container fx-proof-in">
    <span>{icon("shield")}<a href="https://www.odoo.com/partners/technext-pte-ltd-28073844" target="_blank" rel="noopener"><b>Odoo Ready Partner</b></a></span>
    <span>{icon("target")}<p>First phase: <b>{h["first"]}</b></p></span>
    <span>{icon("users")}<p>Delivered by <b>TechNext</b> from Singapore, Taguig City and Ho Chi Minh City</p></span>
  </div>
</section>'''


def intro_html(key: str) -> str:
    d = IX.IND[key]
    return (f'<section class="section fx-sec ixf-one-sec"><div class="container"><div class="ixf-one reveal">'
            f'<h2>Odoo for {d["noun"]}, in one paragraph</h2><p>{d["intro"]}</p></div></div></section>')


# ---------------------------------------------------------------------------------------------- the workflow chain
# One sample record per workflow step (the same facts the old vignettes carried): doc reference, kind, status (text, tone),
# fields, and what it was created from.
REC = {
    "retail": [
        ("PO00087", "Purchase order", ("Confirmed", "info"), [("Vendor", "Apex Homeware"), ("Product", "48 × Ceramic mug"), ("Total", "S$ 345.60")], "Raised by a reordering rule, minimum 20"),
        ("WH/IN/00112", "Receipt", ("Done", "ok"), [("Received", "48 of 48"), ("Shelf", "14 → 62"), ("Vendor bill", "Matched to PO00087")], "From PO00087"),
        ("WH/INT/00066", "Transfer", ("In transit", "warn"), [("From", "Store A"), ("To", "Orchard"), ("Quantity", "12 × Ceramic mug")], "Orchard fell below its minimum"),
        ("Order 0412", "POS order", ("Paid", "ok"), [("Items", "2 × Ceramic mug"), ("Total", "S$ 36.00"), ("Till", "Offline, syncs later")], "Stock moves on every sale"),
        ("Web order #1042", "eCommerce order", ("Ready for pickup", "ok"), [("Pickup at", "Store A"), ("Stock", "Reserved at Store A"), ("Payment", "Paid online")], "Same catalogue and stock as the stores"),
        ("POS/2026/0412", "POS session", ("Posted", "ok"), [("Takings", "S$ 3,480"), ("Card settlement", "Matched from bank feed"), ("Journal entry", "Balanced")], "Closing the session posts it"),
    ],
    "fnb": [
        ("PO00156", "Purchase order", ("Confirmed", "info"), [("Item", "10 kg prawns"), ("Trigger", "Par level, Outlet 1"), ("Supplier", "Delivers Tue and Fri")], "Raised by a reordering rule"),
        ("MO/0091", "Manufacturing order", ("In progress", "warn"), [("Recipe", "Laksa paste"), ("Batch", "20 kg"), ("Ingredients", "Deducted from stock")], "Central kitchen batch"),
        ("WH/INT/00031", "Transfer", ("Received", "ok"), [("From", "Central kitchen"), ("To", "Outlet 2"), ("Quantity", "6 kg laksa paste")], "From MO/0091"),
        ("Table T7", "Restaurant order", ("Sent to kitchen", "info"), [("Items", "2 × Laksa"), ("Ordered by", "QR code at the table"), ("Split", "Pay after the meal")], "Self-ordering"),
        ("Ticket #42", "Kitchen display", ("Preparing", "warn"), [("Dish", "2 × Laksa"), ("Note", "Less spicy"), ("Station", "Wok")], "From Table T7"),
        ("POS/2026/0091", "Outlet 1 session", ("Posted", "ok"), [("Takings", "S$ 6,240"), ("Food cost", "30%"), ("Journal entry", "Balanced")], "Closing the session posts it"),
    ],
    "manufacturing": [
        ("SO 0418", "Sales order", ("Confirmed", "info"), [("Product", "40 × Shelf unit"), ("Route", "Make to order"), ("Delivery", "Week 43")], "Quotation accepted"),
        ("MO/0412", "Manufacturing order", ("Planned", "info"), [("Product", "40 × Shelf unit"), ("Routing", "Cut, weld, paint"), ("Scheduled", "Week 42")], "From SO 0418"),
        ("PO00377", "Purchase order", ("Confirmed", "info"), [("Component", "160 × Bracket"), ("Lead time", "5 days"), ("Raised by", "MO/0412 shortage")], "Component demand from the BoM"),
        ("Weld cell 2", "Work order", ("In progress", "warn"), [("Done", "26 of 40"), ("Operator", "Tablet, barcode scan"), ("Order", "MO/0412")], "Shop Floor"),
        ("QC/0412", "Quality check", ("Passed", "ok"), [("Checks", "3 of 3 passed"), ("Point", "After welding"), ("Order", "MO/0412")], "Control point on the routing"),
        ("MO/0412", "Order costing", ("Costed", "ok"), [("Unit cost", "S$ 186.40"), ("Margin", "25%"), ("Valued in", "Finished goods")], "Components, labour and overhead"),
    ],
    "construction": [
        ("Riverside Block B", "Opportunity", ("Won", "ok"), [("Value", "S$ 2.4M"), ("Quotation", "With milestones"), ("Contract", "Signed online")], "From the tender pipeline"),
        ("Job B-14", "Project", ("In progress", "warn"), [("Stages", "4"), ("Budget", "S$ 2.1M"), ("Analytic account", "B-14")], "From the won quotation"),
        ("PO00412", "Purchase order", ("Confirmed", "info"), [("Item", "12,000 × Brick"), ("Total", "S$ 9,840"), ("Analytic split", "Job B-14, 100%")], "Cost lands on the job"),
        ("Level 3 pour", "Site slot", ("Scheduled", "info"), [("Crew", "Crane + 4"), ("Where", "Riverside Block B"), ("Offline", "Works without signal")], "Planned against Job B-14"),
        ("Timesheets, week 42", "Timesheet", ("Submitted", "ok"), [("Hours", "186 h this week"), ("Progress", "62%"), ("Job", "B-14")], "Hours against tasks"),
        ("Claim #4", "Progress invoice", ("Posted", "ok"), [("Amount", "S$ 380,000"), ("Job margin", "12.5%"), ("Billing", "Milestone")], "From the job's milestones"),
    ],
    "medical": [
        ("Dr. Tan · Thu 10:30", "Appointment", ("Booked", "ok"), [("Booked", "Online"), ("Reminder", "Sent"), ("Branch", "A")], "Booking page"),
        ("Branch A · Thu", "Roster", ("Published", "ok"), [("Doctors", "3"), ("Nurses", "4"), ("Shifts", "Per branch")], "Planning"),
        ("Lot 17A", "Saline 0.9%", ("Expiring", "warn"), [("Alert", "Raised"), ("Picking", "First out, first expiring"), ("Branch", "A")], "Lots and expiry dates"),
        ("PO00042", "Purchase order", ("Approved", "ok"), [("Item", "200 × Saline 0.9%"), ("Vendor", "Approved vendor"), ("Ordered for", "All branches")], "Reordering rule"),
        ("Order 0412", "POS order", ("Paid", "ok"), [("Total", "S$ 18.40"), ("Paid by", "Card"), ("Lot", "24B")], "Counter sale"),
        ("INV/2026/0158", "Invoice", ("Reconciled", "ok"), [("Amount", "S$ 1,240.00"), ("Analytic", "Branch A"), ("Bank", "Matched")], "Per branch books"),
    ],
    "travel": [
        ("Family of 4 · Tokyo", "Opportunity", ("New", "info"), [("Travellers", "4"), ("Trip", "Tokyo, 6 nights"), ("Source", "Website form")], "Enquiry in CRM"),
        ("S0158", "Quotation", ("Sent", "info"), [("Total", "S$ 9,840"), ("Optional extra", "1"), ("Signature", "Online")], "Itinerary as a template"),
        ("30% deposit", "Down payment", ("Paid", "ok"), [("Amount", "S$ 2,952"), ("Paid by", "Payment link"), ("Quotation", "S0158")], "Confirmed with a deposit"),
        ("PO00158", "Purchase order", ("Confirmed", "info"), [("Seats", "4"), ("Nights", "6"), ("Rail passes", "4")], "Services bought per booking"),
        ("Hotel bill", "Vendor bill", ("Paid", "ok"), [("Billed", "¥ 412,000"), ("Booked at", "S$ 3,625.48"), ("Exchange difference", "Booked")], "Multi-currency"),
        ("Tokyo trip", "Margin report", ("Closed", "ok"), [("Revenue", "S$ 9,840"), ("Margin", "18%"), ("Report", "By trip")], "Dashboards"),
    ],
    "ecommerce": [
        ("#1042", "Web order", ("Paid", "ok"), [("Channel", "Web store"), ("Items", "2 × Ceramic mug"), ("Stock", "Reserved")], "Marketplace connectors too"),
        ("Payment #1042", "Payment", ("Reconciled", "ok"), [("Captured", "S$ 49.80"), ("Payout", "S$ 48.31"), ("Fees", "S$ 1.49")], "Payment provider"),
        ("WH/OUT/1042", "Delivery", ("Done", "ok"), [("Label", "PL1042SG"), ("Carrier", "Tracking sent"), ("Packed", "Barcode scan")], "From order #1042"),
        ("PO00231", "Purchase order", ("RFQ", "info"), [("Item", "80 × Ceramic mug"), ("Suggested min", "40"), ("Suggested max", "120")], "Suggested stock levels"),
        ("Ticket #318", "Return", ("Refunded", "ok"), [("From", "WH/OUT/1042"), ("Refund", "S$ 24.90"), ("Stock", "Back on the shelf")], "Helpdesk"),
        ("Web store", "Dashboard", ("Live", "ok"), [("Sales", "S$ 18,400"), ("Margin", "41%"), ("Channels", "By channel")], "Sales by channel"),
    ],
    "health-wellness": [
        ("Vinyasa flow · Tue 07:00", "Class booking", ("12 of 14", "info"), [("Capacity", "14"), ("Booked", "12"), ("Reminders", "Email and SMS")], "Booking page"),
        ("SUB/0186", "Subscription", ("Active", "ok"), [("Plan", "Gold unlimited"), ("Price", "S$ 189 a month"), ("Renewal", "Automatic")], "Recurring billing"),
        ("Ana Tan · Gold", "Check-in", ("In at 07:52", "ok"), [("Member", "Ana Tan"), ("Plan", "Gold"), ("Class", "Vinyasa flow")], "Front desk"),
        ("POS/0932", "POS order", ("Paid", "ok"), [("Total", "S$ 46"), ("Points", "+46"), ("Stock", "Retail, same database")], "Retail and packages"),
        ("Leo · 06:30–13:00", "Shift", ("Published", "ok"), [("Classes", "3"), ("Availability", "Linked"), ("Role", "Instructor")], "Planning"),
        ("Recurring revenue", "Report", ("Posted", "ok"), [("Revenue", "S$ 48.2k"), ("Churn", "1.6%"), ("Source", "Subscriptions")], "Accounting and Subscriptions"),
    ],
}


def flow_html(key: str) -> str:
    d = IX.IND[key]
    steps, recs = d["flow"], REC[key]
    n = len(steps)
    items = ""
    for k, (st, rc) in enumerate(zip(steps, recs)):
        doc, kind, (stat, tone), fields, src = rc
        fl = "".join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in fields)
        items += f'''
      <li class="ixf-step" style="--k:{k}">
        <div class="ixf-info">
          <h3><span class="sr-only">Step {k + 1} of {n}, {st["t"]}: </span>{st["h"]}</h3>
          <p>{st["p"]}</p>
          <dl class="ixf-meta"><div><dt>In Odoo</dt><dd>{app_ic(st, 22)}<span>{st["odoo"]}</span></dd></div><div><dt>{d.get("lab_was", "What it replaces")}</dt><dd class="ixf-was">{st["was"]}</dd></div></dl>
        </div>
        <span class="ixf-node" aria-hidden="true"><i>{k + 1}</i></span>
        <article class="ixf-rec" aria-label="Sample record: {esc(doc)}">
          <header>{app_ic(st, 22)}<span><b>{doc}</b><small>{kind}</small></span><em class="ixf-pill" data-tone="{tone}">{stat}</em></header>
          <dl>{fl}</dl>
          <footer>{icon("arrow")}<span>{src}</span><small>Sample</small></footer>
        </article>
      </li>'''
    return f'''<section class="section fx-sec fx-sec--alt ixf-flow-sec" id="flow">
  <div class="container">
    <div class="sec-head reveal"><h2>{d["flow_title"]}</h2><p class="lead">{d["flow_lead"]}</p></div>
    <ol class="ixf-chain" data-ixf-chain style="--n:{n}" aria-label="{esc(d["name"])} workflow in Odoo, step by step">
{items}
    </ol>
  </div>
</section>'''



def panel_html(key: str, extra: str = "") -> str:
    """The live sample Odoo panel of one industry (its hero panel), reusable on the home page."""
    return panel_markup(PANEL[key], extra)


def panel_markup(p: dict, extra: str = "") -> str:
    """A live sample Odoo panel from a PANEL-shaped dict (app, title, sub, steps, kpis, mid, post, chips; post may carry
    "bal", the badge on the posted record, default "Dr = Cr"). Also used by the free-website lander's BIR needs (_src/fw_needs.py)."""
    kpis = "".join(
        f'<div class="ixf-k" style="--r:{i}"><dt>{lab}</dt><dd data-count="{v}" data-pre="{esc(pre)}" data-suf="{esc(suf)}" data-dec="{dec}">{esc(pre)}{_fmt(v, dec)}{esc(suf)}</dd></div>'
        for i, (lab, v, pre, suf, dec) in enumerate(p["kpis"]))
    steps = "".join(f'<li class="ixf-seg" style="--r:{i}">{s_}</li>' for i, s_ in enumerate(p["steps"]))
    post = p["post"]
    led = "".join(f'<li style="--r:{i}"><i>{dc}</i><span>{lab}</span><b>{amt}</b></li>' for i, (dc, lab, amt) in enumerate(post["rows"]))
    chips = "".join(f'<li style="--r:{i}">{c}</li>' for i, c in enumerate(p["chips"]))
    label = f'Sample Odoo screen: {p["title"]}, {p["sub"]}'
    return f'''    <div class="ixf-panel" data-ixf-panel{extra} role="group" aria-label="{esc(label)}">
      <i class="fx-result-glow" aria-hidden="true"></i>
      <div class="ixf-top">
        <p class="ixf-t">{odoo(p["app"], 22)}<span><b>{p["title"]}</b><small>{p["sub"]}</small></span></p>
        <span class="fx-tag">Sample data</span>
      </div>
      <ol class="ixf-bar" aria-label="Record status">{steps}</ol>
      <div class="ixf-body">
        <dl class="ixf-kpis">{kpis}</dl>
        <div class="ixf-mid">{_mid_html(p["mid"])}</div>
      </div>
      <div class="ixf-wire" aria-hidden="true"><i></i><i></i></div>
      <div class="ixf-post">
        <p class="ixf-post-h">{odoo(post["app"], 20)}<span><b>{post["title"]}</b><small>{post["ref"]}</small></span><em class="ixf-bal">{post.get("bal", "Dr = Cr")}</em></p>
        <ul class="ixf-led">{led}</ul>
      </div>
      <ul class="ixf-chips" aria-label="What this posts">{chips}</ul>
    </div>'''


# home: one tab per industry; the selected industry's panel runs (only the visible panel animates)
SWITCH = [("retail", "bag", "POS, shared stock, EOPT invoices per store"), ("ecommerce", "cart", "Online sellers in the first e-invoicing group"),
          ("fnb", "utensils", "Outlet POS to kitchen to the books"), ("construction", "hardhat", "Job costing, 2307 on subcontractor payments"),
          ("manufacturing", "gear", "Bills of materials and real unit cost"), ("medical", "pulse", "Clinic groups, one set of books per branch"),
          ("travel", "plane", "Bookings, supplier costs, margins per trip"), ("health-wellness", "heart", "Memberships, packages and retail")]


def switch_html() -> str:
    tabs, panels = "", ""
    for i, (key, ic, line) in enumerate(SWITCH):
        d = IX.IND[key]
        on = i == 0
        tabs += (f'<button class="fx-ind" type="button" role="tab" id="ixs-t-{key}" aria-controls="ixs-p-{key}" aria-selected="{"true" if on else "false"}"'
                 f' tabindex="{0 if on else -1}" data-ixs="{key}">{icon(ic)}<span><b>{d["name"]}</b><small>{line}</small></span></button>')
        panels += (f'<div class="ixs-pane" role="tabpanel" id="ixs-p-{key}" aria-labelledby="ixs-t-{key}"{"" if on else " hidden"}>'
                   f'{panel_html(key)}<a class="btn-link ixs-go" href="{{{{ROOT}}}}industries/{key}.html">See Odoo for {d["noun"]} {icon("arrow")}</a></div>')
    return f'''<section class="section fx-sec fx-sec--alt" id="industries" aria-labelledby="fx-ind-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="fx-ind-h">Set up for how your industry runs, and how the BIR sees it.</h2><p class="lead">Pick your industry to see the Odoo record it runs on, from the first step to the journal entry behind your BIR reports.</p></div>
    <div class="ixs" data-ixs-root>
      <div class="ixs-tabs" role="tablist" aria-label="Industries">{tabs}</div>
      <div class="ixs-stage">{panels}</div>
    </div>
  </div>
</section>'''
