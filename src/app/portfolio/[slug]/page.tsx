import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortfolioLayout } from '@/layouts/PortfolioLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';

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
    title: entry.title,
    description: entry.excerpt,
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
  return (
    <PortfolioLayout title={entry.title}>
      <MDXRemote source={entry.content} />
    </PortfolioLayout>
  );
}
