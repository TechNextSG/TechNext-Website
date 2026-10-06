/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /nexi-explains: season tabs, premiere countdowns (cards switch to "Watch now" when a YouTube premiere
   starts), the video player dialog (one episode, or a whole season as a YouTube playlist), the Quick Tips
   rails and Nexi's little show in the hero (her bubble chats, tap her to change her mood).
   Video ids come from data-nxe-play and must look like a YouTube id; the player URL is a constant. */
(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ID = /^[A-Za-z0-9_-]{6,20}$/;
  var EMBED = 'https://www.youtube-nocookie.com/embed/';
  var WATCH = 'https://www.youtube.com/watch?v=';
  var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  var SGT = { timeZone: 'Asia/Singapore' };
  var fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Singapore' });
  var fmtTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: SGT.timeZone });

  function when(el) { var t = Date.parse(el.getAttribute('data-nxe-premiere') || ''); return isNaN(t) ? 0 : t; }
  function released(el) { var t = when(el); return !t || t <= Date.now(); }
  function left(ms) {
    var m = Math.max(1, Math.round(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
    if (d) return d + ' d ' + h + ' h';
    if (h) return h + ' h ' + mm + ' min';
    return mm + ' min';
  }

  /* ---------------- cards pop in like comic panels as they scroll into view ---------------- */
  var popIO = null;
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('nxe-anim');
    popIO = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var c = x.target, sibs = c.parentNode ? [].slice.call(c.parentNode.children) : [];
        c.style.setProperty('--k', Math.min(5, Math.max(0, sibs.indexOf(c) % 4)) * 70 + 'ms');
        c.classList.add('is-in');
        popIO.unobserve(c);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
    $$('.nxe-card').forEach(function (c) { popIO.observe(c); });
  }

  /* ---------------- season tabs ---------------- */
  var tabs = $$('.nxe-tab'), panels = $$('.nxe-panel');
  function select(id, focus, push) {
    var found = false;
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      if (on) found = true;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    if (!found) return false;
    panels.forEach(function (p) { p.classList.toggle('is-on', p.id === id); });
    if (push && history.replaceState) history.replaceState(null, '', '#' + id);
    rails();
    return true;
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('aria-controls'), false, true); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = tabs.length, j = k === 'ArrowRight' ? (i + 1) % n : k === 'ArrowLeft' ? (i + n - 1) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      select(tabs[j].getAttribute('aria-controls'), true, true);
    });
  });
  function fromHash() {
    var h = decodeURIComponent((location.hash || '').slice(1));
    if (!h) return;
    var p = panels.filter(function (x) { return x.id === h; })[0];
    if (!p) { var el = document.getElementById(h); p = el && el.closest('.nxe-panel'); }
    if (p) select(p.id, false, false);
  }
  if (tabs.length) {
    select(tabs[0].getAttribute('aria-controls'), false, false);
    fromHash();
    addEventListener('hashchange', fromHash);
  }

  /* ---------------- premiere states + the "next premiere" strip ---------------- */
  var pre = document.querySelector('[data-nxe-pre]'), post = document.querySelector('[data-nxe-post]');
  var next = document.querySelector('[data-nxe-next]');
  function states() {
    var now = Date.now(), soon = null;
    $$('.nxe-thumb[data-nxe-play]').forEach(function (b) {
      var t = when(b), st = b.querySelector('[data-nxe-state]');
      var live = !t || t <= now;
      b.classList.toggle('is-live', live);
      if (st) st.textContent = live ? 'Watch now' : 'Premieres in ' + left(t - now);
      if (!live && (!soon || t < when(soon))) soon = b;
    });
    if (pre && post) { var on = released(post); pre.hidden = on; post.hidden = !on; }
    $$('[data-nxe-playall]').forEach(function (b) {
      var p = b.closest('.nxe-panel'), lab = b.querySelector('span');
      var eps = p ? $$('.nxe-thumb[data-nxe-play]', p).filter(function (x) { return !x.closest('.nxe-tips'); }) : [];
      var out = eps.filter(released);
      if (!lab) return;
      if (out.length) lab.textContent = out.length > 1 ? 'Play the season (' + out.length + ')' : 'Play the season';
      else if (eps.length) lab.textContent = 'Season premiere ' + fmtDay.format(new Date(when(eps[0])));
    });
    if (next) {
      if (!soon) { next.hidden = true; return; }
      var t = when(soon), d = new Date(t);
      next.hidden = false;
      next.querySelector('[data-nxe-next-title]').textContent = soon.getAttribute('data-nxe-title') || '';
      var w = next.querySelector('[data-nxe-next-when]');
      w.textContent = '';
      var s = document.createElement('strong'); s.textContent = 'in ' + left(t - now);
      w.appendChild(s);
      w.appendChild(document.createTextNode(' · ' + fmtDay.format(d) + ', ' + fmtTime.format(d).toLowerCase() + ' SGT'));
      var id = soon.getAttribute('data-nxe-play');
      if (ID.test(id)) next.querySelector('[data-nxe-next-link]').href = WATCH + id;
    }
  }
  states();
  setInterval(function () { if (!document.hidden) states(); }, 30000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) states(); });

  /* ---------------- player ---------------- */
  var dlg = document.getElementById('nxe-player');
  var frame = dlg && dlg.querySelector('[data-nxe-frame]'), ttl = dlg && dlg.querySelector('#nxe-player-t');
  var ytLink = dlg && dlg.querySelector('[data-nxe-yt]');
  var prevB = dlg && dlg.querySelector('[data-nxe-prev]'), nextB = dlg && dlg.querySelector('[data-nxe-next-ep]');
  var list = [], pos = -1;
  function load(id, title, more) {
    if (!ID.test(id)) return false;
    var src = EMBED + id + '?autoplay=1&rel=0&modestbranding=1';
    var ids = (more || []).filter(function (x) { return ID.test(x); });
    if (ids.length) src += '&playlist=' + ids.join(',');
    frame.textContent = '';
    var fr = document.createElement('iframe');
    fr.src = src;
    fr.title = title;
    fr.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    fr.setAttribute('allowfullscreen', '');
    frame.appendChild(fr);
    ttl.textContent = title;
    ytLink.href = WATCH + id;
    return true;
  }
  function show() {
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }
  }
  function nav() {
    prevB.disabled = pos <= 0;
    nextB.disabled = pos < 0 || pos >= list.length - 1;
    prevB.hidden = nextB.hidden = list.length < 2;
  }
  function playAt(k) {
    var b = list[k];
    if (!b) return;
    pos = k;
    load(b.getAttribute('data-nxe-play'), b.getAttribute('data-nxe-title') || 'Nexi Explains');
    nav();
  }
  function playOne(btn) {
    var tips = btn.closest('.nxe-tips'), panel = btn.closest('.nxe-panel') || document.getElementById('season-1');
    var pool = tips ? $$('.nxe-thumb[data-nxe-play]', tips)
                    : $$('.nxe-thumb[data-nxe-play]', panel || document).filter(function (x) { return !x.closest('.nxe-tips'); });
    list = pool;
    var id = btn.getAttribute('data-nxe-play');
    pos = -1;
    for (var k = 0; k < pool.length; k++) if (pool[k].getAttribute('data-nxe-play') === id) { pos = k; break; }
    if (pos < 0) { list = [btn]; pos = 0; }
    if (!dlg) { if (ID.test(id)) window.open(WATCH + id, '_blank', 'noopener'); return; }
    playAt(pos);
    show();
  }
  function playSeason(btn) {
    var panel = btn.closest('.nxe-panel');
    var eps = $$('.nxe-thumb[data-nxe-play]', panel).filter(function (x) { return !x.closest('.nxe-tips'); });
    var out = eps.filter(released);
    if (!out.length) { if (eps[0]) playOne(eps[0]); return; }
    var ids = out.map(function (x) { return x.getAttribute('data-nxe-play'); });
    var name = (panel.querySelector('.nxe-sn') || {}).textContent || 'Season';
    list = []; pos = -1; nav();
    if (load(ids[0], 'Nexi Explains · ' + name + ' (' + ids.length + (ids.length > 1 ? ' episodes)' : ' episode)'), ids.slice(1))) show();
  }
  document.addEventListener('click', function (e) {
    var all = e.target.closest('[data-nxe-playall]');
    if (all) { e.preventDefault(); playSeason(all); return; }
    var b = e.target.closest('[data-nxe-play]');
    if (b) { e.preventDefault(); playOne(b); }
  });
  if (dlg) {
    prevB.addEventListener('click', function () { playAt(pos - 1); });
    nextB.addEventListener('click', function () { playAt(pos + 1); });
    dlg.querySelector('[data-nxe-close]').addEventListener('click', function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); frame.textContent = ''; });
    dlg.addEventListener('close', function () { frame.textContent = ''; });
    // a click on the backdrop (outside the box) closes the player
    dlg.addEventListener('click', function (e) { if (e.target === dlg && dlg.close) dlg.close(); });
  }

  /* ---------------- Quick Tips rails ---------------- */
  function rails() {
    $$('.nxe-rail-wrap').forEach(function (w) {
      var r = w.querySelector('[data-nxe-rail]');
      var p = w.querySelector('[data-nxe-step="-1"]'), n = w.querySelector('[data-nxe-step="1"]');
      if (!r || !p || !n) return;
      p.disabled = r.scrollLeft < 8;
      n.disabled = r.scrollLeft + r.clientWidth >= r.scrollWidth - 8;
    });
  }
  $$('.nxe-rail-wrap').forEach(function (w) {
    var r = w.querySelector('[data-nxe-rail]');
    if (!r) return;
    r.addEventListener('scroll', function () { requestAnimationFrame(rails); }, { passive: true });
    $$('[data-nxe-step]', w).forEach(function (b) {
      b.addEventListener('click', function () {
        r.scrollBy({ left: (+b.getAttribute('data-nxe-step')) * r.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });
  addEventListener('resize', rails);
  rails();

  /* ---------------- Nexi's show in the hero ---------------- */
  var stage = document.querySelector('[data-nxe-stage]');
  if (!stage) return;
  var say = stage.querySelector('[data-nxe-say]'), nexi = stage.querySelector('[data-nxe-nexi]');
  var img = nexi && nexi.querySelector('img'), screen = stage.querySelector('.nxe-tv-screen');
  var ROOT_IMG = img ? img.getAttribute('src').replace(/nexi-hello\.webp.*$/, '') : '';
  var IDLE = ['Hi! I’m Nexi. Grab a seat!', 'One idea per episode. Promise!', 'New episodes premiere every week.',
              'Quick Tips take under two minutes!', 'Season 2 is about the people side of Odoo.', 'Psst… tap me!'];
  var TAP = [['wow', 'Whoa! You found me!'], ['love', 'Aww, thank you for watching!'], ['celebrate', 'Popcorn ready? Let’s go!'],
             ['jump', 'I wear a new costume every episode!'], ['clap', 'Beep boop! Pick a season below.'], ['hello', 'Hehe, that tickles!']];
  var poseW = { hello: 432, wow: 347, love: 336, celebrate: 530, jump: 456, clap: 347 };
  var WORDS = ['BOOP!', 'WOW!', 'HEHE!', 'YAY!', 'ZING!', 'BEEP!'], wi = 0;
  function soundWord() {
    if (reduce || !nexi) return;
    var w = document.createElement('span');
    w.className = 'nxe-word';
    w.setAttribute('aria-hidden', 'true');
    w.textContent = WORDS[wi++ % WORDS.length];
    var sr = stage.getBoundingClientRect(), nr = nexi.getBoundingClientRect();
    w.style.left = Math.round(nr.left - sr.left + nr.width * 0.55) + 'px';
    w.style.top = Math.round(nr.top - sr.top + 10) + 'px';
    w.style.setProperty('--r', (Math.random() * 24 - 12).toFixed(1) + 'deg');
    w.style.setProperty('--x', Math.round(Math.random() * 60 - 10) + 'px');
    stage.appendChild(w);
    w.addEventListener('animationend', function () { w.remove(); });
  }
  var li = 0, ti = 0, visible = true, sayTimer = 0, tvTimer = 0, back = 0;
  function speak(text) {
    say.textContent = text;
    if (reduce) return;
    say.classList.remove('is-pop'); void say.offsetWidth; say.classList.add('is-pop');
  }
  function pose(name) {
    if (!img || !poseW[name]) return;
    img.src = ROOT_IMG + 'nexi-' + name + '.webp';
    img.width = poseW[name];
  }
  // preload the poses once the page is idle, so a tap swaps instantly
  setTimeout(function () { Object.keys(poseW).forEach(function (k) { var i = new Image(); i.src = ROOT_IMG + 'nexi-' + k + '.webp'; }); }, 2500);
  if (nexi) nexi.addEventListener('click', function () {
    var t = TAP[ti++ % TAP.length];
    pose(t[0]); speak(t[1]); soundWord();
    stage.dispatchEvent(new CustomEvent('nxe:tap'));
    if (!reduce) {
      nexi.classList.remove('is-hop'); void nexi.offsetWidth; nexi.classList.add('is-hop');
      stage.classList.remove('is-burst'); void stage.offsetWidth; stage.classList.add('is-burst');
    }
    clearTimeout(back);
    back = setTimeout(function () { pose('hello'); }, 4200);
    restart();
  });
  var imgs = screen ? $$('img', screen) : [], cur = 0;
  function tv() {
    if (imgs.length < 2) return;
    screen.classList.add('is-cycling');
    imgs[cur].classList.remove('is-on');
    cur = (cur + 1) % imgs.length;
    imgs[cur].classList.add('is-on');
  }
  function restart() {
    clearInterval(sayTimer); clearInterval(tvTimer);
    if (reduce || !visible || document.hidden) return;
    sayTimer = setInterval(function () { li = (li + 1) % IDLE.length; speak(IDLE[li]); }, 5200);
    tvTimer = setInterval(tv, 2800);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; restart(); }).observe(stage);
  }
  document.addEventListener('visibilitychange', restart);
  imgs.forEach(function (im) { if (im.loading === 'lazy') im.loading = 'eager'; });
  restart();

  var heroEl = document.querySelector('[data-nxe-hero]');
  var layers = heroEl ? $$('[data-depth]', heroEl) : [];
  if (heroEl && layers.length && !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var px = 0, py = 0, raf = 0;
    heroEl.addEventListener('pointermove', function (e) {
      var r = heroEl.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5; py = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0;
        layers.forEach(function (el) {
          var d = parseFloat(el.getAttribute('data-depth')) || 0;
          el.style.translate = (px * d * -34).toFixed(1) + 'px ' + (py * d * -26).toFixed(1) + 'px';
        });
      });
    });
    heroEl.addEventListener('pointerleave', function () { layers.forEach(function (el) { el.style.translate = ''; }); });
  }
})();
