import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import { CaseStudyListingClientWrapper } from '@/components/CaseStudyListingClientWrapper';
import CaseStudyImage from '@/assets/images/CaseStudy1400x1867.jpg';

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
  robots: getRobotsConfig(),
};

export default async function CaseStudiesPage() {
  const caseStudies = await getAllContent('case-studies');

  // Strip content field to reduce payload size
  const caseStudiesWithoutContent = caseStudies.map(({ content, ...rest }) => ({
    ...rest,
    content: '',
  }));

  return (
    <PageLayout
      featureImage={{
        src: CaseStudyImage.src,
        alt: 'Case Studies',
        title: 'Case Studies',
      }}
    >
      <CaseStudyListingClientWrapper
        initialCaseStudies={caseStudiesWithoutContent}
      />
    </PageLayout>
  );
}
