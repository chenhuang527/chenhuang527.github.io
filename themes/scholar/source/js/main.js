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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const enabled = body.dataset.effects === 'true';
  let paused = false;
  const animated = () => enabled && !paused && !reducedMotion.matches;
  let revealObserver;
  if (enabled && !reducedMotion.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.04 });
    document.querySelectorAll('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('will-reveal'); revealObserver.observe(element);
      }
    });
  }
  const canvas = document.querySelector('#starfield');
  const context = canvas && canvas.getContext('2d');
  const visual = document.querySelector('.hero-visual');
  const toggle = document.querySelector('.motion-toggle');
  let width = 0, height = 0, stars = [], frame = 0, last = 0;
  const pointer = { x: 0, y: 0, active: false };
  const smooth = { x: 0, y: 0 };
  function resize() {
    if (!context) return;
    width = window.innerWidth; height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(width < 600 ? 40 : 95, Math.floor(width * height / 12000));
    stars = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, r: .4 + Math.random() * 1.1, depth: .25 + Math.random() * .75, phase: Math.random() * Math.PI * 2 }));
  }
  function draw(time) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    smooth.x += (pointer.x - smooth.x) * .035;
    smooth.y += (pointer.y - smooth.y) * .035;
    const scroll = Math.min(window.scrollY, height * 2);
    for (const star of stars) {
      const x = (star.x + smooth.x * star.depth * 15 + width) % width;
      const y = (star.y + smooth.y * star.depth * 12 - scroll * star.depth * .055 + height) % height;
      const opacity = .32 + (Math.sin(time * .00045 + star.phase) + 1) * .22;
      context.fillStyle = `rgba(193,210,255,${opacity})`;
      context.beginPath(); context.arc(x, y, star.r, 0, Math.PI * 2); context.fill();
      if (pointer.active && animated()) {
        const px = (pointer.x + 1) * width / 2, py = (pointer.y + 1) * height / 2;
        const distance = Math.hypot(x - px, y - py);
        if (distance < 140) {
          context.strokeStyle = `rgba(127,183,255,${(1 - distance / 140) * .22})`;
          context.lineWidth = .65;
          context.beginPath(); context.moveTo(x, y); context.lineTo(px, py); context.stroke();
        }
      }
    }
    if (visual && animated()) {
      visual.style.setProperty('--tilt-x', `${-smooth.y * 3}deg`);
      visual.style.setProperty('--tilt-y', `${smooth.x * 4}deg`);
    }
  }
  function tick(time) {
    if (!animated() || document.hidden) { frame = 0; return; }
    // Cap canvas drawing at ~30fps; only 40 stars on mobile, 95 on desktop.
    if (time - last >= 32) { draw(time); last = time; }
    frame = requestAnimationFrame(tick);
  }
  function syncMotion() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    body.classList.toggle('effects-paused', !animated() || document.hidden);
    if (!animated()) {
      revealObserver?.disconnect();
      document.querySelectorAll('.will-reveal').forEach(el => el.classList.remove('will-reveal'));
      pointer.x = pointer.y = smooth.x = smooth.y = 0;
      pointer.active = false;
      if (visual) { visual.style.removeProperty('--tilt-x'); visual.style.removeProperty('--tilt-y'); }
    }
    if (toggle) {
      toggle.hidden = !enabled || reducedMotion.matches;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Resume effects' : 'Pause effects';
    }
    if (context && !document.hidden) {
      draw(0);
      if (animated()) frame = requestAnimationFrame(tick);
    }
  }
  if (enabled) {
    window.addEventListener('pointermove', event => {
      if (!animated() || !finePointer.matches) return;
      pointer.x = event.clientX / Math.max(width, 1) * 2 - 1;
      pointer.y = event.clientY / Math.max(height, 1) * 2 - 1;
      pointer.active = true;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { pointer.x = pointer.y = 0; pointer.active = false; });
    window.addEventListener('resize', () => { resize(); if (!animated()) draw(0); }, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);
    reducedMotion.addEventListener('change', syncMotion);
    toggle?.addEventListener('click', () => { paused = !paused; syncMotion(); });
    resize();
  }
  syncMotion();
})();
