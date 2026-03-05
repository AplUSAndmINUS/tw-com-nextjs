import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { AdaptiveCard } from '@/components/AdaptiveCardGrid';
import { ArchiveClientWrapper } from '@/app/archive/ArchiveClientWrapper';
import { getAllContent } from '@/lib/content';
import { format, parseISO } from 'date-fns';
import EducationTrainingPortrait from '@/assets/images/EducationTrainingPortrait.jpg';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Past articles, projects, and writing from across the years.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Archive | Terence Waters',
    description: 'Past articles, projects, and writing from across the years.',
    url: 'https://terencewaters.com/archive',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default async function ArchivePage() {
  const [posts, portfolioEntries, caseStudies] = await Promise.all([
    getAllContent('blog'),
    getAllContent('portfolio'),
    getAllContent('case-studies'),
  ]);

  const allItems = [
    ...posts.map((p) => ({ ...p, type: 'Blog', href: `/blog/${p.slug}` })),
    ...portfolioEntries.map((p) => ({
      ...p,
      type: 'Portfolio',
      href: `/portfolio/${p.slug}`,
    })),
    ...caseStudies.map((c) => ({
      ...c,
      type: 'Case Study',
      href: `/case-studies/${c.slug}`,
    })),
  ].sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA < dateB ? 1 : -1;
  });

  // Transform to AdaptiveCard format
  const cards: AdaptiveCard[] = allItems.map((item) => {
    let formattedDate = 'Date unknown';
    try {
      if (item.date) {
        const parsedDate = parseISO(item.date);
        formattedDate = format(parsedDate, 'MMMM d, yyyy');
      }
    } catch (error) {
      console.warn(`Failed to parse date for item ${item.slug}:`, error);
    }

    return {
      id: item.slug,
      title: item.title,
      description: item.excerpt,
      imageUrl: item.imageUrl || item.featuredImage,
      imageAlt: item.imageAlt || item.title,
      imageText: formattedDate,
      tags: item.type ? [item.type] : [],
    };
  });

  // Build routing map from slug to href
  const routingMap: Record<string, string> = {};
  allItems.forEach((item) => {
    routingMap[item.slug] = item.href;
  });

  return (
    <PageLayout
      featureImage={{
        src: EducationTrainingPortrait.src,
        alt: 'Archive',
        title: 'Archive',
      }}
    >
      <div className='pt-0 pb-8 md:py-8'>
        <Hero
          title='Archive'
          iconName='DocumentText24Regular'
          description='A complete archive of articles, projects, and case studies — sorted by most recent.'
        />

        <section className='mt-12'>
          {cards.length === 0 ? (
            <p className='text-gray-500 dark:text-gray-400'>
              No archived content yet. Check back soon.
            </p>
          ) : (
            <ArchiveClientWrapper cards={cards} routingMap={routingMap} />
          )}
        </section>
      </div>
    </PageLayout>
  );
}
