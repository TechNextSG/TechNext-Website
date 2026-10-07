/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Industry "world" pages, in the look of TechNext's Nexi Explains videos. This file is the ENGINE; each industry's room,
   props and cast live in assets/js/worlds/<key>.js, which registers itself in IXW.worlds[<key>] with the drawing kit below.
   1. The hero set: one canvas paints the room the way the video renderer's envkit does (wall, wainscot, floor, a window with
      a live view, light pools, motes) plus the industry's props and its two staff members in the Season 2 "F3 pill flat"
      cast model (big round head, pill body, dot eyes, no outlines), drawn live so they breathe, blink, look at Nexi, wave and
      talk. Static layers are painted ONCE per resize into two caches (behind / in front of the counter staff); a frame only
      blits them and draws what moves. The loop stops off screen and in hidden tabs; reduced motion paints one still frame.
   2. Nexi (pre-rendered poses of the real 3D model in the world's costume) gives a guided tour: she flies to each hotspot,
      points, and her caption types out what Odoo does there, with a sample Odoo record. The tour plays while the hero is on
      screen and stops for good on the visitor's first click; the Pause button holds it. "Toys" ([data-toy]) are extra
      tappable things a world animates (a globe, a paper plane).
   3. The workflow: six stations on a route, a small Nexi rides to the active one, its vignette plays and the caption types.
      A world may add a sample picker ([data-ixw-pick]) that swaps the data in every station ([data-v] text, [data-vbar]).
   All copy lives in the HTML; this file only animates it. Without JS the page reads top to bottom. */
(function () {
  'use strict';
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function hash(i) { var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function rr(g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
  function ell(g, x, y, rx, ry, rot) { g.beginPath(); g.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot || 0, 0, Math.PI * 2); }
  function fillRR(g, x, y, w, h, r, c) { rr(g, x, y, w, h, r); g.fillStyle = c; g.fill(); }
  function fillE(g, x, y, rx, ry, c) { ell(g, x, y, rx, ry); g.fillStyle = c; g.fill(); }
  function limb(g, pts, w, c) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = c; g.lineWidth = w; g.stroke(); }
  function soft(g, x, y, rx, ry, a) {
    g.save(); g.translate(x, y); g.scale(1, ry / rx); var gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, 'rgba(22,40,80,' + a + ')'); gr.addColorStop(1, 'rgba(22,40,80,0)'); g.fillStyle = gr; g.fillRect(-rx, -rx, rx * 2, rx * 2); g.restore();
  }
  function shadowed(g, blur, oy, a, fn) { g.save(); g.shadowColor = 'rgba(30,60,90,' + (a == null ? 0.16 : a) + ')'; g.shadowBlur = blur; g.shadowOffsetY = oy; fn(); g.restore(); }
  function text(g, s, x, y, size, weight, col, align) { g.fillStyle = col; g.font = (weight || 700) + ' ' + size + 'px ' + FONT; g.textAlign = align || 'left'; g.textBaseline = 'alphabetic'; g.fillText(s, x, y); g.textAlign = 'left'; }
  function onScreen(el, cb, th) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { cb(es[es.length - 1].isIntersecting); }, { threshold: th || 0.05 }).observe(el);
  }
  function tone(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
    return 'rgb(' + Math.round(lerp(r, 27, k)) + ',' + Math.round(lerp(gg, 31, k)) + ',' + Math.round(lerp(b, 59, k)) + ')';
  }
  var FONT = '"Plus Jakarta Sans", Inter, system-ui, sans-serif';

  /* ============================== the cast: Season 2 "F3 pill flat" model ==============================
     Origin = the floor between the feet; about 490 units tall at s 1 (head centre y -392, rx 92, ry 88; pill body
     y -314..-108, 172 wide; shoulders (±76, -258); arm segments 80 + 76, 36 wide).
     P: x, y, s, ph, c {skin, hair, top, top2, shirt, low, shoe, hat, hatBand, print, pocket}, outfit (scrubs | coat | blazer | tee),
        hairStyle (bun | long | pony | short), hat (sunhat), glasses, scarf, backpack, hold (clipboard | passport), feet, short,
        mood (calm | happy | wow), look (-1..1), talk, tilt, hop, hands [[lx, ly], [rx, ry]] */
  var F3 = { hy: -392, rx: 92, ry: 88, top: -314, bot: -108, tw: 172, shx: 76, shy: -258, a: 80, b: 76, aw: 36 };
  function ik(sx, sy, hx, hy, a, b, d) {
    var dx = hx - sx, dy = hy - sy, L = clamp(Math.hypot(dx, dy), Math.abs(a - b) + 1, a + b - 1), an = Math.atan2(dy, dx);
    var A = Math.acos(clamp((a * a + L * L - b * b) / (2 * a * L), -1, 1)), e = an - d * A;
    return { e: [sx + Math.cos(e) * a, sy + Math.sin(e) * a], h: [sx + Math.cos(an) * L, sy + Math.sin(an) * L] };
  }
  var INK = '#1B1F3B', MOUTH = '#8A2B3E';
  function face(g, P, t) {
    var rx = F3.rx, ry = F3.ry, cy = F3.hy, lx = P.look * 9, ey = cy + ry * 0.1, ex = rx * 0.38, er = rx * 0.1,
      blink = ((t + P.ph * 0.7) % 3.7) < 0.12, happy = P.mood === 'happy', wow = P.mood === 'wow';
    g.fillStyle = happy ? 'rgba(255,110,140,.42)' : 'rgba(255,120,140,.26)';
    [-1, 1].forEach(function (d) { ell(g, d * rx * 0.62 + lx * 0.5, cy + ry * 0.4, rx * 0.15, ry * 0.08); g.fill(); });
    g.lineCap = 'round';
    [-1, 1].forEach(function (d) {
      var x = d * ex + lx;
      if (happy) { g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.arc(x, ey + er * 0.9, er * 1.3, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); return; }
      if (blink) { g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.moveTo(x - er, ey + 2); g.lineTo(x + er, ey + 2); g.stroke(); return; }
      var k = wow ? 1.35 : 1; fillE(g, x, ey, er * k, er * 1.25 * k, INK); fillE(g, x - er * 0.35 * k, ey - er * 0.45 * k, er * 0.34 * k, er * 0.34 * k, '#FFFFFF');
    });
    g.lineWidth = 5; g.strokeStyle = tone(P.c.hair, 0.1);
    [-1, 1].forEach(function (d) { var lift = happy ? -3 : wow ? -7 : 0; g.beginPath(); g.moveTo(d * ex + lx - rx * 0.2, cy - ry * 0.22 + lift); g.lineTo(d * ex + lx + rx * 0.2, cy - ry * 0.22 + lift); g.stroke(); });
    if (P.glasses) { g.lineWidth = 4.5; g.strokeStyle = '#3B3F55'; [-1, 1].forEach(function (d) { ell(g, d * ex + lx, ey, rx * 0.22, rx * 0.2); g.stroke(); }); g.beginPath(); g.moveTo(-ex + lx + rx * 0.22, ey); g.lineTo(ex + lx - rx * 0.22, ey); g.stroke(); }
    var my = cy + ry * 0.52, mw = rx * 0.22;
    if (P.talk) { var o = 0.5 + 0.5 * Math.sin(t * 17 + P.ph); fillE(g, lx, my + 2, 13, 4 + 9 * o, MOUTH); if (o > 0.4) fillE(g, lx, my + 5 + 5 * o, 7, 3, '#FF8FA3'); }
    else if (wow) fillE(g, lx, my + 6, mw * 0.5, ry * 0.12, MOUTH);
    else if (happy) { g.beginPath(); g.moveTo(lx - mw, my - 3); g.quadraticCurveTo(lx, my + ry * 0.28, lx + mw, my - 3); g.closePath(); g.fillStyle = MOUTH; g.fill(); }
    else { g.lineWidth = 5; g.strokeStyle = INK; g.beginPath(); g.moveTo(lx - mw * 0.7, my); g.quadraticCurveTo(lx, my + ry * 0.11, lx + mw * 0.7, my); g.stroke(); }
  }
  function hair(g, P, back) {
    var rx = F3.rx, ry = F3.ry, cy = F3.hy, st = P.hairStyle;
    g.fillStyle = P.c.hair;
    if (st === 'bun' || st === 'long' || st === 'pony') {
      if (back) {
        if (st === 'long') { g.beginPath(); g.moveTo(-rx * 1.12, cy + ry * 0.62); g.lineTo(-rx * 1.14, cy - ry * 0.1); g.bezierCurveTo(-rx * 1.2, cy - ry * 1.32, rx * 1.2, cy - ry * 1.32, rx * 1.14, cy - ry * 0.1); g.lineTo(rx * 1.12, cy + ry * 0.62); g.quadraticCurveTo(rx * 1.1, cy + ry * 0.8, rx * 0.9, cy + ry * 0.78); g.lineTo(-rx * 0.9, cy + ry * 0.78); g.quadraticCurveTo(-rx * 1.1, cy + ry * 0.8, -rx * 1.12, cy + ry * 0.62); g.closePath(); g.fill(); return; }
        ell(g, 0, cy - ry * 0.08, rx * 1.1, ry * 1.06); g.fill();
        if (st === 'bun') { ell(g, 0, cy - ry * 1.12, 34, 30); g.fill(); }
        else { g.beginPath(); g.moveTo(rx * 0.7, cy - ry * 0.7); g.quadraticCurveTo(rx * 1.55, cy - ry * 0.6, rx * 1.3, cy + ry * 0.5); g.quadraticCurveTo(rx * 1.15, cy - ry * 0.1, rx * 0.8, cy - ry * 0.35); g.closePath(); g.fill(); }
        return;
      }
      g.beginPath(); g.moveTo(-rx * 1.05, cy + ry * 0.02); g.bezierCurveTo(-rx * 1.14, cy - ry * 1.26, rx * 1.14, cy - ry * 1.26, rx * 1.05, cy + ry * 0.02);
      g.quadraticCurveTo(rx * 0.62, cy - ry * 0.46, rx * 0.05, cy - ry * 0.46); g.quadraticCurveTo(-rx * 0.55, cy - ry * 0.34, -rx * 1.05, cy + ry * 0.02); g.closePath(); g.fill();
      if (P.clipCol !== null) { g.save(); g.translate(rx * 0.58, cy - ry * 0.7); g.rotate(0.35); fillRR(g, -20, -7, 40, 14, 7, P.clipCol || '#FFD84A'); g.restore(); }
      return;
    }
    if (back) return;
    g.beginPath(); g.moveTo(-rx * 1.04, cy - ry * 0.02); g.bezierCurveTo(-rx * 1.12, cy - ry * 1.25, rx * 1.12, cy - ry * 1.25, rx * 1.04, cy - ry * 0.02);
    g.quadraticCurveTo(rx * 0.9, cy - ry * 0.55, rx * 0.3, cy - ry * 0.62); g.quadraticCurveTo(-rx * 0.35, cy - ry * 0.78, -rx * 0.62, cy - ry * 0.5);
    g.quadraticCurveTo(-rx * 0.85, cy - ry * 0.3, -rx * 1.04, cy - ry * 0.02); g.closePath(); g.fill();
  }
  function hat(g, P) {
    var rx = F3.rx, ry = F3.ry, cy = F3.hy;
    if (P.hat === 'sunhat') {
      var c = P.c.hat || '#F2D59B';
      fillE(g, 0, cy - ry * 0.55, rx * 1.48, ry * 0.3, tone(c, 0.08)); fillE(g, 0, cy - ry * 0.62, rx * 1.44, ry * 0.26, c);
      g.beginPath(); g.ellipse(0, cy - ry * 0.7, rx * 0.95, ry * 0.85, 0, Math.PI, 0); g.closePath(); g.fillStyle = c; g.fill();
      g.fillStyle = P.c.hatBand || '#3167CA'; g.fillRect(-rx * 0.95, cy - ry * 0.86, rx * 1.9, ry * 0.18);
    }
  }
  function torso(g, P) {
    var c = P.c, w = F3.tw / 2, top = F3.top, bot = F3.bot, o = P.outfit || 'scrubs';
    if (P.backpack) { fillRR(g, -w - 18, top + 30, 40, 120, 14, P.backpack); fillRR(g, w - 22, top + 30, 40, 120, 14, P.backpack); }
    rr(g, -w, top, w * 2, bot - top, 68); g.fillStyle = o === 'coat' ? '#FBFCFF' : c.top; g.fill();
    g.save(); rr(g, -w, top, w * 2, bot - top, 68); g.clip();
    g.fillStyle = 'rgba(25,30,70,.07)'; g.fillRect(w * 0.3, top - 10, 200, 300);
    if (o === 'coat') {
      g.fillStyle = c.top2 || '#5B8DEF'; g.beginPath(); g.moveTo(-36, top - 4); g.lineTo(0, top + 84); g.lineTo(36, top - 4); g.closePath(); g.fill();
      g.fillStyle = '#E5EAF3'; [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(d * 36, top - 4); g.lineTo(d * 4, top + 92); g.lineTo(d * 28, top + 74); g.lineTo(d * 58, top + 20); g.closePath(); g.fill(); });
      fillRR(g, 30, -196, 40, 34, 6, '#EEF2F8'); fillRR(g, 38, -206, 5, 22, 2, '#3167CA'); fillRR(g, 48, -204, 5, 20, 2, '#E0456B');
      g.lineWidth = 7; g.strokeStyle = '#2B3A6B'; g.lineCap = 'round'; g.beginPath(); g.moveTo(-40, top + 2); g.quadraticCurveTo(-52, top + 70, -30, top + 104); g.stroke();
      g.beginPath(); g.moveTo(40, top + 2); g.quadraticCurveTo(52, top + 60, 36, top + 92); g.stroke();
      fillE(g, -30, top + 112, 13, 13, '#DDE3EC'); fillE(g, -30, top + 112, 7, 7, '#AAB4C4');
    } else if (o === 'blazer') {
      g.fillStyle = c.shirt || '#FFFFFF'; g.beginPath(); g.moveTo(-36, top - 4); g.lineTo(0, top + 90); g.lineTo(36, top - 4); g.closePath(); g.fill();
      g.fillStyle = tone(c.top, 0.18); [-1, 1].forEach(function (d) { g.beginPath(); g.moveTo(d * 36, top - 4); g.lineTo(d * 6, top + 96); g.lineTo(d * 30, top + 74); g.lineTo(d * 58, top + 18); g.closePath(); g.fill(); });
      fillE(g, -6, top + 112, 6, 6, '#E9C46A'); fillE(g, -6, top + 140, 6, 6, '#E9C46A');
      fillRR(g, 34, -206, 34, 8, 3, c.pocket || '#FFD84A');
    } else if (o === 'tee') {
      fillE(g, 0, top - 2, 34, 22, c.skin);
      if (c.print) { g.fillStyle = c.print; g.save(); g.translate(0, -214); g.rotate(-0.2); g.beginPath(); g.moveTo(-24, 6); g.lineTo(26, -14); g.lineTo(6, 22); g.lineTo(2, 6); g.closePath(); g.fill(); g.restore(); }
      if (P.backpack) { g.fillStyle = tone(P.backpack, 0.12); [-1, 1].forEach(function (d) { g.fillRect(d > 0 ? 40 : -56, top - 6, 16, 160); }); }
    } else {
      g.fillStyle = c.top2; g.beginPath(); g.moveTo(-30, top - 4); g.lineTo(0, top + 40); g.lineTo(30, top - 4); g.closePath(); g.fill();
      g.fillStyle = c.skin; g.beginPath(); g.moveTo(-22, top - 4); g.lineTo(0, top + 28); g.lineTo(22, top - 4); g.closePath(); g.fill();
      fillRR(g, -66, -214, 40, 32, 8, c.top2); fillRR(g, -58, -224, 5, 20, 2, '#FFFFFF');
    }
    g.restore();
    if (P.scarf) { /* a knotted neck scarf over the collar */
      g.fillStyle = P.scarf; g.beginPath(); g.moveTo(-40, top - 2); g.quadraticCurveTo(0, top + 26, 40, top - 2); g.lineTo(30, top - 14); g.quadraticCurveTo(0, top + 8, -30, top - 14); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(8, top + 10); g.lineTo(30, top + 52); g.lineTo(12, top + 58); g.closePath(); g.fill(); fillE(g, 6, top + 12, 11, 9, tone(P.scarf, 0.1));
    }
  }
  function held(g, kind, hp) {
    g.save(); g.translate(hp[0] + 30, hp[1] - 6);
    if (kind === 'clipboard') { g.rotate(-0.12); fillRR(g, -40, -54, 80, 104, 8, '#C98E55'); fillRR(g, -32, -44, 64, 88, 4, '#FFFFFF'); fillRR(g, -16, -60, 32, 14, 4, '#9AA6BC'); g.fillStyle = '#C9D3E3'; for (var k = 0; k < 5; k++) g.fillRect(-24, -30 + k * 14, k === 2 ? 30 : 46, 4); fillE(g, 16, 30, 7, 7, '#21B799'); }
    else if (kind === 'passport') { g.translate(-6, 4); g.rotate(-0.25); fillRR(g, -30, -40, 60, 80, 8, '#1E4691'); fillE(g, 0, -6, 15, 15, '#E9C46A'); fillE(g, 0, -6, 9, 9, '#1E4691'); fillRR(g, -16, 18, 32, 5, 2, '#E9C46A'); fillRR(g, 10, -52, 30, 40, 4, '#FFFFFF'); g.fillStyle = '#3167CA'; g.fillRect(14, -46, 22, 5); }
    g.restore();
  }
  function person(g, P, t) {
    var c = P.c, br = Math.sin(t * 2.1 + P.ph), hop = P.hop || 0, hb = Math.sin(t * 2.3 + P.ph + 0.6) * 2 + (P.talk ? Math.sin(t * 8.5) * 2.5 : 0);
    g.save(); g.translate(P.x, P.y); g.scale(P.s, P.s);
    if (P.feet) {
      soft(g, 0, 4, 120 - hop * 0.4, 18, 0.22);
      [-1, 1].forEach(function (d) { limb(g, [[d * 34, -128 - hop], [d * 34, -30 - hop * 0.4]], 42, c.low); });
      [-1, 1].forEach(function (d) { fillRR(g, d * 36 - 30 + d * 8, -28 - hop * 0.4, 60, 30, 14, c.shoe); });
    }
    g.translate(0, -hop);
    g.save(); g.translate(0, -116); g.scale(1 + 0.008 * br, 1 + 0.012 * br); g.translate(0, 116); torso(g, P); g.restore();
    g.save(); g.translate(0, F3.top + hb); g.rotate(P.tilt || 0); g.translate(0, -F3.top);
    hair(g, P, true);
    fillRR(g, -20, F3.top - 14, 40, 30, 8, tone(c.skin, 0.1));
    [-1, 1].forEach(function (d) { fillE(g, d * F3.rx * 0.96, F3.hy + F3.ry * 0.12, F3.rx * 0.15, F3.ry * 0.19, c.skin); });
    fillE(g, 0, F3.hy, F3.rx, F3.ry, c.skin);
    face(g, P, t); hair(g, P, false); hat(g, P);
    g.restore();
    var sl = P.outfit === 'coat' ? '#F1F4FA' : tone(c.top, 0.06);
    [[-1, P.hands[0]], [1, P.hands[1]]].forEach(function (a) {
      var d = a[0], h = a[1], sx = d * F3.shx, sy = F3.shy, r = ik(sx, sy, h[0], h[1], F3.a, F3.b, d), e = r.e, hp = r.h;
      if (P.short) { limb(g, [[sx, sy], e, hp], F3.aw - 6, c.skin); limb(g, [[sx, sy], [lerp(sx, e[0], 0.62), lerp(sy, e[1], 0.62)]], F3.aw + 2, sl); }
      else limb(g, [[sx, sy], e, [lerp(e[0], hp[0], 0.8), lerp(e[1], hp[1], 0.8)]], F3.aw, sl);
      if (d < 0 && P.hold) held(g, P.hold, hp);
      fillE(g, hp[0], hp[1], 19, 19, c.skin);
    });
    g.restore();
  }

  /* ============================== shared room painters (set units: 1000 x 600; walls and floors in hero px) ============================== */
  /* R: { wall:[top,bottom], wains:[top,bottom], rail, base, panelLine, floor:[top,bottom], floorKind: tiles | planks, floorLine, pattern(g, W, railY, k, sx, sy) } */
  function room(g, W, Hh, k, sx, sy, R) {
    var F = R.floorY || 470, fy = sy + F * k, ry = fy - (R.wainsH == null ? 150 : R.wainsH) * k, wg = g.createLinearGradient(0, 0, 0, fy);
    wg.addColorStop(0, R.wall[0]); wg.addColorStop(1, R.wall[1]); g.fillStyle = wg; g.fillRect(0, 0, W, fy);
    if (R.pattern) R.pattern(g, W, ry, k, sx, sy);
    var wa = g.createLinearGradient(0, ry, 0, fy); wa.addColorStop(0, R.wains[0]); wa.addColorStop(1, R.wains[1]); g.fillStyle = wa; g.fillRect(0, ry, W, fy - ry);
    g.strokeStyle = R.panelLine || 'rgba(30,70,80,.07)'; g.lineWidth = 3 * k; var pw = 150 * k;
    for (var px = (sx % pw) - pw; px < W; px += pw) { rr(g, px + 14 * k, ry + 22 * k, pw - 28 * k, (fy - ry) - 48 * k, 8 * k); g.stroke(); }
    g.fillStyle = R.rail || '#FFFFFF'; g.fillRect(0, ry - 7 * k, W, 9 * k); g.fillStyle = 'rgba(30,70,80,.08)'; g.fillRect(0, ry + 2 * k, W, 3 * k);
    g.fillStyle = R.base || '#BFDDD7'; g.fillRect(0, fy - 18 * k, W, 18 * k); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(0, fy - 18 * k, W, 3 * k);
    var fg = g.createLinearGradient(0, fy, 0, Hh); fg.addColorStop(0, R.floor[0]); fg.addColorStop(1, R.floor[1]); g.fillStyle = fg; g.fillRect(0, fy, W, Hh - fy);
    var cx = sx + 560 * k, d, i;
    if (R.floorKind === 'planks') {
      g.strokeStyle = R.floorLine || 'rgba(120,80,40,.16)'; g.lineWidth = 2 * k; g.beginPath();
      for (d = 1; d < 10; d++) { var yy = fy + Math.pow(d / 9, 1.5) * (Hh - fy) * 1.02; g.moveTo(0, yy); g.lineTo(W, yy); }
      for (d = 0; d < 9; d++) { var y0 = fy + Math.pow(d / 9, 1.5) * (Hh - fy), y1 = fy + Math.pow((d + 1) / 9, 1.5) * (Hh - fy), stp = 230 * k * (1 + d * 0.12);
        for (i = ((d * 97) % 230) * k - stp; i < W; i += stp) { g.moveTo(i, y0); g.lineTo(i + (i - cx) * 0.05, y1); } }
      g.stroke();
    } else {
      g.strokeStyle = R.floorLine || 'rgba(255,255,255,.75)'; g.lineWidth = 2.2 * k; g.beginPath();
      for (d = 1; d < 9; d++) { var yt = fy + Math.pow(d / 8, 1.6) * (Hh - fy) * 1.02; g.moveTo(0, yt); g.lineTo(W, yt); }
      for (i = -30; i <= 30; i++) { g.moveTo(cx + i * 70 * k, fy); g.lineTo(cx + i * 70 * k * 2.6, Hh + 40); }
      g.stroke();
    }
    var sh = g.createLinearGradient(0, fy, 0, fy + 40 * k); sh.addColorStop(0, 'rgba(20,50,70,.10)'); sh.addColorStop(1, 'rgba(20,50,70,0)'); g.fillStyle = sh; g.fillRect(0, fy, W, 40 * k);
  }
  function plusPattern(col) {
    return function (g, W, ry, k, sx, sy) {
      g.fillStyle = col; var step = 46 * k, s = 5 * k, w2 = 1.6 * k;
      for (var y = sy % step + step * 0.5; y < ry - step * 0.4; y += step) for (var x = (sx % step) + ((Math.round(y / step) % 2) ? step / 2 : 0); x < W; x += step) { g.fillRect(x - s, y - w2, s * 2, w2 * 2); g.fillRect(x - w2, y - s, w2 * 2, s * 2); }
    };
  }
  function windowFrame(g, w, floorY) {
    var F = floorY || 470;
    g.save(); var lp = g.createRadialGradient(w.x + w.w * 0.75, F + 40, 10, w.x + w.w * 0.75, F + 40, 260); lp.addColorStop(0, 'rgba(255,250,225,.55)'); lp.addColorStop(1, 'rgba(255,250,225,0)');
    g.fillStyle = lp; g.beginPath(); g.moveTo(w.x + 40, F + 2); g.lineTo(w.x + w.w + 180, F + 2); g.lineTo(w.x + w.w + 330, 660); g.lineTo(w.x + 120, 660); g.closePath(); g.fill(); g.restore();
    shadowed(g, 22, 8, 0.18, function () { fillRR(g, w.x - 14, w.y - 14, w.w + 28, w.h + 28, 18, '#FFFFFF'); });
    fillRR(g, w.x - 24, w.y + w.h + 12, w.w + 48, 14, 6, '#FFFFFF'); g.fillStyle = 'rgba(30,60,90,.08)'; g.fillRect(w.x - 20, w.y + w.h + 24, w.w + 40, 3);
  }
  function cloud(g, x, y, s) {
    g.save(); g.translate(x, y); g.scale(s, s);
    [[0, 0, 62], [58, -22, 74], [128, -4, 58], [70, 18, 62], [-46, 14, 44]].forEach(function (p) { fillE(g, p[0] + 6, p[1] + 10, p[2], p[2], 'rgba(205,222,245,.9)'); });
    [[0, 0, 62], [58, -22, 74], [128, -4, 58], [70, 18, 62], [-46, 14, 44]].forEach(function (p) { fillE(g, p[0], p[1], p[2], p[2], '#FFFFFF'); }); g.restore();
  }
  function windowSky(g, w, t, par, top, bot) {
    var sg = g.createLinearGradient(0, w.y, 0, w.y + w.h); sg.addColorStop(0, top || '#8FD3FF'); sg.addColorStop(1, bot || '#E3F5FF'); g.fillStyle = sg; g.fillRect(w.x, w.y, w.w, w.h);
    var sx = w.x + w.w * 0.78 - par * 4, sy = w.y + 48, gl = g.createRadialGradient(sx, sy, 6, sx, sy, 90); gl.addColorStop(0, 'rgba(255,244,200,.9)'); gl.addColorStop(0.3, 'rgba(255,236,170,.35)'); gl.addColorStop(1, 'rgba(255,236,170,0)');
    g.fillStyle = gl; g.fillRect(w.x, w.y, w.w, w.h); fillE(g, sx, sy, 15, 15, '#FFF4C9');
    for (var c = 0; c < 3; c++) { var sp = 5 + c * 2.2, x = w.x - 60 + ((hash(c + 4) * 400 + t * sp) % (w.w + 140)) - par * (2 + c), y = w.y + 40 + c * 34; cloud(g, x, y, 0.26 + c * 0.04); }
  }
  function windowGlass(g, w) {
    g.fillStyle = 'rgba(255,255,255,.32)'; g.beginPath(); g.moveTo(w.x + w.w * 0.12, w.y + w.h); g.lineTo(w.x + w.w * 0.44, w.y); g.lineTo(w.x + w.w * 0.6, w.y); g.lineTo(w.x + w.w * 0.28, w.y + w.h); g.closePath(); g.fill();
  }
  function windowMullions(g, w) { g.fillStyle = '#FFFFFF'; g.fillRect(w.x + w.w / 2 - 5, w.y, 10, w.h); g.fillRect(w.x, w.y + w.h * 0.46 - 5, w.w, 10); }
  function plaque(g, s, title, sub, iconCol, icon) {
    shadowed(g, 14, 5, 0.16, function () { fillRR(g, s.x, s.y, s.w, s.h, 14, '#FFFFFF'); });
    fillE(g, s.x + 27, s.y + 25, 17, 17, iconCol || '#21B799'); if (icon) icon(g, s.x + 27, s.y + 25);
    text(g, title, s.x + 52, s.y + 25, 17, 800, '#1F1F3D'); text(g, sub, s.x + 52, s.y + 40, 10.5, 600, '#5C5C73');
  }
  function clockFace(g, c, rim) {
    shadowed(g, 10, 4, 0.16, function () { fillE(g, c.x, c.y, c.r + 5, c.r + 5, rim || '#21B799'); });
    fillE(g, c.x, c.y, c.r, c.r, '#FFFFFF'); g.fillStyle = '#9AA6BC';
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6; g.beginPath(); g.arc(c.x + Math.cos(a) * (c.r - 5), c.y + Math.sin(a) * (c.r - 5), i % 3 ? 1.2 : 2, 0, 7); g.fill(); }
  }
  function clockHands(g, c, h, m, s) {
    var hr = (h % 12 + m / 60) * Math.PI / 6 - Math.PI / 2, mn = (m + s / 60) * Math.PI / 30 - Math.PI / 2, se = s * Math.PI / 30 - Math.PI / 2, r = c.r;
    g.lineCap = 'round'; g.strokeStyle = '#1F1F3D'; g.lineWidth = 3.2; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(hr) * r * 0.45, c.y + Math.sin(hr) * r * 0.45); g.stroke();
    g.lineWidth = 2.2; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(mn) * r * 0.68, c.y + Math.sin(mn) * r * 0.68); g.stroke();
    g.strokeStyle = '#E0456B'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(c.x, c.y); g.lineTo(c.x + Math.cos(se) * r * 0.78, c.y + Math.sin(se) * r * 0.78); g.stroke(); fillE(g, c.x, c.y, 2.4, 2.4, '#1F1F3D');
  }
  function plant(g, pl, pot, potRim) {
    var lv = [[-30, -150, 20, 46, -0.6], [26, -160, 20, 48, 0.55], [-8, -190, 18, 50, -0.1], [-38, -100, 18, 36, -1], [36, -110, 18, 38, 1], [10, -128, 16, 40, 0.3], [-20, -130, 16, 40, -0.4]];
    g.strokeStyle = '#2E9E66'; g.lineWidth = 4; g.lineCap = 'round';
    lv.forEach(function (L) { g.beginPath(); g.moveTo(pl.x, pl.y - 48); g.quadraticCurveTo(pl.x + L[0] * 0.3, pl.y + L[1] * 0.6, pl.x + L[0], pl.y + L[1] + 20); g.stroke(); });
    lv.forEach(function (L, i) { ell(g, pl.x + L[0], pl.y + L[1], L[2], L[3], L[4]); g.fillStyle = i % 2 ? '#3FBF7F' : '#35AE70'; g.fill(); ell(g, pl.x + L[0] - 3, pl.y + L[1] - 6, L[2] * 0.35, L[3] * 0.6, L[4]); g.fillStyle = 'rgba(255,255,255,.18)'; g.fill(); });
    fillRR(g, pl.x - 26, pl.y - 52, 52, 52, 10, pot || '#F59A8B'); fillRR(g, pl.x - 30, pl.y - 56, 60, 12, 6, potRim || '#F7AE9F'); g.fillStyle = 'rgba(120,30,20,.08)'; g.fillRect(pl.x + 8, pl.y - 44, 18, 42);
  }
  function motes(g, t, col) {
    g.fillStyle = col || 'rgba(255,255,255,.7)';
    for (var i = 0; i < 18; i++) { var bx = 150 + hash(i * 3.3) * 820, span = 380, by = 80 + ((hash(i * 1.9) * span - t * (6 + hash(i) * 10)) % span + span) % span, r = 1.4 + hash(i * 7) * 2.2;
      g.beginPath(); g.arc(bx + Math.sin(t * 0.7 + i) * 12, by, r, 0, 7); g.fill(); }
  }

  var IXW = window.IXW = window.IXW || {};
  IXW.worlds = IXW.worlds || {};
  IXW.kit = { clamp: clamp, lerp: lerp, hash: hash, rr: rr, ell: ell, fillRR: fillRR, fillE: fillE, limb: limb, soft: soft, shadowed: shadowed, text: text, tone: tone, FONT: FONT,
    person: person, ik: ik, F3: F3, room: room, plusPattern: plusPattern, windowFrame: windowFrame, windowSky: windowSky, windowGlass: windowGlass, windowMullions: windowMullions, cloud: cloud,
    plaque: plaque, clockFace: clockFace, clockHands: clockHands, plant: plant, motes: motes, reduce: reduce };

  /* ============================== the hero ==============================
     A world: { room (see room()), paintBack(g), paintFront(g), paintWindow(g, t, par, S), paintLive(g, t, date, S),
     paintFrontLive?(g, t, S), glow {hotKey: fn(g) path}, backGlow [hotKeys drawn behind the counter staff],
     cast [{ id, P, behind, keys [hotKeys that make them talk], act(P, t, S) }], toy?(name, S, t, btn), onStop?(key, S, t), moteCol }
     S (shared state): hot, hotA, nexi {x, y}, cast {id: {wave, until}}, toy {name: start time}, t */
  function hero(root) {
    var W0 = IXW.worlds[root.getAttribute('data-world')];
    var cv = root.querySelector('[data-ixw-cv]'), set = root.querySelector('[data-ixw-set]'), front = root.querySelector('[data-ixw-front]');
    var nexi = root.querySelector('[data-ixw-nexi]'), cap = root.querySelector('[data-ixw-cap]');
    if (!W0 || !cv || !set || !cv.getContext) return;
    var g = cv.getContext('2d'), A = document.createElement('canvas'), B = document.createElement('canvas'), ga = A.getContext('2d'), gb = B.getContext('2d');
    var W = 0, Hh = 0, dpr = 1, k = 1, sx = 0, sy = 0, M = 24, live = false, raf = 0, frameN = 0, T0 = performance.now();
    var par = { x: 0, y: 0, tx: 0, ty: 0 };
    var home = (root.getAttribute('data-home') || '288,196').split(',').map(Number);
    var S = { hot: '', hotA: 0, nexi: { x: home[0], y: home[1] }, cast: {}, toy: {}, t: 0 };
    W0.cast.forEach(function (c) { S.cast[c.id] = { wave: 0, until: 0 }; });
    root.classList.add('is-live');
    function now() { return (performance.now() - T0) / 1000; }

    function measure() {
      var hr = root.getBoundingClientRect(), r = set.getBoundingClientRect();
      W = Math.round(hr.width); Hh = Math.round(hr.height); dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      k = r.width / 1000; sx = r.left - hr.left; sy = r.top - hr.top;
      [cv, A, B].forEach(function (c) { c.width = Math.round((W + M * 2) * dpr); c.height = Math.round((Hh + M * 2) * dpr); });
      cv.style.width = (W + M * 2) + 'px'; cv.style.height = (Hh + M * 2) + 'px';
      ga.setTransform(dpr, 0, 0, dpr, M * dpr, M * dpr);
      if (W0.paintBg) W0.paintBg(ga, W + M, Hh + M, k, sx, sy); else room(ga, W + M, Hh + M, k, sx, sy, W0.room);
      ga.setTransform(dpr * k, 0, 0, dpr * k, (sx + M) * dpr, (sy + M) * dpr); W0.paintBack(ga);
      gb.setTransform(dpr * k, 0, 0, dpr * k, (sx + M) * dpr, (sy + M) * dpr); W0.paintFront(gb);
      draw(performance.now());
    }
    function glow(t) {
      var fn = W0.glow && W0.glow[S.hot]; if (!fn) return;
      g.save(); g.shadowColor = 'rgba(255,255,255,.95)'; g.shadowBlur = 18; g.lineWidth = 4; g.strokeStyle = 'rgba(49,103,202,' + ((0.5 + 0.3 * Math.sin(t * 5)) * S.hotA).toFixed(3) + ')'; fn(g); g.stroke(); g.restore();
    }
    function draw(nowMs) {
      var t = (nowMs - T0) / 1000; S.t = t;
      par.x = lerp(par.x, par.tx, 0.08); par.y = lerp(par.y, par.ty, 0.08);
      if (S.hot) S.hotA = Math.min(1, S.hotA + 0.08);
      var fx = par.x * 6, fy = par.y * 3, back = W0.backGlow || [];
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
      g.drawImage(A, 0, 0);
      g.setTransform(dpr * k, 0, 0, dpr * k, (sx + M) * dpr, (sy + M) * dpr);
      W0.paintWindow(g, t, par.x, S); W0.paintLive(g, t, new Date(), S);
      if (S.hot && back.indexOf(S.hot) >= 0) glow(t);
      g.setTransform(dpr * k, 0, 0, dpr * k, (sx + M + fx) * dpr, (sy + M + fy) * dpr);
      W0.cast.forEach(function (c) { if (c.behind) { c.act(c.P, t, S); person(g, c.P, t); } });
      g.setTransform(dpr, 0, 0, dpr, fx * dpr, fy * dpr); g.drawImage(B, 0, 0, B.width / dpr, B.height / dpr);
      g.setTransform(dpr * k, 0, 0, dpr * k, (sx + M + fx) * dpr, (sy + M + fy) * dpr);
      if (W0.paintFrontLive) W0.paintFrontLive(g, t, S);
      if (S.hot && back.indexOf(S.hot) < 0) glow(t);
      W0.cast.forEach(function (c) { if (!c.behind) { c.act(c.P, t, S); person(g, c.P, t); } });
      if (!reduce) motes(g, t, W0.moteCol);
      if (front) front.style.transform = 'translate3d(' + fx.toFixed(2) + 'px,' + fy.toFixed(2) + 'px,0)';
    }
    function loop(nowMs) { raf = 0; if (!live) return; if (++frameN % 2 === 0) draw(nowMs); raf = requestAnimationFrame(loop); }
    function start() { if (!raf && live && !reduce) raf = requestAnimationFrame(loop); }
    function setLive(on) { live = on && !document.hidden; if (live) start(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    function redraw() { if (!live || reduce) draw(performance.now()); }
    var rt = 0; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(measure, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
    if ('ResizeObserver' in window) { var lastW = 0, lastH = 0; new ResizeObserver(function (es) { var r = es[0].contentRect; if (Math.abs(r.width - lastW) < 1 && Math.abs(r.height - lastH) < 1) return; lastW = r.width; lastH = r.height; clearTimeout(rt); rt = setTimeout(measure, 120); }).observe(root); }
    var started = false, tour;
    onScreen(root, function (on) { root.classList.toggle('is-off', !on); setLive(on); if (tour) tour.visible(on); });
    document.addEventListener('visibilitychange', function () { setLive(!document.hidden && root.getBoundingClientRect().bottom > 0); });
    if (fine && !reduce) {
      var box = null;
      root.addEventListener('pointerenter', function () { box = root.getBoundingClientRect(); });
      root.addEventListener('pointermove', function (e) { if (!box) box = root.getBoundingClientRect(); par.tx = clamp((e.clientX - box.left) / box.width * 2 - 1, -1, 1); par.ty = clamp((e.clientY - box.top) / box.height * 2 - 1, -1, 1); });
      root.addEventListener('pointerleave', function () { par.tx = 0; par.ty = 0; box = null; });
      window.addEventListener('scroll', function () { box = null; }, { passive: true });
    }

    /* ---------------- Nexi: poses, flights, reactions ---------------- */
    var poses = nexi ? [].slice.call(nexi.querySelectorAll('[data-pose]')) : [], flyT = 0;
    function pose(name) { poses.forEach(function (im) { im.classList.toggle('is-on', im.getAttribute('data-pose') === name); }); if (nexi) { nexi.classList.remove('is-pop'); void nexi.offsetWidth; nexi.classList.add('is-pop'); } }
    function flyTo(x, y, p) {
      if (!nexi) return;
      var dx = x - S.nexi.x, far = Math.hypot(dx, y - S.nexi.y) > 30;
      S.nexi = { x: x, y: y };
      nexi.style.setProperty('--nx', x); nexi.style.setProperty('--ny', y); nexi.style.setProperty('--tilt', (clamp(dx / 40, -10, 10)).toFixed(1) + 'deg');
      if (far && !reduce) { nexi.classList.remove('is-fly'); void nexi.offsetWidth; nexi.classList.add('is-fly'); clearTimeout(flyT); flyT = setTimeout(function () { nexi.classList.remove('is-fly'); }, 1150); pose('present'); setTimeout(function () { pose(p); }, 760); }
      else pose(p);
    }

    /* ---------------- caption: typed like the videos ---------------- */
    var typeEl = cap && cap.querySelector('[data-ixw-type]'), liveEl = cap && cap.querySelector('[data-ixw-live]'), whoEl = cap && cap.querySelector('[data-ixw-who]'), roleEl = cap && cap.querySelector('[data-ixw-role]'), avEl = cap && cap.querySelector('[data-ixw-av]');
    var typeTimer = 0, recEl = cap && cap.querySelector('[data-ixw-rec]');
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    function say(textS, who, role, av, announce) {
      if (!typeEl) return;
      if (whoEl) whoEl.textContent = who || 'Nexi'; if (roleEl) roleEl.textContent = role || roleEl.getAttribute('data-default') || '';
      if (avEl) { avEl.setAttribute('data-av', av || 'nexi'); avEl.classList.toggle('is-cast', !!av && av !== 'nexi'); [].forEach.call(avEl.querySelectorAll('b[data-for]'), function (b) { b.classList.toggle('is-on', b.getAttribute('data-for') === av); }); }
      var plain = textS.replace(/\*\*/g, ''); if (liveEl && announce) liveEl.textContent = (who || 'Nexi') + ': ' + plain;
      clearInterval(typeTimer);
      var parts = textS.split('**'), n = 0, total = plain.length;
      function render(m) { var out = '', left = m; parts.forEach(function (p, i) { if (left <= 0) return; var s = p.slice(0, left); left -= s.length; out += i % 2 ? '<b>' + esc(s) + '</b>' : esc(s); }); typeEl.innerHTML = out; }
      cap.classList.add('is-typing');
      if (reduce) { render(total); cap.classList.remove('is-typing'); return; }
      typeTimer = setInterval(function () { n += 2; render(n); if (n >= total) { clearInterval(typeTimer); cap.classList.remove('is-typing'); } }, 32);
    }
    function rec(el) {
      if (!recEl) return; var ic = el && el.querySelector('.oi'), r = el && el.getAttribute('data-rec');
      recEl.innerHTML = r ? (ic ? ic.outerHTML : '') + '<span>' + esc(r) + '</span><em>Sample</em>' : '';
      cap.classList.remove('has-rec'); if (r) { void cap.offsetWidth; cap.classList.add('has-rec'); }
    }

    /* ---------------- tour stops (hotspots) ---------------- */
    var hots = [].slice.call(root.querySelectorAll('[data-hot]')), dots = cap ? [].slice.call(cap.querySelectorAll('[data-ixw-dot]')) : [];
    var STOPS = [{ key: '', say: cap ? cap.getAttribute('data-intro') : '', nx: home, pose: 'hello' }];
    hots.forEach(function (h) { var n = (h.getAttribute('data-nx') || home.join(',')).split(','); STOPS.push({ key: h.getAttribute('data-hot'), say: h.getAttribute('data-say'), nx: [+n[0], +n[1]], pose: h.getAttribute('data-pose') || 'point-right', el: h }); });
    if (cap && cap.getAttribute('data-outro')) STOPS.push({ key: '', say: cap.getAttribute('data-outro'), nx: home, pose: 'love' });
    var at = 0;
    function clearHot() { hots.forEach(function (h) { h.classList.remove('is-on'); h.setAttribute('aria-pressed', 'false'); }); }
    function go(i, user) {
      at = (i + STOPS.length) % STOPS.length; var s = STOPS[at];
      S.hot = s.key; S.hotA = 0;
      hots.forEach(function (h) { var on = h === s.el; h.classList.toggle('is-on', on); h.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      dots.forEach(function (d, j) { d.classList.toggle('is-on', j === at); });
      flyTo(s.nx[0], s.nx[1], s.pose); say(s.say || '', '', '', '', user); rec(s.el);
      W0.cast.forEach(function (c) { if (c.keys && c.keys.indexOf(s.key) >= 0) S.cast[c.id].until = now() + 1.6; });
      if (W0.onStop) W0.onStop(s.key, S, now());
      redraw();
    }
    tour = (function () {
      var auto = !reduce, vis = false, held = false, timer = 0, playBtn = cap && cap.querySelector('[data-ixw-play]');
      function sync() { if (playBtn) { var on = auto && !held; playBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); playBtn.setAttribute('aria-label', on ? 'Pause the tour' : 'Play the tour'); playBtn.classList.toggle('is-on', on); } }
      function arm() { clearTimeout(timer); if (!auto || held || !vis) return; timer = setTimeout(function () { if (auto && !held && vis && !document.hidden) go(at + 1); arm(); }, at === 0 ? 5200 : 6400); }
      if (playBtn) playBtn.addEventListener('click', function () { if (auto && !held) { held = true; } else { auto = true; held = false; go(at + 1); } sync(); arm(); });
      sync();
      return { visible: function (on) { vis = on; if (on && !started) { started = true; setTimeout(function () { go(0); arm(); }, 500); } else arm(); }, stop: function () { auto = false; clearTimeout(timer); sync(); } };
    })();
    hots.forEach(function (h, j) { h.addEventListener('click', function () { tour.stop(); go(j + 1, true); }); });
    var prev = cap && cap.querySelector('[data-ixw-prev]'), next = cap && cap.querySelector('[data-ixw-next]');
    if (prev) prev.addEventListener('click', function () { tour.stop(); go(at - 1, true); });
    if (next) next.addEventListener('click', function () { tour.stop(); go(at + 1, true); });
    dots.forEach(function (d, j) { d.addEventListener('click', function () { tour.stop(); go(j, true); }); });

    /* tap Nexi, a staff member or a toy: a reaction and a line of their own */
    var nb = nexi && nexi.querySelector('button'), reacts = nexi ? (nexi.getAttribute('data-reacts') || '').split('|') : [], ri = 0;
    if (nb) nb.addEventListener('click', function () {
      tour.stop(); var r = reacts[ri++ % reacts.length].split('::'), p = r[0] || 'wow';
      pose(p); say(r[1] || '', '', '', '', true); rec(null);
      nexi.classList.remove('is-boing'); void nexi.offsetWidth; nexi.classList.add('is-boing');
      setTimeout(function () { pose('hello'); }, 1800);
    });
    [].forEach.call(root.querySelectorAll('[data-cast]'), function (b) {
      b.addEventListener('click', function () {
        tour.stop(); var who = b.getAttribute('data-cast'), st = S.cast[who], t = now(), near = (b.getAttribute('data-near') || '').split(',');
        if (!st) return; st.wave = t + 1.6; st.until = t + 2.2; S.hot = ''; clearHot();
        say(b.getAttribute('data-say') || '', b.getAttribute('data-who'), b.getAttribute('data-role'), who, true); rec(null);
        if (near.length === 2) flyTo(+near[0], +near[1], 'clap');
        redraw();
      });
    });
    [].forEach.call(root.querySelectorAll('[data-toy]'), function (b) {
      b.addEventListener('click', function () {
        tour.stop(); var name = b.getAttribute('data-toy'), near = (b.getAttribute('data-near') || '').split(',');
        S.toy[name] = now(); S.hot = ''; clearHot();
        if (W0.toy) W0.toy(name, S, now(), b);
        say(b.getAttribute('data-say') || '', '', '', '', true); rec(null);
        if (near.length === 2) flyTo(+near[0], +near[1], b.getAttribute('data-pose') || 'wow');
        b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
        redraw();
      });
    });
    /* a world can make moving things in its canvas tappable (the travel paper plane): hit(x, y) in set units */
    if (W0.hit) set.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('button, a')) return;
      var r = set.getBoundingClientRect(), res = W0.hit((e.clientX - r.left - par.x * 6) / k, (e.clientY - r.top - par.y * 3) / k, S, now());
      if (!res) return;
      tour.stop(); S.hot = ''; clearHot(); say(res.say || '', '', '', '', true); rec(null);
      if (res.near) flyTo(res.near[0], res.near[1], res.pose || 'wow');
      redraw();
    });
    if (reduce) go(0);
  }

  /* ============================== the workflow: stations on a route ============================== */
  function flow(root) {
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]')), panels = [].slice.call(root.querySelectorAll('[role="tabpanel"]'));
    var scenes = [].slice.call(root.querySelectorAll('[data-scene]')), rider = root.querySelector('[data-ixw-rider]');
    var playBtn = root.querySelector('[data-ixw-fplay]'), prev = root.querySelector('[data-ixw-fprev]'), next = root.querySelector('[data-ixw-fnext]');
    if (!tabs.length || tabs.length !== panels.length) return;
    root.classList.add('is-js');
    var at = 0, auto = !reduce, vis = false, held = false, timer = 0, typed = {};
    function typeIn(p) {
      var el = p.querySelector('[data-ixw-ftype]'); if (!el || reduce) return;
      var full = el.getAttribute('data-full') || el.textContent; el.setAttribute('data-full', full);
      var n = 0; clearInterval(typed.t); el.textContent = ''; p.classList.add('is-typing');
      typed.t = setInterval(function () { n += 2; el.textContent = full.slice(0, n); if (n >= full.length) { clearInterval(typed.t); p.classList.remove('is-typing'); } }, 24);
    }
    function replay(s) { if (!s || reduce) return; s.classList.remove('is-on'); void s.offsetWidth; s.classList.add('is-on'); }
    function show(i, focus) {
      at = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k2) { var on = k2 === at; t.classList.toggle('is-on', on); t.classList.toggle('is-done', k2 < at); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; panels[k2].classList.toggle('is-on', on); });
      scenes.forEach(function (s, k2) { s.classList.toggle('is-on', k2 === at); });
      root.style.setProperty('--at', at); root.style.setProperty('--p', String(at / (tabs.length - 1)));
      if (rider) { rider.classList.remove('is-hop'); void rider.offsetWidth; rider.classList.add('is-hop'); }
      typeIn(panels[at]);
      if (focus) tabs[at].focus();
    }
    function sync() { if (playBtn) { var on = auto && !held; playBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); playBtn.setAttribute('aria-label', on ? 'Pause the walkthrough' : 'Play the walkthrough'); playBtn.classList.toggle('is-on', on); } }
    function arm() { clearTimeout(timer); if (!auto || held || !vis) return; timer = setTimeout(function () { if (auto && !held && vis && !document.hidden) show(at + 1); arm(); }, 6200); }
    function stop() { auto = false; clearTimeout(timer); sync(); }
    tabs.forEach(function (t, k2) {
      t.addEventListener('click', function () { stop(); show(k2); });
      t.addEventListener('keydown', function (e) {
        var n = null; if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = at + 1; else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = at - 1; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = tabs.length - 1;
        if (n === null) return; e.preventDefault(); stop(); show(n, true);
      });
    });
    if (prev) prev.addEventListener('click', function () { stop(); show(at - 1); });
    if (next) next.addEventListener('click', function () { stop(); show(at + 1); });
    if (playBtn) playBtn.addEventListener('click', function () { if (auto && !held) held = true; else { auto = true; held = false; show(at + 1); } sync(); arm(); });
    if (fine) { root.addEventListener('mouseenter', function () { clearTimeout(timer); }); root.addEventListener('mouseleave', arm); }
    /* the sample picker: every [data-v="field"] text, [data-vbar="field"] bar (--v) and [data-vshow="sample"] block follows the pick */
    var pick = root.querySelector('[data-ixw-pick]'), data = null;
    if (pick) {
      try { data = JSON.parse(pick.getAttribute('data-samples') || 'null'); } catch (e) { data = null; }
      var pbtns = [].slice.call(pick.querySelectorAll('button[data-sample]'));
      pbtns.forEach(function (b) {
        b.addEventListener('click', function () {
          var key = b.getAttribute('data-sample'), d = data && data[key]; if (!d) return;
          stop();
          pbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          root.setAttribute('data-sample', key);
          [].forEach.call(root.querySelectorAll('[data-v]'), function (el) { var v = d[el.getAttribute('data-v')]; if (v != null) el.textContent = v; });
          [].forEach.call(root.querySelectorAll('[data-vbar]'), function (el) { var v = d[el.getAttribute('data-vbar')]; if (v != null) el.style.setProperty('--v', v); });
          root.classList.remove('is-swap'); void root.offsetWidth; root.classList.add('is-swap');
          replay(scenes[at]);
        });
      });
    }
    sync(); show(0);
    onScreen(root, function (on) { vis = on; root.classList.toggle('is-offscreen', !on); if (on) { if (!root.dataset.seen) { root.dataset.seen = '1'; show(0); } arm(); } else clearTimeout(timer); }, 0.3);
  }

  /* ============================== small things ============================== */
  function ctaBurst(btn) {
    if (reduce) return;
    var host = btn.closest('[data-ixw-burst]'); if (!host) return;
    var r = btn.getBoundingClientRect(), hr = host.getBoundingClientRect();
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('i'); s.className = 'ixw-conf'; s.setAttribute('aria-hidden', 'true');
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, d = 60 + Math.random() * 70;
      s.style.cssText = 'left:' + (r.left - hr.left + r.width / 2) + 'px;top:' + (r.top - hr.top + r.height / 2) + 'px;--dx:' + (Math.cos(a) * d).toFixed(0) + 'px;--dy:' + (Math.sin(a) * d).toFixed(0) + 'px;--r:' + Math.round(Math.random() * 360) + 'deg;--c:' + ['#FFD84A', '#7CD6C4', '#FF8FA3', '#FFFFFF', '#6FA0F5'][i % 5];
      host.appendChild(s); setTimeout(function (el) { el.remove(); }.bind(null, s), 900);
    }
  }
  /* things that animate in once, the first time they scroll into view ([data-ixw-in] gets .is-in) */
  function inOnce() {
    [].forEach.call(document.querySelectorAll('[data-ixw-in]'), function (el) {
      if (reduce || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
      var io = new IntersectionObserver(function (es) { if (es[es.length - 1].isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.25 });
      io.observe(el);
    });
  }

  function init() {
    [].forEach.call(document.querySelectorAll('[data-ixw-hero]'), hero);
    [].forEach.call(document.querySelectorAll('[data-ixw-flow]'), flow);
    [].forEach.call(document.querySelectorAll('[data-ixw-burst]'), function (el) { onScreen(el, function (on) { el.classList.toggle('is-off', !on); }); });
    inOnce();
    document.addEventListener('pointerenter', function (e) { var b = e.target; if (b && b.matches && b.matches('[data-ixw-burst] .btn-white')) ctaBurst(b); }, true);
  }
  /* the world files register after this engine (all scripts are deferred): start once the document has been parsed */
  if (document.readyState === 'complete') init(); else document.addEventListener('DOMContentLoaded', init);
})();
