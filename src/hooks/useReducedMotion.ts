'use client';

import React from 'react';
import { defaultUserPreferences } from '@/store/userPreferencesStore';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';

/**
 * Detects whether the user prefers reduced motion.
 * Checks both the OS-level `prefers-reduced-motion` media query
 * and the user's stored preference in the Zustand store.
 * Returns shouldReduceMotion = true if either is set.
 */
export const useReducedMotion = () => {
  const { preferences } = useUserPreferencesStore();
  const persistApi = useUserPreferencesStore.persist;
  const [isHydrated, setIsHydrated] = React.useState(
    persistApi?.hasHydrated?.() ?? true
  );
  const [osPreference, setOsPreference] = React.useState(false);

  React.useEffect(() => {
    if (!persistApi) {
      setIsHydrated(true);
      return;
    }

    const unsubscribeHydrate = persistApi.onHydrate(() => {
      setIsHydrated(false);
    });
    const unsubscribeFinishHydration = persistApi.onFinishHydration(() => {
      setIsHydrated(true);
    });

    setIsHydrated(persistApi.hasHydrated());

    return () => {
      unsubscribeHydrate();
      unsubscribeFinishHydration();
    };
  }, [persistApi]);

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

  const reducedMotionPreference = isHydrated
    ? preferences.reducedMotion
    : defaultUserPreferences.reducedMotion;
  const shouldReduceMotion = reducedMotionPreference || osPreference;

  return {
    shouldReduceMotion,
    userPreference: reducedMotionPreference,
    osPreference,
  };
};

export default useReducedMotion;
