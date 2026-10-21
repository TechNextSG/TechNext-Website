/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/philippines hero dashboard: count-ups when it scrolls in, bars and chips light up, a small live feed
   (2307 generated and sent) that pauses off-screen. Under reduced motion everything is static at its final values. */
(function () {
  'use strict';
  var dash = document.querySelector('[data-ph-dash]');
  if (!dash) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counts = [].slice.call(dash.querySelectorAll('[data-count]'));
  var queueEl = dash.querySelector('[data-live="queue"]');
  var feed = dash.querySelector('[data-feed]');
  var runSt = dash.querySelector('[data-st-run]');
  var timer = null, visible = false, started = false, queue = 14, step = 0;

  function fmt(n) { return n.toLocaleString('en-US'); }

  function countUp() {
    counts.forEach(function (el, i) {
      var to = +el.getAttribute('data-count'), t0 = null, dur = 1300;
      function tick(t) {
        if (t0 === null) t0 = t + i * 120;
        var p = Math.min(1, Math.max(0, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(to * e));
        if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(to);
      }
      el.textContent = '0';
      requestAnimationFrame(tick);
    });
  }

  var EVENTS = [
    ['BIR 2307', 'generated on BILL/2026/0951', 1],
    ['2307', 'sent to Ridgeview IT Services with the payment', -1],
    ['BIR 2306', 'generated on BILL/2026/0952', 1],
    ['2307', 'sent to Northbay Logistics with the payment', -1],
    ['BIR 2307', 'generated on BILL/2026/0958', 1],
    ['2307', 'sent to Lumen Export Co. with the payment', -1]
  ];

  function push() {
    var ev = EVENTS[step++ % EVENTS.length];
    queue = Math.max(10, queue + ev[2]);
    if (queueEl) queueEl.textContent = queue;
    var li = document.createElement('li'); li.className = 'is-new';
    li.innerHTML = '<i></i><span><b></b> </span>';
    li.querySelector('b').textContent = ev[0];
    li.querySelector('span').appendChild(document.createTextNode(ev[1]));
    feed.insertBefore(li, feed.firstChild);
    while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    if (runSt && step === 2) { runSt.className = 'ph-st is-ok'; runSt.textContent = 'Validated'; }
  }

  function loop() { if (timer || reduce) return; timer = setInterval(push, 3400); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  function enter() {
    if (!started) {
      started = true; dash.classList.add('is-in');
      if (!reduce) countUp();
    }
    loop();
  }

  if (!('IntersectionObserver' in window)) { dash.classList.add('is-in'); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      visible = e.isIntersecting;
      dash.classList.toggle('fx-off', !visible);
      if (visible) enter(); else stop();
    });
  }, { threshold: .15 });
  io.observe(dash);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (visible) loop(); });
})();
