# -*- coding: utf-8 -*-
"""One profile page per team member (owner 22 Oct 2026: "each employee have different own page").

pages()            -> [(meta, content)] for team/<slug>.html, one per person in advisors.ADVISORS (indexed; Person schema
                      via meta["person"]; no email, no phone: contact runs through the discovery call)
directory_html()   -> the Team Directory cards (/employee-hub, a noindex staff page): everyone with a profile first (work
                      email when on record, office, top skills, a link to the profile), then the rest of team.TEAM
profile_url(p)     -> "team/<slug>.html" (home cards link here)

Styles: assets/css/pages/team-fx.css (on home-fx.css, which carries the .pf-* skill chips and stats).
Content rules: everything comes from the owner's CVs and notes; no client or company names, no pronouns in bios.
"""
import html as _html
import re as _re

import advisors as ADV
import team as TM

BOOK = "https://technext.odoo.com/book/c82cf8a9"


def esc(t: str) -> str:
    return _html.escape(t, quote=True)


def slug(name: str) -> str:
    return _re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def profile_url(p: dict) -> str:
    return f"team/{slug(p['name'])}.html"


def initials(name: str) -> str:
    w = name.split()
    return (w[0][0] + (w[-1][0] if len(w) > 1 else "")).upper()


def avatar(p: dict, size: int = 600) -> str:
    if p.get("photo"):
        return (f'<img src="{{{{ROOT}}}}assets/img/team/{p["photo"]}" alt="{esc(p["name"])}" width="{size}" height="{size}" '
                f'loading="lazy" decoding="async">')
    return f'<span class="pf-ini" aria-hidden="true">{initials(p["name"])}</span>'


def ordered() -> list:
    """Owner 22 Oct 2026: the featured card first, then the strongest BIR-related experience (bir_rank), then everyone else."""
    return sorted(ADV.ADVISORS, key=lambda p: (not p.get("featured"), p.get("bir_rank") or 99))


def bir_row(p: dict, n: int = 3) -> str:
    """The green "BIR-related experience" row on a card (nothing when the person has no BIR-related skill on record)."""
    items = (p.get("bir") or [])[:n]
    if not items:
        return ""
    return (f'<div class="tm-bir"><p class="tm-bir-h">{{{{icon:shield}}}}BIR-related experience</p>'
            f'<ul>{"".join(f"<li>{esc(i)}</li>" for i in items)}</ul></div>')


def groups_of(p: dict) -> list:
    """(label, items, css) for every skill group: BIR-related experience first (highlighted), then Odoo apps (with their flat icons),
    the skill groups, certifications last."""
    out = []
    if p.get("bir"):
        out.append(("BIR-related experience", [esc(i) for i in p["bir"]], "pf-skills pf-skills--bir"))
    if p.get("apps"):
        out.append(("Odoo apps", [f'{{{{odoo:{a}:18}}}}{esc(ADV.APP_NAMES.get(a, a))}' for a in p["apps"]], "pf-apps"))
    out += [(lab, [esc(i) for i in items], "pf-skills") for lab, items in (p.get("groups") or []) if items]
    if p.get("creds"):
        out.append(("Certifications and education", [esc(c) for c in p["creds"]], "pf-skills pf-skills--cred"))
    return out


def skill_count(p: dict) -> int:
    return sum(len(i) for _, i in (p.get("groups") or [])) + len(p.get("apps") or [])


def _office(p: dict) -> str:
    return ADV.OFFICES.get(p.get("office"), "")


# ---------------------------------------------------------------------------------------------------------- profile page
def page(p: dict, everyone: list) -> tuple:
    name, role, office = p["name"], p["role"], _office(p)
    first = name.split()[0]
    stats = "".join(f'<div><dt>{esc(lab)}</dt><dd>{esc(v)}</dd></div>' for v, lab in p.get("stats", []))
    gs = groups_of(p)
    panels = "".join(
        f'<article class="tp-group reveal" style="--i:{k % 6}"><h3>{lab}<span>{len(items)}</span></h3>'
        f'<ul class="{css}">{"".join(f"<li>{i}</li>" for i in items)}</ul></article>'
        for k, (lab, items, css) in enumerate(gs))
    areas = [lab for lab, _, _ in gs if not lab.startswith("Certifications")]
    others = [o for o in everyone if o is not p]
    team = "".join(
        f'<a class="tp-mate reveal" style="--i:{k}" href="{{{{ROOT}}}}{profile_url(o)}"><span class="pf-ava tp-mate-ava">{avatar(o, 120)}</span>'
        f'<span><b>{esc(o["name"])}</b><small>{esc(o["role"])}</small></span>{{{{icon:arrow}}}}</a>'
        for k, o in enumerate(others))
    office_line = f'<p class="pf-office">{{{{icon:pin}}}}{office}</p>' if office else ""
    # optional detail sections (about + career, projects): only people whose entry has them
    story = ""
    if p.get("about") or p.get("career"):
        paras = "".join(f"<p>{esc(t)}</p>" for t in p.get("about") or [])
        steps = "".join(
            f'<li class="reveal" style="--i:{k % 6}"><span class="tp-when">{esc(when)}</span><b>{esc(what)}</b><p>{esc(note)}</p></li>'
            for k, (when, what, note) in enumerate(p.get("career") or []))
        story = f'''
<section class="section fx-sec tp-story-sec" id="tp-story" aria-labelledby="tp-story-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="tp-story-h">About {esc(first)}.</h2><p class="lead">How {esc(first)} works, and where the experience comes from.</p></div>
    <div class="tp-story">
      {f'<div class="tp-about reveal">{paras}</div>' if paras else ""}
      {f'<ol class="tp-time" aria-label="Career">{steps}</ol>' if steps else ""}
    </div>
  </div>
</section>
'''
    projects = ""
    if p.get("projects"):
        n = sum(len(i) for _, i in p["projects"])
        cards = "".join(
            f'<article class="tp-group reveal" style="--i:{k % 6}"><h3>{esc(lab)}<span>{len(items)}</span></h3>'
            f'<ul class="pf-skills tp-proj">{"".join(f"<li>{esc(i)}</li>" for i in items)}</ul></article>'
            for k, (lab, items) in enumerate(p["projects"]))
        projects = f'''
<section class="section fx-sec fx-sec--alt tp-proj-sec" id="tp-projects" aria-labelledby="tp-proj-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="tp-proj-h">Selected projects.</h2><p class="lead">{n} implementations, migrations and builds {esc(first)} has delivered, end to end. Client names stay private.</p></div>
    <div class="tp-groups">{cards}</div>
  </div>
</section>
'''
    bio = esc(p.get("bio", ""))
    desc = ""
    for sentence in p.get("bio", "").split(". "):  # whole sentences up to 155 chars, so short first lines aren't thin
        nxt = (desc + " " + sentence.rstrip(".") + ".").strip()
        if desc and len(nxt) > 155:
            break
        desc = nxt[:155]
    for tail in (f" {p['role']} at TechNext, an Odoo Ready Partner in Singapore.", f" {p['role']} at TechNext, an Odoo Ready Partner."):
        if len(desc) < 110 and len(desc + tail) <= 158:   # search snippets: 110-160 characters
            desc += tail
            break
    content = f'''<!-- Team profile: {esc(name)} (generated by _src/team_pages.py from _src/advisors.py) -->
<section class="fx-hero tp-hero" aria-labelledby="tp-h1">
  <div class="fx-field" aria-hidden="true"><i class="fx-orb fx-orb--a"></i><i class="fx-orb fx-orb--b"></i></div>
  <div class="container tp-hero-in">
    <div class="tp-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="{{{{ROOT}}}}index.html">Home</a><span><a href="{{{{ROOT}}}}company.html">Company</a></span><span><a href="{{{{ROOT}}}}employee-hub.html">Team Directory</a></span><span>{esc(name)}</span></nav>
      <div class="tp-head">
        <div class="pf-ava tp-ava">{avatar(p)}<i class="pf-ring" aria-hidden="true"></i></div>
        <div><h1 id="tp-h1">{esc(name)}</h1><p class="tp-role">{esc(role)}</p>{office_line}</div>
      </div>
      <p class="fx-lead tp-bio">{bio}</p>
      <div class="actions tp-act">
        <a class="btn btn-primary btn-lg" data-meet href="{BOOK}" target="_blank" rel="noopener">Book a discovery call {{{{icon:arrow}}}}</a>
        <a class="btn btn-ghost btn-lg" href="{{{{ROOT}}}}employee-hub.html">{{{{icon:users}}}}Team Directory</a>
      </div>
    </div>
    <aside class="tp-card reveal" aria-label="{esc(first)} at a glance">
      <i class="fx-result-glow" aria-hidden="true"></i>
      <p class="tp-card-h">At a glance</p>
      {f'<dl class="pf-stats tp-stats">{stats}</dl>' if stats else ""}
      <p class="tp-sum"><b>{skill_count(p)}</b> skills across {len(areas)} areas</p>
      <ul class="tp-areas">{"".join(f'<li><a href="#tp-skills">{a}</a></li>' for a in areas)}</ul>
    </aside>
  </div>
</section>
{story}
<section class="section fx-sec tp-skills-sec" id="tp-skills" aria-labelledby="tp-skills-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="tp-skills-h">Skills.</h2><p class="lead">What {esc(first)} brings to your project, grouped by area.</p></div>
    <div class="tp-groups">{panels}</div>
  </div>
</section>
{projects}
<section class="section fx-sec fx-sec--alt tp-team-sec" aria-labelledby="tp-team-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="tp-team-h">The rest of the team.</h2><p class="lead">One team scopes, builds and supports your project, from Singapore, Taguig City and Ho Chi Minh City.</p></div>
    <div class="tp-mates">{team}</div>
    <p class="tp-all reveal"><a class="btn-link" href="{{{{ROOT}}}}employee-hub.html">See the whole Team Directory {{{{icon:arrow}}}}</a></p>
  </div>
</section>

<section class="section fx-close-sec">
  <div class="container">
    <div class="fx-close reveal">
      <div class="fx-close-glow" aria-hidden="true"></div>
      <div><h2>Work with {esc(first)} and the team.</h2><p>Book a discovery call. We look at how your company invoices, files and closes the month today, and what to set up first in Odoo.</p></div>
      <div class="actions">
        <a class="btn btn-white btn-lg" data-meet href="{BOOK}" target="_blank" rel="noopener">Book a discovery call {{{{icon:arrow}}}}</a>
        <a class="btn btn-outline-white btn-lg" href="{{{{ROOT}}}}bir-adviser-call.html">Book a free adviser call</a>
      </div>
    </div>
  </div>
</section>'''
    meta = {
        "title": f"{name}, {role} | TechNext Odoo Partner" if len(f"{name}, {role} | TechNext Odoo Partner") <= 60 else f"{name}, {role} | TechNext",
        "desc": desc,
        "out": profile_url(p),
        "nav": "company",
        "body": "fx-page tp-page",
        "scripts": ["assets/js/team-cards.js"],
        "head": '<link rel="stylesheet" href="{ROOT}assets/css/home-fx.css?v={ASSET_V}"><link rel="stylesheet" href="{ROOT}assets/css/pages/team-fx.css?v={ASSET_V}">',
        "person": {"name": name, "jobTitle": role, "office": office, "description": p.get("bio", ""),
                   "knowsAbout": [i for _, items in (p.get("groups") or []) for i in items][:40],
                   "credentials": list(p.get("creds") or [])},
    }
    return meta, content


def pages() -> list:
    return [page(p, ordered()) for p in ordered()]


# ---------------------------------------------------------------------------------------------------------- team cards
# One card for the home team section and the Team Directory (owner 22 Oct 2026: "spotlight + quick view"). The card is a
# lit glass portrait (assets/css/team-cards.css); assets/js/team-cards.js moves a light and a gentle tilt with the cursor
# and opens the quick view, a slide-in panel cloned from the card's own <template>. Without JS the name links to the
# profile page. The home quick view carries no email (indexed page); the directory one carries email and the vCard.
def _quick_view(p: dict, ctx: str) -> str:
    office = _office(p)
    stats = "".join(f'<div><dt>{esc(lab)}</dt><dd>{esc(v)}</dd></div>' for v, lab in p.get("stats", []))
    groups = "".join(
        f'<section class="tm-qv-g"><h3>{lab}<span>{len(items)}</span></h3><ul class="{css}">{"".join(f"<li>{i}</li>" for i in items)}</ul></section>'
        for lab, items, css in groups_of(p))
    if ctx == "directory":
        act = ((f'<a class="eh-act2 eh-act2--main" href="mailto:{esc(p["email"])}">{{{{icon:mail}}}}Email {esc(p["name"].split()[0])}</a>' if p.get("email") else "")
               + '<button type="button" class="eh-act2" data-qv-vcf><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Save contact (.vcf)</button>')
    else:
        act = f'<a class="btn btn-primary" data-meet href="{BOOK}" target="_blank" rel="noopener">Book a discovery call {{{{icon:arrow}}}}</a>'
    office_line = f'<p class="tm-office">{{{{icon:pin}}}}{office}</p>' if office else ""
    stats_dl = f'<dl class="pf-stats tm-qv-stats">{stats}</dl>' if stats else ""
    pic = avatar(p) if p.get("photo") else f'<span class="tm-ini" aria-hidden="true">{initials(p["name"])}</span>'
    return (f'<template class="tm-qv-src"><div class="tm-qv-main">'
            f'<div class="tm-qv-head"><div class="tm-ava tm-ava--qv">{pic}<i class="tm-ring" aria-hidden="true"></i></div>'
            f'<div><h2 class="tm-qv-name">{esc(p["name"])}</h2><p class="tm-role">{esc(p["role"])}</p>{office_line}</div></div>'
            f'<p class="tm-qv-bio">{esc(p.get("bio", ""))}</p>{stats_dl}'
            f'<div class="tm-qv-groups">{groups}</div></div>'
            f'<div class="tm-qv-act">{act}<a class="btn-link tm-qv-page" href="{{{{ROOT}}}}{profile_url(p)}">Open full profile {{{{icon:arrow}}}}</a></div></template>')


def card_html(p: dict, k: int, ctx: str, profile: bool = True) -> str:
    """ctx "home": photo, name, role, office, one-line summary, stats. ctx "directory": photo, name, role, office, email,
    top skills, Email / Save contact (filled by employee-hub-fx.js). profile=False (no profile page): no quick view."""
    name, office = p["name"], _office(p)
    pic = avatar(p) if p.get("photo") else f'<span class="tm-ini" aria-hidden="true">{initials(name)}</span>'
    title = (f'<a href="{{{{ROOT}}}}{profile_url(p)}" data-tm-open>{esc(name)}</a>' if profile else esc(name))
    parts = [f'<div class="tm-ava">{pic}<i class="tm-ring" aria-hidden="true"></i></div>',
             f'<h3 class="tm-name">{title}</h3>', f'<p class="tm-role">{esc(p["role"])}</p>']
    if office:
        parts.append(f'<p class="tm-office">{{{{icon:pin}}}}{office}</p>')
    if ctx == "home":
        if p.get("summary") or p.get("bio"):
            parts.append(f'<p class="tm-sum">{esc(p.get("summary") or p["bio"])}</p>')
        if p.get("bir"):
            parts.append(bir_row(p))
        stats = "".join(f'<div><dt>{esc(lab)}</dt><dd>{esc(v)}</dd></div>' for v, lab in p.get("stats", []))
        if stats:
            parts.append(f'<dl class="pf-stats tm-stats">{stats}</dl>')
    else:
        if p.get("email"):
            parts.append(f'<p class="tm-mail"><a class="th-mail" href="mailto:{esc(p["email"])}">{esc(p["email"])}</a></p>')
        if p.get("bir"):
            parts.append(bir_row(p))
        top = [i for _, items in (p.get("groups") or [])[:1] for i in items][:3]
        if top:
            parts.append(f'<ul class="tm-skills" aria-label="Top skills">{"".join(f"<li>{esc(i)}</li>" for i in top)}</ul>')
        parts.append('<p class="tm-actions"></p>')
    if profile and ctx != "home":   # owner 22 Oct 2026: no View full profile link on the home cards
        parts.append(f'<a class="tm-link" href="{{{{ROOT}}}}{profile_url(p)}">View full profile {{{{icon:arrow}}}}</a>')
    hint = (f'<button type="button" class="tm-qv-hint" data-tm-open aria-haspopup="dialog" aria-label="Quick view: {esc(name)}">'
            f'{{{{icon:expand}}}}<span>Quick view</span></button>' if profile else "")
    hay = " ".join(i for _, items in (p.get("groups") or []) for i in items)
    lead = " tm-card--lead" if (p.get("featured") and ctx == "home") else ""   # the highlighted (blue) card on home
    return (f'<article class="tm-card{lead} reveal" style="--i:{k % 6}" data-tm-card data-skills="{esc(hay)}">'
            f'<div class="tm-face"><span class="tm-light" aria-hidden="true"></span>{hint}{"".join(parts)}</div>'
            f'{_quick_view(p, ctx) if profile else ""}</article>')


def home_section_html() -> str:
    """The home team section: heading, the cards, Meet the whole team / Book a discovery call."""
    # owner 22 Oct 2026: the home section shows only the three ranked for BIR-related experience (bir_rank 1-3), best first
    people = sorted([p for p in ADV.ADVISORS if p.get("bir_rank")], key=lambda p: p["bir_rank"])[:3]
    cards = "".join(card_html(p, k, "home") for k, p in enumerate(people))
    return f'''<section class="section fx-sec tm-field" id="advisers" aria-labelledby="pf-h">
  <div class="container">
    <div class="sec-head reveal"><h2 id="pf-h">Meet the experts.</h2><p class="lead">Your first call is with one of them. They scope the work, our own team builds it, and the same people support it after go-live.</p></div>
    <div class="tm-grid tm-grid--home">{cards}</div>
    <div class="actions pf-act reveal"><a class="btn btn-primary btn-lg" href="{{{{ROOT}}}}employee-hub.html">{{{{icon:users}}}}Meet the whole team {{{{icon:arrow}}}}</a><a class="btn btn-ghost btn-lg" data-meet href="{BOOK}" target="_blank" rel="noopener">Book a discovery call</a></div>
  </div>
</section>'''


# ---------------------------------------------------------------------------------------------------------- directory
def directory_html() -> str:
    """Team Directory cards: everyone with a profile first, then the rest of team.TEAM (no profile page, no quick view).
    employee-hub-fx.js reads h3, .tm-role and .th-mail for the vCard and search, and fills .tm-actions; data-skills
    widens the search to skills."""
    rows = [(p, True) for p in ordered()] + [(t, False) for t in TM.TEAM]
    return "".join(card_html(p, k, "directory", profile=has) for k, (p, has) in enumerate(rows))
