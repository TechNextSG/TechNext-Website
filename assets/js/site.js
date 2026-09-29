/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* TechNext Website v2 — shared behaviour: one-time intro, header menus, mobile nav, Let's Talk
   panel, FormSubmit forms, scroll reveals, button ripple + magnetic hover. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- one-time intro (html.intro is set by the inline head script) ---------------- */
  (function intro() {
    var el = $('#intro');
    if (!el) return;
    if (!document.documentElement.classList.contains('intro')) { el.remove(); return; }
    document.body.style.overflow = 'hidden';
    // Plays on every fresh load and every refresh (the head script skips it only for in-site link
    // navigation and back/forward). Old "seen" flags from earlier builds are cleared so they never block it.
    try { localStorage.removeItem('tn_intro_seen'); sessionStorage.removeItem('tn_intro_seen'); } catch (_) {}
    try { document.cookie = 'tn_intro_seen=; max-age=0; path=/'; document.cookie = 'tn_intro_s=; max-age=0; path=/'; } catch (_) {}
    if (/[?&]intro=1(&|$)/.test(location.search) && history.replaceState) {
      var clean = location.search.replace(/([?&])intro=1(&|$)/, function (m, a, b) { return b === '&' ? a : ''; });
      history.replaceState(null, '', location.pathname + clean + location.hash);
    }
    // ~4 s, the beats are in site.css: flight 0.15–1.45 s (same delay, duration and curve as the CSS `introFly`),
    // finish() at 3.35 s, then a 0.7 s iris. Every beat is clocked from the real start, which fires on the next
    // frame or after 120 ms at the latest (requestAnimationFrame can stall in a throttled tab).
    var FLY_AT = 150, FLY_MS = 1300, FLY_EASE = 'cubic-bezier(.5,0,.25,1)', END_AT = 3350, IRIS_MS = 700;
    var NOSE = -30;                                              // the logo plane points 30° above the horizontal
    var lockup = $('.intro-lockup', el), stage = $('.intro-stage', el), ring = $('.intro-ring', el);
    var wrap = $('.intro-plane-wrap', el), plane = $('.intro-plane', el), sub = $('.intro-sub', el);
    var trails = $$('.intro-trail path', el), pills = $$('.intro-pill', el);
    var done = false, started = false, timers = [], anims = [], lastW = window.innerWidth, L = 0;
    sub.textContent = el.dataset.tagline || '';

    /* (f) exit, the iris: the whole overlay gets a round hole that grows from the middle of the logo to the farthest
       corner, so the page shows through it and never through a half-faded logo. The hole is the viewport minus a
       circle as one even-odd polygon; both ends have the same points, so the browser interpolates it. The ring
       rides its edge (same curve and duration) while the lock-up rushes forward into it (CSS). */
    function hole(x, y, r, W, H) {
      var p = ['0 0', W + 'px 0', W + 'px ' + H + 'px', '0 ' + H + 'px', '0 0'];
      for (var i = 0; i <= 48; i++) p.push((x + r * Math.cos(i / 24 * Math.PI)).toFixed(1) + 'px ' + (y + r * Math.sin(i / 24 * Math.PI)).toFixed(1) + 'px');
      return 'polygon(evenodd,' + p.join(',') + ',0 0)';
    }
    function finish() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      var s = stage.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
      var x = s.left + s.width / 2, y = s.top + s.height / 2;
      var R = Math.ceil(Math.sqrt(Math.pow(Math.max(x, W - x), 2) + Math.pow(Math.max(y, H - y), 2))) + 4;
      lockup.style.transformOrigin = '50% ' + (y - lockup.getBoundingClientRect().top).toFixed(1) + 'px';
      el.classList.add('is-out');
      if (el.animate) {
        var o = { duration: IRIS_MS, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'forwards' };
        el.animate([{ clipPath: hole(x, y, 0, W, H) }, { clipPath: hole(x, y, R, W, H) }], o);
        ring.style.cssText = 'left:' + (x - R) + 'px;top:' + (y - R) + 'px;width:' + 2 * R + 'px;height:' + 2 * R + 'px';
        ring.animate([{ opacity: 1, transform: 'scale(0)' }, { opacity: 0.9, offset: 0.6 }, { opacity: 0, transform: 'scale(1)' }], o);
      }
      document.documentElement.classList.remove('intro');
      document.body.style.overflow = '';
      document.dispatchEvent(new CustomEvent('tn:intro-done'));
      setTimeout(function () { el.remove(); }, IRIS_MS + 60);
    }

    // Centre the lock-up once, in pixels: a later viewport-height change (mobile URL bar) then leaves it
    // exactly where the flight path expects it.
    function place() {
      lockup.style.top = '50%'; lockup.style.transform = 'translate(-50%,-50%)';
      var lh = lockup.offsetHeight, H = window.innerHeight;
      lockup.style.top = Math.max(8, Math.round((H - lh) / 2)) + 'px'; lockup.style.transform = 'translateX(-50%)';
    }

    /* (b) the flight: one clockwise loop round the lock-up, spiralling in from the upper left, over the top, round
       the right, back underneath and up into the plane's slot, which sits 15° past the loop's leftmost point (so the
       plane climbs into it). Built in viewport pixels from the stage's box and kept inside the viewport minus the
       plane's own reach, so it never leaves the screen, even at 320 px wide; sampled, joined as a Catmull-Rom
       spline, then expressed relative to the plane's box for offset-path and drawn as the SVG trail. The plane
       flies nose first (offset-rotate); --flare turns it from its heading into the slot to the logo's attitude. */
    function buildPath() {
      wrap.style.offsetPath = 'none';                            // measure the slot, not a point on an old path
      var r = wrap.getBoundingClientRect(), s = stage.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2, m = Math.sqrt(r.width * r.width + r.height * r.height) / 2 + 6;
      var D = 0.26, rx = (Math.min(W - m, s.right + Math.min(110, s.width * 0.16)) - cx) / (1 + Math.cos(D));
      var ry = Math.min(s.width * 0.3 + s.height / 2, (cy - m) / (1 - Math.sin(D)), (H - m - cy) / (1 + Math.sin(D)));
      var ex = cx + rx * Math.cos(D), ey = cy + ry * Math.sin(D), a0 = -2.3, a1 = Math.PI + D, n = 16, q = [];
      var fit = function (x, y) { return [Math.max(m, Math.min(W - m, x)), Math.max(m, Math.min(H - m, y))]; };
      for (var i = -1; i <= n + 1; i++) {                        // one extra sample past each end sets the end tangents
        var u = i / n, a = a0 + (a1 - a0) * u, f = 1 + 0.22 * Math.pow(Math.max(0, 1 - u / 0.45), 2);
        q.push(i === n ? [cx, cy] : fit(ex + rx * f * Math.cos(a), ey + ry * f * Math.sin(a)));
      }
      var P = function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); };
      var d = 'M' + P(q[1]);
      for (var j = 1; j <= n; j++) {
        d += ' C' + P(fit(q[j][0] + (q[j + 1][0] - q[j - 1][0]) / 6, q[j][1] + (q[j + 1][1] - q[j - 1][1]) / 6)) +
          ' ' + P(fit(q[j + 1][0] - (q[j + 2][0] - q[j][0]) / 6, q[j + 1][1] - (q[j + 2][1] - q[j][1]) / 6)) + ' ' + P(q[j + 1]);
      }
      var end = Math.atan2(q[n + 2][1] - q[n][1], q[n + 2][0] - q[n][0]) * 180 / Math.PI;   // heading into the slot
      trails.forEach(function (t) { t.setAttribute('d', d); });
      var local = d.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, function (z, x, y) { return (x - r.left).toFixed(1) + ',' + (y - r.top).toFixed(1); });
      wrap.style.offsetPath = 'path("' + local + '")';
      wrap.style.offsetRotate = 'auto ' + (-NOSE) + 'deg';
      el.style.setProperty('--pw', r.width.toFixed(1) + 'px');        // the plane's size: spark reach, trail weight
      plane.style.setProperty('--flare', (NOSE - end).toFixed(1) + 'deg');
      return trails[0].getTotalLength();
    }
    // the comet trail: three dashes of falling length share one head that rides with the plane, then their tails
    // catch up and vanish into the landed plane
    function trail() {
      var tot = FLY_MS + 320;
      trails.forEach(function (t, k) {
        var s = L * [0.34, 0.2, 0.09][k];
        t.style.strokeDasharray = s.toFixed(1) + 'px ' + (L + s + 10).toFixed(1) + 'px';
        t.style.strokeDashoffset = s.toFixed(1) + 'px';          // hidden before the path's start
        if (t.animate) anims.push(t.animate([
          { strokeDashoffset: s + 'px', easing: FLY_EASE },
          { strokeDashoffset: (s - L) + 'px', offset: FLY_MS / tot, easing: 'cubic-bezier(.3,.6,.35,1)' },
          { strokeDashoffset: -L + 'px' }], { duration: tot, delay: FLY_AT, fill: 'both' }));
      });
    }

    /* (e) each app's burst: from the middle of the logo (behind it) out and down into its place, the outer pills
       bowed outward; an offset-path in the pill's own box */
    function pillPaths() {
      var s = stage.getBoundingClientRect(), ox = s.left + s.width / 2, oy = s.top + s.height / 2;
      pills.forEach(function (p, i) {
        p.style.offsetPath = 'none';
        var b = p.getBoundingClientRect(), w = p.offsetWidth, h = p.offsetHeight, side = i - (pills.length - 1) / 2;
        var sx = ox - (b.left + b.width / 2 - w / 2), sy = oy - (b.top + b.height / 2 - h / 2);   // the unscaled box
        var qx = w / 2 + side * Math.max(36, s.width * 0.2), qy = sy + (h / 2 - sy) * 0.2;
        p.style.offsetPath = 'path("M' + sx.toFixed(1) + ',' + sy.toFixed(1) + ' Q' + qx.toFixed(1) + ',' + qy.toFixed(1) + ' ' + w / 2 + ',' + h / 2 + '")';
      });
    }

    function start() {
      if (started || done) return; started = true;
      el.classList.add('is-go');
      trail();
      timers.push(setTimeout(function () { wrap.style.willChange = 'auto'; }, FLY_AT + FLY_MS + 60));   // landed
      timers.push(setTimeout(finish, END_AT));
    }
    place(); L = buildPath(); pillPaths();
    requestAnimationFrame(start);
    timers.push(setTimeout(start, 120));
    function restart() {
      timers.forEach(clearTimeout); timers = [];
      anims.forEach(function (a) { a.cancel(); }); anims = [];
      el.classList.remove('is-go'); started = false; wrap.style.willChange = '';
      void el.offsetWidth;                       // reflow so every CSS animation restarts from frame 0
      place(); L = buildPath(); pillPaths(); start();
    }
    window.addEventListener('resize', function () {
      var W = window.innerWidth;
      if (!started) { place(); L = buildPath(); pillPaths(); lastW = W; return; }
      // Rotation or a real resize re-runs the sequence on the new layout. Height-only changes (mobile URL
      // bar) are ignored: the lock-up is pinned in pixels, so nothing moves under the plane.
      if (Math.abs(W - lastW) > 100 && !done) { lastW = W; restart(); }
    });
    el.addEventListener('click', finish); // let impatient visitors skip (the Skip button is inside)
    document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter') { finish(); document.removeEventListener('keydown', onKey); } });
  })();

  /* ---------------- header: scrolled state + click-to-open mega menus ---------------- */
  var header = $('[data-header]');
  var megas = $$('.has-mega');

  if ('IntersectionObserver' in window) {
    var mark = document.createElement('div');
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:5px;pointer-events:none';
    document.body.prepend(mark);
    new IntersectionObserver(function (es) { header.classList.toggle('is-scrolled', !es[es.length - 1].isIntersecting); }).observe(mark);
  } else {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 4); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function closeMegas(except) {
    megas.forEach(function (li) {
      if (li === except) return;
      li.classList.remove('is-open');
      $('.nav-link', li).setAttribute('aria-expanded', 'false');
    });
    header.classList.toggle('is-open', !!except);
  }
  megas.forEach(function (li) {
    var btn = $('.nav-link', li);
    btn.addEventListener('click', function () {
      var open = li.classList.contains('is-open');
      closeMegas(open ? null : li);
      li.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-mega')) closeMegas(null);
  });

  /* ---------------- mobile nav ---------------- */
  var mnav = $('#mnav'), mOverlay = $('.mnav-overlay'), mBtn = $('[data-mnav-open]');
  function openMnav() {
    mnav.hidden = false; mOverlay.hidden = false;
    mBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = $('[data-mnav-close]', mnav); if (first) first.focus();
  }
  function closeMnav() {
    if (mnav.hidden) return;
    mnav.hidden = true; mOverlay.hidden = true;
    mBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  mBtn.addEventListener('click', openMnav);
  $$('[data-mnav-close]').forEach(function (el) { el.addEventListener('click', closeMnav); });
  // Tapping a link or an action button inside the drawer closes it (in-page anchors included).
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMnav(); });
  window.tnCloseMnav = closeMnav;

  /* ---------------- Let's Talk panel ---------------- */
  var panel = $('#talk-panel'), tOverlay = $('.talk-overlay');
  var lastFocus = null;
  function openTalk() {
    lastFocus = document.activeElement;
    closeMnav();
    // exit animation on the tab: the plane flies off, then both tabs slide out behind the panel
    var tab = $('.talk-tab');
    if (tab) { tab.classList.add('is-exiting'); setTimeout(function () { tab.classList.remove('is-exiting'); }, 700); }
    document.body.classList.add('talk-open');
    panel.hidden = false; tOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      panel.classList.add('is-open'); tOverlay.classList.add('is-open');
      var f = $('#tf-name'); if (f && fine) f.focus({ preventScroll: true });
    });
  }
  function closeTalk() {
    if (panel.hidden) return;
    panel.classList.remove('is-open'); tOverlay.classList.remove('is-open');
    document.body.classList.remove('talk-open');
    document.body.style.overflow = '';
    var done = function () { panel.hidden = true; tOverlay.hidden = true; panel.removeEventListener('transitionend', done); };
    if (reduce) done(); else { panel.addEventListener('transitionend', done); setTimeout(done, 400); }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.tnOpenTalk = openTalk;
  /* /nexi: Full screen. The stage covers the window at once (body.nx-max), then asks for real full screen on
     top. Some browsers (in-app browsers, embedded webviews) never answer that request, so the cover mode
     must not wait for it. */
  var nxStage = $('[data-nx-stage]'), nxBtn = $('[data-nx-full]');
  if (nxStage && nxBtn) {
    var fsEl = function () { return document.fullscreenElement || document.webkitFullscreenElement; };
    var nxOn = function () { return document.body.classList.contains('nx-max'); };
    var nxSet = function (on) {
      document.body.classList.toggle('nx-max', on);
      nxBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      nxBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
    };
    /* Opened from another page of the site (Ask Nexi, Chat with me -> /nexi#full): leaving full screen goes back
       to that page, where the visitor was. Opened on /nexi itself, leaving just shows the normal /nexi page. */
    var nxFrom = '';
    if (document.documentElement.classList.contains('nx-full-start')) {
      try { var ref = new URL(document.referrer); if (ref.origin === location.origin && ref.pathname !== location.pathname) nxFrom = ref.href; } catch (e) { /* typed in or from another site */ }
    }
    var nxExit = function (back) {
      if (fsEl()) { try { var x = (document.exitFullscreen || document.webkitExitFullscreen).call(document); if (x && x.catch) x.catch(function () {}); } catch (e) { /* already out */ } }
      if (back !== false && nxFrom) {
        var to = nxFrom; nxFrom = '';
        /* history.back() restores the page as it was (scroll position included); a new tab has no history */
        if (history.length > 1) history.back(); else location.href = to;
        return;
      }
      nxFrom = '';
      nxSet(false);
      /* drop #full so a reload shows the normal page */
      if (location.hash === '#full' && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    };
    nxBtn.setAttribute('aria-label', 'Full screen');
    /* "Ask Nexi" and "Chat with me" link to /nexi#full: open straight into full-window mode */
    if (document.documentElement.classList.contains('nx-full-start')) { nxSet(true); document.documentElement.classList.remove('nx-full-start'); }
    nxBtn.addEventListener('click', function () {
      if (nxOn()) { nxExit(); return; }
      nxSet(true);
      var req = nxStage.requestFullscreen || nxStage.webkitRequestFullscreen;
      if (req) { try { var pr = req.call(nxStage); if (pr && pr.catch) pr.catch(function () {}); } catch (e) { /* the cover mode stays */ } }
    });
    /* leaving real full screen with the browser's own Esc also ends the cover mode */
    var nxFs = function () { if (!fsEl() && nxOn()) nxSet(false); };
    document.addEventListener('fullscreenchange', nxFs);
    document.addEventListener('webkitfullscreenchange', nxFs);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nxOn()) nxExit(); });
    window.tnNexiFull = nxExit;
    window.addEventListener('pageshow', function (e) { if (e.persisted && nxOn() && !nxFrom) { nxSet(false); if (location.hash === '#full' && history.replaceState) history.replaceState(null, '', location.pathname + location.search); } });
  }
  /* Nexi on /nexi runs in a same-origin frame and asks for the Let's Talk form from there */
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin || !e.data) return;
    if (e.data.tn === 'nexi-talk') { if (document.body.classList.contains('nx-max') && window.tnNexiFull) window.tnNexiFull(false); openTalk(); }
    if (e.data.tn === 'nexi-esc' && document.body.classList.contains('nx-max') && nxBtn) nxBtn.click();
  });
  $$('[data-talk-open]').forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); openTalk(); }); });
  $$('[data-talk-close]').forEach(function (el) { el.addEventListener('click', closeTalk); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href$="#talk"]');
    if (a) { e.preventDefault(); openTalk(); }
  });
  if (location.hash === '#talk') setTimeout(openTalk, 300);

  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button, [href], input, select, textarea', panel).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMegas(null); closeTalk(); closeMnav(); }
  });

  /* ---------------- forms → FormSubmit (AJAX) ---------------- */
  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === '_honey') return;
      data[k] = data[k] ? data[k] + ', ' + v : v;
    });
    return data;
  }
  window.tnPostForm = function (endpoint, payload) {
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        var ok = res.ok && (res.j.success === 'true' || res.j.success === true);
        if (!ok) throw new Error((res.j && res.j.message) || 'The form service did not accept the message.');
        // Lead conversions fire only on a submission the form service accepted. The
        // previous site fired the Ads conversion on every contact-page view.
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', { send_to: 'AW-18068724830/dBpuCLul3bQcEN6466dD' });
            window.gtag('event', 'generate_lead', { form: payload && payload.source ? String(payload.source).slice(0, 60) : 'website' });
          }
        } catch (e) { /* analytics must never break a submission */ }
        return res.j;
      });
  };
  $$('form[data-endpoint]').forEach(function (form) {
    var status = $('.form-status', form);
    var btn = $('button[type=submit]', form);
    if (!$('.form-sent', form)) {
      var sent = document.createElement('div');
      sent.className = 'form-sent';
      sent.innerHTML = '<h3>Thanks — we have it.</h3><p>Your message is on its way to sales@technext.asia. We reply from that address.</p>';
      form.appendChild(sent);
    }
    // time trap: a person needs a few seconds between first touching the form and sending it;
    // scripts post instantly (or never focus a field). They see the normal thank-you, nothing is sent.
    var startedAt = 0;
    form.addEventListener('focusin', function () { if (!startedAt) startedAt = Date.now(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('input[name=_honey]', form) && $('input[name=_honey]', form).value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (!startedAt || Date.now() - startedAt < 3000) { form.classList.add('is-sent'); return; }
      if (form.dataset.beforeSend) { try { window[form.dataset.beforeSend](form); } catch (_) {} }
      var payload = serialize(form);
      btn.classList.add('is-busy'); btn.disabled = true;
      status.className = 'form-status'; status.textContent = 'Sending…';
      window.tnPostForm(form.dataset.endpoint, payload)
        .then(function () {
          form.classList.add('is-sent');
          status.className = 'form-status is-ok'; status.textContent = '';
        })
        .catch(function (err) {
          status.className = 'form-status is-err';
          status.textContent = (err && err.message ? err.message + ' ' : '') + 'You can also email us directly at ';
          var mail = document.createElement('a'); mail.href = 'mailto:sales@technext.asia'; mail.textContent = 'sales@technext.asia';
          status.appendChild(mail); status.appendChild(document.createTextNode('.'));
        })
        .finally(function () { btn.classList.remove('is-busy'); btn.disabled = false; });
    });
  });

  /* ---------------- YouTube facades: load the player only on click ---------------- */
  document.addEventListener('click', function (e) {
    var f = e.target.closest('[data-yt]');
    if (!f || f.classList.contains('is-playing')) return;
    var id = f.getAttribute('data-yt'), title = f.getAttribute('aria-label') || 'Video';
    f.classList.add('is-playing');
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) { f.classList.remove('is-playing'); return; }
    var fr = document.createElement('iframe');
    fr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    fr.title = title;
    fr.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    fr.setAttribute('allowfullscreen', '');
    f.textContent = ''; f.appendChild(fr);
  });

  /* ---------------- scroll reveals ---------------- */
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // A section that scrolls in switches its reveals on over a few frames, six at a time, instead of
    // restyling every card in one frame (the reveals stagger with their own delays anyway).
    var rq = [], rqRaf = 0;
    var rqFlush = function () {
      rqRaf = 0;
      for (var n = 0; rq.length && n < 6; n++) rq.shift().classList.add('is-in');
      if (rq.length) rqRaf = requestAnimationFrame(rqFlush);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { rq.push(en.target); io.unobserve(en.target); }
      });
      if (rq.length && !rqRaf) rqRaf = requestAnimationFrame(rqFlush);
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- buttons: ripple on press, magnetic pull on hover ---------------- */
  document.addEventListener('pointerdown', function (e) {
    var btn = e.target.closest('.btn');
    if (!btn || reduce) return;
    var r = btn.getBoundingClientRect();
    var d = Math.max(r.width, r.height) * 1.6;
    var s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    btn.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  });
  if (fine && !reduce) {
    // magnetic pull on large buttons only (never on the fixed side tabs — a moving fixed target flickers)
    $$('.btn-lg').forEach(function (btn) {
      var raf = null;
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          btn.style.transform = 'translate(' + (x * 6).toFixed(1) + 'px,' + (y * 4 - 2).toFixed(1) + 'px)';
        });
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }
})();

/* ---------------- "Set up meeting" (Odoo Appointments): a GA4 event, not an Ads conversion ----------------
   A click opens the booking page; the meeting itself is booked in Odoo. */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('[data-meet]');
  if (a && typeof window.gtag === 'function') window.gtag('event', 'book_meeting_click', { link: 'odoo_appointment' });
});

/* ---------------- image fallbacks (replaces the generated inline onerror= handlers) ----------------
   `error` does not bubble, so listen in the capture phase. Images that failed before this
   script ran (eager ones above the fold) are swept on DOMContentLoaded. */
(function () {
  'use strict';
  function fallback(img) {
    var f = img.getAttribute('data-onerror');
    if (!f) return;
    img.removeAttribute('data-onerror');
    if (f === 'remove') { img.remove(); return; }
    if (f === 'feat') { var w = img.closest('.feat'); if (w) w.classList.add('feat--noimg'); return; }
    if (f.indexOf('closest:') === 0) { var t = img.closest(f.slice(8)); if (t) t.remove(); }
  }
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') fallback(e.target);
  }, true);
  function sweep() {
    Array.prototype.slice.call(document.querySelectorAll('img[data-onerror]')).forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fallback(img);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sweep); else sweep();
})();
