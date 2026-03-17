'use client';

import { ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface SiteLayoutProps {
  children: ReactNode;
  isContainedView?: boolean;
  showFooter?: boolean;
}

/**
 * SiteLayout – Content wrapper that applies theme-aware background gradients
 *
 * Wraps RootLayout and adds appropriate background styling based on theme mode.
 * - Dark modes: Rich dark gradients with subtle depth
 * - Light modes: Muted gray radial gradients for reduced brightness
 *
 * Background is applied to both contained and scrolling layouts for consistency.
 */
export function SiteLayout({
  children,
  isContainedView,
  showFooter,
}: SiteLayoutProps) {
  const { theme, themeMode } = useAppTheme();

  // Select gradient per mode for precise per-variant control
  const backgroundStyle = {
    background:
      themeMode === 'high-contrast'
        ? theme.gradients.highContrast.background
        : themeMode === 'grayscale-dark'
          ? theme.gradients.grayscaleDark.background
          : themeMode === 'dark'
            ? theme.gradients.dark.background
            : theme.gradients.light.background,
  };

  return (
    <RootLayout isContainedView={isContainedView} showFooter={showFooter}>
      <div
        className={isContainedView ? 'w-full h-full' : 'w-full min-h-full'}
        style={backgroundStyle}
      >
        {children}
      </div>
    </RootLayout>
  );
}
