// ============================================================
// BELEZA COM IDENTIDADE — script.js
// ============================================================

// ── NAV scroll (muda de cor) ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── DRAWER — fecha de múltiplas formas ──
(function drawerNav() {
  const burger = document.querySelector('.burger');
  const drawer = document.querySelector('.drawer');
  const closeBtn = document.querySelector('.drawer-close');
  if (!burger || !drawer) return;

  function open() {
    drawer.classList.add('open');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function toggle() {
    drawer.classList.contains('open') ? close() : open();
  }

  burger.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // fecha ao clicar em qualquer link do drawer
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // fecha ao clicar no fundo (área vazia do drawer)
  drawer.addEventListener('click', e => {
    if (e.target === drawer) close();
  });

  // fecha com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });
})();

// ── SCROLL REVEAL ──
(function reveal() {
  const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ── DEPOIMENTOS carrossel ──
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

// ── GALERIA lightbox antes/depois ──
(function lightbox() {
  const cards = Array.from(document.querySelectorAll('.gal-card'));
  const lb = document.querySelector('.lightbox');
  if (!lb || cards.length === 0) return;

  const stage = lb.querySelector('.lb-stage');
  const caption = lb.querySelector('.lb-caption');
  const counter = lb.querySelector('.lb-counter');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');

  const items = cards.map(c => ({
    label: c.dataset.label || '',
    antes: c.dataset.antes || 'antes',
    depois: c.dataset.depois || 'depois',
  }));
  let cur = 0;

  function render(i) {
    const it = items[i];
    stage.innerHTML =
      '<div class="lb-half"><span class="lb-tag l">Antes</span><div class="lb-ph antes">' + it.antes + '</div></div>' +
      '<div class="lb-half"><span class="lb-tag r">Depois</span><div class="lb-ph depois">' + it.depois + '</div></div>' +
      '<div class="lb-divider"></div>';
    caption.textContent = it.label;
    counter.textContent = (i + 1) + ' / ' + items.length;
  }
  function open(i) { cur = i; render(cur); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function go(d) { cur = (cur + d + items.length) % items.length; render(cur); }

  cards.forEach((c, i) => c.addEventListener('click', () => open(i)));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = sx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) go(dx > 0 ? 1 : -1);
  }, { passive: true });
})();
