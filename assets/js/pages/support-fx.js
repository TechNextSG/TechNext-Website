/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/support hero: a sample support queue. Timers count down in real time while a ticket is open (they pause while it waits on you
   or is tested by you); every few seconds a ticket moves on, a new urgent one arrives and one is escalated to the lead at 75% of its
   target. Pauses off-screen; reduced motion keeps the static queue. */
(function () {
  'use strict';
  var S = window.SVC;
  if (!S) return;

  var CHIP = { run: ['is-run', 'In progress'], tri: ['', 'Triage'], wait: ['is-draft', 'Waiting on you'], test: ['is-run', 'Testing on staging'], done: ['is-ok', 'Closed'], esc: ['is-draft', 'Escalated to lead'] };
  var PRI = { urgent: 'Urgent', high: 'High', normal: 'Normal', low: 'Low' };
  function initial() {
    return [
      { id: 'T-1042', p: 'urgent', t: 'Bank feed stopped syncing', s: 'run', rem: 2480, tot: 3600 },
      { id: 'T-1043', p: 'high', t: 'Month-end close: check 2307 and SLSP before filing', s: 'tri', rem: 7805, tot: 14400 },
      { id: 'T-1040', p: 'normal', t: 'Add a PO approval step', s: 'wait', rem: 36000, tot: 57600 },
      { id: 'T-1039', p: 'normal', t: 'Upgrade to Odoo 20 on a staging copy', s: 'test', rem: 45000, tot: 57600 },
      { id: 'T-1038', p: 'low', t: 'How do I split a delivery?', s: 'done', rem: 0, tot: 1 }
    ];
  }

  function hero() {
    var p = S.$('[data-sp]');
    if (!p) return;
    var list = S.$('[data-q]', p), feed = S.$('[data-feed]', p), who = S.$$('[data-who]', p);
    var K = { open: S.$('[data-k="open"]', p), closed: S.$('[data-k="closed"]', p), esc: S.$('[data-k="esc"]', p) };
    var kv = { open: 4, closed: 27, esc: 1 }, T = initial();

    function clk(t) {
      if (t.s === 'done') return ['is-met', 'Target met'];
      if (t.s === 'wait' || t.s === 'test') return ['is-paused', 'Paused'];
      var r = Math.max(0, t.rem), h = Math.floor(r / 3600), m = Math.floor(r % 3600 / 60), s = r % 60;
      return ['', [h, m, s].map(function (n) { return (n < 10 ? '0' : '') + n; }).join(':')];
    }
    function row(t, fresh) {
      var li = S.el('li', 'sup-t is-' + t.p + (fresh ? ' is-new' : ''));
      li.setAttribute('data-s', t.s); li.setAttribute('data-id', t.id);
      li.appendChild(S.el('span', 'sup-pr')).setAttribute('aria-hidden', 'true');
      var tx = S.el('span', 'sup-tx'), b = S.el('b', null, t.id + ' '); b.appendChild(S.el('em', null, PRI[t.p]));
      tx.appendChild(b); tx.appendChild(S.el('small', null, t.t)); li.appendChild(tx);
      var c = CHIP[t.s]; li.appendChild(S.el('span', 'sv-st ' + c[0], c[1]));
      var k = clk(t); li.appendChild(S.el('span', 'sup-clk ' + k[0], k[1]));
      var bar = S.el('i', 'sup-bar'); bar.setAttribute('aria-hidden', 'true'); li.appendChild(bar);
      paint(li, t); return li;
    }
    function paint(li, t) {
      var f = t.s === 'done' ? 0 : Math.max(0, Math.min(1, t.rem / t.tot));
      li.style.setProperty('--f', f.toFixed(3));
      li.classList.toggle('is-risk', t.s !== 'done' && f < .25 && f > 0);
    }
    function render(freshId) {
      list.textContent = '';
      T.forEach(function (t) { list.appendChild(row(t, t.id === freshId)); });
    }
    function say(b, t) {
      var li = S.el('li', 'is-new'); li.appendChild(S.el('i'));
      var sp = S.el('span'); sp.appendChild(S.el('b', null, b)); sp.appendChild(document.createTextNode(' ' + t)); li.appendChild(sp);
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    }
    function kset(k, v) { if (kv[k] === v) return; S.count(K[k], v, 0, 600, kv[k]); kv[k] = v; }
    function busy(i) { who.forEach(function (w, k) { w.classList.toggle('is-busy', k === i); }); }
    function get(id) { return T.filter(function (t) { return t.id === id; })[0]; }
    function move(id, s, msg, w) {
      var t = get(id); t.s = s; render(); if (msg) say(id, msg); if (w != null) busy(w);
    }
    function reset() {
      T = initial(); render(); busy(0);
      kset('open', 4); kset('closed', 27); kset('esc', 1);
      feed.textContent = '';
      say('T-1039', 'staging copy ready for your test'); say('T-1043', 'picked up by your consultant'); say('T-1038', 'closed after your test');
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    }

    function tick() {
      T.forEach(function (t) { if (t.s === 'run' || t.s === 'tri' || t.s === 'esc') t.rem -= 1; });
      S.$$('.sup-t', list).forEach(function (li, i) {
        var t = T[i]; if (!t) return;
        var c = S.$('.sup-clk', li), k = clk(t); c.textContent = k[1];
        paint(li, t);
      });
    }

    if (S.reduce) return;
    S.every(p, tick, 1000);
    S.timeline(p, [
      [3200, function () { move('T-1042', 'test', 'fix is on staging, waiting for your test', 1); }],
      [3400, function () { move('T-1043', 'run', 'picked up by your consultant', 0); }],
      [3400, function () { move('T-1042', 'done', 'deployed in the batched release, closed', 2); kset('open', 3); kset('closed', 28); }],
      [3200, function () {
        T = T.filter(function (t) { return t.id !== 'T-1038'; });
        T.unshift({ id: 'T-1045', p: 'urgent', t: 'Payment gateway payout not matched', s: 'tri', rem: 3500, tot: 3600 });
        render('T-1045'); say('T-1045', 'raised as urgent, lead consultant told'); busy(2); kset('open', 4);
      }],
      [3400, function () {
        var t = get('T-1043'); t.rem = Math.round(t.tot * .24); t.s = 'esc'; render();
        say('T-1043', 'reached 75% of its target, escalated to the lead'); kset('esc', 2); busy(2);
      }],
      [3600, function () { move('T-1040', 'run', 'approved by you, in progress', 1); }],
      [4200, function () { reset(); }]
    ]);
  }

  function loop() {
    var l = S.$('[data-loop]');
    if (l) S.watch(l, function (v) { l.classList.toggle('is-off', !v); });
  }

  function init() { hero(); loop(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
