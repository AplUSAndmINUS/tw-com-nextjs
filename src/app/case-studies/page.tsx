import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'In-depth explorations of projects and challenges.',
};

export default async function CaseStudiesPage() {
  const caseStudies = await getAllContent('case-studies');
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Case Studies</h1>
        <div className="space-y-8">
          {caseStudies.map((cs) => (
            <article key={cs.slug} className="border-b pb-8">
              <Link href={`/case-studies/${cs.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors">{cs.title}</h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{cs.date}</p>
              {cs.excerpt && <p className="mt-3 text-gray-600 dark:text-gray-400">{cs.excerpt}</p>}
            </article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
