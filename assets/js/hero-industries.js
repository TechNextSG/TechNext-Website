/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* The homepage hero's industries slide ([data-inds], markup from worlds.showcase_html()): one screen, eight industry worlds.
   Each world's real scene pans slowly behind Nexi in that world's costume, the sample business, the page's headline in a
   speech bubble and three workflow steps. The worlds cycle on their own while the slide is showing; the channel strip
   (hover, tap, arrow keys), a swipe on the screen or the arrows switch them; a tap on the screen opens the industry page.
   The scenes load only when the slide is near, so the first screen of the homepage stays light. */
(function () {
  'use strict';
  var root = document.querySelector('[data-inds]'); if (!root) return;
  var slide = root.closest('.slide'), hero = root.closest('.hero') || document;
  var screen = root.querySelector('[data-inds-screen]');
  var scrs = [].slice.call(root.querySelectorAll('.hxi-scr')), chans = [].slice.call(root.querySelectorAll('.hxi-ch'));
  var nEl = root.querySelector('[data-inds-n]'), cta = slide && slide.querySelector('[data-inds-cta]'), ctaName = slide && slide.querySelector('[data-inds-name]');
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var fine = !!(window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches);
  var STEP = 3300, at = 0, timer = 0, held = false, active = false, loaded = false, swiped = 0;

  function load() {
    if (loaded) return; loaded = true;
    // the scene in view first, then the rest in order
    var order = scrs.map(function (_, i) { return (at + i) % scrs.length; });
    order.forEach(function (i, n) {
      setTimeout(function () { [].forEach.call(scrs[i].querySelectorAll('img[data-src]'), function (im) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }); }, n * 120);
    });
  }
  function names(i) { var b = chans[i].getAttribute('aria-label') || ''; return b.replace(/&amp;/g, '&'); }
  function show(i, user) {
    i = (i + scrs.length) % scrs.length; if (i === at && !user) return;
    var prev = at; at = i;
    scrs.forEach(function (s, k) {
      s.classList.toggle('is-on', k === at); s.classList.toggle('is-prev', k === prev && k !== at);
      s.setAttribute('aria-hidden', k === at ? 'false' : 'true');
    });
    chans.forEach(function (c, k) { c.classList.toggle('is-on', k === at); c.setAttribute('aria-selected', k === at ? 'true' : 'false'); c.tabIndex = k === at ? 0 : -1; });
    // replay the arrival (the wipe, Nexi's hop, the pills) even when the same world is picked again
    var s = scrs[at]; s.classList.remove('is-in'); void s.offsetWidth; s.classList.add('is-in');
    if (nEl) nEl.textContent = String(at + 1);
    if (cta) cta.setAttribute('href', s.getAttribute('href'));
    if (ctaName) ctaName.textContent = names(at);
    root.style.setProperty('--ac', getComputedStyle(s).getPropertyValue('--ac'));
    arm();
  }
  function arm() {
    clearTimeout(timer);
    root.classList.remove('is-tick'); void root.offsetWidth;
    if (!active || held || reduce || document.hidden) { root.classList.add('is-held'); return; }
    root.classList.remove('is-held'); root.classList.add('is-tick');
    timer = setTimeout(function () { show(at + 1); }, STEP);
  }
  function setActive(on) { active = on; if (on) load(); arm(); }

  // the channel strip: hover previews (and holds), tap picks, arrow keys move
  chans.forEach(function (c, k) {
    c.addEventListener('click', function () { show(k, true); });
    if (fine) c.addEventListener('pointerenter', function () { held = true; show(k, true); });
    c.addEventListener('keydown', function (e) {
      var n = null; if (e.key === 'ArrowRight') n = at + 1; else if (e.key === 'ArrowLeft') n = at - 1; else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = chans.length - 1;
      if (n === null) return; e.preventDefault(); show(n, true); chans[at].focus();
    });
  });
  // the screen: hovering holds the world and tilts it a touch toward the pointer; a swipe switches; a tap opens the page
  root.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { held = true; arm(); } });
  root.addEventListener('pointerleave', function () { held = false; root.style.setProperty('--tx', '0'); root.style.setProperty('--ty', '0'); arm(); });
  if (fine && !reduce) screen.addEventListener('pointermove', function (e) {
    var r = screen.getBoundingClientRect();
    root.style.setProperty('--tx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
    root.style.setProperty('--ty', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
  });
  var sx = 0, sy = 0, sw = false;
  screen.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; sw = true; held = true; arm(); }, { passive: true });
  screen.addEventListener('touchend', function (e) {
    if (!sw) return; sw = false; held = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped = Date.now(); show(at + (dx < 0 ? 1 : -1), true); } else arm();
  }, { passive: true });
  screen.addEventListener('click', function (e) { if (Date.now() - swiped < 400) { e.preventDefault(); e.stopPropagation(); } }, true);

  // follow the carousel: run while this slide is showing
  if (hero && hero.addEventListener) hero.addEventListener('tn:slide', function (e) { setActive(!!(e.detail && e.detail.slide === slide)); });
  if (slide && slide.classList.contains('is-active')) setActive(true);
  document.addEventListener('visibilitychange', arm);
  // warm the scenes up once the page is idle, so the slide never opens on empty screens
  window.addEventListener('load', function () { setTimeout(load, 2500); });
  show(0, true);
})();
