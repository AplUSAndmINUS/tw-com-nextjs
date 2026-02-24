import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortfolioLayout } from '@/layouts/PortfolioLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ContentGalleryClient } from '@/components/ContentGalleryClient';
import { ContentDetailNav } from '@/components/ContentDetailNav';
import { mdxComponents } from '@/components/MarkdownContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = await getAllContent('portfolio');
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getContentBySlug('portfolio', slug);
  if (!entry) return {};
  return {
    title: entry.seoTitle ?? entry.title,
    description: entry.seoDescription ?? entry.excerpt,
    keywords: entry.seoKeywords,
    metadataBase: new URL('https://terencewaters.com'),
    openGraph: {
      title: `${entry.title} | Terence Waters`,
      description: entry.excerpt,
      url: `https://terencewaters.com/portfolio/${slug}`,
      siteName: 'Terence Waters',
      type: 'article',
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
}

export default async function PortfolioEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getContentBySlug('portfolio', slug);
  if (!entry) notFound();

  // Build prev/next navigation from sorted entry list
  const allEntries = await getAllContent('portfolio');
  const sortedSlugs = allEntries.map((e) => e.slug);
  const currentIndex = sortedSlugs.indexOf(slug);
  const prevEntry = currentIndex < sortedSlugs.length - 1 ? allEntries[currentIndex + 1] : null;
  const nextEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;

  const featureImage = entry.imageUrl
    ? { src: entry.imageUrl, alt: entry.imageAlt ?? entry.title }
    : undefined;

  return (
    <PortfolioLayout
      title={entry.title}
      description={entry.excerpt}
      featureImage={featureImage}
      nav={
        <ContentDetailNav
          prevHref={prevEntry ? `/portfolio/${prevEntry.slug}` : undefined}
          prevTitle={prevEntry?.title}
          nextHref={nextEntry ? `/portfolio/${nextEntry.slug}` : undefined}
          nextTitle={nextEntry?.title}
        />
      }
    >
      {entry.gallery && entry.gallery.length > 0 && (
        <ContentGalleryClient gallery={entry.gallery} />
      )}
      <MDXRemote source={entry.content} components={mdxComponents} />
    </PortfolioLayout>
  );
}
