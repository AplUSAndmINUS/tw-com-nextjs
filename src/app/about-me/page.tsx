import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import {
  getPersonSchema,
  getAboutHookPageSchema,
} from '@/utils/structuredData';
import {
  TwArticleCard,
  TwButton,
  TwCTABand,
  TwCard,
  TwChip,
  TwContentGrid,
  TwHero,
  TwMeter,
  TwMeterGroup,
  TwReveal,
  TwStatCard,
} from '@/components/dsm';
import { BookingTrigger } from '@/components/BookingFlow';
import { Footer } from '@/components/Footer';
import { InstagramGrid } from '@/components/InstagramGrid';
import { INSTAGRAM_FEED_ENABLED } from '@/lib/instagram';
import { SiteNav } from '@/components/SiteNav';
import {
  ArrowRightIcon,
  BookIcon,
  CodeIcon,
  DesignIdeasIcon,
  MicIcon,
  PenIcon,
  PeopleCommunityIcon,
  VideoIcon,
} from '@/components/icons';
import type { IconProps } from '@/components/icons';
import { getAllContent } from '@/lib/content';
import {
  RCF_BOOK,
  RCF_BOOK_BLURB,
  RCF_PATH,
  RCF_PREORDER_HREF,
  RCF_PREORDERS_OPEN,
  TRI_URL,
} from '@/lib/rcf';
import { SOCIAL_URLS } from '@/lib/socials';
import { SocialRow } from '@/app/home/SocialRow';
import { portfolioCategoryLabel } from '@/app/portfolio/portfolioMeta';
import ResonantIdentityIcon from '@/assets/images/ResonantIdentity_icon_192.png';
import { BOOK_A_CONVERSATION } from '@/content/site/booking';
import {
  HUB_HEADING,
  HUB_TILES,
  type HubTileKey,
} from '@/content/site/contentHub';
import { ABOUT_ME } from '@/content/site/aboutMe';
import { QUOTES } from '@/content/site/identity';
import { MICROCOPY } from '@/content/site/microcopy';
import {
  ABOUT_ME_SOCIALS,
  HERO_BODY,
  PODCAST_FACTS,
  PODCAST_SOCIALS,
  ROLES,
  ROLES_LINE,
  STATS,
  TALENT_SKILL_NAMES,
  pickProjects,
  pickSkills,
  type RoleIcon,
} from './aboutMeData';
import { QuickLinks, type QuickLink } from './QuickLinks';
import styles from './page.module.scss';

const ABOUT_ME_TITLE =
  'Terence Waters in 60 Seconds | Podcaster, Systems Architect & Business Consultant';
const ABOUT_ME_DESCRIPTION =
  'Terence Waters: podcaster, systems architect, business consultant, and author of The Resonance Core Framework™. The book, the podcast, what he is making, and where to find him, on one page.';

export const metadata: Metadata = {
  title: { absolute: ABOUT_ME_TITLE },
  description: ABOUT_ME_DESCRIPTION,
  keywords: [
    'Terence Waters',
    'about Terence Waters',
    'Terence Waters in 60 seconds',
    'Terence Waters Instagram',
    'The Resonant Identity podcast host',
    'podcaster',
    'systems architect',
    'business consultant',
    'Resonance Core Framework author',
    'Fluxline Resonance Group founder',
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

const ROLE_ICONS: Record<RoleIcon, React.ComponentType<IconProps>> = {
  mic: MicIcon,
  code: CodeIcon,
  people: PeopleCommunityIcon,
};

/** Icons for the Content Hub tiles (same as on /content-hub). */
const HUB_ICONS: Record<HubTileKey, React.ComponentType<IconProps>> = {
  podcasts: MicIcon,
  blog: PenIcon,
  portfolio: DesignIdeasIcon,
  github: CodeIcon,
  videos: VideoIcon,
};

/** "31 chapters in three parts", without the parenthetical part names. */
const RCF_STRUCTURE = RCF_BOOK.structure.replace(/\s*\(.*\)\s*$/, '');

const TALENTS = pickSkills(TALENT_SKILL_NAMES);

/**
 * The quick links (owner, #288): five, in the user copy's order. Pre-order
 * leads, highlighted, while pre-orders are announced (#273).
 */
const QUICK_LINKS: QuickLink[] = [
  ...(RCF_PREORDERS_OPEN
    ? [
        {
          label: ABOUT_ME.links.preorder,
          href: RCF_PREORDER_HREF,
          icon: 'book',
          external: true,
          highlight: true,
        } satisfies QuickLink,
      ]
    : []),
  {
    label: BOOK_A_CONVERSATION.label,
    href: BOOK_A_CONVERSATION.href,
    icon: 'calendar',
    booking: true,
  },
  { label: ABOUT_ME.links.fullStory, href: '/about/', icon: 'person' },
  {
    label: ABOUT_ME.links.podcast,
    href: '/podcasts/theresonantid/',
    icon: 'mic',
  },
  {
    label: ABOUT_ME.links.instagram,
    href: SOCIAL_URLS.instagram,
    icon: 'instagram',
    external: true,
  },
];

/** Text link with a trailing arrow: → for on-site, ↗ for off-site. */
function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = [styles.arrowLink, className].filter(Boolean).join(' ');
  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        className={classes}
        target='_blank'
        rel='noopener noreferrer'
      >
        {children} <span aria-hidden='true'>&#8599;</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children} <span aria-hidden='true'>&#8594;</span>
    </Link>
  );
}

/**
 * /about-me: Terence in 60 seconds, the "link in bio" page (rebuild, #288).
 *
 * In the owner's order: hero (the compact pinned photo and scroll reveal) →
 * quick links → in 60 seconds (blurb, quick facts, the three roles, the
 * numbers) → the book and the podcast → everything I'm making → some of the
 * work → off the page (the latest Instagram posts; hidden while
 * INSTAGRAM_FEED_ENABLED is off, #321) → what I bring to the table → find me
 * online → want to go deeper?
 *
 * A server component, loaded at build time, with small client islands:
 * TwReveal on every section, the hero's scroll reveal, the quick links (for
 * the booking dialog) and, when enabled, the Instagram feed, which loads at
 * runtime because Instagram's image URLs expire.
 */
export default async function AboutMePage() {
  const personSchema = getPersonSchema('https://terencewaters.com/about-me');
  const aboutHookPageSchema = getAboutHookPageSchema();

  // The portfolio entries that match /about's projects, in that order,
  // topped up from featured entries if one goes missing.
  const projects = pickProjects(await getAllContent('portfolio'));

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

      <SiteNav />

      <main id='main'>
        {/* ===== Hero: compact on a sub-page; no quote (owner, #288) ===== */}
        <TwHero
          eyebrow={ABOUT_ME.hero.eyebrow}
          title='Terence Waters'
          subtitle={ROLES_LINE}
          body={HERO_BODY}
          backgroundImage='/assets/images/hero-landscape.jpg'
          backgroundImagePortrait='/assets/images/hero-portrait.jpg'
          backgroundAlt='Terence Waters'
          tagline='Founder, Fluxline Resonance Group'
          location='Salt Lake City, Utah'
          focalPoint='center 20%'
          compact
          scrollReveal
        />

        {/* ===== Quick links: one row, under the hero ===== */}
        <section id='links' className={styles.linksSection}>
          <div className={styles.container}>
            <TwReveal>
              <QuickLinks label={ABOUT_ME.links.label} items={QUICK_LINKS} />
            </TwReveal>
          </div>
        </section>

        {/* ===== In 60 seconds ===== */}
        <section
          id='in-60-seconds'
          className={styles.sectionAlt}
          aria-labelledby='about-me-short'
        >
          <div className={styles.container}>
            <TwReveal>
              <p className={styles.eyebrow}>{ABOUT_ME.short.eyebrow}</p>
              <h2 id='about-me-short' className={styles.h2}>
                {ABOUT_ME.short.title}
              </h2>
            </TwReveal>

            <div className={styles.shortGrid}>
              <TwReveal>
                <p className={styles.blurb}>{ABOUT_ME.short.blurb}</p>
                <p className={`${styles.blurb} ${styles.blurbMore}`}>
                  {ABOUT_ME.short.goal.map((part) =>
                    !('emphasis' in part) ? (
                      <React.Fragment key={part.text}>
                        {part.text}
                      </React.Fragment>
                    ) : part.emphasis === 'strongEm' ? (
                      <strong key={part.text}>
                        <em>{part.text}</em>
                      </strong>
                    ) : (
                      <em key={part.text}>{part.text}</em>
                    )
                  )}
                </p>
              </TwReveal>
              <TwReveal delay={90}>
                <div className={styles.factsCard}>
                  <p className={styles.label}>{ABOUT_ME.short.factsLabel}</p>
                  <ul className={styles.facts}>
                    {ABOUT_ME.short.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </TwReveal>
            </div>

            <TwContentGrid cols={3} tabletCols={3} className={styles.grid}>
              {ROLES.map((role) => {
                const Icon = ROLE_ICONS[role.icon];
                return (
                  <TwCard key={role.title} className={styles.roleCard}>
                    <span className={styles.iconBadge}>
                      <Icon size={22} />
                    </span>
                    <p className={styles.cardLabel}>{role.label}</p>
                    <h3 className={styles.cardTitle}>{role.title}</h3>
                    <p className={`${styles.cardText} ${styles.roleText}`}>
                      {role.text}
                    </p>
                    <div className={styles.chipRow}>
                      {role.points.map((point) => (
                        <TwChip key={point} size='sm'>
                          {point}
                        </TwChip>
                      ))}
                    </div>
                    <ArrowLink href={role.href} className={styles.cardLink}>
                      {role.linkLabel}
                    </ArrowLink>
                  </TwCard>
                );
              })}
            </TwContentGrid>

            <TwContentGrid
              cols={3}
              tabletCols={3}
              className={`${styles.grid} ${styles.statGrid}`}
            >
              {STATS.map((stat) => (
                <TwStatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  className={styles.statItem}
                />
              ))}
            </TwContentGrid>
          </div>
        </section>

        {/* ===== The book and the podcast ===== */}
        <section
          id='book-and-podcast'
          className={styles.section}
          aria-labelledby='about-me-building'
        >
          <div className={styles.container}>
            <TwReveal>
              <h2 id='about-me-building' className={styles.h2}>
                {ABOUT_ME.buildingTitle}
              </h2>
            </TwReveal>

            <div className={styles.features}>
              <TwReveal fill>
                <TwCard
                  as='article'
                  id='the-book'
                  padded={false}
                  className={styles.feature}
                >
                  <div className={styles.featureHead}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.featureArt}
                      src='/assets/images/RCF_logo.jpg'
                      alt='The Resonance Core Framework™ logo'
                      width={96}
                      height={96}
                      loading='lazy'
                      decoding='async'
                    />
                    <div>
                      <p className={styles.cardLabel}>
                        <BookIcon size={14} /> {ABOUT_ME.book.label}
                      </p>
                      <h3 className={styles.featureTitle}>{RCF_BOOK.title}</h3>
                      <p className={styles.featureMeta}>
                        {RCF_BOOK.publicationDate}
                      </p>
                      {RCF_PREORDERS_OPEN ? (
                        <p className={styles.preorderBadge}>
                          {ABOUT_ME.book.badge}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.featureBody}>
                    <p className={`${styles.cardText} ${styles.clampOnPhone}`}>
                      {RCF_BOOK_BLURB}
                    </p>
                    <ul className={styles.factList}>
                      <li>{RCF_STRUCTURE}</li>
                      <li>{RCF_BOOK.formats.join(' · ')}</li>
                      <li>Published by {RCF_BOOK.publisher}</li>
                    </ul>
                    <div className={styles.featureActions}>
                      {RCF_PREORDERS_OPEN ? (
                        <TwButton
                          variant='gold'
                          href={RCF_PREORDER_HREF}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {ABOUT_ME.book.preorder}
                        </TwButton>
                      ) : null}
                      <TwButton variant='outline' href={RCF_PATH + '/'}>
                        {ABOUT_ME.book.explore}{' '}
                        <span aria-hidden='true'>&#8594;</span>
                      </TwButton>
                    </div>
                  </div>
                </TwCard>
              </TwReveal>

              <TwReveal fill delay={90}>
                <TwCard
                  as='article'
                  id='podcast'
                  padded={false}
                  className={styles.feature}
                >
                  <div className={styles.featureHead}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.featureArt}
                      src={ResonantIdentityIcon.src}
                      alt='The Resonant Identity podcast logo'
                      width={96}
                      height={96}
                      loading='lazy'
                      decoding='async'
                    />
                    <div>
                      <p className={styles.cardLabel}>
                        <MicIcon size={14} /> {ABOUT_ME.podcast.label}
                      </p>
                      <h3 className={styles.featureTitle}>
                        {ABOUT_ME.podcast.title}
                      </h3>
                      <p className={styles.featureMeta}>
                        {ABOUT_ME.podcast.meta}
                      </p>
                    </div>
                  </div>
                  <div className={styles.featureBody}>
                    <p className={`${styles.cardText} ${styles.clampOnPhone}`}>
                      {ABOUT_ME.podcast.text}
                    </p>
                    <ul className={styles.factList}>
                      {PODCAST_FACTS.map((fact) => (
                        <li key={fact}>{fact}</li>
                      ))}
                    </ul>
                    <p className={styles.label}>{ABOUT_ME.podcast.listenOn}</p>
                    <SocialRow items={PODCAST_SOCIALS} size={24} />
                    <div className={styles.featureActions}>
                      <TwButton
                        href={TRI_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {ABOUT_ME.podcast.listen}
                      </TwButton>
                      <TwButton
                        variant='outline'
                        href='/podcasts/theresonantid/'
                      >
                        {ABOUT_ME.podcast.browse}{' '}
                        <span aria-hidden='true'>&#8594;</span>
                      </TwButton>
                    </div>
                  </div>
                </TwCard>
              </TwReveal>
            </div>
          </div>
        </section>

        {/* ===== Everything I'm making: the Content Hub tiles ===== */}
        <section
          id='making'
          className={styles.sectionAlt}
          aria-labelledby='about-me-making'
        >
          <div className={styles.container}>
            <TwReveal>
              <h2 id='about-me-making' className={styles.h2}>
                {HUB_HEADING}
              </h2>
            </TwReveal>
            <ul className={styles.hubTiles}>
              {HUB_TILES.map((tile, i) => {
                const Icon = HUB_ICONS[tile.key];
                return (
                  <TwReveal as='li' key={tile.key} delay={i * 60}>
                    <Link href={tile.href} className={styles.hubTile}>
                      <span className={styles.hubIcon}>
                        <Icon className={styles.icon} />
                      </span>
                      <span className={styles.hubTitle}>{tile.title}</span>
                      <span className={styles.hubText}>{tile.description}</span>
                      <span className={styles.hubCta}>
                        {tile.cta} <ArrowRightIcon size={16} />
                      </span>
                    </Link>
                  </TwReveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ===== Some of the work: portfolio entries that match /about ===== */}
        {projects.length > 0 ? (
          <section
            id='projects'
            className={styles.section}
            aria-labelledby='about-me-projects'
          >
            <div className={styles.container}>
              <TwReveal>
                <h2 id='about-me-projects' className={styles.h2}>
                  {ABOUT_ME.projects.title}
                </h2>
                <p className={styles.lede}>{ABOUT_ME.projects.lede}</p>
              </TwReveal>
              <div className={styles.projectGrid}>
                {projects.map((project, i) => (
                  <TwReveal key={project.slug} fill delay={i * 90}>
                    <TwArticleCard
                      title={project.title}
                      excerpt={project.excerpt}
                      category={portfolioCategoryLabel(project.category)}
                      image={project.imageUrl}
                      imageAlt={project.imageAlt ?? project.title}
                      href={`/portfolio/${project.slug}/`}
                    />
                  </TwReveal>
                ))}
              </div>
              <div className={styles.linkRow}>
                <Link href='/portfolio/'>
                  {ABOUT_ME.projects.more}{' '}
                  <span aria-hidden='true'>&#8594;</span>
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== Off the page: the latest Instagram posts =====
            The user-copy layout (one lead, four squares), filled at runtime
            from /api/instagram (#288). Hidden while INSTAGRAM_FEED_ENABLED is
            off (owner, 2026-11-19). */}
        {INSTAGRAM_FEED_ENABLED ? (
          <section
            id='instagram'
            className={styles.sectionAlt}
            aria-labelledby='about-me-photos'
          >
            <div className={styles.container}>
              <TwReveal>
                <h2 id='about-me-photos' className={styles.h2}>
                  {ABOUT_ME.photos.title}
                </h2>
              </TwReveal>
              <TwReveal>
                <InstagramGrid layout='feature' className={styles.photoFeed} />
              </TwReveal>
              <div className={styles.linkRow}>
                <a
                  href={SOCIAL_URLS.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {ABOUT_ME.photos.follow}{' '}
                  <span aria-hidden='true'>&#8599;</span>
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {/* ===== What I bring to the table: talent bars + I still build ===== */}
        <section
          id='skills'
          className={
            INSTAGRAM_FEED_ENABLED ? styles.section : styles.sectionAlt
          }
          aria-labelledby='about-me-talents'
        >
          <div className={`${styles.container} ${styles.twoCol}`}>
            <TwReveal>
              <h2 id='about-me-talents' className={styles.h2}>
                {ABOUT_ME.talents.title}
              </h2>
              <TwMeterGroup
                caption={MICROCOPY.talentCaption}
                columns={1}
                className={styles.meters}
              >
                {TALENTS.map((skill) => (
                  <TwMeter
                    key={skill.name}
                    label={skill.name}
                    value={skill.percentage}
                  />
                ))}
              </TwMeterGroup>
              <div className={styles.linkRow}>
                <Link href='/about#credentials'>
                  {ABOUT_ME.talents.more}{' '}
                  <span aria-hidden='true'>&#8594;</span>
                </Link>
              </div>
            </TwReveal>
            <TwReveal delay={90}>
              <div className={styles.stillBuild}>
                <h2 className={styles.h2}>{ABOUT_ME.stillBuild.title}</h2>
                <p className={styles.stillBuildQuote}>
                  &ldquo;{QUOTES.stillBuild}&rdquo;
                </p>
                <p className={styles.stillBuildMore}>
                  {ABOUT_ME.stillBuild.more.map((part) =>
                    'emphasis' in part && part.emphasis ? (
                      <strong key={part.text}>
                        <em>{part.text}</em>
                      </strong>
                    ) : (
                      <React.Fragment key={part.text}>
                        {part.text}
                      </React.Fragment>
                    )
                  )}
                </p>
                <div className={styles.linkRow}>
                  <Link href='/about/'>
                    {ABOUT_ME.stillBuild.link}{' '}
                    <span aria-hidden='true'>&#8594;</span>
                  </Link>
                </div>
              </div>
            </TwReveal>
          </div>
        </section>

        {/* ===== Find me online ===== */}
        <section
          id='socials'
          className={
            INSTAGRAM_FEED_ENABLED ? styles.sectionAlt : styles.section
          }
          aria-labelledby='about-me-socials'
        >
          <div className={`${styles.container} ${styles.socials}`}>
            <TwReveal>
              <h2 id='about-me-socials' className={styles.h2}>
                {ABOUT_ME.socials.title}
              </h2>
              <SocialRow
                items={ABOUT_ME_SOCIALS}
                size={26}
                className={styles.socialRow}
              />
            </TwReveal>
          </div>
        </section>

        {/* ===== Want to go deeper? ===== */}
        <section
          id='connect'
          className={
            INSTAGRAM_FEED_ENABLED ? styles.section : styles.sectionAlt
          }
          aria-label={ABOUT_ME.closing.title}
        >
          <div className={styles.container}>
            <TwReveal>
              <TwCTABand
                as='div'
                kicker={ABOUT_ME.closing.kicker}
                title={ABOUT_ME.closing.title}
                body={ABOUT_ME.closing.body}
              >
                <TwButton href='/about/'>{ABOUT_ME.links.fullStory}</TwButton>
                <BookingTrigger variant='outline' />
              </TwCTABand>
            </TwReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
