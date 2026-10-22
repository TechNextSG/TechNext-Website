/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/vietnam hero: the sample Odoo 20 Vietnam board. Counters count up when it scrolls in, the bars light up, and a sample invoice
   goes to SInvoice (sending, then sent) with a running feed. Pauses off-screen; reduced motion shows the static finished board. */
(function () {
  'use strict';
  var S = window.SVC;
  if (!S) return;

  function hero() {
    var p = S.$('[data-vnm]');
    if (!p) return;
    var counts = S.$$('[data-count]', p), kSent = S.$('[data-live="sent"]', p);
    var inv = S.$('[data-inv]', p), st = S.$('[data-st]', p), flow = S.$('[data-flow]', p), feed = S.$('[data-feed]', p);
    var n = 42, sent = 128;

    function say(b, t) {
      var li = S.el('li', 'is-new'); li.appendChild(S.el('i'));
      var sp = S.el('span'); sp.appendChild(S.el('b', null, b)); sp.appendChild(document.createTextNode(' ' + t)); li.appendChild(sp);
      feed.insertBefore(li, feed.firstChild);
      while (feed.children.length > 3) feed.removeChild(feed.lastChild);
    }
    function id(k) { return 'INV/2026/' + ('000' + k).slice(-4); }
    function sending() {
      inv.textContent = id(n); st.className = 'sv-st is-run'; st.textContent = 'Sending'; flow.classList.add('is-go');
    }
    function done() {
      st.className = 'sv-st is-ok'; st.textContent = 'Sent'; flow.classList.remove('is-go');
      sent++; kSent.textContent = S.fmt(sent); say(id(n), 'sent to SInvoice'); n++;
    }

    S.once(p, function () {
      counts.forEach(function (c, i) { S.count(c, +c.getAttribute('data-count'), i * 120, 1200); });
    });
    if (S.reduce) { st.className = 'sv-st is-ok'; st.textContent = 'Sent'; return; }
    flow.classList.add('is-go');
    S.timeline(p, [[2400, done], [1700, sending]]);
  }

  function init() { hero(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
