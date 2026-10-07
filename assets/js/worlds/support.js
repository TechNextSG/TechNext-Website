/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: support (/odoo/support) — step 4 of 4: the same team, after go-live. A bright support desk: the ticket board moves
   real kinds of request across Triage, Fix and Done (a bank feed sync fix, the month-end close, a version upgrade, a PO
   approval change); the upgrade screen runs Odoo 19 to Odoo 20; the month-end calendar; the single tracked channel with its
   response target; two of the people who configured the system sit at the desk with headsets (chairs, legs and feet) and a
   lead stands by the board. Everyone wears a TechNext ID. Tap anyone, a ticket kind, the screens or the lifebuoy. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, OR = '#F08A24', NAVY = '#1B2350', PUR = '#714B67';
  var BD = { x: 300, y: -100, w: 410, h: 250 }, T = { up: { x: 744, y: -96, w: 190, h: 100 }, ch: { x: 744, y: 24, w: 190, h: 100 }, cal: { x: 966, y: -84, w: 120, h: 120 },
    desk: { x: 400, y: 392, w: 370 }, ring: { x: 200, y: 30 } };
  var TK = [{ key: 'fix', name: 'Bank feed sync', kind: 'Fix', col: '#E2453C' }, { key: 'monthend', name: 'Month-end close', kind: 'Month-end', col: '#3167CA' },
    { key: 'upgrade', name: 'Version upgrade', kind: 'Upgrade', col: PUR }, { key: 'change', name: 'PO approval step', kind: 'Change', col: '#14A38B' }];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#FDF9F4'); wg.addColorStop(1, '#F5EEE5'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = '#EFE5D8'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#E4D6C4'; g.fillRect(e.l, 246, e.r - e.l, 5);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 220, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 300); }
    CO.ceiling(g, e, CEIL, '#F4EFE8', '#FCFAF7', '#FFFFFF');
    CO.floor(g, e, F, '#E6E9EE', '#D3D8E0', 'rgba(40,60,90,.08)');
    g.restore();
  }
  function paintFrame(g) {}
  function paintBack(g, ext) {
    /* the ticket board */
    shadowed(g, 14, 5, 0.14, function () { fillRR(g, BD.x, BD.y, BD.w, BD.h, 12, '#FFFFFF'); }); fillRR(g, BD.x, BD.y, BD.w, 26, 12, NAVY); g.fillRect(BD.x, BD.y + 16, BD.w, 10);
    text(g, 'SUPPORT · ONE TRACKED CHANNEL', BD.x + 14, BD.y + 17, 8.5, 800, '#FFFFFF');
    ['Triage', 'Fix', 'Done'].forEach(function (c, i) { var cx = BD.x + 10 + i * 133; fillRR(g, cx, BD.y + 34, 125, BD.h - 44, 8, '#F6F7FA'); text(g, c, cx + 10, BD.y + 52, 9, 800, ['#B7791F', '#E2453C', '#1E9E6A'][i]); });
    /* the upgrade screen and the channel screen */
    [T.up, T.ch].forEach(function (s) { shadowed(g, 12, 4, 0.2, function () { fillRR(g, s.x - 5, s.y - 5, s.w + 10, s.h + 10, 7, '#2A3142'); }); fillRR(g, s.x, s.y, s.w, s.h, 3, '#FFFFFF'); });
    /* the month-end calendar */
    var c = T.cal; shadowed(g, 8, 3, 0.16, function () { fillRR(g, c.x, c.y, c.w, c.h, 6, '#FFFFFF'); }); fillRR(g, c.x, c.y, c.w, 22, 6, OR); g.fillRect(c.x, c.y + 14, c.w, 8); text(g, 'THIS MONTH', c.x + c.w / 2, c.y + 15, 7.6, 800, '#FFFFFF', 'center');
    /* the lifebuoy hook */
    fillE(g, T.ring.x, T.ring.y - 46, 4, 4, '#9AA6BC');
    K.plant(g, { x: 1140, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    [[490, 'Your consultant'], [660, 'Your developer']].forEach(function (p) { var mx = p[0] - 100; fillRR(g, mx + 30, d.y - 70, 70, 50, 4, '#2A3142'); fillRR(g, mx + 34, d.y - 66, 62, 42, 2, '#FFFFFF'); fillRR(g, mx + 60, d.y - 20, 10, 20, 2, '#5C6B7A');
      for (var l = 0; l < 4; l++) fillRR(g, mx + 38, d.y - 60 + l * 9, l === 0 ? 30 : 48, 3, 1.5, l === 0 ? OR : '#D5DCE6');
      fillRR(g, p[0] - 4, d.y + 14, 92, 18, 4, NAVY); text(g, p[1], p[0] + 42, d.y + 26, 7.4, 800, '#FFFFFF', 'center'); });
  }

  var W = CR.who;
  var AG1 = W({ x: 520, y: 470, s: 0.5, ph: 0.6, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: OR, top2: '#FFFFFF', headset: '#1B2350', sit: true, chairCol: '#2A3550', hands: [[-60, -206], [60, -206]], look: -0.5 });
  var AG2 = W({ x: 690, y: 470, s: 0.5, ph: 1.7, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#3167CA', glasses: true, headset: '#1B2350', sit: true, chairCol: '#2A3550', hands: [[-60, -206], [60, -206]], look: -0.5 });
  var LEAD = W({ x: 880, y: 470, s: 0.54, ph: 2.4, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: NAVY, hold: 'tablet', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var CREW = [
    { x0: 1180, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Month-end tomorrow. I will be **online early**.', 'Same people who set it up. No call centre.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: '#14A38B', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext developer', lines: ['Upgrade tested on a **copy** first. Then go.', 'Small changes, like a new **approval step**, in days.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var RING = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* tickets move Triage → Fix → Done; the stop's ticket runs faster and glows */
    TK.forEach(function (k, i) { var on = S.hot === k.key, cyc = on ? ((t - (S.kT || 0)) * 0.8) % 3.4 : ((t * 0.18 + i * 0.85) % 3.4), col = Math.min(2, Math.floor(cyc)), f = clamp((cyc - col) * 3 - 1.4, 0, 1);
      var x0 = BD.x + 16 + col * 133, x1 = BD.x + 16 + Math.min(2, col + 1) * 133, x = col < 2 ? lerp(x0, x1, f) : x0, y = BD.y + 62 + i * 44;
      shadowed(g, 4, 2, 0.14, function () { fillRR(g, x, y, 113, 38, 6, '#FFFFFF'); }); fillRR(g, x, y, 5, 38, 2.5, k.col);
      text(g, k.name, x + 12, y + 16, 8, 800, '#1B1F3B'); fillRR(g, x + 12, y + 22, 50, 11, 5.5, k.col); text(g, k.kind, x + 37, y + 30, 6.4, 800, '#FFFFFF', 'center');
      if (col === 2) { fillE(g, x + 100, y + 19, 7, 7, '#2BC48A'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x + 96.5, y + 19); g.lineTo(x + 99, y + 21.5); g.lineTo(x + 103.5, y + 16.5); g.stroke(); }
      if (on) { g.strokeStyle = k.col; g.lineWidth = 2.5; rr(g, x - 3, y - 3, 119, 44, 8); g.stroke(); } });
    /* the upgrade screen: Odoo 19 → Odoo 20, tested on a copy first */
    var u = T.up, up = S.hot === 'upgrade', pr = up ? clamp(((t - (S.kT || 0)) * 0.35) % 1.2, 0, 1) : (t * 0.06) % 1;
    fillRR(g, u.x, u.y, u.w, 16, 3, PUR); g.fillRect(u.x, u.y + 10, u.w, 6); text(g, 'VERSION UPGRADE · sample', u.x + 8, u.y + 11.5, 6.6, 800, '#FFFFFF');
    text(g, 'Odoo 19', u.x + 16, u.y + 46, 13, 800, '#9AA6BC'); text(g, '→', u.x + 95, u.y + 46, 14, 800, PUR, 'center'); text(g, 'Odoo 20', u.x + 116, u.y + 46, 13, 800, PUR);
    fillRR(g, u.x + 14, u.y + 60, u.w - 28, 10, 5, '#EEF2F7'); fillRR(g, u.x + 14, u.y + 60, (u.w - 28) * pr, 10, 5, PUR);
    text(g, pr < 0.5 ? 'Testing on a copy of your data' : (pr < 1 ? 'Checking your customisations' : 'Upgraded'), u.x + 14, u.y + 88, 7.4, 700, '#5C6B7A');
    /* the channel screen: one tracked channel, a response target from the plan */
    var c = T.ch, chn = S.hot === 'channel', n = 1040 + Math.floor(t / 4) % 9;
    fillRR(g, c.x, c.y, c.w, 16, 3, NAVY); g.fillRect(c.x, c.y + 10, c.w, 6); text(g, 'ONE TRACKED CHANNEL', c.x + 8, c.y + 11.5, 6.6, 800, '#FFFFFF');
    text(g, 'Ticket #' + n + ' received', c.x + 14, c.y + 38, 10, 800, '#1B1F3B'); fillRR(g, c.x + 14, c.y + 50, 120, 16, 8, chn && (t % 1) < 0.5 ? '#FFE3C2' : '#FFF4E5');
    CO.clock(g, c.x + 24, c.y + 58, 6, 8, OR); text(g, 'Response target: your plan', c.x + 34, c.y + 61, 6.6, 800, '#B7791F');
    text(g, 'Assigned to: your consultant', c.x + 14, c.y + 86, 7.4, 700, '#5C6B7A');
    /* the calendar: month-end days circled */
    var ca = T.cal, me = S.hot === 'monthend';
    for (var d = 0; d < 20; d++) { var dx = ca.x + 10 + (d % 5) * 21, dy = ca.y + 30 + Math.floor(d / 5) * 20, end = d >= 17; fillRR(g, dx, dy, 16, 15, 3, end ? (me && (t % 1) < 0.6 ? OR : '#FFE3C2') : '#F4F6FA'); }
    text(g, 'Month-end', ca.x + ca.w - 10, ca.y + ca.h - 6, 6.6, 800, OR, 'right');
    /* the lifebuoy: sways on its hook; tapped, it spins */
    var r = T.ring, rt = t - RING.t, rot = Math.sin(t * 1.1) * 0.08 + (rt < 2 ? rt * 6 * (2 - rt) : 0); g.save(); g.translate(r.x, r.y); g.rotate(rot);
    g.lineWidth = 16; for (var q = 0; q < 4; q++) { g.strokeStyle = q % 2 ? '#FFFFFF' : '#E2453C'; g.beginPath(); g.arc(0, 0, 30, q * Math.PI / 2, (q + 1) * Math.PI / 2); g.stroke(); }
    g.strokeStyle = '#C9A27A'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 39, 0, Math.PI * 2); g.stroke(); g.restore();
  }
  function paintFrontLive(g, t, S) { CO.crew(CREW, g, t, S, true); CR.draw(g, t); }

  function agent(id, keys, P, acts) { return { id: id, behind: true, keys: keys, P: P, act: function (P, t, S) { var st = S.cast[id], busy = keys.indexOf(S.hot) >= 0; P.talk = t < st.until || busy || ((t + P.ph * 3) % 7) < 1.2; P.mood = P.talk ? 'happy' : 'calm';
    var k2 = Math.abs(Math.sin(t * (busy ? 12 : 4) + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.4, 0.08); CR.cast(P, st, t, acts); } }; }
  window.IXW.worlds.support = {
    pan: [-300, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(240,138,36,.22)',
    glow: {
      fix: function (g) { rr(g, BD.x + 6, BD.y + 56, BD.w - 12, 50, 10); }, change: function (g) { rr(g, BD.x + 6, BD.y + 188, BD.w - 12, 50, 10); },
      monthend: function (g) { var c = T.cal; rr(g, c.x - 8, c.y - 8, c.w + 16, c.h + 16, 10); },
      upgrade: function (g) { var u = T.up; rr(g, u.x - 10, u.y - 10, u.w + 20, u.h + 20, 10); },
      channel: function (g) { var c = T.ch; rr(g, c.x - 10, c.y - 10, c.w + 20, c.h + 20, 10); },
      team: function (g) { var d = T.desk; rr(g, d.x + 70, d.y + 8, 290, 30, 10); },
      ring: function (g) { var r = T.ring; rr(g, r.x - 44, r.y - 44, 88, 88, 44); }
    },
    backGlow: ['fix', 'change', 'monthend', 'upgrade', 'channel', 'ring'],
    cast: [
      agent('ag1', ['fix', 'monthend', 'team'], AG1, ['wave', 'nod', 'id', 'love']),
      agent('ag2', ['change', 'team'], AG2, ['type', 'nod', 'id', 'cheer']),
      { id: 'lead', behind: false, keys: ['upgrade', 'channel'], P: LEAD, act: function (P, t, S) { var st = S.cast.lead, busy = S.hot === 'upgrade' || S.hot === 'channel'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -210], [-140, -320 + Math.sin(t * 3) * 8]] : [[-70, -210], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.6, 0.08); CR.cast(P, st, t, ['wave', 'jump', 'id', 'cheer', 'think']); } }
    ],
    toy: function (name, S, t) { if (name === 'ring') { RING.t = t; CR.burst('heart', T.ring.x, T.ring.y - 30, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
