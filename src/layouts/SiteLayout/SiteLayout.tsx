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

  // Determine if current theme is dark family
  const isDarkMode =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

  // Create muted backgrounds for better readability
  // Light modes: Soft gray radial gradient (reduces harsh white brightness)
  // Dark modes: Use theme's rich dark gradient
  const backgroundStyle = {
    background: isDarkMode
      ? theme.gradients.dark.background
      : 'radial-gradient(ellipse at top center, #F8F9FA 0%, #EEF0F2 40%, #E4E6EA 100%)',
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
