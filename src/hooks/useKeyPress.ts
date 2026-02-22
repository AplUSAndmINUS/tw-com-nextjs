'use client';

import { useEffect, useRef } from 'react';

/**
 * Listens for specific keyboard key presses.
 * Useful for keyboard shortcuts and accessibility features.
 *
 * @param targetKey - The key to listen for (e.g., 'Escape', 'Enter')
 * @param callback - Function to call when the key is pressed
 * @param options - Optional modifier key configuration
 */
export function useKeyPress(
  targetKey: string,
  callback: (event: KeyboardEvent) => void,
  options?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  }
): void {
  const callbackRef = useRef(callback);
  const optionsRef = useRef(options);

  useEffect(() => {
    callbackRef.current = callback;
    optionsRef.current = options;
  }, [callback, options]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key !== targetKey) return;

      const opts = optionsRef.current;
      if (opts?.ctrl && !event.ctrlKey) return;
      if (opts?.shift && !event.shiftKey) return;
      if (opts?.alt && !event.altKey) return;
      if (opts?.meta && !event.metaKey) return;

      callbackRef.current(event);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [targetKey]);
}
