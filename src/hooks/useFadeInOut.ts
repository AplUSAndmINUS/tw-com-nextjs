import { useState, useEffect } from 'react';

/**
 * Hook for managing fade in/out transitions between content changes.
 * Useful for page transitions or content swapping with smooth fades.
 *
 * @param targetValue - The current value (e.g., pathname)
 * @param duration - Duration of fade in milliseconds (default: 300)
 *
 * @example
 * const pathname = usePathname();
 * const { style, displayedValue } = useFadeInOut(pathname, 300);
 *
 * return <div style={style}>{children}</div>
 */
export function useFadeInOut<T>(targetValue: T, duration: number = 300) {
  const [displayedValue, setDisplayedValue] = useState(targetValue);
  const [fadeStage, setFadeStage] = useState<'in' | 'out' | 'pending-in'>('in');

  // When target changes, start fade out
  useEffect(() => {
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
  useEffect(() => {
    if (fadeStage === 'pending-in') {
      const timeout = setTimeout(() => {
        setFadeStage('in');
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [fadeStage]);

  const style = {
    opacity: fadeStage === 'in' ? 1 : 0,
    transition: `opacity ${duration}ms ease-in-out`,
  };

  return { style, displayedValue, fadeStage };
}
