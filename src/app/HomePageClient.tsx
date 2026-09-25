'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TwHero,
  TwSectionHeading,
  TwStatCard,
  TwArticleCard,
  TwFeaturedCard,
  TwFilterChips,
  TwReveal,
  TwParallax,
  TwButton,
} from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { Spinner } from '@/components/ui/Spinner';
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';
import { HomeNav } from './home/HomeNav';
import { HomeContactForm } from './home/HomeContactForm';
import { HomeNewsletterForm } from './home/HomeNewsletterForm';
import { ServiceDrawer } from './home/ServiceDrawer';
import { SocialRow } from './home/SocialRow';
import {
  homeServices,
  serviceHref,
  aboutSocials,
  wideSocials,
  type HomeService,
} from './home/homeData';
import {
  RCF_BOOK_BLURB,
  RCF_NOTIFY_HREF,
  RCF_PATH,
  RCF_TRADEMARK,
  TRI_URL,
} from '@/lib/rcf';
import { getApiBaseUrl } from '@/lib/environment';
import { fetchPodcastsFromApi } from '@/lib/spreaker';
import type { YouTubeVideo } from './videos/types';
import {
  episodeToCard,
  videoToCard,
  HOME_MEDIA_LIMIT,
} from './home/contentCards';
import styles from './HomePageClient.module.scss';

/** Minimal card shape the server hands down (content stripped for payload). */
export interface HomeCard {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  href: string;
  /** Cover art / thumbnail — set for podcast and video cards. */
  image?: string;
  /** True when `href` leaves the site (YouTube). */
  external?: boolean;
}

type MediaState = 'idle' | 'loading' | 'ready' | 'error';

export interface HomePageClientProps {
  /** Recent Content Hub items (blog + related), newest first. */
  content: HomeCard[];
  /**
   * Latest podcast episodes, read from Spreaker at build time. Empty when the
   * feed was unreachable; the client then retries via /api/podcasts.
   */
  podcasts: HomeCard[];
  /** Portfolio + case-study highlights. */
  portfolio: HomeCard[];
}

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Content', href: '#content' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

/**
 * The "who this is for" trio, lifted up from /about so the homepage answers the
 * question without a click. The full version still lives on the About page.
 */
const AUDIENCES = [
  {
    label: 'For individuals',
    text: 'Understand your identity architecture, clear the noise, and rebuild the internal systems you actually run on.',
  },
  {
    label: 'For founders & creators',
    text: 'Brands, platforms, and workflows that feel like you — not the version the internet told you to be.',
  },
  {
    label: 'For teams',
    text: 'Modular systems and strategic frameworks that make complexity navigable and growth possible.',
  },
];

const CONTENT_FILTERS = [
  { label: 'Writing', value: 'Writing' },
  { label: 'Podcast', value: 'Podcast' },
  { label: 'Video', value: 'Video' },
];

/**
 * Homepage — single-page scroll.
 *
 * Rebuilt on the design system from the redesign prototype: hero, then numbered
 * rail sections (About / Work / Content / Portfolio), newsletter, contact, and
 * the shared footer. The global Header is suppressed on "/" (see providers.tsx)
 * so this component owns the whole page shell.
 *
 * Content and portfolio cards are real, loaded at build time by page.tsx and
 * passed in. The service catalogue is static (homeData) and links out to
 * fluxline.pro via the slide-over drawer.
 *
 * The old forced-dark effect and 7-stage intro animation are gone — the token
 * layer makes light mode viable here, and TwReveal handles entrance motion.
 */
export default function HomePageClient({
  content,
  podcasts: buildPodcasts,
  portfolio,
}: HomePageClientProps) {
  const [contentFilter, setContentFilter] = useState<string | null>(null);
  const [activeService, setActiveService] = useState<HomeService | null>(null);

  // Podcast and Video cards are fetched on first selection of their chip, so
  // visitors who never open them don't pay for the requests.
  const [podcasts, setPodcasts] = useState<HomeCard[]>(buildPodcasts);
  const [podcastState, setPodcastState] = useState<MediaState>(
    buildPodcasts.length > 0 ? 'ready' : 'idle'
  );
  const [videos, setVideos] = useState<HomeCard[]>([]);
  const [videoState, setVideoState] = useState<MediaState>('idle');

  useEffect(() => {
    if (contentFilter !== 'Podcast' || podcastState !== 'idle') return;
    setPodcastState('loading');
    fetchPodcastsFromApi().then((feed) => {
      setPodcasts(feed.episodes.slice(0, HOME_MEDIA_LIMIT).map(episodeToCard));
      setPodcastState(feed.available ? 'ready' : 'error');
    });
  }, [contentFilter, podcastState]);

  useEffect(() => {
    if (contentFilter !== 'Video' || videoState !== 'idle') return;
    setVideoState('loading');
    (async () => {
      try {
        // Same endpoint the /videos page reads.
        const res = await fetch(`${getApiBaseUrl()}/api/youtube?type=videos`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: YouTubeVideo[] = Array.isArray(data.videos)
          ? data.videos
          : [];
        setVideos(list.slice(0, HOME_MEDIA_LIMIT).map(videoToCard));
        setVideoState('ready');
      } catch {
        setVideoState('error');
      }
    })();
  }, [contentFilter, videoState]);

  let filteredContent: HomeCard[];
  let mediaState: MediaState = 'ready';
  let mediaFallback = { label: '', href: '' };
  if (contentFilter === 'Podcast') {
    filteredContent = podcasts;
    mediaState = podcastState;
    mediaFallback = { label: 'Browse all podcast episodes', href: '/podcasts' };
  } else if (contentFilter === 'Video') {
    filteredContent = videos;
    mediaState = videoState;
    mediaFallback = { label: 'Browse all videos', href: '/videos' };
  } else {
    filteredContent = content;
  }

  const openFluxlineServices = () =>
    window.open('https://fluxline.pro/services', '_blank', 'noopener');

  return (
    <div id='top' className={styles.page}>
      <HomeNav
        links={NAV_LINKS}
        sectionIds={[
          'hero',
          'about',
          'work',
          'content',
          'portfolio',
          'contact',
        ]}
      />

      <section id='hero' className='tw-snap'>
        <TwHero
          eyebrow="Hi there 👋 I'm"
          title='Terence Waters'
          subtitle={
            <>
              <span>Author</span>
              <span aria-hidden='true'>·</span>
              <Link href={RCF_PATH}>{RCF_TRADEMARK}</Link>
              <span aria-hidden='true'>·</span>
              <span>Systems Architect</span>
              <span aria-hidden='true'>·</span>
              <span>Identity Coach</span>
            </>
          }
          body={
            <>
              I help people and organizations rebuild the parts of themselves
              they thought were permanent. Systems thinker, designer, and coach
              — writing about resonance, identity, and{' '}
              <strong>
                <em>building a life that embodies it all</em>
              </strong>
              .
            </>
          }
          quote='Clarity, identity, and systems that make your life — and your work — feel like they finally fit.'
          primaryCta={{ label: 'Who am I?', href: '#about' }}
          secondaryCta={{ label: 'View portfolio', href: '#portfolio' }}
          backgroundImage='/assets/images/hero-landscape.jpg'
          backgroundImagePortrait='/assets/images/hero-portrait.jpg'
          tagline='Founder, Fluxline Resonance Group'
          location='Salt Lake City, Utah'
          focalPoint='center 30%'
        />
      </section>

      {/* ===== The book (pre-launch) + resonance philosophy ===== */}
      <section id='book' className={`tw-snap ${styles.resonanceSection}`}>
        <div className={styles.container}>
          <div className={styles.resonanceGrid}>
            <TwReveal variant='left'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.resonanceLogo}
                src='/assets/images/RCF_logo.jpeg'
                alt='The Resonance Core Framework™ logo'
                loading='lazy'
                decoding='async'
              />
            </TwReveal>
            <TwReveal stagger>
              <TwSectionHeading
                kicker='The Book'
                title='The Resonance Core Framework™ — Coming Late Fall 2026'
              />
              <p className={styles.prose}>{RCF_BOOK_BLURB}</p>
              <blockquote className={styles.quote}>
                Resonance is when your identity, your systems, and your actions
                finally operate on the same frequency. My work — architectural,
                creative, or personal — is about helping you build from that
                place.
              </blockquote>
              <div className={styles.bookCtas}>
                <TwButton href={RCF_NOTIFY_HREF}>
                  Be Notified at Launch →
                </TwButton>
                <TwButton variant='outline' href={RCF_PATH}>
                  Preview the Framework →
                </TwButton>
                <TwButton variant='outline' href={TRI_URL}>
                  Listen to the Podcast →
                </TwButton>
              </div>
            </TwReveal>
          </div>
        </div>
      </section>

      {/* ===== 01 About ===== */}
      <section
        id='about'
        className={`tw-snap ${styles.section} ${styles.glowAbout}`}
      >
        <div className={styles.container}>
          <div className={styles.railGrid}>
            <div className={styles.rail}>
              <div className={styles.numRow}>
                <span className={styles.secNum}>01</span>
                <span className={styles.secLabel}>About</span>
              </div>
              <TwReveal variant='left'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={`tw-media ${styles.portrait}`}
                  src='/assets/images/portrait-about.jpg'
                  alt='Terence Waters'
                />
              </TwReveal>
              <div className={styles.socialBlock}>
                <div className={styles.socialLabel}>Social Media</div>
                <SocialRow items={aboutSocials} />
              </div>
            </div>

            <div>
              <TwReveal stagger>
                <TwSectionHeading
                  kicker='About'
                  title="Hi! I'm Terence. :)"
                  subhead={
                    <>
                      Most people don&apos;t need more information.
                      <br />
                      We need clarity, structure, and a way back to ourselves.
                    </>
                  }
                />
                <p className={styles.prose}>
                  My work sits at the intersection of{' '}
                  <strong>
                    <em>architecture</em>
                  </strong>
                  ,{' '}
                  <strong>
                    <em>identity</em>
                  </strong>
                  , and{' '}
                  <strong>
                    <em>transformation</em>
                  </strong>
                  . I help people understand the systems they run on — and
                  rebuild the ones that no longer serve them.
                </p>
                <p className={styles.prose}>
                  I&apos;m a systems architect by training, a designer by
                  instinct, and a coach by necessity. For 15+ years I&apos;ve
                  worked across IT architecture, full-stack development, brand
                  identity, and personal transformation — translating complexity
                  into{' '}
                  <strong>
                    <em>clarity</em>
                  </strong>{' '}
                  for founders and mission-driven teams.
                </p>
                <p className={styles.prose}>
                  Structure. Clarity. A way to understand who I was becoming and
                  why.
                </p>
                <blockquote className={styles.quote}>
                  That&apos;s the work — and it&apos;s why I build the way I do.
                </blockquote>
                <div className={styles.statGrid}>
                  <TwStatCard
                    value='15+'
                    label='Years bridging tech & design'
                  />
                  <TwStatCard value='3' label='Companies in the ecosystem' />
                  <TwStatCard value='8' label='Accessible theme modes' />
                </div>

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

                <div className={styles.viewAll}>
                  <Link href='/about'>Learn more About Me &#8594;</Link>
                </div>
              </TwReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 02 Work ===== */}
      <section
        id='work'
        className={`tw-snap ${styles.section} ${styles.sectionAlt} ${styles.glowWork}`}
      >
        <div className={styles.container}>
          <div className={styles.railGrid}>
            <div className={styles.rail}>
              <div className={styles.numRow}>
                <span className={styles.secNum}>02</span>
                <span className={styles.secLabel}>Work</span>
              </div>
              <TwReveal variant='left'>
                <div className={styles.railImage}>
                  <TwParallax strength={30}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className='tw-media'
                      src='/assets/images/Portfolio1280x1815.jpg'
                      alt='Work across the Fluxline ecosystem'
                    />
                  </TwParallax>
                </div>
              </TwReveal>
            </div>

            <div>
              <TwReveal>
                <TwSectionHeading
                  kicker='My Work'
                  title='Design, architecture, and coaching'
                  lede='I deliver this work through Fluxline Resonance Group — a modular systems practice for founders, creators, and teams building with clarity and resonance. More info is found on my business site Fluxline.pro, but here are a few highlights.'
                />
              </TwReveal>

              <button
                type='button'
                className={styles.featuredButton}
                onClick={openFluxlineServices}
                aria-label='Open Fluxline Resonance Group services'
              >
                <TwFeaturedCard
                  title='Fluxline Resonance Group'
                  category='Company'
                  excerpt='The modular systems company I founded — IT consulting, brand identity, and personal transformation under one architecture.'
                />
              </button>

              <div className={styles.cardGrid2}>
                {homeServices.map((service, i) => (
                  <TwReveal key={service.slug} delay={i * 90}>
                    <button
                      type='button'
                      className={styles.cardButton}
                      onClick={() => setActiveService(service)}
                      aria-haspopup='dialog'
                    >
                      <TwArticleCard
                        title={service.title}
                        excerpt={service.excerpt}
                        category={service.category}
                      />
                    </button>
                  </TwReveal>
                ))}
              </div>

              <div className={styles.viewAll}>
                <a
                  href={serviceHref('')}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View all services on Fluxline.pro &#8599;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 03 Content ===== */}
      <section
        id='content'
        className={`tw-snap ${styles.section} ${styles.glowContent}`}
      >
        <div className={styles.container}>
          <div className={styles.railGrid}>
            <div className={styles.rail}>
              <div className={styles.numRow}>
                <span className={styles.secNum}>03</span>
                <span className={styles.secLabel}>Content</span>
              </div>
              <TwReveal variant='left'>
                <div className={styles.railImage}>
                  <TwParallax strength={30}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className='tw-media'
                      src='/assets/images/APlusLogo_11052025.png'
                      alt='Writing, video, and the podcast'
                    />
                  </TwParallax>
                </div>
              </TwReveal>
            </div>

            <div>
              <TwReveal>
                <TwSectionHeading
                  kicker='Content Hub'
                  title='Writing, video, and the podcast'
                  lede='Long-form thinking on resonance, architecture, and building a life that embodies it all.'
                />
              </TwReveal>

              <div className={styles.filterRow}>
                <TwFilterChips
                  options={CONTENT_FILTERS}
                  value={contentFilter}
                  onChange={setContentFilter}
                />
              </div>

              {mediaState === 'idle' || mediaState === 'loading' ? (
                <div className={styles.contentStatus}>
                  <Spinner size='large' label={`Loading ${contentFilter}`} />
                </div>
              ) : filteredContent.length === 0 ? (
                <div className={styles.contentStatus}>
                  <p>
                    Nothing to show here right now.{' '}
                    {mediaFallback.href ? (
                      <Link href={mediaFallback.href}>
                        {mediaFallback.label} &#8594;
                      </Link>
                    ) : null}
                  </p>
                </div>
              ) : (
                <div className={styles.cardGrid2}>
                  {filteredContent.slice(0, 6).map((item, i) => (
                    <TwReveal key={item.slug} delay={i * 90}>
                      <TwArticleCard
                        title={item.title}
                        excerpt={item.excerpt}
                        category={item.category}
                        date={item.date}
                        href={item.href}
                        external={item.external}
                        image={item.image}
                        imageAlt=''
                      />
                    </TwReveal>
                  ))}
                </div>
              )}

              <div className={styles.viewAll}>
                {mediaFallback.href && filteredContent.length > 0 ? (
                  <Link href={mediaFallback.href}>
                    {mediaFallback.label} &#8594;
                  </Link>
                ) : null}
                <Link href='/content-hub'>
                  Explore the full Content Hub &#8594;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 04 Portfolio ===== */}
      <section
        id='portfolio'
        className={`tw-snap ${styles.section} ${styles.sectionAlt} ${styles.glowPortfolio}`}
      >
        <div className={styles.container}>
          <div className={styles.railGrid}>
            <div className={styles.rail}>
              <div className={styles.numRow}>
                <span className={styles.secNum}>04</span>
                <span className={styles.secLabel}>Portfolio</span>
              </div>
              <TwReveal variant='left'>
                <div className={styles.railImage}>
                  <TwParallax strength={30}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className='tw-media'
                      src='/assets/images/the-morning-resonance.jpg'
                      alt='Selected work and case studies'
                    />
                  </TwParallax>
                </div>
              </TwReveal>
            </div>

            <div>
              <TwReveal>
                <TwSectionHeading
                  kicker='Portfolio'
                  title='Selected work & case studies'
                  lede='Enterprise platforms and brand systems, from concept through launch.'
                />
              </TwReveal>

              <div className={styles.cardGrid2}>
                {portfolio.slice(0, 4).map((item, i) => (
                  <TwReveal key={item.slug} delay={i * 90}>
                    <TwArticleCard
                      title={item.title}
                      excerpt={item.excerpt}
                      category={item.category}
                      date={item.date}
                      href={item.href}
                    />
                  </TwReveal>
                ))}
              </div>

              <div className={styles.viewAll}>
                <a
                  href='https://fluxline.pro/case-studies'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Case studies on Fluxline.pro &#8599;
                </a>
                <Link href='/portfolio'>View my full Portfolio &#8594;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact (newsletter CTA lives inside, above the form) ===== */}
      <section
        id='contact'
        className={`tw-snap ${styles.section} ${styles.sectionAlt}`}
      >
        <div className={styles.container}>
          <div
            id='newsletter'
            className={`tw-grain ${styles.band} ${styles.newsletterBand}`}
          >
            <div className={styles.bandGrid}>
              <div>
                <TwSectionHeading
                  kicker='Stay Connected'
                  title='Get new writing in your inbox'
                  lede='Occasional notes on resonance, systems, and the work in progress. No spam — unsubscribe anytime.'
                />
              </div>
              <div>
                <HomeNewsletterForm />
                <SocialRow
                  items={wideSocials}
                  size={24}
                  className={styles.newsletterSocials}
                />
              </div>
            </div>
          </div>

          <div className={styles.contactGrid}>
            <TwReveal stagger>
              <TwSectionHeading
                kicker='Contact'
                title="Let's build something that resonates"
              />
              <p className={styles.prose}>
                Whether it&apos;s a platform to architect, an identity to
                rebuild, or just a conversation about the work — I&apos;d
                genuinely love to hear from you.
              </p>
              <p className={styles.prose}>
                Tell me what you&apos;re working on. I read every message.
              </p>
              <div className={styles.contactCtaRow}>
                <TwButton href='https://tidycal.com/terencewaters'>
                  Book a consultation
                </TwButton>
              </div>
              <div className={styles.contactEmail}>
                terence@terencewaters.com
              </div>
              <SocialRow
                items={wideSocials}
                className={styles.contactSocials}
              />
            </TwReveal>

            <TwReveal>
              {/* The provider is scoped to the contact section rather than the
                  whole page so the reCAPTCHA script is not pulled in for
                  visitors who never scroll this far. */}
              <ReCaptchaProvider>
                <HomeContactForm />
              </ReCaptchaProvider>
            </TwReveal>
          </div>
        </div>
      </section>

      <div className={styles.watermark}>
        <p>
          &ldquo;Know who you are and what you stand for <br />— in line with
          your <u>true</u> and <u>chosen</u> identity.&rdquo;
        </p>
      </div>

      <Footer />

      <ServiceDrawer
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </div>
  );
}
