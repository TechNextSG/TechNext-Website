/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This design and code are not licensed for copying, reuse or AI training. */
/* /bir-adviser-call (22 Oct 2026): the page's behaviour, in one file (no inline script on the page).
   1. Needs picker: "What do you need most?" swaps the H1 question, the answer, the lead, the Today / In Odoo pair and the live sample Odoo
      panel in place, sets the form's "Biggest BIR headache" and a hidden need field, and keeps ?need=<key> in the address (ads link to it).
      The static HTML is the default need (covered); a valid ?need= opens the page on that need without animation. Text out: 160ms, in:
      360ms on the house ease; reduced motion = instant. It never moves focus or scrolls.
   2. The form's select drives the picker too.
   3. [data-to-form] buttons scroll to the form, put the cursor in the first field and flash it; data-carry-check adds ticked self-check items.
   4. The self-check score. 5. The deadline count (whole days to 31 December 2026, Singapore time, never negative).
   The panels' own replay lives in industry-fx.js (a panel restarts when it receives 'ixf:replay'). */
(function () {
  'use strict';

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var canAnimate = !reduce && typeof Element !== 'undefined' && 'animate' in Element.prototype;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------ deadline */
  function deadline() {
    var live = $('[data-fw-dl-live]'), stat = $('[data-fw-dl-static]');
    if (!live || !stat) return;
    var end = Date.parse('2026-12-31T23:59:59+08:00');
    var days = Math.max(0, Math.floor((end - Date.now()) / 864e5));
    var n = $('[data-fw-days]', live), w = $('[data-fw-days-word]', live);
    if (n) n.textContent = String(days);
    if (w) w.textContent = days === 1 ? 'day' : 'days';
    live.hidden = false; stat.hidden = true;
  }

  /* ------------------------------------------------------------ needs picker */
  function needs() {
    var hero = $('.fw-hero'), dataEl = document.getElementById('fw-needs-data');
    if (!hero || !dataEl) return;
    var NEEDS = [];
    try { NEEDS = JSON.parse(dataEl.textContent); } catch (e) { return; }
    if (!NEEDS.length) return;

    var radios = $$('input[name="fw-need"]', hero);
    var sel = document.getElementById('gs-pain'), hid = $('[data-fw-need]'), topic = $('[data-fw-topic]');
    var status = $('[data-fw-status]', hero);
    var panes = $$('.fw-pane');                       // the live panels sit in the section under the hero
    var els = {
      h1: $('[data-fw="h1"] .fw-q', hero), answer: $('[data-fw="answer"]', hero), lead: $('[data-fw="lead"]', hero),
      today: $('[data-fw="today"]'), odoo: $('[data-fw="odoo"]')
    };
    var order = ['h1', 'answer', 'lead', 'today', 'odoo'];
    var token = 0, timers = [], cur = NEEDS[0].key;

    function byKey(k) { for (var i = 0; i < NEEDS.length; i++) if (NEEDS[i].key === k) return NEEDS[i]; return null; }
    function byOption(o) { for (var i = 0; i < NEEDS.length; i++) if (NEEDS[i].option === o) return NEEDS[i]; return null; }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function cancelAnims(el) { if (el && el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); }
    function fadeOut(el) { return el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' }); }
    function fadeIn(el, delay) { return el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: delay || 0, easing: EASE, fill: 'backwards' }); }

    /* the form and the picker always agree */
    function syncControls(n) {
      radios.forEach(function (r) { r.checked = r.value === n.key; });
      if (sel) sel.value = n.option;
      if (hid) hid.value = n.key;
      if (topic) topic.value = 'Need: ' + n.chip;   // the CRM lead is named after it
    }
    function syncUrl(key) {
      try {
        var u = new URL(location.href);
        u.searchParams.set('need', key);
        history.replaceState(history.state, '', u.pathname + u.search + u.hash);
      } catch (e) { /* old browser: the picker still works */ }
    }
    function showPane(key) {
      var shown = null;
      panes.forEach(function (p) {
        var on = p.getAttribute('data-need') === key;
        p.hidden = !on;
        if (on) shown = p;
      });
      var panel = shown && $('[data-ixf-panel]', shown);
      if (panel) panel.dispatchEvent(new CustomEvent('ixf:replay'));   // industry-fx.js starts the record again from its first step
      return shown;
    }

    function apply(key, opts) {
      var n = byKey(key);
      if (!n) return;
      opts = opts || {};
      var animate = canAnimate && opts.animate !== false;
      var old = cur, same = old === key;
      token++; var mine = token;
      clearTimers();
      order.forEach(function (k) { cancelAnims(els[k]); });
      panes.forEach(cancelAnims);
      cur = key;
      syncControls(n);
      syncUrl(key);
      if (opts.announce && status) status.textContent = 'Showing: ' + n.chip;

      var swaps = order.filter(function (k) { return els[k] && els[k].textContent !== n[k]; });
      var oldPane = panes.filter(function (p) { return !p.hidden; })[0];
      var newPane = panes.filter(function (p) { return p.getAttribute('data-need') === key; })[0];
      if (!animate) {
        swaps.forEach(function (k) { els[k].textContent = n[k]; });
        showPane(key);
        return;
      }
      if (same && !swaps.length && oldPane === newPane) return;
      var outs = swaps.map(function (k) { return fadeOut(els[k]); });
      if (oldPane && oldPane !== newPane) fadeOut(oldPane);
      later(function () {
        if (mine !== token) return;
        outs.forEach(function (a) { a.cancel(); });
        swaps.forEach(function (k, i) {
          els[k].textContent = n[k];
          fadeIn(els[k], i * 35);
        });
        if (oldPane) cancelAnims(oldPane);
        var shown = showPane(key);
        if (shown && shown !== oldPane) fadeIn(shown, 60);
      }, 160);
    }

    /* the picker */
    radios.forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked && r.value !== cur) apply(r.value, { animate: true, announce: true }); });
    });
    /* the form's select */
    if (sel) sel.addEventListener('change', function () {
      var n = byOption(sel.value);
      if (n && n.key !== cur) apply(n.key, { animate: true, announce: true });
      else if (n) syncControls(n);
    });

    /* open on the need in the address, if it is one of ours (no animation) */
    var want = null;
    try { want = new URLSearchParams(location.search).get('need'); } catch (e) { /* ignore */ }
    if (want && byKey(want) && want !== cur) apply(want, { animate: false });
    else if (want && !byKey(want)) syncUrl(cur);          // ?need=nonsense falls back to the default and the address says so
    else syncControls(byKey(cur));

    /* form state the browser restores (back / reload) must not contradict the picker */
    window.addEventListener('pageshow', function () { syncControls(byKey(cur)); });
    window.addEventListener('load', function () { syncControls(byKey(cur)); });

    /* hold the height of the swapping blocks at the tallest need, so the picker and the buttons never move under the cursor */
    var measured = [
      { el: $('.fw-hero h1'), set: function (c, n) { var q = $('.fw-q', c), a = $('em', c); if (q) q.textContent = n.h1; if (a) a.textContent = n.answer; } },
      { el: $('.fw-hero-lead'), set: function (c, n) { var l = $('[data-fw="lead"]', c); if (l) l.textContent = n.lead; } },
      { el: $('.fw-now'), set: function (c, n) { var s = $('[data-fw="today"]', c); if (s) s.textContent = n.today; } },
      { el: $('.fw-then'), set: function (c, n) { var s = $('[data-fw="odoo"]', c); if (s) s.textContent = n.odoo; } }
    ].filter(function (m) { return m.el; });
    function reserve() {
      measured.forEach(function (m) {
        var host = m.el.parentNode, w = m.el.getBoundingClientRect().width, max = 0;
        var c = m.el.cloneNode(true);
        c.removeAttribute('id'); c.setAttribute('aria-hidden', 'true');   // a measuring copy, in the page for one synchronous pass only
        c.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;min-height:0;margin:0;width:' + w + 'px';
        host.appendChild(c);
        NEEDS.forEach(function (n) { m.set(c, n); max = Math.max(max, c.getBoundingClientRect().height); });
        host.removeChild(c);
        if (max) m.el.style.minHeight = Math.ceil(max) + 'px';
      });
    }
    var rt = 0;
    function reserveSoon() { clearTimeout(rt); rt = setTimeout(reserve, 150); }
    window.addEventListener('resize', reserveSoon);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserve);
    window.addEventListener('load', reserve);
    reserve();
  }

  /* ------------------------------------------------------------ self-check */
  var MSG = [
    'Tick what sounds familiar. Your answers stay on this page unless you add them to the form.',
    'A good start. Ask an adviser how Odoo handles this.',
    'This is where most finance teams are. These all come from one cause: books, sales and BIR work in separate places.',
    'Your team is doing the system’s job by hand. Worth a call before the 31 December deadline.'
  ];
  function selfCheck() {
    var list = document.getElementById('fw-check');
    if (!list) return;
    var cnt = document.getElementById('fw-count'), bar = document.getElementById('fw-meter'), msg = document.getElementById('fw-msg');
    function ticked() { return $$('input:checked', list).map(function (i) { return i.value; }); }
    function update() {
      var k = ticked().length, total = $$('input', list).length || 8;
      if (cnt) cnt.textContent = k;
      if (bar) bar.style.width = (k / total * 100) + '%';
      if (msg) msg.textContent = MSG[k === 0 ? 0 : k <= 2 ? 1 : k <= 5 ? 2 : 3];
      list.parentNode.classList.toggle('is-high', k >= 6);
    }
    list.addEventListener('change', update);
    update();
    return ticked;
  }

  /* ------------------------------------------------------------ "to the form" buttons */
  function toForm(ticked) {
    var form = document.getElementById('gs-form');
    if (!form) return;
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-to-form]') : null;
      if (!t) return;
      e.preventDefault();
      if (t.hasAttribute('data-carry-check') && ticked) {
        var p = ticked(), m = document.getElementById('gs-msg');
        if (p.length && m && !m.value) m.value = 'From the self-check: ' + p.join('; ') + '.';
      }
      form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () {
        var f = form.querySelector('.fw-step.is-cur input:not([type=hidden]), .fw-step.is-cur select') || document.getElementById('gs-name');   // the step the visitor is on
        if (f) f.focus({ preventScroll: true });
        form.classList.remove('is-flash'); void form.offsetWidth; form.classList.add('is-flash');
      }, reduce ? 0 : 600);
    });
  }

  /* ------------------------------------------------------------ the form in three steps */
  /* Without this script the three fieldsets show as one form and the browser validates on submit. With it: one step at a
     time, Next checks the step and writes an inline message under each field that needs fixing (aria-invalid, focus on
     the first one), the progress tabs go back to any step already reached, and Send re-checks every step first. */
  function stepForm() {
    var form = $('[data-fw-form]');
    if (!form) return;
    var steps = $$('.fw-step', form), tabs = $$('[data-step-tab]', form);
    var next = $('[data-step-next]', form), back = $('[data-step-back]', form), send = $('.gs-submit', form);
    var nextLabel = $('[data-next-label]', form), bar = $('.fw-bar i', form);
    var NAMES = ['About you', 'Your company', 'Your BIR needs'];
    var cur = 1, reached = 1;
    form.classList.add('is-steps');

    function fields(step) { return $$('input, select, textarea', step).filter(function (el) { return el.type !== 'hidden' && el.name; }); }
    function errEl(el) { var id = el.getAttribute('aria-describedby'); return id ? document.getElementById(id) : null; }
    function mark(el, bad) {
      var f = el.closest('.field'), e = errEl(el);
      if (f) f.classList.toggle('is-err', bad);
      if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
      if (e) { e.textContent = bad ? (el.getAttribute('data-err') || el.validationMessage) : ''; e.hidden = !bad; }
    }
    function check(step) {
      var first = null;
      fields(step).forEach(function (el) {
        var bad = !el.checkValidity();
        if (el.getAttribute('data-err') || bad) mark(el, bad);
        if (bad && !first) first = el;
      });
      return first;
    }
    function go(n, focus) {
      cur = Math.max(1, Math.min(steps.length, n)); reached = Math.max(reached, cur);
      steps.forEach(function (s, i) { s.classList.toggle('is-cur', i + 1 === cur); });
      tabs.forEach(function (t) {
        var k = +t.getAttribute('data-step-tab');
        t.parentNode.classList.toggle('is-on', k === cur);
        t.parentNode.classList.toggle('is-done', k < cur);
        t.disabled = k > reached;
        if (k === cur) t.setAttribute('aria-current', 'step'); else t.removeAttribute('aria-current');
      });
      if (bar) bar.style.width = (cur / steps.length * 100) + '%';
      back.hidden = cur === 1;
      next.hidden = cur === steps.length;
      send.hidden = cur !== steps.length;
      if (nextLabel && cur < steps.length) nextLabel.textContent = 'Next: ' + NAMES[cur];
      if (focus) {
        var top = form.getBoundingClientRect().top;
        if (top < 0) form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        var f = fields(steps[cur - 1])[0]; if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, reduce ? 0 : 250);
      }
    }
    next.addEventListener('click', function () {
      var bad = check(steps[cur - 1]);
      if (bad) { bad.focus(); return; }
      go(cur + 1, true);
    });
    back.addEventListener('click', function () { go(cur - 1, true); });
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var k = +t.getAttribute('data-step-tab');
        if (k > cur) { var bad = check(steps[cur - 1]); if (bad) { bad.focus(); return; } }
        if (k <= reached) go(k, true);
      });
    });
    /* a fixed field loses its message as soon as it is valid */
    form.addEventListener('input', function (e) { var el = e.target; if (el.getAttribute('aria-invalid') && el.checkValidity()) mark(el, false); });
    form.addEventListener('change', function (e) { var el = e.target; if (el.getAttribute('aria-invalid') && el.checkValidity()) mark(el, false); });
    /* Enter in a field moves to the next step instead of sending early */
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && cur < steps.length && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'button') { e.preventDefault(); next.click(); }
    });
    /* outside the Philippines the BIR headache is optional */
    var country = document.getElementById('gs-country'), pain = document.getElementById('gs-pain');
    function countryRule() {
      if (!country || !pain) return;
      var ph = !country.value || country.value === 'Philippines';
      pain.required = ph;
      var req = pain.closest('.field') && $('.fw-req', pain.closest('.field'));
      if (req) req.hidden = !ph;
      if (!ph) mark(pain, false);
    }
    if (country) { if (!country.value) country.value = 'Philippines'; country.addEventListener('change', countryRule); countryRule(); }
    /* Send: every step is checked first (runs before the site's form handler, which posts to /api/lead) */
    form.addEventListener('submit', function (e) {
      for (var i = 0; i < steps.length; i++) {
        var bad = check(steps[i]);
        if (bad) { e.preventDefault(); e.stopImmediatePropagation(); go(i + 1, false); bad.focus(); return; }
      }
    }, true);
    go(1, false);
  }

  function init() {
    deadline();
    needs();
    toForm(selfCheck());
    stepForm();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
