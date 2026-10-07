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
