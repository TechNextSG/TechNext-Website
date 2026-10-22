/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* BIR CAS page: the readiness panel ticks the eight Annex B requirements in, fills the meter, then walks the timeline
   Set up -> Samples -> Filed -> AC issued, and loops. Pauses off-screen; reduced motion shows the finished state. */
(function () {
  'use strict';
  var panel = document.querySelector('[data-cs-panel]');
  if (!panel) { return; }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var checks = [].slice.call(panel.querySelectorAll('[data-cs-checks] li'));
  var tl = panel.querySelector('[data-cs-tl]'), steps = tl ? [].slice.call(tl.querySelectorAll('li')) : [];
  var meter = panel.querySelector('[data-cs-meter]'), num = panel.querySelector('[data-cs-n]');
  var pill = panel.querySelector('[data-cs-status]'), pillT = panel.querySelector('[data-cs-status-t]');
  var N = checks.length, LAST = steps.length - 1;
  // status pill per timeline stage (verdict colours come from bir-e-invoicing-fx.css)
  var STAGES = [['Setting up', 'likely'], ['Set up', 'later'], ['Samples ready', 'later'], ['Filed at RDO', 'likely'], ['AC issued', 'covered']];

  function paint(done, stage) {
    checks.forEach(function (li, k) { li.classList.toggle('is-on', k < done); });
    meter.style.setProperty('--cs-p', (done / N).toFixed(3));
    num.textContent = done;
    steps.forEach(function (li, k) { li.classList.toggle('is-on', k < stage); li.classList.toggle('is-now', k === stage - 1 && k < LAST); });
    tl.style.setProperty('--bf-s', Math.max(0, stage - 1));
    var s = done === 0 ? ['Checking', 'pending'] : STAGES[stage];
    pillT.textContent = s[0]; pill.setAttribute('data-verdict', s[1]);
  }

  if (reduce) { paint(N, steps.length); return; }

  // the script: 8 ticks (stage 0), then stages 1..4 (Set up .. AC issued), hold, reset
  var seq = [];
  for (var c = 0; c <= N; c++) { seq.push([c, 0, c === 0 ? 700 : 380]); }
  for (var s = 1; s <= steps.length; s++) { seq.push([N, s, s === steps.length ? 2600 : 1000]); }
  var i = -1, timer = null;
  function next() {
    i = (i + 1) % seq.length;
    paint(seq[i][0], seq[i][1]);
    timer = setTimeout(next, seq[i][2]);
  }
  function start() { if (!timer) { timer = setTimeout(next, 300); } }
  function stop() { clearTimeout(timer); timer = null; }
  paint(0, 0);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { panel.classList.toggle('fx-off', !e.isIntersecting); if (e.isIntersecting) { start(); } else { stop(); } });
    }, { rootMargin: '40px' }).observe(panel);
  } else { start(); }
})();
