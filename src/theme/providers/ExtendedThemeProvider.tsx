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
 * Use `useAppTheme()` to access the full theme with extended properties.
 */
export function ExtendedThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppTheme();

  // Filter out extended properties that contain non-serializable objects
  // Everything else (including semanticColors) passes through to FluentProvider
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
