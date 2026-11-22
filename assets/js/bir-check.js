/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. */
/* Home (22 Oct 2026; 3 Nov 2026 CAS is the priority): the CAS or CBA check, the countdown to the computerised books
   deadline in ORUS, the BIR report viewer, and pausing the decorative motion of any home section that is off screen.
   General guidance from RMO 9-2021 and RMC 5-2021; the page says so next to the result, and every result asks the
   visitor to confirm with their accountant or RDO. Sample report data matches assets/docs/technext-sample-bir-reports.pdf. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- CAS or CBA check */
  var form = $('[data-bircheck]'), panel = $('[data-birresult]');
  if (form && panel) {
    var pill = $('.fx-pill', panel), pillT = $('[data-verdict-t]', panel), say = $('[data-say]', panel);
    var steps = $$('[data-step]', panel), book = $('[data-bookcall]', panel);
    var BOOK = book ? book.getAttribute('href') : '';
    steps.forEach(function (li, k) { li.style.setProperty('--k', k); });

    var TXT = {
      pending: ['Answer the questions', 'Your answers suggest which registration fits, and what to prepare from your Odoo.'],
      cas: ['Likely a CAS', 'Your answers point to a Computerized Accounting System (CAS): the system issues your invoices, or you are a large taxpayer. Confirm with your accountant or RDO; these are the steps.'],
      cba: ['Likely a CBA', 'Invoices issued by hand, with your books kept in Odoo, point to Computerized Books of Accounts (CBA). Confirm with your accountant or RDO; these are the steps.'],
      unsure: ['Confirm with your accountant', 'RMO 9-2021 draws the line at invoices: if the system issues them, it is a CAS. Go through it with your accountant; these are the steps either way.']
    };
    var STEPS = { cas: ['sworn', 'samples', 'audit', 'books'], cba: ['sworn', 'samples', 'audit', 'books'],
      unsure: ['sworn', 'samples', 'audit', 'books'], pending: [] };
    var LABEL = { lts: { yes: 'under LTS', no: 'not under LTS', unsure: 'LTS not sure' },
      inv: { system: 'invoices from Odoo', manual: 'invoices by hand', unsure: 'invoicing not sure' },
      host: { cloud: 'Odoo Online or Odoo.sh', own: 'own server', unsure: 'hosting not decided' },
      reg: { no: 'no registered system', yes: 'current system registered', unsure: 'registration not sure' } };

    var val = function (n) { var i = $('input[name="' + n + '"]:checked', form); return i ? i.value : ''; };
    function verdict(a) {
      if (a.lts === 'yes' || a.inv === 'system') return 'cas';
      if (a.inv === 'manual' && a.lts === 'no') return 'cba';
      if (a.inv && a.lts) return 'unsure';
      return 'pending';
    }
    var last = '';
    function update() {
      var a = { lts: val('lts'), inv: val('inv'), host: val('host'), reg: val('reg') };
      $$('.fx-row', form).forEach(function (row) { row.classList.toggle('is-done', !!$('input:checked', row)); });
      var v = verdict(a);
      var on = STEPS[v].slice();
      if (v !== 'pending' && (a.reg === 'yes' || a.reg === 'unsure')) on.splice(3, 0, 'new');   // moving from a registered system
      pill.setAttribute('data-verdict', v);
      pillT.textContent = TXT[v][0];
      if (v !== last) {
        say.textContent = TXT[v][1];
        say.classList.remove('is-swap'); void say.offsetWidth; say.classList.add('is-swap');
        last = v;
      }
      panel.classList.toggle('is-live', v !== 'pending');
      steps.forEach(function (li) {
        var hit = on.indexOf(li.getAttribute('data-step')) > -1;
        li.classList.toggle('is-on', hit);
        li.classList.toggle('is-off', v !== 'pending' && !hit);
      });
      if (book && BOOK) {
        var bits = Object.keys(a).filter(function (k) { return a[k]; }).map(function (k) { return LABEL[k][a[k]]; });
        var msg = 'CAS or CBA check: ' + (bits.length ? bits.join(', ') : 'not answered') + '. Result: ' + TXT[v][0] + '.';
        book.setAttribute('href', BOOK + (BOOK.indexOf('?') > -1 ? '&' : '?') + 'message=' + encodeURIComponent(msg));
      }
    }
    form.addEventListener('change', update);
    update();
  }

  /* ---------------------------------------------------------------- countdown to 30 Jan 2027 (Manila): computerised books in ORUS */
  var cd = $$('[data-cd]');
  if (cd.length) {
    var END = Date.parse('2027-01-30T23:59:59+08:00'), timer = null;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var tick = function () {
      var ms = Math.max(0, END - Date.now());
      var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
      cd.forEach(function (el) { var k = el.getAttribute('data-cd'); el.textContent = k === 'd' ? d : pad(k === 'h' ? h : m); });
    };
    var run = function () { clearInterval(timer); if (!document.hidden) { tick(); timer = setInterval(tick, 20000); } };
    document.addEventListener('visibilitychange', run);
    run();
  }

  /* ---------------------------------------------------------------- BIR report viewer (sample data) */
  var rep = $('[data-reports]');
  if (rep) {
    var R = {
      '2307': { t: 'BIR 2307 · Q3 2026', feed: [0, 2, 4],
        head: ['Payee', 'ATC', 'Jul', 'Aug', 'Sep', 'Withheld'], num: [2, 3, 4, 5],
        rows: [['Northbay Logistics', 'WC158', '120,000.00', '98,000.00', '134,500.00', '3,525.00'],
               ['Ridgeview IT Services', 'WC160', '45,000.00', '45,000.00', '45,000.00', '2,700.00'],
               ['Marisol Cleaning Co.', 'WC158', '18,000.00', '18,000.00', '21,500.00', '575.00'],
               ['Ortega Law Office', 'WI011', '30,000.00', '0.00', '30,000.00', '6,000.00']],
        total: ['Total', '', '213,000.00', '161,000.00', '231,000.00', '12,800.00'],
        foot: 'One certificate per payee and quarter, from the vendor bills you posted with withholding tax.' },
      slsp: { t: 'SLSP sales · Q3 2026', feed: [1, 3, 5],
        head: ['Customer', 'Exempt', 'Zero-rated', 'Taxable', 'Output VAT'], num: [1, 2, 3, 4],
        rows: [['Azure Bay Hotels', '0.00', '0.00', '842,000.00', '101,040.00'],
               ['Pinecrest Clinics', '125,000.00', '0.00', '310,500.00', '37,260.00'],
               ['Lumen Export Co.', '0.00', '560,000.00', '0.00', '0.00'],
               ['Kalye Foods Corp.', '0.00', '0.00', '228,750.00', '27,450.00']],
        total: ['Total', '125,000.00', '560,000.00', '1,381,250.00', '165,750.00'],
        foot: 'Exported as a DAT file for the BIR’s validation tool; the purchases list works the same way.' },
      qap: { t: 'QAP and SAWT · Q3 2026', feed: [0, 1, 2, 3],
        head: ['List', 'Counterparty', 'ATC', 'Tax base', 'Withheld'], num: [3, 4],
        rows: [['QAP', 'Northbay Logistics', 'WC158', '352,500.00', '3,525.00'],
               ['QAP', 'Ridgeview IT Services', 'WC160', '135,000.00', '2,700.00'],
               ['SAWT', 'Azure Bay Hotels', 'WC158', '842,000.00', '8,420.00'],
               ['SAWT', 'Pinecrest Clinics', 'WC160', '310,500.00', '6,210.00']],
        foot: 'QAP supports your 1601-EQ; SAWT supports the creditable taxes you claim. Both as DAT files.' },
      '2550q': { t: '2550Q VAT summary · Q3 2026', feed: [0, 1, 2, 3, 4, 5],
        head: ['Line', 'Description', 'Tax base', 'VAT'], num: [2, 3],
        rows: [['Sales', 'VATable sales', '1,381,250.00', '165,750.00'],
               ['Sales', 'Zero-rated sales', '560,000.00', '0.00'],
               ['Sales', 'Exempt sales', '125,000.00', '0.00'],
               ['Purchases', 'Goods', '690,400.00', '82,848.00'],
               ['Purchases', 'Services', '240,000.00', '28,800.00']],
        total: ['Net', 'VAT payable', '', '54,102.00'],
        foot: 'Drill into any line in Odoo to see the invoices and bills behind it.' },
      orus: { t: 'Books of Accounts · 2026', feed: [0, 1, 2, 3, 4, 5],
        head: ['Book', 'Period', 'Entries', 'Export'], num: [2],
        rows: [['General journal', 'Jan to Dec 2026', '1,248', 'Exported from Odoo'],
               ['General ledger', 'Jan to Dec 2026', '3,912', 'Exported from Odoo'],
               ['Sales journal', 'Jan to Dec 2026', '1,284', 'Exported from Odoo'],
               ['Purchase journal', 'Jan to Dec 2026', '642', 'Exported from Odoo'],
               ['Cash receipts and disbursements', 'Jan to Dec 2026', '2,106', 'Exported from Odoo']],
        foot: 'Computerised books for your own ORUS registration, due within 30 days after year-end. Exported from Odoo; you register them.' }
    };
    var tabs = $$('[data-rep]', rep), tblH = $('[data-sheet-tbl] thead', rep), tblB = $('[data-sheet-tbl] tbody', rep);
    var title = $('[data-sheet-t]', rep), foot = $('[data-sheet-foot]', rep), ledger = $$('[data-ledger] li', rep);
    var cell = function (tag, txt, n) { return '<' + tag + (n ? ' class="n"' : '') + '>' + txt + '</' + tag + '>'; };
    function show(key, focus) {
      var d = R[key]; if (!d) return;
      tabs.forEach(function (t) { var on = t.getAttribute('data-rep') === key; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
      title.textContent = d.t;
      tblH.innerHTML = '<tr>' + d.head.map(function (h, i) { return cell('th', h, d.num.indexOf(i) > -1); }).join('') + '</tr>';
      var rows = d.rows.map(function (r, k) { return '<tr style="--r:' + k + '">' + r.map(function (c, i) { return cell('td', c, d.num.indexOf(i) > -1); }).join('') + '</tr>'; });
      if (d.total) rows.push('<tr class="is-total" style="--r:' + d.rows.length + '">' + d.total.map(function (c, i) { return cell('td', c, d.num.indexOf(i) > -1); }).join('') + '</tr>');
      tblB.innerHTML = rows.join('');
      foot.textContent = d.foot;
      ledger.forEach(function (li, i) { li.classList.toggle('is-picked', d.feed.indexOf(i) > -1); });
    }
    rep.addEventListener('click', function (e) { var t = e.target.closest('[data-rep]'); if (t) show(t.getAttribute('data-rep')); });
    rep.addEventListener('keydown', function (e) {
      var t = e.target.closest('[data-rep]'); if (!t || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      var i = tabs.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1);
      show(tabs[(i + tabs.length) % tabs.length].getAttribute('data-rep'), true); e.preventDefault();
    });
    show('2307');
  }

  /* ---------------------------------------------------------------- hero slide 4: keep Nexi clear of the result panel */
  var chk = $('.slide--check');
  if (chk && 'MutationObserver' in window) {
    var mark = function () { document.body.classList.toggle('fx-check-on', chk.classList.contains('is-active')); };
    new MutationObserver(mark).observe(chk, { attributes: true, attributeFilter: ['class'] }); mark();
  }

  /* ---------------------------------------------------------------- pause off-screen motion */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('fx-off', !e.isIntersecting); }); }, { rootMargin: '80px' });
    $$('.fx-hero, #reports, #solutions').forEach(function (s) { io.observe(s); });
  }
})();
