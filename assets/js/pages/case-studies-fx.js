/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Case studies: count-ups in the delivery panel and a pause for its loops while it is off-screen. Reduced motion shows the final numbers. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    var panel = document.querySelector('[data-cs-panel]');
    if (panel) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { panel.classList.toggle('fx-off', !e.isIntersecting); });
      }).observe(panel);
    }
  } else { counts.forEach(run); }
})();
