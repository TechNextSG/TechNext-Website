/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: app-all (/odoo/apps) — every Odoo app, by category, on one database. A bright showroom: the app wall holds eight
   category shelves with the real Odoo app icons (the focus categories, Finance, Sales and Supply Chain, carry a TechNext
   ribbon); every shelf is wired to the one database drum on the floor, and the wires light when a category is chosen. A
   TechNext consultant (TechNext ID) walks a business owner through it; a client sits at a laptop planning which apps to
   switch on first (chair, legs and feet). Tap anyone, any shelf or the database. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, PUR = '#714B67';
  var CATS = [
    { key: 'finance', name: 'Finance', col: '#0E9384', focus: true, apps: ['accountant', 'account', 'hr_expense', 'spreadsheet_dashboard', 'documents', 'sign'] },
    { key: 'sales', name: 'Sales', col: '#3167CA', focus: true, apps: ['crm', 'sale', 'point_of_sale', 'pos_restaurant', 'sale_subscription', 'sale_renting'] },
    { key: 'supply', name: 'Supply Chain', col: '#F08A24', focus: true, apps: ['stock', 'mrp', 'mrp_plm', 'purchase', 'maintenance', 'quality_control'] },
    { key: 'websites', name: 'Websites', col: '#7B5CD6', apps: ['website', 'website_sale', 'website_blog', 'website_forum', 'im_livechat', 'website_slides'] },
    { key: 'hr', name: 'Human Resources', col: '#E0456B', apps: ['hr', 'hr_recruitment', 'hr_holidays', 'hr_appraisal', 'hr_referral', 'fleet', 'hr_payroll'] },
    { key: 'marketing', name: 'Marketing', col: '#D9922B', apps: ['social', 'mass_mailing', 'mass_mailing_sms', 'event', 'marketing_automation', 'survey'] },
    { key: 'services', name: 'Services', col: '#14A38B', apps: ['project', 'hr_timesheet', 'industry_fsm', 'helpdesk', 'planning', 'appointment'] },
    { key: 'productivity', name: 'Productivity', col: '#5C6B7A', apps: ['mail', 'approvals', 'iot', 'voip', 'knowledge', 'whatsapp', 'ai_app'] }];
  var SH = { w: 180, h: 112 }, DB = { x: 640, y: 300 }, T = { table: { x: 760, y: 400, w: 120 } };
  CATS.forEach(function (c, i) { c.x = 290 + (i % 4) * 192; c.y = i < 4 ? -112 : 12; });
  /* the real app icons (local SVGs), loaded once; drawn when ready */
  var ROOT = (function () { var s = document.querySelector('script[src*="worlds/app-all.js"]'); return s ? s.getAttribute('src').split('assets/js/')[0] : '/'; })(), IMG = {};
  CATS.forEach(function (c) { c.apps.forEach(function (m) { var im = new Image(); im.src = ROOT + 'assets/img/odoo/' + m + '.svg'; IMG[m] = im; }); });
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function catAt(x, y) { for (var i = 0; i < CATS.length; i++) { var c = CATS[i]; if (x > c.x && x < c.x + SH.w && y > c.y && y < c.y + SH.h) return c; } return null; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F8F6FB'); wg.addColorStop(1, '#ECE8F3'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    var rg = g.createRadialGradient(DB.x, DB.y, 10, DB.x, DB.y, 520); rg.addColorStop(0, 'rgba(113,75,103,.10)'); rg.addColorStop(1, 'rgba(113,75,103,0)'); g.fillStyle = rg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 220, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 300); }
    CO.ceiling(g, e, CEIL, '#F1EEF6', '#FAF9FC', '#FFFFFF'); CO.floor(g, e, F, '#E7EBF1', '#D6DDE7', 'rgba(40,70,120,.08)');
    g.restore();
  }
  function paintBack(g, ext) {
    /* the shelves */
    CATS.forEach(function (c) { shadowed(g, 10, 4, 0.14, function () { fillRR(g, c.x, c.y, SH.w, SH.h, 12, '#FFFFFF'); }); fillRR(g, c.x, c.y, SH.w, 22, 12, c.col); g.fillRect(c.x, c.y + 12, SH.w, 10);
      text(g, c.name, c.x + 12, c.y + 15, 8.6, 800, '#FFFFFF'); text(g, c.apps.length + ' apps', c.x + SH.w - 10, c.y + 15, 7, 700, 'rgba(255,255,255,.85)', 'right');
      if (c.focus) { fillRR(g, c.x + SH.w - 64, c.y + SH.h - 14, 58, 12, 6, '#FFD84A'); text(g, 'TECHNEXT FOCUS', c.x + SH.w - 35, c.y + SH.h - 5.5, 5.2, 800, '#1B1F3B', 'center'); } });
    /* the database drum */
    soft(g, DB.x, F + 4, 110, 12, 0.3); var dx = DB.x - 70;
    g.fillStyle = PUR; g.fillRect(dx, DB.y, 140, F - DB.y - 18); fillE(g, DB.x, F - 18, 70, 18, '#5A3A52');
    for (var b = 0; b < 3; b++) { fillE(g, DB.x, DB.y + 40 + b * 40, 70, 18, b % 2 ? '#7E5675' : '#6A4462'); } fillE(g, DB.x, DB.y, 70, 18, '#8A6080');
    text(g, 'ONE DATABASE', DB.x, DB.y + 72, 10, 800, '#FFFFFF', 'center'); text(g, 'customers · products · accounts', DB.x, DB.y + 88, 7, 700, '#E6D3E2', 'center');
    /* the planning table */
    var tb = T.table; CO.desk(g, tb.x, tb.y, tb.w, F, { open: true, legs: '#9AA6BC', top: '#C9A27A' });
    K.plant(g, { x: 1150, y: F }, '#FFFFFF', '#E3E8EF'); K.plant(g, { x: 250, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) { var tb = T.table; fillRR(g, tb.x + 20, tb.y - 34, 54, 34, 4, '#2A3142'); fillRR(g, tb.x + 12, tb.y - 3, 70, 4, 2, '#9AA6BC'); }

  var W = CR.who;
  var CON = W({ x: 470, y: 470, s: 0.54, ph: 0.3, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: '#3167CA', hold: 'tablet', hands: [[-70, -210], [70, -170]], look: 0.6 });
  var OWN = W({ x: 1000, y: 470, s: 0.54, ph: 1.6, skin: 0, hair: 1, style: 'long', outfit: 'shirt', top: '#E0456B', id: '#9AA6BC', hands: [[-70, -170], [70, -170]], look: -0.6 });
  var PLN = W({ x: 846, y: 470, s: 0.5, ph: 2.4, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-80, -206], [20, -206]], look: -0.5 });
  var CREW = [
    { x0: 1180, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Start with **Finance, Sales and Supply Chain**.', 'Add the rest **as you need them**.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: PUR, hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext developer', lines: ['Every app reads the **same records**.', 'No exports between apps. **One database**.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: '#1E3A6E', hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var PICK = { c: null, t: -9 };
  function active(S, t) { var byKey = CATS.filter(function (c) { return c.key === S.hot; })[0]; if (byKey) return byKey; if (S.hot === 'db') return 'all'; return t - PICK.t < 4 ? PICK.c : null; }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    var act = active(S, t);
    /* wires from every shelf to the database; the chosen one (or all, on the database stop) carries pulses */
    CATS.forEach(function (c, i) { var on = act === 'all' || act === c, sx = c.x + SH.w / 2, sy = c.y + SH.h, ex = DB.x + (i % 4 - 1.5) * 26, ey = DB.y - 10;
      g.strokeStyle = on ? c.col : 'rgba(113,75,103,.18)'; g.lineWidth = on ? 3 : 1.6; g.beginPath(); g.moveTo(sx, sy); g.bezierCurveTo(sx, sy + 60, ex, ey - 80, ex, ey); g.stroke();
      if (on) for (var q = 0; q < 2; q++) { var f = ((t * 0.7 + q * 0.5 + i * 0.1) % 1), u = 1 - f, px = u * u * u * sx + 3 * u * u * f * sx + 3 * u * f * f * ex + f * f * f * ex, py = u * u * u * sy + 3 * u * u * f * (sy + 60) + 3 * u * f * f * (ey - 80) + f * f * f * ey; fillE(g, px, py, 3.4, 3.4, c.col); } });
    /* the icons on each shelf; the chosen shelf lifts and its icons bob */
    CATS.forEach(function (c) { var on = act === c || act === 'all', lift = act === c ? -4 : 0;
      if (act === c) { g.strokeStyle = c.col; g.lineWidth = 3; rr(g, c.x - 3, c.y - 3 + lift, SH.w + 6, SH.h + 6, 14); g.stroke(); }
      c.apps.forEach(function (m, j) { var col = j % 4, row = Math.floor(j / 4), ix = c.x + 14 + col * 40, iy = c.y + 30 + row * 40 + lift + (act === c ? Math.sin(t * 4 + j) * 2 : 0), im = IMG[m];
        g.save(); g.globalAlpha = act && !on ? 0.35 : 1; if (im && im.complete && im.naturalWidth) g.drawImage(im, ix, iy, 30, 30); else fillRR(g, ix, iy, 30, 30, 8, '#EEF2F7'); g.restore(); }); });
    /* the drum's glow */
    if (act) { g.save(); g.globalAlpha = 0.25 + 0.15 * Math.sin(t * 4); fillE(g, DB.x, DB.y, 84, 24, act === 'all' ? '#FFD84A' : act.col); g.restore(); }
    /* the planner's laptop: a short list of apps to switch on first */
    var tb = T.table; fillRR(g, tb.x + 23, tb.y - 31, 48, 28, 2, '#FFFFFF'); ['accountant', 'sale', 'stock'].forEach(function (m, j) { var im = IMG[m]; if (im && im.complete && im.naturalWidth) g.drawImage(im, tb.x + 26 + j * 15, tb.y - 26, 12, 12); });
    fillRR(g, tb.x + 26, tb.y - 10, 30, 3, 1.5, '#2BC48A');
  }
  function paintFrontLive(g, t, S) { CO.crew(CREW, g, t, S, true); CR.draw(g, t); }

  function glowCat(k) { return function (g) { var c = CATS.filter(function (x) { return x.key === k; })[0]; rr(g, c.x - 8, c.y - 8, SH.w + 16, SH.h + 16, 16); }; }
  window.IXW.worlds['app-all'] = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: function () {}, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(113,75,103,.2)',
    glow: { finance: glowCat('finance'), sales: glowCat('sales'), supply: glowCat('supply'), hr: glowCat('hr'), services: glowCat('services'), db: function (g) { rr(g, DB.x - 84, DB.y - 26, 168, F - DB.y + 30, 20); } },
    backGlow: ['finance', 'sales', 'supply', 'hr', 'services', 'db'],
    cast: [
      { id: 'con', behind: false, keys: ['finance', 'sales', 'supply'], P: CON, act: function (P, t, S) { var st = S.cast.con, busy = ['finance', 'sales', 'supply', 'hr', 'services'].indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -210], [130, -330 + Math.sin(t * 3) * 8]] : [[-70, -210], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : 0.6, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'cheer', 'think']); } },
      { id: 'own', behind: false, keys: ['db'], P: OWN, act: function (P, t, S) { var st = S.cast.own, busy = S.hot === 'db'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-140, -320 + Math.sin(t * 3) * 8], [70, -170]] : [[-70, -170], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.6, 0.08); CR.cast(P, st, t, ['nod', 'wave', 'cheer', 'id']); } },
      { id: 'pln', behind: true, keys: ['hr', 'services'], P: PLN, act: function (P, t, S) { var st = S.cast.pln, busy = S.hot === 'hr' || S.hot === 'services'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 10 : 3))) * 6; P.hands = [[-80, -206 - k2], [20, -206 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.5, 0.08); CR.cast(P, st, t, ['type', 'nod', 'id', 'wave']); } }
    ],
    toy: function () {},
    hit: function (x, y, S, t) { var w = CR.hitWalker(x, y, t); if (w) return w; var c = catAt(x, y); if (!c) return null; PICK.c = c; PICK.t = t; CR.burst('star', c.x + SH.w / 2, c.y, t);
      return { say: '**' + c.name + '**: ' + c.apps.length + ' apps, all on the same database.', near: [clamp(c.x + SH.w / 2, 200, 900), 190], pose: 'present', who: 'Odoo apps' }; },
    onStop: function () {}
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
