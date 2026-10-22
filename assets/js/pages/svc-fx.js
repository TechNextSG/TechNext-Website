/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Odoo service pages: tiny shared helpers for the hero panels (window.SVC). Everything pauses off-screen and in a hidden tab;
   reduced motion never starts a loop (each page script shows its finished state instead). */
(function () {
  'use strict';
  if (window.SVC) return;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var S = window.SVC = { reduce: reduce };

  S.$ = function (s, r) { return (r || document).querySelector(s); };
  S.$$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  S.fmt = function (n) { return n.toLocaleString('en-US'); };

  /* cb(true|false) as `el` enters and leaves the viewport; `.fx-off` on el while it is away (pauses its CSS loops) */
  S.watch = function (el, cb, threshold) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { el.classList.toggle('fx-off', !e.isIntersecting); cb(e.isIntersecting); });
    }, { threshold: threshold || .15 }).observe(el);
  };

  /* number counts up to `to` (an eased 1.2 s run, optional delay); node ends on the exact value */
  S.count = function (node, to, delay, dur, from) {
    var t0 = null, d = dur || 1200, a = from || 0, dec = String(to).indexOf('.') > -1 ? 1 : 0;
    function fmt(v) { return dec ? v.toFixed(1) : S.fmt(Math.round(v)); }
    if (reduce) { node.textContent = fmt(+to); return; }
    node.textContent = fmt(a);
    function tick(t) {
      if (t0 === null) t0 = t + (delay || 0);
      var p = Math.min(1, Math.max(0, (t - t0) / d)), e = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(a + (+to - a) * e);
      if (p < 1) requestAnimationFrame(tick); else node.textContent = fmt(+to);
    }
    requestAnimationFrame(tick);
  };

  /* steps: [[waitMs, fn(i)], ...] run in order, then again after the last one. Runs only while `el` is on screen and the tab is
     visible; resumes where it stopped. Returns { stop(), go() } (stop = the visitor took over). */
  S.timeline = function (el, steps) {
    var i = 0, timer = null, vis = false, dead = false;
    function next() {
      if (timer || dead || !vis || document.hidden) return;
      var st = steps[i];
      timer = setTimeout(function () { timer = null; st[1](i); i = (i + 1) % steps.length; next(); }, st[0]);
    }
    function pause() { if (timer) { clearTimeout(timer); timer = null; } }
    if (reduce) return { stop: function () {}, go: function () {} };
    S.watch(el, function (v) { vis = v; if (v) next(); else pause(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else next(); });
    return { stop: function () { dead = true; pause(); }, go: function () { if (dead) { dead = false; next(); } } };
  };

  /* a steady tick while `el` is on screen */
  S.every = function (el, fn, ms) {
    var t = null, vis = false;
    function on() { if (!t && vis && !document.hidden && !reduce) t = setInterval(fn, ms); }
    function off() { if (t) { clearInterval(t); t = null; } }
    if (reduce) return;
    S.watch(el, function (v) { vis = v; if (v) on(); else off(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) off(); else on(); });
  };

  /* adds .is-in the first time `el` is seen (hero panels: bars and chips light up) */
  S.once = function (el, fn, threshold, cls) {
    cls = cls || 'is-in';
    if (!('IntersectionObserver' in window)) { el.classList.add(cls); if (fn) fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); el.classList.add(cls); if (fn) fn(); } });
    }, { threshold: threshold || .2 });
    io.observe(el);
  };

  S.el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
})();
