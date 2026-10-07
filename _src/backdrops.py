# -*- coding: utf-8 -*-
"""Clean illustrated backdrops for the homepage industries slide: one SVG per industry, drawn here (no people, no
screenshots), in the world's palette. 1600 x 900, the wall above y 640, the floor below; the left half stays calm behind
the title card, the right half frames Nexi (the page stands Nexi and the workflow steps in front, at the right). build.py
calls write() and the files land in assets/img/industries/<key>/backdrop.svg."""
import math
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
W, H, FL = 1600, 900, 640


# ---------------------------------------------------------------- primitives
def r(x, y, w, h, f, rx=0, o=None, extra=""):
    op = f' opacity="{o}"' if o is not None else ""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{f}"{op}{extra}/>'


def c(x, y, rad, f, o=None):
    op = f' opacity="{o}"' if o is not None else ""
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.1f}" fill="{f}"{op}/>'


def e(x, y, rx, ry, f, o=None, rot=0):
    op = f' opacity="{o}"' if o is not None else ""
    tr = f' transform="rotate({rot} {x:.1f} {y:.1f})"' if rot else ""
    return f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{f}"{op}{tr}/>'


def p(d, f="none", s=None, sw=0, o=None, cap="round"):
    st = f' stroke="{s}" stroke-width="{sw}" stroke-linecap="{cap}" stroke-linejoin="round"' if s else ""
    op = f' opacity="{o}"' if o is not None else ""
    return f'<path d="{d}" fill="{f}"{st}{op}/>'


def g(body, tr="", o=None):
    op = f' opacity="{o}"' if o is not None else ""
    t = f' transform="{tr}"' if tr else ""
    return f'<g{t}{op}>{body}</g>'


def shadow(x, y, w, o=.16):
    return e(x, y, w, w * .12, "#1A2236", o)


# ---------------------------------------------------------------- shared props
def plant(x, y, s=1, pot="#E9A07F", leaf=("#5FA77B", "#4C9068")):
    # leaves fan out from the soil: each is drawn upright above the pot and turned about its base
    leaves = "".join(f'<ellipse cx="0" cy="-104" rx="14" ry="46" fill="{leaf[i % 2]}" transform="rotate({a} 0 -58)"/>'
                     for i, a in enumerate((-62, 62, -40, 40, -18, 18, 0)))
    body = (shadow(0, 4, 60) + g(leaves, "translate(0,-6)") +
            p("M-34 -58 H34 L26 0 H-26 Z", pot) + r(-38, -66, 76, 14, pot, 6) + r(-38, -66, 76, 5, "#FFFFFF", 3, .25))
    return g(body, f"translate({x},{y}) scale({s})")


_gid = [0]


def glow(x, y, rx, ry, col="#FFE7B0", o=.55):
    """A soft pool of light: a radial gradient that fades to nothing (flat ovals looked muddy on dark walls)."""
    _gid[0] += 1; i = _gid[0]
    return (f'<defs><radialGradient id="gl{i}"><stop offset="0" stop-color="{col}" stop-opacity="{o}"/>'
            f'<stop offset="1" stop-color="{col}" stop-opacity="0"/></radialGradient></defs>' + e(x, y, rx, ry, f"url(#gl{i})"))


def lamp(x, y, col="#2B3A33", shade="#E9B949", light="#FFE7B0", top=0):
    return (glow(x, y + 110, 170, 150, light, .42) + p(f"M{x} {top} V{y - 34}", s=col, sw=2.4) +
            p(f"M{x - 34} {y} Q{x - 30} {y - 38} {x} {y - 38} Q{x + 30} {y - 38} {x + 34} {y} Z", shade) + e(x, y + 2, 12, 6, light))


def cloud(x, y, s=1, f="#FFFFFF", o=.95):
    return g(c(0, 0, 30, f) + c(34, -12, 38, f) + c(72, 0, 30, f) + r(-30, 0, 132, 28, f, 14), f"translate({x},{y}) scale({s})", o)


def jar(x, y, w, h, body, lid):
    return r(x, y - h, w, h, body, 6) + r(x + w * .2, y - h - 7, w * .6, 9, lid, 3) + r(x + 4, y - h + 6, 4, h - 14, "#FFFFFF", 2, .35)


def box(x, y, w, h, f="#C99A6B", tape="#E7C79A", d="#A87A4C"):
    return (r(x, y - h, w, h, f, 3) + r(x, y - h, w, h * .18, d, 3, .5) + r(x + w / 2 - 6, y - h, 12, h, tape, 1, .9) +
            r(x + 8, y - h * .5, w * .32, h * .22, "#FFFFFF", 2, .9))


def window(x, y, w, h, sky=("#BFE3F7", "#EAF6FD"), frame="#FFFFFF", bars=2, uid="w"):
    gid = f"sky{uid}"
    s = (f'<defs><linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{sky[0]}"/><stop offset="1" stop-color="{sky[1]}"/></linearGradient></defs>' +
         r(x - 12, y - 12, w + 24, h + 24, frame, 10) + r(x, y, w, h, f"url(#{gid})", 4) + cloud(x + w * .2, y + h * .28, .55) + cloud(x + w * .62, y + h * .5, .4, o=.8))
    for i in range(1, bars):
        s += r(x + w * i / bars - 4, y, 8, h, frame)
    s += r(x, y + h * .55, w, 8, frame) + r(x - 20, y + h + 8, w + 40, 14, frame, 6)
    return s


def floor(y, top, bottom, line, kind="tiles", step=120):
    s = (f'<defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient></defs>' +
         r(0, y, W, H - y, "url(#fl)"))
    if kind == "tiles":
        for i in range(1, 6):
            yy = y + (H - y) * (i / 6) ** 1.5
            s += p(f"M0 {yy:.1f} H{W}", s=line, sw=1.4)
        for xx in range(-800, W + 800, step):
            s += p(f"M{W / 2 + (xx - W / 2) * .62:.1f} {y} L{xx:.1f} {H}", s=line, sw=1.4)
    elif kind == "planks":
        for i in range(1, 7):
            yy = y + (H - y) * (i / 7) ** 1.35
            s += p(f"M0 {yy:.1f} H{W}", s=line, sw=1.6)
            off = (i * 137) % 260
            for xx in range(-off, W, 260):
                s += p(f"M{xx} {yy:.1f} v{(H - y) / 7 * .9:.1f}", s=line, sw=1.2)
    return s + r(0, y, W, 10, "#000000", 0, .06)


def wall(top, bottom, uid="wall"):
    return (f'<defs><linearGradient id="{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient></defs>' +
            r(0, 0, W, FL, f"url(#{uid})"))


def wrap(body, bg):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMax slice">'
            f'{r(0, 0, W, H, bg)}{body}</svg>')


# ---------------------------------------------------------------- the eight backdrops
def medical():
    ink, teal, mint = "#0F4C45", "#21B799", "#E3F6F1"
    s = wall("#F3FBF9", "#E4F4EF")
    s += "".join(p(f"M{x} {y - 9} v18 M{x - 9} {y} h18", s="#21B799", sw=2.4, o=.12) for x in range(40, W, 90) for y in range(60, 520, 90))
    s += r(0, 520, W, 120, "#D6EEE7") + r(0, 512, W, 10, "#FFFFFF")                       # wainscot and rail
    s += "".join(glow(x, 110, 200, 120, "#FFFFFF", .7) + r(x - 70, 22, 140, 16, "#FFFFFF", 6) for x in (250, 700, 1150, 1500))
    s += window(1060, 150, 360, 250, uid="m")                                            # the clinic window
    s += r(860, 120, 120, 120, "#FFFFFF", 24) + r(908, 140, 24, 80, teal, 6) + r(880, 168, 80, 24, teal, 6)   # cross lightbox
    s += p("M820 300 h70 l14 -34 l18 66 l14 -32 h120", s=teal, sw=4, o=.55)              # heartbeat line
    sx = 1460                                                                            # medicine cabinet
    s += shadow(sx + 70, FL + 2, 90) + r(sx, 330, 140, 310, "#FFFFFF", 10) + r(sx + 8, 338, 124, 294, mint, 6)
    for row, yy in enumerate((420, 500, 580)):
        s += r(sx + 8, yy, 124, 6, "#BFE3D9")
        s += "".join(jar(sx + 16 + i * 30, yy, 22, 34 + (i + row) % 2 * 10, ("#FFFFFF", "#FFD9E0", "#CDE9FB", "#FFF1C2")[(i + row) % 4], teal) for i in range(4))
    s += r(140, 420, 210, 120, "#FFFFFF", 12) + r(156, 440, 90, 10, teal, 5) + r(156, 462, 170, 8, "#CFE5DF", 4) + r(156, 480, 140, 8, "#CFE5DF", 4) + r(156, 498, 160, 8, "#CFE5DF", 4)   # notice board
    s += floor(FL, "#F2F7FA", "#E1EBF2", "#FFFFFF")
    s += plant(1010, 760, 1.25, "#F59A8B") + plant(90, 800, 1.1, "#7CC8FF", ("#4FB28A", "#3E9A76"))
    return wrap(s, "#F3FBF9")


def travel():
    ink, yel, sea = "#17284A", "#FFC94A", "#3167CA"
    s = ('<defs><linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FD3F5"/><stop offset=".75" stop-color="#E8F5FD"/></linearGradient></defs>' +
         r(0, 0, W, FL, "url(#tsky)"))
    s += cloud(240, 150, 1.2) + cloud(760, 90, .9, o=.85) + cloud(1260, 170, 1.1)
    s += g(p("M0 0 L120 -10 L150 -40 L168 -40 L160 -8 L230 -14 L238 0 L160 10 L168 42 L150 42 L120 10 Z", "#FFFFFF") + c(30, 0, 4, sea), "translate(980,250) rotate(-8)")
    s += p("M1150 254 C1060 262 980 276 860 300", s="#FFFFFF", sw=3, o=.7)
    s += r(330, 380, 26, 200, "#9CB2C9") + r(306, 360, 74, 32, "#9CB2C9", 8) + r(316, 366, 54, 14, "#E2F1FA", 4)      # control tower
    s += "".join(r(x, 470 - hh, 70, hh + 120, "#C9DCEC") for x, hh in ((40, 80), (120, 40), (420, 60), (520, 100), (620, 50)))
    s += "".join(r(x, 0, 14, FL, "#FFFFFF", 0, .85) for x in range(0, W + 1, 320))      # the glass wall's mullions
    s += r(0, 0, W, 34, "#FFFFFF") + r(0, 560, W, 80, "#E9EEF6") + r(0, 556, W, 8, "#FFFFFF")
    s += r(1030, 330, 380, 190, ink, 14) + r(1046, 346, 348, 30, "#24447A", 6) + r(1060, 356, 120, 10, yel, 5)      # departures board
    for i in range(4):
        y = 392 + i * 30
        s += r(1062, y, 150, 14, "#2E4C82", 4) + r(1230, y, 50, 14, "#2E4C82", 4) + r(1298, y, 80, 14, ("#5FD39A", yel, "#5FD39A", "#FF8A65")[i], 4)
    s += r(1206, 300, 4, 30, "#9AA6BC") + r(1236, 300, 4, 30, "#9AA6BC")
    s += floor(FL, "#F4F7FC", "#E3EAF5", "#FFFFFF")
    for i, (x, col, hh) in enumerate(((990, "#FF8A65", 120), (1050, "#21B799", 90), (150, "#7B5BD6", 110))):       # suitcases
        s += shadow(x + 26, 800, 40) + r(x, 800 - hh, 56, hh, col, 10) + r(x + 18, 800 - hh - 22, 20, 26, "none", 6, extra=f' stroke="{ink}" stroke-width="5"') + r(x + 6, 800 - hh + 12, 44, 6, "#FFFFFF", 3, .4)
    s += plant(1530, 790, 1.2, yel, ("#3FA06A", "#2F8A58"))
    return wrap(s, "#E8F5FD")


def retail():
    terra, sage, cream, ink, oak = "#D9785A", "#81B29A", "#FBF3E6", "#3D405B", "#D9B48A"
    s = wall("#FBF3E6", "#F5E7D3") + "".join(r(x, 0, 3, FL, sage, 0, .2) for x in range(30, W, 46))
    s += r(0, 540, W, 100, "#E9B39A") + r(0, 532, W, 10, "#FFFFFF")
    bunt = "".join(p(f"M{x} {60 + 18 * math.sin(x / 140)} l40 0 l-20 34 Z", (terra, sage, "#E9C46A", "#7FA8C9")[i % 4]) for i, x in enumerate(range(0, W, 46)))
    s += p("M0 60 " + " ".join(f"L{x} {60 + 18 * math.sin(x / 140):.1f}" for x in range(0, W + 40, 20)), s="#B9A58A", sw=2) + bunt
    s += lamp(700, 150, "#8A7F6E", sage, "#FFF2CF") + lamp(1180, 150, "#8A7F6E", terra, "#FFF2CF")
    sx = 1240                                                                            # oak shelving
    s += shadow(sx + 150, FL + 2, 170) + r(sx, 250, 300, 390, "#B98E62", 10) + r(sx + 10, 260, 280, 370, "#F4E4CC", 6)
    for row, yy in enumerate((360, 460, 560)):
        s += r(sx + 10, yy, 280, 10, "#B98E62")
        for i in range(5):
            x = sx + 24 + i * 52
            if row == 0: s += r(x, yy - 44, 36, 44, (terra, sage, "#E9C46A")[i % 3], 8) + r(x + 30, yy - 34, 10, 18, "none", 5, extra=f' stroke="{(terra, sage, "#E9C46A")[i % 3]}" stroke-width="4"')
            elif row == 1: s += r(x, yy - 56, 30, 56, ("#FFFFFF", "#F7D9C9", "#DDEBE2")[i % 3], 8) + r(x + 6, yy - 44, 18, 10, terra, 3, .7)
            else: s += r(x - 4, yy - 26, 46, 13, (terra, "#F7D9C9", sage)[i % 3], 4) + r(x - 2, yy - 13, 44, 13, (sage, terra, "#E9C46A")[i % 3], 4)
    s += r(860, 200, 300, 330, "#FFFFFF", 150) + r(876, 216, 268, 300, "#CFE7F2", 136) + cloud(930, 300, .6) + r(876, 420, 268, 96, "#E3D9CB")   # arched shop window
    s += r(990, 360, 6, 70, "#8A6A4A") + e(993, 350, 44, 38, "#6FAF86")
    s += floor(FL, "#E8D2B5", "#D9BE9A", "#CDAF88", "planks")
    s += plant(1100, 790, 1.2, terra) + plant(80, 810, 1.15, sage, ("#5E8F77", "#4E7D66"))
    s += shadow(240, 800, 70) + r(180, 730, 120, 70, terra, 12) + p("M196 730 Q240 670 284 730", s=terra, sw=6)       # a basket
    return wrap(s, "#FBF3E6")


def ecommerce():
    vio, mint, kraft, ink = "#6D5BD0", "#3CCFAE", "#C99A6B", "#2B2350"
    s = wall("#F4F1FB", "#E9E4F6")
    s += "".join(r(x + (row % 2) * 40, row * 40, 76, 34, "#DDD5F2", 3, .6) for row in range(16) for x in range(-40, W, 80))
    s += r(0, 560, W, 80, "#D8D0F0") + r(0, 552, W, 10, mint)
    s += "".join(glow(x, 100, 190, 110, "#FFFFFF", .75) + r(x - 70, 24, 140, 14, "#FFFFFF", 6) for x in (300, 800, 1300))
    for k, rx in enumerate((1180, 1380)):                                                # racks of parcels
        s += shadow(rx + 90, FL + 2, 110) + r(rx, 220, 10, 420, "#8A82AA") + r(rx + 170, 220, 10, 420, "#8A82AA")
        for yy in (300, 420, 540, 636):
            s += r(rx, yy, 180, 10, "#F29A4A" if k else "#8A82AA")
            if yy < 600:
                s += box(rx + 14, yy, 66, 52 + (yy % 3) * 6) + box(rx + 90, yy, 74, 60)
    s += r(860, 210, 270, 430, "#7D759E", 8) + "".join(r(872, y, 246, 12, ("#C9C3DE", "#B9B2D3")[i % 2], 2) for i, y in enumerate(range(222, 470, 14)))   # roller door, half open
    s += r(872, 470, 246, 170, "#2E2A4A") + r(866, 462, 258, 12, "#8A82AA", 3) + r(980, 466, 30, 8, "#FFD84A", 3)
    s += floor(FL, "#F2F0F8", "#E2DDF0", "#FFFFFF")
    s += r(560, 650, 480, 26, "#5C5480", 8) + r(560, 676, 480, 10, "#463E6A", 4) + "".join(c(x, 681, 6, "#2B2350") for x in range(580, 1040, 40))   # conveyor
    s += box(600, 650, 80, 60) + box(720, 650, 70, 48) + box(830, 650, 90, 70) + box(950, 650, 60, 44)
    s += plant(90, 810, 1.15, vio, ("#4FB28A", "#3E9A76"))
    return wrap(s, "#F4F1FB")


def construction():
    yel, navy, ink = "#FFC93C", "#1F3F73", "#1E2A3A"
    s = ('<defs><linearGradient id="csky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86C6F0"/><stop offset="1" stop-color="#E4F3FC"/></linearGradient></defs>' +
         r(0, 0, W, 560, "url(#csky)") + c(1380, 120, 70, "#FFF6D2", .9))
    s += cloud(180, 120, 1) + cloud(640, 80, .8, o=.85) + cloud(1060, 150, .9)
    s += "".join(r(x, 560 - hh, ww, hh, ("#B9D2E6", "#A8C4DC")[i % 2]) for i, (x, ww, hh) in enumerate(((0, 90, 160), (100, 70, 110), (180, 110, 200), (300, 80, 130), (390, 120, 170), (520, 90, 120), (620, 100, 210), (730, 80, 140))))
    fx = 1120                                                                            # the frame going up
    for lv in range(4):
        y = 560 - lv * 90
        s += r(fx, y - 8, 330, 10, "#9AA8B8") + "".join(r(fx + i * 110, y - 90, 10, 90, "#C3CDDA") for i in range(4))
    s += r(fx, 200, 330, 10, "#9AA8B8") + r(fx + 20, 380, 90, 90, "#7FB7E3", 4, .6) + r(fx + 140, 290, 90, 90, "#7FB7E3", 4, .6)
    cx = 940                                                                             # tower crane
    s += "".join(p(f"M{cx - 10} {y} L{cx + 10} {y - 30} M{cx + 10} {y} L{cx - 10} {y - 30}", s=yel, sw=3) for y in range(560, 140, -30))
    s += r(cx - 12, 120, 6, 440, yel) + r(cx + 6, 120, 6, 440, yel) + r(cx - 260, 112, 640, 12, yel) + r(cx - 260, 100, 640, 6, yel, 0, .7)
    s += p(f"M{cx} 70 L{cx - 260} 106 M{cx} 70 L{cx + 380} 106", s="#C9930A", sw=3) + r(cx - 12, 60, 24, 30, yel) + r(cx - 260, 118, 80, 40, "#8A97A8", 4)
    s += p(f"M{cx + 220} 124 V300", s="#5C6B7A", sw=2) + r(cx + 170, 300, 100, 14, "#E2553D", 3)
    s += r(0, 560, W, 80, navy) + r(0, 560, W, 8, yel) + r(0, 576, W, 6, "#FFFFFF") + "".join(r(x, 560, 3, 80, "#FFFFFF", 0, .12) for x in range(0, W, 120))   # hoarding
    s += ('<defs><linearGradient id="cfl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E7D3B6"/><stop offset="1" stop-color="#D3B892"/></linearGradient></defs>' + r(0, FL, W, H - FL, "url(#cfl)"))
    s += p("M0 760 Q600 700 1600 780", s="#C4A57B", sw=3, o=.6) + p("M0 840 Q700 790 1600 860", s="#C4A57B", sw=3, o=.5)
    s += "".join(shadow(x, 800, 26) + p(f"M{x - 22} 800 L{x - 6} 740 H{x + 6} L{x + 22} 800 Z", "#FF7A1A") + r(x - 12, 768, 24, 8, "#FFFFFF") for x in (1030, 1100))
    s += shadow(1480, 800, 110) + "".join(r(1390 + i * 6, 800 - (i + 1) * 14, 180, 14, ("#C99A6B", "#B98552")[i % 2], 2) for i in range(4))
    s += shadow(180, 810, 60) + "".join(r(130 + (i % 2) * 8, 810 - (i + 1) * 22, 90, 20, "#B4573C", 3) for i in range(4))
    return wrap(s, "#E4F3FC")


def fnb():
    green, tomato, mustard, cream, wood = "#1F4D3F", "#E2553D", "#E9B949", "#FFF6E5", "#A9744A"
    s = r(0, 0, W, 110, "#F4EBDD") + "".join(r(x, 0, 10, 110, wood, 0, .18) for x in range(0, W, 120)) + r(0, 104, W, 12, wood)
    s += p("M0 70 " + " ".join(f"L{x} {70 + 22 * abs(math.sin(x / 260 * math.pi)):.1f}" for x in range(0, W + 20, 20)), s="#5C4632", sw=2)
    s += "".join(c(x, 80 + 22 * abs(math.sin(x / 260 * math.pi)), 6, "#FFD27A") + c(x, 80 + 22 * abs(math.sin(x / 260 * math.pi)), 14, "#FFD27A", .2) for x in range(20, W, 46))
    s += r(0, 116, W, 400, green) + "".join(p(f"M0 {y} H{W}", s="#FFFFFF", sw=1.2, o=.08) for y in range(132, 516, 22))
    s += "".join(p(f"M{x + (j % 2) * 34} {132 + j * 22} v22", s="#FFFFFF", sw=1.2, o=.08) for j in range(18) for x in range(0, W, 68))
    s += r(0, 516, W, 124, wood) + r(0, 508, W, 10, "#C9A44A") + "".join(r(x, 530, 150, 90, "#93633E", 8, .5) for x in range(20, W, 170))
    s += lamp(820, 230, "#2B3A33", "#C9A44A", "#FFE7B0", 116) + lamp(1380, 230, "#2B3A33", "#C9A44A", "#FFE7B0", 116)
    s += r(1240, 170, 230, 170, "#263238", 6) + r(1232, 162, 246, 186, "none", 8, extra=f' stroke="{wood}" stroke-width="8"')   # the menu board
    s += r(1270, 196, 100, 12, "#F3EBDD", 4) + "".join(r(1270, 228 + i * 24, 120, 8, "#F3EBDD", 4, .6) + r(1420, 228 + i * 24, 24, 8, "#FFD27A", 4) for i in range(4))
    s += r(150, 210, 300, 10, wood) + r(150, 300, 300, 10, wood)                          # jar shelves
    s += "".join(jar(166 + i * 46, 210, 30, 34 + (i % 3) * 8, ("#4A7A5E", "#FFF1D6", tomato, mustard, "#8E5A2E", "#FFF1D6")[i], "#C9A44A") for i in range(6))
    s += "".join(jar(170 + i * 54, 300, 34, 40, ("#FFF1D6", tomato, mustard, "#FFF1D6", "#4A7A5E")[i], "#2B3A33") for i in range(5))
    kx = 900                                                                             # the open kitchen counter
    s += r(kx - 10, 440, 420, 16, "#C9D1DB", 4) + r(kx, 456, 400, 184, wood, 8) + r(kx + 120, 500, 160, 40, "#13332A", 8) + r(kx + 128, 508, 144, 24, "none", 6, extra=' stroke="#C9A44A" stroke-width="2"')
    s += r(kx + 40, 380, 70, 60, "#AAB4C0", 8) + r(kx + 34, 372, 82, 12, "#8A949E", 4) + "".join(c(kx + 60 + i * 14, 340 - i * 18, 10 + i * 4, "#FFFFFF", .5 - i * .12) for i in range(3))
    s += g(p("M-40 0 Q0 30 40 0 Z", "#2B2F33") + r(36, -4, 44, 6, "#2B2F33", 3), f"translate({kx + 250},432)") + p(f"M{kx + 230} 420 q20 -40 40 -10 q14 -36 30 4", "#FF8C28", o=.85)
    s += r(0, FL, W, H - FL, "#EADBC4") + "".join(r(x + (row % 2) * 40, FL + row * 52, 80, 52, "#D7C0A0" if (x // 80 + row) % 2 else "#EADBC4") for row in range(6) for x in range(-40, W, 80))
    s += r(0, FL, W, 10, "#000000", 0, .08)
    s += plant(120, 810, 1.3, "#C96F4A", ("#3F8F5E", "#2F7A4E")) + plant(1530, 800, 1.2, "#C96F4A", ("#3F8F5E", "#2F7A4E"))
    return wrap(s, "#1F4D3F")


def manufacturing():
    teal, orange, steel, ink, yel = "#2F6B7A", "#FF7A1A", "#8A97A6", "#1E2A33", "#FFC93C"
    s = wall("#E3E9EE", "#D4DCE3") + "".join(r(x, 90, 6, 460, "#000000", 0, .05) for x in range(0, W, 22))
    s += r(0, 0, W, 90, "#C9D3DA") + "".join(r(x, 16, 150, 58, "#BFE3F3", 4) + r(x + 72, 16, 6, 58, steel) for x in range(30, W, 200))   # clerestory
    s += r(0, 150, W, 18, ink) + "".join(p(f"M{x} 150 l18 0 l-18 18 h-18 Z", yel) for x in range(0, W + 40, 40))   # hazard band
    s += r(0, 560, W, 80, "#5C7080") + r(0, 552, W, 10, yel)
    s += r(0, 210, W, 16, "#8A97A6") + r(1180, 226, 30, 40, "#5C6B7A") + p("M1195 266 V360", s="#5C6B7A", sw=3) + r(1150, 360, 90, 16, "#A9B4C2", 3)   # gantry
    cx = 1200                                                                            # the robot cell
    s += r(cx - 60, 380, 300, 260, "none", 6, extra=f' stroke="{yel}" stroke-width="6"') + "".join(p(f"M{cx - 60 + i * 20} 380 V640", s=yel, sw=1.4, o=.5) for i in range(16))
    s += r(cx + 30, 600, 70, 40, ink, 6) + p(f"M{cx + 65} 600 L{cx + 50} 500 L{cx + 140} 440", s=orange, sw=22) + c(cx + 50, 500, 14, ink) + c(cx + 140, 440, 12, ink) + r(cx + 140, 430, 34, 12, steel, 3)
    s += c(cx + 160, 444, 6, "#FFF6C0") + c(cx + 160, 444, 16, "#FFE27A", .4)
    s += r(cx + 260, 420, 22, 70, "#3A4A55", 4) + c(cx + 271, 434, 8, "#3FE08A") + c(cx + 271, 454, 8, "#FFC93C") + c(cx + 271, 474, 8, "#E2453C")   # andon tower
    s += r(860, 260, 240, 140, "#FFFFFF", 10) + r(860, 260, 240, 26, teal, 10) + r(860, 276, 240, 10, teal)      # planning board
    s += "".join(r(880 + (i * 37) % 90, 300 + i * 22, 90 + (i % 3) * 20, 12, ("#3A93C0", yel, "#21B799", orange)[i % 4], 4) for i in range(4))
    s += floor(FL, "#C6D0CE", "#AEBAB8", "#FFFFFF", step=160) + p(f"M0 {FL + 40} H{W} M0 {H - 60} H{W}", s=yel, sw=6, o=.8)
    s += shadow(1500, 820, 70) + "".join(r(1440 + (i % 2) * 6, 820 - (i + 1) * 20, 120, 20, ("#A9B4C2", "#C3CDDA")[i % 2], 2) for i in range(5))
    s += shadow(160, 820, 60) + r(110, 740, 100, 80, orange, 8) + r(110, 740, 100, 16, "#E0650C", 6) + "".join(r(120 + i * 30, 770, 20, 30, "#FFFFFF", 4, .4) for i in range(3))
    return wrap(s, "#E3E9EE")


def health():
    sage, sageD, lav, blush, sand = "#8DB39A", "#5E8C6E", "#B9A6D8", "#F2B5A7", "#EAD9C2"
    s = wall("#F8F2E9", "#EFE6D8")
    s += "".join(p(f"M{x} 0 L{x + 90} 0 L{x - 230} {FL} L{x - 320} {FL} Z", "#FFFCF0", o=.35) for x in (900, 1300, 1700))
    s += r(0, 520, W, 120, "#CFE0D1") + r(0, 512, W, 10, "#FFFFFF")
    s += p("M0 120 " + " ".join(f"L{x} {120 + 26 * abs(math.sin(x / 320 * math.pi)):.1f}" for x in range(0, W + 20, 20)), s="#7FA88B", sw=2.4)
    s += "".join(e(x, 126 + 26 * abs(math.sin(x / 320 * math.pi)) + (8 if i % 2 else -6), 9, 6, ("#9CC0A6", "#86AE93")[i % 2]) for i, x in enumerate(range(6, W, 16)))
    wx, wy, ww, wh = 1100, 170, 300, 400                                                 # the arched garden window
    s += ('<defs><linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFEBF7"/><stop offset="1" stop-color="#F4FAF6"/></linearGradient>'
          f'<clipPath id="harch"><path d="M{wx} {wy + wh} V{wy + ww / 2} A{ww / 2} {ww / 2} 0 0 1 {wx + ww} {wy + ww / 2} V{wy + wh} Z"/></clipPath></defs>')
    s += p(f"M{wx - 14} {wy + wh + 14} V{wy + ww / 2} A{ww / 2 + 14} {ww / 2 + 14} 0 0 1 {wx + ww + 14} {wy + ww / 2} V{wy + wh + 14} Z", "#FFFFFF")
    s += ('<g clip-path="url(#harch)">' + r(wx, wy, ww, wh, "url(#hsky)") + cloud(wx + 60, wy + 110, .5) +
          "".join(e(wx + 20 + i * 52, wy + wh - 50 - (i % 2) * 30, 50, 60, ("#9CC9A6", "#86BB93")[i % 2]) for i in range(6)) + r(wx, wy + wh - 40, ww, 40, "#7FAF8A") + '</g>')
    s += r(wx + ww / 2 - 4, wy, 8, wh, "#FFFFFF") + r(wx, wy + 210, ww, 8, "#FFFFFF") + r(wx - 24, wy + wh + 8, ww + 48, 16, "#FFFFFF", 6)
    for x, col in ((780, blush), (940, sand)):                                            # hanging planters
        s += p(f"M{x} 0 V180", s="#A57B52", sw=1.6) + r(x - 26, 180, 52, 36, col, 14) + "".join(e(x - 20 + i * 10, 230 + (i % 3) * 18, 6, 14, ("#7FAF8A", "#6A9C77")[i % 2], rot=(i - 2) * 12) for i in range(5))
    sx = 860                                                                             # shelf of oils and candles
    s += r(sx, 380, 180, 10, "#C79E74") + r(sx, 460, 180, 10, "#C79E74")
    s += "".join(jar(sx + 10 + i * 34, 380, 22, 32 + (i % 2) * 10, (lav, sage, blush)[i % 3], "#A57B52") for i in range(5))
    s += "".join(r(sx + 10 + i * 42, 430, 30, 30, "#FFFFFF", 8, .9) + r(sx + 14 + i * 42, 442, 22, 16, (blush, sand, lav, sage)[i], 5) for i in range(4))
    s += floor(FL, "#EEDDC6", "#DCC6A8", "#CDB290", "planks")
    s += "".join(r(1080 + i * 10, 760 - i * 4, 300, 16, (lav, sage, blush)[i], 8, .95) for i in range(3))   # mats on the floor
    s += shadow(240, 812, 60) + r(190, 752, 100, 60, "#C79E74", 12) + "".join(r(204 + i * 26, 700, 22, 70, (lav, sage, blush)[i], 11) for i in range(3))   # mat basket
    s += plant(80, 810, 1.25, blush, ("#7FAF8A", "#6A9C77")) + plant(1530, 800, 1.15, sand, ("#7FAF8A", "#6A9C77"))
    return wrap(s, "#F8F2E9")


DRAW = {"medical": medical, "travel": travel, "retail": retail, "ecommerce": ecommerce, "construction": construction,
        "fnb": fnb, "manufacturing": manufacturing, "health-wellness": health}


def write():
    n = 0
    for k, fn in DRAW.items():
        out = ROOT / "assets/img/industries" / k / "backdrop.svg"
        svg = fn()
        if not out.exists() or out.read_text(encoding="utf-8") != svg:
            out.write_text(svg, encoding="utf-8"); n += 1
    return n


if __name__ == "__main__":
    print(write(), "written")
