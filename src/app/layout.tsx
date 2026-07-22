import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { getEnvironment } from '@/lib/environment';
import {
  getPersonSchema,
  getOrganizationSchema,
  getWebSiteSchema,
} from '@/utils/structuredData';
import { safeJsonLd } from '@/utils/safeJsonLd';

import './globals.css';
import { Providers } from './providers';
import { fontVariables } from './fonts';
import { buildThemeScript } from '@/theme/themeScript';

// Environment-aware robots: only allow indexing in production
const env = getEnvironment();
const isProd = env === 'prod';

export const metadata: Metadata = {
  title: {
    default: 'Terence Waters',
    template: '%s | Terence Waters',
  },
  description: 'Author, technologist, and creative thinker.',
  metadataBase: new URL('https://terencewaters.com'),
  robots: isProd
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
  openGraph: {
    type: 'website',
    siteName: 'Terence Waters',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@TerenceWaters',
  },
};

// iOS Safari safe-area support for notch/home indicator
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // Enables safe-area-inset CSS variables
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate structured data schemas
  const personSchema = getPersonSchema('https://terencewaters.com');
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();

  return (
    <html lang='en' className={fontVariables} suppressHydrationWarning>
      <head>
        {/*
          Theme resolution — MUST be the first thing in <head>.

          Stamps data-theme, the `dark` class and color-scheme onto <html> from
          the persisted preference before the first paint. A plain inline
          <script> rather than next/script, because `beforeInteractive` does not
          reliably run this early in the App Router — same reasoning as the
          Google Consent Mode block further down.

          <html> carries suppressHydrationWarning because this script mutates
          attributes that React did not render.
        */}
        <script dangerouslySetInnerHTML={{ __html: buildThemeScript() }} />

        {/* Structured Data — Root schemas for AI/search visibility */}
        <Script
          id='schema-person'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
        />
        <Script
          id='schema-organization'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(organizationSchema),
          }}
        />
        <Script
          id='schema-website'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
        />

        {/* Google AdSense publisher verification (meta tag only).
            The actual AdSense script is consent-gated and loaded client-side
            by the GoogleAnalytics component when ads consent is granted. */}
        <meta name='google-adsense-account' content='ca-pub-7691902367885014' />

        {/*
          Google Consent Mode v2 — initialise consent defaults to "denied"
          BEFORE any Google scripts load. This must run synchronously in <head>
          so that GA and AdSense never collect personal data before the user
          has made a consent choice via the CookieBanner.
          Consent is updated client-side by the GoogleAnalytics component.

          wait_for_update: 500 — GA waits up to 500ms for a consent update before
          firing with the defaults. Returning visitors with stored consent have their
          preferences rehydrated quickly by StoreHydrator, well within this window.
          First-time visitors will always have denied defaults until they interact
          with the CookieBanner (which appears after SHOW_DELAY_MS = 800ms).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
      </head>
      <body className='font-sans antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
