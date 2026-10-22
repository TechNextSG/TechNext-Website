---
version: 1
slug: "src-pages-index-html"
primary_target: "_src/pages/index.html"
related_targets: []
---

# Home page (technext.asia) — surface brief

Scope: home page `_src/pages/index.html`; mode Persuade. Visitor: Philippine SME owner / finance head worried about BIR (e-invoicing by 31 Dec 2026, CAS/CBA, 2307, SLSP). Action: Book a discovery call (Odoo booking). Proof: Odoo Ready Partner, 11 named clients, 11+ enterprise clients, 10+ countries, 3 offices, sample BIR reports (fictitious data). Constraints: PRODUCT.md (no "BIR-accredited/compliant", no prices, no WhatsApp contact, light only, no icon tiles, British "adviser"); employee profiles = placeholders on preview only.

## Direction contract

THESIS: The home page answers "Am I covered, and what do I need?" before it sells anything: a live BIR readiness check owns the first viewport. Refuses the category default of slogan hero + three service cards.

OWN-WORLD: today's TechNext system (blue #3167CA, ink #1F1F3D, white, blue-050 #EAF0FB, Plus Jakarta Sans display, Inter body) rendered futuristic: frosted glass panels on a faint blue grid field, 1px hairline borders with inner light, glowing blue data lines and pulses travelling between panels, status pills (covered / later / exempt), tabular mono-numeral countdown, flat Odoo icons bare. No illustrations, no cartoon art, no Nexi in content.

STORY: Maricel answers four taps, sees "covered by 31 December 2026" and the exact steps (PTI, EIS certification, books in ORUS, 2307/SLSP from Odoo), sees those reports produced in Odoo, meets the advisers who set it up (skills, companies), sees real clients, books a discovery call with her answers attached.

FIRST VIEWPORT: Left 6 cols: kicker "BIR readiness check", H1 "Is your business ready for BIR e-invoicing?", 4 question rows of tap chips. Right 6 cols: glass result panel with live verdict pill, step list lighting up, countdown to 31 Dec 2026, primary "Book a discovery call", secondary "See sample BIR reports". Phone: questions then result, stacked; result sticky summary.

FORM: "BIR readiness check" (structure 5 of 7 on the ranked list); seed key 4a7d487b. Code-led. Signature interaction: answering a chip re-routes glowing data lines into the result panel and flips the verdict pill with a count-up of steps; scroll section "What Odoo produces" draws report sheets assembling from ledger rows.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Owner changes (21 Oct 2026, binding)
- "REVERT THE 2 HERO SECTION DESIGN": the home page keeps its previous 2-slide hero (carousel, no autoplay, weighted random start, Nexi in the hero) exactly as it was. The readiness-check first viewport is withdrawn.
- "Remove the readiness check from the home page entirely": no readiness check on the home page. Links that pointed at it go to /bir-e-invoicing#covered.
- The rest of the redesigned home page stands below the hero: BIR report viewer, adviser profiles (placeholders, preview only), who we are + clients, practices rail, industries, catalogue, articles, FAQ, close.

## Owner changes (22 Oct 2026, binding; supersede the readiness-check lines above where they conflict)
- "CREATE ANOTHER HERO SECTION ... BASE ON BIR COMPLIANCE, HEAVY INTERACTIVE": hero slide 3 is the "BIR control tower" (`data-slide-bir`, assets/js/hero-bir.js + assets/css/hero-bir.css): seven BIR forms orbit an Odoo core on an ellipse, drag to spin, click or arrow keys to select, a beam to the selected form, "Send e-invoices" packets, a days-left pill (whole days, rounded down). Runs only while its slide is active and on screen; flat list at 900px and below.
- "INCLUDE THE NEW LANDING PAGE" -> "Readiness check as a slide": the readiness check returns, but only as hero slide 4 (`data-slide-check`, assets/js/bir-check.js), headline "Ready for / BIR e-invoicing?". Nexi hides while slide 4 is active so she never covers the result. It is not a home section.
- Hero start weighting: slides 1 and 2 four times as likely as slides 3 and 4; no autoplay.
- Finish-review P2-10: the industries section is an interactive switch (`{{INDUSTRY_SWITCH}}`, `_src/industry_fx.py: switch_html()`): eight tabs (role=tablist, arrow keys, Home/End) beside the selected industry's live sample Odoo panel, the same panel as that industry page's hero (`panel_html(key)`), which replays from its first step when picked, plus a link to the industry page. Desktop: one column of tabs (4/12) beside the panel (8/12). 1080px and below: a sideways-scrolling row of pill tabs above the panel; the picked tab scrolls fully into the row without moving the page.