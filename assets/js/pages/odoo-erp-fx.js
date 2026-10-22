/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Odoo implementation page: hero database panel (data lines + sample flow Sales -> Inventory -> Accounting -> BIR reports ready)
   and the focus-app tabs. Loops pause off-screen; reduced motion shows the finished state. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  function db() {
    var root = document.querySelector('[data-erp-db]');
    if (!root) return;
    var body = root.querySelector('[data-erp-body]'), svg = root.querySelector('[data-erp-links]');
    var panes = { sale: root.querySelector('[data-pane="sale"]'), stock: root.querySelector('[data-pane="stock"]'), acc: root.querySelector('[data-pane="acc"]') };
    var bir = root.querySelector('[data-erp-bir]');
    var reps = [].slice.call(root.querySelectorAll('.erp-reps li'));
    reps.forEach(function (li, i) { li.style.setProperty('--k', i); });
    var counts = [].slice.call(root.querySelectorAll('[data-count]'));

    function rel(el) {
      var b = body.getBoundingClientRect(), r = el.getBoundingClientRect();
      return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top, w: r.width, h: r.height };
    }
    function draw() {
      var s = rel(panes.sale), k = rel(panes.stock), a = rel(panes.acc);
      var bw = body.offsetWidth, bh = body.offsetHeight;
      svg.setAttribute('viewBox', '0 0 ' + bw + ' ' + bh);
      var ds = [
        'M' + s.r + ' ' + (s.t + s.h / 2) + ' L' + k.l + ' ' + (k.t + k.h / 2),
        'M' + (s.l + s.w / 2) + ' ' + s.b + ' L' + (s.l + s.w / 2) + ' ' + a.t,
        'M' + (k.l + k.w / 2) + ' ' + k.b + ' L' + (k.l + k.w / 2) + ' ' + a.t
      ];
      svg.textContent = '';
      ds.forEach(function (d) { var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); svg.appendChild(p); });
      if (!reduce) ds.forEach(function (d) { var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'erp-flow'); p.setAttribute('pathLength', '100'); svg.appendChild(p); });
    }
    draw();
    window.addEventListener('resize', draw);
    if (window.ResizeObserver) new ResizeObserver(draw).observe(body);

    function finish() {
      root.classList.add('is-done'); bir.classList.add('is-ready');
      Object.keys(panes).forEach(function (k) { panes[k].classList.remove('is-lit'); });
    }
    if (reduce) { finish(); return; }

    var visible = true, timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function lit(k) { Object.keys(panes).forEach(function (n) { panes[n].classList.toggle('is-lit', n === k); }); }
    function cycle() {
      timers.forEach(clearTimeout); timers = [];
      root.classList.remove('is-done'); bir.classList.remove('is-ready'); lit(null);
      counts.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
      later(function () { lit('sale'); }, 600);
      later(function () { lit('stock'); }, 2000);
      later(function () { lit('acc'); }, 3400);
      later(finish, 4800);
      later(function () { if (visible) cycle(); else timers.push(setTimeout(function () { cycle(); }, 3000)); }, 11000);
    }
    cycle();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        root.classList.toggle('is-off', !visible);
      }, { threshold: 0.05 }).observe(root);
    }
  }

  function tabs() {
    var root = document.querySelector('[data-erp-tabs]');
    if (!root) return;
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = [].slice.call(root.querySelectorAll('[role="tabpanel"]'));
    function pick(i, focus) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length;
        if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); pick((i + 1) % n, true); }
        else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); pick((i + n - 1) % n, true); }
        else if (k === 'Home') { e.preventDefault(); pick(0, true); }
        else if (k === 'End') { e.preventDefault(); pick(n - 1, true); }
      });
    });
    pick(0);
  }

  function offscreen() {
    if (!('IntersectionObserver' in window)) return;
    [].slice.call(document.querySelectorAll('.erp-path')).forEach(function (el) {
      new IntersectionObserver(function (e) { el.classList.toggle('is-off', !e[0].isIntersecting); }).observe(el);
    });
  }

  function init() { db(); tabs(); offscreen(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
