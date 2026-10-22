/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Privacy and Terms: builds the "On this page" list from the h2s (ids are added where missing) and marks the section being read.
   Without JS the policy is the same text on one sheet. */
(function () {
  'use strict';
  var wrap = document.querySelector('[data-lg-wrap]'), toc = document.querySelector('[data-lg-toc]'), prose = document.querySelector('[data-lg-prose]');
  if (!wrap || !toc || !prose) return;
  var heads = [].slice.call(prose.querySelectorAll('h2'));
  if (heads.length < 3) return;
  var used = {};
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'; }
  heads.forEach(function (h) {
    if (!h.id) { var id = slug(h.textContent), n = id, k = 2; while (used[n] || document.getElementById(n)) n = id + '-' + k++; h.id = n; }
    used[h.id] = 1;
  });
  toc.innerHTML = '<p class="lg-toc-h">On this page</p><ol>' + heads.map(function (h) {
    return '<li><a href="#' + h.id + '">' + h.textContent.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }) + '</a></li>';
  }).join('') + '</ol>';
  wrap.classList.add('has-toc');
  var links = [].slice.call(toc.querySelectorAll('a'));
  function mark(id) { links.forEach(function (a) { if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); }
  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      for (var i = 0; i < heads.length; i++) if (seen[heads[i].id]) { mark(heads[i].id); return; }
    }, { rootMargin: '-90px 0px -60% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }
})();
