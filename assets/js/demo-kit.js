/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Page demos. Every service and industry page has its own signature demo of the workflow it sells;
   each registers here with TN.demo(name, init). init(root, K) returns { start, stop } (both
   optional): the kit calls start when the demo scrolls into view and stop when it leaves or the tab
   is hidden, so nothing animates off-screen. K is a small shared toolkit (geometry, SVG, a frame
   loop, a tooltip, counters, a log). Reduced motion is honoured: K.reduce, and K.loop never runs. */
(function () {
  'use strict';
  var TN = window.TN = window.TN || {};
  if (TN.demo) return;
  var me = document.currentScript && document.currentScript.src || '';
  var ROOT = me ? me.replace(/assets\/js\/demo-kit\.js.*$/, '') : '/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var ease = {
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    back: function (t) { var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[Math.random() * list.length | 0]; }
  // offset geometry relative to `host`: stays correct under CSS transforms on ancestors
  function box(el, host) {
    var x = 0, y = 0, e = el;
    while (e && e !== host) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    var w = el.offsetWidth, h = el.offsetHeight;
    return { x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
  }
  function svg(tag, attrs) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    return n;
  }
  // polyline with rounded corners; repeated points are dropped (a zero-length leg has no direction)
  function path(pts, rad) {
    pts = pts.filter(function (q, i) { return !i || Math.abs(q[0] - pts[i - 1][0]) + Math.abs(q[1] - pts[i - 1][1]) > .5; });
    var f = function (v) { return v.toFixed(1); };
    var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      var r = Math.min(rad || 0, l1 / 2, l2 / 2);
      var a = [p1[0] + (p0[0] - p1[0]) / l1 * r, p1[1] + (p0[1] - p1[1]) / l1 * r];
      var b = [p1[0] + (p2[0] - p1[0]) / l2 * r, p1[1] + (p2[1] - p1[1]) / l2 * r];
      d += 'L' + f(a[0]) + ' ' + f(a[1]) + 'Q' + f(p1[0]) + ' ' + f(p1[1]) + ' ' + f(b[0]) + ' ' + f(b[1]);
    }
    var z = pts[pts.length - 1];
    return d + 'L' + f(z[0]) + ' ' + f(z[1]);
  }
  function curve(a, b, bend) {
    // a soft S between two points, horizontal tangents (bend 0..1)
    var dx = (b[0] - a[0]) * (bend == null ? .5 : bend);
    return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'C' + (a[0] + dx).toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + (b[0] - dx).toFixed(1) + ' ' + b[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
  }
  function oi(mod, size) {
    if (!/^[a-z0-9_]+$/.test(mod)) return '';
    return '<img class="oi" src="' + ROOT + 'assets/img/odoo/' + mod + '.svg" alt="" width="' + size + '" height="' + size + '">';
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function restart(node, cls) { if (!node) return; node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }
  function money(v, cur) { return (cur || 'S$') + ' ' + Math.round(v).toLocaleString('en-SG'); }
  function count(node, to, dur, fmt) {
    fmt = fmt || function (v) { return Math.round(v).toLocaleString('en-SG'); };
    var from = parseFloat(String(node.dataset.v || 0)) || 0; node.dataset.v = to;
    if (reduce || !dur) { node.textContent = fmt(to); return; }
    var t0 = performance.now();
    (function step() {
      var q = clamp((performance.now() - t0) / dur, 0, 1);
      node.textContent = fmt(lerp(from, to, ease.out(q)));
      if (q < 1) requestAnimationFrame(step);
    })();
  }
  // a frame loop that only runs while switched on (the kit switches demos off when off-screen)
  function loop(fn) {
    var raf = 0, on = false, last = 0;
    function frame() {
      raf = 0; if (!on || document.hidden) return;
      var now = performance.now(), dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      fn(now, dt);
      if (on) raf = requestAnimationFrame(frame);
    }
    return {
      on: function () { if (reduce) return; on = true; if (!raf) { last = 0; raf = requestAnimationFrame(frame); } },
      off: function () { on = false; },
      get running() { return on; }
    };
  }
  // one tooltip per demo; content is built from text nodes, never from HTML strings
  function tip(host) {
    var t = el('div', 'dm-tip'); t.hidden = true; host.appendChild(t);
    return {
      show: function (lines, x, y, below) {
        t.textContent = '';
        (Array.isArray(lines) ? lines : [lines]).forEach(function (l, i) { if (l) t.appendChild(el(i ? 'span' : 'b', null, l)); });
        t.hidden = false; t.classList.toggle('dm-tip--below', !!below);
        t.style.left = clamp(x, 110, host.offsetWidth - 110).toFixed(1) + 'px'; t.style.top = y.toFixed(1) + 'px';
      },
      hide: function () { t.hidden = true; }
    };
  }
  function log(list, html, cls, max) {
    var li = el('li', cls || null); li.innerHTML = html;       // callers pass their own constant markup
    list.insertBefore(li, list.firstChild);
    var rows = $$('li', list); while (rows.length > (max || 4)) rows.pop().remove();
    return li;
  }
  var K = { reduce: reduce, root: ROOT, $: $, $$: $$, clamp: clamp, lerp: lerp, ease: ease, rnd: rnd, pick: pick, box: box, svg: svg,
            path: path, curve: curve, oi: oi, el: el, restart: restart, money: money, count: count, loop: loop, tip: tip, log: log };

  var defs = {}, live = [];
  function mount(name, root) {
    if (root.__dm) return;
    var inst = null, seen = false, visible = false;
    root.__dm = true; root.classList.add('is-js');
    function go() { if (!inst) inst = defs[name](root, K) || {}; if (inst.start) inst.start(!seen); seen = true; }
    function halt() { if (inst && inst.stop) inst.stop(); }
    var rec = { root: root, wake: function () { if (visible && !document.hidden) go(); else halt(); } };
    live.push(rec);
    if (!('IntersectionObserver' in window)) { visible = true; go(); return; }
    new IntersectionObserver(function (es) {
      visible = es[es.length - 1].isIntersecting;
      rec.wake();
    }, { rootMargin: '120px 0px', threshold: .08 }).observe(root);
  }
  TN.demo = function (name, init) {
    defs[name] = init;
    $$('[data-demo="' + name + '"]').forEach(function (r) { mount(name, r); });
  };
  document.addEventListener('visibilitychange', function () { live.forEach(function (r) { r.wake(); }); });
})();
