/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This design and code are not licensed for copying, reuse or AI training. */
/* /get-started: the "leaving already?" pop-up. Browsers only allow their own plain "Leave site?" box when a tab closes,
   so this one opens on the moments a page can see: the mouse heading for the tab bar (desktop), a click on a link that
   leaves the page, and a quick scroll back up on a phone. Once per visit, never after the form was sent. The message is
   picked at random and uses the visitor's first name if they already typed it into the form. */
(function () {
  var box = document.getElementById('gs-exit');
  if (!box) return;
  var form = document.getElementById('gs-form');
  var KEY = 'tn_gs_exit';
  var shown = false, pending = null, lastFocus = null, readyAt = Date.now() + 4000;
  try { shown = sessionStorage.getItem(KEY) === '1'; } catch (e) { /* storage blocked: once per page view */ }

  var hour = new Date().getHours();
  var later = hour >= 18 || hour < 5 ? 'tomorrow' : 'later today';
  // {n} = ", Maria" when the visitor typed a name, "" otherwise
  var MSGS = [
    ['Leaving already{n}?', 'No pressure. If you have a quick question, just message us. Someone from our team will reply.'],
    ['Before you go{n}…', 'Got a minute? Tell us what slows your business down and we\'ll point you the right way.'],
    ['Wait, one quick thing{n}', 'Most people just want to ask a question first. Message us, or pick a time that suits you.'],
    ['Not ready for a form{n}?', 'That\'s fine. Send us a quick message, or book a short call when it suits you.'],
    ['Still deciding{n}?', 'Happy to help you figure it out. Chat with us now, or set a time to talk ' + later + '.'],
    ['Heading out{n}?', 'We\'d love to hear what you\'re working on. Drop us a message or set a time to talk.'],
    ['Quick question before you go{n}?', 'Ask us anything about Odoo, AI or your website. We reply on WhatsApp.'],
    ['Thanks for stopping by{n}', 'If now isn\'t a good time, book a call for ' + later + '. Or message us and we\'ll reply when you\'re free.']
  ];
  var pickLast = -1;
  try { pickLast = parseInt(sessionStorage.getItem(KEY + '_m'), 10); } catch (e) { /* first visit */ }

  function firstName() {
    var f = form && form.querySelector('[name=name]');
    var v = f ? f.value.trim().split(/\s+/)[0] : '';
    return v && v.length <= 20 && /^[\p{L}'-]+$/u.test(v) ? v.charAt(0).toUpperCase() + v.slice(1) : '';
  }
  function fill() {
    var i;
    do { i = Math.floor(Math.random() * MSGS.length); } while (i === pickLast && MSGS.length > 1);
    try { sessionStorage.setItem(KEY + '_m', String(i)); } catch (e) { /* fine */ }
    var n = firstName();
    box.querySelector('#gs-exit-h').textContent = MSGS[i][0].replace('{n}', n ? ', ' + n : '');
    box.querySelector('#gs-exit-p').textContent = MSGS[i][1];
  }
  function track(name) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, { page: 'get-started' }); } catch (e) { /* never block */ }
  }

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function open(href) {
    if (shown || (form && form.classList.contains('is-sent')) || Date.now() < readyAt) return false;
    shown = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* fine */ }
    pending = href || null;
    var leave = box.querySelector('[data-exit-leave]');
    leave.hidden = !pending;
    if (pending) leave.setAttribute('href', pending);
    fill();
    lastFocus = document.activeElement;
    box.hidden = false;
    box.classList.toggle('is-typing', !reduce);
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    if (!reduce) setTimeout(function () { box.classList.remove('is-typing'); }, 900);
    document.body.style.overflow = 'hidden';
    var first = box.querySelector('[data-exit-go]');
    if (first) first.focus({ preventScroll: true });
    track('exit_popup_shown');
    return true;
  }
  function close() {
    if (box.hidden) return;
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { box.hidden = true; }, reduce ? 0 : 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  box.addEventListener('click', function (e) {
    if (e.target.closest('[data-exit-close]')) { close(); return; }
    var go = e.target.closest('[data-exit-go]');
    if (go) { track('exit_popup_' + go.getAttribute('data-exit-go')); setTimeout(close, 150); }
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {   // keep focus inside the pop-up
      var f = [].filter.call(box.querySelectorAll('a[href], button'), function (el) { return !el.hidden && el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // footer links are plain text on this page
  [].forEach.call(document.querySelectorAll('.footer nav a'), function (a) { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); });

  // "Fill out the form": scroll up to it, put the cursor in the first field and flash the card once
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-to-form]');
    if (!t || !form) return;
    e.preventDefault();
    form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () {
      var f = form.querySelector('#gs-name'); if (f) f.focus({ preventScroll: true });
      form.classList.remove('is-flash'); void form.offsetWidth; form.classList.add('is-flash');
    }, reduce ? 0 : 600);
  });

  // 1. desktop: the pointer leaves through the top edge (towards the tabs, back button or address bar)
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0) open();
  });

  // 2. a click on a link that leaves this page (logo, footer); new-tab, mail, phone and same-page links are not exits
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || box.contains(a) || a.target === '_blank' || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href)) return;
    if (open(a.href)) e.preventDefault();
  });

  // 3. phones: a fast scroll back towards the top after reading at least one screen
  if (matchMedia('(pointer: coarse)').matches) {
    var maxY = 0, lastY = scrollY, lastT = Date.now();
    addEventListener('scroll', function () {
      var y = scrollY, t = Date.now();
      maxY = Math.max(maxY, y);
      var speed = (lastY - y) / Math.max(1, t - lastT);   // px per ms, upwards
      if (maxY > innerHeight && speed > 2.2 && y < maxY * 0.5) open();
      lastY = y; lastT = t;
    }, { passive: true });
  }
})();
