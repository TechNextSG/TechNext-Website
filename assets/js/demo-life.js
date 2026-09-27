/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Odoo app pages: how a record moves through the app. The states, branches, hand-offs and
   automations are in the page (built from _src/app_flows.py); this script lays them out in the
   family's own form (rail, ladder, ring, funnel, board, hub, journey), then runs sample records
   through them: branches and loops taken at random, hand-offs into other apps lit and logged.
   Phones get the ladder. */
TN.demo('life', function (root, K) {
  var stage = K.$('.lf-stage', root), svg = K.$('.lf-svg', root), toksLayer = K.$('.lf-cards', root);
  var states = K.$$('.lf-states > li', root).map(function (li) { return { el: li, key: li.dataset.s, label: K.$('b', li).textContent, note: li.dataset.note || '', n: K.$('.lf-n', li), count: 0 }; });
  var byKey = {}; states.forEach(function (s, i) { s.i = i; byKey[s.key] = s; });
  var path = (root.dataset.path || '').split(',').filter(function (k) { return byKey[k]; });
  var branches = K.$$('.lf-branch', root).map(function (li) { return { el: li, from: li.dataset.from, to: li.dataset.to, label: K.$('span', li).textContent }; })
    .filter(function (b) { return byKey[b.from] && byKey[b.to]; });
  var hands = K.$$('.lf-hand > li', root).map(function (li) { return { el: li, at: li.dataset.at, text: K.$('small', li).textContent, app: K.$('b', li).textContent }; });
  var kFlow = K.$('[data-k="flow"]', root), kDone = K.$('[data-k="done"]', root), kExc = K.$('[data-k="exc"]', root), kHand = K.$('[data-k="hand"]', root);
  var log = K.$('.lf-log', root), record = root.dataset.record || 'record';
  var tip = K.tip(stage);
  var wantLayout = root.dataset.layout || 'rail', layout = wantLayout;
  var mq = window.matchMedia('(max-width: 640px)');
  var W = 1, H = 1, P = {}, edges = {}, tokens = [], nextSpawn = 0, speed = 1, forceExc = false, serial = 1000 + (Math.random() * 400 | 0);
  var nFlow = 0, nDone = 0, nExc = 0, nHand = 0, on = false;

  // ---------------------------------------------------------------- layouts: a position per state
  function place() {
    layout = mq.matches ? 'ladder' : wantLayout;
    root.classList.remove('lf--rail', 'lf--ladder', 'lf--ring', 'lf--funnel', 'lf--board', 'lf--hub', 'lf--journey');
    root.classList.add('lf--' + layout);
    W = stage.offsetWidth || 1; H = stage.offsetHeight || 1;
    var n = states.length, padX = Math.min(90, W * .1), padY = 46;
    states.forEach(function (s, i) {
      var t = n > 1 ? i / (n - 1) : .5, x, y;
      switch (layout) {
        case 'ladder': x = W * .3; y = padY - 12 + t * (H - 2 * padY + 24); break;
        case 'ring': var a = -Math.PI / 2 + i / n * Math.PI * 2, r = Math.min(W * .34, H * .38); x = W * .5 + Math.cos(a) * r * 1.25; y = H * .5 + Math.sin(a) * r; break;
        case 'hub': var b = -Math.PI / 2 + i / n * Math.PI * 2, rr = Math.min(W * .36, H * .4); x = W * .5 + Math.cos(b) * rr * 1.35; y = H * .52 + Math.sin(b) * rr; break;
        case 'funnel': x = W * .5; y = padY - 10 + t * (H - 2 * padY + 20); break;
        case 'board': x = W * (i + .5) / n; y = 30; break;
        case 'journey': x = padX + t * (W - 2 * padX); y = H * (i % 2 ? .7 : .3); break;
        default: x = padX + t * (W - 2 * padX); y = H * .46;
      }
      P[s.key] = { x: x, y: y };
      s.el.style.left = x.toFixed(1) + 'px'; s.el.style.top = y.toFixed(1) + 'px';
      if (layout === 'funnel') s.el.style.setProperty('--w', (100 - t * 46).toFixed(1) + '%'); else s.el.style.removeProperty('--w');
    });
    draw();
  }
  // ---------------------------------------------------------------- edges: the main path, then branches
  function edgeD(a, b, kind) {
    var A = P[a], B = P[b];
    if (layout === 'board') {
      var y0 = 44;
      if (a === b) return 'M' + (A.x - 14) + ' ' + y0 + 'c-6 -26 34 -26 28 0';
      var up = kind === 'branch' ? -18 : 0;
      return 'M' + A.x + ' ' + (y0 + up) + 'C' + ((A.x + B.x) / 2) + ' ' + (y0 + up - 26) + ' ' + ((A.x + B.x) / 2) + ' ' + (y0 + up - 26) + ' ' + B.x + ' ' + (y0 + up);
    }
    if (a === b) {                                    // self loop: a small ring above the state
      var s = layout === 'ladder' || layout === 'funnel' ? 1 : -1;
      if (layout === 'ladder') return 'M' + (A.x + 58) + ' ' + (A.y - 8) + 'c34 -8 34 24 0 16';
      if (layout === 'funnel') return 'M' + (A.x + W * .2) + ' ' + (A.y - 8) + 'c34 -8 34 24 0 16';
      return 'M' + (A.x - 10) + ' ' + (A.y + s * 22) + 'c-8 ' + (s * 34) + ' 28 ' + (s * 34) + ' 20 0';
    }
    if (layout === 'hub') {
      if (kind === 'branch') return K.curve([A.x, A.y], [B.x, B.y], .2);
      var C = { x: W * .5, y: H * .52 };               // every hand-over goes through the record in the middle
      return 'M' + A.x.toFixed(1) + ' ' + A.y.toFixed(1) + 'Q' + C.x.toFixed(1) + ' ' + C.y.toFixed(1) + ' ' + B.x.toFixed(1) + ' ' + B.y.toFixed(1);
    }
    if (layout === 'ring') {
      if (kind === 'branch') { var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, cx = W * .5, cy = H * .5; return 'M' + A.x + ' ' + A.y + 'Q' + (cx + (mx - cx) * .2) + ' ' + (cy + (my - cy) * .2) + ' ' + B.x + ' ' + B.y; }
      var r1 = Math.hypot(A.x - W * .5, A.y - H * .5);
      return 'M' + A.x + ' ' + A.y + 'A' + (r1 * 1.1) + ' ' + (r1 * .9) + ' 0 0 1 ' + B.x + ' ' + B.y;
    }
    if (layout === 'ladder' || layout === 'funnel') {
      if (kind === 'branch') { var off = (layout === 'funnel' ? W * .26 : 96) + 14 * Math.abs(byKey[a].i - byKey[b].i); var sx = layout === 'funnel' ? A.x + W * .2 : A.x + 58; return 'M' + sx + ' ' + A.y + 'C' + (sx + off * .6) + ' ' + A.y + ' ' + (sx + off * .6) + ' ' + B.y + ' ' + sx + ' ' + B.y; }
      return 'M' + A.x + ' ' + (A.y + 16) + 'L' + B.x + ' ' + (B.y - 16);
    }
    if (layout === 'journey') {
      if (kind === 'branch') return K.curve([A.x, A.y], [B.x, B.y], .4).replace(/C/, 'C');
      return K.curve([A.x, A.y], [B.x, B.y], .5);
    }
    // rail: forward along the line, back and skip edges arc away from it
    if (kind === 'branch') {
      var back = byKey[b].i < byKey[a].i, h = 46 + 12 * Math.abs(byKey[a].i - byKey[b].i), yy = back ? A.y - h : A.y + h;
      return 'M' + A.x + ' ' + (A.y + (back ? -20 : 20)) + 'C' + A.x + ' ' + yy + ' ' + B.x + ' ' + yy + ' ' + B.x + ' ' + (B.y + (back ? -20 : 20));
    }
    return 'M' + (A.x + 50) + ' ' + A.y + 'L' + (B.x - 50) + ' ' + B.y;
  }
  function draw() {
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.innerHTML = '<defs><marker id="lf-arrow-' + root.dataset.mod + '" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1.5 8.5 5 1 8.5z"/></marker></defs>';
    edges = {};
    var mk = 'url(#lf-arrow-' + root.dataset.mod + ')';
    if (layout === 'hub') svg.appendChild(K.svg('circle', { cx: W * .5, cy: H * .52, r: 38, 'class': 'lf-core' }));
    for (var i = 0; i < path.length - 1; i++) {
      var id = path[i] + '>' + path[i + 1];
      if (edges[id]) continue;
      var e = K.svg('path', { d: edgeD(path[i], path[i + 1], 'path'), 'class': 'lf-e', 'marker-end': mk });
      svg.appendChild(e); edges[id] = { p: e, len: e.getTotalLength() };
    }
    branches.forEach(function (b) {
      var id = b.from + '>' + b.to + '>b';
      var e = K.svg('path', { d: edgeD(b.from, b.to, 'branch'), 'class': 'lf-e lf-e--b', 'marker-end': mk });
      svg.appendChild(e); edges[id] = { p: e, len: e.getTotalLength(), b: b };
    });
    var g = K.svg('g', { 'class': 'lf-toks' }); svg.appendChild(g);
    tokens.forEach(function (t) { if (t.g) g.appendChild(t.g); });
  }
  // ---------------------------------------------------------------- records
  function say(html, c) { var li = K.log(log, '<i></i><span>' + html + '</span>', null, 4); if (c) li.style.setProperty('--c', c); }
  function num(t) { return '#' + t.id; }
  function spawn() {
    var t = { id: ++serial, i: 0, s: 0, edge: null, wait: 0, loops: 0, v: K.rnd(95, 130) };
    if (layout === 'board') { t.card = K.el('span', 'lf-card'); t.card.textContent = num(t); toksLayer.appendChild(t.card); }
    else { t.g = K.svg('g', { 'class': 'lf-tok' }); t.g.appendChild(K.svg('circle', { r: 9, 'class': 'lf-th' })); t.g.appendChild(K.svg('circle', { r: 4.2, 'class': 'lf-td' })); K.$('.lf-toks', svg).appendChild(t.g); }
    tokens.push(t); nFlow++; arrive(t, path[0]);
  }
  function arrive(t, key) {
    var s = byKey[key]; t.at = key; t.wait = .55 / speed;
    s.count++; s.n.textContent = s.count > 999 ? '999+' : String(s.count); s.el.classList.add('has-n'); K.restart(s.el, 'is-pulse');
    place1(t, P[key].x, P[key].y);
    hands.forEach(function (h) {
      if (h.at !== key) return;
      nHand++; kHand.textContent = String(nHand); K.restart(h.el, 'is-fire');
      if (Math.random() < .5) say('<b>' + record + ' ' + num(t) + '</b> ' + h.text.charAt(0).toLowerCase() + h.text.slice(1) + ' (' + h.app + ')', 'var(--tok-pay)');
    });
  }
  function place1(t, x, y) {
    if (t.card) { var col = byKey[t.at].i, stack = colStack(col, t); t.card.style.transform = 'translate(' + (x - 34).toFixed(1) + 'px,' + (58 + stack * 26).toFixed(1) + 'px)'; }
    else if (t.g) t.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
  }
  function colStack(col, me) {
    var k = 0; for (var i = 0; i < tokens.length && tokens[i] !== me; i++) if (tokens[i].at && byKey[tokens[i].at].i === col && !tokens[i].edge) k++;
    return Math.min(k, 7);
  }
  function choose(t) {
    // at a state: take a branch now and then (once per record), else follow the main path
    var here = t.at, out = branches.filter(function (b) { return b.from === here; });
    if (out.length && t.loops < 1 && (forceExc || Math.random() < .2)) {
      var b = K.pick(out); t.loops++; forceExc = false;
      nExc++; kExc.textContent = String(nExc); K.restart(b.el, 'is-take');
      say('<b>' + record + ' ' + num(t) + '</b>: ' + b.label.charAt(0).toLowerCase() + b.label.slice(1), 'var(--tok-late)');
      return { id: b.from + '>' + b.to + '>b', to: b.to, branch: true };
    }
    var pi = t.i + 1;
    if (pi >= path.length) return null;
    return { id: path[t.i] + '>' + path[pi], to: path[pi], next: pi };
  }
  function step(now, dt) {
    if (now > nextSpawn && tokens.length < (speed > 1 ? 9 : 5)) { spawn(); nextSpawn = now + K.rnd(1300, 2100) / speed; }
    tokens = tokens.filter(function (t) {
      if (!t.edge) {
        t.wait -= dt; if (t.wait > 0) return true;
        var go = choose(t);
        if (!go) { nDone++; kDone.textContent = String(nDone); fade(t); return false; }
        t.edge = go; t.s = 0;
        if (t.card) t.card.classList.add('is-moving');
      }
      var e = edges[t.edge.id]; if (!e) { t.edge = null; return true; }
      t.s += t.v * speed * dt;
      if (layout === 'board') {
        var A = P[t.at], B = P[t.edge.to], q = K.clamp(t.s / Math.max(60, Math.abs(B.x - A.x)), 0, 1), x = K.lerp(A.x, B.x, K.ease.inOut(q));
        t.card.style.transform = 'translate(' + (x - 34).toFixed(1) + 'px,' + (58 - Math.sin(q * Math.PI) * 30).toFixed(1) + 'px)';
        if (q >= 1) { finishEdge(t); }
        return true;
      }
      var pt = e.p.getPointAtLength(Math.min(t.s, e.len));
      t.g.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ')');
      if (t.s >= e.len) finishEdge(t);
      return true;
    });
    kFlow.textContent = String(tokens.length);
  }
  function finishEdge(t) {
    var go = t.edge; t.edge = null;
    if (t.card) t.card.classList.remove('is-moving');
    if (go.branch) { t.i = Math.max(0, path.indexOf(go.to)); if (t.i < 0) t.i = 0; }
    else t.i = go.next;
    arrive(t, go.to);
  }
  function fade(t) {
    var n = t.card || t.g; if (!n) return;
    n.classList.add('is-out'); setTimeout(function () { n.remove(); }, 450);
  }
  var loop = K.loop(step);

  // ---------------------------------------------------------------- controls and hover
  K.$$('[data-speed]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      speed = +b.dataset.speed || 1;
      K.$$('[data-speed]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });
  var exc = K.$('[data-exc]', root);
  if (exc) exc.addEventListener('click', function () { forceExc = true; K.restart(exc, 'is-armed'); });
  states.forEach(function (s) {
    function onT() {
      var out = branches.filter(function (b) { return b.from === s.key; }).map(function (b) { return 'Exception: ' + b.label; });
      var hs = hands.filter(function (h) { return h.at === s.key; }).map(function (h) { return 'Hand-off: ' + h.app + ', ' + h.text.charAt(0).toLowerCase() + h.text.slice(1); });
      var p = P[s.key];
      tip.show([s.label, s.note].concat(hs, out), p.x, p.y - 26, p.y < 90);
      root.classList.add('is-peek'); s.el.classList.add('is-hot');
    }
    function offT() { tip.hide(); root.classList.remove('is-peek'); s.el.classList.remove('is-hot'); }
    s.el.tabIndex = 0;
    s.el.addEventListener('pointerenter', onT); s.el.addEventListener('pointerleave', offT);
    s.el.addEventListener('focus', onT); s.el.addEventListener('blur', offT);
  });
  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { tokens.forEach(function (t) { (t.card || t.g) && (t.card || t.g).remove(); }); tokens = []; place(); }, 120); });
  place();
  if (K.reduce) {
    // a still picture: every state shows the sample count it would have after a busy morning
    states.forEach(function (s, i) { s.count = Math.max(1, 12 - i * 2); s.n.textContent = String(s.count); s.el.classList.add('has-n'); });
  }
  return {
    start: function () { if (on) return; on = true; place(); nextSpawn = performance.now() + 250; loop.on(); },
    stop: function () { on = false; loop.off(); }
  };
});
