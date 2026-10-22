/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/discovery hero: one sample order, first as it runs today (chat, spreadsheets, paper) and then on Odoo, with the
   counts read off the map and a written recommendation. Loops while on screen; a click on Today / With Odoo takes over.
   Reduced motion shows the finished "With Odoo" state. Plus the lit chains in "We follow the work". */
(function () {
  'use strict';
  var S = window.SVC;
  if (!S) return;

  function hero() {
    var p = S.$('[data-dv]');
    if (!p) return;
    var btns = S.$$('[data-st]', p), cap = S.$('[data-cap]', p), steps = S.$('[data-steps]', p);
    var kp = S.$$('.dv-kpis dd', p), head = S.$('.dv-rec .sv-h span', p), sub = S.$('.dv-rec .sv-h small', p);
    var CAP = ['Chat, sheets and paper', 'One Odoo database'];
    var HEAD = ['Gaps found on the map', 'Recommendation'], SUB = ['before anything is built', 'written scope, sample'];
    var state = -1, scanT = null, tl = null;

    function set(s, instant) {
      if (s === state) return;
      var first = state < 0;
      state = s;
      p.classList.toggle('is-b', s === 1);
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-st') === s)); });
      cap.textContent = CAP[s]; head.textContent = HEAD[s]; sub.textContent = SUB[s];
      kp.forEach(function (d, i) {
        var to = +d.getAttribute(s ? 'data-b' : 'data-a'), from = parseFloat(d.textContent) || 0;
        if (instant || first || S.reduce) d.textContent = to; else S.count(d, to, i * 90, 900, from);
      });
      if (!instant && !S.reduce) {
        steps.classList.add('is-scan');
        clearTimeout(scanT); scanT = setTimeout(function () { steps.classList.remove('is-scan'); }, 1100);
      }
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () { if (tl) tl.stop(); set(+b.getAttribute('data-st')); });
    });

    set(0, true);
    if (S.reduce) { set(1, true); return; }
    S.once(p, function () { kp.forEach(function (d, i) { S.count(d, +d.getAttribute('data-a'), i * 100, 1100); }); });
    tl = S.timeline(p, [[4200, function () { set(1); }], [6800, function () { set(0); }]]);
  }

  /* chains in "We follow the work": the steps light one by one when the row scrolls in */
  function chains() {
    S.$$('[data-chain]').forEach(function (a) {
      S.$$('.dv-chain li', a).forEach(function (n, i) { n.style.setProperty('--k', i); });
    });
    var path = S.$('[data-path]');
    if (path) S.watch(path, function (v) { path.classList.toggle('is-off', !v); });
  }

  function init() { hero(); chains(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
