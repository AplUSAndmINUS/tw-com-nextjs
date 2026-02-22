import type { Metadata } from 'next';

import './globals.scss';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='font-sans antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
