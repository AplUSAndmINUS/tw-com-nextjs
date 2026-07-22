import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getAllContent, getContentBySlug } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ContentGalleryClient } from '@/components/ContentGalleryClient';
import { twMdxComponents, mdxComponents } from '@/components/MarkdownContent';
import { GeneratedWithAiBadge } from '@/components/GeneratedWithAiBadge';
import { content as responsibleAiContent } from '@/assets/fluxline-legal/responsible-ai-legal';
import { getPortfolioSchema } from '@/utils/structuredData';
import { TwPageNav, TwArticleView } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { formatDotDate, readTime } from '@/app/home/contentFormat';
import { PORTFOLIO_NAV_LINKS, portfolioCategoryLabel } from '../portfolioMeta';
import styles from './PortfolioEntry.module.scss';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = await getAllContent('portfolio');
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getContentBySlug('portfolio', slug);
  if (!entry) return {};
  return {
    title: entry.seoTitle ?? entry.title,
    description: entry.seoDescription ?? entry.excerpt,
    keywords: entry.seoKeywords,
    metadataBase: new URL('https://terencewaters.com'),
    openGraph: {
      title: `${entry.title} | Terence Waters`,
      description: entry.excerpt,
      url: `https://terencewaters.com/portfolio/${slug}`,
      siteName: 'Terence Waters',
      type: 'article',
    },
    robots: getRobotsConfig(),
  };
}

export default async function PortfolioEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getContentBySlug('portfolio', slug);
  if (!entry) notFound();

  const portfolioSchema = getPortfolioSchema(entry, slug);

  return (
    <>
      <TwPageNav
        back={{ label: 'Back to Portfolio', href: '/portfolio' }}
        links={PORTFOLIO_NAV_LINKS}
      />
      <main className={styles.view}>
        <Script
          id={`portfolio-schema-${slug}`}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: safeJsonLd(portfolioSchema) }}
        />
        <TwArticleView
          category={portfolioCategoryLabel(entry.category)}
          date={formatDotDate(entry.date)}
          readTime={readTime(entry.content)}
          title={entry.title}
          excerpt={entry.excerpt}
          image={entry.imageUrl ?? entry.featuredImage}
          imageAlt={entry.imageAlt ?? entry.title}
          backHref='/portfolio'
          backLabel='All work'
        >
          {entry.generatedWithAI && (
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

          <MDXRemote source={entry.content} components={twMdxComponents} />

          {entry.gallery && entry.gallery.length > 0 ? (
            <div className={styles.gallery}>
              <ContentGalleryClient gallery={entry.gallery} />
            </div>
          ) : null}
        </TwArticleView>
      </main>
      <Footer />
    </>
  );
}
