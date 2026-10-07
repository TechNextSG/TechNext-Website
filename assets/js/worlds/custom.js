/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: custom (/odoo/erp-system) — Odoo customization, standard first. A bright dev studio: the wall stack climbs from
   standard apps through configuration and Studio to a custom module, and only climbs when it must; the upgrade check carries
   the custom module from this version to the next and ticks it upgrade-safe; the three ways to run Odoo (Odoo Online, Odoo.sh,
   on-premise); two TechNext developers seated at their code (chairs, legs and feet) and a reviewer standing by; the
   custom_approvals module packed in its crate. Everyone wears a TechNext ID. Tap anyone, a layer, the screens or the crate. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, BLUE = '#3167CA', PINK = '#E0456B', PUR = '#714B67';
  var ST = { x: 300, y: -110, w: 330, h: 290 }, UP = { x: 662, y: -104, w: 300, h: 100 }, ED = { x: 662, y: 14, w: 300, h: 120 }, T = { desk: { x: 376, y: 392, w: 444 }, crate: { x: 1004, y: 400, w: 96 } };
  var LAYERS = [{ key: 'standard', name: 'Standard apps', sub: 'one database, switched on as needed', col: '#2E9C7E', w: 300 },
    { key: 'config', name: 'Configuration', sub: 'settings, rules, reports', col: BLUE, w: 250 },
    { key: 'studio', name: 'Studio', sub: 'fields, views, approvals', col: PINK, w: 200 },
    { key: 'module', name: 'Custom module', sub: 'only where it earns its place', col: PUR, w: 150 }];
  var CODE = [['class ', 'SaleOrder', '(models.Model):'], ['    _inherit = ', '"sale.order"', ''], ['    approval_required = ', 'fields.Boolean()', ''], ['', '', ''], ['    def ', 'action_confirm', '(self):'], ['        self.', '_check_approval', '()'], ['        return ', 'super()', '.action_confirm()']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function layerY(i) { return ST.y + ST.h - 62 - i * 62; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F6F8FD'); wg.addColorStop(1, '#E9EEF8'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    /* a soft blueprint grid on the wall */
    g.strokeStyle = 'rgba(49,103,202,.07)'; g.lineWidth = 1; g.beginPath(); for (var x = Math.floor(e.l / 24) * 24; x < e.r; x += 24) { g.moveTo(x, CEIL); g.lineTo(x, 250); } for (var y = CEIL; y < 250; y += 24) { g.moveTo(e.l, y); g.lineTo(e.r, y); } g.stroke();
    g.fillStyle = '#DFE6F3'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#CFD9EC'; g.fillRect(e.l, 246, e.r - e.l, 5);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 220, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 300); }
    CO.ceiling(g, e, CEIL, '#EEF2F8', '#F8FAFD', '#FFFFFF');
    CO.floor(g, e, F, '#E7EBF1', '#D6DDE7', 'rgba(40,70,120,.08)');
    g.restore();
  }
  function paintFrame(g) {}
  function paintBack(g, ext) {
    /* the stack panel */
    shadowed(g, 14, 5, 0.14, function () { fillRR(g, ST.x, ST.y, ST.w, ST.h, 14, '#FFFFFF'); });
    text(g, 'STANDARD FIRST', ST.x + 16, ST.y + 22, 9, 800, '#8A96A8'); text(g, 'climb only when you must', ST.x + 16, ST.y + 36, 8, 700, '#B0BAC9');
    /* the upgrade check and the editions */
    [UP, ED].forEach(function (b) { shadowed(g, 12, 4, 0.14, function () { fillRR(g, b.x, b.y, b.w, b.h, 12, '#FFFFFF'); }); });
    text(g, 'UPGRADE CHECK', UP.x + 14, UP.y + 20, 8.5, 800, '#8A96A8'); text(g, 'This version', UP.x + 24, UP.y + 88, 8, 700, '#5C6B7A'); text(g, 'Next version', UP.x + UP.w - 24, UP.y + 88, 8, 700, '#5C6B7A', 'right');
    text(g, 'RUNS ON', ED.x + 14, ED.y + 20, 8.5, 800, '#8A96A8');
    [['Odoo Online', 'Odoo\'s cloud', '#3167CA'], ['Odoo.sh', 'custom code ok', PUR], ['On-premise', 'your servers', '#1B1F3B']].forEach(function (e, i) { var x = ED.x + 14 + i * 96;
      fillRR(g, x, ED.y + 30, 86, 78, 10, '#F6F8FC'); text(g, e[0], x + 43, ED.y + 88, 8.5, 800, '#1B1F3B', 'center'); text(g, e[1], x + 43, ED.y + 100, 6.6, 700, '#8A96A8', 'center');
      var cx = x + 43, cy = ED.y + 56; g.fillStyle = e[2];
      if (i === 0) { g.beginPath(); g.arc(cx - 8, cy + 2, 8, 0, 7); g.arc(cx + 2, cy - 4, 10, 0, 7); g.arc(cx + 11, cy + 3, 7, 0, 7); g.fill(); g.fillRect(cx - 8, cy + 2, 19, 8); }
      else if (i === 1) { fillRR(g, cx - 14, cy - 12, 28, 24, 6, e[2]); text(g, '.sh', cx, cy + 4, 9, 800, '#FFFFFF', 'center'); }
      else { for (var u = 0; u < 3; u++) { fillRR(g, cx - 14, cy - 12 + u * 9, 28, 7, 2, e[2]); fillE(g, cx + 9, cy - 8.5 + u * 9, 1.6, 1.6, '#2BC48A'); } } });
    K.plant(g, { x: 1180, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    [388, 598].forEach(function (mx) { fillRR(g, mx - 4, d.y - 86, 128, 76, 6, '#2A3142'); fillRR(g, mx + 54, d.y - 10, 12, 10, 2, '#5C6B7A'); fillRR(g, mx + 36, d.y - 3, 48, 4, 2, '#5C6B7A'); });
    /* the module crate */
    var c = T.crate; soft(g, c.x + c.w / 2, F + 4, 60, 7, 0.3); fillRR(g, c.x, c.y, c.w, F - c.y, 4, '#C9A27A'); g.strokeStyle = '#A07A52'; g.lineWidth = 3; g.strokeRect(c.x + 4, c.y + 4, c.w - 8, F - c.y - 8);
    g.beginPath(); g.moveTo(c.x + 4, c.y + 4); g.lineTo(c.x + c.w - 4, F - 4); g.stroke(); fillRR(g, c.x + 12, c.y + 22, c.w - 24, 18, 3, '#FFFFFF'); text(g, 'custom_approvals', c.x + c.w / 2, c.y + 34, 6.4, 800, PUR, 'center');
  }

  var W = CR.who;
  var DV1 = W({ x: 562, y: 470, s: 0.5, ph: 0.6, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: PUR, glasses: true, sit: true, chairCol: '#2A3550', hands: [[-60, -206], [60, -206]] });
  var DV2 = W({ x: 772, y: 470, s: 0.5, ph: 1.8, skin: 0, hair: 1, style: 'pony', outfit: 'polo', top: PINK, sit: true, chairCol: '#2A3550', hands: [[-60, -206], [60, -206]] });
  var REV = W({ x: 930, y: 470, s: 0.54, ph: 2.6, skin: 3, hair: 0, style: 'short', outfit: 'cardigan', top: '#1E3A6E', top2: '#FFFFFF', hold: 'tablet', hands: [[-70, -210], [70, -170]], look: -0.6 });
  var CREW = [
    { x0: 1190, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext consultant', lines: ['Can **configuration** do it? Then no code.', 'Studio first, module last. That is the rule.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 2, hair: 1, style: 'long', outfit: 'polo', top: '#2E9C7E', hold: 'clipboard' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext developer', lines: ['Written so **another developer** can maintain it.', 'Tested against the **next version** before it ships.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: BLUE, hold: 'tablet', hands: [[-60, -212], [70, -150]] }) }
  ];

  var CR8 = { t: -9 };
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the stack: layers light up to the level the process needs; a marker climbs only as far as it must */
    var lvl = S.hot && LAYERS.some(function (L) { return L.key === S.hot; }) ? LAYERS.map(function (L) { return L.key; }).indexOf(S.hot) : Math.floor((t * 0.35) % 5) - 1;
    LAYERS.forEach(function (L, i) { var y = layerY(i), x = ST.x + (ST.w - L.w) / 2, on = i <= lvl;
      fillRR(g, x, y, L.w, 50, 10, on ? L.col : '#F1F4F9'); text(g, L.name, x + L.w / 2, y + 22, 10.5, 800, on ? '#FFFFFF' : '#9AA6BC', 'center'); text(g, L.sub, x + L.w / 2, y + 37, 7, 700, on ? 'rgba(255,255,255,.85)' : '#B0BAC9', 'center'); });
    if (lvl >= 0) { var my = layerY(lvl) + 25; fillE(g, ST.x + 20, my, 7, 7, '#FFD84A'); g.fillStyle = '#FFD84A'; g.beginPath(); g.moveTo(ST.x + 28, my); g.lineTo(ST.x + 36, my - 5); g.lineTo(ST.x + 36, my + 5); g.fill(); }
    /* the upgrade check: core + your module travel from this version to the next; the module is ticked upgrade-safe */
    var up = S.hot === 'upgrade', f = up ? ((t - (S.kT || 0)) * 0.5) % 1.4 : (t * 0.15) % 1.4, p = clamp(f, 0, 1), bx = lerp(UP.x + 24, UP.x + UP.w - 134, p);
    g.strokeStyle = '#E3E9F0'; g.lineWidth = 3; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(UP.x + 24, UP.y + 54); g.lineTo(UP.x + UP.w - 24, UP.y + 54); g.stroke(); g.setLineDash([]);
    fillRR(g, bx, UP.y + 34, 52, 40, 8, '#2E9C7E'); text(g, 'Odoo core', bx + 26, UP.y + 58, 7.4, 800, '#FFFFFF', 'center');
    fillRR(g, bx + 58, UP.y + 34, 52, 40, 8, PUR); text(g, 'your module', bx + 84, UP.y + 58, 7, 800, '#FFFFFF', 'center');
    if (p >= 1) { fillE(g, bx + 110, UP.y + 34, 9, 9, '#2BC48A'); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(bx + 105.5, UP.y + 34); g.lineTo(bx + 109, UP.y + 37.5); g.lineTo(bx + 115, UP.y + 30.5); g.stroke(); text(g, 'Upgrade-safe', UP.x + UP.w / 2, UP.y + 24, 8, 800, '#1E9E6A', 'center'); }
    /* the editions light in turn */
    var ei = S.hot === 'editions' ? Math.floor(t * 1.4) % 3 : -1; if (ei >= 0) { g.strokeStyle = ['#3167CA', PUR, '#1B1F3B'][ei]; g.lineWidth = 2.5; rr(g, ED.x + 14 + ei * 96, ED.y + 30, 86, 78, 10); g.stroke(); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the developers' screens: the custom_approvals module, typed in line by line */
    var d = T.desk, fast = S.hot === 'code', n = Math.floor((t * (fast ? 4 : 1.3)) % 10);
    [388, 598].forEach(function (mx, k) { var my = d.y - 82; fillRR(g, mx, my, 120, 68, 3, '#FFFFFF'); fillRR(g, mx, my, 120, 10, 3, '#EEF2F7'); text(g, k ? 'sale_order.py' : 'custom_approvals', mx + 5, my + 7.6, 4.8, 800, '#5C6B7A');
      CODE.forEach(function (ln, i) { if (k === 0 && i > n) return; var y = my + 17 + i * 7.4; g.font = '700 4.6px ui-monospace, Consolas, monospace'; g.textAlign = 'left';
        var x = mx + 5; g.fillStyle = PUR; g.fillText(ln[0], x, y); x += g.measureText(ln[0]).width; g.fillStyle = BLUE; g.fillText(ln[1], x, y); x += g.measureText(ln[1]).width; g.fillStyle = '#3D4560'; g.fillText(ln[2], x, y); });
      if (k === 1) { fillRR(g, mx + 70, my + 54, 46, 10, 5, '#DDF5EA'); text(g, 'tests pass', mx + 93, my + 61.5, 5, 800, '#1E9E6A', 'center'); } });
    /* the crate opens when tapped (or on the Module stop) */
    var c = T.crate, op = S.hot === 'module' ? 1 : clamp((2.4 - (t - CR8.t)) * 2, 0, 1);
    if (op > 0) { g.save(); g.translate(c.x, c.y); g.rotate(-0.5 * op); fillRR(g, -2, -8, c.w + 4, 10, 3, '#B8916A'); g.restore();
      g.save(); g.globalAlpha = op; fillRR(g, c.x + 20, c.y - 34 * op, 56, 30, 7, PUR); text(g, 'module', c.x + 48, c.y - 34 * op + 19, 8, 800, '#FFFFFF', 'center'); g.restore(); }
    CR.draw(g, t);
  }

  function dev(id, keys, P, acts) { return { id: id, behind: true, keys: keys, P: P, act: function (P, t, S) { var st = S.cast[id], busy = keys.indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    var k2 = Math.abs(Math.sin(t * (busy ? 13 : 5) + P.ph)) * 6; P.hands = [[-60, -206 - k2], [60, -206 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.2, 0.08); CR.cast(P, st, t, acts); } }; }
  window.IXW.worlds.custom = {
    pan: [-300, 1180],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(49,103,202,.2)',
    glow: (function () { var o = {}; LAYERS.forEach(function (L, i) { o[L.key] = function (g) { rr(g, ST.x + (ST.w - L.w) / 2 - 8, layerY(i) - 8, L.w + 16, 66, 14); }; });
      o.upgrade = function (g) { rr(g, UP.x - 8, UP.y - 8, UP.w + 16, UP.h + 16, 14); }; o.editions = function (g) { rr(g, ED.x - 8, ED.y - 8, ED.w + 16, ED.h + 16, 14); };
      o.code = function (g) { rr(g, 378, 300, 140, 90, 12); }; o.crate = function (g) { var c = T.crate; rr(g, c.x - 8, c.y - 8, c.w + 16, F - c.y + 12, 10); }; return o; })(),
    backGlow: ['standard', 'config', 'studio', 'module', 'upgrade', 'editions', 'crate'],
    cast: [
      dev('dv1', ['code'], DV1, ['type', 'nod', 'id', 'think']),
      dev('dv2', ['upgrade'], DV2, ['cheer', 'type', 'id', 'wave']),
      { id: 'rev', behind: false, keys: ['standard', 'config', 'studio', 'module'], P: REV, act: function (P, t, S) { var st = S.cast.rev, busy = ['standard', 'config', 'studio', 'module'].indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -210], [-150, -320 + Math.sin(t * 3) * 8]] : [[-70, -210], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.6, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'think', 'cheer']); } }
    ],
    toy: function (name, S, t) { if (name === 'crate') { CR8.t = t; CR.burst('code', T.crate.x + 48, T.crate.y - 20, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
