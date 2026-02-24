/**
 * TW.com Theme System
 * ===================
 *
 * IMPORTANT: To access theme values in components, always use the useAppTheme() hook.
 * Extended theme properties (spacing, animations, typography, themeMode, etc.) are
 * NOT available through FluentUI's useTheme() hook.
 *
 * @example Correct usage
 * ```tsx
 * import { useAppTheme } from '@/theme';
 *
 * function MyComponent() {
 *   const { theme, themeMode } = useAppTheme();
 *   // ✅ Has access to ALL theme properties including extended ones
 *   return <div style={{ padding: theme.spacing.md }} />;
 * }
 * ```
 */

// Theme objects
export {
  twTheme,
  twLightTheme,
  twDarkTheme,
  twHighContrastTheme,
  twProtanopiaTheme,
  twDeuteranopiaTheme,
  twTritanopiaTheme,
  twGrayscaleTheme,
  twGrayscaleDarkTheme,
  themeMap,
} from './fluentTheme';

// Types
export type {
  IExtendedTheme,
  IExtendedSpacing,
  ThemeMode,
} from './fluentTheme';

// Design tokens
export {
  spacing,
  zIndices,
  borderRadius,
  shadows,
  gradients,
  animations,
  typography,
  breakpoints,
  mediaQueries,
  fontFamily,
  fontSizes,
} from './fluentTheme';

// Hooks
export { useAppTheme } from './hooks/useAppTheme';
export type { UseAppThemeReturn } from './hooks/useAppTheme';
export { useFooterHeight } from './hooks/useFooterHeight';
export { useHeaderHeight } from './hooks/useHeaderHeight';

// Providers
export { FluentThemeProvider } from './providers/FluentThemeProvider';
export { ExtendedThemeProvider } from './providers/ExtendedThemeProvider';
