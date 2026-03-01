'use client';

import { useEffect } from 'react';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';

/**
 * StoreHydrator
 *
 * Handles one-time rehydration of persisted Zustand stores from localStorage.
 * Mounted once at app-level to avoid redundant rehydration calls.
 */
export function StoreHydrator() {
  useEffect(() => {
    // Rehydrate persisted stores once on app mount
    useUserPreferencesStore.persist.rehydrate();
  }, []);

  // This component renders nothing—it only manages side effects
  return null;
}
