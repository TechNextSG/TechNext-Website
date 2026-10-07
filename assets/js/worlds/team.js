/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: team (/employee-hub) — the TechNext 201 room, where HR keeps each employee's file. A bright records room on a
   Taguig City morning: the filing cabinets of 201 folders (a drawer slides out when tapped), the HR officer seated at an
   open desk filling in an employee information sheet, the folder stack, the ID printer issuing a TechNext ID, the board of
   the three offices with their clocks, the four-step engagement strip, and a new hire at the counter with their papers.
   Everyone wears a TechNext ID, in semi-casual clothes; whoever sits shows chair, legs and feet. Tap anyone or anything. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, MAN = '#EBC98B', MAN2 = '#D9B06A', BLUE = '#3167CA';
  var T = { cab: { x: 110, y: 150, w: 186 }, board: { x: 330, y: -6, w: 200, h: 150 }, steps: { x: 560, y: -40, w: 340, h: 92 }, side: { x: 330, y: 362, w: 120 },
    desk: { x: 456, y: 386, w: 344 }, mon: { x: 546, y: 300, w: 104, h: 66 }, pile: { x: 468, y: 352 }, win: { x: 950, y: -70, w: 300, h: 400 } };
  var DRAW = ['A–D', 'E–H', 'I–L', 'M–P', 'Q–T', 'U–Z'];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the wall: warm white with a soft wainscot line */
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#FAFBFD'); wg.addColorStop(1, '#EEF2F8'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = '#E3E9F2'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#D5DDEA'; g.fillRect(e.l, 246, e.r - e.l, 5);
    /* the window onto Taguig City in the morning */
    var w = T.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
    CO.sky(g, { l: w.x, r: w.x + w.w, t: w.y }, w.y, w.y + w.h, [[0, '#7DB7EC'], [0.7, '#BFDDF6'], [1, '#E6F3FB']]);
    CO.skyPH(g, w.x - 40, w.x + w.w + 40, 250, 300, { tall: w.x + 180 }); g.restore();
    CO.ceiling(g, e, CEIL, '#EEF2F8', '#F8FAFD', '#FFFFFF');
    CO.floor(g, e, F, '#E9E2D6', '#D9D0C1', 'rgba(120,90,50,.10)');
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k);
    /* the window frame and its mullions */
    var w = T.win; g.strokeStyle = '#FFFFFF'; g.lineWidth = 12; g.strokeRect(w.x, w.y, w.w, w.h); g.lineWidth = 6; g.beginPath(); g.moveTo(w.x + w.w / 2, w.y); g.lineTo(w.x + w.w / 2, w.y + w.h); g.moveTo(w.x, w.y + 150); g.lineTo(w.x + w.w, w.y + 150); g.stroke();
    fillRR(g, w.x - 14, w.y + w.h, w.w + 28, 12, 4, '#FFFFFF'); g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(w.x - 14, w.y + w.h + 12, w.w + 28, 4);
    g.restore();
  }
  function paintBack(g, ext) {
    /* the filing cabinets of 201 files: three tall cabinets, six drawers, A to Z */
    var c = T.cab; soft(g, c.x + c.w / 2, F + 4, 110, 9, 0.3);
    for (var i = 0; i < 3; i++) { var cx = c.x + i * 62; shadowed(g, 10, 4, 0.18, function () { fillRR(g, cx, c.y, 60, F - c.y, 4, '#C9D2DE'); }); }
    fillRR(g, c.x - 4, c.y - 22, c.w + 8, 20, 5, BLUE); text(g, '201 FILES', c.x + c.w / 2, c.y - 8, 9.5, 800, '#FFFFFF', 'center');
    /* the offices board: three offices, three clocks */
    var b = T.board; shadowed(g, 12, 4, 0.16, function () { fillRR(g, b.x, b.y, b.w, b.h, 10, '#FFFFFF'); }); fillRR(g, b.x, b.y, b.w, 24, 10, '#1B1F3B'); g.fillRect(b.x, b.y + 14, b.w, 10);
    text(g, 'OUR OFFICES', b.x + b.w / 2, b.y + 16, 8.5, 800, '#FFFFFF', 'center');
    [['Singapore', 'HQ', '#3167CA'], ['Taguig City', 'Odoo hub', '#14A38B'], ['Ho Chi Minh', 'AI lab', '#E07B12']].forEach(function (o, i) { var ox = b.x + 34 + i * 66;
      text(g, o[0], ox, b.y + 116, 7.2, 800, C.ink, 'center'); text(g, o[1], ox, b.y + 128, 6.4, 700, o[2], 'center'); });
    /* the four-step engagement strip on the wall */
    var s = T.steps; shadowed(g, 10, 4, 0.14, function () { fillRR(g, s.x, s.y, s.w, s.h, 10, '#FFFFFF'); });
    text(g, 'ONE TEAM, FOUR STEPS', s.x + 14, s.y + 18, 7.5, 800, '#5C6B7A');
    /* the low side cabinet with the ID printer */
    var sd = T.side; soft(g, sd.x + sd.w / 2, F + 4, 70, 7, 0.3); fillRR(g, sd.x, sd.y, sd.w, F - sd.y, 6, '#D9C3A0'); fillRR(g, sd.x + 6, sd.y + 14, sd.w - 12, 40, 4, '#E8D6B8'); fillRR(g, sd.x + 6, sd.y + 60, sd.w - 12, 40, 4, '#E8D6B8');
    fillE(g, sd.x + sd.w / 2, sd.y + 34, 9, 2.5, '#A98C62'); fillE(g, sd.x + sd.w / 2, sd.y + 80, 9, 2.5, '#A98C62');
    fillRR(g, sd.x + 16, sd.y - 40, 88, 40, 8, '#2A3142'); fillRR(g, sd.x + 24, sd.y - 32, 72, 10, 3, '#3A4458'); fillRR(g, sd.x + 28, sd.y - 14, 64, 6, 3, '#11151F');
    text(g, 'ID PRINTER', sd.x + 60, sd.y - 44, 6.6, 800, '#5C6B7A', 'center');
    K.plant(g, { x: 1290, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    /* HR's open desk: a monitor, the in-tray and the folder pile */
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    var m = T.mon; fillRR(g, m.x + m.w / 2 - 5, m.y + m.h, 10, d.y - m.y - m.h, 2, '#5C6B7A'); fillRR(g, m.x + m.w / 2 - 22, d.y - 4, 44, 5, 2, '#5C6B7A'); fillRR(g, m.x - 4, m.y - 4, m.w + 8, m.h + 8, 6, '#2A3142');
    fillRR(g, d.x + d.w - 60, d.y - 12, 44, 12, 3, '#9AA6BC'); fillRR(g, d.x + d.w - 56, d.y - 18, 36, 8, 2, '#FFFFFF');
    fillRR(g, d.x + d.w - 112, d.y - 22, 40, 22, 6, '#FFFFFF'); fillRR(g, d.x + d.w - 72, d.y - 16, 6, 10, 3, '#FFFFFF');
  }

  var W = CR.who;
  var HR = W({ x: 724, y: 470, s: 0.54, ph: 0.8, skin: 1, hair: 0, style: 'bob', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#2A3550', hands: [[-80, -196], [40, -196]], look: -0.6 });
  var HIRE = W({ x: 880, y: 470, s: 0.52, ph: 1.9, skin: 3, hair: 1, style: 'short', outfit: 'shirt', top: '#3167CA', hold: 'clipboard', hands: [[-80, -210], [60, -160]], look: -0.7 });
  var CREW = [
    { x0: 1000, x1: 1330, y: 488, spd: 14, ph: 0.3, label: 'Odoo consultant, Taguig City', lines: ['Updated my **201**: new address, same commute.', 'My TechNext ID opens the **records room**.'], acts: ['wave', 'id', 'nod'],
      P: W({ s: 0.5, skin: 0, hair: 0, style: 'long', outfit: 'polo', top: '#E0456B', hold: 'tablet' }) },
    { front: true, x0: -420, x1: 60, y: 690, spd: 18, ph: 0.5, label: 'Project manager', lines: ['Off to a **discovery** workshop with a client.', 'One team, from **discovery to support**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#1E3A6E', hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) }
  ];

  var PR = { t: -9 }, DR = { t: -9, n: 2 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the cabinet drawers: one slides out (tapped, or on the Files stop) with its manila folders */
    var c = T.cab, dt = t - DR.t, open = S.hot === 'cabinet' ? 1 : (dt < 3 ? clamp(dt * 3, 0, 1) * clamp((3 - dt) * 2, 0, 1) : 0);
    for (var i = 0; i < 3; i++) for (var j = 0; j < 2; j++) { var cx = c.x + i * 62, dy = c.y + 10 + j * 150, n = i * 2 + j, out = n === DR.n ? open * 22 : 0;
      for (var r = 0; r < 3; r++) { var y = dy + r * 46; if (r === 0 && out > 0) { fillRR(g, cx + 6, y - out * 0.3 - 10, 48, 14, 2, MAN); for (var f = 0; f < 4; f++) fillRR(g, cx + 9 + f * 11, y - out * 0.3 - 14, 8, 6, 1.5, f % 2 ? MAN2 : MAN); }
        fillRR(g, cx + 4 - (r === 0 ? out * 0.2 : 0), y - (r === 0 ? out * 0.3 : 0), 52, 40, 3, r === 0 && out > 0 ? '#EEF2F7' : '#E3E9F1'); fillRR(g, cx + 18, y + 6 - (r === 0 ? out * 0.3 : 0), 24, 9, 2, '#FFFFFF');
        if (r === 0) text(g, DRAW[n], cx + 30, y + 13.5 - out * 0.3, 6, 800, C.ink, 'center'); fillRR(g, cx + 22, y + 22 - (r === 0 ? out * 0.3 : 0), 16, 4, 2, '#9AA6BC'); } }
    /* the offices board: three live clocks (UTC+8, +8, +7) */
    var b = T.board; [[8, '#3167CA'], [8, '#14A38B'], [7, '#E07B12']].forEach(function (o, i) { CO.clock(g, b.x + 34 + i * 66, b.y + 66, 22, o[0], o[1]); });
    if (S.hot === 'offices') { var pi = Math.floor(t * 1.5) % 3; g.strokeStyle = ['#3167CA', '#14A38B', '#E07B12'][pi]; g.lineWidth = 3; g.beginPath(); g.arc(b.x + 34 + pi * 66, b.y + 66, 27, 0, Math.PI * 2); g.stroke(); }
    /* the four steps light in turn */
    var s = T.steps, st = Math.floor(t * (S.hot === 'journey' ? 1.4 : 0.5)) % 4;
    ['Discovery', 'Training', 'Integration', 'Support'].forEach(function (n, i) { var x = s.x + 14 + i * 80, on = i <= st;
      fillRR(g, x, s.y + 28, 70, 50, 8, on ? ['#3167CA', '#14A38B', '#F08A24', '#714B67'][i] : '#F1F4F9'); text(g, String(i + 1), x + 12, s.y + 48, 13, 800, on ? '#FFFFFF' : '#9AA6BC'); text(g, n, x + 35, s.y + 68, 7.4, 800, on ? '#FFFFFF' : '#5C6B7A', 'center');
      if (i < 3) { g.fillStyle = on && i < st ? '#2BC48A' : '#D5DCE6'; g.fillRect(x + 70, s.y + 52, 10, 3); } });
    /* the ID printer: a TechNext ID slides out (tapped, or on the ID stop) */
    var sd = T.side, pt = S.hot === 'id' ? (t % 3) : (t - PR.t), slide = pt < 3 ? clamp(pt * 1.4, 0, 1) : 0;
    fillE(g, sd.x + 92, sd.y - 27, 3, 3, Math.floor(t * 2) % 2 ? '#2BC48A' : '#1E7A55');
    if (slide > 0) { var cy = sd.y - 12 + slide * 2, cxx = sd.x + 30 - slide * 46; g.save(); g.translate(cxx, cy); g.rotate(-0.05 * slide);
      shadowed(g, 6, 2, 0.2, function () { fillRR(g, 0, -4, 60, 38, 4, '#FFFFFF'); }); fillRR(g, 0, -4, 60, 10, 4, BLUE); g.fillRect(0, 2, 60, 4); CO.plane(g, 8, 1, 0.38, 0, '#FFFFFF', BLUE);
      fillRR(g, 6, 12, 14, 16, 3, '#DCE7FB'); fillE(g, 13, 17, 3.4, 3.4, '#E8BC95'); fillRR(g, 24, 13, 30, 3.5, 1.5, '#1B1F3B'); fillRR(g, 24, 20, 22, 3, 1.5, '#9AA6BC'); fillRR(g, 24, 26, 26, 3, 1.5, '#9AA6BC'); g.restore(); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* HR's monitor: the employee information sheet fills in, field by field */
    var m = T.mon, fast = S.hot === 'sheet', n = Math.floor((t * (fast ? 2.4 : 0.8)) % 7);
    fillRR(g, m.x, m.y, m.w, m.h, 3, '#FFFFFF'); fillRR(g, m.x, m.y, m.w, 11, 3, BLUE); g.fillRect(m.x, m.y + 6, m.w, 5); text(g, 'EMPLOYEE INFORMATION SHEET', m.x + 5, m.y + 8.4, 4.6, 800, '#FFFFFF');
    fillRR(g, m.x + 5, m.y + 15, 18, 20, 2, '#DCE7FB'); fillE(g, m.x + 14, m.y + 22, 4, 4, '#E8BC95'); fillRR(g, m.x + 8, m.y + 28, 12, 6, 3, '#14A38B');
    ['Name', 'Position', 'Office', 'TechNext ID', 'Work email'].forEach(function (f, i) { var y = m.y + 18 + i * 9.2; text(g, f, m.x + 28, y + 3, 3.8, 800, '#5C6B7A'); fillRR(g, m.x + 56, y - 1, 42, 5, 1.5, '#F1F4F9'); if (i < n) fillRR(g, m.x + 57, y, 10 + hash(i + 3) * 28, 3, 1.5, i === n - 1 ? BLUE : '#9AA6BC'); });
    if (n >= 6) { g.save(); g.translate(m.x + 80, m.y + 52); g.rotate(-0.2); g.strokeStyle = '#2BC48A'; g.lineWidth = 1.4; g.strokeRect(-14, -5, 28, 10); text(g, 'ON FILE', 0, 2.4, 4.6, 800, '#1E9E6A', 'center'); g.restore(); }
    /* the folder pile: manila 201 folders; on the File stop the top one opens */
    var p = T.pile, op = S.hot === 'file' ? clamp(Math.sin(t * 2) * 0.5 + 0.6, 0, 1) : 0;
    for (var f = 0; f < 4; f++) fillRR(g, p.x + (f % 2) * 3, p.y + 26 - f * 6, 64, 6, 1.5, f % 2 ? MAN2 : MAN);
    fillRR(g, p.x + 6, p.y + 2, 18, 6, 2, MAN); fillRR(g, p.x, p.y + 6, 64, 6, 1.5, MAN); text(g, '201', p.x + 15, p.y + 7.4, 5, 800, '#7A5A22', 'center');
    if (op > 0) { g.save(); g.translate(p.x, p.y + 6); g.rotate(-op * 0.5); fillRR(g, 0, -32, 64, 32, 2, '#FFFFFF'); for (var l = 0; l < 4; l++) fillRR(g, 6, -26 + l * 6, l === 0 ? 30 : 48, 2.4, 1.2, l === 0 ? BLUE : '#C9D3E3'); g.restore(); }
    CR.draw(g, t);
  }

  window.IXW.worlds.team = {
    pan: [-300, 1120],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t) {
      /* clouds drift past the Taguig window */
      var w = T.win; g.save(); g.beginPath(); g.rect(w.x, w.y, w.w, w.h); g.clip();
      for (var i = 0; i < 3; i++) { var cx = w.x - 80 + ((t * (5 + i * 2) + i * 140) % (w.w + 160)), cy = w.y + 40 + i * 36; g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(cx, cy, 34, 10, 0, 0, Math.PI * 2); g.ellipse(cx + 16, cy - 7, 20, 11, 0, 0, Math.PI * 2); g.fill(); }
      g.restore();
    },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(49,103,202,.22)',
    glow: {
      sheet: function (g) { var m = T.mon; rr(g, m.x - 12, m.y - 12, m.w + 24, m.h + 24, 10); },
      file: function (g) { var p = T.pile; rr(g, p.x - 10, p.y - 10, 84, 52, 10); },
      cabinet: function (g) { var c = T.cab; rr(g, c.x - 10, c.y - 32, c.w + 20, F - c.y + 36, 12); },
      id: function (g) { var s = T.side; rr(g, s.x - 40, s.y - 56, s.w + 50, 76, 12); },
      offices: function (g) { var b = T.board; rr(g, b.x - 10, b.y - 10, b.w + 20, b.h + 20, 14); },
      journey: function (g) { var s = T.steps; rr(g, s.x - 10, s.y - 10, s.w + 20, s.h + 20, 14); },
      printer: function (g) { var s = T.side; rr(g, s.x + 8, s.y - 48, 104, 52, 10); },
      drawer: function (g) { var c = T.cab; rr(g, c.x - 6, c.y - 6, c.w + 12, 160, 10); }
    },
    backGlow: ['cabinet', 'id', 'offices', 'journey', 'printer', 'drawer'],
    cast: [
      { id: 'hr', behind: true, keys: ['sheet', 'file'], P: HR, act: function (P, t, S) { var st = S.cast.hr, busy = S.hot === 'sheet'; P.talk = t < st.until || S.hot === 'file'; P.mood = P.talk || busy ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 14 : 4))) * 6; P.hands = S.hot === 'file' ? [[-60, -200], [-130, -170 + Math.sin(t * 3) * 6]] : [[-90, -196 - k2], [30, -196 - (6 - k2)]];
        P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : (S.hot === 'file' ? -0.9 : -0.6), 0.08); CR.cast(P, st, t, ['type', 'nod', 'id', 'wave', 'love']); } },
      { id: 'hire', behind: false, keys: ['id'], P: HIRE, act: function (P, t, S) { var st = S.cast.hire; P.talk = t < st.until || S.hot === 'id'; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = S.hot === 'id' ? [[-80, -210], [100, -300 + Math.sin(t * 4) * 8]] : [[-80, -210], [60, -160]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.7, 0.08); CR.cast(P, st, t, ['wave', 'jump', 'id', 'cheer', 'dance']); } }
    ],
    toy: function (name, S, t) { if (name === 'printer') { PR.t = t; CR.burst('star', T.side.x + 20, T.side.y - 20, t); } if (name === 'drawer') { DR.t = t; DR.n = (DR.n + 1) % 6; } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
