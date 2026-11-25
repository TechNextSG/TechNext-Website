# -*- coding: utf-8 -*-
"""Campaign landing pages (owner 12 Nov 2026): "make sure all landing pages have a similar format like /bir-adviser-call,
no header distraction, the content should be variant, all have a fill-out form, proper funnelling", in the new brand voice.

12 Nov 2026 (evening), owner-approved fixes from the Sky review of /get-started (Drive 31./25-...-copy-review-sky):
hero = H1 (owner pick, PR #351) + the meeting outcome + the deadline + buttons
say what you get; the pain checklist sits straight after the hero (no score box); experts both "BIR Compliance Expert",
no sales or Odoo wording; the Day 1-5 rail and NextSprint section are gone (one 5 Day Express line instead); proof =
the BIR forms we set up; no Odoo in visible copy; "set up", "month end", "go live" without hyphens.

One layout, five pages. A page in _src/pages/ holds only its meta and {{LANDER:<key>}}; this module writes the body.
Funnel, top to bottom (every section ends on one action: scroll to the form, #book):
  1 hero: H1, deadline chip, what the meeting gives you, Blueprint first, proof; the form
    (desktop: right column, above the fold; phone: straight after the title)
  2 pain checklist (static list since 13 Nov 2026, no checkboxes)
  3 who you meet (two BIR Compliance Experts)
  4 what you leave with, beside a sample screen
  5 the page's own facts
  6 one line on the 5 Day Express (CAS pages) or the steps (e-invoicing)
  7 objections FAQ
  8 closing band with the deadline, back to the form
Header: logo only (gs-fx hides the menu, header buttons, floats and the BIR notice bar); no links out of the page.

Brand voice (8-12 Nov 2026 owner + Sky rules): written for the accountant; 5 days always with an asterisk; titles name
BIR CAS; "BIR Compliance Expert", never "adviser call" / "call" / "Google Meet"; the meeting is 15 minutes,
online, no charge, and ends with a Blueprint; no Odoo or ERP in visible copy, titles, meta or JSON-LD (the software is
"a plug-in beside your current software"); no fixed price, no "free", no BIR link or guarantee, no "ready / compliant /
accredited" claims, no other software brands, no Day 2-5 breakdown, no Lean / Agile / Six Sigma, British spelling,
no exclamation marks, no hyphens in set up / month end / go live.
13 Nov 2026 (owner): the hero Blueprint document card was removed from every lander ("not needed").
"""
import copy as _copy
import html as _html
import re as _re

import fw_needs as _FW
import industry_fx as _IFX
import sitedata as _S

_e = lambda s: _html.escape(s, quote=True)

PROOF = ('<strong>BIR forms we set up:</strong> books of accounts, 2307, SLSP, SAWT, QAP · '
         '<strong>142 projects delivered</strong>')
FINE = ('*Standard 5-day technical deployments available for clean, reconciled data ledgers. Bigger scopes run as extra sprints, written into '
        'your quote. We are not affiliated with, accredited by or acting for the BIR or any government agency, and we do '
        'not file or register on your behalf.')
BOOK = "https://technext.odoo.com/book/c82cf8a9"
UNDER = "15 minutes, online. Slots Monday to Saturday this week. Written quote before any work."
DL_CAS = ('<b>BIR CAS Deadline</b><span class="dl-sep dl-sep--wrap"> · </span><span data-fw-dl-static>31 December 2026</span><span data-fw-dl-live hidden>'
          '<b data-fw-days>--</b> <span data-fw-days-word>days</span> to 31 December 2026</span>')   # 25 Nov 2026 owner: "dont mention about jan 30. the only deadline is dec 31"
DL_EINV = ('<b>Deadline</b><span class="dl-sep"> · </span><span data-fw-dl-static>e-invoices by 31 December 2026</span><span data-fw-dl-live hidden>'
           '<b data-fw-days>--</b> <span data-fw-days-word>days</span> to 31 December 2026</span>')
SUB_CAS = ("Meet a BIR Compliance Expert online for 15 minutes. You leave with your BIR CAS Blueprint: what to set "
           "up, in what order, and a written quote.")
BTN_CAS = "Get my BIR CAS Blueprint"
BTN_EINV = "Get my e-invoicing plan"

# The two experts (owner 8 Nov 2026: Neil + Jeric). On the landers both are BIR Compliance Experts; no sales or Odoo wording.
EXPERTS = [
    dict(name="Neil Matan", photo="astroneil-matan.webp",
         sum="Neil has set up finance and tax systems for 80+ companies over 24 years, from the first workshop to go live, "
             "including local tax and multi entity reporting.",
         stats=[("24+", "years setting up finance systems"), ("80+", "companies set up"), ("10", "years on the system we set up")]),
    dict(name="Jeric Bulayungan", photo="jeric-bulayungan.webp",
         sum="Jeric has helped Philippine businesses choose and plan their accounting, payroll and point of sale systems "
             "since 2016. Your Blueprint meeting often starts with Jeric.",
         stats=[("2016", "helping PH businesses since"), ("8+", "years in business systems"), ("2", "experts in Taguig City")]),
]


def _panel(key, **fix):
    p = _copy.deepcopy(next(n["panel"] for n in _FW.NEEDS if n["key"] == key))
    p.update(fix)
    return p


CAS_PANEL = _panel("cas", sub="Prepared from your set up", steps=["System set up", "Samples printed", "Accountant checks", "You file at your RDO"])
P2307_PANEL = _panel("2307")
EINV_PANEL = dict(app="account", title="Customer invoice", sub="INV/2026/00184 · Sample Trading Corp.",
                  steps=["Draft", "Posted", "Locked", "To EIS provider"],
                  kpis=[("Invoice total", 122000, "₱", "", 0), ("Branches", 3, "", "", 0), ("Invoice layouts", 1, "", "", 0)],
                  mid=("table", ["Line", "Qty", "Amount"], [
                      ("Service retainer, October", "1", "₱80,000.00"),
                      ("Implementation hours", "12", "₱42,000.00"),
                      ("Status", "Head office", ("Draft", "Posted", "warn"))]),
                  post=dict(app="accountant", title="Journal entry", ref="INV/2026/00184",
                            rows=[("Dr", "Receivable", "122,000.00"), ("Cr", "Sales", "108,928.57"), ("Cr", "Output VAT", "13,071.43")]),
                  chips=["One series per branch", "No edits after posting", "Credit note for a decrease"])

CHECKS_MONTH = [
    ("Invoices typed in Word or spreadsheets", "<b>Invoices are typed in Word or spreadsheets,</b> with no audit trail behind them."),
    ("2307s re-typed every quarter", "<b>Someone re-types 2307 certificates every quarter</b> and chases suppliers for the missing ones."),
    ("SLSP, SAWT, QAP rebuilt in spreadsheets", "<b>SLSP, SAWT and QAP are rebuilt in spreadsheets</b> the week they are due."),
    ("Books and sales in separate systems", "<b>Sales and the books live in separate systems,</b> so month end starts with reconciling them."),
    ("CAS paperwork stuck", "<b>Your CAS paperwork keeps stalling</b> on the system description and sample outputs."),
    ("Only one person knows the month end file", "<b>Only one person knows the month end file,</b> and filing stops when they are on leave.")]

FAQ_SOFTWARE = ("Do we have to change our accounting software?",
                "No. Your current software stays. We connect it by API, daily batch sync or flat-file upload, and your BIR books and reports are built from that data. No rip-and-replace.")
FAQ_COST = ("What does it cost?",
            "You don't need a million-peso system overhaul to meet BIR requirements. Pricing scales based on your branch network and integration complexity, and you get a written quote before any work starts. The meeting has no charge.")
FAQ_LINK = ("Is TechNext linked to the BIR?",
            "No. We are not affiliated with or acting for the BIR. You register and file yourself; we set your system up and prepare the sample outputs with you.")
FAQ_5DAY = ("How long does the 5 Day Express* take?",
            "Standard 5-day technical deployments are available for clean, reconciled data ledgers.* Bigger scopes, more branches or messy data run as extra sprints, and your quote says so before you agree to anything. Your RDO sets its own timeline for the registration.")

CLOSE_P = ("Fill in the short form (about a minute), then pick your time in the calendar. "
           "<strong>15 minutes, online, no charge.</strong> Any work starts with a written quote.")

# ---------------------------------------------------------------------------------------------------------------- pages
PAGES = {   # H1 titles: owner pick 12 Nov 2026 (PR #351); 13 Nov the owner copy doc below replaces four of them.
    # Meta ads 233 / 235 / 246 / 247. Form tag stays "Meeting request" (api/lead.py FORMS).
    "get-started": dict(
        source="Meeting request (get-started call-back form)",
        pill=DL_CAS,
        h1='Your <span class="hl">BIR CAS</span> Setup, Done in <span class="hl">5 Days</span>.*',
        sub=SUB_CAS,
        ticks=["<b>Your BIR CAS Blueprint</b> from the meeting: what to set up, in what order.",
               "<b>Keep your current software.</b> Nothing is swapped out.",
               "<b>A written quote</b> before any work starts."],
        btn=BTN_CAS,
        msg_ph="e.g. accounting software plus spreadsheets today, 2 branches, CAS registration due",
        check_h="How much of your month end is still done by hand?", checks=CHECKS_MONTH,
        bp_h='What you leave the meeting with.',
        bp_lead="One online meeting with a BIR Compliance Expert. You leave with a plan.",
        bp=["Where your books stand against the BIR CAS requirements",
            "CAS or CBA: which one you register, checked with your accountant",
            "What your 5 Day Express* covers for your scope",
            "A written quote before any work starts"],
        panel=CAS_PANEL, facts=None, express=True,
        faq=[FAQ_5DAY, FAQ_SOFTWARE, FAQ_COST,
             ("Who do we meet?", "A BIR Compliance Expert from our own team in Taguig City, Neil or Jeric. They look at how you record sales, bills and payments today and stay with you after go live."),
             FAQ_LINK],
        close_h='31 December 2026 is close. Start your <span class="hl">BIR CAS</span> today.',
        close_p="<strong>15 minutes, online, no charge.</strong> Any work starts with a written quote.",
    ),
    # Meta traffic ads 225 / 228 (3 Nov notes). Form tag "BIR adviser call".
    "bir-adviser-call": dict(
        source="BIR adviser call",
        pill=DL_CAS,
        h1='<span class="hl">BIR CAS</span> Setup. Keep Your Software.',
        sub=SUB_CAS,
        ticks=["<b>Your BIR CAS Blueprint</b> from the meeting: which papers your application needs, and where each comes from.",
               "<b>Process flow, sample invoices and books,</b> prepared with you and checked against Annex B.",
               "<b>A written quote</b> before any work starts."],
        btn=BTN_CAS,
        msg_ph="e.g. new system to register as a CAS, head office and 2 branches",
        check_h="Where is your CAS application stuck?",
        checks=[("No system description yet", "<b>Nobody has written the system description</b> the sworn statement needs."),
                ("Sample outputs from the wrong system", "<b>Your sample invoices and books</b> come from a system that was never set up for them."),
                ("No audit trail printout", "<b>The system can't print an audit trail</b> showing who changed what, and when."),
                ("Annex B never checked", "<b>Nobody has checked the Annex B requirements</b> against your set up and hosting."),
                ("Branches invoice their own way", "<b>Each branch issues invoices its own way,</b> with its own series or layout."),
                ("Not sure CAS or CBA", "<b>You are not sure</b> whether you register a CAS or a CBA.")],
        bp_h='What you leave the meeting with.',
        bp_lead="One online meeting with a BIR Compliance Expert. You leave knowing what to file and how to get there.",
        bp=["CAS or CBA: which one you register",
            "Which papers your application needs, and where each one comes from",
            "What your 5 Day Express* covers for your scope",
            "A written quote before any work starts"],
        panel=CAS_PANEL, facts="rmc", express=True,
        faq=[("Do we need a CAS or a CBA?", "RMO 9-2021 draws the line at invoices. If your system issues them, it is a CAS; if invoices are issued by hand and the system keeps your books, it is a CBA. Large taxpayers must use a CAS. We go through it with your accountant, and your RDO can confirm it."),
             ("Is TechNext BIR-accredited?", "No, and no accounting software is. The BIR registers each business's use of a system, not a software brand, and it has warned against \"BIR-accredited\" claims. We set your system up for the BIR's requirements and prepare the sample outputs with you."),
             ("We already have a CAS permit for our current system. What happens?", "A new accounting system usually needs its own BIR registration. Check the details with your accountant; we prepare the process flow and sample outputs from the system you will actually use."),
             FAQ_SOFTWARE, FAQ_COST],
        close_h='Don\'t wait for the deadline. Start your <span class="hl">BIR CAS</span> today.',
        close_p=CLOSE_P,
    ),
    # Google Ads test page (variant B, noindex).
    "bir-call": dict(
        source="BIR adviser call (fast form B)",
        pill=DL_CAS,
        h1='<span class="hl">BIR CAS</span> Books. Set Up Before 31 December 2026.',
        sub="Meet a BIR Compliance Expert online for 15 minutes. You leave with your BIR CAS Blueprint: which books "
            "you register, what to set up first, and a written quote.",
        ticks=["<b>Your BIR CAS Blueprint</b> from the meeting: what has to be in place first.",
               "<b>Journals, ledger and subsidiary books</b> printed from one system, reviewed by your accountant.",
               "<b>A written quote</b> before any work starts."],
        btn=BTN_CAS,
        msg_ph="e.g. books in spreadsheets today, CAS registered last year, 1 branch",
        check_h="How ready are your books?",
        checks=[("Books kept in spreadsheets", "<b>Your books are kept in spreadsheets</b> and pasted together at year end."),
                ("Journals don't match the ledger", "<b>The journals and the general ledger</b> don't agree until someone fixes them by hand."),
                ("Year end close takes weeks", "<b>Closing the year takes weeks,</b> not days."),
                ("Books printed from several systems", "<b>Your books print from several systems</b> with different layouts."),
                ("Only one person knows the year end file", "<b>Only one person knows the year end file,</b> and January is their busiest month.")],
        bp_h='What you leave the meeting with.',
        bp_lead="One online meeting with a BIR Compliance Expert, before your books are due.",
        bp=["Which books you register, and in what format",
            "What has to be in place first",
            "What your 5 Day Express* covers for your scope",
            "A written quote before any work starts"],
        panel=CAS_PANEL, facts="rmc", express=True,
        faq=[FAQ_SOFTWARE, FAQ_5DAY,
             ("Do you register the books for us?", "No. You register them yourself. We set up the system your books come from and prepare them with you and your accountant."),
             FAQ_COST],
        close_h='31 December 2026 is close. Start your <span class="hl">BIR CAS</span> books today.',
        close_p=CLOSE_P,
    ),
    # 12 Nov 2026: the BIR CAS topic lander (the /bir-cas page stays the menu / Google page).
    "bir-cas-for-accountants": dict(
        source="BIR adviser call (accountants lander)",
        pill=DL_CAS,
        h1='<span class="hl">BIR CAS</span> for Accountants. <span class="hl">5 Day</span> Setup.*',
        sub="Meet a BIR Compliance Expert online for 15 minutes. You leave with your BIR CAS Blueprint: which reports "
            "come straight from your books, in what order to set them up, and a written quote.",
        ticks=["<b>Your BIR CAS Blueprint</b> from the meeting: 2307, SLSP, SAWT and QAP from the entries you already post.",
               "<b>Keep your current software.</b> Nothing is typed twice.",
               "<b>You and your accountant review,</b> we set it up."],
        btn=BTN_CAS,
        msg_ph="e.g. 40 payees a quarter, SLSP rebuilt in spreadsheets, CAS registration due",
        check_h="What does your quarter end look like?",
        checks=[("2307s typed by hand", "<b>2307 certificates are typed by hand</b> every quarter, one payee at a time."),
                ("Missing 2307s chased", "<b>You chase suppliers</b> for the 2307s that never arrived."),
                ("SLSP rebuilt from exports", "<b>The SLSP is rebuilt from exports</b> the week it is due."),
                ("SAWT and QAP totals don't match", "<b>SAWT and QAP totals don't match</b> the books on the first try."),
                ("ATC codes looked up every time", "<b>ATC codes are looked up</b> every time a bill is entered."),
                ("2550Q built in a separate file", "<b>The 2550Q VAT summary</b> is built in a separate file.")],
        bp_h='What you leave the meeting with.',
        bp_lead="One online meeting with a BIR Compliance Expert who speaks accountant.",
        bp=["Which of your reports can come straight from the books",
            "How your ATC codes and withholding taxes are set up",
            "What your 5 Day Express* covers for your scope",
            "A written quote before any work starts"],
        panel=P2307_PANEL, facts="quarter", express=True,
        faq=[("Can the system produce our 2307s, SLSP, SAWT and QAP?", "Yes. The plug-in we connect to your current software generates 2306 and 2307 certificates from vendor bills, and SLSP, SAWT and QAP with DAT exports, from the same entries as your books."),
             FAQ_SOFTWARE,
             ("Who checks the set up?", "You and your accountant. Our BIR Compliance Experts set up the taxes and reports; your accountant reviews the outputs before anything is filed."),
             FAQ_LINK, FAQ_COST],
        close_h='Your next quarter end, from one set of books. Start your <span class="hl">BIR CAS</span> today.',
        close_p=CLOSE_P,
    ),
    # 12 Nov 2026: the e-invoicing topic lander (the /bir-e-invoicing page stays the menu / Google page). Not for ads
    # yet (ads are CAS-first, no e-invoicing).
    "bir-e-invoicing-plan": dict(
        source="BIR adviser call (e-invoicing lander)",
        pill=DL_EINV,
        h1='<span class="hl">BIR E-Invoicing</span> Setup Before 31 December 2026.',
        sub="Meet a BIR Compliance Expert online for 15 minutes. You leave with your e-invoicing plan: whether you are "
            "covered, what to set up, in what order, and a written quote.",
        ticks=["<b>Your e-invoicing plan</b> from the meeting: PTI papers, invoice flows and branches, in order.",
               "<b>Keep your current software.</b> We connect the invoicing to it.",
               "<b>Your EIS route,</b> through a BIR-accredited e-invoicing service provider you choose."],
        btn=BTN_EINV,
        msg_ph="e.g. large taxpayer, invoices from our POS and spreadsheets, 3 branches",
        check_h="How do you invoice today?",
        checks=[("Invoices printed or emailed as PDF", "<b>Invoices are printed or emailed as PDFs,</b> which are not e-invoices."),
                ("Invoices typed in Word or spreadsheets", "<b>Invoices are typed in Word or spreadsheets</b> with no lock after issue."),
                ("Branches invoice their own way", "<b>Each branch invoices its own way,</b> with its own series or layout."),
                ("Issued invoices get edited", "<b>Issued invoices get edited</b> instead of a credit note."),
                ("No plan for system downtime", "<b>There is no plan</b> for invoicing when the system is down."),
                ("Not sure if covered", "<b>You are not sure</b> whether your business is covered.")],
        bp_h='What you leave the meeting with.',
        bp_lead="One online meeting with a BIR Compliance Expert, before the deadline.",
        bp=["Whether your business is covered, checked with your accountant",
            "How your invoice flows and branches move into one system",
            "What your BIR-accredited e-invoicing provider will need from your system",
            "A written quote before any work starts"],
        panel=EINV_PANEL, facts="einv", express=False,
        faq=[("How does the set-up help with the 31 December 2026 e-invoicing deadline?", "We set up sequenced invoice series per branch and lock issued invoices, so the system follows the e-invoicing rules in RR 26-2025 (the date kept by RMC 98-2026). Any EIS connection runs through a BIR-accredited e-invoicing service provider you choose (RMC 110-2026). Your accountant or RDO confirms whether you are covered."),
             ("What is a Permit to Issue (PTI)?", "The BIR permit a covered taxpayer needs before issuing any e-invoice. EIS Certification must then be completed within six months of the PTI. You apply for it yourself; we prepare the process flow and sample invoices with you."),
             ("Do you connect us to the EIS?", "The system we set up has no built-in connection to the BIR's EIS, and TechNext has not built one. If you are covered, the connection runs through a BIR-accredited e-invoicing service provider you choose (RMC 110-2026); TechNext does not provide it."),
             FAQ_SOFTWARE, FAQ_COST],
        close_h='31 December 2026 is close. Start your <span class="hl">BIR e-invoicing</span> plan today.',
        close_p=CLOSE_P,
    ),
    # 12 Nov 2026 (owner: "Yes, build it"): the "31 December Ready" campaign lander for accountants, accounting firms and
    # consultants (Drive 02/32. TechNext CAS and E-Invoicing Deadline Campaign). Facts only from RR 26-2025 / RMC 98-2026
    # as already cited on /bir-e-invoicing: no penalty figures, no PTI review days, no connector claims.
    "bir-deadline": dict(
        source="BIR adviser call (deadline campaign, accountants)",
        pill=DL_EINV,
        h1='E-Invoicing for <span class="hl">BIR CAS</span> Users by 31 December 2026. Your Plan in 20 Minutes.',
        sub="A CAS registration doesn't cover e-invoicing. The first step is a Permit to Issue, then EIS Certification. "
            "Meet a BIR Compliance Expert online for 15 minutes and leave with your Blueprint: the coverage rules (your accountant or RDO confirms), what "
            "to file first, and a written quote.",
        ticks=["<b>Your CAS and e-invoicing Blueprint</b> from the meeting: the order of work, for you or your client.",
               "<b>Keep the accounting software.</b> We connect to it by API, batch sync or flat file; nothing is swapped out.",
               "<b>A written quote</b> before any work starts."],
        btn="Get my Blueprint", form_h="Get your CAS and e-invoicing Blueprint",
        msg_ph="e.g. accounting firm, 12 clients on CAS, most still email PDF invoices",
        order=["hero", "myths", "facts", "blueprint", "firm", "faq", "close"],
        myths=("3 assumptions we hear from CAS users every week.",
               "Each one is a reason your client's e-invoicing slips past 31 December.",
               [("“Our CAS registration covers us.”",
                 "It covers your computerised books. E-invoicing needs its own Permit to Issue first, then EIS Certification within six months."),
                ("“We email PDF invoices, so we're electronic.”",
                 "A printed or emailed PDF is not an e-invoice. Covered taxpayers need a system that sends sales data the BIR's system can read."),
                ("“We'll sort it out in December.”",
                 "December is year end close, and every RDO gets the same rush. The order of work is decided now.")]),
        checks=None,
        bp_h='Your Blueprint, in 15 minutes.',
        bp_lead="One online meeting with a BIR Compliance Expert. You leave with a plan for you or your client.",
        bp=["Covered now, later or exempt: the rules, gone through with you; your accountant or RDO confirms",
            "CAS or CBA, and what your books need",
            "The e-invoicing order: Permit to Issue, set up, EIS Certification",
            "What your 5 Day Express* covers, and a written quote"],
        panel=EINV_PANEL, facts="cover", express=False,
        firm=("We set up the system. You keep the client.",
              "For accounting firms and consultants with clients facing the same deadline.",
              ["<b>You stay the adviser.</b> We connect the system to your client's software and report to you.",
               "<b>One Blueprint per client.</b> Start with one case, then plan the rest in the same order.",
               "<b>No surprises for the client.</b> A written quote before any work, agreed with you."]),
        faq=[("Does our CAS registration cover e-invoicing?", "No. Under RMC 98-2026 a CAS or CBA registration doesn't give e-invoicing authority. You need a Permit to Issue (PTI) first, then EIS Certification within six months of the PTI."),
             ("We're an accounting firm. Can we bring a client case?", "Yes. Book one meeting per client and join it with them. You leave with that client's Blueprint and a written quote."),
             ("How does the set-up help with the 31 December 2026 e-invoicing deadline?", "We set up sequenced invoice series per branch and lock issued invoices, so the system follows the e-invoicing rules in RR 26-2025 (the date kept by RMC 98-2026). Any EIS connection runs through a BIR-accredited e-invoicing service provider you choose (RMC 110-2026). Your accountant or RDO confirms whether you are covered."),
             ("Do you connect us to the EIS?", "The system we set up has no built-in connection to the BIR's EIS, and TechNext has not built one. If you are covered, the connection runs through a BIR-accredited e-invoicing service provider you choose (RMC 110-2026); TechNext does not provide it."),
             ("Do you file with the BIR for us?", "No. You or your client apply and file at the RDO. We set up the system and prepare the process flow and sample outputs with you."),
             FAQ_COST],
        close_h='Beat the December rush. Plan your <span class="hl">BIR CAS</span> and e-invoicing today.',
        close_p="December is year end close. <strong>15 minutes, online, no charge.</strong> "
                "Any work starts with a written quote.",
    ),
}

# ------------------------------------------------------------------------------ 13 Nov 2026 owner copy doc (firms angle)
# Owner: "use this ... to update the landing page" = Google Doc 1pNryBz7b5olW3oQ1NoqgOugAM4ocZMha1d7QinH79c8
# ("TechNext Landing Pages Update - 2026 BIR Deadlines", for accounting firms, consultants and accountants).
# Applied to get-started + bir-adviser-call (section 1), bir-cas-for-accountants (2), bir-call (3), bir-e-invoicing-plan (4),
# plus the universal FAQ and the "primary goal" question. Adapted to the house rules: no Odoo / ERP / "call" / Excel in
# visible copy, no "compliant / BIR-ready / perfectly" claims, no penalty threats, no "download" (no checklist file exists),
# no "partnership" or "dedicated channel" promises, 5 days always with an asterisk, no hyphens in set up / quarter end.
DL_BOTH = DL_EINV   # 25 Nov 2026: 31 December only
BTN_DOC = "Secure my Blueprint"
GOALS = [("cas", "Registering CAS or CBA"),   # 25 Nov 2026: no 30 January (site.js NEED, api/lead.py TOPICS)
         ("einv", "E-invoicing readiness before 31 December"),
         ("quarter", "Automating quarter end reports (SLSP, 2307s)"),
         ("firm", "Set ups for my clients (accounting firm or consultant)")]
# 26 Nov 2026 (audit): shorter text SHOWN in the select so it fits a phone; the sent value stays the long text above,
# so site.js NEED, api/lead.py TOPICS and the CRM tags are unchanged
GOAL_SHOW = {"einv": "E-invoicing before 31 December", "quarter": "Quarter end SLSP and 2307s",
             "firm": "Set ups for my clients"}
FAQ_U = [
    ("Do we, or our clients, have to change our core accounting software?",
     "No. Your current software stays exactly as it is. We connect a plug-in to it for the BIR books, reports and e-invoicing set up."),
    ("Can the system produce the DAT files for the BIR's offline tools?",
     "Yes. The Philippine set up exports SLSP, SAWT and QAP as DAT files from your posted entries, so the figures match your books."),
    ("Are you connected to the BIR's EIS for e-invoicing?",
     "Not directly. The system we set up prepares the groundwork: your Permit to Issue papers, branch mapping and a locked audit trail. "
     "If you are covered, the connection runs through a BIR-accredited e-invoicing service provider you choose (RMC 110-2026); "
     "TechNext does not provide it."),
    ("Is TechNext \"BIR-accredited\"?",
     "No software brand is \"BIR-accredited\": the BIR registers a business's use of a system. We set the system up for the BIR's "
     "requirements and help you prepare the sample outputs, audit trail and process flow for your CAS or CBA application at your RDO."),
    FAQ_COST]

_FIRM = dict(
    pill=DL_BOTH, goal="firm", btn=BTN_DOC,
    h1='<span class="hl">5 Days</span> to Your <span class="hl">BIR CAS</span> Setup.* No Disruption to Your Clients\' Software.',
    sub="The plug-in that lets consultants and accounting firms fast track BIR CAS for their clients. Upgrading a client's "
        "software for the BIR usually means a costly overhaul and months of disruption. We connect to their existing "
        "software by API, batch sync or flat file: they keep what they know, and you get the BIR books and reports their CAS application needs.",
    ticks=["<b>No migration headaches.</b> We don't rip and replace; their core system stays untouched.",
           "<b>The 5 Day Express*.</b> A fast set up, so you hit client deadlines with time to spare.",
           "<b>Scale your firm.</b> One set up approach across your whole client portfolio."],
    msg_ph="e.g. accounting firm, 8 clients due for CAS, sample outputs keep getting sent back",
    check_h="The CAS application roadblock.",
    check_lead="If your firm handles CAS applications, you know where it stalls. Which of these sounds familiar?",
    checks=[("Software can't produce the sample outputs", "<b>The client's current software can't produce</b> the sample outputs the RDO asks for."),
            ("Billable hours on process flows", "<b>You spend billable hours rebuilding process flows</b> the software should produce."),
            ("No audit trail", "<b>The system has no audit trail</b> showing who did what, and when."),
            ("LOA means digging through folders", "<b>A Letter of Authority sends everyone digging</b> through paper folders, because nothing is in one place.")],
    bp_h="We build the Blueprint. You deliver the strategy.",
    bp_lead="We handle the technical heavy lifting, so you can focus on advisory and tax strategy.",
    bp=["<b>Sample outputs on demand:</b> the sample invoices and books of accounts the CAS or CBA application needs, printed from your client's real data",
        "<b>Audit trail and system description:</b> posted entries locked, every change logged, checked against Annex B",
        "<b>Direct access to our BIR Compliance Experts</b>, Neil and Jeric, in Taguig City: no generic help desk, no hand-off",
        "<b>A written quote</b> before any work starts"],
    faq=FAQ_U,
)
PAGES["get-started"].update(_copy.deepcopy(_FIRM))
PAGES["bir-adviser-call"].update(_copy.deepcopy(_FIRM))

PAGES["bir-cas-for-accountants"].update(
    pill=DL_BOTH, goal="quarter", btn=BTN_DOC,
    h1='Reclaim Your <span class="hl">BIR CAS</span> Quarter End. Stop Rebuilding <span class="hl">SLSP</span> in Spreadsheets.',
    sub="The plug-in built to give accountants and bookkeepers their weekends back. Every BIR report comes straight from the "
        "entries you already post. You reconcile once, and the system handles the rest.",
    ticks=["<b>Never type a 2307 again.</b> Generated from your vendor bills.",
           "<b>No double entry.</b> DAT files come straight from the ledger.",
           "<b>Built for accountants.</b> Reviewed by you, set up by us."],
    check_h="Let's be honest: your quarter end is a mess of manual data entry.",
    check_lead="Every hour spent re-typing is an hour not billed, and a mistake waiting to be filed.",
    checks=[("2307s typed by hand", "<b>Typing 2307 certificates by hand</b> for every supplier, and chasing lost copies."),
            ("SLSP, SAWT and QAP rebuilt", "<b>Rebuilding SLSP, SAWT and QAP</b> by hand the week they are due."),
            ("Stock, sales and books in separate systems", "<b>Reconciling stock, sales and books</b> that live in different systems."),
            ("Branch invoices in different layouts", "<b>Consolidating branch invoices</b> that use different layouts and series.")],
    bp_h="Your quarter end, sorted.",
    bp_lead="Set it up once. Every report comes from the entries you already post.",
    bp=["<b>2307s on autopilot:</b> set your ATC codes once, and 2307 and 2306 certificates come from your vendor bills",
        "<b>DAT file exports:</b> SLSP and QAP exported as DAT files from posted entries, so the figures match your books",
        "<b>2550Q VAT summary:</b> output and input VAT from your posted entries, for your quarterly filing",
        "<b>A written quote</b> before any work starts"],
    facts=None, faq=FAQ_U,
)

PAGES["bir-call"].update(
    goal="cas", btn=BTN_DOC,
    h1='Are Your <span class="hl">BIR CAS</span> Books Ready?',
    sub="We set the system up so your firm's and clients' books of accounts agree before you review and register them.",
    ticks=["<b>Match before you print.</b> Journals and ledger that agree in the system.",
           "<b>A fast set up.</b> As quick as 5 days* for a standard scope.",
           "<b>Keep existing systems.</b> We connect the reporting plug-in to them."],
    check_h="What needs to be in place?",
    check_lead="This is what has to be in place before your clients register.",
    checks=[("Books not from one system", "<b>Books from one system:</b> journals, general ledger and subsidiary books printed from the registered system."),
            ("Entries don't agree", "<b>Entries that agree:</b> reconciling after printing is a red flag; they must match in the system."),
            ("Year not closed", "<b>The year closed:</b> 2026 entries posted and locked."),
            ("No time for review", "<b>Your review:</b> time to check the formats before you register.")],
    facts=None,
    faq=FAQ_U,
)

PAGES["bir-e-invoicing-plan"].update(
    goal="einv", btn=BTN_DOC,
    h1='<span class="hl">BIR E-Invoicing</span> by 31 December. Get Your Blueprint Today.',
    sub="Help your clients through the EIS rules with a structured, multi branch e-invoicing set up. Covered taxpayers must "
        "issue e-invoices by 31 December 2026; RMC 98-2026 kept the date. We map your clients' invoice flows, prepare their "
        "Permit to Issue papers with them, and connect the invoicing to their current software.",
    ticks=["<b>Permit to Issue papers.</b> We prepare the process flows and sample invoices; you apply.",
           "<b>Multi branch.</b> Each branch on its own series, with head office seeing them together.",
           "<b>EIS connection.</b> Through a BIR-accredited e-invoicing service provider you choose."],
    check_h="The e-invoicing rules leave no room.",
    check_lead="Can your client's current software handle RR 26-2025 and RMC 98-2026?",
    checks=[("No lock after issue", "<b>No edits after issue:</b> does the system lock invoices and use credit notes for decreases?"),
            ("No downtime plan", "<b>Downtime:</b> is there a plan for BIR-authorised manual invoices when the system is down?"),
            ("Branches not in one view", "<b>Branches:</b> is every branch on its own series, feeding one view?"),
            ("Not ready for EIS Certification", "<b>EIS Certification:</b> are you ready to complete it within six months of the PTI?")],
    steps_h="From the first meeting to your PTI papers.",
    steps=[("Map the invoice flows", "With your firm: customer invoices, credit notes and branch structures."),
           ("Set up and test", "Taxes and invoice layouts, tested on a copy of your client's real data."),
           ("Prepare the application", "Process flows and sample invoices from the system. You and your client apply for the PTI."),
           ("Prepare for the EIS provider", "Your client's invoice data set up for the BIR-accredited e-invoicing service provider they choose (RMC 110-2026). TechNext does not provide the EIS connection.")],
    facts=None, faq=FAQ_U, form_h="Get your e-invoicing Blueprint",
)


# ------------------------------------------------------------- 13 Nov 2026: one page per FB ad 265 / 266 / 267 (CPA overhaul)
# User 13 Nov: "make sure everything properly linked (landing page)" + "Fix all 4". Each ad gets its own noindex page so the
# message, deadline and button match the ad (scent trail) without touching the owner-approved landers above. Rules for these
# pages (user 12-13 Nov): no Odoo / plug-in / ERP / Instant in visible copy (user 13 Nov: hero sub names the 5 Day Express BIR Solution*), every page names its deadline and
# urgency, 5 days always with an asterisk, no guarantees, not affiliated with the BIR.
FAQ_KEEP = ("Do we, or our clients, have to change our core accounting software?",
            "No. Your current software stays exactly as it is. We connect to it by API, daily batch sync or flat-file upload, "
            "and the BIR books and reports are built from that data. No rip-and-replace, no double entry.")
FAQ_TIME = ("How long does the set up take?",
            "For ledgers with clean, reconciled data, a standard technical deployment takes 5 days.* Bigger scopes, more "
            "branches or messy data run longer, and your written quote says so before you agree to anything. Your RDO sets its "
            "own timeline for any registration.")

# FB ad 265 "Automate BIR Compliance. Keep Your Current System." (Quarter-End)
PAGES["bir-quarter-end"] = dict(_copy.deepcopy(PAGES["bir-cas-for-accountants"]))
PAGES["bir-quarter-end"].update(
    source="BIR adviser call (FB ad 265 quarter end)",
    pill=DL_CAS, goal="quarter",
    h1='Automate <span class="hl">BIR Compliance</span>. <span class="hl">Keep Your Current System.</span>',
    sub="Stop rebuilding your clients' SLSP, SAWT, QAP and 2307s in spreadsheets every quarter. Set up automated BIR "
        "reporting beside the software they already use, before the holidays. Our <b>5 Day Express BIR Solution*</b> sets it up for clean, reconciled ledgers.",
    ticks=["<b>Data in once.</b> From their POS or current system, no double entry.",
           "<b>Mapped to ATC codes.</b> Every transaction to the right tax code.",
           "<b>Reconciled to the ledger.</b> CAS journals, DAT files and 2307s from the same entries."],
    btn="Book my workflow review", form_h="Book your workflow review",
    msg_ph="e.g. 40 payees a quarter, SLSP rebuilt in spreadsheets",
    express=False,
    steps_h="How it works.",
    steps=[("Ingest", "Data comes in from their POS or current accounting system."),
           ("Map", "Each transaction is mapped to the correct Alphanumeric Tax Code (ATC)."),
           ("Generate", "Matching CAS journals, DAT files and 2307s, reconciled to the general ledger."),
           ("Review and file", "You and your accountant review the outputs; you file. 5 days* for clean, reconciled ledgers.")],
    bp=["<b>2307s from vendor bills:</b> set your ATC codes once, and 2307 and 2306 certificates come from the bills",
        "<b>DAT file exports:</b> SLSP, SAWT and QAP from posted entries, so the figures match your books",
        "<b>A written quote</b> before any work starts"],
    faq=[("Can the system produce our 2307s, SLSP, SAWT and QAP?",
          "Yes. The set up generates 2306 and 2307 certificates from vendor bills, and SLSP, SAWT and QAP with DAT exports, "
          "from the same entries as your books."),
         FAQ_KEEP, FAQ_TIME, FAQ_LINK, FAQ_COST],
    close_h='31 December 2026 is close. <span class="hl">Start before the holidays</span>.',
    close_p="<strong>15 minutes, online, no charge.</strong> Any work starts with a written quote.",
)

# FB ad 266 "CPA Partners: Two BIR Deadlines, 30 Days Apart" (on hold in Meta, page ready)
PAGES["bir-firm-deadlines"] = dict(_copy.deepcopy(PAGES["bir-deadline"]))
PAGES["bir-firm-deadlines"].update(
    source="BIR adviser call (FB ad 266 firm deadlines)",
    pill=DL_BOTH, goal="firm",
    h1='CPA Partners: The <span class="hl">BIR Deadline</span> Is 31 December 2026.',
    sub="31 December 2026: e-invoicing for covered taxpayers. RMC 98-2026 kept the date, and the holidays come first. We handle the technical heavy lifting across your "
        "client portfolio with our <b>5 Day Express BIR Solution*</b>; you keep the tax advisory.",
    ticks=["<b>We handle:</b> data ingestion, multi branch invoice sequencing and audit trails.",
           "<b>You handle:</b> the tax advisory for your clients. Your firm stays the adviser.",
           "<b>A written quote</b> per client before any work starts."],
    btn="Book my partner meeting", form_h="Book your partner meeting",
    bp=["Covered now, later or exempt: the rules, gone through with you; your accountant or RDO confirms",
        "CAS or CBA, and what each client's books need",
        "The e-invoicing order: Permit to Issue, set up, EIS Certification",
        "What the set up covers for each client, and a written quote"],
    close_h='31 December is weeks away. <span class="hl">Book before the December rush.</span>',
)

# FB ad 267 (CPA Overhaul) audit trail lander
PAGES["bir-audit-trail"] = dict(_copy.deepcopy(PAGES["bir-adviser-call"]))
PAGES["bir-audit-trail"].update(
    source="BIR adviser call (FB ad 267 audit trail)",
    pill=DL_CAS, goal="cas",
    h1='Is Your <span class="hl">BIR CAS</span> Software <span class="hl">Actually Audit-Proof?</span>',
    sub="Under RMC 5-2021, a CAS must keep an audit trail and "
        "protect posted entries from changes. Our <b>5 Day Express BIR Solution*</b> sets up locked entries and a full audit trail for clean, reconciled "
        "ledgers. Meet a BIR Compliance Expert online for 15 minutes and leave with your plan.",
    ticks=["<b>Posted entries locked.</b> Lock dates, and no edits after posting.",
           "<b>Every change logged.</b> Who did what, and when.",
           "<b>SLSP tied to the ledger.</b> Reports from the same posted entries."],
    btn="Book my technical call", form_h="Book your technical call",
    msg_ph="e.g. CAS registered, entries still edited after posting",
    check_h="Would your system pass an audit trail check?",
    check_lead="Lock your books before year end. Which of these sounds familiar?",
    checks=[("No audit trail printout", "<b>The system can't print an audit trail</b> showing who changed what, and when."),
            ("Posted entries get edited", "<b>Posted entries get edited</b> after the period is closed."),
            ("SLSP doesn't tie to the ledger", "<b>The SLSP doesn't tie to the general ledger</b> without manual corrections."),
            ("Annex B never checked", "<b>Nobody has checked the Annex B requirements</b> against your set up.")],
    bp_h="What you leave the meeting with.",
    bp_lead="One online meeting with a BIR Compliance Expert, before your books are due.",
    bp=["Where your audit trail and lock dates stand against RMC 5-2021",
        "CAS or CBA, and what your books need",
        "How your SLSP ties to the general ledger",
        "A written quote before any work starts"],
    facts="rmc", express=False,
    steps_h="From the first meeting to locked books.",
    steps=[("15 minute meeting", "Neil or Jeric maps your workflow and checks your audit trail and lock dates."),
           ("Set up and test", "Journal locks, user change logs and BIR reports, tested on your real data."),
           ("Tie the reports", "SLSP and books from the same posted entries as the general ledger."),
           ("Review and register", "Your accountant reviews; you register your books.")],
    faq=[("Do we need a CAS or a CBA?", "RMO 9-2021 draws the line at invoices. If your system issues them, it is a CAS; if invoices are issued by hand and the system keeps your books, it is a CBA. Large taxpayers must use a CAS. We go through it with your accountant, and your RDO can confirm it."),
         ("Is TechNext BIR-accredited?", "No, and no accounting software is. The BIR registers each business's use of a system, not a software brand, and it has warned against \"BIR-accredited\" claims. We set your system up for the BIR's requirements and prepare the sample outputs with you."),
         FAQ_KEEP, FAQ_TIME, FAQ_COST],
    close_h='31 December 2026 is close. <span class="hl">Lock your books</span> before year end.',
    close_p="<strong>15 minutes, online, no charge.</strong> Any work starts with a written quote.",
)
for _k in ("bir-quarter-end", "bir-audit-trail"):
    PAGES[_k].pop("order", None)

# ------------------------------------------------------------ 23 Nov 2026: owner "properly summarize, no too much explanation,
# safe, no over promise, no redundant explanation". One short, safe layer over the copy above (headlines kept: they match
# the live ads). The 5-day qualifier sits once in the hero (the bottom X5 note is skipped on landers, build.py), the BIR
# disclaimer lives in the site-wide footer line, and "written quote" / "15 minutes" are said once under the button.
FINE = "*Standard 5-day technical deployments available for clean, reconciled data ledgers. Bigger scopes take longer, as your quote shows."
UNDER = "15 minutes, online, no charge. Written quote before any work."
CLOSE_P = "<strong>15 minutes, online, no charge.</strong> Fill in the short form, then pick your time in the calendar."   # 25 Nov 2026 (Sky): book direct

S_SOFT = ("Do we have to change our accounting software?",
          "No. Your current software stays, and we connect to it.")
S_DAT = ("Can the system produce the BIR DAT files?",
         "Yes. SLSP, SAWT and QAP export as DAT files from your posted entries.")
S_EIS = ("Do you connect us to the BIR's EIS?",
         "No. That connection runs through a BIR-accredited e-invoicing service provider you choose (RMC 110-2026). "
         "We prepare your system and invoice data for it.")
S_ACC = ("Is TechNext BIR-accredited?",
         "No partner or software brand is. The BIR registers your business's use of a system, and you file at your RDO.")
S_COST = ("What does it cost?",
          "It depends on your branches and integrations. You get a written quote before any work, and the meeting has no charge.")
S_TIME = ("How long does the set up take?",
          "About 5 days* for a standard set up with clean, reconciled ledgers. Bigger scopes take longer, as your quote shows.")
S_CASCBA = ("Do we need a CAS or a CBA?",
            "If your system issues your invoices, it is a CAS; if invoices are written by hand, a CBA (RMO 9-2021). "
            "Your accountant or RDO confirms it.")
S_2307 = ("Can the system produce our 2307s, SLSP, SAWT and QAP?",
          "Yes, from the same entries as your books: 2306 and 2307 certificates from vendor bills, and the lists as DAT files.")
S_FILE = ("Do you file with the BIR for us?",
          "No. You or your client file at the RDO. We set up the system and prepare the sample outputs with you.")
S_EINVCAS = ("Does our CAS registration cover e-invoicing?",
             "No. You need a Permit to Issue first, then EIS Certification within six months (RMC 98-2026).")
S_CLIENT = ("We're an accounting firm. Can we bring a client case?",
            "Yes. Book one meeting per client and join it. You leave with that client's Blueprint.")
FAQ_S = [S_SOFT, S_DAT, S_EIS, S_ACC, S_COST]


def _no_quote(items):
    """'Written quote' is said once, under the form button."""
    return [b for b in items if "written quote" not in b.lower() or "5 Day" in b]


_FIRM_SIMPLE = dict(
    sub="For accountants and firms: we connect a BIR reporting plug-in to your clients' current software, so their CAS "
        "application has the books and reports it needs.",
    ticks=["<b>Their software stays.</b> We connect to it; nothing is replaced.",
           "<b>5 Day Express*.</b> A standard set up, planned around your client deadlines.",
           "<b>One approach for every client.</b> The same set up across your portfolio."],
    check_lead="Which of these sounds familiar?",
    checks=[("Software can't produce the sample outputs", "<b>The client's software can't produce</b> the sample outputs the RDO asks for."),
            ("Billable hours on process flows", "<b>Billable hours go into process flows</b> the system should produce."),
            ("No audit trail", "<b>No audit trail</b> shows who changed what, and when."),
            ("Records in paper folders", "<b>Records sit in paper folders,</b> so every request means digging.")],
    bp_h="We set up the system. You keep the advisory.",
    bp_lead="We handle the technical work for the CAS application.",
    bp=["<b>Sample outputs:</b> the invoices and books the CAS or CBA application needs, from your client's data",
        "<b>Audit trail and system description:</b> posted entries locked, changes logged, checked against Annex B",
        "<b>Our BIR Compliance Experts,</b> Neil and Jeric, in Taguig City"],
    faq=FAQ_S,
)
for _k in ("get-started", "bir-adviser-call"):
    PAGES[_k].update(_copy.deepcopy(_FIRM_SIMPLE))
PAGES["get-started"]["close_p"] = CLOSE_P
PAGES["bir-adviser-call"]["close_p"] = CLOSE_P

PAGES["bir-cas-for-accountants"].update(
    sub="Your BIR reports come from the entries you already post: 2307s, SLSP, SAWT, QAP and the 2550Q. "
        "Your accountant reviews them before anything is filed.",
    ticks=["<b>2307s from your vendor bills.</b> No retyping.",
           "<b>DAT files from the ledger.</b> Figures match your books.",
           "<b>Built for accountants.</b> Reviewed by you, set up by us."],
    check_h="Is your quarter end still done by hand?",
    check_lead="Which of these sounds familiar?",
    bp_h="What the set up covers.",
    bp_lead="Set up once, then every report comes from your posted entries.",
    bp=["<b>2307 and 2306 certificates</b> from vendor bills, once your ATC codes are set",
        "<b>SLSP, SAWT and QAP</b> as DAT files from posted entries",
        "<b>2550Q VAT summary</b> from output and input VAT"],
    faq=[S_2307, S_SOFT, S_TIME, S_ACC, S_COST],
    close_p=CLOSE_P,
)

PAGES["bir-call"].update(
    sub="We set up the system so your books agree before you review and register them.",
    check_lead="What has to be in place before you register.",
    bp=_no_quote(PAGES["bir-call"]["bp"]),
    faq=[S_SOFT, S_TIME, S_ACC, S_COST],
    close_p=CLOSE_P,
)

PAGES["bir-e-invoicing-plan"].update(
    sub="Covered taxpayers must issue e-invoices by 31 December 2026 (RMC 98-2026). We map your clients' invoice flows and "
        "branches, prepare their Permit to Issue papers with them, and set up invoicing beside their current software.",
    check_h="Can your client's software meet the e-invoicing rules?",
    check_lead="Four points to check.",
    bp=_no_quote(PAGES["bir-e-invoicing-plan"]["bp"]),
    faq=[S_EINVCAS, S_EIS, ("What is a Permit to Issue (PTI)?",
                           "The BIR permit you need before issuing any e-invoice. You apply; we prepare the process flow and sample invoices with you."),
         S_SOFT, S_COST],
    close_p="E-invoicing is due by 31 December 2026 for covered taxpayers. " + CLOSE_P,
)

for _k in ("bir-deadline", "bir-firm-deadlines"):
    p = PAGES[_k]
    p["myths"] = ("3 assumptions we often hear from CAS users.",
                  "Each one can push e-invoicing past 31 December.",
                  [("“Our CAS registration covers us.”",
                    "It covers your computerised books. E-invoicing needs a Permit to Issue, then EIS Certification within six months."),
                   ("“We email PDF invoices, so we're electronic.”",
                    "A printed or emailed PDF is not an e-invoice."),
                   ("“We'll sort it out in December.”",
                    "December is year end close. Plan the order of work now.")])
    p["bp"] = ["Covered now, later or exempt (your accountant or RDO confirms)",
               "CAS or CBA, and what your books need",
               "The e-invoicing order: Permit to Issue, set up, EIS Certification",
               "What the set up covers" + (" for each client" if _k == "bir-firm-deadlines" else ", with your 5 Day Express*")]
    p["firm"] = ("We set up the system. You keep the client.",
                 "For accounting firms and consultants.",
                 ["<b>You stay the adviser.</b> We set up the system and report to you.",
                  "<b>One Blueprint per client.</b> Start with one case.",
                  "<b>Agreed with you</b> before any work starts."])
    p["faq"] = [S_EINVCAS, S_CLIENT, S_EIS, S_FILE, S_COST]
    p["close_p"] = "E-invoicing by 31 December 2026. " + CLOSE_P
PAGES["bir-deadline"].update(
    sub="A CAS registration doesn't cover e-invoicing: you need a Permit to Issue, then EIS Certification. "
        "Leave the meeting with your Blueprint for you or your client.",
    ticks=["<b>Your CAS and e-invoicing Blueprint:</b> the order of work.",
           "<b>Keep the accounting software.</b> We connect to it.",
           "<b>For you or your client,</b> one case at a time."],
)
PAGES["bir-firm-deadlines"].update(
    sub="31 December 2026: e-invoicing for covered taxpayers. "
        "We handle the technical work across your client portfolio with our <b>5 Day Express BIR Solution*</b>; you keep the tax advisory.",
)

PAGES["bir-quarter-end"].update(
    sub="Stop rebuilding SLSP, SAWT, QAP and 2307s in spreadsheets. Set up BIR reporting beside your clients' current software "
        "with our <b>5 Day Express BIR Solution*</b>.",
    check_h="Is your quarter end still done by hand?",
    check_lead="Which of these sounds familiar?",
    bp_h="What the set up covers.",
    bp_lead="Set up once, then every report comes from your posted entries.",
    bp=["<b>2307 and 2306 certificates</b> from vendor bills, once your ATC codes are set",
        "<b>SLSP, SAWT and QAP</b> as DAT files from posted entries",
        "<b>Books of accounts</b> for your clients, from the same entries"],
    faq=[S_2307, S_SOFT, S_TIME, S_COST],
    close_p=CLOSE_P,
)

PAGES["bir-audit-trail"].update(
    sub="RMC 5-2021 requires a CAS to keep an audit trail and "
        "protect posted entries. Our <b>5 Day Express BIR Solution*</b> sets up locked entries and a full audit trail.",
    check_lead="Which of these sounds familiar?",
    bp=["Where your audit trail and lock dates stand against RMC 5-2021",
        "CAS or CBA, and what your books need",
        "How your SLSP ties to the general ledger"],
    faq=[S_CASCBA, S_TIME, S_COST],
    close_p=CLOSE_P,
)

# ------------------------------------------------------- section buttons (owner 13 Nov 2026: each speaks for its section)
_ASK = "Ask a BIR Compliance Expert"
# Funnel (owner 13 Nov 2026 "do a proper funneling"): every section ends on one button to the form, and the wording steps up
# down the page: problem -> "Check / Clear" (diagnose), plan -> "Get my Blueprint", proof / how -> "Plan / Check",
# objections -> "Ask", closing band -> "Book" with the deadline. The hero form button (p["btn"]) is the one action.
_CAS_FIRM = dict(check="Clear my CAS roadblock", blueprint="Get my client's Blueprint", facts="Check my application papers",
                 express="Plan my set up", faq=_ASK)
CTAS = {
    "get-started": dict(_CAS_FIRM, close="Book before 31 December"),
    "bir-adviser-call": dict(_CAS_FIRM, close="Book my Blueprint meeting"),
    "bir-call": dict(check="Check my books", blueprint="Get my BIR CAS Blueprint", express="Plan my set up",
                     faq=_ASK, close="Book before 31 December"),
    "bir-cas-for-accountants": dict(check="Solve my quarter end", blueprint="See my quarter end set up", express="Plan my set up",
                                    faq=_ASK, close="Book my Blueprint meeting"),
    "bir-e-invoicing-plan": dict(check="Check my e-invoicing gaps", blueprint="Get my e-invoicing Blueprint",
                                 express="Book the first meeting", faq=_ASK, close="Book before 31 December"),
    "bir-deadline": dict(myths="Check what my client needs", facts="Check if my client is covered",
                         blueprint="Get my client's Blueprint", firm="Bring a client case", faq=_ASK,
                         close="Book before the December rush"),
}

CTAS.update({
    "bir-quarter-end": dict(check="Solve my quarter end", blueprint="Book my workflow review", express="Book my workflow review",
                            faq=_ASK, close="Book before 31 December"),
    "bir-firm-deadlines": dict(myths="Check what my client needs", facts="Check if my client is covered",
                               blueprint="Book my partner meeting", firm="Bring a client case", faq=_ASK,
                               close="Book before 31 December"),
    "bir-audit-trail": dict(check="Check my audit trail", blueprint="Book my technical call", facts="Check my audit trail",
                            express="Book my technical call", faq=_ASK, close="Book before 31 December"),
})

# ---------------------------------------------------------------------------------------------------------- page facts
_FACTS = {
    "rmc": ("What does the BIR ask for?",
            "What a CAS or CBA application needs (RMC 5-2021).",
            [("A sworn statement", "A description of the system and the invoices and reports it produces."),
             ("Sample invoices", "Printed from the system you will actually use."),
             ("Sample books and reports", "Your books of accounts and the other system reports."),
             ("An audit trail printout", "From the system, showing who did what and when."),
             ("The requirements checklist", "The functional and technical requirements in Annex B, signed."),
             ("E-invoicing from 31 December 2026", "CAS and CBA users issue e-invoices, after a Permit to Issue (RR 26-2025, RMC 98-2026).")]),
    "quarter": ("Your quarter end, from one set of books.",
                "Every report comes from the entries you already post, so you reconcile once.",
                [("2307 per payee", "Generated from each vendor bill with withholding, ready to send."),
                 ("ATC on every line", "Withholding taxes and ATC codes set up once, used on every bill."),
                 ("SLSP with DAT files", "Sales and purchases lists exported for the BIR's tools."),
                 ("SAWT and QAP", "Built from the same entries as your ledger."),
                 ("2550Q VAT summary", "Output and input VAT from the posted entries."),
                 ("Books of accounts", "Journals and ledger for your CAS or CBA, from the same system.")]),
    "einv": ("What the e-invoicing rules ask for.",
             "From RR 26-2025 and RMC 98-2026.",
             [("A Permit to Issue (PTI)", "You need a PTI Electronic Invoice before you issue any e-invoice."),
              ("EIS Certification", "Completed within six months of the PTI."),
              ("No edits after issue", "A credit note covers a decrease; a new e-invoice covers an increase."),
              ("A plan for downtime", "A BIR-authorised manual invoice, then an e-invoice that references it."),
              ("Every branch", "Head office and all branches issue e-invoices."),
              ("Micro taxpayers exempt", "Your accountant confirms whether your business is covered.")]),
    # bir-deadline: who must issue e-invoices by 31 Dec 2026 (same groups as /bir-e-invoicing, RR 26-2025 + RMC 98-2026)
    "cover": ("Is your client covered by 31 December 2026?",
              "General guidance from RR 26-2025 and RMC 98-2026, not tax advice. Confirm the group with the RDO.",
              [("CAS or CBA with invoicing software", "Covered by 31 December 2026."),
               ("Large Taxpayers Service accounts", "Covered by 31 December 2026, with large taxpayers under RA 11976 and RR 8-2024."),
               ("E-commerce and internet sellers", "Small, medium and large e-commerce sellers (not micro): covered by 31 December 2026."),
               ("Exporters, POS users, incentive-registered firms", "Later, once a separate regulation is issued."),
               ("Micro taxpayers", "Exempt from mandatory e-invoicing."),
               ("Not sure which group?", "We go through the rules with you in the meeting. Your accountant or RDO confirms it.")]),
}

_STEPS_EINV = [("15 minute meeting", "A BIR Compliance Expert checks whether you are covered and how you invoice today."),
               ("Map your invoice flows", "Customer invoices, credit notes, branches, anything issued outside your system."),
               ("Set it up and test", "Taxes, invoice layouts and BIR reports, tested on your real data."),
               ("Prepare for the EIS provider", "Your invoice data set up for the BIR-accredited e-invoicing service provider you choose."),
               ("Prepare your PTI papers", "Process flow and sample invoices, prepared with you. You apply.")]


def _cta(label, cls="btn-link", carry=False):
    return f'<a class="{cls}" href="#book" data-to-form{" data-carry-check" if carry else ""}>{label} {{{{icon:arrow}}}}</a>'


def _lbl(p, sec):
    """Owner 13 Nov 2026: "make sure the cta button are speaking with the current section" - each section's button names
    what that section is about (CTAS below); the hero form button keeps p["btn"]."""
    return CTAS.get(p.get("_key"), {}).get(sec) or p["btn"]


def _goal(p):
    """13 Nov 2026 owner doc: "What is your primary goal right now?", pre-set per page (sent as topic). 24 Nov 2026 owner
    ("apply to all fill out form"): same order as the Odoo booking form - email, mobile, name, company, website, THEN the
    goal, then the optional note."""
    if not p.get("goal"):
        return ""
    opts = "".join(f'<option value="{_e(t)}"{" selected" if k == p["goal"] else ""}>{_e(GOAL_SHOW.get(k, t))}</option>'
                   for k, t in GOALS)
    return (f'        <div class="field lp-goal"><label for="gs-goal">What is your primary goal right now?</label>'
            f'<select id="gs-goal" name="topic">{opts}</select></div>\n')


# 25 Nov 2026 (Sky): one required question that real buyers answer and spam bots do not ("Excel", "none yet" are fine);
# it rides to the booking page with the other details. After the send, site.js opens the calendar (data-then-book):
# ad -> lander form -> calendar, no waiting for a call back (Sky: 230 leads -> 7 meetings with the call-back form).
SOFTWARE_FIELD = ('        <div class="field"><label for="gs-software">Accounting software you (or your clients) use '
                  '<span class="fw-req" aria-hidden="true">*</span></label><input id="gs-software" name="accounting_system" type="text" '
                  'required minlength="2" maxlength="120" autocomplete="off" placeholder="e.g. QuickBooks, Xero, Excel, none yet" '
                  'data-missing="Add the accounting software you use, or none yet." data-err="Add the accounting software you use, or none yet."></div>\n')


def _sent(p):
    """After the form: open the calendar (redirect), or show it right in the card (book_embed, 25 Nov 2026 owner)."""
    if p.get("book_embed"):
        return ('<div class="form-sent lp-sent-cal"><h3>Thanks. Now pick your time.</h3><p>Choose a day, then a time. '
                'Picking a time books your call. No more forms.</p><div class="lp-cal" data-lp-cal></div>'
                '<p class="small muted lp-cal-alt">Calendar not showing? We have your details and will call you to set the time.</p></div>')
    return ('<div class="form-sent"><h3>Thanks. Now pick your time.</h3><p>Opening the calendar with your details filled in. '
            f'If it does not open, <a href="{BOOK}" class="lp-book-now" data-meet>choose your 15-minute slot here</a>.</p></div>')


def _form(p):
    h = p.get("form_h") or ("Get your e-invoicing plan" if p["btn"] == BTN_EINV else "Get your BIR CAS Blueprint")
    return f'''    <div class="fw-side fw-side--form" id="book">
  <form class="form gs-form fw-form" id="gs-form" data-loop novalidate data-endpoint="/api/lead" data-fw-form data-no-captcha data-then-book="{BOOK}"{' data-book-embed' if p.get("book_embed") else ''}>
      <i class="fx-result-glow gs-glow" aria-hidden="true"></i>
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="source" value="{_e(p["source"])}">
      <div class="fw-fhead">
        <h2 class="gs-form-h">{h}</h2>
        <p class="gs-form-sub fw-fsub">Your details first, then pick a 15-minute time this week on the next screen.</p>
      </div>
      <fieldset class="fw-step" data-step="1"><legend class="sr-only">Your details</legend>
        <div class="form-row">
          <div class="field"><label for="gs-email">Work email <span class="fw-req" aria-hidden="true">*</span></label><input id="gs-email" name="email" type="email" required data-missing="Please add your work email." autocomplete="email" inputmode="email" placeholder="name@company.com" aria-describedby="gs-email-err" data-err="Please check the email, like name@company.com."><p class="fw-err" id="gs-email-err" hidden></p></div>
          <div class="field"><label for="gs-phone">Mobile number <span class="fw-req" aria-hidden="true">*</span></label><input id="gs-phone" name="phone" type="tel" required data-missing="Please add your mobile number." autocomplete="tel" inputmode="tel" pattern="[0-9+\\(\\)\\-\\s]{{7,}}" placeholder="0917 123 4567" aria-describedby="gs-phone-err" data-err="Please enter a number we can call, with at least 7 digits."><p class="fw-err" id="gs-phone-err" hidden></p></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="gs-name">Full name <span class="fw-req" aria-hidden="true">*</span></label><input id="gs-name" name="name" type="text" required autocomplete="name" data-missing="Please add your full name."></div>
          <div class="field"><label for="gs-company">Company name <span class="fw-req" aria-hidden="true">*</span></label><input id="gs-company" name="company" type="text" autocomplete="organization" required aria-describedby="gs-company-err" data-missing="Please add your company name."><p class="fw-err" id="gs-company-err" hidden></p></div>
        </div>
        <div class="field"><label for="gs-website">Company website <span class="fw-req" aria-hidden="true">*</span></label><input id="gs-website" name="website" type="text" required inputmode="url" autocomplete="url" autocapitalize="off" spellcheck="false" placeholder="e.g. yourcompany.com" pattern="{_S.WEBSITE_PATTERN}" aria-describedby="gs-website-err" data-missing="{_S.WEBSITE_MISSING}" data-err="{_S.WEBSITE_ERR}"><p class="fw-err" id="gs-website-err" hidden></p></div>
{_goal(p)}{SOFTWARE_FIELD}        <div class="field"><label for="gs-msg">Anything we should know?</label><textarea id="gs-msg" name="message" rows="3" placeholder="{_e(p["msg_ph"])}"></textarea></div>
      </fieldset>
      <div class="form-foot">
        <button class="btn btn-primary btn-lg gs-submit" type="submit"><span class="btn-label">{p["btn"]} {{{{icon:arrow}}}}</span><span class="btn-busy" aria-hidden="true"></span></button>
      </div>
      <p class="lp-under">{UNDER}</p>
      <p class="form-status" role="status" aria-live="polite"></p>
      {_sent(p)}
      <p class="small muted gs-privacy">{{{{icon:shield}}}} Your details go only to our team. See the <a href="{{{{ROOT}}}}privacy.html" target="_blank" rel="noopener">privacy policy</a>.</p>
    </form>
    </div>'''


def _hero(p):
    ticks = "".join(f"<li>{{{{icon:check}}}}<span>{t}</span></li>" for t in p["ticks"])
    return f'''<section class="fx-hero fw-hero lp-hero" id="start">
  <div class="fx-field" aria-hidden="true"><i class="fx-orb fx-orb--a"></i><i class="fx-orb fx-orb--b"></i></div>
  <div class="container fw-hero-in">
    <div class="fw-copy">
      <p class="fw-deadline lp-dl">{{{{icon:calendar}}}}<span>{p["pill"]}</span></p>
      <h1 id="fw-h1"{f' class="{p["h1_cls"]}"' if p.get("h1_cls") else ""}>{p["h1"]}</h1>
      <p class="lead fw-hero-lead">{p["sub"]}</p>
      <ul class="lp-ticks">{ticks}</ul>
      <p class="small muted fw-proof">{PROOF}</p>
{f'      <p class="lp-fine">{p.get("fine", FINE)}</p>' + chr(10) if p.get("fine", FINE) else ""}      <p class="sr-only" role="status" aria-live="polite" data-fw-status></p>
    </div>
{_form(p)}
  </div>
</section>'''


def _myths(p):
    """bir-deadline: the 3 assumptions (reality check) cards."""
    if not p.get("myths"):
        return ""
    h, lead, items = p["myths"]
    lis = "".join(f'<li class="reveal" style="--i:{i}"><span class="gs-n">{i + 1}</span><h3>{a}</h3><p>{b}</p></li>'
                  for i, (a, b) in enumerate(items))
    return f'''<section class="section fx-sec fw-rules-sec lp-myths" aria-labelledby="lp-myths-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-myths-h">{h}</h2><p class="lead">{lead}</p></div>
    <ol class="fw-rules">{lis}</ol>
    <p class="sec-next reveal">{_cta(_lbl(p, "myths"))}</p>
  </div>
</section>'''


def _firm(p):
    """bir-deadline: the section for accounting firms and consultants."""
    if not p.get("firm"):
        return ""
    h, lead, items = p["firm"]
    lis = "".join(f"<li>{{{{icon:check}}}}<span>{t}</span></li>" for t in items)
    return f'''<section class="section fx-sec lp-firm" aria-labelledby="lp-firm-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-firm-h">{h}</h2><p class="lead">{lead}</p></div>
    <ul class="lp-ticks lp-firm-list reveal">{lis}</ul>
    <p class="sec-next reveal">{_cta(_lbl(p, "firm"), "btn btn-primary")}</p>
  </div>
</section>'''


def _check(p):
    if not p.get("checks"):
        return ""
    items = "".join(
        f'<li><div class="lp-point"><span class="lp-point-mark" aria-hidden="true"></span><span>{t}</span></div></li>'
        for _v, t in p["checks"])   # owner 13 Nov 2026: static list, no checkboxes ("not interactive, remove distraction")
    return f'''<section class="section fx-sec fw-check-sec lp-check-sec" id="self-check" aria-labelledby="fw-check-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="fw-check-h">{p["check_h"]}</h2><p class="lead">{p.get("check_lead") or "Does any of this sound familiar?"}</p></div>
    <div class="fw-check lp-check reveal">
      <ul class="fw-check-list lp-points">{items}</ul>
      <p class="lp-check-act">{_cta(_lbl(p, "check"), "btn btn-primary btn-lg")}</p>
    </div>
  </div>
</section>'''


def _experts(p):
    cards = "".join(
        f'<article class="xp-card reveal" style="--i:{k}">'
        f'<div class="xp-photo"><img src="{{{{ROOT}}}}assets/img/team/{x["photo"]}" alt="{_e(x["name"])}, BIR Compliance Expert at TechNext" width="600" height="600" loading="lazy" decoding="async"><span class="xp-badge">{{{{icon:pin}}}}Taguig City</span></div>'
        f'<div class="xp-body"><p class="xp-role">BIR Compliance Expert</p><h3 class="xp-name">{_e(x["name"])}</h3>'
        f'<p class="xp-sum">{_e(x["sum"])}</p>'
        f'<ul class="xp-stats">{"".join(f"<li><b>{_e(v)}</b><span>{_e(l)}</span></li>" for v, l in x["stats"])}</ul>'
        f'<div class="xp-act"><a class="btn btn-primary" href="#book" data-to-form>Meet {x["name"].split()[0]} {{{{icon:arrow}}}}</a></div>'
        f'</div></article>' for k, x in enumerate(EXPERTS))
    return f'''<section class="section xp-sec" id="advisers" aria-labelledby="xp-h">
  <div class="container">
    <div class="xp-head reveal"><p class="xp-kicker">Who you meet</p><h2 id="xp-h">Your BIR Compliance Experts.</h2><p class="xp-lead">Your Blueprint meeting is with a BIR Compliance Expert.</p></div>
    <div class="xp-grid">{cards}</div>
  </div>
</section>'''


def _blueprint(p):
    items = "".join(f"<li>{{{{icon:check}}}} <span>{t}</span></li>" for t in p["bp"])   # span: bold lead-ins stay inline
    panel = _IFX.panel_markup(p["panel"])
    for x, y in (("Sample Odoo screen", "Sample screen"), ("Your Odoo set-up", "Your set up"), ("Printed from Odoo", "Printed from your system"),
                 ("By email from Odoo", "By email from your system")):   # no Odoo in visible copy (Sky, 12 Nov 2026)
        panel = panel.replace(x, y)
    return f'''<section class="section fx-sec fx-sec--alt fw-claim fw-answer" id="blueprint" aria-labelledby="lp-bp-h">
  <div class="container fw-claim-grid">
    <div class="fw-claim-copy reveal">
      <h2 id="lp-bp-h">{p["bp_h"]}</h2>
      <p class="lead">{p["bp_lead"]}</p>
      <ul class="gs-ticks">{items}</ul>
      <p class="sec-next reveal">{_cta(_lbl(p, "blueprint"), "btn btn-primary")}</p>
    </div>
    <div class="fw-side">
      <div class="fw-stage">
      <div class="fw-pane">
{panel}
      </div>
      </div>
      <p class="small muted lp-sample">Sample screen with sample data.</p>
    </div>
  </div>
</section>'''


def _facts(p):
    if not p["facts"]:
        return ""
    h, lead, items = _FACTS[p["facts"]]
    lis = "".join(f'<li class="reveal" style="--i:{i}"><span class="gs-n">{i + 1}</span><h3>{a}</h3><p>{b}</p></li>'
                  for i, (a, b) in enumerate(items))
    note = ""
    if p["facts"] in ("rmc", "einv"):
        body = ("The BIR registers your business's use of a system, not a software brand. You file at your RDO; the decision is the RDO's."
                if p["facts"] == "rmc" else
                "TechNext does not provide the EIS connection. It runs through a BIR-accredited e-invoicing service provider you "
                "choose (RMC 110-2026).")
        note = f'<div class="fw-note lp-note reveal"><h3>A word of caution</h3><p>{body}</p></div>'
    return f'''<section class="section fx-sec fw-rules-sec" aria-labelledby="lp-facts-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-facts-h">{h}</h2><p class="lead">{lead}</p></div>
    <ol class="fw-rules">{lis}</ol>
    {note}
    <p class="sec-next reveal">{_cta(_lbl(p, "facts"))}</p>
  </div>
</section>'''


def _express(p):
    if not p["express"]:
        steps = p.get("steps") or _STEPS_EINV
        lis = "".join(f'<li class="reveal" style="--i:{i}"><span class="gs-n">{i + 1}</span><h3>{a}</h3><p>{b}</p></li>'
                      for i, (a, b) in enumerate(steps))
        return f'''<section class="section fx-sec fx-sec--alt gs-how" aria-labelledby="lp-steps-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-steps-h">{p.get("steps_h") or "From the first meeting to your PTI papers."}</h2></div>
    <ol class="gs-steps fw-steps lp-steps" style="--n:{len(steps)}" data-loop>{lis}</ol>
    <p class="sec-next reveal">{_cta(_lbl(p, "express"))}</p>
  </div>
</section>'''
    return f'''<section class="section lp-x5" aria-label="5 Day Express">
  <div class="container">
    <p class="lp-x5-line reveal"><span class="lp-x5-badge">{{{{icon:zap}}}}5 Day Express*</span>A standard set up runs as a 5 Day Express.* We plan yours in the meeting. {_cta(_lbl(p, "express"))}</p>
  </div>
</section>'''


def _faq(p):
    qs = "".join(f'<details><summary>{_e(q)} {{{{icon:chevron}}}}</summary><div class="faq-a"><p>{_e(a)}</p></div></details>'
                 for q, a in p["faq"])
    return f'''<section class="section fx-sec" aria-labelledby="lp-faq-h">
  <div class="container fx-faq">
    <div class="sec-head reveal"><h2 id="lp-faq-h">Before you book, answered.</h2></div>
    <div class="faq reveal">{qs}</div>
    <p class="sec-next reveal">{_cta(_lbl(p, "faq"))}</p>
  </div>
</section>'''


def _close(p):
    return f'''<section class="section fx-close-sec">
  <div class="container">
    <div class="fx-close reveal">
      <div class="fx-close-glow" aria-hidden="true"></div>
      <div><h2>{p["close_h"]}</h2><p>{p["close_p"]}</p></div>
      <div class="actions">{_cta(_lbl(p, "close"), "btn btn-white btn-lg")}</div>
    </div>
  </div>
</section>'''


def _costs(p):
    """25 Nov 2026 (owner, FB ad 266): the "What late filing costs" box. Only pages that set p["costs"] show it."""
    if not p.get("costs"):
        return ""
    h, rows, fine = p["costs"]
    lis = "".join(f'<li><span class="lp-cost-mark" aria-hidden="true"></span><span>{t}</span></li>' for t in rows)
    return f'''<section class="section fx-sec lp-costs-sec" aria-labelledby="lp-costs-h">
  <div class="container">
    <div class="fw-note lp-costs reveal">
      <h2 id="lp-costs-h">{h}</h2>
      <ul class="lp-costs-list">{lis}</ul>
      <p class="lp-costs-fine">{fine}</p>
    </div>
    <p class="sec-next reveal">{_cta(_lbl(p, "costs"))}</p>
  </div>
</section>'''


def page_html(key: str) -> str:
    p = dict(PAGES[key], _key=key)
    # owner 12 Nov 2026: "remove this part in all landing pages" - the Who you meet / expert cards block is off the landers
    # (_experts stays defined in case it comes back; the FAQ still answers "Who do we meet?")
    parts = {"hero": _hero, "myths": _myths, "check": _check, "blueprint": _blueprint, "facts": _facts, "firm": _firm,
             "express": _express, "faq": _faq, "close": _close, "costs": _costs}
    order = p.get("order") or ["hero", "check", "blueprint", "facts", "express", "faq", "close"]
    return "\n\n".join(x for x in (parts[k](p) for k in order) if x)


# ------------------------------------------------- 25 Nov 2026: FB ad 267 lander, 31 Dec deadline + Blueprint buttons (owner)
# Owner: "make sure those link mention in title about the deadline" (December) + "on button, make sure mention about
# blueprint". Matches the revised ad 267 image (red "BIR CAS DEADLINE: 31 DEC 2026!" row, "Secure my BIR Blueprint").
PAGES["bir-audit-trail"].update(
    pill=('<b>BIR CAS Deadline</b><span class="dl-sep dl-sep--wrap"> · </span><span data-fw-dl-static>31 December 2026</span><span data-fw-dl-live hidden>'
          '<b data-fw-days>--</b> <span data-fw-days-word>days</span> to 31 December 2026</span>'),
    h1='<span class="dl1">BIR CAS DEADLINE:</span> <span class="dl2">31 DEC 2026!</span> <span class="dl3">Is Your Software Audit-Proof?</span>',
    h1_cls="lp-dt",
    sub="From 31 December 2026, BIR CAS and CBA users must issue e-invoices, and your Permit to Issue (PTI) comes first. "
        "Our <b>5 Day Express BIR Solution*</b> sets up locked entries "
        "and a full audit trail.",
    btn="Secure my BIR Blueprint", form_h="Secure your BIR Blueprint",
    bp_h="Your BIR Blueprint: what you leave the meeting with.",
    bp=["Where you stand against 31 December",
        "Where your audit trail and lock dates stand",
        "CAS or CBA, and what your books need",
        "How your SLSP ties to the general ledger"],
    close_h='31 December 2026 is weeks away. <span class="hl">Secure your BIR Blueprint</span> now.',
    close_p="From 31 December 2026, CAS and CBA users must issue e-invoices. " + CLOSE_P,
)
PAGES["bir-audit-trail"]["book_embed"] = True
PAGES["bir-audit-trail"]["goal"] = "einv"   # December focus (owner 25 Nov): pre-picks the 31 Dec option, carried to the booking   # 25 Nov 2026 owner: show the Odoo calendar on this page after the form
CTAS["bir-audit-trail"] = dict(check="Get my audit trail Blueprint", blueprint="Secure my BIR Blueprint",
                               facts="Get my BIR CAS Blueprint", express="Secure my BIR Blueprint",
                               faq="Ask about my BIR Blueprint", close="Secure my Blueprint before 31 Dec")   # 26 Nov 2026: phones break only after "Blueprint"

_TOKEN = _re.compile(r"\{\{LANDER:([a-z0-9-]+)\}\}")


def tokens(content: str, experts: str = "", express: str = "") -> str:
    """experts / express: the site-wide blocks build.py passes in; the landers write their own (12 Nov 2026 Sky fixes)."""
    return _TOKEN.sub(lambda m: page_html(m.group(1)), content)



# -------------------------------------------------------------------- 23 Nov 2026 (later): one page per FB ad 275-278
# Owner: "make sure all ads have a proper own landing page related to the ads ... just revise 4 that we didn't use"
# (bir-cas-for-accountants, bir-call, bir-e-invoicing-plan, bir-deadline). Each page now repeats its ad: same title, same
# promise, same button words. Owner 23 Nov: "not EIS expert, but BIR experts"; buyers are accountants, finance staff and
# owners (no code or tech words). Added AFTER the 13 Nov copies of these pages (bir-quarter-end / bir-firm-deadlines /
# bir-audit-trail), so the live CPA Overhaul ads 265-267 keep their pages exactly as they are.
_BTN_BIR = "Talk to Our BIR Experts"
_EXP = "Ask our BIR experts"

# Ad 275 - "Start Your 5 Days BIR CAS Set-Up Today!" (Start button poster)
PAGES["bir-cas-for-accountants"].update(
    pill=DL_CAS, goal="cas", btn="Book My 5 Days Set-Up", form_h="Book your 5 Days* BIR CAS Set-Up",
    h1='Start Your <span class="hl">5 Days</span> <span class="hl">BIR CAS Set-Up</span>* Today.',
    sub="For accountants and finance teams: our BIR experts set up your books of accounts, CAS papers and BIR report "
        "formats (SLSP, 2307, SAWT) with you, from the data you already keep. One short project, with a walkthrough for "
        "your team at the end.",
    ticks=["<b>Books of accounts and CAS papers,</b> prepared with you.",
           "<b>SLSP, 2307 and SAWT</b> from the entries you already post.",
           "<b>No big system change.</b> Your current software stays."],
    msg_ph="e.g. accounting software plus spreadsheets today, 1 branch, CAS registration pending",
    check_h="Where does your BIR CAS set-up stand?",
    check_lead="Which of these sounds familiar?",
    checks=[("No system description yet", "<b>Nobody has written the system description</b> the application needs."),
            ("Sample outputs from the wrong system", "<b>Your sample invoices and books</b> come from a system never set up for them."),
            ("Reports rebuilt by hand", "<b>SLSP, SAWT and 2307s</b> are rebuilt by hand every quarter."),
            ("Team not walked through it", "<b>Your team is not sure</b> how the set-up works day to day.")],
    bp_h="What your 5 Days* BIR CAS Set-Up covers.",
    bp_lead="One short project, done with you.",
    bp=["<b>Books of accounts</b> from your posted entries",
        "<b>CAS papers:</b> system description, process flow and sample outputs, prepared with you",
        "<b>BIR report formats:</b> SLSP, 2307 and SAWT",
        "<b>A walkthrough</b> for your team at the end"],
    panel=CAS_PANEL, facts="rmc", express=True,
    order=["hero", "check", "blueprint", "facts", "faq", "close"],   # no "5 Day Express" block: the ads say "5 Days BIR CAS Set-Up"
    faq=[S_CASCBA, S_SOFT, S_TIME, S_ACC, S_COST],
    close_h='Start your <span class="hl">BIR CAS</span> set-up this week.',
    close_p=CLOSE_P,
)

# Ad 278 - "Let our BIR experts handle your CAS set-up" (Stopwatch poster, button "Book a BIR CAS Meeting")
PAGES["bir-call"].update(
    pill=DL_CAS, goal="cas", btn="Book a BIR CAS Meeting", form_h="Book your BIR CAS meeting",
    h1='Let Our <span class="hl">BIR Experts</span> Handle Your <span class="hl">CAS Set-Up</span>.',
    sub="You bring your current books and sales data. We prepare the CAS papers with you (system description, process "
        "flow, books of accounts and BIR report formats) and walk your staff through the result, in a "
        "<b>5 Days* BIR CAS Set-Up</b>.",
    ticks=["<b>You bring</b> your current books and sales data.",
           "<b>We prepare with you</b> the CAS papers and report formats.",
           "<b>Your staff get a walkthrough</b> at the end."],
    msg_ph="e.g. we keep books in spreadsheets, sales in a POS, CAS papers not started",
    check_h="What our BIR experts take off your desk.",
    check_lead="The parts that usually stall a CAS set-up.",
    checks=[("System description", "<b>The system description</b> the sworn statement needs."),
            ("Process flow", "<b>The process flow</b> of how you record sales, purchases and payments."),
            ("Sample books and invoices", "<b>Sample books and invoices</b> printed from the system you will use."),
            ("BIR report formats", "<b>SLSP, 2307 and SAWT formats</b> that match your books.")],
    bp_h="How the set-up runs.",
    bp_lead="You stay in control; we do the technical work.",
    bp=["<b>A 15 minute online meeting</b> to see your books and sales data",
        "<b>CAS papers prepared with you,</b> from your real data",
        "<b>Your staff walked through</b> the set-up before you file at your RDO"],
    panel=CAS_PANEL, facts="rmc", express=True,
    order=["hero", "check", "blueprint", "facts", "faq", "close"],   # no "5 Day Express" block: the ads say "5 Days BIR CAS Set-Up"
    faq=[S_CASCBA, S_FILE, S_TIME, S_ACC, S_COST],
    close_h='Let our <span class="hl">BIR experts</span> handle it.',
    close_p=CLOSE_P,
)

# Ad 276 - "Is every invoice ready for the BIR EIS?" (magnifier poster)
PAGES["bir-e-invoicing-plan"].update(
    pill=DL_EINV, goal="einv", btn=_BTN_BIR, form_h="Talk to our BIR experts",
    h1='Is Every Invoice Ready for the <span class="hl">BIR EIS</span>?',
    sub="Before e-invoicing, each sales invoice needs the right customer TIN, an invoice number in series and VAT 12% "
        "computed correctly. Our BIR experts check and set this up with you in a <b>5 Days* BIR EIS Set-Up</b>, from "
        "the data you already keep.",
    ticks=["<b>Customer TINs</b> checked and on file.",
           "<b>Invoice numbers in series,</b> per branch.",
           "<b>VAT 12%</b> computed correctly on every invoice."],
    msg_ph="e.g. invoices from our accounting software and spreadsheets, 2 branches",
    check_h="What every invoice needs before e-invoicing.",
    check_lead="Which of these do you still fix by hand?",
    checks=[("Missing customer TINs", "<b>Customer TINs</b> are missing or typed differently each time."),
            ("Numbering gaps", "<b>Invoice numbers</b> skip or repeat across branches."),
            ("VAT mixed up", "<b>VAT 12%, zero-rated and exempt sales</b> get mixed up on the same invoice."),
            ("Invoices edited after issue", "<b>Issued invoices get edited</b> instead of a credit note.")],
    bp_h="What your 5 Days* BIR EIS Set-Up covers.",
    bp_lead="Your team keeps invoicing as usual while we set it up with you.",
    bp=["<b>Customer TINs</b> checked against your records",
        "<b>Invoice series</b> per branch, locked after issue",
        "<b>VAT 12%, zero-rated and exempt</b> codes set up",
        "<b>Sample invoices</b> for your Permit to Issue papers"],
    panel=EINV_PANEL, facts="einv", express=False,
    faq=[S_EINVCAS, S_EIS, ("What is a Permit to Issue (PTI)?",
                           "The BIR permit you need before issuing any e-invoice. You apply; we prepare the process flow and sample invoices with you."),
         S_SOFT, S_COST],
    close_h='Get every invoice ready for the <span class="hl">BIR EIS</span>.',
    close_p=CLOSE_P,
)

# Ad 277 - "From invoice booklet to e-invoice" (booklet poster). Business-owner voice, so its coverage block says "your
# business" (the firm-voice "cover" block stays for bir-firm-deadlines).
_FACTS["cover_me"] = ("Is your business covered by 31 December 2026?",
                      "General guidance from RR 26-2025 and RMC 98-2026, not tax advice. Your accountant or RDO confirms it.",
                      [("CAS or CBA with invoicing software", "Covered by 31 December 2026."),
                       ("Large Taxpayers Service accounts", "Covered by 31 December 2026."),
                       ("E-commerce and internet sellers", "Small, medium and large sellers (not micro): covered by 31 December 2026."),
                       ("Exporters, POS users, incentive-registered firms", "Later, once a separate regulation is issued."),
                       ("Micro taxpayers", "Exempt from mandatory e-invoicing."),
                       ("Not sure which group?", "Our BIR experts go through the rules with you in the meeting.")])
PAGES["bir-deadline"].update(
    pill=DL_EINV, goal="einv", btn=_BTN_BIR, form_h="Talk to our BIR experts",
    h1='From Invoice Booklet to <span class="hl">E-Invoice</span>.',
    sub="Today it is the invoice booklet, carbon copies and retyping at month end. After your "
        "<b>5 Days* BIR EIS Set-Up</b>, the same invoice is an e-invoice: customer TIN, invoice number and VAT 12% in "
        "place, ready for the BIR EIS. Our BIR experts set it up with you, from the data you already keep.",
    ticks=["<b>No more retyping</b> handwritten invoices at month end.",
           "<b>Customer TIN, invoice number and VAT 12%</b> on every invoice.",
           "<b>No big system change.</b> We set it up beside what you use today."],
    msg_ph="e.g. we write sales invoices in a booklet and retype them into spreadsheets",
    order=["hero", "check", "blueprint", "facts", "faq", "close"],
    myths=None, firm=None,
    check_h="Still writing sales invoices by hand?",
    check_lead="Which of these sounds familiar?",
    checks=[("Booklets and carbon copies", "<b>Sales invoices are written by hand</b> in a booklet with carbon copies."),
            ("Retyping at month end", "<b>Someone retypes every invoice</b> into spreadsheets at month end."),
            ("TINs and VAT checked by hand", "<b>TINs and VAT 12%</b> are checked by hand, one invoice at a time."),
            ("Booklets run out", "<b>New booklets</b> have to be ordered and tracked.")],
    bp_h="After your 5 Days* BIR EIS Set-Up.",
    bp_lead="The same invoice, issued as an e-invoice.",
    bp=["<b>Invoices issued from one system,</b> numbered in series",
        "<b>Customer TIN and VAT 12%</b> filled in on every invoice",
        "<b>Sample invoices</b> for your Permit to Issue papers",
        "<b>A walkthrough</b> for whoever issues your invoices"],
    panel=EINV_PANEL, facts="cover_me", express=False,
    faq=[("Is a printed or emailed PDF an e-invoice?", "No. A printed or emailed PDF is not an e-invoice."),
         S_EINVCAS, S_EIS, S_FILE, S_COST],
    close_h='Swap the booklet for <span class="hl">e-invoices</span>.',
    close_p=CLOSE_P,
)

CTAS.update({
    "bir-cas-for-accountants": dict(check="Start my CAS set-up", blueprint="Book My 5 Days Set-Up", facts="Check my CAS papers",
                                    express="Plan my set up", faq=_EXP, close="Book My 5 Days Set-Up"),
    "bir-call": dict(check="Hand it to our BIR experts", blueprint="Book a BIR CAS Meeting", facts="Check my CAS papers",
                     express="Plan my set up", faq=_EXP, close="Book a BIR CAS Meeting"),
    "bir-e-invoicing-plan": dict(check="Check my invoices", blueprint=_BTN_BIR, facts="Check what I need",
                                 express=_BTN_BIR, faq=_EXP, close=_BTN_BIR),
    "bir-deadline": dict(check="Swap my booklet", blueprint=_BTN_BIR, facts="Check if I am covered",
                         faq=_EXP, close=_BTN_BIR),
})

# ------------------------------------------------------------------ 25 Nov 2026: FB ad 266 lander overhaul (owner approved)
# /bir-firm-deadlines leads with the deadline and the cost of filing late (ad 266 title, caps; 31 December only since the
# owner's 25 Nov "the only deadline is dec 31"). The
# 5-day footnote and every "Express" / "handle" word are off this page; the 3 assumptions and "Is your client covered"
# sections stay as they were. Penalty figures: NIRC Sec. 248-250 as amended by RA 11976 (EOPT), small print on the page.
PAGES["bir-firm-deadlines"].update(
    pill=DL_CAS,
    h1='BIR CAS DEADLINE: 31 DEC 2026. <span class="hl lp-red">IS EVERY CLIENT SET UP TO E-INVOICE?</span>',
    sub="Covered CAS and CBA users must issue e-invoices from 31 December 2026. We set up the system side across your client portfolio. Your firm keeps the tax "
        "advisory, and each client files at its own RDO.",
    ticks=["<b>We set up:</b> CAS books, sample outputs, branch invoice series and audit trails.",
           "<b>You keep:</b> the tax advisory and the client relationship.",
           "<b>A written quote</b> per client before any work starts."],
    fine="", h1_cls="lp-caps",
    order=["hero", "costs", "myths", "facts", "blueprint", "firm", "faq", "close"],
    costs=("What late filing costs",
           ["<b>25% surcharge</b> on the tax due (10% for micro and small taxpayers)",
            "<b>12% interest</b> a year (6% for micro and small taxpayers)",
            "<b>Information returns:</b> P1,000 per failure, up to P25,000 a year (P500 / P12,500 for micro and small)"],
           "*Late filing of BIR returns, NIRC Sec. 248, 249 and 250 as amended by RA 11976 (Ease of Paying Taxes Act). "
           "E-invoicing per RR 26-2025 and RMC 98-2026. General guidance, not tax advice. TechNext is "
           "not affiliated with the BIR. Confirm with your RDO."),
    bp_h="What you leave the meeting with.",
    bp_lead="A 15 minute online meeting with a BIR Compliance Expert.",
    bp=["Where each client stands against 31 December",
        "What each client's CAS or CBA application pack needs",
        "A written quote per client"],
)
CTAS["bir-firm-deadlines"]["costs"] = "Book my partner meeting"
