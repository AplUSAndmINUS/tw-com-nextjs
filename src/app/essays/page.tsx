import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Essays',
  description: 'Long-form writing on technology, creativity, and culture.',
};

export default async function EssaysPage() {
  const essays = await getAllContent('essays');
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Essays</h1>
        <div className="space-y-8">
          {essays.map((essay) => (
            <article key={essay.slug} className="border-b pb-8">
              <Link href={`/essays/${essay.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors">{essay.title}</h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{essay.date}</p>
              {essay.excerpt && <p className="mt-3 text-gray-600 dark:text-gray-400">{essay.excerpt}</p>}
            </article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
