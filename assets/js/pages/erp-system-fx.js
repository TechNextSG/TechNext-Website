/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* /odoo/erp-system hero: five sample requirements climb the layers from Odoo standard (does standard do it? settings? Studio? another
   system?) and land on the lowest one that can carry them; the meters follow; an upgrade test closes the loop. Pauses off-screen;
   reduced motion keeps the finished stack. */
(function () {
  'use strict';
  var S = window.SVC;
  if (!S) return;

  var ORDER = ['std', 'cfg', 'stu', 'mod', 'int'];
  var REQ = [
    ['Customer portal report', 'std'],
    ['Purchase approval above S$5,000', 'cfg'],
    ['Gate code on the delivery slip', 'stu'],
    ['Tiered sales commission', 'mod'],
    ['Nightly legacy sync', 'int']
  ];
  var W = { std: [0, 0, 0], cfg: [.1, .1, .1], stu: [.2, .25, .2], mod: [.7, .8, .75], int: [.5, .6, .55] };
  var LAB = ['Lowest', 'Low', 'Moderate', 'Higher', 'High'];
  var GATE = { std: 'Standard does it?', cfg: 'Settings can?', stu: 'Studio can?', mod: 'Another system?', int: 'Integrate' };

  function hero() {
    var p = S.$('[data-cst]');
    if (!p) return;
    var slabs = {}; S.$$('[data-stack] > li', p).forEach(function (li) { slabs[li.getAttribute('data-l')] = li; });
    var reqEl = S.$('[data-req]', p), verdict = S.$('[data-verdict]', p);
    var meters = ['risk', 'effort', 'maint'].map(function (k) { return { bar: S.$('[data-m="' + k + '"]', p), txt: S.$('[data-mt="' + k + '"]', p) }; });
    var verdictHtml = verdict.innerHTML, placed = [];

    function meterSet() {
      meters.forEach(function (m, i) {
        var v = 0; placed.forEach(function (t) { v = Math.max(v, W[t][i]); });
        var avg = 0; placed.forEach(function (t) { avg += W[t][i]; }); avg = placed.length ? (v * .6 + avg / placed.length * .4) : 0;
        m.bar.style.setProperty('--w', avg.toFixed(2));
        m.txt.textContent = placed.length ? LAB[Math.min(4, Math.round(avg * 5))] : 'none yet';
      });
    }
    function clearGates() {
      Object.keys(slabs).forEach(function (k) {
        var li = slabs[k]; li.classList.remove('is-hit', 'is-yes', 'is-no');
        var g = S.$('[data-g]', li); g.className = ''; g.textContent = GATE[k];
      });
    }
    function reset() {
      placed = []; clearGates(); meterSet();
      Object.keys(slabs).forEach(function (k) { S.$('[data-slot]', slabs[k]).textContent = ''; });
      reqEl.textContent = 'Pick up the first requirement';
      verdict.classList.remove('is-on'); verdict.querySelector('span').textContent = 'Each change climbs only as far as it must.';
    }
    function show(i) { clearGates(); reqEl.textContent = REQ[i][0]; }
    function gate(i, k) {
      var layer = ORDER[k], target = REQ[i][1], li = slabs[layer], g = S.$('[data-g]', li);
      var yes = layer === target || (layer === 'mod' && target === 'int');
      li.classList.add('is-hit', yes ? 'is-yes' : 'is-no');
      g.className = yes ? 'is-yes' : 'is-no'; g.textContent = (yes ? 'Yes: ' : 'No: ') + GATE[layer];
    }
    function land(i) {
      var t = REQ[i][1], slot = S.$('[data-slot]', slabs[t]), pill = S.el('span', 'cst-pill is-new', REQ[i][0]);
      slot.appendChild(pill); placed.push(t); meterSet();
      Object.keys(slabs).forEach(function (k) { slabs[k].classList.toggle('is-hit', k === t); });
      reqEl.textContent = REQ[i][0] + ' placed';
    }
    function upgrade() {
      clearGates();
      S.$$('.cst-pill', p).forEach(function (pl) { pl.classList.add('is-ok'); });
      verdict.classList.add('is-on'); verdict.querySelector('span').textContent = 'Upgrade test on the next version: every module still fits.';
      reqEl.textContent = 'Upgrade test passed';
    }

    placed = REQ.map(function (r) { return r[1]; }); meterSet();
    if (S.reduce) { S.$$('.cst-pill', p).forEach(function (pl) { pl.classList.add('is-ok'); }); verdict.classList.add('is-on'); return; }

    var steps = [[1200, function () { reset(); }]];
    REQ.forEach(function (r, i) {
      steps.push([700, function () { show(i); }]);
      var top = ORDER.indexOf(r[1]);
      var climb = r[1] === 'int' ? 3 : top;
      for (var k = 0; k <= climb; k++) steps.push([520, (function (k) { return function () { gate(i, k); }; })(k)]);
      steps.push([650, function () { land(i); }]);
    });
    steps.push([900, function () { upgrade(); }]);
    steps.push([3800, function () {}]);
    S.timeline(p, steps);
  }

  function climb() {
    var c = S.$('[data-climb]');
    if (c) S.watch(c, function (v) { c.classList.toggle('is-off', !v); });
  }

  function init() { hero(); climb(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
