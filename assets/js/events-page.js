/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /events: renders the event list (assets/js/events-data.js) into the page, by date, in the visitor's browser. An event
   whose last day has passed (in its own time zone) moves from Upcoming to Past; milestones before today show as reached.
   The page re-sorts every few minutes, so a tab left open overnight stays right. */
(function () {
  'use strict';
  var EV = window.TN_EV, ALL = window.TN_EVENTS, MS = window.TN_MILESTONES;
  if (!EV || !ALL) return;
  var ROOT = (document.querySelector('link[rel="stylesheet"][href*="assets/css/site.css"]') || { getAttribute: function () { return ''; } }).getAttribute('href').split('assets/css/site.css')[0];
  var KIND = { show: 'Business Show', academy: 'Workshop', webinar: 'Webinar', conference: 'Conference', technext: 'TechNext' };
  var CC = { SG: 'Singapore', PH: 'Philippines', VN: 'Vietnam', ONLINE: 'Online', SEA: 'Southeast Asia', WORLD: 'Worldwide' };
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function href(u) { return /^https?:/.test(u) ? u : ROOT + u; }
  function ext(u) { return /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''; }
  function range(e) { var a = EV.dayMon(e.date); if (!e.end) return a[0] + ' ' + a[1] + ' ' + a[2]; var b = EV.dayMon(e.end); return a[1] === b[1] ? a[0] + '–' + b[0] + ' ' + a[1] + ' ' + a[2] : a[0] + ' ' + a[1] + ' – ' + b[0] + ' ' + b[1] + ' ' + b[2]; }
  function daysTo(e, now) { return Math.ceil((EV.start(e) - now) / 864e5); }
  function when(e, now) { var d = daysTo(e, now); if (d <= 0) return EV.end(e) > now && EV.start(e) <= now ? 'On now' : 'Today'; return d === 1 ? 'Tomorrow' : 'In ' + d + ' days'; }
  function link(e, label) { return '<a class="ev-go" href="' + esc(href(e.url)) + '"' + ext(e.url) + '>' + esc(label || (/odoo\.com\/event\/.+register/.test(e.url) ? 'Details & registration' : 'Event page')) + '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>'; }
  function tags(e) {
    var t = '<span class="ev-tag ev-tag--' + e.kind + '">' + KIND[e.kind] + '</span><span class="ev-tag">' + (e.cc === 'ONLINE' ? 'Online' : 'In person') + '</span><span class="ev-tag">Free</span>';
    if (e.lang && e.lang !== 'English') t += '<span class="ev-tag">' + esc(e.lang) + '</span>';
    if (e.status) t += '<span class="ev-tag ev-tag--warn">' + esc(e.status) + '</span>';
    return t;
  }
  function stub(e) { var d = EV.dayMon(e.date), p = e.date.split('-'), dow = DOW[new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay()];
    return '<span class="ev-stub" aria-hidden="true"><small>' + dow + '</small><b>' + d[0] + (e.end ? '<i>–' + EV.dayMon(e.end)[0] + '</i>' : '') + '</b><span>' + d[1] + '</span></span>'; }

  function render() {
    var now = Date.now(), up = EV.upcoming(now), past = EV.past(now);
    /* the glance strip */
    var st = function (k, v) { var el = document.querySelector('[data-ev-stat="' + k + '"]'); if (el) el.textContent = v; };
    if (up[0]) st('next', range(up[0]) + ' · ' + up[0].city);
    var ip = up.filter(function (e) { return e.cc !== 'ONLINE'; }).length, on = up.filter(function (e) { return e.cc === 'ONLINE'; }).length;
    st('inperson', ip + (ip === 1 ? ' event ahead' : ' events ahead') + ' · SG · PH · VN'); st('online', on ? on + (on === 1 ? ' webinar ahead' : ' webinars ahead') + ' · English' : 'New webinars soon');
    /* the next event, as a big admission ticket */
    var nx = document.querySelector('[data-ev-next]');
    if (nx) { var e = up[0];
      nx.innerHTML = e ? '<div class="ev-ticket" data-cc="' + e.cc + '">' + stub(e) + '<div class="ev-ticket-b"><p class="ev-ticket-k"><span class="ev-pulse"></span>Next up · ' + when(e, now) + '</p><h3>' + esc(e.title) + '</h3>' +
        '<p class="ev-meta">' + esc(e.time ? e.time + ' · ' : '') + esc(e.venue) + '</p><p>' + esc(e.note) + '</p><p class="ev-tags">' + tags(e) + '</p></div>' +
        '<div class="ev-ticket-side"><span class="ev-count"><b>' + Math.max(0, daysTo(e, now)) + '</b>' + (daysTo(e, now) === 1 ? 'day to go' : 'days to go') + '</span>' + link(e) + '</div></div>'
        : '<div class="ev-ticket ev-ticket--empty"><div class="ev-ticket-b"><p class="ev-ticket-k">Next up</p><h3>New dates coming soon</h3><p>Every event on our list has happened. New dates are added here as Odoo and TechNext announce them.</p></div></div>'; }
    /* the agenda (filterable) */
    var list = document.querySelector('[data-ev-list]');
    if (list) list.innerHTML = up.map(function (e, i) {
      return '<li class="ev-row' + (i >= SHORT ? ' is-more' : '') + '" data-cc="' + e.cc + '" style="--i:' + i + '">' + stub(e) + '<div class="ev-row-b"><p class="ev-row-k"><span class="ev-cc">' + CC[e.cc] + '</span>' + esc(e.city !== 'Online' ? e.city : '') + '<em>' + when(e, now) + '</em></p><h3>' + esc(e.title) + '</h3>' +
        '<p class="ev-meta">' + esc(e.time ? e.time + ' · ' : '') + esc(e.venue) + '</p><p class="ev-note">' + esc(e.note) + '</p><p class="ev-tags">' + tags(e) + '</p></div>' + link(e) + '</li>';
    }).join('') || '<li class="ev-empty">No upcoming events right now. New dates are added as they are announced.</li>';
    filter(cur);
    /* the booths and lanes */
    [].forEach.call(document.querySelectorAll('[data-ev-cc]'), function (ul) { var cc = ul.getAttribute('data-ev-cc'), L = up.filter(function (e) { return e.cc === cc; });
      ul.innerHTML = L.map(function (e) { var d = EV.dayMon(e.date); return '<li><span class="ev-mini"><b>' + d[0] + (e.end ? '–' + EV.dayMon(e.end)[0] : '') + '</b>' + d[1] + '</span><span class="ev-mini-b"><b>' + esc(e.city) + '</b><span>' + esc(KIND[e.kind] + (e.status ? ' · ' + e.status : '')) + '</span>' + link(e, e.cc === 'SEA' ? 'odoo.com/event' : 'Register') + '</span></li>'; }).join('') ||
        '<li class="ev-none"><span class="ev-mini ev-mini--soon">+</span><span class="ev-mini-b"><b>New dates soon</b><span>Nothing ahead on our list right now.</span></span></li>'; });
    /* milestones, with today's marker */
    var ml = document.querySelector('[data-ev-miles]');
    if (ml && MS) { var out = [], marked = false;
      MS.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (m, i) { var t = EV.start({ date: m.date, tz: 8 }), done = t <= now, d = EV.dayMon(m.date);
        if (!done && !marked) { marked = true; var td = new Date(now + 8 * 3600e3); out.push('<li class="ev-mile ev-mile--today" aria-label="Today"><span class="ev-dot"></span><span class="ev-today">Today · ' + td.getUTCDate() + ' ' + EV.MON[td.getUTCMonth()] + ' ' + td.getUTCFullYear() + '</span></li>'); }
        out.push('<li class="ev-mile' + (done ? ' is-done' : '') + '" style="--i:' + i + '"><span class="ev-dot"></span><p class="ev-mile-d"><b>' + d[0] + ' ' + d[1] + '</b> ' + d[2] + '</p><div class="ev-mile-c"><span class="ev-mile-tag">' + esc(m.tag) + '</span><h3>' + esc(m.title) + '</h3><p>' + esc(m.text) + '</p>' +
          (m.href ? '<a class="btn-link" href="' + esc(href(m.href)) + '">Read more</a>' : '') + '<span class="ev-mile-st">' + (done ? 'Reached' : 'Ahead') + '</span></div></li>'); });
      if (!marked) out.push('<li class="ev-mile ev-mile--today"><span class="ev-dot"></span><span class="ev-today">Today</span></li>');
      out.push('<li class="ev-mile ev-mile--soon"><span class="ev-dot"></span><p class="ev-mile-d"><b>TBA</b></p><div class="ev-mile-c"><span class="ev-mile-tag">Odoo</span><h3>Odoo Experience 2027</h3><p>Dates not announced yet. We will add them here when Odoo does.</p><span class="ev-mile-st">Coming soon</span></div></li>');
      ml.innerHTML = out.join(''); }
    /* past events: newest first, stamped ENDED */
    var pl = document.querySelector('[data-ev-past]');
    if (pl) pl.innerHTML = past.map(function (e, i) { return '<li class="ev-old" data-cc="' + e.cc + '" style="--r:' + ((i % 3) - 1) * 0.8 + 'deg">' + stub(e) + '<div><p class="ev-row-k"><span class="ev-cc">' + CC[e.cc] + '</span>' + esc(range(e)) + '</p><h3>' + esc(e.title) + '</h3><p class="ev-meta">' + esc(e.venue) + '</p>' + link(e, /^blog\//.test(e.url) ? 'Read our takeaways' : 'Event page') + '</div><span class="ev-ended" aria-hidden="true">Ended</span></li>'; }).join('') ||
      '<li class="ev-empty">Nothing here yet.</li>';
  }
  var cur = 'all', SHORT = 8;
  function filter(f) { cur = f;
    [].forEach.call(document.querySelectorAll('[data-ev-f]'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ev-f') === f ? 'true' : 'false'); });
    var n = 0; [].forEach.call(document.querySelectorAll('.ev-row'), function (r) { var on = f === 'all' || r.getAttribute('data-cc') === f; r.hidden = !on; if (on) n++; });
    var list = document.querySelector('[data-ev-list]'), em = list && list.querySelector('.ev-empty--f');
    if (list) { var all = list.querySelectorAll('.ev-row').length, more = document.querySelector('[data-ev-more]'), shortOn = f === 'all' && !open && all > SHORT;
      list.classList.toggle('is-short', shortOn); if (more) { more.hidden = !(f === 'all' && all > SHORT); var mb = more.querySelector('button'); mb.textContent = open ? 'Show fewer' : 'Show all ' + all + ' events'; mb.setAttribute('aria-expanded', open ? 'true' : 'false'); } }
    if (list && !n && list.querySelector('.ev-row')) { if (!em) { em = document.createElement('li'); em.className = 'ev-empty ev-empty--f'; list.appendChild(em); } em.textContent = 'Nothing ahead here right now. Try another country.'; em.hidden = false; } else if (em) em.hidden = true;
  }
  var open = false;
  function init() {
    render();
    var mb = document.querySelector('[data-ev-more] button'); if (mb) mb.addEventListener('click', function () { open = !open; filter(cur); });
    [].forEach.call(document.querySelectorAll('[data-ev-f]'), function (b) { b.addEventListener('click', function () { filter(b.getAttribute('data-ev-f')); }); });
    setInterval(render, 5 * 60000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
