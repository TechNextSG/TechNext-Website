# -*- coding: utf-8 -*-
"""Campaign landing pages (owner 12 Nov 2026): "make sure all landing pages have a similar format like /bir-adviser-call,
no header distraction, the content should be variant, all have a fill-out form, proper funnelling", in the new brand voice.

One layout, five pages. A page in _src/pages/ holds only its meta and {{LANDER:<key>}}; this module writes the body.
Funnel, top to bottom (every section ends on one action: scroll to the form, #book):
  1 hero: blunt title + the offer, proof, and the form (on phones the form follows the title)
  2 who you meet (the expert cards)
  3 self-check: the reader's own pains, ticked answers carry into the form
  4 the meeting outcome: "your Blueprint", beside a sample screen
  5 the page's own facts (what the BIR asks, the deadline, the quarter-end)
  6 how it runs: the 5 Day Express (CAS pages) or the steps (e-invoicing)
  7 objections FAQ
  8 closing band with the deadline, back to the form
Header: logo only (gs-fx hides the menu, header buttons, floats and the BIR notice bar); no links out of the page.

Brand voice (8-12 Nov 2026 owner + Sky rules): written for the accountant; lead with the 5 Day Express* (asterisk,
never "5-Day"); titles blunt and naming BIR CAS, "5 Day" and "BIR CAS" highlighted; "BIR Compliance Expert", never
"adviser call" / "call" / "Google Meet"; the meeting is 15 to 20 minutes, online, no charge, and ends with a Blueprint;
Odoo and ERP never in titles, headings or meta (Odoo named only in body text as the plug-in); no fixed price, no
"free" near Odoo, no BIR link, no "ready / compliant / accredited" claims, no other software brands, no Day 2-5
breakdown, no Lean / Agile / Six Sigma, British spelling, no exclamation marks.
"""
import html as _html
import json as _json
import re as _re

import fw_needs as _FW
import industry_fx as _IFX

_e = lambda s: _html.escape(s, quote=True)

PROOF = ('<strong>142 projects delivered</strong> · 90+ enterprise clients · 25+ countries · '
         'our own team in Taguig City · written quote first')
FINE = ('*As quick as 5 days for a standard scope with your data ready. Bigger scopes run as extra sprints, written into '
        'your quote. TechNext is an Odoo Ready Partner in Singapore. We are not affiliated with, accredited by or acting for '
        'the BIR or any government agency, and we do not file or register on your behalf.')
BOOK = "https://technext.odoo.com/book/c82cf8a9"


def _panel(key):
    return next(n["panel"] for n in _FW.NEEDS if n["key"] == key)


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

# ---------------------------------------------------------------------------------------------------------------- pages
PAGES = {
    # Meta ads 233 / 235 / 246 / 247. Form tag stays "Meeting request" (api/lead.py FORMS).
    "get-started": dict(
        source="Meeting request (get-started call-back form)",
        pill="<b>5 Day Express</b> · BIR CAS setup sprint",
        h1='<span class="hl">5 Day</span> <span class="hl">BIR CAS</span> Start Instantly*',
        lead="<strong>BIR Compliance Experts. Starting today. As quick as 5 days.*</strong> Your books of accounts, 2307, "
             "SLSP, SAWT and QAP, set up beside the accounting software you already use.",
        ticks=["<b>Keep your current software.</b> Nothing is swapped out.",
               "<b>Leave the meeting with your BIR CAS Blueprint.</b> What to do, in what order.",
               "<b>A written quote</b> before any work starts."],
        form_h="Start today",
        form_sub="Four details. A BIR Compliance Expert replies within one business day to set your 15 to 20 minute online "
                 "meeting. No charge.",
        btn="Start Instantly",
        msg_ph="e.g. accounting software plus spreadsheets today, 2 branches, CAS registration due",
        check_h="How much of your month-end is still done by hand?",
        checks=[("Invoices typed in Word or spreadsheets", "<b>Invoices are typed in Word or spreadsheets,</b> with no audit trail behind them."),
                ("2307s re-typed every quarter", "<b>Someone re-types 2307 certificates every quarter</b> and chases suppliers for the missing ones."),
                ("SLSP, SAWT, QAP rebuilt in spreadsheets", "<b>SLSP, SAWT and QAP are rebuilt in spreadsheets</b> the week they are due."),
                ("Books and sales in separate systems", "<b>Sales and the books live in separate systems,</b> so month-end starts with reconciling them."),
                ("CAS paperwork stuck", "<b>Your CAS paperwork keeps stalling</b> on the system description and sample outputs."),
                ("Only one person knows the month-end file", "<b>Only one person knows the month-end file,</b> and filing stops when they are on leave.")],
        msgs=["Tick what sounds familiar. Your answers stay on this page unless you add them to the form.",
              "A good start. Your BIR Compliance Expert covers it in your Blueprint.",
              "This is where most finance teams are. It all comes from one cause: books and BIR work in separate places.",
              "Your team is doing the system's job by hand. Start before the 30 January 2027 ORUS date."],
        bp_h='Your <span class="hl">BIR CAS</span> Blueprint, in 15 to 20 minutes.',
        bp_lead="One online meeting with a BIR Compliance Expert. You leave with a plan, not a sales pitch.",
        bp=["Where your books stand against the BIR CAS requirements",
            "CAS or CBA: which one you register, checked with your accountant",
            "What your 5 Day Express covers for your scope*",
            "A written quote before any work starts"],
        panel=_panel("cas"),
        facts=None, express=True,
        faq=[("Is it really 5 days?", "For a standard scope with your data ready, the setup runs as a 5 Day Express. Bigger scopes, more branches or messy data run as extra sprints, and your quote says so before you agree to anything. Your RDO sets its own timeline for the registration."),
             ("Do we have to change our accounting software?", "No. Your current software stays. We add a plug-in beside it (Odoo, set up for your BIR books and reports), so nothing is swapped out while we work."),
             ("What does it cost?", "It depends on your scope, so we don't publish a price. The meeting has no charge, and you get a written quote before any work starts."),
             ("Who do we meet?", "Neil or Jeric, our BIR Compliance Experts. They look at how you record sales, bills and payments today and stay with you after go-live."),
             ("Is TechNext linked to the BIR?", "No. We are not affiliated with or acting for the BIR. You register your system at your RDO; we set it up and prepare the sample outputs with you.")],
        close_h='30 January 2027 is close. Start your <span class="hl">BIR CAS</span> today.',
        close_p="Calendar-year CAS and CBA users register their 2026 computerised books in ORUS by 30 January 2027. "
                "<strong>15 to 20 minutes, online, no charge.</strong> Any work starts with a written quote.",
    ),
    # Meta traffic ads 225 / 228 (3 Nov notes). Form tag "BIR adviser call".
    "bir-adviser-call": dict(
        source="BIR adviser call",
        pill="<b>BIR CAS / CBA setup</b> · keep your current software",
        h1='<span class="hl">BIR CAS</span> setup. Your software stays.',
        lead="A CAS or CBA needs its own BIR registration: a system description, sample books and sample outputs. We "
             "set it up with you, so every paper prints from the system you will actually use. <strong>As quick as 5 days.*</strong>",
        ticks=["<b>Process flow, sample invoices and books,</b> prepared with you",
               "<b>Checked against Annex B</b> before you file",
               "<b>A written quote</b> before any work starts"],
        form_h="Get your BIR CAS Blueprint",
        form_sub="Four details. A BIR Compliance Expert replies within one business day to set your 15 to 20 minute online "
                 "meeting. No charge.",
        btn="Get my BIR CAS Blueprint",
        msg_ph="e.g. new system to register as a CAS, head office and 2 branches",
        check_h="Where is your CAS application stuck?",
        checks=[("No system description yet", "<b>Nobody has written the system description</b> the sworn statement needs."),
                ("Sample outputs from the wrong system", "<b>Your sample invoices and books</b> come from a system that was never set up for them."),
                ("No audit trail printout", "<b>The system can't print an audit trail</b> showing who changed what, and when."),
                ("Annex B never checked", "<b>Nobody has checked the Annex B requirements</b> against your set-up and hosting."),
                ("Branches invoice their own way", "<b>Each branch issues invoices its own way,</b> with its own series or layout."),
                ("Not sure CAS or CBA", "<b>You are not sure</b> whether you register a CAS or a CBA.")],
        msgs=["Tick what sounds familiar. Your answers stay on this page unless you add them to the form.",
              "A good start. Your BIR Compliance Expert covers it in your Blueprint.",
              "Most applications stall right here. The papers have to come from the system you will actually use.",
              "Your application needs a set-up first. Start before the 30 January 2027 ORUS date."],
        bp_h='Your <span class="hl">BIR CAS</span> Blueprint, in 15 to 20 minutes.',
        bp_lead="One online meeting with a BIR Compliance Expert. You leave knowing what to file and how to get there.",
        bp=["CAS or CBA: which one you register",
            "Which papers your application needs, and where each one comes from",
            "What your 5 Day Express covers for your scope*",
            "A written quote before any work starts"],
        panel=_panel("cas"),
        facts="rmc", express=True,
        faq=[("Do we need a CAS or a CBA?", "RMO 9-2021 draws the line at invoices. If your system issues them, it is a CAS; if invoices are issued by hand and the system keeps your books, it is a CBA. Large taxpayers must use a CAS. We go through it with your accountant, and your RDO can confirm it."),
             ("Is TechNext BIR-accredited?", "No, and no accounting software is. The BIR registers each business's use of a system, not a software brand, and it has warned against \"BIR-accredited\" claims. We set your system up for the BIR's requirements and prepare the sample outputs with you."),
             ("We already have a CAS permit for our current system. What happens?", "A new accounting system usually needs its own BIR registration. Check the details with your accountant; we prepare the process flow and sample outputs from the system you will actually use."),
             ("Do we have to change our accounting software?", "No. We add a plug-in beside it (Odoo, set up for your BIR books and reports). Your current software stays."),
             ("What does it cost?", "It depends on your scope, so we don't publish a price. The meeting has no charge, and you get a written quote before any work starts.")],
        close_h='Don\'t wait for the deadline. Start your <span class="hl">BIR CAS</span> today.',
        close_p="Fill in the short form (about a minute). A BIR Compliance Expert replies from sales@technext.asia. "
                "<strong>15 to 20 minutes, online, no charge.</strong> Any work starts with a written quote.",
    ),
    # Google Ads test page (variant B, noindex). Angle: the ORUS date.
    "bir-call": dict(
        source="BIR adviser call (fast form B)",
        pill="<b>Computerised books</b> · ORUS by 30 January 2027",
        h1='<span class="hl">BIR CAS</span> books. ORUS by 30 January 2027.',
        lead="Calendar-year CAS and CBA users register their 2026 computerised books in ORUS by 30 January 2027. We set "
             "your books up so they come out of your system in the shape the BIR asks for. <strong>As quick as 5 days.*</strong>",
        ticks=["<b>Journals, ledger and subsidiary books</b> printed from one system",
               "<b>Your accountant reviews them</b> before you register",
               "<b>A written quote</b> before any work starts"],
        form_h="Get your year-end Blueprint",
        form_sub="Four details. A BIR Compliance Expert replies within one business day to set your 15 to 20 minute online "
                 "meeting. No charge.",
        btn="Get my year-end Blueprint",
        msg_ph="e.g. books in spreadsheets today, CAS registered last year, 1 branch",
        check_h="How ready are your books for 30 January?",
        checks=[("Books kept in spreadsheets", "<b>Your books are kept in spreadsheets</b> and pasted together at year-end."),
                ("Journals don't match the ledger", "<b>The journals and the general ledger</b> don't agree until someone fixes them by hand."),
                ("Year-end close takes weeks", "<b>Closing the year takes weeks,</b> not days."),
                ("Books printed from several systems", "<b>Your books print from several systems</b> with different layouts."),
                ("Never registered in ORUS", "<b>You have never registered books in ORUS</b> and don't know what it expects."),
                ("Only one person knows the year-end file", "<b>Only one person knows the year-end file,</b> and January is their busiest month.")],
        msgs=["Tick what sounds familiar. Your answers stay on this page unless you add them to the form.",
              "A good start. Your BIR Compliance Expert covers it in your Blueprint.",
              "Most finance teams are here in November. One set of books fixes most of it.",
              "January will be tight. Start now, before the 30 January 2027 ORUS date."],
        bp_h='Your year-end Blueprint, in 15 to 20 minutes.',
        bp_lead="One online meeting with a BIR Compliance Expert, before your books are due.",
        bp=["Which books you register, and in what format",
            "What has to be in place before 30 January 2027",
            "What your 5 Day Express covers for your scope*",
            "A written quote before any work starts"],
        panel=_panel("cas"),
        facts="orus", express=True,
        faq=[("When are computerised books due in ORUS?", "Within 30 days after the close of each taxable year (RMC 3-2023), online through ORUS (RMC 4-2026). For calendar-year taxpayers, computerised books for 2026 are due by 30 January 2027, and loose-leaf books by 15 January 2027, unless the BIR announces otherwise. Your accountant or RDO confirms the dates for your business."),
             ("Do we have to change our accounting software?", "No. We add a plug-in beside it (Odoo, set up for your BIR books and reports). Your current software stays."),
             ("Is it really 5 days?", "For a standard scope with your data ready, yes. Bigger scopes run as extra sprints, and your quote says so before you agree to anything."),
             ("Do you register the books for us?", "No. You register in ORUS yourself. We set up the system your books come from and prepare them with you and your accountant."),
             ("What does it cost?", "It depends on your scope, so we don't publish a price. The meeting has no charge, and you get a written quote before any work starts.")],
        close_h='30 January 2027 is close. Start your <span class="hl">BIR CAS</span> books today.',
        close_p="Fill in the short form (about a minute). A BIR Compliance Expert replies from sales@technext.asia. "
                "<strong>15 to 20 minutes, online, no charge.</strong> Any work starts with a written quote.",
    ),
    # NEW 12 Nov 2026: the BIR CAS topic lander (the /bir-cas page stays the menu / Google page).
    "bir-cas-for-accountants": dict(
        source="BIR adviser call (accountants lander)",
        pill="<b>For accountants</b> · BIR CAS",
        h1='<span class="hl">BIR CAS</span> for accountants. <span class="hl">5 Day</span> Start.*',
        lead="2307, SLSP, SAWT, QAP and your books of accounts, from the entries you already post. Nothing is typed twice, "
             "and your current software stays. <strong>As quick as 5 days.*</strong>",
        ticks=["<b>2307 certificates per payee,</b> made from the vendor bill",
               "<b>SLSP, SAWT and QAP with DAT files,</b> built from your books",
               "<b>You review,</b> we set it up"],
        form_h="Get your quarter-end Blueprint",
        form_sub="Four details. A BIR Compliance Expert replies within one business day to set your 15 to 20 minute online "
                 "meeting. No charge.",
        btn="Get my quarter-end Blueprint",
        msg_ph="e.g. 40 payees a quarter, SLSP rebuilt in spreadsheets, CAS registration due",
        check_h="What does your quarter-end look like?",
        checks=[("2307s typed by hand", "<b>2307 certificates are typed by hand</b> every quarter, one payee at a time."),
                ("Missing 2307s chased", "<b>You chase suppliers</b> for the 2307s that never arrived."),
                ("SLSP rebuilt from exports", "<b>The SLSP is rebuilt from exports</b> the week it is due."),
                ("SAWT and QAP totals don't match", "<b>SAWT and QAP totals don't match</b> the books on the first try."),
                ("ATC codes looked up every time", "<b>ATC codes are looked up</b> every time a bill is entered."),
                ("2550Q built in a separate file", "<b>The 2550Q VAT summary</b> is built in a separate file.")],
        msgs=["Tick what sounds familiar. Your answers stay on this page unless you add them to the form.",
              "A good start. Your BIR Compliance Expert covers it in your Blueprint.",
              "This is most quarter-ends we see. It all comes from the lists being built outside the books.",
              "Your team is rebuilding what the books already know. Fix it before the next quarter-end."],
        bp_h='Your quarter-end Blueprint, in 15 to 20 minutes.',
        bp_lead="One online meeting with a BIR Compliance Expert who speaks accountant.",
        bp=["Which of your reports can come straight from the books",
            "How your ATC codes and withholding taxes are set up",
            "What your 5 Day Express covers for your scope*",
            "A written quote before any work starts"],
        panel=_panel("2307"),
        facts="quarter", express=True,
        faq=[("Can the system produce our 2307s, SLSP, SAWT and QAP?", "Yes. The plug-in we set up (Odoo, with its Philippine localisation) generates 2306 and 2307 certificates from vendor bills, and SLSP, SAWT and QAP with DAT exports, from the same entries as your books."),
             ("Do we have to change our accounting software?", "No. Your current software stays. The plug-in sits beside it, so nothing is swapped out while we work."),
             ("Who checks the set-up?", "You and your accountant. Our BIR Compliance Experts set up the taxes and reports; your accountant reviews the outputs before anything is filed."),
             ("Is TechNext linked to the BIR?", "No. We are not affiliated with or acting for the BIR. You file and register yourself; we set the system up and prepare the outputs with you."),
             ("What does it cost?", "It depends on your scope, so we don't publish a price. The meeting has no charge, and you get a written quote before any work starts.")],
        close_h='Your next quarter-end, from one set of books. Start your <span class="hl">BIR CAS</span> today.',
        close_p="Fill in the short form (about a minute). A BIR Compliance Expert replies from sales@technext.asia. "
                "<strong>15 to 20 minutes, online, no charge.</strong> Any work starts with a written quote.",
    ),
    # NEW 12 Nov 2026: the e-invoicing topic lander (the /bir-e-invoicing page stays the menu / Google page). Not for ads
    # yet (ads are CAS-first, no e-invoicing).
    "bir-e-invoicing-plan": dict(
        source="BIR adviser call (e-invoicing lander)",
        pill='<b>BIR e-invoicing</b> · <span data-fw-dl-static>due 31 December 2026</span><span data-fw-dl-live hidden><b data-fw-days>--</b> <span data-fw-days-word>days</span> to 31 December 2026</span>',
        h1='<span class="hl">BIR e-invoicing</span> plan. Before 31 December 2026.',
        lead="Covered taxpayers must issue e-invoices by 31 December 2026 (RR 26-2025, RMC 98-2026). A PDF from a printer "
             "is not one. We set up your invoicing beside your current software and assess what an EIS connection needs, "
             "as separate work with a written quote.",
        ticks=["<b>One invoice flow</b> for head office and every branch",
               "<b>Credit notes and manual-invoice catch-up</b> set up before go-live",
               "<b>An EIS assessment,</b> quoted separately"],
        form_h="Get your e-invoicing Blueprint",
        form_sub="Four details. A BIR Compliance Expert replies within one business day to set your 15 to 20 minute online "
                 "meeting. No charge.",
        btn="Get my e-invoicing Blueprint",
        msg_ph="e.g. large taxpayer, invoices from our POS and spreadsheets, 3 branches",
        check_h="How do you invoice today?",
        checks=[("Invoices printed or emailed as PDF", "<b>Invoices are printed or emailed as PDFs,</b> which are not e-invoices."),
                ("Invoices typed in Word or spreadsheets", "<b>Invoices are typed in Word or spreadsheets</b> with no lock after issue."),
                ("Branches invoice their own way", "<b>Each branch invoices its own way,</b> with its own series or layout."),
                ("Issued invoices get edited", "<b>Issued invoices get edited</b> instead of a credit note."),
                ("No plan for system downtime", "<b>There is no plan</b> for invoicing when the system is down."),
                ("Not sure if covered", "<b>You are not sure</b> whether your business is covered.")],
        msgs=["Tick what sounds familiar. Your answers stay on this page unless you add them to the form.",
              "A good start. Your BIR Compliance Expert covers it in your Blueprint.",
              "Most invoicing we see starts here. It has to move into one system before 31 December.",
              "Your invoicing needs a plan now. 31 December 2026 is close."],
        bp_h='Your e-invoicing Blueprint, in 15 to 20 minutes.',
        bp_lead="One online meeting with a BIR Compliance Expert, before the deadline.",
        bp=["Whether your business is covered, checked with your accountant",
            "How your invoice flows and branches move into one system",
            "What an EIS connection would need, and how we quote it",
            "A written quote before any work starts"],
        panel=EINV_PANEL,
        facts="einv", express=False,
        faq=[("What is the BIR e-invoicing deadline?", "Covered taxpayers must issue electronic invoices on or before 31 December 2026. RR 26-2025 set the date and RMC 98-2026 kept it."),
             ("What is a Permit to Issue (PTI)?", "The BIR permit a covered taxpayer needs before issuing any e-invoice. EIS Certification must then be completed within six months of the PTI. You apply for it yourself; we prepare the process flow and sample invoices with you."),
             ("Do you connect us to the EIS?", "Odoo has no built-in connection to the BIR's EIS, and TechNext has not built one. If you are covered, we assess the options with you and quote any connection separately."),
             ("Do we have to change our accounting software?", "No. We add a plug-in beside it (Odoo, set up for your BIR invoicing and reports). Your current software stays."),
             ("What does it cost?", "It depends on your scope, so we don't publish a price. The meeting has no charge, and you get a written quote before any work starts.")],
        close_h='31 December 2026 is close. Start your <span class="hl">BIR e-invoicing</span> plan today.',
        close_p="Fill in the short form (about a minute). A BIR Compliance Expert replies from sales@technext.asia. "
                "<strong>15 to 20 minutes, online, no charge.</strong> Any work starts with a written quote.",
    ),
}

# ---------------------------------------------------------------------------------------------------------- page facts
_FACTS = {
    "rmc": ("What does the BIR ask for?",
            "RMC 5-2021 lists what goes in a CAS or CBA application. Each part shapes your setup.",
            [("A sworn statement", "A description of the system and the invoices and reports it produces."),
             ("Sample invoices", "Printed from the system you will actually use."),
             ("Sample books and reports", "Your books of accounts and the other system reports."),
             ("An audit trail printout", "From the system, showing who did what and when."),
             ("The requirements checklist", "The functional and technical requirements in Annex B, signed."),
             ("Your books, every year", "Computerised books registered online through ORUS within 30 days after year-end.")]),
    "orus": ("What has to be in place by 30 January?",
             "Computerised books are registered within 30 days after the close of each taxable year (RMC 3-2023), online through ORUS (RMC 4-2026).",
             [("Books from one system", "Journals, general ledger and subsidiary books, printed from the system you registered."),
              ("Entries that agree", "The journals and the ledger match before you print, not after."),
              ("The year closed", "Your 2026 entries posted and the year closed in the system."),
              ("Your accountant's review", "Your accountant checks the books before you register them."),
              ("Loose-leaf books, if any", "Due earlier: 15 January 2027 for calendar-year taxpayers."),
              ("Your RDO's dates", "Your accountant or RDO confirms the dates for your business.")]),
    "quarter": ("Your quarter-end, from one set of books.",
                "Every report comes from the entries you already post, so you reconcile once.",
                [("2307 per payee", "Generated from each vendor bill with withholding, ready to send."),
                 ("ATC on every line", "Withholding taxes and ATC codes set up once, used on every bill."),
                 ("SLSP with DAT files", "Sales and purchases lists exported for the BIR's tools."),
                 ("SAWT and QAP", "Built from the same entries as your ledger."),
                 ("2550Q VAT summary", "Output and input VAT from the posted entries."),
                 ("Books of accounts", "Journals and ledger for your CAS or CBA, from the same system.")]),
    "einv": ("What the e-invoicing rules ask for.",
             "From RR 26-2025 and RMC 98-2026. Your setup is built around them.",
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


def _cta(label="Get my Blueprint", cls="btn-link", carry=False):
    return (f'<a class="{cls}" href="#book" data-to-form{" data-carry-check" if carry else ""}>{label} {{{{icon:arrow}}}}</a>')


def _form(p):
    return f'''    <div class="fw-side fw-side--form" id="book">
  <form class="form gs-form fw-form" id="gs-form" data-loop novalidate data-endpoint="/api/lead" data-fw-form>
      <i class="fx-result-glow gs-glow" aria-hidden="true"></i>
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="source" value="{_e(p["source"])}">
      <div class="fw-fhead">
        <h2 class="gs-form-h">{p["form_h"]}</h2>
        <p class="gs-form-sub fw-fsub">{p["form_sub"]}</p>
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
      <p class="fw-deadline">{{{{icon:zap}}}}<span>{p["pill"]}</span></p>
      <h1 id="fw-h1">{p["h1"]}</h1>
      <p class="lead fw-hero-lead">{p["lead"]}</p>
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
    return f'''<section class="section fx-sec fw-check-sec" id="self-check" aria-labelledby="fw-check-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="fw-check-h">{p["check_h"]}</h2><p class="lead">Tick the ones that sound familiar.</p></div>
    <div class="fw-check reveal">
      <ul class="fw-check-list" id="fw-check" data-msgs="{_e(_json.dumps(p["msgs"], ensure_ascii=False))}">{items}</ul>
      <aside class="fw-score" aria-live="polite">
        <p class="fw-score-k">Your score</p>
        <p class="fw-score-n"><span id="fw-count">0</span><small>/ {len(p["checks"])}</small></p>
        <div class="fw-meter"><span id="fw-meter"></span></div>
        <p class="fw-score-msg" id="fw-msg">{_e(p["msgs"][0])}</p>
        {_cta(p["btn"], "btn btn-primary fw-score-btn", carry=True)}
      </aside>
    </div>
  </div>
</section>'''


def _blueprint(p):
    items = "".join(f"<li>{{{{icon:check}}}} {t}</li>" for t in p["bp"])
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
{_IFX.panel_markup(p["panel"])}
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
                "Odoo has no built-in connection to the BIR's EIS, and TechNext has not built one. If you are covered, "
                "we assess the options with you and quote any connection separately.")
        note = f'<div class="fw-note lp-note reveal"><h3>A word of caution</h3><p>{body}</p></div>'
    return f'''<section class="section fx-sec fw-rules-sec" aria-labelledby="lp-facts-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-facts-h">{h}</h2><p class="lead">{lead}</p></div>
    <ol class="fw-rules">{lis}</ol>
    {note}
    <p class="sec-next reveal">{_cta(p["btn"])}</p>
  </div>
</section>'''


def _steps():
    lis = "".join(f'<li class="reveal" style="--i:{i}"><span class="gs-n">{i + 1}</span><h3>{a}</h3><p>{b}</p></li>'
                  for i, (a, b) in enumerate(_STEPS_EINV))
    return f'''<section class="section fx-sec fx-sec--alt gs-how" aria-labelledby="lp-steps-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="lp-steps-h">From the first meeting to your PTI papers.</h2></div>
    <ol class="gs-steps fw-steps" data-loop>{lis}</ol>
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


def page_html(key: str, experts: str, express: str) -> str:
    p = PAGES[key]
    # The shared expert cards and 5 Day Express blocks are written for the whole site: on a lander they name the
    # BIR Compliance Experts and point back to this page's form.
    experts = (experts.replace("Your Odoo experts", "Your BIR Compliance Experts")
                      .replace("Your BIR CAS set-up, led by people who have done it.", "Who you meet: people who have done it.")
                      .replace("led ERP projects", "led business software projects").replace("years in ERP and CRM", "years in business software")
                      .replace("your first call:", "your first meeting:"))
    # stay on the page: "Set up a meeting with Neil" (relabelled "Book a call with Neil" later by build.meeting_ctas)
    # becomes a button to this page's form, which books the same meeting
    experts = _re.sub(r'<a\s[^>]*?class="([^"]*)"[^>]*>(\s*(?:<svg\s.*?</svg>\s*)?)Set up a meeting with ([A-Z][a-z]+)',
                      lambda m: f'<a class="{m.group(1)}" href="#book" data-to-form>{m.group(2)}Meet {m.group(3)}', experts, flags=_re.S)
    if p["express"]:
        express = _re.sub(r'<a class="btn btn-primary btn-lg" href="[^"]*#start">([^<]*?)\s*\{\{icon:arrow\}\}</a>',
                          lambda m: _cta(p["btn"], "btn btn-primary btn-lg"), express)
        express = express.replace("free planning meeting", "planning meeting")
    else:
        express = _steps()
    return "\n\n".join([_hero(p), experts, _check(p), _blueprint(p), _facts(p), express, _faq(p), _close(p)])


_TOKEN = _re.compile(r"\{\{LANDER:([a-z0-9-]+)\}\}")


def tokens(content: str, experts: str, express: str) -> str:
    return _TOKEN.sub(lambda m: page_html(m.group(1), experts, express), content)
