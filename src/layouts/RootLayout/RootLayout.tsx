import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * RootLayout
 *
 * The top-level layout wrapper for TW.com.
 * Renders the Navigation (fixed header with breadcrumbs + slide-in menu)
 * and Footer, with a skip-to-content link for accessibility.
 * All other layouts should nest inside RootLayout.
 */
export function RootLayout({ children }: RootLayoutProps) {
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
        {children}
      </main>
      <Footer />
    </div>
  );
}
