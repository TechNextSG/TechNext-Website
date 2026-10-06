/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* /employee-hub: the Copy buttons next to each company detail. */
(function () {
  'use strict';
  function done(btn, ok) {
    var lab = btn.querySelector('span');
    if (!lab) return;
    lab.textContent = ok ? 'Copied' : 'Press Ctrl+C';
    btn.classList.toggle('is-done', ok);
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { lab.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1800);
  }
  function fallback(btn) {
    // select the value so the visitor can copy it by hand
    var v = btn.parentNode.querySelector('span');
    if (!v || !window.getSelection) return done(btn, false);
    var r = document.createRange(); r.selectNodeContents(v);
    var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    done(btn, ok);
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var text = btn.getAttribute('data-copy') || '';
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(btn, true); }, function () { fallback(btn); });
    } else {
      fallback(btn);
    }
  });
})();
