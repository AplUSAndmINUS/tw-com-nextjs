import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';

interface RootLayoutProps {
  children: ReactNode;
  /** If true, renders a full-height contained layout (no page scroll) */
  isContainedView?: boolean;
}

/**
 * RootLayout
 *
 * The top-level layout wrapper for TW.com.
 * Renders the Navigation (fixed header with breadcrumbs + slide-in menu)
 * and Footer, with a skip-to-content link for accessibility.
 * All other layouts should nest inside RootLayout.
 *
 * When isContainedView=true, creates a full-viewport layout (like Fluxline.pro)
 * where content doesn't cause page scrolling on desktop.
 */
export function RootLayout({
  children,
  isContainedView = false,
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
        <Navigation />
        {/* Flex-1 makes main content fill remaining height */}
        <main
          id='main-content'
          className='flex-1 pt-16 overflow-hidden flex flex-col'
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
      <Navigation />
      {/* pt-16 offsets the fixed header (~4rem/64px) */}
      <main id='main-content' className='flex-1 pt-16'>
        <PageTransition duration={300}>{children}</PageTransition>
      </main>
      <Footer isCompact />
    </div>
  );
}
