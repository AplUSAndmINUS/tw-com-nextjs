'use client';

import { CSSProperties, ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface SiteLayoutProps {
  children: ReactNode;
  isContainedView?: boolean;
  showFooter?: boolean;
  hideFooterOnMobile?: boolean;
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
  hideFooterOnMobile,
}: SiteLayoutProps) {
  const { theme, themeMode } = useAppTheme();

  const backgroundStyle: CSSProperties = {
    background:
      themeMode === 'high-contrast'
        ? theme.gradients.highContrast.background
        : themeMode === 'grayscale-dark'
          ? theme.gradients.grayscaleDark.background
          : themeMode === 'dark'
            ? theme.gradients.dark.background
            : theme.gradients.light.background,
    backgroundAttachment: 'fixed',
  };
  const backgroundClassName = isContainedView
    ? 'w-full h-full'
    : 'w-full min-h-full';

  return (
    <RootLayout
      isContainedView={isContainedView}
      showFooter={showFooter}
      hideFooterOnMobile={hideFooterOnMobile}
    >
      <div
        className={backgroundClassName}
        style={backgroundStyle}
        suppressHydrationWarning
      >
        {children}
      </div>
    </RootLayout>
  );
}
