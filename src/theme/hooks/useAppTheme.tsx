'use client';

/**
 * TerenceWaters.com Theme Hook
 * =============================
 *
 * Manages theme state with support for 8 theme variants:
 * - light: Default light mode
 * - dark: Default dark mode
 * - high-contrast: High contrast mode for accessibility
 * - protanopia: Red-blind color mode
 * - deuteranopia: Green-blind color mode
 * - tritanopia: Blue-blind color mode
 * - grayscale: Grayscale light mode
 * - grayscale-dark: Grayscale dark mode
 *
 * Features:
 * - LocalStorage persistence (loaded after mount to prevent SSR hydration issues)
 * - System preference detection
 * - Manual theme switching
 * - FluentUI theme integration
 * - SSR-safe initialization
 */

import { useEffect, useState, useCallback } from 'react';
import { ThemeMode, IExtendedTheme, themeMap } from '../fluentTheme';

// LocalStorage key for theme persistence
const THEME_STORAGE_KEY = 'tw-theme-mode';

// Prefer system theme by default
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export interface UseAppThemeReturn {
  /** Current theme mode */
  themeMode: ThemeMode;
  /** Current extended theme object */
  theme: IExtendedTheme;
  /** Set a specific theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark modes */
  toggleTheme: () => void;
  /** Reset to system preference */
  resetToSystemTheme: () => void;
  /** Check if current theme is dark */
  isDark: boolean;
  /** Check if using system preference */
  isSystemTheme: boolean;
}

/**
 * Hook for managing application theme
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
 *
 * @example
 * ```tsx
 * // ✅ CORRECT - Access extended theme
 * function MyComponent() {
 *   const { theme, themeMode, setThemeMode } = useAppTheme();
 *
 *   return (
 *     <div style={{ padding: theme.spacing.md }}>
 *       Mode: {themeMode}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // ❌ INCORRECT - Don't use FluentUI's useTheme for extended properties
 * import { useTheme } from '@fluentui/react-components';
 *
 * function MyComponent() {
 *   const theme = useTheme();
 *   console.log(theme.spacing);   // ❌ undefined
 *   console.log(theme.themeMode); // ❌ undefined
 * }
 * ```
 */
export function useAppTheme(): UseAppThemeReturn {
  // Initialize with 'light' to prevent SSR hydration mismatch
  // Actual theme will be loaded from localStorage in useEffect
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isSystemTheme, setIsSystemTheme] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current theme object
  const theme = themeMap[themeMode];

  // Check if current theme is dark variant
  const isDark =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

  // Initialize theme from localStorage after mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(
        THEME_STORAGE_KEY
      ) as ThemeMode | null;

      if (stored && stored in themeMap) {
        // User has a saved preference
        setThemeModeState(stored);
        setIsSystemTheme(false);
      } else {
        // No saved preference, use system theme
        const systemTheme = getSystemTheme();
        setThemeModeState(systemTheme);
        setIsSystemTheme(true);
      }
    } catch (error) {
      // If localStorage access fails, fall back to system theme
      const systemTheme = getSystemTheme();
      setThemeModeState(systemTheme);
      setIsSystemTheme(true);
    }

    setIsInitialized(true);
  }, []); // Run once on mount

  // Set theme mode and persist to localStorage
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
      } catch (error) {
        // Silently fail if localStorage is not available
      }
    }
    setIsSystemTheme(false);
  }, []);

  // Toggle between light and dark modes
  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  // Reset to system preference
  const resetToSystemTheme = useCallback(() => {
    const systemTheme = getSystemTheme();
    setThemeModeState(systemTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (error) {
        // Silently fail if localStorage is not available
      }
    }
    setIsSystemTheme(true);
  }, []);

  // Listen to system theme changes when using system preference
  useEffect(() => {
    if (!isSystemTheme) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setThemeModeState(e.matches ? 'dark' : 'light');
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [isSystemTheme]);

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
    resetToSystemTheme,
    isDark,
    isSystemTheme,
  };
}
