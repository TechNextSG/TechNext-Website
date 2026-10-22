/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Odoo app pages and the apps hub (22 Oct 2026): the hero panel's live sample record (walks the app's main path, shows the
   hand-off), the hub panel's lit category rows, the animated posting ledger of Accounting, Sales and Inventory, a small pointer
   tilt on the Odoo window, and the lifecycle demo's off-screen pause. Every loop stops while its panel is off-screen; under
   reduced motion each panel shows its finished state. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }

  /* calls fn(true|false) when el enters or leaves the viewport (true once if IntersectionObserver is missing) */
  function watch(el, fn, margin) {
    if (!hasIO) { fn(true); return; }
    new IntersectionObserver(function (e) { fn(e[0].isIntersecting); }, { threshold: 0.06, rootMargin: margin || '0px' }).observe(el);
  }

  /* ---------------------------------------------------------------- hero panel: sample record */
  function record(panel) {
    var root = panel.querySelector('[data-apx-rec]');
    if (!root) return;
    var steps = $$('.apx-rail li', root), rail = root.querySelector('.apx-rail'), note = root.querySelector('[data-apx-note]'), hos = $$('.apx-ho', root);
    if (!steps.length) return;
    var k = -1, timer = 0, seen = true;
    function show(n) {
      steps.forEach(function (li, i) { li.classList.toggle('is-on', i === n); li.classList.toggle('is-past', i < n); });
      rail.style.setProperty('--p', steps.length > 1 ? (n / (steps.length - 1)).toFixed(3) : '1');
      note.textContent = steps[n].getAttribute('data-note') || '';
      note.classList.remove('is-swap'); void note.offsetWidth; note.classList.add('is-swap');
      var any = false;
      hos.forEach(function (h) { var on = +h.getAttribute('data-at') === n; h.classList.toggle('is-on', on); any = any || on; });
      root.classList.toggle('has-ho', any);
    }
    if (reduce) { show(steps.length - 1); return; }
    function next() {
      clearTimeout(timer);
      if (!seen) { timer = setTimeout(next, 600); return; }
      k = (k + 1) % steps.length;
      show(k);
      timer = setTimeout(next, k === steps.length - 1 ? 3400 : 1900);
    }
    watch(panel, function (v) { seen = v; });
    next();
  }

  /* ---------------------------------------------------------------- hub panel: category rows light up in turn */
  function hub(panel) {
    var rows = $$('.aph-row', panel);
    if (!rows.length) return;
    if (reduce) return;
    var k = -1, timer = 0, seen = true;
    function next() {
      clearTimeout(timer);
      if (!seen) { timer = setTimeout(next, 600); return; }
      k = (k + 1) % rows.length;
      rows.forEach(function (r, i) { r.classList.toggle('is-lit', i === k); });
      timer = setTimeout(next, 1700);
    }
    watch(panel, function (v) { seen = v; });
    next();
  }

  /* ---------------------------------------------------------------- pointer tilt on the Odoo window */
  function tilt(panel) {
    if (reduce || !window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    panel.addEventListener('pointermove', function (e) {
      var r = panel.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      panel.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
      panel.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
    });
    panel.addEventListener('pointerleave', function () { panel.style.setProperty('--ry', '0deg'); panel.style.setProperty('--rx', '0deg'); });
  }

  /* ---------------------------------------------------------------- posting ledger (Accounting, Sales, Inventory) */
  function ledger(root) {
    var rows = $$('.apx-led-row', root), beam = root.querySelector('.apx-led-beam');
    if (!rows.length) return;
    function finish() { rows.forEach(function (r) { r.classList.add('is-posted'); }); root.classList.add('is-balanced'); }
    if (reduce || !hasIO) { finish(); return; }
    var timers = [], visible = false, started = false;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function aim(r) {
      if (!beam) return;
      var a = root.getBoundingClientRect(), b = r.getBoundingClientRect();
      root.style.setProperty('--by', (b.top - a.top).toFixed(1) + 'px');
      root.style.setProperty('--bh', b.height.toFixed(1) + 'px');
    }
    function run() {
      timers.forEach(clearTimeout); timers = [];
      root.classList.remove('is-balanced'); root.classList.add('is-scan');
      rows.forEach(function (r) { r.classList.remove('is-posted', 'is-now'); });
      rows.forEach(function (r, n) {
        later(function () { rows.forEach(function (x) { x.classList.remove('is-now'); }); r.classList.add('is-now'); aim(r); }, 450 + n * 700);
        later(function () { r.classList.add('is-posted'); }, 450 + n * 700 + 450);
      });
      var end = 450 + rows.length * 700 + 300;
      later(function () { rows.forEach(function (x) { x.classList.remove('is-now'); }); root.classList.remove('is-scan'); root.classList.add('is-balanced'); }, end);
      later(function () { if (visible) run(); else started = false; }, end + 9000);
    }
    watch(root, function (v) {
      visible = v; root.classList.toggle('is-off', !v);
      if (v && !started) { started = true; run(); }
    }, '0px 0px -12% 0px');
  }

  /* ---------------------------------------------------------------- plain off-screen pauses */
  function pausable(el) {
    watch(el, function (v) { el.classList.toggle('is-off', !v); });
  }

  function init() {
    $$('[data-apx-panel]').forEach(function (p) {
      p.classList.add('is-js');
      watch(p, function (v) { p.classList.toggle('is-off', !v); });
      tilt(p); record(p);
      if (p.hasAttribute('data-aph')) hub(p);
    });
    $$('.apx-hero').forEach(function (h) { watch(h, function (v) { h.classList.toggle('fx-off', !v); }); });
    $$('[data-apx-ledger]').forEach(ledger);
    $$('.apx-steps, .apx-life-sec .dm-life').forEach(pausable);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
