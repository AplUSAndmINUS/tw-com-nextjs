import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyLayout } from '@/layouts/CaseStudyLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ContentGalleryClient } from '@/components/ContentGalleryClient';
import { ContentDetailNav } from '@/components/ContentDetailNav';
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
    title: cs.seoTitle ?? cs.title,
    description: cs.seoDescription ?? cs.excerpt,
    keywords: cs.seoKeywords,
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

  // Build prev/next navigation from sorted case study list
  const allCaseStudies = await getAllContent('case-studies');
  const sortedSlugs = allCaseStudies.map((c) => c.slug);
  const currentIndex = sortedSlugs.indexOf(slug);
  const prevCaseStudy =
    currentIndex < sortedSlugs.length - 1
      ? allCaseStudies[currentIndex + 1]
      : null;
  const nextCaseStudy =
    currentIndex > 0 ? allCaseStudies[currentIndex - 1] : null;

  return (
    <CaseStudyLayout
      title={cs.title}
      date={cs.date}
      nav={
        <ContentDetailNav
          prevHref={
            prevCaseStudy ? `/case-studies/${prevCaseStudy.slug}` : undefined
          }
          prevTitle={prevCaseStudy?.title}
          nextHref={
            nextCaseStudy ? `/case-studies/${nextCaseStudy.slug}` : undefined
          }
          nextTitle={nextCaseStudy?.title}
          listingPath='/case-studies'
          listingLabel='Case Studies'
        />
      }
    >
      {cs.gallery && cs.gallery.length > 0 && (
        <ContentGalleryClient gallery={cs.gallery} />
      )}
      <MDXRemote source={cs.content} components={mdxComponents} />
    </CaseStudyLayout>
  );
}
