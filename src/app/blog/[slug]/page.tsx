import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/layouts/ArticleLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllContent('blog');
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentBySlug('blog', slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    metadataBase: new URL('https://terencewaters.com'),
    openGraph: {
      title: `${post.title} | Terence Waters`,
      description: post.excerpt,
      url: `https://terencewaters.com/blog/${slug}`,
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentBySlug('blog', slug);
  if (!post) notFound();
  return (
    <ArticleLayout title={post.title} date={post.date}>
      <MDXRemote source={post.content} />
    </ArticleLayout>
  );
}
