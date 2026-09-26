"""Build the static site: wraps every partial in _src/pages/ with the shared layout.

    python _src/build.py

Partials start with a one-line JSON meta comment:
    <!--meta {"title": "...", "desc": "...", "out": "solutions/odoo-erp.html", "nav": "solution"} -->
Tokens available inside partials and the layout:
    {{ROOT}}            relative prefix back to the site root ("" or "../")
    {{icon:name}}       inline stroke SVG from sitedata.ICONS
    {{odoo:module}}     official Odoo app icon <img>, default 44px; {{odoo:module:28}} for 28px
    {{YEAR}}            current year
"""
import html as html_mod
import json
import subprocess
import os
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, os.path.dirname(__file__))
import sitedata as S  # noqa: E402

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
PAGES = SRC / "pages"
YEAR = str(date.today().year)


def asset_version() -> str:
    """Short content hash of the CSS/JS bundle, appended as ?v= so a deploy never serves a cached stylesheet
    against new markup (GitHub Pages caches assets for ~10 minutes)."""
    import hashlib
    h = hashlib.sha1()
    for f in sorted((ROOT / "assets").glob("css/*.css")) + sorted((ROOT / "assets").glob("js/*.js")):
        h.update(f.read_bytes())
    return h.hexdigest()[:8]


ASSET_V = asset_version()

ICON_RE = re.compile(r"\{\{icon:([a-z0-9_-]+)\}\}")
ODOO_RE = re.compile(r"\{\{odoo:([a-z0-9_]+)(?::(\d+))?\}\}")
META_RE = re.compile(r"^\s*<!--meta\s*(\{.*?\})\s*-->", re.S)
ODOO_DIR = ROOT / "assets" / "img" / "odoo"


def icons(html: str) -> str:
    def rep(m):
        name = m.group(1)
        if name not in S.ICONS:
            raise KeyError(f"unknown icon {name!r}")
        return S.ICONS[name]
    return ICON_RE.sub(rep, html)


def odoo_icons(html: str) -> str:
    """{{odoo:mod}} -> <img> pointing at the official Odoo app icon. Emits {{ROOT}} (resolved later)."""
    def rep(m):
        mod, size = m.group(1), m.group(2) or "44"
        if not (ODOO_DIR / f"{mod}.svg").exists():
            raise KeyError(f"missing Odoo icon assets/img/odoo/{mod}.svg")
        return (f'<img class="oi" src="{{{{ROOT}}}}assets/img/odoo/{mod}.svg" alt="" '
                f'width="{size}" height="{size}" loading="lazy" decoding="async">')
    return ODOO_RE.sub(rep, html)


def link_icon(l: dict, size: int = 28) -> str:
    if l.get("odoo"):
        return f'{{{{odoo:{l["odoo"]}:{size}}}}}'
    return f'{{{{icon:{l["icon"]}}}}}'


# ---------------------------------------------------------------- header
def nav_html(active: str) -> str:
    items = []
    for it in S.NAV:
        cls = "nav-item" + (" is-active" if it["id"] == active else "")
        if "columns" not in it:
            items.append(f'<li class="{cls}"><a class="nav-link" href="{{{{ROOT}}}}{it["href"]}">{it["label"]}</a></li>')
            continue
        cols = []
        for col in it["columns"]:
            head = col["title"]
            if col.get("href"):
                head = f'<a href="{{{{ROOT}}}}{col["href"]}">{col["title"]} {{{{icon:arrow}}}}</a>'
            links = "".join(
                f'<a class="mega-link" href="{{{{ROOT}}}}{l["href"]}">'
                f'<span class="mega-ic">{link_icon(l)}</span>'
                f'<span><b>{l["label"]}</b><small>{l["desc"]}</small></span></a>'
                for l in col["links"])
            wide = " mega-col--wide" if col.get("wide") else ""
            cols.append(f'<div class="mega-col{wide}"><div class="mega-head">{head}</div>{links}</div>')
        panel_id = f"mega-{it['id']}"
        items.append(
            f'<li class="{cls} has-mega">'
            f'<button class="nav-link" type="button" aria-expanded="false" aria-controls="{panel_id}">'
            f'{it["label"]} <span class="nav-chev">{{{{icon:chevron}}}}</span></button>'
            f'<div class="mega" id="{panel_id}" role="region" aria-label="{it["label"]} menu">'
            f'<div class="container mega-grid">{"".join(cols)}</div></div></li>')
    return "\n".join(items)


def mobile_nav_html() -> str:
    c = S.COMPANY
    out = []
    for it in S.NAV:
        if "columns" not in it:
            out.append(f'<a class="mnav-top" href="{{{{ROOT}}}}{it["href"]}">{it["label"]} {{{{icon:arrow}}}}</a>')
            continue
        groups = []
        for col in it["columns"]:
            links = "".join(
                f'<a href="{{{{ROOT}}}}{l["href"]}"><span class="mnav-ic">{link_icon(l, 24)}</span>{l["label"]}</a>'
                for l in col["links"])
            groups.append(f'<div class="mnav-group"><div class="mnav-head">{col["title"]}</div>{links}</div>')
        out.append(f'<details class="mnav-sec"><summary>{it["label"]} {{{{icon:chevron}}}}</summary>{"".join(groups)}</details>')
    out.append(f'''
<div class="mnav-cta">
  <a class="btn btn-primary btn-lg" href="{{{{ROOT}}}}quotation.html">Get a quotation {{{{icon:arrow}}}}</a>
  <a class="btn btn-ghost btn-lg" href="#talk">{{{{icon:send}}}} Let's talk</a>
  <button class="btn btn-ghost btn-lg" type="button" data-chat-open>{{{{icon:chat}}}} Chat with us</button>
</div>
<div class="mnav-contact">
  <a href="mailto:{c["sales_email"]}">{{{{icon:mail}}}} {c["sales_email"]}</a>
  <a href="{c["whatsapp_link"]}" target="_blank" rel="noopener">{{{{icon:whatsapp}}}} {c["whatsapp"]}</a>
  <span>{{{{icon:pin}}}} {c["hubs"]}</span>
</div>''')
    return "\n".join(out)


def talk_panel_html() -> str:
    c = S.COMPANY
    return f'''
<div class="side-tabs">
  <button class="side-tab talk-tab" type="button" data-talk-open aria-haspopup="dialog" aria-controls="talk-panel">
    {{{{icon:send}}}}<span>Let's Talk</span>
  </button>
  <button class="side-tab chat-tab" type="button" data-chat-open aria-haspopup="dialog" aria-controls="chat-win">
    {{{{icon:chat}}}}<span>Chat with us</span>
  </button>
</div>
<div class="talk-overlay" data-talk-close hidden></div>
<aside class="talk-panel" id="talk-panel" role="dialog" aria-modal="true" aria-labelledby="talk-title" hidden>
  <div class="talk-head">
    <img src="{{{{ROOT}}}}assets/img/logo-horizontal.png" alt="TechNext" width="140" height="28">
    <button class="icon-btn" type="button" data-talk-close aria-label="Close">{{{{icon:x}}}}</button>
  </div>
  <div class="talk-body">
    <p class="hand">let's talk</p>
    <h2 id="talk-title">Tell us what slows you down.</h2>
    <p class="talk-lead">We reply from <a href="mailto:{c["sales_email"]}">{c["sales_email"]}</a>. Prefer to chat?
      <a href="{c["whatsapp_link"]}" target="_blank" rel="noopener">WhatsApp {c["whatsapp"]}</a>.</p>

    <form class="form" id="talk-form" novalidate data-endpoint="{S.FORM_ENDPOINT}">
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="_subject" value="New inquiry — technext.asia">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="source" value="Let's Talk panel">
      <div class="form-row">
        <div class="field"><label for="tf-name">Name</label><input id="tf-name" name="name" type="text" required autocomplete="name"></div>
        <div class="field"><label for="tf-company">Company</label><input id="tf-company" name="company" type="text" autocomplete="organization"></div>
      </div>
      <div class="form-row">
        <div class="field"><label for="tf-email">Work email</label><input id="tf-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="tf-phone">Phone</label><input id="tf-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required></div>
      </div>
      <div class="field">
        <label for="tf-topic">I'm interested in</label>
        <select id="tf-topic" name="topic" required>
          <option value="">Choose one</option>
          <option>Odoo Accounting</option>
          <option>Odoo Sales &amp; CRM</option>
          <option>Odoo Inventory</option>
          <option>Full Odoo ERP implementation</option>
          <option>Odoo training or support</option>
          <option>Website</option>
          <option>Social media management</option>
          <option>Something else</option>
        </select>
      </div>
      <div class="field"><label for="tf-msg">Message</label><textarea id="tf-msg" name="message" rows="4" required></textarea></div>
      <div class="form-foot">
        <button class="btn btn-primary" type="submit"><span class="btn-label">Send inquiry</span><span class="btn-busy" aria-hidden="true"></span></button>
        <a class="btn-link" href="{{{{ROOT}}}}quotation.html">Need a written quotation? {{{{icon:arrow}}}}</a>
      </div>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
  <div class="talk-foot">
    <span>{{{{icon:pin}}}} {c["hubs"]}</span>
  </div>
</aside>

<section class="chat" id="chat-win" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden>
  <header class="chat-head">
    <span class="chat-avatar">{{{{icon:bot}}}}</span>
    <div><b id="chat-title">TechNext assistant</b><small>Answers instantly · hands off to sales@technext.asia</small></div>
    <button class="icon-btn icon-btn--sm" type="button" data-chat-close aria-label="Close chat">{{{{icon:x}}}}</button>
  </header>
  <div class="chat-log" data-chat-log aria-live="polite" aria-relevant="additions"></div>
  <div class="chat-chips" data-chat-chips></div>
  <form class="chat-input" data-chat-form>
    <label class="skip" for="chat-text">Type your question</label>
    <input id="chat-text" type="text" autocomplete="off" placeholder="Ask about Accounting, Sales, Inventory…" maxlength="300">
    <button class="btn btn-primary chat-send" type="submit" aria-label="Send">{{{{icon:send}}}}</button>
  </form>
</section>'''


LAYOUT = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{TAGS_HEAD}
<title>{TITLE}</title>
<meta name="description" content="{DESC}">
<link rel="canonical" href="{CANONICAL}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="TechNext">
<meta property="og:title" content="{TITLE}">
<meta property="og:description" content="{DESC}">
<meta property="og:url" content="{CANONICAL}">
<meta property="og:image" content="{SITE_URL}assets/img/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#3167CA">
<link rel="icon" type="image/png" sizes="32x32" href="{ROOT}assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="{ROOT}assets/img/favicon-192.png">
<link rel="apple-touch-icon" href="{ROOT}assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Caveat:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{ROOT}assets/css/site.css?v={ASSET_V}">
<style>#intro{display:none}html.intro #intro{display:grid}</style>
<script>(function(){try{var force=/[?&]intro=1(&|$)/.test(location.search);var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};var internal=false;try{internal=!!document.referrer&&new URL(document.referrer).origin===location.origin;}catch(e){}var skip=(nav.type==='navigate'&&internal)||nav.type==='back_forward';if((force||!skip)&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro');}}catch(e){}})();</script>
{HEAD_EXTRA}
<script type="application/ld+json">{JSONLD}</script>
</head>
<body class="{BODY_CLASS}">
{TAGS_BODY}
<div class="intro" id="intro" aria-hidden="true" data-tagline="Odoo Partner · Singapore">
  <div class="intro-bg"></div>
  <div class="intro-bloom"></div>
  <canvas class="intro-particles"></canvas>
  <svg class="intro-trail-svg" aria-hidden="true"><defs><linearGradient id="introGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6FA0F5" stop-opacity="0"/><stop offset=".6" stop-color="#6FA0F5"/><stop offset="1" stop-color="#3167CA"/></linearGradient></defs><path d=""/></svg>
  <div class="intro-lockup">
  <div class="intro-stage">
    <div class="intro-plane-wrap">
      <span class="intro-ripple"></span><span class="intro-ripple"></span>
      <img class="intro-plane" src="{ROOT}assets/img/logo-plane.png" alt="" width="160" height="136" decoding="sync">
    </div>
    <span class="intro-word" style="aspect-ratio:{LETTERS_W}/{LETTERS_H}">{LETTERS}</span>
  </div>
  <span class="intro-sub" aria-hidden="true"></span>
  <span class="intro-pills" aria-hidden="true">
    <span class="intro-pill" style="--i:0">{{odoo:accountant:18}}Accounting</span>
    <span class="intro-pill" style="--i:1">{{odoo:sale:18}}Sales</span>
    <span class="intro-pill" style="--i:2">{{odoo:stock:18}}Inventory</span>
  </span>
  <span class="intro-shine" aria-hidden="true"></span>
  <span class="intro-shine intro-shine--2" aria-hidden="true"></span>
  </div>
  <span class="intro-progress" aria-hidden="true"></span>
  <button class="intro-skip" type="button">Skip</button>
</div>
<a class="skip" href="#main">Skip to content</a>

<header class="header" data-header>
  <div class="container header-inner">
    <a class="brand" href="{ROOT}index.html" aria-label="TechNext — home">
      <img src="{ROOT}assets/img/logo-horizontal.png" alt="TechNext" width="170" height="34">
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav-list">
{NAV}
      </ul>
    </nav>
    <div class="header-cta"><a class="btn btn-primary" href="{WA_MSG}" target="_blank" rel="noopener" aria-label="Contact us on WhatsApp">{{icon:whatsapp}}<span>Contact Us</span></a></div>
    <button class="icon-btn menu-btn" type="button" data-mnav-open aria-label="Open menu" aria-expanded="false" aria-controls="mnav">{{icon:menu}}</button>
  </div>
</header>

<div class="mnav-overlay" data-mnav-close hidden></div>
<nav class="mnav" id="mnav" aria-label="Mobile" hidden>
  <div class="mnav-top-bar">
    <img src="{ROOT}assets/img/logo-horizontal.png" alt="TechNext" width="140" height="28">
    <button class="icon-btn" type="button" data-mnav-close aria-label="Close menu">{{icon:x}}</button>
  </div>
{MNAV}
</nav>

<main id="main">
{CONTENT}
</main>

<footer class="footer">
  <div class="container footer-inner">
    <span>© {YEAR} {LEGAL}</span>
    <nav aria-label="Legal"><a href="{ROOT}privacy.html">Privacy Policy</a><a href="{ROOT}terms.html">Terms of Service</a></nav>
  </div>
</footer>

{TALK}

<script src="{ROOT}assets/js/site.js?v={ASSET_V}" defer></script>
<script src="{ROOT}assets/js/chat.js?v={ASSET_V}" defer></script>
<script src="{ROOT}assets/js/consent.js?v={ASSET_V}" defer></script>
{SCRIPTS}
</body>
</html>
'''


SERVICE_PAGES = ("solutions/", "industries/", "odoo/apps/", "odoo/discovery.html", "odoo/training.html",
                 "odoo/integration.html", "odoo/support.html", "odoo/erp-system.html",
                 "odoo/crm-development.html", "odoo/ai-integration.html")
AREA_SERVED = ["Singapore", "Southeast Asia", "Worldwide"]
_CRUMBS = re.compile(r'<nav class="crumbs"[^>]*>(.*?)</nav>', re.S)
_CRUMB = re.compile(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>|<span\b[^>]*>(.*?)</span>', re.S)
_FAQ = re.compile(r'<details>\s*<summary>(.*?)</summary>\s*<div class="faq-a">(.*?)</div>\s*</details>', re.S)


def _text(fragment: str) -> str:
    fragment = re.sub(r"\{\{[^{}]*\}\}", "", fragment)          # template tokens, e.g. {{icon:chevron}}
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html_mod.unescape(fragment)).strip()


def _abs_url(href: str) -> str:
    href = href.replace("{{ROOT}}", "").replace("{ROOT}", "")
    href = re.sub(r"^(\.\./)+", "", href).split("#")[0]
    return S.SITE_URL + clean_url(href)


def _base_title(title: str) -> str:
    """'Odoo for F&B — restaurants & central kitchens' -> 'Odoo for F&B'."""
    return re.split(r"\s+[—·|]\s+", title)[0].strip()


def _breadcrumb(canonical: str, content: str):
    m = _CRUMBS.search(content)
    if not m:
        return None
    items, seen = [], set()
    for href, a_text, span in _CRUMB.findall(m.group(1)):
        if not href and span:                                     # <span><a href=..>..</a></span>
            inner = re.search(r'href="([^"]+)"[^>]*>(.*?)</a>', span, re.S)
            if inner:
                href, a_text = inner.group(1), inner.group(2)
        name = _text(a_text or span)
        if not name:
            continue
        if href:
            if "#" in href:                                       # same-page anchors are not pages
                continue
            url = _abs_url(href)
        else:
            url = None
        items.append((name, url))
    if not items:
        return None
    # the last crumb is the page itself
    items[-1] = (items[-1][0], canonical)
    out = []
    for name, url in items:
        if not url or url in seen:                                # unlinked middle crumbs are labels
            continue
        seen.add(url)
        out.append({"@type": "ListItem", "position": len(out) + 1, "name": name, "item": url})
    if len(out) < 2:
        return None
    return {"@type": "BreadcrumbList", "@id": canonical + "#breadcrumb", "itemListElement": out}


def jsonld(canonical: str, meta: dict, content: str, out_rel: str) -> str:
    """One linked graph per page: the company, the site, this page, its breadcrumb, and -
    only when the page visibly shows them - its FAQs and the service it describes."""
    c = S.COMPANY
    org_id, site_id, page_id = S.SITE_URL + "#organization", S.SITE_URL + "#website", canonical + "#webpage"
    graph = [
        {
            "@type": "ProfessionalService", "@id": org_id,
            "name": c["legal"], "alternateName": c["short"], "url": S.SITE_URL,
            "logo": {"@type": "ImageObject", "url": S.SITE_URL + "assets/img/logo-horizontal.png", "width": 1000, "height": 200},
            "image": S.SITE_URL + "assets/img/og-image.png",
            "email": c["sales_email"], "telephone": c["whatsapp"],
            "address": {"@type": "PostalAddress", "streetAddress": c["address"][0],
                        "addressLocality": "Singapore", "postalCode": "180261", "addressCountry": "SG"},
            "identifier": {"@type": "PropertyValue", "propertyID": "UEN", "value": c["uen"]},
            "areaServed": AREA_SERVED,
            "sameAs": [c["linkedin"]],
            "description": S.DEFAULT_DESC,
            "knowsAbout": ["Odoo ERP", "Odoo implementation", "Odoo Accounting", "Odoo Sales", "Odoo Inventory",
                           "Enterprise Resource Planning", "Enterprise AI", "Retrieval-augmented generation (RAG)",
                           "AI workflow automation", "AI chatbots", "Website development", "Business consultation"],
        },
        {"@type": "WebSite", "@id": site_id, "url": S.SITE_URL, "name": c["short"],
         "publisher": {"@id": org_id}, "inLanguage": "en"},
    ]
    page = {"@type": "WebPage", "@id": page_id, "url": canonical, "name": meta["title"],
            "description": meta.get("desc", S.DEFAULT_DESC).strip(), "isPartOf": {"@id": site_id},
            "inLanguage": "en"}
    if out_rel in ("index.html", "company.html"):
        page["about"] = {"@id": org_id}
    crumb = _breadcrumb(canonical, content)
    if crumb:
        page["breadcrumb"] = {"@id": crumb["@id"]}
    graph.append(page)
    if crumb:
        graph.append(crumb)
    faqs = [(_text(q), _text(a)) for q, a in _FAQ.findall(content)]
    faqs = [(q, a) for q, a in faqs if q and a]
    if len(faqs) >= 2:
        graph.append({"@type": "FAQPage", "@id": canonical + "#faq", "isPartOf": {"@id": page_id},
                      "mainEntity": [{"@type": "Question", "name": q,
                                      "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]})
    if out_rel.startswith(SERVICE_PAGES):
        name = _base_title(meta["title"])
        graph.append({"@type": "Service", "@id": canonical + "#service", "name": name, "serviceType": name,
                      "description": meta.get("desc", "").strip(), "url": canonical,
                      "provider": {"@id": org_id}, "areaServed": AREA_SERVED})
    # a "</" inside a JSON string would end the <script> element early
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False).replace("</", "<\\/")


# ---------------------------------------------------------------- generated blocks
def apps_nav_html() -> str:
    out = []
    for c in S.APP_CATEGORIES:
        cls = ' class="is-focus"' if c.get("focus") else ""
        out.append(f'<a href="#{c["id"]}"{cls}>{{{{icon:{c["icon"]}}}}} {c["title"]} <span class="muted">{len(c["apps"])}</span></a>')
    return "\n".join(out)


def apps_cats_html() -> str:
    out = []
    for c in S.APP_CATEGORIES:
        cards = []
        for app in c["apps"]:
            tag = ' <span class="tag">Focus</span>' if app["focus"] else ""
            cards.append(f'<a class="app{" is-focus" if app["focus"] else ""}" data-app="{app["mod"]}" href="apps/{app["mod"]}.html">'
                         f'{{{{odoo:{app["mod"]}:40}}}}<div><b>{app["name"]}{tag}</b><small>{app["desc"]}</small></div>{{{{icon:arrow}}}}</a>')
        focus_note = (' <span class="tag tag--ok">{{icon:check}} Our focus area</span>' if c.get("focus") else "")
        out.append(f'''<section class="apps-cat" id="{c["id"]}">
  <div class="container">
    <div class="apps-cat-head">
      <h2><span class="card-ic">{{{{icon:{c["icon"]}}}}}</span>{c["title"]}{focus_note}</h2>
      <p>{len(c["apps"])} apps</p>
    </div>
    <div class="apps-grid">{"".join(cards)}</div>
  </div>
</section>''')
    return "\n".join(out)


def marquee_html() -> str:
    names = {a["mod"]: a["name"] for c in S.APP_CATEGORIES for a in c["apps"]}
    items = "".join(f'<span class="mq-item">{{{{odoo:{m}:26}}}}{names.get(m, m)}</span>' for m in S.MARQUEE)
    return f'<div class="mq-track">{items}</div><div class="mq-track" aria-hidden="true">{items}</div>'


def pillars_html() -> str:
    """The four positioning pillars as a card row (sitedata.PILLARS). Icon is a stroke name or 'odoo:mod'."""
    cards = []
    for i, (ic, title, desc) in enumerate(S.PILLARS):
        glyph = f'{{{{odoo:{ic.split(":", 1)[1]}:34}}}}' if ic.startswith("odoo:") else f'{{{{icon:{ic}}}}}'
        cards.append(f'<article class="pillar reveal" style="--i:{i}"><span class="pillar-ic">{glyph}</span>'
                     f'<h3>{title}</h3><p>{desc}</p></article>')
    return "".join(cards)


def letters_html() -> tuple:
    """Wordmark slices for the intro (see make_assets.split_letters)."""
    meta_path = SRC / "letters.json"
    if not meta_path.exists():
        return ('<img class="intro-letter" style="left:0;width:100%;--i:0" src="{ROOT}assets/img/logo-text.png" alt="" decoding="sync">', 763, 132)
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    imgs = "".join(
        f'<img class="intro-letter" style="left:{l["x"]*100:.2f}%;width:{l["w"]*100:.2f}%;--i:{i}" '
        f'src="{{ROOT}}assets/img/letters/l{i}.png" alt="" decoding="sync">'
        for i, l in enumerate(meta["letters"]))
    return imgs, meta["w"], meta["h"]


# ---------------------------------------------------------------- Odoo module pages
APP_CONTENT_PATH = SRC / "apps_content.json"
APP_CONTENT = json.loads(APP_CONTENT_PATH.read_text(encoding="utf-8")) if APP_CONTENT_PATH.exists() else {}
CAT_BY_MOD = {a["mod"]: c for c in S.APP_CATEGORIES for a in c["apps"]}
APP_BY_MOD = {a["mod"]: a for c in S.APP_CATEGORIES for a in c["apps"]}

# Every built page is recorded here (url, title, description) so the chat assistant can recognise and
# route to any content on the site, not just its scripted topics. Written to assets/data/chat-index.json.
INDEX = []
INDEX_SKIP = {"404.html", "privacy.html", "terms.html", "case-studies.html"}

# How TechNext implements each focus app (our own words; everything from odoo.com is attributed).
IMPLEMENT = {
    "accountant": ["Chart of accounts, taxes and journals set up for how you close the month", "Bank feeds connected and reconciliation rules tuned on your real statements", "Opening balances and open items migrated and reconciled before cut-over", "Finance team trained on invoicing, reconciliation and month-end"],
    "account": ["Invoice templates in your branding with your payment terms", "Payment links and reminders configured", "Invoicing policy per product: on order, on delivery, by milestone", "Portal set up so customers see their history"],
    "sale": ["Quotation templates and optional products for your offers", "Pricelists, discounts and approval rules", "Confirmation → delivery → invoice flow configured end to end", "Sales team trained on quotations, orders and the portal"],
    "stock": ["Warehouses, locations and routes modelled on your sites", "Barcode operations for receipts, picking and counts", "Reordering rules that raise purchase orders automatically", "Opening stock counted in and valued correctly"],
    "purchase": ["Vendor pricelists and lead times loaded", "RFQ → order → receipt → bill matching configured", "Approval thresholds for purchase orders", "Buyers trained on RFQs and vendor bills"],
    "crm": ["Pipeline stages per team with required fields", "Lead capture from web forms, email and WhatsApp", "Assignment rules and scheduled activities", "Won opportunity → quotation without re-entry"],
}
DEFAULT_IMPLEMENT = ["Discovery: we map how the process runs today and match it to the app", "Configuration on a staging database, checked against real records", "Training for the people who will use it, on your own data", "Support after go-live: fixes, changes and upgrades"]


def yt_facade(vid: str, title: str) -> str:
    return (f'<button class="yt" type="button" data-yt="{vid}" aria-label="Play video: {title}">'
            f'<img src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="" loading="lazy" decoding="async" data-onerror="remove">'
            f'<span class="yt-play">{{{{icon:play}}}}</span><span class="yt-cap">Official Odoo video · YouTube</span></button>')


def app_page(mod: str) -> tuple:
    app, cat = APP_BY_MOD[mod], CAT_BY_MOD[mod]
    c = APP_CONTENT.get(mod, {})
    name = app["name"]
    lead = c.get("lead") or c.get("description") or app["desc"]
    headline = c.get("headline") or f"{name} in Odoo"
    odoo_url = c.get("url", "https://www.odoo.com/")
    focus = ' <span class="tag tag--ok">{{icon:check}} TechNext focus app</span>' if app["focus"] else ""
    images = [i for i in c.get("images", []) if not i.endswith(".svg")]
    sections = c.get("sections", [])
    used = {s["img"] for s in sections if s.get("img")}

    # hero: the odoo.com hero image on the right when there is one; otherwise a single column — never a placeholder
    hero_img = next((i for i in images if i not in used), "")
    if hero_img:
        used.add(hero_img)
        hero_media = (f'<div class="app-media reveal"><img class="app-shot" src="{hero_img}" alt="Odoo {name}" '
                      f'loading="eager" decoding="async" data-onerror="closest:.app-media"></div>')
        hero_grid = "two"
    else:
        hero_media, hero_grid = "", "app-hero-single"

    # videos: every official YouTube video plus the odoocdn hero clip, in their own section right after the hero
    vids = [yt_facade(v, f"Odoo {name} video {k + 1}") for k, v in enumerate(c.get("youtube", []))]
    if c.get("mp4"):
        poster = f' poster="{hero_img}"' if hero_img else ""
        vids.append(f'<video class="app-video" controls preload="none" playsinline{poster}><source src="{c["mp4"]}" type="video/mp4"></video>')
    videos = ""
    if vids:
        items = "".join(f'<div class="video reveal" style="--i:{k}">{v}</div>' for k, v in enumerate(vids))
        videos = f'''<section class="section section--tight" id="watch">
  <div class="container">
    <div class="sec-head reveal"><span class="hand">watch</span><h2>{name} in action.</h2><p class="lead">Official Odoo videos. Nothing loads until you press play.</p></div>
    <div class="{"videos videos--one" if len(vids) == 1 else "videos"}">{items}</div>
  </div>
</section>'''

    # what it does: one row per odoo.com section — its own heading, copy, sub-points and image
    rows, cards = [], []
    for k, s in enumerate(sections[:8]):
        feats = "".join(f'<li>{{{{icon:check}}}}{f}</li>' for f in s.get("feats", [])[:5])
        feats_html = f'<ul class="checks">{feats}</ul>' if feats else ""
        if s.get("img"):
            flip = " feat--flip" if len(rows) % 2 else ""
            rows.append(f'''<div class="feat reveal{flip}">
      <div class="feat-media"><img src="{s["img"]}" alt="Odoo {name} — {s["h"]}" loading="lazy" decoding="async" data-onerror="feat"></div>
      <div class="feat-copy"><span class="card-kicker">{k + 1:02d} · {name}</span><h3>{s["h"]}</h3><p>{s["p"]}</p>{feats_html}</div>
    </div>''')
        else:
            cards.append(f'<article class="card reveal" style="--i:{len(cards)}"><div class="card-ic">{{{{odoo:{mod}:36}}}}</div><h3>{s["h"]}</h3><p>{s["p"]}</p>{feats_html}</article>')
    if not rows and not cards:
        cards.append(f'<article class="card reveal"><div class="card-ic">{{{{odoo:{mod}:36}}}}</div><h3>{name}</h3><p>{app["desc"]}</p></article>')
    what = (f'<div class="feats">{"".join(rows)}</div>' if rows else "") + \
           (f'<div class="grid-3{" mt-56" if rows else ""}">{"".join(cards)}</div>' if cards else "")

    # remaining screenshots not already shown
    shots = [i for i in images if i not in used][:6]
    gallery = "".join(f'<figure class="shot reveal" style="--i:{k}"><img src="{u}" alt="Odoo {name} screenshot {k + 1}" loading="lazy" decoding="async" data-onerror="closest:figure"><figcaption>Odoo {name} · screenshot from odoo.com</figcaption></figure>' for k, u in enumerate(shots))
    screens = f'''<section class="section section--alt section--tight">
  <div class="container">
    <div class="sec-head reveal"><span class="hand">screens</span><h2>Inside the app.</h2></div>
    <div class="shots">{gallery}</div>
  </div>
</section>''' if gallery else ""

    rel_mods = [a["mod"] for a in cat["apps"] if a["mod"] != mod][:4]
    for extra in ("accountant", "sale", "stock"):
        if extra != mod and extra not in rel_mods and len(rel_mods) < 6:
            rel_mods.append(extra)
    related = "".join(f'<a class="app" href="{m}.html">{{{{odoo:{m}:40}}}}<div><b>{APP_BY_MOD[m]["name"]}</b><small>{APP_BY_MOD[m]["desc"]}</small></div>{{{{icon:arrow}}}}</a>' for m in rel_mods)
    impl = "".join(f'<li>{{{{icon:check}}}}{p}</li>' for p in IMPLEMENT.get(mod, DEFAULT_IMPLEMENT))
    # Original copy only: the old description was odoo.com's own marketing text, which made
    # these pages near-duplicates of Odoo's.
    short = app["desc"].rstrip(".")
    desc_meta = f"Odoo {name} implemented by TechNext, an Odoo Partner in Singapore. {short}. Setup, data migration, training and support."
    if len(desc_meta) > 160:
        desc_meta = f"Odoo {name} implemented by TechNext, an Odoo Partner in Singapore. {short}."
    if len(desc_meta) > 160:
        desc_meta = desc_meta[:157].rsplit(" ", 1)[0] + "…"
    if len(desc_meta) < 110:
        desc_meta += " Book a free discovery call."
    meta = {"title": f"Odoo {name} implementation in Singapore", "desc": desc_meta,
            "out": f"odoo/apps/{mod}.html", "nav": "odoo"}
    content = f'''
<section class="page-hero page-hero--split">
  <div class="container">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="{{{{ROOT}}}}index.html">Home</a><span>Odoo</span><span><a href="{{{{ROOT}}}}odoo/apps.html">Apps</a></span><span><a href="{{{{ROOT}}}}odoo/apps.html#{cat["id"]}">{cat["title"]}</a></span><span>{name}</span></nav>
    <div class="{hero_grid}">
      <div>
        <div class="app-hero-head">{{{{odoo:{mod}:56}}}}<span class="hand">odoo · {cat["title"].lower()}</span></div>
        <h1>{name} <span class="app-sub">{headline}</span></h1>
        <p class="lead">{lead}</p>
        <div class="pill-row"><span class="tag tag--odoo">Odoo Partner</span>{focus}</div>
        <div class="actions">
          <a class="btn btn-primary btn-lg" href="{{{{ROOT}}}}quotation.html">Get a quotation {{{{icon:arrow}}}}</a>
          <a class="btn btn-ghost btn-lg" href="#talk">Talk to us</a>
        </div>
      </div>
      {hero_media}
    </div>
  </div>
</section>

{videos}

<section class="section">
  <div class="container">
    <div class="sec-head reveal"><span class="hand">what it does</span><h2>{name}, section by section.</h2><p class="lead">The product as Odoo presents it. TechNext configures each part to your process.</p></div>
    {what}
  </div>
</section>

{screens}

<section class="section section--alt">
  <div class="container">
    <div class="two two--top">
      <div class="reveal"><span class="hand">how technext implements it</span><h2>{name}, configured to how you work.</h2><p class="lead">Standard Odoo first. We set it up on a staging database, migrate your data, train your team and stay on after go-live.</p><div class="actions"><a class="btn btn-primary" href="{{{{ROOT}}}}odoo/discovery.html">Start with discovery {{{{icon:arrow}}}}</a><a class="btn-link" href="{{{{ROOT}}}}odoo/support.html">Support plans {{{{icon:arrow}}}}</a></div></div>
      <ul class="checks" style="margin:0">{impl}</ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="sec-head sec-head--row reveal"><div><span class="hand">works with</span><h2 style="margin:0">Apps that share the same database.</h2></div><a class="btn-link" href="{{{{ROOT}}}}odoo/apps.html">All Odoo apps {{{{icon:arrow}}}}</a></div>
    <div class="apps-grid">{related}</div>
    <p class="small muted mt-24">Product descriptions, screenshots and videos are © Odoo S.A., reproduced for reference from <a href="{odoo_url}" target="_blank" rel="noopener">odoo.com</a>. TechNext is an Odoo Partner; we implement and support Odoo.</p>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="cta reveal">
      <div><span class="hand">next step</span><h2>Want {name} running in your company?</h2><p>Tell us how the process works today. We'll say what to switch on first and what it takes.</p></div>
      <div class="actions"><a class="btn btn-white btn-lg" href="{{{{ROOT}}}}quotation.html">Get a quotation</a><a class="btn btn-outline-white btn-lg" href="#talk">Let's talk</a></div>
    </div>
  </div>
</section>'''
    return meta, content

def build_page(path: Path, nav_cache: dict) -> str:
    raw = path.read_text(encoding="utf-8")
    m = META_RE.match(raw)
    if not m:
        raise ValueError(f"{path}: missing <!--meta {{...}} --> header")
    meta = json.loads(m.group(1))
    content = raw[m.end():].strip("\n")
    return render(meta, content, nav_cache)


# ---------------------------------------------------------------- Google tags
# Consent Mode v2 defaults run FIRST (everything denied until the visitor accepts in
# assets/js/consent.js), then the Tag Manager and gtag.js snippets in Google's standard
# form. Keep them byte-stable: _src/make_vercel.py hashes every inline script for the CSP.
CONSENT_DEFAULT = ("<script id=\"tn-consent-default\">\n"
    "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}\n"
    "gtag('consent','default',{'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied',"
    "'analytics_storage':'denied','functionality_storage':'granted','security_storage':'granted','wait_for_update':500});\n"
    "try{if(document.cookie.indexOf('tn_consent=yes')>-1){gtag('consent','update',{'ad_storage':'granted',"
    "'ad_user_data':'granted','ad_personalization':'granted','analytics_storage':'granted'});}}catch(e){}\n"
    "</script>")


def _gtm_head(cid):
    return ("<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n"
            "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n"
            "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n"
            "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n"
            "})(window,document,'script','dataLayer','" + cid + "');</script>")


def _gtag(tid):
    return ("<script async src=\"https://www.googletagmanager.com/gtag/js?id=" + tid + "\"></script>\n"
            "<script>\n  window.dataLayer = window.dataLayer || [];\n"
            "  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n"
            "  gtag('config', '" + tid + "');\n</script>")


def tags_head(is_home: bool) -> str:
    t = S.TRACKING
    ids = t["gtm"] + (t["gtm_home"] if is_home else [])
    return "\n".join([CONSENT_DEFAULT] + [_gtm_head(c) for c in ids] + [_gtag(t["ga4"]), _gtag(t["ads"])])


def tags_body(is_home: bool) -> str:
    t = S.TRACKING
    ids = t["gtm"] + (t["gtm_home"] if is_home else [])
    return "\n".join('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=' + c +
                     '" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'
                     for c in ids)


def clean_url(rel: str) -> str:
    """Public URL for a built file. The site is served with Vercel `cleanUrls`, so the
    canonical form of every page is extensionless; index.html collapses to its directory."""
    if rel == "index.html":
        return ""
    if rel.endswith("/index.html"):
        return rel[: -len("index.html")]
    if rel.endswith(".html"):
        return rel[:-5]
    return rel


_INTERNAL = r'(href="(?!https?:|//|mailto:|tel:|#)[^"#?]*?)'
_INTERNAL_INDEX = re.compile(_INTERNAL + r'index\.html(?=["#?])')
_INTERNAL_HTML = re.compile(_INTERNAL + r'\.html(?=["#?])')


def clean_links(html: str) -> str:
    """Drop the .html from internal hrefs so links land on the canonical URL directly
    instead of taking a 308 through Vercel's cleanUrls redirect. index.html collapses to
    its directory -- "index" on its own is not a real URL."""
    html = _INTERNAL_INDEX.sub(lambda m: m.group(1) + ("./" if m.group(1) == 'href="' else ""), html)
    return _INTERNAL_HTML.sub(r"\1", html)


def render(meta: dict, content: str, nav_cache: dict) -> str:
    if "{{APPS_NAV}}" in content:
        content = content.replace("{{APPS_NAV}}", apps_nav_html()).replace("{{APPS_CATS}}", apps_cats_html())
    if "{{MARQUEE}}" in content:
        content = content.replace("{{MARQUEE}}", marquee_html())
    if "{{PILLARS}}" in content:
        content = content.replace("{{PILLARS}}", pillars_html())

    out_rel = meta["out"]
    depth = out_rel.count("/")
    root = "../" * depth
    active = meta.get("nav", "")
    if active not in nav_cache:
        nav_cache[active] = nav_html(active)

    canonical = S.SITE_URL + clean_url(out_rel)
    if out_rel not in INDEX_SKIP:
        INDEX.append({"u": clean_url(out_rel), "t": meta["title"], "d": meta.get("desc", "").strip()})
    # Google shows ~60 characters. The page's own keywords come first; the brand suffix is
    # added only when it still fits (Google usually shows the site name separately anyway).
    base_title = meta["title"]
    title = base_title if base_title.endswith("TechNext") or len(base_title) + 11 > 60 else base_title + " · TechNext"
    scripts = "".join(f'<script src="{{ROOT}}{s}?v={ASSET_V}" defer></script>' for s in meta.get("scripts", []))

    letters, lw, lh = letters_html()
    html = (LAYOUT.replace("{NAV}", nav_cache[active]).replace("{MNAV}", mobile_nav_html()).replace("{TALK}", talk_panel_html())
                  .replace("{LETTERS}", letters).replace("{LETTERS_W}", str(lw)).replace("{LETTERS_H}", str(lh)))
    html = (html.replace("{TITLE}", title)
                .replace("{DESC}", meta.get("desc", S.DEFAULT_DESC).replace('"', "&quot;"))
                .replace("{CANONICAL}", canonical)
                .replace("{SITE_URL}", S.SITE_URL)
                .replace("{ASSET_V}", ASSET_V)
                .replace("{BODY_CLASS}", meta.get("body", ""))
                .replace("{HEAD_EXTRA}", meta.get("head", ""))
                .replace("{TAGS_HEAD}", tags_head(out_rel == "index.html"))
                .replace("{TAGS_BODY}", tags_body(out_rel == "index.html"))
                .replace("{JSONLD}", jsonld(canonical, meta, content, out_rel))
                .replace("{CONTENT}", content)
                .replace("{LEGAL}", S.COMPANY["legal"])
                .replace("{WA_MSG}", S.COMPANY["whatsapp_msg_link"])
                .replace("{SCRIPTS}", scripts)
                .replace("{{YEAR}}", YEAR).replace("{YEAR}", YEAR))
    html = odoo_icons(html)            # emits {{ROOT}}-prefixed <img> tags
    html = html.replace("{{ROOT}}", root).replace("{ROOT}", root)
    html = icons(html)
    html = clean_links(html)

    target = ROOT / out_rel
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding="utf-8", newline="\n")
    return out_rel


_GIT_DATES = {}


def git_date(paths) -> str:
    """Date of the last commit touching a page's source; today if it is new/uncommitted."""
    key = tuple(paths)
    if key not in _GIT_DATES:
        try:
            out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", *paths], cwd=ROOT,
                                 capture_output=True, text=True, timeout=20).stdout.strip()
        except Exception:
            out = ""
        _GIT_DATES[key] = out or date.today().isoformat()
    return _GIT_DATES[key]


def page_source(out_rel: str):
    if out_rel.startswith("odoo/apps/"):
        return ["_src/apps_content.json"]
    return ["_src/pages/" + out_rel]


def write_sitemap(pages):
    urls = []
    for p in sorted(pages):
        if p in ("404.html", "case-studies.html"):
            continue
        loc = S.SITE_URL + clean_url(p)
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{git_date(page_source(p))}</lastmod></url>")
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n</urlset>\n", encoding="utf-8")


LLMS_GROUPS = [
    ("Odoo ERP services", lambda u: u.startswith(("solutions/odoo-erp", "solutions/enterprise"))
                                    or (u.startswith("odoo/") and not u.startswith("odoo/apps"))),
    ("AI solutions", lambda u: u.startswith("solutions/ai")),
    ("Websites and marketing", lambda u: u in ("solutions/marketing", "solutions/website",
                                                "solutions/social-media", "solutions/brand-assets")),
    ("Odoo by industry", lambda u: u.startswith("industries/")),
    ("Odoo apps we implement", lambda u: u.startswith("odoo/apps")),
    ("Company", lambda u: u in ("", "company", "quotation")),
]


def write_llms():
    """llms.txt (llmstxt.org): a plain-text map of the site for AI assistants and agents.
    Built from the same page index as the chat assistant, so it never goes stale."""
    c = S.COMPANY
    strip = lambda t: re.sub(r"\s*[|·]\s*TechNext$", "", t).strip()
    lines = [
        "# TechNext", "",
        "> TechNext Pte. Ltd. is a Singapore-based Odoo Ready Partner. We implement Odoo ERP end to end "
        "(accounting, sales, inventory, POS, HR and more), build enterprise AI (RAG knowledge assistants, "
        "AI inside Odoo, workflow automation agents, chatbots) and run websites and social media for growing companies.",
        "",
        f"- Registered name: {c['legal']} (UEN {c['uen']})",
        f"- Address: {', '.join(c['address'])}",
        f"- Contact: {c['sales_email']} · WhatsApp {c['whatsapp']}",
        "- Clients in 10+ countries; 11+ enterprise clients; 4 core AI disciplines",
        f"- Written quotation: {S.SITE_URL}quotation",
    ]
    entries = sorted(INDEX, key=lambda e: e["u"])
    used = set()
    for title, test in LLMS_GROUPS:
        group = [e for e in entries if e["u"] not in used and test(e["u"])]
        if not group:
            continue
        lines += ["", f"## {title}", ""]
        for e in group:
            used.add(e["u"])
            lines.append(f"- [{strip(e['t'])}]({S.SITE_URL}{e['u']}): {e['d']}")
    lines += ["", "## Optional", "",
              f"- [Privacy Policy]({S.SITE_URL}privacy): how personal data and cookies are handled",
              f"- [Terms of Service]({S.SITE_URL}terms): website terms and how engagements are agreed", ""]
    (ROOT / "llms.txt").write_text("\n".join(lines), encoding="utf-8", newline="\n")
    return len(used)


def write_chat_index():
    """Search index for the chat assistant: one entry per built page (url, title, description)."""
    out = ROOT / "assets" / "data" / "chat-index.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(sorted(INDEX, key=lambda e: e["u"]), ensure_ascii=False, separators=(",", ":")),
                   encoding="utf-8", newline="\n")


def main():
    nav_cache = {}
    built = []
    INDEX.clear()
    for path in sorted(PAGES.rglob("*.html")):
        built.append(build_page(path, nav_cache))
    for mod in APP_BY_MOD:
        meta, content = app_page(mod)
        built.append(render(meta, content, nav_cache))
    write_sitemap(built)
    write_chat_index()
    print(f"llms.txt: {write_llms()} pages")
    # security headers: hashes every inline script of the pages just built
    from make_vercel import write_vercel
    print(f"vercel.json: {write_vercel()} inline script hashes")
    print(f"built {len(built)} pages -> {ROOT}")
    for b in built:
        print("  ", b)


if __name__ == "__main__":
    main()
