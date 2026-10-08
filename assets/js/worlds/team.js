/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: team (/employee-hub) — the TechNext card room on a bright morning: where every person's business card is
   designed, printed and filed. A pegboard card wall (cards flip over now and then to show their QR backs), a drafting
   desk where a designer lays out a card, a turntable showing one big card turning front to back, the card press (a
   hopper of card stock, a status screen that counts the cards on this page, cards sliding out onto the tray), the
   contacts desk with a spinning rolodex and a phone stand showing "Add contact" (the vCard), and the office map with
   three pins (the card backs carry the offices). Margins: a mood board of card designs on the left, the TechNext ID
   lanyard rack on the right. Foreground: a guillotine cutter on a cart, boxes of card stock, plants.
   Everyone has their own idle loop and tap choreography; all of them wear the blue TechNext ID. */
(function (K, CR, CO, COL) {
  'use strict';
  if (!K || !CR || !CO || !COL) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, NAVY = '#1B2350', BLUE = '#3167CA', BLUE2 = '#4A80E2', Y = '#FFD84A', TEAL = '#14A38B', SLATE = '#2A3550', PAPER = '#FFFDF8', CORAL = '#F08A6C';
  var bell = COL.bell, ease = COL.ease;
  var T = { wall: { x: 150, y: 18, w: 390, h: 250 }, draft: { x: 196 }, turn: { x: 452 }, press: { x: 578, w: 168 }, desk: { x: 840, y: 384, w: 160 }, map: { x: 790, y: 60, w: 200, h: 112 },
    mood: { x: -760 }, rack: { x: 1050 } };
  var CW = 66, CH = 40, COLS = 5, ROWS = 4;
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  /* the people on this page's cards (initials and count), read from the cards themselves */
  var PEOPLE = null;
  function people() { if (PEOPLE) return PEOPLE; var out = [];
    [].forEach.call(document.querySelectorAll('[data-bc-name]'), function (el) { var n = el.getAttribute('data-bc-name') || ''; out.push({ n: n, i: n.split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(), r: el.getAttribute('data-bc-role') || '' }); });
    if (!out.length) out = [{ n: 'TechNext', i: 'TN', r: '' }]; PEOPLE = out; return out; }

  /* a business card (front or back) in set units, top-left at 0,0, w x h */
  function cardFront(g, w, h, ini, name, role) {
    fillRR(g, 0, 0, w, h, h * 0.08, PAPER); fillRR(g, 0, h - h * 0.12, w, h * 0.12, 0, BLUE); g.fillStyle = Y; g.fillRect(w * 0.7, h - h * 0.12, w * 0.3, h * 0.12);
    CO.plane(g, w * 0.13, h * 0.25, h * 0.022, 0, BLUE); text(g, 'TechNext', w * 0.22, h * 0.3, h * 0.13, 800, NAVY);
    if (name) { text(g, name, w * 0.08, h * 0.62, h * 0.12, 800, NAVY); text(g, role || '', w * 0.08, h * 0.76, h * 0.085, 700, '#5C6B7A'); }
    else { fillRR(g, w * 0.08, h * 0.5, w * 0.46, h * 0.08, h * 0.04, NAVY); fillRR(g, w * 0.08, h * 0.64, w * 0.32, h * 0.06, h * 0.03, '#9AA6BC'); }
    fillE(g, w * 0.82, h * 0.52, h * 0.17, h * 0.17, '#E8EFFC'); g.strokeStyle = BLUE; g.lineWidth = Math.max(0.8, h * 0.03); g.beginPath(); g.arc(w * 0.82, h * 0.52, h * 0.17, 0, 7); g.stroke();
    text(g, ini || '', w * 0.82, h * 0.57, h * 0.13, 800, BLUE, 'center');
  }
  function cardBack(g, w, h, seed) {
    fillRR(g, 0, 0, w, h, h * 0.08, NAVY); g.fillStyle = 'rgba(255,255,255,.05)'; for (var s = 0; s < 6; s++) g.fillRect(s * w / 6, 0, w / 12, h);
    var q = h * 0.62, qx = w * 0.62, qy = h * 0.19, n = 7, c = q / n; fillRR(g, qx - c * 0.5, qy - c * 0.5, q + c, q + c, c * 0.6, '#FFFFFF');
    g.fillStyle = NAVY; for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) { var fin = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4); if (fin || hash(i * 7 + j * 13 + (seed || 0)) > 0.52) g.fillRect(qx + i * c, qy + j * c, c, c); }
    CO.plane(g, w * 0.15, h * 0.3, h * 0.02, 0, '#FFFFFF', NAVY); text(g, 'technext.asia', w * 0.08, h * 0.62, h * 0.09, 800, Y); text(g, 'SG · PH · VN', w * 0.08, h * 0.78, h * 0.075, 800, 'rgba(255,255,255,.75)');
  }

  /* ------------------------------------------------------------ the room (cached) */
  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, e.t, 0, F); wg.addColorStop(0, '#F6F8FD'); wg.addColorStop(1, '#E6ECF6'); g.fillStyle = wg; g.fillRect(e.l, e.t, e.r - e.l, F - e.t);
    /* a skylight band: daylight strips across the ceiling */
    g.fillStyle = '#FFFFFF'; g.fillRect(e.l, e.t, e.r - e.l, -110 - e.t); for (var sk = Math.floor(e.l / 200) * 200; sk < e.r; sk += 200) { var sg = g.createLinearGradient(0, -160, 0, -120); sg.addColorStop(0, '#BFE0F7'); sg.addColorStop(1, '#E8F4FD'); g.fillStyle = sg; fillRR(g, sk + 30, -160, 140, 36, 4, sg); }
    g.fillStyle = 'rgba(30,60,110,.08)'; g.fillRect(e.l, -112, e.r - e.l, 4);
    /* a dot-grid wallpaper and a blue dado */
    g.fillStyle = 'rgba(49,103,202,.07)'; for (var dy = -90; dy < 300; dy += 22) for (var dx = Math.floor(e.l / 22) * 22; dx < e.r; dx += 22) g.fillRect(dx, dy, 2.5, 2.5);
    g.fillStyle = '#DCE6F6'; g.fillRect(e.l, 300, e.r - e.l, F - 300); g.fillStyle = BLUE; g.fillRect(e.l, 296, e.r - e.l, 5); g.fillStyle = 'rgba(49,103,202,.12)'; for (var p = Math.floor(e.l / 60) * 60; p < e.r; p += 60) g.fillRect(p, 301, 2, F - 301);
    /* the floor: pale grey vinyl with a blue walkway */
    var fl = g.createLinearGradient(0, F, 0, e.b); fl.addColorStop(0, '#E4E8F0'); fl.addColorStop(1, '#CDD4E2'); g.fillStyle = fl; g.fillRect(e.l, F, e.r - e.l, e.b - F);
    g.fillStyle = 'rgba(27,35,80,.10)'; g.fillRect(e.l, F, e.r - e.l, 5);
    g.fillStyle = 'rgba(49,103,202,.16)'; g.beginPath(); g.moveTo(e.l, 610); g.lineTo(e.r, 610); g.lineTo(e.r, 668); g.lineTo(e.l, 668); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.6)'; for (var st = Math.floor(e.l / 90) * 90; st < e.r; st += 90) fillRR(g, st, 636, 46, 6, 3, 'rgba(255,255,255,.6)');
    [[640, F + 60, 320], [-300, F + 50, 220], [1150, F + 50, 220]].forEach(function (pp) { g.save(); g.globalAlpha = 0.45; fillE(g, pp[0], pp[1], pp[2], 28, '#FFFFFF'); g.restore(); });
    g.restore();
  }
  function paintBack(g, ext) {
    /* the pegboard card wall */
    var w = T.wall; shadowed(g, 14, 6, 0.2, function () { fillRR(g, w.x, w.y, w.w, w.h, 10, '#F3E2C6'); }); g.strokeStyle = '#D9B48A'; g.lineWidth = 6; rr(g, w.x, w.y, w.w, w.h, 10); g.stroke();
    g.fillStyle = 'rgba(150,110,70,.22)'; for (var py = w.y + 14; py < w.y + w.h - 8; py += 14) for (var px = w.x + 14; px < w.x + w.w - 8; px += 14) { g.beginPath(); g.arc(px, py, 1.6, 0, 7); g.fill(); }
    fillRR(g, w.x + w.w / 2 - 90, w.y - 14, 180, 28, 14, NAVY); text(g, 'THE CARD WALL', w.x + w.w / 2, w.y + 4, 10, 800, Y, 'center');
    /* the drafting desk (its board tilts toward the designer) */
    var d = T.draft.x; soft(g, d + 60, F + 4, 80, 8, 0.25); g.strokeStyle = '#7A869C'; g.lineWidth = 5; g.beginPath(); g.moveTo(d + 20, F); g.lineTo(d + 60, 372); g.lineTo(d + 100, F); g.stroke();
    /* the turntable stand */
    var tx = T.turn.x; soft(g, tx, F + 4, 50, 7, 0.3); fillRR(g, tx - 6, 330, 12, F - 334, 4, '#9AA6BC'); fillE(g, tx, F - 4, 34, 7, '#7A869C'); fillE(g, tx, 330, 26, 6, '#C9D2DE');
    fillRR(g, tx - 40, 410, 80, 22, 6, NAVY); text(g, 'FRONT ↔ BACK', tx, 425, 7.4, 800, Y, 'center');
    /* the card press: body, hopper, status screen frame */
    var pr = T.press; soft(g, pr.x + pr.w / 2, F + 4, 110, 10, 0.3);
    shadowed(g, 16, 6, 0.25, function () { fillRR(g, pr.x, 200, pr.w, F - 200, 14, '#FFFFFF'); });
    fillRR(g, pr.x, 200, pr.w, 34, 14, BLUE); g.fillRect(pr.x, 220, pr.w, 14); CO.plane(g, pr.x + 22, 217, 1, 0, '#FFFFFF', BLUE); text(g, 'CARD PRESS', pr.x + 38, 222, 11, 800, '#FFFFFF');
    fillRR(g, pr.x + 34, 150, 100, 54, 6, '#DCE3EE'); fillRR(g, pr.x + 40, 156, 88, 44, 4, '#C9D2DE'); for (var cs = 0; cs < 6; cs++) fillRR(g, pr.x + 46, 186 - cs * 5, 76, 4, 1, cs % 2 ? '#FFFFFF' : PAPER);
    text(g, 'CARD STOCK', pr.x + 84, 146, 7, 800, '#5C6B7A', 'center');
    fillRR(g, pr.x + 14, 246, 92, 50, 6, SLATE); fillRR(g, pr.x + 118, 250, 34, 10, 5, '#C9D2DE'); fillE(g, pr.x + 135, 284, 12, 12, '#E2453C'); fillE(g, pr.x + 135, 282, 10, 10, '#FF6B5E');
    fillRR(g, pr.x + 10, 318, pr.w - 20, 20, 4, '#2A3142'); fillRR(g, pr.x + 14, 324, pr.w - 28, 8, 2, '#0F1426');
    g.fillStyle = 'rgba(49,103,202,.08)'; for (var vs = 0; vs < 5; vs++) g.fillRect(pr.x + 16 + vs * 30, 350, 18, F - 360);
    /* the office map over the contacts desk */
    var m = T.map; shadowed(g, 10, 4, 0.18, function () { fillRR(g, m.x, m.y, m.w, m.h, 8, '#FFFFFF'); }); fillRR(g, m.x, m.y, m.w, 20, 8, NAVY); g.fillRect(m.x, m.y + 12, m.w, 8); text(g, 'ON EVERY CARD BACK', m.x + m.w / 2, m.y + 14, 7.4, 800, Y, 'center');
    g.fillStyle = '#E3ECF8'; g.beginPath(); g.ellipse(m.x + 64, m.y + 66, 46, 28, 0.3, 0, 7); g.fill(); g.beginPath(); g.ellipse(m.x + 140, m.y + 56, 40, 24, -0.2, 0, 7); g.fill(); g.beginPath(); g.ellipse(m.x + 118, m.y + 92, 30, 12, 0.1, 0, 7); g.fill();
    g.strokeStyle = 'rgba(49,103,202,.5)'; g.lineWidth = 1.5; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(m.x + 66, m.y + 54); g.lineTo(m.x + 132, m.y + 50); g.lineTo(m.x + 104, m.y + 92); g.closePath(); g.stroke(); g.setLineDash([]);
    /* the contacts desk lamp and the desk's back panel */
    var dk = T.desk; soft(g, dk.x + dk.w / 2, F + 4, 120, 10, 0.3);
    /* the room sign over the press, a print-run chart and pendant lamps over the contacts desk */
    shadowed(g, 12, 5, 0.2, function () { fillRR(g, 590, -78, 190, 50, 25, '#FFFFFF'); }); g.lineWidth = 3; g.strokeStyle = BLUE; rr(g, 596, -72, 178, 38, 19); g.stroke();
    CO.plane(g, 624, -53, 1.3, 0, BLUE); text(g, 'CARD ROOM', 644, -47, 17, 800, NAVY); g.strokeStyle = '#9AA6BC'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(620, -110); g.lineTo(620, -78); g.moveTo(750, -110); g.lineTo(750, -78); g.stroke();
    fillRR(g, 1040, -60, 150, 96, 8, '#FFFFFF'); fillRR(g, 1040, -60, 150, 20, 8, Y); g.fillRect(1040, -48, 150, 8); text(g, 'PRINT RUNS', 1115, -46, 8, 800, NAVY, 'center');
    [[1056, 0.5], [1080, 0.8], [1104, 0.6], [1128, 0.95], [1152, 0.75]].forEach(function (b) { fillRR(g, b[0], 26 - b[1] * 50, 16, b[1] * 50, 3, BLUE); });
    /* plants */
    K.plant(g, { x: 136, y: F }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 1022, y: F }, BLUE, BLUE2);
    /* ---- left margin: the mood board of card designs ---- */
    var mb = T.mood.x; if (ext.l < mb + 360) {
      shadowed(g, 12, 5, 0.18, function () { fillRR(g, mb, 40, 320, 230, 8, '#FFFFFF'); }); fillRR(g, mb, 40, 320, 26, 8, TEAL); g.fillRect(mb, 56, 320, 10); text(g, 'CARD DESIGNS · MOOD BOARD', mb + 160, 58, 9, 800, '#FFFFFF', 'center');
      for (var mi = 0; mi < 6; mi++) { var cx = mb + 18 + (mi % 3) * 100, cy = 84 + Math.floor(mi / 3) * 90; g.save(); g.translate(cx + 40, cy + 24); g.rotate((hash(mi + 3) - 0.5) * 0.16); g.translate(-40, -24); if (mi % 2) cardBack(g, 80, 48, mi); else cardFront(g, 80, 48, '', '', ''); g.restore(); fillE(g, cx + 40, cy - 2, 3, 3, '#E2453C'); }
      soft(g, mb + 160, F + 4, 120, 8, 0.25); fillRR(g, mb + 40, 330, 240, 14, 5, '#D9B48A'); fillRR(g, mb + 56, 344, 10, F - 344, 3, '#B98E62'); fillRR(g, mb + 254, 344, 10, F - 344, 3, '#B98E62');
      for (var bx = 0; bx < 3; bx++) { fillRR(g, mb + 70 + bx * 62, 296, 54, 34, 4, ['#E8EFFC', '#FFF4C8', '#E2F5F0'][bx]); text(g, ['500', '250', '100'][bx], mb + 97 + bx * 62, 317, 9, 800, NAVY, 'center'); } }
    /* ---- right margin: the TechNext ID lanyard rack ---- */
    var rk = T.rack.x; if (ext.r > rk - 30) {
      shadowed(g, 12, 5, 0.18, function () { fillRR(g, rk, 60, 200, 250, 10, '#FFFFFF'); }); fillRR(g, rk, 60, 200, 28, 10, BLUE); g.fillRect(rk, 76, 200, 12); text(g, 'TECHNEXT IDs', rk + 100, 79, 10, 800, '#FFFFFF', 'center');
      fillRR(g, rk + 14, 100, 172, 8, 4, '#9AA6BC');
      for (var li = 0; li < 6; li++) { var lx = rk + 28 + li * 28; g.strokeStyle = BLUE; g.lineWidth = 3; g.beginPath(); g.moveTo(lx - 6, 104); g.lineTo(lx - 2, 196 + (li % 2) * 14); g.moveTo(lx + 6, 104); g.lineTo(lx + 2, 196 + (li % 2) * 14); g.stroke();
        fillRR(g, lx - 11, 194 + (li % 2) * 14, 22, 30, 3, '#FFFFFF'); fillRR(g, lx - 11, 194 + (li % 2) * 14, 22, 8, 3, BLUE); fillE(g, lx, 210 + (li % 2) * 14, 4, 4, '#C9D6EE'); fillRR(g, lx - 7, 217 + (li % 2) * 14, 14, 2.5, 1, NAVY); }
      text(g, 'Everyone wears one', rk + 100, 286, 8, 800, '#5C6B7A', 'center'); }
  }
  function paintFront(g, ext) {
    /* the drafting desk board and stool-side tray */
    var d = T.draft.x; g.save(); g.translate(d + 60, 372); g.rotate(-0.2); fillRR(g, -70, -10, 140, 14, 3, '#F4EEE4'); fillRR(g, -70, 2, 140, 4, 2, '#D9B48A'); g.restore();
    /* the press's output tray */
    var pr = T.press; fillRR(g, pr.x + pr.w - 24, 376, 54, 8, 3, '#9AA6BC'); fillRR(g, pr.x + pr.w + 28, 372, 6, 14, 2, '#7A869C');
    /* the contacts desk */
    var dk = T.desk; fillRR(g, dk.x, dk.y, dk.w, 12, 4, '#FFFFFF'); fillRR(g, dk.x, dk.y + 10, dk.w, 4, 2, '#DCE3EE'); fillRR(g, dk.x + 8, dk.y + 14, dk.w - 16, F - dk.y - 14, 4, SLATE);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(dk.x + 8, dk.y + 34, dk.w - 16, 3); CO.plane(g, dk.x + 30, dk.y + 56, 1.3, 0, '#FFFFFF', SLATE); text(g, 'CONTACTS', dk.x + 48, dk.y + 61, 11, 800, '#FFFFFF'); text(g, 'vCard · QR', dk.x + 48, dk.y + 73, 7, 800, Y);
    /* the phone stand (its screen is live) and the desk lamp */
    fillRR(g, 965, dk.y - 6, 26, 6, 2, '#9AA6BC'); g.strokeStyle = '#2A3142'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(852, dk.y); g.lineTo(856, dk.y - 60); g.lineTo(880, dk.y - 84); g.stroke(); g.save(); g.translate(880, dk.y - 84); g.rotate(0.6); fillRR(g, -4, -8, 26, 14, 6, '#2A3142'); g.restore();
  }
  function paintFore(g, ext) {
    /* the guillotine cutter on a cart, boxes of card stock, plants */
    soft(g, 330, 724, 90, 9, 0.3); fillRR(g, 250, 640, 160, 70, 6, '#DCE3EE'); fillRR(g, 250, 640, 160, 10, 4, '#C9D2DE'); [262, 398].forEach(function (wx) { fillE(g, wx, 714, 9, 9, SLATE); fillE(g, wx, 714, 4, 4, '#9AA6BC'); });
    fillRR(g, 268, 610, 124, 32, 4, '#FFFFFF'); fillRR(g, 268, 610, 124, 6, 3, BLUE); g.save(); g.translate(392, 616); g.rotate(-0.5); fillRR(g, -110, -4, 110, 8, 3, '#9AA6BC'); fillRR(g, -124, -7, 18, 14, 4, '#E2453C'); g.restore();
    text(g, 'CUTTER', 330, 684, 9, 800, NAVY, 'center');
    soft(g, 880, 722, 80, 8, 0.3); [[820, 640, 90, '#C99A6B'], [910, 660, 70, '#D9B07D'], [840, 600, 64, '#B5865A']].forEach(function (b) { fillRR(g, b[0], b[1], b[2], 712 - b[1], 4, b[3]); fillRR(g, b[0] + b[2] / 2 - 4, b[1], 8, 712 - b[1], 0, 'rgba(255,255,255,.25)'); });
    text(g, 'CARD STOCK', 865, 690, 9, 800, '#FFFFFF', 'center');
    K.plant(g, { x: 1070, y: 730 }, BLUE, BLUE2); K.plant(g, { x: -40, y: 730 }, '#FFFFFF', '#E3E9F3'); K.plant(g, { x: 560, y: 730 }, Y, '#F2C93A');
  }

  /* ------------------------------------------------------------ the cast */
  var W = CR.who;
  var DES = W({ x: 286, y: 470, s: 0.48, ph: 0.8, skin: 0, hair: 2, style: 'long', outfit: 'cardigan', top: CORAL, top2: '#FFFFFF', sit: true, chairCol: SLATE, hands: [[-80, -220], [-10, -230]], look: -0.5 });
  var OP = W({ x: 548, y: 470, s: 0.5, ph: 1.7, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: BLUE, top2: Y, hands: [[-60, -200], [120, -260]], look: 0.8 });
  var CLK = W({ x: 954, y: 470, s: 0.48, ph: 2.6, skin: 3, hair: 0, style: 'bob', outfit: 'shirt', top: '#FFFFFF', top2: TEAL, glasses: true, sit: true, chairCol: BLUE, hands: [[-90, -214], [20, -214]], look: -0.4 });
  var NEW = W({ x: 792, y: 470, s: 0.5, ph: 3.4, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: TEAL, top2: '#FFFFFF', hands: [[-40, -230], [40, -230]], look: 0.6 });
  var CREW = [
    { front: true, x0: -380, x1: 140, y: 668, spd: 14, ph: 0.2, label: 'TechNext team', lines: ['Fresh **card stock** for the press!', 'One card per person, **front and back**.'], acts: ['wave', 'jump', 'id'],
      P: W({ s: 0.58, skin: 4, hair: 1, style: 'pony', outfit: 'polo', top: Y, top2: NAVY, hold: 'box', hands: [[-60, -212], [64, -216]] }) },
    { x0: -900, x1: -420, y: 500, spd: 16, ph: 0.6, label: 'TechNext team', lines: ['Picking a design from the **mood board**.', 'Blue, white and a touch of **yellow**.'], acts: ['cheer', 'wave', 'dance'],
      P: W({ s: 0.5, skin: 2, hair: 0, style: 'short', outfit: 'cardigan', top: '#7B5BD6', top2: '#FFFFFF', hold: 'tablet', hands: [[-60, -212], [70, -170]] }) }
  ];
  var XSC = [
    { P: W({ x: 1130, y: 470, s: 0.5, ph: 0.4, skin: 3, hair: 2, style: 'pony', outfit: 'polo', top: TEAL, top2: '#FFFFFF' }), hands: [[-70, -200], [70, -200]],
      box: [1130, 360, 90, 220], who: 'At the ID rack', role: 'TechNext · illustration', near: [880, 40], pose: 'love', dur: [1.8, 1.6], fx: ['spark', 'star'],
      lines: ['Every one of us wears a **TechNext ID**.', 'Lanyard on, card in the pocket. Ready!'],
      idle: function (P, t) { var c = (t + 1) % 6; P.look = -0.6; P.hands = c < 3.5 ? [[-130, -330 + Math.sin(t * 3) * 8], [70, -200]] : [[-70, -200], [40, -250]]; if (c >= 3.5) { P.mood = 'happy'; P.idSwing = t * 4; } },
      moves: [function (P, u, t) { P.idSwing = t * 8; P.hands = [[-70, -200], [70, -260]]; P.hop = bell(u) * 12; }, function (P, u) { P.hands = [[-110, -380], [110, -380]]; P.hop = Math.abs(Math.sin(u * Math.PI * 2)) * 18; }],
      after: function (g, P, t, S, X, u, k) { if (u >= 0 && k === 0) COL.pop(g, P.x, P.y - 270, 'TechNext ID ✓', u, BLUE); } }
  ];
  var PRESS = { t: -9, n: 0 }, PROOF = { t: -9 }, SPIN = { t: -9 }, BOW = { t: -9 }, FLIP = { t: -9 }, SHUF = { t: -9 };
  /* ---- the designer: idle, lays out a card on the drafting board and compares it with the wall; tapped, holds up the proof, PROOF OK */
  function actDes(P, t, S) {
    var st = S.cast.des, u = COL.tap(st, t).e; COL.reset(P, [[-80, -220], [-10, -230]]);
    var c = (t + 0.8) % 8; P.talk = t < st.until;
    if (c < 5) { P.hands = [[-90, -240], [-20 + Math.sin(t * 4) * 18, -246 + Math.cos(t * 6) * 6]]; P.look = -0.6; }
    else { P.hands = [[-80, -230], [40, -260]]; P.look = -0.1; P.tilt = -0.06; P.mood = 'happy'; }
    if (S.hot === 'wall') { P.hands = [[-80, -230], [60, -380]]; P.look = 0; P.talk = true; }
    if (u < 2.4) { P.mood = 'happy'; P.talk = true; P.hands = [[-90, -380], [70, -380]]; P.look = 0.2; P.hop = bell(Math.min(1, u / 0.8)) * 10; if (u < 0.05 && PROOF.t < t - 1) PROOF.t = t; if (u > 0.5 && !st._b) { st._b = 1; CR.burst('star', P.x, P.y - 300, t); } } else st._b = 0;
    P._u = u;
  }
  /* ---- the press operator: idle, feeds card stock, presses the button, checks the tray; tapped, pulls the lever and a card shoots out */
  function actOp(P, t, S) {
    var st = S.cast.op, u = COL.tap(st, t).e; COL.reset(P, [[-60, -200], [120, -260]]);
    var c = (t + 1.7) % 7; P.talk = t < st.until;
    if (c < 2.4) { P.hands = [[-60, -200], [150, -330 + Math.sin(t * 3) * 10]]; P.look = 1; }
    else if (c < 3.2) { var pu = (c - 2.4) / 0.8; P.hands = [[-60, -200], [150, -250 + bell(pu) * 20]]; P.look = 0.9; if (pu > 0.5 && PRESS.idle !== Math.floor(t / 7)) { PRESS.idle = Math.floor(t / 7); PRESS.auto = t; } }
    else { P.hands = [[-40, -230], [110, -200]]; P.look = 0.5; P.mood = 'happy'; P.tilt = Math.sin(t * 2) * 0.03; }
    if (S.hot === 'press') { P.hands = [[-60, -200], [150, -300]]; P.look = 1; P.talk = true; }
    if (u < 2.2) { P.mood = 'happy'; P.talk = true; var lv = u < 0.6 ? ease(u / 0.6) : 1; P.hands = [[-90, -360], [140, -380 + lv * 140]]; P.look = 0.8; P.hop = u > 0.6 && u < 1 ? bell((u - 0.6) / 0.4) * 14 : 0;
      if (u > 0.55 && PRESS.t < st._s) { PRESS.t = t; PRESS.n++; CR.burst('conf', T.press.x + T.press.w, 330, t); } }
    if (u < 0.05) st._s = t;
    P._u = u;
  }
  /* ---- the contacts clerk: idle, flips through the rolodex and types; tapped, spins the rolodex fast: "Found it!" */
  function actClk(P, t, S) {
    var st = S.cast.clk, u = COL.tap(st, t).e; COL.reset(P, [[-90, -214], [20, -214]]);
    var c = (t + 2.6) % 6.5; P.talk = t < st.until;
    if (c < 3.5) { P.hands = [[-120, -230 + Math.abs(Math.sin(t * 5)) * -10], [20, -214]]; P.look = -0.7; }
    else { var kk = Math.abs(Math.sin(t * 20)) * 6; P.hands = [[-40, -214 - kk], [40, -214 - (6 - kk)]]; P.look = 0.2; }
    if (S.hot === 'rolodex') { P.hands = [[-130, -240], [20, -214]]; P.look = -0.8; P.talk = true; }
    if (u < 2.2) { P.mood = 'happy'; P.talk = true; P.hands = [[-140, -250 + Math.sin(u * 30) * 8], [60, -300]]; P.look = -0.6; if (u < 0.05 && SPIN.t < t - 1) SPIN.t = t; }
    P._u = u;
  }
  /* ---- the new joiner: idle, admires their new card, then clips the ID on; tapped, offers the card with both hands and bows */
  function actNew(P, t, S) {
    var st = S.cast.new, u = COL.tap(st, t).e; COL.reset(P, [[-40, -230], [40, -230]]);
    var c = (t + 3.4) % 7; P.talk = t < st.until; P._card = 0;
    if (c < 4) { P.hands = [[-30, -260], [30, -260]]; P._card = 1; P.look = 0.1; P.mood = c > 2 ? 'happy' : 'calm'; P.tilt = -0.04; }
    else { P.hands = [[-70, -150], [30, -250]]; P.idSwing = t * 5; P.look = 0.7; }
    if (u < 2.4) { P.mood = 'happy'; P.talk = true; P._card = 2; var b = bell(Math.min(1, u / 1.6)); P.tilt = b * 0.3; P.hands = [[60, -230 + b * 30], [130, -230 + b * 30]]; P.look = 0.9; if (u < 0.05 && BOW.t < t - 1) BOW.t = t; if (u > 0.8 && !st._h) { st._h = 1; CR.burst('heart', 830, 250, t); } } else st._h = 0;
    P._u = u;
  }

  /* ------------------------------------------------------------ live layers */
  function paintWindow(g, t, par, S) { /* the skylights' passing clouds */
    var e = S.ext; for (var sk = Math.floor(e.l / 200) * 200; sk < e.r; sk += 200) { g.save(); g.beginPath(); g.rect(sk + 30, -160, 140, 36); g.clip(); var x = sk + 30 + ((t * 8 + hash(sk) * 140) % 200) - 30; g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(x, -140, 26, 7, 0, 0, 7); g.ellipse(x + 12, -146, 14, 7, 0, 0, 7); g.fill(); g.restore(); }
  }
  function paintLive(g, t, now, S) {
    var P = people(), w = T.wall;
    /* the card wall: 20 pinned cards; one flips over every 1.4 s to show its QR back */
    var cur = Math.floor(t / 1.4), ft = t - FLIP.t;
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) { var i = r * COLS + c, x = w.x + 20 + c * (CW + 8), y = w.y + 26 + r * (CH + 14), pp = P[i % P.length], mine = i < P.length;
      var fl = hash(i * 3.1 + cur * 0.37) > 0.82 || (ft < 2.4 && ft > (i % 7) * 0.12 && ft < (i % 7) * 0.12 + 1), u = fl ? Math.abs(Math.cos(clamp(((t % 1.4) / 1.4), 0, 1) * Math.PI)) : 1;
      if (ft < 2.4) u = Math.abs(Math.cos(clamp((ft - (i % 7) * 0.12) / 1, 0, 1) * Math.PI));
      var back = fl && u < 0.999 && ((ft < 2.4 ? (ft - (i % 7) * 0.12) : (t % 1.4) / 1.4) > 0.25 && (ft < 2.4 ? (ft - (i % 7) * 0.12) : (t % 1.4) / 1.4) < 0.75);
      g.save(); g.translate(x + CW / 2, y + CH / 2); g.rotate((hash(i + 11) - 0.5) * 0.08); g.scale(Math.max(0.04, u), 1); g.translate(-CW / 2, -CH / 2);
      g.fillStyle = 'rgba(20,30,60,.12)'; g.fillRect(1.5, 2.5, CW, CH);
      if (back) cardBack(g, CW, CH, i); else cardFront(g, CW, CH, mine ? pp.i : '', mine ? pp.n.split(' ')[0] : '', mine ? short(pp.r, 18) : '');
      g.restore(); fillE(g, x + CW / 2, y + 2, 2.6, 2.6, mine ? '#E2453C' : '#9AA6BC');
      if (mine && S.hot === 'wall') { g.save(); g.globalAlpha = 0.5 + 0.4 * Math.sin(t * 5 + i); g.strokeStyle = Y; g.lineWidth = 2.5; rr(g, x - 3, y - 3, CW + 6, CH + 6, 5); g.stroke(); g.restore(); } }
    /* the turntable: one big card turning front to back */
    var tx = T.turn.x, a = t * 0.9 + (S.hot === 'flip' ? t * 1.5 : 0), sx = Math.cos(a), bigW = 120, bigH = 72;
    g.save(); g.translate(tx, 300); g.scale(Math.max(0.03, Math.abs(sx)), 1); g.translate(-bigW / 2, -bigH / 2); shadowed(g, 10, 4, 0.25, function () { fillRR(g, 0, 0, bigW, bigH, 6, PAPER); });
    if (sx > 0) cardFront(g, bigW, bigH, P[0].i, P[0].n, short(P[0].r, 22)); else cardBack(g, bigW, bigH, 5); g.restore();
    /* the press: status screen, the light, a card sliding out (idle) or shooting out (tapped) */
    var pr = T.press, n = P.length, pt = t - PRESS.t, at = t - (PRESS.auto || -9);
    fillRR(g, pr.x + 16, 248, 88, 46, 4, '#0F1426'); text(g, 'PRINTING', pr.x + 22, 262, 7, 800, '#7FE3C4');
    var done = Math.floor(t / 2) % (n + 1); text(g, (pt < 1.6 ? n : Math.max(1, done)) + ' of ' + n, pr.x + 22, 282, 15, 800, '#FFFFFF'); fillRR(g, pr.x + 22, 287, 76 * ((t % 2) / 2), 3, 1.5, Y);
    fillE(g, pr.x + 135, 254, 3, 3, Math.floor(t * 3) % 2 ? '#7FE3C4' : '#2E8A6C');
    var sl = at < 1.2 ? ease(at / 1.2) : -1; if (sl >= 0) { g.save(); g.translate(pr.x + pr.w - 56 + sl * 40, 328 + sl * 40); g.scale(0.4, 0.4); cardFront(g, 90, 54, P[PRESS.idle % n || 0].i, '', ''); g.restore(); }
    if (pt < 1.8) { var fu = clamp(pt / 0.9, 0, 1), cx2 = lerp(pr.x + pr.w - 30, pr.x + pr.w + 4, fu), cy2 = 328 - Math.sin(fu * Math.PI) * 120 + fu * 44; g.save(); g.translate(cx2, cy2); g.rotate(fu * Math.PI * 4); g.translate(-27, -16); cardFront(g, 54, 32, P[PRESS.n % n].i, '', ''); g.restore(); }
    /* the tray stack */
    for (var ts = 0; ts < 4; ts++) { g.save(); g.translate(pr.x + pr.w - 20 + (ts % 2), 368 - ts * 2.4); fillRR(g, 0, 0, 48, 6, 1.5, ts % 2 ? '#FFFFFF' : PAPER); fillRR(g, 0, 4, 48, 2, 1, BLUE); g.restore(); }
    /* the map pins pulse */
    var m = T.map; [[66, 54, 'SG', 8], [132, 50, 'PH', 8], [104, 92, 'VN', 7]].forEach(function (p2, i2) { var px = m.x + p2[0], py = m.y + p2[1], pu = 0.5 + 0.5 * Math.sin(t * 3 + i2 * 2);
      fillE(g, px, py, 6 + pu * 5, 6 + pu * 5, 'rgba(49,103,202,' + (0.2 * (1 - pu) + 0.05).toFixed(3) + ')'); fillE(g, px, py, 5, 5, ['#E2453C', BLUE, '#D8362B'][i2]); text(g, p2[2], px, py - 9, 7, 800, NAVY, 'center'); });
    text(g, 'Singapore HQ · Taguig City · Ho Chi Minh City', m.x + m.w / 2, m.y + m.h - 6, 6.2, 800, '#5C6B7A', 'center');
    CO.clock(g, 1000, -40, 18, 8, NAVY);
    COL.draw(XSC, g, t, S);
    CO.crew(CREW, g, t, S, false);
    if (S.ext.l < T.mood.x + 360) { /* a designer at the mood board, idling */ }
  }
  function short(s, n) { s = s || ''; return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function paintFrontLive(g, t, S) {
    var P = people(), dk = T.desk;
    /* the rolodex: cards ticking round (fast when tapped) */
    var sp = t - SPIN.t, rot = t * 1.2 + (sp < 2.2 ? ease(sp / 2.2) * 30 : 0) + (S.hot === 'rolodex' ? t * 2 : 0), rx = 880, ry = dk.y - 26;
    fillRR(g, rx - 30, dk.y - 6, 60, 6, 2, '#5C6B7A'); g.strokeStyle = '#5C6B7A'; g.lineWidth = 3; g.beginPath(); g.moveTo(rx - 24, dk.y - 4); g.lineTo(rx - 20, ry); g.moveTo(rx + 24, dk.y - 4); g.lineTo(rx + 20, ry); g.stroke();
    for (var k = 0; k < 12; k++) { var an = rot + k * Math.PI / 6, cz = Math.cos(an), cy = ry + Math.sin(an) * 18; if (cz < 0) continue; g.save(); g.translate(rx, cy); g.scale(1, Math.max(0.12, cz)); fillRR(g, -20, -10, 40, 20, 2, k % 3 ? '#FFFFFF' : '#FFF4C8'); fillRR(g, -20, -10, 40, 4, 2, k % 4 ? '#C9D6EE' : BLUE); g.restore(); }
    fillE(g, rx, ry, 4, 4, NAVY); if (sp < 2.2) COL.pop(g, rx, ry - 40, 'Found it!', sp / 2.2, TEAL);
    /* the phone stand: "Add contact" from a vCard */
    var px = 978, py = dk.y - 52; fillRR(g, px - 15, py - 4, 30, 50, 5, '#1B1F3B'); fillRR(g, px - 13, py - 1, 26, 44, 3, '#FFFFFF'); fillE(g, px, py + 10, 6, 6, '#E8EFFC'); text(g, P[0].i, px, py + 12.5, 5.6, 800, BLUE, 'center');
    fillRR(g, px - 9, py + 19, 18, 2.5, 1, NAVY); fillRR(g, px - 7, py + 24, 14, 2, 1, '#9AA6BC'); var on = Math.floor(t / 2) % 2 || S.hot === 'vcard'; fillRR(g, px - 10, py + 31, 20, 7, 3.5, on ? TEAL : BLUE); text(g, on ? '✓ Saved' : '+ Add', px, py + 36.4, 4.4, 800, '#FFFFFF', 'center');
    /* the designer's proof card */
    var pu = t - PROOF.t; if (pu < 2.4) { var h = COL.hand(DES, 1); g.save(); g.translate(h[0] - 30, h[1] - 44); cardFront(g, 66, 40, P[0].i, P[0].n.split(' ')[0], ''); g.restore(); COL.pop(g, DES.x + 30, DES.y - 330, 'PROOF OK ✓', pu / 2.4, TEAL); }
    /* the new joiner's card: admired (idle) or offered with both hands (tapped) */
    if (NEW._card) { var a = COL.hand(NEW, 0), b = COL.hand(NEW, 1); g.save(); g.translate((a[0] + b[0]) / 2 - 18, Math.min(a[1], b[1]) - 16); cardFront(g, 36, 22, P[P.length > 1 ? 1 : 0].i, '', ''); g.restore(); }
    var bt = t - BOW.t; if (bt < 2.4 && bt > 0.6) COL.pop(g, NEW.x, NEW.y - 280, 'Nice to meet you!', (bt - 0.6) / 1.8, BLUE);
    CR.draw(g, t);
  }

  window.IXW.worlds.team = {
    pan: [-320, 1160],
    paintBg: paintBg, paintBack: paintBack, paintFront: paintFront, paintFore: paintFore,
    paintWindow: paintWindow, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(255,216,74,.45)',
    glow: {
      wall: function (g) { var w = T.wall; rr(g, w.x - 8, w.y - 20, w.w + 16, w.h + 28, 14); },
      flip: function (g) { rr(g, T.turn.x - 70, 254, 140, 180, 12); },
      press: function (g) { var p = T.press; rr(g, p.x - 40, 140, p.w + 48, F - 136, 14); },
      rolodex: function (g) { rr(g, 844, 330, 72, 60, 10); },
      vcard: function (g) { rr(g, 955, 322, 46, 64, 8); },
      offices: function (g) { var m = T.map; rr(g, m.x - 8, m.y - 8, m.w + 16, m.h + 16, 12); },
      shuffle: function (g) { var w = T.wall; rr(g, w.x - 8, w.y - 20, w.w + 16, w.h + 28, 14); }
    },
    backGlow: ['wall', 'flip', 'press', 'offices', 'shuffle'],
    cast: [
      { id: 'des', behind: true, keys: ['wall'], P: DES, act: actDes },
      { id: 'op', behind: true, keys: ['press'], P: OP, act: actOp },
      { id: 'clk', behind: true, keys: ['rolodex', 'vcard'], P: CLK, act: actClk },
      { id: 'new', behind: false, keys: [], P: NEW, act: actNew }
    ],
    toy: function (name, S, t) { if (name === 'shuffle') { FLIP.t = t; CR.burst('spark', 345, 60, t); } },
    hit: function (x, y, S, t) {
      var r = CR.hitWalker(x, y, t); if (r) return r;
      return COL.hit(XSC, x, y, t);
    }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO, window.COL);
