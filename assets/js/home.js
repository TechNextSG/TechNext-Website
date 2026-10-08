/* Homepage sections below the hero (assets/css/home.css).
   - every .hm-live section gets .hm-on while it is on screen; its looping .hm-a animations only run then
   - the app wall lights one random tile at a time while it is in view
   No loop runs with prefers-reduced-motion (the CSS switches the animations off too). */
(function () {
  'use strict';
  if (!document.body.classList.contains('is-home')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var live = Array.prototype.slice.call(document.querySelectorAll('.hm-live'));
  var wall = document.querySelector('[data-hm-wall]');
  var wallOn = false, wallTimer = 0, lastTile = null;

  function lightTile() {
    if (!wall || !wallOn || document.hidden) return;
    var tiles = wall.querySelectorAll('.hm-tile');
    if (!tiles.length) return;
    var w = window.innerWidth;
    for (var n = 0; n < 6; n++) {
      var t = tiles[(Math.random() * tiles.length) | 0];
      var r = t.getBoundingClientRect();
      if (r.left > 0 && r.right < w) {
        if (lastTile) lastTile.classList.remove('is-lit');
        t.classList.add('is-lit'); lastTile = t;
        break;
      }
    }
  }
  function setWall(on) {
    wallOn = on;
    clearInterval(wallTimer);
    if (on && !reduce) wallTimer = setInterval(lightTile, 900);
  }

  if (!('IntersectionObserver' in window)) {
    live.forEach(function (s) { s.classList.add('hm-on'); });
    setWall(true);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      en.target.classList.toggle('hm-on', en.isIntersecting);
      if (en.target.contains(wall)) setWall(en.isIntersecting);
    });
  }, { rootMargin: '80px 0px 80px 0px', threshold: 0 });
  live.forEach(function (s) { io.observe(s); });
})();
