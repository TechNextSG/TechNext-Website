/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-stock (/odoo/apps/inventory) — Odoo Inventory: a bright warehouse. Racks where every bin has an address; a picker
   scanning into a cart in route order; the packing bench (the packer seated: chair, legs and feet) with labels and a carrier;
   the receiving dock with a truck and pallets checked against the PO; wall screens for replenishment (reorder rules) and
   cycle counts. The warehouse lead stands by with a clipboard. Sample figures only. Tap anyone, a bin, the dock or a box. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, AMB = '#F2A33A', OK = '#1E9E6A', BLUE = '#3167CA', PUR = '#714B67';
  var RK = { x: 300, y: -40, w: 220 }, RO = { x: 670, y: -95, w: 180, h: 110 }, CT = { x: 670, y: 40, w: 180, h: 100 }, DK = { x: 880, y: 220, w: 150 }, T = { bench: { x: 710, y: 400, w: 150 }, cart: { x: 590, y: 400 } };
  var LEVELS = [40, 140, 240, 340];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function tick(g, x, y, r) { fillE(g, x, y, r, r, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = r * 0.3; g.beginPath(); g.moveTo(x - r * 0.45, y); g.lineTo(x - r * 0.1, y + r * 0.35); g.lineTo(x + r * 0.5, y - r * 0.35); g.stroke(); }
  function box(g, x, y, w, h, col) { fillRR(g, x, y, w, h, 2, col || '#C9A27A'); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x + w / 2 - 2, y, 4, h); fillRR(g, x + 3, y + 3, w * 0.4, 4, 1, 'rgba(255,255,255,.6)'); }
  function bin(i, j) { return { x: RK.x + 10 + j * 52, y: LEVELS[i] - 54 }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F7F8FB'); wg.addColorStop(1, '#EBEEF4'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.strokeStyle = 'rgba(40,60,90,.06)'; g.lineWidth = 2; g.beginPath(); for (var x = Math.floor(e.l / 80) * 80; x < e.r; x += 80) { g.moveTo(x, CEIL); g.lineTo(x, F); } g.stroke();
    fillRR(g, e.l, -120, e.r - e.l, 10, 0, '#FFD84A'); for (var s = Math.floor(e.l / 40) * 40; s < e.r; s += 40) { g.fillStyle = '#1B1F3B'; g.beginPath(); g.moveTo(s, -120); g.lineTo(s + 12, -120); g.lineTo(s + 2, -110); g.lineTo(s - 10, -110); g.fill(); }
    CO.ceiling(g, e, CEIL, '#EEF1F6', '#F8FAFC', '#FFFFFF');
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#DDE2EA'); fl.addColorStop(1, '#C9D0DB'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = '#FFD84A'; g.fillRect(e.l, F + 28, e.r - e.l, 5);
    g.restore();
  }
  function paintBack(g, ext) {
    /* the racks: four levels, four bins each, each with its address */
    soft(g, RK.x + RK.w / 2, F + 4, 140, 10, 0.3);
    [RK.x, RK.x + RK.w - 10].forEach(function (x) { fillRR(g, x, RK.y, 10, F - RK.y, 3, BLUE); });
    LEVELS.forEach(function (ly, i) { fillRR(g, RK.x, ly, RK.w, 8, 2, AMB); for (var j = 0; j < 4; j++) { var b = bin(i, j); if (hash(i * 4 + j + 3) > 0.2) box(g, b.x + 4, b.y + 14, 40, 40, ['#C9A27A', '#D9B88E', '#B8916A'][(i + j) % 3]);
      fillRR(g, b.x + 6, ly + 10, 38, 11, 2, '#FFFFFF'); text(g, 'WH/A-' + (i + 1) + '0' + (j + 1), b.x + 25, ly + 18.5, 5.4, 800, '#1B1F3B', 'center'); } });
    /* the wall screens */
    [RO, CT].forEach(function (s, k) { shadowed(g, 12, 4, 0.2, function () { fillRR(g, s.x - 5, s.y - 5, s.w + 10, s.h + 10, 7, '#2A3142'); }); fillRR(g, s.x, s.y, s.w, s.h, 3, '#FFFFFF');
      fillRR(g, s.x, s.y, s.w, 16, 3, k ? BLUE : PUR); g.fillRect(s.x, s.y + 9, s.w, 7); text(g, k ? 'Cycle count · sample' : 'Replenishment · reorder rules', s.x + 8, s.y + 11.5, 6.6, 800, '#FFFFFF'); });
    /* the dock: roller door, the truck's back, pallets */
    var d = DK; fillRR(g, d.x, d.y, d.w, F - d.y, 4, '#5C6B7A'); fillRR(g, d.x + 8, d.y + 8, d.w - 16, F - d.y - 8, 2, '#C9D2DE');
    for (var r = 0; r < 8; r++) { g.fillStyle = 'rgba(40,60,90,.12)'; g.fillRect(d.x + 8, d.y + 16 + r * 14, d.w - 16, 2); }
    fillRR(g, d.x + 12, d.y + 60, d.w - 24, F - d.y - 60, 2, '#2A3142'); text(g, 'DOCK 1', d.x + d.w / 2, d.y - 8, 8, 800, '#5C6B7A', 'center');
    /* the packing bench */
    var bn = T.bench; CO.desk(g, bn.x, bn.y, bn.w, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
  }
  function paintFront(g, ext) {
    /* the pick cart */
    var c = T.cart; soft(g, c.x + 30, F + 4, 40, 6, 0.3); g.strokeStyle = '#5C6B7A'; g.lineWidth = 4; g.beginPath(); g.moveTo(c.x, c.y - 30); g.lineTo(c.x, F - 10); g.lineTo(c.x + 62, F - 10); g.stroke();
    fillRR(g, c.x, F - 14, 66, 6, 3, '#5C6B7A'); fillE(g, c.x + 8, F - 4, 5, 5, '#1B1F3B'); fillE(g, c.x + 58, F - 4, 5, 5, '#1B1F3B'); fillRR(g, c.x, c.y + 20, 66, 5, 2, '#5C6B7A');
  }

  var W = CR.who;
  var PICK = W({ x: 540, y: 470, s: 0.54, ph: 0.6, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: AMB, id: '#9AA6BC', hold: 'tablet', hands: [[-60, -212], [70, -230]], look: 0.6 });
  var PACK = W({ x: 800, y: 470, s: 0.5, ph: 1.8, skin: 0, hair: 1, style: 'pony', outfit: 'shirt', top: BLUE, sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.3 });
  var LEAD = W({ x: 240, y: 470, s: 0.54, ph: 2.6, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: OK, id: '#9AA6BC', hold: 'clipboard', hands: [[-60, -212], [70, -170]], look: 0.6 });
  var CREW = [
    { x0: 1100, x1: 1400, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Locations, routes and reorder rules set up **first**.', 'Opening stock counted and **loaded** before go-live.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Barcode scanners configured for **your** labels.', 'The warehouse trained on **receipts and picking**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var BEEP = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the bins: on Locations each address lights in turn; on Picking the route's bins light in order */
    var pk = S.hot === 'picking', lo = S.hot === 'putaway', route = [[3, 0], [2, 1], [2, 3], [1, 2]], ri = Math.floor((t - (S.kT || 0)) * 1.2) % 4;
    if (lo) { var li = Math.floor(t * 3) % 16, b = bin(Math.floor(li / 4), li % 4); g.strokeStyle = AMB; g.lineWidth = 2.5; rr(g, b.x + 2, LEVELS[Math.floor(li / 4)] + 8, 46, 15, 4); g.stroke(); }
    if (pk) route.forEach(function (r, k) { var b = bin(r[0], r[1]); g.strokeStyle = k <= ri ? OK : 'rgba(30,158,106,.35)'; g.lineWidth = 2.5; rr(g, b.x + 2, b.y + 10, 48, 46, 5); g.stroke(); fillE(g, b.x + 44, b.y + 14, 6, 6, k <= ri ? OK : '#C9D2DE'); text(g, String(k + 1), b.x + 44, b.y + 17, 7, 800, '#FFFFFF', 'center'); });
    /* the cart fills as the picker scans */
    var c = T.cart, nb = pk ? ri + 1 : 1 + Math.floor((t * 0.3) % 3); for (var q = 0; q < nb; q++) box(g, c.x + 6 + (q % 2) * 30, c.y - 4 - Math.floor(q / 2) * 24, 26, 22);
    /* the scanner's beam */
    var bt = t - BEEP.t; if (pk) { g.strokeStyle = 'rgba(226,69,60,' + (0.4 + 0.4 * Math.sin(t * 20)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.moveTo(PICK.x + 40, PICK.y - 128); g.lineTo(c.x + 30, c.y - 4); g.stroke(); }
    if (bt < 1.6) { g.save(); g.globalAlpha = clamp((1.6 - bt) * 2, 0, 1); fillRR(g, DK.x + 20, DK.y - 52 - bt * 10, 110, 24, 8, AMB); text(g, 'Beep beep!', DK.x + 75, DK.y - 36 - bt * 10, 9, 800, '#1B1F3B', 'center'); g.restore(); }
    /* replenishment: min/max bars, a purchase raised when one dips */
    var rp = S.hot === 'reorder'; [['Scanner', 0.25, 12, 40], ['Labels', 0.7, 200, 600], ['Cases', 0.45, 30, 90]].forEach(function (r, i) { var y = RO.y + 26 + i * 26, lvl = rp ? clamp(r[1] - (i === 0 ? ((t - (S.kT || 0)) * 0.1) % 0.3 : 0), 0.05, 1) : r[1];
      text(g, r[0], RO.x + 8, y + 7, 6.6, 700, '#3D4560'); fillRR(g, RO.x + 54, y, 90, 9, 4, '#EEF2F7'); fillRR(g, RO.x + 54, y, 90 * lvl, 9, 4, lvl < 0.3 ? '#E2453C' : OK); g.fillStyle = '#1B1F3B'; g.fillRect(RO.x + 54 + 90 * 0.3, y - 2, 1.5, 13);
      if (lvl < 0.3) { fillRR(g, RO.x + 148, y - 2, 26, 13, 4, PUR); text(g, 'PO', RO.x + 161, y + 7.4, 6.4, 800, '#FFFFFF', 'center'); } });
    /* cycle count: counted vs on hand, the difference logged */
    var cc = S.hot === 'count' ? Math.floor((t - (S.kT || 0)) * 1.3) : 3; [['WH/A-101', '24', '24'], ['WH/A-203', '11', '12'], ['WH/A-304', '40', '40']].forEach(function (r, i) { var y = CT.y + 24 + i * 22, on = i < cc;
      text(g, r[0], CT.x + 8, y + 8, 6.6, 800, '#3D4560'); text(g, 'on hand ' + r[1], CT.x + 70, y + 8, 6.2, 700, '#8A96A8'); if (on) { var diff = r[1] !== r[2]; text(g, 'counted ' + r[2], CT.x + 120, y + 8, 6.2, 800, diff ? '#B7791F' : OK); if (!diff) tick(g, CT.x + CT.w - 10, y + 5, 4); } });
    /* the dock: a pallet rolls in and is checked against the PO */
    var rc = S.hot === 'receive' ? ((t - (S.kT || 0)) * 0.5) % 1.4 : ((t * 0.12) % 1.4), px = lerp(DK.x + 40, DK.x - 40, clamp(rc, 0, 1));
    fillRR(g, px - 28, F - 10, 60, 8, 2, '#A07A52'); box(g, px - 24, F - 52, 26, 42); box(g, px + 4, F - 52, 26, 42, '#D9B88E'); box(g, px - 10, F - 80, 30, 28, '#B8916A');
    if (rc > 1) { fillRR(g, px - 40, F - 112, 84, 22, 7, OK); text(g, 'PO00123 ✓', px + 2, F - 97, 8, 800, '#FFFFFF', 'center'); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the packing bench: a box is taped and labelled, the label printer and the carrier sticker */
    var bn = T.bench, pp = S.hot === 'packing' ? ((t - (S.kT || 0)) * 0.8) % 3 : (t * 0.3) % 3;
    box(g, bn.x + 14, bn.y - 40, 50, 40); if (pp > 1) { fillRR(g, bn.x + 18, bn.y - 30, 26, 16, 2, '#FFFFFF'); for (var l = 0; l < 6; l++) g.fillRect(bn.x + 21 + l * 3.6, bn.y - 26, 1.6, 8); }
    if (pp > 2) { fillRR(g, bn.x + 46, bn.y - 36, 16, 10, 2, '#E2453C'); }
    fillRR(g, bn.x + 100, bn.y - 26, 40, 26, 4, '#2A3142'); fillRR(g, bn.x + 106, bn.y - 6 - (pp % 1) * 10, 28, 8, 1.5, '#FFFFFF');
    CR.draw(g, t);
  }

  window.IXW.worlds['app-stock'] = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(242,163,58,.22)',
    glow: {
      receive: function (g) { rr(g, DK.x - 70, 340, DK.w + 80, F - 336, 12); },
      putaway: function (g) { rr(g, RK.x - 8, RK.y - 8, RK.w + 16, F - RK.y + 12, 12); },
      picking: function (g) { var c = T.cart; rr(g, c.x - 50, c.y - 90, 130, 140, 12); },
      packing: function (g) { var b = T.bench; rr(g, b.x - 6, b.y - 50, b.w + 12, 60, 10); },
      reorder: function (g) { rr(g, RO.x - 10, RO.y - 10, RO.w + 20, RO.h + 20, 12); },
      count: function (g) { rr(g, CT.x - 10, CT.y - 10, CT.w + 20, CT.h + 20, 12); },
      honk: function (g) { rr(g, DK.x - 6, DK.y - 20, DK.w + 12, 80, 10); }
    },
    backGlow: ['receive', 'putaway', 'reorder', 'count', 'honk'],
    cast: [
      { id: 'pick', behind: false, keys: ['picking', 'putaway'], P: PICK, act: function (P, t, S) { var st = S.cast.pick, busy = S.hot === 'picking' || S.hot === 'putaway'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-60, -212], [70 + Math.sin(t * 2) * 6, -230 + (busy ? Math.sin(t * 6) * 8 : 0)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0.6, 0.08); CR.cast(P, st, t, ['nod', 'jump', 'id', 'wave']); } },
      { id: 'pack', behind: true, keys: ['packing'], P: PACK, act: function (P, t, S) { var st = S.cast.pack, busy = S.hot === 'packing'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 9 : 3))) * 6; P.hands = [[-90, -206 - k2], [30, -206 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.3, 0.08); CR.cast(P, st, t, ['type', 'nod', 'id', 'cheer']); } },
      { id: 'lead', behind: false, keys: ['reorder', 'count', 'receive'], P: LEAD, act: function (P, t, S) { var st = S.cast.lead, busy = ['reorder', 'count', 'receive'].indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-60, -212], [70, -170 + (busy ? Math.sin(t * 4) * 6 : 0)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0.6, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'think']); } }
    ],
    toy: function (name, S, t) { if (name === 'honk') { BEEP.t = t; CR.burst('note', DK.x + 75, DK.y - 20, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
