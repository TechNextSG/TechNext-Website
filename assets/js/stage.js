/* Hero stages (assets/css/stage.css): start after the first-visit intro, pause when
   offscreen or in a hidden tab, add pointer depth, cycle the Training roles, and load
   the Google Map only on request (or once the visitor has accepted cookies). */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(pointer: fine)').matches);
  var stages = [].slice.call(document.querySelectorAll('.stage'));

  /* ---------------- run / pause ---------------- */
  function svgsOf(stage) { return [].slice.call(stage.querySelectorAll('svg.st-anim')); }
  function apply(stage) {
    var on = !reduce && !doc.classList.contains('intro') && stage._inView !== false && !document.hidden;
    if (on === stage._on) return;
    stage._on = on;
    stage.classList.toggle('is-paused', !on);
    svgsOf(stage).forEach(function (s) {
      try { if (on) s.unpauseAnimations(); else s.pauseAnimations(); } catch (e) { /* no SMIL */ }
    });
  }
  function applyAll() { stages.forEach(apply); }

  stages.forEach(function (st) { st._on = null; apply(st); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target._inView = en.isIntersecting; apply(en.target); });
    }, { rootMargin: '80px 0px' });
    stages.forEach(function (st) { io.observe(st); });
  }
  document.addEventListener('visibilitychange', applyAll);
  document.addEventListener('tn:intro-done', applyAll);

  /* ---------------- pointer depth + backdrop spotlight ---------------- */
  if (!reduce && fine) {
    [].forEach.call(document.querySelectorAll('[data-stage-hero]'), function (hero) {
      var st = hero.querySelector('.stage');
      var raf = 0, x = 0, y = 0;
      function paint() {
        raf = 0;
        hero.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
        hero.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
        if (st) { st.style.setProperty('--px', (x * 2).toFixed(3)); st.style.setProperty('--py', (y * 2).toFixed(3)); }
      }
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        if (!r.width || !r.height) return;
        x = (e.clientX - r.left) / r.width - 0.5;
        y = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = requestAnimationFrame(paint);
      });
      hero.addEventListener('pointerleave', function () { x = 0; y = 0; if (!raf) raf = requestAnimationFrame(paint); });
    });
  }

  /* ---------------- integration: hovering a system lights its line ---------------- */
  [].forEach.call(document.querySelectorAll('.stage [data-node]'), function (n) {
    var st = n.closest('.stage');
    n.addEventListener('pointerenter', function () { st.setAttribute('data-hot', n.getAttribute('data-node')); });
    n.addEventListener('pointerleave', function () { st.removeAttribute('data-hot'); });
  });

  /* ---------------- training: cycle the role tabs ---------------- */
  [].forEach.call(document.querySelectorAll('.stage[data-cycle]'), function (st) {
    var roles = st.getAttribute('data-cycle').split(',');
    var i = 0, hold = 0;
    function show(k) {
      i = k;
      roles.forEach(function (r, j) { st.classList.toggle('is-' + r, j === k); });
    }
    show(0);
    [].forEach.call(st.querySelectorAll('[data-role-tab]'), function (tab) {
      tab.addEventListener('click', function () {
        var k = roles.indexOf(tab.getAttribute('data-role-tab'));
        if (k > -1) { show(k); hold = Date.now() + 12000; }
      });
    });
    if (reduce) return;
    setInterval(function () {
      if (st._on && Date.now() > hold) show((i + 1) % roles.length);
    }, 5200);
  });

  /* ---------------- Google Map: nothing loads from Google until asked ---------------- */
  var MAPS = {
    hq: {
      src: 'https://www.google.com/maps?q=261%20Waterloo%20Street%20%2303-36%2C%20Singapore%20180261&z=17&output=embed',
      title: 'Map: TechNext, 261 Waterloo Street #03-36, Singapore 180261'
    }
  };
  function consented() {
    try { return document.cookie.indexOf('tn_consent=yes') > -1; } catch (e) { return false; }
  }
  function loadMap(box) {
    var m = MAPS[box.getAttribute('data-map')];
    if (!m || box.classList.contains('is-loaded')) return;
    var f = document.createElement('iframe');
    f.src = m.src;
    f.title = m.title;
    f.loading = 'lazy';
    f.allowFullscreen = true;
    box.appendChild(f);
    box.classList.add('is-loaded');
  }
  [].forEach.call(document.querySelectorAll('.map[data-map]'), function (box) {
    var btn = box.querySelector('[data-map-load]');
    if (btn) btn.addEventListener('click', function () { loadMap(box); });
    if (!('IntersectionObserver' in window)) return;
    var mio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && consented()) { loadMap(box); mio.disconnect(); }
      });
    }, { rootMargin: '200px 0px' });
    mio.observe(box);
  });
})();
