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
 * Intelligently delegates to specialized layout components based on page type:
 *
 * → HomePageLayout (isHomePage = true):
 *     Client component with:
 *     - Contained full-viewport layout
 *     - Window resize listeners for responsive behavior
 *     - Hero section with dynamic scaling
 *     - Special animations and interactions
 *
 * → StandardPageLayout (isHomePage = false, default):
 *     Server/Client hybrid with:
 *     - Normal or contained viewport based on featureImage
 *     - Standard scrolling behavior
 *     - Optional feature image with fixed positioning
 *     - Standard footer placement
 *
 * Performance Benefits:
 * ---------------------
 * This separation keeps standard pages server-rendered when possible and avoids
 * unnecessary client-side resize listeners and JavaScript when homepage-specific
 * features aren't needed.
 *
 * Usage:
 * ------
 * ```tsx
 * // Homepage (special layout with contained viewport)
 * <PageLayout isHomePage featureImage={...}>
 *   <HeroSection />
 * </PageLayout>
 *
 * // Standard page (normal scrolling)
 * <PageLayout>
 *   <Article />
 * </PageLayout>
 *
 * // Standard page with fixed feature image
 * <PageLayout featureImage={...}>
 *   <AboutContent />
 * </PageLayout>
 * ```
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
