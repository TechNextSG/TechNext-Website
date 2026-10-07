/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: careers (/careers) — recruitment day: TechNext's booth at a career fair. A hall with a lighting truss and other
   booths in the margins; the TechNext booth in the middle: its back wall with the six open roles pinned up (each one a stop
   on the tour), the counter with a recruiter and the ID printer (it prints a new TechNext ID), an interview corner where an
   HR interviewer and a candidate sit at a small table, a "how to apply" standee, balloons. Candidates queue in front with
   their CVs (visitor lanyards); the team wears TechNext IDs, in semi-casual clothes. Seated people show chairs, legs and feet.
   Tap anyone, the printer, the balloons or the standee. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, NAVY = '#1B2350', TEAL = '#14A38B';
  var ROLES = [['Solutions Architect', 'ERP', '#3167CA'], ['Odoo Consultant', 'Finance', '#14A38B'], ['B2B Sales', 'Odoo / ERP', '#F08A24'],
    ['Marketing Officer', 'Web & AI', '#E0456B'], ['Senior Accountant', 'CPA · Tax', '#714B67'], ['HR Generalist', 'People', '#7B5BD6']];
  var T = { wall: { x: 150, y: 40, w: 760, h: 430 }, cards: { x: 190, y: 150, w: 104, h: 112, gap: 12 }, counter: { x: 214, y: 380, w: 260 }, printer: { x: 400, y: 346 },
    table: { x: 630, y: 404, w: 120 }, stand: { x: 862, y: 250 }, balloons: [[168, 40], [892, 40]] };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function cardX(i) { var c = T.cards; return c.x + i * (c.w + c.gap); }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the hall: a light ceiling under the header, a deep wall, spotlight cones */
    var hg = g.createLinearGradient(0, e.t, 0, F); hg.addColorStop(0, '#EEF1F8'); hg.addColorStop(0.18, '#DCE2F0'); hg.addColorStop(0.32, '#3A4478'); hg.addColorStop(1, '#2A3262'); g.fillStyle = hg; g.fillRect(e.l, e.t, e.r - e.l, F - e.t);
    for (var sp = Math.floor(e.l / 220) * 220; sp < e.r; sp += 220) { var lg = g.createLinearGradient(0, -120, 0, F); lg.addColorStop(0, 'rgba(255,240,200,.32)'); lg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = lg;
      g.beginPath(); g.moveTo(sp + 100, -112); g.lineTo(sp + 120, -112); g.lineTo(sp + 190, F); g.lineTo(sp + 30, F); g.closePath(); g.fill(); }
    /* the floor: exhibition carpet, an aisle */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#5868A8'); fl.addColorStop(1, '#46558F'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(255,255,255,.08)'; for (var d = 0; d < 8; d++) g.fillRect(e.l, F + 14 + d * 32, e.r - e.l, 2);
    g.fillStyle = 'rgba(255,216,74,.35)'; g.fillRect(e.l, F + 60, e.r - e.l, 6);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    /* the lighting truss and its spotlights */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 3; g.beginPath(); g.moveTo(e.l, -134); g.lineTo(e.r, -134); g.moveTo(e.l, -118); g.lineTo(e.r, -118); for (var x = Math.floor(e.l / 24) * 24; x < e.r; x += 24) { g.moveTo(x, -134); g.lineTo(x + 12, -118); g.lineTo(x + 24, -134); } g.stroke();
    for (var sp = Math.floor(e.l / 220) * 220; sp < e.r; sp += 220) { fillRR(g, sp + 98, -118, 24, 18, 5, '#1B1F3B'); fillE(g, sp + 110, -100, 9, 4, '#FFF2C8'); }
    /* other booths in the margins */
    function booth(x, w, col, name) { fillRR(g, x, 120, w, F - 120, 6, col); fillRR(g, x, 120, w, 40, 6, '#1B1F3B'); text(g, name, x + w / 2, 146, 12, 800, '#FFFFFF', 'center');
      fillRR(g, x + 30, 380, w - 60, F - 380, 4, '#E3E8EF'); fillRR(g, x + 40, 200, w - 80, 120, 6, 'rgba(255,255,255,.2)'); }
    if (e.l < 120) booth(-430, 230, '#5E6C9E', 'BOOTH 11');
    if (e.r > 940) { booth(1000, 240, '#6B6F9E', 'BOOTH 13'); }
    /* the booth's hanging sign on the truss */
    g.strokeStyle = '#9AA6BC'; g.lineWidth = 2; g.beginPath(); g.moveTo(420, -118); g.lineTo(420, -84); g.moveTo(640, -118); g.lineTo(640, -84); g.stroke();
    shadowed(g, 14, 6, 0.35, function () { fillRR(g, 380, -84, 300, 56, 12, '#FFFFFF'); }); fillRR(g, 380, -84, 12, 56, 6, '#FFD84A');
    CO.plane(g, 420, -56, 1.6, 0, '#3167CA', '#FFFFFF'); text(g, 'TechNext', 444, -50, 20, 800, '#1B2350'); text(g, 'BOOTH 12 · CAREER DAY', 444, -36, 8, 800, '#5C5C73');
    /* the TechNext booth's back wall: brand blue, the logo, the headline */
    var w = T.wall; shadowed(g, 30, 10, 0.4, function () { fillRR(g, w.x, w.y, w.w, w.h, 14, '#3167CA'); });
    var bw = g.createLinearGradient(0, w.y, 0, w.y + w.h); bw.addColorStop(0, '#3A72D6'); bw.addColorStop(1, '#2756B0'); g.fillStyle = bw; rr(g, w.x, w.y, w.w, w.h, 14); g.fill();
    g.fillStyle = 'rgba(255,255,255,.05)'; for (var st = w.x + 10; st < w.x + w.w; st += 30) g.fillRect(st, w.y, 12, w.h);
    CO.plane(g, w.x + 52, w.y + 44, 2.6, 0, '#FFFFFF', '#2E63C4'); text(g, 'TechNext', w.x + 84, w.y + 56, 30, 800, '#FFFFFF');
    fillRR(g, w.x + w.w - 330, w.y + 22, 300, 52, 26, '#FFD84A'); text(g, "WE'RE HIRING", w.x + w.w - 180, w.y + 46, 17, 800, '#1B1F3B', 'center'); text(g, 'TAGUIG CITY, METRO MANILA', w.x + w.w - 180, w.y + 63, 8.5, 800, '#1B1F3B', 'center');
    text(g, 'SIX OPEN ROLES · TAP ONE', w.x + 40, w.y + 100, 10, 800, 'rgba(255,255,255,.75)');
    g.restore();
  }

  function paintBack(g, ext) {
    /* the six role cards pinned to the booth wall (their lift and glow are live) */
    var c = T.cards;
    ROLES.forEach(function (r, i) { var x = cardX(i), y = c.y; shadowed(g, 10, 4, 0.25, function () { fillRR(g, x, y, c.w, c.h, 8, '#FFFFFF'); }); fillRR(g, x, y, c.w, 26, 8, r[2]); g.fillRect(x, y + 18, c.w, 8);
      fillE(g, x + c.w / 2, y - 2, 5, 5, '#E2453C'); text(g, String(i + 1).padStart(2, '0'), x + 12, y + 18, 9, 800, '#FFFFFF');
      var words = r[0].split(' '); text(g, words[0], x + 10, y + 46, 10, 800, C.ink); if (words[1]) text(g, words.slice(1).join(' '), x + 10, y + 60, 10, 800, C.ink);
      fillRR(g, x + 10, y + 72, c.w - 20, 16, 8, '#F1F4F9'); text(g, r[1], x + c.w / 2, y + 83.5, 7, 800, r[2], 'center'); text(g, 'Taguig City', x + 10, y + 102, 7, 700, '#5C5C73'); });
    /* the "how to apply" standee */
    var s = T.stand; soft(g, s.x + 34, F + 4, 50, 7, 0.3); g.fillStyle = '#7A869C'; g.fillRect(s.x + 32, s.y + 150, 5, F - s.y - 150); fillRR(g, s.x + 10, F - 6, 50, 6, 3, '#5C6B7A');
    shadowed(g, 10, 4, 0.3, function () { fillRR(g, s.x, s.y, 70, 150, 8, '#FFFFFF'); }); fillRR(g, s.x, s.y, 70, 24, 8, '#1B1F3B'); g.fillRect(s.x, s.y + 16, 70, 8); text(g, 'HOW TO', s.x + 35, s.y + 15, 7.5, 800, '#FFFFFF', 'center');
    text(g, 'APPLY', s.x + 35, s.y + 40, 11, 800, '#3167CA', 'center'); for (var qy = 0; qy < 6; qy++) for (var qx = 0; qx < 6; qx++) if (hash(qx * 7 + qy * 13) > 0.45 || (qx < 2 && qy < 2) || (qx > 3 && qy < 2) || (qx < 2 && qy > 3)) { g.fillStyle = '#1B1F3B'; g.fillRect(s.x + 14 + qx * 7, s.y + 52 + qy * 7, 7, 7); }
    text(g, 'JobStreet', s.x + 35, s.y + 118, 8, 800, C.ink, 'center'); text(g, 'or email us', s.x + 35, s.y + 132, 6.5, 700, '#5C5C73', 'center');
    /* the interview corner: a small round table (its top is in front) */
    var tb = T.table; soft(g, tb.x + tb.w / 2, F + 4, 90, 9, 0.3); fillRR(g, tb.x + tb.w / 2 - 5, tb.y + 6, 10, F - tb.y - 10, 3, '#7A869C'); fillE(g, tb.x + tb.w / 2, F - 3, 30, 6, '#5C6B7A');
    /* plants by the booth */
    K.plant(g, { x: 128, y: F }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 994, y: F }, '#FFFFFF', '#E3E9F3');
  }
  function paintFront(g, ext) {
    /* the booth counter with its printed front */
    var ct = T.counter; soft(g, ct.x + ct.w / 2, F + 4, ct.w * 0.55, 10, 0.3);
    fillRR(g, ct.x, ct.y, ct.w, F - ct.y, 10, '#FFFFFF'); fillRR(g, ct.x - 8, ct.y - 8, ct.w + 16, 14, 6, '#DCE3EE'); fillRR(g, ct.x, ct.y + 22, ct.w, 34, 0, '#3167CA');
    CO.plane(g, ct.x + 34, ct.y + 39, 1.2, 0, '#FFFFFF', '#3167CA'); text(g, 'Join TechNext', ct.x + 52, ct.y + 44, 13, 800, '#FFFFFF'); text(g, 'career@technext.asia', ct.x + ct.w / 2, ct.y + 76, 9, 800, '#3167CA', 'center');
    /* the printer on the counter, a stack of goodie bags */
    var p = T.printer; fillRR(g, p.x - 26, p.y, 52, 26, 6, '#2A3550'); fillRR(g, p.x - 20, p.y - 6, 40, 8, 3, '#3A4458'); fillE(g, p.x + 18, p.y + 10, 2.5, 2.5, '#7FE3C4');
    fillRR(g, ct.x + 20, ct.y - 26, 26, 22, 3, '#FFD84A'); fillRR(g, ct.x + 50, ct.y - 22, 22, 18, 3, '#3167CA'); g.strokeStyle = '#1B1F3B'; g.lineWidth = 1.5; g.beginPath(); g.arc(ct.x + 33, ct.y - 26, 6, Math.PI, 0); g.stroke();
    /* the interview table's top, a CV and a laptop on it */
    var tb = T.table; fillE(g, tb.x + tb.w / 2, tb.y + 4, tb.w / 2 + 4, 10, '#C9A27A'); fillE(g, tb.x + tb.w / 2, tb.y + 2, tb.w / 2, 8, '#D9B48A');
    fillRR(g, tb.x + 22, tb.y - 6, 26, 8, 2, '#FFFFFF'); fillRR(g, tb.x + 66, tb.y - 16, 32, 16, 3, '#2A3550');
  }

  var W = CR.who, CAND = '#F2B233';
  var REC = W({ x: 300, y: 470, s: 0.54, ph: 0.4, skin: 1, hair: 0, style: 'long', outfit: 'polo', top: '#3167CA', top2: '#FFFFFF', hands: [[-80, -230], [70, -210]], look: 0.4 });
  var HR = W({ x: 610, y: 470, s: 0.52, ph: 1.3, skin: 2, hair: 1, style: 'bob', outfit: 'cardigan', top: '#E0456B', top2: '#FFFFFF', sit: true, chairCol: '#2A3550', hands: [[-60, -200], [70, -200]], look: 0.6 });
  var CNDT = W({ x: 774, y: 470, s: 0.52, ph: 2.2, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#DCE7FB', id: CAND, sit: true, chairCol: '#5C6B7A', hands: [[-80, -200], [60, -200]], look: -0.6 });
  var CREW = [
    { front: true, x0: -420, x1: 140, y: 680, spd: 14, ph: 0.2, label: 'A candidate', lines: ['Here for the **Odoo consultant** role!', 'CV printed, nerves steady.'], acts: ['wave', 'jump', 'cheer'],
      P: W({ s: 0.58, skin: 0, hair: 2, style: 'pony', outfit: 'shirt', top: '#14A38B', id: CAND, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: 860, x1: 1300, y: 700, spd: 16, ph: 0.6, label: 'A candidate', lines: ['Accountant here. **BIR filings** are my thing.', 'Is the HR role still open?'], acts: ['nod', 'jump', 'wave'],
      P: W({ s: 0.58, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#2A3550', top2: '#FFD84A', id: CAND, glasses: true, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { x0: -440, x1: 60, y: 488, spd: 18, ph: 0.5, label: 'TechNext developer', lines: ['Ask me what a **day of Odoo work** looks like!', 'I started at a fair like this one.'], acts: ['id', 'wave', 'dance'],
      P: W({ s: 0.5, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#14A38B', glasses: true }) }
  ];

  var PRINT = { t: -9 }, POP = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* balloons tied to the booth corners: bob; tapped, they bounce and a new one floats up */
    var pt = t - POP.t;
    T.balloons.forEach(function (b, bi) { ['#FFD84A', '#3167CA', '#14A38B'].forEach(function (col, j) { var bx = b[0] + (j - 1) * 18, by = b[1] - 40 - j * 10 + Math.sin(t * 1.6 + j + bi) * 5 - (pt < 1.2 ? Math.sin(pt * Math.PI / 1.2) * 30 : 0);
      g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(b[0], b[1]); g.quadraticCurveTo(bx + 4, by + 30, bx, by + 18); g.stroke(); fillE(g, bx, by, 13, 16, col); fillE(g, bx - 4, by - 6, 3, 4, 'rgba(255,255,255,.5)'); }); });
    if (pt < 4) { var fy = 30 - pt * 60; fillE(g, 520 + Math.sin(pt * 3) * 10, fy, 13, 16, '#E0456B'); }
    /* the role cards: the active stop lifts and glows */
    var c = T.cards; ROLES.forEach(function (r, i) { if (S.hot !== 'r' + i) return; var x = cardX(i), u = clamp((t - (S.rT || 0)) * 3, 0, 1); g.save(); g.globalAlpha = 0.9 * u; fillRR(g, x - 4, c.y + c.h + 6, c.w + 8, 6, 3, '#FFD84A'); g.restore(); });
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the ID printer: tapped, a new TechNext ID slides out and lifts up */
    var p = T.printer, it = t - PRINT.t;
    if (it < 3.4) { var u = clamp(it / 0.8, 0, 1), up = clamp((it - 0.8) / 0.6, 0, 1); g.save(); g.translate(p.x, p.y - 4 - u * 22 - up * 46); g.rotate(-0.08 * up);
      fillRR(g, -20, -26, 40, 52, 5, '#1E2F5C'); fillRR(g, -18, -24, 36, 48, 4, '#FFFFFF'); fillRR(g, -18, -24, 36, 12, 4, '#3167CA'); g.fillRect(-18, -16, 36, 4);
      fillRR(g, -12, -6, 12, 14, 2, '#C9D6EE'); text(g, 'YOU?', 8, 4, 6.5, 800, '#3167CA', 'center'); fillRR(g, -12, 14, 24, 3, 1.5, '#3167CA'); g.restore(); }
    CR.draw(g, t);
  }

  window.IXW.worlds.careers = {
    pan: [-300, 1060],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,240,200,.55)',
    glow: (function () { var o = {}; ROLES.forEach(function (r, i) { o['r' + i] = function (g) { rr(g, cardX(i) - 8, T.cards.y - 10, T.cards.w + 16, T.cards.h + 18, 12); }; });
      o.printer = function (g) { var p = T.printer; rr(g, p.x - 32, p.y - 14, 64, 44, 10); }; o.stand = function (g) { var s = T.stand; rr(g, s.x - 8, s.y - 8, 86, 166, 12); };
      o.balloons = function (g) { rr(g, 130, -70, 80, 110, 30); }; return o; })(),
    backGlow: ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'stand', 'balloons'],
    cast: [
      { id: 'rec', behind: true, keys: ['r0', 'r1'], P: REC, act: function (P, t, S) { var st = S.cast.rec; P.talk = t < st.until; P.mood = P.talk || S.hot ? 'happy' : 'calm';
        P.hands = S.hot ? [[-80, -230], [120 + Math.sin(t * 3) * 10, -330]] : [[-80, -230], [70, -210]]; P.look = lerp(P.look, clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08); CR.cast(P, st, t, ['wave', 'id', 'cheer', 'jump', 'spin']); } },
      { id: 'hr', behind: false, keys: ['r5'], P: HR, act: function (P, t, S) { var st = S.cast.hr; P.talk = t < st.until || (t % 6) < 2.5; P.mood = 'happy';
        P.hands = [[-60, -200], [90 + Math.sin(t * 2) * 10, -230]]; P.look = lerp(P.look, 0.7, 0.08); CR.cast(P, st, t, ['nod', 'wave', 'id', 'love']); } },
      { id: 'cand', behind: false, keys: [], P: CNDT, act: function (P, t, S) { var st = S.cast.cand; P.talk = t < st.until || ((t + 3) % 6) < 2.5; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = [[-90 + Math.sin(t * 2.4) * 8, -230], [60, -200]]; P.look = lerp(P.look, -0.7, 0.08); CR.cast(P, st, t, ['jump', 'cheer', 'think', 'nod']); } }
    ],
    toy: function (name, S, t) { if (name === 'printer') { PRINT.t = t; CR.burst('star', T.printer.x, T.printer.y - 60, t); } if (name === 'balloons') { POP.t = t; CR.burst('conf', 180, 0, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.rT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
