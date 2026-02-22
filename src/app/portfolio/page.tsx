import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected work and projects.',
};

export default async function PortfolioPage() {
  const entries = await getAllContent('portfolio');
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entries.map((entry) => (
            <Link key={entry.slug} href={`/portfolio/${entry.slug}`}>
              <article className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold">{entry.title}</h2>
                {entry.excerpt && <p className="mt-2 text-gray-600 dark:text-gray-400">{entry.excerpt}</p>}
              </article>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
