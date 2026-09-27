/* Nexi, TechNext's AI companion. A small 3D robot that roams the home hero on desktop:
   it circles the Odoo app orbit, chases order tokens through the flow chart, cheers the launch
   path, points at the call-to-action and follows slide changes. Clicking Nexi opens a short
   self-introduction. No chat logic lives here.

   This file is only the loader, so phones and tablets pay for a few hundred bytes and nothing
   else. On desktop (min-width:961px, a fine pointer, no reduced motion) it waits for the intro and
   an idle moment, then fetches Three.js (r128, MIT, self-hosted in assets/js/vendor/ because the
   CSP only allows same-origin scripts) and the robot in assets/js/nexi-bot.js. While Nexi is on
   screen it stands in for the "Chat with us" side tab; the tab comes back when the hero scrolls
   away or the window drops to mobile width. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var ROOT = hero.getAttribute('data-root') || '';
  var me = document.currentScript && document.currentScript.src || '';
  var V = (me.match(/[?&]v=([^&#]+)/) || [])[1];
  var desk = matchMedia('(min-width: 961px) and (hover: hover) and (pointer: fine)');
  var calm = matchMedia('(prefers-reduced-motion: reduce)');
  var app = null, loading = false;

  function webgl() { try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  function allowed() { return desk.matches && !calm.matches; }
  function script(src, ok) {
    var s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = ok; s.onerror = function () { loading = false; };
    document.head.appendChild(s);
  }
  function start() { loading = false; if (!app && allowed() && window.THREE && window.tnNexi) app = window.tnNexi(hero, ROOT); }
  function load() {
    if (app || loading || !allowed() || !webgl()) return;
    loading = true;
    var bot = function () { if (window.tnNexi) start(); else script(ROOT + 'assets/js/nexi-bot.js' + (V ? '?v=' + V : ''), start); };
    if (window.THREE) bot(); else script(ROOT + 'assets/js/vendor/three-r128.min.js', bot);
  }
  function whenSettled(fn) {
    var html = document.documentElement;
    var go = function () { setTimeout(function () { (window.requestIdleCallback || function (f) { return setTimeout(f, 300); })(fn, { timeout: 3000 }); }, 2600); };
    if (html.classList.contains('intro')) document.addEventListener('tn:intro-done', go, { once: true }); else go();
  }
  function sync() {
    if (!app) { if (allowed()) whenSettled(load); return; }
    if (allowed()) app.resume(); else app.pause();
  }
  [desk, calm].forEach(function (m) { if (m.addEventListener) m.addEventListener('change', sync); else m.addListener(sync); });
  whenSettled(load);
})();
