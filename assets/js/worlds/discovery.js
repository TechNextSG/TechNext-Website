/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: discovery (/odoo/discovery) — step 1 of 4: the discovery workshop, in the client's meeting room on a bright day.
   The whiteboard carries the process map (order-to-cash, procure-to-pay, record-to-report) with a pulse running each lane and
   red sticky notes for the gaps; the wall screen matches each step to an Odoo 20 app; finance, sales and the warehouse sit at
   the table (chairs, legs and feet); TechNext's consultant (TechNext ID) walks the map; the written scope and the quotation
   wait on the credenza. Clients wear their own grey passes. Tap anyone, a lane, the stickies or the coffee. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, BLUE = '#3167CA', RED = '#E2453C', Y = '#FFD84A';
  var WB = { x: 300, y: -100, w: 560, h: 270 }, LANES = [
    { key: 'o2c', name: 'Order-to-cash', col: BLUE, nodes: ['Quote', 'Order', 'Deliver', 'Invoice', 'Paid'] },
    { key: 'p2p', name: 'Procure-to-pay', col: '#14A38B', nodes: ['Request', 'PO', 'Receive', 'Bill', 'Pay'] },
    { key: 'r2r', name: 'Record-to-report', col: '#714B67', nodes: ['Journal', 'Reconcile', 'Close', 'Report'] }];
  var T = { tv: { x: 900, y: -70, w: 170, h: 120 }, table: { x: 380, y: 380, w: 400 }, cred: { x: 176, y: 380, w: 160 }, win: { x: -260, y: -60, w: 520, h: 300 } };
  var APPS = [['Sales', '#E46E78'], ['Inventory', '#F2A33A'], ['Purchase', '#4FA7C4'], ['Invoicing', '#7A5AAE'], ['Accounting', '#2E9C7E'], ['Dashboards', '#3167CA']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function laneY(i) { return WB.y + 52 + i * 72; }
  function nodeX(j) { return WB.x + 112 + j * 76; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F7F9FC'); wg.addColorStop(1, '#ECF0F6'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    /* a window onto the city, morning light */
    var w = T.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
    CO.sky(g, { l: w.x, r: w.x + w.w, t: w.y }, w.y, w.y + w.h, [[0, '#7FB8EE'], [0.75, '#C3E0F7'], [1, '#EAF5FC']]);
    CO.skySG(g, w.x - 40, w.x + w.w + 40, 200, 240, { mbs: w.x + 330, wheel: w.x + 120 }); g.restore();
    CO.ceiling(g, e, CEIL, '#EEF2F8', '#F8FAFD', '#FFFFFF');
    CO.floor(g, e, F, '#E7EBF1', '#D6DDE7', 'rgba(40,70,120,.08)');
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k);
    var w = T.win; g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.strokeRect(w.x, w.y, w.w, w.h); g.lineWidth = 6; g.beginPath(); for (var i = 1; i < 4; i++) { g.moveTo(w.x + i * w.w / 4, w.y); g.lineTo(w.x + i * w.w / 4, w.y + w.h); } g.stroke();
    fillRR(g, w.x - 14, w.y + w.h, w.w + 28, 12, 4, '#FFFFFF');
    g.restore();
  }
  function paintBack(g, ext) {
    /* the whiteboard: aluminium frame, marker tray, the three lane labels */
    shadowed(g, 16, 5, 0.18, function () { fillRR(g, WB.x - 8, WB.y - 8, WB.w + 16, WB.h + 16, 8, '#C9D2DE'); }); fillRR(g, WB.x, WB.y, WB.w, WB.h, 4, '#FFFFFF');
    fillRR(g, WB.x + 40, WB.y + WB.h + 6, 160, 8, 3, '#AEB8C8'); [['#3167CA', 60], ['#E2453C', 90], ['#14A38B', 120]].forEach(function (m) { fillRR(g, WB.x + m[1], WB.y + WB.h, 24, 6, 3, m[0]); });
    text(g, 'How work moves today', WB.x + 16, WB.y + 24, 13, 800, '#1B1F3B');
    LANES.forEach(function (L, i) { var y = laneY(i); fillRR(g, WB.x + 14, y - 16, 90, 32, 6, L.col); text(g, L.name, WB.x + 59, y + 4, 7.6, 800, '#FFFFFF', 'center');
      g.strokeStyle = 'rgba(27,31,59,.25)'; g.lineWidth = 2; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(nodeX(0), y); g.lineTo(nodeX(L.nodes.length - 1) + 58, y); g.stroke(); g.setLineDash([]); });
    /* the wall screen: matched to Odoo 20 */
    var tv = T.tv; shadowed(g, 14, 5, 0.22, function () { fillRR(g, tv.x - 6, tv.y - 6, tv.w + 12, tv.h + 12, 8, '#2A3142'); }); fillRR(g, tv.x, tv.y, tv.w, tv.h, 3, '#FFFFFF');
    fillRR(g, tv.x, tv.y, tv.w, 16, 3, '#714B67'); g.fillRect(tv.x, tv.y + 10, tv.w, 6); text(g, 'MATCHED TO ODOO 20', tv.x + 8, tv.y + 11.5, 6.6, 800, '#FFFFFF');
    CO.clock(g, 1130, -40, 18, 8, '#1B1F3B');
    /* the credenza under the window: the written scope binder and the quotation */
    var cr = T.cred; soft(g, cr.x + cr.w / 2, F + 4, 100, 8, 0.3); fillRR(g, cr.x, cr.y, cr.w, F - cr.y, 6, '#D9C3A0'); fillRR(g, cr.x + 8, cr.y + 14, cr.w / 2 - 12, F - cr.y - 24, 4, '#E8D6B8'); fillRR(g, cr.x + cr.w / 2 + 4, cr.y + 14, cr.w / 2 - 12, F - cr.y - 24, 4, '#E8D6B8');
    fillE(g, cr.x + cr.w / 2 - 10, cr.y + 48, 2.5, 8, '#A98C62'); fillE(g, cr.x + cr.w / 2 + 10, cr.y + 48, 2.5, 8, '#A98C62');
    K.plant(g, { x: 1240, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    /* the meeting table: an open table, so everyone's legs show */
    var t = T.table; CO.desk(g, t.x, t.y, t.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    fillRR(g, t.x + 30, t.y - 4, 40, 4, 2, '#FFFFFF'); fillRR(g, t.x + 140, t.y - 5, 46, 5, 2, '#FFFFFF'); fillRR(g, t.x + 250, t.y - 4, 40, 4, 2, '#FFFFFF');
    fillRR(g, t.x + 320, t.y - 30, 56, 30, 4, '#2A3550'); fillRR(g, t.x + 312, t.y - 3, 72, 4, 2, '#9AA6BC');
  }

  var W = CR.who;
  var CON = W({ x: 900, y: 470, s: 0.54, ph: 0.3, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: '#3167CA', hold: null, hands: [[-80, -170], [-150, -320]], look: -0.8 });
  var FIN = W({ x: 448, y: 470, s: 0.5, ph: 1.1, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.4 });
  var SAL = W({ x: 572, y: 470, s: 0.5, ph: 2.0, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#F08A24', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.6 });
  var WH = W({ x: 696, y: 470, s: 0.5, ph: 2.7, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#14A38B', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.8 });
  var CREW = [
    { x0: 1200, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext project manager', lines: ['Taking notes so the **scope** matches the map.', 'Nothing gets built until it is **written down**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'long', outfit: 'polo', top: '#1E3A6E', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Next: the **warehouse** walk-through.', 'Same questions, every department: how does it move **today**?'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 1, style: 'short', outfit: 'polo', top: '#3167CA', hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var STK = { t: -9 }, SCO = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the lanes: nodes appear as they are walked; a pulse runs along each; the active lane runs faster */
    LANES.forEach(function (L, i) { var y = laneY(i), on = S.hot === L.key, n = L.nodes.length, sp = on ? 0.9 : 0.25, ph = ((t * sp + i * 0.33) % 1) * (n - 1);
      L.nodes.forEach(function (nm, j) { var x = nodeX(j), lit = on ? (j <= Math.floor(((t - (S.lT || 0)) * 2.5)) % (n + 2)) : true;
        fillRR(g, x, y - 15, 58, 30, 8, lit ? (on && j === Math.round(ph) ? L.col : '#FFFFFF') : '#F1F4F9'); g.strokeStyle = L.col; g.lineWidth = 2; rr(g, x, y - 15, 58, 30, 8); g.stroke();
        text(g, nm, x + 29, y + 4, 7.4, 800, on && j === Math.round(ph) ? '#FFFFFF' : '#1B1F3B', 'center'); });
      var px = lerp(nodeX(Math.floor(ph)) + 58, nodeX(Math.min(n - 1, Math.floor(ph) + 1)), ph % 1); fillE(g, px + 4, y, 4.5, 4.5, L.col); });
    /* the gaps: red sticky notes on the right of the board; tapped (or on the Gaps stop) a new one lands */
    var gs = S.hot === 'gaps', st = t - STK.t;
    [['Re-typed', 'in Excel'], ['No stock', 'reserve'], ['Manual', 'reconcile']].forEach(function (s, i) { var x = WB.x + WB.w - 68, y = WB.y + 36 + i * 72, wob = gs ? Math.sin(t * 5 + i) * 0.06 : 0;
      g.save(); g.translate(x + 30, y + 22); g.rotate(-0.05 + i * 0.05 + wob); shadowed(g, 4, 2, 0.15, function () { fillRR(g, -30, -22, 60, 44, 2, i === 1 && st < 2 ? Y : '#FFB4AE'); });
      text(g, s[0], 0, -4, 7.2, 800, '#7A1F1A', 'center'); text(g, s[1], 0, 8, 7.2, 700, '#7A1F1A', 'center'); g.restore(); });
    if (st < 2) { var a = clamp(st * 3, 0, 1); g.save(); g.globalAlpha = a; g.translate(WB.x + 70, WB.y + WB.h - 30); g.rotate(-0.08); fillRR(g, -26, -16, 52, 32, 2, Y); text(g, 'Gap noted', 0, 3, 7.2, 800, '#5A4600', 'center'); g.restore(); }
    /* the wall screen: each step matched to an app */
    var tv = T.tv, ap = S.hot === 'apps', na = Math.floor(t * (ap ? 2.2 : 0.7)) % (APPS.length + 2);
    APPS.forEach(function (A, i) { var x = tv.x + 8 + (i % 2) * 80, y = tv.y + 22 + Math.floor(i / 2) * 31, on = i < na; fillRR(g, x, y, 74, 26, 5, on ? '#F1F4F9' : '#F8F9FB'); fillRR(g, x + 4, y + 5, 16, 16, 4, on ? A[1] : '#D5DCE6'); text(g, A[0], x + 24, y + 16.5, 7, 800, on ? '#1B1F3B' : '#9AA6BC'); if (on) fillE(g, x + 68, y + 6, 2.6, 2.6, '#2BC48A'); });
    /* the scope binder and the quotation on the credenza; tapped, the binder opens */
    var cr = T.cred, so = S.hot === 'scope' ? 1 : clamp((2.4 - (t - SCO.t)) * 2, 0, 1);
    fillRR(g, cr.x + 16, cr.y - 46, 60, 46, 4, BLUE); fillRR(g, cr.x + 22, cr.y - 40, 48, 14, 2, '#FFFFFF'); text(g, 'SCOPE', cr.x + 46, cr.y - 30, 7.4, 800, BLUE, 'center'); fillRR(g, cr.x + 16, cr.y - 46, 7, 46, 2, '#1E4691');
    fillRR(g, cr.x + 86, cr.y - 10, 64, 10, 2, '#FFFFFF'); fillRR(g, cr.x + 90, cr.y - 7, 30, 3, 1.5, '#9AA6BC'); text(g, 'QUOTATION', cr.x + 118, cr.y - 13, 5.6, 800, '#5C6B7A', 'center');
    if (so > 0) { var px = 330, py = 178; g.save(); g.globalAlpha = so; shadowed(g, 8, 3, 0.2, function () { fillRR(g, px, py, 160, 76, 6, '#FFFFFF'); }); fillRR(g, px, py, 6, 76, 3, BLUE);
      text(g, 'Written scope', px + 14, py + 17, 9, 800, '#1B1F3B'); ['Process map', 'App map', 'Gaps and fixes', 'Quotation'].forEach(function (s, i) { fillRR(g, px + 14, py + 26 + i * 11, 8, 8, 2, '#2BC48A'); text(g, s, px + 28, py + 33 + i * 11, 7, 700, '#3D4560'); }); g.restore(); }
  }
  function paintFrontLive(g, t, S) { CO.crew(CREW, g, t, S, true); CR.draw(g, t); }

  function sitter(id, keys, P, acts) { return { id: id, behind: true, keys: keys, P: P, act: function (P, t, S) { var st = S.cast[id], busy = keys.indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    P.hands = busy ? [[-60, -206], [90, -300 + Math.sin(t * 4) * 10]] : [[-60, -206 + Math.abs(Math.sin(t * 1.3 + P.ph)) * 4], [60, -206]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0.7, 0.08); CR.cast(P, st, t, acts); } }; }
  window.IXW.worlds.discovery = {
    pan: [-300, 1140],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t) { var w = T.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
      for (var i = 0; i < 3; i++) { var cx = w.x - 80 + ((t * (5 + i * 2) + i * 200) % (w.w + 160)), cy = w.y + 40 + i * 30; g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(cx, cy, 36, 10, 0, 0, Math.PI * 2); g.ellipse(cx + 16, cy - 7, 20, 11, 0, 0, Math.PI * 2); g.fill(); } g.restore(); },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(49,103,202,.2)',
    glow: {
      o2c: function (g) { rr(g, WB.x + 6, laneY(0) - 26, WB.w - 92, 52, 10); },
      p2p: function (g) { rr(g, WB.x + 6, laneY(1) - 26, WB.w - 92, 52, 10); },
      r2r: function (g) { rr(g, WB.x + 6, laneY(2) - 26, WB.w - 92, 52, 10); },
      gaps: function (g) { rr(g, WB.x + WB.w - 84, WB.y + 22, 82, 230, 10); },
      apps: function (g) { var tv = T.tv; rr(g, tv.x - 12, tv.y - 12, tv.w + 24, tv.h + 24, 10); },
      scope: function (g) { var c = T.cred; rr(g, c.x - 8, c.y - 56, c.w + 16, 66, 10); },
      sticky: function (g) { rr(g, WB.x + 36, WB.y + WB.h - 52, 70, 44, 8); }
    },
    backGlow: ['o2c', 'p2p', 'r2r', 'gaps', 'apps', 'scope', 'sticky'],
    cast: [
      { id: 'con', behind: false, keys: [], P: CON, act: function (P, t, S) { var st = S.cast.con, lane = ['o2c', 'p2p', 'r2r', 'gaps'].indexOf(S.hot); P.talk = t < st.until || lane >= 0; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = lane >= 0 ? [[-80, -170], [-170, -330 + lane * 30 + Math.sin(t * 3) * 8]] : [[-80, -170], [-150, -300 + Math.sin(t * 1.2) * 10]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.8, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'think', 'cheer']); } },
      sitter('fin', ['r2r'], FIN, ['nod', 'think', 'wave', 'id']),
      sitter('sal', ['o2c'], SAL, ['wave', 'cheer', 'nod', 'id']),
      sitter('wh', ['p2p'], WH, ['nod', 'jump', 'wave', 'id'])
    ],
    toy: function (name, S, t) { if (name === 'sticky') { STK.t = t; CR.burst('spark', WB.x + 70, WB.y + WB.h - 40, t); } if (name === 'scope') SCO.t = t; },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { if (['o2c', 'p2p', 'r2r'].indexOf(key) >= 0) S.lT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
