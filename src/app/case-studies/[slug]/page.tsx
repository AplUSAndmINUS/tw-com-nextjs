import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyLayout } from '@/layouts/CaseStudyLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';

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
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getContentBySlug('case-studies', slug);
  if (!cs) notFound();
  return (
    <CaseStudyLayout title={cs.title} date={cs.date}>
      <MDXRemote source={cs.content} />
    </CaseStudyLayout>
  );
}
