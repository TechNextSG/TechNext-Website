# -*- coding: utf-8 -*-
"""TechNext team cards on /employee-hub (a staff page: noindex, not in the sitemap).

One entry per employee, in display order. `photo` is a file name in assets/img/team/ (square, ideally
600x600 WebP); without one the card shows the person's initials in the TechNext profile ring.
Only put work contact details here (the page is reachable from the Company menu).
Source so far: the Business & ID card generator presets (technext-branding-miscellaneous).
People with a full profile page (_src/advisors.py ADVISORS) are listed first on the directory and are not repeated here.
"""

TEAM = [
    {"name": "Pia Cachola", "role": "General Manager", "email": "admin@technext.asia", "photo": None},
]
