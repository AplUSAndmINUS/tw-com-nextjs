'use client';

import { useAppTheme } from '../hooks/useAppTheme';
import { FluentProvider } from '@fluentui/react-components';

/**
 * Extended Theme Provider
 *
 * Filters out non-serializable JavaScript objects from the theme before
 * passing to FluentUI's FluentProvider. This prevents [object Object] in CSS.
 *
 * Use `useAppTheme()` to access the full theme with extended properties.
 */
export function ExtendedThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useAppTheme();

  // Extract only FluentUI-compatible properties (remove JS objects)
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
