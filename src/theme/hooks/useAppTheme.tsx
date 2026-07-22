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

import { useEffect, useCallback, useState } from 'react';
import { IExtendedTheme, themeMap } from '../fluentTheme';
import { isDarkFamily, type ThemeMode } from '../modes';
import {
  defaultUserPreferences,
  useUserPreferencesStore,
} from '@/store/userPreferencesStore';

export type { ThemeMode };

export interface UseAppThemeReturn {
  /** True once the persisted preferences store has rehydrated on the client */
  isHydrated: boolean;
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
  /** Whether reduced transparency is enabled (user preference) */
  reducedTransparency: boolean;
  /** Set reduced transparency user preference */
  setReducedTransparency: (enabled: boolean) => void;
  /** Whether the high-contrast layer is enabled (orthogonal to themeMode) */
  highContrast: boolean;
  /** Toggle the high-contrast layer */
  setHighContrast: (enabled: boolean) => void;
  /** Whether the colorblind-safe palette layer is enabled */
  colorblindSafe: boolean;
  /** Toggle the colorblind-safe palette layer */
  setColorblindSafe: (enabled: boolean) => void;
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
  const persistApi = useUserPreferencesStore.persist;
  const [isHydrated, setIsHydrated] = useState(
    persistApi?.hasHydrated?.() ?? true
  );

  useEffect(() => {
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

  const resolvedPreferences = isHydrated ? preferences : defaultUserPreferences;

  const themeMode = resolvedPreferences.themeMode;
  const fontScale = resolvedPreferences.fontScale;
  const layoutPreference = resolvedPreferences.layoutPreference;
  const reducedMotion = resolvedPreferences.reducedMotion;
  const reducedTransparency = resolvedPreferences.reducedTransparency;
  const highContrast = resolvedPreferences.highContrast;
  const colorblindSafe = resolvedPreferences.colorblindSafe;

  const theme = themeMap[themeMode] as IExtendedTheme;

  const isDark = isDarkFamily(themeMode);

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

  const setReducedTransparency = useCallback(
    (enabled: boolean) => {
      setPreference('reducedTransparency', enabled);
    },
    [setPreference]
  );

  const setHighContrast = useCallback(
    (enabled: boolean) => {
      setPreference('highContrast', enabled);
    },
    [setPreference]
  );

  const setColorblindSafe = useCallback(
    (enabled: boolean) => {
      setPreference('colorblindSafe', enabled);
    },
    [setPreference]
  );

  /**
   * Mirror theme state onto <html> so CSS can style from it.
   *
   * Three separate signals, all on the same element:
   *   data-theme  selects the token block in styles/tokens/colors.css
   *   .dark       drives Tailwind's `dark:` variant
   *   color-scheme makes native scrollbars and form controls match
   *
   * The pre-hydration script in theme/themeScript.ts sets exactly these before
   * first paint; this effect keeps them current as the user changes modes.
   * <html> is required rather than a wrapper: the token blocks are authored
   * against :root, <body> needs them, and the Header mounts outside the
   * provider tree.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    root.style.colorScheme = isDark ? 'dark' : 'light';
    root.classList.toggle('dark', isDark);
  }, [themeMode, isDark]);

  /**
   * Expose the accessibility preferences to CSS.
   *
   * Lets stylesheets honour the in-app toggles the same way they honour
   * prefers-reduced-motion, instead of every component threading the booleans
   * through props. See the [data-tw-*] rules in styles/tokens/effects.css.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-tw-reduced-motion', String(reducedMotion));
    root.setAttribute(
      'data-tw-reduced-transparency',
      String(reducedTransparency)
    );
    // Orthogonal a11y layers — the string values match the selectors in
    // styles/tokens/a11y-layers.css. Attributes are removed when off so the
    // selectors don't match at all, rather than matching an "off" value.
    if (highContrast) root.setAttribute('data-tw-contrast', 'high');
    else root.removeAttribute('data-tw-contrast');
    if (colorblindSafe) root.setAttribute('data-tw-cvd', 'on');
    else root.removeAttribute('data-tw-cvd');
  }, [reducedMotion, reducedTransparency, highContrast, colorblindSafe]);

  return {
    isHydrated,
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
    reducedTransparency,
    setReducedTransparency,
    highContrast,
    setHighContrast,
    colorblindSafe,
    setColorblindSafe,
  };
}
