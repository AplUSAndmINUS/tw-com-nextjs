'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { PodcastEpisode } from '@/content/types';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { PodcastCard } from '@/components/PodcastCard';
import Link from 'next/link';
import { PODCAST_PLATFORMS } from '@/lib/spreaker';
import SpreakerLogo from '@/assets/svgs/SpreakerLogo';
import SpotifyLogo from '@/assets/svgs/SpotifyLogo';
import ApplePodcastsLogo from '@/assets/svgs/ApplePodcastsLogo';
import IHeartRadioLogo from '@/assets/svgs/IHeartRadioLogo';
import AmazonMusicLogo from '@/assets/svgs/AmazonMusicLogo';
import DeezerLogo from '@/assets/svgs/DeezerLogo';
import PodchaserLogo from '@/assets/svgs/PodchaserLogo';
import RSSLogo from '@/assets/svgs/RSSLogo';
import ResonantIdentityLogo from '@/assets/images/ResonantIdentity_logo.png';

interface TheResonantIdentityPageProps {
  episodes: PodcastEpisode[];
  feedAvailable: boolean;
}

interface PlatformIconLinkProps {
  href: string;
  label: string;
  Icon: React.ComponentType<{
    color?: string;
    style?: React.CSSProperties;
  }>;
  useBrandColors: boolean;
  brandColor?: string;
}

function PlatformIconLink({
  href,
  label,
  Icon,
  useBrandColors,
  brandColor,
}: PlatformIconLinkProps) {
  const { theme } = useAppTheme();
  const [hovered, setHovered] = React.useState(false);

  const hasBrandColor = Boolean(brandColor) && useBrandColors;
  const iconColor = hasBrandColor
    ? '#FFFFFF'
    : brandColor || theme.palette.themePrimary;

  return (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label={label}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className='flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200'
      style={{
        backgroundColor: hasBrandColor
          ? brandColor
          : theme.semanticColors.card.background,
        border: hasBrandColor
          ? 'none'
          : `2px solid ${theme.semanticColors.border.default}`,
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        boxShadow: hovered ? theme.effects.elevation8 : 'none',
      }}
    >
      <Icon color={iconColor} style={{ width: '28px', height: '28px' }} />
    </Link>
  );
}

export function TheResonantIdentityPageClient({
  episodes,
  feedAvailable,
}: TheResonantIdentityPageProps) {
  const { theme, themeMode } = useAppTheme();
  const rssEndpoint = '/api/podcasts/rss';

  // Brand colors only in light/dark mode; accessible modes use default secondary styling
  const useBrandColors = themeMode === 'light' || themeMode === 'dark';

  const mostRecentEpisode = episodes.length > 0 ? episodes[0] : null;

  return (
    <PageLayout
      featureImage={{
        src: ResonantIdentityLogo.src,
        alt: 'The Resonant Identity podcast logo',
        title: '',
      }}
    >
      <div className='max-w-5xl mx-auto px-4 py-12'>
        {/* Page Header */}
        <Hero
          title='The Resonant Identity'
          iconName='MicRegular'
          description='The Resonant Identity is a podcast blending identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity and intention. It is a living extension of the Resonance Core Framework where identity becomes practice and is formed through coherence.'
          backArrow={true}
          backArrowPath='/podcasts'
        >
          <div className='flex flex-col gap-6 mt-6'>
            {/* Platform Subscription Icons */}
            <div className='flex flex-wrap items-center gap-3'>
              <PlatformIconLink
                href={PODCAST_PLATFORMS.spreaker}
                label='Listen on Spreaker'
                Icon={SpreakerLogo}
                brandColor='#EE722E'
                useBrandColors={useBrandColors}
              />
              <PlatformIconLink
                href={PODCAST_PLATFORMS.spotify}
                label='Listen on Spotify'
                Icon={SpotifyLogo}
                brandColor='#1DB954'
                useBrandColors={useBrandColors}
              />
              <PlatformIconLink
                href={PODCAST_PLATFORMS.applePodcasts}
                label='Listen on Apple Podcasts'
                Icon={ApplePodcastsLogo}
                brandColor='#B150E2'
                useBrandColors={useBrandColors}
              />
              <PlatformIconLink
                href={PODCAST_PLATFORMS.iHeartRadio}
                label='Listen on iHeartRadio'
                Icon={IHeartRadioLogo}
                brandColor='#C6002B'
                useBrandColors={useBrandColors}
              />
              <PlatformIconLink
                href={PODCAST_PLATFORMS.amazonMusic}
                label='Listen on Amazon Music'
                Icon={AmazonMusicLogo}
                brandColor='#00A8E1'
                useBrandColors={useBrandColors}
              />
              <PlatformIconLink
                href={PODCAST_PLATFORMS.deezer}
                label='Listen on Deezer'
                Icon={DeezerLogo}
                brandColor='#A238FF'
                useBrandColors={useBrandColors}
              />
              <PlatformIconLink
                href={PODCAST_PLATFORMS.podchaser}
                label='Listen on Podchaser'
                Icon={PodchaserLogo}
                brandColor='#2EBFA5'
                useBrandColors={useBrandColors}
              />
              <PlatformIconLink
                href={rssEndpoint}
                label='Subscribe via RSS Feed'
                Icon={RSSLogo}
                useBrandColors={useBrandColors}
              />
            </div>

            {/* Featured Episode CTA */}
            {feedAvailable && mostRecentEpisode && (
              <div
                className='rounded-xl border p-6'
                style={{
                  backgroundColor: theme.semanticColors.card.background,
                  borderColor: theme.palette.themePrimary,
                  borderWidth: '2px',
                }}
              >
                <h3
                  className='text-lg font-semibold mb-2'
                  style={{ color: theme.palette.themePrimary }}
                >
                  Listen to the Most Recent Episode
                </h3>
                <p
                  className='text-base mb-4'
                  style={{ color: theme.semanticColors.text.secondary }}
                >
                  {mostRecentEpisode.title || 'Start listening now'}
                </p>
                <Link
                  href={`/podcasts/${mostRecentEpisode.slug}`}
                  className='inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors'
                  style={{
                    backgroundColor: theme.palette.themePrimary,
                    color: theme.palette.white,
                  }}
                >
                  <span className='mr-2'>▶</span>
                  Listen Now
                </Link>
              </div>
            )}
          </div>
        </Hero>

        {/* Callout to learn more about The Resonant Identity */}
        <div className='mt-12'>
          <div
            className='rounded-xl border p-6'
            style={{
              backgroundColor: theme.semanticColors.card.background,
              borderColor: theme.semanticColors.border.default,
            }}
          >
            <h3
              className='text-lg font-semibold mb-2'
              style={{ color: theme.semanticColors.text.primary }}
            >
              About The Resonant Identity Podcast
            </h3>
            <p
              className='text-base mb-4'
              style={{ color: theme.semanticColors.text.secondary }}
            >
              Learn more about the philosophy, community, and mission behind The
              Resonant Identity (TRI).
            </p>
            <Link
              href='/podcasts/theresonantid/about'
              className='inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold transition-colors'
              style={{
                borderColor: theme.semanticColors.border.default,
                color: theme.semanticColors.link.default,
              }}
            >
              About TRI
              <span className='ml-2'>→</span>
            </Link>
          </div>
        </div>

        {/* Episodes Section */}
        <div className='mt-16'>
          <h2
            className='text-2xl font-semibold mb-6'
            style={{ color: theme.semanticColors.text.primary }}
          >
            Episodes (Showing {episodes.length})
          </h2>

          {!feedAvailable && (
            <div
              className='text-center py-12'
              style={{ color: theme.semanticColors.text.secondary }}
            >
              <p>Episodes are loading or temporarily unavailable.</p>
            </div>
          )}

          {feedAvailable && episodes.length === 0 && (
            <div
              className='text-center py-12'
              style={{ color: theme.semanticColors.text.secondary }}
            >
              <p>No episodes available yet. Check back soon!</p>
            </div>
          )}

          {feedAvailable && episodes.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {episodes.map((episode) => (
                <PodcastCard
                  key={episode.slug}
                  episode={episode}
                  viewType='large'
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default TheResonantIdentityPageClient;
