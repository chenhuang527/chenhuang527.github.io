/* Native effects: no external libraries, requests or persistent storage. */
(() => {
  const body = document.body;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  };
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.nav-shell')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menu.focus(); }
  });
  const tintHeader = () => body.classList.toggle('has-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', tintHeader, { passive: true });
  tintHeader();
  const publications = [...document.querySelectorAll('.publication')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    publications.forEach(item => { item.hidden = button.dataset.filter !== 'all' && item.dataset.status !== button.dataset.filter; });
    const count = publications.filter(item => !item.hidden).length;
    const summary = document.querySelector('.filter-summary');
    if (summary) summary.textContent = `${count} ${button.dataset.filter === 'all' ? 'publications and manuscripts' : button.dataset.filter === 'review' ? 'manuscripts under review' : 'published articles'}`;
  }));

  // Sparse pixels appear only over the visual card. No idle animation loop.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const enabled = body.dataset.effects === 'true';
  const toggle = document.querySelector('.motion-toggle');
  const scene = document.querySelector('.personal-card');
  let paused = false, lastPixel = 0;
  const particles = new Set();
  const animated = () => enabled && !paused && !reducedMotion.matches && !document.hidden;
  let observer;
  if (animated() && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); observer.unobserve(entry.target); }
    }), { threshold: 0 });
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('will-reveal'); observer.observe(el); }
    });
  }
  function syncMotion() {
    body.classList.toggle('effects-paused', !animated());
    if (!animated()) {
      observer?.disconnect();
      document.querySelectorAll('.will-reveal').forEach(el => el.classList.remove('will-reveal'));
      particles.forEach(el => { el.getAnimations().forEach(animation => animation.cancel()); el.remove(); });
      particles.clear();
    }
    if (toggle) {
      toggle.hidden = !enabled || reducedMotion.matches;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Resume effects' : 'Pause effects';
    }
  }
  scene?.addEventListener('pointermove', event => {
    if (!animated() || !finePointer.matches || !Element.prototype.animate) return;
    const now = performance.now();
    if (now - lastPixel < 180 || particles.size >= 5) return;
    lastPixel = now;
    const rect = scene.getBoundingClientRect();
    const pixel = document.createElement('span');
    pixel.className = 'cursor-pixel';
    pixel.setAttribute('aria-hidden', 'true');
    pixel.style.left = `${event.clientX - rect.left}px`;
    pixel.style.top = `${event.clientY - rect.top}px`;
    scene.append(pixel); particles.add(pixel);
    const animation = pixel.animate([
      { opacity: .55, transform: 'translate(0, 0)' },
      { opacity: 0, transform: `translate(${Math.round(Math.random() * 16 - 8)}px, -20px)` }
    ], { duration: 650, easing: 'steps(7)' });
    const remove = () => { pixel.remove(); particles.delete(pixel); };
    animation.onfinish = remove; animation.oncancel = remove;
  }, { passive: true });
  toggle?.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
})();
