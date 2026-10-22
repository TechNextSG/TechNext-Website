/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* 404: shows the address that was not found in the route-lookup panel (text only, never HTML) and sizes the travelling pulse
   to the list. The loops pause while the panel is off-screen. */
(function () {
  'use strict';
  var panel = document.querySelector('[data-nf-panel]');
  var out = document.querySelector('[data-nf-path]');
  if (out) {
    var p = '';
    try { p = decodeURIComponent(location.pathname) + (location.search || ''); } catch (e) { p = location.pathname; }
    if (p && !/^\/404(\.html)?$/.test(p)) out.textContent = location.host + p;
  }
  var list = document.querySelector('.nf-routes');
  function size() { if (list) list.style.setProperty('--nf-run', Math.max(0, list.offsetHeight - 30) + 'px'); }
  size();
  addEventListener('resize', size);
  if (panel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { panel.classList.toggle('fx-off', !e.isIntersecting); });
    }).observe(panel);
  }
})();
