/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /get-started and /free-website-with-odoo: loops (conic form edge, step rail, previews) pause while off-screen. Reduced motion is handled in CSS. */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('is-off', !e.isIntersecting); });
  }, { threshold: 0.02 });
  [].forEach.call(document.querySelectorAll('[data-loop]'), function (el) { io.observe(el); });
  var hero = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('fx-off', !e.isIntersecting); });
  });
  [].forEach.call(document.querySelectorAll('.fx-hero'), function (el) { hero.observe(el); });
})();
