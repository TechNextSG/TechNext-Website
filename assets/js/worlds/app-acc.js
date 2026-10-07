/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-acc (/odoo/apps/accounting) — Odoo Accounting: a bright finance office at month-end. The bank reconciliation
   screen matches statement lines; customer invoices and vendor bills; the GST return; the month-end checklist; reports from
   the ledger. The accountant and payables sit at their desks (chairs, legs and feet), the finance lead stands by; a PAID
   stamp to press. Sample figures only. Tap anyone, any screen or the stamp. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, GRN = '#2E9C7E', PUR = '#714B67', OK = '#1E9E6A';
  var BK = { x: 320, y: -106, w: 300, h: 200 }, RP = { x: 320, y: 112, w: 300, h: 50 }, INV = { x: 632, y: -106, w: 136, h: 80 }, BIL = { x: 632, y: 0, w: 136, h: 80 },
    TAX = { x: 822, y: -106, w: 116, h: 80 }, CLS = { x: 822, y: 0, w: 116, h: 80 }, T = { desk: { x: 380, y: 392, w: 440 }, side: { x: 226, y: 380, w: 96 } };
  var LINES = [['Harbourline Supplies', '-4,280.00', 'BILL/2026/0912'], ['Card settlement', '+1,962.40', 'INV/2026/0388'], ['Kopi Co. payment', '+640.00', 'INV/2026/0391'], ['Transfer, no reference', '+350.00', '']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.35); g.lineTo(x + r * 0.5, y - r * 0.35); g.stroke(); }
  function card(g, b, head, col) { shadowed(g, 10, 4, 0.16, function () { fillRR(g, b.x, b.y, b.w, b.h, 8, '#FFFFFF'); }); fillRR(g, b.x, b.y, b.w, 18, 8, col); g.fillRect(b.x, b.y + 10, b.w, 8); text(g, head, b.x + 8, b.y + 13, 7, 800, '#FFFFFF'); }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F5FAF8'); wg.addColorStop(1, '#E7F2EE'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = '#DCEBE5'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#CBE0D8'; g.fillRect(e.l, 246, e.r - e.l, 5);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 220, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 300); }
    CO.ceiling(g, e, CEIL, '#EEF5F2', '#F8FCFA', '#FFFFFF'); CO.floor(g, e, F, '#E7EBF1', '#D6DDE7', 'rgba(40,70,120,.08)');
    g.restore();
  }
  function paintBack(g, ext) {
    shadowed(g, 14, 5, 0.18, function () { fillRR(g, BK.x - 6, BK.y - 6, BK.w + 12, BK.h + 12, 9, '#2A3142'); }); fillRR(g, BK.x, BK.y, BK.w, BK.h, 4, '#FFFFFF');
    fillRR(g, BK.x, BK.y, BK.w, 22, 4, PUR); g.fillRect(BK.x, BK.y + 14, BK.w, 8); text(g, 'Accounting · Bank reconciliation · sample', BK.x + 10, BK.y + 15, 8, 800, '#FFFFFF');
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, RP.x, RP.y, RP.w, RP.h, 10, '#FFFFFF'); });
    card(g, INV, 'Customer invoices', '#3167CA'); card(g, BIL, 'Vendor bills', '#E0456B'); card(g, TAX, 'GST return', PUR); card(g, CLS, 'Month-end close', GRN);
    var sd = T.side; soft(g, sd.x + sd.w / 2, F + 4, 60, 7, 0.3); fillRR(g, sd.x, sd.y, sd.w, F - sd.y, 6, '#D9C3A0'); fillRR(g, sd.x + 8, sd.y + 14, sd.w - 16, F - sd.y - 24, 4, '#E8D6B8');
    fillRR(g, sd.x + 10, sd.y - 8, 50, 8, 2, '#FFFFFF'); fillRR(g, sd.x + 14, sd.y - 14, 46, 6, 2, '#F4F6FA'); fillRR(g, sd.x + 64, sd.y - 6, 24, 6, 3, '#2A3142');
    K.plant(g, { x: 1170, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    [506, 638].forEach(function (mx) { fillRR(g, mx - 4, d.y - 74, 108, 64, 6, '#2A3142'); fillRR(g, mx + 46, d.y - 10, 10, 10, 2, '#5C6B7A'); fillRR(g, mx + 30, d.y - 3, 42, 4, 2, '#5C6B7A'); });
  }

  var W = CR.who;
  var ACC = W({ x: 466, y: 470, s: 0.5, ph: 0.6, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: GRN, top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.4 });
  var AP = W({ x: 774, y: 470, s: 0.5, ph: 1.8, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: '#E0456B', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.4 });
  var CFO = W({ x: 930, y: 470, s: 0.54, ph: 2.6, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: '#1E3A6E', id: '#9AA6BC', hold: 'clipboard', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var CREW = [
    { x0: 1200, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Chart of accounts and taxes set up for **how you close**.', 'Bank feeds tuned on your **real** statements.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Opening balances migrated and **reconciled** first.', 'Your finance team trained on **month-end**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var STAMP = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* bank reconciliation: statement lines on the left, the suggested match on the right, ticked in turn */
    var bh = S.hot === 'bank', n = Math.floor(bh ? ((t - (S.kT || 0)) * 1.4) % 6 : (t * 0.5) % 6);
    LINES.forEach(function (l, i) { var y = BK.y + 32 + i * 38, on = i < n && l[2]; fillRR(g, BK.x + 10, y, 140, 30, 6, '#F6F8FB'); text(g, l[0], BK.x + 18, y + 13, 7.4, 800, '#1B1F3B'); text(g, 'S$ ' + l[1], BK.x + 18, y + 24, 6.8, 700, l[1][0] === '-' ? '#B3261E' : OK);
      g.strokeStyle = on ? OK : '#E3E8EF'; g.lineWidth = 2; g.setLineDash(on ? [] : [4, 4]); g.beginPath(); g.moveTo(BK.x + 150, y + 15); g.lineTo(BK.x + 166, y + 15); g.stroke(); g.setLineDash([]);
      fillRR(g, BK.x + 166, y, 124, 30, 6, on ? '#E8F7EF' : (l[2] ? '#FAFBFC' : '#FFF4E0')); text(g, l[2] || 'To review', BK.x + 174, y + 19, 7.2, 800, l[2] ? (on ? OK : '#9AA6BC') : '#B7791F'); if (on) tick(g, BK.x + 278, y + 15, 6); });
    fillRR(g, BK.x + 10, BK.y + BK.h - 22, 70, 16, 5, n >= 4 ? OK : PUR); text(g, n >= 4 ? 'Validated' : 'Validate', BK.x + 45, BK.y + BK.h - 11, 7, 800, '#FFFFFF', 'center');
    /* reports: P&L, balance sheet, cash */
    var rh = S.hot === 'reports'; [['Profit & loss', GRN], ['Balance sheet', '#3167CA'], ['Cash', '#F2A33A']].forEach(function (r, i) { var x = RP.x + 10 + i * 96;
      text(g, r[0], x, RP.y + 15, 7, 800, '#5C6B7A'); for (var b = 0; b < 6; b++) { var h = 6 + hash(b + i * 7 + (rh ? Math.floor(t * 2) : 0)) * 16; fillRR(g, x + b * 13, RP.y + 42 - h, 9, h, 2, r[1]); } });
    /* invoices: paid / sent / overdue */
    [['INV/0388', 'Paid', OK], ['INV/0391', 'Paid', OK], ['INV/0395', S.hot === 'invoices' && (t % 2) < 1 ? 'Sent' : 'Overdue', S.hot === 'invoices' && (t % 2) < 1 ? '#3167CA' : '#E2453C']].forEach(function (r, i) { var y = INV.y + 24 + i * 17;
      text(g, r[0], INV.x + 8, y + 9, 6.6, 700, '#3D4560'); fillRR(g, INV.x + 76, y, 50, 12, 6, r[2]); text(g, r[1], INV.x + 101, y + 9, 6, 800, '#FFFFFF', 'center'); });
    /* bills: matched to the PO */
    [['BILL/0912', 'PO00123'], ['BILL/0913', 'PO00127'], ['BILL/0914', 'PO00131']].forEach(function (r, i) { var y = BIL.y + 24 + i * 17, on = S.hot === 'bills' ? ((t - (S.kT || 0)) * 1.5) > i : true;
      text(g, r[0], BIL.x + 8, y + 9, 6.6, 700, '#3D4560'); text(g, '↔ ' + r[1], BIL.x + 64, y + 9, 6.4, 800, on ? OK : '#B0BAC9'); if (on) tick(g, BIL.x + 124, y + 6, 4.4); });
    /* GST return: boxes fill from the posted entries */
    var tx = S.hot === 'tax' ? clamp((t - (S.kT || 0)) * 0.8, 0, 1) : 1; [['Box 1 · Supplies', 0.8], ['Box 5 · Purchases', 0.55], ['Box 8 · Net GST', 0.3]].forEach(function (b, i) { var y = TAX.y + 26 + i * 17;
      text(g, b[0], TAX.x + 8, y + 7, 6, 700, '#3D4560'); fillRR(g, TAX.x + 8, y + 9, 100, 4, 2, '#EEF2F7'); fillRR(g, TAX.x + 8, y + 9, 100 * b[1] * tx, 4, 2, PUR); });
    /* month-end: the checklist ticks off */
    var cl = S.hot === 'close' ? Math.floor((t - (S.kT || 0)) * 1.2) : 4; ['Accruals posted', 'Banks reconciled', 'Lock date set'].forEach(function (c, i) { var y = CLS.y + 26 + i * 17, on = i < cl;
      fillRR(g, CLS.x + 8, y, 11, 11, 3, on ? GRN : '#EEF2F7'); if (on) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(CLS.x + 10.5, y + 5.5); g.lineTo(CLS.x + 12.8, y + 8); g.lineTo(CLS.x + 16.5, y + 3); g.stroke(); }
      text(g, c, CLS.x + 24, y + 8.6, 6.4, 700, on ? '#1B1F3B' : '#9AA6BC'); });
    /* the PAID stamp: tapped, it comes down on the bill */
    var sd = T.side, st = t - STAMP.t, down = st < 1.6, sy2 = down ? (st < 0.25 ? -40 + st * 160 : 0) : -40;
    if (st < 3) { g.save(); g.globalAlpha = clamp(3 - st, 0, 1); g.translate(sd.x + 36, sd.y - 12); g.rotate(-0.25); g.strokeStyle = '#E2453C'; g.lineWidth = 2; g.strokeRect(-18, -6, 36, 12); text(g, 'PAID', 0, 4, 8, 800, '#E2453C', 'center'); g.restore(); }
    fillRR(g, sd.x + 64, sd.y - 30 + sy2 * 0.5, 22, 8, 3, '#7A5A3A'); fillRR(g, sd.x + 71, sd.y - 48 + sy2 * 0.5, 8, 18, 3, '#9A7A52'); fillE(g, sd.x + 75, sd.y - 50 + sy2 * 0.5, 7, 6, '#7A5A3A');
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    var d = T.desk; [[506, 'Reconcile'], [638, 'Bills to pay']].forEach(function (m, k) { var mx = m[0], my = d.y - 70; fillRR(g, mx, my, 100, 56, 3, '#FFFFFF'); fillRR(g, mx, my, 100, 10, 3, k ? '#E0456B' : PUR); text(g, m[1], mx + 4, my + 7.6, 5, 800, '#FFFFFF');
      for (var l = 0; l < 4; l++) { fillRR(g, mx + 6, my + 15 + l * 10, 58, 4, 2, '#D5DCE6'); if ((t * 0.8 + l + k) % 4 < 2.5) tick(g, mx + 88, my + 17 + l * 10, 3.2); } });
    CR.draw(g, t);
  }

  function seat(id, keys, P, acts) { return { id: id, behind: true, keys: keys, P: P, act: function (P, t, S) { var st = S.cast[id], busy = keys.indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    var k2 = Math.abs(Math.sin(t * (busy ? 10 : 3) + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : (id === 'acc' ? 0.4 : -0.4), 0.08); CR.cast(P, st, t, acts); } }; }
  function glowOf(b, pad) { return function (g) { rr(g, b.x - pad, b.y - pad, b.w + pad * 2, b.h + pad * 2, 12); }; }
  window.IXW.worlds['app-acc'] = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(46,156,126,.22)',
    glow: { bank: glowOf(BK, 10), reports: glowOf(RP, 8), invoices: glowOf(INV, 8), bills: glowOf(BIL, 8), tax: glowOf(TAX, 8), close: glowOf(CLS, 8), stamp: function (g) { var s = T.side; rr(g, s.x, s.y - 60, s.w, 66, 10); } },
    backGlow: ['bank', 'reports', 'invoices', 'bills', 'tax', 'close', 'stamp'],
    cast: [
      seat('acc', ['bank', 'reports'], ACC, ['nod', 'think', 'wave', 'id']),
      seat('ap', ['bills', 'invoices'], AP, ['type', 'nod', 'id', 'cheer']),
      { id: 'cfo', behind: false, keys: ['tax', 'close'], P: CFO, act: function (P, t, S) { var st = S.cast.cfo, busy = S.hot === 'tax' || S.hot === 'close'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -210], [-150, -320 + Math.sin(t * 3) * 8]] : [[-70, -210], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.6, 0.08); CR.cast(P, st, t, ['cheer', 'wave', 'nod', 'id']); } }
    ],
    toy: function (name, S, t) { if (name === 'stamp') { STAMP.t = t; CR.burst('spark', T.side.x + 40, T.side.y - 20, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
