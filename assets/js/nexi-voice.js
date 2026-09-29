/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* Nexi's voice: her lines read aloud by the browser's own speech engine in a bright, higher voice, and
   small robot sounds (chirp, knock, pop, sparkle...) made with Web Audio, so there are no sound files.
   Off until the visitor turns it on with a speaker button ([data-nexi-voice]); the choice is remembered.
   Browsers allow sound only after a tap, so a remembered "on" waits for the first tap on the page.
   window.TNVoice: on, live, speaking (read-only), set(on), say(text) -> Promise (true when the line has been
   spoken, 'cut' when a newer line interrupted it, 'stop' when stopped, false if it was not spoken), stop(), sfx(name).
   Turning the voice on fires a cancelable tn:voice; a listener that reads out its own line cancels the greeting. */
(function () {
  'use strict';
  var KEY = 'tn_nexi_voice';
  var synth = window.speechSynthesis || null;
  var on = false, unlocked = false, ctx = null, voice = null, current = null;
  try { on = localStorage.getItem(KEY) === '1'; } catch (e) { /* storage may be blocked */ }

  /* a clear, bright English voice where the device has one (the exact voice differs by device) */
  function pickVoice() {
    var all = synth ? synth.getVoices() : [];
    var en = all.filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    var prefer = [/Aria|Jenny|Ava|Emma|Michelle|Sonia|Libby|Natasha/i, /Samantha|Karen|Moira|Tessa|Serena/i,
                  /Google UK English Female/i, /Google US English/i, /Zira|Hazel|Susan|Female/i];
    for (var i = 0; i < prefer.length; i++) for (var j = 0; j < en.length; j++) if (prefer[i].test(en[j].name)) return en[j];
    return en[0] || all[0] || null;
  }
  // no speech engine on this device: the voice buttons have nothing to do
  if (!synth) document.documentElement.classList.add('no-voice');
  if (synth && 'onvoiceschanged' in synth) synth.addEventListener('voiceschanged', function () { voice = pickVoice(); });

  /* what the speech engine should not read: stage directions (*taps the glass*), emoji and symbols */
  function clean(t) {
    return String(t || '').replace(/\*[^*]*\*/g, ' ').replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
      .replace(/[←-⇿☀-➿⬀-⯿✓✔✦✧♪♫♥❤️]/g, ' ')
      .replace(/·/g, ',').replace(/\s+/g, ' ').trim();
  }
  function say(text) {
    return new Promise(function (res) {
      var t = clean(text);
      if (!on || !unlocked || !synth || !/[a-z0-9]/i.test(t)) return res(false);
      try {
        if (current) current('cut');                            // the line playing now was interrupted, not spoken
        synth.cancel();
        var u = new SpeechSynthesisUtterance(t), done = false, tm = 0;
        voice = voice || pickVoice();
        if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
        u.pitch = 1.5; u.rate = 1.04; u.volume = 1;
        var fin = function (why) { if (done) return; done = true; clearTimeout(tm); if (current === fin) current = null; res(why || true); };
        current = fin;
        u.onend = function () { fin(true); }; u.onerror = function () { fin(true); };
        tm = setTimeout(function () { fin(true); }, 1600 + t.length * 95);   // some engines never fire onend
        synth.speak(u);
      } catch (e) { current = null; res(false); }
    });
  }
  function stop() { if (current) current('stop'); if (synth) try { synth.cancel(); } catch (e) { /* ignore */ } }

  /* ---------- sounds ---------- */
  function ac() {
    if (!unlocked) return null;
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }
  function tone(c, type, f0, f1, t, dur, vol) {
    var o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
  }
  function noise(c, t, dur, vol, hz) {
    var b = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = b; f.type = 'bandpass'; f.frequency.value = hz; f.Q.value = 0.8; g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  }
  var SFX = {
    chirp: function (c, t) { [[620, 980, 0], [880, 1320, 0.12], [1175, 1700, 0.24]].forEach(function (n) { tone(c, 'triangle', n[0], n[1], t + n[2], 0.12, 0.09); }); },
    knock: function (c, t) { tone(c, 'sine', 190, 70, t, 0.16, 0.55); noise(c, t, 0.06, 0.5, 1500); },
    boop: function (c, t) { tone(c, 'sine', 880, 1320, t, 0.09, 0.12); },
    pop: function (c, t) { tone(c, 'triangle', 420, 1250, t, 0.09, 0.14); },
    gasp: function (c, t) { tone(c, 'triangle', 520, 1500, t, 0.22, 0.1); tone(c, 'sine', 1500, 1100, t + 0.2, 0.18, 0.07); },
    boing: function (c, t) { tone(c, 'sine', 160, 640, t, 0.3, 0.16); tone(c, 'sine', 620, 330, t + 0.3, 0.22, 0.09); },
    sparkle: function (c, t) { [1568, 2093, 2637, 3136, 4186].forEach(function (f, i) { tone(c, 'sine', f, 0, t + i * 0.055, 0.2, 0.045); }); },
    heart: function (c, t) { tone(c, 'sine', 660, 0, t, 0.13, 0.1); tone(c, 'sine', 990, 0, t + 0.14, 0.2, 0.1); },
    whoosh: function (c, t) { noise(c, t, 0.45, 0.22, 700); },
    tada: function (c, t) { [523, 659, 784, 1047].forEach(function (f, i) { tone(c, 'triangle', f, 0, t + i * 0.09, 0.28, 0.07); }); }
  };
  function sfx(name) {
    var c = on && ac(); if (!c || !SFX[name]) return;
    try { SFX[name](c, c.currentTime + 0.01); } catch (e) { /* sound is optional */ }
  }

  /* ---------- the toggle ---------- */
  function unlock() {
    if (unlocked) return; unlocked = true;
    ac();
    // wake the speech engine inside the tap, or the first real line can be refused
    if (synth) try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) { /* ignore */ }
  }
  function paint() {
    [].forEach.call(document.querySelectorAll('[data-nexi-voice]'), function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      // a button with visible text is named by it; the icon-only one by a fixed name (its state is aria-pressed)
      var l = b.querySelector('[data-voice-label]');
      if (l) { l.textContent = on ? l.getAttribute('data-on') : l.getAttribute('data-off'); b.removeAttribute('aria-label'); }
      else b.setAttribute('aria-label', 'Nexi’s voice');
    });
    document.documentElement.classList.toggle('nexi-voice', on);
  }
  // returns true when a listener took the moment (it reads out its own line instead of the greeting)
  function set(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) { /* storage may be blocked */ }
    if (!on) { stop(); if (ctx && ctx.state === 'running') try { ctx.suspend(); } catch (e) { /* ignore */ } }
    paint();
    var ev = new CustomEvent('tn:voice', { detail: { on: on }, cancelable: true });
    document.dispatchEvent(ev);
    return ev.defaultPrevented;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-nexi-voice]'); if (!b) return;
    e.preventDefault(); unlock();
    var taken = set(!on);
    if (on) { sfx('chirp'); if (!taken) say('Hi! I’m Nexi. Now you can hear me!'); }
  });
  // a remembered "on" needs one tap somewhere before any sound
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, function () { if (on) unlock(); }, { capture: true, passive: true }); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint); else paint();

  window.TNVoice = { say: say, stop: stop, sfx: sfx, set: set };
  Object.defineProperty(window.TNVoice, 'on', { get: function () { return on; } });
  Object.defineProperty(window.TNVoice, 'live', { get: function () { return on && unlocked; } });
  Object.defineProperty(window.TNVoice, 'speaking', { get: function () { return !!current; } });
})();
