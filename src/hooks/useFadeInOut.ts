import { useState, useEffect, useLayoutEffect } from 'react';

/**
 * Hook for managing fade in/out transitions between content changes.
 * Useful for page transitions or content swapping with smooth fades.
 *
 * @param targetValue - The current value (e.g., pathname)
 * @param duration - Duration of fade in milliseconds (default: 300)
 * @returns Object containing:
 *   - style: CSS style object with opacity and transition
 *   - displayedValue: The currently displayed value (lags behind targetValue during transition)
 *   - fadeStage: Internal state machine stage ('in' | 'out' | 'pending-in')
 *   - isTransitioning: Boolean indicating if a transition is in progress
 *
 * @example
 * const pathname = usePathname();
 * const { style, displayedValue, isTransitioning } = useFadeInOut(pathname, 300);
 *
 * return <div style={style}>{children}</div>
 */
export function useFadeInOut<T>(targetValue: T, duration: number = 300) {
  const [displayedValue, setDisplayedValue] = useState(targetValue);
  const [fadeStage, setFadeStage] = useState<'in' | 'out' | 'pending-in'>('in');

  // When target changes, start fade out
  // Use useLayoutEffect to set opacity to 0 BEFORE browser paint, preventing flash
  useLayoutEffect(() => {
    if (targetValue !== displayedValue) {
      setFadeStage('out');
    }
  }, [targetValue, displayedValue]);

  // After fade out completes, update displayed value
  useEffect(() => {
    if (fadeStage === 'out') {
      const timeout = setTimeout(() => {
        setDisplayedValue(targetValue);
        setFadeStage('pending-in');
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [fadeStage, targetValue, duration]);

  // After value updates, trigger fade in
  // Use requestAnimationFrame for reliable reflow before transition
  useEffect(() => {
    if (fadeStage === 'pending-in') {
      // Double rAF ensures the DOM has updated and browser has painted
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFadeStage('in');
        });
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [fadeStage]);

  const style = {
    opacity: fadeStage === 'in' ? 1 : 0,
    transition: `opacity ${duration}ms ease-in-out`,
  };

  return {
    style,
    displayedValue,
    fadeStage,
    isTransitioning: fadeStage !== 'in',
  };
}
