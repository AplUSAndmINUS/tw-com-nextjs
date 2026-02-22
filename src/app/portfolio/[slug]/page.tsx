import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortfolioLayout } from '@/layouts/PortfolioLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PortfolioDetailClient } from '@/components/PortfolioDetailClient';

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

  const featureImage = entry.imageUrl
    ? { src: entry.imageUrl, alt: entry.imageAlt ?? entry.title }
    : undefined;

  const basePath = entry.imageUrl
    ? entry.imageUrl.substring(0, entry.imageUrl.lastIndexOf('/') + 1)
    : '';

  return (
    <PortfolioLayout
      title={entry.title}
      description={entry.excerpt}
      featureImage={featureImage}
    >
      {entry.gallery && entry.gallery.length > 0 && (
        <PortfolioDetailClient gallery={entry.gallery} basePath={basePath} />
      )}
      <MDXRemote source={entry.content} />
    </PortfolioLayout>
  );
}
