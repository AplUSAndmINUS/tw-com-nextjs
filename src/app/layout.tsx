import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Terence Waters',
    template: '%s | Terence Waters',
  },
  description: 'Author, technologist, and creative thinker.',
  metadataBase: new URL('https://terencewaters.com'),
  robots: {
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
  return (
    <html lang='en'>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7691902367885014" />
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
