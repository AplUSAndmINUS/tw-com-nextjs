'use client';

/**
 * TerenceWaters.com Theme Hook
 * =============================
 *
 * Manages theme state via the Zustand userPreferences store with support for
 * 8 theme variants, font scaling, layout preference, and reduced motion.
 *
 * This is the ONLY way to access extended theme properties (spacing,
 * animations, typography, themeMode, etc.). These properties are NOT available
 * through FluentUI's useTheme() hook.
 */

import { useEffect, useCallback } from 'react';
import { IExtendedTheme, themeMap, ThemeMode } from '../fluentTheme';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';

export type { ThemeMode };

export interface UseAppThemeReturn {
  /** Current theme mode */
  themeMode: ThemeMode;
  /** Current extended theme object */
  theme: IExtendedTheme;
  /** Set a specific theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark modes */
  toggleTheme: () => void;
  /** Check if current theme is dark */
  isDark: boolean;
  /** Current font scale (1.0 = 100%) */
  fontScale: number;
  /** Set font scale */
  setFontScale: (scale: number) => void;
  /** Layout preference for left/right-handed navigation */
  layoutPreference: 'left-handed' | 'right-handed';
  /** Set layout preference */
  setLayoutPreference: (pref: 'left-handed' | 'right-handed') => void;
  /** Whether reduced motion is enabled (user preference) */
  reducedMotion: boolean;
  /** Set reduced motion user preference */
  setReducedMotion: (enabled: boolean) => void;
}

/**
 * Hook for managing application theme and user preferences.
 *
 * IMPORTANT: This is the ONLY way to access extended theme properties (spacing,
 * animations, typography, themeMode, etc.). These properties are NOT available
 * through FluentUI's useTheme() hook because they contain non-serializable
 * objects that would break FluentUI's CSS rendering.
 *
 * Always use useAppTheme() when you need:
 * - Extended theme properties (spacing, animations, borderRadius, etc.)
 * - themeMode value
 * - semanticColors
 * - Theme control methods (setThemeMode, toggleTheme)
 * - Font scale, layout preference, reduced motion
 */
export function useAppTheme(): UseAppThemeReturn {
  const { preferences, setPreference } = useUserPreferencesStore();

  const themeMode = preferences.themeMode;
  const fontScale = preferences.fontScale;
  const layoutPreference = preferences.layoutPreference;
  const reducedMotion = preferences.reducedMotion;

  const theme = themeMap[themeMode] as IExtendedTheme;

  const isDark =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setPreference('themeMode', mode);
    },
    [setPreference]
  );

  const toggleTheme = useCallback(() => {
    setPreference('themeMode', isDark ? 'light' : 'dark');
  }, [isDark, setPreference]);

  const setFontScale = useCallback(
    (scale: number) => {
      setPreference('fontScale', scale);
    },
    [setPreference]
  );

  const setLayoutPreference = useCallback(
    (pref: 'left-handed' | 'right-handed') => {
      setPreference('layoutPreference', pref);
    },
    [setPreference]
  );

  const setReducedMotion = useCallback(
    (enabled: boolean) => {
      setPreference('reducedMotion', enabled);
    },
    [setPreference]
  );

  // Hydrate Zustand store from localStorage on client mount
  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
  }, []);

  // Sync dark mode with Tailwind by adding/removing 'dark' class on <html>
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return {
    themeMode,
    theme,
    setThemeMode,
    toggleTheme,
    isDark,
    fontScale,
    setFontScale,
    layoutPreference,
    setLayoutPreference,
    reducedMotion,
    setReducedMotion,
  };
}
