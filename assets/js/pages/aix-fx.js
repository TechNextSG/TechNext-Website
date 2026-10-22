/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* AI + Enterprise pages (22 Oct 2026): one small engine for the live glass hero panels.
   A panel is [data-aix]; inside it, groups [data-grp] (data-start / data-len in ms) replay their [data-at] children
   (data-at = ms after the group starts, data-until = ms when it switches off again, data-type = text to type,
   data-count = number to count up to). Before a group first runs it shows its finished state, so no-JS and
   reduced-motion visitors see a complete panel. The loop stops when the panel is off-screen. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  function fmt(n, dec) { return n.toLocaleString('en-SG', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

  function panel(root) {
    var cycle = parseInt(root.getAttribute('data-cycle'), 10) || 12000;
    var grps = $$('[data-grp]', root);
    var timers = [], playing = false, tick = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function stopAll() { timers.forEach(clearTimeout); timers = []; tick.forEach(function (t) { t.stop = true; }); tick = []; playing = false; }

    function typeInto(el, full) {
      var i = 0, t = { stop: false }; tick.push(t);
      el.classList.add('is-typing');
      (function step() {
        if (t.stop) return;
        i = Math.min(full.length, i + 2);
        el.textContent = full.slice(0, i);
        if (i < full.length) setTimeout(step, 26); else el.classList.remove('is-typing');
      })();
    }
    function countTo(el) {
      var to = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10), pre = el.getAttribute('data-pre') || '';
      var t0 = performance.now(), dur = 1100, t = { stop: false }; tick.push(t);
      (function step(now) {
        if (t.stop) return;
        var q = Math.min(1, ((now || performance.now()) - t0) / dur), e = 1 - Math.pow(1 - q, 3);
        el.textContent = pre + fmt(to * e, dec);
        if (q < 1) requestAnimationFrame(step);
      })(t0);
    }
    function on(el) {
      el.classList.add('is-on');
      if (el.hasAttribute('data-type')) typeInto(el, el.getAttribute('data-type'));
      if (el.hasAttribute('data-count')) countTo(el);
    }
    function startGroup(g) {
      var els = $$('[data-at]', g);
      els.forEach(function (e) {
        e.classList.remove('is-on', 'is-typing');
        if (e.hasAttribute('data-type')) e.textContent = '';
        if (e.hasAttribute('data-count')) e.textContent = (e.getAttribute('data-pre') || '') + fmt(0, parseInt(e.getAttribute('data-dec') || '0', 10));
      });
      g.classList.add('is-run', 'is-lit');
      els.forEach(function (e) {
        later(function () { on(e); }, parseInt(e.getAttribute('data-at'), 10) || 0);
        var u = e.getAttribute('data-until');
        if (u) later(function () { e.classList.remove('is-on'); }, parseInt(u, 10));
      });
    }
    function play() {
      stopAll(); playing = true;
      grps.forEach(function (g) {
        var s = parseInt(g.getAttribute('data-start'), 10) || 0, len = parseInt(g.getAttribute('data-len'), 10);
        later(function () { startGroup(g); }, s);
        if (len) later(function () { g.classList.remove('is-lit'); }, s + len);
      });
      later(play, cycle);
    }
    function finish() {
      grps.forEach(function (g) {
        g.classList.remove('is-run', 'is-lit');
        $$('[data-at]', g).forEach(function (e) {
          e.classList.remove('is-on', 'is-typing');
          if (e.hasAttribute('data-type')) e.textContent = e.getAttribute('data-type');
          if (e.hasAttribute('data-count')) e.textContent = (e.getAttribute('data-pre') || '') + fmt(parseFloat(e.getAttribute('data-count')), parseInt(e.getAttribute('data-dec') || '0', 10));
        });
      });
    }
    if (reduce || !('IntersectionObserver' in window)) { finish(); root.classList.add('is-done'); return; }
    // the first group starts empty on first paint, so the finished panel never flashes before the replay begins
    grps.forEach(function (g) {
      if ((parseInt(g.getAttribute('data-start'), 10) || 0) !== 0) return;
      $$('[data-at]', g).forEach(function (e) {
        if (e.hasAttribute('data-type')) e.textContent = '';
        if (e.hasAttribute('data-count')) e.textContent = (e.getAttribute('data-pre') || '') + fmt(0, parseInt(e.getAttribute('data-dec') || '0', 10));
      });
      g.classList.add('is-run');
    });
    var vis = false;
    new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
      root.classList.toggle('is-off', !vis);
      if (vis && !playing) play();
      else if (!vis && playing) { stopAll(); finish(); }
    }, { threshold: 0.12 }).observe(root);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && playing) { stopAll(); finish(); root.classList.add('is-off'); }
      else if (!document.hidden && vis && !playing) { root.classList.remove('is-off'); play(); }
    });
  }

  function loopsOffscreen() {
    if (!('IntersectionObserver' in window)) return;
    $$('[data-aix-loop]').forEach(function (el) {
      new IntersectionObserver(function (e) { el.classList.toggle('is-off', !e[0].isIntersecting); }).observe(el);
    });
  }

  // the first FAQ answer starts open (set here, not in the markup, so the FAQ structured data still lists every question)
  function openFirstFaq() {
    var d = document.querySelector('.fx-faq details');
    if (d) d.open = true;
  }

  function init() {
    $$('[data-aix]').forEach(panel);
    loopsOffscreen();
    openFirstFaq();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
