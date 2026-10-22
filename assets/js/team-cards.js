/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Team cards (22 Oct 2026): the light and a gentle tilt follow the cursor across each card (fine pointers only); a click on a
   card, its name or its "Quick view" pill opens the quick view, a slide-in panel (bottom sheet on phones) filled from the
   card's own <template>, with previous / next through the team (buttons, arrow keys) and Esc / backdrop to close; focus
   returns to the card. Real links and buttons on the card keep their own job. Reduced motion: no tilt, the panel fades.
   Without this script the name links to the profile page. */
(function () {
  'use strict';
  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var reduce = mq('(prefers-reduced-motion: reduce)');
  var fine = mq('(hover: hover) and (pointer: fine)');
  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var cards = [].slice.call(document.querySelectorAll('[data-tm-card]'));
  if (!cards.length) return;

  /* ---------------------------------------------------------------- light + tilt */
  cards.forEach(function (card) {
    var face = card.querySelector('.tm-face'), raf = 0, px = 0, py = 0;
    if (!face) return;
    function paint() {
      raf = 0;
      var r = face.getBoundingClientRect(), x = (px - r.left) / r.width, y = (py - r.top) / r.height;
      face.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      face.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      if (fine && !reduce) {
        face.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg');
        face.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg');
      }
    }
    face.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      px = e.clientX; py = e.clientY; face.classList.add('is-live');
      if (!raf) raf = requestAnimationFrame(paint);
    });
    face.addEventListener('pointerleave', function () {
      face.classList.remove('is-live');
      face.style.setProperty('--rx', '0deg'); face.style.setProperty('--ry', '0deg');
    });
  });

  /* ---------------------------------------------------------------- quick view */
  var people = cards.filter(function (c) { return c.querySelector('template.tm-qv-src'); });
  if (!people.length || typeof window.HTMLDialogElement === 'undefined') return;
  var SVG = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var ARROW = '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', CROSS = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  var dlg, panel, body, foot, count, cur = -1, opener = null, busy = false, list = people;   // list: the people the directory search shows
  var phone = function () { return mq('(max-width: 600px)'); };

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'tm-qv';
    dlg.setAttribute('aria-labelledby', 'tm-qv-title');
    dlg.innerHTML = '<div class="tm-qv-panel">' +
      '<div class="tm-qv-bar"><button type="button" class="tm-qv-prev" aria-label="Previous person">' + SVG(ARROW) + '</button>' +
      '<button type="button" class="tm-qv-next" aria-label="Next person">' + SVG(ARROW) + '</button>' +
      '<span class="tm-qv-count" aria-live="polite"></span>' +
      '<button type="button" class="tm-qv-close" aria-label="Close">' + SVG(CROSS) + '</button></div>' +
      '<div class="tm-qv-body" tabindex="-1"></div><div class="tm-qv-foot"></div></div>';
    document.body.appendChild(dlg);
    panel = dlg.querySelector('.tm-qv-panel'); body = dlg.querySelector('.tm-qv-body');
    foot = dlg.querySelector('.tm-qv-foot'); count = dlg.querySelector('.tm-qv-count');
    dlg.querySelector('.tm-qv-close').addEventListener('click', close);
    dlg.querySelector('.tm-qv-prev').addEventListener('click', function () { step(-1); });
    dlg.querySelector('.tm-qv-next').addEventListener('click', function () { step(1); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });          // Esc
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });         // the backdrop
    dlg.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    });
  }

  function fill(i) {
    var src = list[i].querySelector('template.tm-qv-src').content.cloneNode(true);
    var main = src.querySelector('.tm-qv-main'), act = src.querySelector('.tm-qv-act');
    body.replaceChildren(main); foot.replaceChildren(act || document.createTextNode(''));
    var h = body.querySelector('h2'); if (h) h.id = 'tm-qv-title';
    count.innerHTML = '';                                                                     // "Astroneil Matan, 2 of 6" for screen readers
    var who = document.createElement('span'); who.className = 'sr-only'; who.textContent = (h ? h.textContent : '') + ', ';
    count.appendChild(who); count.appendChild(document.createTextNode((i + 1) + ' of ' + list.length));
    body.scrollTop = 0; cur = i;
    var vcf = foot.querySelector('[data-qv-vcf]');                                          // the directory card's own vCard button
    if (vcf) {
      var real = list[i].querySelector('[data-eh-vcf]');
      if (real) vcf.addEventListener('click', function () { real.click(); }); else vcf.remove();
    }
    if (!reduce) [].slice.call(main.children).forEach(function (el, k) {
      el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
                 { duration: 520, delay: 60 + Math.min(k, 6) * 45, easing: EASE, fill: 'backwards' });
    });
  }

  function open(card, from) {
    if (!dlg) build();
    list = people.filter(function (c) { return !c.hidden; });
    if (list.indexOf(card) < 0) list = [card];
    var solo = list.length < 2;
    dlg.querySelector('.tm-qv-prev').hidden = solo; dlg.querySelector('.tm-qv-next').hidden = solo;
    opener = from || null;
    fill(list.indexOf(card));
    document.documentElement.classList.add('tm-lock');
    dlg.showModal();
    body.focus({ preventScroll: true });
    var off = phone() ? 'translateY(100%)' : 'translateX(calc(100% + 24px))';
    panel.animate(reduce ? [{ opacity: 0 }, { opacity: 1 }] : [{ transform: off }, { transform: 'none' }],
                  { duration: reduce ? 200 : 560, easing: EASE });
  }

  function close() {
    if (!dlg || !dlg.open || busy) return;
    busy = true;
    var off = phone() ? 'translateY(100%)' : 'translateX(calc(100% + 24px))';
    var a = panel.animate(reduce ? [{ opacity: 1 }, { opacity: 0 }] : [{ transform: 'none' }, { transform: off }],
                          { duration: reduce ? 150 : 300, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    a.onfinish = function () {
      dlg.close(); a.cancel(); busy = false;
      document.documentElement.classList.remove('tm-lock');
      if (opener && opener.focus) opener.focus();                                            // a card reached by stepping scrolls into view
    };
  }

  function step(d) {
    if (busy || list.length < 2) return;
    var n = (cur + d + list.length) % list.length;
    if (reduce) { fill(n); return; }
    busy = true;
    var out = body.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(' + (d > 0 ? -24 : 24) + 'px)' }],
                           { duration: 160, easing: 'ease-in', fill: 'forwards' });
    out.onfinish = function () { fill(n); out.cancel(); busy = false; opener = list[n].querySelector('[data-tm-open]') || opener; };
  }

  people.forEach(function (card) {
    var face = card.querySelector('.tm-face');
    var name = card.querySelector('.tm-name a'); if (name) name.setAttribute('aria-haspopup', 'dialog');
    face.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;        // new-tab clicks open the profile page
      var t = e.target.closest('a, button, input, label');
      if (t && !t.hasAttribute('data-tm-open')) return;                                     // email, vCard, full profile keep their job
      e.preventDefault();
      open(card, t || name || face);
    });
  });
})();
