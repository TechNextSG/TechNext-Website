/* Nexi, TechNext's AI companion. A small 3D robot in the home hero. On desktop it roams every slide:
   it circles the Odoo app orbit, chases order tokens through the flow chart, cheers the launch path,
   points at the call-to-action and follows slide changes. On the two Nexi slides (data-slide-nexi) it is
   the show: hero-scenes.js runs a script and Nexi performs it. Clicking Nexi opens a short
   self-introduction. No chat logic lives here.

   This file is only the loader, so pages pay for a few hundred bytes until Nexi is needed. It downloads
   Three.js (r128, MIT, self-hosted in assets/js/vendor/ because the CSP only allows same-origin scripts)
   and the robot in assets/js/nexi-bot.js.
   - Desktop (min-width:961px, a fine pointer): while the intro plays, and Nexi starts as it ends.
   - Phones and touch screens: a lighter Nexi (no glow pass, lower pixel ratio) that runs only while a
     Nexi slide shows. The files are fetched in the background once the page is quiet (not on Save-Data),
     and Nexi starts the moment a Nexi slide opens.
   Reduced motion: never (the Nexi slides show a drawn Nexi instead). */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var ROOT = hero.getAttribute('data-root') || '';
  /* both scripts resolve next to this file's own URL (never from page markup) */
  var me = document.currentScript && document.currentScript.src;
  if (!me) return;
  var V = new URL(me).searchParams.get('v');
  var THREE_URL = new URL('vendor/three-r128.min.js', me).href;
  var BOT_URL = new URL('nexi-bot.js' + (V ? '?v=' + encodeURIComponent(V) : ''), me).href;
  var desk = matchMedia('(min-width: 961px) and (hover: hover) and (pointer: fine)');
  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  var app = null, loading = false, failed = false;

  function webgl() { try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  function onNexiSlide() { var s = hero.querySelector('.slide.is-active'); return !!(s && s.hasAttribute('data-slide-nexi')); }
  function hasNexiSlides() { return !!hero.querySelector('[data-slide-nexi]'); }
  /* may Nexi draw right now? Never under the first-visit intro: she warms up there and starts as it ends */
  function introOn() { return document.documentElement.classList.contains('intro'); }
  function allowed() { return !calm.matches && !introOn() && (desk.matches || onNexiSlide()); }
  /* may Nexi exist on this device at all? */
  function possible() { return !calm.matches && (desk.matches || hasNexiSlides()); }
  function script(src, ok) {
    var s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = ok; s.onerror = function () { loading = false; failed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-fail')); };
    document.head.appendChild(s);
  }
  function start() {
    loading = false;
    if (app || !possible() || !window.THREE || !window.tnNexi) return;
    app = window.tnNexi(hero, ROOT, { lite: !desk.matches });
    if (!app) { failed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-fail')); return; }
    window.TNNexi = app;
    sync();
  }
  function load() {
    if (app || loading || failed || !possible()) return;
    if (!webgl()) { failed = true; hero.dispatchEvent(new CustomEvent('tn:nexi-fail')); return; }
    loading = true;
    var bot = function () { if (window.tnNexi) start(); else script(BOT_URL, start); };
    if (window.THREE) bot(); else script(THREE_URL, bot);
  }
  /* fetch both files into the cache now (network only, nothing runs), so nothing waits later */
  var preloaded = false;
  function preload() {
    if (preloaded || !possible()) return; preloaded = true;
    [THREE_URL, BOT_URL].forEach(function (u) { var l = document.createElement('link'); l.rel = 'prefetch'; l.as = 'script'; l.href = u; document.head.appendChild(l); });
  }
  function whenSettled(fn, wait) {
    var html = document.documentElement;
    /* start right after the hero's entrance settles, in a quiet frame */
    var go = function () { setTimeout(function () { (window.requestIdleCallback || function (f) { return setTimeout(f, 50); })(fn, { timeout: 600 }); }, wait == null ? 900 : wait); };
    if (html.classList.contains('intro')) document.addEventListener('tn:intro-done', go, { once: true }); else go();
  }
  function sync() {
    if (!app) { if (allowed()) load(); return; }
    if (allowed()) app.resume(); else app.pause();
  }
  [desk, calm].forEach(function (m) { if (m.addEventListener) m.addEventListener('change', sync); else m.addListener(sync); });
  /* phones: Nexi wakes with a Nexi slide and sleeps when the carousel moves on */
  hero.addEventListener('tn:slide', function () { if (!desk.matches) sync(); });

  var saveData = navigator.connection && navigator.connection.saveData;
  document.addEventListener('tn:intro-done', sync);
  /* a Nexi slide opening the page loads Nexi at once (during the intro, so her slide's timer never waits for
     her); otherwise desktop loads her after the hero settles, and phones keep the files in the cache for one */
  if (onNexiSlide() && possible()) load();
  else if (desk.matches) { preload(); whenSettled(load); }
  else if (possible() && !saveData) whenSettled(preload, 2500);
})();
