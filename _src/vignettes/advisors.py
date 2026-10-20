# -*- coding: utf-8 -*-
"""Advisers (/advisers): a Company page, not an industry. Only META (the entry intro; the calm layer leaves it out, but
build.py still reads it for any page whose body class is "ixw ixw--<key>"). The page is the advisory room: a client and
an adviser at the round table, the process map on the whiteboard, the six practice cards on the pinboard, the written
recommendation folder and the laptop with Odoo."""
META = {
    "page": "advisors.html",
    "tag": "Advisers · advice first, software second",
    "badge": "co-team",
    "intro_title": "The <b>advisory</b> room",
    "intro_sub": "Listen · advise · implement · stay",
    "intro_pills": [("chat", "Listen"), ("target", "Advise"), ("check", "Implement")],
    "m": {},
}
