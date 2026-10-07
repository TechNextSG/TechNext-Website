/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* The homepage hero's industries slide ([data-inds], markup from worlds.showcase_html()): the whole slide becomes each
   industry's own hero in turn. Its real scene fills the background (crossfading, drifting with the pointer), the page's
   own title card, tag and buttons (skins extracted from the industry stylesheets into hero-skins.css, loaded here when the
   page is idle) and Nexi in that industry's costume with three workflow steps. The industries change every few seconds
   while the slide shows and carry on from where they stopped next time; the badge strip (tap, hover, arrow keys) picks one.
   Scenes load one at a time: the one showing and the next. */
(function () {
  'use strict';
  var root = document.querySelector('[data-inds]'); if (!root) return;
  var slide = root.closest('.slide'), hero = root.closest('.hero') || document;
  var $$ = function (s) { return [].slice.call(root.querySelectorAll(s)); };
  var bgs = $$('.hxs-bg'), panels = $$('.hxs-panel'), casts = $$('.hxs-cast'), chans = $$('.hxs-ch');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches);
  var STEP = 5200, n = panels.length, at = 0, timer = 0, outT = 0, held = false, active = false, seen = false;

  /* the skins (the industry pages' cards and buttons) */
  var skinned = false;
  function skins() {
    if (skinned) return; skinned = true;
    var base = document.querySelector('link[href*="hero.css"]');
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = base ? base.href.replace('hero.css', 'hero-skins.css') : '/assets/css/hero-skins.css';
    l.onload = function () { root.classList.add('is-skinned'); };
    l.onerror = function () { root.classList.add('is-skinned'); };
    document.head.appendChild(l);
  }
  function img(el) { if (!el) return; [].forEach.call(el.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }); }
  function warm(i) { img(bgs[i]); img(casts[i]); }

  function show(i) {
    i = (i + n) % n; if (i === at) { arm(); return; }
    var prev = at; at = i; warm(at); warm((at + 1) % n);
    clearTimeout(outT);
    [bgs, panels, casts].forEach(function (list) {
      list.forEach(function (el, k) { el.classList.toggle('is-on', k === at); el.classList.toggle('is-out', k === prev); });
    });
    panels.forEach(function (p, k) {
      p.setAttribute('aria-hidden', k === at ? 'false' : 'true');
      [].forEach.call(p.querySelectorAll('a'), function (a) { a.tabIndex = k === at ? 0 : -1; });
    });
    chans.forEach(function (c, k) { c.classList.toggle('is-on', k === at); c.setAttribute('aria-selected', k === at ? 'true' : 'false'); c.tabIndex = k === at ? 0 : -1; });
    outT = setTimeout(function () { [bgs, panels, casts].forEach(function (list) { list[prev].classList.remove('is-out'); }); }, 1300);
    arm();
  }
  function arm() {
    clearTimeout(timer);
    root.classList.remove('is-tick'); void root.offsetWidth;
    if (!active || held || reduce || document.hidden) { root.classList.add('is-held'); return; }
    root.classList.remove('is-held'); root.classList.add('is-tick');
    timer = setTimeout(function () { show(at + 1); }, STEP);
  }
  function setActive(on) {
    if (on === active) return; active = on;
    if (on) { skins(); warm(at); warm((at + 1) % n); if (seen) setTimeout(function () { if (active) show(at + 1); }, 700); seen = true; }
    arm();
  }

  chans.forEach(function (c, k) {
    c.addEventListener('click', function () { show(k); });
    if (fine) c.addEventListener('pointerenter', function () { held = true; show(k); });
    c.addEventListener('keydown', function (e) {
      var d = null; if (e.key === 'ArrowRight') d = at + 1; else if (e.key === 'ArrowLeft') d = at - 1; else if (e.key === 'Home') d = 0; else if (e.key === 'End') d = n - 1;
      if (d === null) return; e.preventDefault(); show(d); chans[at].focus();
    });
  });
  // holding: the pointer over the card, the strip or Nexi pauses the turn; the scene drifts a touch with the pointer
  var left = root.querySelector('.hxs-left');
  if (left) { left.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { held = true; arm(); } });
    left.addEventListener('pointerleave', function () { held = false; arm(); }); }
  if (fine && !reduce) {
    var raf = 0, px = 0, py = 0;
    slide.addEventListener('pointermove', function (e) {
      px = e.clientX / window.innerWidth * 2 - 1; py = e.clientY / window.innerHeight * 2 - 1;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; root.style.setProperty('--px', px.toFixed(3)); root.style.setProperty('--py', py.toFixed(3)); });
    });
  }

  if (hero && hero.addEventListener) hero.addEventListener('tn:slide', function (e) { setActive(!!(e.detail && e.detail.slide === slide)); });
  document.addEventListener('visibilitychange', arm);
  window.addEventListener('load', function () { setTimeout(function () { skins(); warm(0); }, 2500); });
  if (slide && slide.classList.contains('is-active')) setActive(true);
})();
