'use client';

import { usePathname } from 'next/navigation';
import { ExtendedThemeProvider } from '@/theme/providers/ExtendedThemeProvider';
import { FontScaleProvider } from '@/theme/providers/FontScaleProvider';
import { StoreHydrator } from '@/components/StoreHydrator';
import { AccessGate } from '@/components/AccessGate';
import { Header } from '@/components/Navigation';
import { KoFiWidget } from '@/components/KoFiWidget';
import { NewsletterDrawerWrapper } from '@/components/NewsletterDrawer';
import { useAccessControl } from '@/hooks';

export function Providers({ children }: { children: React.ReactNode }) {
  const { authRequired, isAuthenticated } = useAccessControl();
  const pathname = usePathname();
  return (
    <ExtendedThemeProvider>
      <StoreHydrator />
      {/*
        Header lives outside FontScaleProvider. FontScaleProvider applies the
        color-vision filter via a wrapper div; any filter on an ancestor of a
        position:fixed element creates a containing block that breaks fixed
        positioning. Keeping the Header here (a sibling of the filtered div)
        ensures it stays viewport-fixed in all theme modes.
      */}
      <Header />
      <KoFiWidget pathname={pathname} />
      <FontScaleProvider>
        <AccessGate>
          {/* Page content (includes main with PageTransition from RootLayout) */}
          {children}
        </AccessGate>
        {/* Newsletter drawer — rendered outside AccessGate so it stays at root level */}
        {(!authRequired || !isAuthenticated) && <NewsletterDrawerWrapper />}
      </FontScaleProvider>
    </ExtendedThemeProvider>
  );
}
