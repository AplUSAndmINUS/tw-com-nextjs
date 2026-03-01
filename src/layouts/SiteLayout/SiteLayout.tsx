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
 * SiteLayout – thin alias of RootLayout for backwards compatibility.
 * Prefer importing RootLayout directly in new code.
 */
export function SiteLayout({
  children,
  isContainedView,
  showFooter,
}: SiteLayoutProps) {
  const { theme, themeMode } = useAppTheme();
  const isDarkMode =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

  // Non-home pages get a softer gradient wash. Home/contained layouts keep their existing background treatment.
  const backgroundStyle = !isContainedView
    ? {
        background: isDarkMode
          ? theme.gradients.dark.background
          : theme.gradients.light.background,
      }
    : undefined;

  return (
    <RootLayout isContainedView={isContainedView} showFooter={showFooter}>
      <div
        className={!isContainedView ? 'min-h-full' : undefined}
        style={backgroundStyle}
      >
        {children}
      </div>
    </RootLayout>
  );
}
