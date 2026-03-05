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
 * Content layout wrapper for TW.com pages.
 * The Header is provided globally via providers.tsx and stays sticky across all pages.
 * All other layouts should nest inside RootLayout.
 *
 * When isContainedView=true, creates a full-viewport layout (like Fluxline.pro)
 * where content doesn't cause page scrolling on desktop.
 */
export function RootLayout({
  children,
  isContainedView = false,
  showFooter = true,
}: RootLayoutProps) {
  if (isContainedView) {
    return (
      <div className='flex flex-col h-screen overflow-hidden'>
        <a href='#main-content' className='skip-to-content'>
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
      <a href='#main-content' className='skip-to-content'>
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
