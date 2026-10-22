/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Company page: live local time for the three offices, count-ups, pause loops off-screen. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fmtCache = {};
  function fmt(tz, secs) {
    var k = tz + secs;
    if (!fmtCache[k]) {
      var o = { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false };
      if (secs) o.second = '2-digit';
      try { fmtCache[k] = new Intl.DateTimeFormat('en-GB', o); } catch (e) { fmtCache[k] = null; }
    }
    return fmtCache[k];
  }
  var clocks = [].slice.call(document.querySelectorAll('time[data-tz]'));
  function tick() {
    var now = new Date();
    clocks.forEach(function (el) {
      var f = fmt(el.getAttribute('data-tz'), !el.hasAttribute('data-short'));
      if (f) el.textContent = f.format(now);
    });
  }
  tick();
  var timer = setInterval(tick, 1000);

  // count-ups
  var counts = [].slice.call(document.querySelectorAll('[data-count]'));
  function run(el) {
    var to = +el.getAttribute('data-count'), plus = el.hasAttribute('data-plus') ? '+' : '';
    if (reduce) { el.textContent = to + plus; return; }
    var t0 = null;
    (function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / 1200), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + (p === 1 ? plus : '');
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); } });
    }, { threshold: .6 });
    counts.forEach(function (c) { cio.observe(c); });
    var panel = document.querySelector('[data-cx-panel]');
    if (panel) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { panel.classList.toggle('fx-off', !e.isIntersecting); });
      }).observe(panel);
    }
  } else { counts.forEach(run); }
})();
