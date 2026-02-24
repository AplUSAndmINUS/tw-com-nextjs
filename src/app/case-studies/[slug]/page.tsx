import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyLayout } from '@/layouts/CaseStudyLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/MarkdownContent';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const caseStudies = await getAllContent('case-studies');
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getContentBySlug('case-studies', slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.excerpt,
    metadataBase: new URL('https://terencewaters.com'),
    openGraph: {
      title: `${cs.title} | Terence Waters`,
      description: cs.excerpt,
      url: `https://terencewaters.com/case-studies/${slug}`,
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

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getContentBySlug('case-studies', slug);
  if (!cs) notFound();
  return (
    <CaseStudyLayout title={cs.title} date={cs.date}>
      <MDXRemote source={cs.content} components={mdxComponents} />
    </CaseStudyLayout>
  );
}
