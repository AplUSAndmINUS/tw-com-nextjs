import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getPersonSchema, getAboutPageSchema } from '@/utils/structuredData';
import {
  TwAside,
  TwButton,
  TwCTABand,
  TwChip,
  TwHero,
  TwReveal,
  TwRipple,
  TwWave,
} from '@/components/dsm';
import {
  BookIcon,
  CodeIcon,
  DesignIdeasIcon,
  HeartIcon,
  MicIcon,
  PenIcon,
  PeopleCommunityIcon,
  PeopleIcon,
  PersonIcon,
  SearchIcon,
  SettingsIcon,
} from '@/components/icons';
import type { IconProps } from '@/components/icons';
import { BookingTrigger } from '@/components/BookingFlow';
import { Footer } from '@/components/Footer';
import { SiteNav } from '@/components/SiteNav';
import {
  ABOUT,
  APPROACH,
  BELIEFS,
  BUILD_QUALITIES,
} from '@/content/site/about';
import {
  CORE_SELF,
  HUMAN_ELEMENT_HUMAN,
  LOCATION,
  PERSON_NAME,
  QUOTES,
  ROLE_LINE,
  VALUES,
  type StatementSegment,
} from '@/content/site/identity';
import {
  BUILD_SERVICES,
  GROWING_WORK,
  serviceHref,
  type GrowingWork,
} from '@/content/site/services';
import { SHIFTS } from '@/content/site/shifts';
import { AboutTimeline } from './AboutTimeline';
import { CredentialsBody } from './CredentialsSection';
import { PROJECTS } from './aboutData';
import styles from './page.module.scss';

const ABOUT_TITLE =
  'About Me: Author, Architect, Identity Coach | Terence Waters';
const ABOUT_DESCRIPTION =
  'The full story of Terence Waters: the Shifts that shaped him, what he stands for, how he works, and the experience behind it.';

export const metadata: Metadata = {
  title: { absolute: ABOUT_TITLE },
  description: ABOUT_DESCRIPTION,
  keywords: [
    'Terence Waters',
    'about Terence Waters',
    'Terence Waters bio',
    'Terence Waters story',
    'Resonance Core Framework author',
    'Fluxline Resonance Group founder',
    'The Resonant Identity podcast host',
    'systems architect',
    'identity coach',
    'Intermountain Healthcare',
    'Salt Lake Community College adjunct professor',
    'NASM Certified Personal Trainer',
    'Salt Lake City',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: 'https://terencewaters.com/about',
    siteName: 'Terence Waters',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
  },
  robots: getRobotsConfig(),
  alternates: {
    canonical: '/about',
  },
};

/**
 * Small icons that make the build section scannable. Decorative: the text
 * beside each one says what it is.
 */
const GROWING_ICONS: Record<
  GrowingWork['key'],
  React.ComponentType<IconProps>
> = {
  coaching: PeopleIcon,
  podcast: MicIcon,
  writing: PenIcon,
  research: SearchIcon,
  speaking: PersonIcon,
  teaching: BookIcon,
  founders: PeopleCommunityIcon,
};

const SERVICE_ICONS: Record<string, React.ComponentType<IconProps>> = {
  consulting: SettingsIcon,
  development: CodeIcon,
  design: DesignIdeasIcon,
  'personal-training': HeartIcon,
};

/** Bold-italic, bold or italic runs, as Terence wrote them. */
function Segment({ seg }: { seg: StatementSegment }) {
  if (seg.strong && seg.em) {
    return (
      <strong>
        <em>{seg.text}</em>
      </strong>
    );
  }
  if (seg.strong) return <strong>{seg.text}</strong>;
  if (seg.em) return <em>{seg.text}</em>;
  return <>{seg.text}</>;
}

/**
 * A numbered section heading (owner, #294): the number in Mythic Gold, a
 * one-word category, a short gold rule, then the section title.
 */
function SectionHeading({
  num,
  label,
  id,
  children,
}: {
  num: string;
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <p className={styles.numRow}>
        <span className={styles.secNum}>{num}</span>{' '}
        <span className={styles.secRule} aria-hidden='true' />{' '}
        <span className={styles.secLabel}>{label}</span>
      </p>
      <h2 id={id} className={styles.h2}>
        {children}
      </h2>
    </>
  );
}

/** The hero's two sentences on their own lines (owner, #294). */
function HeroBody() {
  const [first, ...rest] = ABOUT.hero.body.split(/(?<=\.)\s+/);
  if (rest.length === 0) return <>{first}</>;
  return (
    <>
      {first} <br />
      {rest.join(' ')}
    </>
  );
}

/** "Your job… identity." and "My job…" on two lines (owner, #294). */
function TwoLineQuote({ text }: { text: string }) {
  const [first, ...rest] = text.split(/(?<=identity\.)\s+/);
  if (rest.length === 0) return <>{first}</>;
  return (
    <>
      {first} <br />
      {rest.join(' ')}
    </>
  );
}

/**
 * /about: the full story (rebuild, #294).
 *
 * Nine numbered sections, each with a one-word category: the short version
 * (the Canonical Identity Statement, as written, in one paragraph) → the
 * Shifts in depth → learning to play by feel (the music) → the body (the
 * personal-training photo) → what I stand for → how I work (Humans First. AI Second. leads) → I still
 * build and what I do now → experience → skills, degrees and certifications
 * (the design that was on TEST, at full width) → closing.
 *
 * Motifs: gold section numerals and rules, the ripple, the sound wave, the
 * gold-framed body photo, the glowing HCSA callout and approach cards. A
 * server component; TwReveal, the hero's scroll reveal, the booking trigger
 * and the nav are the client pieces.
 */
export default function AboutPage() {
  const personSchema = getPersonSchema('https://terencewaters.com/about');
  const aboutPageSchema = getAboutPageSchema();
  const S = ABOUT.sections;

  return (
    <div className={styles.page}>
      <script
        id='about-person-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
      />
      <script
        id='about-aboutpage-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutPageSchema) }}
      />

      <SiteNav />

      <main id='main'>
        <TwHero
          eyebrow={ABOUT.hero.eyebrow}
          title={PERSON_NAME}
          subtitle={ROLE_LINE}
          body={<HeroBody />}
          backgroundImage='/assets/images/hero-landscape.jpg'
          backgroundImagePortrait='/assets/images/hero-portrait.jpg'
          backgroundAlt=''
          location={LOCATION}
          focalPoint='center 20%'
          compact
          scrollReveal
        />

        {/* ===== 01 The short version: the owner's paragraphs (#324) ===== */}
        <section
          id='intro'
          className={styles.section}
          aria-labelledby='about-intro'
        >
          <div className={`${styles.container} ${styles.introGrid}`}>
            <TwReveal>
              <SectionHeading num='01' label={S.intro} id='about-intro'>
                {ABOUT.intro.title}
              </SectionHeading>
              {ABOUT.intro.paragraphs.map((para, i) => (
                <p key={i} className={styles.statementOne}>
                  {para.map((seg, j) => (
                    <Segment key={j} seg={seg} />
                  ))}
                </p>
              ))}
            </TwReveal>
            {/* The ripple: one aligned decision spreading outward. */}
            <div className={styles.introRipple}>
              <TwRipple />
            </div>
          </div>
        </section>

        {/* ===== 02 The Shifts, in depth ===== */}
        <section
          id='shifts'
          className={styles.sectionAlt}
          aria-labelledby='about-shifts'
        >
          <div className={styles.container}>
            <TwReveal>
              <SectionHeading num='02' label={S.shifts} id='about-shifts'>
                {ABOUT.shifts.title}
              </SectionHeading>
              <p className={styles.lede}>{ABOUT.shifts.lede}</p>
            </TwReveal>

            <ol className={styles.chapters}>
              {SHIFTS.map((shift) => (
                <TwReveal as='li' key={shift.id} className={styles.chapter}>
                  <article id={shift.id} aria-labelledby={`${shift.id}-title`}>
                    <div className={styles.chapterHead}>
                      {shift.number ? (
                        <p className={styles.chapterNumber}>{shift.number}</p>
                      ) : null}
                      <h3
                        id={`${shift.id}-title`}
                        className={styles.chapterTitle}
                      >
                        {shift.title}
                      </h3>
                    </div>
                    <div className={styles.chapterBody}>
                      {shift.story.map((paragraph) => (
                        <p key={paragraph} className={styles.prose}>
                          {paragraph}
                        </p>
                      ))}
                      {shift.quote ? (
                        <blockquote className={styles.chapterQuote}>
                          &ldquo;{shift.quote}&rdquo;
                        </blockquote>
                      ) : null}
                      <ul
                        className={styles.roles}
                        aria-label={ABOUT.shifts.rolesLabel}
                      >
                        {shift.roles.map((role) => (
                          <li key={role}>
                            <TwChip size='sm'>{role}</TwChip>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </TwReveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== 03 Learning to play by feel: the music =====
            Music and the body are two sections now (owner, #294). */}
        <section
          id='by-feel'
          className={styles.section}
          aria-labelledby='about-by-feel'
        >
          <div className={`${styles.container} ${styles.musicGrid}`}>
            <TwReveal>
              <SectionHeading num='03' label={S.byFeel} id='about-by-feel'>
                {ABOUT.byFeel.title}
              </SectionHeading>
              <TwWave className={styles.wave} />
              {ABOUT.byFeel.music.map((p) => (
                <p key={p} className={styles.prose}>
                  {p}
                </p>
              ))}
            </TwReveal>
            <TwReveal delay={90}>
              <blockquote className={styles.musicQuote}>
                &ldquo;{QUOTES.music}&rdquo;
              </blockquote>
            </TwReveal>
          </div>
        </section>

        {/* ===== 04 The body: the personal-training photo and its story ===== */}
        <section
          id='body'
          className={styles.sectionAlt}
          aria-labelledby='about-body'
        >
          <div className={`${styles.container} ${styles.bodyGrid}`}>
            <TwReveal>
              <div className={styles.bodyPhoto}>
                {/* eslint-disable-next-line @next/next/no-img-element --
                    static export with images.unoptimized; see TwHero. */}
                <img
                  src='/assets/images/personal-training-portrait.jpg'
                  alt={ABOUT.byFeel.bodyImageAlt}
                  width={1365}
                  height={1821}
                  loading='lazy'
                  decoding='async'
                />
              </div>
            </TwReveal>
            <TwReveal delay={90}>
              <SectionHeading num='04' label={S.body} id='about-body'>
                {ABOUT.byFeel.bodyTitle}
              </SectionHeading>
              {ABOUT.byFeel.body.map((p) => (
                <p key={p} className={styles.bodyText}>
                  {p}
                </p>
              ))}
              {/* Personal training at Fluxline (new tab), then the booking
                  dialog (owner, #324). */}
              <div className={styles.bodyActions}>
                <TwButton
                  variant='outline'
                  href={ABOUT.byFeel.trainingHref}
                  target='_blank'
                  rel='noopener'
                >
                  {ABOUT.byFeel.trainingLink}{' '}
                  <span aria-hidden='true'>&#8599;</span>
                </TwButton>
                <BookingTrigger />
              </div>
            </TwReveal>
          </div>
        </section>

        {/* ===== 05 What I stand for ===== */}
        <section
          id='values'
          className={styles.section}
          aria-labelledby='about-values'
        >
          <div className={styles.container}>
            <TwReveal>
              <SectionHeading num='05' label={S.values} id='about-values'>
                {ABOUT.values.title}
              </SectionHeading>
              <p className={styles.lede}>
                {ABOUT.values.humanNeeds.map((part) =>
                  'strongEm' in part && part.strongEm ? (
                    <strong key={part.text}>
                      <em>{part.text}</em>
                    </strong>
                  ) : (
                    <React.Fragment key={part.text}>{part.text}</React.Fragment>
                  )
                )}
              </p>
              <blockquote className={styles.pullQuote}>
                &ldquo;{HUMAN_ELEMENT_HUMAN}&rdquo;
              </blockquote>
            </TwReveal>

            <ul className={styles.values}>
              {VALUES.map((value, i) => (
                <TwReveal
                  as='li'
                  key={value.name}
                  delay={i * 90}
                  className={`${styles.value} ${styles.valueGold}`}
                >
                  <h3 className={styles.valueName}>{value.name}</h3>
                  <p className={styles.valueText}>&ldquo;{value.text}&rdquo;</p>
                </TwReveal>
              ))}
            </ul>

            <TwReveal>
              <h3 className={styles.h3}>{ABOUT.values.beliefsTitle}</h3>
              <ul className={styles.beliefs}>
                {BELIEFS.map((belief) => (
                  <li key={belief.title} className={styles.belief}>
                    <p className={styles.beliefTitle}>{belief.title}</p>
                    <p className={styles.beliefText}>{belief.text}</p>
                  </li>
                ))}
              </ul>
            </TwReveal>
          </div>
        </section>

        {/* ===== 06 How I work ===== */}
        <section
          id='how-i-work'
          className={styles.sectionAlt}
          aria-labelledby='about-how'
        >
          <div className={styles.container}>
            <TwReveal>
              <SectionHeading num='06' label={S.how} id='about-how'>
                {ABOUT.how.title}
              </SectionHeading>
            </TwReveal>

            {/* Humans First. AI Second. leads the section as a callout
                (owner, #294). */}
            <TwReveal>
              <div className={styles.hcsaCallout}>
                <span className={styles.hcsaTraces} aria-hidden='true'>
                  <span />
                  <span />
                  <span />
                </span>
                <h3 className={styles.hcsaTitle}>{ABOUT.how.hcsaTitle}</h3>
                <p className={styles.hcsaBody}>{ABOUT.how.hcsaBody}</p>
                <TwAside as='p' className={styles.hcsaAside}>
                  {ABOUT.how.aside}
                </TwAside>
              </div>
            </TwReveal>

            <TwReveal>
              <p className={styles.lede}>{ABOUT.how.lede}</p>
              <p className={styles.prose}>&ldquo;{CORE_SELF}&rdquo;</p>
              <blockquote className={styles.goldQuote}>
                <TwoLineQuote text={ABOUT.how.pullQuote} />
              </blockquote>
            </TwReveal>

            <ul className={styles.approach}>
              {APPROACH.map((item, i) => (
                <TwReveal
                  as='li'
                  key={item.title}
                  delay={i * 90}
                  className={`${styles.approachItem} ${styles.glowCard}`}
                >
                  <h3 className={styles.approachTitle}>{item.title}</h3>
                  <p className={styles.approachText}>{item.text}</p>
                </TwReveal>
              ))}
              <TwReveal
                as='li'
                delay={270}
                className={`${styles.approachItem} ${styles.glowCard}`}
              >
                <h3 className={styles.approachTitle}>
                  {ABOUT.how.intuitionTitle}
                </h3>
                <p className={styles.approachText}>
                  &ldquo;{ABOUT.how.intuitionQuote}&rdquo;
                </p>
              </TwReveal>
            </ul>
          </div>
        </section>

        {/* ===== 07 I still build + what I do now ===== */}
        <section
          id='build'
          className={styles.section}
          aria-labelledby='still-build'
        >
          <div className={styles.container}>
            <TwReveal>
              <p className={styles.numRow}>
                <span className={styles.secNum}>07</span>{' '}
                <span className={styles.secRule} aria-hidden='true' />{' '}
                <span className={styles.secLabel}>{S.build}</span>
              </p>
            </TwReveal>
            <div className={styles.twoCol}>
              <TwReveal>
                <h2 id='still-build' className={styles.h2}>
                  {ABOUT.build.stillBuildTitle}
                </h2>
                <p className={styles.stillBuildQuote}>
                  &ldquo;{QUOTES.stillBuild}&rdquo;
                </p>
                <ul className={styles.services}>
                  {BUILD_SERVICES.map((service) => {
                    const Icon = SERVICE_ICONS[service.slug] ?? SettingsIcon;
                    return (
                      <li key={service.slug} className={styles.iconItem}>
                        <span
                          className={`${styles.iconBadge} ${styles.iconBadgeGold}`}
                        >
                          <Icon className={styles.icon} />
                        </span>
                        <span>
                          <span className={styles.serviceName}>
                            {service.name}
                          </span>
                          <span className={styles.serviceText}>
                            {service.summary}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className={styles.label}>{ABOUT.build.qualitiesLabel}</p>
                <ul className={styles.chipRow}>
                  {BUILD_QUALITIES.map((quality) => (
                    <li key={quality}>
                      <TwChip variant='teal' size='sm'>
                        {quality}
                      </TwChip>
                    </li>
                  ))}
                </ul>
                <div className={styles.linkRow}>
                  <a
                    href={serviceHref()}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {ABOUT.build.fluxlineLink}{' '}
                    <span aria-hidden='true'>&#8599;</span>
                  </a>
                </div>
              </TwReveal>
              <TwReveal delay={90}>
                <h2 id='now' className={styles.h2}>
                  {ABOUT.build.title}
                </h2>
                <ul className={styles.growing}>
                  {GROWING_WORK.map((item) => {
                    const Icon = GROWING_ICONS[item.key];
                    return (
                      <li key={item.key} className={styles.iconItem}>
                        <span className={styles.iconBadge}>
                          <Icon className={styles.icon} />
                        </span>
                        <span className={styles.growingText}>{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </TwReveal>
            </div>
          </div>
        </section>

        {/* ===== 08 Experience ===== */}
        <section
          id='experience'
          className={`${styles.sectionAlt} ${styles.experienceGlow}`}
          aria-labelledby='about-experience'
        >
          <div className={styles.container}>
            <TwReveal>
              <SectionHeading
                num='08'
                label={S.experience}
                id='about-experience'
              >
                {ABOUT.experience.title}
              </SectionHeading>
              <p className={styles.lede}>{ABOUT.experience.lede}</p>
            </TwReveal>
            <AboutTimeline />

            <TwReveal>
              <h3 className={styles.h3}>{ABOUT.experience.projectsTitle}</h3>
            </TwReveal>
            <ul className={styles.projects}>
              {PROJECTS.map((project, i) => (
                <TwReveal
                  as='li'
                  key={project.name}
                  delay={i * 60}
                  className={styles.project}
                >
                  <p className={styles.projectPeriod}>{project.period}</p>
                  <p className={styles.projectName}>{project.name}</p>
                  <p className={styles.projectMeta}>
                    {project.role}
                    <br />
                    {project.stack}
                  </p>
                </TwReveal>
              ))}
            </ul>
            <div className={styles.linkRow}>
              <Link href='/portfolio/'>
                {ABOUT.experience.portfolioLink}{' '}
                <span aria-hidden='true'>&#8594;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== 09 Skills, degrees, and certifications =====
            The design that was on TEST, at full width (owner, #294). */}
        <section
          id='credentials'
          className={styles.section}
          aria-labelledby='about-credentials'
        >
          <div className={styles.container}>
            <TwReveal>
              <SectionHeading
                num='09'
                label={S.credentials}
                id='about-credentials'
              >
                {ABOUT.credentials.title}
              </SectionHeading>
              <p className={styles.lede}>{ABOUT.credentials.lede}</p>
            </TwReveal>
            <CredentialsBody />
          </div>
        </section>

        {/* ===== Closing ===== */}
        <section
          id='closing'
          className={styles.closing}
          aria-label={ABOUT.closing.title}
        >
          <div className={styles.container}>
            <TwReveal>
              <TwCTABand
                as='div'
                kicker={ABOUT.closing.kicker}
                title={ABOUT.closing.title}
                body={ABOUT.closing.body}
              >
                <BookingTrigger />
                <TwButton variant='outline' href='/contact/#message'>
                  {ABOUT.closing.message}
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
