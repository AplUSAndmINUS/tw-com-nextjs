'use client';

import React from 'react';

/**
 * Detects whether the user prefers reduced motion.
 * Respects the OS-level `prefers-reduced-motion` media query.
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    shouldReduceMotion: prefersReducedMotion,
    osPreference: prefersReducedMotion,
  };
};

export default useReducedMotion;
