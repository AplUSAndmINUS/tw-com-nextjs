'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
].join(', ');

/**
 * Traps keyboard focus within a container element while active.
 *
 * When `isActive` is true:
 * - Moves focus to the first focusable element inside the container
 * - Wraps Tab / Shift+Tab so focus cycles within the container
 *
 * @param isActive - Whether the focus trap should be active
 * @returns A ref to attach to the container element
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  isActive: boolean
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const getFocusableElements = (): HTMLElement[] =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));

    // Move focus to the first focusable element when the trap activates.
    // requestAnimationFrame ensures focus moves after the browser has completed
    // rendering, preventing screen reader announcement interruptions.
    const rafId = requestAnimationFrame(() => {
      const firstElement = getFocusableElements()[0];
      if (firstElement) firstElement.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if focus is on the first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if focus is on the last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}
