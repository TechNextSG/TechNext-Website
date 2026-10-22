/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Team Directory: a vCard (.vcf) and an Email button on every profile card, a search over the profiles, the profile
   count (count-up) and live local time for the three offices. The cards themselves come from _src/team.py (build.py).
   Loops pause off-screen; reduced motion shows the final numbers. Without JS the cards still show name, role and email. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ORG = 'TechNext Pte. Ltd.', WEB = 'https://technext.asia/', HQ = ';;261 Waterloo Street #03-36;Singapore;;180261;Singapore';
  var ICON = {
    mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
    vcf: 'M12 4v11m0 0-4-4m4 4 4-4M5 19h14'
  };
  function ic(k) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[k] + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function vEsc(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1'); }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function vcard(p) {
    var parts = p.name.trim().split(/\s+/), last = parts.length > 1 ? parts.pop() : '', first = parts.join(' ');
    return ['BEGIN:VCARD', 'VERSION:3.0', 'N:' + vEsc(last) + ';' + vEsc(first) + ';;;', 'FN:' + vEsc(p.name), 'ORG:' + vEsc(ORG), p.role ? 'TITLE:' + vEsc(p.role) : '',
      p.email ? 'EMAIL;TYPE=INTERNET,WORK:' + p.email : '', 'URL:' + WEB, 'ADR;TYPE=WORK:' + HQ, 'END:VCARD'].filter(Boolean).join('\r\n') + '\r\n';
  }

  /* ---------------------------------------------------------------- profile cards */
  var wrap = document.querySelector('[data-eh-people]');
  var cards = wrap ? [].slice.call(wrap.querySelectorAll('.th-person')) : [];
  var people = cards.map(function (el) {
    var h = el.querySelector('h3'), role = el.querySelector('.th-role'), mail = el.querySelector('.th-mail');
    return { el: el, name: h ? h.textContent.trim() : '', role: role ? role.textContent.trim() : '', email: mail ? mail.textContent.trim() : '' };
  }).filter(function (p) { return p.name; });

  people.forEach(function (p, i) {
    var foot = p.el.querySelector('.ef-foot');
    if (!foot) { foot = document.createElement('p'); foot.className = 'ef-foot'; p.el.appendChild(foot); }
    foot.innerHTML = (p.email ? '<a class="eh-act2 eh-act2--main" href="mailto:' + esc(p.email) + '">' + ic('mail') + 'Email ' + esc(p.name.split(/\s+/)[0]) + '</a>' : '') +
      '<button type="button" class="eh-act2" data-eh-vcf="' + i + '">' + ic('vcf') + 'Save contact (.vcf)</button>';
    p.hay = (p.name + ' ' + p.role + ' ' + p.email + ' ' + (p.el.getAttribute('data-skills') || '')).toLowerCase();   // skills too
  });
  if (wrap) wrap.addEventListener('click', function (e) {
    var b = e.target.closest('[data-eh-vcf]');
    if (!b) return;
    var p = people[+b.getAttribute('data-eh-vcf')];
    var blob = new Blob([vcard(p)], { type: 'text/vcard;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = slug(p.name) + '-technext.vcf'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  });

  /* ---------------------------------------------------------------- search */
  var input = document.querySelector('[data-eh-search]'), none = document.querySelector('[data-eh-none]');
  if (input) input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase(), shown = 0;
    people.forEach(function (p) { var on = !q || p.hay.indexOf(q) > -1; p.el.hidden = !on; if (on) shown += 1; });
    if (none) none.hidden = shown > 0 || !people.length;
  });

  /* ---------------------------------------------------------------- count-up */
  var cnt = document.querySelector('[data-eh-count]'), lab = document.querySelector('[data-eh-count-l]');
  if (cnt) {
    var to = people.length;
    if (lab) lab.textContent = to === 1 ? 'profile' : 'profiles';
    if (reduce || !('IntersectionObserver' in window)) cnt.textContent = to;
    else {
      var started = false;
      new IntersectionObserver(function (es, o) {
        es.forEach(function (e) {
          if (!e.isIntersecting || started) return;
          started = true; o.disconnect();
          var t0 = null;
          (function step(t) {
            if (t0 === null) t0 = t;
            var p = Math.min(1, (t - t0) / 1000);
            cnt.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
          })(performance.now());
        });
      }, { threshold: .6 }).observe(cnt);
    }
  }

  /* ---------------------------------------------------------------- live office time */
  var fmts = {};
  function fmt(tz) {
    if (!(tz in fmts)) { try { fmts[tz] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); } catch (e) { fmts[tz] = null; } }
    return fmts[tz];
  }
  var clocks = [].slice.call(document.querySelectorAll('time[data-tz]'));
  function tick() { var now = new Date(); clocks.forEach(function (el) { var f = fmt(el.getAttribute('data-tz')); if (f) el.textContent = f.format(now); }); }
  tick();
  var timer = setInterval(tick, 1000);
  var panel = document.querySelector('[data-eh-panel]');
  if (panel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        panel.classList.toggle('fx-off', !e.isIntersecting);
        clearInterval(timer);
        if (e.isIntersecting) { tick(); timer = setInterval(tick, 1000); }
      });
    }).observe(panel);
  }
})();
