/* Home, 12 Nov 2026 overhaul: the looping "sample data" UI demos. The 2-step forms live in site.js. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- looping UI demos: data-p walks 0..3 while on screen */
  var uis = document.querySelectorAll('[data-loop-ui]');
  if (reduce) { uis.forEach(function (u) { u.setAttribute('data-p', '3'); }); }
  else if ('IntersectionObserver' in window) {
    uis.forEach(function (u) {
      var t = null, p = 0;
      var step = function () {
        p = (p + 1) % 4; u.setAttribute('data-p', String(p));
        if (u.classList.contains('hv3-branch') && p > 0) tick(u);
        t = setTimeout(step, p === 3 ? 2600 : 1300);
      };
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !t) { t = setTimeout(step, 600); }
          else if (!e.isIntersecting && t) { clearTimeout(t); t = null; }
        });
      }, { threshold: 0.35 }).observe(u);
    });
  }
  function tick(u) {   // one branch issues its next invoice number in sequence
    var codes = u.querySelectorAll('code[data-seq]'), c = codes[Math.floor(Math.random() * codes.length)];
    var n = (+c.getAttribute('data-n') || 0) + 1;
    c.setAttribute('data-n', String(n));
    c.textContent = c.getAttribute('data-seq') + String(n).padStart(6, '0');
    c.classList.add('is-tick'); setTimeout(function () { c.classList.remove('is-tick'); }, 700);
  }
})();
