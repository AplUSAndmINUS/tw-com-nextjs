import { NewTabHint } from '@/components/NewTabHint';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import {
  getBreadcrumbSchema,
  getRcfBookSchema,
  getRcfDefinedTermSetSchema,
} from '@/utils/structuredData';
import {
  TwButton,
  TwCTABand,
  TwHero,
  TwReveal,
  TwSectionHeading,
} from '@/components/dsm';
import { Footer } from '@/components/Footer';
import {
  FLUXLINE_RCF_URL,
  RCF_BOOK,
  RCF_CANONICAL_PARAGRAPH,
  RCF_CONCEPTS,
  RCF_NOTIFY_HREF,
  RCF_PATH,
  RCF_PREORDER_HREF,
  TRI_URL,
  rcfConceptHref,
  RCF_PREORDERS_OPEN,
} from '@/lib/rcf';
import styles from './page.module.scss';
import { SiteNav } from '@/components/SiteNav';

const TITLE = 'The Resonance Core Framework™ Book by Terence Waters';
const DESCRIPTION = RCF_PREORDERS_OPEN
  ? 'The Resonance Core Framework™, a 31-chapter book and identity system by Terence Waters. Targeted for Q1 2027, with pre-orders open on the Fluxline Store.'
  : 'The Resonance Core Framework™, a 31-chapter book and identity system by Terence Waters. Targeted for Q1 2027.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'Resonance Core Framework',
    'Resonance Core Framework book',
    'Terence Waters book',
    'Terence Waters author',
    'Behavioral Gravity',
    'Identity Coherence',
    'Window of Choice',
    'DRIVE Model',
    'Judgment Loop',
    'Data Loop',
    'The Decision Integrity Index',
    'The DII',
    'Decision Alignment Score',
    'Resonance Core Framework Terence Waters',
    'identity system',
    'identity alignment',
    'decision-making framework',
    'sustainable change',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  alternates: { canonical: RCF_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `https://terencewaters.com${RCF_PATH}`,
    siteName: 'Terence Waters',
    type: 'website',
    images: [
      {
        url: '/assets/images/RCF_logo.jpg',
        alt: 'The Resonance Core Framework™',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: getRobotsConfig(),
};

/**
 * /resonance-core-framework — the framework from its author's side: what it
 * is, why it was written, its core concepts, and the book. TerenceWaters.com
 * is the authorship reference; the podcast (theresonantidentity.com) and the
 * coaching practice (fluxline.pro) are linked as the places to experience it.
 */
export default function ResonanceCoreFrameworkPage() {
  const bookSchema = getRcfBookSchema();
  const conceptsSchema = getRcfDefinedTermSetSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'The Resonance Core Framework™', path: RCF_PATH },
  ]);

  return (
    <div className={styles.page}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(bookSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(conceptsSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />

      <SiteNav />

      <main id='main'>
        <TwHero
          eyebrow='The framework & the book'
          title='The Resonance Core Framework™'
          body={
            RCF_PREORDERS_OPEN
              ? 'A practical identity system for making change that holds, built on alignment rather than force. The book is targeted for Q1 2027, and pre-orders are open on the Fluxline Store.'
              : 'A practical identity system for making change that holds, built on alignment rather than force. The book is targeted for Q1 2027.'
          }
          primaryCta={
            RCF_PREORDERS_OPEN
              ? {
                  label: 'Pre-order the book',
                  href: RCF_PREORDER_HREF,
                  variant: 'gold',
                  newTab: true,
                }
              : {
                  label: 'Be notified at launch',
                  href: RCF_NOTIFY_HREF,
                  newTab: true,
                }
          }
          secondaryCta={{ label: 'Core concepts', href: '#core-concepts' }}
          // The RCF banner (owner, 2026-11-19), in place of the portrait.
          backgroundImage='/assets/images/RCF_banner_logo.jpg'
          tagline='By Terence Waters'
          location='Fluxline Resonance Group'
          focalPoint='right center'
          scrim='card-side'
          compact
        />

        {/* 1. What the framework is */}
        <section id='what-it-is' className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <TwSectionHeading
                kicker='Overview'
                title='What the Framework Is'
              />
              <p className={styles.lead}>{RCF_CANONICAL_PARAGRAPH}</p>
              <p className={styles.prose}>
                <a href={FLUXLINE_RCF_URL} target='_blank' rel='noopener'>
                  The complete framework reference lives at Fluxline ↗
                  <NewTabHint />
                </a>
              </p>
            </TwReveal>
          </div>
        </section>

        {/* 2. Why I wrote it — author voice required */}
        <section
          id='why-i-wrote-it'
          className={`${styles.section} ${styles.sectionAlt}`}
        >
          <div className={styles.container}>
            <TwReveal>
              <TwSectionHeading
                kicker='From the author'
                title='Why I Wrote It'
              />
              {/* Adapted from Terence's own announcement post (linked below). */}
              <p className={styles.prose}>
                This framework didn&apos;t begin as a business initiative — it
                began as a necessity. When I left my six-figure job to build
                Fluxline, I ran into the same misalignment, overwhelm, and
                search for clarity so many founders and creators know. I read
                everything I could find and kept hitting the same wall: most
                self-help tells you what to do, but not how to do it. So I
                journaled daily, tracked my decisions, built scorecards to
                measure alignment, and refined the system until it changed me —
                this book is how I share it with you.
              </p>
              <p className={styles.prose}>
                <a
                  href='https://www.fluxline.pro/blog/announcement-resonance-core-book'
                  target='_blank'
                  rel='noopener'
                >
                  Read the full origin story ↗
                  <NewTabHint />
                </a>
              </p>
            </TwReveal>
          </div>
        </section>

        {/* 3. Core concepts */}
        <section id='core-concepts' className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <TwSectionHeading
                kicker='Language for what you feel'
                title='Core Concepts'
                lede='The named ideas at the heart of the book, in a sentence each. Each one links to its full definition.'
              />
            </TwReveal>
            <div className={styles.conceptGrid}>
              {RCF_CONCEPTS.map((c, i) => (
                <TwReveal fill key={c.id} delay={i * 60}>
                  <a
                    id={c.id}
                    href={rcfConceptHref(c.id)}
                    target='_blank'
                    rel='noopener'
                    className={styles.concept}
                  >
                    <h3 className={styles.conceptName}>{c.name}</h3>
                    <p className={styles.conceptBody}>{c.summary}</p>
                    <span className={styles.conceptMore}>More info ↗</span>
                    <NewTabHint />
                  </a>
                </TwReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. The book */}
        <section
          id='the-book'
          className={`${styles.section} ${styles.sectionAlt}`}
        >
          <div className={styles.container}>
            <div className={styles.bookGrid}>
              <TwReveal variant='left'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.bookImage}
                  src='/assets/images/RCF_logo.jpg'
                  alt='The Resonance Core Framework™ logo'
                  loading='lazy'
                  decoding='async'
                />
              </TwReveal>
              <TwReveal>
                <TwSectionHeading
                  kicker='Targeted for Q1 2027'
                  title='The Book'
                />
                <dl className={styles.bookFacts}>
                  <div>
                    <dt>Title</dt>
                    <dd>{RCF_BOOK.title}</dd>
                  </div>
                  <div>
                    <dt>Author</dt>
                    <dd>Terence Waters</dd>
                  </div>
                  <div>
                    <dt>Publisher</dt>
                    <dd>{RCF_BOOK.publisher}</dd>
                  </div>
                  <div>
                    <dt>Publication</dt>
                    <dd>{RCF_BOOK.publicationDate}</dd>
                  </div>
                  {RCF_PREORDERS_OPEN && (
                    <div>
                      <dt>Pre-orders</dt>
                      <dd>
                        <a
                          href={RCF_PREORDER_HREF}
                          target='_blank'
                          rel='noopener'
                        >
                          {RCF_BOOK.preorders}
                          <NewTabHint />
                        </a>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt>Formats</dt>
                    <dd>{RCF_BOOK.formats.join(', ')}</dd>
                  </div>
                </dl>
                <p className={styles.prose}>
                  Across {RCF_BOOK.structure}, the book explores how identity
                  shapes decisions — and how to make alignment something you can
                  practice, measure, and return to. It&apos;s written for
                  individuals, founders, and leaders who need more than
                  motivation.
                </p>
                <div className={styles.ctaRow}>
                  {RCF_PREORDERS_OPEN && (
                    <TwButton
                      variant='gold'
                      href={RCF_PREORDER_HREF}
                      target='_blank'
                      rel='noopener'
                    >
                      Pre-order the Book ↗
                    </TwButton>
                  )}
                  <TwButton
                    variant='outline'
                    href={RCF_NOTIFY_HREF}
                    target='_blank'
                    rel='noopener'
                  >
                    Be Notified at Launch ↗
                  </TwButton>
                </div>
              </TwReveal>
            </div>
          </div>
        </section>

        {/* 5. Where to experience the framework */}
        <section id='experience-it' className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <TwCTABand
                as='div'
                kicker='Where to experience the framework'
                title='Hear it, work with it, explore it'
                body='The podcast explores the framework in conversation, and Fluxline brings it into coaching and consulting — and holds the complete framework reference.'
              >
                <TwButton href={TRI_URL} target='_blank' rel='noopener'>
                  Listen to the Podcast
                </TwButton>
                <TwButton
                  variant='outline'
                  href={FLUXLINE_RCF_URL}
                  target='_blank'
                  rel='noopener'
                >
                  Coaching at Fluxline
                </TwButton>
              </TwCTABand>
            </TwReveal>
            <ul className={styles.outbound}>
              <li>
                <a href={TRI_URL} target='_blank' rel='noopener'>
                  Hear the framework on the podcast ↗
                  <NewTabHint />
                </a>
              </li>
              <li>
                <a href={FLUXLINE_RCF_URL} target='_blank' rel='noopener'>
                  Work with the framework at Fluxline ↗
                  <NewTabHint />
                </a>
              </li>
              <li>
                <Link href='/about'>About Terence →</Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
