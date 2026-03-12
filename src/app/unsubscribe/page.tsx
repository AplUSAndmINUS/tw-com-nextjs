import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { UnsubscribePageClient } from './UnsubscribePageClient';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from the A+ in FLUX- Mythmaker Drop newsletter.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Unsubscribe | Terence Waters',
    description:
      'Unsubscribe from the A+ in FLUX- Mythmaker Drop newsletter.',
    url: 'https://terencewaters.com/unsubscribe',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default function UnsubscribePage() {
  return <UnsubscribePageClient />;
}
