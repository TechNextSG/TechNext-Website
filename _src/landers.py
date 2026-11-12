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
  2 pain checklist (ticked answers carry into the form)
  3 who you meet (two BIR Compliance Experts)
  4 what you leave with, beside a sample screen
  5 the page's own facts
  6 one line on the 5 Day Express (CAS pages) or the steps (e-invoicing)
  7 objections FAQ
  8 closing band with the deadline, back to the form
Header: logo only (gs-fx hides the menu, header buttons, floats and the BIR notice bar); no links out of the page.

Brand voice (8-12 Nov 2026 owner + Sky rules): written for the accountant; 5 days always with an asterisk; titles name
BIR CAS; "BIR Compliance Expert", never "adviser call" / "call" / "Google Meet"; the meeting is 15 to 20 minutes,
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

_e = lambda s: _html.escape(s, quote=True)

PROOF = ('<strong>BIR forms we set up:</strong> books of accounts, 2307, SLSP, SAWT, QAP · '
         '<strong>142 projects delivered</strong> by our own team in Taguig City')
FINE = ('*As quick as 5 days for a standard scope with your data ready. Bigger scopes run as extra sprints, written into '
        'your quote. We are not affiliated with, accredited by or acting for the BIR or any government agency, and we do '
        'not file or register on your behalf.')
BOOK = "https://technext.odoo.com/book/c82cf8a9"
UNDER = "15 to 20 minutes, online. Slots Monday to Saturday this week. Written quote before any work."
DL_CAS = "<b>Deadline</b> · 2026 books in ORUS by 30 January 2027"
DL_EINV = ('<b>Deadline</b> · <span data-fw-dl-static>e-invoices by 31 December 2026</span><span data-fw-dl-live hidden>'
           '<b data-fw-days>--</b> <span data-fw-days-word>days</span> to 31 December 2026</span>')
SUB_CAS = ("Meet a BIR Compliance Expert online for 15 to 20 minutes. You leave with your BIR CAS Blueprint: what to set "
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
                  steps=["Draft", "Posted", "Locked", "EIS assessed"],
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
                "No. Your current software stays. We add a plug-in beside your current software, set up for your BIR books and reports, so nothing is swapped out while we work.")
FAQ_COST = ("What does it cost?",
            "It depends on your scope, so we don't publish a price. The meeting has no charge, and you get a written quote before any work starts.")
FAQ_LINK = ("Is TechNext linked to the BIR?",
            "No. We are not affiliated with or acting for the BIR. You register and file yourself; we set your system up and prepare the sample outputs with you.")
FAQ_5DAY = ("How long does the 5 Day Express* take?",
            "For a standard scope with your data ready, the set up runs as a 5 Day Express.* Bigger scopes, more branches or messy data run as extra sprints, and your quote says so before you agree to anything. Your RDO sets its own timeline for the registration.")

CLOSE_P = ("Fill in the short form (about a minute). A BIR Compliance Expert replies from sales@technext.asia within one "
           "business day. <strong>15 to 20 minutes, online, no charge.</strong> Any work starts with a written quote.")

# ---------------------------------------------------------------------------------------------------------------- pages
PAGES = {   # H1 titles: owner pick 12 Nov 2026, PR #351 (get-started = set B, the rest = set A). Do not change them.
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
        bp_lead="One online meeting with a BIR Compliance Expert. You leave with a plan, not a sales pitch.",
        bp=["Where your books stand against the BIR CAS requirements",
            "CAS or CBA: which one you register, checked with your accountant",
            "What your 5 Day Express* covers for your scope",
            "A written quote before any work starts"],
        panel=CAS_PANEL, facts=None, express=True,
        faq=[FAQ_5DAY, FAQ_SOFTWARE, FAQ_COST,
             ("Who do we meet?", "A BIR Compliance Expert from our own team in Taguig City, Neil or Jeric. They look at how you record sales, bills and payments today and stay with you after go live."),
             FAQ_LINK],
        close_h='30 January 2027 is close. Start your <span class="hl">BIR CAS</span> today.',
        close_p="Calendar-year CAS and CBA users register their 2026 computerised books in ORUS by 30 January 2027. "
                "<strong>15 to 20 minutes, online, no charge.</strong> Any work starts with a written quote.",
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
    # Google Ads test page (variant B, noindex). Angle: the ORUS date.
    "bir-call": dict(
        source="BIR adviser call (fast form B)",
        pill=DL_CAS,
        h1='<span class="hl">BIR CAS</span> Books Due 30 January 2027.',
        sub="Meet a BIR Compliance Expert online for 15 to 20 minutes. You leave with your BIR CAS Blueprint: which books "
            "you register, what to set up first, and a written quote.",
        ticks=["<b>Your BIR CAS Blueprint</b> from the meeting: what has to be in place before 30 January.",
               "<b>Journals, ledger and subsidiary books</b> printed from one system, reviewed by your accountant.",
               "<b>A written quote</b> before any work starts."],
        btn=BTN_CAS,
        msg_ph="e.g. books in spreadsheets today, CAS registered last year, 1 branch",
        check_h="How ready are your books for 30 January?",
        checks=[("Books kept in spreadsheets", "<b>Your books are kept in spreadsheets</b> and pasted together at year end."),
                ("Journals don't match the ledger", "<b>The journals and the general ledger</b> don't agree until someone fixes them by hand."),
                ("Year end close takes weeks", "<b>Closing the year takes weeks,</b> not days."),
                ("Books printed from several systems", "<b>Your books print from several systems</b> with different layouts."),
                ("Never registered in ORUS", "<b>You have never registered books in ORUS</b> and don't know what it expects."),
                ("Only one person knows the year end file", "<b>Only one person knows the year end file,</b> and January is their busiest month.")],
        bp_h='What you leave the meeting with.',
        bp_lead="One online meeting with a BIR Compliance Expert, before your books are due.",
        bp=["Which books you register, and in what format",
            "What has to be in place before 30 January 2027",
            "What your 5 Day Express* covers for your scope",
            "A written quote before any work starts"],
        panel=CAS_PANEL, facts="orus", express=True,
        faq=[("When are computerised books due in ORUS?", "Within 30 days after the close of each taxable year (RMC 3-2023), online through ORUS (RMC 4-2026). For calendar-year taxpayers, computerised books for 2026 are due by 30 January 2027, and loose-leaf books by 15 January 2027, unless the BIR announces otherwise. Your accountant or RDO confirms the dates for your business."),
             FAQ_SOFTWARE, FAQ_5DAY,
             ("Do you register the books for us?", "No. You register in ORUS yourself. We set up the system your books come from and prepare them with you and your accountant."),
             FAQ_COST],
        close_h='30 January 2027 is close. Start your <span class="hl">BIR CAS</span> books today.',
        close_p=CLOSE_P,
    ),
    # 12 Nov 2026: the BIR CAS topic lander (the /bir-cas page stays the menu / Google page).
    "bir-cas-for-accountants": dict(
        source="BIR adviser call (accountants lander)",
        pill=DL_CAS,
        h1='<span class="hl">BIR CAS</span> for Accountants. <span class="hl">5 Day</span> Setup.*',
        sub="Meet a BIR Compliance Expert online for 15 to 20 minutes. You leave with your BIR CAS Blueprint: which reports "
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
        faq=[("Can the system produce our 2307s, SLSP, SAWT and QAP?", "Yes. The plug-in we set up beside your current software generates 2306 and 2307 certificates from vendor bills, and SLSP, SAWT and QAP with DAT exports, from the same entries as your books."),
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
        sub="Meet a BIR Compliance Expert online for 15 to 20 minutes. You leave with your e-invoicing plan: whether you are "
            "covered, what to set up, in what order, and a written quote.",
        ticks=["<b>Your e-invoicing plan</b> from the meeting: PTI papers, invoice flows and branches, in order.",
               "<b>Keep your current software.</b> We add the invoicing beside it.",
               "<b>An EIS assessment,</b> quoted separately before any work."],
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
            "What an EIS connection would need, and how we quote it",
            "A written quote before any work starts"],
        panel=EINV_PANEL, facts="einv", express=False,
        faq=[("What is the BIR e-invoicing deadline?", "Covered taxpayers must issue electronic invoices on or before 31 December 2026. RR 26-2025 set the date and RMC 98-2026 kept it."),
             ("What is a Permit to Issue (PTI)?", "The BIR permit a covered taxpayer needs before issuing any e-invoice. EIS Certification must then be completed within six months of the PTI. You apply for it yourself; we prepare the process flow and sample invoices with you."),
             ("Do you connect us to the EIS?", "The system we set up has no built-in connection to the BIR's EIS, and TechNext has not built one. If you are covered, we assess the options with you and quote any connection separately."),
             FAQ_SOFTWARE, FAQ_COST],
        close_h='31 December 2026 is close. Start your <span class="hl">BIR e-invoicing</span> plan today.',
        close_p=CLOSE_P,
    ),
}

# ---------------------------------------------------------------------------------------------------------- page facts
_FACTS = {
    "rmc": ("What does the BIR ask for?",
            "RMC 5-2021 lists what goes in a CAS or CBA application. Each part shapes your set up.",
            [("A sworn statement", "A description of the system and the invoices and reports it produces."),
             ("Sample invoices", "Printed from the system you will actually use."),
             ("Sample books and reports", "Your books of accounts and the other system reports."),
             ("An audit trail printout", "From the system, showing who did what and when."),
             ("The requirements checklist", "The functional and technical requirements in Annex B, signed."),
             ("Your books, every year", "Computerised books registered online through ORUS within 30 days after year end.")]),
    "orus": ("What has to be in place by 30 January?",
             "Computerised books are registered within 30 days after the close of each taxable year (RMC 3-2023), online through ORUS (RMC 4-2026).",
             [("Books from one system", "Journals, general ledger and subsidiary books, printed from the system you registered."),
              ("Entries that agree", "The journals and the ledger match before you print, not after."),
              ("The year closed", "Your 2026 entries posted and the year closed in the system."),
              ("Your accountant's review", "Your accountant checks the books before you register them."),
              ("Loose-leaf books, if any", "Due earlier: 15 January 2027 for calendar-year taxpayers."),
              ("Your RDO's dates", "Your accountant or RDO confirms the dates for your business.")]),
    "quarter": ("Your quarter end, from one set of books.",
                "Every report comes from the entries you already post, so you reconcile once.",
                [("2307 per payee", "Generated from each vendor bill with withholding, ready to send."),
                 ("ATC on every line", "Withholding taxes and ATC codes set up once, used on every bill."),
                 ("SLSP with DAT files", "Sales and purchases lists exported for the BIR's tools."),
                 ("SAWT and QAP", "Built from the same entries as your ledger."),
                 ("2550Q VAT summary", "Output and input VAT from the posted entries."),
                 ("Books of accounts", "Journals and ledger for your CAS or CBA, from the same system.")]),
    "einv": ("What the e-invoicing rules ask for.",
             "From RR 26-2025 and RMC 98-2026. Your set up is built around them.",
             [("A Permit to Issue (PTI)", "You need a PTI Electronic Invoice before you issue any e-invoice."),
              ("EIS Certification", "Completed within six months of the PTI."),
              ("No edits after issue", "A credit note covers a decrease; a new e-invoice covers an increase."),
              ("A plan for downtime", "A BIR-authorised manual invoice, then an e-invoice that references it."),
              ("Every branch", "Head office and all branches issue e-invoices."),
              ("Micro taxpayers exempt", "Your accountant confirms whether your business is covered.")]),
}

_STEPS_EINV = [("15 to 20 minute meeting", "A BIR Compliance Expert checks whether you are covered and how you invoice today."),
               ("Map your invoice flows", "Customer invoices, credit notes, branches, anything issued outside your system."),
               ("Set it up and test", "Taxes, invoice layouts and BIR reports, tested on your real data."),
               ("Assess the EIS connection", "What sending invoice data would need, quoted as separate work."),
               ("Prepare your PTI papers", "Process flow and sample invoices, prepared with you. You apply.")]


def _cta(label, cls="btn-link", carry=False):
    return f'<a class="{cls}" href="#book" data-to-form{" data-carry-check" if carry else ""}>{label} {{{{icon:arrow}}}}</a>'


def _form(p):
    h = "Get your e-invoicing plan" if p["btn"] == BTN_EINV else "Get your BIR CAS Blueprint"
    return f'''    <div class="fw-side fw-side--form" id="book">
  <form class="form gs-form fw-form" id="gs-form" data-loop novalidate data-endpoint="/api/lead" data-fw-form>
      <i class="fx-result-glow gs-glow" aria-hidden="true"></i>
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="source" value="{_e(p["source"])}">
      <div class="fw-fhead">
        <h2 class="gs-form-h">{h}</h2>
        <p class="gs-form-sub fw-fsub">Four details. A BIR Compliance Expert replies within one business day to set your 15 to 20 minute online meeting. Want a time now? <a href="{BOOK}" target="_blank" rel="noopener" data-meet>Pick a slot this week</a>.</p>
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
        <div class="field"><label for="gs-msg">Anything we should know?</label><textarea id="gs-msg" name="message" rows="3" placeholder="{_e(p["msg_ph"])}"></textarea></div>
      </fieldset>
      <div class="form-foot">
        <button class="btn btn-primary btn-lg gs-submit" type="submit"><span class="btn-label">{p["btn"]} {{{{icon:arrow}}}}</span><span class="btn-busy" aria-hidden="true"></span></button>
      </div>
      <p class="lp-under">{UNDER}</p>
      <p class="form-status" role="status" aria-live="polite"></p>
      <div class="form-sent"><h3>Thanks, your request is in.</h3><p>Neil or Jeric replies from sales@technext.asia within one business day to set your 15 to 20 minute online meeting. Want to pick a time now? <a href="{BOOK}" target="_blank" rel="noopener" data-meet>Choose a slot this week</a>.</p></div>
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
      <h1 id="fw-h1">{p["h1"]}</h1>
      <p class="lead fw-hero-lead">{p["sub"]}</p>
      <ul class="lp-ticks">{ticks}</ul>
      <p class="small muted fw-proof">{PROOF}</p>
      <p class="lp-fine">{FINE}</p>
      <p class="sr-only" role="status" aria-live="polite" data-fw-status></p>
    </div>
{_form(p)}
  </div>
</section>'''


def _check(p):
    items = "".join(
        f'<li><label><input type="checkbox" value="{_e(v)}"><span class="fw-box">{{{{icon:check}}}}</span><span>{t}</span></label></li>'
        for v, t in p["checks"])
    return f'''<section class="section fx-sec fw-check-sec lp-check-sec" id="self-check" aria-labelledby="fw-check-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="fw-check-h">{p["check_h"]}</h2><p class="lead">Tick the ones that sound familiar. Your ticks go into the form, so your expert comes prepared.</p></div>
    <div class="fw-check lp-check reveal">
      <ul class="fw-check-list" id="fw-check">{items}</ul>
      <p class="lp-check-act">{_cta(p["btn"], "btn btn-primary btn-lg", carry=True)}</p>
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
    <div class="xp-head reveal"><p class="xp-kicker">Who you meet</p><h2 id="xp-h">Your BIR Compliance Experts.</h2><p class="xp-lead">Your Blueprint meeting is with a BIR Compliance Expert who has set up the books your RDO asks for, not a salesperson.</p></div>
    <div class="xp-grid">{cards}</div>
  </div>
</section>'''


def _blueprint(p):
    items = "".join(f"<li>{{{{icon:check}}}} {t}</li>" for t in p["bp"])
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
      <p class="sec-next reveal">{_cta(p["btn"], "btn btn-primary")}</p>
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
        body = ("The BIR registers your business's use of a system, not a software brand, and it has warned against "
                "\"BIR-accredited\" claims, so we don't make them. You file at your RDO; the decision is the RDO's."
                if p["facts"] == "rmc" else
                "The BIR has not accredited or endorsed any e-invoicing service provider (advisory, 14 September 2026). "
                "The system we set up has no built-in connection to the BIR's EIS, and TechNext has not built one. If you "
                "are covered, we assess the options with you and quote any connection separately.")
        note = f'<div class="fw-note lp-note reveal"><h3>A word of caution</h3><p>{body}</p></div>'
    return f'''<section class="section fx-sec fw-rules-sec" aria-labelledby="lp-facts-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-facts-h">{h}</h2><p class="lead">{lead}</p></div>
    <ol class="fw-rules">{lis}</ol>
    {note}
    <p class="sec-next reveal">{_cta(p["btn"])}</p>
  </div>
</section>'''


def _express(p):
    if not p["express"]:
        lis = "".join(f'<li class="reveal" style="--i:{i}"><span class="gs-n">{i + 1}</span><h3>{a}</h3><p>{b}</p></li>'
                      for i, (a, b) in enumerate(_STEPS_EINV))
        return f'''<section class="section fx-sec fx-sec--alt gs-how" aria-labelledby="lp-steps-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-steps-h">From the first meeting to your PTI papers.</h2></div>
    <ol class="gs-steps fw-steps" data-loop>{lis}</ol>
  </div>
</section>'''
    return f'''<section class="section lp-x5" aria-label="5 Day Express">
  <div class="container">
    <p class="lp-x5-line reveal"><span class="lp-x5-badge">{{{{icon:zap}}}}5 Day Express*</span>Most standard set ups run as a 5 Day Express.* Your expert walks you through the plan in the meeting. {_cta(p["btn"])}</p>
  </div>
</section>'''


def _faq(p):
    qs = "".join(f'<details><summary>{_e(q)} {{{{icon:chevron}}}}</summary><div class="faq-a"><p>{_e(a)}</p></div></details>'
                 for q, a in p["faq"])
    return f'''<section class="section fx-sec" aria-labelledby="lp-faq-h">
  <div class="container fx-faq">
    <div class="sec-head reveal"><h2 id="lp-faq-h">Before you book, answered.</h2></div>
    <div class="faq reveal">{qs}</div>
    <p class="sec-next reveal">{_cta(p["btn"])}</p>
  </div>
</section>'''


def _close(p):
    return f'''<section class="section fx-close-sec">
  <div class="container">
    <div class="fx-close reveal">
      <div class="fx-close-glow" aria-hidden="true"></div>
      <div><h2>{p["close_h"]}</h2><p>{p["close_p"]}</p></div>
      <div class="actions">{_cta(p["btn"], "btn btn-white btn-lg")}</div>
    </div>
  </div>
</section>'''


def page_html(key: str) -> str:
    p = PAGES[key]
    return "\n\n".join(x for x in [_hero(p), _check(p), _experts(p), _blueprint(p), _facts(p), _express(p), _faq(p), _close(p)] if x)


_TOKEN = _re.compile(r"\{\{LANDER:([a-z0-9-]+)\}\}")


def tokens(content: str, experts: str = "", express: str = "") -> str:
    """experts / express: the site-wide blocks build.py passes in; the landers write their own (12 Nov 2026 Sky fixes)."""
    return _TOKEN.sub(lambda m: page_html(m.group(1)), content)
