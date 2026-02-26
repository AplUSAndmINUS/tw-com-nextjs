'use client';

import { ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';

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
  return (
    <RootLayout isContainedView={isContainedView} showFooter={showFooter}>
      {children}
    </RootLayout>
  );
}
