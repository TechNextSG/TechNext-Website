/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: team (/employee-hub) — the TechNext 201 room, where HR keeps each employee's file. A bright records room on a
   Taguig City morning: the filing cabinets of 201 folders with the records clerk filing away, the HR notice board, the
   offices board with three live clocks, the four-step engagement strip, an aircon with its ribbon fluttering, the ID desk
   where the ID officer prints TechNext IDs, the HR officer's open desk (the employee information sheet fills in on her
   monitor), the folder pile, a window onto Taguig and a new hire with his papers. Wider screens: the 2x2 ID photo corner on
   the right, the 201 archive on the far left. Foreground: a rolling file cart, archive boxes, plants.
   Everyone has their own idle loop and tap choreography (below). All staff wear the blue TechNext ID, in semi-casual clothes;
   whoever sits shows chair, legs and feet. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, MAN = '#EBC98B', MAN2 = '#D9B06A', BLUE = '#3167CA', TEAL = '#14A38B', OK = '#1E9E6A', INK = '#1B1F3B', RED = '#E2453C';
  var T = { cab: { x: 150, y: 150, w: 186 }, cork: { x: 156, y: -104, w: 176, h: 222 }, board: { x: 352, y: -6, w: 196, h: 150 }, steps: { x: 570, y: -40, w: 334, h: 92 }, ac: { x: 650, y: -128, w: 150 },
    side: { x: 352, y: 362, w: 120 }, desk: { x: 478, y: 386, w: 330 }, mon: { x: 560, y: 300, w: 104, h: 66 }, pile: { x: 488, y: 352 }, poster: { x: 590, y: 82, w: 110, h: 150 }, cert: { x: 734, y: 96, w: 82, h: 92 },
    win: { x: 832, y: 70, w: 160, h: 218 }, photo: { x: 1036, y: 150, w: 150 }, arch: { x: -900, y: 120 } };
  var DRAW = ['A–D', 'E–H', 'I–L', 'M–P', 'Q–T', 'U–Z'];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function ease(u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); }
  function handW(P, i) {
    var h = P.hands[i], d = i ? 1 : -1, bw = P.build || 1, shx = d * 76 * bw, shy = -258, dx = h[0] - shx, dy = h[1] - shy, L = Math.hypot(dx, dy), m = clamp(L, 5, 155) / (L || 1);
    var sxk = P.sx == null ? 1 : P.sx;
    return [P.x + (shx + dx * m) * P.s * sxk, P.y + (shy + dy * m - (P.hop || 0) + (P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0)) * P.s];
  }
  function tapAge(st, t) { if (st.wave && st.wave !== st._tw) { st._tw = st.wave; st.tT = t; st.tN = (st.tN || 0) + 1; } return st.tT == null ? 99 : t - st.tT; }
  function reset(P) { P.sx = 1; P.tilt = 0; P.hop = 0; P.idSwing = 0; }
  function idCard(g, x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot || 0); g.scale(s, s); fillRR(g, -21, -27, 42, 54, 6, '#1E2F5C'); fillRR(g, -19, -25, 38, 50, 5, '#FFFFFF'); fillRR(g, -19, -25, 38, 13, 5, BLUE); g.fillRect(-19, -17, 38, 5);
    CO.plane(g, -10, -19, 0.42, 0, '#FFFFFF'); fillRR(g, -13, -6, 12, 14, 2, '#C9D6EE'); fillE(g, -7, -1, 3, 3, '#E8BC95'); g.fillStyle = '#AAB7CC'; g.fillRect(3, -4, 12, 3); g.fillRect(3, 2, 9, 3); g.fillStyle = BLUE; g.fillRect(-13, 14, 26, 4); g.restore(); }

  /* ------------------------------------------------------------ the room (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the wall: warm white with a soft wainscot line */
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#FAFBFD'); wg.addColorStop(1, '#EEF2F8'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = 'rgba(30,60,110,.035)'; for (var st = Math.floor(e.l / 26) * 26; st < e.r; st += 26) g.fillRect(st, CEIL, 12, 400);
    g.fillStyle = '#E3E9F2'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#D5DDEA'; g.fillRect(e.l, 246, e.r - e.l, 5);
    g.strokeStyle = 'rgba(30,60,110,.06)'; g.lineWidth = 3; for (var pw = Math.floor(e.l / 150) * 150; pw < e.r; pw += 150) { rr(g, pw + 14, 266, 122, F - 290, 8); g.stroke(); }
    /* the window onto Taguig City in the morning */
    var w = T.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
    CO.sky(g, { l: w.x, r: w.x + w.w, t: w.y }, w.y, w.y + w.h, [[0, '#7DB7EC'], [0.7, '#BFDDF6'], [1, '#E6F3FB']]);
    CO.skyPH(g, w.x - 40, w.x + w.w + 40, w.y + 150, w.y + 196, { tall: w.x + 90 }); g.restore();
    CO.ceiling(g, e, CEIL, '#EEF2F8', '#F8FAFD', '#FFFFFF');
    CO.floor(g, e, F, '#E9E2D6', '#D9D0C1', 'rgba(120,90,50,.10)');
    /* a soft rug under the HR desk and a WELCOME mat by the door side */
    g.save(); g.globalAlpha = 0.55; fillE(g, 640, F + 40, 260, 26, '#D8E4F5'); g.restore(); g.strokeStyle = 'rgba(49,103,202,.25)'; g.lineWidth = 2; g.beginPath(); g.ellipse(640, F + 40, 244, 22, 0, 0, 7); g.stroke();
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k);
    var w = T.win; g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.strokeRect(w.x, w.y, w.w, w.h); g.lineWidth = 5; g.beginPath(); g.moveTo(w.x + w.w / 2, w.y); g.lineTo(w.x + w.w / 2, w.y + w.h); g.moveTo(w.x, w.y + 92); g.lineTo(w.x + w.w, w.y + 92); g.stroke();
    fillRR(g, w.x - 12, w.y + w.h, w.w + 24, 10, 4, '#FFFFFF'); g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(w.x - 12, w.y + w.h + 10, w.w + 24, 4);
    g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.moveTo(w.x + 20, w.y + w.h); g.lineTo(w.x + 70, w.y); g.lineTo(w.x + 92, w.y); g.lineTo(w.x + 42, w.y + w.h); g.closePath(); g.fill();
    /* half-open blinds at the top of the window */
    for (var bl = 0; bl < 6; bl++) fillRR(g, w.x - 4, w.y + 4 + bl * 7, w.w + 8, 5, 2, '#F4F6FA'); g.fillStyle = '#C9D2DE'; g.fillRect(w.x + 20, w.y, 2, 46);
    g.restore();
  }
  function paintBack(g, ext) {
    /* the filing cabinets of 201 files: three tall cabinets, six drawers, A to Z */
    var c = T.cab; soft(g, c.x + c.w / 2, F + 4, 110, 9, 0.3);
    for (var i = 0; i < 3; i++) { var cx = c.x + i * 62; shadowed(g, 10, 4, 0.18, function () { fillRR(g, cx, c.y, 60, F - c.y, 4, '#C9D2DE'); }); }
    fillRR(g, c.x - 4, c.y - 22, c.w + 8, 20, 5, BLUE); text(g, '201 FILES', c.x + c.w / 2, c.y - 8, 9.5, 800, '#FFFFFF', 'center');
    /* the HR notice board: cork, pinned memos (their corners flutter in the aircon breeze, live) */
    var ck = T.cork; shadowed(g, 10, 4, 0.16, function () { fillRR(g, ck.x - 6, ck.y - 6, ck.w + 12, ck.h + 12, 8, '#B5865A'); });
    fillRR(g, ck.x, ck.y, ck.w, ck.h, 4, '#D9B48A'); g.fillStyle = 'rgba(120,80,40,.18)'; for (var dd = 0; dd < 90; dd++) g.fillRect(ck.x + hash(dd) * ck.w, ck.y + hash(dd + 40) * ck.h, 2, 2);
    fillRR(g, ck.x + 40, ck.y - 18, 96, 20, 5, INK); text(g, 'HR NOTICES', ck.x + 88, ck.y - 4, 8.5, 800, MAN, 'center');
    /* the offices board: three offices, three clock faces (hands are live) */
    var b = T.board; shadowed(g, 12, 4, 0.16, function () { fillRR(g, b.x, b.y, b.w, b.h, 10, '#FFFFFF'); }); fillRR(g, b.x, b.y, b.w, 24, 10, INK); g.fillRect(b.x, b.y + 14, b.w, 10);
    text(g, 'OUR OFFICES', b.x + b.w / 2, b.y + 16, 8.5, 800, '#FFFFFF', 'center');
    [['Singapore', 'HQ', BLUE], ['Taguig City', 'Odoo hub', TEAL], ['Ho Chi Minh', 'AI hub', '#E07B12']].forEach(function (o, i) { var ox = b.x + 33 + i * 65;
      K.clockFace(g, { x: ox, y: b.y + 66, r: 22 }, o[2]); text(g, o[0], ox, b.y + 116, 7.2, 800, C.ink, 'center'); text(g, o[1], ox, b.y + 128, 6.4, 700, o[2], 'center'); });
    /* the four-step engagement strip on the wall */
    var s = T.steps; shadowed(g, 10, 4, 0.14, function () { fillRR(g, s.x, s.y, s.w, s.h, 10, '#FFFFFF'); });
    text(g, 'ONE TEAM, FOUR STEPS', s.x + 14, s.y + 18, 7.5, 800, '#5C6B7A');
    /* the aircon on the wall (its ribbon flutters, live) */
    var ac = T.ac; shadowed(g, 8, 3, 0.14, function () { fillRR(g, ac.x, ac.y, ac.w, 36, 10, '#FFFFFF'); }); fillRR(g, ac.x + 8, ac.y + 26, ac.w - 16, 5, 2, '#DCE3EE'); fillE(g, ac.x + ac.w - 16, ac.y + 12, 2.5, 2.5, '#2BC48A');
    text(g, 'TechNext', ac.x + 16, ac.y + 16, 7, 800, '#9AA6BC');
    /* the TechNext ID poster and the Odoo Ready Partner certificate */
    var po = T.poster; shadowed(g, 10, 4, 0.16, function () { fillRR(g, po.x, po.y, po.w, po.h, 6, '#FFFFFF'); }); fillRR(g, po.x + 6, po.y + 6, po.w - 12, po.h - 12, 4, '#E8EFFC');
    text(g, 'WEAR YOUR', po.x + po.w / 2, po.y + 26, 8, 800, '#5C6B7A', 'center'); text(g, 'TechNext ID', po.x + po.w / 2, po.y + 42, 12, 800, BLUE, 'center');
    g.strokeStyle = BLUE; g.lineWidth = 4; g.beginPath(); g.moveTo(po.x + po.w / 2 - 22, po.y + 52); g.lineTo(po.x + po.w / 2, po.y + 84); g.lineTo(po.x + po.w / 2 + 22, po.y + 52); g.stroke(); idCard(g, po.x + po.w / 2, po.y + 108, 0.9, 0);
    var ce = T.cert; shadowed(g, 8, 3, 0.16, function () { fillRR(g, ce.x, ce.y, ce.w, ce.h, 4, '#C9A27A'); }); fillRR(g, ce.x + 5, ce.y + 5, ce.w - 10, ce.h - 10, 2, '#FFFDF6');
    fillE(g, ce.x + ce.w / 2, ce.y + 32, 14, 14, '#714B67'); text(g, 'o', ce.x + ce.w / 2, ce.y + 37, 15, 800, '#FFFFFF', 'center'); text(g, 'Odoo Ready', ce.x + ce.w / 2, ce.y + 60, 8, 800, C.ink, 'center'); text(g, 'Partner', ce.x + ce.w / 2, ce.y + 71, 7, 800, '#714B67', 'center');
    fillE(g, ce.x + ce.w - 16, ce.y + ce.h - 14, 7, 7, '#E9C46A');
    /* the low side cabinet with the ID printer */
    var sd = T.side; soft(g, sd.x + sd.w / 2, F + 4, 70, 7, 0.3); fillRR(g, sd.x, sd.y, sd.w, F - sd.y, 6, '#D9C3A0'); fillRR(g, sd.x + 6, sd.y + 14, sd.w - 12, 40, 4, '#E8D6B8'); fillRR(g, sd.x + 6, sd.y + 60, sd.w - 12, 40, 4, '#E8D6B8');
    fillE(g, sd.x + sd.w / 2, sd.y + 34, 9, 2.5, '#A98C62'); fillE(g, sd.x + sd.w / 2, sd.y + 80, 9, 2.5, '#A98C62');
    /* under the window: a low credenza with a plant and a lamp */
    var w = T.win; fillRR(g, w.x - 4, 380, w.w + 8, F - 380, 6, '#D9C3A0'); fillRR(g, w.x + 4, 392, w.w - 8, 30, 4, '#E8D6B8'); fillRR(g, w.x + 4, 428, w.w - 8, 30, 4, '#E8D6B8');
    /* ---- right: the 2x2 ID photo corner ---- */
    var ph = T.photo; if (ext.r > ph.x - 20) { soft(g, ph.x + ph.w / 2, F + 4, 110, 9, 0.25); g.fillStyle = '#9AA6BC'; g.fillRect(ph.x - 6, ph.y - 14, 4, F - ph.y + 14); g.fillRect(ph.x + ph.w + 2, ph.y - 14, 4, F - ph.y + 14); g.fillRect(ph.x - 10, ph.y - 16, ph.w + 20, 5);
      var bg2 = g.createLinearGradient(0, ph.y, 0, F); bg2.addColorStop(0, '#5B8DEF'); bg2.addColorStop(1, '#3E6FD0'); g.fillStyle = bg2; g.fillRect(ph.x, ph.y - 11, ph.w, F - ph.y + 4);
      g.fillStyle = 'rgba(255,255,255,.16)'; g.beginPath(); g.ellipse(ph.x + ph.w / 2, F - 6, ph.w / 2 + 6, 12, 0, 0, 7); g.fill();
      fillRR(g, ph.x + 20, ph.y + 8, ph.w - 40, 22, 11, '#FFFFFF'); text(g, '2×2 ID PHOTO', ph.x + ph.w / 2, ph.y + 23, 8.5, 800, BLUE, 'center');
      /* the stool the sitter uses */
      fillRR(g, ph.x + 50, 420, 50, 10, 4, '#2A3142'); g.strokeStyle = '#5C6B7A'; g.lineWidth = 4; g.beginPath(); g.moveTo(ph.x + 56, 430); g.lineTo(ph.x + 50, F); g.moveTo(ph.x + 94, 430); g.lineTo(ph.x + 100, F); g.stroke(); }
    /* ---- far left: the 201 archive, rolling shelves of boxes ---- */
    var ar = T.arch; if (ext.l < ar.x + 420) { for (var sh = 0; sh < 3; sh++) { var ax = ar.x + sh * 130; soft(g, ax + 60, F + 4, 70, 7, 0.25); fillRR(g, ax, ar.y, 120, F - ar.y, 6, '#A9B6C9'); fillRR(g, ax + 4, ar.y + 4, 112, F - ar.y - 8, 4, '#C9D2DE');
        for (var rw = 0; rw < 4; rw++) { var ry = ar.y + 14 + rw * 82; fillRR(g, ax + 4, ry + 66, 112, 5, 2, '#8A96AA'); for (var bx = 0; bx < 3; bx++) { fillRR(g, ax + 10 + bx * 36, ry + 26, 32, 40, 3, MAN); fillRR(g, ax + 16 + bx * 36, ry + 34, 20, 10, 2, '#FFFFFF'); } }
        fillE(g, ax + 60, ar.y - 10, 12, 12, '#7A869C'); g.strokeStyle = '#5C6B7A'; g.lineWidth = 3; g.beginPath(); g.moveTo(ax + 60, ar.y - 22); g.lineTo(ax + 60, ar.y + 2); g.moveTo(ax + 48, ar.y - 10); g.lineTo(ax + 72, ar.y - 10); g.stroke(); }
      ['A–H', 'I–P', 'Q–Z'].forEach(function (lb, i) { fillRR(g, ar.x + 22 + i * 130, ar.y - 52, 76, 22, 5, INK); text(g, '201 · ' + lb, ar.x + 60 + i * 130, ar.y - 37, 8.5, 800, MAN, 'center'); }); }
    /* the room clock (Taguig time, hands live) and, wider, three framed prints of the office cities */
    K.clockFace(g, { x: 952, y: -16, r: 24 }, INK); text(g, 'TAGUIG', 952, 22, 6.6, 800, '#5C6B7A', 'center');
    if (ext.r > 1000) [['SG', BLUE], ['PH', TEAL], ['VN', '#E07B12']].forEach(function (c, i) { var fx = 1010 + i * 62, fy = -96; shadowed(g, 8, 3, 0.16, function () { fillRR(g, fx, fy, 54, 70, 3, '#FFFFFF'); });
      fillRR(g, fx + 5, fy + 5, 44, 48, 2, '#E8EFFC'); g.fillStyle = c[1]; for (var tw = 0; tw < 5; tw++) { var th = 12 + hash(tw + i * 7) * 26; g.fillRect(fx + 8 + tw * 8, fy + 53 - th, 6, th); } text(g, c[0], fx + 27, fy + 64, 7, 800, C.ink, 'center'); });
    K.plant(g, { x: 1270, y: F }, '#FFFFFF', '#E3E8EF');
    lobby(g);
  }
  /* behind the title card: the HR lobby. The OUR PEOPLE photo wall (one polaroid per sample person, each with the blue ID
     ribbon), the wall calendar, the door into the 201 records room with its ID reader (live), the visitor log with the grey
     visitor passes on their hooks, the waiting chairs where an applicant waits for HR, a locked shred bin and a box stack. */
  var LB = { wall: { x: -470, y: -46, w: 268, h: 208 }, cal: { x: -184, y: -40, w: 96, h: 108 }, door: { x: -176, y: 150, w: 112 }, log: { x: 18, y: 372 }, hooks: { x: -30, y: 196 },
    chairs: [-404, -282], table: { x: -344 }, shred: { x: -118, y: 588 }, boxes: { x: 40, y: 592 } };
  function lobby(g) {
    /* the photo wall */
    var w = LB.wall; shadowed(g, 12, 4, 0.16, function () { fillRR(g, w.x, w.y, w.w, w.h, 8, '#FFFFFF'); }); fillRR(g, w.x, w.y, w.w, 26, 8, INK); g.fillRect(w.x, w.y + 16, w.w, 10);
    text(g, 'OUR PEOPLE', w.x + 14, w.y + 17.5, 9, 800, '#FFFFFF'); text(g, 'ONE TEAM · THREE OFFICES', w.x + w.w - 14, w.y + 17.5, 7, 800, MAN, 'right');
    var tops = ['#3167CA', TEAL, '#E0456B', '#F08A24', '#714B67', '#2A3550'], sk = CR.skin, hr = CR.hair;
    for (var i = 0; i < 6; i++) { var px = w.x + 14 + (i % 3) * 84, py = w.y + 36 + Math.floor(i / 3) * 86, rot = (hash(i * 3.7) - 0.5) * 0.08;
      g.save(); g.translate(px + 38, py + 40); g.rotate(rot); shadowed(g, 4, 2, 0.16, function () { fillRR(g, -36, -40, 72, 80, 2, '#FFFFFF'); });
      fillRR(g, -30, -34, 60, 50, 1, ['#E8EFFC', '#E6F6EE', '#FBE3E1', '#FFF1D6', '#F4F0F8', '#E8EFFC'][i]);
      fillRR(g, -16, 2, 32, 16, 8, tops[i]); fillE(g, 0, -10, 11, 12, sk[i % 5]); g.fillStyle = hr[i % 4]; g.beginPath(); g.ellipse(0, -15, 12, 9, 0, Math.PI, 0); g.fill(); if (i % 3 === 1) fillRR(g, -12, -16, 5, 14, 2, hr[i % 4]);
      fillE(g, -4, -9, 1.3, 1.6, INK); fillE(g, 4, -9, 1.3, 1.6, INK); g.strokeStyle = '#B5644B'; g.lineWidth = 1; g.beginPath(); g.arc(0, -6, 3, 0.3, 2.8); g.stroke();
      fillRR(g, -3, 4, 6, 8, 1, '#FFFFFF'); fillRR(g, -3, 4, 6, 2.4, 1, BLUE); fillRR(g, -20, 22, 40, 3, 1.5, '#C9D3E3'); fillRR(g, -14, 29, 28, 3, 1.5, '#E3E8EF'); g.restore();
      fillE(g, px + 38, py + 2, 3.4, 3.4, [RED, BLUE, TEAL][i % 3]); }
    /* the welcome panel over the waiting chairs: the Taguig City office */
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, w.x, 174, w.w, 64, 10, '#FFFFFF'); }); fillRR(g, w.x, 174, 8, 64, 4, BLUE);
    CO.logo(g, w.x + 92, 204, 0.5, INK, BLUE); text(g, 'TAGUIG CITY', w.x + 20, 226, 7.5, 800, BLUE); text(g, '· development and consulting hub', w.x + 78, 226, 6.6, 700, '#5C6B7A');
    idCard(g, w.x + w.w - 30, 206, 0.5, -0.12);
    /* the wall calendar: October 2026 (the date ring is live) */
    var c = LB.cal; shadowed(g, 8, 3, 0.16, function () { fillRR(g, c.x, c.y, c.w, c.h, 5, '#FFFFFF'); }); fillRR(g, c.x, c.y, c.w, 24, 5, RED); g.fillRect(c.x, c.y + 14, c.w, 10);
    text(g, 'OCTOBER', c.x + c.w / 2, c.y + 16, 8.5, 800, '#FFFFFF', 'center'); fillE(g, c.x + 22, c.y - 2, 3, 5, '#9AA6BC'); fillE(g, c.x + c.w - 22, c.y - 2, 3, 5, '#9AA6BC');
    for (var d = 0; d < 28; d++) fillRR(g, c.x + 7 + (d % 7) * 12, c.y + 32 + Math.floor(d / 7) * 18, 10, 13, 2, d % 7 > 4 ? '#FBE3E1' : '#F1F4F9');
    /* the door to the 201 records room */
    var dr = LB.door; soft(g, dr.x + dr.w / 2, F + 4, 70, 7, 0.22); fillRR(g, dr.x - 10, dr.y - 12, dr.w + 20, F - dr.y + 12, 6, '#FFFFFF'); fillRR(g, dr.x, dr.y, dr.w, F - dr.y, 3, '#C9A27A');
    fillRR(g, dr.x + 10, dr.y + 12, dr.w - 20, 120, 4, '#B88E63'); fillRR(g, dr.x + 10, dr.y + 146, dr.w - 20, F - dr.y - 160, 4, '#B88E63');
    fillRR(g, dr.x + 22, dr.y + 24, dr.w - 44, 60, 3, '#D8ECF8'); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(dr.x + 30, dr.y + 84); g.lineTo(dr.x + 50, dr.y + 24); g.lineTo(dr.x + 60, dr.y + 24); g.lineTo(dr.x + 40, dr.y + 84); g.closePath(); g.fill();
    fillRR(g, dr.x + 14, dr.y + 94, dr.w - 28, 30, 4, INK); text(g, '201 RECORDS', dr.x + dr.w / 2, dr.y + 107, 8, 800, MAN, 'center'); text(g, 'STAFF ONLY', dr.x + dr.w / 2, dr.y + 119, 6.4, 800, '#FFFFFF', 'center');
    fillRR(g, dr.x + dr.w - 22, dr.y + 172, 8, 26, 4, '#9AA6BC'); fillE(g, dr.x + dr.w - 18, dr.y + 186, 6, 6, '#7A869C');
    fillRR(g, dr.x + dr.w + 14, dr.y + 128, 22, 34, 5, '#2A3142'); fillRR(g, dr.x + dr.w + 18, dr.y + 134, 14, 14, 3, '#3A4458'); CO.plane(g, dr.x + dr.w + 25, dr.y + 141, 0.5, 0, '#9FC4FF');
    /* the hooks of grey visitor passes and the blue IDs */
    var hk = LB.hooks; fillRR(g, hk.x, hk.y, 74, 10, 4, '#C9A27A'); for (var h = 0; h < 4; h++) { var hx = hk.x + 10 + h * 18, gp = h % 2 === 0; fillE(g, hx, hk.y + 6, 2.4, 2.4, '#7A869C');
      g.strokeStyle = gp ? '#9AA6BC' : BLUE; g.lineWidth = 2; g.beginPath(); g.moveTo(hx - 4, hk.y + 8); g.lineTo(hx, hk.y + 34); g.lineTo(hx + 4, hk.y + 8); g.stroke();
      fillRR(g, hx - 7, hk.y + 32, 14, 18, 2, '#FFFFFF'); fillRR(g, hx - 7, hk.y + 32, 14, 5, 2, gp ? '#9AA6BC' : BLUE); }
    text(g, 'VISITOR PASSES', hk.x + 37, hk.y - 6, 6.4, 800, '#5C6B7A', 'center');
    /* the visitor log on its stand */
    var lg = LB.log; soft(g, lg.x + 34, F + 4, 36, 6, 0.24); fillRR(g, lg.x + 28, lg.y + 20, 12, F - lg.y - 20, 3, '#9AA6BC'); fillRR(g, lg.x + 14, F - 8, 40, 8, 3, '#7A869C');
    g.save(); g.translate(lg.x + 34, lg.y + 14); g.rotate(-0.12); fillRR(g, -34, -12, 68, 26, 4, '#3A4458'); fillRR(g, -30, -10, 29, 22, 2, '#FFFFFF'); fillRR(g, 1, -10, 29, 22, 2, '#F7F9FC'); g.fillStyle = '#C9D3E3'; for (var ln = 0; ln < 4; ln++) { g.fillRect(-27, -6 + ln * 5, 22, 1.4); g.fillRect(4, -6 + ln * 5, 22, 1.4); } g.restore();
    fillRR(g, lg.x + 2, lg.y - 18, 64, 16, 4, '#FFFFFF'); text(g, 'VISITOR LOG', lg.x + 34, lg.y - 7, 6.6, 800, INK, 'center');
    /* the waiting area: a rug, a second waiting chair, the side table with a plant and leaflets */
    g.save(); g.globalAlpha = 0.6; fillE(g, -330, F + 30, 150, 22, '#F6E3BC'); g.restore(); g.strokeStyle = 'rgba(217,176,106,.7)'; g.lineWidth = 2; g.beginPath(); g.ellipse(-330, F + 30, 140, 18, 0, 0, 7); g.stroke();
    var c2 = LB.chairs[1]; soft(g, c2, F + 4, 40, 6, 0.26); fillRR(g, c2 - 30, 330, 60, 72, 14, BLUE); fillRR(g, c2 - 34, 398, 68, 20, 8, '#2756B0'); fillRR(g, c2 - 26, 416, 6, F - 416, 2, '#5C6B7A'); fillRR(g, c2 + 20, 416, 6, F - 416, 2, '#5C6B7A');
    fillRR(g, c2 - 26, 338, 52, 50, 10, 'rgba(255,255,255,.14)');
    var tb = LB.table.x; soft(g, tb, F + 4, 26, 5, 0.24); fillRR(g, tb - 22, 418, 44, 8, 4, '#FFFFFF'); fillRR(g, tb - 3, 426, 6, F - 426, 2, '#9AA6BC'); fillRR(g, tb - 14, F - 5, 28, 5, 2, '#9AA6BC');
    fillRR(g, tb - 18, 410, 20, 8, 2, MAN); fillRR(g, tb - 16, 405, 20, 6, 2, '#E8EFFC'); fillRR(g, tb + 4, 398, 14, 20, 4, '#FFFFFF'); fillE(g, tb + 9, 392, 7, 6, '#3FBF7F'); fillE(g, tb + 15, 388, 6, 7, '#35AE70');
  }
  function lobbyFore(g) {
    /* a locked shred bin and a stack of archive boxes on the floor in front of the lobby */
    var sb = LB.shred; soft(g, sb.x, sb.y + 4, 40, 7, 0.28); fillRR(g, sb.x - 30, sb.y - 76, 60, 76, 6, '#3A4458'); fillRR(g, sb.x - 30, sb.y - 76, 60, 12, 5, '#4A5468'); fillRR(g, sb.x - 18, sb.y - 72, 36, 4, 2, '#11151F');
    fillRR(g, sb.x - 22, sb.y - 54, 44, 18, 3, '#FFFFFF'); text(g, 'CONFIDENTIAL', sb.x, sb.y - 42, 6, 800, RED, 'center'); fillRR(g, sb.x - 5, sb.y - 30, 10, 12, 2, '#E9C46A'); fillE(g, sb.x, sb.y - 24, 2, 2, '#6B4E1E');
    fillE(g, sb.x - 22, sb.y, 5, 5, '#2A3142'); fillE(g, sb.x + 22, sb.y, 5, 5, '#2A3142');
    var bx = LB.boxes; soft(g, bx.x + 40, bx.y + 3, 56, 7, 0.28); [[0, 0, 'NEW HIRES'], [48, 0, 'IDs'], [22, -44, '201 · 2026']].forEach(function (b) { var x = bx.x + b[0], y = bx.y + b[1];
      fillRR(g, x, y - 44, 50, 44, 4, MAN); fillRR(g, x - 2, y - 44, 54, 9, 3, MAN2); fillRR(g, x + 8, y - 28, 34, 13, 2, '#FFFFFF'); text(g, b[2], x + 25, y - 19, 5.6, 800, '#6B4E1E', 'center'); });
  }
  function paintFront(g, ext) {
    /* the ID printer on the side cabinet */
    var sd = T.side; fillRR(g, sd.x + 16, sd.y - 40, 88, 40, 8, '#2A3142'); fillRR(g, sd.x + 24, sd.y - 32, 72, 10, 3, '#3A4458'); fillRR(g, sd.x + 28, sd.y - 14, 64, 6, 3, '#11151F');
    text(g, 'ID PRINTER', sd.x + 60, sd.y - 44, 6.6, 800, '#5C6B7A', 'center'); for (var bc = 0; bc < 5; bc++) fillRR(g, sd.x + 2 + bc, sd.y - 6 - bc * 2, 12, 2, 1, '#FFFFFF');
    /* HR's open desk: a monitor, the in-tray, a mug, the folder pile (live) */
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    var m = T.mon; fillRR(g, m.x + m.w / 2 - 5, m.y + m.h, 10, d.y - m.y - m.h, 2, '#5C6B7A'); fillRR(g, m.x + m.w / 2 - 22, d.y - 4, 44, 5, 2, '#5C6B7A'); fillRR(g, m.x - 4, m.y - 4, m.w + 8, m.h + 8, 6, '#2A3142');
    fillRR(g, d.x + d.w - 60, d.y - 12, 44, 12, 3, '#9AA6BC'); fillRR(g, d.x + d.w - 56, d.y - 18, 36, 8, 2, '#FFFFFF');
    fillRR(g, m.x + 120, d.y - 6, 50, 6, 2, '#FFFFFF'); fillRR(g, m.x + 118, d.y - 8, 54, 3, 1, '#E3E8EF');
    /* the credenza's plant and lamp under the window */
    var w = T.win; fillRR(g, w.x + 18, 356, 28, 24, 4, '#FFFFFF'); fillE(g, w.x + 26, 350, 10, 8, '#3FBF7F'); fillE(g, w.x + 38, 346, 9, 9, '#35AE70'); fillE(g, w.x + 30, 340, 8, 9, '#3FBF7F'); fillRR(g, w.x + 124, 344, 6, 36, 2, '#9AA6BC'); g.fillStyle = '#FFE7A8'; g.beginPath(); g.moveTo(w.x + 110, 346); g.lineTo(w.x + 144, 346); g.lineTo(w.x + 136, 324); g.lineTo(w.x + 118, 324); g.closePath(); g.fill();
  }
  /* the foreground: a rolling file cart, stacked archive boxes, plants */
  function paintFore(g, ext) {
    soft(g, 220, 716, 80, 8, 0.3); fillRR(g, 150, 640, 140, 10, 4, '#9AA6BC'); fillRR(g, 150, 690, 140, 8, 4, '#9AA6BC'); g.fillStyle = '#7A869C'; g.fillRect(156, 640, 5, 66); g.fillRect(280, 640, 5, 66);
    for (var f = 0; f < 9; f++) { var fx = 160 + f * 13; fillRR(g, fx, 596 + (f % 3) * 4, 11, 46 - (f % 3) * 4, 2, f % 2 ? MAN2 : MAN); fillRR(g, fx + 1, 592 + (f % 3) * 4, 6, 6, 1.5, f % 2 ? MAN2 : MAN); }
    [162, 278].forEach(function (x) { fillE(g, x, 710, 8, 8, '#2A3550'); fillE(g, x, 710, 3, 3, '#9AA6BC'); });
    soft(g, 950, 718, 70, 8, 0.3); [[900, 666, 0], [960, 666, 1], [924, 620, 2]].forEach(function (b) { fillRR(g, b[0], b[1], 56, 46, 4, MAN); fillRR(g, b[0], b[1], 56, 9, 3, MAN2); fillRR(g, b[0] + 12, b[1] + 18, 32, 14, 2, '#FFFFFF'); text(g, ['201 · A–H', '201 · I–P', '201 · Q–Z'][b[2]], b[0] + 28, b[1] + 28, 6, 800, '#6B4E1E', 'center'); });
    K.plant(g, { x: 1060, y: 730 }, TEAL, '#2BC4A6'); K.plant(g, { x: -566, y: 730 }, '#FFFFFF', '#E3E8EF'); lobbyFore(g);
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  var CLK = W({ x: 306, y: 470, s: 0.5, ph: 0.2, skin: 2, hair: 0, style: 'bun', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', hands: [[-120, -230], [60, -200]], look: -0.7 });
  var ITO = W({ x: 412, y: 470, s: 0.5, ph: 1.1, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#2A3550', top2: '#FFD84A', hands: [[-40, -210], [40, -210]], look: 0.2 });
  var HR = W({ x: 744, y: 470, s: 0.54, ph: 0.8, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: TEAL, top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#2A3550', hands: [[-80, -196], [40, -196]], look: -0.6 });
  var HIRE = W({ x: 904, y: 470, s: 0.52, ph: 1.9, skin: 3, hair: 1, style: 'short', outfit: 'shirt', top: BLUE, hold: 'clipboard', hands: [[-80, -210], [60, -190]], look: -0.7 });
  var PHOT = W({ x: 1230, y: 470, s: 0.5, ph: 2.6, skin: 0, hair: 2, style: 'pony', outfit: 'polo', top: '#F08A24', hands: [[-110, -300], [-60, -300]], look: -0.8 });
  var SIT = W({ x: 1111, y: 470, s: 0.48, ph: 0.6, skin: 2, hair: 0, style: 'long', outfit: 'shirt', top: '#FFFFFF', sit: true, chair: false, sitDrop: 30, hands: [[-60, -190], [60, -190]], look: 0 });
  var APP = W({ x: -404, y: 470, s: 0.5, ph: 0.9, skin: 3, hair: 2, style: 'long', outfit: 'shirt', top: '#F2F4F8', top2: '#2A3550', sit: true, chairCol: BLUE, id: '#9AA6BC', hands: [[-40, -200], [40, -200]], look: 0.4 });
  var ARC = W({ x: -620, y: 470, s: 0.5, ph: 1.4, skin: 1, hair: 3, style: 'short', outfit: 'polo', top: '#7B5BD6', hands: [[-60, -380], [60, -380]], look: -0.4 });
  var CREW = [
    { x0: -920, x1: -700, y: 520, spd: 14, ph: 0.3, label: 'Odoo consultant, Taguig City', lines: ['Updated my **201**: new address, same commute.', 'My TechNext ID opens the **records room**.'], acts: ['wave', 'id', 'nod'],
      P: W({ s: 0.5, skin: 0, hair: 0, style: 'long', outfit: 'polo', top: '#E0456B', hold: 'tablet' }) },
    { front: true, x0: -440, x1: 100, y: 596, spd: 18, ph: 0.5, label: 'Project manager', lines: ['Off to a **discovery** workshop with a client.', 'One team, from **discovery to support**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#1E3A6E', hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: 1060, x1: 1300, y: 700, spd: 15, ph: 0.2, label: 'HR assistant', lines: ['Fresh folders for the **new hires**.', 'Every one gets a sheet, a file and an ID.'], acts: ['jump', 'id', 'wave'],
      P: W({ s: 0.58, skin: 1, hair: 2, style: 'bob', outfit: 'cardigan', top: MAN2, top2: '#FFFFFF', hold: 'box', hands: [[-60, -212], [64, -216]] }) }
  ];

  var APT = { t: -9 }, DOOR = { t: -9 }, PR = { t: -9 }, DR = { t: -9, n: 2 }, STAMP = { t: -9 }, FLASH = { t: -9 }, PHT = { t: -9 }, SITT = { t: -9 }, ARCT = { t: -9 }, FOLD = { t: -9 };
  /* ---- the records clerk: idle, opens a drawer, files a folder, closes it; tapped, tosses a manila folder that flips, and catches it */
  function actClk(P, t, S) {
    var st = S.cast.clk, u = tapAge(st, t); reset(P);
    var cyc = (t + 1) % 6, n = Math.floor((t + 1) / 6) % 6; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P._folder = 0;
    var row = n % 2, col = Math.floor(n / 2), dyw = (T.cab.y + 10 + row * 150 + 20 - 470) / 0.5, dxw = (T.cab.x + col * 62 + 30 - P.x) / 0.5;
    if (cyc < 1) { DR.n = n; DR.t = t - 0.4; P.hands = [[lerp(-90, clamp(dxw, -230, 40), ease(cyc)), lerp(-230, clamp(dyw, -380, -150), ease(cyc))], [60, -200]]; P.look = -0.9; }
    else if (cyc < 3) { P.hands = [[clamp(dxw, -230, 40), clamp(dyw, -380, -150)], [-40, -260]]; P._folder = 1; P.look = -0.9; P.tilt = -0.04; }
    else { P.hands = [[-90, -230], [60, -200]]; P.look = lerp(P.look, 0.4, 0.05); }
    if (S.hot === 'cabinet') { P.hands = [[-150, -300], [60, -200]]; P.look = -0.9; P.talk = true; }
    if (u < 2) { P.talk = true; P.mood = 'happy'; P._folder = 0; P.look = 0.2; P.hands = u < 0.35 ? [[-40, -230], [40, -230]] : u < 1.3 ? [[-110, -330], [110, -330]] : [[-40, -236], [40, -236]];
      if (FOLD.t < st.tT) FOLD.t = st.tT; P.hop = u > 1.3 && u < 1.6 ? Math.sin((u - 1.3) / 0.3 * Math.PI) * 10 : 0; }
    P._u = u;
  }
  /* ---- the ID officer: idle, feeds blank cards and checks each print; tapped, swings a fresh TechNext ID on its lanyard and presents it */
  function actIto(P, t, S) {
    var st = S.cast.ito, u = tapAge(st, t); reset(P);
    var cyc = (t + 3) % 5; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; P._card = 0;
    if (cyc < 2) { P.hands = [[-30, -190 + Math.sin(t * 8) * 4], [40, -200]]; P.look = 0.1; }
    else { P.hands = [[-40, -210], [70, -310]]; P._card = 1; P.look = 0.5; P.tilt = 0.06; P.mood = 'happy'; }
    if (S.hot === 'id') { P.hands = [[-40, -210], [90, -330]]; P._card = 1; P.talk = true; }
    if (u < 2.4) { P.talk = true; P.mood = 'happy'; P._card = 0; P.look = 0;
      P.hands = u < 1.4 ? [[-40, -210], [80 + Math.cos(u * 12) * 10, -380 + Math.sin(u * 12) * 10]] : [[-60, -300], [100, -340]]; P.hop = u > 1.4 && u < 1.8 ? Math.sin((u - 1.4) / 0.4 * Math.PI) * 12 : 0;
      if (u > 1.4 && !st._p) { st._p = 1; CR.burst('heart', P.x + 50, P.y - 220, t); } if (u < 0.2) st._p = 0; }
    P._u = u;
  }
  /* ---- the HR officer: idle, types, sips coffee, pushes up her glasses; tapped, stamps the sheet ON FILE and gives a thumbs up */
  function actHr(P, t, S) {
    var st = S.cast.hr, u = tapAge(st, t), busy = S.hot === 'sheet'; reset(P);
    var cyc = (t + 1.5) % 9; P.talk = t < st.until || S.hot === 'file'; P.mood = P.talk || busy ? 'happy' : 'calm'; P._mug = 0;
    if (busy || cyc < 5.4) { var k2 = Math.abs(Math.sin(t * (busy ? 14 : 7))) * 6; P.hands = [[-90, -196 - k2], [30, -196 - (6 - k2)]]; P.look = lerp(P.look, -0.6, 0.06); }
    else if (cyc < 7.4) { P.hands = [[-90, -196], [50, -320]]; P._mug = 1; P.look = lerp(P.look, 0.2, 0.06); }
    else { P.hands = [[-90, -196], [24, -370]]; P.look = 0; P.tilt = -0.03; }
    if (S.hot === 'file') { P.hands = [[-60, -200], [-130, -170 + Math.sin(t * 3) * 6]]; P.look = lerp(P.look, -0.9, 0.08); }
    if (u < 2.4) { P.talk = true; P.mood = 'happy'; P._mug = 0; P.look = -0.3;
      if (u < 0.45) P.hands = [[-90, -196], [60, -260 - ease(u / 0.45) * 120]];
      else if (u < 0.62) P.hands = [[-90, -196], [60 - ease((u - 0.45) / 0.17) * 60, -380 + ease((u - 0.45) / 0.17) * 190]];
      else if (u < 1.3) P.hands = [[-90, -196], [0, -190]];
      else P.hands = [[-90, -196], [100, -330]];
      if (u > 0.6 && STAMP.t < st.tT) { STAMP.t = t; CR.burst('spark', P.x - 2, 386, t); } }
    P._u = u;
  }
  /* ---- the new hire: idle, fills in his form and looks round the room; tapped, holds up his new TechNext ID and jumps */
  function actHire(P, t, S) {
    var st = S.cast.hire, u = tapAge(st, t); reset(P); P.hold = 'clipboard';
    var cyc = (t + 2) % 7; P.talk = t < st.until || S.hot === 'id'; P.mood = P.talk ? 'happy' : 'calm';
    P.x = 904 + Math.sin(t * 0.8) * 3; P.tilt = Math.sin(t * 0.8) * 0.025;
    if (cyc < 4) { P.hands = [[-80, -210], [-10 + Math.sin(t * 10) * 5, -205 + Math.cos(t * 8) * 3]]; P.look = lerp(P.look, -0.4, 0.06); }
    else { P.hands = [[-80, -210], [60, -190]]; P.look = lerp(P.look, cyc < 5.5 ? 0.9 : -0.9, 0.05); }
    if (S.hot === 'id') P.hands = [[-80, -210], [100, -300 + Math.sin(t * 4) * 8]];
    if (u < 2.2) { P.talk = true; P.mood = u < 0.3 ? 'wow' : 'happy'; P.hold = null; P.look = 0;
      P.hands = [[-70, -200], [70, -400]]; P.hop = u > 0.3 && u < 1.1 ? Math.abs(Math.sin((u - 0.3) / 0.8 * Math.PI * 2)) * 50 : 0;
      if (u > 0.3 && !st._c) { st._c = 1; CR.burst('conf', P.x + 30, P.y - 260, t); } if (u < 0.2) st._c = 0; }
    P._u = u;
  }
  /* ---- the applicant in the lobby (behind the title card, a visitor: grey pass): idle, reads her papers, checks her watch,
     smooths her folder, swings her feet; tapped, she jumps up from the chair, holds her folder high and waves */
  function actApp(P, t) {
    var u = t - APT.t, cyc = (t + 3) % 9; reset(P); P.talk = false; P.mood = 'calm'; P._fold = 1; P._watch = 0;
    if (cyc < 4) { P.hands = [[-40, -250 + Math.sin(t * 0.8) * 4], [40, -250 - Math.sin(t * 0.8) * 4]]; P.look = 0.1; P.tilt = 0.03; }
    else if (cyc < 5.4) { P.hands = [[-10, -280], [60, -230]]; P._fold = 0; P._watch = 1; P.look = -0.4; P.mood = cyc > 5 ? 'wow' : 'calm'; }
    else if (cyc < 7) { P.hands = [[-50, -200], [50, -200]]; P.look = lerp(P.look, 0.9, 0.06); P.tilt = Math.sin(t * 2) * 0.04; }
    else { P.hands = [[-40, -210], [40, -210]]; P.look = 0.3; P.hop = Math.abs(Math.sin(t * 5)) * 3; }
    if (u < 2.2) { P.talk = true; P.mood = 'happy'; P._watch = 0; P.sit = u > 1.6; P.hop = u < 1.6 ? Math.sin(Math.min(1, u / 0.5) * Math.PI / 2) * 26 + Math.abs(Math.sin(u * 8)) * 4 : 0;
      P.hands = u < 1.6 ? [[-60, -420], [110, -330 + Math.sin(u * 14) * 30]] : [[-40, -210], [40, -210]]; P.look = 0.6; } else P.sit = true;
    P._u = u;
  }
  /* ---- the margins (drawn and tapped by this file): the ID photographer and her sitter, the archivist */
  function actPhot(P, t) { var u = t - PHT.t; reset(P); var cyc = t % 5; P.hands = cyc < 3.6 ? [[-110, -300], [-60, -300]] : [[-110, -300], [100, -340]]; P.look = -0.8; P.mood = cyc > 3.6 ? 'happy' : 'calm'; P.talk = cyc > 3.6;
    if (cyc > 3.2 && cyc < 3.26 && FLASH.t < t - 1) FLASH.t = t; P.x = 1230 + Math.sin(t * 0.5) * 5;
    if (u < 1.6) { P.hands = [[-110, -300], [-60, -300]]; P.hop = Math.sin(u / 1.6 * Math.PI) * 8; P.mood = 'happy'; if (u > 0.3 && FLASH.t < PHT.t) FLASH.t = t; } }
  function actSit(P, t) { var u = t - SITT.t, fl = t - FLASH.t; reset(P); P.mood = fl < 0.9 ? 'happy' : 'calm'; P.look = 0; P.hands = [[-60, -190], [60, -190]]; P.tilt = Math.sin(t * 0.7) * 0.03;
    if (u < 1.6) { P.hands = [[-60, -190], [90, -340]]; P.mood = 'happy'; P.talk = true; } }
  function actArc(P, t) { var u = t - ARCT.t; reset(P); var cyc = t % 6; P.hands = cyc < 3 ? [[-60, -380 + Math.sin(t * 2) * 10], [60, -380 - Math.sin(t * 2) * 10]] : [[-70, -200], [70, -200]]; P.look = cyc < 3 ? -0.3 : 0.4; P.hold = cyc < 3 ? null : 'box';
    if (u < 1.6) { P.hold = null; P.hands = [[-110, -380], [110, -380]]; P.hop = Math.sin(u / 1.6 * Math.PI) * 24; P.mood = 'happy'; P.talk = true; } }

  /* ------------------------------------------------------------ live layers */
  function paintLive(g, t, now, S) {
    /* the aircon ribbon and the notice board's fluttering memos */
    var ac = T.ac; for (var r = 0; r < 5; r++) { var rx = ac.x + 20 + r * 26, fl = Math.sin(t * 9 + r * 1.3) * 5; g.strokeStyle = ['#3167CA', '#FFD84A', '#14A38B', '#E0456B', '#3167CA'][r]; g.lineWidth = 2.5; g.beginPath(); g.moveTo(rx, ac.y + 33); g.quadraticCurveTo(rx + fl, ac.y + 44, rx + fl * 1.6, ac.y + 56); g.stroke(); }
    var ck = T.cork; [['Keep your', '201 current', '#FFF7D6', 0], ['Wear your', 'TechNext ID', '#E8EFFC', 1], ['Update your', 'address', '#E6F6EE', 2], ['Three', 'offices', '#FBE3E1', 3]].forEach(function (m, i) {
      var mx = ck.x + 14 + (i % 2) * 82, my = ck.y + 14 + Math.floor(i / 2) * 102, flap = Math.sin(t * 5 + i * 2) * (i === 1 ? 0.06 : 0.025); g.save(); g.translate(mx + 34, my); g.rotate(flap - 0.03 + (i % 2) * 0.05);
      fillRR(g, -34, 0, 68, 84, 2, m[2]); fillE(g, 0, 4, 4, 4, ['#E2453C', '#3167CA', '#14A38B', '#F2B233'][i]); text(g, m[0], 0, 30, 7.4, 800, '#5C6B7A', 'center'); text(g, m[1], 0, 44, 8.4, 800, C.ink, 'center');
      for (var ln = 0; ln < 3; ln++) fillRR(g, -24, 54 + ln * 8, ln === 2 ? 30 : 48, 3, 1.5, 'rgba(30,40,70,.15)'); g.restore(); });
    /* the cabinet drawers: one slides out (the clerk's drawer, a tap, or the Records stop) with its manila folders */
    var c = T.cab, dt = t - DR.t, open = S.hot === 'cabinet' ? 1 : (dt < 3 ? clamp(dt * 3, 0, 1) * clamp((3 - dt) * 2, 0, 1) : 0);
    for (var i = 0; i < 3; i++) for (var j = 0; j < 2; j++) { var cx = c.x + i * 62, dy = c.y + 10 + j * 150, n = i * 2 + j, out = n === DR.n ? open * 22 : 0;
      for (var rw = 0; rw < 3; rw++) { var y = dy + rw * 46, o3 = rw === 0 ? out * 0.3 : 0; if (rw === 0 && out > 0) { fillRR(g, cx + 6, y - o3 - 10, 48, 14, 2, MAN); for (var f = 0; f < 4; f++) fillRR(g, cx + 9 + f * 11, y - o3 - 14, 8, 6, 1.5, f % 2 ? MAN2 : MAN); }
        fillRR(g, cx + 4 - (rw === 0 ? out * 0.2 : 0), y - o3, 52, 40, 3, rw === 0 && out > 0 ? '#EEF2F7' : '#E3E9F1'); fillRR(g, cx + 18, y + 6 - o3, 24, 9, 2, '#FFFFFF');
        if (rw === 0) text(g, DRAW[n], cx + 30, y + 13.5 - out * 0.3, 6, 800, C.ink, 'center'); fillRR(g, cx + 22, y + 22 - o3, 16, 4, 2, '#9AA6BC'); } }
    /* the offices board: three live clocks (UTC+8, +8, +7) */
    var dm = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, { x: 952, y: -16, r: 24 }, dm.getUTCHours(), dm.getUTCMinutes(), dm.getUTCSeconds());
    var b = T.board, dn = new Date(); [8, 8, 7].forEach(function (o, i) { var d = new Date(dn.getTime() + o * 3600e3); K.clockHands(g, { x: b.x + 33 + i * 65, y: b.y + 66, r: 22 }, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()); });
    if (S.hot === 'offices') { var pi = Math.floor(t * 1.5) % 3; g.strokeStyle = [BLUE, TEAL, '#E07B12'][pi]; g.lineWidth = 3; g.beginPath(); g.arc(b.x + 33 + pi * 65, b.y + 66, 27, 0, Math.PI * 2); g.stroke(); }
    /* the four steps light in turn */
    var s = T.steps, sp = Math.floor(t * (S.hot === 'journey' ? 1.4 : 0.5)) % 4;
    ['Discovery', 'Training', 'Integration', 'Support'].forEach(function (nm, i) { var x = s.x + 14 + i * 80, on = i <= sp;
      fillRR(g, x, s.y + 28, 70, 50, 8, on ? [BLUE, TEAL, '#F08A24', '#714B67'][i] : '#F1F4F9'); text(g, String(i + 1), x + 12, s.y + 48, 13, 800, on ? '#FFFFFF' : '#9AA6BC'); text(g, nm, x + 35, s.y + 68, 7.4, 800, on ? '#FFFFFF' : '#5C6B7A', 'center');
      if (i < 3) { g.fillStyle = on && i < sp ? '#2BC48A' : '#D5DCE6'; g.fillRect(x + 70, s.y + 52, 10, 3); } });
    /* clouds drift past the Taguig window */
    var w = T.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
    for (var cl = 0; cl < 3; cl++) { var cx2 = w.x - 60 + ((t * (5 + cl * 2) + cl * 70) % (w.w + 120)), cy2 = w.y + 54 + cl * 26; g.fillStyle = 'rgba(255,255,255,.88)'; g.beginPath(); g.ellipse(cx2, cy2, 26, 8, 0, 0, 7); g.ellipse(cx2 + 12, cy2 - 6, 15, 9, 0, 0, 7); g.fill(); }
    g.restore();
    /* the photo corner: ring light, flash, the photographer and the sitter */
    if (S.ext.r > T.photo.x - 20) { var ph = T.photo, fl2 = t - FLASH.t; g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 6; g.beginPath(); g.arc(ph.x + ph.w + 34, 236, 24, 0, 7); g.stroke(); g.strokeStyle = '#7A869C'; g.lineWidth = 3; g.beginPath(); g.moveTo(ph.x + ph.w + 34, 260); g.lineTo(ph.x + ph.w + 34, F); g.stroke();
      if (fl2 < 0.5) { g.save(); g.globalAlpha = (1 - fl2 * 2) * 0.5; g.fillStyle = '#FFFFFF'; g.fillRect(ph.x, ph.y, ph.w, F - ph.y); g.restore(); }
      actSit(SIT, t); K.person(g, SIT, t); actPhot(PHOT, t); K.person(g, PHOT, t);
      var hp = handW(PHOT, 0); fillRR(g, hp[0] - 20, hp[1] - 18, 40, 26, 5, '#2A3142'); fillE(g, hp[0] - 22, hp[1] - 5, 9, 9, '#0B0F24'); fillE(g, hp[0] - 22, hp[1] - 5, 5, 5, '#3A5A9A'); fillRR(g, hp[0] + 2, hp[1] - 24, 10, 6, 2, '#5C6B7A');
      if (fl2 < 0.35) { g.save(); g.globalAlpha = 1 - fl2 / 0.35; fillE(g, hp[0] + 7, hp[1] - 26, 18, 18, '#FFFFFF'); g.restore(); }
      if (t - SITT.t < 1.6) { var hs = handW(SIT, 1); text(g, '✌', hs[0], hs[1] - 6, 14, 800, '#2A3142', 'center'); } }
    /* the lobby: the records-room reader blinks (green when someone taps in), today's date is ringed on the calendar */
    var dr = LB.door, dg = t - DOOR.t < 1.4 || (t % 7) < 0.5; fillE(g, dr.x + dr.w + 25, dr.y + 154, 3, 3, dg ? '#2BC48A' : (Math.floor(t * 2) % 2 ? RED : '#7A2C27'));
    var cl = LB.cal, td = 7; g.strokeStyle = RED; g.lineWidth = 1.6; g.beginPath(); g.ellipse(cl.x + 12 + (td % 7) * 12, cl.y + 38.5 + Math.floor(td / 7) * 18, 8, 9, 0, 0, Math.PI * 2 * clamp((t % 4) / 1.2, 0, 1)); g.stroke();
    actApp(APP, t); K.person(g, APP, t);
    /* the archivist on the far left */
    if (S.ext.l < -560) { actArc(ARC, t); K.person(g, ARC, t); }
    CO.crew(CREW, g, t, S, false);
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* HR's monitor: the employee information sheet fills in, field by field; a stamp lands ON FILE */
    var m = T.mon, fast = S.hot === 'sheet', n = Math.floor((t * (fast ? 2.4 : 0.8)) % 7), stp = t - STAMP.t < 3;
    fillRR(g, m.x, m.y, m.w, m.h, 3, '#FFFFFF'); fillRR(g, m.x, m.y, m.w, 11, 3, BLUE); g.fillRect(m.x, m.y + 6, m.w, 5); text(g, 'EMPLOYEE INFORMATION SHEET', m.x + 5, m.y + 8.4, 4.6, 800, '#FFFFFF');
    fillRR(g, m.x + 5, m.y + 15, 18, 20, 2, '#DCE7FB'); fillE(g, m.x + 14, m.y + 22, 4, 4, '#E8BC95'); fillRR(g, m.x + 8, m.y + 28, 12, 6, 3, TEAL);
    ['Name', 'Position', 'Office', 'TechNext ID', 'Work email'].forEach(function (f, i) { var y = m.y + 18 + i * 9.2; text(g, f, m.x + 28, y + 3, 3.8, 800, '#5C6B7A'); fillRR(g, m.x + 56, y - 1, 42, 5, 1.5, '#F1F4F9'); if (i < n || stp) fillRR(g, m.x + 57, y, 10 + hash(i + 3) * 28, 3, 1.5, i === n - 1 ? BLUE : '#9AA6BC'); });
    if (n >= 6 || stp) { g.save(); g.translate(m.x + 80, m.y + 52); g.rotate(-0.2); g.strokeStyle = OK; g.lineWidth = 1.4; g.strokeRect(-14, -5, 28, 10); text(g, 'ON FILE', 0, 2.4, 4.6, 800, OK, 'center'); g.restore(); }
    /* the folder pile: manila 201 folders; on the 201 file stop the top one opens */
    var p = T.pile, op = S.hot === 'file' ? clamp(Math.sin(t * 2) * 0.5 + 0.6, 0, 1) : 0;
    for (var f = 0; f < 4; f++) fillRR(g, p.x + (f % 2) * 3, p.y + 26 - f * 6, 64, 6, 1.5, f % 2 ? MAN2 : MAN);
    fillRR(g, p.x + 6, p.y + 2, 18, 6, 2, MAN); fillRR(g, p.x, p.y + 6, 64, 6, 1.5, MAN); text(g, '201', p.x + 15, p.y + 7.4, 5, 800, '#7A5A22', 'center');
    if (op > 0) { g.save(); g.translate(p.x, p.y + 6); g.rotate(-op * 0.5); fillRR(g, 0, -32, 64, 32, 2, '#FFFFFF'); for (var l = 0; l < 4; l++) fillRR(g, 6, -26 + l * 6, l === 0 ? 30 : 48, 2.4, 1.2, l === 0 ? BLUE : '#C9D3E3'); g.restore(); }
    /* the ID printer: its LED, and a fresh TechNext ID sliding out (tapped, or on the ID stop) */
    var sd = T.side, pt = S.hot === 'id' ? (t % 3) : (t - PR.t), slide = pt < 3 ? clamp(pt * 1.4, 0, 1) : 0;
    fillE(g, sd.x + 92, sd.y - 27, 3, 3, Math.floor(t * 2) % 2 ? '#2BC48A' : '#1E7A55');
    if (slide > 0) { var cy = sd.y - 12 + slide * 2, cxx = sd.x + 30 - slide * 46; g.save(); g.translate(cxx, cy); g.rotate(-0.05 * slide);
      fillRR(g, 0, -4, 60, 38, 4, '#FFFFFF'); fillRR(g, 0, -4, 60, 10, 4, BLUE); g.fillRect(0, 2, 60, 4); CO.plane(g, 8, 1, 0.38, 0, '#FFFFFF', BLUE);
      fillRR(g, 6, 12, 14, 16, 3, '#DCE7FB'); fillE(g, 13, 17, 3.4, 3.4, '#E8BC95'); fillRR(g, 24, 13, 30, 3.5, 1.5, INK); fillRR(g, 24, 20, 22, 3, 1.5, '#9AA6BC'); fillRR(g, 24, 26, 26, 3, 1.5, '#9AA6BC'); g.restore(); }
    /* the clerk's folder, and the one she tosses */
    if (CLK._folder) { var hc = handW(CLK, 1); fillRR(g, hc[0] - 14, hc[1] - 22, 30, 22, 2, MAN); fillRR(g, hc[0] - 10, hc[1] - 25, 10, 4, 1, MAN); }
    var fu = t - FOLD.t; if (fu < 2) { var fx = CLK.x, fyy = CLK.y - 222 * CLK.s - (CLK.hop || 0) * CLK.s - (fu > 0.35 && fu < 1.4 ? Math.sin((fu - 0.35) / 1.05 * Math.PI) * 150 : 0);
      g.save(); g.translate(fx, fyy); g.rotate(fu > 0.35 && fu < 1.4 ? (fu - 0.35) / 1.05 * Math.PI * 2 : 0); fillRR(g, -18, -12, 36, 24, 2, MAN); fillRR(g, -14, -15, 12, 4, 1, MAN2); text(g, '201', 4, 4, 7, 800, '#7A5A22', 'center'); g.restore();
      if (fu > 1.38 && fu < 1.45 && !FOLD.b) { FOLD.b = 1; CR.burst('star', fx, fyy - 20, t); } if (fu > 1.6) FOLD.b = 0; }
    /* the ID officer's card check, and the ID she swings on its lanyard */
    if (ITO._card) { var hi = handW(ITO, 1); idCard(g, hi[0] + 4, hi[1] - 16, 0.6, 0.1); }
    if (ITO._u < 2.4) { var hl = handW(ITO, 1), a = ITO._u < 1.4 ? ITO._u * 12 : Math.PI / 2, lx = hl[0] + Math.cos(a) * 22, ly = hl[1] + Math.sin(a) * 22 + (ITO._u < 1.4 ? 0 : 10);
      g.strokeStyle = BLUE; g.lineWidth = 2.5; g.beginPath(); g.moveTo(hl[0], hl[1]); g.lineTo(lx, ly); g.stroke(); idCard(g, lx, ly + 10, 0.55, ITO._u < 1.4 ? a * 0.2 : 0); }
    /* HR's mug and her stamp */
    if (HR._mug) { var hm = handW(HR, 1); fillRR(g, hm[0] - 6, hm[1] - 14, 12, 14, 3, '#FFFFFF'); fillRR(g, hm[0] - 6, hm[1] - 14, 12, 4, 2, TEAL); }
    if (HR._u < 1.3) { var hh = handW(HR, 1); fillRR(g, hh[0] - 7, hh[1] - 22, 14, 16, 4, '#8E6A47'); fillRR(g, hh[0] - 11, hh[1] - 6, 22, 7, 2, OK); }
    if (HR._u >= 1.3 && HR._u < 2.4) { var ht = handW(HR, 1); fillRR(g, ht[0] - 4, ht[1] - 22, 8, 14, 4, CR.skin[1]); }
    var sa = t - STAMP.t; if (sa < 3) { g.save(); g.globalAlpha = clamp(3 - sa, 0, 1); g.translate(T.desk.x + 176, T.desk.y - 3); fillRR(g, -22, -6, 44, 7, 1, '#FFFFFF'); g.rotate(-0.12); g.strokeStyle = OK; g.lineWidth = 1.8; rr(g, -18, -7, 36, 11, 2); g.stroke(); text(g, 'ON FILE', 0, 1.5, 6, 800, OK, 'center'); g.restore(); }
    /* the applicant's folder and her watch glance */
    if (APP._fold) { var a0 = handW(APP, 0), a1 = handW(APP, 1); g.save(); g.translate((a0[0] + a1[0]) / 2, Math.min(a0[1], a1[1]) - 12); g.rotate(APP._u < 1.6 ? 0.1 : -0.05); fillRR(g, -20, -14, 40, 28, 2, MAN); fillRR(g, -16, -17, 14, 4, 1, MAN2); fillRR(g, -14, -8, 28, 18, 1, '#FFFFFF'); fillRR(g, -10, -4, 18, 2, 1, '#9AA6BC'); fillRR(g, -10, 1, 22, 2, 1, '#C9D3E3'); g.restore(); }
    if (APP._watch) { var aw = handW(APP, 0); fillE(g, aw[0], aw[1] - 4, 4, 4, '#FFFFFF'); g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.arc(aw[0], aw[1] - 4, 4, 0, 7); g.stroke(); }
    /* the new hire's new ID, held high */
    if (HIRE._u < 2.2) { var hn = handW(HIRE, 1); idCard(g, hn[0] + 2, hn[1] - 22, 0.8, Math.sin(t * 8) * 0.08); }
    CR.draw(g, t);
  }

  window.IXW.worlds.team = {
    pan: [-300, 1120],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(49,103,202,.22)',
    glow: {
      sheet: function (g) { var m = T.mon; rr(g, m.x - 12, m.y - 12, m.w + 24, m.h + 24, 10); },
      file: function (g) { var p = T.pile; rr(g, p.x - 10, p.y - 10, 84, 52, 10); },
      cabinet: function (g) { var c = T.cab; rr(g, c.x - 10, c.y - 32, c.w + 20, F - c.y + 36, 12); },
      id: function (g) { var s = T.side; rr(g, s.x - 10, s.y - 56, s.w + 20, 76, 12); },
      offices: function (g) { var b = T.board; rr(g, b.x - 10, b.y - 10, b.w + 20, b.h + 20, 14); },
      journey: function (g) { var s = T.steps; rr(g, s.x - 10, s.y - 10, s.w + 20, s.h + 20, 14); },
      printer: function (g) { var s = T.side; rr(g, s.x + 8, s.y - 48, 104, 52, 10); },
      drawer: function (g) { var c = T.cab; rr(g, c.x - 6, c.y - 6, c.w + 12, 160, 10); }
    },
    backGlow: ['cabinet', 'offices', 'journey', 'drawer'],
    cast: [
      { id: 'clk', behind: true, keys: ['cabinet'], P: CLK, act: actClk },
      { id: 'ito', behind: true, keys: ['id'], P: ITO, act: actIto },
      { id: 'hr', behind: true, keys: ['sheet', 'file'], P: HR, act: actHr },
      { id: 'hire', behind: true, keys: ['id'], P: HIRE, act: actHire }
    ],
    toy: function (name, S, t) { if (name === 'printer') { PR.t = t; CR.burst('star', T.side.x + 20, T.side.y - 20, t); } if (name === 'drawer') { DR.t = t; DR.n = (DR.n + 1) % 6; } },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      function on(P) { return Math.abs(x - P.x) < 60 && y < P.y + 6 && y > P.y - 260; }
      if (S.ext.r > T.photo.x && on(PHOT)) { PHT.t = t; CR.burst('star', PHOT.x - 60, PHOT.y - 230, t); return { say: 'Chin up, smile: your **2×2 photo** for the 201 file!', near: [880, 60], pose: 'love', who: 'HR assistant' }; }
      if (S.ext.r > T.photo.x && on(SIT)) { SITT.t = t; CR.burst('heart', SIT.x, SIT.y - 230, t); return { say: 'First day! My **ID photo** is done.', near: [880, 60], pose: 'celebrate', who: 'New hire' }; }
      if (on(APP)) { APT.t = t; DOOR.t = t; CR.burst('heart', APP.x + 40, APP.y - 250, t); return { say: 'My interview with **HR** is next. My grey visitor pass is on!', near: [-250, 80], pose: 'wow', who: 'Applicant (visitor)' }; }
      if (S.ext.l < -560 && on(ARC)) { ARCT.t = t; CR.burst('spark', ARC.x, ARC.y - 260, t); return { say: 'Every **201 file** has a box in the archive, A to Z.', near: [-420, 80], pose: 'wow', who: 'Records team' }; }
      return null;
    },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
