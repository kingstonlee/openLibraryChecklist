// Modal accessibility helpers, usable in the browser (global `a11y`) and under
// Node's test runner (module.exports). Provides Escape-to-close and Tab focus
// trapping for the currently open modal.
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.a11y = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  // All focusable elements within a container, in DOM order.
  function getFocusable(container) {
    if (!container || typeof container.querySelectorAll !== 'function') return [];
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  }

  // Keydown handler for an open modal.
  //   opts.getActiveModal() -> the open modal element (or null)
  //   opts.close(modal)     -> close it (called on Escape)
  //   opts.doc              -> document (defaults to global document)
  function handleModalKeydown(event, opts) {
    const modal = opts.getActiveModal();
    if (!modal) return;

    if (event.key === 'Escape') {
      if (event.preventDefault) event.preventDefault();
      opts.close(modal);
      return;
    }

    if (event.key === 'Tab') {
      const focusable = getFocusable(modal);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const doc = opts.doc || (typeof document !== 'undefined' ? document : null);
      const active = doc ? doc.activeElement : null;

      if (event.shiftKey && active === first) {
        if (event.preventDefault) event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        if (event.preventDefault) event.preventDefault();
        first.focus();
      }
    }
  }

  return { getFocusable, handleModalKeydown, FOCUSABLE_SELECTOR };
});
