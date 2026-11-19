'use client';

import { NewTabHint } from '@/components/NewTabHint';
import React, { useState } from 'react';
import Link from 'next/link';
import { TwSectionHeading, TwChip, TwButton, TwDrawer } from '@/components/dsm';
import { usePodcastPlayer } from '@/components/PodcastPlayer';
import type { PodcastEpisode } from '@/content/types';
import { formatDuration, formatDotDate } from '@/app/home/contentFormat';
import {
  BookIcon,
  CodeIcon,
  DesignIdeasIcon,
  MicIcon,
  PenIcon,
  VideoIcon,
  ArrowRightIcon,
} from '@/components/icons';
import styles from './ContentHubClient.module.scss';
import { RCF_PREORDERS_OPEN, RCF_PREORDER_HREF } from '@/lib/rcf';

type Drawer = 'podcasts' | 'books' | null;

export interface ContentHubClientProps {
  /** Newest podcast episode, resolved at build time (may be null if offline). */
  latestEpisode: PodcastEpisode | null;
}

const NAV_CARDS = [
  {
    key: 'blog',
    title: 'Blog',
    description:
      'Long-form writing on resonance, identity architecture, and the work in progress.',
    cta: 'Read articles',
    href: '/blog',
    Icon: PenIcon,
  },
  {
    key: 'portfolio',
    title: 'Portfolio',
    description:
      'Selected product, platform, and brand work — from concept through launch.',
    cta: 'View work',
    href: '/portfolio',
    Icon: DesignIdeasIcon,
  },
  {
    key: 'github',
    title: 'GitHub',
    description:
      'Open-source projects, experiments, and the code behind the work.',
    cta: 'Explore code',
    href: '/github',
    Icon: CodeIcon,
  },
  {
    key: 'videos',
    title: 'Videos',
    description:
      'Talks, studio notes, and short films on building with intention.',
    cta: 'Watch videos',
    href: '/videos',
    Icon: VideoIcon,
  },
] as const;

const TRI_URL = 'https://theresonantidentity.com';
const FLUXLINE_BOOKS = 'https://www.fluxline.pro/books';

/**
 * Content Hub — the launcher for everything TW.com publishes.
 *
 * Most entries navigate to their own page (Blog, Portfolio, GitHub, Videos).
 * Two are slide-over previews instead, matching the homepage's service drawers:
 *
 *   - Podcasts    — plays the most recent episode in the persistent mini-player
 *                   without leaving the site, or jumps to The Resonant Identity.
 *   - Books       — coming soon, with a link to Fluxline.pro.
 *
 * Case studies are not part of this site (owner, 2026-11-19).
 */
export default function ContentHubClient({
  latestEpisode,
}: ContentHubClientProps) {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const { play } = usePodcastPlayer();

  const playLatest = () => {
    if (!latestEpisode) return;
    // One user gesture: load the episode into the shared player and start it
    // once its source is in place (load + toggle played an element that had
    // no source yet, so a cold start stayed paused).
    play(latestEpisode);
    setDrawer(null);
  };

  return (
    <>
      <div className={styles.grid}>
        {/* Podcasts — featured drawer trigger */}
        <button
          type='button'
          className={`${styles.card} ${styles.cardButton}`}
          onClick={() => setDrawer('podcasts')}
          aria-haspopup='dialog'
        >
          <span className={styles.badge}>
            <TwChip variant='featured' size='sm'>
              Featured
            </TwChip>
          </span>
          <MicIcon size={40} className={styles.icon} />
          <span className={styles.cardTitle}>Podcasts</span>
          <span className={styles.cardBody}>
            The Resonant Identity — conversations on rebuilding yourself with
            intention.
          </span>
          <span className={styles.cardCta}>
            Listen now <ArrowRightIcon size={16} />
          </span>
        </button>

        {/* Navigation cards */}
        {NAV_CARDS.map(({ key, title, description, cta, href, Icon }) => (
          <Link key={key} href={href} className={styles.card}>
            <Icon size={40} className={styles.icon} />
            <span className={styles.cardTitle}>{title}</span>
            <span className={styles.cardBody}>{description}</span>
            <span className={styles.cardCta}>
              {cta} <ArrowRightIcon size={16} />
            </span>
          </Link>
        ))}

        {/* Books — Coming Soon */}
        <button
          type='button'
          className={`${styles.card} ${styles.cardButton}`}
          onClick={() => setDrawer('books')}
          aria-haspopup='dialog'
        >
          <span className={styles.badge}>
            <TwChip variant='teal' size='sm'>
              Coming Soon
            </TwChip>
          </span>
          <BookIcon size={40} className={styles.icon} />
          <span className={styles.cardTitle}>Books</span>
          <span className={styles.cardBody}>
            The Resonance Core Framework™: a practical guide to rebuilding your
            internal systems with intention.
          </span>
          <span className={styles.cardCta}>
            Learn more <ArrowRightIcon size={16} />
          </span>
        </button>
      </div>

      {/* ===== Podcasts drawer ===== */}
      <TwDrawer
        open={drawer === 'podcasts'}
        onClose={() => setDrawer(null)}
        title='The Resonant Identity'
        chipLabel='Podcast'
      >
        <p className={styles.drawerBody}>
          A podcast about resonance, identity, and rebuilding your internal
          systems with intention. New episodes on the platforms you already use.
        </p>

        {latestEpisode ? (
          <div className={styles.episode}>
            <div className={styles.episodeLabel}>Most recent episode</div>
            <div className={styles.episodeTitle}>{latestEpisode.title}</div>
            {latestEpisode.publishedDate ? (
              <div className={styles.episodeMeta}>
                {formatDotDate(latestEpisode.publishedDate)}
                {latestEpisode.duration
                  ? ` · ${formatDuration(latestEpisode.duration)}`
                  : ''}
              </div>
            ) : null}
          </div>
        ) : (
          <p className={styles.drawerBody}>
            Episodes are loading — visit The Resonant Identity for the full
            catalogue.
          </p>
        )}

        {latestEpisode ? (
          <button
            type='button'
            className={styles.primaryAction}
            onClick={playLatest}
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M8 5v14l11-7z' />
            </svg>
            Listen to most recent episode
          </button>
        ) : null}

        <a
          href={TRI_URL}
          target='_blank'
          rel='noopener'
          className={styles.secondaryAction}
        >
          Visit The Resonant Identity &#8599;
        </a>
        <Link href='/podcasts' className={styles.tertiaryAction}>
          Browse all episodes on TW.com
        </Link>
      </TwDrawer>

      {/* ===== Books drawer ===== */}
      <TwDrawer
        open={drawer === 'books'}
        onClose={() => setDrawer(null)}
        title='The Resonance Core Framework™'
        chipLabel='Coming Soon'
      >
        <p className={styles.drawerBody}>
          A practical guide to rebuilding your internal systems with intention.
          The Resonance Core Framework™ is the foundational methodology behind
          everything I teach — distilled into a book.
        </p>
        <p className={styles.drawerBody}>
          {RCF_PREORDERS_OPEN ? (
            <>
              The full launch is coming soon on Fluxline.pro, and pre-orders for
              the digital editions are open on the{' '}
              <a href={RCF_PREORDER_HREF} target='_blank' rel='noopener'>
                Fluxline Store
                <NewTabHint />
              </a>
              .
            </>
          ) : (
            <>
              The full launch is coming soon on Fluxline.pro. Stay tuned for
              updates on availability and companion resources.
            </>
          )}
        </p>
        <a
          href={FLUXLINE_BOOKS}
          target='_blank'
          rel='noopener'
          className={styles.primaryAction}
        >
          Preview on Fluxline.pro &#8599;
        </a>
      </TwDrawer>
    </>
  );
}
