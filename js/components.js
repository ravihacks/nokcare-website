function panelTiming() {
  const tokens = getComputedStyle(document.documentElement);
  return {
    duration: parseFloat(tokens.getPropertyValue('--motion-panel')) || 320,
    easing: tokens.getPropertyValue('--ease').trim() || 'ease-out'
  };
}

export function setupNavigation() {
  const button = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');
  if (!button || !navigation) return;
  button.hidden = false;
  let menuAnimation;
  function setMenu(open) {
    const start = navigation.getBoundingClientRect().height;
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    menuAnimation?.cancel();
    navigation.style.height = '';
    navigation.style.overflow = '';
    button.setAttribute('aria-expanded', String(open));
    navigation.inert = !open && !matchMedia('(min-width: 1000px)').matches;
    navigation.classList.toggle('is-open', open);
    if (matchMedia('(min-width: 1000px), (prefers-reduced-motion: reduce)').matches || !navigation.animate || wasOpen === open) return;
    const end = open ? navigation.getBoundingClientRect().height : 0;
    navigation.classList.add('is-open');
    navigation.style.overflow = 'hidden';
    menuAnimation = navigation.animate([{ height: `${start}px`, paddingTop: open ? '0px' : getComputedStyle(navigation).paddingTop, opacity: open ? 0 : 1 }, { height: `${end}px`, paddingTop: open ? getComputedStyle(navigation).paddingTop : '0px', opacity: open ? 1 : 0 }], panelTiming());
    menuAnimation.onfinish = () => {
      navigation.classList.toggle('is-open', open);
      navigation.style.overflow = '';
      menuAnimation = null;
    };
  }
  function closeMenu() { setMenu(false); }
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    setMenu(open);
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
  topButton.hidden = false;
  function update() {
    const scroll = window.scrollY;
    // Hysteresis prevents the changing header height from toggling at one boundary.
    if (scroll > 180) header.classList.add('is-compact');
    else if (scroll <= 0) header.classList.remove('is-compact');
    topButton.classList.toggle('is-visible', scroll >= 500 || document.activeElement === topButton);
  }
  window.addEventListener('scroll', update, { passive: true });
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
  window.addEventListener('pageshow', () => { measure(); update(); });
  measure();
  update();
}

// Animate native details while keeping their built-in semantics and keyboard support.
export function setupAccordions() {
  document.querySelectorAll('.faq details').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary || !details.animate) return;
    let animation;
    let expanded = details.open;
    summary.addEventListener('click', event => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animation?.cancel();
        details.style.overflow = '';
        expanded = !details.open;
        return;
      }
      event.preventDefault();
      const start = details.getBoundingClientRect().height;
      animation?.cancel();
      expanded = !expanded;
      details.open = true;
      const styles = getComputedStyle(details);
      const closedHeight = summary.getBoundingClientRect().height + parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) + parseFloat(styles.borderTopWidth) + parseFloat(styles.borderBottomWidth);
      const end = expanded ? details.getBoundingClientRect().height : closedHeight;
      details.style.overflow = 'hidden';
      animation = details.animate([{ height: `${start}px` }, { height: `${end}px` }], panelTiming());
      animation.onfinish = () => {
        details.open = expanded;
        details.style.overflow = '';
        animation = null;
      };
    });
  });
}
