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
  const enabled = body.dataset.effects === 'true';
  const toggle = document.querySelector('.motion-toggle');
  let paused = false;
  function syncMotion() {
    body.classList.toggle('effects-paused', !enabled || paused || reducedMotion.matches || document.hidden);
    if (toggle) {
      toggle.hidden = !enabled || reducedMotion.matches;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Resume effects' : 'Pause effects';
    }
  }
  toggle?.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
})();
