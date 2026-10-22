/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Blog articles (22 Oct 2026): reading-progress line, "On this page" scroll spy, the hero cover panel's pointer tilt and its off-screen
   pause. Nothing here changes the article text. Reduced motion: no tilt, the progress line still shows (it is a position, not motion). */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }

  function progress() {
    var bar = document.querySelector('[data-blg-bar]'), prose = document.querySelector('.prose');
    if (!bar || !prose) return;
    var wrap = bar.parentNode, ticking = false;
    function update() {
      ticking = false;
      var r = prose.getBoundingClientRect(), vh = window.innerHeight || 800;
      var total = r.height - vh * 0.5, done = -r.top + vh * 0.2;
      var p = total > 0 ? Math.max(0, Math.min(1, done / total)) : 0;
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      wrap.classList.toggle('is-on', r.top < vh * 0.2 && r.bottom > 0);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function spy() {
    var toc = document.querySelector('[data-blg-toc]');
    if (!toc || !hasIO) return;
    var links = $$('a[href^="#"]', toc), map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var heads = $$('.prose h2[id]').filter(function (h) { return map[h.id]; });
    if (!heads.length) return;
    var current = null;
    function set(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (a) { a.classList.toggle('is-on', a === map[id]); if (a === map[id]) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    }
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      var first = null;
      heads.forEach(function (h) { if (seen[h.id] && !first) first = h; });
      if (first) set(first.id);
      else {                                  // between two headings: the last one that has scrolled past the top
        var past = null;
        heads.forEach(function (h) { if (h.getBoundingClientRect().top < 120) past = h; });
        if (past) set(past.id);
      }
    }, { rootMargin: '-96px 0px -62% 0px', threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
  }

  function panel() {
    var p = document.querySelector('[data-blg-panel]');
    if (!p) return;
    if (hasIO) new IntersectionObserver(function (e) { p.classList.toggle('is-off', !e[0].isIntersecting); }, { threshold: 0.05 }).observe(p);
    if (reduce || !window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    p.addEventListener('pointermove', function (e) {
      var r = p.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      p.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
      p.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
    });
    p.addEventListener('pointerleave', function () { p.style.setProperty('--ry', '0deg'); p.style.setProperty('--rx', '0deg'); });
  }

  function init() { progress(); spy(); panel(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
