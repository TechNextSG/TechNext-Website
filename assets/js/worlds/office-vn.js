/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: office-vn (/offices/vietnam) — the Ho Chi Minh City hub, TechNext's AI engineering hub, at dusk. Glass all the way
   along onto the city lighting up: the tall stepped tower, the tulip tower, the river with its boats. Inside, an AI lab:
   the agent flow on the wall screen (agents and automation), the "AI in scope?" board, the hologram table with the knowledge
   graph (knowledge and RAG), an engineer at the desk testing an assistant (chatbots and assistants), the GPU racks (local LLM
   deployment) and the screen where it all plugs into Odoo. A neon sign, a silk lantern, a phin of Vietnamese coffee dripping.
   The ceiling stays light so the site header reads. Everyone wears a TechNext ID, in semi-casual clothes. Tap anything. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, OR = '#F08A24', CY = '#5FE3F2', INK = '#0F1422';
  var T = { agents: { x: 160, y: 104, w: 196, h: 134 }, scope: { x: 180, y: 290, w: 124, h: 128 }, holo: { x: 468, y: 404, w: 104 }, desk: { x: 612, y: 386, w: 166 },
    odoo: { x: 604, y: 142, w: 160, h: 92 }, rack: { x: 822, y: 196, w: 146 }, sign: { x: 96, y: -100 }, lantern: { x: 566, y: -60 }, phin: { x: 748, y: 348 } };
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 290, [[0, '#2B2D6E'], [0.45, '#6B4B8F'], [0.8, '#E98A6B'], [1, '#FFC98A']]);
    var glow = g.createRadialGradient(560, 270, 10, 560, 270, 420); glow.addColorStop(0, 'rgba(255,200,140,.5)'); glow.addColorStop(1, 'rgba(255,200,140,0)'); g.fillStyle = glow; g.fillRect(e.l, CEIL, e.r - e.l, 330);
    for (var s = 0; s < 40; s++) { var x = e.l + hash(s * 7.1) * (e.r - e.l), y = CEIL + 20 + hash(s * 3.3) * 120; fillE(g, x, y, 1.2, 1.2, 'rgba(255,255,255,.7)'); }
    CO.skyVN(g, Math.min(e.l, -300), Math.max(e.r, 1500), 290, 318, { landmark: 760, tulip: 420, hazy: 'rgba(60,50,110,.55)', near: ['#3C3A78', '#46418A'], lit: 'rgba(255,214,140,.85)',
      river: 'rgba(255,170,120,.35)', lmCols: ['#4A3F86', '#52479A', '#5A4FA6', '#6458B2'], tulipCol: '#4C4592' });
    var lo = g.createLinearGradient(0, 330, 0, F); lo.addColorStop(0, 'rgba(20,22,48,.05)'); lo.addColorStop(1, 'rgba(20,22,48,.6)'); g.fillStyle = lo; g.fillRect(e.l, 330, e.r - e.l, F - 330);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    g.fillStyle = 'rgba(255,255,255,.06)'; for (var gx = Math.floor(e.l / 120) * 120; gx < e.r; gx += 120) { g.beginPath(); g.moveTo(gx + 20, F); g.lineTo(gx + 44, CEIL); g.lineTo(gx + 58, CEIL); g.lineTo(gx + 34, F); g.closePath(); g.fill(); }
    g.fillStyle = '#20253F'; for (var mx = Math.floor(e.l / 120) * 120; mx < e.r; mx += 120) g.fillRect(mx - 3, CEIL, 6, F - CEIL); g.fillRect(e.l, 40, e.r - e.l, 5);
    /* the ceiling stays light (the site header sits over it), with a cyan light line */
    var cg = g.createLinearGradient(0, e.t, 0, CEIL); cg.addColorStop(0, '#EEF1F8'); cg.addColorStop(1, '#DCE1EE'); g.fillStyle = cg; g.fillRect(e.l, e.t, e.r - e.l, CEIL - e.t);
    g.fillStyle = '#20253F'; g.fillRect(e.l, CEIL - 6, e.r - e.l, 8); g.fillStyle = CY; g.globalAlpha = 0.8; g.fillRect(e.l, CEIL + 2, e.r - e.l, 2); g.globalAlpha = 1;
    /* the floor: dark resin with a cyan grid running to the window */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#262B4A'); fl.addColorStop(1, '#171B33'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(95,227,242,.14)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 8; d++) { var yy = F + Math.pow(d / 7, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var i = -30; i <= 30; i++) { g.moveTo(560 + i * 70, F); g.lineTo(560 + i * 180, e.b + 40); } g.stroke();
    g.fillStyle = 'rgba(255,170,120,.12)'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.restore();
  }

  function paintBack(g, ext) {
    /* the neon sign's backplate */
    var sg = T.sign; fillRR(g, sg.x - 6, sg.y - 6, 200, 64, 12, '#141830');
    /* the agent flow screen on the wall */
    var a = T.agents; shadowed(g, 16, 6, 0.4, function () { fillRR(g, a.x - 6, a.y - 6, a.w + 12, a.h + 12, 8, '#0B0E1D'); }); fillRR(g, a.x, a.y, a.w, a.h, 4, '#121833');
    text(g, 'AGENT · ORDER FOLLOW-UP · SAMPLE', a.x + 10, a.y + 15, 6.6, 800, CY);
    g.fillStyle = '#7A869C'; g.fillRect(a.x + a.w / 2 - 3, a.y + a.h + 6, 6, 40);
    /* the "AI in scope?" board on wheels */
    var b = T.scope; soft(g, b.x + b.w / 2, F + 4, 70, 7, 0.35); g.fillStyle = '#5C6B7A'; g.fillRect(b.x + 12, b.y + b.h, 4, F - b.y - b.h - 6); g.fillRect(b.x + b.w - 16, b.y + b.h, 4, F - b.y - b.h - 6); fillE(g, b.x + 14, F - 3, 3.5, 3.5, '#0B0E1D'); fillE(g, b.x + b.w - 14, F - 3, 3.5, 3.5, '#0B0E1D');
    fillRR(g, b.x, b.y, b.w, b.h, 5, '#F4F6FB'); fillRR(g, b.x, b.y, b.w, 18, 5, OR); g.fillRect(b.x, b.y + 12, b.w, 6); text(g, 'AI IN SCOPE?', b.x + b.w / 2, b.y + 13, 7.5, 800, '#FFFFFF', 'center');
    /* the GPU racks */
    var r = T.rack; soft(g, r.x + r.w / 2, F + 4, 90, 9, 0.4);
    for (var c = 0; c < 2; c++) { var rx = r.x + c * 76; fillRR(g, rx, r.y, 70, F - r.y, 5, '#151A30'); fillRR(g, rx + 4, r.y + 6, 62, F - r.y - 12, 3, '#1E2442');
      for (var u = 0; u < 11; u++) { fillRR(g, rx + 8, r.y + 12 + u * 22, 54, 16, 2, '#0D1124'); g.fillStyle = 'rgba(95,227,242,.08)'; g.fillRect(rx + 10, r.y + 14 + u * 22, 50, 2); } }
    text(g, 'GPU · LOCAL LLM', r.x + r.w / 2 + 3, r.y - 8, 8, 800, CY, 'center');
    /* the Odoo screen over the desk */
    var o = T.odoo; shadowed(g, 14, 5, 0.4, function () { fillRR(g, o.x - 5, o.y - 5, o.w + 10, o.h + 10, 7, '#0B0E1D'); }); fillRR(g, o.x, o.y, o.w, o.h, 3, '#FFFFFF');
    fillRR(g, o.x, o.y, o.w, 14, 3, C.odoo); g.fillRect(o.x, o.y + 8, o.w, 6); text(g, 'CONNECTED TO ODOO', o.x + 8, o.y + 10.5, 6.4, 800, '#FFFFFF');
    /* the cable from the racks to the Odoo screen, along the ceiling */
    g.strokeStyle = '#2F3760'; g.lineWidth = 4; g.beginPath(); g.moveTo(r.x + 20, r.y); g.lineTo(r.x + 20, 120); g.lineTo(o.x + o.w - 20, 120); g.lineTo(o.x + o.w - 20, o.y - 5); g.stroke();
    /* a plant in the corner */
    K.plant(g, { x: 1010, y: F }, '#2F3760', '#3A4472');
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#3A4472', top: '#3A4472', mons: [[d.x + 22, 96, 56]] });
    /* the phin's cup and glass */
    var p = T.phin; fillRR(g, p.x - 12, p.y + 14, 24, 22, 4, 'rgba(255,255,255,.85)'); fillRR(g, p.x - 14, p.y + 4, 28, 6, 3, '#B9C3D1'); fillRR(g, p.x - 10, p.y - 14, 20, 18, 3, '#C9D1DD'); fillRR(g, p.x - 8, p.y - 20, 16, 6, 3, '#AEB8C8');
    /* the hologram table */
    var h = T.holo, hc = h.x + h.w / 2; soft(g, hc, F + 4, 60, 8, 0.4); fillRR(g, hc - 12, h.y + 10, 24, F - h.y - 14, 4, '#2F3760'); fillRR(g, hc - 30, F - 8, 60, 8, 4, '#20253F');
    fillE(g, hc, h.y + 8, h.w / 2 + 6, 10, '#20253F'); fillE(g, hc, h.y + 4, h.w / 2, 9, '#2F3760'); fillE(g, hc, h.y + 4, h.w / 2 - 14, 5, CY);
  }

  var W = CR.who;
  var EN1 = W({ x: 398, y: 470, s: 0.54, ph: 0.6, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: '#F08A24', glasses: true, hands: [[-70, -150], [130, -300]], look: 0.6 });
  var EN2 = W({ x: 694, y: 470, s: 0.54, ph: 1.7, skin: 1, hair: 1, style: 'bob', outfit: 'cardigan', top: '#46418A', top2: '#FFFFFF', headset: '#5FE3F2', sit: true, chairCol: '#2F3760', hands: [[-60, -200], [60, -200]] });
  var CREW = [
    { x0: -320, x1: 60, y: 486, spd: 16, ph: 0.3, label: 'Data engineer, Ho Chi Minh City', lines: ['Cleaning the data **before** the model sees it.', 'Xin chào! Good data makes **good answers**.'], acts: ['wave', 'id', 'think'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#5FE3F2', top2: '#0F1422', glasses: true, hold: 'tablet' }) },
    { x0: 1030, x1: 1360, y: 488, spd: 14, ph: 0.7, label: 'AI engineer, Ho Chi Minh City', lines: ['Evaluating answers against **your own documents**.', 'Late sunset, early prototype!'], acts: ['nod', 'dance', 'id'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'pony', outfit: 'shirt', top: '#E0456B' }) },
    { front: true, x0: -380, x1: 40, y: 690, spd: 20, ph: 0.4, label: 'Machine learning engineer', lines: ['Fine-tuning is the **last** resort. Retrieval first.', 'My TechNext ID opens the **GPU room**.'], acts: ['cheer', 'id', 'spin'],
      P: W({ s: 0.58, skin: 1, hair: 0, style: 'short', outfit: 'cardigan', top: '#2F3760', top2: '#F08A24', glasses: true, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) }
  ];

  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the neon sign: flickers on its own; tapped, it runs through its colours */
    var sg = T.sign, nt = t - (S.toy.neon != null ? S.toy.neon : -9), flick = (t % 7) > 6.7 ? 0.3 : 1, col = nt < 2 ? ['#FF6F91', CY, OR, '#B79CFF'][Math.floor(nt * 4) % 4] : CY;
    g.save(); g.globalAlpha = flick; g.shadowColor = col; g.shadowBlur = 14; text(g, 'AI LAB', sg.x + 94, sg.y + 28, 22, 800, col, 'center'); g.shadowBlur = 0; g.restore();
    text(g, 'HO CHI MINH CITY', sg.x + 94, sg.y + 46, 8, 800, 'rgba(255,255,255,.75)', 'center');
    /* the silk lantern on its string: sways; tapped, it spins and glows */
    var lt = t - (S.toy.lantern != null ? S.toy.lantern : -9), sw = Math.sin(t * 1.2) * 0.06 + (lt < 2 ? Math.sin(lt * 10) * 0.3 * (2 - lt) : 0), L = T.lantern;
    g.save(); g.translate(L.x, CEIL + 2); g.rotate(sw); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 70); g.stroke();
    if (lt < 2) { g.globalAlpha = 0.5; fillE(g, 0, 100, 46, 46, 'rgba(255,170,90,.5)'); g.globalAlpha = 1; }
    fillE(g, 0, 100, 24, 30, '#E2453C'); g.strokeStyle = '#B5302A'; g.lineWidth = 1.5; for (var q = -2; q <= 2; q++) { g.beginPath(); g.ellipse(0, 100, Math.abs(q) * 6 + 0.5, 30, 0, 0, Math.PI * 2); g.stroke(); }
    fillRR(g, -10, 68, 20, 5, 2, '#F2B233'); fillRR(g, -10, 128, 20, 5, 2, '#F2B233'); g.strokeStyle = '#F2B233'; g.beginPath(); g.moveTo(0, 133); g.lineTo(0, 152); g.stroke(); g.restore();
    /* agents: a trigger fires, the agent decides, Odoo acts; on the Agents stop it runs fast */
    var a = T.agents, ag = S.hot === 'agents', sp = ag ? 1.6 : 0.5, ph = (t * sp) % 3;
    [['Overdue\ninvoice', 18, '#3167CA'], ['Agent\ndecides', 76, OR], ['Reminder\nin Odoo', 134, C.odoo]].forEach(function (n, i) { var nx = a.x + n[1], ny = a.y + 36, on = ph > i;
      fillRR(g, nx, ny, 48, 40, 8, on ? n[2] : '#232B52'); n[0].split('\n').forEach(function (ln, j) { text(g, ln, nx + 24, ny + 17 + j * 10, 6, 800, '#FFFFFF', 'center'); });
      if (i < 2) { g.strokeStyle = ph > i + 0.5 ? CY : '#3A4472'; g.lineWidth = 2; g.beginPath(); g.moveTo(nx + 49, ny + 20); g.lineTo(nx + 57, ny + 20); g.stroke(); } });
    for (var lg = 0; lg < 3; lg++) { var w = 30 + hash(lg + Math.floor(t * (ag ? 3 : 1))) * 120; fillRR(g, a.x + 14, a.y + 92 + lg * 12, w, 4, 2, ['#3A4472', '#2F6B7A', '#4A3F86'][lg]); }
    /* the scope board: three questions get their ticks */
    var b = T.scope, sc = S.hot === 'scope' ? clamp((t - (S.sT || 0)) / 1.6, 0, 1) : 1;
    ['Repeating work?', 'Your own documents?', 'Connected to Odoo?'].forEach(function (q, i) { var y = b.y + 34 + i * 30, done = sc > i / 3; fillRR(g, b.x + 8, y - 10, 14, 14, 3, done ? '#2BC48A' : '#E3E8EF');
      if (done) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(b.x + 11, y - 3); g.lineTo(b.x + 14, y); g.lineTo(b.x + 19, y - 6); g.stroke(); } text(g, q, b.x + 28, y + 1, 6.6, 800, INK); });
    /* the racks' lights: a wave on the LLM stop or when tapped */
    var r = T.rack, rt = t - (S.toy.rack != null ? S.toy.rack : -9), wave = S.hot === 'llm' || rt < 2;
    for (var c = 0; c < 2; c++) for (var u = 0; u < 11; u++) for (var l = 0; l < 4; l++) { var on = wave ? Math.abs(u - (t * 9 + c * 2) % 13) < 1.3 : hash(u * 4 + l + c * 50 + Math.floor(t * 3 + u)) > 0.55;
      fillE(g, r.x + c * 76 + 16 + l * 8, r.y + 20 + u * 22, 1.8, 1.8, on ? (l === 3 ? OR : CY) : '#2A3156'); }
    /* data pulses along the cable to Odoo */
    var o = T.odoo, path = [[r.x + 20, r.y], [r.x + 20, 120], [o.x + o.w - 20, 120], [o.x + o.w - 20, o.y - 5]], pulses = S.hot === 'odoo' ? 5 : 2;
    for (var pi = 0; pi < pulses; pi++) { var q2 = ((t * 0.5 + pi / pulses) % 1) * 3, seg = Math.min(2, Math.floor(q2)), f = q2 - seg, p0 = path[seg], p1 = path[seg + 1]; fillE(g, lerp(p0[0], p1[0], f), lerp(p0[1], p1[1], f), 3, 3, CY); }
    /* the Odoo screen: apps light as answers arrive */
    var od = S.hot === 'odoo' ? Math.floor((t - (S.oT || 0)) * 2) : Math.floor(t * 0.6);
    [['Sales', '#3167CA'], ['Inventory', '#14A38B'], ['Helpdesk', '#E0456B'], ['Documents', '#F2B233']].forEach(function (ap, i) { var ax = o.x + 8 + (i % 2) * 76, ay = o.y + 22 + Math.floor(i / 2) * 32, on = (od % 5) > i;
      fillRR(g, ax, ay, 68, 26, 4, on ? '#F1F4F9' : '#F7F8FB'); fillRR(g, ax + 4, ay + 5, 16, 16, 3, ap[1]); text(g, ap[0], ax + 24, ay + 16, 6.4, 800, INK); if (on) fillE(g, ax + 62, ay + 6, 3, 3, '#2BC48A'); });
    /* the hologram: the knowledge graph turns; documents orbit; on Knowledge, an answer card rises */
    var h = T.holo, hc = h.x + h.w / 2, kn = S.hot === 'knowledge', spd = kn ? 2.4 : 0.8;
    g.save(); var beam = g.createLinearGradient(0, h.y, 0, h.y - 170); beam.addColorStop(0, 'rgba(95,227,242,.4)'); beam.addColorStop(1, 'rgba(95,227,242,0)'); g.fillStyle = beam;
    g.beginPath(); g.moveTo(hc - 30, h.y + 2); g.lineTo(hc + 30, h.y + 2); g.lineTo(hc + 56, h.y - 170); g.lineTo(hc - 56, h.y - 170); g.closePath(); g.fill();
    var nodes = []; for (var n = 0; n < 7; n++) { var an = t * spd * 0.4 + n * Math.PI * 2 / 7, rad = 26 + (n % 3) * 10; nodes.push([hc + Math.cos(an) * rad, h.y - 90 + Math.sin(an) * rad * 0.45 + (n % 2 ? -14 : 10)]); }
    g.strokeStyle = 'rgba(95,227,242,.55)'; g.lineWidth = 1; g.beginPath(); nodes.forEach(function (p, i) { var q = nodes[(i + 2) % 7]; g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.moveTo(p[0], p[1]); g.lineTo(hc, h.y - 90); }); g.stroke();
    nodes.forEach(function (p, i) { if (i % 3 === 0) { fillRR(g, p[0] - 5, p[1] - 6, 10, 12, 1.5, '#FFFFFF'); g.fillStyle = '#9FC4FF'; g.fillRect(p[0] - 3, p[1] - 3, 6, 1.2); g.fillRect(p[0] - 3, p[1], 5, 1.2); } else fillE(g, p[0], p[1], 3, 3, i % 2 ? CY : OR); });
    fillE(g, hc, h.y - 90, 7, 7, '#FFFFFF'); g.restore();
    if (kn) { var ka = clamp((t - (S.kT || 0)) * 2, 0, 1); g.save(); g.globalAlpha = ka; fillRR(g, hc - 70, h.y - 196, 140, 32, 9, 'rgba(255,255,255,.95)');
      text(g, 'Answer from SOP-12 · Returns', hc, h.y - 182, 6.6, 800, INK, 'center'); text(g, 'with the source quoted · sample', hc, h.y - 171, 6, 700, '#5C5C73', 'center'); g.restore(); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the assistant on the desk monitor: a question, then the answer types in */
    var d = T.desk, mx = d.x + 26, my = d.y - 78, ch = S.hot === 'chatbots', tt = ch ? (t - (S.cT || 0)) : (t % 8);
    fillRR(g, mx, my, 88, 48, 2, '#121833'); fillRR(g, mx + 30, my + 5, 54, 11, 5, '#3167CA'); text(g, 'Stock of SKU-204?', mx + 57, my + 12.5, 5, 800, '#FFFFFF', 'center');
    var n = Math.floor(clamp((tt - 0.6) * 14, 0, 26)); fillRR(g, mx + 4, my + 20, 62, 22, 5, '#232B52'); text(g, '86 in Main, 12 reserved'.slice(0, n), mx + 8, my + 30, 5, 800, '#E6ECF8'); text(g, 'Inventory · sample'.slice(0, Math.max(0, n - 6)), mx + 8, my + 38, 4.6, 700, CY);
    /* the phin: drips; tapped, the coffee runs */
    var p = T.phin, pt = t - (S.toy.phin != null ? S.toy.phin : -9), fast = pt < 3, dr = (t * (fast ? 3 : 0.8)) % 1;
    fillE(g, p.x, p.y + 6 + dr * 14, 1.6, 2.2, '#6B4329'); fillRR(g, p.x - 10, p.y + 30 - (fast ? Math.min(14, pt * 6) : 4), 20, fast ? Math.min(14, pt * 6) : 4, 2, '#5A3A22');
    if (fast) for (var s2 = 0; s2 < 3; s2++) { var sy2 = ((t * 16 + s2 * 10) % 30); g.globalAlpha = (1 - sy2 / 30) * 0.7; fillE(g, p.x + Math.sin(t * 2 + s2) * 3, p.y - 20 - sy2, 3.5, 3.5, '#FFFFFF'); } g.globalAlpha = 1;
    CR.draw(g, t);
  }

  window.IXW.worlds['office-vn'] = {
    pan: [-300, 1060],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t, par, S) {
      /* the city lights up window by window; boats with their lights on the river */
      for (var i = 0; i < 26; i++) { var x = 120 + hash(i * 5.3) * 880, y = 200 + hash(i * 2.9) * 100, on = ((t * 0.3 + hash(i)) % 1) > 0.35; if (on) { g.fillStyle = 'rgba(255,214,140,.95)'; g.fillRect(x, y, 3, 3.4); } }
      for (var b = 0; b < 3; b++) { var bx = -200 + ((t * (6 + b * 2) + b * 300) % 1400); fillRR(g, bx, 322 + b * 6, 30, 5, 2, '#1B1F3B'); fillE(g, bx + 4, 321 + b * 6, 2, 2, '#FFD27A'); fillE(g, bx + 26, 321 + b * 6, 2, 2, '#FF8A80'); }
    },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(95,227,242,.5)',
    glow: {
      agents: function (g) { var a = T.agents; rr(g, a.x - 12, a.y - 12, a.w + 24, a.h + 24, 10); },
      scope: function (g) { var b = T.scope; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 10); },
      knowledge: function (g) { var h = T.holo; rr(g, h.x - 26, h.y - 180, h.w + 52, F - h.y + 186, 16); },
      chatbots: function (g) { var d = T.desk; rr(g, d.x + 16, d.y - 90, 108, 70, 10); },
      llm: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 20, r.w + 16, F - r.y + 24, 12); },
      odoo: function (g) { var o = T.odoo; rr(g, o.x - 12, o.y - 12, o.w + 24, o.h + 24, 10); },
      neon: function (g) { var s = T.sign; rr(g, s.x - 10, s.y - 10, 208, 72, 14); },
      lantern: function (g) { var L = T.lantern; rr(g, L.x - 32, CEIL + 64, 64, 96, 26); },
      phin: function (g) { var p = T.phin; rr(g, p.x - 18, p.y - 26, 36, 66, 8); },
      rack: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 20, r.w + 16, F - r.y + 24, 12); }
    },
    backGlow: ['agents', 'scope', 'llm', 'odoo', 'neon', 'rack'],
    cast: [
      { id: 'en1', behind: false, keys: ['knowledge', 'scope'], P: EN1, act: function (P, t, S) { var st = S.cast.en1, busy = S.hot === 'knowledge'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -150], [140 + Math.sin(t * 3) * 14, -330]] : [[-70, -150], [120, -290 + Math.sin(t * 1.4) * 8]]; P.look = lerp(P.look, busy ? 0.8 : clamp((S.nexi.x - P.x) / 160, -1, 1), 0.08); CR.cast(P, st, t, ['think', 'wave', 'id', 'jump', 'cheer']); } },
      { id: 'en2', behind: true, keys: ['chatbots'], P: EN2, act: function (P, t, S) { var st = S.cast.en2, busy = S.hot === 'chatbots'; P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm';
        var k2 = Math.abs(Math.sin(t * (busy ? 14 : 5))) * 6; P.hands = [[-70, -200 - k2], [60, -200 - (6 - k2)]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.5, 0.08); CR.cast(P, st, t, ['type', 'wave', 'id', 'dance', 'love']); } }
    ],
    toy: function (name, S, t, btn) {
      if (name === 'neon' && btn) btn.setAttribute('data-say', CO.timeLine(7, 'Ho Chi Minh City', 'an hour behind Singapore and Taguig City. The **AI lab** keeps the lights on.'));
      if (name === 'rack') CR.burst('code', T.rack.x + 70, T.rack.y + 20, t);
    },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { if (key === 'scope') S.sT = t; if (key === 'odoo') S.oT = t; if (key === 'knowledge') S.kT = t; if (key === 'chatbots') S.cT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
