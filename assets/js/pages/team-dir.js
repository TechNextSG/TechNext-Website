/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Team Directory (8 Nov 2026): search + team filter over the compact cards, a detail panel for the picked person
   (sticky beside the grid on desktop, a bottom sheet on phones), Email / Save contact (.vcf) / Full profile, arrow keys
   move the selection, and live office clocks. Data: the #ed-data JSON block (team_pages.directory_compact_html). */
(function () {
  'use strict';
  var dataEl = document.getElementById('ed-data');
  var grid = document.querySelector('[data-ed-grid]'), panel = document.querySelector('[data-ed-panel]');
  if (!dataEl || !grid || !panel) return;
  var D = JSON.parse(dataEl.textContent), ROOT = (document.querySelector('.brand') || {}).getAttribute ? document.querySelector('.brand').getAttribute('href').replace(/index\.html$|\.\/$/, '') : '/';
  var cards = [].slice.call(grid.querySelectorAll('[data-ed]'));
  var phone = window.matchMedia('(max-width: 860px)');
  var cur = -1, filter = '', q = '';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ini(n) { var w = n.split(/\s+/); return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase(); }
  var IC = { mail: 'M4 6h16v12H4z M4 7l8 6 8-6', vcf: 'M12 4v11m0 0-4-4m4 4 4-4M5 19h14', arrow: 'M5 12h14M13 6l6 6-6 6', x: 'M6 6l12 12M18 6L6 18' };
  function ic(k) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + IC[k] + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  function render(i) {
    var p = D[i];
    var pic = p.photo ? '<img src="' + ROOT + 'assets/img/team/' + esc(p.photo) + '" alt="' + esc(p.name) + '" width="168" height="168">' : '<span class="ed-ini">' + ini(p.name) + '</span>';
    var stats = (p.stats || []).map(function (s) { return '<li><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></li>'; }).join('');
    var skills = (p.skills || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
    panel.innerHTML =
      '<button type="button" class="ed-p-x" data-ed-close aria-label="Close">' + ic('x') + '</button>' +
      '<div class="ed-p-top">' + pic + '<div><h2>' + esc(p.name) + '</h2><p class="ed-p-role">' + esc(p.role) + '</p><p class="ed-p-off">' + esc(p.office) + ' · ' + esc(p.group) + '</p></div></div>' +
      '<div class="ed-p-body">' + (p.sum ? '<p class="ed-p-sum">' + esc(p.sum) + '</p>' : '') +
      (stats ? '<ul class="ed-p-stats">' + stats + '</ul>' : '') +
      (skills ? '<p class="ed-p-h">Skills</p><ul class="ed-p-skills">' + skills + '</ul>' : '') +
      /* owner 8 Nov 2026: no email, vCard, profile link, booking button or contact line per person (the page itself names sales@) */
      '</div>';
  }
  function pick(i, open) {
    if (i < 0 || i >= D.length) return;
    cur = i;
    cards.forEach(function (c, k) { c.classList.toggle('is-on', k === i); c.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    render(i);
    if (open && phone.matches) openSheet();
  }
  var scrim = null;
  function openSheet() {
    panel.classList.add('is-open');
    if (!scrim) { scrim = document.createElement('div'); scrim.className = 'ed-scrim'; scrim.addEventListener('click', closeSheet); }
    document.body.appendChild(scrim);
    var x = panel.querySelector('[data-ed-close]'); if (x) x.focus({ preventScroll: true });
  }
  function closeSheet() {
    panel.classList.remove('is-open');
    if (scrim && scrim.parentNode) scrim.parentNode.removeChild(scrim);
    if (cards[cur]) cards[cur].focus({ preventScroll: true });
  }
  function visible() { return cards.filter(function (c) { return !c.parentNode.hidden; }); }
  function apply() {
    var shown = 0;
    cards.forEach(function (c, k) {
      var p = D[k], on = (!filter || p.group === filter) && (!q || p.hay.indexOf(q) > -1);
      c.parentNode.hidden = !on; if (on) shown += 1;
    });
    document.querySelector('[data-ed-none]').hidden = shown > 0;
    var v = visible();
    if (v.length && (cur < 0 || cards[cur].parentNode.hidden)) pick(+v[0].getAttribute('data-ed'), false);
  }

  grid.addEventListener('click', function (e) {
    var a = e.target.closest('[data-ed]');
    if (!a) return;
    pick(+a.getAttribute('data-ed'), true);
  });
  grid.addEventListener('keydown', function (e) {
    if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].indexOf(e.key) < 0) return;
    var v = visible(), at = v.indexOf(document.activeElement); if (at < 0) return;
    e.preventDefault();
    var next = v[Math.max(0, Math.min(v.length - 1, at + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1)))];
    next.focus(); pick(+next.getAttribute('data-ed'), false);
  });
  panel.addEventListener('click', function (e) {
    if (e.target.closest('[data-ed-close]')) closeSheet();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) closeSheet(); });
  document.querySelectorAll('[data-ed-filter]').forEach(function (b) {
    b.addEventListener('click', function () {
      filter = b.getAttribute('data-ed-filter');
      document.querySelectorAll('[data-ed-filter]').forEach(function (o) { var on = o === b; o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      apply();
    });
  });
  var input = document.querySelector('[data-ed-search]');
  if (input) input.addEventListener('input', function () { q = input.value.trim().toLowerCase(); apply(); });
  pick(0, false);

  /* live office time */
  var clocks = [].slice.call(document.querySelectorAll('time[data-tz]')), fm = {};
  function tick() {
    var now = new Date();
    clocks.forEach(function (el) {
      var tz = el.getAttribute('data-tz');
      if (!(tz in fm)) { try { fm[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }); } catch (_) { fm[tz] = null; } }
      if (fm[tz]) el.textContent = fm[tz].format(now);
    });
  }
  tick(); setInterval(tick, 15000);
})();
