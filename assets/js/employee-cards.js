/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /employee-hub: turns the team list (built from _src/team.py into [data-bc-src]) into TechNext business cards: a front
   (logo, TechNext ID with photo or initials, name, position, work email) and a back (contact code space, the three
   offices, the website), a flip on tap/Enter, and a vCard (.vcf) made in the browser from the card's own data.
   Without JS the plain team list stays visible. The hero scene reads [data-bc-name] / [data-bc-role] for its cards. */
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
  var QR = (function () { var o = ''; for (var i = 0; i < 49; i++) { var r = Math.floor(i / 7), c = i % 7, fin = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2); o += '<i' + (fin || ((i * 37 + 11) % 5 < 2) ? ' class="on"' : '') + '></i>'; } return o; })();
  function build() {
    var src = document.querySelector('[data-bc-src]'), grid = document.querySelector('[data-bc-grid]'); if (!src || !grid) return;
    var people = [].map.call(src.querySelectorAll('.th-person'), function (el, i) {
      var h = el.querySelector('h3'), role = el.querySelector('.th-role'), mail = el.querySelector('.th-mail'), ini = el.querySelector('.th-ini'), img = el.querySelector('.ef-photo img');
      return { name: h ? h.textContent.trim() : '', role: role ? role.textContent.trim() : '', email: mail ? mail.textContent.trim() : '', ini: ini ? ini.textContent.trim() : '', img: img ? img.getAttribute('src') : '', tone: i % 4 };
    }).filter(function (p) { return p.name; });
    if (!people.length) return;
    var plane = (document.querySelector('.ef-head .th-plane') || {}).getAttribute ? document.querySelector('.ef-head .th-plane').getAttribute('src') : '';
    grid.innerHTML = people.map(function (p, i) {
      var pic = p.img ? '<img src="' + esc(p.img) + '" alt="" width="120" height="120" loading="lazy">' : '<span>' + esc(p.ini) + '</span>';
      return '<article class="bc reveal is-in" data-bc-name="' + esc(p.name) + '" data-bc-role="' + esc(p.role) + '" style="--i:' + i + '">' +
        '<div class="bc-card">' +
          '<div class="bc-face bc-front th-tone-' + p.tone + '">' +
            '<span class="bc-logo">' + (plane ? '<img src="' + esc(plane) + '" alt="" width="40" height="34">' : '') + '<span>TechNext<small>Odoo Ready Partner</small></span></span>' +
            '<span class="bc-id" aria-hidden="true"><span class="bc-clip"></span><span class="bc-ava">' + pic + '</span><b>TechNext ID</b><small>No. ' + String(i + 1).padStart(3, '0') + '</small></span>' +
            '<div class="bc-who"><h3>' + esc(p.name) + '</h3><span class="bc-role">' + esc(p.role) + '</span></div>' +
            '<span class="bc-mail">' + (p.email ? esc(p.email) : '') + '</span>' +
            '<span class="bc-stripe" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="bc-face bc-back" aria-hidden="true">' +
            '<span class="bc-qr" title="Contact code: coming soon">' + QR + '</span><span class="bc-qr-note">Contact code<br>coming soon</span>' +
            '<span class="bc-offices"><b>Singapore HQ</b><span>261 Waterloo Street #03-36</span><b>Taguig City</b><span>Level 9, IP Center</span><b>Ho Chi Minh City</b><span>62 Nguyễn Thị Nhung, Hiệp Bình</span></span>' +
            '<span class="bc-web">technext.asia</span>' +
          '</div>' +
        '</div>' +
        '<p class="bc-actions">' + (p.email ? '<a class="bc-btn" href="mailto:' + esc(p.email) + '"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>Email</a>' : '') +
        '<button type="button" class="bc-btn bc-btn--v" data-bc-vcf="' + i + '"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Save contact (.vcf)</button>' +
        '<button type="button" class="bc-btn bc-btn--f" data-bc-flip aria-pressed="false" aria-label="Flip the card of ' + esc(p.name) + '"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Flip</button></p>' +
        '</article>';
    }).join('');
    src.hidden = true; document.documentElement.classList.add('bc-on');
    var cnt = document.querySelector('[data-bc-count]'); if (cnt) cnt.textContent = people.length + (people.length === 1 ? ' card · one per person' : ' cards · one per person');
    function flip(card, on) { on = on == null ? !card.classList.contains('is-flipped') : on; card.classList.toggle('is-flipped', on); var fb = card.parentNode.querySelector('[data-bc-flip]'); if (fb) fb.setAttribute('aria-pressed', on ? 'true' : 'false');
      card.querySelector('.bc-front').setAttribute('aria-hidden', on ? 'true' : 'false'); card.querySelector('.bc-back').setAttribute('aria-hidden', on ? 'false' : 'true'); }
    [].forEach.call(grid.querySelectorAll('.bc'), function (art) {
      var card = art.querySelector('.bc-card');
      card.addEventListener('click', function (e) { if (e.target.closest('a')) return; flip(card); });
      art.querySelector('[data-bc-flip]').addEventListener('click', function () { flip(card); });
      art.querySelector('[data-bc-vcf]').addEventListener('click', function () {
        var p = people[+this.getAttribute('data-bc-vcf')], blob = new Blob([vcard(p)], { type: 'text/vcard;charset=utf-8' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = slug(p.name) + '-technext.vcf'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      });
    });
    var all = document.querySelector('[data-bc-flipall]');
    if (all) all.addEventListener('click', function () { var on = all.getAttribute('aria-pressed') !== 'true'; all.setAttribute('aria-pressed', on ? 'true' : 'false'); all.querySelector('span').textContent = on ? 'Show the fronts' : 'Flip all cards';
      [].forEach.call(grid.querySelectorAll('.bc-card'), function (c, i) { setTimeout(function () { flip(c, on); }, i * 90); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
