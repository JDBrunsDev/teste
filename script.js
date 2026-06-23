// ============================================================
// BELEZA COM IDENTIDADE — script.js
// ============================================================

// ── HERO CANVAS: veios de mármore animados lentamente ──
// Técnica: gradientes radiais claros sobre base off-white, com
// movimento muito sutil. Evoca pedra polida, não "tela viva".
(function marbleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  // tons claros do mármore
  const veins = [
    { x: 0.20, y: 0.30, r: 0.6,  color: [221, 211, 196], phase: 0,   speed: 0.00010 },
    { x: 0.75, y: 0.55, r: 0.55, color: [235, 228, 217], phase: 2.1, speed: 0.00012 },
    { x: 0.55, y: 0.15, r: 0.45, color: [191, 163, 116], phase: 4.2, speed: 0.00008 },
    { x: 0.40, y: 0.75, r: 0.5,  color: [246, 242, 236], phase: 1.0, speed: 0.00011 },
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#F6F2EC';
    ctx.fillRect(0, 0, w, h);

    veins.forEach(v => {
      const ox = Math.sin(t * v.speed + v.phase) * 0.05;
      const oy = Math.cos(t * v.speed * 0.8 + v.phase) * 0.05;
      const cx = (v.x + ox) * w;
      const cy = (v.y + oy) * h;
      const radius = v.r * Math.max(w, h);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const [r, gg, b] = v.color;
      g.addColorStop(0, `rgba(${r},${gg},${b},0.45)`);
      g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduce) { draw(0); }
  else { (function loop(t){ draw(t); requestAnimationFrame(loop); })(0); }
})();

// ── CURSOR CUSTOM ──
(function cursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const c = document.querySelector('.cursor');
  const d = document.querySelector('.cursor-dot');
  if (!c || !d) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    d.style.left = mx + 'px'; d.style.top = my + 'px';
  });
  (function follow(){ cx += (mx-cx)*0.18; cy += (my-cy)*0.18; c.style.left = cx+'px'; c.style.top = cy+'px'; requestAnimationFrame(follow); })();
  document.querySelectorAll('a, button, .proc-card, .gal-cell, .depo-btn').forEach(el => {
    el.addEventListener('mouseenter', () => c.classList.add('hover'));
    el.addEventListener('mouseleave', () => c.classList.remove('hover'));
  });
  document.addEventListener('mouseleave', () => { c.style.opacity='0'; d.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { c.style.opacity='1'; d.style.opacity='1'; });
})();

// ── NAV scroll ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

// ── DRAWER ──
(function drawer() {
  const b = document.querySelector('.burger');
  const dr = document.querySelector('.drawer');
  if (!b || !dr) return;
  b.addEventListener('click', () => {
    const open = dr.classList.toggle('open');
    b.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  dr.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    dr.classList.remove('open'); document.body.style.overflow = '';
  }));
})();

// ── REVEAL ──
(function reveal() {
  const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ── CARROSSEL ──
(function carousel() {
  const track = document.querySelector('.depo-track');
  const prev = document.querySelector('.depo-prev');
  const next = document.querySelector('.depo-next');
  if (!track || !prev || !next) return;
  const cards = track.querySelectorAll('.depo-card');
  let idx = 0;
  const vis = () => window.innerWidth < 900 ? 1 : 3;
  function go(n) {
    const max = Math.max(0, cards.length - vis());
    idx = Math.max(0, Math.min(n, max));
    const gap = 24;
    const cw = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${idx * cw}px)`;
  }
  prev.addEventListener('click', () => go(idx - 1));
  next.addEventListener('click', () => go(idx + 1));
  window.addEventListener('resize', () => go(idx));
  let sx = 0;
  track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = sx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) go(dx > 0 ? idx + 1 : idx - 1);
  }, { passive: true });
})();

// ── CONTADOR ──
(function counter() {
  function anim(el, target) {
    const dur = 1800, start = performance.now();
    (function step(now){
      const p = Math.min((now-start)/dur, 1);
      const e = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(e * target);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { anim(e.target, parseInt(e.target.dataset.count,10)); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));
})();
