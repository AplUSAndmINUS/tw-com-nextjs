'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TwArticleCard,
  TwButton,
  TwCredo,
  TwFeaturedCard,
  TwHero,
  TwHook,
  TwParallax,
  TwReveal,
  TwSectionHeading,
  TwShiftTrack,
} from '@/components/dsm';
import { BookingTrigger } from '@/components/BookingFlow';
import { Footer } from '@/components/Footer';
import { SiteNav } from '@/components/SiteNav';
import { HomeContactForm } from './home/HomeContactForm';
import { ServiceDrawer } from './home/ServiceDrawer';
import { SocialRow } from './home/SocialRow';
import { HOME_CONTENT_CARDS } from './home/contentCards';
import {
  contactSocials,
  homeServices,
  serviceHref,
  type HomeService,
} from './home/homeData';
import { HOME } from '@/content/site/home';
import {
  ACCEPTING_LINE,
  CREDO,
  HUMAN_ELEMENT_GLOSS,
  QUOTES,
  VALUES,
} from '@/content/site/identity';
import { MICROCOPY } from '@/content/site/microcopy';
import { SHIFTS } from '@/content/site/shifts';
import { RCF_PATH, RCF_PREORDER_HREF, RCF_TRADEMARK } from '@/lib/rcf';
import styles from './HomePageClient.module.scss';

/** Minimal card shape the server hands down (content stripped for payload). */
export interface HomeCard {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  href: string;
  /** Preview image: a post's cover or an episode's art. */
  image?: string;
  imageAlt?: string;
}

export interface HomePageClientProps {
  /** The newest Content Hub items (writing and podcast), newest first. */
  content: HomeCard[];
}

/**
 * Typeset a sentence: "quoted terms" get curly quotes and stay on one line
 * ("self-action" would otherwise break at its hyphen). The words are unchanged.
 */
function Typeset({ text }: { text: string }) {
  const parts = text.split(/"([^"]+)"/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={styles.nowrap}>
            &ldquo;{part}&rdquo;
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

/**
 * The credo on two lines, a hard return after "Humans FIRST.", with each
 * closing period in glacier cyan (--tw-line, remapped by the a11y modes; owner,
 * 2026-11-18). The words are unchanged.
 */
function CredoLines() {
  const sentences = CREDO.split(/(?<=\.)\s+/);
  return (
    <>
      {sentences.map((sentence, i) => (
        <React.Fragment key={sentence}>
          {/* A space before the break, so it reads as two sentences. */}
          {i > 0 ? (
            <>
              {' '}
              <br />
            </>
          ) : null}
          {sentence.replace(/\.$/, '')}
          <span className={styles.period}>.</span>
        </React.Fragment>
      ))}
    </>
  );
}

/** The watermark line, with "true" and "chosen" underlined as before. */
function KnowWho() {
  const [lead, rest] = QUOTES.knowWho.split(' — ');
  const parts = rest.split(/(true|chosen)/);
  return (
    <>
      &ldquo;{lead} <br />—{' '}
      {parts.map((part, i) =>
        part === 'true' || part === 'chosen' ? <u key={i}>{part}</u> : part
      )}
      &rdquo;
    </>
  );
}

/**
 * Home page (rebuild, #285): the user copy's sections in the owner's order.
 *
 * Hero (scroll parallax, as on /about-me) → the book → the Shifts → Humans
 * FIRST → what I stand for → my work → the Content Hub → let's talk → the
 * watermark quote. Words come from src/content/site; the old "Hi! I'm
 * Terence" paragraphs now introduce the Shifts.
 *
 * A client component for the service drawer; the content cards are loaded at
 * build time by page.tsx.
 */
export default function HomePageClient({ content }: HomePageClientProps) {
  const [activeService, setActiveService] = useState<HomeService | null>(null);
  // The book title inside the "why" paragraph links to the book page.
  const [whyBefore, whyAfter] = HOME.hook.why.split(RCF_TRADEMARK);
  const cards = content.slice(0, HOME_CONTENT_CARDS);

  return (
    <div id='top' className={styles.page}>
      <SiteNav />

      <main id='main'>
        {/* ===== Hero: the photo stays pinned while the card rises over it ===== */}
        <TwHero
          id='hero'
          eyebrow={HOME.hero.eyebrow}
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
              who writes and talks about resonance, identity, and{' '}
              <strong>
                <em>building a life that embodies it all</em>
              </strong>
              .
            </>
          }
          quote='Clarity, identity, and systems that make your life and work feel like they finally fit.'
          primaryCta={{
            label: HOME.hero.preorder,
            href: RCF_PREORDER_HREF,
            variant: 'gold',
          }}
          secondaryCta={{ label: HOME.hero.readStory, href: '/about/' }}
          backgroundImage='/assets/images/hero-landscape.jpg'
          backgroundImagePortrait='/assets/images/hero-portrait.jpg'
          backgroundAlt=''
          tagline='Founder, Fluxline Resonance Group'
          location='Salt Lake City, Utah'
          focalPoint='center 30%'
          scrollReveal
        />

        {/* ===== The book ===== */}
        <section
          id='book'
          className={styles.hookSection}
          aria-labelledby='home-hook'
        >
          <div className={styles.container}>
            <div className={styles.hookGrid}>
              <TwReveal>
                <TwHook
                  headingId='home-hook'
                  kicker={HOME.hook.kicker}
                  statement={HOME.hook.heading}
                  size='lg'
                  // Curly quotes, but free to wrap: the whole line is quoted.
                  subtitle={HOME.hook.subtitle.replace(/"([^"]+)"/g, '“$1”')}
                >
                  <p className={styles.prose}>
                    <Typeset text={whyBefore} />
                    <Link href={RCF_PATH + '/'}>{RCF_TRADEMARK}</Link>
                    <Typeset text={whyAfter} />
                  </p>
                  <p className={styles.prose}>{HOME.hook.promise}</p>
                  <div className={styles.preorderCard}>
                    <p className={styles.preorderLabel}>
                      {HOME.hook.preorderLabel}
                    </p>
                    <h3 className={styles.preorderHeading}>
                      {HOME.hook.preorderHeading}
                    </h3>
                    <p className={styles.preorderBody}>
                      {HOME.hook.preorderBody}
                    </p>
                    <div className={styles.buttonRow}>
                      <TwButton variant='gold' href={RCF_PREORDER_HREF}>
                        {HOME.hero.preorder}
                      </TwButton>
                      <TwButton variant='outline' href={RCF_PATH + '/'}>
                        {HOME.hook.preview}{' '}
                        <span aria-hidden='true'>&#8594;</span>
                      </TwButton>
                    </div>
                  </div>
                </TwHook>
              </TwReveal>
              {/* The book itself, from tablet width up. */}
              <TwReveal variant='left' className={styles.hookCover}>
                <Link href={RCF_PATH + '/'} tabIndex={-1} aria-hidden='true'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src='/assets/images/RCF_logo.jpeg'
                    alt=''
                    loading='lazy'
                    decoding='async'
                    width={512}
                    height={512}
                  />
                </Link>
              </TwReveal>
            </div>
          </div>
        </section>

        {/* ===== The Shifts ===== */}
        <section
          id='shifts'
          className={styles.section}
          aria-labelledby='home-shifts'
        >
          <div className={styles.container}>
            <TwReveal>
              <div className={styles.sectionIntro}>
                <h2 id='home-shifts' className={styles.h2}>
                  {HOME.shifts.title}
                </h2>
                <p className={styles.lede}>{HOME.shifts.lede}</p>
                {HOME.shifts.story.map((paragraph) => (
                  <p key={paragraph} className={styles.prose}>
                    {paragraph}
                  </p>
                ))}
                <blockquote className={styles.pullQuote}>
                  {HOME.shifts.quote}
                </blockquote>
              </div>
            </TwReveal>
            <TwShiftTrack
              steps={SHIFTS.map((s) => ({
                id: s.id,
                number: s.number,
                title: s.title,
                short: s.short,
                roles: s.roles,
              }))}
              rolesLabel={HOME.shifts.rolesLabel}
              stackLabel={HOME.shifts.stackLabel}
            />
            <div className={styles.linkRow}>
              <Link href='/about/'>
                {HOME.shifts.more} <span aria-hidden='true'>&#8594;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Humans FIRST ===== */}
        <TwCredo
          id='humans-first'
          aria-label={CREDO}
          statement={<CredoLines />}
          animated
        >
          <p>{QUOTES.body}</p>
        </TwCredo>

        {/* ===== What I stand for ===== */}
        <section
          id='values'
          className={`${styles.section} ${styles.valuesSection}`}
          aria-labelledby='home-values'
        >
          <div className={styles.container}>
            <TwReveal>
              <h2 id='home-values' className={styles.h2}>
                {HOME.standFor.title}
              </h2>
              <p className={`${styles.humanElement} ${styles.afterHeading}`}>
                {HOME.standFor.humanElementLead} {HUMAN_ELEMENT_GLOSS}.
              </p>
            </TwReveal>
            <ul className={styles.values}>
              {VALUES.map((value, i) => (
                <TwReveal
                  as='li'
                  key={value.name}
                  delay={i * 90}
                  className={styles.value}
                >
                  <h3 className={styles.valueName}>{value.name}</h3>
                  <p className={styles.valueText}>&ldquo;{value.text}&rdquo;</p>
                </TwReveal>
              ))}
            </ul>
            <TwReveal>
              <p className={styles.accepting}>{ACCEPTING_LINE}</p>
              <div className={styles.linkRow}>
                <Link href='/about/'>
                  {HOME.standFor.more} <span aria-hidden='true'>&#8594;</span>
                </Link>
              </div>
            </TwReveal>
          </div>
        </section>

        {/* ===== 01 Work ===== */}
        <section
          id='work'
          className={`tw-snap ${styles.section} ${styles.sectionAlt} ${styles.glowWork}`}
        >
          <div className={styles.container}>
            <div className={styles.railGrid}>
              <div className={styles.rail}>
                <div className={styles.numRow}>
                  <span className={styles.secNum}>01</span>
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
                    lede='Through Fluxline Resonance Group, I help businesses, solopreneurs, and individuals get clear on who they are, then make informed decisions that fit. More info is on my business site, Fluxline.pro, but here are a few highlights.'
                  />
                </TwReveal>

                <button
                  type='button'
                  className={styles.featuredButton}
                  onClick={() =>
                    window.open(
                      'https://www.fluxline.pro/services/',
                      '_blank',
                      'noopener'
                    )
                  }
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
                    <TwReveal fill key={service.slug} delay={i * 90}>
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

        {/* ===== 02 Content Hub ===== */}
        <section
          id='content'
          className={`tw-snap ${styles.section} ${styles.glowContent}`}
        >
          <div className={styles.container}>
            <div className={styles.railGrid}>
              <div className={styles.rail}>
                <div className={styles.numRow}>
                  <span className={styles.secNum}>02</span>
                  <span className={styles.secLabel}>Content</span>
                </div>
              </div>

              <div>
                <TwReveal>
                  <TwSectionHeading
                    kicker='Content Hub'
                    title='Writing, video, and the podcast'
                    lede='Long-form thinking on resonance, architecture, and building a life that embodies it all.'
                  />
                </TwReveal>
              </div>
            </div>

            {/* Three cards across the full width (stacked on phones), so
                they never squeeze into the rail's text column. */}
            {cards.length === 0 ? (
              <p className={styles.prose}>{MICROCOPY.emptyState}</p>
            ) : (
              <div className={styles.hubGrid}>
                {cards.map((item, i) => (
                  <TwReveal fill key={item.slug} delay={i * 90}>
                    <TwArticleCard
                      title={item.title}
                      excerpt={item.excerpt}
                      category={item.category}
                      date={item.date}
                      href={item.href}
                      image={item.image}
                      imageAlt={item.imageAlt ?? ''}
                    />
                  </TwReveal>
                ))}
              </div>
            )}

            <div className={styles.hubCta}>
              <TwButton variant='outline' href='/content-hub/'>
                {HOME.contentHub.cta} <span aria-hidden='true'>&#8594;</span>
              </TwButton>
            </div>
          </div>
        </section>

        {/* ===== Let's talk =====
            Book a Conversation opens the full-screen booking dialog. The
            message form stays here until /contact/ is rebuilt: the nav's
            Contact link and the booking flow's "send me a message instead"
            both land on #contact. */}
        <section
          id='contact'
          className={`${styles.section} ${styles.sectionAlt}`}
          aria-labelledby='home-talk'
        >
          <div className={styles.container}>
            <div className={styles.talkGrid}>
              <TwReveal stagger>
                <h2 id='home-talk' className={styles.h2}>
                  {HOME.talk.title}
                </h2>
                <p className={styles.lede}>{MICROCOPY.readEveryMessage}</p>
                <div className={styles.buttonRow}>
                  <BookingTrigger />
                </div>
                <SocialRow items={contactSocials} className={styles.socials} />
              </TwReveal>

              <TwReveal>
                <HomeContactForm />
              </TwReveal>
            </div>
          </div>
        </section>

        <div className={styles.watermark}>
          <p>
            <KnowWho />
          </p>
        </div>
      </main>

      <Footer />

      <ServiceDrawer
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </div>
  );
}
