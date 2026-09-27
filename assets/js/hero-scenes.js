/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Home hero scenes (desktop only; the phone hero is static by design).
   1 · cine  every Odoo app streaks in from off-stage and settles into two tilted orbits around the
             dashboard. Pointer tilts the orbit plane, drag spins it, hover stops it, apps send data in.
   2 · pmap  lead-to-cash across five departments: 17 steps, four decisions, loops and forks, live
             tokens, a scenario switch and a camera that flies the map before pulling back.
   3 · path  the launch path: five raised phases climb to go-live, the project glides up them, each
             phase's deliverables tick off and beams show the offices on it (drag the timeline, or click).
   A scene runs only while its slide is active, the hero is on screen and the tab is visible. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var phone = window.matchMedia('(max-width: 960px)');   // phones get the same scenes, laid out for a narrow screen
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROOT = hero.dataset.root || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pop = $('.pop');
  var popOpen = function () { return !!pop && !pop.hidden; };
  var onScreen = true;
  var TAU = Math.PI * 2;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 4); }
  function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function live() { return onScreen && !document.hidden; }
  // offset geometry relative to `host`: unaffected by the camera transitions that transform the slide
  function box(el, host) {
    var x = 0, y = 0, e = el;
    while (e && e !== host) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2, r: x + el.offsetWidth, b: y + el.offsetHeight };
  }
  function oiImg(mod, size) { return '<img class="oi" src="' + ROOT + 'assets/img/odoo/' + mod + '.svg" alt="" width="' + size + '" height="' + size + '">'; }
  function rounded(pts, rad) {
    // drop repeated points: a zero-length leg has no direction to round the corner with
    pts = pts.filter(function (q, i) { return !i || Math.abs(q[0] - pts[i - 1][0]) + Math.abs(q[1] - pts[i - 1][1]) > .5; });
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 1; i < pts.length - 1; i++) {
      var p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
      var l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      var r = Math.min(rad, l1 / 2, l2 / 2);
      var a = [p1[0] + (p0[0] - p1[0]) / l1 * r, p1[1] + (p0[1] - p1[1]) / l1 * r], b = [p1[0] + (p2[0] - p1[0]) / l2 * r, p1[1] + (p2[1] - p1[1]) / l2 * r];
      d += 'L' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'Q' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
    }
    var z = pts[pts.length - 1];
    return d + 'L' + z[0].toFixed(1) + ' ' + z[1].toFixed(1);
  }
  function svgEl(tag, attrs) { var n = document.createElementNS('http://www.w3.org/2000/svg', tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  /* ---- frame-budget helpers: nothing below reads layout inside an animation frame ---- */
  var hasRO = 'ResizeObserver' in window;
  // Measure where layout is already clean: a ResizeObserver callback runs after layout, before paint.
  // fn runs when the boxes are first observed, whenever one changes size, and once more after the web
  // fonts load (text metrics can move things inside a box without changing its size).
  function watchSize(els, fn) {
    if (!hasRO) return;
    var ro = new ResizeObserver(function () { fn(); });
    els.forEach(function (e) { if (e) ro.observe(e); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { els.forEach(function (e) { if (e) { ro.unobserve(e); ro.observe(e); } }); });
  }
  // Restart a class-driven CSS animation (keyframes in hero.css) without the remove / reflow / add
  // round trip, which forced a full layout in the middle of a frame. The first time, the class is just
  // added, exactly as before, and the element's own CSSAnimation objects are kept; later restarts rewind
  // and replay them. Falls back to the old restart if the Web Animations API is missing or they were dropped.
  function replay(el, cls, names) {
    if (!el) return;
    var key = '__tn_' + cls, list = el[key], on = el.classList.contains(cls);
    if (on && list && list.length && list.every(function (x) { return x.playState !== 'idle'; })) {
      list.forEach(function (x) { x.currentTime = 0; x.play(); });
      return;
    }
    if (on) { el.classList.remove(cls); void el.offsetWidth; }
    el.classList.add(cls);
    el[key] = typeof el.getAnimations === 'function' ?
      el.getAnimations({ subtree: true }).filter(function (x) { return names.indexOf(x.animationName) > -1; }) : null;
  }
  // Arc-length table of an SVG path, sampled once with getPointAtLength so a frame can place a point by
  // distance along the path without a layout read; between samples (`step` px apart) it interpolates.
  function pathTable(p, step) {
    var len = p.getTotalLength(), n = Math.max(1, Math.ceil(len / step)), xy = new Float64Array(n * 2 + 2);
    for (var i = 0; i <= n; i++) { var q = p.getPointAtLength(len * i / n); xy[i * 2] = q.x; xy[i * 2 + 1] = q.y; }
    return { len: len, n: n, xy: xy };
  }
  function tableAt(T, s, out) {
    var u = T.len > 0 ? clamp(s / T.len, 0, 1) * T.n : 0, i = Math.min(T.n - 1, Math.floor(u)), f = u - i, k = i * 2, xy = T.xy;
    out.x = xy[k] + (xy[k + 2] - xy[k]) * f; out.y = xy[k + 1] + (xy[k + 3] - xy[k + 1]) * f;
    return out;
  }
  // A quadratic Bézier evaluated in script, with a 24-point arc-length table so a point moves along it
  // at the same even speed getPointAtLength gave, without creating layout work.
  function quadCurve(x0, y0, x1, y1, x2, y2) {
    var N = 24, L = new Float64Array(N + 1), px = x0, py = y0;
    for (var i = 1; i <= N; i++) {
      var u = i / N, v = 1 - u, x = v * v * x0 + 2 * v * u * x1 + u * u * x2, y = v * v * y0 + 2 * v * u * y1 + u * u * y2;
      L[i] = L[i - 1] + Math.hypot(x - px, y - py); px = x; py = y;
    }
    return { x0: x0, y0: y0, x1: x1, y1: y1, x2: x2, y2: y2, L: L, len: L[N] };
  }
  function quadAt(c, s, out) {
    var L = c.L, N = 24, i = 0;
    s = clamp(s, 0, c.len);
    while (i < N - 1 && L[i + 1] < s) i++;
    var seg = L[i + 1] - L[i], u = (i + (seg > 0 ? (s - L[i]) / seg : 0)) / N, v = 1 - u;
    out.x = v * v * c.x0 + 2 * v * u * c.x1 + u * u * c.x2; out.y = v * v * c.y0 + 2 * v * u * c.y1 + u * u * c.y2;
    return out;
  }

  /* ================================================================== 1 · cinematic orbit */
  function Cine(root) {
    var fx = $('.cine-fx', root), ctx = fx.getContext('2d');
    var backSvg = $('.cine-rings--back', root), frontSvg = $('.cine-rings--front', root);
    var core = $('.cine-core', root), feed = $('.cine-feed', root), hand = $('[data-cine-hand]', root);
    // two orbit planes: x/y radii as a share of the stage width, roll in degrees, seconds per lap
    // inner ring: steep, it circles the dashboard; outer ring: wide and flat, crossing the other way
    var RINGS = [{ rx: .455, ry: .285, roll: -13, cy: .5, lap: 40, dir: 1, size: 46 },
                 { rx: .6, ry: .175, roll: 9, cy: .52, lap: 64, dir: -1, size: 36 }];
    // on a phone the stage is the screen's width: keep the outer ring's apps inside it
    if (phone.matches) { RINGS[0].rx = .42; RINGS[0].ry = .31; RINGS[1].rx = .49; RINGS[1].ry = .2; }
    var apps = $$('.cine-app', root).map(function (el) { return { el: el, ring: +el.dataset.ring, mod: el.dataset.app, hist: [] }; });
    [0, 1].forEach(function (r) {
      var list = apps.filter(function (a) { return a.ring === r; });
      list.forEach(function (a, k) { a.slot = k / list.length * TAU + (r ? .21 : 0); });
    });
    var W = 1, H = 1, dpr = 1, raf = 0, last = 0, on = false;
    var measured = false, viewBox = '', coreT = { x: 0, y: 0 }, ringTr = [], ringRR = [], hbD = '', PT = { x: 0, y: 0 };
    var rot = [0, .9], spd = 1, spdT = 1, dragV = 0, dragging = false, lastX = 0, lastT = 0;
    var tilt = { tx: 0, ty: 0, x: 0, y: 0 };
    var hot = null, leaveT = 0, rush = null, packets = [], nextPacket = 0, landed = 0;
    var ringG = [], backP = [], frontP = [], glint = [], halo = [], beamG, hoverBeam;
    var DOC = { S: 419, PO: 88, MO: 31, IN: 231, OUT: 412, INV: 147, T: 218 };
    var EVENTS = {
      accountant: function () { return '<b>' + (30 + (Math.random() * 20 | 0)) + '</b> bank lines matched'; },
      sale: function () { return '<b>S00' + (++DOC.S) + '</b> signed, order confirmed'; },
      stock: function () { return '<b>WH/OUT/00' + (++DOC.OUT) + '</b> delivered'; },
      crm: function () { return 'New lead from the <b>website form</b>'; },
      purchase: function () { return '<b>PO000' + (++DOC.PO) + '</b> raised by a reorder rule'; },
      mrp: function () { return '<b>MO/000' + (++DOC.MO) + '</b> done, stock updated'; },
      point_of_sale: function () { return 'POS session <b>closed and posted</b>'; },
      website_sale: function () { return 'Web order <b>paid, stock reserved</b>'; },
      project: function () { return 'Milestone reached, <b>invoice ready</b>'; },
      helpdesk: function () { return 'Ticket <b>#' + (++DOC.T) + '</b> solved'; },
      hr: function () { return 'New hire <b>onboarded</b>'; },
      ai_app: function () { return 'AI drafted a <b>reply</b> for review'; },
      mass_mailing: function () { return 'Campaign sent to a <b>CRM list</b>'; },
      documents: function () { return 'Vendor bill <b>digitised</b>'; },
      sign: function () { return 'Contract <b>signed</b>'; },
      hr_expense: function () { return 'Expense <b>approved, posted</b>'; },
      planning: function () { return 'Next week’s shifts <b>published</b>'; },
      knowledge: function () { return 'Procedure <b>linked</b> to the task'; },
      social: function () { return 'Post <b>scheduled</b>'; },
      web_studio: function () { return 'Field added, <b>upgrade-safe</b>'; }
    };
    var EVENT_KEYS = Object.keys(EVENTS);

    function build() {
      [backSvg, frontSvg].forEach(function (s) { s.innerHTML = ''; });
      var defs = svgEl('defs', {});
      // the near side of each ring is brightest in front of the dashboard and fades toward its ends
      defs.innerHTML = '<linearGradient id="cine-arc" x1="0" x2="1"><stop offset="0" stop-color="#3167CA" stop-opacity=".28"/><stop offset=".5" stop-color="#3167CA" stop-opacity=".8"/><stop offset="1" stop-color="#3167CA" stop-opacity=".28"/></linearGradient>';
      frontSvg.appendChild(defs);
      ringG = []; backP = []; frontP = []; glint = []; halo = [];
      RINGS.forEach(function (R, r) {
        var gb = svgEl('g', {}), gf = svgEl('g', {});
        backP[r] = svgEl('path', { 'class': 'cr-back cr-back--' + r });
        frontP[r] = svgEl('path', { 'class': 'cr-front cr-front--' + r });
        halo[r] = svgEl('path', { 'class': 'cr-halo cr-halo--' + r });
        glint[r] = svgEl('path', { 'class': 'cr-glint', pathLength: '1000' });
        gb.appendChild(backP[r]); gf.appendChild(halo[r]); gf.appendChild(frontP[r]); gf.appendChild(glint[r]);
        backSvg.appendChild(gb); frontSvg.appendChild(gf);
        ringG[r] = [gb, gf];
      });
      beamG = svgEl('g', { 'class': 'cine-beams' }); frontSvg.appendChild(beamG);
      hoverBeam = svgEl('path', { 'class': 'cine-hbeam' }); frontSvg.appendChild(hoverBeam);
      ringTr = []; ringRR = []; hbD = '';
    }
    // Every layout read of the scene happens here (on enter only if nothing has measured yet, otherwise
    // from the ResizeObserver or a window resize), never inside a frame.
    function size() {
      W = root.offsetWidth || 1; H = root.offsetHeight || 1;
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      apps.forEach(function (a) { a.sz = a.el.offsetWidth || RINGS[a.ring].size; });   // CSS sets smaller apps on phones
      // Where beams and packets land: the live feed on the dashboard. Offset geometry ignores CSS transforms,
      // and the core is centred with translate(-50%,-50%), so take half its size back off.
      var f = box(feed, root);
      coreT = { x: f.cx - core.offsetWidth / 2, y: f.y + 10 - core.offsetHeight / 2 };
      // resizing a canvas clears and reallocates it, so only when the size really changes
      var fw = Math.round(W * 2 * dpr), fh = Math.round(H * 2 * dpr);
      if (fx.width !== fw) fx.width = fw;
      if (fx.height !== fh) fx.height = fh;
      var vb = '0 0 ' + W + ' ' + H;
      if (vb !== viewBox) { viewBox = vb; [backSvg, frontSvg].forEach(function (s) { s.setAttribute('viewBox', vb); }); }
      measured = true;
    }
    function geo(r) {
      var R = RINGS[r], roll = (R.roll + tilt.x * 14) * Math.PI / 180;
      return { rx: R.rx * W, ry: R.ry * W * (1 + tilt.y * .45), c: Math.cos(roll), s: Math.sin(roll), roll: roll, cx: W * .5, cy: H * R.cy };
    }
    function at(g, th) {
      var x = g.rx * Math.cos(th), y = g.ry * Math.sin(th);
      return { x: g.cx + x * g.c - y * g.s, y: g.cy + x * g.s + y * g.c, d: (Math.sin(th) + 1) / 2 };
    }
    function coreTarget() { return coreT; }          // measured in size()
    function startRush(now) {
      landed = 0; root.classList.remove('is-live'); packets.forEach(function (p) { p.g.remove(); }); packets = [];
      if (reduce) { rush = null; landed = apps.length; root.classList.add('is-live'); return; }
      var order = apps.slice().sort(function () { return Math.random() - .5; });
      var warp = [];
      for (var i = 0; i < 46; i++) warp.push({ a: rnd(0, TAU), r: rnd(.75, 1.25) * W, v: rnd(1.2, 2.1) * W, len: rnd(40, 120), w: rnd(.6, 1.8) });
      order.forEach(function (a, k) {
        var g = geo(a.ring), p = at(g, a.slot + rot[a.ring]);
        var dx = p.x - W / 2, dy = p.y - H / 2, dl = Math.hypot(dx, dy) || 1, far = rnd(1.05, 1.5) * W;
        var camera = k % 4 === 3;                       // every fourth app drops from the camera instead
        a.fly = {
          delay: 90 + k * 62 + rnd(0, 120), dur: rnd(1050, 1500), camera: camera,
          x0: camera ? W / 2 + dx * .25 : W / 2 + dx / dl * far + rnd(-.2, .2) * W,
          y0: camera ? H / 2 + dy * .25 : H / 2 + dy / dl * far * .8 + rnd(-.2, .2) * H,
          s0: camera ? 3.4 : rnd(1.5, 2.1), bend: rnd(-.35, .35)
        };
        a.hist = []; a.landed = false; a.el.classList.remove('is-landed');
      });
      rush = { t0: now, warp: warp };
    }
    function layout(now, dt) {
      var g0 = geo(0), g1 = geo(1), G = [g0, g1];
      RINGS.forEach(function (R, r) {
        var g = G[r], tr = 'translate(' + g.cx.toFixed(1) + ' ' + g.cy.toFixed(1) + ') rotate(' + (g.roll * 180 / Math.PI).toFixed(2) + ')';
        if (ringTr[r] !== tr) { ringTr[r] = tr; ringG[r][0].setAttribute('transform', tr); ringG[r][1].setAttribute('transform', tr); }
        var rx = g.rx.toFixed(1), ry = g.ry.toFixed(1);
        if (ringRR[r] !== rx + ' ' + ry) {                     // the ring paths only change when the tilt does
          ringRR[r] = rx + ' ' + ry;
          backP[r].setAttribute('d', 'M-' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' 0');
          frontP[r].setAttribute('d', 'M' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 -' + rx + ' 0');
          halo[r].setAttribute('d', 'M' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 -' + rx + ' 0');
          glint[r].setAttribute('d', 'M' + rx + ' 0A' + rx + ' ' + ry + ' 0 0 1 -' + rx + ' 0');
        }
        // a highlight sweeps the near side of each ring in the direction its apps travel, then rests
        var u = (now / (r ? 4.6 : 3.6)) % 1500, head = R.dir > 0 ? u - 200 : 1200 - u;
        glint[r].style.strokeDashoffset = String(-head);
      });
      var t = rush ? now - rush.t0 : 1e9, flying = 0;
      apps.forEach(function (a) {
        var R = RINGS[a.ring], p = at(G[a.ring], a.slot + rot[a.ring]);
        var sc = .8 + .34 * p.d, op = .42 + .58 * p.d, blur = p.d < .5 ? (.5 - p.d) * 3.2 : 0;
        var x = p.x, y = p.y, spin = 0;
        if (a.fly && !a.landed) {
          var f = a.fly, q = clamp((t - f.delay) / f.dur, 0, 1), e = easeOut(q);
          if (q <= 0) { setOp(a, '0'); a.x = p.x; a.y = p.y; a.d = p.d; return; }
          if (q >= 1) {
            a.landed = true; landed++; a.el.classList.add('is-landed');
            if (landed === apps.length) { root.classList.add('is-live'); nextPacket = now + 700; }
          } else {
            flying++;
            var mx = (f.x0 + x) / 2 - (y - f.y0) * f.bend, my = (f.y0 + y) / 2 + (x - f.x0) * f.bend;
            var u = 1 - e;
            x = u * u * f.x0 + 2 * u * e * mx + e * e * p.x; y = u * u * f.y0 + 2 * u * e * my + e * e * p.y;
            sc = lerp(f.s0, sc, e); blur = lerp(f.camera ? 10 : 7, blur, e); op = op * clamp(q * 3.2, 0, 1);
            spin = (1 - e) * (f.camera ? 0 : 38 * (f.bend > 0 ? 1 : -1));
            a.hist.push(x, y); if (a.hist.length > 20) a.hist.splice(0, 2);
          }
        }
        if (a === hot) { sc *= 1.22; op = 1; blur = 0; }
        else if (hot) op *= .55;
        var s = a.sz || R.size, z = p.d >= .5 ? 30 + Math.round(p.d * 9) : 1 + Math.round(p.d * 16);
        if (a === hot) z = 60;
        a.x = x; a.y = y; a.d = p.d;
        var tf = 'translate(' + (x - s / 2).toFixed(1) + 'px,' + (y - s / 2).toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')' + (spin ? ' rotate(' + spin.toFixed(1) + 'deg)' : '');
        if (a.tf !== tf) { a.tf = tf; a.el.style.transform = tf; }
        setOp(a, op.toFixed(3));
        // depth-of-field blur in 0.25 px steps (at most 1.6 px at rest): the filter is rewritten a few
        // times a second instead of on every app in every frame
        var fl = blur > .15 ? 'blur(' + Math.max(.25, Math.round(blur * 4) / 4).toFixed(2) + 'px)' : '';
        if (a.fl !== fl) { a.fl = fl; a.el.style.filter = fl; }
        if (a.z !== z) { a.z = z; a.el.style.zIndex = z; }
      });
      drawFx(t, flying);
      if (hot) {
        var ct = coreTarget(), hx = hot.x, hy = hot.y;
        var hd = 'M' + hx.toFixed(1) + ' ' + hy.toFixed(1) + 'Q' + ((hx + ct.x) / 2).toFixed(1) + ' ' + (Math.min(hy, ct.y) - 40).toFixed(1) + ' ' + ct.x.toFixed(1) + ' ' + ct.y.toFixed(1);
        if (hd !== hbD) { hbD = hd; hoverBeam.setAttribute('d', hd); }
      }
      stepPackets(now, dt);
    }
    function setOp(a, v) { if (a.op !== v) { a.op = v; a.el.style.opacity = v; } }
    var fxDirty = false;                               // a flag in script, not a data- attribute written every frame
    function drawFx(t, flying) {
      var warpOn = rush && t >= 0 && t < 1100;
      if (!flying && !warpOn) { if (fxDirty) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, fx.width, fx.height); fxDirty = false; } return; }
      fxDirty = true;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W * 2, H * 2);
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.lineCap = 'round';
      if (warpOn) {
        var k = t / 1100, cx = W / 2, cy = H / 2;
        rush.warp.forEach(function (w) {
          var r = w.r - w.v * k; if (r < W * .18) return;
          var a0 = Math.cos(w.a), b0 = Math.sin(w.a) * .8;
          var al = Math.sin(Math.PI * k) * .55;
          var gr = ctx.createLinearGradient(cx + a0 * r, cy + b0 * r, cx + a0 * (r + w.len), cy + b0 * (r + w.len));
          gr.addColorStop(0, 'rgba(49,103,202,' + al.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(111,160,245,0)');
          ctx.strokeStyle = gr; ctx.lineWidth = w.w;
          ctx.beginPath(); ctx.moveTo(cx + a0 * r, cy + b0 * r); ctx.lineTo(cx + a0 * (r + w.len), cy + b0 * (r + w.len)); ctx.stroke();
        });
      }
      apps.forEach(function (a) {
        var h = a.hist; if (a.landed || h.length < 6) return;
        var x0 = h[0], y0 = h[1], x1 = h[h.length - 2], y1 = h[h.length - 1];
        var sz = a.sz || RINGS[a.ring].size;
        [[sz * .62, 'rgba(111,160,245,0)', 'rgba(111,160,245,.30)'], [sz * .16, 'rgba(49,103,202,0)', 'rgba(49,103,202,.75)']].forEach(function (L) {
          var gr = ctx.createLinearGradient(x0, y0, x1, y1);
          gr.addColorStop(0, L[1]); gr.addColorStop(1, L[2]);
          ctx.strokeStyle = gr; ctx.lineWidth = L[0];
          ctx.beginPath(); ctx.moveTo(x0, y0);
          for (var i = 2; i < h.length; i += 2) ctx.lineTo(h[i], h[i + 1]);
          ctx.stroke();
        });
      });
      ctx.restore();
    }
    function spawnPacket(now) {
      var cands = apps.filter(function (a) { return a.landed && a !== hot && a.d > .56 && EVENTS[a.mod]; });
      if (!cands.length) return;
      var a = cands[Math.random() * cands.length | 0], ct = coreTarget();
      var g = svgEl('g', { 'class': 'cine-pkt' });
      // the same curve as before (same rounding, same random draws in the same order), kept as numbers too
      var P0 = [a.x.toFixed(1), a.y.toFixed(1)], P1 = [((a.x + ct.x) / 2 + rnd(-60, 60)).toFixed(1), (Math.min(a.y, ct.y) - rnd(30, 90)).toFixed(1)], P2 = [ct.x.toFixed(1), ct.y.toFixed(1)];
      var d = 'M' + P0[0] + ' ' + P0[1] + 'Q' + P1[0] + ' ' + P1[1] + ' ' + P2[0] + ' ' + P2[1];
      var c = quadCurve(+P0[0], +P0[1], +P1[0], +P1[1], +P2[0], +P2[1]), len = c.len;
      // pathLength makes the browser measure the beam in the same units as the script, so the drawn
      // beam and the dot stay together exactly as with getTotalLength()
      var path = svgEl('path', { d: d, 'class': 'cine-beam', pathLength: String(len) });
      var halo = svgEl('circle', { r: 9, 'class': 'cine-dot-h' }), dot = svgEl('circle', { r: 3.6, 'class': 'cine-dot' });
      g.appendChild(path); g.appendChild(halo); g.appendChild(dot); beamG.appendChild(g);
      path.style.strokeDasharray = len + ' ' + len; path.style.strokeDashoffset = len;
      replay(a.el, 'is-send', ['cineSend']);
      var key = EVENT_KEYS[EVENT_KEYS.indexOf(a.mod)];
      packets.push({ g: g, path: path, dot: dot, halo: halo, c: c, len: len, t0: now, dur: 820, key: key, op: '' });
    }
    function stepPackets(now) {
      if (!reduce && landed === apps.length && !popOpen() && now > nextPacket && packets.length < 3) { spawnPacket(now); nextPacket = now + rnd(1300, 2300); }
      packets = packets.filter(function (p) {
        var q = clamp((now - p.t0) / p.dur, 0, 1), e = easeInOut(q), pt = quadAt(p.c, p.len * e, PT);
        p.dot.setAttribute('cx', pt.x); p.dot.setAttribute('cy', pt.y); p.halo.setAttribute('cx', pt.x); p.halo.setAttribute('cy', pt.y);
        p.path.style.strokeDashoffset = String(p.len * (1 - e));
        var o = q > .9 ? String((1 - q) * 10) : '1';
        if (p.op !== o) { p.op = o; p.g.style.opacity = o; }
        if (q >= 1) { p.g.remove(); arrive(p.key); return false; }
        return true;
      });
    }
    function arrive(key) {
      if (!key) return;
      var li = document.createElement('li');
      li.className = 'is-new';
      li.innerHTML = oiImg(key, 18) + '<span>' + EVENTS[key]() + '</span><time>now</time>';
      feed.insertBefore(li, feed.firstChild);
      var rows = $$('li', feed);
      rows.forEach(function (r, i) { var tm = $('time', r); if (tm && i) tm.textContent = ['now', '1 min', '3 min', '6 min'][i] || ''; });
      while (rows.length > 3) { var old = rows.pop(); old.remove(); }
      if (hand && /^\d[\d,]*$/.test(hand.textContent)) hand.textContent = (parseInt(hand.textContent.replace(/,/g, ''), 10) + 1 + (Math.random() * 2 | 0)).toLocaleString();
      replay(core, 'is-ping', ['cinePing']);
    }
    function frame() {
      // one clock for everything (rAF stamps and performance.now() can differ)
      var now = performance.now();
      raf = 0;
      if (!on || !live()) return;
      var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      var target = popOpen() || hot ? 0 : spdT;
      spd += (target - spd) * Math.min(1, dt * (hot ? 14 : target < spd ? 6 : 2.2));
      if (!dragging) dragV *= Math.pow(.18, dt);
      RINGS.forEach(function (R, r) { rot[r] += (R.dir * TAU / R.lap * spd + dragV * (r ? .8 : 1)) * dt; });
      if (!hot) { tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 3.2); tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 3.2); }
      layout(now, dt);
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (on && !raf && !reduce && live()) { last = 0; raf = requestAnimationFrame(frame); } }
    // pointer: tilt the plane, slow down to aim, drag to spin, hover to stop
    root.addEventListener('pointermove', function (e) {
      var r = root.getBoundingClientRect();
      if (dragging) {
        var now = performance.now(), dx = e.clientX - lastX, dts = Math.max(8, now - lastT) / 1000;
        dragV = clamp(dragV * .5 + (dx / W) * 5.2 / dts * .5, -9, 9); lastX = e.clientX; lastT = now;
      }
      if (hot) return;                              // a hovered app stays exactly under the pointer
      tilt.tx = clamp((e.clientX - r.left) / r.width - .5, -.5, .5);
      tilt.ty = clamp((e.clientY - r.top) / r.height - .5, -.5, .5);
    });
    root.addEventListener('pointerenter', function () { spdT = .32; });
    root.addEventListener('pointerleave', function () { spdT = 1; tilt.tx = tilt.ty = 0; });
    root.addEventListener('pointerdown', function (e) {
      if (reduce || e.target.closest('.cine-app') || e.button) return;
      dragging = true; lastX = e.clientX; lastT = performance.now(); root.classList.add('is-drag');
      try { root.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
    });
    function endDrag() { dragging = false; root.classList.remove('is-drag'); }
    root.addEventListener('pointerup', endDrag); root.addEventListener('pointercancel', endDrag);
    // keep a drag on the stage from being read as a carousel swipe
    root.addEventListener('touchend', function (e) { e.stopPropagation(); }, { passive: true });
    function hotOn(a) {
      if (leaveT) { clearTimeout(leaveT); leaveT = 0; }
      if (hot && hot !== a) hot.el.classList.remove('is-hover');
      hot = a; a.el.classList.add('is-hover'); root.classList.add('is-focus');
      if (reduce) layout(performance.now(), 0);
    }
    function hotOff(a) {
      if (leaveT) clearTimeout(leaveT);
      leaveT = setTimeout(function () {
        leaveT = 0; if (hot !== a) return;
        a.el.classList.remove('is-hover'); hot = null; root.classList.remove('is-focus');
        if (reduce) layout(performance.now(), 0);
      }, 160);
    }
    apps.forEach(function (a) {
      a.el.addEventListener('pointerenter', function () { hotOn(a); });
      a.el.addEventListener('pointerleave', function () { hotOff(a); });
      a.el.addEventListener('focus', function () { hotOn(a); });
      a.el.addEventListener('blur', function () { hotOff(a); });
    });
    window.addEventListener('resize', function () { if (on) { size(); layout(performance.now(), 0); } else measured = false; });
    // the stage and the dashboard are measured when they are first laid out and whenever they change size
    watchSize([root, core], function () {
      var changed = (root.offsetWidth || 1) !== W || (root.offsetHeight || 1) !== H;
      size();
      if (on && changed) layout(performance.now(), 0);
    });
    build();
    return {
      root: root,
      enter: function (first) {
        on = true;
        if (!measured || !hasRO) size();               // normally already measured: no layout read on a slide change
        if (fxDirty) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, fx.width, fx.height); fxDirty = false; }   // size() used to clear it
        var now = performance.now();
        if (reduce) { startRush(now); layout(now, 0); return; }
        // hold the apps off-stage until the camera has nearly settled, then rush them in (phones have no camera move)
        apps.forEach(function (a) { a.fly = null; a.landed = false; setOp(a, '0'); });
        startRush(now + (first ? 900 : phone.matches ? 260 : 1250));
        wake();
      },
      leave: function () { on = false; hot = null; root.classList.remove('is-focus', 'is-drag'); dragging = false; },
      wake: wake
    };
  }

  /* ================================================================== 2 · process map */
  function PMap(root) {
    var view = $('.pm-view', root), cam = $('.pm-cam', root), svg = $('.pm-svg', root), labels = $('.pm-elabels', root);
    var log = $('.pm-log', root), kFlight = $('[data-k="flight"]', root), kHand = $('[data-k="hand"]', root);
    var nodes = {};
    $$('.pm-node', root).forEach(function (el) { nodes[el.dataset.pn] = { el: el, ic: $('.pm-ic', el), n: $('.pm-n', el), count: 0, gate: el.classList.contains('pm-gate') }; });
    // route kinds: h straight · v vertical (node bottom → icon top) · vh down-then-across · hv across-then-up/down
    //              loop back above two nodes · self loop above a gateway · bus under a lane
    var EDGES = {
      e1: { a: 'lead', b: 'quote', r: 'h' }, e2: { a: 'quote', b: 'g_sign', r: 'h' },
      e3: { a: 'g_sign', b: 'order', r: 'h', l: 'signed' }, e4: { a: 'g_sign', b: 'quote', r: 'loop', l: 'no · revise', dash: 1 },
      e5: { a: 'order', b: 'g_stock', r: 'v' }, e6: { a: 'g_stock', b: 'pick', r: 'h', l: 'in stock', lt: .3 },
      e7: { a: 'g_stock', b: 'mo', r: 'vh', l: 'make', lt: .8 }, e8: { a: 'g_stock', b: 'po', r: 'vh', l: 'buy', lt: .86 },
      e9: { a: 'mo', b: 'po', r: 'v', l: 'components', dash: 1 }, e10: { a: 'mo', b: 'g_qc', r: 'h' },
      e11: { a: 'g_qc', b: 'pick', r: 'hv', o: 7, l: 'pass', lt: .22 }, e12: { a: 'g_qc', b: 'mo', r: 'loop', l: 'fail · rework', dash: 1 },
      e13: { a: 'po', b: 'receipt', r: 'h' }, e14: { a: 'receipt', b: 'pick', r: 'hv', o: -7, l: 'received', lt: .2 },
      e15: { a: 'receipt', b: 'vbill', r: 'v', l: '3-way match' }, e16: { a: 'vbill', b: 'vpay', r: 'h' },
      e17: { a: 'pick', b: 'ship', r: 'h' }, e18: { a: 'ship', b: 'inv', r: 'v', l: 'on delivery', lt: .45 },
      e19: { a: 'inv', b: 'g_paid', r: 'h' }, e20: { a: 'g_paid', b: 'recon', r: 'h', l: 'paid' },
      e21: { a: 'g_paid', b: 'g_paid', r: 'self', l: 'overdue · reminder', dash: 1 }, e22: { a: 'vpay', b: 'recon', r: 'bus', l: 'bank feed' },
      e23: { a: 'recon', b: 'reports', r: 'h' }
    };
    var HEAD = ['e1', 'e2'], SIGN = ['e3', 'e5'], SIGN_NO = ['e4', 'e2', 'e3', 'e5'];
    var SHIP = ['e17', 'e18', 'e19'], PAID = ['e20', 'e23'], LATE = ['e21', 'e20', 'e23'];
    var PAY = { fork: ['e15', 'e16', 'e22'], c: 'pay' }, MAKE_PAY = { fork: ['e9', 'e13', 'e15', 'e16', 'e22'], c: 'pay' };
    function route(kind, o) {
      o = o || {};
      var r = HEAD.concat(o.noSign ? SIGN_NO : SIGN);
      if (kind === 'stock' || kind === 'late') r = r.concat(['e6']);
      if (kind === 'buy') r = r.concat(['e8', 'e13', PAY, 'e14']);
      if (kind === 'make') r = r.concat(['e7', MAKE_PAY, 'e10'], o.qcFail ? ['e12', 'e10'] : [], ['e11']);
      r = r.concat(SHIP, kind === 'late' || o.late ? (o.late2 ? ['e21'].concat(LATE) : LATE) : PAID);
      return r;
    }
    var SCEN = {
      all: function () { var k = Math.random(); return k < .42 ? 'stock' : k < .66 ? 'buy' : k < .88 ? 'make' : 'late'; },
      stock: function () { return 'stock'; }, buy: function () { return 'buy'; }, make: function () { return 'make'; }, late: function () { return 'late'; }
    };
    var PATHS = {
      stock: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports'],
      buy: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'po', 'receipt', 'vbill', 'vpay', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports'],
      make: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'mo', 'g_qc', 'po', 'receipt', 'vbill', 'vpay', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports'],
      late: ['lead', 'quote', 'g_sign', 'order', 'g_stock', 'pick', 'ship', 'inv', 'g_paid', 'recon', 'reports']
    };
    var EPATHS = {
      stock: ['e1', 'e2', 'e3', 'e5', 'e6', 'e17', 'e18', 'e19', 'e20', 'e23'],
      buy: ['e1', 'e2', 'e3', 'e5', 'e8', 'e13', 'e14', 'e15', 'e16', 'e22', 'e17', 'e18', 'e19', 'e20', 'e23'],
      make: ['e1', 'e2', 'e3', 'e5', 'e7', 'e9', 'e10', 'e11', 'e12', 'e13', 'e15', 'e16', 'e22', 'e17', 'e18', 'e19', 'e20', 'e23'],
      late: ['e1', 'e2', 'e3', 'e5', 'e6', 'e17', 'e18', 'e19', 'e21', 'e20', 'e23']
    };
    var TIPS = {
      lead: 'Web form, email or WhatsApp → lead assigned', quote: 'Template + pricelist → sent to sign online',
      g_sign: 'Signed → order · no reply → revise and resend', order: 'Confirm → delivery created, stock checked',
      g_stock: 'Routes decide: reserve, buy or manufacture', mo: 'Bill of materials → work orders, components used',
      g_qc: 'Control point: pass → stock · fail → quality alert', po: 'Reorder rule → RFQ with vendor price and lead time',
      receipt: 'Barcode receipt → stock in, bill allowed', vbill: 'Digitised bill matched to order and receipt',
      vpay: 'Batch payment of bills due', pick: 'Barcode picking, packing, carrier label',
      ship: 'Validate → stock out, invoice ready', inv: 'From delivered quantities, with a payment link',
      g_paid: 'Bank feed match · overdue → follow-up level', recon: 'Reconciliation rules match the statement',
      reports: 'P&L, GST and cash forecast, no exports'
    };
    var W = 1, H = 1, geoE = {}, tokens = [], raf = 0, last = 0, on = false, scen = 'all', nextSpawn = 0, hand = 0, revealing = null, panning = null, hotNode = null, leaveT = 0;
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { view.addEventListener(ev, function () { panning = null; }, { passive: true }); });
    var DOC = { S: 419, PO: 88, MO: 31, IN: 231, OUT: 412, INV: 147 };
    // measured geometry (offsets inside the camera, so camera moves never change it), the edge label
    // elements and the last in-flight count, so frames read nothing from layout
    var NB = {}, IB = {}, VW = 1, VH = 1, room = 0, drawn = false, labelOf = {}, flightN = -1, PT = { x: 0, y: 0 };

    function nb(id) { return NB[id] || box(nodes[id].el, cam); }
    function ib(id) { return IB[id] || box(nodes[id].ic, cam); }
    function measure() {                               // every read draw() needs, before it writes anything
      var m = { W: cam.offsetWidth || 1, H: cam.offsetHeight || 1, VW: view.offsetWidth, VH: view.offsetHeight, room: view.scrollWidth - view.clientWidth, NB: {}, IB: {} };
      Object.keys(nodes).forEach(function (id) { m.NB[id] = box(nodes[id].el, cam); m.IB[id] = box(nodes[id].ic, cam); });
      return m;
    }
    function sameGeo(m) {
      if (m.W !== W || m.H !== H || m.VW !== VW || m.VH !== VH || m.room !== room) return false;
      return Object.keys(nodes).every(function (id) {
        var a = m.NB[id], b = NB[id], c = m.IB[id], d = IB[id];
        return b && d && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h && c.x === d.x && c.y === d.y && c.w === d.w && c.h === d.h;
      });
    }
    function edgeD(e) {
      var A = ib(e.a), B = ib(e.b), An = nb(e.a), Bn = nb(e.b), g = 4, o = e.o || 0;
      switch (e.r) {
        case 'h': return rounded([[A.r + g, A.cy], [B.x - g - 3, B.cy]], 0);
        case 'v': return rounded([[An.cx, An.b + 1], [B.cx, B.y - g - 3]], 0);
        case 'vh': return rounded([[An.cx, An.b + 1], [An.cx, B.cy], [B.x - g - 3, B.cy]], 10);
        case 'hv': return rounded([[A.r + g, A.cy], [B.cx + o, A.cy], [B.cx + o, Bn.b + g + 3]], 10);
        case 'loop': var top = Math.min(A.y, B.y) - 17;
          return rounded([[A.cx, A.y - g], [A.cx, top], [B.cx + 6, top], [B.cx + 6, B.y - g - 3]], 9);
        case 'self': return 'M' + (A.cx - 7) + ' ' + (A.y - 2) + 'C' + (A.cx - 30) + ' ' + (A.y - 38) + ' ' + (A.cx + 30) + ' ' + (A.y - 38) + ' ' + (A.cx + 7) + ' ' + (A.y - 5);
        case 'bus': var y = Math.max(An.b, Bn.b) + 9;
          return rounded([[An.cx, An.b + 1], [An.cx, y], [Bn.cx, y], [Bn.cx, Bn.b + 4]], 7);
      }
      return '';
    }
    // Builds the edges from measured geometry. Runs when the map is first laid out and when it changes
    // (ResizeObserver, window resize, web fonts), not on every slide change as before: the result is the same.
    function draw(m) {
      m = m || measure();
      W = m.W; H = m.H; VW = m.VW; VH = m.VH; room = m.room; NB = m.NB; IB = m.IB;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var html = '<defs><marker id="pm-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 8.5 5 1 8.5z"/></marker>' +
        '<marker id="pm-arrow-hot" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 8.5 5 1 8.5z"/></marker></defs><g class="pm-edges"></g><g class="pm-toks"></g>';
      svg.innerHTML = html;
      var ge = $('.pm-edges', svg), lab = '', made = [];
      Object.keys(EDGES).forEach(function (id) {       // all the writes first ...
        var e = EDGES[id], p = svgEl('path', { d: edgeD(e), 'class': 'pm-e' + (e.dash ? ' pm-e--dash' : ''), 'data-e': id, 'marker-end': 'url(#pm-arrow)' });
        ge.appendChild(p); made.push([id, e, p]);
      });
      made.forEach(function (x) {                      // ... then the path reads, 2 px apart along each edge
        var id = x[0], e = x[1], p = x[2], T = pathTable(p, 2);
        geoE[id] = { p: p, len: T.len, T: T };
        if (e.l) { var pt = p.getPointAtLength(T.len * (e.lt || .5)); lab += '<span class="pm-el' + (e.dash ? ' pm-el--dash' : '') + '" data-e="' + id + '" style="left:' + pt.x.toFixed(1) + 'px;top:' + pt.y.toFixed(1) + 'px">' + e.l + '</span>'; }
      });
      labels.innerHTML = lab;
      labelOf = {}; $$('.pm-el', labels).forEach(function (n) { labelOf[n.getAttribute('data-e')] = n; });
      tokens.forEach(function (t) { $('.pm-toks', svg).appendChild(t.g); });
      markScen();
      drawn = true;
    }
    function markScen() {
      var np = scen === 'all' ? null : PATHS[scen], ep = scen === 'all' ? null : EPATHS[scen];
      root.classList.toggle('is-scen', !!np);
      Object.keys(nodes).forEach(function (id) { nodes[id].el.classList.toggle('is-path', !!np && np.indexOf(id) >= 0); });
      $$('[data-e]', root).forEach(function (el) { el.classList.toggle('is-path', !!ep && ep.indexOf(el.getAttribute('data-e')) >= 0); });
    }
    function color(kind) { return kind === 'buy' ? 'buy' : kind === 'make' ? 'make' : kind === 'late' ? 'late' : kind === 'pay' ? 'pay' : 'stock'; }
    function makeToken(steps, kind, doc, at, detached) {
      var g = svgEl('g', { 'class': 'pm-tok pm-tok--' + color(kind) });
      g.appendChild(svgEl('circle', { r: 10, 'class': 'pm-th' })); g.appendChild(svgEl('circle', { r: 4.6, 'class': 'pm-td' }));
      $('.pm-toks', svg).appendChild(g);
      var t = { g: g, steps: steps, i: 0, s: 0, wait: 0, state: 'move', kind: kind, doc: doc, v: rnd(150, 185) };
      if (at) { t.i = Math.min(steps.length - 1, at); while (t.i < steps.length && typeof steps[t.i] !== 'string') t.i++; }
      var first = geoE[steps[t.i]];
      if (first) { var p0 = tableAt(first.T, 0, PT); g.setAttribute('transform', 'translate(' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ')'); }
      if (!detached) tokens.push(t);
      return t;
    }
    function spawn(kindOverride, at) {
      var kind = kindOverride || SCEN[scen]();
      var o = { noSign: Math.random() < .18, qcFail: Math.random() < .35, late: kind === 'late', late2: kind === 'late' && Math.random() < .3 };
      var doc = { S: ++DOC.S, OUT: ++DOC.OUT, INV: ++DOC.INV };
      if (kind === 'buy' || kind === 'make') doc.PO = ++DOC.PO;
      if (kind === 'make') doc.MO = ++DOC.MO;
      makeToken(route(kind, o), kind, doc, at);
    }
    function say(kind, html) {
      var li = document.createElement('li');
      li.className = 'pm-l--' + color(kind);
      li.innerHTML = '<i></i><span>' + html + '</span>';
      log.insertBefore(li, log.firstChild);
      var rows = $$('li', log); while (rows.length > 4) rows.pop().remove();
    }
    function hit(id, t, nextId) {
      var n = nodes[id]; if (!n) return;
      n.count++; n.n.textContent = n.count > 99 ? '99+' : String(n.count); n.el.classList.add('has-n');
      replay(n.el, 'is-pulse', ['pmPulse', 'pmGate']);
      hand++; kHand.textContent = hand.toLocaleString();
      if (nextId) {
        replay(labelOf[nextId], 'is-take', ['pmLab']);
        replay(geoE[nextId] && geoE[nextId].p, 'is-take', ['pmTake']);
      }
      var d = t.doc, k = t.kind;
      switch (id) {
        case 'lead': if (Math.random() < .5) say(k, 'New lead from the <b>website form</b>'); break;
        case 'g_sign': say(k, nextId === 'e4' ? 'No signature yet: quotation <b>revised</b>' : '<b>S00' + d.S + '</b> signed online, order confirmed'); break;
        case 'g_stock': say(k, nextId === 'e6' ? 'Stock reserved for <b>S00' + d.S + '</b>' : nextId === 'e8' ? 'Reorder rule raised <b>PO000' + d.PO + '</b>' : '<b>MO/000' + d.MO + '</b> created from the bill of materials'); break;
        case 'g_qc': say(k, nextId === 'e12' ? 'Quality alert on <b>MO/000' + d.MO + '</b>: rework' : 'Quality check passed on <b>MO/000' + d.MO + '</b>'); break;
        case 'receipt': if (!t.fork) say(k, '<b>WH/IN/00' + (++DOC.IN) + '</b> received by barcode'); break;
        case 'vbill': say('pay', 'Vendor bill matched to <b>PO000' + d.PO + '</b> and receipt'); break;
        case 'ship': say(k, '<b>WH/OUT/00' + d.OUT + '</b> delivered, invoice ready'); break;
        case 'g_paid': if (nextId === 'e21') say('late', '<b>INV/2026/0' + d.INV + '</b> overdue: reminder sent');
                       else if (nextId === 'e20') say(k, 'Payment matched from the <b>bank feed</b>'); break;
        case 'reports': if (Math.random() < .5) say(k, 'P&amp;L and cash forecast <b>updated</b>'); break;
      }
    }
    function stepTokens(dt) {
      var born = [];
      tokens = tokens.filter(function (t) {
        var step = t.steps[t.i];
        if (step && typeof step !== 'string') {                   // fork: a payables token splits off here
          var child = makeToken(step.fork, step.c, t.doc, 0, true); child.fork = true; born.push(child);
          if (step === MAKE_PAY) say('pay', 'Components short: <b>PO000' + t.doc.PO + '</b> to the vendor');
          t.i++; step = t.steps[t.i];
        }
        if (!step) { t.g.remove(); return false; }
        var e = EDGES[step], ge = geoE[step];
        if (t.state === 'move') {
          t.s += t.v * dt;
          if (t.s >= ge.len) {
            t.s = ge.len; t.state = 'node'; t.wait = nodes[e.b].gate ? .42 : .26;
            var nxt = t.steps[t.i + 1]; if (nxt && typeof nxt !== 'string') nxt = t.steps[t.i + 2];
            hit(e.b, t, nxt);
            t.g.classList.add('is-in');
          }
          var pt = tableAt(ge.T, t.s, PT);
          t.g.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
        } else {
          t.wait -= dt;
          if (t.wait <= 0) {
            t.i++; t.s = 0; t.state = 'move'; t.g.classList.remove('is-in');
            if (t.i >= t.steps.length) { t.g.remove(); return false; }
          }
        }
        return true;
      });
      if (born.length) tokens = tokens.concat(born);
      if (flightN !== tokens.length) { flightN = tokens.length; kFlight.textContent = String(flightN); }
    }
    // cinematic reveal: the camera starts close on the first lead, flies the sales lane, then pulls back
    function camAt(fx, fy, s) {
      var vw = VW, vh = VH;                            // the panel's size, measured in draw()
      var tx = clamp(vw * .42 - fx * s, vw - W * s, 0), ty = clamp(vh * .5 - fy * s, vh - H * s, 0);
      cam.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
    }
    function reveal(now) {
      var r = revealing, t = now - r.t0;
      if (t < 0) { camAt(r.keys[0].x, r.keys[0].y, r.keys[0].s); return; }
      var K = r.keys, total = K[K.length - 1].t;
      if (t >= total) { cam.style.transform = ''; showAll(); return; }
      var i = 0; while (i < K.length - 2 && t > K[i + 1].t) i++;
      var a = K[i], b = K[i + 1], q = easeInOut(clamp((t - a.t) / (b.t - a.t), 0, 1));
      camAt(lerp(a.x, b.x, q), lerp(a.y, b.y, q), lerp(a.s, b.s, q));
      // draw edges and pop nodes as the camera passes them
      var edgeX = lerp(a.x, b.x, q) + VW * .45 / lerp(a.s, b.s, q);
      Object.keys(nodes).forEach(function (id) { var n = nodes[id]; if (!n.in && n.cx < edgeX) { n.in = true; n.el.classList.add('is-in'); } });
      Object.keys(geoE).forEach(function (id) { var g = geoE[id]; if (!g.in && g.x0 < edgeX) { g.in = true; g.p.classList.add('is-in'); } });
    }
    function showAll() {
      revealing = null; root.classList.remove('is-reveal'); root.classList.add('is-ready');
      Object.keys(nodes).forEach(function (id) { nodes[id].in = true; nodes[id].el.classList.add('is-in'); });
      Object.keys(geoE).forEach(function (id) { geoE[id].in = true; geoE[id].p.classList.add('is-in'); });
    }
    function startReveal(now, delay) {
      $$('.pm-node', root).forEach(function (el) { el.classList.remove('is-in'); });
      Object.keys(nodes).forEach(function (id) { var b = ib(id); nodes[id].in = false; nodes[id].cx = b.cx; });
      Object.keys(geoE).forEach(function (id) {
        var g = geoE[id]; g.in = false; g.x0 = g.T.xy[0];   // the edge's first point (getPointAtLength(0))
        // hide without animating the un-draw, then let the reveal draw it in
        g.p.style.transition = 'none'; g.p.style.setProperty('--len', g.len.toFixed(1)); g.p.classList.remove('is-in');
      });
      // commit the no-transition style with a style-only read (computed stroke-dashoffset needs no layout)
      Object.keys(geoE).forEach(function (id) { void getComputedStyle(geoE[id].p).strokeDashoffset; });
      Object.keys(geoE).forEach(function (id) { geoE[id].p.style.transition = ''; });
      if (reduce) { showAll(); return; }
      // phones: the map scrolls sideways in its panel, so instead of a zoom the view pans across it once
      if (phone.matches) { showAll(); panning = { t0: now + delay, dur: 5200 }; view.scrollLeft = 0; return; }
      var L = ib('lead'), O = ib('order'), S = ib('g_stock'), P = ib('receipt');
      root.classList.add('is-reveal'); root.classList.remove('is-ready');
      revealing = { t0: now + delay, keys: [
        { t: 0, x: L.cx, y: L.cy, s: 2.35 }, { t: 1000, x: O.cx, y: O.cy + 10, s: 2.05 },
        { t: 1750, x: (S.cx + P.cx) / 2, y: (S.cy + P.cy) / 2, s: 1.55 }, { t: 2750, x: W / 2, y: H / 2, s: 1 }] };
    }
    function frame() {
      // one clock for everything (rAF stamps and performance.now() can differ)
      var now = performance.now();
      raf = 0;
      if (!on || !live()) return;
      var dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      if (revealing) reveal(now);
      if (panning) {
        var pq = clamp((now - panning.t0) / panning.dur, 0, 1);   // room: measured in draw()
        if (pq > 0 && room > 0) view.scrollLeft = room * (pq < .72 ? easeInOut(pq / .72) : 1 - easeInOut((pq - .72) / .28) * .92);
        if (pq >= 1) panning = null;
      }
      if (!revealing) {
        if (!popOpen()) {
          stepTokens(dt);
          if (now > nextSpawn && tokens.length < 8) { spawn(); nextSpawn = now + rnd(1100, 1900); }
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function wake() { if (on && !raf && !reduce && live()) { last = 0; raf = requestAnimationFrame(frame); } }
    function seed() {
      // the business is already running when the camera pulls back: a few orders mid-way
      tokens.forEach(function (t) { t.g.remove(); }); tokens = [];
      spawn('stock', 6); spawn('buy', 4); spawn('make', 5); spawn('late', 9); spawn(null, 1);
    }
    // scenario switch
    $$('[data-scen]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        scen = b.dataset.scen;
        $$('[data-scen]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        markScen();
        if (scen !== 'all') {
          tokens.forEach(function (t) { if (t.kind !== scen && !(t.fork && scen !== 'stock' && scen !== 'late')) t.g.remove(); });
          tokens = tokens.filter(function (t) { return t.g.isConnected; });
          spawn(null, 0); spawn(null, 5);
        }
        nextSpawn = performance.now() + 900;
      });
    });
    // hover a step: light its hand-offs in and out
    function hotOn(id) {
      if (leaveT) { clearTimeout(leaveT); leaveT = 0; }
      hotNode = id; root.classList.add('is-peek');
      Object.keys(nodes).forEach(function (k) { nodes[k].el.classList.toggle('is-hot', k === id); });
      Object.keys(EDGES).forEach(function (eid) {
        var e = EDGES[eid], on2 = e.a === id || e.b === id;
        $$('[data-e="' + eid + '"]', root).forEach(function (el) { el.classList.toggle('is-hot', on2); });
        if (on2) { nodes[e.a].el.classList.add('is-near'); nodes[e.b].el.classList.add('is-near'); }
      });
      var tip = $('.pm-tip', root) || (function () { var d = document.createElement('div'); d.className = 'pm-tip'; cam.appendChild(d); return d; })();
      var b = nb(id);
      tip.textContent = TIPS[id] || '';
      tip.style.left = b.cx.toFixed(1) + 'px'; tip.style.top = (b.y - 6).toFixed(1) + 'px';
      tip.classList.toggle('pm-tip--low', b.y < 60);
      if (b.y < 60) tip.style.top = (b.b + 6).toFixed(1) + 'px';
      tip.classList.add('is-on');
    }
    function hotOff() {
      if (leaveT) clearTimeout(leaveT);
      leaveT = setTimeout(function () {
        leaveT = 0; hotNode = null; root.classList.remove('is-peek');
        $$('.is-hot,.is-near', root).forEach(function (el) { el.classList.remove('is-hot', 'is-near'); });
        var tip = $('.pm-tip', root); if (tip) tip.classList.remove('is-on');
      }, 140);
    }
    Object.keys(nodes).forEach(function (id) {
      var el = nodes[id].el;
      el.addEventListener('pointerenter', function () { hotOn(id); }); el.addEventListener('pointerleave', hotOff);
      el.addEventListener('focus', function () { hotOn(id); }); el.addEventListener('blur', hotOff);
    });
    // moving over the map during the fly-through hands control back at once
    view.addEventListener('pointermove', function () {
      if (!revealing) return;
      var now = performance.now(), cur = revealing.keys, total = cur[cur.length - 1].t;
      if (now - revealing.t0 < total - 450) revealing.t0 = now - (total - 450);
    });
    window.addEventListener('resize', function () { if (on) { cam.style.transform = ''; draw(); showAll(); } else drawn = false; });
    watchSize([view, cam], function () {
      var m = measure();                               // layout is clean inside a ResizeObserver callback
      if (drawn && sameGeo(m)) return;
      if (!on) { draw(m); return; }                    // off-stage: redraw now, invisibly
      if (m.W !== W || m.H !== H || m.VW !== VW || m.VH !== VH) { cam.style.transform = ''; draw(m); showAll(); }   // a real resize
      else drawn = false;                              // text moved inside (web fonts): redraw on the next entry
    });
    return {
      root: root,
      enter: function (first) {
        on = true; cam.style.transform = '';
        if (!drawn || !hasRO) draw();                  // normally drawn already: no layout read on a slide change
        startReveal(performance.now(), first ? 700 : 1150);
        if (!reduce) seed();
        nextSpawn = performance.now() + 4000;
        wake();
      },
      leave: function () { on = false; revealing = null; root.classList.remove('is-reveal'); cam.style.transform = ''; },
      wake: wake
    };
  }

  /* ================================================================== 3 · launch path */
  function Journey(root) {
    // Five raised platforms climb to go-live along a lit path. The project (the orb) glides from phase to
    // phase, each phase's deliverables rise and tick off, and light beams show which offices (SG · PH · VN)
    // and your team are on it. Drag the timeline, click a platform, or let it run. The phases, deliverables
    // and owners come from the screen-reader list in the markup (.lj-plan), which search engines read too.
    var stage = $('.lj-stage', root), svg = $('.lj-svg', root), over = $('.lj-over', root), tip = $('.lj-tip', root);
    var scrub = $('.lj-scrub', root), segsEl = $('.lj-segs', root), fillEl = $('.lj-fill', root), knob = $('.lj-knob', root);
    var weekEl = $('[data-lj-week]', root), ringEl = $('.lj-ring-fg', root), statusEl = $('[data-lj-status]', root);
    var whoEl = $('.lj-who', root), moreEl = $('.lj-more', root), moreTx = $('.lj-more span', root);
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var SPAN = 12, RATE = .9, TRAVEL = .7;                    // weeks per second; weeks the orb takes between platforms
    var OFF = { sg: ['SG', 'Singapore'], ph: ['PH', 'Taguig'], vn: ['VN', 'Ho Chi Minh'], you: ['You', 'your team'] };
    var PH = $$('.lj-plan > li', root).map(function (li, i) {
      var desc = $('span', li).textContent;
      return { i: i, s: +li.dataset.s, e: +li.dataset.e, name: $('b', li).textContent, desc: desc, when: desc.split('.')[0],
               who: (li.dataset.who || '').split(' ').filter(Boolean), whoText: li.dataset.w || '', href: li.dataset.href || '',
               more: li.dataset.more || '', icon: $('.lj-ic svg', li),
               items: $$('li', li).map(function (d) { return { s: +d.dataset.s, e: +d.dataset.e, o: d.dataset.o || 'tn', t: d.textContent.trim() }; }) };
    });
    if (!PH.length) return { root: root, enter: function () {}, leave: function () {}, wake: function () {} };
    // two stagings of the same path: a rising staircase for the wide card, a switchback for phones
    var GEO = {
      wide: { w: 640, h: 340, rx: 46, ry: 23, band: false,
              p: [[82, 262, 12], [200, 236, 20], [318, 212, 28], [436, 186, 36], [554, 160, 44]],
              off: { sg: [52, 34], ph: [112, 22], vn: [172, 34], you: [598, 302] } },
      tall: { w: 360, h: 470, rx: 40, ry: 20, band: true,
              p: [[88, 414, 10], [262, 352, 16], [98, 280, 22], [262, 208, 28], [104, 138, 34]],
              off: { you: [40, 98], sg: [226, 98], ph: [270, 98], vn: [314, 98] } }
    };
    var G = null, K = 1, P = [], L = [], total = 1, base, prog, flowMask, puck, ptag, world, gridG, trail = [], hist = [];
    // the path's arc-length table and the measured widths (from the ResizeObserver), so frames read no layout
    var LUT = null, PTJ = { x: 0, y: 0 }, stageW = 0, scrubW = 0, placedK = 0, lastPc = null;
    var plats = [], shades = [], beams = {}, offs = {}, nodes = [], chips = [], chipsWrap = null, beamT = 0;
    var T = 0, shown = 0, on = false, raf = 0, last = 0, holdUntil = 0, doneAt = 0, active = -1, dragging = false, hoverI = -1, resetting = false;
    var tilt = { x: 0, y: 0, tx: 0, ty: 0 }, cache = {};
    root.classList.add('is-js');

    function pathD(pts) { return 'M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; }
    function spline(pts) {                                    // Catmull-Rom through the platform tops, as cubic Béziers
      var d = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
             (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
      }
      return d;
    }
    function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
    function at(n, x, y, w, h) { n.dataset.x = x; n.dataset.y = y; if (w) { n.dataset.w = w; n.dataset.h = h; } return n; }
    function tick() {
      var s = svgEl('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' });
      s.appendChild(svgEl('path', { d: 'M5 12.5l4.5 4.5L19 7.5' }));
      return s;
    }
    function beamD(o, q) {
      var mx = (o[0] + q[0]) / 2, my = o[1] < q[1] ? Math.min(o[1], q[1]) - 34 : Math.max(o[1], q[1]) + 30;
      return 'M' + o[0] + ' ' + o[1] + 'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + q[0] + ' ' + q[1];
    }

    function build() {
      G = phone.matches ? GEO.tall : GEO.wide;
      root.classList.toggle('lj--tall', G.band);
      stage.style.aspectRatio = G.w + ' / ' + G.h;
      svg.setAttribute('viewBox', '0 0 ' + G.w + ' ' + G.h);
      svg.textContent = ''; over.textContent = '';
      plats = []; shades = []; beams = {}; offs = {}; nodes = []; trail = []; hist = []; chips = []; chipsWrap = null; cache = {}; active = -1;
      P = G.p.map(function (q) { return { x: q[0], y: q[1], h: q[2] }; });
      var defs = svgEl('defs', {});
      var lg = svgEl('linearGradient', { id: 'lj-grad', x1: '0', y1: '1', x2: '1', y2: '0' });
      lg.appendChild(svgEl('stop', { offset: '0', 'stop-color': '#6FA0F5' })); lg.appendChild(svgEl('stop', { offset: '1', 'stop-color': '#3167CA' }));
      var rg = svgEl('radialGradient', { id: 'lj-fade', cx: '50%', cy: '58%', r: '60%' });
      rg.appendChild(svgEl('stop', { offset: '0', 'stop-color': '#fff' })); rg.appendChild(svgEl('stop', { offset: '1', 'stop-color': '#000' }));
      var gm = svgEl('mask', { id: 'lj-gridmask' }); gm.appendChild(svgEl('rect', { x: 0, y: 0, width: G.w, height: G.h, fill: 'url(#lj-fade)' }));
      defs.appendChild(lg); defs.appendChild(rg); defs.appendChild(gm); svg.appendChild(defs);
      // an isometric floor that fades out towards the edges
      gridG = svgEl('g', { 'class': 'lj-grid', mask: 'url(#lj-gridmask)' });
      for (var k = -G.h * 2; k < G.w + G.h * 2; k += 26) {
        gridG.appendChild(svgEl('line', { x1: k, y1: 0, x2: k + G.h * 2, y2: G.h }));
        gridG.appendChild(svgEl('line', { x1: k, y1: 0, x2: k - G.h * 2, y2: G.h }));
      }
      svg.appendChild(gridG);
      world = svgEl('g', { 'class': 'lj-world' }); svg.appendChild(world);
      var sg = svgEl('g', {}); world.appendChild(sg);
      P.forEach(function (q) { var e = svgEl('ellipse', { 'class': 'lj-shade', cx: q.x, cy: q.y + G.ry + q.h + 5, rx: G.rx * 1.02, ry: G.ry * .5 }); sg.appendChild(e); shades.push(e); });
      var bg = svgEl('g', {}); world.appendChild(bg);
      Object.keys(G.off).forEach(function (k) { beams[k] = svgEl('path', { 'class': 'lj-beam lj-beam--' + k }); bg.appendChild(beams[k]); });
      var d = spline(P.map(function (q) { return [q.x, q.y]; }));
      base = svgEl('path', { 'class': 'lj-track', d: d }); world.appendChild(base);
      total = base.getTotalLength() || 1;
      LUT = pathTable(base, 1);                          // the orb's positions, 1 px apart along the path
      prog = svgEl('path', { 'class': 'lj-prog', d: d, 'stroke-dasharray': total + ' ' + total, 'stroke-dashoffset': total }); world.appendChild(prog);
      var fm = svgEl('mask', { id: 'lj-flowmask', maskUnits: 'userSpaceOnUse' });
      flowMask = svgEl('path', { 'class': 'lj-flowmask', d: d, 'stroke-dasharray': total + ' ' + total, 'stroke-dashoffset': total });
      fm.appendChild(flowMask); defs.appendChild(fm);
      world.appendChild(svgEl('path', { 'class': 'lj-flow', d: d, mask: 'url(#lj-flowmask)' }));
      // where along the path each platform sits
      L = P.map(function (q, i) {
        if (!i) return 0;
        if (i === P.length - 1) return total;
        var best = 0, bd = 1e12;
        for (var s = 0; s <= 300; s++) {
          var len = total * s / 300, pt = base.getPointAtLength(len), dd = (pt.x - q.x) * (pt.x - q.x) + (pt.y - q.y) * (pt.y - q.y);
          if (dd < bd) { bd = dd; best = len; }
        }
        return best;
      });
      // the platforms: raised isometric prisms, each a step higher than the last
      P.forEach(function (q, i) {
        var x = q.x, y = q.y, rx = G.rx, ry = G.ry, h = q.h, g = svgEl('g', { 'class': 'lj-plat lj-c' + i });
        g.appendChild(svgEl('path', { 'class': 'lj-face lj-face--l', d: pathD([[x - rx, y], [x, y + ry], [x, y + ry + h], [x - rx, y + h]]) }));
        g.appendChild(svgEl('path', { 'class': 'lj-face lj-face--r', d: pathD([[x, y + ry], [x + rx, y], [x + rx, y + h], [x, y + ry + h]]) }));
        g.appendChild(svgEl('path', { 'class': 'lj-face lj-face--t', d: pathD([[x, y - ry], [x + rx, y], [x, y + ry], [x - rx, y]]) }));
        g.appendChild(svgEl('path', { 'class': 'lj-rim', d: pathD([[x, y - ry + 6], [x + rx - 12, y], [x, y + ry - 6], [x - rx + 12, y]]) }));
        world.appendChild(g); plats.push(g);
      });
      // the project: a soft comet trail and the orb
      for (var t = 0; t < 7; t++) { var c = svgEl('circle', { 'class': 'lj-trail', r: (5.2 - t * .6).toFixed(1), cx: -99, cy: -99 }); world.appendChild(c); trail.push(c); }
      puck = svgEl('g', { 'class': 'lj-puck' });
      puck.appendChild(svgEl('circle', { 'class': 'lj-halo', r: 17 }));
      puck.appendChild(svgEl('circle', { 'class': 'lj-core', r: 8.5 }));
      puck.appendChild(svgEl('circle', { 'class': 'lj-dot', r: 2.6 }));
      world.appendChild(puck);
      // upright labels, icons, hit areas and the offices, laid over the drawing
      P.forEach(function (q, i) {
        var ph = PH[i], hit = el('button', 'lj-hit'), badge = el('span', 'lj-badge lj-c' + i), lab = el('span', 'lj-lab lj-c' + i);
        hit.type = 'button'; hit.setAttribute('aria-label', ph.name + ', ' + ph.desc);
        at(hit, q.x, q.y + q.h / 2, G.rx * 2, G.ry * 2 + q.h + 30);
        if (ph.icon) badge.appendChild(ph.icon.cloneNode(true));
        var tk = el('i', 'lj-tick'); tk.appendChild(tick()); badge.appendChild(tk);
        at(badge, q.x, q.y - G.ry - 15);                      // floats over the platform's back corner
        lab.appendChild(el('b', null, ph.name)); lab.appendChild(el('small', null, ph.when));
        at(lab, q.x, q.y + G.ry + q.h + 9);
        over.appendChild(lab); over.appendChild(badge); over.appendChild(hit);
        nodes.push({ hit: hit, badge: badge, lab: lab });
        hit.addEventListener('pointerenter', function () { if (fine.matches) peek(i); });
        hit.addEventListener('pointerleave', function () { if (hoverI === i) unpeek(); });
        hit.addEventListener('focus', function () { peek(i); });
        hit.addEventListener('blur', unpeek);
        hit.addEventListener('click', function () { jump(PH[i].s + .02, 7000); if (!fine.matches) { peek(i); setTimeout(unpeek, 2600); } });
      });
      // the orb's name rides beside it (HTML, so the pill always fits its text)
      ptag = el('span', 'lj-ptag', 'Your Odoo'); over.appendChild(ptag);
      Object.keys(G.off).forEach(function (k) {
        var o = el('span', 'lj-off lj-off--' + k); o.appendChild(el('b', null, OFF[k][0])); o.appendChild(el('small', null, OFF[k][1]));
        at(o, G.off[k][0], G.off[k][1]); over.appendChild(o); offs[k] = o;
      });
      // the timeline under the stage: one segment per phase, sized by its weeks
      segsEl.textContent = '';
      PH.forEach(function (ph) { var s = el('span'); s.style.flex = String(ph.e - ph.s); s.appendChild(el('b', null, ph.name)); segsEl.appendChild(s); });
      // the fill spans the whole timeline and is clipped to the progress (see render), so it never relays out
      fillEl.style.width = '100%'; fillPc('0.00');
      placedK = 0; place();
    }
    // Positions the overlay in stage pixels. The stage width comes from the ResizeObserver; the nodes are
    // rewritten only when the scale changes (a phase change used to re-measure and rewrite all of them).
    function place() {
      if (!G) return;
      var w = stageW || (stageW = stage.clientWidth); if (!w) return;
      K = w / G.w;
      if (K !== placedK) {
        placedK = K;
        $$('[data-x]', over).forEach(function (n) {
          n.style.left = (+n.dataset.x * K).toFixed(1) + 'px'; n.style.top = (+n.dataset.y * K).toFixed(1) + 'px';
          if (n.dataset.w) { n.style.width = (+n.dataset.w * K).toFixed(1) + 'px'; n.style.height = (+n.dataset.h * K).toFixed(1) + 'px'; }
        });
      }
      if (chipsWrap && !G.band && active >= 0) { chipsWrap.style.left = (P[active].x * K).toFixed(1) + 'px'; chipsWrap.style.top = ((P[active].y - G.ry - 44) * K).toFixed(1) + 'px'; }
    }
    // Timeline progress without layout: the fill (a rounded bar with its gradient spread over the filled
    // part, as when its width was set) is clipped to the same rounded box, and the knob is translated.
    function fillPc(pc) {
      fillEl.style.clipPath = 'inset(0 ' + (100 - +pc).toFixed(2) + '% 0 0 round 999px)';
      fillEl.style.backgroundSize = pc + '% 100%';
    }
    function knobAt(pc) {
      lastPc = pc;
      var w = scrubW || (scrubW = scrub.clientWidth);
      knob.style.translate = (+pc / 100 * w).toFixed(2) + 'px 0';
    }

    function phaseAt(t) { for (var i = PH.length - 1; i > 0; i--) if (t >= PH[i].s) return i; return 0; }
    function puckLen(t) {
      var i = phaseAt(t), ph = PH[i];
      if (i === PH.length - 1) return total;
      var left = ph.e - t;
      if (left > TRAVEL) {                                    // on its platform: a slow drift across the top
        var u = clamp((t - ph.s) / Math.max(.01, ph.e - ph.s - TRAVEL), 0, 1);
        return clamp(L[i] - 5 + u * 10, 0, total);
      }
      return lerp(L[i] + 5, L[i + 1] - 5, easeInOut(1 - left / TRAVEL));
    }
    function setActive(i) {
      active = i; var ph = PH[i];
      plats.forEach(function (g, j) { g.classList.toggle('is-on', j === i); });
      shades.forEach(function (e, j) { e.classList.toggle('is-on', j === i); });
      nodes.forEach(function (n, j) { n.badge.classList.toggle('is-on', j === i); n.lab.classList.toggle('is-on', j === i); });
      Object.keys(beams).forEach(function (k) { beams[k].classList.remove('is-on'); offs[k].classList.toggle('is-on', ph.who.indexOf(k) >= 0); });
      clearTimeout(beamT);
      beamT = setTimeout(function () {                        // re-aim the beams while they are faded out
        if (active !== i) return;
        var q = P[i];
        Object.keys(beams).forEach(function (k) {
          beams[k].setAttribute('d', beamD(G.off[k], [q.x, q.y - G.ry - 15]));   // into the phase's icon
          if (ph.who.indexOf(k) >= 0) beams[k].classList.add('is-on');
        });
      }, 330);
      if (chipsWrap) { var old = chipsWrap; old.classList.add('is-gone'); setTimeout(function () { old.remove(); }, 450); }
      chipsWrap = el('div', 'lj-chips lj-c' + i);
      chips = ph.items.map(function (it) {
        var c = el('span', 'lj-chip lj-chip--' + (it.e <= it.s ? 'ms' : it.o)), ic = el('i');
        ic.appendChild(tick()); c.appendChild(ic); c.appendChild(el('b', null, it.t));
        var u = el('u'); c.appendChild(u); chipsWrap.appendChild(c);
        return { el: c, u: u, it: it, st: null };
      });
      over.appendChild(chipsWrap); place();
      moreEl.setAttribute('href', ph.href); moreTx.textContent = ph.more; whoEl.textContent = ph.whoText;
    }
    function set(key, v, fn) { if (cache[key] !== v) { cache[key] = v; fn(v); } }
    function render(dt) {
      var t = T, i = phaseAt(t);
      if (i !== active) setActive(i);
      var target = puckLen(t);
      shown = dt ? shown + (target - shown) * Math.min(1, dt * 9) : target;
      var len = clamp(shown, 0, total), pt = tableAt(LUT, len, PTJ);
      set('puck', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')', function (v) { puck.setAttribute('transform', v); });
      set('off', (total - len).toFixed(1), function (v) { prog.setAttribute('stroke-dashoffset', v); flowMask.setAttribute('stroke-dashoffset', v); });
      hist.unshift(pt.x, pt.y); if (hist.length > 64) hist.length = 64;
      trail.forEach(function (c, k) {
        var j = (k + 1) * 6;
        if (hist[j + 1] != null) set('t' + k, hist[j].toFixed(1) + ' ' + hist[j + 1].toFixed(1), function () { c.setAttribute('cx', hist[j].toFixed(1)); c.setAttribute('cy', hist[j + 1].toFixed(1)); });
      });
      // the active phase's deliverables: hidden, in progress (with a bar), then done
      chips.forEach(function (c) {
        var it = c.it, ms = it.e <= it.s, st = t < it.s - .02 ? '' : (ms ? t >= it.s : t >= it.e) ? 'done' : 'doing';
        if (st !== c.st) { c.st = st; c.el.classList.toggle('is-in', !!st); c.el.classList.toggle('is-done', st === 'done'); }
        if (st === 'doing') c.u.style.transform = 'scaleX(' + clamp((t - it.s) / (it.e - it.s), 0, 1).toFixed(3) + ')';
      });
      nodes.forEach(function (n, j) { var dn = t >= SPAN - .001 || j < i; if (n.dn !== dn) { n.dn = dn; n.badge.classList.toggle('is-done', dn); plats[j].classList.toggle('is-done', dn); } });
      var cur = null;
      chips.forEach(function (c) { if (!cur && c.st === 'doing') cur = c; });
      if (!cur) for (var k = chips.length - 1; k >= 0; k--) if (chips[k].st === 'done') { cur = chips[k]; break; }
      set('status', cur ? cur.it.t + (cur.st === 'done' ? ' ✓' : '') : PH[i].name, function (v) { statusEl.textContent = v; });
      var wk = Math.min(SPAN, Math.floor(t) + 1);
      set('week', wk, function (v) { weekEl.textContent = String(v); scrub.setAttribute('aria-valuetext', 'Week ' + v + ' · ' + PH[i].name); });
      set('ring', (100 - t / SPAN * 100).toFixed(2), function (v) { ringEl.style.strokeDashoffset = v; });
      var pc = (t / SPAN * 100).toFixed(2);
      set('fill', pc, fillPc);
      set('knob', pc, knobAt);
      set('now', t.toFixed(1), function (v) { scrub.setAttribute('aria-valuenow', v); });
      // parallax: the floor, the path and the labels drift by different amounts under the pointer
      tilt.x += (tilt.tx - tilt.x) * Math.min(1, (dt || 1) * 4); tilt.y += (tilt.ty - tilt.y) * Math.min(1, (dt || 1) * 4);
      set('grid', 'translate(' + (-tilt.x * 5).toFixed(2) + ' ' + (-tilt.y * 3).toFixed(2) + ')', function (v) { gridG.setAttribute('transform', v); });
      set('world', 'translate(' + (tilt.x * 3).toFixed(2) + ' ' + (tilt.y * 2).toFixed(2) + ')', function (v) { world.setAttribute('transform', v); });
      set('over', 'translate(' + (tilt.x * 5 * K).toFixed(2) + 'px,' + (tilt.y * 3.5 * K).toFixed(2) + 'px)', function (v) { over.style.transform = v; });
      // the tag follows the orb in the drawing's own parallax layer, not the overlay's
      set('ptag', 'translate(' + ((pt.x + 13 + tilt.x * 3 - tilt.x * 5) * K).toFixed(1) + 'px,' + ((pt.y + tilt.y * 2 - tilt.y * 3.5) * K).toFixed(1) + 'px) translateY(-50%)', function (v) { ptag.style.transform = v; });
    }
    function frame(now) {
      raf = 0;
      if (!on || !live()) return;
      var dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
      if (!reduce && !dragging && hoverI < 0 && now > holdUntil && !resetting) {
        if (T >= SPAN) {
          if (!doneAt) doneAt = now;
          else if (now - doneAt > 2400) {                     // all five done: fade the run out and start again
            resetting = true; root.classList.add('is-reset');
            setTimeout(function () { T = 0; shown = 0; hist = []; doneAt = 0; resetting = false; root.classList.remove('is-reset'); }, 500);
          }
        } else T = Math.min(SPAN, T + RATE * dt);
      }
      render(dt);
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf && on && live()) { last = 0; raf = requestAnimationFrame(frame); } }
    function hold(ms) { holdUntil = performance.now() + ms; }
    function jump(v, ms) { T = clamp(v, 0, SPAN); doneAt = 0; hold(ms); wake(); }
    function peek(i) {
      hoverI = i; var ph = PH[i], q = P[i];
      tip.textContent = '';
      tip.appendChild(el('b', null, ph.name + ' · ' + ph.when)); tip.appendChild(el('span', null, ph.desc.split('. ').slice(1).join('. ') || ph.desc));
      tip.appendChild(el('small', null, ph.whoText));
      tip.hidden = false;
      tip.style.left = clamp(q.x * K, 130, (stageW || stage.clientWidth) - 130).toFixed(1) + 'px';
      tip.style.top = ((q.y - G.ry - (G.band ? 36 : 40)) * K).toFixed(1) + 'px';
      nodes[i].badge.classList.add('is-peek'); plats[i].classList.add('is-peek');
    }
    function unpeek() {
      if (hoverI >= 0) { nodes[hoverI].badge.classList.remove('is-peek'); plats[hoverI].classList.remove('is-peek'); }
      hoverI = -1; tip.hidden = true; hold(1200); wake();
    }
    function tFromX(x) { var r = scrub.getBoundingClientRect(); return clamp((x - r.left) / r.width, 0, 1) * SPAN; }
    scrub.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      dragging = true; if (scrub.setPointerCapture) scrub.setPointerCapture(e.pointerId);
      jump(tFromX(e.clientX), 6000); e.preventDefault();
    });
    scrub.addEventListener('pointermove', function (e) { if (dragging) jump(tFromX(e.clientX), 6000); });
    scrub.addEventListener('pointerup', function () { dragging = false; hold(6000); });
    scrub.addEventListener('pointercancel', function () { dragging = false; });
    scrub.addEventListener('keydown', function (e) {
      var k = e.key, v = T;
      if (k === 'ArrowRight' || k === 'ArrowUp') v += .5; else if (k === 'ArrowLeft' || k === 'ArrowDown') v -= .5;
      else if (k === 'PageUp') v += 2; else if (k === 'PageDown') v -= 2; else if (k === 'Home') v = 0; else if (k === 'End') v = SPAN; else return;
      e.preventDefault(); e.stopPropagation(); jump(v, 8000); if (reduce) render(0);
    });
    stage.addEventListener('pointermove', function (e) {
      if (!fine.matches || reduce) return;
      var r = stage.getBoundingClientRect(); tilt.tx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); tilt.ty = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
    });
    stage.addEventListener('pointerleave', function () { tilt.tx = 0; tilt.ty = 0; });
    if (hasRO) {
      var jro = new ResizeObserver(function () {
        stageW = stage.clientWidth; scrubW = scrub.clientWidth;          // clean reads: layout is already done here
        if (!G || G.band !== phone.matches) { build(); if (on) render(0); } else { place(); if (lastPc != null) knobAt(lastPc); }
      });
      jro.observe(stage); jro.observe(scrub);
    } else window.addEventListener('resize', function () { stageW = stage.clientWidth; scrubW = scrub.clientWidth; build(); if (on) render(0); });
    build();
    return {
      root: root,
      enter: function (first) {
        on = true; if (!stageW) stageW = stage.clientWidth;             // normally measured already by the observer
        if (!G || G.band !== phone.matches || !stageW) build(); else place();
        T = reduce ? 10.7 : 0; shown = puckLen(T); doneAt = 0; hoverI = -1; resetting = false; root.classList.remove('is-reset');
        hold(first ? 900 : 1400); render(0); wake();
      },
      leave: function () { on = false; tip.hidden = true; },
      wake: wake
    };
  }

  /* ================================================================== wiring */
  var scenes = [];
  var c = $('[data-cine]', hero); if (c) scenes.push(Cine(c));
  var m = $('[data-pmap]', hero); if (m) scenes.push(PMap(m));
  var j = $('[data-journey]', hero); if (j) scenes.push(Journey(j));
  var current = null, first = true;
  function sceneOf(slide) { for (var i = 0; i < scenes.length; i++) if (slide.contains(scenes[i].root)) return scenes[i]; return null; }
  function activate(slide) {
    var s = slide ? sceneOf(slide) : null;
    if (current && current !== s) current.leave();
    current = s;
    if (s) { s.enter(first); first = false; }
  }
  function wakeAll() { if (current) current.wake(); }
  hero.addEventListener('tn:slide', function (e) { activate(e.detail && e.detail.slide); });
  document.addEventListener('visibilitychange', wakeAll);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { onScreen = es[es.length - 1].isIntersecting; wakeAll(); }, { threshold: .05 }).observe(hero);
  }
  function boot() { activate($('.slide.is-active', hero)); }
  if (document.documentElement.classList.contains('intro')) document.addEventListener('tn:intro-done', boot, { once: true });
  else boot();
})();
