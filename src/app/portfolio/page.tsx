import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { getAllContent } from '@/lib/content';
import { TwPageNav, TwListingView, type TwListingItem } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { formatDotDate } from '@/app/home/contentFormat';
import { PORTFOLIO_NAV_LINKS, portfolioCategoryLabel } from './portfolioMeta';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Selected product, platform, and brand work by Terence Waters — from concept through launch.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Portfolio | Terence Waters',
    description:
      'Selected product, platform, and brand work — from concept through launch.',
    url: 'https://terencewaters.com/portfolio',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

export default async function PortfolioPage() {
  const entries = await getAllContent('portfolio');

  // Portfolio pieces rarely carry dates, so sort featured-first and otherwise
  // keep the loader's order — rather than sorting by an absent date.
  const sorted = [...entries].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
  );

  const items: TwListingItem[] = sorted.map((entry) => {
    const label = portfolioCategoryLabel(entry.category);
    return {
      id: entry.slug,
      title: entry.title,
      excerpt: entry.excerpt,
      category: label,
      filter: label,
      date: formatDotDate(entry.date),
      image: entry.imageUrl ?? entry.featuredImage,
      imageAlt: entry.imageAlt ?? entry.title,
      href: `/portfolio/${entry.slug}`,
    };
  });

  return (
    <>
      <TwPageNav
        back={{ label: 'Back to Content Hub', href: '/content-hub' }}
        links={PORTFOLIO_NAV_LINKS}
      />
      <main>
        <TwListingView
          kicker='Portfolio'
          title='Selected work'
          lede='Enterprise platforms, design systems, and brand work — from concept through launch. Filter by discipline below.'
          items={items}
          emptyMessage='Work is being catalogued — check back soon.'
        />
      </main>
      <Footer />
    </>
  );
}
