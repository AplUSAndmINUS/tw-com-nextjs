import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { AI_BIOGRAPHY, getPersonSchema } from '@/utils/structuredData';
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
  const personSchema = getPersonSchema('https://terencewaters.com');

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HomePageClient />
      <section aria-labelledby='ai-bio-summary' className='sr-only'>
        <h2 id='ai-bio-summary'>Terence Waters — AI profile summary</h2>
        <p>{AI_BIOGRAPHY.shortSummary}</p>
        <p>{AI_BIOGRAPHY.longSummary}</p>
        <ul>
          {AI_BIOGRAPHY.expertise.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
