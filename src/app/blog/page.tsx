import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { getAllContent } from '@/lib/content';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on technology, creativity, and the human experience.',
};

export default async function BlogPage() {
  const posts = await getAllContent('blog');
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b pb-8">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors">{post.title}</h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{post.date}</p>
              {post.excerpt && <p className="mt-3 text-gray-600 dark:text-gray-400">{post.excerpt}</p>}
            </article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
