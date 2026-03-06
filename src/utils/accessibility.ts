/**
 * CSS selector string that matches all keyboard-focusable elements.
 * Used by useFocusTrap and any other accessibility utilities that need
 * to enumerate interactive elements within a container.
 */
export const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');
