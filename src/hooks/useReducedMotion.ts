'use client';

import React from 'react';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';

/**
 * Detects whether the user prefers reduced motion.
 * Checks both the OS-level `prefers-reduced-motion` media query
 * and the user's stored preference in the Zustand store.
 * Returns shouldReduceMotion = true if either is set.
 */
export const useReducedMotion = () => {
  const { preferences } = useUserPreferencesStore();
  const [osPreference, setOsPreference] = React.useState(false);

  React.useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      setOsPreference(e.matches);
    };

    setOsPreference(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const shouldReduceMotion = preferences.reducedMotion || osPreference;

  return {
    shouldReduceMotion,
    userPreference: preferences.reducedMotion,
    osPreference,
  };
};

export default useReducedMotion;
