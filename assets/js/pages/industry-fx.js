/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* The eight industry pages (22 Oct 2026): the hero panel (a sample Odoo record that runs through its status bar, counts up, fills its lines
   and posts a journal entry) and the workflow chain (cards reveal as the glowing data line reaches them). Loops pause off-screen;
   with reduced motion every panel and chain shows its finished state at once. */
(function () {
  'use strict';
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var hasIO = 'IntersectionObserver' in window;

  /* ---------------- hero panel ---------------- */
  function fmt(v, dec) { return v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function setCount(el, v) { el.textContent = (el.getAttribute('data-pre') || '') + fmt(v, +el.getAttribute('data-dec') || 0) + (el.getAttribute('data-suf') || ''); }
  function runCount(el, ms) {
    var to = parseFloat(el.getAttribute('data-count')) || 0, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / ms), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(el, to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function panel(root) {
    var hero = root.closest('.ixf-hero');
    var segs = [].slice.call(root.querySelectorAll('.ixf-seg'));
    var counts = [].slice.call(root.querySelectorAll('[data-count]'));
    var visible = true, timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function stage(n) {
      for (var i = 1; i <= 4; i++) root.classList.toggle('is-s' + i, i <= n);
      segs.forEach(function (s, k) { s.classList.toggle('is-done', k < n); s.classList.toggle('is-cur', k === n); });
      if (n === 1) counts.forEach(function (c) { runCount(c, 1100); });
    }
    function cycle() {
      timers.forEach(clearTimeout); timers = [];
      stage(0);
      counts.forEach(function (c) { setCount(c, 0); });
      later(function () { stage(1); }, 500);
      later(function () { stage(2); }, 1900);
      later(function () { stage(3); }, 3500);
      later(function () { stage(4); }, 4700);
      later(function wait() { if (visible && !document.hidden) cycle(); else timers.push(setTimeout(wait, 1200)); }, 11500);
    }
    if (reduce) return;                       // the finished state is the default markup
    root.classList.add('is-js');
    cycle();
    root.addEventListener('ixf:replay', cycle);   // home industry switch: start again when this panel is picked
    if (hasIO) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        (hero || root).classList.toggle('fx-off', !visible);
      }, { threshold: 0.05 }).observe(root);
    }
  }

  /* ---------------- workflow chain ---------------- */
  function chain(root) {
    var steps = [].slice.call(root.querySelectorAll('.ixf-step'));
    if (reduce || !steps.length) return;      // finished state is the default markup (line full, every card shown)
    root.classList.add('is-js');
    root.style.setProperty('--p', '0');
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight, line = vh * 0.62;
      var r = root.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (line - (r.top + 24)) / Math.max(1, r.height - 48)));
      root.style.setProperty('--p', p.toFixed(4));
      steps.forEach(function (s) {
        var b = s.getBoundingClientRect();
        var node = b.top + b.height / 2;
        if (b.top < vh * 0.86) s.classList.add('is-on');
        s.classList.toggle('is-lit', node < line);
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
    setTimeout(update, 400);
  }

  function offscreen() {
    if (!hasIO) return;
    [].slice.call(document.querySelectorAll('.ixf-phases-sec')).forEach(function (el) {
      new IntersectionObserver(function (e) { el.classList.toggle('fx-off', !e[0].isIntersecting); }).observe(el);
    });
  }

  /* ---------------- home: industry switch (tabs; the picked industry's panel runs) ---------------- */
  function switcher(root) {
    var tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
    function pick(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab, pane = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (pane) pane.hidden = !on;
      });
      var cur = document.getElementById(tab.getAttribute('aria-controls'));
      var p = cur && cur.querySelector('[data-ixf-panel]');
      if (p) p.dispatchEvent(new CustomEvent('ixf:replay'));
      if (focus) tab.focus({ preventScroll: true });
      // tablets and phones: the tab row scrolls sideways; bring the picked tab fully into it without moving the page
      var row = root.querySelector('.ixs-tabs'), r = tab.getBoundingClientRect(), rr = row.getBoundingClientRect();
      if (row.scrollWidth > row.clientWidth && (r.left < rr.left || r.right > rr.right))
        row.scrollBy({ left: r.left < rr.left ? r.left - rr.left - 16 : r.right - rr.right + 16, behavior: reduce ? 'auto' : 'smooth' });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { if (t.getAttribute('aria-selected') !== 'true') pick(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (n === undefined) return;
        e.preventDefault();
        pick(tabs[(n + tabs.length) % tabs.length], true);
      });
    });
  }

  function init() {
    [].slice.call(document.querySelectorAll('[data-ixs-root]')).forEach(switcher);
    [].slice.call(document.querySelectorAll('[data-ixf-panel]')).forEach(panel);
    [].slice.call(document.querySelectorAll('[data-ixf-chain]')).forEach(chain);
    offscreen();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
