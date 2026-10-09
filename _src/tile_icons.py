# -*- coding: utf-8 -*-
"""Odoo-app-style tiles for the stroke icons (owner, 9 Oct 2026: "make sure the design is related to the Odoo
button design; apply to all pages that didn't have the Odoo logo design").

tile(name) turns a 24-unit stroke icon from sitedata.ICONS into a 32-unit app tile like the mega-menu icons:
a rounded square in an Odoo app colour, a soft lighter half for depth, and the glyph in white. build.py uses it
for feature icons only (card icons, facts rows, strips); icons inside buttons, links, bullets and FAQ chevrons
stay as stroke glyphs."""
import re

PALETTE = {  # Odoo app hues, one meaning per colour
    "plum":  ("#714B67", "#8E6585"),   # platform, data, configuration
    "teal":  ("#21B799", "#4CCBB0"),   # people, support, conversation
    "coral": ("#E46E78", "#EE8E96"),   # marketing, attention
    "blue":  ("#3167CA", "#5A88DB"),   # connectivity, devices (TechNext blue)
    "amber": ("#F29D49", "#F6B675"),   # operations, goods, field
    "green": ("#1F9D6B", "#4DB78C"),   # money, numbers, growth
    "slate": ("#4F6F95", "#7290B3"),   # documents, admin, security
    "gold":  ("#E2A21B", "#EDBC52"),   # AI, speed, highlights
}
COLOUR = {
    "layers": "plum", "grid": "plum", "layout": "plum", "database": "plum", "gear": "plum", "code": "plum",
    "host-online": "plum", "host-sh": "plum", "host-prem": "plum",
    "users": "teal", "usercheck": "teal", "chat": "teal", "bot": "teal", "heart": "teal", "graduation": "teal",
    "lifebuoy": "teal", "smile": "teal",
    "megaphone": "coral", "star": "coral", "target": "coral", "camera": "coral", "send": "coral", "palette": "coral",
    "globe": "blue", "network": "blue", "wifi": "blue", "monitor": "blue", "tablet": "blue", "cpu": "blue", "plug": "blue",
    "phone": "blue",
    "box": "amber", "truck": "amber", "cart": "amber", "bag": "amber", "utensils": "amber", "hardhat": "amber",
    "wrench": "amber", "ruler": "amber", "factory": "amber",
    "receipt": "green", "calculator": "green", "bank": "green", "bars": "green", "trend": "green", "pulse": "green",
    "file": "slate", "search": "slate", "calendar": "slate", "pin": "slate", "mail": "slate", "lock": "slate",
    "shield": "slate", "briefcase": "slate", "refresh": "slate", "clock": "slate",
    "sparkle": "gold", "zap": "gold", "check": "gold", "plane": "gold",
}


def tile(name: str, svg: str) -> str:
    base, light = PALETTE[COLOUR.get(name, "blue")]
    inner = re.sub(r"^<svg[^>]*>|</svg>$", "", svg.strip())
    inner = inner.replace("currentColor", "#FFFFFF")
    return ('<svg class="ic ic-ind ic-tile" viewBox="0 0 32 32" aria-hidden="true">'
            f'<rect width="32" height="32" rx="9" fill="{base}"/>'
            f'<path d="M0 9a9 9 0 0 1 9-9h14a9 9 0 0 1 9 9v3C22 9 10 9 0 17z" fill="{light}" opacity=".55"/>'
            '<rect y="29" width="32" height="3" rx="1.5" fill="#000" opacity=".08"/>'
            '<g transform="translate(6.4 6.4) scale(.8)" fill="none" stroke="#FFFFFF" stroke-width="2.3" '
            f'stroke-linecap="round" stroke-linejoin="round">{inner}</g></svg>')
