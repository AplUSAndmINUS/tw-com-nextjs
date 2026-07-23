import type { Metadata } from 'next';
import Script from 'next/script';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getPersonSchema, getAboutPageSchema } from '@/utils/structuredData';
import {
  TwButton,
  TwCTABand,
  TwChip,
  TwHero,
  TwPageNav,
  TwReveal,
  TwStatCard,
} from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { AboutSection } from './AboutSection';
import { AboutTimeline } from './AboutTimeline';
import {
  APPROACH,
  AUDIENCES,
  BELIEFS,
  BUILD_QUALITIES,
  CERTIFICATIONS,
  EDUCATION,
  HATS,
  INTRO_PARAGRAPHS,
  PROJECTS,
  SECTIONS,
  SKILL_GROUPS,
  STATS,
} from './aboutData';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Terence Waters is a founder, architect, and senior technologist with 15+ years bridging technical precision with human-centered design.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'About | Terence Waters',
    description:
      'Terence Waters is a founder, architect, and senior technologist with 15+ years bridging technical precision with human-centered design.',
    url: 'https://terencewaters.com/about',
    siteName: 'Terence Waters',
    type: 'profile',
  },
  robots: getRobotsConfig(),
  alternates: {
    canonical: '/about',
  },
};

const NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub' },
  { label: 'Portfolio', href: '/portfolio' },
];

/** The meters get crowded past a dozen rows; the tail is all 90%+ anyway. */
const PROFICIENCY = ABOUT_SKILLS.slice(0, 12);

/**
 * About — the one interior page that is about the person rather than the work.
 *
 * Rebuilt on the design system. The previous version ran on the legacy stack
 * (PageLayout's split media pane, Hero, Typography, AboutSectionWrapper,
 * PercentageBullet) with ~1,800 words of centred prose and no scannable
 * structure. This version:
 *
 *  - renders its own TwPageNav (see providers.tsx `ownsNav`) rather than the
 *    legacy Header, so the chrome matches Blog / Portfolio / GitHub / Videos;
 *  - uses the numbered image-rail section shape from the homepage and from
 *    fluxline.pro/services — image left, content right;
 *  - cuts each idea to a header plus one or two lines, with stats, chips,
 *    meters, and a timeline carrying the weight the prose used to;
 *  - animates in via TwReveal, which no-ops under reduced motion.
 *
 * Everything is a server component apart from TwReveal and the nav.
 */
export default function AboutPage() {
  const personSchema = getPersonSchema('https://terencewaters.com/about');
  const aboutPageSchema = getAboutPageSchema();

  return (
    <div className={styles.page}>
      <Script
        id='about-person-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
      />
      <Script
        id='about-aboutpage-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutPageSchema) }}
      />

      <TwPageNav back={{ label: 'Back to Home', href: '/' }} links={NAV_LINKS} />

      <main>
        <TwHero
          eyebrow='About'
          title='Terence Waters'
          body='Founder, architect, and coach. Fifteen years turning complexity into something people can actually live and work inside.'
          primaryCta={{ label: 'How I work', href: '#how-i-work' }}
          secondaryCta={{ label: 'Start a conversation', href: '/#contact' }}
          backgroundImage='/assets/images/hero-landscape.jpg'
          tagline='Founder, Fluxline Resonance Group'
          location='Salt Lake City, Utah'
          focalPoint='center 20%'
          compact
        />

        {/* ===== 01 The short version ===== */}
        <AboutSection
          meta={SECTIONS.intro}
          title="Hi, I'm Terence"
          lede="Most people don't need more information. We need clarity, structure, and a way back to ourselves."
        >
          <TwReveal>
            {INTRO_PARAGRAPHS.map((paragraph, i) => (
              <p
                key={paragraph}
                className={`${styles.prose} ${i === 0 ? styles.lead : ''}`}
              >
                {paragraph}
              </p>
            ))}

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
        </AboutSection>

        {/* ===== 02 What I believe ===== */}
        <AboutSection
          meta={SECTIONS.believe}
          title='Three things I keep coming back to'
          alt
        >
          <ul className={styles.beliefList}>
            {BELIEFS.map((belief, i) => (
              <TwReveal as='li' key={belief.num} delay={i * 90}>
                <div className={styles.belief}>
                  <span className={styles.beliefNum} aria-hidden='true'>
                    {belief.num}
                  </span>
                  <div>
                    <h3 className={styles.beliefTitle}>{belief.title}</h3>
                    <p className={styles.beliefText}>{belief.text}</p>
                  </div>
                </div>
              </TwReveal>
            ))}
          </ul>

          <TwReveal>
            <p className={styles.pullQuote}>
              Whether I&apos;m building a platform, designing a brand, or
              coaching someone through a transition, the work is the same:
              helping people return to their resonance.
            </p>
          </TwReveal>
        </AboutSection>

        {/* ===== 03 What I do ===== */}
        <AboutSection
          meta={SECTIONS.work}
          title='Systems for people, founders, and teams'
          lede='Technical, personal, and organizational — the kind you can operate with more clarity and less friction.'
        >
          <div className={styles.audienceGrid}>
            {AUDIENCES.map((item, i) => (
              <TwReveal key={item.label} delay={i * 90}>
                <div className={styles.audience}>
                  <div className={styles.audienceLabel}>{item.label}</div>
                  <p className={styles.audienceText}>{item.text}</p>
                </div>
              </TwReveal>
            ))}
          </div>

          <TwReveal>
            <p className={styles.chipLabel}>Everything I build is</p>
            <div className={styles.chipRow}>
              {BUILD_QUALITIES.map((quality) => (
                <TwChip key={quality} variant='teal' size='sm'>
                  {quality}
                </TwChip>
              ))}
            </div>

            <div className={styles.viewAll}>
              <a href='/#work'>See the services &#8594;</a>
            </div>
          </TwReveal>
        </AboutSection>

        {/* ===== 04 How I work ===== */}
        <AboutSection
          meta={SECTIONS.how}
          title='A strange mix, on purpose'
          lede='I see patterns quickly, translate complexity into clarity, and build the thing that helps someone feel more like themselves.'
          alt
        >
          <TwReveal>
            <div className={styles.chipRow}>
              {HATS.map((hat) => (
                <TwChip key={hat} size='sm'>
                  {hat}
                </TwChip>
              ))}
            </div>
          </TwReveal>

          <ul className={styles.approachList}>
            {APPROACH.map((item, i) => (
              <TwReveal as='li' key={item.title} delay={i * 90}>
                <div className={styles.approach}>
                  <h3 className={styles.approachTitle}>{item.title}</h3>
                  <p className={styles.approachText}>{item.text}</p>
                </div>
              </TwReveal>
            ))}
          </ul>
        </AboutSection>

        {/* ===== 05 Experience ===== */}
        <AboutSection
          meta={SECTIONS.experience}
          title='Where the reps came from'
          lede='Enterprise healthcare, higher education, and two companies of my own.'
        >
          <AboutTimeline />
        </AboutSection>

        {/* ===== 06 Selected work ===== */}
        <AboutSection
          meta={SECTIONS.projects}
          title='Selected projects'
          lede='Platforms and programs I led or helped architect.'
          alt
        >
          <div className={styles.projectGrid}>
            {PROJECTS.map((project, i) => (
              <TwReveal key={project.name} delay={i * 70}>
                <article className={styles.project}>
                  <p className={styles.projectPeriod}>{project.period}</p>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  <p className={styles.projectRole}>{project.role}</p>
                  <p className={styles.projectStack}>{project.stack}</p>
                </article>
              </TwReveal>
            ))}
          </div>

          <TwReveal>
            <div className={styles.viewAll}>
              <a href='/portfolio'>View the full portfolio &#8594;</a>
            </div>
          </TwReveal>
        </AboutSection>

        {/* ===== 07 Credentials ===== */}
        <AboutSection
          meta={SECTIONS.credentials}
          title='Skills, degrees, and certifications'
          lede='The short list. Depth by category, then the paper.'
        >
          <div className={styles.skillGroups}>
            {SKILL_GROUPS.map((group, i) => (
              <TwReveal key={group.title} delay={i * 90}>
                <div className={styles.skillGroup}>
                  <h3 className={styles.skillGroupTitle}>{group.title}</h3>
                  <ul className={styles.skillList}>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </TwReveal>
            ))}
          </div>

          <TwReveal>
            <p className={styles.chipLabel}>Proficiency</p>
            <div className={styles.meterGrid}>
              {PROFICIENCY.map((skill) => (
                <div key={skill.name}>
                  <div className={styles.meterHead}>
                    <span className={styles.meterName}>{skill.name}</span>
                    <span className={styles.meterValue}>
                      {skill.percentage}%
                    </span>
                  </div>
                  <div
                    className={styles.meterTrack}
                    role='meter'
                    aria-valuenow={skill.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={skill.name}
                  >
                    <span
                      className={styles.meterFill}
                      style={
                        {
                          '--tw-meter-pct': skill.percentage / 100,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </TwReveal>

          <div className={styles.credGrid}>
            <TwReveal>
              <h3 className={styles.credHeading}>Degrees</h3>
              <ul className={styles.credList}>
                {EDUCATION.map((item) => (
                  <li key={item.credential}>
                    <p className={styles.credName}>{item.credential}</p>
                    <p className={styles.credMeta}>
                      {item.school} · {item.year}
                    </p>
                  </li>
                ))}
              </ul>
            </TwReveal>

            <TwReveal delay={90}>
              <h3 className={styles.credHeading}>Certifications</h3>
              <ul className={styles.certList}>
                {CERTIFICATIONS.map((cert) => (
                  <li key={cert.name} className={styles.certItem}>
                    <span className={styles.certName}>{cert.name}</span>
                    <span className={styles.certYear}>{cert.year}</span>
                  </li>
                ))}
              </ul>
            </TwReveal>
          </div>
        </AboutSection>

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
                  Book a consultation
                </TwButton>
                <TwButton variant='outline' href='/#contact'>
                  Send a message
                </TwButton>
              </TwCTABand>
            </TwReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
