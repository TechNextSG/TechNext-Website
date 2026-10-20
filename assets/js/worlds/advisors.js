/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: advisors (/advisers) — the advisory room on a calm, bright morning, where every TechNext project starts with a
   conversation. The mobile whiteboard with a hand-drawn process map (Order -> Stock -> Invoice, one step circled in red,
   "keep" and "change" notes) and the adviser beside it with a marker; the round table with a client and a finance adviser
   talking (a notepad, a coffee, the written recommendation folder standing between them, the laptop with an Odoo screen,
   a ledger); a tall window onto the Singapore skyline; the pinboard with the six advisory practices; a low credenza with
   the support phone, a coffee flask and mugs. A pendant lamp over the table. Margins: the playbook shelf on the left, the
   three offices board and a water cooler on the right. Foreground: plants.
   Everyone has their own idle loop and tap choreography; all of them wear the blue TechNext ID. Seated people show chair,
   legs and feet. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, NAVY = '#1B2350', BLUE = '#3167CA', BLUE2 = '#4A80E2', TEAL = '#14A38B', SLATE = '#2A3550', OAK = '#D9B48A', OAK2 = '#B98E62', RED = '#E2453C', Y = '#FFD84A', PUR = '#714B67', GREEN = '#2BC48A';
  var bell = COL.bell, ease = COL.ease;
  var T = { board: { x: 236, y: 96, w: 232, h: 200 }, win: { x: 520, y: -64, w: 212, b: 232 }, pin: { x: 764, y: -44, w: 206, h: 214 },
    table: { x: 656, y: 380, r: 132 }, cred: { x: 796, y: 388, w: 168 }, phone: { x: 832 }, pot: { x: 902 }, lamp: { x: 656, y: 112 },
    folder: { x: 659 }, laptop: { x: 760 }, shelf: { x: -250 }, offices: { x: 1040 } };
  /* the six advisory practices on the pinboard: label lines, colour */
  var PRAC = [['Finance &', 'accounting', BLUE], ['Sales, CRM', '& service', TEAL], ['Supply chain', '& inventory', '#E07B12'],
    ['Manufacturing', '& projects', PUR], ['AI &', 'automation', '#3FA9E0'], ['Website', '& brand', '#E0456B']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  /* a small glyph per practice, drawn in white on the card's colour band, centred at 0,0 */
  function glyph(g, i) {
    g.fillStyle = '#FFFFFF'; g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.lineCap = 'round'; g.lineJoin = 'round';
    if (i === 0) { fillRR(g, -6, -7, 12, 14, 1.5, '#FFFFFF'); g.fillStyle = BLUE; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) g.fillRect(-4 + c * 3, -3 + r * 3, 2, 2); g.fillRect(-4, -5.5, 8, 1.6); }
    else if (i === 1) { g.beginPath(); g.moveTo(-7, 5); g.lineTo(-2, 0); g.lineTo(1, 3); g.lineTo(7, -4); g.stroke(); g.beginPath(); g.moveTo(3, -4); g.lineTo(7, -4); g.lineTo(7, 0); g.stroke(); }
    else if (i === 2) { fillRR(g, -7, -2, 7, 8, 1, '#FFFFFF'); fillRR(g, 1, -2, 7, 8, 1, '#FFFFFF'); fillRR(g, -3, -9, 7, 6, 1, '#FFFFFF'); }
    else if (i === 3) { g.beginPath(); g.arc(0, 0, 5, 0, 7); g.stroke(); for (var a = 0; a < 6; a++) { var an = a * Math.PI / 3; g.beginPath(); g.moveTo(Math.cos(an) * 5, Math.sin(an) * 5); g.lineTo(Math.cos(an) * 8, Math.sin(an) * 8); g.stroke(); } }
    else if (i === 4) { g.beginPath(); g.moveTo(0, -8); g.lineTo(2, -2); g.lineTo(8, 0); g.lineTo(2, 2); g.lineTo(0, 8); g.lineTo(-2, 2); g.lineTo(-8, 0); g.lineTo(-2, -2); g.closePath(); g.fill(); }
    else { g.strokeRect(-7, -6, 14, 11); g.beginPath(); g.moveTo(-7, -3); g.lineTo(7, -3); g.stroke(); fillE(g, -5, -4.6, 0.8, 0.8, '#FFFFFF'); }
  }
  /* a standing document folder (the written recommendation), its base centred at 0,0; open 0..1 slides the top sheet up */
  function folder(g, open) {
    fillRR(g, -25, -36, 50, 36, 3, '#E3E9F2');
    if (open > 0) { var up = open * 22; g.save(); g.translate(0, -up); fillRR(g, -20, -40, 40, 36, 2, '#FFFFFF'); g.strokeStyle = 'rgba(30,60,110,.18)'; g.lineWidth = 0.8; g.strokeRect(-20, -40, 40, 36);
      text(g, 'Scope v1', -16, -31, 5.6, 800, NAVY); g.fillStyle = '#C9D3E3'; for (var l = 0; l < 4; l++) g.fillRect(-16, -27 + l * 4.4, l % 2 ? 22 : 30, 1.6);
      g.strokeStyle = GREEN; g.lineWidth = 1.4; g.beginPath(); g.moveTo(9, -14); g.lineTo(11, -11.5); g.lineTo(16, -17); g.stroke(); g.restore(); }
    fillRR(g, -27, -32, 54, 32, 3, NAVY); fillRR(g, -27, -32, 54, 5, 2, BLUE);
    fillRR(g, -21, -22, 42, 14, 2, '#FFFFFF'); text(g, 'RECOMMENDATION', 0, -16.4, 4.6, 800, NAVY, 'center'); text(g, 'written · yours to keep', 0, -10.6, 3.6, 700, '#5C6B7A', 'center');
    CO.plane(g, -20, -4, 0.32, 0, Y);
  }

  /* ------------------------------------------------------------ the room (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the sky behind the window */
    CO.sky(g, e, e.t, T.win.b, [[0, '#8EC5EE'], [0.7, '#CDE6F8'], [1, '#EEF7FD']]);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), w = T.win;
    /* the Singapore skyline in the window (static); the clouds drift live behind the glass */
    g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.b - w.y); g.clip(); CO.skySG(g, w.x - 20, w.x + w.w + 20, w.b - 22, w.b, { mbs: w.x + 96, wheel: w.x + 34, trees: true }); g.restore();
    /* the wall: a calm off-white with a cut-out for the window */
    g.save(); g.beginPath(); g.rect(e.l, e.t, e.r - e.l, F - e.t); g.rect(w.x + w.w, w.y, -w.w, w.b - w.y); g.clip('evenodd');
    var wg = g.createLinearGradient(0, e.t, 0, F); wg.addColorStop(0, '#F8F9FC'); wg.addColorStop(1, '#ECF0F6'); g.fillStyle = wg; g.fillRect(e.l, e.t, e.r - e.l, F - e.t);
    /* the ceiling: white, a recessed light strip */
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, e.t, e.r - e.l, -122 - e.t); g.fillStyle = 'rgba(30,60,110,.07)'; g.fillRect(e.l, -124, e.r - e.l, 4);
    for (var lx = Math.floor(e.l / 220) * 220; lx < e.r; lx += 220) fillRR(g, lx + 60, -136, 100, 6, 3, '#E6ECF5');
    /* the lower wall: soft blue panels to an oak rail */
    g.fillStyle = '#E4EAF3'; g.fillRect(e.l, 302, e.r - e.l, F - 302); g.strokeStyle = 'rgba(49,103,202,.10)'; g.lineWidth = 1.5;
    for (var pn = Math.floor(e.l / 120) * 120; pn < e.r; pn += 120) { rr(g, pn + 10, 316, 100, F - 330, 4); g.stroke(); }
    g.fillStyle = OAK2; g.fillRect(e.l, 296, e.r - e.l, 6); g.fillStyle = OAK; g.fillRect(e.l, 294, e.r - e.l, 3);
    g.restore();
    /* the window frame: white mullion and transom, a sill, a half-drawn roller blind */
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(w.x - 2, w.y - 2, w.w + 4, w.b - w.y + 4); g.lineWidth = 4; g.beginPath(); g.moveTo(w.x + w.w / 2, w.y); g.lineTo(w.x + w.w / 2, w.b); g.moveTo(w.x, 40); g.lineTo(w.x + w.w, 40); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(w.x + 14, w.b); g.lineTo(w.x + 50, w.y); g.lineTo(w.x + 66, w.y); g.lineTo(w.x + 30, w.b); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(w.x + 120, w.b); g.lineTo(w.x + 150, w.y); g.lineTo(w.x + 158, w.y); g.lineTo(w.x + 128, w.b); g.closePath(); g.fill();
    fillRR(g, w.x - 6, w.y - 12, w.w + 12, 12, 4, '#DCE3EE'); g.fillStyle = 'rgba(244,247,252,.94)'; g.fillRect(w.x, w.y, w.w, 26); g.fillStyle = 'rgba(30,60,110,.08)'; for (var bl = 0; bl < 4; bl++) g.fillRect(w.x, w.y + 5 + bl * 6, w.w, 1);
    fillRR(g, w.x + w.w / 2 - 8, w.y + 26, 16, 4, 2, '#C9D2DE');
    fillRR(g, w.x - 10, w.b + 2, w.w + 20, 10, 3, '#FFFFFF'); g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(w.x - 10, w.b + 12, w.w + 20, 3);
    /* the floor: pale oak, a round rug under the table */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E9DDCB'); fl.addColorStop(1, '#D8C6AB'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(150,110,70,.14)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 9; d++) { var yy = F + Math.pow(d / 8, 1.4) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); } g.stroke();
    g.fillStyle = 'rgba(80,60,40,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.save(); g.translate(T.table.x, 506); g.scale(1, 0.18); fillE(g, 0, 0, 250, 200, '#DCE5F2'); g.lineWidth = 9; g.strokeStyle = 'rgba(49,103,202,.35)'; g.beginPath(); g.ellipse(0, 0, 226, 178, 0, 0, 7); g.stroke(); g.restore();
    [[300, F + 70, 200], [-300, F + 60, 220], [1120, F + 60, 220]].forEach(function (p) { g.save(); g.globalAlpha = 0.35; fillE(g, p[0], p[1], p[2], 24, '#FFFFFF'); g.restore(); });
    g.restore();
  }
  function paintBack(g, ext) {
    /* the room sign, over the whiteboard */
    shadowed(g, 12, 5, 0.16, function () { fillRR(g, 262, -22, 180, 40, 20, '#FFFFFF'); }); g.lineWidth = 2.5; g.strokeStyle = BLUE; rr(g, 267, -17, 170, 30, 15); g.stroke();
    CO.plane(g, 290, -2, 1.1, 0, BLUE); text(g, 'ADVISORY ROOM', 306, 3, 13, 800, NAVY);
    /* the mobile whiteboard: an aluminium frame on two legs with castors */
    var b = T.board; soft(g, b.x + b.w / 2, F + 4, b.w * 0.5, 8, 0.25);
    [b.x + 22, b.x + b.w - 26].forEach(function (lx) { fillRR(g, lx, b.y + b.h, 5, F - b.y - b.h - 8, 2, '#AEB8C8'); fillRR(g, lx - 14, F - 10, 32, 5, 2.5, '#9AA6BC'); fillE(g, lx - 10, F - 2, 4, 4, SLATE); fillE(g, lx + 14, F - 2, 4, 4, SLATE); });
    shadowed(g, 14, 6, 0.2, function () { fillRR(g, b.x - 5, b.y - 5, b.w + 10, b.h + 10, 6, '#C9D2DE'); }); fillRR(g, b.x, b.y, b.w, b.h, 3, '#FFFFFF');
    g.fillStyle = 'rgba(190,210,235,.18)'; g.beginPath(); g.moveTo(b.x + 150, b.y); g.lineTo(b.x + 190, b.y); g.lineTo(b.x + 120, b.y + b.h); g.lineTo(b.x + 80, b.y + b.h); g.closePath(); g.fill();
    fillRR(g, b.x + 20, b.y + b.h + 2, b.w - 40, 6, 2, '#AEB8C8'); COL.marker(g, b.x + 60, b.y + b.h + 2, Math.PI / 2, BLUE); COL.marker(g, b.x + 84, b.y + b.h + 2, Math.PI / 2, RED); COL.marker(g, b.x + 106, b.y + b.h + 2, Math.PI / 2, TEAL);
    /* the process map, hand-drawn in blue marker */
    text(g, 'HOW AN ORDER MOVES TODAY', b.x + 16, b.y + 22, 9, 800, NAVY);
    g.strokeStyle = BLUE; g.lineWidth = 1.2; g.beginPath(); g.moveTo(b.x + 16, b.y + 27); g.quadraticCurveTo(b.x + 90, b.y + 30, b.x + 170, b.y + 26); g.stroke();
    var BX = [b.x + 16, b.x + 89, b.x + 162], LB = ['Order', 'Stock', 'Invoice'];
    BX.forEach(function (x, i) { g.save(); g.translate(x + 27, b.y + 62); g.rotate((hash(i + 4) - 0.5) * 0.04); g.strokeStyle = BLUE; g.lineWidth = 2; rr(g, -27, -16, 54, 32, 5); g.stroke(); text(g, LB[i], 0, 4, 10, 800, NAVY, 'center'); g.restore();
      if (i < 2) { var ax = x + 58, bx2 = x + 70; g.strokeStyle = BLUE; g.lineWidth = 2; g.beginPath(); g.moveTo(ax, b.y + 62); g.lineTo(bx2, b.y + 62); g.moveTo(bx2 - 5, b.y + 57); g.lineTo(bx2, b.y + 62); g.lineTo(bx2 - 5, b.y + 67); g.stroke(); } });
    /* a hand-written aside under the circled step, and the keep / change notes */
    text(g, 'typed twice?', b.x + 116, b.y + 98, 8, 700, RED, 'center');
    g.strokeStyle = RED; g.lineWidth = 1.2; g.beginPath(); g.moveTo(b.x + 116, b.y + 88); g.lineTo(b.x + 116, b.y + 82); g.stroke();
    COL.note(g, b.x + 40, b.y + 136, 38, -0.06, '#D7F2E7', 'KEEP', '#0E6B55'); COL.note(g, b.x + 86, b.y + 140, 38, 0.05, '#FFE680', 'CHANGE', '#7A5A00');
    g.save(); g.translate(b.x + 172, b.y + 138); g.rotate(-0.03); fillRR(g, -44, -18, 88, 36, 3, '#EEF3FC'); g.strokeStyle = 'rgba(49,103,202,.4)'; g.lineWidth = 1; rr(g, -44, -18, 88, 36, 3); g.stroke();
    text(g, 'Standard first,', 0, -4, 7.6, 800, NAVY, 'center'); text(g, 'custom only if needed', 0, 8, 6.4, 700, BLUE, 'center'); g.restore();
    text(g, 'Listen  →  Advise  →  Implement  →  Stay', b.x + b.w / 2, b.y + b.h - 14, 7.6, 800, '#5C6B7A', 'center');
    /* the pinboard: cork in a navy frame, six practice cards */
    var p = T.pin; shadowed(g, 14, 6, 0.18, function () { fillRR(g, p.x - 6, p.y - 6, p.w + 12, p.h + 12, 8, NAVY); }); fillRR(g, p.x, p.y, p.w, p.h, 4, '#E9D2AE');
    g.fillStyle = 'rgba(150,110,70,.10)'; for (var ck = 0; ck < 90; ck++) g.fillRect(p.x + hash(ck) * p.w, p.y + hash(ck + 50) * p.h, 2, 2);
    fillRR(g, p.x + p.w / 2 - 74, p.y - 14, 148, 24, 12, NAVY); text(g, 'SIX ADVISORY PRACTICES', p.x + p.w / 2, p.y + 2, 8.4, 800, Y, 'center');
    PRAC.forEach(function (c, i) { var cx = p.x + 37 + (i % 3) * 66, cy = p.y + 24 + Math.floor(i / 3) * 96; g.save(); g.translate(cx, cy); g.rotate((hash(i * 7 + 1) - 0.5) * 0.06);
      g.fillStyle = 'rgba(40,30,20,.14)'; g.fillRect(-26, 2, 56, 80); fillRR(g, -28, 0, 56, 80, 3, '#FFFFFF'); fillRR(g, -28, 0, 56, 26, 3, c[2]); g.fillStyle = c[2]; g.fillRect(-28, 18, 56, 8);
      g.save(); g.translate(0, 13); glyph(g, i); g.restore();
      text(g, c[0], 0, 41, 7.2, 800, NAVY, 'center'); text(g, c[1], 0, 51, 7.2, 800, NAVY, 'center');
      g.fillStyle = '#D5DDEA'; g.fillRect(-18, 60, 36, 2); g.fillRect(-14, 66, 28, 2); fillE(g, 0, 2, 3.2, 3.2, RED); g.restore(); });
    /* the credenza under the pinboard: oak top, navy doors */
    var cr = T.cred; soft(g, cr.x + cr.w / 2, F + 4, cr.w * 0.55, 9, 0.28); fillRR(g, cr.x - 6, cr.y - 6, cr.w + 12, 10, 4, OAK); fillRR(g, cr.x, cr.y + 4, cr.w, F - cr.y - 12, 4, SLATE);
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1.5; for (var dr = 0; dr < 3; dr++) { rr(g, cr.x + 6 + dr * 53, cr.y + 12, 50, F - cr.y - 30, 3); g.stroke(); fillRR(g, cr.x + 26 + dr * 53, cr.y + 22, 10, 3, 1.5, '#C9D2DE'); }
    fillRR(g, cr.x + 6, F - 8, 8, 8, 2, '#5C6B7A'); fillRR(g, cr.x + cr.w - 14, F - 8, 8, 8, 2, '#5C6B7A');
    /* the support desk phone (its light and handset are live) and a tent card */
    var ph = T.phone.x; fillRR(g, ph - 22, cr.y - 22, 44, 18, 5, '#2A3142'); fillRR(g, ph - 14, cr.y - 18, 16, 9, 2, '#9FE3FF'); text(g, 'SUPPORT', ph - 6, cr.y - 11.6, 3.6, 800, NAVY, 'center');
    for (var kb = 0; kb < 6; kb++) fillRR(g, ph + 5 + (kb % 2) * 6, cr.y - 19 + Math.floor(kb / 2) * 5, 4, 3, 1, '#C9D2DE');
    g.save(); g.translate(ph + 46, cr.y - 6); fillRR(g, -20, -20, 40, 20, 2, '#FFFFFF'); fillRR(g, -20, -20, 40, 5, 2, BLUE); text(g, 'AFTER', 0, -9.4, 5.2, 800, NAVY, 'center'); text(g, 'GO-LIVE', 0, -3.6, 5.2, 800, NAVY, 'center'); g.restore();
    /* the coffee flask and two mugs */
    var pt = T.pot.x; fillRR(g, pt - 10, cr.y - 46, 20, 40, 6, '#E6ECF4'); fillRR(g, pt - 10, cr.y - 46, 20, 8, 4, SLATE); fillRR(g, pt - 3, cr.y - 52, 6, 7, 2, SLATE); fillRR(g, pt - 10, cr.y - 24, 20, 4, 0, BLUE);
    COL.mug(g, pt + 24, cr.y - 4, 0.8, '#FFFFFF', BLUE); COL.mug(g, pt + 42, cr.y - 4, 0.8, '#FFFFFF', TEAL);
    /* a wall clock (live hands), plants */
    K.plant(g, { x: 206, y: F }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 1000, y: F }, BLUE, BLUE2);
    /* ---- left margin: the playbook shelf ---- */
    var sh = T.shelf.x; if (ext.l < sh + 260) {
      shadowed(g, 12, 5, 0.16, function () { fillRR(g, sh, 70, 210, F - 70, 6, '#FFFFFF'); }); g.strokeStyle = OAK2; g.lineWidth = 3; rr(g, sh, 70, 210, F - 70, 6); g.stroke();
      fillRR(g, sh + 30, 52, 150, 24, 12, NAVY); text(g, 'PLAYBOOKS', sh + 105, 68, 9, 800, Y, 'center');
      for (var sr = 0; sr < 3; sr++) { var sy2 = 160 + sr * 110; fillRR(g, sh + 8, sy2, 194, 6, 2, OAK);
        for (var bk = 0; bk < 6; bk++) { var bc = PRAC[(bk + sr) % 6][2]; fillRR(g, sh + 16 + bk * 30, sy2 - 74, 24, 74, 2, bc); fillRR(g, sh + 20 + bk * 30, sy2 - 60, 16, 12, 2, 'rgba(255,255,255,.85)'); } }
      K.plant(g, { x: sh - 40, y: F }, '#FFFFFF', '#E3E9F3'); }
    /* ---- right margin: the three offices board and a water cooler ---- */
    var of = T.offices.x; if (ext.r > of - 30) {
      shadowed(g, 12, 5, 0.18, function () { fillRR(g, of, 20, 196, 170, 8, '#FFFFFF'); }); fillRR(g, of, 20, 196, 26, 8, BLUE); g.fillRect(of, 36, 196, 10); text(g, 'OUR OFFICES', of + 98, 38, 9.6, 800, '#FFFFFF', 'center');
      [['Singapore HQ', '#E2453C'], ['Taguig City hub', BLUE], ['Ho Chi Minh City', '#E07B12']].forEach(function (o, i) { var oy = 76 + i * 38; fillE(g, of + 26, oy - 4, 7, 7, o[1]); fillE(g, of + 26, oy - 4, 3, 3, '#FFFFFF'); text(g, o[0], of + 42, oy, 10, 800, NAVY); g.fillStyle = '#E3E9F2'; g.fillRect(of + 20, oy + 14, 156, 1.5); });
      soft(g, of + 250, F + 4, 36, 6, 0.28); fillRR(g, of + 230, 330, 40, F - 330, 6, '#E6ECF4'); fillRR(g, of + 226, 262, 48, 72, 18, 'rgba(159,210,240,.75)'); fillRR(g, of + 242, 350, 16, 10, 3, '#9AA6BC'); }
  }
  function paintFront(g, ext) {
    /* the round meeting table, seen from the front: an oak top, a white pedestal on a round foot */
    var tb = T.table; soft(g, tb.x, F + 4, tb.r * 0.75, 9, 0.3);
    fillRR(g, tb.x - 9, tb.y + 10, 18, F - tb.y - 18, 4, '#FFFFFF'); g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(tb.x + 3, tb.y + 10, 6, F - tb.y - 18);
    fillE(g, tb.x, F - 6, 48, 7, '#E3E9F2'); fillE(g, tb.x, F - 8, 44, 5, '#FFFFFF');
    fillE(g, tb.x, tb.y + 7, tb.r, 11, OAK2); fillE(g, tb.x, tb.y, tb.r, 11, OAK); g.save(); g.globalAlpha = 0.35; fillE(g, tb.x - 30, tb.y - 2, tb.r * 0.6, 4, '#FFFFFF'); g.restore();
  }
  function paintFore(g, ext) {
    K.plant(g, { x: 120, y: 730 }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 1080, y: 730 }, BLUE, BLUE2);
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  /* the adviser at the whiteboard (blazer, marker in hand), the client at the table, the finance adviser with the laptop and ledger */
  var ADV = W({ x: 494, y: 470, s: 0.5, ph: 0.4, skin: 2, hair: 1, style: 'short', outfit: 'blazer', top: SLATE, top2: '#FFFFFF', hands: [[-150, -400], [50, -210]], look: -0.8 });
  var CLI = W({ x: 598, y: 470, s: 0.48, ph: 1.3, skin: 0, hair: 2, style: 'bob', outfit: 'shirt', top: '#FFFFFF', top2: TEAL, sit: true, chairCol: OAK2, hands: [[-50, -214], [40, -214]], look: 0.5 });
  var FIN = W({ x: 722, y: 470, s: 0.48, ph: 2.2, skin: 3, hair: 0, style: 'bun', outfit: 'cardigan', top: BLUE, top2: '#FFFFFF', glasses: true, sit: true, chairCol: OAK2, hands: [[-40, -214], [60, -214]], look: -0.3 });
  var CIRC = { t: -9, idle: -9 }, NOD = { t: -9 }, POST = { t: -9 }, BREW = { t: -9 }, LAMP = { t: -9, on: 0 }, RING = { t: -9 };
  /* ---- the adviser: idle, circles the Stock step on the board, turns to the table to explain, points back at the map; tapped, a big circle and "That's the fix!" */
  function actAdv(P, t, S) {
    var st = S.cast.adv, u = COL.tap(st, t).e; COL.reset(P, [[-150, -400], [50, -210]]);
    var c = (t + 0.4) % 10; P.talk = t < st.until; P._circ = -1;
    if (c < 3.2) { var a = (c / 3.2) * Math.PI * 2; P.hands = [[-150 + Math.cos(a) * 14, -404 + Math.sin(a) * 8], [50, -210]]; P.look = -0.9; P._circ = c / 3.2; }
    else if (c < 6.6) { P.hands = [[-60, -230], [96, -286 + Math.sin(t * 3) * 10]]; P.look = 0.8; P.talk = true; }
    else { P.hands = [[-172, -380], [50, -210]]; P.look = -0.6; P.talk = c < 8.4; }
    if (S.hot === 'advise') { P.hands = [[-172, -390], [60, -230]]; P.look = -0.5; P.talk = true; P._circ = -1; }
    if (u < 2.2) { P._circ = -1; P.mood = 'happy'; P.talk = true; P.hands = u < 1 ? [[-160, -420 + Math.sin(u * 12) * 10], [70, -230]] : [[-90, -250], [110, -400]]; P.hop = u > 1 ? bell((u - 1) / 1.2) * 10 : 0;
      if (u > 0.2 && CIRC.t < st._s) { CIRC.t = t; CR.burst('star', T.board.x + 116, T.board.y + 40, t); } }
    if (u < 0.05) st._s = t;
    P._u = u;
  }
  /* ---- the client: idle, explains how the work runs today, takes a note, sips coffee; tapped, nods and gives a thumbs-up */
  function actCli(P, t, S) {
    var st = S.cast.cli, u = COL.tap(st, t).e; COL.reset(P, [[-50, -214], [40, -214]]);
    var c = (t + 1.3) % 9; P.talk = t < st.until; P._mug = 0; P._pen = 0;
    if (c < 3.4) { P.hands = [[-80 + Math.sin(t * 2.6) * 14, -250 + Math.cos(t * 3.1) * 12], [40, -214]]; P.look = 0.7; P.talk = true; }
    else if (c < 6.2) { P.hands = [[-50, -214], [30 + Math.sin(t * 9) * 6, -212 + Math.cos(t * 13) * 2]]; P.look = 0.15; P._pen = 1; }
    else { P.hands = [[-50, -214], [-34, -330]]; P._mug = 1; P.look = 0.3; P.tilt = -0.04; }
    if (S.hot === 'listen') { P.hands = [[-90 + Math.sin(t * 2.6) * 12, -260], [40, -214]]; P.look = 0.8; P.talk = true; P._mug = 0; P._pen = 0; }
    if (u < 2) { P._mug = 0; P._pen = 0; P.mood = 'happy'; P.talk = true; P.look = 0.6; P.tilt = Math.sin(u * 12) * 0.06; P.hands = [[-50, -214], [96, -330]]; if (u < 0.05 && NOD.t < t - 1) { NOD.t = t; CR.burst('spark', P.x + 40, P.y - 250, t); } }
    P._u = u;
  }
  /* ---- the finance adviser: idle, types on the laptop, turns it to the client and points at the screen, checks the ledger; tapped, posts the entry ("Posted") */
  function actFin(P, t, S) {
    var st = S.cast.fin, u = COL.tap(st, t).e; COL.reset(P, [[-40, -214], [60, -214]]);
    var c = (t + 2.2) % 9; P.talk = t < st.until; P._led = 0;
    if (c < 4) { var kk = Math.abs(Math.sin(t * 18)) * 8; P.hands = [[20, -214 - kk], [80, -214 - (8 - kk)]]; P.look = 0.5; }
    else if (c < 6.4) { P.hands = [[-40, -214], [70, -262 + Math.sin(t * 4) * 4]]; P.look = -0.8; P.talk = true; }
    else { P.hands = [[-110, -226 + Math.sin(t * 2) * 4], [40, -214]]; P.look = -0.4; P._led = 1; }
    if (S.hot === 'implement') { P.hands = [[-40, -214], [80, -270]]; P.look = -0.6; P.talk = true; P._led = 0; }
    if (u < 2) { P._led = 0; P.mood = 'happy'; P.talk = true; P.look = 0.2; var k2 = Math.abs(Math.sin(u * 22)) * 8; P.hands = u < 0.8 ? [[20, -214 - k2], [80, -222 + k2]] : [[-60, -240], [100, -380]]; P.hop = u > 0.8 ? bell((u - 0.8) / 1.2) * 8 : 0;
      if (u > 0.8 && POST.t < st._s) { POST.t = t; CR.burst('code', T.laptop.x, T.table.y - 50, t); } }
    if (u < 0.05) st._s = t;
    P._u = u;
  }

  /* ------------------------------------------------------------ live layers */
  var CLOUDS = [[0, -20, 0.6], [120, 10, 0.45], [230, -30, 0.5]];
  function paintWindow(g, t, par, S) {
    var w = T.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.b - w.y); g.clip();
    CLOUDS.forEach(function (c, j) { var x = w.x - 60 + ((c[0] + t * (3 + j)) % (w.w + 120)), y = c[1], s = c[2]; g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.ellipse(x, y, 40 * s, 10 * s, 0, 0, 7); g.ellipse(x + 16 * s, y - 8 * s, 22 * s, 11 * s, 0, 0, 7); g.fill(); });
    COL.birds(g, t, w.x, w.x + w.w, 30, 2, 'rgba(60,80,110,.45)');
    g.restore();
  }
  function paintLive(g, t, now, S) {
    var b = T.board, p = T.pin, cr = T.cred;
    /* the red circle round the Stock step: drawn by the adviser on his loop, redrawn on a tap, steady otherwise */
    var ct = t - CIRC.t, pr = ct < 1.2 ? ease(ct / 1.2) : (ADV._circ >= 0 ? ADV._circ : 1);
    if (pr > 0.02) { g.save(); g.strokeStyle = RED; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.ellipse(b.x + 116, b.y + 62, 40, 26, -0.06, -2.6, -2.6 + pr * Math.PI * 2.15); g.stroke(); g.restore(); }
    if (ct < 2.2) COL.pop(g, b.x + 116, b.y - 2, "That's the fix!", ct / 2.2, RED);
    if (S.hot === 'advise') { g.save(); g.globalAlpha = 0.5 + 0.3 * Math.sin(t * 4); g.strokeStyle = Y; g.lineWidth = 5; g.beginPath(); g.moveTo(b.x + 30, b.y + 186); g.lineTo(b.x + b.w - 30, b.y + 186); g.stroke(); g.restore(); }
    /* the pinboard: on the expertise stop the six cards light up one by one */
    if (S.hot === 'expertise') PRAC.forEach(function (c, i) { var on = ((t * 1.6) % 6) | 0; if (on !== i) return; var cx = p.x + 37 + (i % 3) * 66, cy = p.y + 24 + Math.floor(i / 3) * 96; g.save(); g.globalAlpha = 0.55; g.strokeStyle = c[2]; g.lineWidth = 3; rr(g, cx - 31, cy - 3, 62, 86, 5); g.stroke(); g.restore(); });
    /* the support phone: a calm status light; on the "stay" stop it rings and the handset lifts */
    var ph = T.phone.x, rg = S.hot === 'stay' || t - RING.t < 2.4, lift = rg ? Math.abs(Math.sin(t * 16)) * 2 : 0;
    fillRR(g, ph - 22, cr.y - 26 - lift, 18, 7, 3.5, '#3A4458'); fillE(g, ph + 16, cr.y - 22, 2.4, 2.4, rg ? (Math.floor(t * 6) % 2 ? GREEN : '#0E7A50') : (Math.floor(t * 1.2) % 2 ? GREEN : '#1E8F63'));
    if (rg) COL.pop(g, ph, cr.y - 46, 'Same adviser', ((t * 0.4) % 1), BLUE);
    /* the coffee flask: steam on a tap, the mugs steam gently */
    var bt = t - BREW.t; COL.steam(g, T.pot.x + 24, cr.y - 18, t, 0.45, 2); if (bt < 2.6) { COL.steam(g, T.pot.x, cr.y - 56, t, 0.7, 3); COL.pop(g, T.pot.x, cr.y - 84, 'Coffee first', bt / 2.6, SLATE); }
    /* the pendant lamp over the table (tap: it brightens) */
    var lp = T.lamp, la = t - LAMP.t, glowA = (LAMP.on ? 0.42 : 0.2) + (la < 0.6 ? (1 - la / 0.6) * 0.3 : 0) + 0.04 * Math.sin(t * 1.4);
    var sw = Math.sin(t * 0.8) * 0.012; g.save(); g.translate(lp.x, -122); g.rotate(sw); g.strokeStyle = '#7A869C'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, lp.y + 122 - 14); g.stroke();
    g.save(); g.globalAlpha = glowA; var lg = g.createRadialGradient(0, lp.y + 122, 4, 0, lp.y + 122, 90); lg.addColorStop(0, 'rgba(255,240,190,1)'); lg.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = lg; g.beginPath(); g.arc(0, lp.y + 122, 90, 0, 7); g.fill(); g.restore();
    g.fillStyle = NAVY; g.beginPath(); g.moveTo(-26, lp.y + 122 + 8); g.quadraticCurveTo(0, lp.y + 122 - 26, 26, lp.y + 122 + 8); g.closePath(); g.fill(); fillE(g, 0, lp.y + 122 + 8, 26, 4, '#2A3550'); fillE(g, 0, lp.y + 122 + 10, 10, 3.5, '#FFF2C8'); g.restore();
    /* the wall clock (Singapore time) */
    CO.clock(g, 478, -2, 15, 8, NAVY);
  }
  function paintFrontLive(g, t, S) {
    var tb = T.table, ty = tb.y - 4;
    /* the client's notepad and pen, her coffee */
    COL.sheet(g, 612, ty - 2, -0.1, 30, 10, 2);
    if (!CLI._mug) { COL.mug(g, 562, ty + 2, 0.9, '#FFFFFF', TEAL); COL.steam(g, 562, ty - 16, t, 0.45, 2); } else { var hm = COL.hand(CLI, 1); COL.mug(g, hm[0], hm[1] + 8, 0.9, '#FFFFFF', TEAL); }
    if (CLI._pen) { var hp = COL.hand(CLI, 1); COL.marker(g, hp[0], hp[1] + 2, 0.5, NAVY); }
    if (CLI._u < 2) COL.pop(g, CLI.x, CLI.y - 280, 'Makes sense!', CLI._u / 2, TEAL);
    /* the written recommendation, standing between them (opens on the scope stop) */
    var fo = S.hot === 'scope' ? 0.6 + 0.4 * Math.sin(t * 2.4) : 0; g.save(); g.translate(T.folder.x, ty + 3); g.scale(1.3, 1.3); folder(g, clamp(fo, 0, 1)); g.restore();
    /* the ledger beside the laptop (lifted when she checks it) */
    var lx = 700, lyy = ty + 2; if (FIN._led) { var hl = COL.hand(FIN, 0); lx = hl[0] + 6; lyy = hl[1] + 10; }
    g.save(); g.translate(lx, lyy); g.rotate(FIN._led ? -0.25 : 0); fillRR(g, -15, -8, 30, 8, 2, '#0E6B55'); fillRR(g, -13, -6, 26, 2, 1, '#FFFFFF'); text(g, 'LEDGER', 0, -1.4, 3.6, 800, '#FFFFFF', 'center'); g.restore();
    /* the laptop with Odoo on screen, in front of the finance adviser */
    var lt = T.laptop.x, s = 1.25; COL.laptop(g, lt, ty + 4, s, 1, '#FFFFFF'); CO.screen(g, lt - 20 * s, ty + 2 - 29 * s, 40 * s, 26 * s, t, 'odoo');
    fillE(g, lt, ty - 1, 1.6, 1.6, '#9AA6BC');
    var pt = t - POST.t; if (pt < 2.2) { g.save(); g.globalAlpha = 1 - Math.max(0, pt - 1.6) / 0.6; fillRR(g, lt - 18, ty - 20, 36, 10, 3, GREEN); text(g, '✓ Posted', lt, ty - 12.6, 6, 800, '#FFFFFF', 'center'); g.restore(); }
    if (S.hot === 'implement') { g.save(); g.globalAlpha = 0.6 + 0.3 * Math.sin(t * 5); fillRR(g, lt - 18, ty - 20, 36, 10, 3, PUR); text(g, 'Standard first', lt, ty - 12.6, 5.4, 800, '#FFFFFF', 'center'); g.restore(); }
    /* the adviser's marker */
    var ha = COL.hand(ADV, 0); COL.marker(g, ha[0] + 2, ha[1] - 2, -0.6, RED);
    if (ADV._u < 2.2 && ADV._u > 1) COL.pop(g, ADV.x, ADV.y - 300, 'Keep, change, fix', (ADV._u - 1) / 1.2, NAVY);
    CR.draw(g, t);
  }

  window.IXW.worlds.advisors = {
    pan: [-300, 1160],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { CR.draw(g, t); },
    moteCol: 'rgba(255,216,74,.4)',
    glow: {
      listen: function (g) { rr(g, T.table.x - T.table.r - 10, 220, T.table.r * 2 + 20, F - 214, 14); },
      advise: function (g) { var b = T.board; rr(g, b.x - 12, b.y - 12, b.w + 24, b.h + 30, 12); },
      expertise: function (g) { var p = T.pin; rr(g, p.x - 14, p.y - 24, p.w + 28, p.h + 36, 12); },
      scope: function (g) { rr(g, T.folder.x - 34, T.table.y - 48, 68, 52, 10); },
      implement: function (g) { rr(g, T.laptop.x - 34, T.table.y - 50, 68, 56, 10); },
      stay: function (g) { var c = T.cred; rr(g, T.phone.x - 30, c.y - 34, 104, 40, 10); },
      coffee: function (g) { var c = T.cred; rr(g, T.pot.x - 18, c.y - 62, 80, 64, 10); },
      lamp: function (g) { rr(g, T.lamp.x - 34, T.lamp.y - 20, 68, 40, 12); }
    },
    backGlow: ['advise', 'expertise', 'stay', 'coffee'],
    calmView: [214, -72, 762, 610],
    cast: [
      { id: 'adv', behind: true, keys: ['advise'], P: ADV, act: actAdv },
      { id: 'cli', behind: true, keys: ['listen'], P: CLI, act: actCli },
      { id: 'fin', behind: true, keys: ['implement', 'scope'], P: FIN, act: actFin }
    ],
    onStop: function (key, S, t) { if (key === 'stay') RING.t = t; if (key === 'advise') CIRC.t = t; },
    toy: function (name, S, t) {
      if (name === 'coffee') { BREW.t = t; CR.burst('spark', T.pot.x, T.cred.y - 60, t); }
      if (name === 'lamp') { LAMP.t = t; LAMP.on = LAMP.on ? 0 : 1; CR.burst('star', T.lamp.x, T.lamp.y + 10, t); }
    }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
