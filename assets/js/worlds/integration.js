/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: integration (/odoo/integration) — step 3 of 4: connect what you keep. A bright integration room: the patch-bay
   wall cables the systems the client keeps (online store, marketplaces, payments, bank feeds, email and calendar, their own
   systems over the API) to one Odoo database, with data packets running each cable; an engineer sits at the sync log (chair,
   legs and feet), another plugs a connector in; tap the plug and a cable drops, retries and recovers. Everyone from TechNext
   wears a TechNext ID. Tap anyone, any system or the plug. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, TEAL = '#14A38B', NAVY = '#1B2A4A', PUR = '#714B67';
  var WALL = { x: 290, y: -112, w: 700, h: 300 }, HUB = { x: 565, y: -20, w: 150, h: 120 };
  var SYS = [
    { key: 'store', name: 'Online store', sub: 'Shopify · WooCommerce', col: '#95BF47', x: 312, y: -92, ev: 'Web order became a sales order' },
    { key: 'market', name: 'Marketplaces', sub: 'orders in, stock out', col: '#F08A24', x: 312, y: 0, ev: 'Stock level synced to the store' },
    { key: 'pay', name: 'Payments', sub: 'gateway payouts', col: '#635BFF', x: 312, y: 92, ev: 'Gateway payout matched in Accounting' },
    { key: 'bank', name: 'Bank feeds', sub: 'statement lines', col: '#3167CA', x: 830, y: -92, ev: 'Bank statement imported and matched' },
    { key: 'mail', name: 'Email & calendar', sub: 'meetings, threads', col: '#E0456B', x: 830, y: 0, ev: 'Customer email logged on the order' },
    { key: 'api', name: 'Your systems', sub: 'over the Odoo API', col: '#1B2A4A', x: 830, y: 92, ev: 'Legacy WMS synced over the API' }];
  var T = { desk: { x: 360, y: 392, w: 260 }, mon: { x: 400, y: 300, w: 140, h: 82 }, rack: { x: 1040, y: 170, w: 90 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function port(s) { var left = s.x < HUB.x; return { x: left ? s.x + 148 : s.x, y: s.y + 26, hx: left ? HUB.x : HUB.x + HUB.w, hy: HUB.y + 30 + (SYS.indexOf(s) % 3) * 30 }; }
  function cable(g, s, col, w) { var p = port(s), mx = (p.x + p.hx) / 2; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(p.x, p.y); g.bezierCurveTo(mx, p.y, mx, p.hy, p.hx, p.hy); g.stroke(); }
  function onCable(s, f) { var p = port(s), mx = (p.x + p.hx) / 2, u = 1 - f;
    return [u * u * u * p.x + 3 * u * u * f * mx + 3 * u * f * f * mx + f * f * f * p.hx, u * u * u * p.y + 3 * u * u * f * p.y + 3 * u * f * f * p.hy + f * f * f * p.hy]; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F5FAF9'); wg.addColorStop(1, '#E8F2F0'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.strokeStyle = 'rgba(20,163,139,.08)'; g.lineWidth = 1.5; g.beginPath(); for (var x = Math.floor(e.l / 40) * 40; x < e.r; x += 40) { g.moveTo(x, 230); g.lineTo(x, F); } g.stroke();
    g.fillStyle = '#DCEBE8'; g.fillRect(e.l, 226, e.r - e.l, 5);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 210, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 290); }
    CO.ceiling(g, e, CEIL, '#EEF4F3', '#F8FBFA', '#FFFFFF');
    CO.floor(g, e, F, '#E6ECEB', '#D3DCDA', 'rgba(20,90,80,.08)');
    g.restore();
  }
  function paintFrame(g) {}
  function paintBack(g, ext) {
    /* the patch-bay wall */
    shadowed(g, 16, 5, 0.14, function () { fillRR(g, WALL.x, WALL.y, WALL.w, WALL.h, 14, '#FFFFFF'); });
    text(g, 'CONNECTED TO ONE ODOO DATABASE', WALL.x + WALL.w / 2, WALL.y + WALL.h - 10, 8, 800, '#8A96A8', 'center');
    SYS.forEach(function (s) { cable(g, s, '#E3E9F0', 7); });
    /* the systems the client keeps */
    SYS.forEach(function (s) { shadowed(g, 6, 2, 0.14, function () { fillRR(g, s.x, s.y, 148, 52, 10, '#FFFFFF'); }); fillRR(g, s.x, s.y, 6, 52, 3, s.col);
      fillRR(g, s.x + 14, s.y + 12, 28, 28, 8, s.col); text(g, s.name, s.x + 50, s.y + 24, 9.5, 800, '#1B1F3B'); text(g, s.sub, s.x + 50, s.y + 38, 7, 700, '#8A96A8'); });
    /* the hub: your Odoo, one database */
    shadowed(g, 14, 5, 0.22, function () { fillRR(g, HUB.x, HUB.y, HUB.w, HUB.h, 16, PUR); });
    text(g, 'Your Odoo', HUB.x + HUB.w / 2, HUB.y + 28, 14, 800, '#FFFFFF', 'center'); text(g, 'one database', HUB.x + HUB.w / 2, HUB.y + 44, 8.5, 700, '#E6D3E2', 'center');
    [['#E46E78', 'S'], ['#F2A33A', 'I'], ['#2E9C7E', 'A']].forEach(function (a, i) { var ax = HUB.x + 28 + i * 34; fillRR(g, ax, HUB.y + 58, 26, 26, 7, a[0]); text(g, a[1], ax + 13, HUB.y + 76, 11, 800, '#FFFFFF', 'center'); });
    /* the small server rack on the right */
    var r = T.rack; soft(g, r.x + r.w / 2, F + 4, 60, 7, 0.3); fillRR(g, r.x, r.y, r.w, F - r.y, 6, '#C9D2DE'); fillRR(g, r.x + 6, r.y + 8, r.w - 12, F - r.y - 16, 3, '#E6EBF2');
    for (var u = 0; u < 10; u++) fillRR(g, r.x + 10, r.y + 14 + u * 28, r.w - 20, 20, 2, '#FFFFFF');
    K.plant(g, { x: 1180, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    var d = T.desk, m = T.mon; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    fillRR(g, m.x + m.w / 2 - 5, m.y + m.h, 10, d.y - m.y - m.h, 2, '#5C6B7A'); fillRR(g, m.x + m.w / 2 - 22, d.y - 4, 44, 5, 2, '#5C6B7A'); fillRR(g, m.x - 4, m.y - 4, m.w + 8, m.h + 8, 6, '#2A3142');
    fillRR(g, d.x + d.w - 60, d.y - 14, 18, 14, 4, '#FFFFFF');
  }

  var W = CR.who;
  var EN1 = W({ x: 584, y: 470, s: 0.52, ph: 0.6, skin: 1, hair: 1, style: 'short', outfit: 'polo', top: TEAL, glasses: true, sit: true, chairCol: '#2A3550', hands: [[-120, -200], [-20, -200]], look: -0.7 });
  var EN2 = W({ x: 930, y: 470, s: 0.54, ph: 1.6, skin: 0, hair: 0, style: 'bob', outfit: 'shirt', top: '#3167CA', hands: [[-60, -330], [60, -200]], look: -0.5 });
  var CREW = [
    { x0: 1220, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext developer', lines: ['Standard connector **first**. API only where we must.', 'Every message has a key, so nothing is **booked twice**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#1B2A4A', hold: 'tablet' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['No more **re-typing** between systems.', 'Orders, stock and payouts, flowing on their own.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: TEAL, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) }
  ];

  var PLUG = { t: -9, k: 1 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    var pt = t - PLUG.t, down = pt < 4.5, broken = SYS[PLUG.k];
    /* cables light in each system's colour; packets run to the hub (faster on its stop); a dropped cable retries, then recovers */
    SYS.forEach(function (s, i) { var on = S.hot === s.key, dead = down && s === broken && pt < 2.6;
      cable(g, s, dead ? '#FFB4AE' : (on ? s.col : 'rgba(27,42,74,.35)'), on ? 4 : 2.5);
      if (dead) { var p = port(s); var bx = (p.x + p.hx) / 2, by = (p.y + p.hy) / 2; fillE(g, bx, by, 9, 9, '#FFFFFF'); text(g, '↻', bx, by + 4, 11, 800, '#E2453C', 'center');
        text(g, 'retry ' + (1 + Math.floor(pt * 1.2)), bx, by - 14, 7, 800, '#E2453C', 'center'); return; }
      var n = on ? 3 : 1, sp = on ? 0.9 : 0.35; for (var q = 0; q < n; q++) { var f = ((t * sp + q / n + i * 0.17) % 1), dir = i % 2 ? f : 1 - f, pp = onCable(s, dir); fillRR(g, pp[0] - 5, pp[1] - 4, 10, 8, 2, s.col); }
      if (on) { g.strokeStyle = s.col; g.lineWidth = 2.5; rr(g, s.x - 3, s.y - 3, 154, 58, 12); g.stroke(); } });
    /* each system's icon */
    SYS.forEach(function (s) { var cx = s.x + 28, cy = s.y + 26; g.fillStyle = '#FFFFFF';
      if (s.key === 'store') { fillRR(g, cx - 8, cy - 4, 16, 10, 2, '#FFFFFF'); g.fillRect(cx - 10, cy - 7, 20, 3); }
      else if (s.key === 'market') { fillRR(g, cx - 8, cy - 6, 16, 12, 2, '#FFFFFF'); g.fillStyle = s.col; g.fillRect(cx - 1, cy - 6, 2, 12); }
      else if (s.key === 'pay') { fillRR(g, cx - 9, cy - 6, 18, 12, 2, '#FFFFFF'); g.fillStyle = s.col; g.fillRect(cx - 9, cy - 3, 18, 3); }
      else if (s.key === 'bank') { g.beginPath(); g.moveTo(cx - 10, cy - 2); g.lineTo(cx, cy - 9); g.lineTo(cx + 10, cy - 2); g.fill(); for (var c2 = -1; c2 <= 1; c2++) g.fillRect(cx + c2 * 6 - 1.5, cy, 3, 7); g.fillRect(cx - 10, cy + 7, 20, 2); }
      else if (s.key === 'mail') { fillRR(g, cx - 9, cy - 6, 18, 12, 2, '#FFFFFF'); g.strokeStyle = s.col; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 8, cy - 5); g.lineTo(cx, cy + 1); g.lineTo(cx + 8, cy - 5); g.stroke(); }
      else { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 4, cy - 6); g.lineTo(cx - 9, cy); g.lineTo(cx - 4, cy + 6); g.moveTo(cx + 4, cy - 6); g.lineTo(cx + 9, cy); g.lineTo(cx + 4, cy + 6); g.stroke(); } });
    /* the hub pulses as packets arrive */
    var hp = 0.5 + 0.5 * Math.sin(t * 3); g.save(); g.globalAlpha = 0.15 + hp * 0.15; g.strokeStyle = PUR; g.lineWidth = 6; rr(g, HUB.x - 6, HUB.y - 6, HUB.w + 12, HUB.h + 12, 20); g.stroke(); g.restore();
    /* the rack's lights */
    var r = T.rack; for (var u = 0; u < 10; u++) for (var l = 0; l < 3; l++) fillE(g, r.x + 18 + l * 8, r.y + 24 + u * 28, 1.8, 1.8, hash(u * 3 + l + Math.floor(t * 3)) > 0.5 ? TEAL : '#D5DCE6');
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the sync log on the engineer's monitor: events tick in */
    var m = T.mon, hot = SYS.filter(function (s) { return s.key === S.hot; })[0];
    fillRR(g, m.x, m.y, m.w, m.h, 3, '#FFFFFF'); fillRR(g, m.x, m.y, m.w, 12, 3, TEAL); g.fillRect(m.x, m.y + 7, m.w, 5); text(g, 'SYNC LOG · sample', m.x + 5, m.y + 9, 5.6, 800, '#FFFFFF');
    var list = hot ? [hot, hot, hot, hot] : SYS, off = Math.floor(t * (hot ? 1.5 : 0.6));
    for (var i = 0; i < 4; i++) { var s = list[(i + off) % list.length], y = m.y + 18 + i * 15, fresh = i === 3; fillRR(g, m.x + 5, y, 8, 8, 2, fresh && (t % 1) < 0.5 ? '#2BC48A' : '#BDEBD7');
      text(g, (hot ? s.ev : s.ev), m.x + 17, y + 6.5, 5.2, fresh ? 800 : 700, '#3D4560'); }
    CR.draw(g, t);
  }

  window.IXW.worlds.integration = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(20,163,139,.22)',
    glow: (function () { var o = {}; SYS.forEach(function (s) { o[s.key] = function (g) { rr(g, s.x - 8, s.y - 8, 164, 68, 14); }; });
      o.hub = function (g) { rr(g, HUB.x - 10, HUB.y - 10, HUB.w + 20, HUB.h + 20, 18); }; o.plug = function (g) { rr(g, 870, 150, 80, 70, 12); }; return o; })(),
    backGlow: ['store', 'market', 'pay', 'bank', 'mail', 'api', 'hub'],
    cast: [
      { id: 'en1', behind: true, keys: ['hub'], P: EN1, act: function (P, t, S) { var st = S.cast.en1, busy = !!S.hot; P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 12 : 4))) * 6; P.hands = [[-130, -200 - k2], [-30, -200 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.7, 0.08); CR.cast(P, st, t, ['type', 'nod', 'id', 'wave', 'think']); } },
      { id: 'en2', behind: false, keys: ['api', 'bank'], P: EN2, act: function (P, t, S) { var st = S.cast.en2, busy = S.hot === 'api' || S.hot === 'bank' || t - PLUG.t < 3; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-60 + Math.sin(t * 2) * 6, -330 + (busy ? Math.sin(t * 6) * 8 : 0)], [60, -200]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.5, 0.08); CR.cast(P, st, t, ['wave', 'jump', 'id', 'cheer']); } }
    ],
    toy: function (name, S, t) { if (name === 'plug') { PLUG.t = t; PLUG.k = (PLUG.k + 2) % SYS.length; CR.burst('spark', 930, 220, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
