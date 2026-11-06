export function setupNavigation() {
  const button = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');
  if (!button || !navigation) return;
  button.hidden = false;
  function closeMenu() { button.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      button.focus();
    }
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  window.matchMedia('(min-width: 1000px)').addEventListener('change', closeMenu);
}


export function setupEnquiryPreviews() {
  document.querySelectorAll('[data-enquiry-preview]').forEach(form => {
    // Register the network guard before enabling any fields.
    form.addEventListener('submit', event => event.preventDefault());
    const fields = form.querySelector('fieldset');
    const review = form.querySelector('[data-review-enquiry]');
    const status = form.querySelector('[data-preview-message]');
    if (!fields || !review || !status || form.dataset.formMode !== 'preview') return;
    review.addEventListener('click', () => {
      status.textContent = '';
      if (!form.reportValidity()) return;
      status.textContent = form.dataset.previewStatus;
    });
    form.addEventListener('input', () => { status.textContent = ''; });
    fields.disabled = false;
  });
}

// Keep the header compact while reading and preserve space above anchor targets.
export function setupScrollControls() {
  const header = document.querySelector('.site-header');
  const topButton = document.querySelector('.back-to-top');
  if (!header || !topButton) return;
  let scheduled = false;
  function update() {
    const scroll = window.scrollY;
    // Hysteresis prevents the changing header height from toggling at one boundary.
    if (scroll > 180) header.classList.add('is-compact');
    else if (scroll < 40) header.classList.remove('is-compact');
    topButton.hidden = scroll < 500 && document.activeElement !== topButton;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  topButton.addEventListener('blur', update);
  topButton.addEventListener('click', () => {
    header.querySelector('.brand')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  function measure() {
    document.documentElement.style.setProperty('--header-offset', `${header.getBoundingClientRect().height + 24}px`);
  }
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(header);
  else window.addEventListener('resize', measure);
  measure();
  update();
}
