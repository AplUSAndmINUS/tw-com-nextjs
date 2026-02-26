import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { CaseStudyListingClientWrapper } from '@/components/CaseStudyListingClientWrapper';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'In-depth explorations of projects, challenges, and lessons learned.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Case Studies | Terence Waters',
    description:
      'In-depth explorations of projects, challenges, and lessons learned.',
    url: 'https://terencewaters.com/case-studies',
    siteName: 'Terence Waters',
    type: 'website',
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

export default async function CaseStudiesPage() {
  const caseStudies = await getAllContent('case-studies');

  // Strip content field to reduce payload size
  const caseStudiesWithoutContent = caseStudies.map(
    ({ content, ...rest }) => rest
  );

  return (
    <PageLayout>
      <CaseStudyListingClientWrapper
        initialCaseStudies={caseStudiesWithoutContent}
      />
    </PageLayout>
  );
}
