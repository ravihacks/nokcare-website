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
