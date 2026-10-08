/* Homepage sections below the hero (styles: assets/css/home.css).
   - every .hm-live section gets .hm-on while it is on screen; CSS pauses every loop inside a section without it
   - who we are: counters count up once, office clocks tick (local time per office)
   - how we work: the rollout pipeline runs stage by stage; hovering or focusing a stage pins the run there
   - full suite: the app wall lights one random tile at a time
   - FAQ: the command palette filters the questions as you type; arrow keys move between them, "/" jumps to search
   Nothing loops with prefers-reduced-motion. */
(function () {
  'use strict';
  if (!document.body.classList.contains('is-home')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var live = Array.prototype.slice.call(document.querySelectorAll('.hm-live'));
  var hooks = [];   // functions called with (section, on) when a section enters / leaves the screen

  /* ---------------------------------------------------------------- counters + clocks (who we are) */
  var counted = false;
  function countUp(sec) {
    if (counted) return; counted = true;
    if (reduce) return;
    Array.prototype.forEach.call(sec.querySelectorAll('[data-count]'), function (el) {
      var end = +el.getAttribute('data-count'), suffix = el.textContent.replace(/[0-9]/g, ''), t0 = 0;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(end * e) + (k === 1 ? suffix : '');
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var clocks = Array.prototype.slice.call(document.querySelectorAll('[data-utc]')), clockTimer = 0;
  function tick() {
    var now = new Date(), utc = now.getTime() + now.getTimezoneOffset() * 60000;
    clocks.forEach(function (c) {
      var d = new Date(utc + (+c.getAttribute('data-utc')) * 3600000);
      c.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' local';
    });
  }
  if (clocks.length) {
    tick();
    var noc = clocks[0].closest('.hm-live');
    hooks.push(function (sec, on) {
      if (sec !== noc) return;
      clearInterval(clockTimer);
      if (on) { tick(); clockTimer = setInterval(tick, 15000); countUp(sec); }
    });
  }

  /* ---------------------------------------------------------------- rollout pipeline (how we work) */
  var run = document.querySelector('[data-hm-run]');
  if (run) {
    var stages = Array.prototype.slice.call(run.querySelectorAll('.hm-stage'));
    var fill = run.querySelector('[data-hm-run-fill]'), label = run.querySelector('[data-hm-run-label]'), log = run.querySelector('[data-hm-run-log]');
    var LOG = ['stage 1 · discovery · mapping how orders, stock and money move',
      'stage 2 · training · finance, sales and warehouse teams on their own data',
      'stage 3 · integration · banks, gateways and marketplaces connected to Odoo',
      'stage 4 · support · fixes, month-end help and upgrades after go-live',
      'pipeline passed · one team from the first workshop to the help after go-live'];
    var at = 0, runTimer = 0, pinned = -1, runOn = false;
    var show = function (n) {
      stages.forEach(function (s, i) { s.classList.toggle('is-done', i < n); s.classList.toggle('is-run', i === n); });
      run.classList.toggle('is-passed', n >= stages.length);
      if (fill) fill.parentNode.style.setProperty('--p', Math.min(1, n / (stages.length - 1)));
      if (label) label.textContent = n >= stages.length ? 'Passed' : 'Running';
      if (log && log.textContent !== LOG[Math.min(n, 4)]) {
        log.classList.add('is-swap');
        setTimeout(function () { log.textContent = LOG[Math.min(n, 4)]; log.classList.remove('is-swap'); }, 200);
      }
    };
    var loop = function () {
      clearTimeout(runTimer);
      if (!runOn || pinned >= 0 || document.hidden) return;
      show(at);
      var wait = at >= stages.length ? 3600 : 2600;
      at = at >= stages.length ? 0 : at + 1;
      runTimer = setTimeout(loop, wait);
    };
    if (reduce) show(stages.length);
    else {
      show(0);
      hooks.push(function (sec, on) { if (sec.contains(run)) { runOn = on; loop(); } });
      document.addEventListener('visibilitychange', loop);
      stages.forEach(function (s, i) {
        var pin = function () { pinned = i; clearTimeout(runTimer); show(i); };
        var unpin = function () { if (run.contains(document.activeElement) && document.activeElement.closest('.hm-stage')) return; pinned = -1; at = i; loop(); };
        s.addEventListener('mouseenter', pin); s.addEventListener('focusin', pin);
        s.addEventListener('mouseleave', unpin); s.addEventListener('focusout', function () { setTimeout(unpin, 0); });
      });
    }
  }

  /* ---------------------------------------------------------------- the app wall (full suite) */
  var wall = document.querySelector('[data-hm-wall]'), wallTimer = 0, lastTile = null;
  function lightTile() {
    if (!wall || document.hidden) return;
    var tiles = wall.querySelectorAll('.hm-tile'), w = window.innerWidth;
    for (var n = 0; n < 6; n++) {
      var t = tiles[(Math.random() * tiles.length) | 0], r = t.getBoundingClientRect();
      if (r.left > w * 0.1 && r.right < w * 0.9) {
        if (lastTile) lastTile.classList.remove('is-lit');
        t.classList.add('is-lit'); lastTile = t; break;
      }
    }
  }
  if (wall) hooks.push(function (sec, on) {
    if (!sec.contains(wall)) return;
    clearInterval(wallTimer);
    if (on && !reduce) wallTimer = setInterval(lightTile, 900);
  });

  /* ---------------------------------------------------------------- command palette (FAQ) */
  var pal = document.querySelector('[data-hm-pal]');
  if (pal) {
    var q = pal.querySelector('[data-hm-pal-q]'), items = Array.prototype.slice.call(pal.querySelectorAll('details'));
    var empty = pal.querySelector('[data-hm-pal-empty]'), count = pal.querySelector('[data-hm-pal-count]');
    var norm = function (s) { return s.toLowerCase().replace(/\s+/g, ' '); };
    var text = items.map(function (d) { return norm(d.textContent); });
    var filter = function () {
      var words = norm(q.value).trim().split(' ').filter(Boolean), n = 0;
      items.forEach(function (d, i) {
        var hit = words.every(function (w) { return text[i].indexOf(w) >= 0; });
        d.hidden = !hit; if (hit) n++;
      });
      empty.hidden = n > 0;
      count.textContent = n + (n === 1 ? ' answer' : ' answers');
    };
    q.addEventListener('input', filter);
    var visible = function () { return items.filter(function (d) { return !d.hidden; }).map(function (d) { return d.querySelector('summary'); }); };
    pal.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var list = visible(); if (!list.length) return;
      var i = list.indexOf(document.activeElement);
      if (document.activeElement === q) i = e.key === 'ArrowDown' ? -1 : list.length;
      var next = e.key === 'ArrowDown' ? i + 1 : i - 1;
      if (next < 0) { q.focus(); e.preventDefault(); return; }
      if (next >= list.length) return;
      list[next].focus(); e.preventDefault();
    });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var l = visible(); if (l.length === 1) { l[0].parentNode.open = true; l[0].focus(); } e.preventDefault(); }
      if (e.key === 'Escape' && q.value) { q.value = ''; filter(); }
    });
    var palSec = pal.closest('.hm-live'), palOn = false;
    hooks.push(function (sec, on) { if (sec === palSec) palOn = on; });
    document.addEventListener('keydown', function (e) {
      if (!palOn || e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var a = document.activeElement;
      if (a && (a.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return;
      e.preventDefault(); q.focus();
    });
  }

  /* ---------------------------------------------------------------- on-screen tracking */
  function set(sec, on) {
    if (sec.classList.contains('hm-on') === on) return;
    sec.classList.toggle('hm-on', on);
    hooks.forEach(function (h) { h(sec, on); });
  }
  if (!('IntersectionObserver' in window)) { live.forEach(function (s) { set(s, true); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { set(en.target, en.isIntersecting); });
  }, { rootMargin: '60px 0px 60px 0px', threshold: 0 });
  live.forEach(function (s) { io.observe(s); });
})();
