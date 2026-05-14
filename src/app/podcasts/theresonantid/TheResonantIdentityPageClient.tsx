'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { PodcastEpisode } from '@/content/types';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { PodcastCard } from '@/components/PodcastCard';
import { PodcastEpisodeModal } from '@/components/PodcastCard/PodcastEpisodeModal';
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
import { Typography } from '@/components/Typography';
import { ThemedLink } from '@/components/ThemedLink/ThemedLink';

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
          : theme.semanticColors.background.base,
        border: hasBrandColor
          ? 'none'
          : `2px solid ${theme.semanticColors.border.default}`,
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        boxShadow: hovered ? theme.shadows.card : 'none',
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
  const [selectedEpisode, setSelectedEpisode] =
    React.useState<PodcastEpisode | null>(null);

  // Brand colors only in light/dark mode; accessible modes use default secondary styling
  const useBrandColors = themeMode === 'light' || themeMode === 'dark';

  const mostRecentEpisode = episodes.length > 0 ? episodes[0] : null;

  const handleEpisodeClick = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
  };

  const handleCloseModal = () => {
    setSelectedEpisode(null);
  };

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
          title='The Resonant Identity Podcast'
          iconName='MicRegular'
          description='The Resonant Identity is a podcast blending identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity and intention. It is a living extension of the Resonance Core Framework where identity becomes practice and is formed through coherence.'
          backArrow={true}
          backArrowPath='/podcasts'
        >
          <div className='flex flex-col gap-6 mt-6'>
            {/* Platform Subscription Icons */}
            <div>
              <Typography
                variant='h3'
                className='text-base font-semibold mb-3'
                style={{ color: theme.semanticColors.text.primary }}
              >
                Subscribe on Your Favorite Platform
              </Typography>
              <div className='flex flex-wrap items-center gap-4'>
                <PlatformIconLink
                  href={PODCAST_PLATFORMS.spreaker}
                  label='Listen on Spreaker'
                  Icon={SpreakerLogo}
                  useBrandColors={useBrandColors}
                  brandColor='#EE722E'
                />
                <PlatformIconLink
                  href={PODCAST_PLATFORMS.spotify}
                  label='Listen on Spotify'
                  Icon={SpotifyLogo}
                  useBrandColors={useBrandColors}
                  brandColor='#1DB954'
                />
                <PlatformIconLink
                  href={PODCAST_PLATFORMS.applePodcasts}
                  label='Listen on Apple Podcasts'
                  Icon={ApplePodcastsLogo}
                  useBrandColors={useBrandColors}
                  brandColor='#B150E2'
                />
                <PlatformIconLink
                  href={PODCAST_PLATFORMS.iHeartRadio}
                  label='Listen on iHeartRadio'
                  Icon={IHeartRadioLogo}
                  useBrandColors={useBrandColors}
                  brandColor='#C6002B'
                />
                <PlatformIconLink
                  href={PODCAST_PLATFORMS.amazonMusic}
                  label='Listen on Amazon Music'
                  Icon={AmazonMusicLogo}
                  useBrandColors={useBrandColors}
                  brandColor='#00A8E1'
                />
                <PlatformIconLink
                  href={PODCAST_PLATFORMS.deezer}
                  label='Listen on Deezer'
                  Icon={DeezerLogo}
                  useBrandColors={useBrandColors}
                  brandColor='#A238FF'
                />
                <PlatformIconLink
                  href={PODCAST_PLATFORMS.podchaser}
                  label='Listen on Podchaser'
                  Icon={PodchaserLogo}
                  useBrandColors={useBrandColors}
                  brandColor='#2EBFA5'
                />
                <PlatformIconLink
                  href={rssEndpoint}
                  label='Subscribe via RSS'
                  Icon={RSSLogo}
                  useBrandColors={false}
                />
              </div>
            </div>

            {/* Most Recent Episode CTA */}
            {mostRecentEpisode && (
              <div
                className='rounded-lg border p-6'
                style={{
                  borderColor: theme.palette.themePrimary,
                  backgroundColor: theme.semanticColors.background.elevated,
                }}
              >
                <Typography
                  variant='h3'
                  className='text-lg font-semibold mb-2'
                  style={{ color: theme.semanticColors.text.primary }}
                >
                  Listen to Most Recent Episode
                </Typography>
                <Typography
                  variant='body'
                  className='mb-3'
                  style={{ color: theme.semanticColors.text.muted }}
                >
                  {mostRecentEpisode.title}
                </Typography>
                <button
                  onClick={() => handleEpisodeClick(mostRecentEpisode)}
                  className='inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors'
                  style={{
                    backgroundColor: theme.palette.themePrimary,
                    color: theme.palette.white,
                  }}
                >
                  Play Now
                  <span className='ml-2'>→</span>
                </button>
              </div>
            )}
          </div>
        </Hero>

        {/* About TRI CTA */}
        <div
          className='rounded-lg border mt-12 p-6'
          style={{
            borderColor: theme.semanticColors.border.default,
            backgroundColor: theme.semanticColors.background.base,
          }}
        >
          <Typography
            variant='h3'
            className='text-lg font-semibold mb-2'
            style={{ color: theme.semanticColors.text.primary }}
          >
            About The Resonant Identity Podcast
          </Typography>
          <Typography
            variant='body'
            className='text-base mb-4'
            style={{ color: theme.semanticColors.text.muted }}
          >
            Learn more about the philosophy, community, and mission behind The
            Resonant Identity (TRI).
          </Typography>
          <ThemedLink
            variant='bodySmall'
            hoverScale={1.05}
            invertOnPress
            href='/podcasts/theresonantid/about'
            className='inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold transition-colors'
            style={{
              borderColor: theme.semanticColors.border.emphasis,
              color: theme.semanticColors.link.default,
            }}
          >
            About TRI
            <span className='ml-2'>→</span>
          </ThemedLink>
        </div>

        {/* Episodes Section */}
        <div className='mt-16'>
          <Typography
            variant='h3'
            className='text-2xl font-semibold mb-6'
            style={{ color: theme.semanticColors.text.primary }}
          >
            Episodes ({episodes.length})
          </Typography>

          {!feedAvailable && (
            <div
              className='text-center py-12'
              style={{ color: theme.semanticColors.text.muted }}
            >
              <Typography variant='body'>
                Episodes are loading or temporarily unavailable.
              </Typography>
            </div>
          )}

          {feedAvailable && episodes.length === 0 && (
            <div
              className='text-center py-12'
              style={{ color: theme.semanticColors.text.muted }}
            >
              <Typography variant='body'>
                No episodes available yet. Check back soon!
              </Typography>
            </div>
          )}

          {feedAvailable && episodes.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {episodes.map((episode) => (
                <PodcastCard
                  key={episode.slug}
                  episode={episode}
                  viewType='large'
                  onClick={handleEpisodeClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Episode Modal */}
      {selectedEpisode && (
        <PodcastEpisodeModal
          isOpen={true}
          onDismiss={handleCloseModal}
          episode={selectedEpisode}
        />
      )}
    </PageLayout>
  );
}
