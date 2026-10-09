/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /nexi-explains hero: a living comic book in four spreads (Series / Quick Tips / Cast / Specials).
   - The deck: chapter tabs (ARIA tabs), arrows, pause, swipe; autoplay with named holds (pointer on the controls or a
     spread, keyboard focus, the intro, an off-screen hero, a hidden tab, the pause button). Interactions restart the
     current slide's time instead of yanking the visitor away.
   - The change: a comic burst slams in over the spread with the next slide's sound word, the page turns underneath,
     the burst blows apart and the new panels slam in (CSS .is-enter); the halftone sky ripples from the burst.
   - The sky: a canvas halftone field that breathes, swells around the pointer and ripples on every tap; parallax layers.
   - Each spread: Nexi reacts when tapped (new 3D poses, a sound word, the bubble); Series cycles the ON AIR reel,
     Quick Tips flips through every tip (the stopwatch riffles to a random one), Cast drops sidekicks on stage (tap one
     to meet it, shuffle the cast, tap Nexi for a new costume), Specials spotlights each holiday panel and fires confetti.
   Reduced motion: no autoplay, no burst, a still halftone, instant swaps; everything stays tappable. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-nxe-hero]');
  if (!hero) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  var slides = $$('[data-nxe-slide]', hero), chaps = $$('[data-nxe-to]', hero);
  var keys = slides.map(function (s) { return s.getAttribute('data-nxe-slide'); });
  var ctl = $('[data-nxe-ctl]', hero), pp = $('[data-nxe-pp]', hero), deck = $('[data-nxe-deck]', hero);
  var bam = $('[data-nxe-bam]', hero), bamWord = bam && $('[data-nxe-bam-word]', bam);
  var DUR = { series: 10000, tips: 9500, cast: 9500, specials: 9000 };
  var BAM = { series: ['ON AIR!', '#FFD23F'], tips: ['ZOOM!', '#FFD23F'], cast: ['TA-DA!', '#FF9DB4'], specials: ['BOO!', '#C3B4FF'] };
  var cur = 0, busy = false;

  /* ---------------- sound words ---------------- */
  function word(host, text, x, y, cls) {
    if (reduce) return;
    var w = document.createElement('span');
    w.className = 'nxe-word' + (cls ? ' ' + cls : '');
    w.setAttribute('aria-hidden', 'true');
    w.textContent = text;
    w.style.left = Math.round(x) + 'px';
    w.style.top = Math.round(y) + 'px';
    w.style.setProperty('--r', (Math.random() * 24 - 12).toFixed(1) + 'deg');
    w.style.setProperty('--x', Math.round(Math.random() * 50 - 25) + 'px');
    host.appendChild(w);
    w.addEventListener('animationend', function () { w.remove(); });
  }
  function rel(el, host) {
    var a = el.getBoundingClientRect(), b = host.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
  }
  function restartAnim(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  /* ---------------- the halftone sky ---------------- */
  var dots = (function (cv) {
    var g = cv && cv.getContext('2d');
    if (!g) return { shock: function () {}, sync: function () {} };
    var W = 0, H = 0, dpr = 1, gap = 18, pts = [], waves = [], px = -999, py = -999, pa = 0, pt = 0, raf = 0, last = 0, run = false;
    function size() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height; dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
      gap = W < 760 ? 22 : 18;
      pts = [];
      var wide = W >= 1100;
      for (var y = gap / 2, r0 = 0; y < H; y += gap, r0++) {
        for (var x = (r0 % 2 ? gap : gap / 2); x < W; x += gap) {
          var bl = Math.max(0, 1 - Math.hypot(x / W, 1 - y / H) / 0.95);       /* bottom-left corner */
          var tr = Math.max(0, 1 - Math.hypot(1 - x / W, y / H) / 0.75);       /* top-right corner */
          var m = 0.28 + 0.75 * bl + 0.45 * tr;
          if (wide && x < W * 0.46 && y > H * 0.12 && y < H * 0.88) m *= 0.55;  /* quieter behind the copy */
          pts.push(x, y, Math.min(1.15, m));
        }
      }
    }
    function draw(t) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      var soft = new Path2D(), hot = new Path2D(), live = [];
      for (var k = 0; k < waves.length; k++) { var a = t - waves[k].t0; if (a < 1.3) live.push(waves[k]); }
      waves = live;
      var pr = 190, pa2 = pa * (fine ? 1 : 0);
      for (var i = 0; i < pts.length; i += 3) {
        var x = pts[i], y = pts[i + 1], m = pts[i + 2];
        var r = 1.45 * m * (0.72 + 0.42 * Math.sin(x * 0.011 + y * 0.007 - t * 1.5));
        var boost = 0;
        if (pa2 > 0) { var d = Math.hypot(x - px, y - py); if (d < pr) { var q = 1 - d / pr; boost += pa2 * 3.4 * q * q; } }
        for (var j = 0; j < waves.length; j++) {
          var w = waves[j], age = t - w.t0, R = age * 820, dd = Math.abs(Math.hypot(x - w.x, y - w.y) - R);
          if (dd < 70) boost += w.s * 3.2 * (1 - dd / 70) * (1 - age / 1.3);
        }
        r += boost;
        if (r < 0.35) continue;
        var p = boost > 1.2 ? hot : soft;
        p.moveTo(x + r, y); p.arc(x, y, r, 0, 6.2832);
      }
      g.fillStyle = 'rgba(255,255,255,.2)'; g.fill(soft);
      g.fillStyle = 'rgba(255,210,63,.62)'; g.fill(hot);
    }
    function loop(ts) {
      raf = requestAnimationFrame(loop);
      if (ts - last < 32) return;            /* ~30 fps is plenty for a breathing halftone */
      last = ts;
      pa += ((ts - pt < 1600 ? 1 : 0) - pa) * 0.12;
      draw(ts / 1000);
    }
    function sync() {
      var go = run && !reduce;
      if (go && !raf) { last = 0; raf = requestAnimationFrame(loop); }
      if (!go && raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    size();
    if (reduce) draw(0);
    if ('ResizeObserver' in window) new ResizeObserver(function () { size(); if (reduce) draw(0); }).observe(cv);
    if (fine) hero.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; pt = performance.now();
    }, { passive: true });
    return {
      shock: function (x, y, s) { if (!reduce) waves.push({ x: x, y: y, t0: performance.now() / 1000, s: s || 1 }); },
      sync: function (on) { run = on; sync(); }
    };
  })($('[data-nxe-dots]', hero));

  /* parallax for the sky's floating layers */
  var layers = $$('.nxe-sky [data-depth]', hero);
  if (fine && !reduce && layers.length) {
    var lx = 0, ly = 0, lraf = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      lx = (e.clientX - r.left) / r.width - 0.5; ly = (e.clientY - r.top) / r.height - 0.5;
      if (!lraf) lraf = requestAnimationFrame(function () {
        lraf = 0;
        layers.forEach(function (el) {
          var d = parseFloat(el.getAttribute('data-depth')) || 0;
          el.style.translate = (lx * d * -40).toFixed(1) + 'px ' + (ly * d * -28).toFixed(1) + 'px';
        });
        var n = $('.nxe-slide.is-on .nxe-hero-nexi', hero);
        if (n) n.style.setProperty('--lean', (lx * 7).toFixed(2) + 'deg');
      });
    });
    hero.addEventListener('pointerleave', function () {
      layers.forEach(function (el) { el.style.translate = ''; });
      $$('.nxe-hero-nexi', hero).forEach(function (n) { n.style.removeProperty('--lean'); });
    });
  }

  /* a tap on the empty sky: a random sound word and a ripple */
  var SKYWORDS = ['POW!', 'ZAP!', 'BAM!', 'WHAM!', 'BOING!', 'KAPOW!', 'ZING!', 'BOOM!'];
  hero.addEventListener('click', function (e) {
    if (e.target.closest('a,button,input,label,.nxe-copy,.nxe-ctl,.nxe-pn,.nxe-say')) return;
    var r = hero.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    word(hero, rnd(SKYWORDS), x, y, 'nxe-word--sky');
    dots.shock(x, y, 1);
  });

  /* ---------------- autoplay with named holds ---------------- */
  var holds = {}, timer = 0, remain = 0, started = 0;
  function held() { for (var k in holds) if (holds[k]) return true; return false; }
  function bar(restart) {
    var on = chaps[cur];
    if (!on) return;
    on.style.setProperty('--dur', (DUR[keys[cur]] || 9000) + 'ms');
    if (restart) { var i = $('i', on); if (i) { i.style.animation = 'none'; void i.offsetWidth; i.style.animation = ''; } }
    ctl.classList.toggle('is-held', held());
  }
  function arm() {
    clearTimeout(timer); timer = 0;
    ctl.classList.toggle('is-held', held());
    if (reduce || held() || busy) return;
    started = Date.now();
    timer = setTimeout(function () { timer = 0; go(cur + 1, 'auto'); }, remain);
  }
  function hold(why, on) {
    var was = held();
    if (on) {
      if (!was && timer) { remain = Math.max(400, remain - (Date.now() - started)); clearTimeout(timer); timer = 0; }
      holds[why] = true;
    } else delete holds[why];
    if (was && !held()) arm(); else ctl.classList.toggle('is-held', held());
  }
  function fresh() { remain = DUR[keys[cur]] || 9000; bar(true); arm(); }   /* the slide's time starts over */

  /* ---------------- the deck ---------------- */
  function tabs(n, focus) {
    chaps.forEach(function (c, i) {
      var on = i === n;
      c.setAttribute('aria-selected', on ? 'true' : 'false');
      c.tabIndex = on ? 0 : -1;
      if (on && focus) c.focus();
    });
  }
  function settle(n) {
    slides.forEach(function (s, i) {
      var on = i === n;
      s.inert = !on;
      if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
    });
  }
  function swap(from, to, n) {
    from.classList.remove('is-on', 'is-leave');
    to.classList.add('is-on');
    if (!reduce) { restartAnim(to, 'is-enter'); setTimeout(function () { to.classList.remove('is-enter'); }, 1500); }
    hero.setAttribute('data-slide', keys[n]);
    var old = cur;
    cur = n;
    settle(n);
    if (stage[keys[old]]) stage[keys[old]].leave();
    if (stage[keys[n]]) stage[keys[n]].enter();
  }
  function go(n, how) {
    n = (n + slides.length) % slides.length;
    if (n === cur || busy) return;
    var from = slides[cur], to = slides[n], key = keys[n];
    clearTimeout(timer); timer = 0;
    tabs(n, how === 'key');
    if (reduce || !bam || !bam.animate) {
      swap(from, to, n);
      fresh();
      return;
    }
    busy = true;
    var hr = hero.getBoundingClientRect(), sp = $('[data-nxe-spread]', from).getBoundingClientRect();
    var bx = sp.left - hr.left + sp.width / 2, by = sp.top - hr.top + sp.height / 2;
    if (sp.width === 0) { bx = hr.width / 2; by = hr.height / 2; }
    bam.style.setProperty('--bx', bx + 'px');
    bam.style.setProperty('--by', by + 'px');
    bam.style.setProperty('--bam', BAM[key][1]);
    bamWord.textContent = BAM[key][0];
    from.classList.add('is-leave');
    if (stage[keys[cur]]) stage[keys[cur]].leave();
    bam.animate([{ opacity: 1, transform: 'scale(0) rotate(-40deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }],
                { duration: 300, easing: 'cubic-bezier(.2,1.45,.45,1)', fill: 'forwards' });
    setTimeout(function () {
      swap(from, to, n);
      dots.shock(bx, by, 1.4);
      restartAnim(hero, 'is-shake');
      bam.animate([{ opacity: 1, transform: 'scale(1) rotate(0deg)' }, { opacity: 0, transform: 'scale(2.6) rotate(14deg)' }],
                  { duration: 440, delay: 110, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }).onfinish = function () {
        busy = false;
        hero.classList.remove('is-shake');
        fresh();
      };
    }, 310);
  }
  chaps.forEach(function (c, i) {
    c.addEventListener('click', function () { go(i, 'click'); });
    c.addEventListener('keydown', function (e) {
      var k = e.key, n = chaps.length;
      var j = k === 'ArrowRight' ? (i + 1) % n : k === 'ArrowLeft' ? (i + n - 1) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      go(j, 'key');
    });
  });
  $$('[data-nxe-go]', hero).forEach(function (b) {
    b.addEventListener('click', function () { go(cur + (+b.getAttribute('data-nxe-go')), 'click'); });
  });
  if (pp) pp.addEventListener('click', function () {
    var on = !holds.user;
    hold('user', on);
    hero.classList.toggle('is-paused', on);
    pp.setAttribute('aria-pressed', on ? 'true' : 'false');
    pp.setAttribute('aria-label', on ? 'Play the slides' : 'Pause the slides');
    if (!on) fresh();
  });
  /* holds: pointer on the controls or a spread, keyboard focus inside the hero */
  if (fine) {
    var off = {};
    [ctl].concat($$('[data-nxe-spread]', hero)).forEach(function (z, k) {
      z.addEventListener('pointerenter', function () { clearTimeout(off[k]); hold('hover', true); });
      z.addEventListener('pointerleave', function () { off[k] = setTimeout(function () { hold('hover', false); }, 400); });
    });
  }
  hero.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) hold('focus', true); });
  hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) hold('focus', false); });
  /* swipe on touch screens */
  var sx = 0, sy = 0, st = 0;
  deck.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') { sx = e.clientX; sy = e.clientY; st = 1; } });
  deck.addEventListener('pointerup', function (e) {
    if (!st) return;
    st = 0;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) go(cur + (dx < 0 ? 1 : -1), 'swipe');
  });
  deck.addEventListener('pointercancel', function () { st = 0; });
  /* off screen / hidden tab / intro */
  var seen = true;
  function vis() {
    var on = seen && !document.hidden;
    hold('off', !on);
    dots.sync(on);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { seen = en[en.length - 1].isIntersecting; vis(); }).observe(hero);
  document.addEventListener('visibilitychange', vis);
  if (document.documentElement.classList.contains('intro')) {
    hold('intro', true);
    document.addEventListener('tn:intro-done', function () { hold('intro', false); }, { once: true });
    setTimeout(function () { hold('intro', false); }, 9000);
  }

  /* ---------------- each spread ---------------- */
  function nexiOf(sl) { return $('[data-nxe-nexi]', sl); }
  function base(img) { return img.getAttribute('src').replace(/[^/]+\.webp.*$/, ''); }
  function talker(sl, lines) {
    var say = $('[data-nxe-say]', sl), li = 0, iv = 0;
    function speak(t) { say.textContent = t; if (!reduce) restartAnim(say, 'is-pop'); }
    return {
      speak: speak,
      start: function () { clearInterval(iv); if (!reduce) iv = setInterval(function () { li = (li + 1) % lines.length; speak(lines[li]); }, 4600); },
      stop: function () { clearInterval(iv); },
      bump: function () { this.start(); }
    };
  }
  /* Nexi's tap: a pose, a line, a sound word, a hop; back to the slide's own pose after a while */
  function reactor(sl, home, taps, words, extra) {
    var btn = nexiOf(sl), img = btn && $('img', btn), root = img ? base(img) : '', ti = 0, wi = 0, back = 0, spread = $('[data-nxe-spread]', sl);
    var talk = talker(sl, extra.lines);
    function pose(p) { if (!img) return; img.removeAttribute('width'); img.removeAttribute('height'); img.src = root + 'nexi-' + p + '.webp'; }
    if (btn) btn.addEventListener('click', function () {
      var t = taps[ti++ % taps.length];
      pose(t[0]); talk.speak(t[1]); talk.bump();
      var r = rel(btn, spread);
      word(spread, words[wi++ % words.length], r.x + r.w * 0.5, r.y + r.h * 0.12);
      if (!reduce) restartAnim(btn, 'is-hop');
      if (extra.tap) extra.tap(btn, r);
      clearTimeout(back);
      back = setTimeout(function () { pose(home); }, 4200);
      fresh();
    });
    /* warm the poses once the page is idle so a tap swaps instantly */
    setTimeout(function () { taps.forEach(function (t) { var i = new Image(); i.src = root + 'nexi-' + t[0] + '.webp'; }); }, 3000 + Math.random() * 2000);
    return talk;
  }
  function kids(sl) {
    var spread = $('[data-nxe-spread]', sl);
    $$('[data-nxe-kid][data-word]', sl).forEach(function (k) {
      k.addEventListener('click', function () {
        restartAnim(k, 'is-hop');
        var r = rel(k, spread);
        word(spread, k.getAttribute('data-word'), r.x + r.w * 0.5, r.y);
        fresh();
      });
    });
  }
  var stage = {};

  /* 1 · Series */
  (function () {
    var sl = slides[keys.indexOf('series')];
    if (!sl) return;
    var talk = reactor(sl, 'burst',
      [['kiss', 'Aww, thank you for watching!'], ['dizzy', 'Whoa! Breaking panels makes me dizzy!'], ['gasp', 'Is that a new episode?!'],
       ['clap', 'Beep boop! Pick a season below.'], ['cute', 'Hehe, that tickles!'], ['hi', 'Hi again! Grab some popcorn.']],
      ['BOOP!', 'WOW!', 'HEHE!', 'YAY!', 'ZING!', 'BEEP!'],
      { lines: ['Hi! I’m Nexi. Grab a seat!', 'One idea per episode. Promise!', 'New episodes premiere every week.', 'Tap me. I dare you!', 'Season 2 is about the people side of Odoo.'],
        tap: function () { var sp = $('[data-nxe-spread]', sl); if (!reduce) restartAnim(sp, 'is-shake'); } });
    kids(sl);
    var imgs = $$('[data-nxe-reel] img', sl), cap = $('[data-nxe-tvcap]', sl), k = 0, iv = 0;
    imgs.forEach(function (im) { if (im.loading === 'lazy') im.loading = 'eager'; });
    function show(i) {
      imgs.forEach(function (im, j) { im.classList.toggle('is-on', j === i); });
      if (cap) {
        cap.textContent = '';
        var b = document.createElement('b'); b.textContent = imgs[i].getAttribute('data-cap');
        var s = document.createElement('span'); s.textContent = imgs[i].getAttribute('data-title');
        cap.appendChild(b); cap.appendChild(s);
        if (!reduce) restartAnim(cap, 'is-swap');
      }
    }
    stage.series = {
      enter: function () { talk.start(); clearInterval(iv); if (!reduce && imgs.length > 1) iv = setInterval(function () { k = (k + 1) % imgs.length; show(k); }, 2600); },
      leave: function () { talk.stop(); clearInterval(iv); }
    };
  })();

  /* 2 · Quick Tips */
  (function () {
    var sl = slides[keys.indexOf('tips')];
    if (!sl) return;
    var deckEl = $('[data-nxe-flip]', sl), card = $('[data-nxe-tipcard]', sl), fly = $('[data-nxe-tipfly]', sl);
    var watch = $('[data-nxe-shuffle]', sl), wt = watch && $('.nxe-watch-t', watch), spread = $('[data-nxe-spread]', sl);
    var tips = [];
    try { tips = JSON.parse(deckEl.getAttribute('data-tips') || '[]'); } catch (e) { tips = []; }
    var root = deckEl.getAttribute('data-root') || '';
    var img = $('[data-nxe-tipimg]', card), code = $('[data-nxe-tipcode]', card), title = $('[data-nxe-tiptitle]', card), len = $('[data-nxe-tiplen]', card);
    var at = Math.max(0, tips.map(function (t) { return t.c; }).indexOf(code.textContent)), iv = 0, spinning = false;
    function pre(i) { var t = tips[i]; if (t) { var im = new Image(); im.src = root + t.i + '.webp'; } }
    function put(i) {
      var t = tips[i];
      if (!t) return;
      img.src = root + t.i + '.webp'; code.textContent = t.c; title.textContent = t.t; len.textContent = t.l;
      card.setAttribute('aria-label', 'See the Quick Tips: ' + t.c + ', ' + t.t);
    }
    function flip(i, quick) {
      if (!tips.length) return;
      i = (i + tips.length) % tips.length;
      if (!reduce && fly) {
        fly.textContent = '';
        var c = card.cloneNode(true);
        c.removeAttribute('href'); c.removeAttribute('data-nxe-tipcard'); c.removeAttribute('aria-label');
        var s = document.createElement('span'); while (c.firstChild) s.appendChild(c.firstChild);
        fly.appendChild(s);
        fly.style.animationDuration = quick ? '.22s' : '';
        restartAnim(fly, 'is-go');
      }
      at = i; put(i); pre(i + 1);
      if (!reduce && !quick) restartAnim(card, 'is-new');
    }
    var talk = reactor(sl, 'racer',
      [['jump', 'Zoom zoom!'], ['reach', 'Faster than a coffee break!'], ['clap', 'That’s a wrap. Next tip!'], ['hi', 'Ready, set, Odoo!']],
      ['ZOOM!', 'VROOM!', 'GO!', 'WHOOSH!'],
      { lines: ['One trick. Under two minutes!', 'Tap the stopwatch for a random tip!', 'Saved searches, bulk edits, Excel exports…', 'Quick Tips drop between the episodes.'] });
    kids(sl);
    if (watch) watch.addEventListener('click', function () {
      if (spinning || !tips.length) return;
      spinning = true; clearInterval(iv);
      watch.classList.add('is-spin'); if (wt) wt.textContent = '?!';
      var r = rel(watch, spread);
      word(spread, 'TICK-TICK-TICK!', r.x + r.w * 0.6, r.y + r.h * 0.2);
      var target = Math.floor(Math.random() * tips.length), n = reduce ? 0 : 9, k = 0;
      if (target === at) target = (target + 5) % tips.length;
      (function step() {
        if (k < n) { k++; flip(at + 1, true); setTimeout(step, 120); return; }
        flip(target);
        watch.classList.remove('is-spin'); if (wt) wt.textContent = 'GO!';
        word(spread, 'DING!', r.x + r.w * 0.5, r.y);
        talk.speak(tips[target].c + ': ' + tips[target].t + '!'); talk.bump();
        spinning = false;
        stage.tips.enter(true);
      })();
      fresh();
    });
    stage.tips = {
      enter: function (keepTalk) {
        if (!keepTalk) talk.start();
        clearInterval(iv);
        pre(at + 1);
        if (!reduce) iv = setInterval(function () { if (!spinning) flip(at + 1); }, 2500);
      },
      leave: function () { talk.stop(); clearInterval(iv); }
    };
  })();

  /* 3 · Cast */
  (function () {
    var sl = slides[keys.indexOf('cast')];
    if (!sl) return;
    var troupe = $('[data-nxe-troupe]', sl), spread = $('[data-nxe-spread]', sl), tag = $('[data-nxe-tag]', sl);
    var recast = $('[data-nxe-recast]', sl), btn = nexiOf(sl), nimg = btn && $('img', btn);
    var root = troupe.getAttribute('data-root') || '', cast = [], wardrobe = [];
    try { cast = JSON.parse(troupe.getAttribute('data-cast') || '[]'); } catch (e) { cast = []; }
    try { wardrobe = JSON.parse(btn.getAttribute('data-wardrobe') || '[]'); } catch (e) { wardrobe = []; }
    var spots = $$('[data-nxe-kid]', troupe), tagT = 0, wi = 0, busyCast = false;
    function who(b) { var lab = b.getAttribute('aria-label') || ''; var c = lab.indexOf(':'); return [lab.slice(0, c), lab.slice(c + 2)]; }
    function puff(r) {
      if (reduce) return;
      var p = document.createElement('span');
      p.className = 'nxe-puff'; p.setAttribute('aria-hidden', 'true');
      p.style.left = (r.x + r.w / 2) + 'px'; p.style.top = (r.y + r.h / 2) + 'px';
      spread.appendChild(p);
      p.addEventListener('animationend', function () { p.remove(); });
    }
    function showTag(b) {
      var r = rel(b, spread), w = who(b);
      tag.textContent = '';
      var n = document.createElement('b'); n.textContent = w[0];
      tag.appendChild(n); tag.appendChild(document.createTextNode(w[1]));
      tag.hidden = false;
      var half = tag.offsetWidth / 2 + 4;
      tag.style.left = Math.max(half, Math.min(spread.clientWidth - half, r.x + r.w / 2)) + 'px';
      tag.style.top = Math.max(18, r.y - 6) + 'px';
      if (!reduce) restartAnim(tag, 'is-pop');
      clearTimeout(tagT);
      tagT = setTimeout(function () { tag.hidden = true; }, 2800);
    }
    spots.forEach(function (b) {
      b.addEventListener('click', function () {
        restartAnim(b, 'is-hop');
        var r = rel(b, spread);
        word(spread, rnd(['HI!', 'YAY!', 'HEY!', 'WHEE!', 'HELLO!']), r.x + r.w / 2, r.y);
        showTag(b);
        fresh();
      });
    });
    function drop() {
      if (reduce) return;
      spots.forEach(function (b, i) { b.style.setProperty('--dd', (0.35 + i * 0.09).toFixed(2) + 's'); restartAnim(b, 'is-drop'); });
    }
    if (recast) recast.addEventListener('click', function () {
      if (busyCast || cast.length < spots.length) return;
      busyCast = true;
      var now = spots.map(function (b) { return who(b)[0]; });
      var pool = cast.filter(function (c) { return now.indexOf(c.n) < 0; });
      for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
      tag.hidden = true;
      spots.forEach(function (b, i) {
        var c = pool[i % pool.length], im = $('img', b);
        setTimeout(function () {
          puff(rel(b, spread));
          if (!reduce) restartAnim(b, 'is-gone');
          setTimeout(function () {
            b.classList.remove('is-gone');
            im.src = root + 'cast/' + c.f;
            b.setAttribute('aria-label', c.n + ': ' + c.r);
            if (!reduce) { b.style.setProperty('--dd', '0s'); restartAnim(b, 'is-drop'); }
          }, reduce ? 0 : 320);
        }, reduce ? 0 : i * 90);
      });
      setTimeout(function () { busyCast = false; }, reduce ? 0 : spots.length * 90 + 900);
      var r = rel(recast, spread);
      word(spread, 'SHUFFLE!', r.x + r.w / 2, r.y);
      fresh();
    });
    var talk = talker(sl, ['Say hi to the gang!', 'Tap a sidekick. They love it!', 'Tap me for a new costume!', 'Every episode, a new friend.']);
    if (btn && nimg) btn.addEventListener('click', function () {
      if (!wardrobe.length) return;
      var w = wardrobe[wi++ % wardrobe.length], r = rel(btn, spread);
      puff({ x: r.x + r.w * 0.2, y: r.y + r.h * 0.2, w: r.w * 0.6, h: r.h * 0.4 });
      nimg.removeAttribute('width'); nimg.removeAttribute('height');
      nimg.src = root + 'wardrobe/' + w.k + '.webp';
      if (!reduce) restartAnim(btn, 'is-poof');
      word(spread, rnd(['POOF!', 'TA-DA!', 'SHAZAM!']), r.x + r.w / 2, r.y + r.h * 0.1);
      talk.speak(w.n + ', at your service!'); talk.bump();
      fresh();
    });
    setTimeout(function () { wardrobe.slice(0, 6).forEach(function (w) { var i = new Image(); i.src = root + 'wardrobe/' + w.k + '.webp'; }); }, 5000);
    stage.cast = { enter: function () { talk.start(); drop(); }, leave: function () { talk.stop(); tag.hidden = true; } };
  })();

  /* 4 · Specials */
  (function () {
    var sl = slides[keys.indexOf('specials')];
    if (!sl) return;
    var spread = $('[data-nxe-spread]', sl), panels = $$('.nxe-hs', sl), conf = $('[data-nxe-confetti]', sl), fi = 0, iv = 0;
    function blast(x, y) {
      if (reduce || !conf) return;
      var C = ['#FFD23F', '#FF5A47', '#6FA0F5', '#3DDC84', '#FF9DB4', '#fff'];
      for (var i = 0; i < 26; i++) {
        var p = document.createElement('i'), a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, d = 90 + Math.random() * 170;
        p.style.setProperty('--x0', x + 'px'); p.style.setProperty('--y0', y + 'px');
        p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(0) + 'px'); p.style.setProperty('--dy', (Math.sin(a) * d + 120).toFixed(0) + 'px');
        p.style.setProperty('--dr', (Math.random() * 900 - 450).toFixed(0) + 'deg'); p.style.setProperty('--c', rnd(C));
        p.style.animationDelay = (Math.random() * 0.08).toFixed(2) + 's';
        conf.appendChild(p);
        p.addEventListener('animationend', function () { this.remove(); });
      }
    }
    var lines = panels.map(function (p) { return p.getAttribute('data-title') + ' airs ' + p.getAttribute('data-airs') + '!'; });
    var talk = reactor(sl, 'party',
      [['gasp', 'Eek! A ghost in the office!'], ['cute', 'Ho ho ho! Christmas rush!'], ['kiss', 'Happy holidays!'], ['clap', '3… 2… 1… countdown time!']],
      ['WOO-HOO!', 'BOO!', 'HO HO!', 'POP!'],
      { lines: lines.concat(['Tap me for confetti!']), tap: function (b, r) { blast(r.x + r.w * 0.5, r.y + r.h * 0.2); } });
    function front(i) { panels.forEach(function (p, j) { p.classList.toggle('is-front', j === i); }); }
    panels.forEach(function (p, i) {
      p.addEventListener('pointerenter', function () { clearInterval(iv); front(i); });
      p.addEventListener('focus', function () { clearInterval(iv); front(i); });
    });
    stage.specials = {
      enter: function () {
        talk.start(); clearInterval(iv); fi = 0; front(0);
        if (!reduce) iv = setInterval(function () { fi = (fi + 1) % panels.length; front(fi); talk.speak(lines[fi]); }, 2900);
      },
      leave: function () { talk.stop(); clearInterval(iv); front(-1); }
    };
  })();

  /* ---------------- the rest of the page: sidekicks that peek in, doodles drifting with the scroll ---------------- */
  $$('[data-nxe-peek]').forEach(function (b) {
    b.addEventListener('click', function () {
      restartAnim(b, 'is-hop');
      var host = b.offsetParent || document.body, r = rel(b, host);
      word(host, b.getAttribute('data-word') || 'HI!', r.x + r.w / 2, r.y);
    });
  });
  var drift = $$('[data-sdepth]');
  if (drift.length && !reduce) {
    var dr = 0, dsec = drift[0].closest('section');
    var driftNow = function () {
      dr = 0;
      var top = dsec.getBoundingClientRect().top;
      if (top > innerHeight || top + dsec.offsetHeight < 0) return;
      drift.forEach(function (el) {
        el.style.translate = '0 ' + (top * (parseFloat(el.getAttribute('data-sdepth')) || 0) * 0.25).toFixed(1) + 'px';
      });
    };
    addEventListener('scroll', function () { if (!dr) dr = requestAnimationFrame(driftNow); }, { passive: true });
    driftNow();
  }

  /* ---------------- start ---------------- */
  settle(0);
  if (stage[keys[0]]) stage[keys[0]].enter();
  remain = DUR[keys[0]];
  bar(true);
  vis();
  arm();
})();
