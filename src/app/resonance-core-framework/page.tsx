import type { Metadata } from 'next';
import Link from 'next/link';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getBreadcrumbSchema, getRcfBookSchema } from '@/utils/structuredData';
import {
  TwButton,
  TwCTABand,
  TwHero,
  TwPageNav,
  TwReveal,
  TwSectionHeading,
} from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import {
  FLUXLINE_RCF_URL,
  RCF_BOOK,
  RCF_CANONICAL_PARAGRAPH,
  RCF_CONCEPTS,
  RCF_NOTIFY_HREF,
  RCF_PATH,
  TRI_FRAMEWORK_URL,
  TRI_URL,
  rcfConceptHref,
} from '@/lib/rcf';
import styles from './page.module.scss';

const TITLE = 'The Resonance Core Framework™ | Terence Waters';
const DESCRIPTION =
  'The Resonance Core Framework™ — written by Terence Waters — is a 31-chapter identity system built on Behavioral Gravity, Identity Coherence, the Window of Choice, Creative Truth, and the DII Protocol. Coming Fall 2026.';

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
    'DRIVE System',
    'Identity Distortion Loop',
    'Creative Truth',
    'DII Protocol',
    'Decision Alignment Score',
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
        url: '/assets/images/RCF_logo.jpeg',
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

const NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Content Hub', href: '/content-hub' },
];

/**
 * /resonance-core-framework — the framework from its author's side: what it
 * is, why it was written, its core concepts, and the book. TerenceWaters.com
 * is the authorship reference; the podcast (theresonantidentity.com) and the
 * coaching practice (fluxline.pro) are linked as the places to experience it.
 */
export default function ResonanceCoreFrameworkPage() {
  const bookSchema = getRcfBookSchema();
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />

      <TwPageNav
        back={{ label: 'Back to Home', href: '/' }}
        links={NAV_LINKS}
      />

      <main>
        <TwHero
          eyebrow='The framework & the book'
          title='The Resonance Core Framework™'
          body='A practical identity system for making change that holds — built on alignment rather than force. Publishing Fall 2026.'
          primaryCta={{ label: 'Be notified at launch', href: RCF_NOTIFY_HREF }}
          secondaryCta={{ label: 'Core concepts', href: '#core-concepts' }}
          backgroundImage='/assets/images/hero-landscape.jpg'
          tagline='By Terence Waters'
          location='Fluxline Resonance Group'
          focalPoint='center 20%'
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
                <a href={FLUXLINE_RCF_URL}>
                  The complete framework reference lives at Fluxline →
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
                <a href='https://www.fluxline.pro/blog/announcement-resonance-core-book'>
                  Read the full origin story →
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
                lede='The named ideas at the heart of the book, in a sentence each. Tap any one for its full definition.'
              />
            </TwReveal>
            <div className={styles.conceptGrid}>
              {RCF_CONCEPTS.map((c, i) => (
                <TwReveal key={c.id} delay={i * 60}>
                  <a
                    id={c.id}
                    href={rcfConceptHref(c.id)}
                    className={styles.concept}
                  >
                    <h3 className={styles.conceptName}>{c.name}</h3>
                    <p className={styles.conceptBody}>{c.summary}</p>
                    <span className={styles.conceptMore}>More info →</span>
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
                  src='/assets/images/RCF_logo.jpeg'
                  alt='The Resonance Core Framework™ logo'
                  loading='lazy'
                  decoding='async'
                />
              </TwReveal>
              <TwReveal>
                <TwSectionHeading kicker='Coming Fall 2026' title='The Book' />
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
                  <div>
                    <dt>Formats</dt>
                    <dd>{RCF_BOOK.formats.join(', ')}</dd>
                  </div>
                </dl>
                <p className={styles.prose}>
                  {RCF_BOOK.structure.charAt(0).toUpperCase() +
                    RCF_BOOK.structure.slice(1)}{' '}
                  on how identity shapes decisions — and how to make alignment
                  something you can practice, measure, and return to. For
                  individuals, founders, and leaders who need more than
                  motivation.
                </p>
                <div className={styles.ctaRow}>
                  <TwButton href={RCF_NOTIFY_HREF}>
                    Be Notified at Launch →
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
                body='The podcast explores the framework in conversation, Fluxline brings it into coaching and consulting, and The Resonant Identity site walks through every concept.'
              >
                <TwButton href={TRI_URL}>Listen to the Podcast</TwButton>
                <TwButton variant='outline' href={FLUXLINE_RCF_URL}>
                  Coaching at Fluxline
                </TwButton>
              </TwCTABand>
            </TwReveal>
            <ul className={styles.outbound}>
              <li>
                <a href={TRI_FRAMEWORK_URL}>
                  Hear the framework on the podcast →
                </a>
              </li>
              <li>
                <a href={FLUXLINE_RCF_URL}>
                  Work with the framework at Fluxline →
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
