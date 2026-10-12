/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /employee-hub: turns the team list (built from _src/team.py into [data-bc-src]) into TechNext employee ID cards on
   printed lanyards. Front: TechNext logo row, a photo panel (initials until a photo is set in team.py) with a holographic
   seal, name, position, ID No. (the order on the list: 001, 002 …), the office when team.py gives one, and a barcode.
   Back: a magnetic stripe, the work email, the three offices and the property line.
   A tap (or Flip) turns the card over; "Save contact" builds a vCard (.vcf) in the browser; fine pointers tilt the card
   with a light glare. Without JS the plain team list stays visible. The hero scene reads [data-bc-name] / [data-bc-role]. */
(function () {
  'use strict';
  var ORG = 'TechNext Pte. Ltd.', WEB = 'https://technext.asia/', HQ = ';;261 Waterloo Street #03-36;Singapore;;180261;Singapore';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function vEsc(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1'); }
  function vcard(p) {
    var parts = p.name.trim().split(/\s+/), last = parts.length > 1 ? parts.pop() : '', first = parts.join(' ');
    return ['BEGIN:VCARD', 'VERSION:3.0', 'N:' + vEsc(last) + ';' + vEsc(first) + ';;;', 'FN:' + vEsc(p.name), 'ORG:' + vEsc(ORG), p.role ? 'TITLE:' + vEsc(p.role) : '',
      p.email ? 'EMAIL;TYPE=INTERNET,WORK:' + p.email : '', 'URL:' + WEB, 'ADR;TYPE=WORK:' + HQ, 'END:VCARD'].filter(Boolean).join('\r\n') + '\r\n';
  }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  var ICON = { mail: 'M4 6h16v12H4z M4 7l8 6 8-6', vcf: 'M12 4v11m0 0-4-4m4 4 4-4M5 19h14', flip: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4' };
  function ic(k) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + ICON[k] + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function build() {
    var lp = document.querySelector('img[src*="assets/img/logo-plane.png"]'), ROOT = lp ? lp.getAttribute('src').split('assets/img/logo-plane.png')[0] : '';
    var src = document.querySelector('[data-bc-src]'), grid = document.querySelector('[data-bc-grid]'); if (!src || !grid) return;
    var people = [].map.call(src.querySelectorAll('.th-person'), function (el, i) {
      var h = el.querySelector('h3'), role = el.querySelector('.th-role'), mail = el.querySelector('.th-mail'), ini = el.querySelector('.th-ini'), img = el.querySelector('.ef-photo img'), off = el.getAttribute('data-office');
      return { name: h ? h.textContent.trim() : '', role: role ? role.textContent.trim() : '', email: mail ? mail.textContent.trim() : '', ini: ini ? ini.textContent.trim() : '',
        img: img ? img.getAttribute('src') : '', office: off || '', tone: i % 4, no: String(i + 1).padStart(3, '0') };
    }).filter(function (p) { return p.name; });
    if (!people.length) return;
    var OFFICES = [['SG', 'Singapore HQ', '261 Waterloo Street #03-36, Singapore 180261'], ['PH', 'Taguig City', 'Level 9, IP Center, Taguig City, Metro Manila'], ['VN', 'Ho Chi Minh City', '62 Nguyễn Thị Nhung, Phường Hiệp Bình']];
    var STRAP = '<i>' + new Array(9).join('TechNext&nbsp;·&nbsp;') + '</i>';
    grid.innerHTML = people.map(function (p, i) {
      var pic = p.img ? '<img src="' + esc(p.img) + '" alt="" width="240" height="280" loading="lazy">' : '<span>' + esc(p.ini) + '</span>';
      return '<article class="idc" data-bc-name="' + esc(p.name) + '" data-bc-role="' + esc(p.role) + '" style="--i:' + i + '">' +
        '<span class="idc-lanyard" aria-hidden="true"><span class="idc-strap idc-strap--l">' + STRAP + '</span><span class="idc-strap idc-strap--r">' + STRAP + '</span><span class="idc-clip"><i></i></span></span>' +
        '<div class="idc-tilt"><div class="idc-card">' +
          '<div class="idc-face idc-front">' +
            '<span class="idc-slot" aria-hidden="true"></span>' +
            '<span class="idc-head"><img src="' + ROOT + 'assets/img/logo-plane.png" alt="" width="40" height="34"><b>TechNext</b><small>Employee ID</small></span>' +
            '<span class="idc-panel th-tone-' + p.tone + '"><span class="idc-photo">' + pic + '</span><span class="idc-holo" aria-hidden="true"></span></span>' +
            '<h3>' + esc(p.name) + '</h3><span class="idc-role">' + esc(p.role) + '</span>' +
            '<dl class="idc-meta"><div><dt>ID No.</dt><dd>' + p.no + '</dd></div>' + (p.office ? '<div><dt>Office</dt><dd>' + esc(p.office) + '</dd></div>' : '<div><dt>Company</dt><dd>TechNext Pte. Ltd.</dd></div>') + '</dl>' +
            '<span class="idc-code" aria-hidden="true"><i></i><b>TN-' + p.no + '</b></span>' +
          '</div>' +
          '<div class="idc-face idc-back" aria-hidden="true">' +
            '<span class="idc-slot"></span><span class="idc-stripe"></span>' +
            '<p class="idc-k">Work email</p><p class="idc-mail">' + esc(p.email) + '</p>' +
            '<p class="idc-k">Our offices</p><ul class="idc-offices">' + OFFICES.map(function (o) { return '<li><span>' + o[0] + '</span><b>' + o[1] + '</b><small>' + o[2] + '</small></li>'; }).join('') + '</ul>' +
            '<p class="idc-prop"><img src="' + ROOT + 'assets/img/logo-plane.png" alt="" width="20" height="17">This card is property of TechNext Pte. Ltd.</p>' +
          '</div>' +
        '</div><span class="idc-glare" aria-hidden="true"></span></div>' +
        '<p class="idc-actions">' + (p.email ? '<a class="idc-btn" href="mailto:' + esc(p.email) + '">' + ic('mail') + '<span>Email</span></a>' : '') +
        '<button type="button" class="idc-btn idc-btn--v" data-bc-vcf="' + i + '" title="Download a vCard (.vcf)">' + ic('vcf') + '<span>Save contact</span></button>' +
        '<button type="button" class="idc-btn idc-btn--f" data-bc-flip aria-pressed="false" aria-label="Flip the ID card of ' + esc(p.name) + '">' + ic('flip') + '<span>Flip</span></button></p>' +
        '</article>';
    }).join('');
    src.hidden = true; document.documentElement.classList.add('bc-on');
    var cnt = document.querySelector('[data-bc-count]'); if (cnt) cnt.textContent = people.length + (people.length === 1 ? ' ID card · one per person' : ' ID cards · one per person');
    function flip(card, on) { on = on == null ? !card.classList.contains('is-flipped') : on; card.classList.toggle('is-flipped', on);
      var art = card.closest('.idc'), fb = art.querySelector('[data-bc-flip]'); if (fb) fb.setAttribute('aria-pressed', on ? 'true' : 'false');
      card.querySelector('.idc-front').setAttribute('aria-hidden', on ? 'true' : 'false'); card.querySelector('.idc-back').setAttribute('aria-hidden', on ? 'false' : 'true'); }
    [].forEach.call(grid.querySelectorAll('.idc'), function (art) {
      var card = art.querySelector('.idc-card');
      card.addEventListener('click', function (e) { if (e.target.closest('a')) return; flip(card); });
      art.querySelector('[data-bc-flip]').addEventListener('click', function () { flip(card); });
      art.querySelector('[data-bc-vcf]').addEventListener('click', function () {
        var p = people[+this.getAttribute('data-bc-vcf')], blob = new Blob([vcard(p)], { type: 'text/vcard;charset=utf-8' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = slug(p.name) + '-technext.vcf'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      });
    });
    if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
      [].forEach.call(grid.querySelectorAll('.idc-tilt'), function (t) {
        t.addEventListener('pointermove', function (e) { var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          t.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg'); t.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg');
          t.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); t.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); t.classList.add('is-tilt'); });
        t.addEventListener('pointerleave', function () { t.classList.remove('is-tilt'); t.style.removeProperty('--rx'); t.style.removeProperty('--ry'); });
      });
    }
    var all = document.querySelector('[data-bc-flipall]');
    if (all) all.addEventListener('click', function () { var on = all.getAttribute('aria-pressed') !== 'true'; all.setAttribute('aria-pressed', on ? 'true' : 'false'); all.querySelector('span').textContent = on ? 'Show the fronts' : 'Flip all IDs';
      [].forEach.call(grid.querySelectorAll('.idc-card'), function (c, i) { setTimeout(function () { flip(c, on); }, i * 110); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
