'use client';

import React, { useState } from 'react';
import {
  TwHero,
  TwSectionHeading,
  TwStatCard,
  TwArticleCard,
  TwFeaturedCard,
  TwFilterChips,
  TwReveal,
  TwButton,
  TwSwitch,
} from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { HomeNav } from './home/HomeNav';
import { ServiceDrawer } from './home/ServiceDrawer';
import { SocialRow } from './home/SocialRow';
import {
  homeServices,
  serviceHref,
  aboutSocials,
  wideSocials,
  type HomeService,
} from './home/homeData';
import styles from './HomePageClient.module.scss';

/** Minimal card shape the server hands down (content stripped for payload). */
export interface HomeCard {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  href: string;
}

export interface HomePageClientProps {
  /** Recent Content Hub items (blog + related), newest first. */
  content: HomeCard[];
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
  portfolio,
}: HomePageClientProps) {
  const [contentFilter, setContentFilter] = useState<string | null>(null);
  const [activeService, setActiveService] = useState<HomeService | null>(null);

  // Newsletter + contact are representative local-state forms, matching the
  // prototype. Real submission wiring (newsletterStore, contact API) can be
  // connected later.
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [notify, setNotify] = useState(true);

  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cMsg, setCMsg] = useState('');
  const [sent, setSent] = useState(false);

  const filteredContent =
    contentFilter === null
      ? content
      : content.filter((c) => c.category === contentFilter);

  const openFluxlineServices = () =>
    window.open('https://fluxline.pro/services', '_blank', 'noopener');

  return (
    <div id='top' className={styles.page}>
      <HomeNav
        links={NAV_LINKS}
        sectionIds={['hero', 'about', 'work', 'content', 'portfolio', 'contact']}
      />

      <section id='hero' className='tw-snap'>
        <TwHero
          eyebrow="Hi there 👋 I'm"
          title='Terence Waters'
          body='I help people and organizations rebuild the parts of themselves they thought were permanent. Systems thinker, designer, and coach — writing about resonance, identity, and building a life that feels right.'
          primaryCta={{ label: 'Who am I?', href: '#about' }}
          secondaryCta={{ label: 'View portfolio', href: '#portfolio' }}
          backgroundImage='/assets/images/hero-landscape.jpg'
          backgroundImagePortrait='/assets/images/hero-portrait.jpg'
          tagline='Founder, Fluxline Resonance Group'
          location='Salt Lake City, Utah'
          focalPoint='center 30%'
        />
      </section>

      {/* ===== 01 About ===== */}
      <section id='about' className={`tw-snap ${styles.section} ${styles.glowAbout}`}>
        <div className={styles.container}>
          <div className={styles.railGrid}>
            <div className={styles.rail}>
              <div className={styles.numRow}>
                <span className={styles.secNum}>01</span>
                <span className={styles.secLabel}>About</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`tw-media ${styles.portrait}`}
                src='/assets/images/portrait-about.jpg'
                alt='Terence Waters'
              />
              <div className={styles.socialBlock}>
                <div className={styles.socialLabel}>Social Media</div>
                <SocialRow items={aboutSocials} />
              </div>
            </div>

            <div>
              <TwReveal>
                <TwSectionHeading
                  kicker='About'
                  title="Hi, I'm Terence"
                  subhead="Most people don't need more information. We need clarity, structure, and a way back to ourselves."
                />
                <p className={styles.prose}>
                  I&apos;m a systems architect by training, a designer by
                  instinct, and a coach by necessity. For 15+ years I&apos;ve
                  worked across IT architecture, full-stack development, brand
                  identity, and personal transformation — translating complexity
                  into clarity for founders and mission-driven teams.
                </p>
                <p className={styles.prose}>
                  Structure. Clarity. A way to understand who I was becoming and
                  why. That&apos;s the work — and it&apos;s why I build the way I
                  do.
                </p>
                <div className={styles.statGrid}>
                  <TwStatCard value='15+' label='Years bridging tech & design' />
                  <TwStatCard value='3' label='Companies in the ecosystem' />
                  <TwStatCard value='8' label='Accessible theme modes' />
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
              <div className={styles.railImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className='tw-media'
                  src='/assets/images/hero-landscape.jpg'
                  alt='Work across the Fluxline ecosystem'
                />
              </div>
            </div>

            <div>
              <TwReveal>
                <TwSectionHeading
                  kicker='My Work'
                  title='Design, architecture, and coaching'
                  lede='I deliver this work through Fluxline Resonance Group. Tap any service to explore it in depth on fluxline.pro — no need to repeat it here.'
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
                <a href={serviceHref('')} target='_blank' rel='noopener noreferrer'>
                  View all services &#8594;
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
              <div className={styles.railImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className='tw-media'
                  src='/assets/images/portrait-about.jpg'
                  alt='Writing, video, and the podcast'
                />
              </div>
            </div>

            <div>
              <TwReveal>
                <TwSectionHeading
                  kicker='Content Hub'
                  title='Writing, video, and the podcast'
                  lede='Long-form thinking on resonance, architecture, and building a life that feels right.'
                />
              </TwReveal>

              <div className={styles.filterRow}>
                <TwFilterChips
                  options={CONTENT_FILTERS}
                  value={contentFilter}
                  onChange={setContentFilter}
                />
              </div>

              <div className={styles.cardGrid2}>
                {filteredContent.slice(0, 6).map((item, i) => (
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
                <a href='/blog'>Explore the full Content Hub &#8594;</a>
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
              <div className={styles.railImage}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className='tw-media'
                  src='/assets/images/hero-landscape.jpg'
                  alt='Selected work and case studies'
                />
              </div>
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
                  Case studies &#8599;
                </a>
                <a href='/portfolio'>View the full Portfolio &#8594;</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section id='newsletter' className={`tw-snap ${styles.section}`}>
        <div className={styles.container}>
          <div className={`tw-grain ${styles.band}`}>
            <div className={styles.bandGrid}>
              <div>
                <TwSectionHeading
                  kicker='Stay Connected'
                  title='Get new writing in your inbox'
                  lede='Occasional notes on resonance, systems, and the work in progress. No spam — unsubscribe anytime.'
                />
              </div>
              <div>
                {subscribed ? (
                  <div className={styles.successNote}>
                    You&apos;re in. Thanks for subscribing — I&apos;ll be in
                    touch.
                  </div>
                ) : (
                  <>
                    <form
                      className={styles.inlineForm}
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (email.includes('@')) setSubscribed(true);
                      }}
                    >
                      <input
                        type='email'
                        className={styles.field}
                        placeholder='you@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label='Email address'
                        required
                      />
                      <TwButton type='submit'>Subscribe</TwButton>
                    </form>
                    <div className={styles.notifyRow}>
                      <TwSwitch
                        label='Email me when I publish new posts'
                        checked={notify}
                        onChange={setNotify}
                      />
                    </div>
                  </>
                )}
                <SocialRow
                  items={wideSocials}
                  size={24}
                  className={styles.newsletterSocials}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section
        id='contact'
        className={`tw-snap ${styles.section} ${styles.sectionAlt}`}
      >
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <TwReveal variant='left'>
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
              <SocialRow items={wideSocials} className={styles.contactSocials} />
            </TwReveal>

            <TwReveal>
              <div className={styles.formCard}>
                {sent ? (
                  <div className={styles.sentState}>
                    <div className={styles.sentTitle}>Message sent</div>
                    <p className={styles.sentBody}>
                      Thanks for reaching out — I&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form
                    className={styles.contactForm}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (cName && cEmail.includes('@') && cMsg) setSent(true);
                    }}
                  >
                    <label className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Name</span>
                      <input
                        className={styles.field}
                        placeholder='Your name'
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        required
                      />
                    </label>
                    <label className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Email</span>
                      <input
                        className={styles.field}
                        type='email'
                        placeholder='you@example.com'
                        value={cEmail}
                        onChange={(e) => setCEmail(e.target.value)}
                        required
                      />
                    </label>
                    <label className={styles.fieldGroup}>
                      <span className={styles.fieldLabel}>Message</span>
                      <textarea
                        className={styles.field}
                        rows={5}
                        placeholder='What are you working on?'
                        value={cMsg}
                        onChange={(e) => setCMsg(e.target.value)}
                        required
                      />
                    </label>
                    <div className={styles.contactFormActions}>
                      <TwButton type='submit'>Send message</TwButton>
                      <TwButton
                        variant='outline'
                        href='https://tidycal.com/terencewaters'
                      >
                        Book a consultation
                      </TwButton>
                    </div>
                  </form>
                )}
              </div>
            </TwReveal>
          </div>
        </div>
      </section>

      <div className={styles.watermark}>
        <p>
          &ldquo;Know who you are and what you stand for — in line with your true
          and chosen identity.&rdquo;
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
