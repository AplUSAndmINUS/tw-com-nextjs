'use client';

import { usePathname } from 'next/navigation';
import { ExtendedThemeProvider } from '@/theme/providers/ExtendedThemeProvider';
import { FontScaleProvider } from '@/theme/providers/FontScaleProvider';
import { StoreHydrator } from '@/components/StoreHydrator';
import { AccessGate } from '@/components/AccessGate';
import { Header } from '@/components/Navigation';
import { KoFiWidget } from '@/components/KoFiWidget';
import { NewsletterDrawerWrapper } from '@/components/NewsletterDrawer';
import { CookieBanner } from '@/components/CookieBanner';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import {
  PodcastPlayerProvider,
  PodcastMiniPlayer,
} from '@/components/PodcastPlayer';
import { useAccessControl } from '@/hooks';

export function Providers({ children }: { children: React.ReactNode }) {
  const { authRequired, isAuthenticated } = useAccessControl();
  const pathname = usePathname();
  return (
    <ExtendedThemeProvider>
      <StoreHydrator />
      {/*
        PodcastPlayerProvider owns the single <audio> element and sits above the
        page content, so an episode keeps playing across client-side navigation.
      */}
      <PodcastPlayerProvider>
        {/*
          Header lives outside FontScaleProvider. FontScaleProvider applies the
          color-vision filter via a wrapper div; any filter on an ancestor of a
          position:fixed element creates a containing block that breaks fixed
          positioning. Keeping the Header here (a sibling of the filtered div)
          ensures it stays viewport-fixed in all theme modes.
        */}
        <Header />
        <KoFiWidget pathname={pathname} />
        {/* Portals itself into document.body, so it stays viewport-fixed
            regardless of the color-vision filter wrapper. */}
        <PodcastMiniPlayer />
        <FontScaleProvider>
          <AccessGate>
            {/* Page content (includes main with PageTransition from RootLayout) */}
            {children}
          </AccessGate>
          {/* Newsletter drawer — rendered outside AccessGate so it stays at root level */}
          {(!authRequired || !isAuthenticated) && <NewsletterDrawerWrapper />}
          {/* Cookie consent banner — rendered for all users on first visit */}
          <CookieBanner />
          {/* Google Analytics + AdSense — consent-gated via consentStore */}
          <GoogleAnalytics />
        </FontScaleProvider>
      </PodcastPlayerProvider>
    </ExtendedThemeProvider>
  );
}
