/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/crm-development hero: a sample pipeline. A deal is qualified, a quotation goes through manager approval and the deal moves
   to Won, with the pipeline numbers recounting. Cards glide between columns (FLIP). Pauses off-screen; reduced motion keeps the
   static board. */
(function () {
  'use strict';
  var S = window.SVC;
  if (!S) return;

  function hero() {
    var p = S.$('[data-crd]');
    if (!p) return;
    var cols = S.$$('.crd-cards', p), colEls = S.$$('.crd-col', p), cards = {};
    S.$$('.crd-card', p).forEach(function (c) { cards[c.getAttribute('data-id')] = c; });
    var K = { open: S.$('[data-k="open"]', p), wf: S.$('[data-k="wf"]', p), won: S.$('[data-k="won"]', p) };
    var P = [.1, .3, .6, 0];
    var qt = S.$('[data-qt]', p), qs = S.$('[data-qs]', p), qc = S.$('[data-qc]', p), appr = S.$$('[data-appr] li', p);
    var home = {}; Object.keys(cards).forEach(function (id) { home[id] = colEls.indexOf(cards[id].closest('.crd-col')); });
    var cur = { open: 83100, wf: 23810, won: 12800 };

    function num(t) { return parseInt(String(t).replace(/,/g, ''), 10) || 0; }
    function recount(instant) {
      var o = 0, w = 0, won = 0;
      Object.keys(cards).forEach(function (id) {
        var c = cards[id], i = colEls.indexOf(c.closest('.crd-col')), v = +c.getAttribute('data-v');
        if (i === 3) won += v; else { o += v; w += v * P[i]; }
      });
      var to = { open: o, wf: Math.round(w), won: won };
      Object.keys(K).forEach(function (k) {
        if (instant || S.reduce) K[k].textContent = S.fmt(to[k]); else S.count(K[k], to[k], 0, 700, cur[k]);
        cur[k] = to[k];
      });
      colEls.forEach(function (ce, i) { S.$('[data-n]', ce).textContent = cols[i].children.length; });
    }
    function move(id, to, animate) {
      var c = cards[id], first = c.getBoundingClientRect();
      cols[to].appendChild(c);
      c.classList.toggle('is-won', to === 3);
      if (animate && !S.reduce) {
        var last = c.getBoundingClientRect(), dx = first.left - last.left, dy = first.top - last.top;
        c.style.transition = 'none'; c.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
        void c.offsetWidth;
        c.style.transition = 'transform .75s cubic-bezier(.16,1,.3,1)'; c.style.transform = '';
        c.classList.add('is-moving');
        setTimeout(function () { c.classList.remove('is-moving'); c.style.transition = ''; }, 800);
      }
      recount(!animate);
    }
    function quote(step, chip, cls, text) {
      appr.forEach(function (li, i) { li.classList.toggle('is-on', i <= step); });
      qc.className = 'sv-st ' + cls; qc.textContent = chip; qs.textContent = text;
    }
    function reset() {
      Object.keys(cards).forEach(function (id) { if (colEls.indexOf(cards[id].closest('.crd-col')) !== home[id]) move(id, home[id], false); });
      quote(0, 'Draft', 'is-run', 'Drafted from the opportunity');
      recount(true);
    }

    if (S.reduce) return;
    S.timeline(p, [
      [1500, function () { move('nor', 2, true); }],
      [1600, function () { move('rid', 1, true); }],
      [1500, function () { quote(1, 'Over the limit', 'is-draft', '12% discount is over the approval limit'); }],
      [1700, function () { quote(1, 'Waiting for manager', 'is-draft', 'Sent to the manager for approval'); }],
      [1700, function () { quote(2, 'Approved', 'is-ok', 'Approved by Rina'); move('lim', 3, true); }],
      [1800, function () { quote(3, 'Sent', 'is-ok', 'Sent with customer, products and pricelist carried over'); }],
      [3800, function () { reset(); }]
    ]);
  }

  function table() {
    var path = S.$('[data-path]');
    if (path) S.watch(path, function (v) { path.classList.toggle('is-off', !v); });
  }

  function init() { hero(); table(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
