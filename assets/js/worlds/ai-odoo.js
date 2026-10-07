/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* World: ai-odoo (/odoo/ai-integration) — AI that works inside Odoo, on the client's data. A bright finance-and-service
   office: the scanner feeds paper vendor bills; the wall screen shows the Odoo vendor bill the AI reads, fills field by field
   and matches to its purchase order, then waits for a person to approve; the record's log keeps every step; a helpdesk reply
   is drafted for the agent to send; a question is answered from the records. Finance and the support agent sit at their
   desks (chairs, legs and feet); a TechNext AI engineer (TechNext ID) stands by. Tap anyone, any screen or the scanner. */
(function (K, CR, CO) {
  'use strict';
  if (!K || !CR || !CO) return;
  var rr = K.rr, fillRR = K.fillRR, fillE = K.fillE, soft = K.soft, hash = K.hash, clamp = K.clamp, lerp = K.lerp, text = K.text, shadowed = K.shadowed;
  var F = 470, CEIL = -150, C = CO.C, PUR = '#714B67', SPK = '#7B5CD6', OK = '#1E9E6A';
  var BILL = { x: 320, y: -112, w: 320, h: 286 }, LOG = { x: 662, y: -112, w: 196, h: 160 }, DRAFT = { x: 878, y: -112, w: 196, h: 160 }, ASK = { x: 662, y: 66, w: 412, h: 96 };
  var T = { desk: { x: 380, y: 392, w: 520 }, scan: { x: 236, y: 372, w: 140 } };
  var FIELDS = [['Vendor', 'Harbourline Supplies'], ['Bill date', '12 Sep 2026'], ['Total', 'S$ 1,284.00'], ['PO match', 'PO00123']];
  function setU(g, sx, sy, k) { g.translate(sx, sy); g.scale(k, k); }
  function extOf(W, H, k, sx, sy) { return { l: -(sx + 24) / k, r: (W - sx) / k, t: -(sy + 24) / k, b: (H - sy) / k }; }
  function spark(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r); g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill(); }

  function paintBg(g, W, H, k, sx, sy) {
    g.save(); setU(g, sx, sy, k); var e = extOf(W, H, k, sx, sy);
    var wg = g.createLinearGradient(0, CEIL, 0, F); wg.addColorStop(0, '#F8F7FD'); wg.addColorStop(1, '#ECEAF7'); g.fillStyle = wg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    var rg = g.createRadialGradient(560, 40, 10, 560, 40, 420); rg.addColorStop(0, 'rgba(123,92,214,.10)'); rg.addColorStop(1, 'rgba(123,92,214,0)'); g.fillStyle = rg; g.fillRect(e.l, CEIL, e.r - e.l, F - CEIL);
    g.fillStyle = '#E4E1F2'; g.fillRect(e.l, 250, e.r - e.l, F - 250); g.fillStyle = '#D6D1EA'; g.fillRect(e.l, 246, e.r - e.l, 5);
    for (var i = 0; i < 2; i++) { var wx = -250 + i * 150; CO.sky(g, { l: wx, r: wx + 120, t: -80 }, -80, 220, [[0, '#86BDEE'], [1, '#E3F1FB']]); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.strokeRect(wx, -80, 120, 300); }
    CO.ceiling(g, e, CEIL, '#F1EFF8', '#FAF9FD', '#FFFFFF');
    CO.floor(g, e, F, '#E7EBF1', '#D6DDE7', 'rgba(40,70,120,.08)');
    g.restore();
  }
  function paintFrame(g) {}
  function paintBack(g, ext) {
    /* the screens on the wall */
    [BILL, LOG, DRAFT, ASK].forEach(function (s) { shadowed(g, 14, 5, 0.18, function () { fillRR(g, s.x - 6, s.y - 6, s.w + 12, s.h + 12, 9, '#2A3142'); }); fillRR(g, s.x, s.y, s.w, s.h, 4, '#FFFFFF'); });
    fillRR(g, BILL.x, BILL.y, BILL.w, 24, 4, PUR); g.fillRect(BILL.x, BILL.y + 16, BILL.w, 8); text(g, 'Accounting · Vendor bill · Draft', BILL.x + 12, BILL.y + 16, 9, 800, '#FFFFFF');
    fillRR(g, LOG.x, LOG.y, LOG.w, 20, 4, '#EEF2F7'); text(g, 'LOGGED ON THE RECORD', LOG.x + 10, LOG.y + 14, 7, 800, '#5C6B7A');
    fillRR(g, DRAFT.x, DRAFT.y, DRAFT.w, 20, 4, '#E0456B'); g.fillRect(DRAFT.x, DRAFT.y + 12, DRAFT.w, 8); text(g, 'Helpdesk · reply', DRAFT.x + 10, DRAFT.y + 14, 7.4, 800, '#FFFFFF');
    fillRR(g, ASK.x, ASK.y, ASK.w, 20, 4, '#3167CA'); g.fillRect(ASK.x, ASK.y + 12, ASK.w, 8); text(g, 'ASK YOUR RECORDS · sample', ASK.x + 10, ASK.y + 14, 7.4, 800, '#FFFFFF');
    /* the scanner on its cabinet, with the paper bills */
    var sc = T.scan; soft(g, sc.x + sc.w / 2, F + 4, 80, 8, 0.3); fillRR(g, sc.x, sc.y, sc.w, F - sc.y, 6, '#D9C3A0'); fillRR(g, sc.x + 8, sc.y + 14, sc.w - 16, F - sc.y - 24, 4, '#E8D6B8');
    fillRR(g, sc.x + 16, sc.y - 30, 90, 30, 6, '#5C6B7A'); fillRR(g, sc.x + 22, sc.y - 36, 78, 8, 3, '#7A869C'); fillRR(g, sc.x + 28, sc.y - 50, 66, 16, 2, '#FFFFFF'); fillRR(g, sc.x + 32, sc.y - 46, 40, 2.4, 1.2, '#C9D3E3');
    K.plant(g, { x: 1170, y: F }, '#FFFFFF', '#E3E8EF');
  }
  function paintFront(g, ext) {
    var d = T.desk; CO.desk(g, d.x, d.y, d.w, F, { open: true, legs: '#9AA6BC', top: '#E9EEF6' });
    [[520, 'Approve'], [700, 'Send']].forEach(function (m) { fillRR(g, m[0] - 4, d.y - 74, 108, 64, 6, '#2A3142'); fillRR(g, m[0] + 46, d.y - 10, 10, 10, 2, '#5C6B7A'); fillRR(g, m[0] + 30, d.y - 3, 42, 4, 2, '#5C6B7A'); });
  }

  var W = CR.who;
  var FIN = W({ x: 460, y: 470, s: 0.5, ph: 0.8, skin: 0, hair: 0, style: 'bob', outfit: 'cardigan', top: '#2E9C7E', top2: '#FFFFFF', glasses: true, sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]] });
  var AGT = W({ x: 846, y: 470, s: 0.5, ph: 1.8, skin: 2, hair: 1, style: 'short', outfit: 'polo', top: '#E0456B', headset: '#1B2350', sit: true, chairCol: '#2A3550', id: '#9AA6BC', hands: [[-60, -206], [60, -206]] });
  var ENG = W({ x: 948, y: 470, s: 0.54, ph: 2.5, skin: 1, hair: 0, style: 'short', outfit: 'shirt', top: SPK, glasses: true, hands: [[-70, -200], [70, -170]], look: -0.6 });
  var CREW = [
    { x0: 1200, x1: 1420, y: 488, spd: 14, ph: 0.3, label: 'TechNext AI engineer', lines: ['The AI **prepares**. A person approves.', 'Answers come from **your own records**, with the source.'], acts: ['nod', 'id', 'wave'],
      P: W({ s: 0.5, skin: 3, hair: 1, style: 'long', outfit: 'polo', top: '#3167CA', hold: 'tablet' }) },
    { front: true, x0: -440, x1: 40, y: 690, spd: 18, ph: 0.6, label: 'TechNext consultant', lines: ['Built by a team that also **implements Odoo**.', 'Every AI step is **logged** on the record.'], acts: ['cheer', 'id', 'wave'],
      P: W({ s: 0.58, skin: 0, hair: 0, style: 'short', outfit: 'shirt', top: PUR, hold: 'clipboard', hands: [[-60, -212], [70, -150]] }) }
  ];

  var SCN = { t: -9 };
  function cyc(S, t) { var keys = ['capture', 'match', 'approve', 'log']; var i = keys.indexOf(S.hot); return i >= 0 ? ((t - (S.kT || 0)) * 0.9) % 7 : (t * 0.45) % 7; }
  function paintLive(g, t, now, S) {
    CO.crew(CREW, g, t, S, false);
    /* the bill: the AI fills the fields one by one, matches the PO, then waits for approval */
    var c = cyc(S, t), nf = Math.min(4, Math.floor(c)), approved = c > 5.6;
    FIELDS.forEach(function (f, i) { var y = BILL.y + 44 + i * 40, on = i < nf, hi = i === nf - 1 && c - nf < 0.6;
      text(g, f[0], BILL.x + 16, y + 14, 9, 700, '#8A96A8'); fillRR(g, BILL.x + 104, y, 200, 26, 6, hi ? '#EFEAFB' : '#F6F8FB');
      if (on) { text(g, f[1], BILL.x + 114, y + 17, 10, 800, '#1B1F3B'); spark(g, BILL.x + 292, y + 13, 6, SPK); if (i === 3) { fillE(g, BILL.x + 274, y + 13, 7, 7, OK); g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.beginPath(); g.moveTo(BILL.x + 270.5, y + 13); g.lineTo(BILL.x + 273, y + 15.5); g.lineTo(BILL.x + 277.5, y + 10.5); g.stroke(); } } });
    var by = BILL.y + 216; fillRR(g, BILL.x + 16, by, 186, 28, 14, '#F1EDFC'); spark(g, BILL.x + 32, by + 14, 7, SPK); text(g, 'Prepared by AI · a person approves', BILL.x + 44, by + 18, 7.6, 800, '#4B3A8A');
    var press = c > 5 && c < 5.6; fillRR(g, BILL.x + 214, by, 90, 28, 8, approved ? OK : (press ? '#5A3A52' : PUR)); text(g, approved ? 'Posted' : 'Approve', BILL.x + 259, by + 18, 9.5, 800, '#FFFFFF', 'center');
    /* the record's log */
    [['AI read the bill and filled four fields', 4], ['Matched to purchase order PO00123', 4.2], ['Approved and posted by Finance', 5.6]].forEach(function (l, i) { var y = LOG.y + 30 + i * 42, on = c >= l[1];
      fillE(g, LOG.x + 14, y + 6, 6, 6, on ? (i === 2 ? OK : SPK) : '#E3E8EF'); var words = l[0].split(' '), line = '', ly = y + 4;
      words.forEach(function (w) { if ((line + w).length > 24) { text(g, line, LOG.x + 26, ly, 7, 700, on ? '#1B1F3B' : '#B0BAC9'); line = ''; ly += 10; } line += w + ' '; }); text(g, line, LOG.x + 26, ly, 7, 700, on ? '#1B1F3B' : '#B0BAC9'); });
    /* the helpdesk reply: drafted by AI, the agent edits and sends */
    var dr = S.hot === 'draft' ? ((t - (S.kT || 0)) * 1.2) % 6 : (t * 0.5) % 6, dn = Math.floor(clamp(dr * 22, 0, 90));
    fillRR(g, DRAFT.x + 10, DRAFT.y + 28, 150, 22, 8, '#F4F6FA'); text(g, '"Where is my order SO0412?"', DRAFT.x + 16, DRAFT.y + 42, 6.8, 700, '#3D4560');
    var reply = 'Hi Mei, your order shipped today. Tracking: SG4482. Thanks for waiting!';
    fillRR(g, DRAFT.x + 30, DRAFT.y + 58, 156, 54, 8, '#FDECF1'); spark(g, DRAFT.x + 40, DRAFT.y + 68, 5, '#E0456B');
    var rtx = reply.slice(0, dn), line = '', rl = 0; rtx.split(' ').forEach(function (w) { if ((line + w).length > 25) { text(g, line, DRAFT.x + 50, DRAFT.y + 72 + rl * 10, 6.4, 700, '#5A2236'); line = ''; rl++; } line += w + ' '; }); text(g, line, DRAFT.x + 50, DRAFT.y + 72 + rl * 10, 6.4, 700, '#5A2236');
    fillRR(g, DRAFT.x + 120, DRAFT.y + 124, 66, 22, 7, dr > 4.5 ? OK : '#E0456B'); text(g, dr > 4.5 ? 'Sent' : 'Edit & send', DRAFT.x + 153, DRAFT.y + 139, 7.4, 800, '#FFFFFF', 'center');
    /* ask your records */
    var ak = S.hot === 'ask' ? ((t - (S.kT || 0)) * 1.2) % 6 : (t * 0.4) % 6, an = Math.floor(clamp((ak - 1) * 26, 0, 80));
    fillRR(g, ASK.x + 12, ASK.y + 30, 200, 22, 8, '#EEF3FD'); text(g, 'Units of SKU-204 sold last month?', ASK.x + 20, ASK.y + 44, 7.4, 800, '#1E3A6E');
    var ans = '142 units across 9 orders. Source: Sales report, Aug 2026.'; fillRR(g, ASK.x + 182, ASK.y + 58, 218, 30, 8, '#F1EDFC'); spark(g, ASK.x + 194, ASK.y + 73, 5, SPK); text(g, ans.slice(0, an), ASK.x + 204, ASK.y + 76, 6.8, 700, '#4B3A8A');
    /* the scanner: a paper bill feeds through (tapped, or on the Capture stop) */
    var sc = T.scan, st = S.hot === 'capture' ? (t % 2) : (t - SCN.t); if (st < 2) { var f = clamp(st / 1.6, 0, 1); g.save(); g.globalAlpha = 1 - Math.max(0, f - 0.8) * 5;
      fillRR(g, lerp(sc.x + 36, sc.x + 120, f), lerp(sc.y - 60, sc.y - 200, f), 40, 52, 3, '#FFFFFF'); fillRR(g, lerp(sc.x + 40, sc.x + 124, f), lerp(sc.y - 54, sc.y - 194, f), 24, 3, 1.5, PUR); g.restore();
      g.strokeStyle = 'rgba(123,92,214,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(sc.x + 30, sc.y - 32 + Math.sin(t * 8) * 4); g.lineTo(sc.x + 92, sc.y - 32 + Math.sin(t * 8) * 4); g.stroke(); }
  }
  function paintFrontLive(g, t, S) {
    CO.crew(CREW, g, t, S, true);
    /* the desk monitors: finance's approve queue, the agent's inbox */
    var d = T.desk, c = cyc(S, t); [[520, PUR, 'Bills to approve'], [700, '#E0456B', 'Replies to send']].forEach(function (m, k) { var mx = m[0], my = d.y - 70; fillRR(g, mx, my, 100, 56, 3, '#FFFFFF'); fillRR(g, mx, my, 100, 10, 3, m[1]); text(g, m[2], mx + 4, my + 7.6, 5, 800, '#FFFFFF');
      for (var l = 0; l < 3; l++) { fillRR(g, mx + 6, my + 16 + l * 12, 60, 4, 2, '#D5DCE6'); spark(g, mx + 86, my + 18 + l * 12, 3.4, l === 0 ? SPK : '#C9C2EA'); } });
    CR.draw(g, t);
  }

  function seat(id, keys, P, acts) { return { id: id, behind: true, keys: keys, P: P, act: function (P, t, S) { var st = S.cast[id], busy = keys.indexOf(S.hot) >= 0; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
    var k2 = Math.abs(Math.sin(t * (busy ? 10 : 3) + P.ph)) * 6; P.hands = busy && id === 'fin' ? [[-60, -206], [110, -230 + k2]] : [[-60, -206 - k2], [60, -206 - (6 - k2)]];
    P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : (id === 'fin' ? 0.5 : -0.5), 0.08); CR.cast(P, st, t, acts); } }; }
  window.IXW.worlds['ai-odoo'] = {
    pan: [-300, 1200],
    paintBg: paintBg, windowBehind: true, paintFrame: paintFrame, paintBack: paintBack, paintFront: paintFront,
    paintWindow: function () {}, paintLive: paintLive, paintFrontLive: paintFrontLive,
    paintForeLive: function (g, t, S) { K.zfore(g, t, S, [], function () { CO.crew(CREW, g, t, S, 'fore'); }); CR.draw(g, t); },
    moteCol: 'rgba(123,92,214,.24)',
    glow: {
      capture: function (g) { rr(g, BILL.x + 6, BILL.y + 36, BILL.w - 12, 80, 10); },
      match: function (g) { rr(g, BILL.x + 6, BILL.y + 160, BILL.w - 12, 40, 10); },
      approve: function (g) { rr(g, BILL.x + 6, BILL.y + 206, BILL.w - 12, 48, 12); },
      log: function (g) { rr(g, LOG.x - 10, LOG.y - 10, LOG.w + 20, LOG.h + 20, 12); },
      draft: function (g) { rr(g, DRAFT.x - 10, DRAFT.y - 10, DRAFT.w + 20, DRAFT.h + 20, 12); },
      ask: function (g) { rr(g, ASK.x - 10, ASK.y - 10, ASK.w + 20, ASK.h + 20, 12); },
      scanner: function (g) { var s = T.scan; rr(g, s.x + 8, s.y - 58, 110, 64, 10); }
    },
    backGlow: ['capture', 'match', 'approve', 'log', 'draft', 'ask', 'scanner'],
    cast: [
      seat('fin', ['approve', 'match'], FIN, ['nod', 'think', 'wave', 'id']),
      seat('agt', ['draft'], AGT, ['type', 'wave', 'nod', 'id']),
      { id: 'eng', behind: false, keys: ['ask', 'log'], P: ENG, act: function (P, t, S) { var st = S.cast.eng, busy = S.hot === 'ask' || S.hot === 'log'; P.talk = t < st.until || busy; P.mood = P.talk ? 'happy' : 'calm';
        P.hands = busy ? [[-70, -200], [-150, -320 + Math.sin(t * 3) * 8]] : [[-70, -200], [70, -170]]; P.look = lerp(P.look, t < st.until ? clamp((S.nexi.x - P.x) / 160, -1, 1) : -0.6, 0.08); CR.cast(P, st, t, ['wave', 'nod', 'id', 'think', 'cheer']); } }
    ],
    toy: function (name, S, t) { if (name === 'scanner') { SCN.t = t; CR.burst('spark', T.scan.x + 60, T.scan.y - 60, t); } },
    hit: function (x, y, S, t) { return CR.hitWalker(x, y, t); },
    onStop: function (key, S, t) { S.kT = t; }
  };
})(window.IXW && window.IXW.kit, window.CR, window.CO);
