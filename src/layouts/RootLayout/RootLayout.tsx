import { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';

interface RootLayoutProps {
  children: ReactNode;
  /** If true, renders a full-height contained layout (no page scroll) */
  isContainedView?: boolean;
  /** If false, suppresses the default footer (for layouts that handle their own footer) */
  showFooter?: boolean;
}

/**
 * RootLayout
 *
 * Base content layout wrapper for all TW.com pages.
 * The Header is provided globally via providers.tsx and stays sticky across all pages.
 * All other layouts (PageLayout, ContentLayout, etc.) should nest inside RootLayout.
 *
 * Layout Modes:
 * -------------
 * isContainedView = false (default):
 *   - Normal scrolling behavior with min-h-screen
 *   - Content flows naturally with page scroll
 *   - Suitable for blog posts, articles, standard content pages
 *   - Optional footer at bottom of page
 *
 * isContainedView = true:
 *   - Full-viewport contained layout (Fluxline.pro style)
 *   - Content area is independently scrollable within viewport
 *   - No page-level scrolling on desktop
 *   - Suitable for dashboard-style layouts, split-pane views
 *   - Footer handled by parent layout (not shown by RootLayout)
 *
 * Accessibility:
 * --------------
 * - Skip-to-content link for keyboard users (visually hidden until focused)
 * - Proper ARIA landmarks via semantic HTML (main, nav from Header)
 * - pt-16 offset accounts for fixed header height (~4rem/64px)
 */
export function RootLayout({
  children,
  isContainedView = false,
  showFooter = true,
}: RootLayoutProps) {
  if (isContainedView) {
    return (
      <div className='flex flex-col h-screen overflow-hidden'>
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2'
        >
          Skip to main content
        </a>
        {/* Flex-1 makes main content fill remaining height */}
        <main
          id='main-content'
          className='flex-1 pt-16 overflow-y-auto overflow-x-hidden flex flex-col'
        >
          <PageTransition duration={300} className='flex-1 flex flex-col'>
            {children}
          </PageTransition>
        </main>
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2'
      >
        Skip to main content
      </a>
      {/* pt-16 offsets the fixed header (~4rem/64px) provided by Header in providers.tsx */}
      <main id='main-content' className='flex-1 pt-16'>
        <PageTransition duration={300}>{children}</PageTransition>
      </main>
      {showFooter && <Footer isCompact />}
    </div>
  );
}
