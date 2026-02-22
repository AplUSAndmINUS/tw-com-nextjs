import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/layouts/ArticleLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ContentGalleryClient } from '@/components/ContentGalleryClient';

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
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    keywords: post.seoKeywords,
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

  const featureImage = post.imageUrl
    ? { src: post.imageUrl, alt: post.imageAlt ?? post.title }
    : undefined;

  return (
    <ArticleLayout
      title={post.title}
      date={post.publishedDate ?? post.date}
      author={post.author}
      featureImage={featureImage}
    >
      {post.gallery && post.gallery.length > 0 && (
        <ContentGalleryClient gallery={post.gallery} />
      )}
      <MDXRemote source={post.content} />
    </ArticleLayout>
  );
}
