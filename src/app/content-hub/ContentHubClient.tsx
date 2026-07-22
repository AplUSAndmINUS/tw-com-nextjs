'use client';

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

type Drawer = 'podcasts' | 'case-studies' | null;

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
    description: 'Open-source projects, experiments, and the code behind the work.',
    cta: 'Explore code',
    href: '/github',
    Icon: CodeIcon,
  },
  {
    key: 'videos',
    title: 'Videos',
    description: 'Talks, studio notes, and short films on building with intention.',
    cta: 'Watch videos',
    href: '/videos',
    Icon: VideoIcon,
  },
] as const;

const TRI_URL = 'https://theresonantidentity.com';
const FLUXLINE_CASE_STUDIES = 'https://fluxline.pro/case-studies';

/**
 * Content Hub — the launcher for everything TW.com publishes.
 *
 * Most entries navigate to their own page (Blog, Portfolio, GitHub, Videos).
 * Two are slide-over previews instead, matching the homepage's service drawers:
 *
 *   - Podcasts    — plays the most recent episode in the persistent mini-player
 *                   without leaving the site, or jumps to The Resonant Identity.
 *   - Case Studies — these live on Fluxline.pro (same content, not duplicated
 *                    here), so the drawer explains that and links out.
 */
export default function ContentHubClient({
  latestEpisode,
}: ContentHubClientProps) {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const { load, toggle } = usePodcastPlayer();

  const playLatest = () => {
    if (!latestEpisode) return;
    // One user gesture: load the episode into the shared player and start it.
    load(latestEpisode);
    toggle();
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

        {/* Case Studies — drawer trigger (content lives on Fluxline) */}
        <button
          type='button'
          className={`${styles.card} ${styles.cardButton}`}
          onClick={() => setDrawer('case-studies')}
          aria-haspopup='dialog'
        >
          <BookIcon size={40} className={styles.icon} />
          <span className={styles.cardTitle}>Case Studies</span>
          <span className={styles.cardBody}>
            In-depth project write-ups — hosted on Fluxline.pro.
          </span>
          <span className={styles.cardCta}>
            View on Fluxline <ArrowRightIcon size={16} />
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
          <button type='button' className={styles.primaryAction} onClick={playLatest}>
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
          rel='noopener noreferrer'
          className={styles.secondaryAction}
        >
          Visit The Resonant Identity &#8599;
        </a>
        <Link href='/podcasts' className={styles.tertiaryAction}>
          Browse all episodes on TW.com
        </Link>
      </TwDrawer>

      {/* ===== Case Studies drawer ===== */}
      <TwDrawer
        open={drawer === 'case-studies'}
        onClose={() => setDrawer(null)}
        title='Case Studies'
        chipLabel='Fluxline'
      >
        <p className={styles.drawerBody}>
          My in-depth project case studies live on Fluxline.pro, where the
          client work is documented in full. Rather than duplicate them here,
          I&apos;ll point you straight to the source.
        </p>
        <p className={styles.drawerBody}>
          You&apos;ll find the enterprise platforms, design systems, and
          transformation work — each written up with context, process, and
          outcomes.
        </p>
        <a
          href={FLUXLINE_CASE_STUDIES}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.primaryAction}
        >
          View case studies on Fluxline.pro &#8599;
        </a>
        <div className={styles.drawerButtonRow}>
          <TwButton variant='outline' href='/portfolio'>
            See the portfolio instead
          </TwButton>
        </div>
      </TwDrawer>
    </>
  );
}
