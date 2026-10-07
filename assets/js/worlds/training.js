/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: training (/odoo/training) — step 2 of 4: role-based training in a bright training room. The projector runs the
   Odoo 20 screen each team learns, on a copy of its own data (finance: bank reconciliation; sales: quotation S00042;
   warehouse: receipt WH/IN/00017), with the tip bubble and the button to press; TechNext's trainer (TechNext ID) runs it;
   three trainees sit at laptops on an open desk (chairs, legs and feet); the week's schedule on the side board; the
   quick-reference guides stacked to take away. Clients wear their own grey passes. Tap anyone, a screen tab or the guides. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, PUR = '#714B67', BLUE = '#3167CA';
  var SC = { x: 360, y: -96, w: 470, h: 262 }, T = { desk: { x: 340, y: 392, w: 470 }, board: { x: 150, y: -60, w: 170, h: 196 }, guides: { x: 930, y: 380, w: 150 }, cert: { x: 950, y: -40, w: 110, h: 80 } };
  var ROLES = [
    { key: 'finance', tab: 'Finance', col: '#2E9C7E', h: 'Bank reconciliation', btn: 'Validate', tip: 'Check the suggested match, then validate.',
      rows: [['Harbourline Supplies', 'Matched', 'S$ 4,280.00', 1], ['Card settlement', 'Matched', 'S$ 1,962.40', 1], ['Transfer, no reference', 'To review', 'S$ 350.00', 0]] },
    { key: 'sales', tab: 'Sales', col: '#E46E78', h: 'Quotation S00042', btn: 'Confirm', tip: 'Confirm it, and the quotation becomes a sales order.',
      rows: [['Barcode scanner', '× 6', 'S$ 1,080.00', 2], ['Label printer', '× 2', 'S$ 460.00', 2], ['Set-up service', '× 1', 'S$ 300.00', 2]] },
    { key: 'warehouse', tab: 'Warehouse', col: '#F2A33A', h: 'Receipt WH/IN/00017', btn: 'Validate', tip: 'Scan each product in, then validate the receipt.',
      rows: [['Barcode scanner', 'Scanned', '6 / 6', 1], ['Label printer', 'Scanned', '2 / 2', 1], ['Thermal labels', 'Waiting', '0 / 40', 0]] }];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F8F6FB'); wg.addColorStop(1, '#EEEAF3'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = '#E6E0EE'; g.fillRect(e.l, 260, e.r - e.l, F - 260); g.fillStyle = '#D8D0E4'; g.fillRect(e.l, 256, e.r - e.l, 5);
    /* tall windows at the far left, daylight */
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 230, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 310); }
    CO.ceiling(g, e, CEIL, '#F0EDF5', '#FAF9FC', '#FFFFFF');
    CO.floor(g, e, F, '#E9E2D6', '#D9D0C1', 'rgba(120,90,50,.10)');
    g.restore();
  }
  function paintFrame(g) {}
  function paintBack(g, ext) {
    /* the projector screen on its roller */
    fillRR(g, SC.x - 20, SC.y - 18, SC.w + 40, 12, 6, '#5C6B7A'); shadowed(g, 14, 5, 0.16, function () { fillRR(g, SC.x - 8, SC.y - 8, SC.w + 16, SC.h + 16, 6, '#FFFFFF'); });
    fillRR(g, SC.x + SC.w / 2 - 10, SC.y + SC.h + 8, 20, 6, 3, '#9AA6BC');
    /* the schedule board */
    var b = T.board; shadowed(g, 10, 4, 0.16, function () { fillRR(g, b.x, b.y, b.w, b.h, 8, '#FFFFFF'); }); fillRR(g, b.x, b.y, b.w, 24, 8, PUR); g.fillRect(b.x, b.y + 14, b.w, 10);
    text(g, 'TRAINING WEEK', b.x + b.w / 2, b.y + 16, 8.5, 800, '#FFFFFF', 'center');
    /* the certificate on the wall */
    var c = T.cert; shadowed(g, 8, 3, 0.16, function () { fillRR(g, c.x, c.y, c.w, c.h, 4, '#C9A27A'); }); fillRR(g, c.x + 6, c.y + 6, c.w - 12, c.h - 12, 2, '#FFFDF6');
    text(g, 'CERTIFICATE', c.x + c.w / 2, c.y + 24, 7.6, 800, PUR, 'center'); fillRR(g, c.x + 22, c.y + 32, c.w - 44, 3, 1.5, '#C9D3E3'); fillRR(g, c.x + 30, c.y + 40, c.w - 60, 3, 1.5, '#C9D3E3'); fillE(g, c.x + c.w / 2, c.y + 58, 8, 8, '#E9C46A');
    /* the side table with the guides */
    var gt = T.guides; CO.desk(g, gt.x, gt.y, gt.w, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    K.plant(g, { x: 1150, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    /* the trainees' open desk and the backs of their laptops */
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    [420, 560, 700].forEach(function (x, i) { fillRR(g, x - 34, d.y - 40, 68, 40, 4, '#C9D2DE'); fillE(g, x, d.y - 20, 6, 6, PUR); fillRR(g, x - 40, d.y - 3, 80, 4, 2, '#9AA6BC'); });
  }

  var W = CR.who;
  var TR = W({ x: 880, y: 470, s: 0.54, ph: 0.3, skin: 2, hair: 1, style: 'pony', outfit: 'polo', top: PUR, hands: [[-150, -300], [60, -170]], look: -0.8 });
  var FIN = W({ x: 420, y: 470, s: 0.5, ph: 1.1, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: '#2E9C7E', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#3A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]] });
  var SAL = W({ x: 560, y: 470, s: 0.5, ph: 2.0, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#E46E78', sit: true, chairCol: '#3A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]] });
  var WH = W({ x: 700, y: 470, s: 0.5, ph: 2.7, skin: 3, hair: 0, style: 'short', outfit: 'polo', top: '#F2A33A', sit: true, chairCol: '#3A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]] });
  var CREW = [
    { x0: 1190, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Bringing more **quick-reference guides**.', 'Admins next: users, access rights and **settings**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'Trainee, administrator', lines: ['Admin session at **two**. Users and access rights.', 'Practising on a **copy** of our data. Nothing breaks!'], acts: ['cheer', 'wave', 'nod'],
      P: W({ s: 0.58, skin: 0, hair: 1, style: 'long', outfit: 'cardigan', top: '#3A72D6', top2: '#FFFFFF', id: '#9AA6BC', hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var GD = { t: -9 }, CT = { t: -9 };
  function role(S, t) { var i = ['finance', 'sales', 'warehouse'].indexOf(S.hot); return i >= 0 ? i : Math.floor(t / 5) % 3; }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the projector: the role's Odoo screen, on a copy of the client's data */
    var ri = role(S, t), R = ROLES[ri], x = SC.x, y = SC.y, db = S.hot === 'database';
    fillRR(g, x, y, SC.w, 26, 3, PUR); text(g, 'TRAINING DATABASE · a copy of your own data', x + 12, y + 17, 9, 800, '#FFFFFF');
    if (db) { var p = 0.5 + 0.5 * Math.sin(t * 5); g.strokeStyle = 'rgba(255,216,74,' + (0.5 + p * 0.5).toFixed(2) + ')'; g.lineWidth = 3; rr(g, x + 1, y + 1, SC.w - 2, 24, 3); g.stroke(); }
    ROLES.forEach(function (Q, i) { var tx = x + 12 + i * 110; fillRR(g, tx, y + 34, 102, 24, 6, i === ri ? Q.col : '#F1F4F9'); text(g, Q.tab, tx + 51, y + 50, 9.5, 800, i === ri ? '#FFFFFF' : '#5C6B7A', 'center'); });
    text(g, R.h, x + 14, y + 84, 14, 800, '#1B1F3B');
    var st = (t * (S.hot === R.key ? 1.2 : 0.6)) % 5;
    R.rows.forEach(function (r, i) { var ry = y + 98 + i * 32, hi = Math.floor(st) === i; fillRR(g, x + 12, ry, SC.w - 24, 26, 5, hi ? '#F4F0F8' : '#FAFBFC');
      text(g, r[0], x + 22, ry + 17, 9.5, 700, '#1B1F3B'); var ok = r[3] === 1, tag = r[3] === 2 ? '#EEF2F7' : (ok ? '#DDF5EA' : '#FFF1D6');
      fillRR(g, x + 230, ry + 5, 76, 16, 8, tag); text(g, r[1], x + 268, ry + 16.5, 8, 800, r[3] === 2 ? '#5C6B7A' : (ok ? '#1E9E6A' : '#B7791F'), 'center'); text(g, r[2], x + SC.w - 22, ry + 17, 9.5, 800, '#1B1F3B', 'right'); });
    var bp = st > 3.2 && st < 3.6; fillRR(g, x + 12, y + 202, 86, 28, 6, bp ? '#5A3A52' : PUR); text(g, R.btn, x + 55, y + 220, 10, 800, '#FFFFFF', 'center');
    /* the tip bubble, like Odoo's own onboarding tips */
    var ta = clamp((st - 0.6) * 3, 0, 1); g.save(); g.globalAlpha = ta; fillRR(g, x + 112, y + 200, 300, 32, 8, '#1B1F3B'); g.fillStyle = '#1B1F3B'; g.beginPath(); g.moveTo(x + 112, y + 212); g.lineTo(x + 102, y + 216); g.lineTo(x + 112, y + 220); g.fill();
    text(g, R.tip, x + 124, y + 220, 9, 700, '#FFFFFF'); g.restore();
    /* the schedule board: today's session lit */
    var b = T.board, today = S.hot === 'schedule' ? Math.floor(t * 1.4) % 4 : ri;
    [['Mon', 'Finance', '#2E9C7E'], ['Tue', 'Sales', '#E46E78'], ['Wed', 'Warehouse', '#F2A33A'], ['Thu', 'Administrators', BLUE]].forEach(function (d, i) { var yy = b.y + 34 + i * 38, on = i === today;
      fillRR(g, b.x + 10, yy, b.w - 20, 30, 6, on ? d[2] : '#F4F2F8'); text(g, d[0], b.x + 20, yy + 19, 9, 800, on ? '#FFFFFF' : '#9AA6BC'); text(g, d[1], b.x + 54, yy + 19, 9, 800, on ? '#FFFFFF' : '#3D4560'); });
    /* the quick-reference guides: three stacks; tapped (or on the Guides stop) one is handed out */
    var gt = T.guides, gs = S.hot === 'guides', gt2 = t - GD.t;
    ROLES.forEach(function (Q, i) { for (var k = 0; k < 4; k++) fillRR(g, gt.x + 10 + i * 46, gt.y - 8 - k * 7, 40, 7, 1.5, k % 2 ? '#FFFFFF' : Q.col); });
    if (gs || gt2 < 1.6) { var f = gs ? (t % 1.6) / 1.6 : gt2 / 1.6, gx = lerp(gt.x + 40, gt.x - 60, f), gy = gt.y - 40 - Math.sin(f * Math.PI) * 60; g.save(); g.translate(gx, gy); g.rotate(-0.4 * f);
      fillRR(g, -20, -26, 40, 52, 3, '#FFFFFF'); fillRR(g, -20, -26, 40, 12, 3, PUR); text(g, 'GUIDE', 0, -17, 6.4, 800, '#FFFFFF', 'center'); for (var l = 0; l < 4; l++) fillRR(g, -14, -6 + l * 7, l % 2 ? 20 : 28, 2.4, 1.2, '#C9D3E3'); g.restore(); }
    /* the certificate sparkles when tapped */
    if (t - CT.t < 2) { var c = T.cert; for (var s2 = 0; s2 < 6; s2++) { var a = s2 * 1.05 + t * 2, r2 = 50 + Math.sin(t * 6 + s2) * 6; fillE(g, c.x + c.w / 2 + Math.cos(a) * r2, c.y + c.h / 2 + Math.sin(a) * r2 * 0.6, 2.5, 2.5, '#FFD84A'); } }
  }
  function paintFrontLive(g, t, S) { CO.crew(CREW, g, t, S, true); CR.draw(g, t); }

  function trainee(id, key, P, acts) { return { id: id, behind: true, keys: [key], P: P, act: function (P, t, S) { var st = S.cast[id], busy = S.hot === key; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    var k2 = Math.abs(Math.sin(t * (busy ? 12 : 3) + P.ph)) * 6; P.hands = busy && Math.floor(t) % 3 === 0 ? [[-60, -206], [90, -320 + Math.sin(t * 4) * 8]] : [[-60, -206 - k2], [60, -206 - (6 - k2)]];
    P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : (busy ? 0 : -0.3), 0.08); CR.cast(P, st, t, acts); } }; }
  window.IXW.worlds.training = {
    pan: [-300, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(113,75,103,.2)',
    glow: {
      finance: function (g) { rr(g, 380, 280, 80, 112, 12); }, sales: function (g) { rr(g, 520, 280, 80, 112, 12); }, warehouse: function (g) { rr(g, 660, 280, 80, 112, 12); },
      database: function (g) { rr(g, SC.x - 8, SC.y - 8, SC.w + 16, 42, 10); },
      guides: function (g) { var gt = T.guides; rr(g, gt.x - 6, gt.y - 46, gt.w + 12, 60, 10); },
      schedule: function (g) { var b = T.board; rr(g, b.x - 10, b.y - 10, b.w + 20, b.h + 20, 12); },
      cert: function (g) { var c = T.cert; rr(g, c.x - 8, c.y - 8, c.w + 16, c.h + 16, 10); }
    },
    backGlow: ['database', 'guides', 'schedule', 'cert'],
    cast: [
      { id: 'tr', behind: false, keys: ['database'], P: TR, act: function (P, t, S) { var st = S.cast.tr, on = ['finance', 'sales', 'warehouse', 'database'].indexOf(S.hot) >= 0; P.talk = t < st.until || on; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-160, -310 + Math.sin(t * (on ? 3 : 1.2)) * 10], [60, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.8, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'cheer', 'think']); } },
      trainee('fin', 'finance', FIN, ['nod', 'think', 'wave', 'id']),
      trainee('sal', 'sales', SAL, ['wave', 'cheer', 'nod', 'id']),
      trainee('wh', 'warehouse', WH, ['nod', 'jump', 'wave', 'id'])
    ],
    toy: function (name, S, t) { if (name === 'guide') { GD.t = t; } if (name === 'cert') { CT.t = t; CR.burst('star', T.cert.x + T.cert.w / 2, T.cert.y, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
