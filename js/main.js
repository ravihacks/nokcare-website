import { setupNavigation } from './components.js';
document.documentElement.classList.add('js');
setupNavigation();

// Progressive enhancement: content remains readable if observers are unsupported.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const elements = document.querySelectorAll('.section-heading, .step, .editorial-row > div, .perspective-grid > *, .introduction-grid > *, .local-grid > div, .section .split > div, .cta');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  elements.forEach(element => {
    // Avoid concealing a card containing an anchor target or keyboard focus.
    if (element.matches(':target') || element.contains(document.activeElement)) return;
    element.classList.add('reveal', 'is-pending');
    observer.observe(element);
  });
  function revealAll() {
    elements.forEach(element => element.classList.remove('is-pending'));
    observer.disconnect();
  }
  motionPreference.addEventListener('change', event => { if (event.matches) revealAll(); });
  document.addEventListener('focusin', event => {
    event.target.closest('.is-pending')?.classList.remove('is-pending');
  });
  window.addEventListener('hashchange', () => {
    let fragment;
    try { fragment = decodeURIComponent(location.hash.slice(1)); }
    catch { return; } // Ignore malformed URL fragments without interrupting the page.
    const target = document.getElementById(fragment);
    target?.classList.remove('is-pending');
    target?.closest('.is-pending')?.classList.remove('is-pending');
  });
}
