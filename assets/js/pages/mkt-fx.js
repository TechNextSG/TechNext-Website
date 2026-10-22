/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Marketing solution pages (hub, web design, social media, brand assets): the live hero panels (sample data).
   hub   [data-mh]  three services feed one Odoo CRM        web   [data-wb]  a website form lands as a CRM lead
   soc   [data-sc]  content calendar and monthly report      brand [data-bb]  brand kit board in three directions
   Every loop pauses off-screen and while the tab is hidden; reduced motion shows the finished state. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }

  /* a loop runner: run(step) is called once per cycle; later(fn, ms) schedules inside the cycle; the cycle restarts after `every` ms.
     It stops while the panel is off-screen or the tab is hidden, and picks up with a fresh cycle when it comes back. */
  function runner(root, cycle, every) {
    var timers = [], seen = true, stopped = false;
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function go() {
      clear();
      if (stopped || !seen || document.hidden) return;
      cycle(later);
      later(go, every);
    }
    function state() {
      root.classList.toggle('is-off', !seen || document.hidden);
      if (seen && !document.hidden && !timers.length) go();
      if (!seen || document.hidden) clear();
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { seen = e[0].isIntersecting; state(); }, { threshold: 0.12 }).observe(root);
    }
    document.addEventListener('visibilitychange', state);
    go();
    return { stop: function () { stopped = true; clear(); }, restart: function () { stopped = false; go(); } };
  }

  function curve(x1, y1, x2, y2, vertical) {
    if (vertical) { var m = (y1 + y2) / 2; return 'M' + x1 + ' ' + y1 + ' C' + x1 + ' ' + m + ' ' + x2 + ' ' + m + ' ' + x2 + ' ' + y2; }
    var c = (x1 + x2) / 2; return 'M' + x1 + ' ' + y1 + ' C' + c + ' ' + y1 + ' ' + c + ' ' + y2 + ' ' + x2 + ' ' + y2;
  }
  function addPath(svg, d, cls) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    if (cls) { p.setAttribute('class', cls); p.setAttribute('pathLength', '100'); }
    svg.appendChild(p);
    return p;
  }
  function rel(el, base) {
    var b = base.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top, w: r.width, h: r.height };
  }
  function watchSize(el, fn) {
    window.addEventListener('resize', fn);
    if (window.ResizeObserver) new ResizeObserver(fn).observe(el);
  }
  function fmt(v, dec) { return dec ? v.toFixed(dec) : String(Math.round(v)); }
  function countTo(el, to, ms, dec, suf) {
    if (reduce) { el.textContent = fmt(to, dec) + (suf || ''); return; }
    var t0 = null;
    function f(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * e, dec) + (suf || '');
      if (k < 1) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }

  /* ------------------------------------------------------------------ hub */
  function hub() {
    var root = $('[data-mh]'); if (!root) return;
    var body = $('[data-mh-body]', root), svg = $('[data-mh-links]', root), crm = $('[data-mh-crm]', root);
    var src = {}; $$('[data-feed]', root).forEach(function (a) { src[a.getAttribute('data-feed')] = a; });
    var order = ['web', 'soc', 'brand'];
    var rows = {}; $$('.mh-leads li', root).forEach(function (li) { rows[li.getAttribute('data-r')] = li; });
    var total = $('[data-mh-total]', root), to = parseInt(total.getAttribute('data-to'), 10);
    var paths = {};

    function draw() {
      svg.setAttribute('viewBox', '0 0 ' + body.offsetWidth + ' ' + body.offsetHeight);
      svg.textContent = ''; paths = {};
      var c = rel(crm, body);
      order.forEach(function (k, i) {
        var s = rel(src[k], body);
        var x2 = c.l + c.w * (0.2 + 0.3 * i);
        var d = curve(s.l + s.w / 2, s.b, x2, c.t, true);
        addPath(svg, d, null).setAttribute('data-k', k);
        if (!reduce) { var f = addPath(svg, d, 'mh-flow'); f.setAttribute('data-k', k); paths[k] = f; }
      });
    }
    draw(); watchSize(body, draw);

    function setTotal(n) { total.textContent = n; }
    function show(k, on) {
      src[k].classList.toggle('is-lit', on);
      $$('svg path', svg).forEach(function (p) { if (p.getAttribute('data-k') === k) p.classList.toggle('is-lit', on); });
    }
    function finish() {
      order.forEach(function (k) { rows[k].classList.add('is-in'); show(k, false); });
      root.classList.add('is-done'); setTotal(to);
    }
    if (reduce) { finish(); return; }
    root.classList.add('is-live');

    runner(root, function (later) {
      order.forEach(function (k) { rows[k].classList.remove('is-in'); show(k, false); });
      root.classList.remove('is-done'); setTotal(to - 3);
      order.forEach(function (k, i) {
        later(function () { order.forEach(function (o) { show(o, o === k); }); rows[k].classList.add('is-in'); setTotal(to - 2 + i); }, 700 + i * 1500);
      });
      later(function () { order.forEach(function (k) { show(k, false); }); root.classList.add('is-done'); }, 700 + 3 * 1500);
    }, 10500);
  }

  /* ------------------------------------------------------------------ web */
  function web() {
    var root = $('[data-wb]', document); if (!root) return;
    var body = $('[data-wb-body]', root), svg = $('[data-wb-link]', root), form = $('[data-wb-form]', root);
    var send = $('[data-wb-send]', root), crm = $('[data-wb-crm]', root);
    var fields = $$('[data-type]', root), dl = $$('.wb-dl > div', root);
    var texts = fields.map(function (f) { return f.getAttribute('data-type'); });

    function draw() {
      svg.setAttribute('viewBox', '0 0 ' + body.offsetWidth + ' ' + body.offsetHeight);
      svg.textContent = '';
      var s = rel(send, body), c = rel(crm, body);
      var stacked = c.t > s.b - 4;
      var d = stacked ? curve(s.l + s.w / 2, s.b, c.l + c.w / 2, c.t, true) : curve(s.r, s.t + s.h / 2, c.l, c.t + 34, false);
      addPath(svg, d, null);
      if (!reduce) addPath(svg, d, 'wb-flow');
    }
    draw(); watchSize(body, draw);

    function done() {
      fields.forEach(function (f, i) { f.textContent = texts[i]; f.parentNode.classList.add('is-filled'); });
      root.classList.add('is-sent', 'is-done'); dl.forEach(function (r) { r.classList.add('is-in'); });
    }
    if (reduce) { done(); return; }
    root.classList.add('is-live');

    runner(root, function (later) {
      root.classList.remove('is-sent', 'is-done', 'is-press');
      dl.forEach(function (r) { r.classList.remove('is-in'); });
      fields.forEach(function (f) { f.textContent = ''; f.parentNode.classList.remove('is-filled', 'is-typing'); });
      var t = 500;
      fields.forEach(function (f, i) {
        later(function () { f.parentNode.classList.add('is-typing'); }, t);
        var txt = texts[i], step = i === 2 ? 28 : 52;
        for (var k = 1; k <= txt.length; k++) { (function (k) { later(function () { f.textContent = txt.slice(0, k); }, t + k * step); })(k); }
        t += txt.length * step + 200;
        later(function () { f.parentNode.classList.remove('is-typing'); f.parentNode.classList.add('is-filled'); }, t - 100);
      });
      later(function () { root.classList.add('is-press'); }, t + 300);
      later(function () { root.classList.add('is-sent'); }, t + 700);
      dl.forEach(function (r, i) { later(function () { r.classList.add('is-in'); }, t + 1100 + i * 260); });
      later(function () { root.classList.add('is-done'); }, t + 1100 + dl.length * 260);
    }, 12500);
  }

  /* ------------------------------------------------------------------ soc */
  function soc() {
    var root = $('[data-sc]', document); if (!root) return;
    var days = $$('.sc-d', root), posts = $$('.sc-p', root);
    var kpis = $$('.sc-kpi dd', root), bars = $$('.sc-bars span', root);
    var TODAY = 21;
    function setDay(n) {
      days.forEach(function (d) { d.classList.toggle('is-today', parseInt(d.getAttribute('data-d'), 10) === n); });
    }
    function counts() {
      kpis.forEach(function (k) { countTo(k, parseFloat(k.getAttribute('data-to')), 1100, parseInt(k.getAttribute('data-dec') || '0', 10), k.getAttribute('data-suf') || ''); });
    }
    function bars_(on) { bars.forEach(function (b, i) { b.style.transitionDelay = on ? (i * 120) + 'ms' : '0ms'; b.classList.toggle('is-in', on); }); }
    // reduced motion, or before the loop starts: the state on day 21
    if (reduce) { bars_(true); return; }
    bars_(true);
    root.classList.add('is-live');
    runner(root, function (later) {
      posts.forEach(function (p) { p.setAttribute('data-s', 'sch'); });
      setDay(0);
      counts();
      bars_(false);
      later(function () { bars_(true); }, 500);
      for (var d = 1; d <= 28; d++) {
        (function (d) {
          later(function () {
            setDay(d);
            posts.forEach(function (p) {
              var pd = parseInt(p.parentNode.getAttribute('data-d'), 10);
              if (pd === d) { p.setAttribute('data-s', 'pub'); p.classList.remove('is-pop'); void p.offsetWidth; p.classList.add('is-pop'); }
            });
          }, 700 + d * 300);
        })(d);
      }
    }, 700 + 28 * 300 + 3400);
  }

  /* ------------------------------------------------------------------ brand */
  function brand() {
    var root = $('[data-bb]', document); if (!root) return;
    var btns = $$('.bb-dirs button', root), label = $('[data-dlabel]', root), dname = $('[data-dname]', root);
    var NAMES = { a: 'Direction A · Calm', b: 'Direction B · Bold', c: 'Direction C · Warm' };
    var FONTS = { a: 'Georgia', b: 'Plus Jakarta Sans', c: 'Plus Jakarta Sans' };
    var order = ['a', 'b', 'c'], cur = 'a', manual = false;
    function pick(k) {
      cur = k; root.setAttribute('data-dir', k);
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-d') === k ? 'true' : 'false'); });
      label.textContent = NAMES[k]; dname.textContent = FONTS[k];
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { manual = true; pick(b.getAttribute('data-d')); }); });
    if (reduce) return;
    runner(root, function (later) {
      later(function () { if (!manual) pick(order[(order.indexOf(cur) + 1) % 3]); }, 3000);
    }, 3300);
  }

  function offscreen() {
    if (!('IntersectionObserver' in window)) return;
    $$('.mk-path').forEach(function (el) {
      new IntersectionObserver(function (e) { el.classList.toggle('is-off', !e[0].isIntersecting); }).observe(el);
    });
    $$('.fx-hero').forEach(function (el) {
      new IntersectionObserver(function (e) { el.classList.toggle('fx-off', !e[0].isIntersecting); }).observe(el);
    });
  }

  function init() { hub(); web(); soc(); brand(); offscreen(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
