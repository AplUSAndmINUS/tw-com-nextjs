'use client';

import { useAppTheme } from '../hooks/useAppTheme';
import { FluentProvider } from '@fluentui/react-components';

/**
 * Extended Theme Provider
 *
 * Filters out non-serializable JavaScript objects from the extended theme before
 * passing to FluentUI's FluentProvider. This prevents [object Object] in CSS.
 *
 * Properties filtered out (contain functions/complex objects):
 * - spacing, animations, borderRadius, zIndices, shadows, gradients
 * - breakpoints, mediaQueries, typography, themeMode
 *
 * Properties passed through to FluentProvider:
 * - All FluentUI base theme properties (colors, fonts, etc.)
 * - semanticColors (safe - contains only primitive string values)
 *
 * IMPORTANT: Extended properties (spacing, animations, etc.) and themeMode are
 * NOT available through FluentUI's theme context. Components MUST use the
 * useAppTheme() hook to access these properties. Never use FluentUI's useTheme()
 * hook for extended properties.
 *
 * @example
 * // ✅ CORRECT - Use useAppTheme() for extended properties
 * const { theme, themeMode } = useAppTheme();
 * console.log(theme.themeMode);  // ✅ Works
 * console.log(theme.spacing);    // ✅ Works
 *
 * // ❌ INCORRECT - FluentUI's useTheme() cannot access extended properties
 * const { theme } = useTheme();
 * console.log(theme.themeMode);  // ❌ undefined
 * console.log(theme.spacing);    // ❌ undefined
 */
export function ExtendedThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppTheme();

  // Filter out extended properties that contain non-serializable objects
  // IMPORTANT: themeMode is also filtered out here, meaning it's NOT available in
  // FluentUI's theme context. Components must use useAppTheme() to access it.
  const {
    spacing,
    animations,
    borderRadius,
    zIndices,
    shadows,
    gradients,
    breakpoints,
    mediaQueries,
    typography,
    themeMode,
    ...fluentTheme
  } = theme;

  return <FluentProvider theme={fluentTheme}>{children}</FluentProvider>;
}
