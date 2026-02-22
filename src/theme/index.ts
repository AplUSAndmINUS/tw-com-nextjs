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

// Providers
export { FluentThemeProvider } from './providers/FluentThemeProvider';
