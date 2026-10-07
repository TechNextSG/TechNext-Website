# -*- coding: utf-8 -*-
"""World heroes for the three Odoo apps in the menu (Accounting, Sales, Inventory). build.app_page() swaps the generated
stage hero for hero(mod) when the app is listed here; every other section of the app page stays generated.
Each world is its own scene (assets/js/worlds/<world>.js, assets/css/worlds/<world>.css, _src/vignettes/<world>.py).
Hotspot coordinates are set units (1000 x 600, floor 470): --x/--y are the centre."""

WORLD = {"accountant": "app-acc", "sale": "app-sales", "stock": "app-stock"}


def _btn(kind, d):
    cls = "ixw-cast" if kind == "cast" else ("ixw-toy" if kind == "toy" else "ixw-hot")
    if d.get("below"):
        cls += " ixw-hot--below"
    style = f'--x:{d["x"]};--y:{d["y"]};--w:{d["w"]};--h:{d["h"]}'
    if kind == "cast":
        return (f'<button class="{cls}" type="button" data-cast="{d["id"]}" data-near="{d["near"]}" data-who="{d["who"]}" data-role="{d["role"]}" '
                f'data-say="{d["say"]}" style="{style}" aria-label="Say hi to {d["aria"]} (illustration)"><span class="ixw-hot-lab" aria-hidden="true">{{{{icon:smile}}}}<b>{d["lab"]}</b>'
                + (f'<i>{d["sub"]}</i>' if d.get("sub") else "") + '</span></button>')
    if kind == "toy":
        return (f'<button class="{cls}" type="button" data-toy="{d["id"]}" data-near="{d["near"]}" data-pose="{d.get("pose", "wow")}" data-say="{d["say"]}" style="{style}" '
                f'aria-label="{d["aria"]}"><span class="ixw-hot-lab" aria-hidden="true">{{{{icon:sparkle}}}}<b>{d["lab"]}</b></span></button>')
    return (f'<button class="{cls}" type="button" data-hot="{d["id"]}" data-nx="{d["near"]}" data-pose="{d.get("pose", "point-left")}" data-rec="{d["rec"]}" '
            f'data-say="{d["say"]}" style="{style}" aria-pressed="false"><span class="ixw-hot-lab">{d["icon"]}<b>{d["lab"]}</b></span></button>')


def _strip(md):
    return md.replace("**", "")


def hero(mod: str, h1: str, headline: str, lead: str) -> str:
    sp = SPEC[mod]
    w, home = WORLD[mod], sp["home"]
    nx, ny = home.split(",")
    casts = "\n      ".join(_btn("cast", c) for c in sp["cast"])
    hots = "\n      ".join(_btn("hot", h) for h in sp["hots"])
    toys = "\n      ".join(_btn("toy", t) for t in sp["toys"])
    av = "".join(f'<b data-for="{c["id"]}" style="--c:{c["col"]}">{c["lab"][0]}</b>' for c in sp["cast"])
    dots = "".join(f'<button type="button" data-ixw-dot aria-label="Stop {k + 1}: {lab}"></button>'
                   for k, lab in enumerate(["welcome"] + [h["dot"] for h in sp["hots"]] + ["summary"]))
    intro = sp["intro"]
    intro_html = intro.replace("**", "<b>", 1)
    while "**" in intro_html:
        intro_html = intro_html.replace("**", "</b>", 1).replace("**", "<b>", 1)
    glance = "".join(f'<div><dt>{{{{icon:{g[0]}}}}}{g[1]}</dt><dd>{g[2]}</dd></div>' for g in sp["glance"])
    return f'''<section class="ixw-hero" data-ixw-hero data-world="{w}" data-home="{home}" aria-labelledby="ixw-h1">
  <canvas class="ixw-cv" data-ixw-cv aria-hidden="true"></canvas>
  <div class="container ixw-hero-in">
    <div class="ixw-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="{{{{ROOT}}}}index.html">Home</a><span>Odoo</span><span><a href="{{{{ROOT}}}}odoo/apps.html">Apps</a></span><span>{sp["crumb"]}</span></nav>
      <p class="ixw-ep"><a class="ixw-ep-tag" href="{{{{ROOT}}}}nexi-explains.html">{{{{icon:play}}}}Nexi Explains</a><span class="app-ep">{{{{odoo:{mod}:18}}}}Odoo {sp["crumb"]}</span></p>
      <h1 id="ixw-h1"><span class="hand h1-hand">{sp["hand"]}</span>Odoo {h1} in Singapore</h1>
      <p class="app-sub">{headline}</p>
      <p class="lead"><span class="m-full">{lead}</span><span class="m-short">{sp["short"]}</span></p>
      <div class="actions"><a class="btn btn-primary btn-lg" href="{{{{ROOT}}}}quotation.html">Get a quotation {{{{icon:arrow}}}}</a><a class="btn btn-ghost btn-lg" href="#talk">{{{{icon:chat}}}}Talk to us</a></div>
      <p class="ixw-hint">{{{{icon:sparkle}}}}<span>{sp["hint"]}</span></p>
    </div>
  </div>
  <div class="ixw-set" data-ixw-set>
    <div class="ixw-front" data-ixw-front>
      {casts}

      {hots}

      {toys}

      <div class="ixw-nexi" data-ixw-nexi style="--nx:{nx};--ny:{ny}" data-reacts="{sp["reacts"]}">
        <div class="ixw-nexi-y"><button class="ixw-nexi-b" type="button" aria-label="Say hi to Nexi"><span class="ixw-nexi-bob"><span class="ixw-aura" aria-hidden="true"></span>{{{{IXW_NEXI:{w}}}}}</span></button></div>
      </div>
    </div>
    <div class="ixw-cap" data-ixw-cap data-intro="{intro}" data-outro="{sp["outro"]}">
      <span class="ixw-cap-av" data-ixw-av data-av="nexi" aria-hidden="true">{{{{IXW_AV:{w}}}}}{av}</span>
      <div class="ixw-cap-body">
        <p class="ixw-cap-who"><b data-ixw-who>Nexi</b><small data-ixw-role data-default="assistant · Odoo {sp["crumb"]}">assistant · Odoo {sp["crumb"]}</small></p>
        <p class="ixw-cap-txt" aria-hidden="true"><span data-ixw-type>{intro_html}</span><i class="ixw-caret"></i></p>
        <p class="sr-only" aria-live="polite" data-ixw-live></p>
        <p class="ixw-cap-rec" data-ixw-rec aria-hidden="true"></p>
      </div>
      <div class="ixw-cap-side">
        <div class="ixw-cap-ctl">
          <button class="ixw-ibtn ixw-ibtn--prev" type="button" data-ixw-prev aria-label="Previous stop">{{{{icon:chevron}}}}</button>
          <button class="ixw-ibtn ixw-ibtn--play is-on" type="button" data-ixw-play aria-pressed="true" aria-label="Pause the tour">{{{{icon:pause}}}}{{{{icon:play}}}}</button>
          <button class="ixw-ibtn ixw-ibtn--next" type="button" data-ixw-next aria-label="Next stop">{{{{icon:chevron}}}}</button>
        </div>
        <div class="ixw-dots">{dots}</div>
      </div>
    </div>
  </div>
</section>

<div class="container ixw-credits-wrap">
  <h2 class="sr-only">At a glance</h2>
  <dl class="glance glance--ind ixw-credits ow-strip">{glance}</dl>
</div>'''


C_ROLE = "Client team · illustration"
SPEC = {
    "accountant": {
        "crumb": "Accounting", "hand": "odoo accounting · finance", "home": "1050,220",
        "short": "Invoices, bills, bank reconciliation, GST and month-end in one Odoo database.",
        "hint": "Tap the finance team, a screen, the close board or the stamp.",
        "intro": "Hi! I'm **Nexi**. This is the **finance office** at month-end, in Odoo Accounting. Tap around!",
        "outro": "Invoices, bills, the bank and the close, in **one place**. That's Odoo Accounting.",
        "reacts": "wow::Bank lines, **matched**!|love::A tidy month-end. **Love it**.|celebrate::Books closed. **Yay!**|think::Hmm… how long does **your** month-end take?",
        "cast": [
            {"id": "acc", "lab": "Accountant", "sub": "reconciling", "col": "#2E9C7E", "who": "Accountant", "role": C_ROLE, "aria": "the accountant", "near": "1050,220",
             "say": "Suggested matches on the bank lines. I check, then **validate**.", "x": 466, "y": 322, "w": 80, "h": 76},
            {"id": "ap", "lab": "Payables", "col": "#E0456B", "who": "Accounts payable", "role": C_ROLE, "aria": "accounts payable", "near": "1050,220",
             "say": "Bills come in, get matched to the PO, then **paid** in a batch.", "x": 774, "y": 322, "w": 80, "h": 76},
            {"id": "cfo", "lab": "Finance lead", "col": "#1E3A6E", "who": "Finance lead", "role": C_ROLE, "aria": "the finance lead", "near": "1050,220",
             "say": "Close checklist done, reports **ready**. Same day.", "x": 930, "y": 358, "w": 90, "h": 230}],
        "hots": [
            {"id": "bank", "dot": "bank", "lab": "Bank reconciliation", "icon": "{{icon:bank}}", "near": "1050,220", "x": 470, "y": -6, "w": 300, "h": 200,
             "rec": "Bank reconciliation · suggested matches", "say": "**Bank reconciliation**: statement lines matched to invoices and bills, ready to validate."},
            {"id": "invoices", "dot": "invoices", "lab": "Invoices", "icon": "{{icon:receipt}}", "near": "1050,220", "x": 700, "y": -66, "w": 140, "h": 80,
             "rec": "Customer invoices · sent, paid, overdue", "say": "**Customer invoices** sent from Odoo, with payment status on each one."},
            {"id": "bills", "dot": "bills", "lab": "Vendor bills", "icon": "{{icon:file}}", "near": "1050,220", "x": 700, "y": 40, "w": 140, "h": 80, "below": True,
             "rec": "Vendor bills · matched to purchase orders", "say": "**Vendor bills** matched to purchase orders and receipts, then paid in batches."},
            {"id": "tax", "dot": "GST", "lab": "GST return", "icon": "{{icon:layers}}", "near": "1050,220", "x": 880, "y": -66, "w": 120, "h": 80,
             "rec": "GST · the F5 return from your entries", "say": "**GST**: the tax report built from the entries you already posted."},
            {"id": "close", "dot": "month-end", "lab": "Month-end", "icon": "{{icon:calendar}}", "near": "1050,220", "x": 880, "y": 40, "w": 120, "h": 80, "below": True,
             "rec": "Month-end · the close checklist", "say": "**Month-end** as a checklist: accruals, reconciliations, lock date."},
            {"id": "reports", "dot": "reports", "lab": "Reports", "icon": "{{icon:bars}}", "near": "1050,220", "x": 470, "y": 137, "w": 300, "h": 50, "below": True,
             "rec": "Reports · P&amp;L, balance sheet, cash", "say": "**Reports** straight from the ledger: profit and loss, balance sheet, cash."}],
        "toys": [{"id": "stamp", "lab": "Stamp it paid", "near": "1050,220", "pose": "celebrate", "say": "Stamp! **Paid**, and matched.", "aria": "Stamp a bill paid", "x": 274, "y": 352, "w": 96, "h": 56}],
        "glance": [("layers", "App", "Odoo Accounting"), ("bank", "Bank", "Feeds and reconciliation"), ("receipt", "Covers", "Invoices · bills · GST · month-end"),
                   ("check", "Set up", "On a staging copy first"), ("users", "Team", "Singapore HQ · Philippines · Vietnam")],
    },
    "sale": {
        "crumb": "Sales", "hand": "odoo sales · quote to cash", "home": "1050,220",
        "short": "Quotations, e-signatures, orders and invoices, all in Odoo Sales.",
        "hint": "Tap the sales team, the quotation, the customer's tablet or the gift box.",
        "intro": "Hi! I'm **Nexi**. This is the **sales office**: quotes to orders to invoices, in Odoo Sales. Tap around!",
        "outro": "Quote, sign, deliver, invoice, **no re-typing**. That's Odoo Sales.",
        "reacts": "wow::Signed **online**!|love::Quote to cash in one app. **Love it**.|celebrate::Order confirmed. **Yay!**|think::Hmm… how long does a **quote** take you today?",
        "cast": [
            {"id": "rep", "lab": "Sales rep", "sub": "quoting", "col": "#E46E78", "who": "Sales rep", "role": C_ROLE, "aria": "the sales rep", "near": "1050,220",
             "say": "Products, prices and optional extras, in a quote in **minutes**.", "x": 480, "y": 322, "w": 80, "h": 76},
            {"id": "cust", "lab": "Customer", "sub": "signing", "col": "#3167CA", "who": "Customer", "role": C_ROLE, "aria": "the customer", "near": "1050,220",
             "say": "I signed and paid **online**, from my tablet.", "x": 930, "y": 358, "w": 90, "h": 230},
            {"id": "ops", "lab": "Sales ops", "col": "#F2A33A", "who": "Sales operations", "role": C_ROLE, "aria": "sales operations", "near": "1050,220",
             "say": "Confirmed orders go straight to the **warehouse** and to invoicing.", "x": 774, "y": 322, "w": 80, "h": 76}],
        "hots": [
            {"id": "quote", "dot": "quotation", "lab": "Quotation", "icon": "{{odoo:sale:18}}", "near": "1050,220", "x": 470, "y": -10, "w": 300, "h": 200,
             "rec": "Quotation · products, prices, optional extras", "say": "A **quotation** with your products, prices and optional extras, built in minutes."},
            {"id": "price", "dot": "pricelists", "lab": "Pricelists", "icon": "{{icon:layers}}", "near": "1050,220", "x": 700, "y": -66, "w": 140, "h": 80,
             "rec": "Pricelists · per customer, per quantity", "say": "**Pricelists** per customer group, currency and quantity, applied automatically."},
            {"id": "sign", "dot": "sign and pay", "lab": "Sign &amp; pay", "icon": "{{icon:check}}", "near": "1050,220", "x": 880, "y": -66, "w": 120, "h": 80,
             "rec": "Online · e-signature and payment", "say": "The customer **signs and pays online**, and the quote becomes an order."},
            {"id": "order", "dot": "order", "lab": "Sales order", "icon": "{{icon:receipt}}", "near": "1050,220", "x": 700, "y": 40, "w": 140, "h": 80, "below": True,
             "rec": "Sales order · confirmed from the quote", "say": "Confirmed, it's a **sales order**: nothing re-typed."},
            {"id": "deliver", "dot": "delivery and invoice", "lab": "Deliver &amp; invoice", "icon": "{{icon:truck}}", "near": "1050,220", "x": 880, "y": 40, "w": 120, "h": 80, "below": True,
             "rec": "Delivery and invoice · from the order", "say": "The order creates the **delivery** and the **invoice**, from the same lines."},
            {"id": "report", "dot": "dashboard", "lab": "Dashboard", "icon": "{{icon:bars}}", "near": "1050,220", "x": 260, "y": 30, "w": 140, "h": 120,
             "rec": "Sales dashboard · by rep, product, month", "say": "The **sales dashboard**: by rep, by product, by month, live."}],
        "toys": [{"id": "gift", "lab": "Open the extra", "near": "1050,220", "pose": "love", "say": "An **optional product**, added with one click.", "aria": "Open the optional product box", "x": 280, "y": 410, "w": 64, "h": 70}],
        "glance": [("layers", "App", "Odoo Sales"), ("receipt", "Covers", "Quotes · orders · invoices"), ("check", "Online", "E-signature and payment"),
                   ("truck", "Hands off to", "Inventory and Accounting"), ("users", "Team", "Singapore HQ · Philippines · Vietnam")],
    },
    "stock": {
        "crumb": "Inventory", "hand": "odoo inventory · warehouse", "home": "1000,200",
        "short": "Receipts, picking, packing, replenishment and counts in Odoo Inventory.",
        "hint": "Tap the warehouse team, the racks, the cart or the truck.",
        "intro": "Hi! I'm **Nexi**. This is the **warehouse**: every move tracked in Odoo Inventory. Tap around!",
        "outro": "Received, put away, picked, packed, counted. **That's** Odoo Inventory.",
        "reacts": "wow::Beep! **Scanned**.|love::Every bin has an address. **Love it**.|celebrate::Shipped on time. **Yay!**|think::Hmm… do you know your stock **right now**?",
        "cast": [
            {"id": "pick", "lab": "Picker", "sub": "scanning", "col": "#F2A33A", "who": "Picker", "role": C_ROLE, "aria": "the picker", "near": "1000,200",
             "say": "Scan the bin, scan the product. The picking list knows the **route**.", "x": 540, "y": 358, "w": 90, "h": 230},
            {"id": "pack", "lab": "Packer", "col": "#3167CA", "who": "Packer", "role": C_ROLE, "aria": "the packer", "near": "1000,200",
             "say": "Packed, labelled, and the carrier is **booked**.", "x": 800, "y": 322, "w": 80, "h": 76},
            {"id": "lead", "lab": "Warehouse lead", "col": "#2E9C7E", "who": "Warehouse lead", "role": C_ROLE, "aria": "the warehouse lead", "near": "1000,200",
             "say": "Reorder rules raise the purchase **before** we run out.", "x": 240, "y": 358, "w": 90, "h": 230}],
        "hots": [
            {"id": "receive", "dot": "receipts", "lab": "Receipts", "icon": "{{icon:truck}}", "near": "1000,200", "x": 940, "y": 410, "w": 180, "h": 120,
             "rec": "Receipt · WH/IN · checked against the PO", "say": "**Receipts** checked against the purchase order at the dock."},
            {"id": "putaway", "dot": "locations", "lab": "Locations", "icon": "{{icon:pin}}", "near": "1000,200", "x": 410, "y": 110, "w": 220, "h": 300,
             "rec": "Locations · every bin has an address", "say": "**Locations**: every shelf and bin has an address, so stock is never lost."},
            {"id": "picking", "dot": "picking", "lab": "Picking", "icon": "{{icon:check}}", "near": "1000,200", "x": 620, "y": 340, "w": 90, "h": 110,
             "rec": "Picking · barcode, route by location", "say": "**Picking** with a barcode scanner, in route order."},
            {"id": "packing", "dot": "pack and ship", "lab": "Pack &amp; ship", "icon": "{{icon:bag}}", "near": "1000,200", "x": 785, "y": 375, "w": 150, "h": 60, "below": True,
             "rec": "Pack and ship · labels and carriers", "say": "**Pack and ship**: shipping labels and carrier tracking from Odoo."},
            {"id": "reorder", "dot": "replenishment", "lab": "Replenishment", "icon": "{{icon:refresh}}", "near": "1000,200", "x": 760, "y": -40, "w": 180, "h": 110,
             "rec": "Replenishment · reorder rules, min and max", "say": "**Replenishment**: reorder rules raise purchases before stock runs out."},
            {"id": "count", "dot": "counts", "lab": "Counts", "icon": "{{icon:bars}}", "near": "1000,200", "x": 760, "y": 90, "w": 180, "h": 100,
             "rec": "Counts · cycle counts, adjustments logged", "say": "**Cycle counts** by location, with every adjustment logged."}],
        "toys": [{"id": "honk", "lab": "Honk the truck", "near": "1000,200", "pose": "wow", "say": "Beep beep! A **delivery** at dock 1.", "aria": "Honk the truck", "x": 955, "y": 262, "w": 150, "h": 70}],
        "glance": [("layers", "App", "Odoo Inventory"), ("pin", "Tracks", "Locations · lots · serials"), ("truck", "Covers", "Receipts · picking · shipping · counts"),
                   ("refresh", "Replenishment", "Reorder rules and routes"), ("users", "Team", "Singapore HQ · Philippines · Vietnam")],
    },
}
