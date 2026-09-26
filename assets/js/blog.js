/* Blog: EN/VI article toggle, share buttons, topic filter. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'tn_article_lang';

  /* ---------------- EN / VI article toggle ---------------- */
  (function lang() {
    var bar = $('.langbar');
    var bodies = $$('.post-body[data-lang]');
    if (!bar || bodies.length < 2) return;

    // A .reveal only gets .is-in when the IntersectionObserver in site.js sees it
    // intersecting. Everything inside the hidden article is never visible, so it is
    // never observed as intersecting and would stay at opacity:0 after we unhide it.
    function show(el) {
      $$('.reveal', el).forEach(function (r) { r.classList.add('is-in'); });
    }

    function set(code, remember) {
      bodies.forEach(function (b) { b.hidden = b.getAttribute('data-lang') !== code; });
      $$('.langbtn', bar).forEach(function (btn) {
        var on = btn.getAttribute('data-lang') === code;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var live = bodies.filter(function (b) { return !b.hidden; })[0];
      if (live) { show(live); live.setAttribute('lang', code); }
      document.documentElement.setAttribute('data-article-lang', code);
      if (remember) { try { localStorage.setItem(KEY, code); } catch (e) {} }
    }

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.langbtn') : null;
      if (btn) { e.preventDefault(); set(btn.getAttribute('data-lang'), true); }
    });

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (!saved) {
      var nav = (navigator.language || '').toLowerCase();
      saved = nav.indexOf('vi') === 0 ? 'vi' : 'en';
    }
    set(bodies.some(function (b) { return b.getAttribute('data-lang') === saved; }) ? saved : 'en', false);
  })();

  /* ---------------- share ---------------- */
  (function share() {
    var bar = $('.share-bar');
    if (!bar) return;
    var url = (function () {
      var c = $('link[rel="canonical"]');
      return c && c.href ? c.href : location.href;
    })();
    var title = (document.title || '').replace(/\s*[|·]\s*TechNext.*$/, '').trim();

    $$('[data-share]', bar).forEach(function (el) {
      var kind = el.getAttribute('data-share');
      if (kind === 'linkedin') {
        el.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
      } else if (kind === 'x') {
        el.href = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) +
                  '&text=' + encodeURIComponent(title);
      } else if (kind === 'copy') {
        el.addEventListener('click', function () {
          var done = function () {
            el.classList.add('is-done');
            setTimeout(function () { el.classList.remove('is-done'); }, 1600);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(done, done);
          } else {
            var t = document.createElement('textarea');
            t.value = url; t.setAttribute('readonly', '');
            t.style.position = 'fixed'; t.style.opacity = '0';
            document.body.appendChild(t); t.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(t); done();
          }
        });
      }
    });
  })();

  /* ---------------- topic filter (listing) ---------------- */
  (function filter() {
    var chips = $('.chips');
    var grid = $('#post-grid');
    if (!chips || !grid) return;
    var cards = $$('.post-card', grid);
    var empty = $('#post-empty');

    chips.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.chip') : null;
      if (!btn) return;
      var want = btn.getAttribute('data-filter');
      $$('.chip', chips).forEach(function (c) { c.classList.toggle('is-on', c === btn); });
      var shown = 0;
      cards.forEach(function (c) {
        var on = want === 'all' || c.getAttribute('data-cat') === want;
        c.hidden = !on;
        if (on) { shown++; c.classList.add('is-in'); }
      });
      if (empty) empty.hidden = shown !== 0;
    });
  })();
})();
