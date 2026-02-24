import { ReactNode } from 'react';
import { HomePageLayout } from './HomePageLayout';
import { StandardPageLayout } from './StandardPageLayout';

interface PageLayoutProps {
  children: ReactNode;
  /** Optional feature image displayed in the left column (3 of 12 cols on desktop) */
  featureImage?: {
    src: string;
    alt: string;
    title?: string;
  };

  // If true, applies special layout/styling for the homepage (full-height contained view)
  isHomePage?: boolean;
}

/**
 * PageLayout — Server-first layout router
 *
 * Delegates to specialized layout components:
 * - HomePageLayout: Client component with contained viewport and resize listeners
 * - StandardPageLayout: Server component with normal scrolling behavior
 *
 * This separation keeps standard pages server-rendered and avoids unnecessary
 * client-side resize listeners when homepage features aren't needed.
 */
export function PageLayout({
  children,
  featureImage,
  isHomePage = false,
}: PageLayoutProps) {
  // Route to appropriate layout component
  if (isHomePage) {
    return (
      <HomePageLayout featureImage={featureImage}>{children}</HomePageLayout>
    );
  }

  return (
    <StandardPageLayout featureImage={featureImage}>
      {children}
    </StandardPageLayout>
  );
}
