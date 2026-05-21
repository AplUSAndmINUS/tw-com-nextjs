import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRobotsConfig } from '@/utils/metadata';
import { ArticleLayout } from '@/layouts/ArticleLayout';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ContentDetailNav } from '@/components/ContentDetailNav';
import { mdxComponents } from '@/components/MarkdownContent';
import { GeneratedWithAiBadge } from '@/components/GeneratedWithAiBadge';
import { content as responsibleAiContent } from '@/assets/fluxline-legal/responsible-ai-legal';
import {
  getAuthorSchema,
  getBlogFaqItems,
  getBlogKeyInsights,
  getBlogPostingSchema,
  getBlogStructuredSummary,
  getFaqSchema,
} from '@/utils/structuredData';

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
    robots: getRobotsConfig(),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getContentBySlug('blog', slug);
  if (!post) notFound();

  // Build prev/next navigation from sorted post list
  const allPosts = await getAllContent('blog');
  const sortedSlugs = allPosts.map((p) => p.slug);
  const currentIndex = sortedSlugs.indexOf(slug);
  const prevPost =
    currentIndex < sortedSlugs.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const featureImage = post.imageUrl
    ? { src: post.imageUrl, alt: post.imageAlt ?? post.title }
    : undefined;
  const structuredSummary = getBlogStructuredSummary(post);
  const keyInsights = getBlogKeyInsights(post);
  const faqItems = getBlogFaqItems(post);
  const authorSchema = getAuthorSchema();
  const blogPostingSchema = getBlogPostingSchema(post, slug);
  const faqSchema = getFaqSchema(post);

  return (
    <ArticleLayout
      title={post.title}
      date={post.publishedDate ?? post.date}
      author={post.author}
      featureImage={featureImage}
      gallery={post.gallery}
      nav={
        <ContentDetailNav
          prevHref={prevPost ? `/blog/${prevPost.slug}` : undefined}
          prevTitle={prevPost?.title}
          nextHref={nextPost ? `/blog/${nextPost.slug}` : undefined}
          nextTitle={nextPost?.title}
          listingPath='/blog'
          listingLabel='Blog'
        />
      }
    >
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Gallery removed - feature image now opens in modal via ArticleLayout */}
      {post.generatedWithAI && (
        <GeneratedWithAiBadge
          className='mb-6'
          modalContent={
            <MDXRemote
              source={responsibleAiContent}
              components={mdxComponents}
            />
          }
        />
      )}
      <MDXRemote source={post.content} components={mdxComponents} />
      <section className='mt-10 border-t pt-8 space-y-8'>
        <section aria-labelledby='structured-summary'>
          <h2 id='structured-summary' className='text-2xl font-semibold mb-3'>
            Structured Summary
          </h2>
          <p>{structuredSummary}</p>
        </section>
        <section aria-labelledby='key-insights'>
          <h2 id='key-insights' className='text-2xl font-semibold mb-3'>
            Key Insights
          </h2>
          <ul className='list-disc pl-5 space-y-2'>
            {keyInsights.map((insight, index) => (
              <li key={`${insight}-${index}`}>{insight}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby='faq-block'>
          <h2 id='faq-block' className='text-2xl font-semibold mb-3'>
            FAQ
          </h2>
          <dl className='space-y-4'>
            {faqItems.map((item, index) => (
              <div key={`${item.question}-${index}`}>
                <dt className='font-semibold'>{item.question}</dt>
                <dd className='mt-1'>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </ArticleLayout>
  );
}
