/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* BIR e-invoicing page: deadline countdown, sample e-invoice transmit timeline, rail progress, report-sheet parallax.
   Loops pause off-screen; reduced motion shows the final state. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* countdown to 31 Dec 2026 23:59 +08:00 */
  var cd = $$('[data-cd]');
  if (cd.length) {
    var END = Date.parse('2026-12-31T23:59:00+08:00'), pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var tick = function () {
      var ms = Math.max(0, END - Date.now()), m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60);
      cd.forEach(function (el) { var k = el.getAttribute('data-cd'); el.textContent = k === 'd' ? d : pad(k === 'h' ? h : m % 60); });
    };
    tick(); setInterval(tick, 20000);
  }

  /* e-invoice record: Draft -> Validated -> Sent to EIS -> Accepted, loops */
  var rec = $('[data-bf-rec]'), tl = $('[data-bf-tl]');
  if (rec && tl) {
    var steps = $$('li', tl), pill = $('[data-bf-status]'), pt = $('[data-bf-status-t]');
    var names = ['Draft', 'Validated', 'Sent to EIS', 'Accepted'], verd = ['pending', 'likely', 'later', 'covered'];
    var i = -1, timer = null;
    var show = function (n) {
      steps.forEach(function (li, k) { li.classList.toggle('is-on', k <= n); li.classList.toggle('is-now', k === n && n < 3); });
      tl.style.setProperty('--bf-s', n);
      pt.textContent = names[n]; pill.setAttribute('data-verdict', verd[n]);
      rec.classList.toggle('is-live', n === 3);
    };
    if (reduce) { show(3); }
    else {
      var step = function () {
        i = (i + 1) % 5;
        show(Math.min(i, 3));
        var wait = i === 4 ? 1800 : (i === 2 ? 1500 : 1200);
        if (i === 4) { i = -1; }
        timer = setTimeout(step, wait);
      };
      var start = function () { if (!timer) { timer = setTimeout(step, 300); } };
      var stop = function () { clearTimeout(timer); timer = null; };
      show(0);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { rec.classList.toggle('fx-off', !e.isIntersecting); if (e.isIntersecting) { start(); } else { stop(); } }); }, { rootMargin: '40px' }).observe(rec);
      } else { start(); }
    }
  }

  /* guideline rail: line fills with scroll */
  var rail = $('[data-bf-rail]');
  if (rail) {
    if (reduce) { rail.style.setProperty('--bf-p', 1); }
    else {
      var rp = function () {
        var r = rail.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / Math.max(1, r.height)));
        rail.style.setProperty('--bf-p', p.toFixed(3));
      };
      addEventListener('scroll', rp, { passive: true }); addEventListener('resize', rp); rp();
    }
  }

  /* report sheets: gentle scroll parallax (desktop only) */
  var sheets = $('[data-bf-sheets]');
  if (sheets && !reduce) {
    var items = $$('[data-par]', sheets), raf = 0, on = false;
    var mq = matchMedia('(min-width: 1001px)');
    var upd = function () {
      raf = 0;
      items.forEach(function (el) {
        if (!mq.matches) { el.style.setProperty('--py', '0px'); return; }
        var r = el.getBoundingClientRect(), c = r.top + r.height / 2 - window.innerHeight / 2;
        var k = parseFloat(el.style.getPropertyValue('--p')) || 0;
        el.style.setProperty('--py', (c * k * -1).toFixed(1) + 'px');
      });
    };
    var req = function () { if (on && !raf) { raf = requestAnimationFrame(upd); } };
    addEventListener('scroll', req, { passive: true }); addEventListener('resize', req);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { on = es[0].isIntersecting; req(); }, { rootMargin: '200px' }).observe(sheets);
    } else { on = true; req(); }
  }
})();
