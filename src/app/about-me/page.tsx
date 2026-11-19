import type { Metadata } from 'next';
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
  TwReveal,
  TwSectionHeading,
  TwStatCard,
} from '@/components/dsm';
import { Footer } from '@/components/Footer';
import {
  BookIcon,
  CalendarIcon,
  CodeIcon,
  ContactCardIcon,
  MicIcon,
  PeopleCommunityIcon,
} from '@/components/icons';
import type { IconProps } from '@/components/icons';
import { getAllContent } from '@/lib/content';
import {
  RCF_BOOK,
  RCF_BOOK_BLURB,
  RCF_CONCEPTS,
  RCF_PATH,
  RCF_PREORDER_HREF,
  TRI_URL,
  RCF_PREORDERS_OPEN,
} from '@/lib/rcf';
import { SOCIAL_URLS } from '@/lib/socials';
import { readTime } from '@/app/home/contentFormat';
import { SocialRow } from '@/app/home/SocialRow';
import { portfolioCategoryLabel } from '@/app/portfolio/portfolioMeta';
import ResonantIdentityIcon from '@/assets/images/ResonantIdentity_icon_192.png';
import {
  ABOUT_ME_SOCIALS,
  BOOKING_URL,
  EMAIL_ADDRESS,
  HERO_BODY,
  HOOK_QUOTE,
  PODCAST_FACTS,
  PODCAST_SOCIALS,
  POST_LIMIT,
  ROLES,
  ROLES_LINE,
  STATS,
  TALENT_SKILL_NAMES,
  formatPostMeta,
  pickProjects,
  pickSkills,
  type RoleIcon,
} from './aboutMeData';
import styles from './page.module.scss';
import { SiteNav } from '@/components/SiteNav';

const ABOUT_ME_TITLE =
  'Terence Waters in 60 Seconds | Podcaster, Systems Architect & Business Consultant';
const ABOUT_ME_DESCRIPTION =
  'Terence Waters: podcaster, systems architect, business consultant, and author of The Resonance Core Framework™. The book, the podcast, skills, projects, and writing on one page.';

export const metadata: Metadata = {
  title: { absolute: ABOUT_ME_TITLE },
  description: ABOUT_ME_DESCRIPTION,
  keywords: [
    'Terence Waters',
    'about Terence Waters',
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

/** The four concepts a newcomer meets first; the rest live on the RCF page. */
const RCF_HIGHLIGHTS = RCF_CONCEPTS.slice(0, 4).map((concept) => concept.name);

/** "31 chapters in three parts", without the parenthetical part names. */
const RCF_STRUCTURE = RCF_BOOK.structure.replace(/\s*\(.*\)\s*$/, '');

const TALENTS = pickSkills(TALENT_SKILL_NAMES);

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
 * /about-me: Terence in 60 seconds.
 *
 * The "link in bio" page. Other sites in the ecosystem (starting with
 * theresonantidentity.com/start-here) point here when they refer someone to
 * "more about Terence". It reads top to bottom like a landing page:
 *
 *   1. Hero callout: who, in one line. No buttons, so the page opens on the
 *      person rather than a choice.
 *   2. In 60 seconds: the three roles, plus the headline numbers.
 *   3. The book and the podcast, side by side.
 *   4. Talent bars: the skills behind the roles, scored out of 100.
 *   5. Selected projects and recent writing, loaded from the content system.
 *   6. The actions: full story (/about), get in touch, the RCF page, then
 *      every social profile as an icon row.
 *
 * A server component throughout, loading its content at build time. It embeds
 * client components for the motion and interactivity: TwReveal, the hero's
 * parallax and scroll reveal (TwHero / TwHeroScrollReveal), the article-card
 * image loader, and the nav and footer.
 */
export default async function AboutMePage() {
  const personSchema = getPersonSchema('https://terencewaters.com/about-me');
  const aboutHookPageSchema = getAboutHookPageSchema();

  const [blog, portfolio] = await Promise.all([
    getAllContent('blog'),
    getAllContent('portfolio'),
  ]);
  const posts = blog.slice(0, POST_LIMIT);
  const projects = pickProjects(portfolio);

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
        {/* ===== Hero callout: no actions here, they close the page ===== */}
        <TwHero
          eyebrow="Hi, I'm"
          title='Terence Waters'
          subtitle={ROLES_LINE}
          body={HERO_BODY}
          quote={HOOK_QUOTE}
          backgroundImage='/assets/images/hero-landscape.jpg'
          backgroundImagePortrait='/assets/images/hero-portrait.jpg'
          backgroundAlt='Terence Waters'
          tagline='Founder, Fluxline Resonance Group'
          location='Salt Lake City, Utah'
          focalPoint='center 20%'
          compact
          scrollReveal
        />

        {/* ===== In 60 seconds ===== */}
        <section id='in-60-seconds' className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <TwSectionHeading
                kicker='In 60 seconds'
                title='Three roles, one system'
                lede='Everything I do traces back to the same idea: sustainable change requires alignment, not force.'
              />
            </TwReveal>

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
                    <p className={styles.cardText}>{role.text}</p>
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

        {/* ===== The book + the podcast ===== */}
        <section
          id='book-and-podcast'
          className={`${styles.section} ${styles.sectionAlt}`}
        >
          <div className={styles.container}>
            <TwReveal>
              <TwSectionHeading
                kicker='What I’m building'
                title='The book and the podcast'
                lede='The framework is written down in the book and talked through on the podcast.'
              />
            </TwReveal>

            <TwContentGrid cols={2} tabletCols={2} className={styles.grid}>
              {/* The Resonance Core Framework™ */}
              <TwCard
                as='article'
                id='the-book'
                padded={false}
                className={styles.feature}
              >
                <div className={styles.featureHead}>
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      static export with images.unoptimized; see TwHero. */}
                  <img
                    className={styles.featureArt}
                    src='/assets/images/RCF_logo.jpeg'
                    alt='The Resonance Core Framework™ logo'
                    width={96}
                    height={96}
                    loading='lazy'
                    decoding='async'
                  />
                  <div>
                    <p className={styles.cardLabel}>
                      <BookIcon size={14} /> The book
                    </p>
                    <h3 className={styles.featureTitle}>{RCF_BOOK.title}</h3>
                    <p className={styles.featureMeta}>
                      {RCF_BOOK.publicationDate}
                    </p>
                    {RCF_PREORDERS_OPEN && (
                      <p className={styles.preorderBadge}>Pre-orders open</p>
                    )}
                  </div>
                </div>
                <div className={styles.featureBody}>
                  <p className={styles.cardText}>{RCF_BOOK_BLURB}</p>
                  <ul className={styles.factList}>
                    <li>{RCF_STRUCTURE}</li>
                    <li>{RCF_BOOK.formats.join(' · ')}</li>
                    <li>Published by {RCF_BOOK.publisher}</li>
                  </ul>
                  <p className={styles.chipLabel}>Core concepts</p>
                  <div className={styles.chipRow}>
                    {RCF_HIGHLIGHTS.map((name) => (
                      <TwChip key={name} variant='teal' size='sm'>
                        {name}
                      </TwChip>
                    ))}
                  </div>
                  {/* Homepage cadence: the strong button first, outline second.
                      Gold replaces the primary because this one is the
                      pre-order. */}
                  <div className={styles.featureActions}>
                    {RCF_PREORDERS_OPEN && (
                      <TwButton
                        variant='gold'
                        href={RCF_PREORDER_HREF}
                        target='_blank'
                        className={styles.featureButton}
                      >
                        Pre-order the book
                      </TwButton>
                    )}
                    <TwButton
                      variant='outline'
                      href={RCF_PATH}
                      className={styles.featureButton}
                    >
                      Explore the framework <span aria-hidden='true'>→</span>
                    </TwButton>
                  </div>
                </div>
              </TwCard>

              {/* The Resonant Identity */}
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
                      <MicIcon size={14} /> The podcast
                    </p>
                    <h3 className={styles.featureTitle}>
                      The Resonant Identity
                    </h3>
                    <p className={styles.featureMeta}>
                      Hosted by Terence Waters
                    </p>
                  </div>
                </div>
                <div className={styles.featureBody}>
                  <p className={styles.cardText}>
                    Identity architecture, self-improvement, and practical
                    frameworks for navigating transitions with clarity. Built on
                    The Resonance Core Framework™, for people in a season of
                    becoming.
                  </p>
                  <ul className={styles.factList}>
                    {PODCAST_FACTS.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                  <p className={styles.chipLabel}>Listen on</p>
                  <SocialRow items={PODCAST_SOCIALS} size={26} />
                  <div className={styles.featureActions}>
                    <TwButton
                      href={TRI_URL}
                      target='_blank'
                      className={styles.featureButton}
                    >
                      Listen to the podcast
                    </TwButton>
                    <TwButton
                      variant='outline'
                      href='/podcasts/theresonantid'
                      className={styles.featureButton}
                    >
                      Browse episodes <span aria-hidden='true'>→</span>
                    </TwButton>
                  </div>
                </div>
              </TwCard>
            </TwContentGrid>
          </div>
        </section>

        {/* ===== Talent bars ===== */}
        <section id='skills' className={styles.section}>
          <div className={styles.container}>
            <TwReveal>
              <TwSectionHeading
                kicker='Talent bars'
                title='What I bring to the table'
                lede='The skills behind the three roles, scored out of 100.'
              />
            </TwReveal>

            <TwReveal>
              <TwCard className={styles.meterCard}>
                <ul className={styles.meterGrid}>
                  {TALENTS.map((skill) => (
                    <li key={skill.name}>
                      <div className={styles.meterHead}>
                        <span className={styles.meterName}>{skill.name}</span>
                        <span className={styles.meterValue}>
                          {skill.percentage}
                          <span className={styles.meterMax}> / 100</span>
                        </span>
                      </div>
                      <div
                        className={styles.meterTrack}
                        role='meter'
                        aria-valuenow={skill.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${skill.name}: ${skill.percentage} out of 100`}
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
                    </li>
                  ))}
                </ul>
              </TwCard>
            </TwReveal>

            <TwReveal>
              <div className={styles.sectionLink}>
                <ArrowLink href='/about#credentials'>
                  All skills, degrees & certifications
                </ArrowLink>
              </div>
            </TwReveal>
          </div>
        </section>

        {/* ===== Selected projects ===== */}
        {projects.length > 0 ? (
          <section
            id='projects'
            className={`${styles.section} ${styles.sectionAlt}`}
          >
            <div className={styles.container}>
              <TwReveal>
                <TwSectionHeading
                  kicker='Selected projects'
                  title='Some of the work'
                  lede='Platforms and systems I architected, led, or built.'
                />
              </TwReveal>

              <TwContentGrid cols={3} tabletCols={3} className={styles.grid}>
                {projects.map((project) => (
                  <TwArticleCard
                    key={project.slug}
                    title={project.title}
                    excerpt={project.excerpt}
                    category={portfolioCategoryLabel(project.category)}
                    image={project.imageUrl ?? project.featuredImage}
                    imageAlt={project.imageAlt ?? project.title}
                    href={`/portfolio/${project.slug}`}
                    className={styles.article}
                  />
                ))}
              </TwContentGrid>

              <TwReveal>
                <div className={styles.sectionLink}>
                  <ArrowLink href='/portfolio'>
                    View the full portfolio
                  </ArrowLink>
                </div>
              </TwReveal>
            </div>
          </section>
        ) : null}

        {/* ===== Recent writing ===== */}
        {posts.length > 0 ? (
          <section id='writing' className={styles.section}>
            <div className={styles.container}>
              <TwReveal>
                <TwSectionHeading
                  kicker='From the blog'
                  title='Recent writing'
                  lede='Identity, the framework, and building a book in public.'
                />
              </TwReveal>

              <TwContentGrid cols={3} tabletCols={3} className={styles.grid}>
                {posts.map((post) => (
                  <TwArticleCard
                    key={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    date={formatPostMeta(post.date, readTime(post.content))}
                    dateTime={post.date || undefined}
                    href={`/blog/${post.slug}`}
                    className={styles.article}
                  />
                ))}
              </TwContentGrid>

              <TwReveal>
                <div className={styles.sectionLink}>
                  <ArrowLink href='/blog'>Read the blog</ArrowLink>
                </div>
              </TwReveal>
            </div>
          </section>
        ) : null}

        {/* ===== Closing: the actions, contact details, and socials ===== */}
        <section id='connect' className={styles.closing}>
          <div className={styles.container}>
            <TwReveal>
              <TwCTABand
                as='div'
                kicker='That was the short version'
                title='Want to go deeper?'
                body='Read the full story, start a conversation, or dig into the framework behind all of it.'
              >
                <TwButton href='/about' className={styles.ctaButton}>
                  Read my full story
                </TwButton>
                <TwButton
                  variant='outline'
                  href='/#contact'
                  className={styles.ctaButton}
                >
                  Get in touch
                </TwButton>
                <TwButton
                  variant='outline'
                  href={RCF_PATH}
                  className={styles.ctaButton}
                >
                  The Resonance Core Framework™
                </TwButton>
              </TwCTABand>
            </TwReveal>

            <TwReveal>
              <ul
                className={styles.contactGrid}
                aria-label='Ways to get in touch'
              >
                <li>
                  <a href={SOCIAL_URLS.email} className={styles.contactItem}>
                    <span className={styles.iconBadge}>
                      <ContactCardIcon size={20} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>Email</span>
                      <span className={styles.contactValue}>
                        {EMAIL_ADDRESS}
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={BOOKING_URL}
                    className={styles.contactItem}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <span className={styles.iconBadge}>
                      <CalendarIcon size={20} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>Book a call</span>
                      <span className={styles.contactValue}>
                        Free consultation
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <Link href='/#contact' className={styles.contactItem}>
                    <span className={styles.iconBadge}>
                      <PeopleCommunityIcon size={20} />
                    </span>
                    <span>
                      <span className={styles.contactLabel}>
                        Send a message
                      </span>
                      <span className={styles.contactValue}>Contact form</span>
                    </span>
                  </Link>
                </li>
              </ul>
            </TwReveal>

            <TwReveal>
              <div className={styles.socialBlock}>
                <p className={styles.chipLabel}>Find me online</p>
                <SocialRow
                  items={ABOUT_ME_SOCIALS}
                  size={26}
                  className={styles.socialRow}
                />
              </div>
            </TwReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
