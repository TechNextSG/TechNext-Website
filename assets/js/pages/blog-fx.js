/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Blog: the hero stack of the latest article covers (built from the rendered archive cards, BIR compliance first),
   pointer and scroll parallax, topic jumps into the archive filter, article counts.
   Motion is paused off-screen, on hover/focus and under reduced motion. Without JS the archive works on its own. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var list = document.getElementById('post-list');
  if (!list) return;
  var cards = [].slice.call(list.querySelectorAll('.post-card'));

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

  /* ---------------------------------------------------------------- data from the cards */
  var items = cards.map(function (c) {
    var a = c.querySelector('h2 a, h3 a'), cat = c.querySelector('.post-cat'), t = c.querySelector('time'), r = c.querySelector('.post-read');
    return {
      key: c.getAttribute('data-tags') || '', href: a ? a.getAttribute('href') : '#', title: txt(a),
      cat: txt(cat), catHtml: cat ? cat.innerHTML : '', date: txt(t), read: txt(r), cover: c.querySelector('.post-cover')
    };
  });
  var bar = document.querySelector('[data-filter]');
  var cats = [];
  if (bar) [].forEach.call(bar.querySelectorAll('[data-filter-tag]'), function (b) {
    var k = b.getAttribute('data-filter-tag');
    if (k === 'all') return;
    var n = b.querySelector('span');
    cats.push({ key: k, label: txt(b).replace(n ? txt(n) : '', '').trim() });
  });

  /* ---------------------------------------------------------------- counts and jumps into the archive */
  function count(k) { return items.filter(function (i) { return i.key === k; }).length; }
  [].forEach.call(document.querySelectorAll('[data-bx-n]'), function (b) {
    var n = count(b.getAttribute('data-bx-n'));
    if (n) b.textContent = n;
  });
  function jump(key) {
    var btn = bar && bar.querySelector('[data-filter-tag="' + key + '"]');
    if (btn) btn.click();
    var sec = document.getElementById('articles');
    if (sec) { document.documentElement.style.scrollBehavior = 'auto'; sec.scrollIntoView({ block: 'start' }); document.documentElement.style.scrollBehavior = ''; }
  }
  [].forEach.call(document.querySelectorAll('[data-bx-jump]'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); jump(a.getAttribute('data-bx-jump')); });
  });

  /* ---------------------------------------------------------------- the stack */
  var panel = document.querySelector('[data-bx-panel]');
  var stage = panel && panel.querySelector('[data-bx-stage]');
  var tabsEl = panel && panel.querySelector('[data-bx-tabs]');
  var dotsEl = panel && panel.querySelector('[data-bx-dots]');
  if (!panel || !stage || !cats.length || !items.length) return;
  var allLink = panel.querySelector('[data-bx-all]');
  var ppBtn = panel.querySelector('[data-bx-pp]');
  var cur = cats[0].key, front = 0, nodes = [], paused = false, hover = false, visible = true, timer = null;

  tabsEl.innerHTML = cats.map(function (c) {
    return '<button type="button" class="bx-tab" data-k="' + esc(c.key) + '" aria-pressed="false">' + esc(c.label) + ' <small>' + count(c.key) + '</small></button>';
  }).join('');
  var tabBtns = [].slice.call(tabsEl.querySelectorAll('.bx-tab'));

  function pool() { return items.filter(function (i) { return i.key === cur; }).slice(0, 4); }

  function layout() {
    var n = nodes.length;
    nodes.forEach(function (el, i) {
      var p = (i - front + n) % n;
      el.setAttribute('data-pos', String(p));
      el.setAttribute('aria-hidden', p === 0 ? 'false' : 'true');
      el.tabIndex = p === 0 ? 0 : -1;
    });
    [].forEach.call(dotsEl.children, function (d, i) { if (i === front) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
  }

  function build(key, first) {
    cur = key;
    var set = pool();
    tabBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-k') === key ? 'true' : 'false'); });
    var label = (cats.filter(function (c) { return c.key === key; })[0] || {}).label || '';
    if (allLink) { allLink.innerHTML = 'All ' + esc(label) + ' articles <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'; }
    stage.innerHTML = '';
    nodes = set.map(function (it) {
      var a = document.createElement('a');
      a.className = 'bx-card';
      a.href = it.href;
      var cov = it.cover ? it.cover.cloneNode(true) : null;
      if (cov) { var im = cov.querySelector('img'); if (im) { im.loading = 'eager'; im.setAttribute('fetchpriority', 'high'); } cov.removeAttribute('aria-hidden'); }
      a.innerHTML = '<span class="bx-card-in"><span class="bx-cov" aria-hidden="true"></span><span class="bx-card-b"><span class="bx-cat" data-cat="' + esc(it.key) + '">' + it.catHtml + '</span>' +
        '<b>' + esc(it.title) + '</b><span class="bx-meta">' + esc(it.date) + (it.read ? ' · ' + esc(it.read) : '') + '</span></span></span>';
      if (cov) a.querySelector('.bx-cov').appendChild(cov);
      return a;
    });
    // furthest card first in the DOM so it paints underneath without relying on z-index alone
    nodes.slice().reverse().forEach(function (a) { stage.appendChild(a); });
    dotsEl.innerHTML = nodes.map(function (_, i) { return '<button type="button" class="bx-dot" data-i="' + i + '" aria-label="Show article ' + (i + 1) + ' of ' + nodes.length + '"></button>'; }).join('');
    front = 0;
    if (first) { layout(); } else { requestAnimationFrame(layout); }
    restart();
  }

  function go(d) {
    if (!nodes.length) return;
    front = (front + d + nodes.length) % nodes.length;
    layout();
  }
  function restart() {
    clearInterval(timer);
    if (reduce || paused) return;
    timer = setInterval(function () { if (!hover && visible && !document.hidden) go(1); }, 6500);
  }

  tabBtns.forEach(function (b) { b.addEventListener('click', function () { if (b.getAttribute('data-k') !== cur) build(b.getAttribute('data-k')); }); });
  panel.querySelector('[data-bx-prev]').addEventListener('click', function () { go(-1); restart(); });
  panel.querySelector('[data-bx-next]').addEventListener('click', function () { go(1); restart(); });
  dotsEl.addEventListener('click', function (e) {
    var d = e.target.closest('.bx-dot');
    if (!d) return;
    front = +d.getAttribute('data-i'); layout(); restart();
  });
  if (ppBtn) {
    if (reduce) { paused = true; ppBtn.setAttribute('aria-pressed', 'true'); ppBtn.setAttribute('aria-label', 'Resume the automatic rotation'); }
    ppBtn.addEventListener('click', function () {
      paused = !paused;
      ppBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      ppBtn.setAttribute('aria-label', paused ? 'Resume the automatic rotation' : 'Pause the automatic rotation');
      restart();
    });
  }
  if (allLink) allLink.addEventListener('click', function (e) { e.preventDefault(); jump(cur); });
  panel.addEventListener('mouseenter', function () { hover = true; });
  panel.addEventListener('mouseleave', function () { hover = false; });
  panel.addEventListener('focusin', function () { hover = true; });
  panel.addEventListener('focusout', function () { hover = false; });

  build(cur, true);
  requestAnimationFrame(function () { panel.classList.add('is-ready'); });

  /* ---------------------------------------------------------------- parallax: pointer over the panel, scroll past the hero */
  if (!reduce) {
    var tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, raf = 0;
    function frame() {
      cx += (tx - cx) * .09; cy += (ty - cy) * .09;
      stage.style.setProperty('--px', cx.toFixed(3));
      stage.style.setProperty('--py', cy.toFixed(3));
      stage.style.setProperty('--sy', sy.toFixed(1));
      raf = (Math.abs(tx - cx) > .002 || Math.abs(ty - cy) > .002) ? requestAnimationFrame(frame) : 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    panel.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = panel.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 2;
      ty = ((e.clientY - r.top) / r.height - .5) * 2;
      kick();
    });
    panel.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    var tick = false;
    addEventListener('scroll', function () {
      if (tick || !visible) return;
      tick = true;
      requestAnimationFrame(function () { tick = false; sy = Math.max(0, Math.min(700, scrollY)); stage.style.setProperty('--sy', sy.toFixed(1)); });
    }, { passive: true });
  }

  /* pause every loop while the panel is off-screen */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { visible = e.isIntersecting; panel.classList.toggle('fx-off', !e.isIntersecting); });
    }).observe(panel);
  }
})();
