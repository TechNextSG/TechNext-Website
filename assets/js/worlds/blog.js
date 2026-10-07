/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: blog (/blog) — the TechNext newsroom, on air with Odoo 20. A bright studio: the video wall runs the Odoo 20 headlines
   (from the blog's own "Odoo 20 new features" article) with a news ticker of the latest articles under it; the anchor sits at
   a glass news desk; a writer drafts the next guide at an open desk; a map screen of Singapore, the Philippines and Vietnam;
   the events calendar; the bookshelf of ERP guides; a studio camera with its ON AIR light. Everyone wears a TechNext ID,
   semi-casual; whoever sits shows chair, legs and feet. Tap anyone, the camera, the ON AIR sign or the coffee mug. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, RED = '#E2453C', PUR = '#714B67';
  var NEWS = [['AI agents', 'that do the work'], ['MCP', 'connect your own AI tools'], ['Offline mode', 'and a better phone app'], ['Field Service', 'moves into Planning'], ['Accounting', 'pay bills from Odoo'], ['Payroll · Inventory', 'manufacturing updates']];
  var TICK = 'ODOO 20: NEW FEATURES IN PLAIN LANGUAGE  ·  ODOO 20 IN SINGAPORE, THE PHILIPPINES AND VIETNAM  ·  ODOO EXPERIENCE 2026: FIVE TAKEAWAYS  ·  ODOO EVENTS OCT–NOV 2026  ·  INVOICENOW IN SINGAPORE: ALL DATES TO 2031  ·  ';
  var T = { wall: { x: 300, y: -70, w: 600, h: 300 }, desk: { x: 400, y: 386, w: 250 }, write: { x: 110, y: 402, w: 170 }, map: { x: 120, y: 40, w: 160, h: 108 }, cal: { x: 140, y: 182, w: 120, h: 112 },
    shelf: { x: 960, y: 180, w: 150 }, cam: { x: 790, y: 300 }, onair: { x: 160, y: -112 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* a bright studio: the ceiling stays light (the site header sits over it), pale walls with a soft grid, two colour pools */
    var hg = g.createLinearGradient(0, e.t, 0, F); hg.addColorStop(0, '#EEF1F8'); hg.addColorStop(0.17, '#F4F7FC'); hg.addColorStop(1, '#E2E9F4'); g.fillStyle = hg; g.fillRect(e.l, e.t, e.r - e.l, F - e.t);
    g.strokeStyle = 'rgba(49,103,202,.07)'; g.lineWidth = 1.5; g.beginPath(); for (var x = Math.floor(e.l / 60) * 60; x < e.r; x += 60) { g.moveTo(x, CEIL); g.lineTo(x, F); } for (var y = CEIL; y < F; y += 60) { g.moveTo(e.l, y); g.lineTo(e.r, y); } g.stroke();
    [[600, 120, 'rgba(49,103,202,.16)'], [160, 240, 'rgba(226,69,60,.08)'], [1040, 220, 'rgba(255,216,74,.14)']].forEach(function (p) { var rg = g.createRadialGradient(p[0], p[1], 10, p[0], p[1], 420); rg.addColorStop(0, p[2]); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL); });
    /* the floor: a glossy light studio floor with a blue light strip */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E9EEF6'); fl.addColorStop(1, '#D6DEEA'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(49,103,202,.55)'; g.fillRect(e.l, F + 4, e.r - e.l, 3); g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.ellipse(520, F + 60, 360, 40, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the lighting grid and its fresnels */
    g.fillStyle = '#9AA6BC'; g.fillRect(e.l, -136, e.r - e.l, 6);
    for (var lx = Math.floor(e.l / 180) * 180; lx < e.r; lx += 180) { fillRR(g, lx + 70, -130, 30, 26, 6, '#2A3142'); fillE(g, lx + 85, -104, 11, 5, '#FFF2C8');
      var lg = g.createLinearGradient(0, -104, 0, 300); lg.addColorStop(0, 'rgba(255,236,180,.3)'); lg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(lx + 78, -104); g.lineTo(lx + 92, -104); g.lineTo(lx + 150, 300); g.lineTo(lx + 20, 300); g.closePath(); g.fill(); }
    /* the video wall's frame */
    var w = T.wall; shadowed(g, 30, 10, 0.25, function () { fillRR(g, w.x - 10, w.y - 10, w.w + 20, w.h + 20, 10, '#2A3142'); });
    g.restore();
  }
  function paintBack(g, ext) {
    var w = T.wall;
    /* the ON AIR sign's box */
    fillRR(g, T.onair.x - 4, T.onair.y - 4, 128, 42, 10, '#2A3142');
    /* the map screen: the three markets */
    var m = T.map; fillRR(g, m.x - 5, m.y - 5, m.w + 10, m.h + 10, 7, '#2A3142'); fillRR(g, m.x, m.y, m.w, m.h, 3, '#16224A');
    g.fillStyle = '#2B3D7A'; [[28, 44, 30, 18], [70, 30, 46, 40], [44, 70, 30, 22], [112, 56, 26, 30]].forEach(function (b) { g.beginPath(); g.ellipse(m.x + b[0], m.y + b[1], b[2] / 2, b[3] / 2, 0.3, 0, Math.PI * 2); g.fill(); });
    text(g, 'WE WRITE FOR', m.x + 8, m.y + 14, 6.4, 800, '#9FC4FF');
    /* the events calendar */
    var c = T.cal; shadowed(g, 8, 3, 0.3, function () { fillRR(g, c.x, c.y, c.w, c.h, 6, '#FFFFFF'); }); fillRR(g, c.x, c.y, c.w, 24, 6, RED); g.fillRect(c.x, c.y + 16, c.w, 8);
    text(g, 'OCT–NOV 2026', c.x + c.w / 2, c.y + 16, 8, 800, '#FFFFFF', 'center');
    for (var d = 0; d < 20; d++) { var dx = c.x + 10 + (d % 5) * 21, dy = c.y + 34 + Math.floor(d / 5) * 18; fillRR(g, dx, dy, 16, 13, 2, [3, 8, 14, 17].indexOf(d) >= 0 ? '#FFE0DE' : '#F1F4F9'); if ([3, 8, 14, 17].indexOf(d) >= 0) fillE(g, dx + 8, dy + 6.5, 3, 3, RED); }
    text(g, 'Odoo events · SG PH VN', c.x + c.w / 2, c.y + c.h - 6, 6.4, 800, C.ink, 'center');
    /* the bookshelf of ERP guides */
    var s = T.shelf; soft(g, s.x + s.w / 2, F + 4, 90, 8, 0.3); fillRR(g, s.x, s.y, s.w, F - s.y, 6, '#3A2F4F'); fillRR(g, s.x + 6, s.y + 6, s.w - 12, F - s.y - 12, 3, '#4A3D62');
    for (var r = 0; r < 4; r++) { var ry = s.y + 60 + r * 66; fillRR(g, s.x + 6, ry, s.w - 12, 6, 2, '#2A2240');
      for (var b = 0; b < 8; b++) { var bh = 34 + hash(b + r * 9) * 18; fillRR(g, s.x + 12 + b * 16, ry - bh, 13, bh, 2, ['#3167CA', '#14A38B', '#F08A24', PUR, '#FFD84A', '#E0456B'][(b + r) % 6]); } }
    fillRR(g, s.x + 10, s.y - 26, s.w - 20, 22, 6, '#FFD84A'); text(g, 'ERP ESSENTIALS', s.x + s.w / 2, s.y - 11, 8, 800, C.ink, 'center');
    /* the studio camera on its tripod */
    var cm = T.cam; soft(g, cm.x + 40, F + 4, 70, 8, 0.35); g.strokeStyle = '#5C6B7A'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(cm.x + 40, cm.y + 60); g.lineTo(cm.x + 6, F); g.moveTo(cm.x + 40, cm.y + 60); g.lineTo(cm.x + 74, F); g.moveTo(cm.x + 40, cm.y + 60); g.lineTo(cm.x + 40, F); g.stroke();
    fillRR(g, cm.x, cm.y, 92, 54, 8, '#2A3142'); fillRR(g, cm.x + 92, cm.y + 12, 26, 30, 6, '#1B1F3B'); fillE(g, cm.x + 120, cm.y + 27, 12, 14, '#0B0F24'); fillE(g, cm.x + 120, cm.y + 27, 7, 8, '#3A5A9A');
    fillRR(g, cm.x + 8, cm.y + 8, 40, 26, 3, '#3A4458'); text(g, 'TN-CAM 1', cm.x + 46, cm.y + 48, 6.4, 800, '#AFC0DD', 'center');
    K.plant(g, { x: -40, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    /* the writer's open desk with a laptop */
    var wd = T.write; CO.desk(g, wd.x, wd.y, wd.w, F, { open: true, legs: '#7A869C', top: '#C9A27A' });
    fillRR(g, wd.x + 60, wd.y - 36, 60, 36, 4, '#2A3550'); fillRR(g, wd.x + 52, wd.y - 4, 76, 6, 3, '#9AA6BC');
    fillRR(g, wd.x + 18, wd.y - 18, 16, 18, 4, '#FFFFFF'); fillRR(g, wd.x + 18, wd.y - 18, 16, 5, 2, '#3167CA');
    /* the glass news desk: a light top, a tinted glass front (legs show through), the TechNext logo */
    var d = T.desk; soft(g, d.x + d.w / 2, F + 4, d.w * 0.6, 10, 0.4);
    g.fillStyle = 'rgba(160,200,255,.18)'; g.beginPath(); g.moveTo(d.x - 10, d.y + 10); g.lineTo(d.x + d.w + 10, d.y + 10); g.lineTo(d.x + d.w - 20, F); g.lineTo(d.x + 20, F); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(160,200,255,.6)'; g.lineWidth = 2; g.stroke();
    fillRR(g, d.x - 16, d.y, d.w + 32, 14, 7, '#E9EEF8'); fillRR(g, d.x - 16, d.y + 10, d.w + 32, 4, 2, '#3167CA');
    fillRR(g, d.x + d.w / 2 - 60, d.y + 30, 120, 26, 6, 'rgba(49,103,202,.85)'); CO.plane(g, d.x + d.w / 2 - 40, d.y + 43, 0.9, 0, '#FFFFFF', '#3167CA'); text(g, 'TechNext News', d.x + d.w / 2 + 6, d.y + 47, 9.5, 800, '#FFFFFF', 'center');
    fillRR(g, d.x + 30, d.y - 6, 44, 6, 2, '#FFFFFF'); fillRR(g, d.x + d.w - 70, d.y - 14, 13, 14, 4, '#FFFFFF');
  }

  var W = CR.who;
  var ANC = W({ x: 524, y: 470, s: 0.54, ph: 0.6, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: '#1E3A6E', top2: '#DCE7FB', sit: true, chairCol: '#0B0F24', hands: [[-80, -190], [80, -190]] });
  var WRT = W({ x: 196, y: 470, s: 0.5, ph: 1.4, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#14A38B', glasses: true, sit: true, chairCol: '#2A3550', hands: [[-60, -200], [60, -200]], look: 0.3 });
  var CAMOP = W({ x: 742, y: 470, s: 0.52, ph: 2.1, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#F08A24', headset: '#3167CA', hands: [[-70, -160], [110, -260]], look: 0.7 });
  var CREW = [
    { x0: 980, x1: 1340, y: 488, spd: 14, ph: 0.4, label: 'Editor', lines: ['Plain language first. **No jargon** gets past me.', 'Next up: what Odoo 20 means for **month-end**.'], acts: ['nod', 'id', 'think'],
      P: W({ s: 0.5, skin: 0, hair: 2, style: 'long', outfit: 'shirt', top: '#E0456B', hold: 'clipboard' }) },
    { front: true, x0: -420, x1: 80, y: 690, spd: 18, ph: 0.6, label: 'Reporter', lines: ['Live from **Odoo Experience 2026**, five takeaways!', 'Reporting for Singapore, the Philippines and Vietnam.'], acts: ['cheer', 'wave', 'id'],
      P: W({ s: 0.58, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#3167CA', hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var AIR = { t: -9 }, SHOT = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    var w = T.wall, on = S.hot === 'o20';
    /* the video wall: ODOO 20 headline, six feature tiles that light in turn, the BREAKING banner */
    var vg = g.createLinearGradient(w.x, w.y, w.x + w.w, w.y + w.h); vg.addColorStop(0, '#1D2A6B'); vg.addColorStop(1, '#4A2E6E'); g.fillStyle = vg; g.fillRect(w.x, w.y, w.w, w.h);
    for (var gx = 0; gx < 6; gx++) { g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(w.x + gx * 100, w.y, 1, w.h); }
    fillRR(g, w.x + 16, w.y + 14, 118, 26, 4, RED); text(g, 'BREAKING', w.x + 75, w.y + 32, 12, 800, '#FFFFFF', 'center');
    var pulse = 0.5 + 0.5 * Math.sin(t * 4); fillE(g, w.x + 148, w.y + 27, 5, 5, 'rgba(255,90,80,' + (0.4 + pulse * 0.6).toFixed(2) + ')'); text(g, 'LIVE', w.x + 158, w.y + 31, 9, 800, '#FFB4AE');
    text(g, 'Odoo 20', w.x + 16, w.y + 84, 40, 800, '#FFFFFF'); g.font = '800 40px ' + K.FONT; text(g, 'is here, explained in plain language', w.x + 30 + g.measureText('Odoo 20').width, w.y + 80, 12, 700, '#C9D6EE');
    var lit = Math.floor(t * (on ? 1.6 : 0.6)) % 6;
    NEWS.forEach(function (n, i) { var tx = w.x + 16 + (i % 3) * 190, ty = w.y + 104 + Math.floor(i / 3) * 62, hi = i === lit;
      fillRR(g, tx, ty, 180, 52, 8, hi ? '#FFFFFF' : 'rgba(255,255,255,.1)'); fillRR(g, tx, ty, 6, 52, 3, ['#3167CA', '#14A38B', '#F08A24', PUR, '#FFD84A', '#E0456B'][i]);
      text(g, n[0], tx + 16, ty + 22, 12, 800, hi ? C.ink : '#FFFFFF'); text(g, n[1], tx + 16, ty + 39, 8.5, 700, hi ? '#5C5C73' : '#C9D6EE'); });
    /* the ticker under the wall */
    var tk = S.hot === 'news' ? 90 : 46, ty2 = w.y + w.h - 30; g.save(); g.beginPath(); g.rect(w.x, ty2, w.w, 30); g.clip(); g.fillStyle = '#FFD84A'; g.fillRect(w.x, ty2, w.w, 30);
    g.font = '800 11px ' + K.FONT; g.textAlign = 'left'; var tw = g.measureText(TICK).width, off = (t * tk) % tw; g.fillStyle = C.ink; g.fillText(TICK + TICK, w.x + 106 - off, ty2 + 19);
    fillRR(g, w.x, ty2, 96, 30, 0, RED); text(g, 'LATEST', w.x + 48, ty2 + 20, 11, 800, '#FFFFFF', 'center'); g.restore();
    /* the map screen: three markets light in turn */
    var m = T.map, mk = Math.floor(t * (S.hot === 'markets' ? 2 : 0.7)) % 3;
    [['SG', 64, 82, '#3167CA'], ['PH', 120, 52, '#14A38B'], ['VN', 72, 46, '#F08A24']].forEach(function (p, i) { var hi = i === mk, x = m.x + p[1], y = m.y + p[2];
      if (hi) { g.globalAlpha = 0.35; fillE(g, x, y, 16, 16, p[3]); g.globalAlpha = 1; } fillE(g, x, y, 6, 6, p[3]); text(g, p[0], x + 10, y + 4, 8, 800, '#FFFFFF'); });
    /* ON AIR: lit; tapped, it flashes */
    var oa = T.onair, at = t - AIR.t, lit2 = at < 1.6 ? (Math.floor(at * 8) % 2 === 0) : true; fillRR(g, oa.x, oa.y, 120, 34, 7, lit2 ? RED : '#5A1E1B'); text(g, 'ON AIR', oa.x + 60, oa.y + 23, 15, 800, lit2 ? '#FFFFFF' : '#C98A85', 'center');
    if (lit2) { g.save(); g.globalAlpha = 0.12; fillE(g, oa.x + 60, oa.y + 17, 74, 26, RED); g.restore(); }
    /* the camera's tally light; tapped, a flash */
    var cm = T.cam, sh = t - SHOT.t; fillE(g, cm.x + 80, cm.y + 8, 4, 4, Math.floor(t * 2) % 2 ? RED : '#7A2C27'); fillRR(g, cm.x + 10, cm.y + 10, 36, 22, 2, '#1D2A6B'); fillRR(g, cm.x + 14, cm.y + 14, 28 * ((t * 0.3) % 1), 3, 1.5, '#9FC4FF');
    if (sh < 0.5) { g.save(); g.globalAlpha = 1 - sh * 2; fillE(g, cm.x + 120, cm.y + 27, 60, 60, 'rgba(255,255,255,.8)'); g.restore(); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the writer's laptop: the article grows */
    var wd = T.write, n = Math.floor((t * (S.hot === 'guides' ? 3 : 1)) % 6); fillRR(g, wd.x + 64, wd.y - 32, 52, 28, 2, '#FFFFFF');
    for (var l = 0; l <= n && l < 5; l++) fillRR(g, wd.x + 68, wd.y - 28 + l * 5, l === n ? 20 : 40, 2.6, 1.3, l === 0 ? '#3167CA' : '#C9D3E3');
    CR.draw(g, t);
  }

  window.IXW.worlds.blog = {
    pan: [-300, 1080],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(49,103,202,.25)',
    glow: {
      o20: function (g) { var w = T.wall; rr(g, w.x - 14, w.y - 14, w.w + 28, w.h - 16, 12); },
      news: function (g) { var w = T.wall; rr(g, w.x - 8, w.y + w.h - 38, w.w + 16, 46, 10); },
      guides: function (g) { var d = T.write; rr(g, d.x + 40, d.y - 50, 100, 60, 10); },
      erp: function (g) { var s = T.shelf; rr(g, s.x - 8, s.y - 34, s.w + 16, F - s.y + 38, 12); },
      markets: function (g) { var m = T.map; rr(g, m.x - 12, m.y - 12, m.w + 24, m.h + 24, 10); },
      events: function (g) { var c = T.cal; rr(g, c.x - 8, c.y - 8, c.w + 16, c.h + 16, 10); },
      onair: function (g) { var o = T.onair; rr(g, o.x - 8, o.y - 8, 136, 50, 12); },
      camera: function (g) { var c = T.cam; rr(g, c.x - 8, c.y - 8, 144, 72, 12); }
    },
    backGlow: ['o20', 'news', 'erp', 'markets', 'events', 'onair', 'camera'],
    cast: [
      { id: 'anc', behind: true, keys: ['o20', 'news'], P: ANC, act: function (P, t, S) { var st = S.cast.anc, busy = S.hot === 'o20' || S.hot === 'news'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-80, -190], [110 + Math.sin(t * 3) * 10, -250]] : [[-80, -190], [80, -190]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'cheer', 'spin']); } },
      { id: 'wrt', behind: true, keys: ['guides'], P: WRT, act: function (P, t, S) { var st = S.cast.wrt, busy = S.hot === 'guides'; P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 14 : 5))) * 6; P.hands = [[-60, -200 - k2], [60, -200 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0.4, 0.08); CR.cast(P, st, t, ['type', 'think', 'id', 'wave']); } },
      { id: 'cam', behind: false, keys: [], P: CAMOP, act: function (P, t, S) { var st = S.cast.cam; P.talk = t < st.until; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-70, -160], [110, -260 + Math.sin(t * 1.5) * 4]]; P.look = lerp(P.look, 0.7, 0.08); CR.cast(P, st, t, ['wave', 'jump', 'id', 'dance']); } }
    ],
    toy: function (name, S, t) { if (name === 'onair') AIR.t = t; if (name === 'camera') { SHOT.t = t; CR.burst('star', T.cam.x + 120, T.cam.y, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
