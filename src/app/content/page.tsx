import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { UnifiedContentClient, UnifiedContentEntry } from '@/components/UnifiedContentClient';

export const metadata: Metadata = {
  title: 'Content Hub',
  description: 'Explore all content from Terence Waters — blog posts, essays, portfolio work, and case studies.',
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

export default async function ContentHubPage() {
  const [blogPosts, essays, portfolioEntries, caseStudies] = await Promise.all([
    getAllContent('blog'),
    getAllContent('essays'),
    getAllContent('portfolio'),
    getAllContent('case-studies'),
  ]);

  const entries: UnifiedContentEntry[] = [
    ...blogPosts.map((p) => ({ ...p, contentType: 'Blog', href: `/blog/${p.slug}` })),
    ...essays.map((e) => ({ ...e, contentType: 'Essay', href: `/essays/${e.slug}` })),
    ...portfolioEntries.map((e) => ({ ...e, contentType: 'Portfolio', href: `/portfolio/${e.slug}` })),
    ...caseStudies.map((cs) => ({ ...cs, contentType: 'Case Study', href: `/case-studies/${cs.slug}` })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <PageLayout>
      <UnifiedContentClient entries={entries} />
    </PageLayout>
  );
}
