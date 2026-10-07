/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: crm-dev (/odoo/crm-development) — a CRM shaped around how the client sells. A bright sales floor: leads arrive from
   the web, email, WhatsApp and social; each is routed to a rep and scored with stars; the pipeline wall moves deals through
   New, Qualified, Proposition and Won; a won deal becomes a quotation in Odoo Sales with nothing re-typed. Two reps sit at
   their desks (chairs, legs and feet), the sales manager stands by, and there is a deal bell to ring. The TechNext consultant
   (TechNext ID) walks past. Tap anyone, the sources, a column, the stars, the quotation or the bell. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, TEAL = '#21B799', CRMC = '#5BC4A6', PUR = '#714B67', OR = '#F08A24';
  var SRC = { x: 290, y: -104, w: 100, h: 284 }, PB = { x: 410, y: -112, w: 470, h: 292 }, QT = { x: 902, y: -70, w: 178, h: 150 }, T = { desk: { x: 400, y: 392, w: 420 }, bell: { x: 1030, y: 300 } };
  var COLS = ['New', 'Qualified', 'Proposition', 'Won'], SOURCES = [['Web', '#3167CA'], ['Email', '#E0456B'], ['WhatsApp', '#25D366'], ['Social', '#7B5CD6']];
  var DEALS = [{ name: 'Scanners for 3 outlets', src: 0, stars: 3, rep: 'SG' }, { name: 'Support renewal', src: 2, stars: 2, rep: 'PH' }, { name: 'Warehouse roll-out', src: 1, stars: 3, rep: 'SG' }];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function colX(i) { return PB.x + 10 + i * 115; }
  function star(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } g.closePath(); g.fill(); }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F4FBF8'); wg.addColorStop(1, '#E5F4EE'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = '#D9EEE6'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#C8E5DA'; g.fillRect(e.l, 246, e.r - e.l, 5);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 220, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 300); }
    CO.ceiling(g, e, CEIL, '#EEF6F3', '#F8FCFA', '#FFFFFF');
    CO.floor(g, e, F, '#E7EBF1', '#D6DDE7', 'rgba(40,70,120,.08)');
    g.restore();
  }
  function paintFrame(g) {}
  function paintBack(g, ext) {
    /* the lead sources */
    shadowed(g, 12, 4, 0.14, function () { fillRR(g, SRC.x, SRC.y, SRC.w, SRC.h, 12, '#FFFFFF'); }); text(g, 'LEADS FROM', SRC.x + SRC.w / 2, SRC.y + 20, 7.6, 800, '#8A96A8', 'center');
    /* the pipeline board */
    shadowed(g, 14, 5, 0.14, function () { fillRR(g, PB.x, PB.y, PB.w, PB.h, 12, '#FFFFFF'); }); fillRR(g, PB.x, PB.y, PB.w, 24, 12, CRMC); g.fillRect(PB.x, PB.y + 14, PB.w, 10);
    text(g, 'CRM · Pipeline', PB.x + 14, PB.y + 16, 9, 800, '#FFFFFF');
    COLS.forEach(function (c, i) { var x = colX(i); fillRR(g, x, PB.y + 32, 105, PB.h - 42, 8, i === 3 ? '#E9F8F2' : '#F6F8FA'); text(g, c, x + 10, PB.y + 50, 9, 800, i === 3 ? '#1E9E6A' : '#3D4560');
      fillRR(g, x + 10, PB.y + 56, 85, 3, 1.5, i === 3 ? '#2BC48A' : '#D5DCE6'); });
    /* the quotation screen */
    shadowed(g, 12, 4, 0.2, function () { fillRR(g, QT.x - 5, QT.y - 5, QT.w + 10, QT.h + 10, 7, '#2A3142'); }); fillRR(g, QT.x, QT.y, QT.w, QT.h, 3, '#FFFFFF');
    fillRR(g, QT.x, QT.y, QT.w, 18, 3, PUR); g.fillRect(QT.x, QT.y + 10, QT.w, 8); text(g, 'Sales · Quotation', QT.x + 10, QT.y + 13, 7.6, 800, '#FFFFFF');
    /* the bell's stand */
    var b = T.bell; soft(g, b.x, F + 4, 30, 6, 0.3); fillRR(g, b.x - 4, b.y + 20, 8, F - b.y - 24, 3, '#9AA6BC'); fillRR(g, b.x - 22, F - 8, 44, 8, 4, '#7A869C');
    K.plant(g, { x: 1170, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    [500, 636].forEach(function (mx) { fillRR(g, mx - 4, d.y - 74, 108, 64, 6, '#2A3142'); fillRR(g, mx + 46, d.y - 10, 10, 10, 2, '#5C6B7A'); fillRR(g, mx + 30, d.y - 3, 42, 4, 2, '#5C6B7A'); });
  }

  var W = CR.who;
  var REP1 = W({ x: 452, y: 470, s: 0.5, ph: 0.6, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: TEAL, top2: '#FFFFFF', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: 0.4 });
  var REP2 = W({ x: 780, y: 470, s: 0.5, ph: 1.8, skin: 2, hair: 1, style: 'short', outfit: 'shirt', top: OR, headset: '#1B2350', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]], look: -0.4 });
  var MGR = W({ x: 920, y: 470, s: 0.54, ph: 2.6, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: '#1E3A6E', id: '#9AA6BC', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var CREW = [
    { x0: 1200, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Your stages, **your** words. Not ours.', 'Won here, quotation there. **No re-typing**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext developer', lines: ['Routing rules: the right lead to the **right rep**.', 'Scoring tuned to how **your** deals close.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var BELL = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the sources: each lights as a lead arrives; on their stop they pulse in turn */
    var lit = Math.floor(t * (S.hot === 'sources' ? 2 : 0.6)) % 4;
    SOURCES.forEach(function (s, i) { var y = SRC.y + 32 + i * 62, on = i === lit; fillRR(g, SRC.x + 14, y, 72, 50, 10, on ? s[1] : '#F4F6FA'); text(g, s[0], SRC.x + 50, y + 42, 7.6, 800, on ? '#FFFFFF' : '#5C6B7A', 'center');
      var cx = SRC.x + 50, cy = y + 20; g.fillStyle = on ? '#FFFFFF' : s[1];
      if (i === 0) { g.beginPath(); g.arc(cx, cy, 9, 0, 7); g.fill(); g.fillStyle = on ? s[1] : '#F4F6FA'; g.fillRect(cx - 9, cy - 1, 18, 2); g.fillRect(cx - 1, cy - 9, 2, 18); }
      else if (i === 1) { fillRR(g, cx - 10, cy - 7, 20, 14, 2, on ? '#FFFFFF' : s[1]); }
      else if (i === 2) { g.beginPath(); g.arc(cx, cy, 9, 0, 7); g.fill(); g.beginPath(); g.moveTo(cx - 8, cy + 5); g.lineTo(cx - 10, cy + 10); g.lineTo(cx - 3, cy + 8); g.fill(); }
      else { [-6, 0, 6].forEach(function (dx, j) { g.beginPath(); g.arc(cx + dx, cy + (j === 1 ? -4 : 2), 4, 0, 7); g.fill(); }); } });
    /* the deals: each moves New → Qualified → Proposition → Won; routed to a rep, scored with stars */
    DEALS.forEach(function (D, i) { var on = S.hot === 'stages', ph = on ? ((t - (S.kT || 0)) * 0.7 + i * 0.6) % 4.6 : ((t * 0.16 + i * 1.3) % 4.6), col = Math.min(3, Math.floor(ph)), f = clamp((ph - col) * 3 - 1.8, 0, 1);
      var x = col < 3 ? lerp(colX(col), colX(col + 1), f) + 8 : colX(3) + 8, y = PB.y + 68 + i * 66, won = col === 3;
      shadowed(g, 4, 2, 0.12, function () { fillRR(g, x, y, 90, 56, 7, '#FFFFFF'); }); fillRR(g, x, y, 4, 56, 2, SOURCES[D.src][1]);
      var words = D.name.split(' '), l1 = '', l2 = ''; words.forEach(function (w) { if ((l1 + w).length < 14 && !l2) l1 += w + ' '; else l2 += w + ' '; });
      text(g, l1, x + 10, y + 15, 7.2, 800, '#1B1F3B'); text(g, l2, x + 10, y + 25, 7.2, 800, '#1B1F3B');
      var sc = S.hot === 'scoring'; for (var k = 0; k < 3; k++) star(g, x + 14 + k * 11, y + 38, sc && (t * 3 + k) % 3 < 1 ? 5.4 : 4.4, k < D.stars ? '#F2B233' : '#E3E8EF');
      var rt = S.hot === 'routing'; fillRR(g, x + 56, y + 32, 28, 14, 7, rt && (t % 1) < 0.5 ? OR : '#EEF2F7'); text(g, D.rep, x + 70, y + 42, 6.6, 800, rt && (t % 1) < 0.5 ? '#FFFFFF' : '#5C6B7A', 'center');
      if (won) { fillE(g, x + 82, y + 10, 6, 6, '#2BC48A'); } });
    if (S.hot === 'routing') { var p = (t * 0.8) % 1; g.strokeStyle = 'rgba(240,138,36,.6)'; g.lineWidth = 2.5; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(SRC.x + SRC.w, SRC.y + 120); g.lineTo(colX(0), PB.y + 90); g.stroke(); g.setLineDash([]);
      fillE(g, lerp(SRC.x + SRC.w, colX(0), p), lerp(SRC.y + 120, PB.y + 90, p), 4, 4, OR); }
    /* the quotation: a won deal becomes a quotation, nothing re-typed */
    var qo = S.hot === 'quote' || S.hot === 'won', qa = qo ? clamp((t - (S.kT || 0)) * 1.5, 0, 1) : 0.5 + 0.5 * Math.sin(t * 0.8);
    text(g, 'Quotation created', QT.x + 12, QT.y + 40, 10, 800, '#1B1F3B'); text(g, 'from the won deal · nothing re-typed', QT.x + 12, QT.y + 54, 6.6, 700, '#8A96A8');
    ['Scanners × 3', 'Set-up service', 'Support, 12 months'].forEach(function (l, i) { var y = QT.y + 66 + i * 18; fillRR(g, QT.x + 12, y, QT.w - 24, 14, 4, '#F6F8FA'); text(g, l, QT.x + 18, y + 10, 6.8, 700, '#3D4560');
      if (qa > i / 3) fillE(g, QT.x + QT.w - 20, y + 7, 3.4, 3.4, '#2BC48A'); });
    fillRR(g, QT.x + 12, QT.y + QT.h - 22, 62, 16, 8, PUR); text(g, 'Send', QT.x + 43, QT.y + QT.h - 11, 7, 800, '#FFFFFF', 'center');
    /* the bell: swings when a deal is won (or tapped) */
    var b = T.bell, bt = t - BELL.t, sw = bt < 2 ? Math.sin(bt * 18) * 0.5 * (2 - bt) / 2 : Math.sin(t * 0.8) * 0.03; g.save(); g.translate(b.x, b.y - 10); g.rotate(sw);
    g.fillStyle = '#E9B949'; g.beginPath(); g.moveTo(-18, 26); g.quadraticCurveTo(-16, -6, 0, -10); g.quadraticCurveTo(16, -6, 18, 26); g.closePath(); g.fill(); fillRR(g, -21, 24, 42, 6, 3, '#C9962E'); fillE(g, 0, -12, 4, 4, '#C9962E'); fillE(g, 0, 32, 4, 4, '#8A6A1E'); g.restore();
    if (bt < 1.5) { g.strokeStyle = 'rgba(233,185,73,' + (1 - bt / 1.5).toFixed(2) + ')'; g.lineWidth = 2; for (var r2 = 0; r2 < 2; r2++) { g.beginPath(); g.arc(b.x, b.y, 30 + bt * 30 + r2 * 12, -2.4, -0.7); g.stroke(); } }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    var d = T.desk; [[500, 'My pipeline'], [636, 'Calls today']].forEach(function (m, k) { var mx = m[0], my = d.y - 70; fillRR(g, mx, my, 100, 56, 3, '#FFFFFF'); fillRR(g, mx, my, 100, 10, 3, CRMC); text(g, m[1], mx + 4, my + 7.6, 5, 800, '#FFFFFF');
      for (var c = 0; c < 4; c++) fillRR(g, mx + 6 + c * 23, my + 16, 19, 34, 3, c === 3 ? '#E9F8F2' : '#F6F8FA'); for (var c2 = 0; c2 < 4; c2++) fillRR(g, mx + 8 + c2 * 23, my + 20 + ((t * 0.5 + c2 + k) % 3) * 9, 15, 6, 2, c2 === 3 ? '#2BC48A' : '#D5DCE6'); });
    CR.draw(g, t);
  }

  function rep(id, keys, P, acts) { return { id: id, behind: true, keys: keys, P: P, act: function (P, t, S) { var st = S.cast[id], busy = keys.indexOf(S.hot) >= 0; P.talk = t < st.until || busy || ((t + P.ph * 3) % 8) < 1.4; P.mood = P.talk ? 'happy' : 'calm';
    var k2 = Math.abs(Math.sin(t * (busy ? 10 : 3) + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : (id === 'rep1' ? 0.4 : -0.4), 0.08); CR.cast(P, st, t, acts); } }; }
  window.IXW.worlds['crm-dev'] = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(33,183,153,.22)',
    glow: {
      sources: function (g) { rr(g, SRC.x - 8, SRC.y - 8, SRC.w + 16, SRC.h + 16, 14); },
      routing: function (g) { rr(g, SRC.x + SRC.w - 6, SRC.y + 60, colX(0) + 115 - SRC.x - SRC.w, 120, 12); },
      stages: function (g) { rr(g, PB.x - 8, PB.y - 8, PB.w + 16, PB.h + 16, 14); },
      scoring: function (g) { rr(g, PB.x + 4, PB.y + 60, PB.w - 8, 200, 12); },
      won: function (g) { rr(g, colX(3) - 6, PB.y + 26, 117, PB.h - 30, 12); },
      quote: function (g) { rr(g, QT.x - 10, QT.y - 10, QT.w + 20, QT.h + 20, 12); },
      bell: function (g) { var b = T.bell; rr(g, b.x - 30, b.y - 30, 60, 60, 30); }
    },
    backGlow: ['sources', 'routing', 'stages', 'scoring', 'won', 'quote', 'bell'],
    cast: [
      rep('rep1', ['routing', 'scoring'], REP1, ['wave', 'nod', 'id', 'cheer']),
      rep('rep2', ['sources'], REP2, ['type', 'nod', 'id', 'dance']),
      { id: 'mgr', behind: false, keys: ['stages', 'won', 'quote'], P: MGR, act: function (P, t, S) { var st = S.cast.mgr, busy = ['stages', 'won', 'quote'].indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -210], [-150, -320 + Math.sin(t * 3) * 8]] : [[-70, -210], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.6, 0.08); CR.cast(P, st, t, ['cheer', 'wave', 'nod', 'jump']); } }
    ],
    toy: function (name, S, t) { if (name === 'bell') { BELL.t = t; CR.burst('conf', T.bell.x, T.bell.y - 20, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; if (key === 'won') BELL.t = t + 0.4; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
