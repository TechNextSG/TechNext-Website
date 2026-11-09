/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Interactive icon motion (9 Nov 2026). Styles + keyframes: assets/css/icon-motion.css.
   - Mouse: hovering (or keyboard-focusing) a card, row, chip or link plays its icons: flat icons hop, Odoo icons lift
     while hovered, stroke glyphs tick. Only the NEAREST holder with at most 3 icons plays, so a whole grid never jiggles.
   - Touch: a tap plays the tapped holder's icons; flat and Odoo icons also play once as they scroll into view.
   Buttons, the header, menus' chevrons and FAQ chevrons keep their own motion. Nothing runs for reduced motion. */
(function () {
  'use strict';
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var HOST = 'a,li,article,dt,label,[class*="card"],[class*="item"],[class*="pillar"],[class*="tile"],[class*="-row"],' +
             '[class*="chip"],[class*="note"],[class*="node"],.x5-day,.cv-why>div,.who-card,.fw-box,h3,h4';
  var ICON = '.ic-flat,img.oi,img[src*="img/odoo/"],svg.ic';
  var NO_STROKE = '.btn,.btn-link,button,summary,.icon-btn,.hero-arrow,.side-tab,.meet-tab,.bn-link,.site-header,header,nav,.faq';
  var MAX = 3;

  function isOdoo(el) { return el.tagName === 'IMG'; }
  function wanted(el) {
    if (el.classList.contains('ic-flat') || isOdoo(el)) return true;
    return !el.closest(NO_STROKE);   // stroke glyph: only outside buttons, links-with-arrows, header and FAQ
  }
  function iconsIn(host) {
    var out = [], all = host.querySelectorAll(ICON);
    for (var i = 0; i < all.length; i++) if (wanted(all[i])) out.push(all[i]);
    return out;
  }
  function hostFor(t) {
    var h = t && t.closest ? t.closest(HOST) : null;
    while (h) {
      var n = iconsIn(h).length;
      if (n && n <= MAX) return h;
      if (n > MAX) return null;           // a list or grid of icons: let each item play on its own
      h = h.parentElement && h.parentElement.closest(HOST);
    }
    return null;
  }
  function play(el, delay) {
    el.classList.remove('icm-play');
    void el.getBoundingClientRect();      // restart the one-shot animation
    if (delay) el.style.animationDelay = delay + 'ms';
    el.classList.add('icm-play');
  }
  document.addEventListener('animationend', function (e) {
    var el = e.target;
    if (el.classList && el.classList.contains('icm-play') && /^icm/.test(e.animationName) && e.animationName !== 'icmPop') {
      el.classList.remove('icm-play'); el.style.animationDelay = '';
    }
  }, true);

  /* ---- mouse + keyboard ---- */
  var cur = null;
  function enter(h) {
    if (h === cur) return;
    leave();
    cur = h;
    if (!h) return;
    iconsIn(h).forEach(function (el) { if (isOdoo(el)) el.classList.add('icm-lift'); else play(el); });
  }
  function leave() {
    if (!cur) return;
    iconsIn(cur).forEach(function (el) { el.classList.remove('icm-lift'); });
    cur = null;
  }
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var h = hostFor(e.target);
    if (cur && h !== cur && cur.contains(e.target) && !h) return;   // still inside the current holder
    enter(h);
  }, { passive: true });
  document.addEventListener('pointerleave', leave, { passive: true });
  document.documentElement.addEventListener('mouseleave', leave);
  document.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches(':focus-visible')) enter(hostFor(e.target)); });
  document.addEventListener('focusout', function () { leave(); });

  /* ---- touch: tap plays, and icons play once as they scroll in ---- */
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch') return;
    var h = hostFor(e.target);
    if (h) iconsIn(h).forEach(function (el) { play(el); });
  }, { passive: true });

  if (matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
    var queue = [], timer = 0;
    var flush = function () {
      timer = 0;
      queue.splice(0, 6).forEach(function (el, i) { play(el, i * 70); });
      if (queue.length) timer = setTimeout(flush, 260);
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); queue.push(en.target); }
      });
      if (queue.length && !timer) timer = setTimeout(flush, 60);
    }, { threshold: 0.6 });
    var start = function () {
      document.querySelectorAll('main .ic-flat, main img.oi, main img[src*="img/odoo/"]').forEach(function (el) { io.observe(el); });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  }
})();
