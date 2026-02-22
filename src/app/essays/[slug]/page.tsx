import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentLayout } from '@/layouts/ContentLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const essays = await getAllContent('essays');
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getContentBySlug('essays', slug);
  if (!essay) return {};
  return {
    title: essay.title,
    description: essay.excerpt,
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

export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const essay = await getContentBySlug('essays', slug);
  if (!essay) notFound();
  return (
    <ContentLayout title={essay.title} date={essay.date}>
      <MDXRemote source={essay.content} />
    </ContentLayout>
  );
}
