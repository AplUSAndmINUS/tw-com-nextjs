import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { getEnvironment } from '@/lib/environment';
import {
  getPersonSchema,
  getOrganizationSchema,
  getWebSiteSchema,
} from '@/utils/structuredData';

import './globals.css';
import { Providers } from './providers';

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
    <html lang='en'>
      <head>
        {/* Structured Data — Root schemas for AI/search visibility */}
        <Script
          id='schema-person'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id='schema-organization'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id='schema-website'
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Google AdSense */}
        <meta name='google-adsense-account' content='ca-pub-7691902367885014' />
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7691902367885014'
          crossOrigin='anonymous'
        ></script>
      </head>
      <body className='font-sans antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
