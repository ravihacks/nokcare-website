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
