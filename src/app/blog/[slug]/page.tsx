import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { twMdxComponents } from '@/components/MarkdownContent';
import { GeneratedWithAiBadge } from '@/components/GeneratedWithAiBadge';
import { mdxComponents } from '@/components/MarkdownContent';
import { content as responsibleAiContent } from '@/assets/fluxline-legal/responsible-ai-legal';
import { TwPageNav, TwArticleView } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { formatDotDate, readTime } from '@/app/home/contentFormat';
import { BLOG_NAV_LINKS } from '../blogNav';
import {
  getAuthorSchema,
  getBlogFaqItems,
  getBlogKeyInsights,
  getBlogPostingSchema,
  getBlogStructuredSummary,
  getFaqSchema,
} from '@/utils/structuredData';
import styles from './BlogPost.module.scss';

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

  const structuredSummary = getBlogStructuredSummary(post);
  const keyInsights = getBlogKeyInsights(post);
  const faqItems = getBlogFaqItems(post);
  const authorSchema = getAuthorSchema();
  const blogPostingSchema = getBlogPostingSchema(post, slug);
  const faqSchema = getFaqSchema(post);

  return (
    <>
      <TwPageNav
        back={{ label: 'Back to the Blog', href: '/blog' }}
        links={BLOG_NAV_LINKS}
      />
      <main className={styles.view}>
        <Script
          id={`blog-author-schema-${slug}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: safeJsonLd(authorSchema) }}
        />
        <Script
          id={`blog-posting-schema-${slug}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: safeJsonLd(blogPostingSchema) }}
        />
        <Script
          id={`blog-faq-schema-${slug}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
        />

        <TwArticleView
          category={post.category}
          date={formatDotDate(post.publishedDate ?? post.date)}
          readTime={readTime(post.content)}
          title={post.title}
          excerpt={post.excerpt}
          image={post.imageUrl}
          imageAlt={post.imageAlt ?? post.title}
          backHref='/blog'
          backLabel='All posts'
        >
          {post.generatedWithAI && (
            <GeneratedWithAiBadge
              className={styles.aiBadge}
              modalContent={
                <MDXRemote
                  source={responsibleAiContent}
                  components={mdxComponents}
                />
              }
            />
          )}

          <MDXRemote source={post.content} components={twMdxComponents} />

          {/* AI-discoverable structured content — kept for machine readers,
              styled as plain prose so it reads as an appendix. */}
          <section className={styles.aiSection} aria-label='AI-discoverable content'>
            <h2>Structured Summary</h2>
            <p>{structuredSummary}</p>

            <h2>Key Insights</h2>
            <ul>
              {keyInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>

            <h2>FAQ</h2>
            <dl className={styles.faq}>
              {faqItems.map((item) => (
                <div key={item.question}>
                  <dt>{item.question}</dt>
                  <dd>{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        </TwArticleView>
      </main>
      <Footer />
    </>
  );
}
