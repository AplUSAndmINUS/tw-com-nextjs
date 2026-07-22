import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { getAllContent } from '@/lib/content';
import { PageLayout } from '@/layouts/PageLayout';
import { AllContentClient } from './AllContentClient';
import ContentPortrait from '@/assets/images/Content1280x1815.jpg';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'All Content',
  description:
    'Everything I create — all in one place. Articles, videos, podcasts, and deep dives into the ideas and work that matter most.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'All Content | Terence Waters',
    description:
      'Everything I create — all in one place. Articles, videos, podcasts, and deep dives into the ideas and work that matter most.',
    url: 'https://terencewaters.com/content/all',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

/**
 * All Content Page
 *
 * Unified view of all content types (blog, portfolio, case-studies).
 * Uses the same ContentListingPage pattern as Blog, Portfolio, etc.
 */
export default async function AllContentPage() {
  // Fetch all content types (case studies live on Fluxline.pro, not here).
  const blogPosts = await getAllContent('blog');
  const portfolioItems = await getAllContent('portfolio');

  // Combine all content
  const allContent = [...blogPosts, ...portfolioItems];

  return (
    <PageLayout
      featureImage={{
        src: ContentPortrait.src,
        alt: 'All Content by Terence Waters',
        title: 'All Content',
      }}
    >
      <div className={styles.wrap}>
        <AllContentClient allContent={allContent} />
      </div>
    </PageLayout>
  );
}
