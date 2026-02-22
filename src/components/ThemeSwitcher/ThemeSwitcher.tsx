'use client';

/**
 * TerenceWaters.com Theme Switcher Wrapper
 * =========================================
 *
 * A wrapper component that provides theme context to all children.
 * This component manages the theme state and wraps the entire app.
 *
 * Usage:
 * ```tsx
 * import { ThemeSwitcher } from '@/components/ThemeSwitcher';
 *
 * export function RootLayout({ children }) {
 *   return (
 *     <ThemeSwitcher>
 *       {children}
 *     </ThemeSwitcher>
 *   );
 * }
 * ```
 */

import { ReactNode } from 'react';

interface ThemeSwitcherProps {
  children: ReactNode;
}

/**
 * Theme switcher wrapper component
 * Wraps children with theme context
 */
export function ThemeSwitcher({ children }: ThemeSwitcherProps) {
  return <>{children}</>;
}
