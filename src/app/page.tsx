import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
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
  robots: getRobotsConfig(),
};

export default function HomePage() {
  return <HomePageClient />;
}
