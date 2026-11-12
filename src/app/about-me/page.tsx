import type { Metadata } from 'next';
import Link from 'next/link';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getPersonSchema, getAboutHookPageSchema } from '@/utils/structuredData';
import {
  TwButton,
  TwCTABand,
  TwCard,
  TwChip,
  TwHero,
  TwPageNav,
  TwReveal,
  TwSectionHeading,
  TwStatCard,
} from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import {
  BUILT_ON,
  HOOK_BODY,
  HOOK_QUOTE,
  INTRO_PARAGRAPHS,
  PILLARS,
  STATS,
} from './aboutMeData';
import { RCF_PATH } from '@/lib/rcf';
import styles from './page.module.scss';

const ABOUT_ME_TITLE =
  'Terence Waters: The Short Version | Fluxline, The Resonance Core Framework & The Resonant Identity';
const ABOUT_ME_DESCRIPTION =
  'Terence Waters is the author of The Resonance Core Framework™, founder of Fluxline Resonance Group, and host of The Resonant Identity podcast. The short version of his story, and where to go for more.';

export const metadata: Metadata = {
  title: { absolute: ABOUT_ME_TITLE },
  description: ABOUT_ME_DESCRIPTION,
  keywords: [
    'Terence Waters',
    'about Terence Waters',
    'Fluxline Resonance Group founder',
    'Resonance Core Framework author',
    'The Resonant Identity podcast host',
    'systems architect',
    'identity coach',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: ABOUT_ME_TITLE,
    description: ABOUT_ME_DESCRIPTION,
    url: 'https://terencewaters.com/about-me',
    siteName: 'Terence Waters',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_ME_TITLE,
    description: ABOUT_ME_DESCRIPTION,
  },
  robots: getRobotsConfig(),
  alternates: {
    canonical: '/about-me',
  },
};

const NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub' },
  { label: 'Portfolio', href: '/portfolio' },
];

/**
 * About (Hook) — the short, link-out version of /about.
 *
 * This is the page other sites in the ecosystem point to when they refer
 * someone to "more about Terence" (starting with
 * theresonantidentity.com/start-here). It leads with the hook, gives the
 * three-pillar picture (Fluxline, the RCF, The Resonant Identity) in one
 * breath each, and hands off to /about for the full story.
 *
 * Structurally it borrows the hook-first shape of the wonderfish.app media
 * profile (headline hook, short bio, talking points, credibility, CTA) and
 * rebuilds it on the DSM rather than that page's own design.
 */
export default function AboutMePage() {
  const personSchema = getPersonSchema('https://terencewaters.com/about-me');
  const aboutHookPageSchema = getAboutHookPageSchema();

  return (
    <div className={styles.page}>
      <script
        id='about-me-person-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
      />
      <script
        id='about-me-aboutpage-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutHookPageSchema) }}
      />

      <TwPageNav
        back={{ label: 'Back to Home', href: '/' }}
        links={NAV_LINKS}
      />

      <main>
        <TwHero
          eyebrow='About'
          title='Terence Waters'
          subtitle='Systems Architect & Identity Coach · Author, The Resonance Core Framework™'
          quote={HOOK_QUOTE}
          body={HOOK_BODY}
          primaryCta={{ label: 'Read the full story', href: '/about' }}
          secondaryCta={{ label: 'Start a conversation', href: '/#contact' }}
          backgroundImage='/assets/images/hero-landscape.jpg'
          tagline='Founder, Fluxline Resonance Group'
          location='Salt Lake City, Utah'
          focalPoint='center 20%'
          compact
        />

        {/* ===== The short version ===== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <div className={styles.content}>
                <TwSectionHeading
                  as='h2'
                  title="Hi, I'm Terence"
                  lede="Most people don't need more information. They need clarity, structure, and a way back to themselves."
                />
                {INTRO_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph} className={styles.prose}>
                    {paragraph}
                  </p>
                ))}
                <p className={styles.prose}>
                  I wrote{' '}
                  <Link href={RCF_PATH}>The Resonance Core Framework™</Link> —
                  a 31-chapter identity system bridging somatic intelligence,
                  decision science, and behavioral psychology — published
                  through Fluxline Resonance Group, the company I founded.
                  It&apos;s the foundation of The Resonant Identity podcast
                  and the coaching practice I run.
                </p>
              </div>

              <div className={styles.statGrid}>
                {STATS.map((stat) => (
                  <TwStatCard
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>
            </TwReveal>
          </div>
        </section>

        {/* ===== Three things, one system ===== */}
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <TwReveal>
              <TwSectionHeading
                as='h2'
                title='Three things, one system'
                lede='Everything traces back to the same idea: sustainable change requires alignment, not force.'
              />
            </TwReveal>

            <div className={styles.pillarGrid}>
              {PILLARS.map((pillar, i) => (
                <TwReveal fill key={pillar.title} delay={i * 90}>
                  <TwCard interactive className={styles.pillar}>
                    <span className={styles.pillarLabel}>{pillar.label}</span>
                    <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                    <p className={styles.pillarText}>{pillar.text}</p>
                    {pillar.href.startsWith('/') ? (
                      <Link href={pillar.href} className={styles.pillarLink}>
                        {pillar.linkLabel} &#8594;
                      </Link>
                    ) : (
                      <a href={pillar.href} className={styles.pillarLink}>
                        {pillar.linkLabel} &#8599;
                      </a>
                    )}
                  </TwCard>
                </TwReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== What this is built on ===== */}
        <section className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <div className={styles.content}>
                <TwSectionHeading as='h2' title='What this is built on' />
                <p className={styles.chipLabel}>
                  A few of the ideas behind the work
                </p>
                <div className={styles.chipRow}>
                  {BUILT_ON.map((concept) => (
                    <TwChip key={concept} variant='teal' size='sm'>
                      {concept}
                    </TwChip>
                  ))}
                </div>

                <div className={styles.viewAll}>
                  <Link href={RCF_PATH}>
                    Read more about the framework &#8594;
                  </Link>
                </div>
              </div>
            </TwReveal>
          </div>
        </section>

        {/* ===== Closing ===== */}
        <section className={styles.closing}>
          <div className={styles.container}>
            <TwReveal>
              <TwCTABand
                as='div'
                kicker='If you got this far'
                title="You're probably navigating a transition"
                body="Personal, professional, creative, or internal. You don't need it figured out — you need somewhere to think and rebuild with intention. I'd be honored to walk with you."
              >
                <TwButton href='https://tidycal.com/terencewaters'>
                  Book a free consultation
                </TwButton>
                <TwButton variant='outline' href='/#contact'>
                  Send a message
                </TwButton>
              </TwCTABand>
              <div className={styles.closingLink}>
                <Link href='/about'>Or read the long version of my story</Link>
              </div>
            </TwReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
