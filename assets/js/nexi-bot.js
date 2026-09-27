/* Nexi, TechNext's AI companion: the 3D robot and its roaming brain for the home hero.
   Loaded by assets/js/nexi.js on desktop only, after Three.js (assets/js/vendor/three-r128.min.js).
   Exposes window.tnNexi(hero, ROOT), which builds the robot and returns { pause, resume }. */
(function () {
  'use strict';
  window.tnNexi = create;

  function create(hero, ROOT) {
    var THREE = window.THREE;

    /* ---------- DOM: canvas + hit area + effects inside the hero, intro card on top ---------- */
    var layer = document.createElement('div');
    layer.className = 'nexi';
    layer.innerHTML = '<canvas class="nexi-cv" aria-hidden="true"></canvas>' +
      '<button class="nexi-hit" type="button" aria-label="Meet Nexi, TechNext’s AI companion" aria-haspopup="dialog" aria-controls="nexi-card" aria-expanded="false"></button>' +
      '<div class="nexi-fx" aria-hidden="true"></div>';
    var card = document.createElement('div');
    card.className = 'nexi-card'; card.id = 'nexi-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-labelledby', 'nexi-card-t'); card.hidden = true;
    card.innerHTML =
      '<div class="nexi-card-head"><span class="nexi-ava" aria-hidden="true"></span>' +
      '<div><b id="nexi-card-t">Hi, I’m Nexi!</b><span>TechNext’s AI companion</span></div>' +
      '<button class="nexi-x" type="button" data-nexi-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<p>I fly around this page and keep an eye on things. I circle the Odoo apps, chase orders through the flow and cheer every launch.</p>' +
      '<p>I’m a small preview of the AI chatbots TechNext builds for websites, WhatsApp and apps.</p>' +
      '<div class="nexi-card-act"><button class="btn btn-primary btn-sm" type="button" data-nexi-chat>Chat with the team</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-nexi-close>Bye, Nexi!</button></div>';
    hero.appendChild(layer);
    hero.appendChild(card);
    var cv = layer.querySelector('.nexi-cv'), hit = layer.querySelector('.nexi-hit'), fxEl = layer.querySelector('.nexi-fx');

    /* ---------- renderer ---------- */
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch (e) { layer.remove(); card.remove(); return null; }
    var PR = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(PR);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    var scene = new THREE.Scene();
    var CAMZ = 24, FOV = 30;
    var camera = new THREE.PerspectiveCamera(FOV, 1, 1, 80);
    camera.position.set(0, 0, CAMZ);
    var clock = new THREE.Clock(), time = 0;
    var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), tmp3 = new THREE.Vector3();
    var W = 1, H = 1, S = 1, SIZE = 150;

    /* studio reflections, blue bounce for the white shell */
    (function () {
      var pm = new THREE.PMREMGenerator(renderer), es = new THREE.Scene();
      es.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xd3def5, side: THREE.BackSide })));
      function panel(w, h, x, y, z, rx, ry, k, col) {
        var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
        m.position.set(x, y, z); m.rotation.set(rx, ry, 0); es.add(m);
      }
      panel(10, 4, 0, 9.6, 1, Math.PI / 2, 0, 3.4, '#ffffff');
      panel(5, 8, -9.6, 2.5, 3, 0, Math.PI / 2, 2.6, '#ffffff');
      panel(4, 8, 9.6, 2, -1, 0, -Math.PI / 2, 1.8, '#9fc0ff');
      panel(14, 3, 0, 1, -9.6, 0, 0, 1.4, '#b9d0ff');
      panel(8, 3, 0, 3.5, 9.6, 0, Math.PI, 1.6, '#ffffff');
      scene.environment = pm.fromScene(es, 0.03).texture;
      pm.dispose();
    })();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8fa9dd, 0.3));
    var key = new THREE.DirectionalLight(0xffffff, 1.45); key.position.set(4, 8, 10); scene.add(key);
    var rim = new THREE.DirectionalLight(0xffffff, 0.7); rim.position.set(-6, 3, -5); scene.add(rim);
    var fill = new THREE.DirectionalLight(0x8fb4ff, 0.35); fill.position.set(6, 1, 4); scene.add(fill);

    /* ---------- helpers ---------- */
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function ease(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function bell(p) { return Math.sin(Math.PI * clamp(p, 0, 1)); }
    function env(p, a, r) { return p < a ? ease(p / a) : (p > 1 - r ? ease((1 - p) / r) : 1); }
    function Spring(f, d) { this.w = 2 * Math.PI * f; this.z = d == null ? 1 : d; this.x = 0; this.v = 0; }
    Spring.prototype.step = function (t, dt) { var n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n; for (var i = 0; i < n; i++) { var a = -this.w * this.w * (this.x - t) - 2 * this.z * this.w * this.v; this.v += a * h; this.x += this.v * h; } return this.x; };
    var ANISO = renderer.capabilities.getMaxAnisotropy();
    function canvasTex(w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = ANISO; return t; }
    function dataTex(w, h, fn) {
      var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d'), im = g.createImageData(w, h);
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var v = fn(x, y), i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
      g.putImageData(im, 0, 0); var t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = ANISO; return t;
    }
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var speck = new Float32Array(65536); for (var si = 0; si < speck.length; si++) speck[si] = rnd();
    function sp(x, y) { return speck[((y & 255) << 8) | (x & 255)]; }
    var noiseTex = dataTex(256, 256, function (x, y) { return 150 + ((sp(x, y) * 2 + sp(x + 1, y) + sp(x, y + 1) + sp(x - 1, y) + sp(x, y - 1)) / 6) * 70; }); noiseTex.repeat.set(6, 3);
    var rows = new Float32Array(512); for (var ri = 0; ri < 512; ri++) rows[ri] = rnd();
    var brushTex = dataTex(256, 512, function (x, y) { return 120 + ((rows[y] * 3 + rows[(y + 1) & 511] + rows[(y + 511) & 511]) / 5) * 90 + sp(x, y) * 25; }); brushTex.repeat.set(1, 4);
    var circuitTex = canvasTex(1024, 512, function (g, w, h) {
      g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round';
      for (var i = 0; i < 26; i++) {
        var x = rnd() * w, y = h * 0.56 + rnd() * h * 0.14, len = 40 + rnd() * 110, dir = rnd() < 0.5 ? -1 : 1, dy = rnd() < 0.5 ? -18 : 18;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + len * dir, y); g.lineTo(x + len * dir + 18 * dir, y + dy); g.stroke();
        g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.beginPath(); g.arc(x + len * dir + 18 * dir, y + dy, 4, 0, 7); g.fill();
      }
    });

    var M = {
      shell: new THREE.MeshPhysicalMaterial({ color: 0xeef2fa, roughness: 0.42, roughnessMap: noiseTex, bumpMap: noiseTex, bumpScale: 0.0012, clearcoat: 0.85, clearcoatRoughness: 0.14, envMapIntensity: 0.8 }),
      metal: new THREE.MeshStandardMaterial({ color: 0xe4e9f2, roughness: 0.28, roughnessMap: brushTex, metalness: 1, envMapIntensity: 1.15 }),
      visor: new THREE.MeshPhysicalMaterial({ color: 0x03050b, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.3, emissive: 0xffffff, emissiveIntensity: 1 }),
      glow: new THREE.MeshBasicMaterial({ color: 0x5d8ff0, toneMapped: false }),
      line: new THREE.MeshBasicMaterial({ color: 0x8fc0ff, toneMapped: false }),
      eye: new THREE.MeshBasicMaterial({ color: 0xa6d2ff, toneMapped: false, side: THREE.DoubleSide }),
      ring: new THREE.MeshBasicMaterial({ color: 0x4f86ee, toneMapped: false }),
      black: new THREE.MeshBasicMaterial({ color: 0x000000 })
    };
    M.torso = M.shell.clone(); M.torso.emissive = new THREE.Color(0x6fa4ff); M.torso.emissiveMap = circuitTex; M.torso.emissiveIntensity = 0.85;
    M.visor.emissiveMap = canvasTex(256, 256, function (g) { var gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#000'); gr.addColorStop(0.62, '#000'); gr.addColorStop(0.8, '#0b1d44'); gr.addColorStop(1, '#1c3f86'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); });
    function glowMesh(geo, mat) { var m = new THREE.Mesh(geo, mat); m.userData.glow = true; return m; }
    function mesh(geo, mat) { return new THREE.Mesh(geo, mat); }

    /* ---------- selective glow: only the lights bloom ---------- */
    var Glow = (function () {
      var o = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
      var A = new THREE.WebGLRenderTarget(4, 4, o), B = new THREE.WebGLRenderTarget(4, 4, o), C = new THREE.WebGLRenderTarget(4, 4, o);
      var qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), qs = new THREE.Scene();
      var vs = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }';
      var blur = new THREE.ShaderMaterial({ uniforms: { tMap: { value: null }, uDir: { value: new THREE.Vector2() } }, vertexShader: vs, depthTest: false, depthWrite: false,
        fragmentShader: 'uniform sampler2D tMap; uniform vec2 uDir; varying vec2 vUv; void main(){ vec4 s=texture2D(tMap,vUv)*0.227027; s+=texture2D(tMap,vUv+uDir*1.384615)*0.316216; s+=texture2D(tMap,vUv-uDir*1.384615)*0.316216; s+=texture2D(tMap,vUv+uDir*3.230769)*0.070270; s+=texture2D(tMap,vUv-uDir*3.230769)*0.070270; gl_FragColor=s; }' });
      var comp = new THREE.ShaderMaterial({ uniforms: { tB: { value: null }, tA: { value: null } }, vertexShader: vs, depthTest: false, depthWrite: false, transparent: true,
        blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
        fragmentShader: 'uniform sampler2D tB; uniform sampler2D tA; varying vec2 vUv; void main(){ vec3 c=texture2D(tB,vUv).rgb*0.95+texture2D(tA,vUv).rgb*0.2; c=clamp(c,0.0,1.0); gl_FragColor=vec4(c,max(c.r,max(c.g,c.b))); }' });
      var quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blur); quad.frustumCulled = false; qs.add(quad);
      var saved = [];
      function pass(m, t) { quad.material = m; renderer.setRenderTarget(t); renderer.render(qs, qc); }
      return {
        size: function (w, h) { A.setSize(Math.max(2, w / 2 | 0), Math.max(2, h / 2 | 0)); B.setSize(Math.max(2, w / 4 | 0), Math.max(2, h / 4 | 0)); C.setSize(Math.max(2, w / 4 | 0), Math.max(2, h / 4 | 0)); },
        render: function () {
          saved.length = 0;
          scene.traverse(function (o2) {
            if (!o2.visible) return;
            if (o2.isMesh && !o2.userData.glow) { if (o2.userData.noGlow || o2.material.transparent) { saved.push([o2, 'v']); o2.visible = false; } else { saved.push([o2, o2.material]); o2.material = M.black; } }
          });
          renderer.setClearColor(0, 1); renderer.setRenderTarget(A); renderer.clear(); renderer.render(scene, camera);
          for (var i = 0; i < saved.length; i++) { if (saved[i][1] === 'v') saved[i][0].visible = true; else saved[i][0].material = saved[i][1]; }
          renderer.setClearColor(0, 0);
          blur.uniforms.tMap.value = A.texture; blur.uniforms.uDir.value.set(1.5 / B.width, 0); pass(blur, B);
          blur.uniforms.tMap.value = B.texture; blur.uniforms.uDir.value.set(0, 1.5 / C.height); pass(blur, C);
          blur.uniforms.tMap.value = C.texture; blur.uniforms.uDir.value.set(3 / B.width, 0); pass(blur, B);
          blur.uniforms.tMap.value = B.texture; blur.uniforms.uDir.value.set(0, 3 / C.height); pass(blur, C);
          comp.uniforms.tB.value = C.texture; comp.uniforms.tA.value = A.texture;
          renderer.autoClear = false; pass(comp, null); renderer.autoClear = true;
        }
      };
    })();

    /* ---------- the robot (same design as the Nexi chatbot concept) ---------- */
    var bot = new THREE.Group(); scene.add(bot);
    var spinner = new THREE.Group(); bot.add(spinner);
    var BASE = -1.44;
    var hover = new THREE.Group(); hover.position.y = BASE; spinner.add(hover);
    var head = new THREE.Group(); head.position.y = 2.06; head.rotation.order = 'YXZ'; hover.add(head);
    var handL = new THREE.Group(), handR = new THREE.Group(); hover.add(handL); hover.add(handR);
    var HL = new THREE.Vector3(-0.88, 0.72, 0.12), HR = new THREE.Vector3(0.88, 0.72, 0.12);

    function smoothProfile(pts) {
      var out = [];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], r = p[2] || 0;
        if (!r || i === 0 || i === pts.length - 1) { out.push(new THREE.Vector2(p[0], p[1])); continue; }
        var a = pts[i - 1], b = pts[i + 1], ax = a[0] - p[0], ay = a[1] - p[1], bx = b[0] - p[0], by = b[1] - p[1];
        var la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), d = Math.min(r, la / 2, lb / 2);
        var p1x = p[0] + ax / la * d, p1y = p[1] + ay / la * d, p2x = p[0] + bx / lb * d, p2y = p[1] + by / lb * d;
        for (var k = 0; k <= 8; k++) { var t = k / 8, u = 1 - t; out.push(new THREE.Vector2(u * u * p1x + 2 * u * t * p[0] + t * t * p2x, u * u * p1y + 2 * u * t * p[1] + t * t * p2y)); }
      }
      return out;
    }
    function lathe(pts, seg) { return new THREE.LatheGeometry(smoothProfile(pts), seg || 96); }
    function ellipsoid(rx, ry, rz, seg) { var g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75)); g.scale(rx, ry, rz); return g; }
    function roundRect(w, h, r) {
      var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
      s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
    }
    function star(R, r, n) { var s = new THREE.Shape(); for (var i = 0; i < n * 2; i++) { var a = Math.PI / 2 + i * Math.PI / n, rad = i % 2 ? r : R; if (i) s.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); else s.moveTo(Math.cos(a) * rad, Math.sin(a) * rad); } s.closePath(); return s; }
    function bezelCurve() {
      var a = 0.52, b = 0.405, c = 0.385, cz = 0.39, R0 = 0.7, pts = [];
      for (var i = 0; i < 100; i++) {
        var th = i / 100 * Math.PI * 2, ct = Math.cos(th), st = Math.sin(th), lo = 0, hi = Math.PI / 2;
        for (var k = 0; k < 28; k++) { var t = (lo + hi) / 2, x = a * ct * Math.sin(t), y = b * st * Math.sin(t), z = c + cz * Math.cos(t); if (Math.sqrt(x * x + y * y + z * z) > R0) lo = t; else hi = t; }
        var tt = (lo + hi) / 2; pts.push(new THREE.Vector3(a * ct * Math.sin(tt), b * st * Math.sin(tt), c + cz * Math.cos(tt)).multiplyScalar(1.004));
      }
      return new THREE.CatmullRomCurve3(pts, true);
    }

    /* body */
    var torso = mesh(ellipsoid(0.58, 0.609, 0.545, 80), M.torso); torso.position.y = 0.72; hover.add(torso);
    var chan = mesh(new THREE.TorusGeometry(0.583, 0.012, 8, 120), M.metal); chan.rotation.x = Math.PI / 2; chan.scale.set(1, 0.94, 1); chan.position.y = 0.66; hover.add(chan);
    var waist = glowMesh(new THREE.TorusGeometry(0.594, 0.006, 6, 120), M.line); waist.rotation.x = Math.PI / 2; waist.scale.set(1, 0.94, 1); waist.position.y = 0.66; hover.add(waist);
    var logoMat = new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -3, opacity: 0 });
    var logo = new THREE.Mesh(new THREE.SphereGeometry(0.586, 32, 16, Math.PI / 2 - 0.27, 0.54, 1.19, 0.44), logoMat);
    logo.scale.set(1, 1.05, 0.94); logo.position.y = 0.72; logo.userData.noGlow = true; hover.add(logo);
    new THREE.TextureLoader().load(ROOT + 'assets/img/logo-plane.png', function (t) { t.encoding = THREE.sRGBEncoding; t.anisotropy = ANISO; logoMat.map = t; logoMat.opacity = 1; logoMat.needsUpdate = true; });
    [-1, 1].forEach(function (s) {
      var port = mesh(new THREE.CircleGeometry(0.07, 32), M.metal); port.position.set(s * 0.579, 0.74, 0); port.rotation.y = s * Math.PI / 2; hover.add(port);
      var pl = glowMesh(new THREE.CircleGeometry(0.022, 20), M.ring); pl.position.set(s * 0.582, 0.74, 0); pl.rotation.y = s * Math.PI / 2; hover.add(pl);
    });
    var thrRing = mesh(new THREE.TorusGeometry(0.2, 0.022, 10, 48), M.metal); thrRing.rotation.x = Math.PI / 2; thrRing.position.y = 0.13; hover.add(thrRing);
    var thr = glowMesh(new THREE.TorusGeometry(0.17, 0.012, 8, 48), M.glow); thr.rotation.x = Math.PI / 2; thr.position.y = 0.12; hover.add(thr);
    var thrCore = glowMesh(new THREE.CircleGeometry(0.15, 32), new THREE.MeshBasicMaterial({ color: 0x2f64d0, toneMapped: false })); thrCore.rotation.x = Math.PI / 2; thrCore.position.y = 0.118; hover.add(thrCore);
    var flame = glowMesh(new THREE.ConeGeometry(0.15, 1, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x9cc6ff, transparent: true, opacity: 0, toneMapped: false, depthWrite: false, side: THREE.DoubleSide }));
    flame.geometry.rotateX(Math.PI); flame.geometry.translate(0, -0.5, 0); flame.scale.set(1, 0.001, 1); flame.position.y = 0.12; hover.add(flame);
    var neck = mesh(lathe([[0, -0.065], [0.13, -0.065, 0.03], [0.13, -0.012, 0.004], [0.121, 0, 0.004], [0.13, 0.012, 0.004], [0.13, 0.065, 0.03], [0, 0.065]], 48), M.metal); neck.position.y = 1.37; hover.add(neck);
    var neckRing = glowMesh(new THREE.TorusGeometry(0.136, 0.006, 6, 48), M.line); neckRing.rotation.x = Math.PI / 2; neckRing.position.y = 1.37; hover.add(neckRing);
    /* hands: mitten with a thumb, left one mirrored */
    var palm = ellipsoid(0.13, 0.165, 0.125, 40), thumb = ellipsoid(0.055, 0.075, 0.055, 28); thumb.translate(-0.1, 0.03, 0.055);
    [palm, thumb].forEach(function (g) { handR.add(mesh(g, M.shell)); var l = mesh(g, M.shell); l.scale.x = -1; handL.add(l); });
    [handL, handR].forEach(function (h) { var wr = glowMesh(new THREE.TorusGeometry(0.1, 0.009, 6, 36), M.line); wr.rotation.x = Math.PI / 2; wr.scale.set(1, 0.85, 1); wr.position.y = 0.12; h.add(wr); });
    /* head */
    head.add(mesh(new THREE.SphereGeometry(0.7, 80, 60), M.shell));
    var crown = new THREE.TorusGeometry(0.7015, 0.0035, 6, 140, THREE.MathUtils.degToRad(200)); crown.rotateZ(THREE.MathUtils.degToRad(-58)); crown.rotateY(Math.PI / 2); head.add(glowMesh(crown, M.line));
    head.add(mesh(new THREE.TubeGeometry(bezelCurve(), 180, 0.02, 10, true), M.metal));
    var visor = mesh(new THREE.SphereGeometry(1, 60, 44), M.visor); visor.scale.set(0.52, 0.405, 0.39); visor.position.z = 0.385; head.add(visor);
    var earGeo = lathe([[0, 0], [0.215, 0, 0.02], [0.215, 0.2, 0.055], [0.168, 0.2, 0.01], [0.168, 0.236, 0.012], [0.096, 0.236, 0.004], [0.09, 0.226, 0.003], [0, 0.226]], 72);
    earGeo.rotateZ(-Math.PI / 2); earGeo.translate(0.56, 0, 0);
    var fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(0.05, 0.24); fin.quadraticCurveTo(0.08, 0.33, 0.17, 0.31); fin.lineTo(0.13, 0.02); fin.closePath();
    var finGeo = new THREE.ExtrudeGeometry(fin, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 8 }); finGeo.translate(0, 0, -0.011); finGeo.rotateY(Math.PI / 2);
    [1, -1].forEach(function (s) {
      var e = mesh(earGeo, M.shell); if (s < 0) e.scale.x = -1; head.add(e);
      var ring = glowMesh(new THREE.TorusGeometry(0.148, 0.012, 10, 56), M.ring); ring.rotation.y = Math.PI / 2; ring.position.x = s * 0.797; head.add(ring);
      var lens = glowMesh(new THREE.CircleGeometry(0.086, 32), M.ring); lens.rotation.y = s * Math.PI / 2; lens.position.x = s * 0.788; head.add(lens);
      var ar = glowMesh(new THREE.TorusGeometry(0.283, 0.0035, 6, 90), M.line); ar.position.x = s * 0.642; ar.rotation.y = Math.PI / 2; head.add(ar);
      var f = mesh(finGeo, M.shell); f.position.set(s * 0.74, 0.13, -0.02); f.rotation.x = -0.25; if (s < 0) f.scale.x = -1; head.add(f);
      var tip = glowMesh(new THREE.SphereGeometry(0.022, 12, 10), M.line); tip.position.set(s * 0.74, 0.39, -0.26); head.add(tip);
    });
    var mic = new THREE.CatmullRomCurve3([new THREE.Vector3(0.74, -0.05, 0.08), new THREE.Vector3(0.71, -0.3, 0.37), new THREE.Vector3(0.47, -0.45, 0.58), new THREE.Vector3(0.25, -0.47, 0.66)]);
    head.add(mesh(new THREE.TubeGeometry(mic, 48, 0.016, 8, false), M.metal));
    var micTip = glowMesh(new THREE.SphereGeometry(0.04, 16, 12), M.ring); micTip.position.copy(mic.getPoint(1)); head.add(micTip);
    /* face */
    var SHAPES = ['open', 'happy', 'star', 'line', 'big'];
    var G = { open: new THREE.ShapeGeometry(roundRect(0.125, 0.235, 0.062), 12), happy: new THREE.TorusGeometry(0.068, 0.024, 10, 28, Math.PI),
      star: new THREE.ShapeGeometry(star(0.115, 0.036, 4)), line: new THREE.ShapeGeometry(roundRect(0.16, 0.04, 0.02), 8), big: new THREE.RingGeometry(0.058, 0.104, 40) };
    var eyes = [];
    [-1, 1].forEach(function (s) {
      var g = new THREE.Group(); g.position.set(s * 0.19, 0.045, 0.756); g.rotation.y = s * 0.29; head.add(g);
      var p = { g: g, bx: s * 0.19 };
      SHAPES.forEach(function (k) { var m = glowMesh(G[k], M.eye); m.visible = false; g.add(m); p[k] = m; });
      p.happy.position.y = -0.03; eyes.push(p);
    });
    var blushMat = new THREE.MeshBasicMaterial({ color: 0xff8fb8, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    [-1, 1].forEach(function (s) { var b = glowMesh(new THREE.CircleGeometry(0.05, 24), blushMat); b.scale.set(1.5, 0.8, 1); b.position.set(s * 0.3, -0.13, 0.69); b.rotation.y = s * 0.52; head.add(b); });
    var mouth = new THREE.Group(); mouth.position.set(0, -0.19, 0.738); mouth.rotation.x = 0.47; head.add(mouth);
    var smile = glowMesh(new THREE.TorusGeometry(0.055, 0.013, 8, 24, Math.PI), M.eye); smile.rotation.z = Math.PI; mouth.add(smile);
    var mouthO = glowMesh(new THREE.TorusGeometry(0.03, 0.011, 8, 20), M.eye); mouth.add(mouthO);
    var eq = []; for (var qi = 0; qi < 5; qi++) { var bar = glowMesh(new THREE.BoxGeometry(0.017, 0.06, 0.006), M.eye); bar.position.x = (qi - 2) * 0.03; mouth.add(bar); eq.push(bar); }

    /* a soft blue aura behind Nexi and a hover shadow under it, so the white shell reads on the white hero */
    function softTex(inner, mid) { return canvasTex(128, 128, function (g) { var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, inner); gr.addColorStop(0.55, mid); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); }); }
    var aura = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: softTex('rgba(111,160,245,.42)', 'rgba(111,160,245,.14)'), transparent: true, depthWrite: false, toneMapped: false }));
    aura.position.set(0, 0.1, -1.2); aura.userData.noGlow = true; bot.add(aura);
    var shade = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.55), new THREE.MeshBasicMaterial({ map: softTex('rgba(24,40,90,.34)', 'rgba(24,40,90,.12)'), transparent: true, depthWrite: false, toneMapped: false }));
    shade.position.set(0, -1.72, -0.6); shade.userData.noGlow = true; bot.add(shade);

    /* sparkle trail from the thruster while flying */
    var SPK = 40, spkPos = new Float32Array(SPK * 3), spk = [];
    for (var sk = 0; sk < SPK; sk++) spk.push({ life: 0, i: sk, v: new THREE.Vector3() });
    var spkGeo = new THREE.BufferGeometry(); spkGeo.setAttribute('position', new THREE.BufferAttribute(spkPos, 3));
    var dotTex = canvasTex(64, 64, function (g) { var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(170,205,255,.7)'); gr.addColorStop(1, 'rgba(90,140,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    var sparkles = new THREE.Points(spkGeo, new THREE.PointsMaterial({ size: 0.16, map: dotTex, color: 0x9cc6ff, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }));
    scene.add(sparkles); var spkNext = 0, spkAt = 0;

    /* ---------- state ---------- */
    var Sp = { x: new Spring(0.5, 0.9), y: new Spring(0.5, 0.9), z: new Spring(0.45, 0.95), ly: new Spring(1.5, 0.95), lp: new Spring(1.5, 0.95),
      nod: new Spring(2.4, 0.8), tilt: new Spring(2, 0.8), yb: new Spring(2.2, 0.75), sq: new Spring(3, 0.55), bank: new Spring(1.3, 0.8), yaw: new Spring(1, 0.95),
      hLx: new Spring(2.4, 0.75), hLy: new Spring(2.4, 0.75), hLz: new Spring(2.4, 0.75), hRx: new Spring(2.6, 0.72), hRy: new Spring(2.6, 0.72), hRz: new Spring(2.6, 0.72), hRr: new Spring(3, 0.7),
      talk: new Spring(6, 1), boost: new Spring(3, 0.9) };
    var R = { tx: 0, ty: 0, tz: 0, look: null, lookUntil: -1, eyes: 'open', eyeFrom: 'open', eyeT0: -9, mouth: 'smile', exprUntil: Infinity, clips: [], blinkAt: 2, blinkT0: -9,
      humUntil: -1, blushUntil: -1, task: null, lastTask: '', cardOpen: false, entered: false };
    var EXPR = { idle: ['open', 'smile'], happy: ['happy', 'smile'], star: ['star', 'smile'], content: ['line', 'smile'], wow: ['big', 'o'] };
    function expr(n, dur) { var e = EXPR[n] || EXPR.idle; if (e[0] !== R.eyes) { R.eyeFrom = R.eyes; R.eyes = e[0]; R.eyeT0 = time; } R.mouth = e[1]; R.exprUntil = dur ? time + dur : Infinity; }
    var CLIPS = {
      wave: { dur: 2.2, fn: function (p, O) { var e = env(p, 0.18, 0.22); O.hRy += 0.78 * e; O.hRx += 0.1 * e; O.hRz += 0.24 * e; O.hRr += Math.sin(p * Math.PI * 8) * 0.5 * e; O.tilt += 0.1 * e; } },
      hop: { dur: 0.7, fn: function (p, O) { if (p < 0.25) O.sq -= 0.08 * bell(p / 0.25); else { var q = (p - 0.25) / 0.75; O.yb += bell(q) * 0.2; O.sq += 0.05 * bell(q); } } },
      nod: { dur: 1, fn: function (p, O) { O.nod += Math.sin(p * Math.PI * 2) * 0.18 * env(p, 0.1, 0.2); } },
      spin: { dur: 1.4, fn: function (p, O) { O.spin += ease(p) * Math.PI * 2; O.yb += bell(p) * 0.25; O.hLy += bell(p) * 0.25; O.hRy += bell(p) * 0.25; } },
      flip: { dur: 1.5, fn: function (p, O) { if (p < 0.18) O.sq -= 0.16 * ease(p / 0.18); else if (p < 0.85) { var q = (p - 0.18) / 0.67; O.yb += bell(q) * 0.9; O.flip -= ease(q) * Math.PI * 2; O.hLy += 0.7; O.hRy += 0.7; } else O.sq -= 0.15 * bell((p - 0.85) / 0.15); } },
      point: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.2, 0.25); O.hRx += 0.4 * e; O.hRy += 0.25 * e; O.hRz += 0.55 * e; O.nod += 0.1 * e; } },
      pointL: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.2, 0.25); O.hLx -= 0.4 * e; O.hLy += 0.25 * e; O.hLz += 0.55 * e; O.nod += 0.1 * e; } },
      celebrate: { dur: 1.7, fn: function (p, O) { var j = Math.abs(Math.sin(p * Math.PI * 2)); O.yb += j * 0.26; O.sq += (j - 0.4) * 0.06; var e = env(p, 0.1, 0.2); O.hLy += 0.82 * e; O.hRy += 0.82 * e; O.hLx -= 0.14 * e; O.hRx += 0.14 * e; } },
      think: { dur: 2.2, fn: function (p, O) { var e = env(p, 0.2, 0.2); O.tilt += 0.16 * e; O.nod -= 0.1 * e; O.hRx -= 0.4 * e; O.hRy += 0.5 * e; O.hRz += 0.4 * e; } },
      clap: { dur: 1.3, fn: function (p, O) { var e = env(p, 0.2, 0.2), c = (Math.sin(p * Math.PI * 10) + 1) / 2; O.hLx += (0.6 - 0.12 * c) * e; O.hRx -= (0.6 - 0.12 * c) * e; O.hLy += 0.36 * e; O.hRy += 0.36 * e; O.hLz += 0.36 * e; O.hRz += 0.36 * e; } },
      curious: { dur: 1.4, fn: function (p, O) { O.tilt += 0.18 * env(p, 0.2, 0.3); } },
      hum: { dur: 3.4, fn: function (p, O) { var e = env(p, 0.1, 0.15), s = Math.sin(p * Math.PI * 6); O.tilt += s * 0.12 * e; O.hLy += Math.max(0, s) * 0.28 * e; O.hRy += Math.max(0, -s) * 0.28 * e; } },
      stretch: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.3, 0.3); O.hLy += 2.1 * e; O.hRy += 2.1 * e; O.hLx += 0.42 * e; O.hRx -= 0.42 * e; O.sq += 0.08 * e; O.nod -= 0.25 * e; } },
      surf: { dur: 4.2, fn: function (p, O) { var e = env(p, 0.15, 0.15); O.hLx -= 0.25 * e; O.hRx += 0.25 * e; O.hLy += 0.5 * e; O.hRy += 0.5 * e; O.tilt += Math.sin(p * Math.PI * 4) * 0.12 * e; } },
      peek: { dur: 2.4, fn: function (p, O) { var e = env(p, 0.25, 0.3); O.nod += 0.1 * e; O.hRy += 0.6 * e; O.hRz += 0.25 * e; O.hRr += Math.sin(p * Math.PI * 7) * 0.35 * e; O.tilt -= 0.15 * e; } }
    };
    function play(n) { var c = CLIPS[n]; if (c) R.clips.push({ t0: time, dur: c.dur, fn: c.fn }); }

    /* ---------- layout: hero pixels <-> world ---------- */
    var heroRect = hero.getBoundingClientRect();
    function resize() {
      heroRect = hero.getBoundingClientRect();
      W = Math.max(1, hero.clientWidth); H = Math.max(1, hero.clientHeight);
      renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
      Glow.size(W * PR, H * PR);
      S = H / (2 * CAMZ * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      SIZE = clamp(H * 0.2, 118, 170);
      bot.scale.setScalar(SIZE / (2.65 * S));
      hit.style.width = (SIZE * 0.72) + 'px'; hit.style.height = SIZE + 'px';
    }
    function rectOf(el) { var r = el.getBoundingClientRect(); heroRect = hero.getBoundingClientRect(); return { x: r.left - heroRect.left, y: r.top - heroRect.top, w: r.width, h: r.height, cx: r.left - heroRect.left + r.width / 2, cy: r.top - heroRect.top + r.height / 2 }; }
    function visible(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4; }
    var TABS = 72; /* the fixed side tabs cover the right edge of the hero */
    function goTo(x, y, z) {
      var m = SIZE * 0.55;
      R.tx = clamp(x, m, W - TABS - m); R.ty = clamp(y, SIZE * 0.62, H - SIZE * 0.55 - 8); R.tz = z == null ? 0 : z;
    }
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function worldAt(px, py, z, out) {
      ndc.set(px / W * 2 - 1, -(py / H * 2 - 1)); ray.setFromCamera(ndc, camera);
      var t = (z - ray.ray.origin.z) / ray.ray.direction.z; return out.copy(ray.ray.origin).addScaledVector(ray.ray.direction, t);
    }
    var lookPt = new THREE.Vector3();
    function lookAtEl(el, sec) { if (!el) return; var r = rectOf(el); lookAtPx(r.cx, r.cy, sec); }
    function lookAtPx(px, py, sec) { worldAt(px, py, 2.5, lookPt); R.look = lookPt; R.lookUntil = time + (sec || 3); }

    /* ---------- floating emotes and ring pulses ---------- */
    function botPx() { tmp.copy(bot.position).project(camera); return { x: (tmp.x + 1) / 2 * W, y: (1 - tmp.y) / 2 * H }; }
    function emote(chars, n) {
      var h = botPx();
      for (var i = 0; i < (n || 1); i++) (function (k) {
        setTimeout(function () {
          var e = document.createElement('i'); e.textContent = Array.isArray(chars) ? pick(chars) : chars;
          var x0 = h.x + rand(-40, 40), y0 = h.y - SIZE * 0.55 + rand(-10, 10);
          e.style.setProperty('--x0', x0 + 'px'); e.style.setProperty('--y0', y0 + 'px');
          e.style.setProperty('--x1', (x0 + rand(-50, 50)) + 'px'); e.style.setProperty('--y1', (y0 - rand(70, 120)) + 'px'); e.style.setProperty('--r', rand(-30, 30) + 'deg');
          fxEl.appendChild(e); setTimeout(function () { e.remove(); }, 1700);
        }, k * 140);
      })(i);
    }
    function word(text) {
      var h = botPx(), e = document.createElement('b'); e.textContent = text; fxEl.appendChild(e);
      e.style.setProperty('--x', clamp(h.x + SIZE * 0.3, 8, W - e.offsetWidth - 8) + 'px'); e.style.setProperty('--y', Math.max(8, h.y - SIZE * 0.7) + 'px');
      setTimeout(function () { e.remove(); }, 1900);
    }
    function ringAt(el) {
      if (!visible(el)) return; var r = rectOf(el), e = document.createElement('u');
      e.style.left = r.x + 'px'; e.style.top = r.y + 'px'; e.style.width = r.w + 'px'; e.style.height = r.h + 'px';
      fxEl.appendChild(e); setTimeout(function () { e.remove(); }, 1500);
    }

    /* ---------- what Nexi does: small tasks built from the hero's own elements ---------- */
    function active() { return hero.querySelector('.slide.is-active'); }
    function q(sel) { var s = active(); return s ? s.querySelector(sel) : null; }
    function qa(sel) { var s = active(); return s ? [].slice.call(s.querySelectorAll(sel)) : []; }
    var TASKS = {
      orbitApps: { w: function () { return visible(q('[data-cine]')) ? 3 : 0; }, run: function (T) {
        var el = q('.dash-wrap') || q('[data-cine]'), r = rectOf(el), a0 = rand(0, 6.28), dir = Math.random() < 0.5 ? 1 : -1;
        T.dur = 6; expr('happy', 2); play('surf');
        T.tick = function (p) { var a = a0 + dir * p * Math.PI * 2 * 0.9; goTo(r.cx + Math.cos(a) * r.w * 0.56, r.cy + Math.sin(a) * r.h * 0.34, Math.sin(a) * 3); lookAtPx(r.cx, r.cy, 0.5); };
      } },
      inspectApp: { w: function () { return qa('.cine-app').length ? 2 : 0; }, run: function (T) {
        var apps = qa('.cine-app').filter(visible), el = pick(apps); if (!el) return T.end();
        var r = rectOf(el), side = r.cx > W / 2 ? -1 : 1; goTo(r.cx + side * SIZE * 0.7, r.cy - SIZE * 0.1, 1.5);
        T.dur = 4.5; T.at(1.6, function () { lookAtEl(el, 2.6); play('curious'); expr('wow', 0.9); emote('?'); });
        T.at(2.7, function () { play(side > 0 ? 'pointL' : 'point'); expr('star', 1.4); emote(['✦', '✧'], 3); ringAt(el); });
      } },
      chaseToken: { w: function () { return visible(q('[data-pmap]')) ? 3 : 0; }, run: function (T) {
        var map = q('[data-pmap]'), lock = null; T.dur = 7; expr('happy', 3); play('hum'); R.humUntil = time + 3.2; emote(['♪', '♫'], 2);
        T.tick = function () {
          if (!lock || !lock.isConnected || !visible(lock)) { var toks = qa('.pm-tok').filter(visible); lock = toks.length ? pick(toks) : null; }
          if (lock) { var r = rectOf(lock); goTo(r.cx, r.cy - SIZE * 0.62, 1); lookAtPx(r.cx, r.cy, 0.5); }
          else { var m = rectOf(map); goTo(m.cx + Math.sin(time) * m.w * 0.3, m.y + SIZE * 0.5, 0.5); }
        };
      } },
      watchGate: { w: function () { return qa('.pm-gate').length ? 1.4 : 0; }, run: function (T) {
        var el = pick(qa('.pm-gate').filter(visible)); if (!el) return T.end();
        var r = rectOf(el); goTo(r.cx + SIZE * 0.65, r.cy - SIZE * 0.3, 1); T.dur = 4.2;
        T.at(1.5, function () { lookAtEl(el, 2.4); play('think'); expr('content', 1.6); });
        T.at(3.2, function () { play('nod'); expr('happy', 1); ringAt(el); });
      } },
      cheerOrb: { w: function () { return visible(q('[data-journey]')) ? 3 : 0; }, run: function (T) {
        T.dur = 7; expr('happy', 2);
        T.tick = function () { var orb = q('.lj-puck') || q('.lj-ptag'); if (!orb) return; var r = rectOf(orb); goTo(r.cx - SIZE * 0.8, r.cy - SIZE * 0.35, 1); lookAtPx(r.cx, r.cy, 0.5); };
        T.at(2.2, function () { play('clap'); emote(['✦', '♪'], 2); });
      } },
      readHeadline: { w: function () { return q('.as-h1') ? 1 : 0; }, run: function (T) {
        var el = q('.as-h1'), r = rectOf(el), left = r.x > W * 0.45; goTo(left ? r.x - SIZE * 0.55 : r.x + r.w + SIZE * 0.5, r.y + SIZE * 0.3, 0.5);
        T.dur = 4.6; T.at(1.6, function () { lookAtEl(el, 2.8); play('think'); expr('content', 2); });
        T.at(3.4, function () { play('nod'); expr('happy', 1.2); var hl = q('.hl') || q('.rot b.is-on'); if (hl) { ringAt(hl); emote('✦'); } });
      } },
      pointCTA: { w: function () { return q('.actions .btn') ? 1.3 : 0; }, run: function (T) {
        var el = q('.actions .btn'), r = rectOf(el); goTo(r.x + r.w + SIZE * 0.55, r.y - SIZE * 0.2, 1.5);
        T.dur = 4.2; T.at(1.6, function () { lookAtEl(el, 2.4); play('pointL'); expr('happy', 2); ringAt(el); emote('!'); });
      } },
      surfMarquee: { w: function () { return visible(hero.querySelector('.hero-marquee')) ? 0.9 : 0; }, run: function (T) {
        var m = rectOf(hero.querySelector('.hero-marquee')), dir = Math.random() < 0.5 ? 1 : -1; T.dur = 5; play('surf'); expr('happy', 4);
        T.tick = function (p) { goTo(dir > 0 ? lerp(SIZE, W - SIZE, p) : lerp(W - SIZE, SIZE, p), m.y - SIZE * 0.42, 1.5); };
      } },
      rest: { w: function () { return 1; }, run: function (T) {
        var spots = [[0.9, 0.3], [0.06, 0.76], [0.5, 0.86], [0.93, 0.8]], s = pick(spots); goTo(W * s[0], H * s[1], -1);
        T.dur = 5; T.at(1.8, function () { var c = pick(['stretch', 'hum', 'wave']); play(c); if (c === 'hum') { R.humUntil = time + 3; emote(['♪', '♫'], 3); } expr(c === 'wave' ? 'happy' : 'content', 2.2); });
      } },
      peek: { w: function () { return 0.6; }, run: function (T) {
        var right = Math.random() < 0.5; goTo(right ? W - SIZE * 0.2 : SIZE * 0.2, H * rand(0.35, 0.7), 2); R.tx = right ? W - TABS - SIZE * 0.3 : SIZE * 0.2;
        T.dur = 4; T.at(1.8, function () { play('peek'); expr('happy', 1.6); });
      } },
      trick: { w: function () { return 0.5; }, run: function (T) { T.dur = 2.4; play(Math.random() < 0.5 ? 'flip' : 'spin'); expr('happy', 2); T.at(1.2, function () { emote(['✦', '✧'], 3); }); } }
    };
    var timersT = [];
    function startTask(name, extra) {
      timersT.length = 0;
      var T = { name: name, t0: time, dur: 4, tick: null, done: false,
        at: function (s, fn) { timersT.push({ at: time + s, fn: fn }); },
        end: function () { T.dur = 0; } };
      R.task = T; R.lastTask = name;
      (extra || TASKS[name].run)(T);
    }
    function nextTask() {
      var names = Object.keys(TASKS).filter(function (n) { return n !== R.lastTask; }), tot = 0, ws = {};
      names.forEach(function (n) { ws[n] = TASKS[n].w(); tot += ws[n]; });
      var r = Math.random() * tot, n = names[0];
      for (var i = 0; i < names.length; i++) { r -= ws[names[i]]; if (r <= 0) { n = names[i]; break; } }
      startTask(n);
    }

    /* the carousel changed slide: swoop to the new visual */
    hero.addEventListener('tn:slide', function () {
      if (!running || R.cardOpen) return;
      setTimeout(function () {
        startTask('swoop', function (T) {
          var v = q('[data-cine]') || q('[data-pmap]') || q('[data-journey]'); T.dur = 3.2; play('spin'); expr('wow', 0.8);
          if (v) { var r = rectOf(v); goTo(r.x + r.w * rand(0.2, 0.8), r.y + SIZE * 0.4, 2); T.at(1.4, function () { lookAtEl(v, 1.6); expr('happy', 1.5); word(pick(['ooh!', 'new one!', 'wheee!'])); }); }
        });
      }, 900);
    });
    /* clicks on hero items: Nexi comes over to look */
    hero.addEventListener('click', function (e) {
      if (!running || R.cardOpen || e.target.closest('.nexi-hit,.nexi-card')) return;
      var el = e.target.closest('[data-app],[data-flow],.lj-hit,.pm-scen button,.dot,.hero-arrow');
      if (el) { startTask('visit', function (T) { var r = rectOf(el); goTo(r.cx + (r.cx > W / 2 ? -1 : 1) * SIZE * 0.75, r.cy - SIZE * 0.2, 1.5); lookAtEl(el, 3); T.dur = 3.4; expr('wow', 0.7); T.at(1.3, function () { play('clap'); expr('happy', 1.4); emote('✦', 2); }); }); }
      else { var hr = hero.getBoundingClientRect(); lookAtPx(e.clientX - hr.left, e.clientY - hr.top, 2); play('curious'); }
    }, true);
    /* the launch path finished a phase: cheer */
    var ljWatch = new MutationObserver(function (list) {
      if (!running || R.cardOpen) return;
      for (var i = 0; i < list.length; i++) { var t = list[i].target; if (t.classList && t.classList.contains('is-done') && (list[i].oldValue || '').indexOf('is-done') < 0 && /lj-(badge|plat)/.test(t.getAttribute('class') || '')) { play('celebrate'); expr('happy', 1.6); emote(['✦', '✧', '♪'], 3); if (Math.random() < 0.4) word('yay!'); return; } }
    });
    var lj = hero.querySelector('[data-journey]'); if (lj) ljWatch.observe(lj, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });

    /* ---------- the intro card ---------- */
    var chirpCtx = null;
    function chirp() {
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        if (navigator.userActivation && !navigator.userActivation.isActive) return; /* browsers only allow sound after a real click */
        chirpCtx = chirpCtx || new AC(); if (chirpCtx.state === 'suspended') chirpCtx.resume(); var c = chirpCtx, t = c.currentTime + 0.01, g = c.createGain(); g.gain.value = 0.08; g.connect(c.destination);
        [[620, 980, 0], [880, 1320, 0.12], [1175, 1700, 0.24]].forEach(function (n) { var o = c.createOscillator(), a = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(n[0], t + n[2]); o.frequency.exponentialRampToValueAtTime(n[1], t + n[2] + 0.1); a.gain.setValueAtTime(0.0001, t + n[2]); a.gain.exponentialRampToValueAtTime(1, t + n[2] + 0.01); a.gain.exponentialRampToValueAtTime(0.0001, t + n[2] + 0.12); o.connect(a); a.connect(g); o.start(t + n[2]); o.stop(t + n[2] + 0.14); });
      } catch (e) { /* sound is optional */ }
    }
    function placeCard() {
      var h = botPx(), cw = card.offsetWidth || 320, ch = card.offsetHeight || 220;
      var edge = W - TABS, low = H - 12; /* keep clear of the fixed side tabs and the cookie notice */
      var cb = document.getElementById('tn-cookie-banner');
      if (cb) { var br = cb.getBoundingClientRect(); if (br.height) low = Math.min(low, br.top - hero.getBoundingClientRect().top - 12); }
      var x = h.x + SIZE * 0.55; if (x + cw > edge) x = h.x - SIZE * 0.55 - cw;
      card.style.left = clamp(x, 16, edge - cw) + 'px'; card.style.top = Math.max(12, Math.min(h.y - ch / 2, low - ch)) + 'px';
    }
    function openCard() {
      if (R.cardOpen) return; R.cardOpen = true; hit.setAttribute('aria-expanded', 'true');
      startTask('present', function (T) { T.dur = 1e9; goTo(R.tx, R.ty, 3); R.look = null; });
      card.hidden = false; placeCard(); requestAnimationFrame(function () { card.classList.add('is-on'); });
      play('wave'); play('hop'); expr('happy', 3); R.blushUntil = time + 2.4; chirp(); emote(['✦', '♥'], 3);
      var b = card.querySelector('[data-nexi-chat]'); if (b) b.focus({ preventScroll: true });
    }
    function closeCard(back) {
      if (!R.cardOpen) return; R.cardOpen = false; hit.setAttribute('aria-expanded', 'false');
      card.classList.remove('is-on'); setTimeout(function () { if (!R.cardOpen) card.hidden = true; }, 260);
      play('wave'); expr('happy', 1.2); R.task = null; if (back) hit.focus({ preventScroll: true });
    }
    hit.addEventListener('click', function (e) { e.stopPropagation(); if (R.cardOpen) closeCard(); else openCard(); });
    hit.addEventListener('touchend', function (e) { e.stopPropagation(); });
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      if (e.target.closest('[data-nexi-close]')) closeCard(true);
      if (e.target.closest('[data-nexi-chat]')) { closeCard(); if (window.tnChat) window.tnChat.open(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && R.cardOpen) closeCard(true); });
    document.addEventListener('click', function (e) { if (R.cardOpen && !e.target.closest('.nexi-card,.nexi-hit')) closeCard(); });

    /* ---------- run / pause ---------- */
    var running = false, inView = true, raf = 0;
    function setOn() { document.body.classList.toggle('nexi-on', running && inView); }
    var io = new IntersectionObserver(function (en) { inView = en[0].isIntersecting; setOn(); if (inView && running && !raf) raf = requestAnimationFrame(tick); }, { threshold: 0.05 });
    io.observe(hero);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && running && !raf) { clock.getDelta(); raf = requestAnimationFrame(tick); } });
    window.addEventListener('resize', function () { if (running) resize(); });

    function tick() {
      raf = 0;
      if (!running || !inView || document.hidden) return;
      var dt = Math.min(0.05, clock.getDelta()); time += dt;
      for (var ti = timersT.length - 1; ti >= 0; ti--) if (time >= timersT[ti].at) { var f = timersT[ti].fn; timersT.splice(ti, 1); f(); }
      if (!R.entered) { R.entered = true; Sp.x.x = W + SIZE; Sp.y.x = H * 0.35; startTask('enter', function (T) { var v = q('[data-cine]') || q('[data-pmap]') || q('[data-journey]'); var r = v ? rectOf(v) : { cx: W * 0.7, cy: H * 0.4, w: 0, h: 0 }; goTo(r.cx + r.w * 0.3, r.cy - SIZE * 0.3, 1.5); T.dur = 4.2; T.at(1.9, function () { play('wave'); expr('happy', 2); word('hi!'); }); }); }
      var T = R.task;
      if (T) { var p = (time - T.t0) / Math.max(0.001, T.dur); if (T.tick) T.tick(clamp(p, 0, 1)); if (p >= 1) { R.task = null; } }
      if (!R.task && !R.cardOpen) nextTask();
      if (R.cardOpen) placeCard();
      if (time > R.exprUntil) expr('idle');

      /* movement */
      var px = Sp.x.step(R.tx, dt), py = Sp.y.step(R.ty, dt), pz = Sp.z.step(R.tz, dt);
      var vx = Sp.x.v, vy = Sp.y.v, speed = Math.hypot(vx, vy) / S;
      bot.position.set((px - W / 2) / S, (H / 2 - py) / S, pz);
      var O = { yb: 0, sq: 0, spin: 0, flip: 0, nod: 0, tilt: 0, hLx: 0, hLy: 0, hLz: 0, hRx: 0, hRy: 0, hRz: 0, hRr: 0 };
      R.clips = R.clips.filter(function (c) { var pp = (time - c.t0) / c.dur; if (pp >= 1) return false; c.fn(clamp(pp, 0, 1), O); return true; });
      var sq = Sp.sq.step(O.sq, dt);
      var yb = Sp.yb.step(O.yb, dt), bob = Math.sin(time * 1.5) * 0.06;
      hover.position.y = BASE + bob + yb;
      shade.scale.setScalar(clamp(1 - (yb + bob) * 0.5, 0.55, 1.1)); shade.material.opacity = clamp(1 - (yb + bob) * 0.7, 0.3, 1);
      hover.scale.set(1 - sq * 0.5, 1 + sq, 1 - sq * 0.5);
      spinner.rotation.x = O.flip + clamp(-vy / S * 0.02, -0.2, 0.2);
      spinner.rotation.z = Sp.bank.step(clamp(-vx / S * 0.06, -0.35, 0.35), dt);
      bot.rotation.y = O.spin + Sp.yaw.step(speed > 0.6 ? clamp(vx / S * 0.08, -0.6, 0.6) : 0, dt);

      /* look */
      var ly = Math.sin(time * 0.37) * 0.12, lp = Math.sin(time * 0.29) * 0.05, target = null;
      if (time < R.lookUntil && R.look) target = R.look;
      if (target) {
        var local = hover.worldToLocal(tmp2.copy(target)), dx = local.x - head.position.x, dy = local.y - head.position.y, dz = local.z - head.position.z;
        ly = clamp(Math.atan2(dx, dz), -0.85, 0.85); lp = clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.45, 0.45);
      }
      var lookY = Sp.ly.step(ly, dt), lookP = Sp.lp.step(lp, dt);
      head.rotation.set(lookP + Sp.nod.step(O.nod, dt), lookY, Sp.tilt.step(O.tilt, dt));
      handL.position.set(HL.x + Sp.hLx.step(O.hLx, dt), HL.y + Math.sin(time * 2) * 0.035 + Sp.hLy.step(O.hLy, dt), HL.z + Sp.hLz.step(O.hLz, dt));
      handR.position.set(HR.x + Sp.hRx.step(O.hRx, dt), HR.y + Math.sin(time * 2 + 1.3) * 0.035 + Sp.hRy.step(O.hRy, dt), HR.z + Sp.hRz.step(O.hRz, dt));
      handR.rotation.z = Sp.hRr.step(O.hRr, dt);

      /* face */
      if (time > R.blinkAt) { R.blinkT0 = time; R.blinkAt = time + rand(2.4, 5.6); }
      var bp = (time - R.blinkT0) / 0.18, blink = bp >= 0 && bp < 1 ? 1 - Math.pow(bell(bp), 1.4) * 0.92 : 1;
      var swp = (time - R.eyeT0) / 0.22, shape = R.eyes, sw = 1;
      if (swp >= 0 && swp < 1) { if (swp < 0.5) { shape = R.eyeFrom; sw = 1 - ease(swp * 2); } else sw = ease((swp - 0.5) * 2); }
      eyes.forEach(function (e, i) {
        e.g.position.x = e.bx + lookY * 0.03; e.g.position.y = 0.045 - lookP * 0.03;
        SHAPES.forEach(function (k) { e[k].visible = k === shape; });
        var m = e[shape], s = Math.max(0.05, sw); m.scale.set(0.7 + 0.3 * s, s * (shape === 'open' ? blink : 1), 1);
        if (shape === 'star') m.rotation.z = Math.sin(time * 3 + i) * 0.25;
      });
      var tk = Sp.talk.step(time < R.humUntil ? 1 : 0, dt);
      smile.visible = tk < 0.5 && R.mouth === 'smile'; mouthO.visible = tk < 0.5 && R.mouth === 'o';
      smile.scale.setScalar(Math.max(0.01, 1 - tk)); mouthO.scale.setScalar(Math.max(0.01, 1 - tk));
      eq.forEach(function (b, i) { b.visible = tk > 0.05; b.scale.set(1, Math.max(0.05, tk * (0.35 + 0.9 * Math.abs(Math.sin(time * 16 + i * 1.9) * Math.sin(time * 6.7 + i)))), 1); });
      blushMat.opacity = lerp(blushMat.opacity, time < R.blushUntil ? 0.85 : 0, 1 - Math.exp(-dt * 6));
      M.line.color.setHSL(0.6, 0.95, 0.72 + Math.sin(time * 2.2) * 0.06);

      /* thruster and sparkle trail */
      var boost = Sp.boost.step(speed > 0.9 ? 1 : 0, dt);
      flame.scale.set(1 + boost * 0.3, Math.max(0.001, boost * (1 + Math.sin(time * 40) * 0.12)), 1 + boost * 0.3); flame.material.opacity = clamp(boost, 0, 1) * 0.85; thr.scale.setScalar(1 + boost * 0.6);
      if (boost > 0.3 && time > spkAt) { spkAt = time + 0.05; var si2 = spkNext, sp1 = spk[si2]; spkNext = (spkNext + 1) % SPK; thr.getWorldPosition(tmp3); sp1.life = 1; sp1.i = si2; sp1.v.set(rand(-0.4, 0.4), rand(-1.4, -0.6), rand(-0.2, 0.2)); spkPos[si2 * 3] = tmp3.x; spkPos[si2 * 3 + 1] = tmp3.y; spkPos[si2 * 3 + 2] = tmp3.z; }
      for (var k2 = 0; k2 < SPK; k2++) { var s2 = spk[k2]; if (s2.life <= 0) continue; s2.life -= dt * 1.4; var ii = s2.i * 3; spkPos[ii] += s2.v.x * dt; spkPos[ii + 1] += s2.v.y * dt; spkPos[ii + 2] += s2.v.z * dt; if (s2.life <= 0) spkPos[ii + 1] = -999; }
      spkGeo.attributes.position.needsUpdate = true;

      /* click target follows the robot */
      var h = botPx(); hit.style.transform = 'translate(' + (h.x - SIZE * 0.36).toFixed(1) + 'px,' + (h.y - SIZE * 0.5).toFixed(1) + 'px)';

      renderer.setRenderTarget(null); renderer.render(scene, camera); Glow.render();
      raf = requestAnimationFrame(tick);
    }
    for (var z0 = 0; z0 < SPK; z0++) spkPos[z0 * 3 + 1] = -999;

    function resume() { if (running) return; running = true; layer.style.display = ''; resize(); clock.getDelta(); setOn(); if (!raf) raf = requestAnimationFrame(tick); }
    function pause() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; layer.style.display = 'none'; closeCard(); setOn(); }
    resume();
    return { pause: pause, resume: resume };
  }
})();
