'use client';

import { usePathname } from 'next/navigation';
import { useFadeInOut } from '@/hooks';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

/**
 * PageTransition - Wraps page content with fade in/out transitions.
 * Automatically fades out when route changes, then fades in new content.
 *
 * @example
 * <PageTransition>
 *   {children}
 * </PageTransition>
 */
export function PageTransition({
  children,
  duration = 300,
  className = '',
}: PageTransitionProps) {
  const pathname = usePathname();
  const { style } = useFadeInOut(pathname, duration);

  return (
    <div style={style} className={className} suppressHydrationWarning>
      {children}
    </div>
  );
}
