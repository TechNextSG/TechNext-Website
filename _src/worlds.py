# -*- coding: utf-8 -*-
"""Industry "worlds": industry pages dressed as Nexi Explains episodes (build.py renders a page as a world when its industry
key has a module in _src/vignettes/). Every world is self-contained, so worlds can be built side by side:

  _src/vignettes/<key>.py              SCENES (six animated SVG vignettes, in industries.IND[key]["flow"] order),
                                       CHIPS (six (odoo_icon, sample record) pairs; HTML allowed, e.g. <span data-v> fields)
                                       and META: tag (the sample business, shown on the scenes), samples + pick (an optional
                                       sample picker for the workflow) and m (short phone copy: intro, flow)
  assets/js/worlds/<key>.js            the hero room, props and cast (registers IXW.worlds[<key>] with the engine's kit)
  assets/css/worlds/<key>.css          the world's palette and its own section designs
  assets/img/industries/<key>/         Nexi's nine poses in the world's costume + poses.json (qa/ind-medical/export_web.py)
  _src/pages/industries/<key>.html     the hero markup (hotspots, cast, toys, caption copy) and the page's own sections

The engine (assets/js/industry-world.js + assets/css/industry-world.css) is shared by every world.
"""
import importlib
import json
import pathlib

_ROOT = pathlib.Path(__file__).resolve().parent.parent
_POSES = {}


def poses(world: str) -> dict:
    """Pose anchors at the exported size (w, h and the body anchor ax, ay), so every pose pins to the same point."""
    if world not in _POSES:
        _POSES[world] = json.loads((_ROOT / "assets/img/industries" / world / "poses.json").read_text(encoding="utf-8"))
    return _POSES[world]


def pose_img(world: str, pose: str, on: bool = False, prio: str = "low") -> str:
    p = poses(world)[pose]
    return (f'<img class="ixw-pose{" is-on" if on else ""}" data-pose="{pose}" src="{{{{ROOT}}}}assets/img/industries/{world}/nexi-{pose}.webp" '
            f'alt="" width="{p["w"]}" height="{p["h"]}" decoding="async" fetchpriority="{prio}" style="--w:{p["w"]};--h:{p["h"]};--ax:{p["ax"]};--ay:{p["ay"]}">')


def nexi_stack(world: str, first: str = "hello") -> str:
    """Every pose stacked on one anchor; the script shows one at a time."""
    return "".join(pose_img(world, k, k == first, "high" if k == first else "low") for k in poses(world))


def avatar(world: str) -> str:
    p = poses(world)["hello"]
    return (f'<img src="{{{{ROOT}}}}assets/img/industries/{world}/nexi-hello.webp" alt="" width="{p["w"]}" height="{p["h"]}" decoding="async" '
            'fetchpriority="low">')


def module(key: str):
    return importlib.import_module("vignettes." + key.replace("-", "_"))


def scenes(key: str):
    m = module(key)
    return m.SCENES, m.CHIPS


def _discover() -> dict:
    out = {}
    for f in sorted((_ROOT / "_src/vignettes").glob("*.py")):
        if f.stem.startswith("_"):
            continue
        key = f.stem.replace("_", "-")
        meta = getattr(module(key), "META", {})
        out[key] = {"img": key, "tag": meta.get("tag", "Sample"), "note": meta.get("note"), "samples": meta.get("samples"), "pick": meta.get("pick"),
                    "m": meta.get("m", {})}
    return out


WORLDS = _discover()


# ---------------------------------------------------------------- the entry intro
# A short (3 s) intro in the world's own colours, in the spirit of the home page's: the industry badge pops, Nexi
# in costume peeks out from behind it, the title lands, three workflow steps burst out, then an iris opens onto the hero.
# The head gate shows it on entry (fresh load, link, refresh), never on back/forward, for bots or with reduced motion;
# ?intro=1 forces it, ?nointro=1 skips it. industry-world.js runs the timeline.
INTRO_HEAD = ("<style>#ixw-intro{display:none}html.ixw-intro #ixw-intro,#ixw-intro.is-out{display:grid}</style>\n"
              "<script>(function(){try{var q=location.search,force=/[?&]intro=1(&|$)/.test(q);"
              "var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};"
              "var bot=/bot\\/|bot;|crawler|spider|lighthouse|pagespeed|headlesschrome|google-inspectiontool|googleother|bingbot|googlebot/i.test(navigator.userAgent||'');"
              "if(force||(nav.type!=='back_forward'&&!bot&&!/[?&]nointro=1/.test(q)&&!matchMedia('(prefers-reduced-motion: reduce)').matches)){document.documentElement.classList.add('ixw-intro');}}catch(e){}})();</script>\n")


def intro_html(world: str) -> str:
    """The entry intro in the page's own style: the world's real scene behind, its own title card (the same .ixw-copy skin
    as the hero) with the Nexi Explains tag, the hand label, the industry and three workflow steps in the page's button
    style; the badge pops above the card with Nexi peeking out, and the iris opens from it onto the hero."""
    import re as _re
    from industries import IND
    ind, meta = IND[world], module(world).META
    page = (_ROOT / "_src/pages/industries" / f"{world}.html").read_text(encoding="utf-8")
    m_ep = _re.search(r'<p class="ixw-ep">.*?</a><span>(.*?)</span></p>', page, _re.S)
    m_hd = _re.search(r'<span class="hand h1-hand">(.*?)</span>', page)
    steps = [f for f in ind["flow"] if f.get("app")][:3]
    pills = "".join(f'<span class="ixwi-pill" style="--i:{i};--side:{i - 1}">{{{{odoo:{f["app"]}:18}}}}{f["t"]}</span>' for i, f in enumerate(steps))
    sparks = "".join(f'<i class="ixwi-spark" style="--a:{a}deg;--d:{d}"></i>' for a, d in ((10, 1.2), (62, 1.6), (118, 1.3), (170, 1.7), (222, 1.25), (276, 1.55), (322, 1.35)))
    nexi = poses(world)["hello"]
    return (f'<div class="ixwi" id="ixw-intro" aria-hidden="true">\n'
            f'  <div class="ixwi-bg"><img src="{{{{ROOT}}}}assets/img/industries/pano/{world}.webp" alt="" width="1560" height="555" decoding="async" fetchpriority="high"></div>\n'
            f'  <span class="ixwi-rays"></span>\n'
            f'  <span class="ixwi-ring"></span>\n'
            f'  <div class="ixwi-lock">\n'
            f'    <div class="ixw-copy ixwi-card">\n'
            f'      <span class="ixwi-mark"><span class="ixwi-ripple"></span><span class="ixwi-ripple"></span>{sparks}'
            f'<img class="ixwi-nexi" src="{{{{ROOT}}}}assets/img/industries/{world}/nexi-hello.webp" alt="" width="{nexi["w"]}" height="{nexi["h"]}" decoding="sync" fetchpriority="high">'
            f'<span class="ixwi-badge">{{{{icon:ind-{world}}}}}</span></span>\n'
            f'      <p class="ixw-ep ixwi-ep"><span class="ixw-ep-tag">{{{{icon:play}}}}Nexi Explains</span><span>{m_ep.group(1) if m_ep else ""}</span></p>\n'
            f'      <span class="hand h1-hand ixwi-hand">{m_hd.group(1) if m_hd else ""}</span>\n'
            f'      <span class="ixwi-title">Odoo for <b>{ind["name"]}</b></span>\n'
            f'      <span class="ixwi-sub">{meta["tag"]}</span>\n'
            f'      <span class="ixwi-pills">{pills}</span>\n'
            f'    </div>\n'
            f'  </div>\n'
            f'  <span class="ixwi-bar"></span>\n'
            f'  <button class="ixwi-skip" type="button" tabindex="-1">Skip</button>\n'
            f'</div>\n')


# ---------------------------------------------------------------- the homepage showcase (slide 3 of the hero)
# Every world on one "screen": the real scene (a panorama captured from the world page, assets/img/industries/pano/),
# Nexi in that world's costume, the sample business and three workflow steps, with a channel strip of the eight badges.
# assets/js/hero-industries.js runs it (auto-cycle, hover/tap/swipe/keys); assets/css/hero.css styles it (.inds).
SHOW_ORDER = ["medical", "travel", "retail", "ecommerce", "construction", "fnb", "manufacturing", "health-wellness"]
SHOW_SKIN = {  # accent, ink, light
    "medical": ("#21B799", "#0F4C45", "#E3F6F1"), "travel": ("#FFC94A", "#17284A", "#FFF6DC"), "retail": ("#D9785A", "#3D405B", "#FBEBE3"),
    "ecommerce": ("#6D5BD0", "#2B2350", "#ECE8FA"), "construction": ("#FFC93C", "#1E2A3A", "#FFF4D4"), "fnb": ("#E2553D", "#13332A", "#FCE6E1"),
    "manufacturing": ("#FF7A1A", "#1E2A33", "#FFEBDD"), "health-wellness": ("#8C76B8", "#3B3651", "#EFEAF7"),
}


def _pitch(world: str) -> str:
    import re as _re
    s = (_ROOT / "_src/pages/industries" / f"{world}.html").read_text(encoding="utf-8")
    m = _re.search(r'<h1 id="ixw-h1">.*?</span>(.*?)</h1>', s, _re.S)
    return m.group(1).strip() if m else ""


def showcase_html() -> str:
    from industries import IND
    chans, screens = [], []
    for i, k in enumerate(SHOW_ORDER):
        ind, meta, (ac, ink, lt) = IND[k], module(k).META, SHOW_SKIN[k]
        steps = [f for f in ind["flow"] if f.get("app")][:3]
        pills = "".join(f'<span class="hxi-pill" style="--j:{j}">{{{{odoo:{f["app"]}:16}}}}{f["t"]}</span>' for j, f in enumerate(steps))
        p = poses(k)["present"]
        on = " is-on" if i == 0 else ""
        screens.append(
            f'<a class="hxi-scr{on}" href="{{{{ROOT}}}}industries/{k}.html" data-k="{k}" style="--ac:{ac};--ink:{ink};--lt:{lt}" tabindex="-1" aria-hidden="{"false" if i == 0 else "true"}">'
            f'<span class="hxi-pano"><img alt="" width="1560" height="555" decoding="async" data-src="{{{{ROOT}}}}assets/img/industries/pano/{k}.webp"></span>'
            f'<span class="hxi-chip">{{{{icon:ind-{k}}}}}<span><b>Odoo for {ind["name"]}</b><small>{meta["tag"]}</small></span></span>'
            f'<span class="hxi-say"><b>{_pitch(k)}</b></span>'
            f'<span class="hxi-pills">{pills}</span>'
            f'<img class="hxi-nexi" alt="" width="{p["w"]}" height="{p["h"]}" decoding="async" data-src="{{{{ROOT}}}}assets/img/industries/{k}/nexi-present.webp">'
            f'<span class="hxi-go">Step inside {{{{icon:arrow}}}}</span></a>')
        chans.append(f'<button class="hxi-ch{on}" type="button" role="tab" data-k="{k}" aria-selected="{"true" if i == 0 else "false"}" '
                     f'aria-label="{ind["name"]}" style="--ac:{ac};--ink:{ink}">{{{{icon:ind-{k}}}}}<i></i></button>')
    return ('<div class="hxi up" style="--d:250ms" data-inds>\n'
            '  <div class="hxi-head"><b>Odoo, one world per industry</b><small>Eight sample worlds · tap one to step inside</small>'
            '<span class="hxi-count" aria-hidden="true"><b data-inds-n>1</b>/8</span></div>\n'
            '  <div class="hxi-screen" data-inds-screen>' + "".join(screens) + '<span class="hxi-wipe" aria-hidden="true"></span></div>\n'
            '  <div class="hxi-strip" role="tablist" aria-label="Industries">' + "".join(chans) + '</div>\n'
            '</div>')
