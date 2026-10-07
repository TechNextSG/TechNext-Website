/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-sales (/odoo/apps/sales) — Odoo Sales: a bright sales office, quote to cash. The quotation screen builds a quote
   line by line (with an optional extra); pricelists apply by customer; the customer signs and pays online from a tablet; the
   quote becomes a sales order, which creates the delivery and the invoice; the sales dashboard. The rep and sales operations
   sit at their desks (chairs, legs and feet), the customer stands by with the tablet; a gift box holds the optional product.
   Sample figures only. Tap anyone, any screen or the box. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, ROSE = '#E46E78', PUR = '#714B67', OK = '#1E9E6A', BLUE = '#3167CA';
  var QS = { x: 320, y: -110, w: 300, h: 200 }, PRC = { x: 632, y: -106, w: 136, h: 80 }, ORD = { x: 632, y: 0, w: 136, h: 80 }, SGN = { x: 822, y: -106, w: 116, h: 80 }, DLV = { x: 822, y: 0, w: 116, h: 80 },
    DSH = { x: 190, y: -30, w: 140, h: 120 }, T = { desk: { x: 380, y: 392, w: 440 }, gift: { x: 280, y: 420 } };
  var QL = [['Barcode scanner', '× 6', '1,080.00'], ['Label printer', '× 2', '460.00'], ['Set-up service', '× 1', '300.00'], ['Optional: carry case', '× 6', '120.00']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.35); g.lineTo(x + r * 0.5, y - r * 0.35); g.stroke(); }
  function card(g, b, head, col) { shadowed(g, 10, 4, 0.16, function () { fillRR(g, b.x, b.y, b.w, b.h, 8, '#FFFFFF'); }); fillRR(g, b.x, b.y, b.w, 18, 8, col); g.fillRect(b.x, b.y + 10, b.w, 8); text(g, head, b.x + 8, b.y + 13, 7, 800, '#FFFFFF'); }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#FDF7F7'); wg.addColorStop(1, '#F5EAEC'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = '#EFDFE2'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#E4CDD2'; g.fillRect(e.l, 246, e.r - e.l, 5);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 220, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 300); }
    CO.ceiling(g, e, CEIL, '#F7F0F1', '#FCF9FA', '#FFFFFF'); CO.floor(g, e, F, '#E7EBF1', '#D6DDE7', 'rgba(40,70,120,.08)');
    g.restore();
  }
  function paintBack(g, ext) {
    shadowed(g, 14, 5, 0.18, function () { fillRR(g, QS.x - 6, QS.y - 6, QS.w + 12, QS.h + 12, 9, '#2A3142'); }); fillRR(g, QS.x, QS.y, QS.w, QS.h, 4, '#FFFFFF');
    fillRR(g, QS.x, QS.y, QS.w, 22, 4, PUR); g.fillRect(QS.x, QS.y + 14, QS.w, 8); text(g, 'Sales · Quotation S00042 · sample', QS.x + 10, QS.y + 15, 8, 800, '#FFFFFF');
    card(g, PRC, 'Pricelists', '#F2A33A'); card(g, ORD, 'Sales order', BLUE); card(g, SGN, 'Sign & pay', ROSE); card(g, DLV, 'Deliver & invoice', OK);
    shadowed(g, 10, 4, 0.14, function () { fillRR(g, DSH.x, DSH.y, DSH.w, DSH.h, 10, '#FFFFFF'); }); text(g, 'SALES THIS MONTH', DSH.x + 10, DSH.y + 18, 7, 800, '#8A96A8');
    var gt = T.gift; soft(g, gt.x, F + 4, 40, 6, 0.3); fillRR(g, gt.x - 30, gt.y + 10, 60, F - gt.y - 10, 4, '#D9C3A0');
    K.plant(g, { x: 1170, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    [512, 638].forEach(function (mx) { fillRR(g, mx - 4, d.y - 74, 108, 64, 6, '#2A3142'); fillRR(g, mx + 46, d.y - 10, 10, 10, 2, '#5C6B7A'); fillRR(g, mx + 30, d.y - 3, 42, 4, 2, '#5C6B7A'); });
  }

  var W = CR.who;
  var REP = W({ x: 470, y: 470, s: 0.5, ph: 0.6, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: ROSE, top2: '#FFFFFF', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.4 });
  var OPS = W({ x: 774, y: 470, s: 0.5, ph: 1.8, skin: 3, hair: 1, style: 'short', outfit: 'polo', top: '#F2A33A', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.4 });
  var CUS = W({ x: 930, y: 470, s: 0.54, ph: 2.6, skin: 0, hair: 1, style: 'long', outfit: 'shirt', top: BLUE, id: '#C9D2DE', hold: 'tablet', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var CREW = [
    { x0: 1200, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Your products, prices and taxes, set up **once**.', 'Quote templates for what you sell **most**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Confirmed orders flow to **Inventory**.', 'And to **Accounting**, without re-typing.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var GIFT = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the quotation fills in line by line; the optional extra joins when the box is opened (or on the Quotation stop) */
    var qh = S.hot === 'quote', n = Math.floor(qh ? ((t - (S.kT || 0)) * 1.4) % 6 : (t * 0.5) % 6), opt = qh || t - GIFT.t < 4;
    text(g, 'Customer', QS.x + 12, QS.y + 38, 7, 700, '#8A96A8'); text(g, 'Harbourline Supplies', QS.x + 64, QS.y + 38, 8, 800, '#1B1F3B');
    QL.forEach(function (l, i) { if (i === 3 && !opt) return; var y = QS.y + 48 + i * 26, on = i < n || (i === 3 && opt); fillRR(g, QS.x + 10, y, QS.w - 20, 22, 5, i === 3 ? '#FDF0F2' : '#F6F8FB');
      if (on) { text(g, l[0], QS.x + 18, y + 14, 7.6, 800, i === 3 ? '#A33E4E' : '#1B1F3B'); text(g, l[1], QS.x + 170, y + 14, 7.4, 700, '#5C6B7A'); text(g, 'S$ ' + l[2], QS.x + QS.w - 18, y + 14, 7.6, 800, '#1B1F3B', 'right'); } });
    var tot = n >= 3 ? (opt ? '1,960.00' : '1,840.00') : '…'; text(g, 'Total', QS.x + 170, QS.y + QS.h - 14, 8, 800, '#5C6B7A'); text(g, 'S$ ' + tot, QS.x + QS.w - 18, QS.y + QS.h - 14, 10, 800, PUR, 'right');
    fillRR(g, QS.x + 12, QS.y + QS.h - 28, 70, 18, 6, PUR); text(g, 'Send', QS.x + 47, QS.y + QS.h - 15, 7.4, 800, '#FFFFFF', 'center');
    /* pricelists: the right price for the customer group */
    var ph = S.hot === 'price' ? Math.floor(t * 1.4) % 3 : 0; [['Retail', 'S$ 190'], ['Reseller', 'S$ 180'], ['10+ units', 'S$ 172']].forEach(function (r, i) { var y = PRC.y + 24 + i * 17;
      fillRR(g, PRC.x + 6, y - 2, PRC.w - 12, 15, 4, i === ph ? '#FFF1D6' : '#FFFFFF'); text(g, r[0], PRC.x + 10, y + 8, 6.6, 700, '#3D4560'); text(g, r[1], PRC.x + PRC.w - 10, y + 8, 6.6, 800, '#B7791F', 'right'); });
    /* sign & pay: a signature draws, then the payment ticks */
    var sp = S.hot === 'sign' ? clamp((t - (S.kT || 0)) * 0.7, 0, 1.4) : ((t * 0.25) % 1.4); g.strokeStyle = '#1B1F3B'; g.lineWidth = 1.6; g.beginPath();
    for (var q = 0; q <= Math.min(1, sp) * 40; q++) { var sx = SGN.x + 14 + q * 2.2, sy = SGN.y + 44 + Math.sin(q * 0.6) * 6 * Math.cos(q * 0.13); if (q === 0) g.moveTo(sx, sy); else g.lineTo(sx, sy); } g.stroke();
    fillRR(g, SGN.x + 10, SGN.y + 56, SGN.w - 20, 1.5, 0.7, '#C9D2DE'); if (sp > 1) { tick(g, SGN.x + 18, SGN.y + 68, 5); text(g, 'Paid online', SGN.x + 28, SGN.y + 71, 6.6, 800, OK); }
    /* sales order: confirmed from the quote */
    var oc = S.hot === 'order' ? (t - (S.kT || 0)) % 3 > 1 : n >= 4; text(g, 'S00042', ORD.x + 8, ORD.y + 34, 9, 800, '#1B1F3B'); fillRR(g, ORD.x + 8, ORD.y + 44, 80, 16, 8, oc ? BLUE : '#EEF2F7');
    text(g, oc ? 'Sales order' : 'Quotation', ORD.x + 48, ORD.y + 55, 7, 800, oc ? '#FFFFFF' : '#5C6B7A', 'center'); text(g, 'nothing re-typed', ORD.x + 8, ORD.y + 72, 6.2, 700, '#8A96A8');
    /* delivery and invoice from the same lines */
    var dv = S.hot === 'deliver' ? Math.floor((t - (S.kT || 0)) * 1.2) : 2; [['WH/OUT/0042', 'Delivery'], ['INV/2026/0402', 'Invoice']].forEach(function (r, i) { var y = DLV.y + 26 + i * 24, on = i < dv;
      text(g, r[1], DLV.x + 8, y + 6, 6.2, 700, '#8A96A8'); text(g, r[0], DLV.x + 8, y + 16, 6.8, 800, on ? '#1B1F3B' : '#C9D2DE'); if (on) tick(g, DLV.x + DLV.w - 14, y + 10, 5); });
    /* dashboard: bars by month */
    var dh = S.hot === 'report'; for (var b = 0; b < 6; b++) { var h = 14 + (b / 5) * 40 + hash(b + (dh ? Math.floor(t * 2) : 0)) * 14; fillRR(g, DSH.x + 14 + b * 19, DSH.y + DSH.h - 14 - h, 13, h, 3, b === 5 ? ROSE : '#F4C7CD'); }
    /* the gift box: the optional product; tapped, the lid pops */
    var gt = T.gift, gp = t - GIFT.t, lid = gp < 1.4 ? Math.sin(Math.min(1, gp * 2) * Math.PI / 2) * 22 : 0;
    fillRR(g, gt.x - 22, gt.y - 30, 44, 34, 4, ROSE); g.fillStyle = '#FFD84A'; g.fillRect(gt.x - 3, gt.y - 30, 6, 34); fillRR(g, gt.x - 25, gt.y - 38 - lid, 50, 10, 3, '#C9566A'); g.fillRect(gt.x - 3, gt.y - 38 - lid, 6, 10);
    fillE(g, gt.x - 6, gt.y - 42 - lid, 6, 4, '#FFD84A'); fillE(g, gt.x + 6, gt.y - 42 - lid, 6, 4, '#FFD84A');
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    var d = T.desk; [[512, 'My quotations', PUR], [638, 'To deliver', BLUE]].forEach(function (m, k) { var mx = m[0], my = d.y - 70; fillRR(g, mx, my, 100, 56, 3, '#FFFFFF'); fillRR(g, mx, my, 100, 10, 3, m[2]); text(g, m[1], mx + 4, my + 7.6, 5, 800, '#FFFFFF');
      for (var l = 0; l < 4; l++) { fillRR(g, mx + 6, my + 15 + l * 10, 58, 4, 2, '#D5DCE6'); if ((t * 0.8 + l + k) % 4 < 2.5) tick(g, mx + 88, my + 17 + l * 10, 3.2); } });
    /* the customer's tablet: the signature pad */
    if (S.hot === 'sign') { var cx = CUS.x + 38, cy = CUS.y - 104; fillRR(g, cx - 2, cy - 2, 34, 24, 3, '#FFFFFF'); g.strokeStyle = '#1B1F3B'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx + 3, cy + 14); g.quadraticCurveTo(cx + 12, cy + 2 + Math.sin(t * 5) * 3, cx + 26, cy + 12); g.stroke(); }
    CR.draw(g, t);
  }

  function seat(id, keys, P, acts) { return { id: id, behind: true, keys: keys, P: P, act: function (P, t, S) { var st = S.cast[id], busy = keys.indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    var k2 = Math.abs(Math.sin(t * (busy ? 10 : 3) + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : (id === 'rep' ? 0.4 : -0.4), 0.08); CR.cast(P, st, t, acts); } }; }
  function glowOf(b, pad) { return function (g) { rr(g, b.x - pad, b.y - pad, b.w + pad * 2, b.h + pad * 2, 12); }; }
  window.IXW.worlds['app-sales'] = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(228,110,120,.22)',
    glow: { quote: glowOf(QS, 10), price: glowOf(PRC, 8), order: glowOf(ORD, 8), sign: glowOf(SGN, 8), deliver: glowOf(DLV, 8), report: glowOf(DSH, 8), gift: function (g) { var b = T.gift; rr(g, b.x - 32, b.y - 50, 64, 60, 10); } },
    backGlow: ['quote', 'price', 'order', 'sign', 'deliver', 'report', 'gift'],
    cast: [
      seat('rep', ['quote', 'price'], REP, ['nod', 'wave', 'id', 'cheer']),
      seat('ops', ['order', 'deliver'], OPS, ['type', 'nod', 'id', 'cheer']),
      { id: 'cust', behind: false, keys: ['sign'], P: CUS, act: function (P, t, S) { var st = S.cast.cust, busy = S.hot === 'sign'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -210], [80, -200 + Math.sin(t * 5) * 4]] : [[-70, -210], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.6, 0.08); CR.cast(P, st, t, ['wave', 'cheer', 'love', 'nod']); } }
    ],
    toy: function (name, S, t) { if (name === 'gift') { GIFT.t = t; CR.burst('conf', T.gift.x, T.gift.y - 40, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
