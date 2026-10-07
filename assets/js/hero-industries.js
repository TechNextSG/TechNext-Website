/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* The homepage hero's industries slide ([data-inds], markup from worlds.showcase_html()): the whole slide becomes each
   industry's own hero in turn. Its real scene fills the background (crossfading, drifting with the pointer), the page's
   own title card, tag and buttons (skins extracted from the industry stylesheets into hero-skins.css, loaded here when the
   page is idle) and Nexi in that industry's costume with three workflow steps. The industries change every few seconds
   while the slide shows and carry on from where they stopped next time; the badge strip (click or arrow keys) picks one.
   Scenes load one at a time: the one showing and the next. */
(function () {
  'use strict';
  var root = document.querySelector('[data-inds]'); if (!root) return;
  var slide = root.closest('.slide'), hero = root.closest('.hero') || document;
  var $$ = function (s) { return [].slice.call(root.querySelectorAll(s)); };
  var bgs = $$('.hxs-bg'), panels = $$('.hxs-panel'), casts = $$('.hxs-cast'), chans = $$('.hxs-ch');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches);
  var STEP = 5200, n = panels.length, at = 0, timer = 0, outT = 0, enterT = 0, dressT = 0, held = false, active = false;
  var html = document.documentElement, header = document.querySelector('.header');
  /* the page around the slide takes the showing industry's style: its colours go on <html> as --hx-* for the header's
     Contact Us and the side tabs (hero.css); the header stays see-through over the scene; the roaming 3D Nexi steps aside */
  var VARS = ['st-ink', 'st-meet', 'st-talk', 'st-nexi', 'st-nexi-fg', 'st-fg', 'hc-bg', 'hc-fg'];
  function dress() {
    if (!active) { VARS.forEach(function (v) { html.style.removeProperty('--hx-' + v); }); html.classList.remove('hxs-on', 'hxs-top'); return; }
    html.classList.add('hxs-on'); top();
    if (!root.classList.contains('is-skinned')) return;   // the colours come with the skins
    var cs = getComputedStyle(panels[at]);
    VARS.forEach(function (v) { var val = cs.getPropertyValue('--' + v).trim(); if (val) html.style.setProperty('--hx-' + v, val); else html.style.removeProperty('--hx-' + v); });
    html.classList.add('hxs-on'); top();
  }
  var topRaf = 0;
  function top() { topRaf = 0; var r = slide.getBoundingClientRect(); html.classList.toggle('hxs-top', active && r.bottom > (header ? header.offsetHeight : 70) + 120); }
  window.addEventListener('scroll', function () { if (active && !topRaf) topRaf = requestAnimationFrame(top); }, { passive: true });
  /* where the scene opens from: the picked badge, in the sky's own coordinates, and the radius that covers the sky */
  var sky = root.querySelector('.hxs-sky');
  function origin() {
    var s = sky.getBoundingClientRect(), c = chans[at].getBoundingClientRect(); if (!s.width || !c.width) return;
    var x = c.left + c.width / 2 - s.left, y = c.top + c.height / 2 - s.top;
    var r = Math.ceil(Math.sqrt(Math.pow(Math.max(x, s.width - x), 2) + Math.pow(Math.max(y, s.height - y), 2))) + 8;
    root.style.setProperty('--ox', x.toFixed(0) + 'px'); root.style.setProperty('--oy', y.toFixed(0) + 'px'); root.style.setProperty('--or', r + 'px');
  }
  function pickOther() { var r = Math.floor(Math.random() * (n - 1)); return r >= at ? r + 1 : r; }

  /* the skins (the industry pages' cards and buttons) */
  var skinned = false;
  function skins() {
    if (skinned) return; skinned = true;
    var base = document.querySelector('link[href*="hero.css"]');
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = base ? base.href.replace('hero.css', 'hero-skins.css') : '/assets/css/hero-skins.css';
    l.onload = function () { root.classList.add('is-skinned'); if (active) dress(); };
    l.onerror = function () { root.classList.add('is-skinned'); };
    document.head.appendChild(l);
  }
  function img(el) { if (!el) return; [].forEach.call(el.querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }); }
  function warm(i) { img(bgs[i]); img(casts[i]); }

  function show(i) {
    i = (i + n) % n; if (i === at) { arm(); return; }
    var prev = at; at = i; warm(at); warm((at + 1) % n);
    clearTimeout(outT); origin();
    root.classList.remove('is-swap'); void root.offsetWidth; root.classList.add('is-swap');
    [bgs, panels, casts].forEach(function (list) {
      list.forEach(function (el, k) { el.classList.toggle('is-on', k === at); el.classList.toggle('is-out', k === prev); });
    });
    panels.forEach(function (p, k) {
      p.setAttribute('aria-hidden', k === at ? 'false' : 'true');
      [].forEach.call(p.querySelectorAll('a'), function (a) { a.tabIndex = k === at ? 0 : -1; });
    });
    chans.forEach(function (c, k) { c.classList.toggle('is-on', k === at); c.setAttribute('aria-selected', k === at ? 'true' : 'false'); c.tabIndex = k === at ? 0 : -1; });
    outT = setTimeout(function () { [bgs, panels, casts].forEach(function (list) { list[prev].classList.remove('is-out'); }); }, 1300);
    if (skinned && root.classList.contains('is-skinned')) dress();
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
    // every visit opens on a different industry, picked at random
    if (on) { skins(); var next = pickOther(); jump(next); }
    // the page's colours change as the circle sweeps past the header (straight away on the way out)
    clearTimeout(dressT); if (on) dressT = setTimeout(dress, 420); else dress();
    // the entrance: the scene pushes in, the card rises, its parts arrive in turn, Nexi hops in (hero.css .is-enter)
    root.classList.remove('is-enter', 'is-leave'); void root.offsetWidth; root.classList.add(on ? 'is-enter' : 'is-leave');
    clearTimeout(enterT); enterT = setTimeout(function () { root.classList.remove('is-enter', 'is-leave', 'is-swap'); }, 1800);
    arm();
  }
  /* switch with no transition (the slide itself is fading in) */
  function jump(i) {
    at = i; warm(at); warm((at + 1) % n); origin();
    [bgs, panels, casts].forEach(function (list) { list.forEach(function (el, k) { el.classList.toggle('is-on', k === at); el.classList.remove('is-out'); }); });
    panels.forEach(function (p, k) { p.setAttribute('aria-hidden', k === at ? 'false' : 'true'); [].forEach.call(p.querySelectorAll('a'), function (a) { a.tabIndex = k === at ? 0 : -1; }); });
    chans.forEach(function (c, k) { c.classList.toggle('is-on', k === at); c.setAttribute('aria-selected', k === at ? 'true' : 'false'); c.tabIndex = k === at ? 0 : -1; });
  }

  chans.forEach(function (c, k) {
    c.addEventListener('click', function () { show(k); });
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
  jump(Math.floor(Math.random() * n));   // the page opens on a random industry too
  window.addEventListener('load', function () { setTimeout(function () { skins(); warm(at); }, 2500); });
  if (slide && slide.classList.contains('is-active')) setActive(true);
})();
