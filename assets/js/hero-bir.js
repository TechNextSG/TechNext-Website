/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Home hero slide 3: the BIR control tower. The BIR forms orbit an "Accounting · BIR" console on a tilted ring:
   drag to spin, select a form (on the ring, with the keyboard, or from the copy strip) to generate it in the console,
   a beam follows the selected form, and the post button posts and locks sample invoices in Odoo. The EIS node only
   says that a connection to the BIR's EIS is a separate project: Odoo has no built-in EIS connector, and TechNext has
   not built one, so nothing here is sent to, transmitted to or accepted by the BIR.
   Runs only while its slide is active and the page is visible; static under reduced motion and on narrow screens.
   All figures are sample data (the same set as assets/docs/technext-sample-bir-reports.pdf). */
(function () {
  'use strict';
  var root = document.querySelector('[data-birtower]'); if (!root) return;
  var slide = root.closest('.slide');
  var $ = function (s, r) { return (r || root).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || root).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes = $$('.bt-node'), core = $('.bt-core'), beam = $('.bt-beam path'), beamDot = $('.bt-beam circle');
  var strip = slide ? $$('.bt-strip button', slide) : [];

  var F = {
    '2307': { t: 'BIR 2307 · Q3 2026', s: '4 certificates', n: 18, rows: [['Northbay Logistics · WC158', '3,525.00'], ['Ridgeview IT Services · WC160', '2,700.00'], ['Ortega Law Office · WI011', '6,000.00']] },
    slsp: { t: 'SLSP sales · Q3 2026', s: 'DAT file generated', n: 42, rows: [['Azure Bay Hotels', '842,000.00'], ['Pinecrest Clinics', '310,500.00'], ['Output VAT', '165,750.00']] },
    sawt: { t: 'SAWT · Q3 2026', s: 'DAT file generated', n: 12, rows: [['Azure Bay Hotels · WC158', '8,420.00'], ['Pinecrest Clinics · WC160', '6,210.00'], ['Creditable tax', '14,630.00']] },
    qap: { t: 'QAP · Q3 2026', s: 'for your 1601-EQ', n: 16, rows: [['Northbay Logistics · WC158', '3,525.00'], ['Ridgeview IT Services · WC160', '2,700.00'], ['Total withheld', '6,225.00']] },
    '2550q': { t: '2550Q VAT · Q3 2026', s: 'Draft return', n: 58, rows: [['Output VAT', '165,750.00'], ['Input VAT', '111,648.00'], ['VAT payable', '54,102.00']] },
    eis: { t: 'E-invoicing (EIS)', s: 'Separate project, to be assessed', n: 0, eis: true, rows: [['INV/2026/1142 · Azure Bay', 'Posted · locked'], ['INV/2026/1157 · Pinecrest', 'Posted · locked'], ['Connection to the BIR’s EIS', 'Not in Odoo; assessed with you']] },
    orus: { t: 'Books of Accounts', s: 'For your own ORUS registration', n: 6, rows: [['General journal · General ledger', 'Exported from Odoo'], ['Sales journal · Purchase journal', 'Exported from Odoo'], ['Cash receipts · Cash disbursements', 'Exported from Odoo']] }
  };
  var docT = $('[data-bt-title]'), docS = $('[data-bt-sub]'), rowsEl = $('[data-bt-rows]'), gen = $('[data-bt-gen]'), sendBox = $('[data-bt-send]'), sent = $('[data-bt-sent]');
  var current = '';
  function select(key, from) {
    var d = F[key]; if (!d || key === current) return; current = key;
    nodes.forEach(function (n) { n.setAttribute('aria-pressed', n.getAttribute('data-form') === key ? 'true' : 'false'); });
    strip.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-form') === key ? 'true' : 'false'); });
    docT.textContent = d.t; docS.textContent = d.s;
    rowsEl.innerHTML = d.rows.map(function (r, i) {
      var ok = /Posted · locked|Exported from Odoo/.test(r[1]);
      return '<li style="--r:' + i + '"' + (ok ? ' class="is-ok"' : '') + '><span>' + r[0] + '</span><b>' + r[1] + '</b></li>';
    }).join('');
    gen.innerHTML = d.eis ? '<span>Sample data · invoices posted and locked in Odoo; no EIS connection</span><em>To assess</em><span class="bt-prog"><i></i></span>'
      : '<span>Generated from <b>' + d.n + '</b> posted entries</span><em>Generated</em><span class="bt-prog"><i></i></span>';
    if (sendBox) sendBox.hidden = !d.eis;
    if (from === 'ring' && !reduce) { var n = nodeOf(key); if (n) { n.classList.remove('is-hit'); void n.offsetWidth; n.classList.add('is-hit'); } }
  }
  var nodeOf = function (k) { return nodes.filter(function (n) { return n.getAttribute('data-form') === k; })[0]; };

  root.addEventListener('click', function (e) { var n = e.target.closest('.bt-node'); if (n && !moved) select(n.getAttribute('data-form'), 'ring'); });
  strip.forEach(function (b) { b.addEventListener('click', function () { select(b.getAttribute('data-form'), 'ring'); }); });

  /* countdown pill */
  var days = $('[data-bt-days]');
  if (days) { var left = Math.max(0, Math.floor((Date.parse('2026-12-31T23:59:59+08:00') - Date.now()) / 864e5)); days.textContent = left + ' days left'; }

  /* ring layout */
  var flat = function () { return window.innerWidth <= 900; };
  var base = -Math.PI / 2, vel = 0, W = 0, H = 0, raf = 0, active = false, hover = false, inView = true;
  var pos = {};
  function measure() { W = root.offsetWidth; H = root.offsetHeight; }   // layout size: the slide entrance scales the box
  function layout() {
    if (flat()) { nodes.forEach(function (n) { n.style.removeProperty('--x'); n.style.removeProperty('--y'); }); return; }
    var cx = W / 2, cy = H / 2, rx = W * .47, ry = H * .40, N = nodes.length;
    nodes.forEach(function (n, i) {
      var a = base + i * 2 * Math.PI / N, sn = Math.sin(a), x = cx + rx * Math.cos(a), y = cy + ry * sn;
      var depth = (sn + 1) / 2;                        // 0 = back (top of the ring), 1 = front (bottom)
      n.style.setProperty('--x', x.toFixed(1) + 'px'); n.style.setProperty('--y', y.toFixed(1) + 'px');
      n.style.setProperty('--s', (.8 + .25 * depth).toFixed(3)); n.style.setProperty('--o', (.62 + .38 * depth).toFixed(3));
      n.style.setProperty('--z', depth > .5 ? 5 : 2);
      pos[n.getAttribute('data-form')] = [x, y];
    });
    var p = pos[current];
    if (p && beam) {
      var mx = (cx + p[0]) / 2, my = Math.min(cy, p[1]) - 40;
      beam.setAttribute('d', 'M' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1));
      beamDot.setAttribute('cx', p[0].toFixed(1)); beamDot.setAttribute('cy', p[1].toFixed(1));
    }
  }
  function frame() {
    raf = 0;
    if (!running()) return;
    if (!dragging) { vel *= .94; base += vel + (hover ? 0 : .0016); }
    layout();
    raf = requestAnimationFrame(frame);
  }
  var running = function () { return active && inView && !document.hidden && !reduce && !flat(); };
  function wake() { if (running() && !raf) raf = requestAnimationFrame(frame); }

  /* drag to spin */
  var dragging = false, moved = false, lastX = 0;
  root.addEventListener('pointerdown', function (e) {
    if (flat() || e.target.closest('.bt-core')) return;
    dragging = true; moved = false; lastX = e.clientX; root.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', function (e) {
    if (dragging) {
      var dx = e.clientX - lastX; lastX = e.clientX;
      if (Math.abs(dx) > 1) moved = true;
      base += dx * .006; vel = dx * .0012; if (reduce || !raf) layout();
    }
  });
  window.addEventListener('pointerup', function () { if (!dragging) return; dragging = false; root.classList.remove('is-dragging'); setTimeout(function () { moved = false; }, 0); });
  window.addEventListener('pointercancel', function () { dragging = false; root.classList.remove('is-dragging'); });

  /* console tilt follows the pointer */
  root.addEventListener('pointerenter', function () { hover = true; });
  root.addEventListener('pointerleave', function () { hover = false; core.style.setProperty('--rx', '0deg'); core.style.setProperty('--ry', '0deg'); });
  root.addEventListener('pointermove', function (e) {
    if (reduce || flat() || dragging) return;
    var r = root.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    core.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg'); core.style.setProperty('--rx', (-py * 8).toFixed(2) + 'deg');
  });

  /* keyboard: arrows move the selection around the ring */
  root.addEventListener('keydown', function (e) {
    var n = e.target.closest('.bt-node'); if (!n || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    var i = nodes.indexOf(n) + (e.key === 'ArrowRight' ? 1 : -1), next = nodes[(i + nodes.length) % nodes.length];
    next.focus(); select(next.getAttribute('data-form'), 'ring'); e.preventDefault();
  });

  /* post sample invoices: each one is posted and locked in Odoo (the counter). The packets rise from the console and fade
     before they reach the EIS node, which never lights up: there is no EIS connection in Odoo, so nothing is sent. */
  var count = 0, fire = $('[data-bt-fire]');
  if (fire) fire.addEventListener('click', function () {
    var target = nodeOf('eis'); if (!target) return;
    var burst = 3;
    for (var k = 0; k < burst; k++) (function (k) {
      setTimeout(function () {
        count++; if (sent) sent.textContent = count + ' posted · locked in Odoo';
        if (reduce || flat()) return;
        var p = pos.eis; if (!p) return;
        var pk = document.createElement('i'); pk.className = 'bt-pk'; root.appendChild(pk);
        var mx = (W / 2 + p[0]) / 2, my = Math.min(H / 2, p[1]) - 50;   // stop at the top of the arc, short of the EIS node
        var a = pk.animate([{ transform: 'translate(' + W / 2 + 'px,' + H / 2 + 'px) scale(.6)', opacity: 0 },
                            { transform: 'translate(' + ((W / 2 + mx) / 2) + 'px,' + ((H / 2 + my) / 2) + 'px) scale(1)', opacity: 1, offset: .5 },
                            { transform: 'translate(' + mx + 'px,' + my + 'px) scale(.7)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)' });
        a.onfinish = function () { pk.remove(); };
      }, k * 220);
    })(k);
  });

  /* lifecycle: only while this slide is the active one, on screen and visible */
  function check() { var was = active; active = !!(slide && slide.classList.contains('is-active')); if (active && !was) { measure(); layout(); } wake(); }
  if (slide && 'MutationObserver' in window) new MutationObserver(check).observe(slide, { attributes: true, attributeFilter: ['class'] });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; wake(); }).observe(root);
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('resize', function () { measure(); layout(); });
  if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); layout(); }).observe(root);

  select('2307');
  measure(); layout(); check();
})();
