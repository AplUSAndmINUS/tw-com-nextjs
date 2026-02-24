'use client';

import { ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';

interface SiteLayoutProps {
  children: ReactNode;
  isContainedView?: boolean;
}

/**
 * SiteLayout – thin alias of RootLayout for backwards compatibility.
 * Prefer importing RootLayout directly in new code.
 */
export function SiteLayout({ children, isContainedView }: SiteLayoutProps) {
  return <RootLayout isContainedView={isContainedView}>{children}</RootLayout>;
}
