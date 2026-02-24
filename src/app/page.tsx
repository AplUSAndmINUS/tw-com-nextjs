import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Terence Waters - Author, Technologist, Creative Thinker',
  description:
    'Welcome to the personal website of Terence Waters, an author, technologist, and creative thinker. Explore his blog, portfolio, and case studies.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Terence Waters - Author, Technologist, Creative Thinker',
    description:
      'Welcome to the personal website of Terence Waters, an author, technologist, and creative thinker. Explore his blog, portfolio, and case studies.',
    url: 'https://terencewaters.com',
    siteName: 'Terence Waters',
    type: 'website',
  },
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

export default function HomePage() {
  return <HomePageClient />;
}
