/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: ecommerce (/industries/ecommerce) — Parcel Lane, a sample online shop, drawn as its PACKING ROOM. Lilac block walls
   with a mint safety stripe over a polished concrete floor, strip lights overhead. Left to right: the returns cage; the
   order rail, where slips from the web store and two marketplaces clip in (eCommerce, every channel); the support desk
   with Nora on a headset and her helpdesk screen (Helpdesk, returns); the wall dashboard of sales by channel (Dashboards)
   over the stock rack, whose low bin flags a reorder (Purchase); the packing table with the order tablet showing the
   payment captured (payments), the label printer printing the courier label (Inventory, shipping) and Kai in his hoodie
   and cap with a parcel; a roll of bubble wrap that pops; the conveyor carrying parcels out through the roller door, where
   the courier van waits (tap the door, the parcels or the bubble wrap). Staff: Kai, packer (sample); Nora, customer
   support (sample). */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470;
  var T = {
    cage: { x: 92, y: 300, w: 96, h: 170 }, rail: { x: 196, y: 56, w: 176 }, desk: { x: 196, y: 352, w: 178 }, mon: { x: 298, y: 280 },
    tv: { x: 394, y: 30, w: 168, h: 110 }, rack: { x: 394, y: 166, w: 148, h: 304 },
    table: { x: 602, y: 346, w: 206 }, tab: { x: 612, y: 292 }, printer: { x: 750, y: 304 }, wrap: { x: 552, y: 470 },
    belt: { x0: 808, x1: 1034, y: 360 }, door: { x: 868, y: 104, w: 134, h: 366 }, lights: [300, 650, 930]
  };
  var C = { violet: '#6D5BD0', violetD: '#5443B5', mint: '#3CCFAE', mintD: '#22A88A', kraft: '#C99A6B', kraftD: '#A87A4C', ink: '#2B2350', lilac: '#E9E4F4', steel: '#9C95B8' };
  var CH = [{ k: 'WEB', col: C.violet }, { k: 'MKT A', col: '#F08A5D' }, { k: 'MKT B', col: C.mintD }];
  function blocks(g, W, ry, k, sx, sy) { g.strokeStyle = 'rgba(110,90,170,.10)'; g.lineWidth = 1.5 * k; var bh = 30 * k, bw = 64 * k, r = 0;
    for (var y = (sy % bh) - bh; y < ry; y += bh, r++) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); for (var x = (sx % bw) + (r % 2 ? bw / 2 : 0) - bw; x < W; x += bw) { g.moveTo(x, y); g.lineTo(x, y + bh); } g.stroke(); } }
  var ROOM = { wall: ['#F4F1FA', '#EAE5F5'], wains: ['#DDD6EF', '#D3CBE8'], rail: C.mint, base: '#B8AED6', floor: ['#E7E3EF', '#D4CEE2'], floorKind: 'tiles', floorLine: 'rgba(255,255,255,.55)',
    panelLine: 'rgba(0,0,0,0)', wainsH: 128, pattern: blocks };
  function parcel(g, x, y, w, h, tapeV) { fillRR(g, x, y, w, h, 4, C.kraft); fillRR(g, x, y, w, Math.min(10, h * 0.22), 3, C.kraftD); g.fillStyle = 'rgba(255,240,210,.5)';
    if (tapeV) g.fillRect(x + w / 2 - 5, y, 10, h); else g.fillRect(x, y + h / 2 - 4, w, 8); }

  /* ---------------- static back props (set units) ---------------- */
  function paintBack(g) {
    T.lights.forEach(function (lx) { g.fillStyle = '#9C95B8'; g.fillRect(lx - 40, 0, 2, 18); g.fillRect(lx + 38, 0, 2, 18); fillRR(g, lx - 48, 16, 96, 12, 6, '#FFFFFF'); fillRR(g, lx - 44, 26, 88, 4, 2, '#FFF8E0');
      g.save(); var gl = g.createLinearGradient(0, 28, 0, 220); gl.addColorStop(0, 'rgba(255,250,230,.35)'); gl.addColorStop(1, 'rgba(255,250,230,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(lx - 44, 30); g.lineTo(lx + 44, 30); g.lineTo(lx + 110, 220); g.lineTo(lx - 110, 220); g.closePath(); g.fill(); g.restore(); });
    /* the returns cage */
    var cg = T.cage; soft(g, cg.x + cg.w / 2, F + 3, cg.w * 0.6, 8, 0.2);
    parcel(g, cg.x + 10, F - 52, 46, 44, true); parcel(g, cg.x + 44, F - 84, 42, 36, false);
    g.save(); g.translate(cg.x + 30, F - 40); g.rotate(-0.12); fillRR(g, -16, -6, 32, 13, 3, '#FFFFFF'); text(g, 'RETURN', 0, 4, 6.5, 800, '#E0456B', 'center'); g.restore();
    g.strokeStyle = 'rgba(80,70,120,.55)'; g.lineWidth = 1.4; g.beginPath();
    for (var mx = cg.x; mx <= cg.x + cg.w; mx += 12) { g.moveTo(mx, cg.y); g.lineTo(mx, F - 4); }
    for (var my = cg.y; my <= F - 4; my += 12) { g.moveTo(cg.x, my); g.lineTo(cg.x + cg.w, my); } g.stroke();
    fillRR(g, cg.x - 3, cg.y - 6, cg.w + 6, 8, 3, '#7D759E'); fillRR(g, cg.x - 3, F - 8, cg.w + 6, 8, 3, '#7D759E');
    fillRR(g, cg.x + 18, cg.y + 10, 60, 16, 4, C.ink); text(g, 'RETURNS', cg.x + 48, cg.y + 21.5, 8, 800, '#FFFFFF', 'center');
    /* the order rail: a steel bar, slips clipped on (a new slip slides in live) */
    var rl = T.rail; fillRR(g, rl.x - 6, rl.y, rl.w + 12, 8, 4, '#8A82AA'); fillRR(g, rl.x - 6, rl.y, rl.w + 12, 3, 2, '#B9B2D3');
    text(g, 'ORDERS', rl.x, rl.y - 6, 9, 800, C.ink);
    /* the dashboard on the wall (its bars are live) */
    var tv = T.tv; shadowed(g, 16, 6, 0.2, function () { fillRR(g, tv.x, tv.y, tv.w, tv.h, 8, '#221C40'); }); fillRR(g, tv.x + 5, tv.y + 5, tv.w - 10, tv.h - 10, 5, '#FFFFFF');
    fillRR(g, tv.x + 5, tv.y + 5, tv.w - 10, 16, 4, C.violet); text(g, 'SALES BY CHANNEL', tv.x + 12, tv.y + 16.5, 7.5, 800, '#FFFFFF');
    /* the stock rack: steel uprights, three levels of bins and boxes */
    var rk = T.rack; soft(g, rk.x + rk.w / 2, F + 4, rk.w * 0.6, 10, 0.2);
    g.fillStyle = '#7D759E'; g.fillRect(rk.x, rk.y, 7, rk.h); g.fillRect(rk.x + rk.w - 7, rk.y, 7, rk.h);
    var lv = [rk.y + 90, rk.y + 180, rk.y + 270];
    lv.forEach(function (ly, i) { fillRR(g, rk.x, ly, rk.w, 8, 2, '#9C95B8');
      for (var b = 0; b < 3; b++) { var bx = rk.x + 12 + b * 44, low = i === 0 && b === 2; fillRR(g, bx, ly - 40, 38, 40, 4, low ? '#E9E4F4' : [C.violet, C.mintD, '#F08A5D'][(b + i) % 3]);
        fillRR(g, bx + 4, ly - 30, 30, 10, 2, '#FFFFFF'); g.fillStyle = C.ink; g.fillRect(bx + 8, ly - 26, 22, 2);
        if (!low) { parcel(g, bx + 6, ly - 58, 26, 20, true); } } });
    parcel(g, rk.x + 14, rk.y + 6, 56, 44, false); parcel(g, rk.x + 76, rk.y + 18, 54, 32, true); fillRR(g, rk.x, rk.y, rk.w, 6, 2, '#9C95B8');
    /* the dock door's frame (the door and the van are live) */
    var dr = T.door; fillRR(g, dr.x - 12, dr.y - 14, dr.w + 24, 16, 4, '#7D759E'); g.fillStyle = '#8A82AA'; g.fillRect(dr.x - 12, dr.y, 12, dr.h); g.fillRect(dr.x + dr.w, dr.y, 12, dr.h);
    for (var hz = 0; hz < 8; hz++) { g.fillStyle = hz % 2 ? '#2B2350' : '#FFD84A'; g.fillRect(dr.x + hz * (dr.w / 8), F - 4, dr.w / 8, 6); }
    text(g, 'DOCK 1', dr.x + dr.w / 2, dr.y - 2, 8.5, 800, '#FFFFFF', 'center');
    /* floor shadows of the desk and the table */
    soft(g, T.desk.x + T.desk.w / 2, F + 6, T.desk.w * 0.6, 14, 0.18); soft(g, T.table.x + T.table.w / 2, F + 6, T.table.w * 0.6, 14, 0.18);
  }

  /* ---------------- static front props: the support desk, the packing table, the conveyor (over the staff) ---------------- */
  function paintFront(g) {
    var dk = T.desk; fillRR(g, dk.x, dk.y, dk.w, 12, 5, '#F4F1FA'); fillRR(g, dk.x + 6, dk.y + 10, dk.w - 12, F - dk.y - 10, 6, C.violet);
    g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(dk.x + 18, dk.y + 26, dk.w - 36, 3); fillRR(g, dk.x + 24, dk.y + 44, 62, 30, 5, C.violetD); fillRR(g, dk.x + 30, dk.y + 52, 50, 4, 2, '#8D7FE0');
    text(g, 'SUPPORT', dk.x + dk.w - 30, dk.y + 66, 9, 800, '#FFFFFF', 'center');
    var mn = T.mon; fillRR(g, mn.x + 28, mn.y + 50, 12, 18, 3, '#9C95B8'); fillRR(g, mn.x + 16, mn.y + 64, 36, 6, 3, '#B9B2D3'); fillRR(g, mn.x, mn.y, 70, 54, 6, '#221C40'); fillRR(g, mn.x + 4, mn.y + 4, 62, 46, 3, '#FFFFFF');
    fillRR(g, dk.x + 14, dk.y - 22, 18, 22, 4, '#F08A5D'); g.strokeStyle = '#F08A5D'; g.lineWidth = 3; g.beginPath(); g.arc(dk.x + 33, dk.y - 11, 5, -1.4, 1.4); g.stroke();
    /* the packing table: a work top, open legs, a shelf of flat boxes below */
    var tb = T.table; fillRR(g, tb.x - 4, tb.y, tb.w + 8, 14, 5, '#E9D6B8'); g.fillStyle = '#C9B08A'; g.fillRect(tb.x, tb.y + 10, tb.w, 4);
    g.fillStyle = '#7D759E'; g.fillRect(tb.x + 8, tb.y + 14, 8, F - tb.y - 14); g.fillRect(tb.x + tb.w - 16, tb.y + 14, 8, F - tb.y - 14); fillRR(g, tb.x + 8, F - 46, tb.w - 16, 7, 3, '#9C95B8');
    parcel(g, tb.x + 30, F - 86, 70, 40, false); parcel(g, tb.x + 108, F - 76, 60, 30, true);
    fillRR(g, tb.x + 30, tb.y + 22, 140, 26, 6, C.ink); text(g, 'PACK · LABEL · SHIP', tb.x + 100, tb.y + 39, 8.5, 800, '#FFFFFF', 'center');
    /* the tablet on its stand and the label printer */
    var tt = T.tab; fillRR(g, tt.x + 22, tt.y + 40, 8, 14, 2, '#9C95B8'); fillRR(g, tt.x + 10, tt.y + 50, 32, 5, 2, '#B9B2D3'); fillRR(g, tt.x, tt.y, 52, 42, 6, '#221C40'); fillRR(g, tt.x + 3, tt.y + 3, 46, 36, 3, '#FFFFFF');
    var pr = T.printer; fillRR(g, pr.x, pr.y, 54, 42, 8, '#ECE8F5'); fillRR(g, pr.x, pr.y, 54, 12, 6, '#D8D2EA'); fillRR(g, pr.x + 8, pr.y + 26, 12, 5, 2, C.mint); fillRR(g, pr.x + 34, pr.y + 26, 12, 5, 2, '#D8D2EA');
    fillRR(g, pr.x + 6, pr.y - 3, 42, 6, 2, '#2B2350');
    /* the conveyor out through the dock door */
    var be = T.belt; fillRR(g, be.x0, be.y, be.x1 - be.x0, 12, 6, '#3A3358'); fillRR(g, be.x0 + 2, be.y + 12, be.x1 - be.x0 - 4, 14, 5, '#8A82AA');
    g.fillStyle = '#7D759E'; for (var lg = be.x0 + 22; lg < be.x1; lg += 64) g.fillRect(lg, be.y + 26, 7, F - be.y - 26);
    soft(g, (be.x0 + be.x1) / 2, F + 4, (be.x1 - be.x0) * 0.5, 9, 0.18);
    /* the bubble-wrap roll standing on the floor */
    var wr = T.wrap; soft(g, wr.x + 16, F + 3, 22, 6, 0.2); fillRR(g, wr.x, F - 76, 32, 76, 12, 'rgba(214,236,250,.95)');
    g.fillStyle = 'rgba(255,255,255,.9)'; for (var bb = 0; bb < 12; bb++) fillE(g, wr.x + 8 + (bb % 3) * 8, F - 66 + Math.floor(bb / 3) * 15, 3, 3, 'rgba(255,255,255,.95)');
    fillRR(g, wr.x + 4, F - 80, 24, 8, 4, '#B9D8EE');
  }

  /* ---------------- the dock door: the roller door and the courier van outside ---------------- */
  function doorOpen(S, t) { var td = S.toy.door != null ? t - S.toy.door : 99, base = 0.42; if (td < 0.9) return lerp(base, 1, td / 0.9); if (td < 3.6) return 1; if (td < 4.5) return lerp(1, base, (td - 3.6) / 0.9); return base; }
  function paintWindow(g, t, par, S) {
    var dr = T.door, op = doorOpen(S, t), oy = dr.y + dr.h * (1 - op);
    g.save(); rr(g, dr.x, dr.y, dr.w, dr.h, 2); g.clip();
    var sk = g.createLinearGradient(0, dr.y, 0, F); sk.addColorStop(0, '#CFEAF7'); sk.addColorStop(0.55, '#F2F8FB'); sk.addColorStop(0.56, '#C9C4D6'); sk.addColorStop(1, '#BAB4CA'); g.fillStyle = sk; g.fillRect(dr.x, dr.y, dr.w, dr.h);
    /* the courier van's rear, doors open */
    var vx = dr.x + 14 - par * 2, vy = F - 168;
    fillRR(g, vx, vy, 108, 150, 10, '#FFFFFF'); fillRR(g, vx + 6, vy + 8, 96, 108, 6, '#3A3358'); parcel(g, vx + 14, vy + 64, 36, 30, true); parcel(g, vx + 56, vy + 70, 32, 24, false); parcel(g, vx + 30, vy + 36, 30, 26, false);
    fillRR(g, vx + 4, vy + 120, 100, 14, 4, '#D8D2EA'); text(g, 'PARCEL LANE', vx + 54, vy + 131, 7.5, 800, C.violet, 'center');
    fillE(g, vx + 18, F - 12, 9, 9, '#2B2350'); fillE(g, vx + 90, F - 12, 9, 9, '#2B2350');
    /* the roller door's slats */
    for (var y = dr.y; y < oy; y += 10) { fillRR(g, dr.x, y, dr.w, 10, 2, (Math.floor((y - dr.y) / 10) % 2) ? '#B9B2D3' : '#C9C3DE'); g.fillStyle = 'rgba(40,30,80,.12)'; g.fillRect(dr.x, y + 8, dr.w, 2); }
    if (oy > dr.y + 4) { fillRR(g, dr.x, oy - 8, dr.w, 10, 3, '#8A82AA'); fillRR(g, dr.x + dr.w / 2 - 14, oy - 4, 28, 6, 3, '#FFD84A'); }
    g.restore();
  }

  /* ---------------- live back: order slips, the dashboard, the low bin ---------------- */
  var SLIPS = [['WEB', '#1042', 0], ['MKT A', '#A-5531', 1], ['MKT B', '#B-2208', 2], ['WEB', '#1043', 0]];
  function paintLive(g, t, now, S) {
    var rl = T.rail, on = S.hot === 'order', shift = on ? clamp((t - (S.ordT || 0)) / 0.8, 0, 1) : 1;
    for (var i = 0; i < 4; i++) {
      var s = SLIPS[i], x = rl.x + 2 + i * 44, dy = i === 3 ? (on ? (1 - shift) * -60 : 0) : 0, sw = Math.sin(t * 1.6 + i) * 0.03;
      if (i === 3 && !on) continue;
      g.save(); g.translate(x + 19, rl.y + 6 + dy); g.rotate(sw); fillRR(g, -5, -4, 10, 8, 2, '#5E5682');
      fillRR(g, -19, 2, 38, 54, 3, '#FFFFFF'); fillRR(g, -19, 2, 38, 10, 3, CH[s[2]].col); text(g, s[0], 0, 10, 6.5, 800, '#FFFFFF', 'center');
      text(g, s[1], 0, 24, 6.5, 800, C.ink, 'center'); g.fillStyle = '#D8D2EA'; g.fillRect(-13, 30, 26, 2); g.fillRect(-13, 36, 20, 2); g.fillRect(-13, 42, 24, 2); g.restore();
    }
    /* the dashboard: three channel bars that breathe, a counter */
    var tv = T.tv, n = 118 + Math.floor(t / 4) % 20, hi = S.hot === 'report' || S.peek === 'report';
    text(g, 'Orders today', tv.x + 12, tv.y + 35, 7, 700, '#6B6B84'); text(g, String(n), tv.x + 12, tv.y + 56, 17, 800, C.ink);
    var vals = [0.82, 0.56, 0.38];
    for (var b = 0; b < 3; b++) { var bh = 54 * vals[b] * (0.92 + Math.sin(t * 1.3 + b) * 0.08) * (hi ? 1.06 : 1), bx = tv.x + 76 + b * 26;
      fillRR(g, bx, tv.y + 94 - bh, 18, bh, 3, CH[b].col); text(g, CH[b].k.replace('MKT ', ''), bx + 9, tv.y + 103, 6, 800, '#6B6B84', 'center'); }
    g.strokeStyle = C.mintD; g.lineWidth = 2; g.beginPath(); for (var p = 0; p < 7; p++) { var px = tv.x + 12 + p * 9, py = tv.y + 92 - (hash(p + Math.floor(t / 4)) * 14 + p * 2); if (p) g.lineTo(px, py); else g.moveTo(px, py); } g.stroke();
    /* the low bin: blinks and raises a reorder on the Restock stop */
    var rk = T.rack, bx2 = rk.x + 12 + 88, ly = rk.y + 90, rs = S.hot === 'restock', blink = Math.floor(t * 2.5) % 2 === 0;
    fillRR(g, bx2 + 4, ly - 30, 30, 10, 2, rs && blink ? '#FFD84A' : '#FFFFFF'); text(g, rs ? 'REORDER' : 'LOW', bx2 + 19, ly - 22.5, 6, 800, rs ? C.ink : '#E0456B', 'center');
    if (rs) { var u = clamp((t - (S.rsT || 0)) / 1.2, 0, 1); parcel(g, bx2 + 6, ly - 58 + (1 - u) * -80, 26, 18, true); }
  }

  /* ---------------- live front: the tablet, the label, the helpdesk screen, the parcels, the bubbles ---------------- */
  var BOXES = [{ w: 46, h: 30 }, { w: 38, h: 36 }, { w: 52, h: 26 }];
  function paintFrontLive(g, t, S) {
    var tt = T.tab, pay = S.hot === 'pay' || S.peek === 'pay', cyc = (t % 6) / 6, paid = pay || cyc > 0.45;
    text(g, '#1042', tt.x + 7, tt.y + 13, 6.5, 800, C.ink); text(g, 'S$ 49.80', tt.x + 45, tt.y + 13, 6, 700, '#6B6B84', 'right');
    fillRR(g, tt.x + 6, tt.y + 20, 40, 13, 6, paid ? C.mintD : '#ECE8F5'); text(g, paid ? 'PAID ✓' : 'paying…', tt.x + 26, tt.y + 29.5, 6.5, 800, paid ? '#FFFFFF' : '#6B6B84', 'center');
    /* the label printer: a label slides out, the full courier label on the Ship stop */
    var pr = T.printer, sh = S.hot === 'ship', len = sh ? clamp((t - (S.shT || 0)) * 30, 6, 44) : 6 + ((t % 5) < 1.2 ? (t % 5) / 1.2 * 16 : 16 * Math.max(0, 1 - ((t % 5) - 1.2) / 0.6));
    g.save(); rr(g, pr.x - 30, pr.y - 60, 120, 60, 0); g.clip(); fillRR(g, pr.x + 9, pr.y - len, 36, len, 2, '#FFFFFF');
    if (len > 26) { g.fillStyle = C.ink; for (var bc = 0; bc < 9; bc++) g.fillRect(pr.x + 13 + bc * 3.2, pr.y - len + 5, bc % 3 ? 1.4 : 2.4, 10); text(g, 'PL1042SG', pr.x + 27, pr.y - len + 23, 5.5, 800, C.ink, 'center'); }
    g.restore();
    /* the helpdesk screen: a ticket, a reply typing */
    var mn = T.mon, sup = S.hot === 'support' || S.peek === 'support';
    fillRR(g, mn.x + 4, mn.y + 4, 62, 10, 3, C.mintD); text(g, 'HELPDESK', mn.x + 8, mn.y + 11.5, 6, 800, '#FFFFFF');
    text(g, '#318 Return', mn.x + 8, mn.y + 24, 6.2, 800, C.ink); g.fillStyle = '#D8D2EA'; g.fillRect(mn.x + 8, mn.y + 29, 44, 2); g.fillRect(mn.x + 8, mn.y + 34, 34, 2);
    fillRR(g, mn.x + 8, mn.y + 38, 50, 9, 4, sup ? C.violet : '#ECE8F5');
    for (var d = 0; d < 3; d++) fillE(g, mn.x + 18 + d * 7, mn.y + 42.5, 1.6, 1.6 + (Math.floor(t * 4) % 3 === d ? 0.6 : 0), sup ? '#FFFFFF' : '#9C95B8');
    /* parcels ride the conveyor out through the door (they hop when tapped) */
    var be = T.belt, span = be.x1 - be.x0 + 60, off = (t * 22) % span, tp = S.toy.parcel != null ? t - S.toy.parcel : 99;
    g.save(); rr(g, be.x0, be.y - 70, T.door.x + T.door.w - be.x0 - 6, 82, 2); g.clip();
    g.fillStyle = '#4A4370'; for (var sl = be.x0 - 20 + (t * 22) % 20; sl < be.x1; sl += 20) g.fillRect(sl, be.y + 2, 2, 8);
    BOXES.forEach(function (bx, j) { var x = be.x0 - 50 + ((j * span / BOXES.length + off) % span), hop = tp < 0.7 ? Math.max(0, Math.sin((tp - j * 0.08) / 0.6 * Math.PI)) * 22 : 0;
      parcel(g, x, be.y - bx.h - hop, bx.w, bx.h, j % 2 === 0); fillRR(g, x + bx.w - 20, be.y - bx.h + 8 - hop, 14, 10, 2, '#FFFFFF'); g.fillStyle = C.ink; g.fillRect(x + bx.w - 17, be.y - bx.h + 11 - hop, 8, 1.6); });
    g.restore();
    /* bubble wrap: pops */
    var tw = S.toy.wrap != null ? t - S.toy.wrap : 99, wr = T.wrap;
    if (tw < 1.1) for (var pp = 0; pp < 5; pp++) { var a = -Math.PI / 2 + (pp - 2) * 0.5, r0 = 30 + tw * 40, al = (1 - tw / 1.1).toFixed(2);
      g.strokeStyle = 'rgba(109,91,208,' + al + ')'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(wr.x + 16 + Math.cos(a) * r0, F - 60 + Math.sin(a) * r0); g.lineTo(wr.x + 16 + Math.cos(a) * (r0 + 9), F - 60 + Math.sin(a) * (r0 + 9)); g.stroke();
      if (pp === 2) text(g, 'POP!', wr.x + 16, F - 96 - tw * 26, 12, 800, 'rgba(109,91,208,' + al + ')', 'center'); }
  }

  var KAI = { x: 714, y: 458, s: 0.6, ph: 0.5, c: { skin: '#C68B5E', hair: '#1F1A1A', top: C.violet, low: '#2B2350', shoe: '#F7F8FB', hat: C.mint, hatBand: null }, outfit: 'hoodie', hat: 'cap', hold: 'box', hairStyle: 'short',
    feet: false, mood: 'calm', look: 0, talk: false, hands: [[-60, -212], [64, -216]] };
  var NORA = { x: 286, y: 458, s: 0.58, ph: 1.7, c: { skin: '#F3CDA8', hair: '#4A2E22', top: C.mintD, shirt: '#FFFFFF', pocket: '#FFD84A' }, outfit: 'blazer', headset: C.violet, glasses: true, hairStyle: 'long',
    feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };

  window.IXW.worlds.ecommerce = {
    room: ROOM, paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    moteCol: 'rgba(255,255,255,.7)',
    glow: {
      order: function (g) { var rl = T.rail; rr(g, rl.x - 12, rl.y - 18, rl.w + 24, 82, 12); },
      pay: function (g) { rr(g, T.tab.x - 8, T.tab.y - 8, 68, 70, 12); },
      ship: function (g) { var pr = T.printer; rr(g, pr.x - 8, pr.y - 30, 70, 80, 12); },
      restock: function (g) { var rk = T.rack; rr(g, rk.x - 10, rk.y - 10, rk.w + 20, rk.h + 14, 14); },
      support: function (g) { rr(g, T.mon.x - 8, T.mon.y - 8, 86, 84, 12); },
      report: function (g) { var tv = T.tv; rr(g, tv.x - 8, tv.y - 8, tv.w + 16, tv.h + 16, 14); },
      door: function (g) { var dr = T.door; rr(g, dr.x - 14, dr.y - 16, dr.w + 28, dr.h + 14, 12); },
      parcel: function (g) { var be = T.belt; rr(g, be.x0 - 6, be.y - 52, 200, 86, 12); },
      wrap: function (g) { rr(g, T.wrap.x - 8, F - 88, 48, 94, 12); }
    },
    backGlow: ['order', 'restock', 'report', 'door'],
    cast: [
      { id: 'nora', behind: true, keys: ['support'], P: NORA, act: function (P, t, S) {
        var st = S.cast.nora, busy = S.hot === 'support';
        P.talk = t < st.until || (busy && (t % 2.4) < 1.4); P.mood = P.talk || busy ? 'happy' : 'calm';
        var tap = busy ? Math.abs(Math.sin(t * 9)) * 7 : 0;
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-62, -186 + tap], [62, -186 + (busy ? Math.abs(Math.cos(t * 9)) * 7 : 0)]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'kai', behind: true, keys: ['ship', 'pay'], P: KAI, act: function (P, t, S) {
        var st = S.cast.kai, busy = S.hot === 'ship', lift = busy ? Math.abs(Math.sin(t * 3)) * 18 : Math.sin(t * 1.4) * 3;
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        P.hold = t < st.wave ? null : 'box';
        P.hands = t < st.wave ? [[-60, -212], [128 + Math.sin(t * 12) * 16, -404]] : [[-60, -212 - lift], [64, -216 - lift]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } }
    ],
    onStop: function (key, S, t) { if (key === 'order') S.ordT = t; if (key === 'restock') S.rsT = t; if (key === 'ship') { S.shT = t; S.toy.parcel = t; } }
  };
})(window.IXW && window.IXW.kit);
