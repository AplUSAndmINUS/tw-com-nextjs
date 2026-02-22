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
