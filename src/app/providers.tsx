'use client';

import { usePathname } from 'next/navigation';
import { ExtendedThemeProvider } from '@/theme/providers/ExtendedThemeProvider';
import { FontScaleProvider } from '@/theme/providers/FontScaleProvider';
import { StoreHydrator } from '@/components/StoreHydrator';
import { AccessGate } from '@/components/AccessGate';
import { PageTransition } from '@/components/PageTransition';
import { PreorderBar } from '@/components/PreorderBar';
import { Header } from '@/components/Navigation';
import { KoFiWidget } from '@/components/KoFiWidget';
import { NewsletterDrawerWrapper } from '@/components/NewsletterDrawer';
import { CookieBanner } from '@/components/CookieBanner';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';
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
    path === '/about-me' ||
    path === '/blog' ||
    path.startsWith('/blog/') ||
    path === '/content-hub' ||
    path === '/portfolio' ||
    path.startsWith('/portfolio/') ||
    path === '/github' ||
    path === '/resonance-core-framework' ||
    path === '/videos' ||
    path.startsWith('/videos/');
  const isHome = ownsNav;
  // Routes still on the legacy layout: a fixed Header over content padded by
  // --site-header-height. The pre-order bar sits under that header there.
  const usesLegacyLayout =
    path === '/podcasts' ||
    path.startsWith('/podcasts/') ||
    path === '/unsubscribe';
  return (
    <ExtendedThemeProvider>
      {/*
        Global so every newsletter form (home, footer, drawer — all rendered
        sitewide) can fetch a token before posting, not just the homepage
        contact form. This does mean the reCAPTCHA script now loads on every
        page rather than only when a visitor scrolls to the contact section,
        which is an intentional trade-off: the footer's newsletter form
        renders everywhere anyway, so scoping the provider any tighter would
        leave most of the newsletter surface unprotected.
      */}
      <ReCaptchaProvider>
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
              {/* Site-wide book pre-order bar, above the page and its nav. */}
              <PreorderBar belowFixedHeader={usesLegacyLayout} />
              {/*
                Page content. PageTransition sits above the page segment, so it
                persists across client navigations and fades every route out and
                in (see components/PageTransition).
              */}
              <PageTransition>{children}</PageTransition>
            </AccessGate>
            {/* Newsletter drawer — rendered outside AccessGate so it stays at root level */}
            {(!authRequired || !isAuthenticated) && <NewsletterDrawerWrapper />}
            {/* Cookie consent banner — rendered for all users on first visit */}
            <CookieBanner />
            {/* Google Analytics consent updates for GA + AdSense */}
            <GoogleAnalytics />
          </FontScaleProvider>
        </PodcastPlayerProvider>
      </ReCaptchaProvider>
    </ExtendedThemeProvider>
  );
}
