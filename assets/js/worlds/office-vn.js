/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: office-vn (/offices/vietnam) — the Ho Chi Minh City hub, TechNext's AI engineering hub, on a bright day. Glass all
   the way along onto the city in the sun: the tall stepped tower, the tulip tower, the river with its boats and the road
   along it full of scooters. Inside, a light AI lab under hexagon ceiling baffles wired like a neural net (pulses run along
   the wires): the agent flow on the wall screen (agents and automation), the "AI in scope?" board, the hologram table with
   the knowledge graph (knowledge and RAG), an engineer at the desk testing an assistant (chatbots and assistants), the GPU
   racks (local LLM deployment) and the screen where it all plugs into Odoo. The lit AI LAB sign, silk lanterns, a phin of
   Vietnamese coffee dripping. Wide screens add the cà phê corner (a teammate on a low stool with an iced coffee), the RAG
   whiteboard and the lab's entrance. Day mode, light mode: white walls, pale floor, white screens. Everyone wears a
   TechNext ID, in semi-casual clothes; each has their own idle loop and tap choreography (co-life.js). Tap anything. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, OR = '#F08A24', CY = '#0EA5B7', CYL = '#7FDDE8', INK = '#1B1F3B';
  var T = { agents: { x: 160, y: 104, w: 196, h: 134 }, scope: { x: 180, y: 290, w: 124, h: 128 }, holo: { x: 468, y: 404, w: 104 }, desk: { x: 612, y: 386, w: 166 },
    odoo: { x: 604, y: 142, w: 160, h: 92 }, rack: { x: 822, y: 196, w: 146 }, sign: { x: 300, y: -118 }, phin: { x: 748, y: 348 }, wb: { x: -780, y: 190, w: 170, h: 120 } };
  var HEX = [[150, -128], [230, -112], [320, -132], [470, -118], [600, -130], [690, -112], [780, -128], [880, -114], [980, -130], [1080, -116], [1180, -128], [60, -112], [-40, -128]];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.sky(g, e, CEIL, 300, [[0, '#6FAEEA'], [0.55, '#A9D2F5'], [1, '#E4F2FB']]);
    var sun = g.createRadialGradient(470, -40, 6, 470, -40, 280); sun.addColorStop(0, 'rgba(255,250,225,.95)'); sun.addColorStop(0.18, 'rgba(255,246,210,.55)'); sun.addColorStop(1, 'rgba(255,246,210,0)'); g.fillStyle = sun; g.fillRect(e.l, CEIL, e.r - e.l, 440);
    CO.skyVN(g, Math.min(e.l, -300), Math.max(e.r, 1500), 290, 318, { landmark: 760, tulip: 420, hazy: 'rgba(150,180,210,.45)', near: ['#D9E3EE', '#C9D6E5'], lit: 'rgba(120,170,215,.55)',
      river: 'rgba(110,165,210,.7)', lmCols: ['#B4C7DD', '#C1D2E5', '#CDDCEC', '#DAE5F1'], tulipCol: '#BFD0E3' });
    /* the riverside road, for the scooters (they are live), and the trees along it */
    g.fillStyle = '#C3CFDA'; g.fillRect(e.l, 320, e.r - e.l, 12); g.fillStyle = 'rgba(255,255,255,.75)'; for (var x = Math.floor(e.l / 36) * 36; x < e.r; x += 36) g.fillRect(x, 325.5, 14, 1.6);
    for (var tx = Math.floor(e.l / 70) * 70; tx < e.r; tx += 70) { fillE(g, tx + 20, 314, 12, 9, 'rgba(110,170,130,.55)'); g.fillStyle = 'rgba(110,130,120,.5)'; g.fillRect(tx + 19, 318, 2, 4); }
    var lo = g.createLinearGradient(0, 336, 0, F); lo.addColorStop(0, 'rgba(255,255,255,0)'); lo.addColorStop(1, 'rgba(240,246,252,.75)'); g.fillStyle = lo; g.fillRect(e.l, 336, e.r - e.l, F - 336);
    g.restore();
  }
  function paintFrame(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    CO.glass(g, e, CEIL, F, 120, '#F4F7FB', 40);
    CO.ceiling(g, e, CEIL, '#EEF2F8', '#F8FAFD', '#FFFFFF');
    g.fillStyle = CY; g.globalAlpha = 0.7; g.fillRect(e.l, CEIL + 2, e.r - e.l, 2); g.globalAlpha = 1;
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#EEF2F7'); fl.addColorStop(1, '#DCE3EC'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.strokeStyle = 'rgba(14,165,183,.13)'; g.lineWidth = 1.5; g.beginPath(); for (var d = 1; d < 8; d++) { var yy = F + Math.pow(d / 7, 1.5) * (e.b - F); g.moveTo(e.l, yy); g.lineTo(e.r, yy); }
    for (var i = -40; i <= 40; i++) { g.moveTo(560 + i * 70, F); g.lineTo(560 + i * 180, e.b + 40); } g.stroke();
    g.fillStyle = 'rgba(40,70,120,.08)'; g.fillRect(e.l, F, e.r - e.l, 6);
    g.fillStyle = 'rgba(255,248,220,.35)'; for (var sp = Math.floor(e.l / 120) * 120; sp < e.r; sp += 120) { g.beginPath(); g.moveTo(sp + 8, F); g.lineTo(sp + 112, F); g.lineTo(sp + 150, F + 70); g.lineTo(sp + 30, F + 70); g.closePath(); g.fill(); }
    g.restore();
  }

  function hexPath(g, x, y, r) { g.beginPath(); for (var i = 0; i < 6; i++) { var a = Math.PI / 6 + i * Math.PI / 3; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.62); } g.closePath(); }
  function paintBack(g, ext) {
    /* the hexagon baffles under the ceiling, wired like a neural net (the pulses are live) */
    g.strokeStyle = 'rgba(14,165,183,.35)'; g.lineWidth = 1.2; g.beginPath(); for (var i = 0; i < HEX.length - 1; i++) { var a = HEX[i], b = HEX[(i + 1) % HEX.length]; if (Math.abs(a[0] - b[0]) < 200) { g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } } g.stroke();
    HEX.forEach(function (h, i) { g.strokeStyle = '#C9D2DE'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(h[0], CEIL); g.lineTo(h[0], h[1] - 10); g.stroke(); hexPath(g, h[0], h[1], 26); g.fillStyle = i % 3 === 0 ? '#E3F7F9' : i % 3 === 1 ? '#FFFFFF' : '#FFF1E2'; g.fill(); g.strokeStyle = i % 3 === 2 ? '#F7C99A' : '#BFE9EE'; g.lineWidth = 1.5; g.stroke(); });
    /* the lit sign's backplate */
    var sg = T.sign; g.strokeStyle = '#C9D2DE'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(sg.x + 20, CEIL); g.lineTo(sg.x + 20, sg.y); g.moveTo(sg.x + 168, CEIL); g.lineTo(sg.x + 168, sg.y); g.stroke();
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, sg.x - 6, sg.y - 6, 200, 64, 12, '#FFFFFF'); }); fillRR(g, sg.x - 6, sg.y + 52, 200, 6, 3, CYL);
    /* the agent flow screen on the wall */
    var a2 = T.agents; shadowed(g, 16, 6, 0.22, function () { fillRR(g, a2.x - 6, a2.y - 6, a2.w + 12, a2.h + 12, 8, '#2A3142'); }); fillRR(g, a2.x, a2.y, a2.w, a2.h, 4, '#FFFFFF');
    text(g, 'AGENT · ORDER FOLLOW-UP · SAMPLE', a2.x + 10, a2.y + 15, 6.6, 800, CY);
    g.fillStyle = '#B9C3D1'; g.fillRect(a2.x + a2.w / 2 - 3, a2.y + a2.h + 6, 6, 40);
    /* the "AI in scope?" board on wheels */
    var b = T.scope; soft(g, b.x + b.w / 2, F + 4, 70, 7, 0.35); g.fillStyle = '#5C6B7A'; g.fillRect(b.x + 12, b.y + b.h, 4, F - b.y - b.h - 6); g.fillRect(b.x + b.w - 16, b.y + b.h, 4, F - b.y - b.h - 6); fillE(g, b.x + 14, F - 3, 3.5, 3.5, '#5C6B7A'); fillE(g, b.x + b.w - 14, F - 3, 3.5, 3.5, '#5C6B7A');
    shadowed(g, 10, 4, 0.18, function () { fillRR(g, b.x, b.y, b.w, b.h, 5, '#FFFFFF'); }); fillRR(g, b.x, b.y, b.w, 18, 5, OR); g.fillRect(b.x, b.y + 12, b.w, 6); text(g, 'AI IN SCOPE?', b.x + b.w / 2, b.y + 13, 7.5, 800, '#FFFFFF', 'center');
    /* the GPU racks */
    var r = T.rack; soft(g, r.x + r.w / 2, F + 4, 90, 9, 0.3);
    for (var c = 0; c < 2; c++) { var rx = r.x + c * 76; shadowed(g, 10, 4, 0.2, function () { fillRR(g, rx, r.y, 70, F - r.y, 5, '#C9D2DE'); }); fillRR(g, rx + 4, r.y + 6, 62, F - r.y - 12, 3, '#E6EBF2');
      for (var u = 0; u < 11; u++) { fillRR(g, rx + 8, r.y + 12 + u * 22, 54, 16, 2, '#FFFFFF'); g.fillStyle = 'rgba(14,165,183,.18)'; g.fillRect(rx + 10, r.y + 14 + u * 22, 50, 2); } }
    text(g, 'GPU · LOCAL LLM', r.x + r.w / 2 + 3, r.y - 8, 8, 800, CY, 'center');
    /* the Odoo screen over the desk, and the cable from the racks along the ceiling */
    var o = T.odoo; shadowed(g, 14, 5, 0.22, function () { fillRR(g, o.x - 5, o.y - 5, o.w + 10, o.h + 10, 7, '#2A3142'); }); fillRR(g, o.x, o.y, o.w, o.h, 3, '#FFFFFF');
    fillRR(g, o.x, o.y, o.w, 14, 3, C.odoo); g.fillRect(o.x, o.y + 8, o.w, 6); text(g, 'CONNECTED TO ODOO', o.x + 8, o.y + 10.5, 6.4, 800, '#FFFFFF');
    g.strokeStyle = '#B9C3D1'; g.lineWidth = 4; g.beginPath(); g.moveTo(r.x + 20, r.y); g.lineTo(r.x + 20, 120); g.lineTo(o.x + o.w - 20, 120); g.lineTo(o.x + o.w - 20, o.y - 5); g.stroke();
    K.plant(g, { x: 1010, y: F }, '#FFFFFF', '#E3E8EF');
    /* wide screens, right: the cà phê corner (low stools, a low table, a menu on the glass, a palm) */
    if (ext.r > 1040) { shadowed(g, 8, 3, 0.16, function () { fillRR(g, 1070, 120, 130, 96, 8, '#FFFFFF'); }); fillRR(g, 1070, 120, 130, 22, 8, OR); g.fillRect(1070, 132, 130, 10); text(g, 'CÀ PHÊ CORNER', 1135, 136, 8, 800, '#FFFFFF', 'center');
      [['Cà phê sữa đá', 'iced, with milk'], ['Cà phê phin', 'slow drip'], ['Trà đá', 'iced tea']].forEach(function (m, i) { text(g, m[0], 1080, 160 + i * 18, 7.4, 800, INK); text(g, m[1], 1190, 160 + i * 18, 6, 700, '#5C6B7A', 'right'); });
      g.strokeStyle = '#8A9A5B'; g.lineWidth = 3; for (var p = 0; p < 6; p++) { g.beginPath(); g.moveTo(1250, F - 40); g.quadraticCurveTo(1250 + (p - 2.5) * 20, 300, 1250 + (p - 2.5) * 44, 260 + Math.abs(p - 2.5) * 20); g.stroke(); fillE(g, 1250 + (p - 2.5) * 44, 262 + Math.abs(p - 2.5) * 20, 18, 6, '#4FB57D'); }
      fillRR(g, 1232, F - 44, 36, 44, 8, '#E9C9AC'); }
    /* wide screens, left: the lab's entrance and the RAG whiteboard */
    if (ext.l < -470) { var wb = T.wb; shadowed(g, 10, 4, 0.16, function () { fillRR(g, wb.x, wb.y, wb.w, wb.h, 6, '#FFFFFF'); }); g.strokeStyle = '#C9D2DE'; g.lineWidth = 2; rr(g, wb.x, wb.y, wb.w, wb.h, 6); g.stroke();
      g.fillStyle = '#9AA6BC'; g.fillRect(wb.x + 14, wb.y + wb.h, 4, F - wb.y - wb.h - 6); g.fillRect(wb.x + wb.w - 18, wb.y + wb.h, 4, F - wb.y - wb.h - 6); text(g, 'RAG · HOW AN ANSWER IS FOUND', wb.x + 10, wb.y + 16, 6.4, 800, CY);
      shadowed(g, 10, 4, 0.18, function () { fillRR(g, -900, -60, 170, 120, 10, '#FFFFFF'); }); fillRR(g, -900, -60, 170, 8, 4, CY); CO.plane(g, -870, -10, 2, 0, C.blue); text(g, 'TechNext', -848, -2, 20, 800, INK);
      text(g, 'HO CHI MINH CITY · AI LAB', -815, 24, 7, 800, OR, 'center'); text(g, 'Xin chào!', -815, 44, 10, 800, CY, 'center'); K.plant(g, { x: -500, y: F }, '#FFFFFF', '#E3E8EF'); }
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6', mons: [[d.x + 22, 96, 56]] });
    fillRR(g, d.x + 128, d.y - 6, 30, 6, 3, '#DCE3EE');
    /* the phin's glass, filter and lid */
    var p = T.phin; fillRR(g, p.x - 12, p.y + 14, 24, 22, 4, 'rgba(255,255,255,.85)'); fillRR(g, p.x - 14, p.y + 4, 28, 6, 3, '#B9C3D1'); fillRR(g, p.x - 10, p.y - 14, 20, 18, 3, '#C9D1DD'); fillRR(g, p.x - 8, p.y - 20, 16, 6, 3, '#AEB8C8');
    /* the hologram table */
    var h = T.holo, hc = h.x + h.w / 2; soft(g, hc, F + 4, 60, 8, 0.4); fillRR(g, hc - 12, h.y + 10, 24, F - h.y - 14, 4, '#C9D2DE'); fillRR(g, hc - 30, F - 8, 60, 8, 4, '#9AA6BC');
    fillE(g, hc, h.y + 8, h.w / 2 + 6, 10, '#9AA6BC'); fillE(g, hc, h.y + 4, h.w / 2, 9, '#E6EBF2'); fillE(g, hc, h.y + 4, h.w / 2 - 14, 5, CYL);
    /* wide screens: the cà phê corner's low table and stools, in front */
    if (ext.r > 1040) { soft(g, 1140, F + 6, 70, 6, 0.24); fillRR(g, 1092, 420, 92, 8, 3, '#C9A27A'); g.fillStyle = '#A9825C'; g.fillRect(1100, 428, 4, 42); g.fillRect(1172, 428, 4, 42); COL.cup(g, 1110, 420, 1, true); COL.cup(g, 1160, 420, 1, false);
      [[1062, '#3167CA'], [1212, '#E0456B']].forEach(function (st) { fillRR(g, st[0] - 16, 440, 32, 7, 3, st[1]); g.fillStyle = st[1]; g.fillRect(st[0] - 13, 447, 4, 23); g.fillRect(st[0] + 9, 447, 4, 23); }); }
  }

  var W = CR.who;
  var EN1 = W({ x: 398, y: 470, s: 0.54, ph: 0.6, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: '#F08A24', glasses: true, hands: [[-70, -150], [130, -300]], look: 0.6 });
  var EN2 = W({ x: 694, y: 470, s: 0.54, ph: 1.7, skin: 1, hair: 1, style: 'bob', outfit: 'cardigan', top: '#46418A', top2: '#FFFFFF', headset: '#0EA5B7', sit: true, chairCol: '#2F3760', hands: [[-60, -200], [60, -200]] });
  var CREW = [
    { x0: -930, x1: -560, y: 494, spd: 18, ph: 0.3, drag: '#C9D2DE', label: 'Infrastructure engineer, Ho Chi Minh City', lines: ['A new **GPU node** for the local LLM rack.', 'Local models keep **your data in-house**.'], acts: ['wave', 'id', 'jump'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'polo', top: '#0EA5B7', top2: '#FFFFFF', glasses: true }) },
    { x0: 1020, x1: 1300, y: 488, spd: 14, ph: 0.7, label: 'AI engineer, Ho Chi Minh City', lines: ['Evaluating answers against **your own documents**.', 'Morning stand-up, early prototype!'], acts: ['nod', 'dance', 'id'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'pony', outfit: 'shirt', top: '#E0456B', hold: 'tablet' }) },
    { front: true, x0: 960, x1: 1300, y: 700, spd: 20, ph: 0.4, label: 'Machine learning engineer', lines: ['Fine-tuning is the **last** resort. Retrieval first.', 'My TechNext ID opens the **GPU room**.'], acts: ['cheer', 'id', 'spin'],
      P: W({ s: 0.58, skin: 1, hair: 0, style: 'short', outfit: 'cardigan', top: '#2F3760', top2: '#F08A24', glasses: true, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) },
    { front: true, x0: -930, x1: -520, y: 700, spd: 16, ph: 0.8, label: 'Data engineer, Ho Chi Minh City', lines: ['Cleaning the data **before** the model sees it.', 'Xin chào! Good data makes **good answers**.'], acts: ['wave', 'id', 'think'],
      P: W({ s: 0.58, skin: 2, hair: 2, style: 'bob', outfit: 'polo', top: '#7B5CD6', top2: '#FFFFFF', glasses: true, hold: 'tablet' }) }
  ];
  /* extras: a teammate in the cà phê corner, the engineer at the RAG whiteboard */
  var XS = [
    { P: W({ x: 1062, y: 470, s: 0.5, ph: 0.4, skin: 1, hair: 0, style: 'short', outfit: 'polo', top: '#F2B233', top2: '#1B1F3B', sit: true, chair: false, sitDrop: 54 }), hands: [[-56, -200], [56, -230]],
      box: [1062, 350, 90, 220], who: 'AI engineer', role: 'Cà phê corner · illustration', near: [880, 80], pose: 'love', dur: [1.8, 1.8], fx: ['conf', 'note'],
      lines: ['Một, hai, ba, dô! **Cheers** from the AI lab.', 'Cà phê sữa đá: slow coffee, **fast prototypes**.'],
      idle: function (P, t) { var c = (t + 2) % 7; if (c < 1.4) { P.hands[1] = [26, -320]; P.look = 0; } else { P.hands = [[-56, -200], [56, -230]]; P.look = 0.6 * Math.sin(t * 0.4); } },
      moves: [function (P, u) { P.hands = [[-90, -300], [112, -410]]; P.hop = COL.bell(u) * 10; }, function (P, u, t) { P.hands = [[-56, -200], [70 + Math.sin(t * 14) * 10, -250]]; P.look = 0.5; }],
      after: function (g, P, t, S, X, u) { var h = COL.hand(P, 1); COL.cup(g, h[0], h[1] + 10, 1.05, true); if (u >= 0 && X.k === 0) COL.bubble(g, h[0], h[1] - 30, 'Dô!', COL.bell(u) * 2, OR); } },
    { P: W({ x: -582, y: 470, s: 0.52, ph: 1.9, skin: 0, hair: 1, style: 'pony', outfit: 'cardigan', top: '#14A38B', top2: '#FFFFFF' }), hands: [[-130, -330], [60, -170]],
      box: [-582, 360, 80, 230], who: 'Data engineer', role: 'RAG whiteboard · illustration', near: [-300, 100], pose: 'present', dur: [1.6, 1.8], fx: ['star', 'ask'],
      lines: ['Documents in, **cited answers** out. Retrieval first.', 'Where did that answer come from? It’s always **quoted**.'],
      idle: function (P, t) { var c = (t + 1) % 9; P.look = -0.85; if (c < 5) P.hands = [[-130 + Math.sin(t * 6) * 10, -330 + Math.sin(t * 2.3) * 24], [60, -170]]; else if (c < 7) { P.hands = [[-50, -200], [30, -320]]; P.tilt = -0.05; } else { P.look = 0.4; P.hands = [[-90, -190], [110, -270]]; P.mood = 'happy'; } },
      moves: [function (P, u) { P.hands = [[-160, -380], [60, -170]]; P.look = -0.9; P.hop = u > 0.6 ? COL.bell((u - 0.6) / 0.4) * 10 : 0; }, function (P, u) { P.hands = [[-60, -190], [30, -320]]; P.tilt = -0.08 + u * 0.16; }],
      after: function (g, P, t, S, X, u) { var h = COL.hand(P, 0); COL.marker(g, h[0], h[1] - 4, -0.6, CY); } }
  ];

  /* the passers-by: CO.crew, but keeping each walker's roller case (drag) */
  function crew(list, g, t, S, layer) { var ext = S.ext;
    list.forEach(function (w) { var L = (w.front || w.y >= 560) ? 'fore' : w.y > 470; if (L !== layer) return; var a = Math.max(w.x0, ext.l + 40), b = Math.min(w.x1, ext.r - 50); if (b - a < 60) return;
      var Wk = w._W || (w._W = { y: w.y, spd: w.spd, ph: w.ph, P: w.P, label: w.label, lines: w.lines, acts: w.acts, drag: w.drag }); Wk.x0 = a; Wk.x1 = b; CR.walk(g, Wk, t); }); }
  var VN = { pull: -9, spin: -9, rate: -9, b: 0 };
  function hexLive(g, t) {
    for (var i = 0; i < 4; i++) { var q = (t * 0.22 + i * 0.27) % 1, n = Math.floor(q * (HEX.length - 1)), f = (q * (HEX.length - 1)) % 1, a = HEX[n], b = HEX[n + 1]; if (Math.abs(a[0] - b[0]) > 200) continue;
      fillE(g, lerp(a[0], b[0], f), lerp(a[1], b[1], f), 3, 3, i % 2 ? CY : OR); }
    HEX.forEach(function (h, i) { var on = Math.sin(t * 1.4 + i * 1.7) > 0.7; if (on) fillE(g, h[0], h[1], 4, 2.6, i % 3 === 2 ? OR : CY); });
  }
  function ragLive(g, t) {
    var wb = T.wb, steps = [['Docs', '#3167CA'], ['Chunks', CY], ['Index', '#7B5CD6'], ['Answer', OR]], ph = (t * 0.5) % 5;
    steps.forEach(function (s, i) { var x = wb.x + 12 + i * 39, y = wb.y + 34, on = ph > i; fillRR(g, x, y, 32, 26, 5, on ? s[1] : '#EEF2F7'); text(g, s[0], x + 16, y + 16, 5.8, 800, on ? '#FFFFFF' : '#8A96A8', 'center');
      if (i < 3) { g.strokeStyle = ph > i + 0.5 ? s[1] : '#C9D2DE'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x + 33, y + 13); g.lineTo(x + 38, y + 13); g.stroke(); } });
    g.fillStyle = '#C9D3E3'; for (var l = 0; l < 3; l++) g.fillRect(wb.x + 14, wb.y + 76 + l * 10, 60 + hash(l) * 70, 2.4); text(g, 'with the source quoted', wb.x + 14, wb.y + wb.h - 10, 6, 800, '#0E7A50');
  }
  function paintLive(g, t, now, S) {
    crew(CREW, g, t, S, false);
    hexLive(g, t);
    /* the lit sign: a steady glow with a flicker now and then; tapped, it runs through its colours */
    var sg = T.sign, nt = t - (S.toy.neon != null ? S.toy.neon : -9), flick = (t % 7) > 6.7 ? 0.3 : 1, col = nt < 2 ? ['#E0456B', CY, OR, '#7B5CD6'][Math.floor(nt * 4) % 4] : CY;
    g.save(); g.globalAlpha = flick; g.shadowColor = col; g.shadowBlur = 8; text(g, 'AI LAB', sg.x + 94, sg.y + 28, 22, 800, col, 'center'); g.shadowBlur = 0; g.restore();
    text(g, 'HO CHI MINH CITY', sg.x + 94, sg.y + 46, 8, 800, '#5C6B7A', 'center');
    /* silk lanterns: they sway; tapped, the red one spins and glows */
    var lt = t - (S.toy.lantern != null ? S.toy.lantern : -9); COL.lantern(g, 566, CEIL, 50, t, '#E2453C', 1, 0, lt < 2 ? (2 - lt) / 2 : 0); COL.lantern(g, 640, CEIL, 18, t, '#F2B233', 0.7, 1.3); COL.lantern(g, 520, CEIL, 14, t, '#F08A24', 0.62, 2.1);
    if (S.ext.r > 1040) COL.lantern(g, 1150, CEIL, 50, t, '#E2453C', 0.8, 0.7);
    /* agents: a trigger fires, the agent decides, Odoo acts; on the Agents stop it runs fast */
    var a = T.agents, ag = S.hot === 'agents', sp = ag ? 1.6 : 0.5, ph = (t * sp) % 3;
    [['Overdue\ninvoice', 18, '#3167CA'], ['Agent\ndecides', 76, OR], ['Reminder\nin Odoo', 134, C.odoo]].forEach(function (n, i) { var nx = a.x + n[1], ny = a.y + 36, on = ph > i;
      fillRR(g, nx, ny, 48, 40, 8, on ? n[2] : '#EEF2F7'); n[0].split('\n').forEach(function (ln, j) { text(g, ln, nx + 24, ny + 17 + j * 10, 6, 800, on ? '#FFFFFF' : '#5C6B7A', 'center'); });
      if (i < 2) { g.strokeStyle = ph > i + 0.5 ? CY : '#C9D2DE'; g.lineWidth = 2; g.beginPath(); g.moveTo(nx + 49, ny + 20); g.lineTo(nx + 57, ny + 20); g.stroke(); } });
    for (var lg = 0; lg < 3; lg++) { var w = 30 + hash(lg + Math.floor(t * (ag ? 3 : 1))) * 120; fillRR(g, a.x + 14, a.y + 92 + lg * 12, w, 4, 2, ['#DCE3EC', '#BFE9EE', '#E2DCF3'][lg]); }
    /* the scope board: three questions get their ticks */
    var b = T.scope, sc = S.hot === 'scope' ? clamp((t - (S.sT || 0)) / 1.6, 0, 1) : 1;
    ['Repeating work?', 'Your own documents?', 'Connected to Odoo?'].forEach(function (q, i) { var y = b.y + 34 + i * 30, done = sc > i / 3; fillRR(g, b.x + 8, y - 10, 14, 14, 3, done ? '#2BC48A' : '#E3E8EF');
      if (done) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(b.x + 11, y - 3); g.lineTo(b.x + 14, y); g.lineTo(b.x + 19, y - 6); g.stroke(); } text(g, q, b.x + 28, y + 1, 6.6, 800, INK); });
    /* the racks' lights: a wave on the LLM stop or when tapped */
    var r = T.rack, rt = t - (S.toy.rack != null ? S.toy.rack : -9), wave = S.hot === 'llm' || rt < 2;
    for (var c = 0; c < 2; c++) for (var u = 0; u < 11; u++) for (var l = 0; l < 4; l++) { var on = wave ? Math.abs(u - (t * 9 + c * 2) % 13) < 1.3 : hash(u * 4 + l + c * 50 + Math.floor(t * 3 + u)) > 0.55;
      fillE(g, r.x + c * 76 + 16 + l * 8, r.y + 20 + u * 22, 1.8, 1.8, on ? (l === 3 ? OR : CY) : '#D5DCE6'); }
    /* data pulses along the cable to Odoo */
    var o = T.odoo, path = [[r.x + 20, r.y], [r.x + 20, 120], [o.x + o.w - 20, 120], [o.x + o.w - 20, o.y - 5]], pulses = S.hot === 'odoo' ? 5 : 2;
    for (var pi = 0; pi < pulses; pi++) { var q2 = ((t * 0.5 + pi / pulses) % 1) * 3, seg = Math.min(2, Math.floor(q2)), f = q2 - seg, p0 = path[seg], p1 = path[seg + 1]; fillE(g, lerp(p0[0], p1[0], f), lerp(p0[1], p1[1], f), 3, 3, CY); }
    /* the Odoo screen: apps light as answers arrive */
    var od = S.hot === 'odoo' ? Math.floor((t - (S.oT || 0)) * 2) : Math.floor(t * 0.6);
    [['Sales', '#3167CA'], ['Inventory', '#14A38B'], ['Helpdesk', '#E0456B'], ['Documents', '#F2B233']].forEach(function (ap, i) { var ax = o.x + 8 + (i % 2) * 76, ay = o.y + 22 + Math.floor(i / 2) * 32, on = (od % 5) > i;
      fillRR(g, ax, ay, 68, 26, 4, on ? '#F1F4F9' : '#F7F8FB'); fillRR(g, ax + 4, ay + 5, 16, 16, 3, ap[1]); text(g, ap[0], ax + 24, ay + 16, 6.4, 800, INK); if (on) fillE(g, ax + 62, ay + 6, 3, 3, '#2BC48A'); });
    /* the hologram: the knowledge graph turns; documents orbit; on Knowledge (or a pull), an answer card rises */
    var h = T.holo, hc = h.x + h.w / 2, kn = S.hot === 'knowledge', spn = t - VN.spin, spd = kn ? 2.4 : 0.8, boost = spn < 2 ? COL.bell(spn / 2) * 6 : 0;
    g.save(); var beam = g.createLinearGradient(0, h.y, 0, h.y - 170); beam.addColorStop(0, 'rgba(14,165,183,.28)'); beam.addColorStop(1, 'rgba(14,165,183,0)'); g.fillStyle = beam;
    g.beginPath(); g.moveTo(hc - 30, h.y + 2); g.lineTo(hc + 30, h.y + 2); g.lineTo(hc + 56, h.y - 170); g.lineTo(hc - 56, h.y - 170); g.closePath(); g.fill();
    var nodes = [], base = t * spd * 0.4 + (VN.acc || 0); VN.acc = (VN.acc || 0) + boost * 0.016; for (var n = 0; n < 7; n++) { var an = base + n * Math.PI * 2 / 7, rad = 26 + (n % 3) * 10; nodes.push([hc + Math.cos(an) * rad, h.y - 90 + Math.sin(an) * rad * 0.45 + (n % 2 ? -14 : 10)]); }
    g.strokeStyle = 'rgba(14,165,183,.6)'; g.lineWidth = 1.2; g.beginPath(); nodes.forEach(function (p, i) { var q = nodes[(i + 2) % 7]; g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.moveTo(p[0], p[1]); g.lineTo(hc, h.y - 90); }); g.stroke();
    nodes.forEach(function (p, i) { if (i % 3 === 0) { fillRR(g, p[0] - 5, p[1] - 6, 10, 12, 1.5, '#FFFFFF'); g.strokeStyle = '#9FC4FF'; g.lineWidth = 1; g.strokeRect(p[0] - 5, p[1] - 6, 10, 12); g.fillStyle = '#9FC4FF'; g.fillRect(p[0] - 3, p[1] - 3, 6, 1.2); g.fillRect(p[0] - 3, p[1], 5, 1.2); } else fillE(g, p[0], p[1], 3, 3, i % 2 ? CY : OR); });
    fillE(g, hc, h.y - 90, 8 + boost, 8 + boost, CY); fillE(g, hc, h.y - 90, 4, 4, '#FFFFFF'); g.restore();
    var pl = t - VN.pull; if (kn || pl < 2.4) { var ka = kn ? clamp((t - (S.kT || 0)) * 2, 0, 1) : clamp((pl - 0.8) * 3, 0, 1) * clamp((2.4 - pl) * 3, 0, 1); g.save(); g.globalAlpha = ka; shadowed(g, 8, 3, 0.2, function () { fillRR(g, hc - 70, h.y - 196, 140, 32, 9, '#FFFFFF'); });
      text(g, 'Answer from SOP-12 · Returns', hc, h.y - 182, 6.6, 800, INK, 'center'); text(g, 'with the source quoted · sample', hc, h.y - 171, 6, 700, '#5C5C73', 'center'); g.restore(); }
    if (S.ext.l < -470) { ragLive(g, t); COL.draw([XS[1]], g, t, S); }
    if (S.ext.r > 1040) COL.draw([XS[0]], g, t, S);
  }
  function paintFrontLive(g, t, S) {
    crew(CREW, g, t, S, true);
    /* the assistant on the desk monitor: a question, then the answer types in; rated helpful on a tap */
    var d = T.desk, mx = d.x + 26, my = d.y - 78, ch = S.hot === 'chatbots', tt = ch ? (t - (S.cT || 0)) : (t % 8), rt = t - VN.rate;
    fillRR(g, mx, my, 88, 48, 2, '#FFFFFF'); fillRR(g, mx + 30, my + 5, 54, 11, 5, '#3167CA'); text(g, 'Stock of SKU-204?', mx + 57, my + 12.5, 5, 800, '#FFFFFF', 'center');
    var n = Math.floor(clamp((tt - 0.6) * 14, 0, 26)); fillRR(g, mx + 4, my + 20, 62, 22, 5, '#EEF2F7'); text(g, '86 in Main, 12 reserved'.slice(0, n), mx + 8, my + 30, 5, 800, INK); text(g, 'Inventory · sample'.slice(0, Math.max(0, n - 6)), mx + 8, my + 38, 4.6, 700, CY);
    if (rt < 2.2) { fillRR(g, mx + 52, my + 30, 32, 12, 6, '#2BC48A'); text(g, '✓ Helpful', mx + 68, my + 38.4, 5, 800, '#FFFFFF', 'center'); var hd = COL.head(EN2); COL.pop(g, hd[0], hd[1] - 66, '✓ Rated helpful', rt / 2.2, '#0E7A50'); }
    /* the phin: drips; tapped, the coffee runs; the engineer lifts the glass now and then */
    var p = T.phin, pt = t - (S.toy.phin != null ? S.toy.phin : -9), fast = pt < 3, dr = (t * (fast ? 3 : 0.8)) % 1;
    fillE(g, p.x, p.y + 6 + dr * 14, 1.6, 2.2, '#6B4329'); fillRR(g, p.x - 10, p.y + 30 - (fast ? Math.min(14, pt * 6) : 4), 20, fast ? Math.min(14, pt * 6) : 4, 2, '#5A3A22');
    if (fast) COL.steam(g, p.x, p.y - 20, t, 0.7, 3);
    /* the engineer at the hologram: the document he pulls out of the graph */
    var pl = t - VN.pull; if (pl < 1.4) { var h = T.holo, hc = h.x + h.w / 2, hand = COL.hand(EN1, 1), u = clamp(pl / 0.8, 0, 1), dx = lerp(hc + 20, hand[0], COL.ease(u)), dy = lerp(h.y - 100, hand[1] - 16, COL.ease(u)); COL.sheet(g, dx, dy, -0.2 + u * 0.3, 16, 20, 4); }
    CR.draw(g, t);
  }
  function FORE() {
    return [
      [700, function (g, ext, t) { var x0 = -470, x1 = 150, y = 662; if (ext.l > x1) return; soft(g, (x0 + x1) / 2, y + 52, (x1 - x0) / 2, 8, 0.22);
        for (var i = 0; i < 11; i++) { var lx = x0 + 24 + i * 56, sw = Math.sin(t * 1.1 + i * 1.3) * 3; [[-18, -10, 22, 12, -0.5], [16, -12, 22, 12, 0.5], [0, -26, 18, 14, 0], [-10, -34, 14, 10, -0.3], [12, -36, 14, 10, 0.4]].forEach(function (L, j) {
          g.beginPath(); g.ellipse(lx + L[0] + sw * (1 + j * 0.2), y + L[1], L[2], L[3], L[4], 0, Math.PI * 2); g.fillStyle = (i + j) % 3 === 0 ? '#3FBF7F' : (i + j) % 3 === 1 ? '#35AE70' : '#2E9E66'; g.fill(); });
          if (i % 3 === 1) { fillE(g, lx + sw, y - 40, 4, 4, '#F2B233'); fillE(g, lx + 8 + sw, y - 30, 3, 3, '#E0456B'); } }
        fillRR(g, x0, y, x1 - x0, 46, 10, '#FFFFFF'); fillRR(g, x0 - 4, y - 4, x1 - x0 + 8, 10, 5, '#E3E8EF'); g.fillStyle = 'rgba(14,165,183,.3)'; g.fillRect(x0, y + 22, x1 - x0, 4); g.fillStyle = 'rgba(240,138,36,.35)'; g.fillRect(x0, y + 30, x1 - x0, 2); }],
      [800, function (g, ext, t) { COL.swayPlant(g, 975, 806, t, 1.05, '#FFFFFF', '#E3E8EF', 1); if (ext.l < -480) COL.swayPlant(g, -520, 806, t, 1, OR, '#F7B26A', 2); }]
    ];
  }

  window.IXW.worlds['office-vn'] = {
    pan: [-300, 1060],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function (g, t, par, S) {
      var ext = S.ext;
      /* a bright day: birds cross the sky, a plane, boats on the river, scooters streaming along the riverside road */
      COL.birds(g, t, -200, 1400, -40, 5, 'rgba(60,80,110,.55)');
      var jx = ext.l + ((t * 18) % (ext.r - ext.l + 400)) - 200; CO.plane(g, jx, -96, 0.8, 0.04, 'rgba(255,255,255,.95)');
      for (var b = 0; b < 3; b++) { var bx = -200 + ((t * (6 + b * 2) + b * 300) % 1400); fillRR(g, bx, 340 + b * 6, 30, 5, 2, '#FFFFFF'); fillRR(g, bx + 8, 335 + b * 6, 12, 5, 2, ['#E2453C', '#3167CA', '#F08A24'][b]); }
      var span = ext.r - ext.l + 200; for (var s = 0; s < 10; s++) { var dir = s % 2 ? -1 : 1, p = (t * (22 + (s % 4) * 5) + s * 137) % span, x = dir > 0 ? ext.l - 100 + p : ext.r + 100 - p, y = s % 2 ? 330 : 324, col = ['#E0456B', '#3167CA', '#F2B233', '#14A38B', '#7B5CD6'][s % 5];
        fillE(g, x - 4, y, 1.8, 1.8, '#2A3550'); fillE(g, x + 4, y, 1.8, 1.8, '#2A3550'); fillRR(g, x - 5, y - 4, 10, 3, 1.5, col); fillE(g, x + dir * -1, y - 7, 2.2, 2.2, s % 3 ? '#F2B233' : '#FFFFFF'); }
    },
    paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, FORE(), function () { crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(14,165,183,.3)',
    glow: {
      agents: function (g) { var a = T.agents; rr(g, a.x - 12, a.y - 12, a.w + 24, a.h + 24, 10); },
      scope: function (g) { var b = T.scope; rr(g, b.x - 8, b.y - 8, b.w + 16, b.h + 16, 10); },
      knowledge: function (g) { var h = T.holo; rr(g, h.x - 26, h.y - 180, h.w + 52, F - h.y + 186, 16); },
      chatbots: function (g) { var d = T.desk; rr(g, d.x + 16, d.y - 90, 108, 70, 10); },
      llm: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 20, r.w + 16, F - r.y + 24, 12); },
      odoo: function (g) { var o = T.odoo; rr(g, o.x - 12, o.y - 12, o.w + 24, o.h + 24, 10); },
      neon: function (g) { var s = T.sign; rr(g, s.x - 10, s.y - 10, 208, 72, 14); },
      lantern: function (g) { rr(g, 566 - 26, CEIL + 46, 52, 92, 22); },
      phin: function (g) { var p = T.phin; rr(g, p.x - 18, p.y - 26, 36, 66, 8); },
      rack: function (g) { var r = T.rack; rr(g, r.x - 8, r.y - 20, r.w + 16, F - r.y + 24, 12); }
    },
    backGlow: ['agents', 'scope', 'llm', 'odoo', 'neon', 'rack', 'lantern'],
    cast: [
      /* the knowledge engineer at the hologram: pinches and spreads the graph, pulls a document to read, glances at the answer; a tap pulls a cited document out, or spins the whole graph */
      { id: 'en1', behind: true, keys: ['knowledge', 'scope'], P: EN1, act: function (P, t, S) { var st = S.cast.en1, tp = COL.tap(st, t), busy = S.hot === 'knowledge', c = (t + 2) % 10, hands, look;
        COL.reset(P); P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        if (busy) { hands = [[-70, -150], [140 + Math.sin(t * 3) * 14, -330]]; look = 0.8; }
        else if (c < 4) { var sp2 = 0.5 + 0.5 * Math.sin(t * 2.2); hands = [[lerp(40, -20, sp2), -300], [lerp(90, 160, sp2), -310]]; look = 0.8; }
        else if (c < 6.5) { hands = [[-70, -150], [70, -360]]; look = 0.4; P.tilt = -0.05; }
        else { hands = [[-80, -180], [110, -280 + Math.sin(t * 1.4) * 8]]; look = clamp((S.nexi.x - P.x) / 160, -1, 1); P.mood = 'happy'; }
        if (tp.n && tp.e < 2) { var u = tp.e / 2; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { hands = u < 0.4 ? [[-70, -150], [150, -320]] : [[-70, -150], [60, -330]]; look = 0.7; if (VN.pt !== tp.n) { VN.pt = tp.n; VN.pull = t; } }
          else { var sw = COL.ease(clamp(u / 0.4, 0, 1)); hands = [[-70, -150], [lerp(60, 170, sw), lerp(-260, -380, sw)]]; look = 0.9; P.hop = u > 0.3 ? COL.bell((u - 0.3) / 0.7) * 10 : 0; if (VN.sp !== tp.n) { VN.sp = tp.n; VN.spin = t; CR.burst('star', T.holo.x + T.holo.w / 2, T.holo.y - 110, t); } } }
        P.hands = hands; P.look = lerp(P.look, look, 0.1); } },
      /* the engineer testing the assistant: types a question, leans back to read the answer, sips the phin coffee; a tap spins the chair or rates the answer */
      { id: 'en2', behind: true, keys: ['chatbots'], P: EN2, act: function (P, t, S) { var st = S.cast.en2, tp = COL.tap(st, t), busy = S.hot === 'chatbots', c = (t % 8), k2 = Math.abs(Math.sin(t * (busy ? 14 : 8))) * 6;
        COL.reset(P); P.talk = t < st.until; P.mood = P.talk || busy ? 'happy' : 'calm'; var hands = [[-70, -200 - k2], [60, -200 - (6 - k2)]], look = -0.5;
        if (!busy) { if (c > 1.2 && c < 4.4) { hands = [[-70, -200], [60, -200]]; look = -0.6; P.tilt = 0.04; if (c > 3) P.mood = 'happy'; } else if (c > 5 && c < 6.6) { hands = [[-70, -200], [100, -214]]; look = 0.7; } }
        if (tp.n && tp.e < 1.8) { var u = tp.e / 1.8; P.talk = true; P.mood = 'happy';
          if (tp.n % 2) { var v = clamp(u / 0.7, 0, 1); P.sx = Math.cos(COL.ease(v) * Math.PI * 2); P.hop = COL.bell(v) * 14; hands = [[-110, -262], [110, -262]]; if (VN.s2 !== tp.n) { VN.s2 = tp.n; CR.burst('code', P.x, P.y - 230, t); } }
          else { hands = [[-70, -200], [96, -330]]; look = -0.3; if (VN.rt !== tp.n) { VN.rt = tp.n; VN.rate = t; CR.burst('spark', T.desk.x + 80, T.desk.y - 60, t); } } }
        P.hands = hands; P.look = lerp(P.look, t < st.until && !(tp.e < 1.8) ? clamp((S.nexi.x - P.x) / 160, -1, 1) : look, 0.1); } }
    ],
    toy: function (name, S, t, btn) {
      if (name === 'neon' && btn) btn.setAttribute('data-say', CO.timeLine(7, 'Ho Chi Minh City', 'an hour behind Singapore and Taguig City. The **AI lab** keeps the lights on.'));
      if (name === 'rack') CR.burst('code', T.rack.x + 70, T.rack.y + 20, t);
    },
    hit: function (x, y, S, t) { var r = CR.hitWalker(x, y, t); if (r) return r; return COL.hit(XS, x, y, t); },
    onStop: function (key, S, t) { if (key === 'scope') S.sT = t; if (key === 'odoo') S.oT = t; if (key === 'knowledge') S.kT = t; if (key === 'chatbots') S.cT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
