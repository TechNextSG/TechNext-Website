/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This design and code are not licensed for copying, reuse or AI training. */
/* /get-started: the "leaving already?" pop-up, a random human message with "Message us now" and "Set a schedule".
   It opens when the visitor tries to leave:
   - closing the tab or window, reloading, the back button or a typed address: browsers only allow their own plain
     "Leave site?" box there (and only once the visitor has clicked or typed on the page). If the visitor stays, the
     pop-up follows at once with a "glad you stayed" message. Once per page view.
   - a click on a link that leaves the page: the pop-up every time, with "Leave anyway" to continue.
   - early warnings, once per visit: the mouse heading for the tab bar (desktop), a fast scroll back up (phones).
   Never after the form was sent. The message uses the visitor's first name if they already typed it into the form. */
(function () {
  var box = document.getElementById('gs-exit');
  if (!box) return;
  var form = document.getElementById('gs-form');
  var KEY = 'tn_gs_exit';
  var shown = false, pending = null, lastFocus = null, readyAt = Date.now() + 4000, leaving = false, asked = false;
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
  // after the browser's own "Leave site?" box, when the visitor chose to stay
  var STAY = [
    ['Glad you stayed{n}!', 'Anything we can help with? Message us now, or set a time that suits you.'],
    ['Thanks for sticking around{n}', 'Not sure where to start? Send us a quick message. Someone from our team will reply.'],
    ['Oh good, you\'re still here{n}', 'If you have a question, just ask. Or pick a time to talk ' + later + '.'],
    ['Happy to see you stay{n}', 'Tell us what you\'re working on. A quick message is enough to get started.']
  ];
  var pickLast = -1;
  try { pickLast = parseInt(sessionStorage.getItem(KEY + '_m'), 10); } catch (e) { /* first visit */ }

  function firstName() {
    var f = form && form.querySelector('[name=name]');
    var v = f ? f.value.trim().split(/\s+/)[0] : '';
    return v && v.length <= 20 && /^[\p{L}'-]+$/u.test(v) ? v.charAt(0).toUpperCase() + v.slice(1) : '';
  }
  function fill(list) {
    var i;
    do { i = Math.floor(Math.random() * list.length); } while (list === MSGS && i === pickLast && list.length > 1);
    if (list === MSGS) { pickLast = i; try { sessionStorage.setItem(KEY + '_m', String(i)); } catch (e) { /* fine */ } }
    var n = firstName();
    box.querySelector('#gs-exit-h').textContent = list[i][0].replace('{n}', n ? ', ' + n : '');
    box.querySelector('#gs-exit-p').textContent = list[i][1];
  }
  function track(name) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, { page: 'get-started' }); } catch (e) { /* never block */ }
  }

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // how: 'early' (mouse / scroll: once per visit, not in the first 4 s), 'link' (every time), 'stay' (after "Leave site?")
  function open(how, href) {
    if (form && form.classList.contains('is-sent')) return false;
    if (!box.hidden) return how === 'link';
    if (how === 'early' && (shown || Date.now() < readyAt)) return false;
    shown = true;
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* fine */ }
    pending = href || null;
    var leave = box.querySelector('[data-exit-leave]');
    leave.hidden = !pending;
    fill(how === 'stay' ? STAY : MSGS);
    lastFocus = document.activeElement;
    box.hidden = false;
    box.classList.toggle('is-typing', !reduce);
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    if (!reduce) setTimeout(function () { box.classList.remove('is-typing'); }, 900);
    document.body.style.overflow = 'hidden';
    var first = box.querySelector('[data-exit-go]');
    if (first) first.focus({ preventScroll: true });
    track('exit_popup_' + how);
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
    if (e.target.closest('[data-exit-leave]') && pending) { leaving = true; location.href = pending; return; }
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
    if (!e.relatedTarget && e.clientY <= 0) open('early');
  });

  // 2. a click on a link that leaves this page (logo, footer); new-tab, mail, phone and same-page links are not exits
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || box.contains(a) || a.target === '_blank' || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href)) return;
    if (open('link', a.href)) e.preventDefault();
  });

  // 4. closing the tab or window, reloading, back button, typed address: the browser's "Leave site?" box, then the
  //    pop-up if the visitor stays. Timers do not run while that box is open, so a callback that fires late means the
  //    box was shown and the visitor chose to stay; a callback on time means no box (the page is simply leaving).
  addEventListener('beforeunload', function (e) {
    if (leaving || asked || (form && form.classList.contains('is-sent'))) return;
    e.preventDefault();
    e.returnValue = '';
    var t0 = Date.now();
    setTimeout(function () {
      if (Date.now() - t0 < 300 || document.visibilityState !== 'visible') return;
      asked = true;
      open('stay');
    }, 30);
  });

  // 3. phones: a fast scroll back towards the top after reading at least one screen
  if (matchMedia('(pointer: coarse)').matches) {
    var maxY = 0, lastY = scrollY, lastT = Date.now();
    addEventListener('scroll', function () {
      var y = scrollY, t = Date.now();
      maxY = Math.max(maxY, y);
      var speed = (lastY - y) / Math.max(1, t - lastT);   // px per ms, upwards
      if (maxY > innerHeight && speed > 2.2 && y < maxY * 0.5) open('early');
      lastY = y; lastT = t;
    }, { passive: true });
  }
})();
