'use client';

/**
 * TerenceWaters.com FluentUI Theme Provider
 * ==========================================
 *
 * Wraps the application with FluentUI's ThemeProvider and our custom theme system.
 * Provides theme switching capabilities and accessibility support.
 *
 * Usage:
 * ```tsx
 * // In your root layout or app component
 * import { FluentThemeProvider } from '@/theme/providers/FluentThemeProvider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <FluentThemeProvider>
 *           {children}
 *         </FluentThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

import { FluentProvider } from '@fluentui/react-components';
import { useAppTheme } from '../hooks/useAppTheme';

interface FluentThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the app with FluentUI theme
 */
export function FluentThemeProvider({ children }: FluentThemeProviderProps) {
  const { theme } = useAppTheme();

  return <FluentProvider theme={theme}>{children}</FluentProvider>;
}
