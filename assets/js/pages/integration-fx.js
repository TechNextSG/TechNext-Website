/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/integration hero: four sample connectors (bank feed, payment gateway, marketplace, online store) syncing into Odoo one after
   the other with live status, one retry, a blocked duplicate and a running sync log. Pauses off-screen; reduced motion shows the
   finished state. Plus the lit flow in "Standard connectors first". */
(function () {
  'use strict';
  var S = window.SVC;
  if (!S) return;

  function hero() {
    var p = S.$('[data-ig]');
    if (!p) return;
    var rows = {}; S.$$('[data-rows] li', p).forEach(function (li) { rows[li.getAttribute('data-r')] = li; });
    var feed = S.$('[data-feed]', p), bar = S.$('[data-bar]', p), rect = S.$('[data-rect]', p);
    var K = { proc: S.$('[data-k="proc"]', p), retry: S.$('[data-k="retry"]', p), dup: S.$('[data-k="dup"]', p) };
    var val = { proc: 1240, retry: 0, dup: 0 };
    var B = { bank: [38, 41, 36], pay: [12, 9, 14], mkt: [6, 8, 5], shop: [4, 7, 3] };
    var cy = 0;

    function st(key, cls, text, n) {
      var li = rows[key], s = S.$('[data-s]', li);
      s.className = 'sv-st ' + cls; s.textContent = text;
      li.classList.toggle('is-run', cls === 'is-run');
      li.classList.toggle('is-retry', cls === 'is-draft');
      if (n != null) S.$('[data-n]', li).textContent = n;
    }
    function bump(k, by) {
      var to = val[k] + by; S.count(K[k], to, 0, 700, val[k]); val[k] = to;
    }
    function say(b, t) {
      var li = S.el('li', 'is-new'); li.appendChild(S.el('i'));
      var sp = S.el('span'); sp.appendChild(S.el('b', null, b)); sp.appendChild(document.createTextNode(' ' + t)); li.appendChild(sp);
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    }
    function b(k) { return B[k][cy % 3]; }
    function synced(k, n, msg, tag) {
      st(k, 'is-ok', 'Synced', n); bump('proc', n); say(tag, msg);
    }

    var steps = [
      [900, function () { st('bank', 'is-run', 'Syncing'); }],
      [1300, function () { var n = b('bank'); synced('bank', n, n + ' statement lines imported', 'Bank feed'); rect.textContent = (n - 3) + ' of ' + n; bar.style.transform = 'scaleX(' + ((n - 3) / n).toFixed(3) + ')'; }],
      [700, function () { st('pay', 'is-run', 'Syncing'); }],
      [1200, function () { var n = b('pay'); synced('pay', n, 'payout of ' + n + ' payments matched', 'Gateway'); }],
      [700, function () { st('mkt', 'is-run', 'Syncing'); }],
      [1100, function () { st('mkt', 'is-draft', 'Retrying'); bump('retry', 1); say('Marketplace', 'call failed, retry 1 of 4'); }],
      [1700, function () { var n = b('mkt'); synced('mkt', n, n + ' orders in, stock levels out, duplicate blocked', 'Marketplace'); bump('dup', 1); }],
      [700, function () { st('shop', 'is-run', 'Syncing'); }],
      [1200, function () { var n = b('shop'); synced('shop', n, n + ' web orders became sales orders', 'Store'); }],
      [2800, function () { cy++; }]
    ];
    S.timeline(p, steps);
  }

  function flow() {
    var f = S.$('[data-flow]');
    if (f) S.watch(f, function (v) { f.classList.toggle('is-off', !v); });
    S.$$('.itg-short b[data-count]').forEach(function (n) {
      S.once(n, function () { S.count(n, +n.getAttribute('data-count'), 0, 900); }, .6);
    });
  }

  function init() { hero(); flow(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
