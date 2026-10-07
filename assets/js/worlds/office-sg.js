/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: office-sg (/offices/singapore) — TechNext's Singapore HQ, 261 Waterloo Street #03-36. The left half of the room is
   the brand-blue feature wall with the TechNext logo, the reception desk and the Odoo Ready Partner plaque; the right half is
   glass onto the Singapore skyline (the bay, the three towers under their sky park, the wheel). In between, the glass-walled
   Discovery Room: a consultant at the whiteboard with a client (visitor pass), a training screen, a door that slides open.
   A sales lead by the window, the coffee machine, the lift to client sites. Everyone on the team wears a TechNext ID.
   Tap anyone, the coffee machine, the sign-in tablet, the room door, the clock or the logo (its plane takes off). */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, WALL = 430, C = CO.C;
  var T = { desk: { x: 150, y: 372, w: 250 }, room: { x: 470, y: 130, w: 340 }, board: { x: 612, y: 196, w: 170, h: 104 }, tv: { x: 488, y: 196, w: 96, h: 62 },
    plaque: { x: 52, y: 214, w: 146, h: 74 }, lift: { x: -150, y: 240, w: 112 }, coffee: { x: -10, y: 330, w: 70 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  /* ---------------- static: the sky and the skyline (behind the glass), then the frame ---------------- */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 270, [[0, '#9CC4F5'], [0.65, '#DCEBFF'], [1, '#FFF3DE']]);
    var sun = g.createRadialGradient(760, 30, 10, 760, 30, 380); sun.addColorStop(0, 'rgba(255,240,200,.75)'); sun.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = sun; g.fillRect(WALL, CEIL, e.r - WALL, F - CEIL);
    CO.skySG(g, WALL - 40, Math.max(e.r, 1500), 262, 300, { mbs: 700, wheel: 520 });
    var lo = g.createLinearGradient(0, 320, 0, F); lo.addColorStop(0, 'rgba(220,232,248,.15)'); lo.addColorStop(1, 'rgba(232,238,248,.92)'); g.fillStyle = lo; g.fillRect(WALL, 320, e.r - WALL, F - 320);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the glass to the right of the feature wall */
    var ge = { l: WALL, r: e.r }; CO.glass(g, ge, CEIL, F, 110, '#EEF2F8', 30);
    /* the feature wall: brand blue with slats, the logo, the address line */
    var fw = g.createLinearGradient(0, CEIL, 0, F); fw.addColorStop(0, '#3A72D6'); fw.addColorStop(1, '#2756B0'); g.fillStyle = fw; g.fillRect(e.l, CEIL, WALL - e.l, F - CEIL);
    g.fillStyle = 'rgba(255,255,255,.06)'; for (var x = Math.floor(e.l / 28) * 28; x < WALL; x += 28) g.fillRect(x, CEIL, 12, F - CEIL);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(WALL - 6, CEIL, 6, F - CEIL);
    CO.plane(g, 150, 56, 4.4, 0, '#FFFFFF', '#2E63C4'); text(g, 'TechNext', 310, 76, 44, 800, '#FFFFFF', 'center');
    text(g, 'SINGAPORE HQ  ·  #03-36', 310, 102, 11, 800, 'rgba(255,255,255,.75)', 'center');
    /* the ceiling with pendant lamps, the floor in warm planks */
    CO.ceiling(g, e, CEIL, '#E8EDF5', '#F8FAFD', '#FFFFFF');
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#EADFCC'); fl.addColorStop(1, '#D8C6AA'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(120,80,40,.14)'; g.lineWidth = 2; g.beginPath(); for (var d = 1; d < 9; d++) { var yy = F + Math.pow(d / 8, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke();
    g.fillStyle = 'rgba(40,70,120,.12)'; g.fillRect(e.l, F, e.r - e.l, 6);
    /* a runner rug from the lift to reception */
    g.fillStyle = 'rgba(49,103,202,.16)'; g.beginPath(); g.moveTo(-120, F + 18); g.lineTo(420, F + 18); g.lineTo(470, F + 90); g.lineTo(-170, F + 90); g.closePath(); g.fill();
    g.restore();
  }

  /* ---------------- static back props ---------------- */
  function pendant(g, x, len) { g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, CEIL); g.lineTo(x, CEIL + len); g.stroke(); g.fillStyle = '#1B1F3B'; g.beginPath(); g.moveTo(x - 20, CEIL + len + 18); g.lineTo(x - 8, CEIL + len); g.lineTo(x + 8, CEIL + len); g.lineTo(x + 20, CEIL + len + 18); g.closePath(); g.fill(); fillE(g, x, CEIL + len + 19, 12, 3.5, '#FFE9A8'); }
  function paintBack(g, ext) {
    [210, 300, 390].forEach(function (x) { pendant(g, x, 150); });
    /* the Odoo Ready Partner plaque on the feature wall */
    var pq = T.plaque; CO.plaque(g, pq.x, pq.y, pq.w, pq.h, 'Ready Partner', 'TechNext Pte. Ltd.', C.odoo); text(g, 'ODOO', pq.x + pq.w / 2, pq.y + 13, 9, 800, '#FFFFFF', 'center');
    /* the lift to client sites */
    var lf = T.lift; if (ext.l < lf.x + lf.w) { soft(g, lf.x + lf.w / 2, F + 4, 70, 8, 0.2); fillRR(g, lf.x - 10, lf.y - 10, lf.w + 20, F - lf.y + 10, 6, '#C9D1DD'); fillRR(g, lf.x, lf.y, lf.w, F - lf.y, 3, '#AEB8C8');
      fillRR(g, lf.x - 6, lf.y - 46, lf.w + 12, 26, 6, '#1B1F3B'); text(g, 'LIFT  ·  TO CLIENT SITES', lf.x + lf.w / 2, lf.y - 29, 8, 800, '#FFFFFF', 'center');
      fillRR(g, lf.x + lf.w + 16, lf.y + 90, 16, 40, 8, '#1B1F3B'); }
    /* the coffee machine on its counter */
    var cf = T.coffee; soft(g, cf.x + 35, F + 4, 60, 7, 0.2); fillRR(g, cf.x - 20, cf.y + 60, cf.w + 40, F - cf.y - 60, 6, '#F4F7FC'); fillRR(g, cf.x - 24, cf.y + 52, cf.w + 48, 10, 4, '#C9A27A');
    fillRR(g, cf.x, cf.y - 30, cf.w, 82, 10, '#2A3550'); fillRR(g, cf.x + 10, cf.y - 20, cf.w - 20, 20, 4, '#3A4458'); fillE(g, cf.x + cf.w - 16, cf.y - 10, 4, 4, '#7FE3C4'); fillRR(g, cf.x + 22, cf.y + 12, 26, 6, 2, '#5C6B7A');
    /* the Discovery Room: its back wall (a whiteboard and the training screen) */
    var rm = T.room; g.fillStyle = 'rgba(244,247,252,.92)'; g.fillRect(rm.x, rm.y, rm.w, F - rm.y);
    var b = T.board; shadowed(g, 8, 3, 0.14, function () { fillRR(g, b.x, b.y, b.w, b.h, 5, '#FFFFFF'); }); g.strokeStyle = '#C9D1DD'; g.lineWidth = 2; rr(g, b.x, b.y, b.w, b.h, 5); g.stroke();
    text(g, 'DISCOVERY · HOW AN ORDER MOVES', b.x + 10, b.y + 15, 6.8, 800, C.blueD);
    var tv = T.tv; fillRR(g, tv.x - 4, tv.y - 4, tv.w + 8, tv.h + 8, 5, '#1B1F3B');
    text(g, 'DISCOVERY ROOM', rm.x + rm.w / 2, rm.y + 26, 9, 800, C.ink, 'center');
    /* the window bench and plants on the glass side */
    K.plant(g, { x: 900, y: F }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 440, y: F }, '#3167CA', '#4F7FD8');
    /* beyond: a sofa on the far right */
    if (ext.r > 1000) { soft(g, 1080, F + 4, 100, 9, 0.22); fillRR(g, 1000, 400, 170, 50, 16, '#5E7BB5'); fillRR(g, 994, 386, 30, 72, 12, '#4F6CA8'); fillRR(g, 1146, 386, 30, 72, 12, '#4F6CA8'); fillRR(g, 1030, 392, 44, 30, 10, '#FFD84A'); }
  }
  /* ---------------- static front props: the reception desk, the room's glass and its table ---------------- */
  function paintFront(g, ext) {
    var d = T.desk; soft(g, d.x + d.w / 2, F + 4, d.w * 0.55, 10, 0.24);
    fillRR(g, d.x, d.y, d.w, F - d.y, 16, '#FFFFFF'); fillRR(g, d.x - 8, d.y - 8, d.w + 16, 14, 6, '#E3E9F3'); fillRR(g, d.x, d.y + 40, d.w, 10, 0, C.blue);
    text(g, 'RECEPTION', d.x + d.w / 2, d.y + 74, 11, 800, C.blueD, 'center');
    /* an orchid in a vase, a bell, the sign-in tablet (its screen is live) */
    var ox = d.x + 30, oy = d.y - 8; fillRR(g, ox - 10, oy - 22, 20, 22, 4, '#FFFFFF'); g.strokeStyle = '#2E9E66'; g.lineWidth = 2; g.beginPath(); g.moveTo(ox, oy - 22); g.quadraticCurveTo(ox + 4, oy - 60, ox + 16, oy - 70); g.stroke();
    [[ox + 6, oy - 52], [ox + 12, oy - 62], [ox + 18, oy - 70], [ox - 2, oy - 44]].forEach(function (p) { fillE(g, p[0], p[1], 6, 5, '#B05FC9'); fillE(g, p[0], p[1], 2, 2, '#FFE07A'); });
    fillE(g, d.x + 70, d.y - 10, 9, 6, '#D9B14A'); fillE(g, d.x + 70, d.y - 16, 2.5, 2.5, '#D9B14A');
    fillRR(g, d.x + 178, d.y - 40, 46, 34, 4, '#2A3550');
    /* the Discovery Room: glass front with frame, a table, the door rail */
    var rm = T.room; fillRR(g, rm.x + 60, 392, 230, 10, 4, '#C9A27A'); g.fillStyle = '#A9825C'; g.fillRect(rm.x + 80, 402, 6, F - 402); g.fillRect(rm.x + 264, 402, 6, F - 402);
    [[rm.x + 98, '#3167CA'], [rm.x + 210, '#FFFFFF']].forEach(function (p) { fillRR(g, p[0], 378, 34, 14, 3, p[1]); });
  }

  /* ---------------- the people: the TechNext team (and one client), semi-casual, every staff member with a TechNext ID ---------------- */
  var W = CR.who;
  var REC = W({ x: 268, y: 470, s: 0.54, ph: 0.3, skin: 1, hair: 0, style: 'bun', clip: '#FFD84A', outfit: 'shirt', top: '#DCE7FB', headset: '#3167CA', feet: false, hands: [[-60, -200], [64, -200]] });
  var CON = W({ x: 726, y: 470, s: 0.5, ph: 1.1, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#14A38B', glasses: true, hands: [[-120, -300], [62, -190]], look: -0.4 });
  var CLI = W({ x: 588, y: 500, s: 0.5, ph: 2.2, skin: 0, hair: 2, style: 'bob', outfit: 'cardigan', top: '#E9D7C0', top2: '#E0456B', id: '#F2B233', feet: false, hands: [[-60, -200], [60, -200]], look: 0.6 });
  var SAL = W({ x: 846, y: 470, s: 0.54, ph: 2.9, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#F2B233', glasses: true, hold: 'tablet', hands: [[-60, -205], [70, -150]], look: -0.6 });
  var CREW = [
    { x0: -160, x1: 120, y: 488, spd: 18, ph: 0.4, label: 'Consultant, off to a client site', lines: ['Off to a **client site** in town. On-site days are the best days.', 'Laptop, ID, umbrella. **Singapore weather!**'], acts: ['wave', 'id', 'jump'],
      P: W({ s: 0.5, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#1E4691', hold: 'bags' }) },
    { front: true, x0: -170, x1: 420, y: 690, spd: 22, ph: 0.7, label: 'Project manager', lines: ['Discovery at ten, **training** at two.', 'One page, one plan, **one team**.'], acts: ['cheer', 'spin', 'id'],
      P: W({ s: 0.58, skin: 1, hair: 0, style: 'long', outfit: 'shirt', top: '#E0456B', hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) }
  ];

  /* ---------------- live ---------------- */
  var LOGO = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the wall clock on Singapore time; tapped, its hands spin once round */
    var ct = t - (S.toy.clock != null ? S.toy.clock : -9); g.save(); if (ct < 1.2) { g.translate(380, -10); g.rotate(Math.sin(ct * 20) * 0.08 * (1.2 - ct)); g.translate(-380, 10); } CO.clock(g, 380, -10, 24, 8, C.blue); g.restore();
    text(g, 'SGT', 380, 26, 8, 800, '#FFFFFF', 'center');
    /* the logo's plane: tapped, it takes off, loops the room and lands back on the wall */
    var lt = t - LOGO.t; if (lt > 3.4) { } else { var u = lt / 3.4, a = u * Math.PI * 2, px = 150 + Math.sin(a) * 380, py = 56 - Math.sin(a * 0.5) * 120 - Math.sin(a) * 30; g.save(); g.globalAlpha = 0.95;
      CO.plane(g, px, py, 3.2, Math.cos(a) * 0.6, '#FFFFFF', '#2E63C4'); g.strokeStyle = 'rgba(255,255,255,.6)'; g.setLineDash([4, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(px - 30, py + 10); g.lineTo(px - 90, py + 30); g.stroke(); g.setLineDash([]); g.restore(); }
    /* the whiteboard: sticky notes; on Discovery (or tapped) they line up and the apps light */
    var b = T.board, dk = S.hot === 'discovery', dp = dk ? clamp((t - (S.dT || 0)) / 1.6, 0, 1) : 1;
    [['Quote', '#FFE680', '#3167CA'], ['Order', '#FFC2D1', '#3167CA'], ['Deliver', '#B8EBD3', '#14A38B'], ['Bill', '#C4DAFB', '#714B67']].forEach(function (n, i) {
      var nx = b.x + 12 + i * 39, ny = b.y + 26 + (dk ? (1 - dp) * (i % 2 ? 14 : -6) : (i % 2) * 5); fillRR(g, nx, ny, 33, 28, 2, n[1]); text(g, n[0], nx + 16.5, ny + 17, 6.5, 800, C.ink, 'center');
      fillE(g, nx + 16.5, b.y + 76, 8, 8, (!dk || dp > i / 4) ? n[2] : '#E3E8EF'); });
    text(g, '14 steps · 6 apps', b.x + 12, b.y + 98, 7, 800, C.ink);
    /* the training screen pages through a lesson */
    var tv = T.tv, pg = S.hot === 'training' ? Math.floor((t - (S.tT || 0)) / 1.1) % 3 : Math.floor(t / 3) % 3; fillRR(g, tv.x, tv.y, tv.w, tv.h, 2, '#FFFFFF');
    text(g, 'TRAINING · SALES', tv.x + 6, tv.y + 11, 5.8, 800, C.blueD); ['#3167CA', '#14A38B', '#714B67'].forEach(function (c, i) { fillRR(g, tv.x + 8 + i * 28, tv.y + 18, 22, 22, 3, i <= pg ? c : '#E3E8EF'); });
    fillRR(g, tv.x + 8, tv.y + 48, tv.w - 16, 4, 2, '#E3E8EF'); fillRR(g, tv.x + 8, tv.y + 48, (tv.w - 16) * (pg + 1) / 3, 4, 2, C.sg);
    /* the coffee machine: steam, and a cup pours when tapped */
    var cf = T.coffee, br = t - (S.toy.coffee != null ? S.toy.coffee : -9); fillRR(g, cf.x + 26, cf.y + 30, 18, 20, 4, '#FFFFFF');
    if (br < 2.6) { g.fillStyle = '#6B4329'; g.fillRect(cf.x + 33, cf.y + 18, 4, Math.min(14, br * 20)); fillRR(g, cf.x + 28, cf.y + 44 - Math.min(10, br * 5), 14, Math.min(10, br * 5), 2, '#8A5A3B'); }
    for (var s2 = 0; s2 < 3; s2++) { var sy2 = ((t * 18 + s2 * 12) % 36); g.globalAlpha = (1 - sy2 / 36) * (br < 2.6 ? 0.8 : 0.35); fillE(g, cf.x + 35 + Math.sin(t * 2 + s2) * 3, cf.y + 24 - sy2, 4, 4, '#FFFFFF'); } g.globalAlpha = 1;
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    var d = T.desk, si = t - (S.toy.signin != null ? S.toy.signin : -9);
    /* the sign-in tablet: tapped, it prints a visitor pass */
    fillRR(g, d.x + 181, d.y - 37, 40, 28, 2, si < 3 ? '#E6F6F2' : '#FFFFFF'); text(g, si < 3 ? 'WELCOME!' : 'SIGN IN', d.x + 201, d.y - 19, 6, 800, si < 3 ? '#0E7A50' : C.blueD, 'center');
    if (si < 3) { var py = Math.min(1, si * 1.6); g.save(); g.translate(d.x + 236, d.y - 10 - py * 40); g.rotate(-0.15); fillRR(g, -16, -20, 32, 42, 4, '#FFFFFF'); fillRR(g, -16, -20, 32, 10, 4, '#F2B233'); text(g, 'VISITOR', 0, -12, 5, 800, '#1B1F3B', 'center'); fillRR(g, -9, -4, 10, 12, 2, '#C9D6EE'); g.restore(); }
    /* the Discovery Room glass: panes over whoever is inside, the frame, the sliding door */
    var rm = T.room, dr = t - (S.toy.door != null ? S.toy.door : -9), open = dr < 3 ? Math.min(1, dr * 2.2) * (dr > 2.4 ? (3 - dr) / 0.6 : 1) : 0;
    g.fillStyle = 'rgba(214,232,250,.22)'; g.fillRect(rm.x + 70 + open * 0, rm.y + 10, rm.w - 70, F - rm.y - 10);
    g.fillStyle = 'rgba(255,255,255,.35)'; [0, 1].forEach(function (k2) { var gx = rm.x + 120 + k2 * 140; g.beginPath(); g.moveTo(gx, F); g.lineTo(gx + 30, rm.y + 10); g.lineTo(gx + 44, rm.y + 10); g.lineTo(gx + 14, F); g.closePath(); g.fill(); });
    g.fillStyle = '#E3E9F3'; g.fillRect(rm.x, rm.y, rm.w, 10); g.fillRect(rm.x + rm.w - 6, rm.y, 6, F - rm.y); g.fillRect(rm.x, rm.y, 6, F - rm.y);
    var dx = rm.x + 6 + open * 60; g.fillStyle = 'rgba(214,232,250,.38)'; g.fillRect(dx, rm.y + 10, 64, F - rm.y - 10); fillRR(g, dx + 52, 300, 5, 40, 2, '#9AA6BC');
    fillRR(g, rm.x + rm.w / 2 - 70, 250, 140, 18, 9, 'rgba(255,255,255,.9)'); fillE(g, rm.x + rm.w / 2 - 56, 259, 4, 4, S.hot === 'discovery' || dr < 3 ? '#E2453C' : '#2BC48A'); text(g, S.hot === 'discovery' ? 'WORKSHOP IN PROGRESS' : 'DISCOVERY ROOM · FREE', rm.x + rm.w / 2 + 6, 262, 6.2, 800, C.ink, 'center');
    CR.draw(g, t);
  }

  function FORE() {
    return [[700, function (g, ext) { if (ext.l < -40) { soft(g, -80, 706, 60, 7, 0.2); fillRR(g, -120, 660, 80, 44, 18, '#FFD84A'); fillRR(g, -114, 648, 68, 22, 11, '#FFE27A'); } }]];
  }

  window.IXW.worlds['office-sg'] = {
    pan: [-170, 1000],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t, par, S) { var ext = S.ext, span = ext.r - WALL + 300;
      for (var c = 0; c < 4; c++) { var x = WALL - 150 + ((K.hash(c + 4) * span + t * (4 + c * 1.6)) % span) - par * (2 + c); K.cloud(g, x, -110 + c * 34, 0.26 + K.hash(c) * 0.1); }
      var bx = WALL + ((t * 5) % 700); fillRR(g, bx, 300, 26, 5, 2, '#FFFFFF'); fillRR(g, bx + 7, 295, 10, 5, 2, '#3167CA'); },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      welcome: function (g) { var d = T.desk; rr(g, d.x - 14, d.y - 50, d.w + 28, F - d.y + 56, 18); },
      discovery: function (g) { var b = T.board; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 10); },
      training: function (g) { var v = T.tv; rr(g, v.x - 10, v.y - 10, v.w + 20, v.h + 20, 10); },
      quote: function (g) { rr(g, 820, 240, 90, 190, 30); },
      onsite: function (g) { var l = T.lift; rr(g, l.x - 16, l.y - 54, l.w + 52, F - l.y + 58, 12); },
      partner: function (g) { var p = T.plaque; rr(g, p.x - 8, p.y - 8, p.w + 16, p.h + 16, 14); },
      coffee: function (g) { var c = T.coffee; rr(g, c.x - 8, c.y - 38, c.w + 16, 100, 12); },
      clock: function (g) { rr(g, 350, -40, 60, 74, 20); },
      door: function (g) { var r = T.room; rr(g, r.x - 4, r.y - 4, 80, F - r.y + 8, 8); },
      signin: function (g) { var d = T.desk; rr(g, d.x + 172, d.y - 46, 60, 46, 8); },
      logo: function (g) { rr(g, 90, 10, 340, 104, 20); }
    },
    backGlow: ['discovery', 'training', 'onsite', 'partner', 'coffee', 'clock', 'logo'],
    cast: [
      { id: 'rec', behind: true, keys: ['welcome'], P: REC, act: function (P, t, S) { var st = S.cast.rec; P.talk = t < st.until; P.mood = P.talk || S.hot === 'welcome' ? 'happy' : 'calm';
        P.hands = [[-60, -200], [64, -200 - (S.hot === 'welcome' ? Math.abs(Math.sin(t * 6)) * 20 : 0)]]; P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08); CR.cast(P, st, t, ['wave', 'id', 'love', 'jump', 'nod']); } },
      { id: 'cli', behind: true, keys: ['discovery'], P: CLI, act: function (P, t, S) { var st = S.cast.cli; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-60, -200 - (S.hot === 'discovery' ? Math.abs(Math.sin(t * 3)) * 10 : 0)], [60, -200]]; P.look = lerp(P.look, 0.7, 0.08); CR.cast(P, st, t, ['nod', 'think', 'love', 'wave']); } },
      { id: 'con', behind: true, keys: ['discovery', 'training'], P: CON, act: function (P, t, S) { var st = S.cast.con, busy = S.hot === 'discovery'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-140 + Math.sin(t * 3) * 16, -330], [62, -190]] : [[-110, -280 + Math.sin(t * 1.3) * 6], [62, -190]]; P.look = lerp(P.look, busy ? -0.8 : -0.4, 0.08); CR.cast(P, st, t, ['wave', 'id', 'spin', 'cheer', 'jump']); } },
      { id: 'sal', behind: false, keys: ['quote'], P: SAL, act: function (P, t, S) { var st = S.cast.sal; P.talk = t < st.until || S.hot === 'quote'; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-60, -205], [70, -150]]; P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08); CR.cast(P, st, t, ['id', 'wave', 'jump', 'dance', 'spin']); } }
    ],
    toy: function (name, S, t, btn) {
      if (name === 'clock' && btn) btn.setAttribute('data-say', CO.timeLine(8, 'Singapore', 'the same time as our Taguig City hub. Ho Chi Minh City is an hour behind.'));
      if (name === 'logo') LOGO.t = t;
    },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { if (key === 'discovery') S.dT = t; if (key === 'training') S.tT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
