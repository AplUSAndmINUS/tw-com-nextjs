'use client';

import { useEffect } from 'react';
import { FOCUSABLE_SELECTORS } from '@/utils/accessibility';

/**
 * Traps keyboard focus within a container element when active.
 * TAB moves forward and SHIFT+TAB moves backward through focusable elements,
 * wrapping at the boundaries so focus never leaves the container.
 *
 * Use this hook on modal dialogs, slide-in panels, and other overlaid UI
 * to keep keyboard users inside the interactive region.
 *
 * @param containerRef - Ref to the container element to trap focus within
 * @param isActive - Whether the trap is currently active
 */
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean
): void {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const getFocusableElements = (): HTMLElement[] =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter(
        (el) =>
          !el.hasAttribute('hidden') &&
          !el.closest('[aria-hidden="true"]') &&
          el.offsetParent !== null
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        // SHIFT+TAB: wrap from first → last
        if (active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // TAB: wrap from last → first
        if (active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}
