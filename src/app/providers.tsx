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
  // Routes migrated to the design system render their own DSM nav (HomeNav or
  // TwPageNav, both carrying the appearance panel), so the global Header would
  // double up. Suppress it on those; every other route keeps the existing
  // Header until it too is migrated. Extend this list as pages move over.
  // Normalise the trailing slash (next.config sets trailingSlash: true).
  const path = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname;
  const ownsNav =
    path === '/' ||
    path === '/about' ||
    path === '/blog' ||
    path.startsWith('/blog/') ||
    path === '/content-hub' ||
    path === '/portfolio' ||
    path.startsWith('/portfolio/') ||
    path === '/github' ||
    path === '/videos' ||
    path.startsWith('/videos/');
  const isHome = ownsNav;
  return (
    <ExtendedThemeProvider>
      <StoreHydrator />
      {/*
        PodcastPlayerProvider owns the single <audio> element and sits above the
        page content, so an episode keeps playing across client-side navigation.
      */}
      <PodcastPlayerProvider>
        {/*
          FontScaleProvider no longer wraps its children in a filtered <div> —
          the colour-vision modes are real token palettes now, selected by
          data-theme. That div created a containing block for descendant
          position:fixed elements, so the Header had to be hoisted out of the
          tree to escape it, and CookieBanner / Modal / NewsletterDrawer were
          silently anchoring to the wrapper instead of the viewport in every
          non-light mode.

          Nothing here creates a containing block, so all of these can sit in
          their natural place and stay viewport-fixed.
        */}
        <FontScaleProvider>
          {!isHome && <Header />}
          <KoFiWidget pathname={pathname} />
          {/* Portals itself into document.body. */}
          <PodcastMiniPlayer />
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
