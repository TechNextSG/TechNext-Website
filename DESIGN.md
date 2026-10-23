---
name: technext.asia futuristic redesign
description: TechNext's own light system (blue #3167CA on white, Plus Jakarta Sans + Inter) rendered as frosted glass Odoo records on a faint blue grid, with light travelling along the data lines.
colors:
  blue: "#3167CA"
  blue-700: "#1E4691"
  blue-300: "#6FA0F5"
  blue-100: "#DDE7F8"
  blue-050: "#EAF0FB"
  ink: "#1F1F3D"
  navy-mid: "#1E2F66"
  body: "#4C4C63"
  muted: "#62627A"
  line: "#E7E4E9"
  paper: "#FFFFFF"
  alt: "#FAF9FB"
  field-wash: "#F5F8FE"
  field-wash-end: "#FBFCFE"
  edge-card: "#E3E9F5"
  edge-row: "#EEF1F7"
  neutral-pill: "#F1F2F6"
  track: "#EAEFF8"
  ok: "#137A4A"
  ok-050: "#E8F5EE"
  amber: "#8F5A00"
  amber-050: "#FDF3E1"
  red: "#D93A30"
  glass: "rgba(255,255,255,0.72)"
  glass-edge: "rgba(255,255,255,0.95)"
  data-line: "rgba(49,103,202,0.16)"
  grid-line: "rgba(49,103,202,0.07)"
typography:
  hero-title:
    fontFamily: "'Plus Jakarta Sans', 'Jakarta Fallback', Inter, 'Inter Fallback', system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.4rem + 3.3vw, 4.1rem)"
    fontWeight: 800
    lineHeight: 1.03
    letterSpacing: "-0.035em"
  page-title:
    fontFamily: "'Plus Jakarta Sans', 'Jakarta Fallback', Inter, 'Inter Fallback', system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.3rem + 2.7vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  section-title:
    fontFamily: "'Plus Jakarta Sans', 'Jakarta Fallback', Inter, 'Inter Fallback', system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 1.2rem + 2vw, 2.85rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  card-title:
    fontFamily: "'Plus Jakarta Sans', 'Jakarta Fallback', Inter, 'Inter Fallback', system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  panel-title:
    fontFamily: "'Plus Jakarta Sans', 'Jakarta Fallback', Inter, 'Inter Fallback', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: "'Plus Jakarta Sans', 'Jakarta Fallback', Inter, 'Inter Fallback', system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  lead:
    fontFamily: "Inter, 'Inter Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.08rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Inter, 'Inter Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  body-card:
    fontFamily: "Inter, 'Inter Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Inter, 'Inter Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, 'Inter Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "12.5px"
    fontWeight: 700
    lineHeight: 1.2
  button:
    fontFamily: "Inter, 'Inter Fallback', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1
rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  row: "14px"
  lg: "16px"
  xl: "20px"
  card: "22px"
  panel: "24px"
  band: "28px"
  pill: "999px"
spacing:
  chip-gap: "8px"
  gap-sm: "12px"
  gap-md: "20px"
  gap-lg: "32px"
  gap-xl: "56px"
  card-pad: "24px"
  panel-pad: "28px"
  head-gap: "48px"
  section-y: "104px"
  section-y-phone: "72px"
  container: "1200px"
  gutter: "24px"
  gutter-phone: "18px"
  header: "72px"
  header-phone: "64px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.blue-700}"
    textColor: "{colors.paper}"
  button-primary-lg:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "52px"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "46px"
  button-ghost-hover:
    backgroundColor: "{colors.blue-050}"
    textColor: "{colors.blue-700}"
  button-white:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.blue}"
    rounded: "{rounded.md}"
    height: "52px"
  chip:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
  status-pill-covered:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  status-pill-likely:
    backgroundColor: "{colors.amber-050}"
    textColor: "{colors.amber}"
    rounded: "{rounded.pill}"
  status-pill-later:
    backgroundColor: "{colors.ok-050}"
    textColor: "{colors.ok}"
    rounded: "{rounded.pill}"
  tag-sample-data:
    backgroundColor: "{colors.amber-050}"
    textColor: "{colors.amber}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  glass-panel:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "28px"
  glass-card:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.body}"
    rounded: "{rounded.card}"
    padding: "24px"
  table-head:
    backgroundColor: "{colors.blue-050}"
    textColor: "{colors.body}"
    typography: "{typography.label}"
  close-band:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.band}"
    padding: "56px"
---

# Design System: technext.asia futuristic redesign

## Overview

**Creative North Star: "The Glass Ledger"** (working name; rename freely)

TechNext is a trusted expert adviser for ERP and BIR compliance. The site must feel like the books of a firm that already knows the rules: calm, exact, a little ahead of its time. Odoo records (an invoice, a journal entry, a report sheet) are the hero material. They are drawn as frosted glass panels floating on a faint blue grid, and the story moves along thin glowing data lines that connect one record to the next. This is today's TechNext system (blue #3167CA on white, Plus Jakarta Sans display, Inter body) rendered futuristic, not a new identity.

Density is moderate and editorial: big plain sentences as headings, one primary action per view ("Book a discovery call"), proof next to claims. Colour is restrained: one blue accent on white, status hues only for status. Depth comes from light (hairline edges, inner highlight, blue-tinted shadows, blur), never from heavy dark chrome. Everything is light theme only.

Voice: adviser first, then implementer. British spelling ("adviser", "localisation"). Lead verbs advise, recommend, deliver. Headings are full sentences ("Your BIR reports, from the entries you already post."), never labels over headings. Sample figures are always fictitious and always tagged "Sample data".

**Key Characteristics:**
- Frosted glass records (white at 72%, 1px white edge, inner top highlight, blue-tinted drop shadow) on a blue hairline grid.
- One accent (blue #3167CA) with Deep Blue for hover and small text; status hues (green, amber) only on pills, tags and verdicts.
- Live sample Odoo panels that replay a record: status bar, KPIs count up, lines fill, a journal entry posts with Dr = Cr.
- Glowing data lines, travelling dots and a masked rotating edge as the only decorative motion; all transform/opacity.
- Bare line icons and official flat Odoo app icons; no tiles, no illustrations, no cartoon art, no gradient text.
- Reduced motion shows the finished state; loops pause off-screen.

## Colors

One blue on white. The blue ramp has five fixed steps; neutrals are cool navy-slate with one warm hairline.

### Primary
- **TechNext Blue** (--blue, #3167CA): primary buttons, links, selected chips and tabs, data lines, dots, the highlighted word in a headline (`.fx-hl`), line icons. White on it is 5.35:1.
- **Deep Blue** (--blue-700, #1E4691): primary hover, link text on pale fills, roles and step numerals, selected-tab titles. 7.84:1 on Wash Blue.
- **Sky Blue** (--blue-300, #6FA0F5): outlines of idle dots and hovered chips, focus ring, bar-gradient start, glows. Never body text on white (2.62:1).
- **Mist Blue** (--blue-100, #DDE7F8): input focus halo, rails, current status segment fill, connector tracks.
- **Wash Blue** (--blue-050, #EAF0FB): table heads, skill chips, ghost-button hover wipe, default tag fill, selected tab tint.

### Neutral
- **Ink Navy** (--ink, #1F1F3D): headings, strong text, the dark count block and the close band (gradient start). 15.9:1 on white.
- **Body Slate** (--body, #4C4C63): paragraphs, panel labels, table headers. 8.3:1 on white.
- **Muted Slate** (--muted, #62627A): captions, breadcrumbs, secondary meta. 5.9:1 on white. This is the effective value (stage.css overrides the #8888A0 declared in site.css, which is only 3.46:1).
- **Paper** (--paper, #FFFFFF) and **Alt Paper** (--alt, #FAF9FB): page and legacy alternate sections.
- **Field Wash** (#F5F8FE -> #FBFCFE gradient): `.fx-sec--alt` sections, always with the 56px grid mask.
- **Hairline** (--line, #E7E4E9): idle borders of chips, inputs, cards, proof strip.
- **Card Edge** (#E3E9F5) and **Row Rule** (#EEF1F7): the sheet or record edge and table/list dividers inside panels.
- **Navy Mid** (#1E2F66): middle stop of the dark gradients (ink -> navy-mid -> #1E4691 on the count block; ink -> navy-mid -> blue on the close band).

### Status
- **Ledger Green** (--ok, #137A4A) on **Green Wash** (--ok-050, #E8F5EE): done, balanced, "later/exempt" verdicts, gain bars. 4.79:1.
- **Amber** (#8F5A00) on **Amber Wash** (#FDF3E1): "Sample data" tags, "Placeholder", warnings, "likely" verdict, cost-of-delay figures. 5.26:1.
- **Alarm Red** (--red, #D93A30): form errors only; the struck-through "was" values use rgba(210,67,59,.45) line colour.

### Glass and field tokens (scoped on `.fx-home, .fx-page`)
- --fx-glass rgba(255,255,255,.72); --fx-edge rgba(255,255,255,.95); --fx-line rgba(49,103,202,.16) (data lines, panel dividers); --fx-grid rgba(49,103,202,.07) (the grid); --fx-amber #8F5A00.

### Named Rules
**The One Blue Rule.** Blue #3167CA is the only accent. Status colours appear only inside pills, tags, verdicts and bars; they never decorate a section, a heading or an icon.

**The Not-On-White Rule.** Sky Blue (#6FA0F5) is for strokes and glows. Any text on white or a pale wash is Body Slate, Ink, Deep Blue or Blue (all >= 4.5:1).

**The Light Only Rule.** No dark mode, no `prefers-color-scheme: dark`, `color-scheme: light` on :root. Dark appears only as a deliberate navy block (count readout, close band, `.sv-dark`).

## Typography

**Display Font:** Plus Jakarta Sans (500/600/700/800), fallback "Jakarta Fallback" (metric-matched Arial) then Inter.
**Body Font:** Inter (400/500/600), fallback "Inter Fallback" then system-ui.
**Label/Mono Font:** none. Labels are Inter 700 at 12-13px with no tracking and no uppercase. Numerals use `font-variant-numeric: tabular-nums`.

**Character:** a warm geometric display face set tight and heavy (800, -0.03em) over a neutral reading face. Headlines are sentences that balance across lines (`text-wrap: balance`), body copy stays at 14.5-17px in a 52-70ch measure.

### Hierarchy
- **Hero title** (800, clamp(2.4rem, 1.4rem + 3.3vw, 4.1rem), 1.03, -0.035em, max 15ch): `.fx-hero h1 / .fx-h`; the highlighted word is blue with a 0.1em underline that draws in.
- **Page title** (800, clamp(2.1rem, 1.3rem + 2.7vw, 3.4-3.5rem), 1.06, -0.035em, max 17-22ch): inner-page fx heroes (`.sv-hero`, `.ph-hero`, `.bir-fx .bf-hero`; industries clamp(2rem, 1.2rem + 2.2vw, 3rem)).
- **Section title** (800, clamp(1.9rem, 1.2rem + 2vw, 2.85rem), 1.1, -0.03em, balance): `.sec-head h2`, `.fx-who h2`, `.ixf-two h2`. Ink only.
- **Card title** (800, 19-21px, 1.2, -0.015em): `.fx-node h3`, `.pf-card h3`; chain step titles scale clamp(1.3rem, 1.05rem + 1vw, 1.75rem).
- **Panel title** (800, 15-17px, 1.2): record and panel headers (`.ixf-t b`, `.fx-sheet-t`, `.sv-bar b`).
- **Numeral** (800, 22-30px, 1, tabular-nums): KPIs, countdown (`.fx-count b` 30px, `.ixf-k dd` 22px, 16px on phones).
- **Lead** (400, 1.08rem / 1.65, max 64ch; hero lead 1.13rem / 1.6, 52ch): one paragraph under a title.
- **Body** (400, 16px / 1.65); **card body** (400, 14.5-15.5px / 1.55-1.62).
- **Small** (400-500, 13-13.5px / 1.5): captions, fine print, sample footnotes. **Label** (700, 12-13px): tags, pills, table heads, chip text; never below 12px.

### Named Rules
**The Sentence Rule.** Headings are complete sentences in Ink. No eyebrow, kicker or small-caps line above or below a heading, no tracking-wide uppercase labels.

**The Twelve Pixel Floor Rule.** No text under 12px in new work (phones included). Tables and panel microcopy go to 12-12.5px, not 10-11px.

## Layout

A centred container (max 1200px, 24px side gutter, 18px at 640px and below) holds 12-column-style grids built from `grid-template-columns` fractions, not a framework.

- **Sections:** `.section.fx-sec` pads 104px top and bottom (72px on phones). Alternate white and `.fx-sec--alt` (Field Wash gradient plus a 56px blue hairline grid, masked to fade at top and bottom). `.sec-head` is max 760px wide with 48px below it; H2 then one lead.
- **Heroes:** `.fx-hero` is a two-column grid 1.08fr / 0.92fr, gap 56px, on `.fx-field` (radial blue glows, a 48px grid, drifting `.fx-orb` blurs). Left copy, right glass panel. Padding 56px / 72px (inner pages 24-44px top).
- **Grids:** card grids gap 20px (auto-fit minmax(300px, 1fr) for adviser cards); two-column sections gap 56px; chip rows gap 8px; list rows 12px.
- **Header:** sticky, 72px (64px at 960px and below). Transparent over the first hero at the top of the page, then rgba(255,255,255,.96) with a 1px hairline once scrolled. Mega menu: full-width white drop panel, auto-fit minmax(250px, 1fr) columns, bare line icons or flat Odoo icons at 28-32px. Right edge carries three vertical side tabs (Set up meeting in green, Let's Talk and Ask Nexi in blue); at 960px and below they collapse into one 52px round "+" button.
- **Focused pages** (`.gs-fx`: /get-started, /free-website-with-odoo) hide menu, side tabs and floating buttons so the form is the one thing to do.

### Page patterns
- **Hero with live sample Odoo panel** (`.fx-hero` + `.ixf-panel` / `.sv-panel` / `.fx-result`): partner pill, hero title, lead, two buttons, optional app chips left; right a glass panel: title row with Odoo icon, a chevron status bar (`.ixf-bar`), 3 KPIs, lines or bars, a glowing wire down to the journal entry (Dr = Cr badge), chips. Always carries a "Sample data" tag. Replays in a loop of about 11.5 seconds; the home industry switch replays it when picked.
- **Home hero (binding owner rules):** slides 1-2 (Nexi allowed), slide 3 "BIR control tower" (`.bt`: seven BIR forms orbit an Odoo core on an ellipse, drag or arrow keys, beam to the selected form, days-left pill), slide 4 readiness check ("Ready for BIR e-invoicing?", `.fx-check`); no autoplay; slides 1-2 are four times as likely as 3-4 at start; Nexi hides on slide 4; the readiness check is not a home section.
- **Proof strip** (`.fx-proof`): white band between hairlines, four facts with 18px blue line icons, bold figure plus plain text. Facts only: Odoo Ready Partner, 18+ enterprise clients, 11+ countries, offices.
- **Flows and chains** (`.ixf-chain`, `.fx-steps`, `.fx-rail`, `.sv-journey`, `.bf-tl`): a 2px data line with 16px ring dots that fill blue with a glow ring as the scroll line reaches them; alternating info and glass record cards; collapses to a left rail at 860px.
- **Report viewer** (`.fx-rep-*`): five tabs, ledger rows (glass) -> animated beam -> white report sheet with a 3px blue top edge and a sample table.
- **Who we are + clients** (`.fx-who`, `.fx-clients`): proof points left with bare 22px icons, glass client wall right.
- **Practices rail** (`.fx-rail`, `.fx-node`, core node tinted): three glass nodes on a faint rail with a travelling light.
- **Industries switch** (`.ixs`): eight tabs (4/12) beside the picked industry's live panel (8/12); at 1080px the tabs become a sideways-scrolling pill row.
- **FAQ** (`.fx-faq .faq details`): glass rows, one open by default, 56px minimum summary height, chevron rotates on open.
- **Close band** (`.fx-close`): navy gradient with a 40px white hairline grid at 6%, soft sky glow, white H2, `.btn-white` plus `.btn-outline-white`.

### Responsive rules
- **1080px:** hero, who-we-are, rail, report stage and industry switch go single column; sticky result panels become static; report tabs 3 columns; industry grid 2 columns; close band stacks (40px padding); beam hidden.
- **960px (shell):** desktop nav becomes the drawer (min(420px, 100%)); header 64px; side tabs become the round "+" fan; page `.two` grids stack.
- **900px:** BIR control tower drops the ring, drag and beam and becomes a console plus a horizontally scrolling row of form chips (48px min height).
- **600px:** section padding 72px, hero 32px/48px; all card and industry grids 1 column; report tabs 2 columns; tables scroll inside their card (min-width 520px, with a "swipe" hint); buttons go full width; chips shrink to 14px text; hero panels use a 20px radius and the close band 22px.
- **480px:** all hero buttons stack full width and may wrap.
- **767px (phone audit):** 44px minimum targets, 12px floor on demo microcopy.
- Never horizontal page scroll; scrolling chip rows and tables scroll inside their own container.

## Elevation & Depth

Hybrid: hairline plus inner light plus a soft blue-tinted shadow. Surfaces are glass over a gradient or grid field; a glass panel on plain white reads as a flat card, so always place glass over `.fx-field`, `.fx-sec--alt` or a tinted wash.

### Glass material recipe
```
background: rgba(255,255,255,.72);                    /* --fx-glass */
border: 1px solid rgba(255,255,255,.95);              /* --fx-edge */
box-shadow: var(--fx-depth), inset 0 1px 0 #fff;      /* inner top light */
backdrop-filter: blur(14px);                          /* tiers below */
border-radius: 22-24px;
```
- Blur tiers: 10px (chips, orbiting nodes), 12px (FAQ rows, list rows), 14px (cards, ledger, nodes), 16px (demo frames, call-outs), 18px with saturate(1.4) (hero panels).
- Opacity tiers: .72 default; .82-.86 for nodes that overlap content; .92 for records that must stay legible (journal entry, ledger rows); solid #fff for report sheets and inner rows.
- Live edge: a 1.5px masked conic-gradient ring (`.fx-result-glow`, @property --fx-a, 5s spin) at opacity 1 while the panel is live; adviser avatar ring spins on hover only.
- Hover: lift 3-4px and swap to --fx-depth-h.

### Shadow Vocabulary
- **Depth** (--fx-depth: `0 2px 6px rgba(31,31,61,.05), 0 28px 56px -30px rgba(30,70,145,.38)`): resting glass cards and panels.
- **Depth hover** (--fx-depth-h: `0 4px 10px rgba(31,31,61,.06), 0 36px 64px -30px rgba(30,70,145,.48)`): hover, report sheet, core node.
- **Chip pressed** (`0 10px 22px -12px rgba(49,103,202,.75), inset 0 1px 0 rgba(255,255,255,.25)`): selected chip.
- **Selected tab** (`0 0 0 1px #3167CA, 0 18px 34px -22px rgba(49,103,202,.7)`): chosen report or industry tab.
- **Shell shadows:** --shadow-sm `0 1px 2px rgba(31,31,61,.06), 0 8px 24px -18px rgba(31,31,61,.25)`; --shadow-md `0 2px 6px rgba(31,31,61,.06), 0 24px 48px -28px rgba(31,31,61,.35)`; --shadow-blue `0 12px 28px -12px rgba(49,103,202,.55)` (primary hover).
- **Dark block** (`0 18px 34px -22px rgba(30,70,145,.8), inset 0 1px 0 rgba(255,255,255,.12)`) for the count readout; close band `0 40px 80px -40px rgba(30,70,145,.7)`.
- **Glow** (data dots and lit nodes): `0 0 0 5px rgba(49,103,202,.16), 0 0 14px rgba(49,103,202,.55)`.

### Named Rules
**The Field Rule.** Glass only reads over a field. Place it on `.fx-field`, `.fx-sec--alt` or a tinted wash, never on plain white.

**The Light Over Shadow Rule.** Depth is a bright inner edge plus a long, low-opacity blue shadow. No black drop shadows, no hard outlines for emphasis (use the selected-tab ring).

## Shapes

Soft but exact. Radius follows size: controls 8-12px, inner rows 14-16px, glass cards 18-24px, hero panels 24px, big showcase and close band 26-28px, pills and chips fully round (999px), bars 2-4px. Status bars are chevron segments (clip-path, 11px point). Data lines are 2px; dots are 16px rings (2px Sky Blue) that fill with Blue and a glow when lit. Backgrounds carry a 48-56px blue hairline grid masked by a radial or vertical fade. Report sheets and cards have a 3px blue top edge inset 22px from each side.

## Components

### Motion (applies to everything below)
- **Easing:** the one house curve is `cubic-bezier(.16, 1, .3, 1)` (--fx-ease, --ease-expo, --bt-ease; ease-out expo). Shell UI also uses --ease-out `cubic-bezier(.2,.8,.2,1)`; the bouncy --spring `cubic-bezier(.34,1.45,.64,1)` belongs to the shell (buttons) only and is rebound to the house curve inside fx pages.
- **Durations:** hover and press 220-400ms; reveal 380ms ease-out, staggered 70ms per item via `--i` (`.reveal` -> `.is-in`, six per frame); stage steps 450-900ms; record replay: stages at 0.5 / 1.9 / 3.5 / 4.7 s, restart at 11.5 s; count-ups 1100ms with expo-out easing (`data-count`, `data-pre`, `data-suf`, `data-dec`); loops 1.6-22 s (beam 1.8s, rail 3.6s, orb drift 18-22s, edge spin 5s).
- **What moves:** transform and opacity (plus the masked conic edge). No layout animation, no filter animation on large areas (small blur-in on swapped text is allowed).
- **Pausing:** IntersectionObserver toggles `.fx-off` (or `[data-loop].is-off`) on the owning section so CSS loops pause off-screen; JS loops also skip while `document.hidden`.
- **prefers-reduced-motion: reduce:** the default markup IS the finished state. JS does not add `.is-js`, panels and chains show complete, count-ups show final values, `.reveal` is visible, animations are `none`, hover transforms off, the live edge becomes a static blue ring. Never hide content behind an animation that may not run.

**The Finished State Rule.** The default markup is the finished composition; motion only describes how it arrives, so a script that fails or a visitor who prefers reduced motion still sees everything.

### Buttons
- **Shape:** 12px radius, 46px high (lg 52px, sm 38px), Inter 600 15px, 0 20px padding (lg 0 24px); trailing 18px arrow icon slides 4px on hover.
- **Primary** (`.btn.btn-primary`): Blue fill, white text; hover Deep Blue plus --shadow-blue and a 2px lift with a light sweep; press scale .96. One per view.
- **Ghost** (`.btn-ghost`): white, hairline border, Ink text; hover wipes Wash Blue in from the left, border Mist Blue, text Deep Blue.
- **On dark** (`.btn-white`, `.btn-outline-white`): white fill with Blue text; outline 55% white border with a 14% white wipe.
- **Link** (`.btn-link`): Blue 15px 600 text with an underline that grows from the left.
- **Inner pages:** calm.css (loaded after) sets height 48 (sm 40), removes lift and sweep, and uses press scale .98; keep new buttons token-driven so both read the same.

### Chips and pills
- **Tap chip** (`.fx-chips label > span`): 44px high, pill, white at 80%, hairline border, Ink 14.5px 550; the real control is a visually hidden radio or checkbox; checked = Blue fill, white text, pressed shadow; hover lifts 1px and borders Sky Blue.
- **Status pill** (`.fx-pill[data-verdict]`, `.ixf-pill`, `.sv-st`): covered = Blue/white; likely = Amber on Amber Wash; later and exempt = Green on Green Wash; pending = #F1F2F6 on Body Slate. 12.5-13.5px 700 with a 6-8px dot.
- **Sample tag** (`.fx-tag`, `.ixf-browser em`, `.bt-sample`, `.ix-sample`): Amber on Amber Wash pill, 12px 700, text "Sample data". Required on every figure that is illustrative.
- **Skill chip** (`.pf-skills li`): Wash Blue pill, Deep Blue 13px 600. **Company chip** (`.pf-cos li`): white, hairline, 8px radius.

### Cards and panels
- **Glass panel** (`.fx-result`, `.ixf-panel`, `.sv-panel`, `.cx-panel`): 24px radius, 28px (hero: 20-22px) padding, glass recipe at blur 18px, live edge.
- **Glass card** (`.fx-node`, `.pf-card`, `.fx-clients`, `.ixf-rec`, `.ixf-rows`): 20-22px radius, 24px padding, blur 14px, lift on hover; core variant `.fx-node--core` tints to Wash Blue with a blue ring.
- **Report sheet** (`.fx-sheet`): solid white, Card Edge border, 20px radius, 3px blue top edge, min-height 360px.
- **Adviser card** (`.pf-card`): 76px avatar with spinning ring on hover; `[data-ph]` placeholders are dashed Sky Blue with a "Placeholder" amber pill and exist on previews only.
- **Dark count readout** (`.fx-count`): ink -> navy-mid -> #1E4691 gradient, 16px radius, white 30px tabular numerals with 11.5px captions (raise to 12px).

### Tables and lists
- **Sample table** (`.fx-tbl`, `.ixf-tbl`): 13-13.5px tabular-nums, header row Wash Blue 12px 700, rows separated by Row Rule, totals row 2px Ink rule; rows slide in 70ms apart. Numeric columns right-aligned.
- **Ledger list** (`.fx-ledger`), **journal entry** (`.ixf-post`, `.ixf-led`): small white rows; the Dr/Cr column in Blue 12px 800; balanced badge `.ixf-bal` in Green.
- **Steps** (`.fx-steps`): 16px ring dots on a 2px rail; `.is-on` lights Blue with glow; `.is-off` dims to .32.

### Tabs and switches
`.fx-rep-tabs button`, `.ixs-tabs .fx-ind`, `.sc-tab`, `.bt-node`: role=tablist / tab (or aria-pressed for toggles), aria-selected, roving tabindex, Arrow keys plus Home and End, panel `hidden` when not selected. Selected = white, Blue border and ring, Blue (or Deep Blue) title. Minimum 44px target on phones.

### Navigation
Header link: 40px high, 8px radius, Inter 500 15px Ink; hover Wash Blue with Deep Blue text; open mega item keeps the fill and rotates the chevron. Mega links: 10px padding, 10px radius, title Inter 600 15px, caption 13px Muted, 3px nudge on hover. Mobile drawer: 56px rows, Plus Jakarta 600 17px.

### Forms
Field label 13px 600 Ink; control 44px min, 8px radius, 1px hairline, 15px Ink; focus = Blue border plus 3px Mist Blue halo; invalid = Red border; sent state = Green Wash panel. Honeypot `.hp` sits off-screen.

### FAQ
`details` rows: glass, 18px radius, 56px min summary, Plus Jakarta 600 1.04rem; open row gets a Blue-tinted border and --fx-depth; answers 15.5px Body Slate, max 72ch.

### Icons
Two kinds only. Bare line icons: 24px viewBox, stroke currentColor 2px, round caps (`{{icon:name}}`, class `.ic`), coloured Blue, 14-30px. Official flat Odoo app icons (`.oi`, `{{odoo:app:size}}`), multi-colour, 20-44px, never on a coloured or tinted tile.

**The Bare Icon Rule.** An icon sits directly on its surface in Blue or its own colours. No tile, disc, tint or border behind it, in menus, cards, chips or panels.

## Do's and Don'ts

### Do:
- **Do** build every new section from the glass recipe over a field or wash, with Ink headings (sentences), Body Slate copy, one Blue action.
- **Do** show real Odoo screens, records, journal entries and report sheets with fictitious figures, tagged "Sample data" (amber pill) on the same panel.
- **Do** make one primary action per view: "Book a discovery call" (Odoo booking). Secondary: "See sample BIR reports", the Services Catalogue, the inquiry form.
- **Do** say "set up for BIR requirements" and "adviser"; cite the rule (RR 26-2025, 31 December 2026) next to the claim.
- **Do** keep motion on transform and opacity, 0.2-0.9s, house easing; pause loops off-screen; make the markup default the finished state.
- **Do** give all interactive targets >= 44px on phones and a visible `:focus-visible` ring (3px Sky Blue, 3px offset on glass; site default 2px Blue, 2px offset).
- **Do** keep `h2` colour in dark panels explicit: calm.css forces `main section h2 { color: var(--ink) !important }`, so `.fx-close h2`, `.sv-dark h2` and similar must use `color: #fff !important`.

### Don't:
- **Don't** add a dark mode or any `prefers-color-scheme: dark` styling. Light only.
- **Don't** put icons on tiles, discs or tinted backdrops; icons are bare. Don't recolour Odoo icons.
- **Don't** use eyebrows, kickers or small-caps/tracked uppercase lines above or below headings (`.eyebrow`, `.card-kicker`, `.hand`, `.h1-hand`, `.sc-kicker` are legacy and must not appear in fx pages).
- **Don't** use gradient text, background-clip text, or gradient headlines. The only text emphasis is Blue plus the drawn underline.
- **Don't** use cartoon, comic or illustrated art, stickers, tilted labels, lips, textures or mascots in content. Imagery is real UI, real records, real screens.
- **Don't** present sample data unlabelled. Sample, fictitious or placeholder values always say so on the same panel ("Sample data", "Placeholder").
- **Don't** write "BIR-accredited", "BIR-certified" or "BIR-compliant" about software or TechNext. Use "set up for BIR requirements".
- **Don't** show prices or "from $" anywhere. **Don't** call Odoo free; only TechNext's design and setup labour can be free, and the client pays its own Odoo subscription.
- **Don't** add a WhatsApp number or link, a floating WhatsApp button or a wa.me URL. WhatsApp may be named only as an Odoo product feature.
- **Don't** use Nexi in page content. Nexi appears only in the Ask Nexi launcher (side tab), the Nexi Explains series pages, and the home hero (and hides on hero slide 4).
- **Don't** bring back removed pages (offices, Technology, RAG, careers, events, life, advisers) or invent testimonials, result metrics, case-study outcomes, adviser names or accreditation claims; none are on file.
- **Don't** use "world-class", "leading", "one-stop shop", "vendor", "agency", "reseller".
- **Don't** animate layout properties, loop animations off-screen, or hide content behind motion that may not run.
- **Don't** set text below 12px, or put Sky Blue (#6FA0F5) text on white.

### Accessibility rules
- Text contrast >= 4.5:1, UI strokes and focus >= 3:1. Verified pairs: Blue on white 5.35, white on Blue 5.35, Ink 15.9, Body 8.3, Muted 5.9, Green on Green Wash 4.79, Amber on Amber Wash 5.26, Deep Blue on Wash Blue 7.84, Blue on Wash Blue 4.68 (avoid below 14px bold).
- Tabs: role tablist/tab/tabpanel, aria-selected, aria-controls, roving tabindex, Arrow/Home/End. Toggles: aria-pressed.
- Live results use `aria-live="polite"`; chip groups are `fieldset` plus `legend` with real radio inputs; the visible chip is the `span` after the focusable input and shows the focus ring.
- `.sr-only` for icon-only labels; `.skip` link first in the page; headings in order (one H1); decorative field, orbs and grid are `aria-hidden`.
- Tables keep real th/td; on phones they scroll in their card with a visible hint.
- Spoken order matches visual order; nothing important is conveyed by colour alone (pills carry text).
