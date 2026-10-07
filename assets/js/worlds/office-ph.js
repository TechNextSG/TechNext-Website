/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: office-ph (/offices/philippines) — the Taguig City hub, Level 9, IP Center: TechNext's main development and
   consulting hub. A long dev floor under a wall of glass onto the business district's towers (the title card hangs over the
   window band like a banner, so everything that matters sits low): a workbench where two developers configure Odoo and
   write a custom module, the integration panel on its front, a consultant on a video call with a client, the sprint board
   on wheels with an architect, the pantry and the hiring board. Everyone wears a TechNext ID, in semi-casual clothes.
   Tap anyone, the deploy button, a sprint card, the coffee machine or the clock. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, TEAL = '#14A38B', TEALD = '#0E7A68';
  var T = { benchA: { x: 100, y: 384, w: 300 }, benchB: { x: 470, y: 384, w: 230 }, board: { x: 746, y: 240, w: 160, h: 176 }, hire: { x: -214, y: 214, w: 150, h: 170 }, pantry: { x: -40, y: 352 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 250, [[0, '#8EC9E8'], [0.6, '#D9F0EE'], [1, '#F2FAF6']]);
    CO.skyPH(g, Math.min(e.l, -300), Math.max(e.r, 1400), 250, 300, { tall: 560 });
    var lo = g.createLinearGradient(0, 300, 0, F); lo.addColorStop(0, 'rgba(226,245,240,.2)'); lo.addColorStop(1, 'rgba(236,246,242,.95)'); g.fillStyle = lo; g.fillRect(e.l, 300, e.r - e.l, F - 300);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.glass(g, e, CEIL, F, 120, '#E6F1EE', 60);
    /* teal columns every 480 units */
    for (var cx = Math.floor(e.l / 480) * 480 + 440; cx < e.r; cx += 480) { fillRR(g, cx - 14, CEIL, 28, F - CEIL, 0, '#F2F7F6'); g.fillStyle = '#D5E6E2'; g.fillRect(cx + 6, CEIL, 8, F - CEIL); g.fillStyle = TEAL; g.fillRect(cx - 14, 200, 28, 10); }
    CO.ceiling(g, e, CEIL, '#E7F1EF', '#F7FBFA', '#FFFFFF');
    /* the floor: carpet tiles in two greys with a teal walkway */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#DDE4E8'); fl.addColorStop(1, '#C9D2D8'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    for (var tx = Math.floor(e.l / 60) * 60; tx < e.r; tx += 60) for (var ty = 0; ty < 6; ty++) if ((tx / 60 + ty) % 2 === 0) { g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(tx, F + 8 + ty * 34, 60, 34); }
    g.fillStyle = 'rgba(20,163,139,.22)'; g.fillRect(e.l, F + 52, e.r - e.l, 10);
    g.fillStyle = 'rgba(40,70,120,.10)'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.restore();
  }

  function paintBack(g, ext) {
    /* the hiring board and the pantry, left of the floor */
    var hb = T.hire; if (ext.l < hb.x + hb.w) { shadowed(g, 12, 5, 0.18, function () { fillRR(g, hb.x, hb.y, hb.w, hb.h, 10, '#FFFFFF'); }); fillRR(g, hb.x, hb.y, hb.w, 30, 10, TEAL); g.fillRect(hb.x, hb.y + 20, hb.w, 10);
      text(g, "WE'RE HIRING", hb.x + hb.w / 2, hb.y + 20, 11, 800, '#FFFFFF', 'center');
      ['Solutions architect', 'Odoo consultant', 'B2B sales', 'Marketing officer', 'Senior accountant', 'HR generalist'].forEach(function (r, i) { fillRR(g, hb.x + 10, hb.y + 38 + i * 21, hb.w - 20, 17, 5, i % 2 ? '#E6F6F2' : '#F1F5FB'); text(g, r, hb.x + 18, hb.y + 50 + i * 21, 7.6, 800, C.ink); }); }
    var pn = T.pantry; soft(g, pn.x + 40, F + 4, 70, 8, 0.2); fillRR(g, pn.x - 30, pn.y + 40, 120, F - pn.y - 40, 6, '#F4F7FC'); fillRR(g, pn.x - 34, pn.y + 32, 128, 10, 4, '#C9A27A');
    fillRR(g, pn.x, pn.y - 40, 56, 72, 9, '#2A3550'); fillRR(g, pn.x + 8, pn.y - 32, 40, 16, 4, '#3A4458'); fillE(g, pn.x + 44, pn.y - 24, 3.5, 3.5, '#7FE3C4'); fillRR(g, pn.x + 16, pn.y - 2, 24, 5, 2, '#5C6B7A');
    fillRR(g, pn.x + 64, pn.y + 6, 18, 26, 4, '#FFFFFF'); fillRR(g, pn.x + 64, pn.y + 6, 18, 6, 2, TEAL);
    /* the sprint board on wheels */
    var b = T.board; soft(g, b.x + b.w / 2, F + 4, 90, 8, 0.2); g.fillStyle = '#9AA6BC'; g.fillRect(b.x + 14, b.y + b.h, 5, F - b.y - b.h - 8); g.fillRect(b.x + b.w - 19, b.y + b.h, 5, F - b.y - b.h - 8); fillE(g, b.x + 16, F - 4, 4, 4, '#2A3550'); fillE(g, b.x + b.w - 16, F - 4, 4, 4, '#2A3550');
    shadowed(g, 12, 5, 0.18, function () { fillRR(g, b.x, b.y, b.w, b.h, 6, '#FFFFFF'); }); g.strokeStyle = '#C9D1DD'; g.lineWidth = 2; rr(g, b.x, b.y, b.w, b.h, 6); g.stroke();
    text(g, 'SPRINT 7 · ODOO MODULES', b.x + 10, b.y + 16, 7, 800, TEALD);
    ['TO DO', 'DOING', 'DONE'].forEach(function (l, i) { var lx = b.x + 8 + i * (b.w - 16) / 3; fillRR(g, lx, b.y + 24, (b.w - 16) / 3 - 4, 14, 3, ['#E3E8EF', '#FFF2C8', '#D7F2EA'][i]); text(g, l, lx + ((b.w - 16) / 3 - 4) / 2, b.y + 34, 6, 800, C.ink, 'center'); });
    /* plants between the desks */
    K.plant(g, { x: 432, y: F }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 1000, y: F }, TEAL, '#3AB9A2');
  }
  function paintFront(g, ext) {
    var a = T.benchA, b = T.benchB;
    CO.desk(g, a.x, a.y, a.w, F, { mons: [[a.x + 18, 74, 44], [a.x + 100, 70, 44], [a.x + 196, 80, 44]] });
    /* the integration panel on the bench front: bank, gateway, store, AI into Odoo */
    var hx = a.x + 40, hy = a.y + 28; fillRR(g, hx, hy, a.w - 80, 42, 10, '#FFFFFF'); g.strokeStyle = '#DCE3EE'; g.lineWidth = 2; rr(g, hx, hy, a.w - 80, 42, 10); g.stroke();
    fillE(g, hx + (a.w - 80) / 2, hy + 21, 14, 14, C.odoo); text(g, 'odoo', hx + (a.w - 80) / 2, hy + 24, 7, 800, '#FFFFFF', 'center');
    [[hx + 22, TEAL, 'BANK'], [hx + 52, '#F2B233', 'PAY'], [hx + a.w - 80 - 52, C.sg, 'SHOP'], [hx + a.w - 80 - 22, C.vn, 'AI']].forEach(function (p) { fillE(g, p[0], hy + 19, 9, 9, p[1]); text(g, p[2], p[0], hy + 38, 5.6, 800, '#5C6B7A', 'center'); });
    CO.desk(g, b.x, b.y, b.w, F, { mons: [[b.x + 60, 110, 62]] });
    /* the deploy button on bench B (its glow is live) */
    fillRR(g, b.x + 186, b.y - 18, 34, 18, 5, '#2A3550');
    text(g, 'TAGUIG CITY · DEV & CONSULTING', b.x + b.w / 2, F - 14, 7, 800, TEAL, 'center');
  }

  var W = CR.who;
  var DEV1 = W({ x: 190, y: 470, s: 0.54, ph: 0.3, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#14A38B', glasses: true, feet: false, hands: [[-60, -200], [60, -200]] });
  var DEV2 = W({ x: 328, y: 470, s: 0.54, ph: 1.2, skin: 1, hair: 1, style: 'pony', outfit: 'cardigan', top: '#DCE7FB', top2: '#3167CA', feet: false, hands: [[-60, -200], [60, -200]] });
  var CON = W({ x: 520, y: 470, s: 0.54, ph: 2.0, skin: 3, hair: 0, style: 'short', outfit: 'shirt', top: '#F2B233', headset: '#14A38B', feet: false, hands: [[-60, -200], [60, -200]] });
  var ARC = W({ x: 936, y: 470, s: 0.54, ph: 2.7, skin: 4, hair: 1, style: 'short', outfit: 'polo', top: '#1E4691', glasses: true, hands: [[-130, -300], [70, -150]], look: -0.6 });
  var CREW = [
    { x0: -320, x1: 60, y: 486, spd: 18, ph: 0.2, label: 'HR, Taguig City', lines: ['New starter on Monday! Laptop, ID and a **welcome kit**.', 'We’re hiring here in **Taguig City**. Check the board!'], acts: ['wave', 'id', 'cheer'],
      P: W({ s: 0.5, skin: 0, hair: 2, style: 'bob', outfit: 'shirt', top: '#E0456B', hold: 'box' }) },
    { x0: 1040, x1: 1360, y: 488, spd: 16, ph: 0.6, label: 'Finance, Taguig City', lines: ['Month-end close, **done in Odoo**.', 'Finance sits right here with the developers.'], acts: ['nod', 'id', 'jump'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#2A3550', top2: '#DCE7FB', glasses: true, hold: 'tablet' }) },
    { front: true, x0: -380, x1: 60, y: 690, spd: 22, ph: 0.5, label: 'Sales, Taguig City', lines: ['Calls with clients in **10+ countries** today.', 'Coffee, then the pipeline review!'], acts: ['cheer', 'spin', 'id'],
      P: W({ s: 0.58, skin: 1, hair: 0, style: 'long', outfit: 'polo', top: '#F08A24', hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) }
  ];

  var CARD = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the clock on the column: Manila time */
    var ct = t - (S.toy.clock != null ? S.toy.clock : -9); g.save(); if (ct < 1.2) { g.translate(440, 150); g.rotate(Math.sin(ct * 20) * 0.08 * (1.2 - ct)); g.translate(-440, -150); } CO.clock(g, 440, 150, 22, 8, TEAL); g.restore();
    /* the sprint board: cards in lanes; tapped (or on Modules), the top card slides to DONE */
    var b = T.board, mv = t - CARD.t, md = S.hot === 'modules' ? clamp((t - (S.mT || 0)) / 1.4, 0, 1) : (mv < 1.6 ? clamp(mv / 1.2, 0, 1) : 0);
    var cards = [[0, 0, 'Sales', '#3167CA'], [0, 1, 'Purchase', '#F2B233'], [1, 0, 'Inventory', TEAL], [1, 1, 'Custom', C.vn], [2, 0, 'Accounting', C.odoo], [2, 1, 'Bank feed', '#3FA9E0']];
    var lw = (b.w - 16) / 3;
    cards.forEach(function (c, i) { var lane = c[0], x = b.x + 8 + lane * lw, y = b.y + 44 + c[1] * 40;
      if (i === 3 && md > 0) { x = lerp(x, b.x + 8 + 2 * lw, md); y = lerp(y, b.y + 44 + 2 * 40, md); }
      shadowed(g, 4, 2, 0.12, function () { fillRR(g, x, y, lw - 4, 34, 4, '#FFFFFF'); }); fillRR(g, x, y, 4, 34, 2, c[3]); text(g, c[2], x + 8, y + 14, 6.4, 800, C.ink); fillRR(g, x + 8, y + 20, lw - 22, 4, 2, '#E3E8EF'); });
    /* the pantry machine's steam; tapped, it pours */
    var pn = T.pantry, br = t - (S.toy.coffee != null ? S.toy.coffee : -9); fillRR(g, pn.x + 19, pn.y + 8, 18, 22, 4, '#FFFFFF');
    if (br < 2.6) { g.fillStyle = '#6B4329'; g.fillRect(pn.x + 26, pn.y + 2, 4, Math.min(12, br * 18)); }
    for (var s2 = 0; s2 < 3; s2++) { var sy2 = ((t * 18 + s2 * 12) % 34); g.globalAlpha = (1 - sy2 / 34) * (br < 2.6 ? 0.8 : 0.3); fillE(g, pn.x + 28 + Math.sin(t * 2 + s2) * 3, pn.y - sy2, 4, 4, '#FFFFFF'); } g.globalAlpha = 1;
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the monitors: Odoo apps (configure), code (custom module), the video call */
    var a = T.benchA, cf = S.hot === 'configure';
    CO.screen(g, a.x + 22, a.y - 66, 66, 36, t, 'odoo'); if (cf) { var p = clamp((t - (S.cT || 0)) / 1.5, 0, 1); fillRR(g, a.x + 22, a.y - 30, 66 * p, 3, 1.5, TEAL); }
    CO.screen(g, a.x + 104, a.y - 66, 62, 36, t, 'code', S.hot === 'modules'); CO.screen(g, a.x + 200, a.y - 66, 72, 36, t, 'chart', S.hot === 'integrate');
    /* integration: tokens flow into Odoo */
    var hx = a.x + 40, hy = a.y + 28, cx = hx + (a.w - 80) / 2, fl = S.hot === 'integrate' ? ((t - (S.iT || 0)) * 1.4) % 1 : (t * 0.35) % 1;
    [[hx + 22, TEAL], [hx + 52, '#F2B233'], [hx + a.w - 80 - 52, C.sg], [hx + a.w - 80 - 22, C.vn]].forEach(function (p, i) { var q = (fl + i * 0.25) % 1; fillE(g, lerp(p[0], cx, q), hy + 19 - Math.sin(q * Math.PI) * 6, 2.4, 2.4, p[1]); });
    /* the video call on bench B: the client's tile and ours */
    var bb = T.benchB, vx = bb.x + 64, vy = bb.y - 84; fillRR(g, vx, vy, 102, 54, 2, '#1E2A3A'); fillRR(g, vx + 4, vy + 4, 46, 40, 3, '#3A4458'); fillRR(g, vx + 52, vy + 4, 46, 40, 3, '#2F5D7A');
    fillE(g, vx + 27, vy + 22, 8, 8, '#E8BC95'); fillRR(g, vx + 17, vy + 30, 20, 12, 6, '#5E7BB5'); fillE(g, vx + 75, vy + 22, 8, 8, '#DDAE86'); fillRR(g, vx + 65, vy + 30, 20, 12, 6, TEAL);
    var talk = S.hot === 'consult' ? Math.abs(Math.sin(t * 9)) : 0.2; fillRR(g, vx + 4, vy + 46, 94 * (0.3 + 0.5 * talk), 3, 1.5, '#7FE3C4'); text(g, 'CLIENT CALL · SAMPLE', vx + 51, vy - 4, 5.6, 800, TEALD, 'center');
    /* the deploy button: tapped, it glows green and the staging banner rises */
    var b = T.benchB, dt = t - (S.toy.deploy != null ? S.toy.deploy : -9), on = dt < 3;
    fillE(g, b.x + 203, b.y - 14, 10, 6, on ? '#2BC48A' : '#E2453C'); fillE(g, b.x + 203, b.y - 16, 8, 4, on ? '#7FFFD4' : '#FF8A80');
    if (on) { var u = Math.min(1, dt * 2), a = dt > 2.4 ? (3 - dt) / 0.6 : 1; g.save(); g.globalAlpha = a; fillRR(g, b.x + 120, b.y - 150 - u * 20, 150, 30, 15, '#0E7A50'); text(g, '✓ Deployed to staging', b.x + 195, b.y - 131 - u * 20, 9, 800, '#FFFFFF', 'center'); g.restore(); }
    CR.draw(g, t);
  }

  window.IXW.worlds['office-ph'] = {
    pan: [-300, 1080],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t, par, S) { var ext = S.ext, span = ext.r - ext.l + 300;
      for (var c = 0; c < 5; c++) { var x = ext.l - 150 + ((hash(c + 7) * span + t * (4 + c * 1.5)) % span) - par * (2 + c); K.cloud(g, x, -120 + c * 30, 0.24 + hash(c + 1) * 0.1); }
      var jx = ext.l + ((t * 20) % (span + 400)) - 200; CO.plane(g, jx, -70, 0.8, -0.05, 'rgba(255,255,255,.9)'); },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    motes: false,
    glow: {
      configure: function (g) { var a = T.benchA; rr(g, a.x + 12, a.y - 80, 88, 60, 10); },
      modules: function (g) { var b = T.board; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 10); },
      integrate: function (g) { var a = T.benchA; rr(g, a.x + 30, a.y + 18, a.w - 60, 62, 14); },
      consult: function (g) { var b = T.benchB; rr(g, b.x + 54, b.y - 102, 122, 84, 10); },
      code: function (g) { var a = T.benchA; rr(g, a.x + 94, a.y - 80, 84, 60, 10); },
      hiring: function (g) { var h = T.hire; rr(g, h.x - 8, h.y - 8, h.w + 16, h.h + 16, 14); },
      deploy: function (g) { var b = T.benchB; rr(g, b.x + 180, b.y - 28, 46, 32, 8); },
      coffee: function (g) { var p = T.pantry; rr(g, p.x - 8, p.y - 48, 72, 84, 12); },
      clock: function (g) { rr(g, 412, 122, 56, 56, 28); },
      card: function (g) { var b = T.board; rr(g, b.x + 8, b.y + 82, 54, 40, 6); }
    },
    backGlow: ['modules', 'hiring', 'coffee', 'clock', 'card'],
    cast: [
      { id: 'dev1', behind: true, keys: ['configure'], P: DEV1, act: function (P, t, S) { var st = S.cast.dev1, busy = S.hot === 'configure'; P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 14 : 6))) * 6; P.hands = [[-70, -196 - k2], [60, -196 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.3, 0.08); CR.cast(P, st, t, ['type', 'wave', 'id', 'jump', 'cheer']); } },
      { id: 'dev2', behind: true, keys: ['code', 'modules'], P: DEV2, act: function (P, t, S) { var st = S.cast.dev2, busy = S.hot === 'code'; P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 16 : 5) + 1)) * 6; P.hands = [[-70, -196 - k2], [60, -196 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0.2, 0.08); CR.cast(P, st, t, ['type', 'id', 'dance', 'wave', 'jump']); } },
      { id: 'con', behind: true, keys: ['consult'], P: CON, act: function (P, t, S) { var st = S.cast.con, busy = S.hot === 'consult'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-60, -200], [90 + Math.sin(t * 4) * 12, -260]] : [[-60, -200], [60, -200]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0.4, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'love', 'jump']); } },
      { id: 'arc', behind: false, keys: ['modules'], P: ARC, act: function (P, t, S) { var st = S.cast.arc, busy = S.hot === 'modules'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-150 + Math.sin(t * 3) * 14, -330], [70, -150]] : [[-120, -290], [70, -150]]; P.look = lerp(P.look, -0.7, 0.08); CR.cast(P, st, t, ['think', 'wave', 'id', 'spin', 'cheer']); } }
    ],
    toy: function (name, S, t, btn) {
      if (name === 'clock' && btn) btn.setAttribute('data-say', CO.timeLine(8, 'Taguig City', 'the same time as Singapore. Ho Chi Minh City is an hour behind.'));
      if (name === 'card') CARD.t = t;
      if (name === 'deploy') CR.burst('conf', T.benchB.x + 203, T.benchB.y - 30, t);
    },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { if (key === 'configure') S.cT = t; if (key === 'modules') S.mT = t; if (key === 'integrate') S.iT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
