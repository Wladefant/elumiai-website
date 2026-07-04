/* ===== Elumi AI — interactions (vanilla, no deps) ===== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- nav shrink ---- */
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---- number counters ---- */
  var counted = new WeakSet();
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || counted.has(e.target)) return;
      counted.add(e.target);
      var el = e.target, target = parseInt(el.getAttribute('data-count'), 10);
      if (reduce) { el.textContent = target; return; }
      var start = performance.now(), dur = 1400;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.num-v[data-count]').forEach(function (el) { cio.observe(el); });

  if (!fine || reduce) return; // pointer effects are desktop + motion-ok only

  /* ---- cursor glow ---- */
  var glow = document.getElementById('cursorGlow');
  var gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
  window.addEventListener('mousemove', function (e) { gx = e.clientX; gy = e.clientY; glow.style.opacity = '1'; });
  (function loop() {
    cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
    glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
    requestAnimationFrame(loop);
  })();

  /* ---- magnetic buttons ---- */
  document.querySelectorAll('.magnetic').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var mx = e.clientX - r.left - r.width / 2;
      var my = e.clientY - r.top - r.height / 2;
      btn.style.transform = 'translate(' + mx * 0.28 + 'px,' + my * 0.4 + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });

  /* ---- 3D tilt + spotlight cards ---- */
  document.querySelectorAll('.tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.transform = 'perspective(800px) rotateX(' + (0.5 - py) * 8 + 'deg) rotateY(' + (px - 0.5) * 8 + 'deg) translateY(-4px)';
      card.style.setProperty('--mx', px * 100 + '%');
      card.style.setProperty('--my', py * 100 + '%');
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  /* ---- parallax on floating art ---- */
  var depthEls = [].slice.call(document.querySelectorAll('[data-depth]'));
  var tx = 0, ty = 0, curX = 0, curY = 0;
  window.addEventListener('mousemove', function (e) {
    tx = (e.clientX / window.innerWidth - 0.5);
    ty = (e.clientY / window.innerHeight - 0.5);
  });
  (function paraLoop() {
    curX += (tx - curX) * 0.06; curY += (ty - curY) * 0.06;
    depthEls.forEach(function (el) {
      var d = parseFloat(el.getAttribute('data-depth')) || 0;
      el.style.transform = 'translate(' + (-curX * d) + 'px,' + (-curY * d) + 'px)';
    });
    requestAnimationFrame(paraLoop);
  })();
})();
