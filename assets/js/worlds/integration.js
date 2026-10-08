/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: integration (/odoo/integration) — step 3 of 4: connect what you keep, drawn as ODOO CENTRAL, a bright daytime railway
   station. Every system the client keeps runs on its own coloured line into one interchange, the client's Odoo: the network
   map on the wall (online store, marketplaces, payments, bank feeds, email and calendar, their own systems over the API) has
   little trains running each line both ways; a monorail carries the cargo over the hall, an express docks at the back
   platform and departs across the station, a freight train crosses the front track with orders, stock and payouts.
   The TechNext crew: the signal-desk engineer (seated, chair, legs and feet) keeps the sync log, the dispatcher waves the
   trains off with a green flag, the connector engineer paces with a new plug. Tap the signal lever and a line drops: the
   signal turns red, the line retries with backoff, then recovers and nothing is booked twice. Tap anyone, any line, the
   lever or the trains. Everyone from TechNext wears a TechNext ID; the visitor wears a grey pass. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, TEAL = '#14A38B', TEALD = '#0E7A68', TEALL = '#E2F5F0', NAVY = '#1B2A4A', PUR = '#714B67', AMBER = '#F2B233', RED = '#E2453C', GO = '#2BC48A';
  var WALL = { x: 290, y: -112, w: 700, h: 300 }, HUB = { x: 565, y: -20, w: 150, h: 120 };
  var SYS = [
    { key: 'store', n: 1, name: 'Online store', sub: 'Shopify · WooCommerce', col: '#7DAE38', x: 312, y: -92, ev: 'Web order became a sales order', cargo: 'ORDERS' },
    { key: 'market', n: 2, name: 'Marketplaces', sub: 'orders in, stock out', col: '#F08A24', x: 312, y: 0, ev: 'Stock level synced to the store', cargo: 'STOCK' },
    { key: 'pay', n: 3, name: 'Payments', sub: 'gateway payouts', col: '#635BFF', x: 312, y: 92, ev: 'Gateway payout matched in Accounting', cargo: 'PAYOUTS' },
    { key: 'bank', n: 4, name: 'Bank feeds', sub: 'statement lines', col: '#3167CA', x: 830, y: -92, ev: 'Bank statement imported and matched', cargo: 'STATEMENTS' },
    { key: 'mail', n: 5, name: 'Email & calendar', sub: 'meetings, threads', col: '#E0456B', x: 830, y: 0, ev: 'Customer email logged on the order', cargo: 'EMAILS' },
    { key: 'api', n: 6, name: 'Your systems', sub: 'over the Odoo API', col: '#1B2A4A', x: 830, y: 92, ev: 'Legacy WMS synced over the API', cargo: 'API CALLS' }];
  var T = { desk: { x: 360, y: 392, w: 260 }, mon: { x: 400, y: 298, w: 142, h: 84 }, lever: { x: 780, y: 470 }, clock: { x: 222, y: -36, r: 32 }, dock: 958 };

  /* ---------------- helpers ---------------- */
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  /* each line on the map: out of its station box, along, one 45-degree run, into the interchange */
  SYS.forEach(function (s, i) {
    var left = s.x < HUB.x, px = left ? s.x + 148 : s.x, py = s.y + 26, hx = left ? HUB.x : HUB.x + HUB.w, hy = HUB.y + 30 + (i % 3) * 30, d = left ? 1 : -1;
    var run = (Math.abs(hx - px) - Math.abs(hy - py)) / 2;
    s.pts = [[px, py], [px + d * run, py], [hx - d * run, hy], [hx, hy]]; s.seg = []; s.len = 0;
    for (var j = 1; j < 4; j++) { var L = Math.hypot(s.pts[j][0] - s.pts[j - 1][0], s.pts[j][1] - s.pts[j - 1][1]); s.seg.push(L); s.len += L; }
    s.hx = hx; s.hy = hy; s.left = left;
  });
  function along(s, f) { /* a point (and heading) at fraction f of the line, 0 = the station, 1 = the interchange */
    var dist = clamp(f, 0, 1) * s.len;
    for (var j = 0; j < 3; j++) { var L = s.seg[j]; if (dist <= L || j === 2) { var a = s.pts[j], b = s.pts[j + 1], q = L ? clamp(dist / L, 0, 1) : 0; return [lerp(a[0], b[0], q), lerp(a[1], b[1], q), Math.atan2(b[1] - a[1], b[0] - a[0])]; } dist -= L; }
  }
  function line(g, s, col, w, dash) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; if (dash) g.setLineDash(dash);
    g.beginPath(); s.pts.forEach(function (p, j) { if (j) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); if (dash) g.setLineDash([]); }
  /* where a cast member's hand is, in set units (props held in a hand are drawn over the figure) */
  function handAt(P, i) { var h = P.hands[i], s = P.s, kx = P.sx == null ? 1 : P.sx, drop = P.sit ? (P.sitDrop != null ? P.sitDrop : 46) : 0; return [P.x + h[0] * s * kx, P.y + (h[1] + drop - (P.hop || 0)) * s]; }
  function icon(g, key, cx, cy, col) { /* a line's white glyph */
    g.fillStyle = '#FFFFFF'; g.strokeStyle = '#FFFFFF'; g.lineCap = 'round'; g.lineJoin = 'round';
    if (key === 'store') { g.lineWidth = 1.8; g.beginPath(); g.moveTo(cx - 8, cy - 6); g.lineTo(cx - 5, cy - 6); g.lineTo(cx - 3, cy + 3); g.lineTo(cx + 7, cy + 3); g.lineTo(cx + 8, cy - 3); g.lineTo(cx - 4, cy - 3); g.stroke(); fillE(g, cx - 2, cy + 6.5, 1.8, 1.8, '#FFFFFF'); fillE(g, cx + 6, cy + 6.5, 1.8, 1.8, '#FFFFFF'); }
    else if (key === 'market') { fillRR(g, cx - 8, cy - 4, 16, 11, 2, '#FFFFFF'); g.lineWidth = 1.8; g.beginPath(); g.arc(cx, cy - 4, 4.5, Math.PI, 0); g.stroke(); g.fillStyle = col; g.fillRect(cx - 1, cy - 1, 2, 5); }
    else if (key === 'pay') { fillRR(g, cx - 9, cy - 6, 18, 12, 2, '#FFFFFF'); g.fillStyle = col; g.fillRect(cx - 9, cy - 3, 18, 3); g.fillRect(cx + 2, cy + 2, 5, 2); }
    else if (key === 'bank') { g.beginPath(); g.moveTo(cx - 10, cy - 2); g.lineTo(cx, cy - 9); g.lineTo(cx + 10, cy - 2); g.fill(); for (var c2 = -1; c2 <= 1; c2++) g.fillRect(cx + c2 * 6 - 1.5, cy, 3, 6); g.fillRect(cx - 10, cy + 7, 20, 2); }
    else if (key === 'mail') { fillRR(g, cx - 9, cy - 6, 18, 12, 2, '#FFFFFF'); g.strokeStyle = col; g.lineWidth = 1.6; g.beginPath(); g.moveTo(cx - 8, cy - 5); g.lineTo(cx, cy + 1); g.lineTo(cx + 8, cy - 5); g.stroke(); }
    else { g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 4, cy - 6); g.lineTo(cx - 9, cy); g.lineTo(cx - 4, cy + 6); g.moveTo(cx + 4, cy - 6); g.lineTo(cx + 9, cy); g.lineTo(cx + 4, cy + 6); g.stroke(); }
  }
  /* the front track sits a little above the bottom of the hero, whatever its height */
  function track(e) { var r2 = clamp(e.b - 16, 700, 770); return { edge: r2 - 64, r1: r2 - 34, r2: r2 }; }

  /* ---------------- static layers ---------------- */
  function paintBg(g, W, H, k, sx, sy) { /* the sky and the city beyond the glass hall */
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, e.t, 304, [[0, '#7CC2F2'], [0.55, '#BFE4FA'], [1, '#EEF8FF']]);
    var sg = g.createRadialGradient(1060, -60, 10, 1060, -60, 260); sg.addColorStop(0, 'rgba(255,246,205,.85)'); sg.addColorStop(1, 'rgba(255,246,205,0)'); g.fillStyle = sg; g.fillRect(800, -320, 520, 520);
    CO.skySG(g, e.l, e.r, 238, 300, { hazy: 'rgba(170,200,230,.55)', near: ['#BCD3EC', '#AEC7E5'], lit: 'rgba(255,255,255,.6)', icon: '#A3BCDF', water: 'rgba(140,190,225,.45)', mbs: 1090, wheel: -330, park: '#93AED8' });
    /* the city line on its viaduct, far away */
    g.fillStyle = '#C9D9EA'; g.fillRect(e.l, 280, e.r - e.l, 5); for (var px = Math.floor(e.l / 60) * 60; px < e.r; px += 60) g.fillRect(px, 285, 5, 15);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) { /* the glass hall: mullions, the roof truss, the tiled platform wall, the platform and the front track */
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy), x, y;
    CO.glass(g, e, CEIL, 304, 118, '#FFFFFF', 64); g.fillStyle = '#FFFFFF'; g.fillRect(e.l, 186, e.r - e.l, 4);
    /* the roof: glass vaults on white arched ribs, a lattice truss along the eaves */
    g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    for (x = Math.floor(e.l / 560) * 560; x < e.r; x += 560) {
      g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 9; g.beginPath(); g.ellipse(x + 280, CEIL, 280, 170, 0, Math.PI, 0); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; for (var rb = 1; rb < 6; rb++) { var ra = Math.PI + rb * Math.PI / 6; g.beginPath(); g.moveTo(x + 280 + Math.cos(ra) * 280, CEIL + Math.sin(ra) * 170); g.lineTo(x + 280, CEIL); g.stroke(); }
      g.beginPath(); g.ellipse(x + 280, CEIL, 200, 116, 0, Math.PI, 0); g.stroke(); }
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 3; g.beginPath();
    for (x = Math.floor(e.l / 44) * 44; x < e.r; x += 44) { g.moveTo(x, CEIL); g.lineTo(x + 22, CEIL - 22); g.lineTo(x + 44, CEIL); }
    g.stroke(); g.fillStyle = '#FFFFFF'; g.fillRect(e.l, CEIL - 25, e.r - e.l, 4); g.fillRect(e.l, CEIL - 6, e.r - e.l, 12); g.fillStyle = 'rgba(30,70,90,.10)'; g.fillRect(e.l, CEIL + 6, e.r - e.l, 3);
    /* the platform wall: white tiles, a teal band, the recess of the back track */
    g.fillStyle = '#F4F8F6'; g.fillRect(e.l, 304, e.r - e.l, F - 304);
    g.strokeStyle = 'rgba(20,110,100,.07)'; g.lineWidth = 1.2; g.beginPath(); for (y = 318; y < 440; y += 14) { g.moveTo(e.l, y); g.lineTo(e.r, y); } for (y = 318; y < 440; y += 14) for (x = Math.floor(e.l / 28) * 28 + ((y / 14) % 2 ? 14 : 0); x < e.r; x += 28) { g.moveTo(x, y); g.lineTo(x, y + 14); } g.stroke();
    fillRR(g, e.l, 300, e.r - e.l, 9, 0, '#FFFFFF'); g.fillStyle = 'rgba(30,70,90,.10)'; g.fillRect(e.l, 309, e.r - e.l, 3);
    g.fillStyle = TEAL; g.fillRect(e.l, 330, e.r - e.l, 9); g.fillStyle = NAVY; g.fillRect(e.l, 339, e.r - e.l, 3);
    g.fillStyle = '#DCE3E1'; g.fillRect(e.l, 440, e.r - e.l, F - 440); g.fillStyle = '#9AA5A8'; g.fillRect(e.l, 461, e.r - e.l, 4); g.fillStyle = 'rgba(20,40,50,.12)'; g.fillRect(e.l, 440, e.r - e.l, 4);
    /* the platform: warm stone, the yellow line, the edge, then the front track */
    var tk = track(e), fg = g.createLinearGradient(0, F, 0, tk.edge); fg.addColorStop(0, '#F1EDE5'); fg.addColorStop(1, '#E4DDD0'); g.fillStyle = fg; g.fillRect(e.l, F, e.r - e.l, tk.edge - F);
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.strokeStyle = 'rgba(120,100,70,.10)'; g.lineWidth = 1.5; g.beginPath(); for (y = F + 30; y < tk.edge - 20; y += 34) { g.moveTo(e.l, y); g.lineTo(e.r, y); } for (x = Math.floor(e.l / 90) * 90; x < e.r; x += 90) { g.moveTo(x, F + 6); g.lineTo(x + (x - 560) * 0.12, tk.edge - 18); } g.stroke();
    /* wayfinding painted on the platform: arrows and the station name */
    for (x = Math.floor(e.l / 520) * 520; x < e.r; x += 520) { var py = F + 74; g.fillStyle = 'rgba(20,163,139,.16)'; fillRR(g, x + 40, py - 16, 210, 32, 16, 'rgba(20,163,139,.14)');
      text(g, 'ODOO CENTRAL · LINES 1–6', x + 145, py + 5, 11, 800, 'rgba(14,122,104,.55)', 'center');
      for (var ar = 0; ar < 3; ar++) { g.fillStyle = 'rgba(27,42,74,.14)'; g.beginPath(); g.moveTo(x + 300 + ar * 40, py - 12); g.lineTo(x + 322 + ar * 40, py); g.lineTo(x + 300 + ar * 40, py + 12); g.lineTo(x + 310 + ar * 40, py); g.closePath(); g.fill(); } }
    g.fillStyle = '#F2C230'; g.fillRect(e.l, tk.edge - 18, e.r - e.l, 12); g.fillStyle = 'rgba(160,110,10,.35)'; for (x = Math.floor(e.l / 8) * 8; x < e.r; x += 8) g.fillRect(x + 2, tk.edge - 14, 3, 3), g.fillRect(x + 6, tk.edge - 10, 3, 3);
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, tk.edge - 6, e.r - e.l, 8); g.fillStyle = 'rgba(40,40,30,.22)'; g.fillRect(e.l, tk.edge + 2, e.r - e.l, 5);
    g.fillStyle = '#D3CBBC'; g.fillRect(e.l, tk.edge + 7, e.r - e.l, e.b - tk.edge);
    g.fillStyle = 'rgba(110,95,70,.22)'; for (var i = 0; i < 900; i++) { var bx = e.l + hash(i * 1.7) * (e.r - e.l), by = tk.edge + 10 + hash(i * 3.1) * (e.b - tk.edge - 8); g.fillRect(bx, by, 2.2, 1.6); }
    for (x = Math.floor(e.l / 34) * 34; x < e.r; x += 34) fillRR(g, x, tk.r1 - 6, 20, tk.r2 - tk.r1 + 12, 2, '#B4A895');
    [tk.r1, tk.r2].forEach(function (ry) { g.fillStyle = '#7D8893'; g.fillRect(e.l, ry - 3, e.r - e.l, 6); g.fillStyle = '#DCE2E8'; g.fillRect(e.l, ry - 3, e.r - e.l, 1.6); });
    g.restore();
  }
  function station(g, s) { /* a station box on the network map */
    shadowed(g, 7, 2, 0.13, function () { fillRR(g, s.x, s.y, 148, 52, 10, '#FFFFFF'); }); fillRR(g, s.x, s.y, 7, 52, 3.5, s.col);
    fillE(g, s.x + 30, s.y + 26, 15, 15, s.col); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.5; g.beginPath(); g.arc(s.x + 30, s.y + 26, 12.5, 0, 7); g.stroke(); icon(g, s.key, s.x + 30, s.y + 26, s.col);
    text(g, s.name, s.x + 52, s.y + 24, 9.5, 800, '#1B1F3B'); text(g, s.sub, s.x + 52, s.y + 37, 7, 700, '#8A96A8');
    fillRR(g, s.x + 124, s.y + 6, 18, 12, 6, s.col); text(g, 'L' + s.n, s.x + 133, s.y + 15, 7, 800, '#FFFFFF', 'center');
  }
  function paintBack(g, ext) {
    /* the monorail beam over the hall */
    g.fillStyle = '#FFFFFF'; for (var hx = Math.floor(ext.l / 150) * 150; hx < ext.r; hx += 150) g.fillRect(hx, CEIL, 3, 18);
    fillRR(g, ext.l, -132, ext.r - ext.l, 9, 0, '#C9D4DC'); g.fillStyle = '#E8EEF2'; g.fillRect(ext.l, -132, ext.r - ext.l, 2);
    /* the network map */
    shadowed(g, 18, 6, 0.16, function () { fillRR(g, WALL.x, WALL.y, WALL.w, WALL.h, 14, '#FFFFFF'); });
    g.save(); rr(g, WALL.x, WALL.y, WALL.w, WALL.h, 14); g.clip();
    g.strokeStyle = 'rgba(27,42,74,.045)'; g.lineWidth = 1; g.beginPath(); for (var gx = WALL.x + 20; gx < WALL.x + WALL.w; gx += 20) { g.moveTo(gx, WALL.y); g.lineTo(gx, WALL.y + WALL.h); } for (var gy = WALL.y + 20; gy < WALL.y + WALL.h; gy += 20) { g.moveTo(WALL.x, gy); g.lineTo(WALL.x + WALL.w, gy); } g.stroke();
    g.strokeStyle = 'rgba(143,201,240,.38)'; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(WALL.x - 20, 150); g.bezierCurveTo(470, 120, 560, 190, 660, 150); g.bezierCurveTo(780, 104, 880, 168, WALL.x + WALL.w + 20, 120); g.stroke();
    fillRR(g, WALL.x, WALL.y, WALL.w, 18, 0, NAVY); text(g, 'INTEGRATION NETWORK · EVERY LINE RUNS TO YOUR ODOO', WALL.x + 14, WALL.y + 12.5, 7.6, 800, '#FFFFFF'); text(g, 'sample map', WALL.x + WALL.w - 12, WALL.y + 12.5, 6.6, 700, '#9FB6D8', 'right');
    g.restore();
    /* the fare zone round the interchange */
    g.setLineDash([5, 6]); g.strokeStyle = 'rgba(113,75,103,.35)'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(HUB.x + HUB.w / 2, HUB.y + HUB.h / 2, 112, 92, 0, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    text(g, 'ZONE 1 · ONE DATABASE', HUB.x + HUB.w / 2, HUB.y + HUB.h + 44, 6.6, 800, '#A07A97', 'center');
    /* the lines, white casing then colour, a station tick halfway */
    SYS.forEach(function (s) { line(g, s, '#FFFFFF', 11); line(g, s, s.col, 6); var m = along(s, 0.5); fillE(g, m[0], m[1], 5, 5, '#FFFFFF'); g.strokeStyle = NAVY; g.lineWidth = 2; g.beginPath(); g.arc(m[0], m[1], 5, 0, 7); g.stroke(); });
    SYS.forEach(function (s) { station(g, s); });
    /* the interchange: your Odoo */
    shadowed(g, 16, 6, 0.24, function () { fillRR(g, HUB.x - 4, HUB.y - 4, HUB.w + 8, HUB.h + 8, 20, '#FFFFFF'); }); fillRR(g, HUB.x, HUB.y, HUB.w, HUB.h, 16, PUR);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(HUB.x, HUB.y + 60); g.lineTo(HUB.x + HUB.w, HUB.y + 20); g.lineTo(HUB.x + HUB.w, HUB.y); g.lineTo(HUB.x, HUB.y); g.closePath(); g.fill();
    text(g, 'ODOO CENTRAL', HUB.x + HUB.w / 2, HUB.y + 17, 6.8, 800, '#E6D3E2', 'center'); text(g, 'Your Odoo', HUB.x + HUB.w / 2, HUB.y + 38, 15, 800, '#FFFFFF', 'center'); text(g, 'one database', HUB.x + HUB.w / 2, HUB.y + 52, 8, 700, '#E6D3E2', 'center');
    [['#E46E78', 'S', 'Sales'], ['#F2A33A', 'I', 'Inventory'], ['#2E9C7E', 'A', 'Accounting']].forEach(function (a, i) { var ax = HUB.x + 20 + i * 40; fillRR(g, ax, HUB.y + 64, 30, 30, 8, a[0]); text(g, a[1], ax + 15, HUB.y + 84, 12, 800, '#FFFFFF', 'center'); text(g, a[2], ax + 15, HUB.y + 107, 5.6, 800, '#E6D3E2', 'center'); });
    /* the legend */
    var lx = WALL.x + 196, ly = WALL.y + WALL.h - 16;
    fillE(g, lx, ly - 3, 4, 4, NAVY); text(g, 'webhook: pushed in seconds', lx + 8, ly, 6.6, 700, '#5C6378');
    g.strokeStyle = NAVY; g.lineWidth = 1.5; g.beginPath(); g.arc(lx + 120, ly - 3, 4, 0, 7); g.stroke(); text(g, 'scheduled job: batches', lx + 128, ly, 6.6, 700, '#5C6378');
    text(g, '↻', lx + 222, ly + 1, 9, 800, RED); text(g, 'retry with backoff', lx + 232, ly, 6.6, 700, '#5C6378');
    /* the gap by the title card: the hanging station clock, a platform sign */
    var c = T.clock; g.fillStyle = '#B9C4CE'; g.fillRect(c.x - 1.5, CEIL, 3, c.y - c.r - CEIL);
    shadowed(g, 10, 4, 0.18, function () { fillE(g, c.x, c.y, c.r + 6, c.r + 6, NAVY); }); fillE(g, c.x, c.y, c.r, c.r, '#FFFFFF');
    for (var tk = 0; tk < 12; tk++) { var a = tk * Math.PI / 6; g.fillStyle = tk % 3 ? '#9AA6BC' : NAVY; g.beginPath(); g.arc(c.x + Math.cos(a) * (c.r - 5), c.y + Math.sin(a) * (c.r - 5), tk % 3 ? 1.3 : 2.4, 0, 7); g.fill(); }
    text(g, 'SGT', c.x, c.y + 14, 6, 800, TEAL, 'center');
    g.fillStyle = '#B9C4CE'; g.fillRect(c.x - 40, c.y + c.r + 6, 2, 22); g.fillRect(c.x + 38, c.y + c.r + 6, 2, 22);
    shadowed(g, 6, 2, 0.16, function () { fillRR(g, c.x - 58, c.y + c.r + 26, 116, 30, 7, NAVY); });
    fillE(g, c.x - 42, c.y + c.r + 41, 9, 9, TEAL); text(g, '1–6', c.x - 42, c.y + c.r + 43.5, 6.4, 800, '#FFFFFF', 'center');
    text(g, 'All platforms', c.x - 28, c.y + c.r + 39, 7.4, 800, '#FFFFFF'); text(g, 'to Odoo Central →', c.x - 28, c.y + c.r + 49, 6.4, 700, '#A9C9F0');
    /* the left wall: the station name board, a way-out sign, the arrivals board */
    var nx = -560;
    g.fillStyle = '#B9C4CE'; g.fillRect(nx - 50, CEIL, 3, 56); g.fillRect(nx + 48, CEIL, 3, 56);
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, nx - 76, -96, 152, 52, 12, NAVY); });
    fillE(g, nx - 50, -70, 17, 17, PUR); fillRR(g, nx - 59, -76, 18, 11, 3, '#FFFFFF'); fillE(g, nx - 55, -63, 2.2, 2.2, '#FFFFFF'); fillE(g, nx - 45, -63, 2.2, 2.2, '#FFFFFF'); g.fillStyle = PUR; g.fillRect(nx - 57, -74, 14, 4);
    text(g, 'ODOO', nx - 26, -73, 13, 800, '#FFFFFF'); text(g, 'CENTRAL', nx - 26, -57, 11, 800, '#7FE3C9');
    shadowed(g, 6, 2, 0.14, function () { fillRR(g, nx - 76, 40, 152, 26, 6, '#FFC94A'); }); text(g, 'Way out ↖   ·   Lines 1–6 ↘', nx, 57, 7.6, 800, NAVY, 'center');
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, nx - 76, 150, 152, 118, 10, '#22324F'); }); fillRR(g, nx - 70, 156, 140, 106, 6, '#16233B');
    text(g, 'ARRIVING · ODOO CENTRAL', nx - 62, 170, 6.6, 800, '#FFC94A'); text(g, 'sample', nx + 62, 170, 5.6, 700, '#7F8DA6', 'right');
    /* far left: the line map poster */
    var px = -900; shadowed(g, 10, 4, 0.16, function () { fillRR(g, px, -40, 200, 150, 10, '#FFFFFF'); }); fillRR(g, px, -40, 200, 20, 10, TEAL); g.fillRect(px, -28, 200, 8); text(g, 'LINES TO YOUR ODOO', px + 100, -26, 7.2, 800, '#FFFFFF', 'center');
    SYS.forEach(function (s, i) { var yy = -6 + i * 18; g.strokeStyle = s.col; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(px + 16, yy); g.lineTo(px + 120, yy); g.lineTo(px + 150, 50); g.stroke(); text(g, s.name, px + 16, yy - 4, 6, 800, '#5C6378'); });
    fillE(g, px + 160, 50, 14, 14, PUR); text(g, 'O', px + 160, 54, 11, 800, '#FFFFFF', 'center');
    /* the right platform: its hanging sign */
    var sx2 = 1000; g.fillStyle = '#B9C4CE'; g.fillRect(sx2 + 12, -123, 2, 249); g.fillRect(sx2 + 94, -123, 2, 249);
    shadowed(g, 8, 3, 0.18, function () { fillRR(g, sx2, 126, 106, 42, 8, NAVY); }); fillE(g, sx2 + 20, 147, 12, 12, TEAL); text(g, '6', sx2 + 20, 151, 11, 800, '#FFFFFF', 'center');
    text(g, 'Platform 6', sx2 + 37, 144, 8.6, 800, '#FFFFFF'); text(g, 'Express · L6', sx2 + 37, 157, 7, 700, '#A9C9F0');
  }
  function bench(g, x, y, w, col) { fillRR(g, x, y - 46, w, 10, 4, col); fillRR(g, x, y - 32, w, 9, 4, col); g.fillStyle = '#7A869C'; g.fillRect(x + 10, y - 23, 5, 23); g.fillRect(x + w - 15, y - 23, 5, 23); soft(g, x + w / 2, y + 2, w * 0.6, 6, 0.2); }
  function paintFront(g, ext) {
    /* the signal desk: open legs, the monitor on its arm beside the engineer, the keyboard, a sign */
    var d = T.desk, m = T.mon; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    fillRR(g, m.x + m.w / 2 - 5, m.y + m.h, 10, d.y - m.y - m.h, 2, '#5C6B7A'); fillRR(g, m.x + m.w / 2 - 22, d.y - 4, 44, 5, 2, '#5C6B7A'); fillRR(g, m.x - 5, m.y - 5, m.w + 10, m.h + 10, 7, '#2A3142');
    fillRR(g, 486, d.y - 7, 70, 7, 2, '#C9D2DE'); fillRR(g, 420, d.y + 16, 120, 20, 5, NAVY); text(g, 'SIGNAL DESK · SYNC LOG', 480, d.y + 29.5, 7, 800, '#FFFFFF', 'center');
    fillRR(g, 372, d.y - 22, 14, 22, 3, '#FFFFFF'); g.fillStyle = TEAL; g.fillRect(374, d.y - 30, 2, 10); g.fillStyle = '#E0456B'; g.fillRect(379, d.y - 28, 2, 8); g.fillStyle = '#3167CA'; g.fillRect(383, d.y - 31, 2, 11);
    /* the lever frame (the levers move, so they are drawn live) */
    var L = T.lever; soft(g, L.x, F + 2, 60, 7, 0.24); fillRR(g, L.x - 44, F - 50, 88, 50, 8, NAVY); fillRR(g, L.x - 40, F - 46, 80, 8, 4, '#2E4470');
    text(g, 'SIGNALS', L.x, F - 14, 7, 800, '#9FC0EA', 'center'); [-22, 0, 22].forEach(function (o) { fillRR(g, L.x + o - 4, F - 44, 8, 6, 2, '#0F1A30'); });
    /* the left wall: fare gates, a bench, a plant */
    for (var gi = 0; gi < 4; gi++) { var gx = -905 + gi * 62; soft(g, gx + 12, F + 2, 26, 5, 0.2); fillRR(g, gx, F - 96, 24, 96, 6, '#DCE3EC'); fillRR(g, gx + 3, F - 90, 18, 20, 3, '#22324F'); fillRR(g, gx, F - 96, 24, 8, 4, TEAL);
      if (gi < 3) { g.fillStyle = 'rgba(160,215,235,.45)'; g.beginPath(); g.moveTo(gx + 24, F - 70); g.lineTo(gx + 40, F - 66); g.lineTo(gx + 40, F - 34); g.lineTo(gx + 24, F - 30); g.closePath(); g.fill(); } }
    bench(g, -640, F, 120, TEAL); K.plant(g, { x: -490, y: F }, '#FFFFFF', '#E3E8EF');
    /* the right platform: a parcel trolley, a bench and a plant */
    var tx = 1090; soft(g, tx + 50, F + 2, 70, 7, 0.22); fillRR(g, tx, F - 30, 104, 10, 3, '#5C6B7A'); g.fillStyle = '#5C6B7A'; g.fillRect(tx + 96, F - 110, 6, 84);
    [[tx + 4, F - 76, 46, 46, '#C99A6B'], [tx + 52, F - 64, 40, 34, '#D6A877'], [tx + 14, F - 108, 34, 32, '#C99A6B']].forEach(function (b) { fillRR(g, b[0], b[1], b[2], b[3], 4, b[4]); g.fillStyle = 'rgba(255,240,210,.55)'; g.fillRect(b[0] + b[2] / 2 - 4, b[1], 8, b[3]); });
    fillE(g, tx + 14, F - 8, 9, 9, '#2A3142'); fillE(g, tx + 90, F - 8, 9, 9, '#2A3142');
    bench(g, 1230, F, 120, NAVY); K.plant(g, { x: 1390, y: F }, '#FFFFFF', '#E3E8EF');
  }

  /* ---------------- the cast ---------------- */
  var W = CR.who;
  var EN1 = W({ x: 584, y: 470, s: 0.52, ph: 0.6, skin: 1, hair: 1, style: 'short', outfit: 'polo', top: TEAL, glasses: true, sit: true, chairCol: '#2A3550', hands: [[-120, -205], [-30, -205]], look: -0.7 });
  var EN2 = W({ x: 930, y: 470, s: 0.54, ph: 1.6, skin: 0, hair: 0, style: 'bob', outfit: 'shirt', top: '#3167CA', hold: 'tablet', hands: [[-70, -212], [60, -200]], look: -0.5 });
  var CN = W({ x: 222, y: 470, s: 0.53, ph: 2.3, skin: 2, hair: 0, style: 'pony', outfit: 'cardigan', top: PUR, top2: '#FFFFFF', clip: '#7FE3C9', hands: [[-70, -160], [86, -176]], look: 0.4 });
  var CREW = [
    { x0: 1010, x1: 1380, y: 494, spd: 16, ph: 0.3, label: 'TechNext developer', lines: ['Standard connector **first**. API only where we must.', 'Every message has a key, so nothing is **booked twice**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: '#1B2A4A', hold: 'box' }) },
    { x0: -880, x1: -470, y: 500, spd: 18, ph: 0.6, label: 'Visitor · client', lines: ['Our web orders just **arrive in Odoo** now.', 'No more copying the **bank statement** by hand.'], acts: ['wave', 'cheer', 'nod'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'shirt', top: '#E07B12', hold: 'bags', id: '#9AA6BC' }) },
    { x0: -920, x1: -480, y: 610, spd: 20, ph: 0.15, label: 'TechNext consultant', lines: ['We map the data **field by field** first.', 'Tested on **staging** with real records.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: TEAL, hold: 'clipboard' }) }
  ];

  /* ---------------- live state ---------------- */
  var PLUG = { t: -99, k: 3 }, STAMP = { t: -99 }, NEWL = { t: -99 }, FT = { t0: 0 }, BOOST = { t: -99 }, MUG = { hand: false }, FLAG = { on: false, w: 0 }, WHISTLE = { on: false };
  function lineState(s, t) { var pt = t - PLUG.t, hit = SYS[PLUG.k] === s; if (!hit || pt > 5) return 'ok'; return pt < 2.8 ? 'down' : 'recover'; }
  function mapLive(g, t, S) {
    var fast = t - BOOST.t < 2.5;
    SYS.forEach(function (s, i) {
      var on = S.hot === s.key, st = lineState(s, t), pt = t - PLUG.t;
      if (on) line(g, s, s.col, 12, null), line(g, s, '#FFFFFF', 3, [2, 7]);
      if (st === 'down') { line(g, s, '#FFFFFF', 9); line(g, s, '#F19C95', 5, [8, 6]); var m = along(s, 0.5); fillE(g, m[0], m[1] - 16, 15, 9, '#FFFFFF');
        text(g, '↻ ' + [1, 2, 4][Math.min(2, Math.floor(pt / 0.95))] + ' s', m[0], m[1] - 13, 7.2, 800, RED, 'center'); }
      /* the trains: one each way (more, and faster, on the line Nexi is showing); a downed line queues at the signal */
      var n = on ? 3 : 1, sp = (on ? 0.32 : 0.11) * (fast ? 2.6 : 1) * (st === 'recover' ? 2.4 : 1);
      for (var q = 0; q < n; q++) for (var dir = 0; dir < 2; dir++) {
        var f = (t * sp + q / n + i * 0.17 + dir * 0.5) % 1; if (dir) f = 1 - f;
        if (st === 'down') f = dir ? 0.12 + q * 0.06 : 0.66 + q * 0.07;
        var p = along(s, f); g.save(); g.translate(p[0], p[1]); g.rotate(p[2]); fillRR(g, -9, -4.5, 18, 9, 4.5, '#FFFFFF'); fillRR(g, -8, -3.5, 16, 7, 3.5, s.col); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillRect(-5, -1.5, 3, 3); g.fillRect(1, -1.5, 3, 3); g.restore();
      }
      if (on) { g.strokeStyle = s.col; g.lineWidth = 2.5; rr(g, s.x - 3, s.y - 3, 154, 58, 12); g.stroke(); }
      /* the signal at the interchange */
      var sx = s.left ? s.hx - 9 : s.hx + 9, col = st === 'down' ? RED : st === 'recover' ? ((t * 4) % 1 < 0.5 ? AMBER : GO) : GO;
      fillE(g, sx, s.hy, 4.6, 4.6, '#22324F'); fillE(g, sx, s.hy, 3, 3, col);
    });
    /* the interchange breathes as the trains come in */
    var hp = 0.5 + 0.5 * Math.sin(t * 3); g.save(); g.globalAlpha = 0.14 + hp * 0.16; g.strokeStyle = PUR; g.lineWidth = 5; rr(g, HUB.x - 9, HUB.y - 9, HUB.w + 18, HUB.h + 18, 22); g.stroke(); g.restore();
    /* a new connector, drawn in by the connector engineer */
    var nu = t - NEWL.t; if (nu >= 0 && nu < 5) { var a = clamp(nu / 1.1, 0, 1), fade = nu > 4 ? 1 - (nu - 4) : 1, x0 = WALL.x + 8, y0 = 168, x1 = HUB.x + 30, y1 = HUB.y + HUB.h;
      g.save(); g.globalAlpha = fade; g.strokeStyle = TEAL; g.lineWidth = 6; g.lineCap = 'round'; g.setLineDash([10, 6]); g.lineDashOffset = -t * 30; g.beginPath(); g.moveTo(x0, y0); var mx = lerp(x0, 470, a); g.lineTo(mx, y0);
      if (a > 0.6) { var b = (a - 0.6) / 0.4; g.lineTo(lerp(470, x1, b), lerp(y0, y1, b)); } g.stroke(); g.setLineDash([]);
      if (a >= 1) { fillRR(g, x0 + 2, y0 - 26, 108, 18, 9, TEAL); text(g, '+ New connector · L7', x0 + 56, y0 - 14, 7.4, 800, '#FFFFFF', 'center'); }
      g.restore(); }
  }
  function monorail(g, t, e) { /* two little cargo trains run along the beam over the hall */
    var span = e.r - e.l + 400;
    [[0, 64, TEAL, ['ORDERS', 'STOCK']], [0.5, 64, PUR, ['PAYOUTS', 'STATEMENTS']]].forEach(function (tr) {
      var x = e.l - 200 + ((t * tr[1] + tr[0] * span) % span);
      for (var c = 0; c < 3; c++) { var cx = x - c * 52, front = c === 0; fillRR(g, cx - 48, -149, 48, 17, front ? 8 : 4, '#FFFFFF'); fillRR(g, cx - 48, -139, 48, 4, 2, tr[2]);
        if (front) { fillRR(g, cx - 14, -146, 11, 6, 2, '#9FD3F5'); } else text(g, tr[3][c - 1], cx - 24, -142, 5.2, 800, NAVY, 'center');
        fillE(g, cx - 38, -131, 3, 3, '#5C6B7A'); fillE(g, cx - 10, -131, 3, 3, '#5C6B7A'); }
    });
  }
  function backTrain(g, t, e) { /* the express: arrives, waits at the platform, departs across the station */
    var cyc = 30, u = (t + 3) % cyc, dock = T.dock, x, moving = true;
    if (u < 5) { var v = 1 - u / 5; x = dock + (e.r + 40 - dock) * v * v; }
    else if (u < 13) { x = dock; moving = false; }
    else { var w = (u - 13) / 17; x = dock - (dock - (e.l - 560)) * w * w; }
    if (x > e.r + 30 || x < e.l - 540) return;
    var y0 = 344, y1 = 452;
    /* the locomotive, nose to the left */
    soft(g, x + 70, 462, 90, 6, 0.25);
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(x + 30, y0); g.lineTo(x + 140, y0); g.lineTo(x + 140, y1); g.lineTo(x + 4, y1); g.quadraticCurveTo(x - 6, y1 - 30, x + 6, y0 + 40); g.quadraticCurveTo(x + 14, y0 + 6, x + 30, y0); g.closePath(); g.fill();
    g.fillStyle = TEAL; g.fillRect(x + 6, y1 - 34, 134, 22); g.fillStyle = NAVY; g.fillRect(x + 4, y1 - 12, 136, 12);
    g.fillStyle = '#22324F'; g.beginPath(); g.moveTo(x + 32, y0 + 8); g.lineTo(x + 54, y0 + 8); g.lineTo(x + 54, y0 + 40); g.lineTo(x + 14, y0 + 40); g.quadraticCurveTo(x + 18, y0 + 18, x + 32, y0 + 8); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 36, y0 + 12, 6, 24);
    for (var wi = 0; wi < 3; wi++) fillRR(g, x + 64 + wi * 24, y0 + 10, 18, 26, 4, '#9FD3F5');
    text(g, 'EXPRESS · L6', x + 98, y1 - 19, 7, 800, '#FFFFFF', 'center');
    fillE(g, x + 8, y1 - 20, 4, 4, moving ? '#FFE9A0' : '#FFF6D8'); if (moving) { g.fillStyle = 'rgba(255,233,160,.35)'; g.beginPath(); g.moveTo(x + 6, y1 - 22); g.lineTo(x - 40, y1 - 34); g.lineTo(x - 40, y1 - 4); g.closePath(); g.fill(); }
    if (!moving && (t % 1) < 0.5) fillE(g, x + 120, y0 - 4, 5, 4, AMBER);
    /* the wagons, each with a container from one of the lines */
    for (var c = 0; c < 4; c++) { var cx = x + 146 + c * 118, s = SYS[(c + Math.floor((t + 3) / cyc)) % 6];
      fillRR(g, cx, y1 - 14, 112, 14, 3, '#5C6B7A'); fillRR(g, cx + 6, y0 + 14, 100, 60, 4, s.col); g.fillStyle = 'rgba(255,255,255,.14)'; for (var r = 0; r < 6; r++) g.fillRect(cx + 12 + r * 16, y0 + 18, 3, 52);
      fillRR(g, cx + 22, y0 + 34, 68, 18, 4, '#FFFFFF'); text(g, s.cargo, cx + 56, y0 + 46.5, 7.4, 800, NAVY, 'center');
      fillE(g, cx + 18, y1 + 2, 7, 7, '#2A3142'); fillE(g, cx + 94, y1 + 2, 7, 7, '#2A3142'); g.fillStyle = '#5C6B7A'; g.fillRect(cx - 6, y1 - 8, 6, 3); }
    [x + 26, x + 116].forEach(function (wx) { fillE(g, wx, y1 + 2, 8, 8, '#2A3142'); fillE(g, wx, y1 + 2, 3, 3, '#9AA6BC'); });
  }
  function foreTrain(g, t, e) { /* the freight on the front track: orders, stock, payouts and statements */
    var tk = track(e), spd = 170, len = 760, span = e.r - e.l + len + 500, x = e.l - 120 + ((t - FT.t0) * spd) % span; if (x - len > e.r) return;
    var b = tk.r2 - 4, h = 66;
    soft(g, x - len / 2, b + 6, len * 0.55, 8, 0.2);
    /* the locomotive, nose to the right */
    g.fillStyle = PUR; g.beginPath(); g.moveTo(x - 150, b - h - 16); g.lineTo(x - 30, b - h - 16); g.quadraticCurveTo(x + 6, b - h - 10, x + 10, b - 30); g.lineTo(x + 10, b - 8); g.lineTo(x - 150, b - 8); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.fillRect(x - 150, b - 40, 158, 9); fillRR(g, x - 52, b - h - 8, 40, 26, 6, '#9FD3F5'); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x - 46, b - h - 4, 6, 18);
    text(g, 'ODOO CENTRAL FREIGHT', x - 92, b - 18, 8.4, 800, '#FFFFFF', 'center'); fillE(g, x + 4, b - 22, 4.5, 4.5, '#FFE9A0');
    for (var c = 0; c < 5; c++) { var cx = x - 160 - (c + 1) * 120, s = SYS[c % 6];
      fillRR(g, cx, b - 16, 114, 10, 3, '#4A5468'); fillRR(g, cx + 4, b - h - 2, 106, h - 14, 4, s.col); g.fillStyle = 'rgba(255,255,255,.16)'; for (var r = 0; r < 6; r++) g.fillRect(cx + 10 + r * 17, b - h + 2, 3, h - 22);
      fillRR(g, cx + 18, b - h + 12, 78, 20, 4, '#FFFFFF'); text(g, s.cargo, cx + 57, b - h + 26, 8.4, 800, NAVY, 'center');
      fillE(g, cx + 20, b - 4, 8, 8, '#2A3142'); fillE(g, cx + 94, b - 4, 8, 8, '#2A3142'); }
    [x - 130, x - 40].forEach(function (wx) { fillE(g, wx, b - 4, 9, 9, '#2A3142'); fillE(g, wx, b - 4, 3.5, 3.5, '#9AA6BC'); });
  }
  function paintLive(g, t, now, S) {
    var e = S.ext;
    monorail(g, t, e);
    mapLive(g, t, S);
    /* the station clock on Singapore time */
    var d = new Date(Date.now() + 8 * 3600e3); K.clockHands(g, T.clock, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
    /* the arrivals board: rows roll in */
    var nx = -560, roll = Math.floor(t / 2.6);
    for (var r = 0; r < 4; r++) { var s = SYS[(r + roll) % 6], y = 186 + r * 19, fresh = r === 3 && (t % 2.6) < 0.5;
      fillE(g, nx - 62, y - 3, 3.5, 3.5, s.col); text(g, s.name, nx - 54, y, 7, 800, fresh ? '#FFFFFF' : '#E7EEF8'); text(g, r === 0 ? 'arrived' : r === 3 ? 'now' : (r * 2) + ' min', nx + 62, y, 6.6, 800, r === 0 ? '#7FE3C9' : '#FFC94A', 'right'); }
    backTrain(g, t, e);
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the sync log on the engineer's monitor */
    var m = T.mon, hot = SYS.filter(function (s) { return s.key === S.hot; })[0], pt = t - PLUG.t, bad = SYS[PLUG.k];
    fillRR(g, m.x, m.y, m.w, m.h, 3, '#FFFFFF'); fillRR(g, m.x, m.y, m.w, 13, 3, TEAL); g.fillRect(m.x, m.y + 7, m.w, 6); text(g, 'SYNC LOG · sample', m.x + 6, m.y + 9.5, 5.8, 800, '#FFFFFF');
    fillE(g, m.x + m.w - 8, m.y + 6.5, 2.6, 2.6, (t % 1) < 0.5 ? '#B8F5DE' : '#FFFFFF');
    var list = hot ? [hot, hot, hot, hot] : SYS, off = Math.floor(t * (hot ? 1.5 : 0.6));
    for (var i = 0; i < 4; i++) { var s = list[(i + off) % list.length], y = m.y + 19 + i * 15, fresh = i === 3, col = fresh && (t % 1) < 0.5 ? GO : '#BDEBD7', msg = s.ev;
      if (pt < 5 && i === 3) { if (pt < 2.8) { col = RED; msg = 'Retry · ' + bad.name + ' · backoff ' + [1, 2, 4][Math.min(2, Math.floor(pt / 0.95))] + ' s'; } else { col = GO; msg = 'Recovered · backlog drained, no duplicates'; } }
      fillRR(g, m.x + 6, y, 8, 8, 2, col); fillRR(g, m.x + 6, y, 3, 8, 1.5, s.col); text(g, msg, m.x + 18, y + 6.5, 5.3, fresh ? 800 : 700, '#3D4560'); }
    var su = t - STAMP.t; if (su >= 0 && su < 1.8) { g.save(); g.translate(m.x + m.w * 0.56, m.y + m.h * 0.55); g.rotate(-0.18); var sc = su < 0.12 ? 1.6 - su * 5 : 1; g.scale(sc, sc); g.globalAlpha = su > 1.4 ? (1.8 - su) / 0.4 : 1;
      g.strokeStyle = GO; g.lineWidth = 3; rr(g, -40, -13, 80, 26, 6); g.stroke(); text(g, 'SYNCED ✓', 0, 5, 12, 800, '#1E9E6A', 'center'); g.restore(); }
    /* the mug: on the desk, or in the engineer's hand */
    var mp = MUG.hand ? handAt(EN1, 1) : [548, 386]; fillRR(g, mp[0] - 6, mp[1] - 12, 12, 13, 3, '#FFFFFF'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.4; g.beginPath(); g.arc(mp[0] + 7, mp[1] - 6, 3.5, -1.4, 1.4); g.stroke(); fillRR(g, mp[0] - 6, mp[1] - 8, 12, 3, 1, TEAL);
    if (!MUG.hand) { g.strokeStyle = 'rgba(160,170,190,.5)'; g.lineWidth = 1.4; for (var sw = 0; sw < 2; sw++) { var sy = mp[1] - 16 - ((t * 10 + sw * 7) % 14); g.beginPath(); g.moveTo(mp[0] - 2 + sw * 4, sy); g.quadraticCurveTo(mp[0] + 2 + sw * 4, sy - 4, mp[0] - 1 + sw * 4, sy - 8); g.stroke(); } }
    /* the dispatcher's flag and whistle */
    if (FLAG.on) { var hp = handAt(EN2, 1), wv = Math.sin(t * 12) * 0.25 + FLAG.w; g.save(); g.translate(hp[0], hp[1]); g.rotate(-0.3 + wv * 0.4); g.fillStyle = '#7A869C'; g.fillRect(-1.5, -46, 3, 50);
      g.fillStyle = GO; g.beginPath(); g.moveTo(1.5, -46); g.quadraticCurveTo(18, -50 + Math.sin(t * 14) * 4, 34, -42); g.lineTo(34, -24); g.quadraticCurveTo(18, -30 + Math.sin(t * 14 + 1) * 4, 1.5, -26); g.closePath(); g.fill(); g.restore(); }
    if (WHISTLE.on) { var wp = handAt(EN2, 1); fillRR(g, wp[0] - 7, wp[1] - 4, 14, 7, 3, '#C9D2DE'); fillE(g, wp[0] + 6, wp[1] - 1, 4, 4, '#9AA6BC'); }
    /* the connector engineer's plug on its cable */
    var cp = handAt(CN, 1); g.strokeStyle = NAVY; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(cp[0], cp[1] + 6); g.bezierCurveTo(cp[0] + 10, cp[1] + 60, CN.x + 52, F - 30, CN.x + 46, F - 8); g.stroke();
    [0, 1, 2].forEach(function (c) { g.strokeStyle = c % 2 ? '#2E4470' : NAVY; g.lineWidth = 3; g.beginPath(); g.ellipse(CN.x + 46, F - 7 - c * 3, 16 - c * 2, 5, 0, 0, Math.PI * 2); g.stroke(); });
    g.save(); g.translate(cp[0], cp[1]); fillRR(g, -7, -8, 14, 16, 4, TEAL); g.fillStyle = '#C9D2DE'; g.fillRect(-4, -15, 2.4, 8); g.fillRect(1.6, -15, 2.4, 8); g.restore();
    /* the lever handles: the middle one pulls back when tapped */
    var L = T.lever, lu = t - PLUG.t, pull = lu >= 0 && lu < 1.4 ? Math.sin(Math.min(1, lu / 0.25) * Math.PI / 2) * (lu > 1 ? (1.4 - lu) / 0.4 : 1) : 0;
    [[-22, RED, 0], [0, AMBER, 1], [22, TEAL, 0]].forEach(function (lv) { var a = -0.12 + lv[2] * pull * 0.85 + (lv[2] ? 0 : Math.sin(t * 0.9 + lv[0]) * 0.02), bx = L.x + lv[0], by = F - 42;
      g.strokeStyle = '#C9D2DE'; g.lineWidth = 4; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.sin(a) * 58, by - Math.cos(a) * 58); g.stroke(); fillRR(g, bx + Math.sin(a) * 58 - 6, by - Math.cos(a) * 58 - 9, 12, 14, 4, lv[1]); });
    /* the fare gates' arrows blink */
    for (var gi = 0; gi < 4; gi++) { var gx = -905 + gi * 62, on = ((t * 1.4 + gi * 0.37) % 1) < 0.6; g.fillStyle = on ? GO : '#335244'; g.beginPath(); g.moveTo(gx + 7, F - 85); g.lineTo(gx + 17, F - 80); g.lineTo(gx + 7, F - 75); g.closePath(); g.fill(); }
  }
  function paintForeLive(g, t, S) {
    var e = S.ext;
    K.zfore(g, t, S, [[track(e).r2, function () { foreTrain(g, t, e); }]], function () { CO.crew(CREW, g, t, S, 'fore'); });
    CR.draw(g, t);
  }

  /* ---------------- each person's own loop and tap ---------------- */
  function tapped(st, t) { if (st.wave && st.wave !== st._seen) { st._seen = st.wave; st.c = t; return true; } return false; }
  function lookAt(P, S, st, t, def) { P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : def, 0.08); }
  function en1(P, t, S) { /* types; sips her coffee; glances up at the map. Tap: stamps SYNCED on the log, then spins her chair */
    var st = S.cast.en1; tapped(st, t); var u = (t - (st.c == null ? -99 : st.c)) / 1.9;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; MUG.hand = false; lookAt(P, S, st, t, -0.7);
    if (u >= 0 && u < 1) { P.talk = true; P.mood = 'happy';
      if (u < 0.3) { var a = u / 0.3; P.mood = 'wow'; P.hands = [[-120, -205], [lerp(-30, 52, a), lerp(-205, -392, a)]]; st.stamped = false; }
      else if (u < 0.4) { var b = (u - 0.3) / 0.1; P.hands = [[-120, -205], [lerp(52, -90, b), lerp(-392, -206, b)]]; if (b > 0.8 && !st.stamped) { st.stamped = true; STAMP.t = t; CR.burst('star', T.mon.x + 80, T.mon.y + 30, t); } }
      else { var w = (u - 0.4) / 0.6; P.hands = [[-120, -205], [-80, -210]]; P.sx = Math.cos(w * Math.PI * 2); P.hop = Math.sin(w * Math.PI) * 8; }
      return; }
    var c = (t + 2) % 10, busy = !!S.hot;
    if (c < 6.2 || busy) { var k2 = Math.abs(Math.sin(t * (busy ? 12 : 5))) * 7; P.hands = [[-122, -205 - k2], [-36, -205 - (7 - k2)]]; }
    else if (c < 8.4) { var e2 = clamp(Math.min((c - 6.2) / 0.5, (8.4 - c) / 0.5), 0, 1); MUG.hand = e2 > 0.3; P.hands = [[-122, -205], [lerp(-36, 16, e2), lerp(-205, -322, e2)]]; P.look = lerp(P.look, 0.05, 0.2); P.tilt = -0.05 * e2; }
    else { P.hands = [[-122, -205], [-40, -200]]; P.look = lerp(P.look, 0.35, 0.1); P.tilt = -0.1; }
  }
  function en2(P, t, S) { /* reads the timetable on her tablet, then waves a train off with the green flag. Tap: whistle, a big flag sweep, the freight departs */
    var st = S.cast.en2; if (tapped(st, t)) { st.sent = false; CR.burst('note', P.x, P.y - 250, t); } var u = (t - (st.c == null ? -99 : st.c)) / 2.4;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; FLAG.on = false; FLAG.w = 0; WHISTLE.on = false; lookAt(P, S, st, t, -0.4);
    if (u >= 0 && u < 1) { P.talk = u > 0.3; P.mood = 'happy';
      if (u < 0.3) { WHISTLE.on = true; P.hands = [[-70, -212], [12, -334]]; P.mood = 'wow'; P.talk = false; }
      else { var a = lerp(-2.5, -0.55, ease((u - 0.3) / 0.7)); FLAG.on = true; FLAG.w = 0.6; P.hands = [[-70, -212], [76 + Math.cos(a) * 146, -258 + Math.sin(a) * 146]]; P.hop = Math.sin((u - 0.3) / 0.7 * Math.PI) * 22; P.look = 0.6;
        if (!st.sent) { st.sent = true; FT.t0 = t; BOOST.t = t; } }
      return; }
    var c = (t + 4) % 10;
    if (c < 6) { P.hands = [[-70, -212], [-6 + Math.sin(t * 2.4) * 10, -226]]; P.tilt = 0.07; P.look = lerp(P.look, -0.25, 0.1); }
    else if (c < 8.4) { var r = clamp(Math.min((c - 6) / 0.4, (8.4 - c) / 0.4), 0, 1); FLAG.on = r > 0.5; P.hands = [[-70, -212], [lerp(60, 104 + Math.sin(t * 9) * 14, r), lerp(-200, -392, r)]]; P.look = lerp(P.look, 0.7, 0.1); P.mood = 'happy'; }
    else P.hands = [[-70, -212], [64, -176]];
  }
  function cn(P, t, S) { /* paces with a new plug, stops to point at the map, checks the plug. Tap: plugs in a new line (L7) and cheers */
    var st = S.cast.cn; tapped(st, t); var u = (t - (st.c == null ? -99 : st.c)) / 2.2;
    P.sx = 1; P.tilt = 0; P.hop = 0; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm'; lookAt(P, S, st, t, 0.4);
    if (u >= 0 && u < 1) { P.talk = true; P.mood = 'happy';
      if (u < 0.35) { var a = u / 0.35; P.hands = [[lerp(-70, -30, a), lerp(-160, -398, a)], [lerp(86, 30, a), lerp(-176, -400, a)]]; P.mood = 'wow'; st.done = false; }
      else { if (!st.done) { st.done = true; NEWL.t = t; CR.burst('conf', P.x, P.y - 260, t); } var b = (u - 0.35) / 0.65; P.hop = Math.abs(Math.sin(b * Math.PI * 3)) * 22; P.hands = [[-96 + Math.sin(t * 16) * 8, -390], [96 - Math.sin(t * 16) * 8, -392]]; }
      return; }
    var c = t % 12;
    if (c < 7) { var v = Math.cos(t * 0.6); P.x = 222 + Math.sin(t * 0.6) * 22; P.hop = Math.abs(v) > 0.2 ? Math.abs(Math.sin(t * 4.4)) * 5 : 0; P.look = lerp(P.look, v > 0 ? 0.6 : -0.6, 0.06); P.hands = [[-70 - Math.sin(t * 4.4) * 10, -160], [86, -176]]; }
    else if (c < 10) { P.hands = [[-70, -160], [118, -392]]; P.look = lerp(P.look, 0.85, 0.1); P.tilt = -0.06; }
    else { P.hands = [[-34, -232], [30, -236]]; P.tilt = 0.08; P.look = lerp(P.look, 0, 0.1); }
  }

  window.IXW.worlds.integration = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t, par, S) { /* clouds drift past the glass, a city train crosses its viaduct */
      var e = S.ext, w = e.r - e.l + 500;
      for (var c = 0; c < 5; c++) { var x = e.l - 250 + ((hash(c + 2) * w + t * (5 + c * 1.6)) % w) - par * (2 + c); K.cloud(g, x, -100 + (c % 3) * 70 + hash(c) * 20, 0.34 + (c % 2) * 0.12); }
      var tx = e.l - 120 + ((t * 45) % (e.r - e.l + 240)); for (var k2 = 0; k2 < 4; k2++) { fillRR(g, tx - k2 * 30, 271, 28, 9, 3, '#FFFFFF'); g.fillStyle = TEAL; g.fillRect(tx - k2 * 30, 276, 28, 2); }
    },
    paintLive: paintLive, paintFrontLive: paintFrontLive, paintForeLive: paintForeLive,
    moteCol: 'rgba(20,163,139,.2)',
    glow: (function () { var o = {}; SYS.forEach(function (s) { o[s.key] = function (g) { rr(g, s.x - 8, s.y - 8, 164, 68, 14); }; });
      o.lever = function (g) { rr(g, T.lever.x - 52, F - 112, 104, 116, 14); }; return o; })(),
    backGlow: ['store', 'market', 'pay', 'bank', 'mail', 'api'],
    cast: [
      { id: 'en1', behind: true, keys: ['store', 'pay'], P: EN1, act: en1 },
      { id: 'en2', behind: true, keys: ['bank', 'mail'], P: EN2, act: en2 },
      { id: 'cn', behind: true, keys: ['market', 'api'], P: CN, act: cn }
    ],
    toy: function (name, S, t) { if (name === 'lever') { PLUG.t = t; PLUG.k = (PLUG.k + 2) % SYS.length; CR.burst('spark', T.lever.x, F - 110, t); } },
    hit: function (x, y, S, t, onBtn) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      var e = S.ext, tk = track(e), spd = 170, len = 760, span = e.r - e.l + len + 500, fx = e.l - 120 + ((t - FT.t0) * spd) % span;
      if (y > tk.r2 - 90 && y < tk.r2 + 6 && x < fx + 14 && x > fx - len) { BOOST.t = t; return { say: 'The **freight** to Odoo Central: orders, stock and payouts ride the same line, every day.', near: [clamp(x, 220, 860), 236], pose: 'wow' }; }
      if (!onBtn && y > 330 && y < 470) { var u = (t + 3) % 30; if (u >= 5 && u < 13 && x > T.dock && x < T.dock + 620) return { say: 'The **express** waits at platform 6, then runs across the station: connected once, synced every day.', near: [840, 236], pose: 'point-right' }; }
      return null;
    },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
