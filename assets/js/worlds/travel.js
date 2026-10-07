/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: travel (/industries/travel) — Bluewave Journeys, a sample travel agency. A sunny agency: the window looks out on
   the sea (a jet crosses, the water sparkles), the agency's plaque, two world clocks (Singapore, Tokyo) on the visitor's
   real time, a currency board whose rates flip (Accounting, multi-currency), the trips map whose flight paths draw
   themselves and show each trip's margin (Dashboards), the brochure and voucher rack (Purchase), and the desk with the
   enquiry phone (CRM), the itinerary laptop (Sales) and the card terminal (deposit). A suitcase, a globe you can spin,
   a swaying palm, and the TechNext paper plane, which glides through now and then and loops when you tap it.
   Staff: Lina, the consultant (sample), and Sam, a traveller (sample). Painted with the kit in industry-world.js. */
(function (K) {
  'use strict';
  if (!K) return;
  var rr = K.rr, ell = K.ell, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed, tone = K.tone;
  var F = 470;
  var T = {
    win: { x: 175, y: 48, w: 220, h: 242 },
    sign: { x: 430, y: 36, w: 200, h: 50 },
    clocks: [{ x: 668, y: 62, r: 17, tz: 8, lab: 'SIN', rim: '#21B799' }, { x: 724, y: 62, r: 17, tz: 9, lab: 'TYO', rim: '#FF8FA3' }],
    fx: { x: 642, y: 112, w: 118, h: 90 },
    map: { x: 770, y: 22, w: 176, h: 142 },
    rack: { x: 876, y: 182, w: 112, h: 288 },
    desk: { x: 330, y: 326, w: 400 },
    phone: { x: 398, y: 256 }, laptop: { x: 448, y: 270 }, term: { x: 646, y: 280 },
    suit: { x: 204, y: 392 }, globe: { x: 300, y: 380, r: 25 }, palm: { x: 146, y: 470 }
  };
  /* the plane logo (the TechNext paper plane), drawn from the site's own asset */
  var base = ((document.currentScript && document.currentScript.src) || '').replace(/assets\/js\/worlds\/.*$/, '');
  var LOGO = new Image(); LOGO.decoding = 'async'; LOGO.src = base + 'assets/img/logo-plane.png';

  /* faint dotted flight arcs on the upper wall (the agency's wallpaper) */
  function arcs(g, W, ry, k, sx, sy) {
    var step = 260 * k, row = 150 * k, i = 0;
    g.lineWidth = 2 * k; g.setLineDash([3 * k, 7 * k]); g.strokeStyle = 'rgba(49,103,202,.10)'; g.fillStyle = 'rgba(49,103,202,.16)';
    for (var y0 = (sy % row) + 50 * k; y0 < ry - 40 * k; y0 += row, i++) for (var x0 = (sx % step) - step + (i % 2 ? 130 * k : 0); x0 < W; x0 += step) {
      g.beginPath(); g.moveTo(x0, y0 + 30 * k); g.quadraticCurveTo(x0 + 90 * k, y0 - 40 * k, x0 + 180 * k, y0 + 18 * k); g.stroke();
      g.save(); g.setLineDash([]); g.translate(x0 + 182 * k, y0 + 19 * k); g.rotate(0.55); g.beginPath(); g.moveTo(7 * k, 0); g.lineTo(-6 * k, -5 * k); g.lineTo(-3 * k, 0); g.lineTo(-6 * k, 5 * k); g.closePath(); g.fill(); g.restore();
    }
    g.setLineDash([]);
  }
  function planeIcon(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.moveTo(9, -7); g.lineTo(-9, 0); g.lineTo(-3, 2); g.lineTo(-1, 8); g.lineTo(2, 3); g.lineTo(9, -7); g.closePath(); g.fill(); g.restore(); }

  /* ---------------- static back props ---------------- */
  function paintBack(g) {
    K.windowFrame(g, T.win);
    K.plaque(g, T.sign, 'Bluewave Journeys', 'SAMPLE TRAVEL AGENCY', '#3FA9E0', function (gg, x, y) { planeIcon(gg, x, y, 0.95, '#FFFFFF'); });
    T.clocks.forEach(function (c) { K.clockFace(g, c, c.rim); fillRR(g, c.x - 16, c.y + c.r + 7, 32, 15, 7, '#FFFFFF'); text(g, c.lab, c.x, c.y + c.r + 18, 9.5, 800, '#1F1F3D', 'center'); });
    /* currency board: the body; rows flip live */
    var f = T.fx; fillRR(g, f.x + f.w / 2 - 5, f.y - 18, 10, 22, 4, '#C9D6E2');
    shadowed(g, 14, 6, 0.22, function () { fillRR(g, f.x, f.y, f.w, f.h, 12, '#22365C'); });
    fillRR(g, f.x + 6, f.y + 6, f.w - 12, f.h - 12, 7, '#132544');
    text(g, 'FX · 1 SGD =', f.x + 12, f.y + 21, 9.5, 800, '#8FB6E8');
    /* trips map */
    var m = T.map, ix = m.x + 8, iy = m.y + 8, iw = m.w - 16, ih = m.h - 16;
    shadowed(g, 16, 6, 0.16, function () { fillRR(g, m.x, m.y, m.w, m.h, 12, '#FFFFFF'); });
    fillRR(g, ix, iy, iw, ih, 8, '#CBE9F8');
    g.save(); rr(g, ix, iy, iw, ih, 8); g.clip();
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.2; g.setLineDash([3, 4]);
    for (var gx = ix + 20; gx < ix + iw; gx += 32) { g.beginPath(); g.moveTo(gx, iy); g.lineTo(gx, iy + ih); g.stroke(); }
    for (var gy = iy + 22; gy < iy + ih; gy += 30) { g.beginPath(); g.moveTo(ix, gy); g.lineTo(ix + iw, gy); g.stroke(); }
    g.setLineDash([]);
    var sand = '#F4E7C8', mint = '#CDEBD5';
    fillE(g, ix + 30, iy + 34, 16, 12, mint); fillE(g, ix + 38, iy + 76, 15, 27, sand); fillE(g, ix + 92, iy + 40, 46, 22, mint); fillE(g, ix + 108, iy + 60, 20, 12, sand);
    fillE(g, ix + 128, iy + 102, 19, 11, sand); g.save(); g.translate(ix + 141, iy + 44); g.rotate(0.5); fillE(g, 0, 0, 4, 10, mint); g.restore();
    fillE(g, ix + 112, iy + 80, 10, 3, sand); fillE(g, ix + 124, iy + 83, 7, 3, sand); fillE(g, ix + 101, iy + 74, 3, 3, sand);
    g.restore();
    fillRR(g, m.x + 10, m.y + m.h - 6, 64, 15, 7, '#3167CA'); text(g, 'MARGIN', m.x + 42, m.y + m.h + 5, 8.5, 800, '#FFFFFF', 'center');
    /* brochure + voucher rack */
    var r = T.rack; soft(g, r.x + r.w / 2, F + 4, r.w * 0.75, 14, 0.2);
    shadowed(g, 18, 6, 0.16, function () { fillRR(g, r.x, r.y, r.w, r.h, 10, '#E8CFA6'); });
    fillRR(g, r.x + 7, r.y + 7, r.w - 14, r.h - 14, 7, '#F7EAD3');
    fillRR(g, r.x + 18, r.y - 14, r.w - 36, 22, 8, '#3FA9E0'); text(g, 'TOURS', r.x + r.w / 2, r.y + 1, 10, 800, '#FFFFFF', 'center');
    var pics = [['#7CC8FF', '#FFD84A', 'beach'], ['#9BD7A9', '#FFFFFF', 'peak'], ['#B7A6F2', '#FFD27A', 'city'], ['#FF9EB1', '#FFF2C2', 'beach'], ['#7CD6C4', '#FFFFFF', 'peak'], ['#FFC977', '#3FA9E0', 'city']];
    for (var sh = 0; sh < 3; sh++) {
      var shy = r.y + 92 + sh * 66; fillRR(g, r.x + 7, shy, r.w - 14, 6, 2, '#D6B888');
      for (var b = 0; b < 3; b++) { var p = pics[(sh * 3 + b) % pics.length], bx = r.x + 14 + b * 31, bw = 26, bh = 50;
        g.save(); g.translate(bx + bw / 2, shy); g.rotate((b - 1) * 0.05); fillRR(g, -bw / 2, -bh, bw, bh, 3, '#FFFFFF'); fillRR(g, -bw / 2 + 2, -bh + 2, bw - 4, 24, 2, p[0]);
        if (p[2] === 'beach') { fillE(g, 4, -bh + 8, 4, 4, p[1]); fillRR(g, -bw / 2 + 2, -bh + 20, bw - 4, 6, 1, '#F4E7C8'); }
        else if (p[2] === 'peak') { g.fillStyle = p[1]; g.beginPath(); g.moveTo(-9, -bh + 26); g.lineTo(0, -bh + 8); g.lineTo(9, -bh + 26); g.closePath(); g.fill(); }
        else { g.fillStyle = p[1]; g.fillRect(-8, -bh + 14, 5, 12); g.fillRect(-2, -bh + 9, 5, 17); g.fillRect(4, -bh + 16, 5, 10); }
        g.fillStyle = '#D9E0EA'; g.fillRect(-bw / 2 + 4, -bh + 31, bw - 8, 3); g.fillRect(-bw / 2 + 4, -bh + 37, bw - 12, 3); g.restore(); }
    }
    /* vouchers on the bottom shelf */
    [[r.x + 16, '#FFD84A'], [r.x + 46, '#7CD6C4'], [r.x + 76, '#FF9EB1']].forEach(function (v, i) {
      g.save(); g.translate(v[0] + 12, r.y + r.h - 34); g.rotate(-0.12 + i * 0.1); fillRR(g, -12, -16, 26, 32, 3, v[1]); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(-8, -9, 18, 3); g.fillRect(-8, -3, 12, 3);
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.setLineDash([2, 2]); g.beginPath(); g.moveTo(-12, 6); g.lineTo(14, 6); g.stroke(); g.setLineDash([]); g.restore(); });
    /* contact shadows */
    soft(g, T.desk.x + T.desk.w / 2, F + 6, T.desk.w * 0.62, 20, 0.2); soft(g, T.suit.x + 36, F + 4, 52, 10, 0.24); soft(g, T.globe.x, F + 4, 34, 8, 0.22); soft(g, T.palm.x, F + 4, 46, 10, 0.2);
  }

  /* ---------------- static front props (over Lina) ---------------- */
  function paintFront(g) {
    var d = T.desk, top = d.y;
    fillRR(g, d.x + 8, top + 12, d.w - 16, F - top - 12, 14, '#FFFFFF');
    g.save(); rr(g, d.x + 8, top + 12, d.w - 16, F - top - 12, 14); g.clip();
    g.fillStyle = 'rgba(25,40,80,.06)'; g.fillRect(d.x + d.w * 0.7, top, d.w, 200);
    /* the sea band with a wave edge */
    g.fillStyle = '#3FA9E0'; g.beginPath(); g.moveTo(d.x, top + 86);
    for (var wx = d.x; wx <= d.x + d.w; wx += 8) g.lineTo(wx, top + 50 + Math.sin(wx * 0.06) * 4);
    g.lineTo(d.x + d.w, top + 86); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; g.beginPath();
    for (var wx2 = d.x; wx2 <= d.x + d.w; wx2 += 8) { var yy = top + 64 + Math.sin(wx2 * 0.06 + 1.5) * 3; if (wx2 === d.x) g.moveTo(wx2, yy); else g.lineTo(wx2, yy); } g.stroke();
    g.fillStyle = '#2B8CC4'; g.fillRect(d.x, top + 86, d.w, 4);
    g.fillStyle = '#E8EEF5'; g.fillRect(d.x, F - 14, d.w, 14);
    g.restore();
    fillE(g, d.x + d.w / 2, top + 66, 22, 22, '#FFFFFF'); planeIcon(g, d.x + d.w / 2, top + 66, 1.1, '#3167CA');
    fillRR(g, d.x - 4, top, d.w + 8, 16, 8, '#EED8B6'); g.fillStyle = '#D8BC93'; g.fillRect(d.x + 4, top + 12, d.w - 8, 4);
    /* enquiry phone on a stand */
    var p = T.phone; fillRR(g, p.x + 14, p.y + 60, 14, 10, 3, '#AAB4C4'); fillRR(g, p.x + 4, p.y + 66, 34, 6, 3, '#C3CDDA');
    g.save(); g.translate(p.x + 21, p.y + 34); g.rotate(-0.06); fillRR(g, -19, -34, 38, 66, 9, '#2A3550'); fillRR(g, -15, -29, 30, 56, 6, '#FFFFFF');
    fillRR(g, -15, -29, 30, 9, 4, '#3FA9E0'); fillRR(g, -12, -15, 18, 9, 4, '#EEF2F8'); fillRR(g, -2, -3, 15, 9, 4, '#3167CA'); g.restore();
    /* itinerary laptop */
    var l = T.laptop;
    g.save(); g.translate(l.x, l.y); fillRR(g, 4, 0, 78, 52, 6, '#2A3550'); fillRR(g, 8, 4, 70, 44, 3, '#FFFFFF');
    fillRR(g, 8, 4, 70, 8, 2, '#7B5BD6');
    [['#3FA9E0', 32], ['#FF8FA3', 26], ['#21B799', 34], ['#FFD84A', 22]].forEach(function (q, i) { fillE(g, 15, 18 + i * 7.5, 2.6, 2.6, q[0]); g.fillStyle = '#C9D3E3'; g.fillRect(20, 16.5 + i * 7.5, q[1], 3); g.fillRect(64, 16.5 + i * 7.5, 9, 3); });
    g.beginPath(); g.moveTo(-4, 52); g.lineTo(90, 52); g.lineTo(84, 58); g.lineTo(2, 58); g.closePath(); g.fillStyle = '#C3CDDA'; g.fill(); g.restore();
    /* card terminal */
    var tm = T.term; fillRR(g, tm.x + 4, tm.y + 42, 56, 8, 4, '#9AA6BC');
    g.save(); g.translate(tm.x + 30, tm.y + 18); g.rotate(-0.08); fillRR(g, -20, -26, 40, 64, 8, '#2A3550'); fillRR(g, -15, -21, 30, 20, 4, '#EAF0FB');
    g.fillStyle = '#7B8DB0'; for (var kk = 0; kk < 9; kk++) fillRR(g, -13 + (kk % 3) * 9.5, 4 + Math.floor(kk / 3) * 8, 7, 5, 1.5, kk === 8 ? '#21B799' : '#5D6E93'); g.restore();
    fillRR(g, tm.x + 46, tm.y + 6, 22, 34, 4, '#FFFFFF'); fillRR(g, tm.x + 48, tm.y + 10, 18, 4, 2, '#21B799'); g.fillStyle = '#C9D3E3'; g.fillRect(tm.x + 49, tm.y + 18, 14, 2); g.fillRect(tm.x + 49, tm.y + 23, 10, 2);
    /* the suitcase, stickered */
    var s = T.suit;
    fillRR(g, s.x + 26, s.y - 44, 4, 46, 2, '#9AA6BC'); fillRR(g, s.x + 42, s.y - 44, 4, 46, 2, '#9AA6BC'); fillRR(g, s.x + 22, s.y - 50, 28, 9, 4, '#5D6E93');
    fillRR(g, s.x, s.y, 72, 72, 12, '#FF8A65'); g.fillStyle = 'rgba(255,255,255,.22)'; [16, 36, 56].forEach(function (x) { g.fillRect(s.x + x, s.y + 6, 4, 60); });
    g.fillStyle = 'rgba(120,40,20,.12)'; g.fillRect(s.x + 50, s.y + 2, 22, 68);
    fillE(g, s.x + 14, s.y + 76, 6, 6, '#2A3550'); fillE(g, s.x + 58, s.y + 76, 6, 6, '#2A3550');
    fillE(g, s.x + 22, s.y + 24, 11, 11, '#21B799'); text(g, 'SIN', s.x + 22, s.y + 27, 7.5, 800, '#FFFFFF', 'center');
    g.save(); g.translate(s.x + 50, s.y + 46); g.rotate(0.2); fillRR(g, -13, -8, 26, 16, 3, '#FFFFFF'); planeIcon(g, 0, 0, 0.7, '#3167CA'); g.restore();
    g.fillStyle = '#FFD84A'; g.beginPath(); for (var st = 0; st < 10; st++) { var a = -Math.PI / 2 + st * Math.PI / 5, rad = st % 2 ? 4 : 9; g.lineTo(s.x + 24 + Math.cos(a) * rad, s.y + 54 + Math.sin(a) * rad); } g.closePath(); g.fill();
    /* the globe's stand (the ball itself spins live) */
    var gb = T.globe; fillRR(g, gb.x - 3, gb.y + gb.r, 6, F - gb.y - gb.r - 6, 3, '#B98A55'); fillE(g, gb.x, F - 6, 22, 7, '#9C7243'); fillE(g, gb.x, F - 8, 18, 5, '#B98A55');
  }

  /* ---------------- the window: sky, sea, a jet ---------------- */
  var ISLE = null;
  function paintWindow(g, t, par, S) {
    var w = T.win; g.save(); rr(g, w.x, w.y, w.w, w.h, 10); g.clip();
    K.windowSky(g, w, t, par, '#7CC8FF', '#D9F1FF');
    var sea = w.y + w.h * 0.7, sg = g.createLinearGradient(0, sea, 0, w.y + w.h); sg.addColorStop(0, '#55B9EC'); sg.addColorStop(1, '#2E8FD0'); g.fillStyle = sg; g.fillRect(w.x, sea, w.w, w.y + w.h - sea);
    /* an island with two palms */
    var ix = w.x + w.w * 0.72 - par * 5; fillE(g, ix, sea + 2, 46, 12, '#F4E2B8'); fillE(g, ix + 6, sea - 2, 30, 9, '#7DCB8E');
    [[ix - 8, 0.2], [ix + 14, -0.15]].forEach(function (pm) { g.strokeStyle = '#8A6A44'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(pm[0], sea - 2); g.quadraticCurveTo(pm[0] + 3, sea - 16, pm[0] + 1, sea - 26); g.stroke();
      for (var f2 = 0; f2 < 5; f2++) { g.save(); g.translate(pm[0] + 1, sea - 26); g.rotate(-Math.PI / 2 + (f2 - 2) * 0.7 + Math.sin(t * 1.3 + f2) * 0.06 + pm[1]); g.fillStyle = '#3FBF7F'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(7, -4, 14, 1); g.quadraticCurveTo(7, 2, 0, 0); g.fill(); g.restore(); } });
    /* sparkles on the water */
    g.fillStyle = 'rgba(255,255,255,.75)';
    for (var i = 0; i < 9; i++) { var sx2 = w.x + ((hash(i * 2.1) * w.w + t * (6 + i)) % w.w), sy2 = sea + 8 + hash(i * 3.7) * (w.y + w.h - sea - 12), a2 = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)); g.globalAlpha = a2; g.fillRect(sx2, sy2, 7, 1.6); }
    g.globalAlpha = 1;
    /* a jet every 11 s, with a contrail */
    var cyc = (t + 3) % 11; if (cyc < 6) { var u = cyc / 6, jx = w.x - 30 + u * (w.w + 60), jy = w.y + 70 - u * 26;
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 2; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(Math.max(w.x, jx - 90), jy + 90 * 26 / (w.w + 60)); g.lineTo(jx - 8, jy + 2); g.stroke(); g.setLineDash([]);
      g.save(); g.translate(jx, jy); g.rotate(-0.12); fillRR(g, -12, -2.5, 24, 5, 2.5, '#FFFFFF'); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-2, 0); g.lineTo(-8, 9); g.lineTo(-4, 9); g.lineTo(4, 0); g.closePath(); g.fill();
      g.fillStyle = '#3167CA'; g.beginPath(); g.moveTo(-12, -2); g.lineTo(-15, -8); g.lineTo(-10, -2); g.closePath(); g.fill(); g.restore(); }
    K.windowGlass(g, w); g.restore(); K.windowMullions(g, w);
  }

  /* ---------------- live back props: world clocks, flipping rates, the trips map ---------------- */
  var RATES = [['JPY', 113.64, 2], ['EUR', 0.685, 3], ['IDR', 12060, 0], ['KRW', 1032, 0]];
  function fmt(v, d) { var s = v.toFixed(d); return d === 0 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s; }
  var PINS = { sin: [104, 72], tyo: [141, 44], dps: [118, 83], icn: [127, 42], syd: [139, 104] };
  var TRIPS = [['tyo', '+18%'], ['dps', '+21%'], ['icn', '+16%'], ['syd', '+14%']];
  function paintLive(g, t, now, S) {
    var utc = now.getUTCHours() + now.getUTCMinutes() / 60;
    T.clocks.forEach(function (c) { var h = (utc + c.tz) % 24; K.clockHands(g, c, Math.floor(h), Math.floor((h % 1) * 60), now.getUTCSeconds()); });
    /* the rate board: three rows on show, one flips every 2.5 s */
    var f = T.fx, slot = Math.floor(t / 2.5), ph = (t % 2.5) / 2.5;
    for (var r = 0; r < 3; r++) {
      var idx = (r + Math.floor(slot / 3)) % RATES.length, R = RATES[idx], wob = 1 + (hash(slot * 7 + idx) - 0.5) * 0.004, y = f.y + 30 + r * 18;
      text(g, R[0], f.x + 12, y + 9, 10, 800, '#F3E7C9');
      var flipping = (slot % 3) === r && ph < 0.14, sq = flipping ? Math.abs(Math.cos(ph / 0.14 * Math.PI)) : 1;
      g.save(); g.translate(f.x + 76, y + 5); g.scale(1, Math.max(0.08, sq)); fillRR(g, -26, -7, 52, 14, 3, '#24395E');
      text(g, fmt(R[1] * wob, R[2]), 22, 4, 10, 800, '#FFC94A', 'right'); g.restore();
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(f.x + 50, y + 4.5, 52, 1);
    }
    /* the trips map: flight paths from Singapore draw themselves, a plane rides the newest one */
    var m = T.map, ix = m.x + 8, iy = m.y + 8, cyc = (t % 10) / 10, sp = PINS.sin, hot = S.hot === 'review';
    g.save(); rr(g, ix, iy, m.w - 16, m.h - 16, 8); g.clip();
    TRIPS.forEach(function (tr, i) {
      var dp = PINS[tr[0]], p0 = clamp((cyc - i * 0.18) / 0.22, 0, 1), x0 = ix + sp[0], y0 = iy + sp[1], x1 = ix + dp[0], y1 = iy + dp[1], cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - 24;
      if (hot) p0 = 1; if (p0 <= 0) return;
      g.strokeStyle = 'rgba(49,103,202,.85)'; g.lineWidth = 1.8; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(x0, y0);
      for (var q = 1; q <= 20 * p0; q++) { var u = q / 20, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; g.lineTo(a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1); }
      g.stroke(); g.setLineDash([]);
      if (p0 < 1) { var u2 = p0, a2 = (1 - u2) * (1 - u2), b2 = 2 * u2 * (1 - u2), c2 = u2 * u2; planeIcon(g, a2 * x0 + b2 * cx + c2 * x1, a2 * y0 + b2 * cy + c2 * y1, 0.55, '#1E4691'); }
      var pulse = p0 >= 1 ? 1 + Math.sin(t * 4 + i) * 0.15 : 0.6; fillE(g, x1, y1, 4.5 * pulse, 4.5 * pulse, '#FF6F91'); fillE(g, x1, y1, 1.8, 1.8, '#FFFFFF');
      if (p0 >= 1 && (hot || cyc > 0.75)) { var lx = x1 + (tr[0] === 'syd' ? -34 : 6), ly = y1 + (tr[0] === 'icn' ? -14 : tr[0] === 'tyo' ? 10 : 6); fillRR(g, lx, ly - 8, 28, 12, 6, '#21B799'); text(g, tr[1], lx + 14, ly + 1, 8, 800, '#FFFFFF', 'center'); }
    });
    fillE(g, ix + sp[0], iy + sp[1], 5.5, 5.5, '#3167CA'); fillE(g, ix + sp[0], iy + sp[1], 2.2, 2.2, '#FFFFFF');
    g.restore();
  }

  /* ---------------- live front props: the chat, the laptop cursor, contactless, the globe, the palm, the paper plane ---------------- */
  var PL = { start: 4, loop: -9, cyc: 15, dur: 5.2 };
  function bez(u) { var p = [[60, 150], [320, 20], [560, 250], [1050, 70]], a = Math.pow(1 - u, 3), b = 3 * u * (1 - u) * (1 - u), c = 3 * u * u * (1 - u), d = u * u * u;
    return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]]; }
  function planeAt(t) {
    var local = t - PL.start; if (local < 0) return null; var cyc = local % PL.cyc; if (cyc > PL.dur) return null;
    var u = cyc / PL.dur, p = bez(u), q = bez(Math.min(1, u + 0.01)), ang = Math.atan2(q[1] - p[1], q[0] - p[0]), lt = t - PL.loop;
    if (lt >= 0 && lt < 1.3) { var la = lt / 1.3 * Math.PI * 2; p = [p[0] + Math.sin(la) * 46, p[1] - (1 - Math.cos(la)) * 46]; ang += la; }
    return { x: p[0], y: p[1], a: ang, u: u };
  }
  function paintFrontLive(g, t, S) {
    /* a chat bubble types on the enquiry phone */
    var p = T.phone, cyc = t % 6;
    g.save(); g.translate(p.x + 21, p.y + 34); g.rotate(-0.06);
    if (cyc < 3) { fillRR(g, -12, 9, 22, 9, 4, '#EEF2F8'); for (var i = 0; i < 3; i++) fillE(g, -6 + i * 5, 13.5, 1.5, 1.5 + (Math.floor(t * 4) % 3 === i ? 0.8 : 0), '#7B8DB0'); }
    else { fillRR(g, -12, 9, 22, 9, 4, '#21B799'); }
    g.restore();
    /* the laptop's cursor */
    if (Math.floor(t * 2) % 2) { g.fillStyle = '#3167CA'; g.fillRect(T.laptop.x + 54, T.laptop.y + 39, 1.6, 6); }
    /* contactless waves on the terminal */
    var tm = T.term, wv = (t % 1.6) / 1.6, act = S.hot === 'deposit' ? 1 : 0.5;
    g.strokeStyle = 'rgba(49,103,202,' + ((1 - wv) * act).toFixed(2) + ')'; g.lineWidth = 2; g.lineCap = 'round';
    for (var r2 = 0; r2 < 2; r2++) { g.beginPath(); g.arc(tm.x + 30, tm.y - 14, 6 + r2 * 6 + wv * 6, -2.4, -0.74); g.stroke(); }
    /* the globe spins (much faster for a moment after a tap) */
    var gb = T.globe, boost = S.toy.globe != null ? Math.max(0, 1 - (t - S.toy.globe) / 2.4) : 0, ang = t * 0.5 + (S.toy.globe != null ? (1 - Math.pow(1 - Math.min(1, (t - S.toy.globe) / 2.4), 3)) * 9 : 0);
    g.save(); g.beginPath(); g.arc(gb.x, gb.y, gb.r, 0, Math.PI * 2); g.clip();
    var og = g.createRadialGradient(gb.x - 8, gb.y - 9, 4, gb.x, gb.y, gb.r); og.addColorStop(0, '#8FD3FF'); og.addColorStop(1, '#3FA9E0'); g.fillStyle = og; g.fillRect(gb.x - gb.r, gb.y - gb.r, gb.r * 2, gb.r * 2);
    for (var c = 0; c < 4; c++) { var lx = gb.x + (((c * 0.9 + ang) % 3.6) / 3.6 * 2 - 1) * (gb.r + 14); fillE(g, lx, gb.y - 6 + (c % 2) * 12, 9 - (c % 3), 6 + (c % 2) * 3, c % 2 ? '#7DCB8E' : '#F4E2B8'); }
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(gb.x - 9, gb.y - 10, 8, 0, 7); g.fill();
    g.restore();
    g.strokeStyle = '#E9C46A'; g.lineWidth = 3; g.beginPath(); g.arc(gb.x, gb.y, gb.r + 5, -2.2, 0.9); g.stroke();
    if (boost > 0) { g.strokeStyle = 'rgba(255,255,255,' + boost.toFixed(2) + ')'; g.lineWidth = 2; for (var s2 = 0; s2 < 3; s2++) { g.beginPath(); g.arc(gb.x, gb.y, gb.r + 10 + s2 * 6, -0.6 + s2 * 0.3, 0.2 + s2 * 0.3); g.stroke(); } }
    /* a potted palm, swaying */
    var pl = T.palm, sw = Math.sin(t * 0.9) * 0.05;
    g.strokeStyle = '#B98A55'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(pl.x, pl.y - 50); g.quadraticCurveTo(pl.x - 6, pl.y - 120, pl.x + 4 + sw * 40, pl.y - 196); g.stroke();
    for (var fr = 0; fr < 7; fr++) {
      var a3 = -Math.PI / 2 + (fr - 3) * 0.52 + sw * (fr % 2 ? 1.4 : -1), len = 72 + (fr % 3) * 14;
      g.save(); g.translate(pl.x + 4 + sw * 40, pl.y - 196); g.rotate(a3);
      g.fillStyle = fr % 2 ? '#3FBF7F' : '#33A86C'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.5, -18, len, 8); g.quadraticCurveTo(len * 0.5, 9, 0, 0); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(4, 0); g.quadraticCurveTo(len * 0.5, -6, len - 6, 7); g.stroke(); g.restore();
    }
    fillRR(g, pl.x - 28, pl.y - 54, 56, 54, 10, '#F2C14E'); fillRR(g, pl.x - 32, pl.y - 58, 64, 12, 6, '#F6D27A'); g.fillStyle = 'rgba(120,80,0,.10)'; g.fillRect(pl.x + 8, pl.y - 46, 18, 44);
    /* the TechNext paper plane glides through, with a dotted trail */
    var pp = planeAt(t);
    if (pp) {
      g.strokeStyle = 'rgba(49,103,202,.35)'; g.lineWidth = 2; g.setLineDash([4, 6]); g.beginPath();
      for (var tr = 0; tr <= 12; tr++) { var tt = Math.max(0, pp.u - 0.15 + tr * 0.0125), bp = bez(tt); if (tr === 0) g.moveTo(bp[0], bp[1]); else g.lineTo(bp[0], bp[1]); } g.stroke(); g.setLineDash([]);
      g.save(); g.translate(pp.x, pp.y); g.rotate(pp.a * 0.35);
      if (LOGO.complete && LOGO.naturalWidth) g.drawImage(LOGO, -24, -20, 48, 41); else planeIcon(g, 0, 0, 2, '#3167CA');
      g.restore();
    }
  }

  var LINA = { x: 548, y: 440, s: 0.62, ph: 0.4, c: { skin: '#F3CDA8', hair: '#3A2620', top: '#2A4D8F', shirt: '#FFFFFF', pocket: '#FFD84A' }, outfit: 'blazer', scarf: '#FFC94A', hairStyle: 'long', clipCol: null, feet: false, mood: 'calm', look: 0, talk: false, hands: [[-62, -186], [62, -186]] };
  var SAM = { x: 812, y: 480, s: 0.64, ph: 1.2, c: { skin: '#C68B5E', hair: '#1F1A1A', top: '#FF8A65', print: '#FFFFFF', low: '#4A6FA5', shoe: '#F7F8FB', hat: '#F2D59B', hatBand: '#3FA9E0' }, outfit: 'tee', hat: 'sunhat', backpack: '#21B799', hold: 'passport', hairStyle: 'short', short: true, feet: true, mood: 'calm', look: 0, talk: false, hands: [[-64, -206], [96, -150]] };

  window.IXW.worlds.travel = {
    room: { wall: ['#EEF6FF', '#E1EEFC'], wains: ['#F6EAD7', '#EEDDC2'], rail: '#FFFFFF', base: '#E2CBA6', panelLine: 'rgba(120,90,40,.08)', floor: ['#F1DFC5', '#E2C7A3'], floorKind: 'planks', floorLine: 'rgba(140,100,50,.16)', pattern: arcs },
    paintBack: paintBack, paintFront: paintFront, paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    moteCol: 'rgba(255,255,255,.75)',
    glow: {
      enquire: function (g) { rr(g, T.phone.x - 4, T.phone.y - 4, 50, 80, 12); },
      quote: function (g) { rr(g, T.laptop.x - 8, T.laptop.y - 8, 102, 74, 12); },
      deposit: function (g) { rr(g, T.term.x - 6, T.term.y - 18, 82, 76, 12); },
      book: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 22, r.w + 16, r.h + 26, 16); },
      pay: function (g) { var f = T.fx; rr(g, f.x - 8, f.y - 8, f.w + 16, f.h + 16, 16); },
      review: function (g) { var m = T.map; rr(g, m.x - 8, m.y - 8, m.w + 16, m.h + 24, 16); }
    },
    backGlow: ['book', 'pay', 'review'],
    cast: [
      { id: 'lina', behind: true, keys: ['enquire', 'quote', 'pay'], P: LINA, act: function (P, t, S) {
        var st = S.cast.lina, busy = S.hot === 'enquire' || S.hot === 'quote' || S.hot === 'pay';
        P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var tap = busy ? Math.abs(Math.sin(t * 9)) * 7 : 0;
        P.hands = t < st.wave ? [[-62, -186], [128 + Math.sin(t * 12) * 16, -404]] : [[-62, -186 + tap], [62, -186 + (busy ? Math.abs(Math.cos(t * 9)) * 7 : 0)]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } },
      { id: 'sam', keys: ['deposit', 'book'], P: SAM, act: function (P, t, S) {
        var st = S.cast.sam, on = S.hot === 'deposit' || S.hot === 'book', waving = t < st.wave;
        P.talk = t < st.until; P.mood = P.talk || on ? 'happy' : S.toy.plane != null && t - S.toy.plane < 1.6 ? 'wow' : 'calm';
        P.hop = waving ? Math.abs(Math.sin(t * 7)) * 14 : 0;
        P.hands = waving ? [[-64, -206], [118 + Math.sin(t * 12) * 16, -420]] : S.hot === 'book' ? [[-64, -206], [172, -300]] : [[-64, -206], [96, -150]];
        P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08);
      } }
    ],
    /* tap the paper plane while it flies: it loops; returns what Nexi says */
    hit: function (x, y, S, t) {
      var pp = planeAt(t); if (!pp || Math.hypot(x - pp.x, y - pp.y) > 46) return null;
      PL.loop = t; S.toy.plane = t;
      return { say: 'Whoosh! That paper plane is the **TechNext** logo. Loop-the-loop!', near: [Math.round(clamp(pp.x, 280, 720)), Math.round(clamp(pp.y + 120, 160, 330))], pose: 'celebrate' };
    }
  };
})(window.IXW && window.IXW.kit);
