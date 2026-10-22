/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/training hero: a sample role-based plan signing off module by module (session, sandbox, sign-off), role after role,
   with the session order and go-live readiness climbing. Loops while on screen; a click on a role takes over.
   Reduced motion shows the finished plan. */
(function () {
  'use strict';
  var S = window.SVC;
  if (!S) return;

  function hero() {
    var p = S.$('[data-tr]');
    if (!p) return;
    var btns = S.$$('[data-role]', p), lists = S.$$('[data-list]', p), phases = S.$$('[data-phases] li', p), note = S.$('[data-phase]', p);
    var kMods = S.$('[data-k="mods"]', p), kRoles = S.$('[data-k="roles"]', p), kReady = S.$('[data-k="ready"]', p);
    var NOTE = ['Key users first', 'End users next', 'Train the trainer', 'UAT and go-live check'];
    var TOTAL = 27, pips = 0, done = 0, rolesDone = 0, tl = null;

    function show(i) {
      lists.forEach(function (l, k) { l.hidden = k !== i; });
      btns.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    }
    function phase(i) {
      phases.forEach(function (li, k) { li.classList.toggle('is-on', k <= i); });
      note.textContent = NOTE[i];
    }
    function ready(instant) {
      var to = Math.round(pips / TOTAL * 100), from = parseInt(kReady.textContent, 10) || 0;
      if (instant || S.reduce) kReady.textContent = to; else S.count(kReady, to, 0, 450, from);
    }
    function reset() {
      pips = done = rolesDone = 0;
      S.$$('.trn-pips i', p).forEach(function (i) { i.classList.remove('is-on'); });
      S.$$('.trn-list li', p).forEach(function (li) { li.classList.remove('is-done'); });
      kMods.textContent = '0'; kRoles.textContent = '0'; kReady.textContent = '0';
      phase(0);
    }
    function light(r, m, k) {
      var li = lists[r].children[m];
      li.querySelectorAll('.trn-pips i')[k].classList.add('is-on');
      pips++;
      if (k === 2) {
        li.classList.add('is-done'); done++; kMods.textContent = done;
        if (m === 2) { rolesDone++; kRoles.textContent = rolesDone; }
      }
      ready();
    }
    function all() {
      S.$$('.trn-pips i', p).forEach(function (i) { i.classList.add('is-on'); });
      S.$$('.trn-list li', p).forEach(function (li) { li.classList.add('is-done'); });
      pips = TOTAL; done = 9; rolesDone = 3;
      kMods.textContent = '9'; kRoles.textContent = '3'; ready(true); phase(3);
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () { if (tl) tl.stop(); show(+b.getAttribute('data-role')); });
    });

    reset(); show(0);
    if (S.reduce) { all(); return; }

    var steps = [[1200, function () { reset(); show(0); }]];
    function mk(f, a, b, c) { return function () { f(a, b, c); }; }
    for (var r = 0; r < 3; r++) {
      if (r > 0) steps.push([900, mk(function (x) { show(x); phase(x); }, r)]);
      for (var m = 0; m < 3; m++) for (var k = 0; k < 3; k++) steps.push([600, mk(light, r, m, k)]);
    }
    steps.push([800, function () { phase(3); }]);
    steps.push([3600, function () {}]);
    tl = S.timeline(p, steps);
  }

  function pulse() {
    S.$$('.trn-db').forEach(function (n) { S.watch(n, function () {}); });
  }

  function init() { hero(); pulse(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
