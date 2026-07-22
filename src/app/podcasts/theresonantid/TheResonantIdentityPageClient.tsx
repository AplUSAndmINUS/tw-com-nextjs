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
import { TRI_LINKS, TRI_YOUTUBE_CHANNEL_HANDLES } from './constants';
import { FluentIcon } from '@/components/FluentIcon/FluentIcon';
import { getApiBaseUrl } from '@/lib/environment';
import { YouTubeVideo, formatDuration } from '@/app/videos/types';
import { NativeLoadingImage } from '@/components/ui/LoadingImage';
import { ArrowRightIcon, VideoIcon, WindowNewIcon } from '@/components/icons';
import styles from './TheResonantIdentityPageClient.module.scss';

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
      className={styles.platformLink}
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

function TRIYouTubeVideos() {
  const { theme, reducedTransparency } = useAppTheme();
  const [videos, setVideos] = React.useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const apiUrl = getApiBaseUrl();
        const channelQuery = TRI_YOUTUBE_CHANNEL_HANDLES.join(',');
        const res = await fetch(
          `${apiUrl}/api/youtube?type=videos&channel=${encodeURIComponent(channelQuery)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setVideos((data.videos || []).slice(0, 6));
        }
      } catch {
        // Silently fail — YouTube section is supplemental
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || videos.length === 0) return null;

  return (
    <div
      className={styles.videosCard}
      style={{
        borderColor: theme.semanticColors.border.default,
        backgroundColor: theme.semanticColors.background.base,
      }}
    >
      <div className={styles.videosHead}>
        <Typography
          variant='h3'
          className={styles.videosTitle}
          style={{ color: theme.semanticColors.text.primary }}
        >
          Videos on YouTube
        </Typography>
        <ThemedLink
          variant='bodySmall'
          hoverScale={1.05}
          href={TRI_LINKS.youtube}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.viewAllLink}
          style={{ color: theme.semanticColors.link.default }}
        >
          View all
          <FluentIcon
            color={theme.semanticColors.link.default}
            iconName={WindowNewIcon}
            style={{ marginLeft: theme.spacing.s2 }}
          />
        </ThemedLink>
      </div>
      <div className={styles.videosGrid}>
        {videos.map((video) => {
          const duration = formatDuration(video.duration);
          return (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.videoTile}
              style={{
                borderColor: theme.semanticColors.border.default,
                backgroundColor: theme.semanticColors.background.elevated,
              }}
              aria-label={video.title}
            >
              <div className={styles.videoThumbWrap} style={{ paddingTop: '56.25%' }}>
                {video.thumbnailUrl ? (
                  <NativeLoadingImage
                    src={video.thumbnailUrl}
                    alt={video.title}
                    wrapperStyle={{ position: 'absolute', inset: 0 }}
                    className={styles.videoThumbImg}
                    loading='lazy'
                  />
                ) : (
                  <div
                    className={styles.videoThumbPlaceholder}
                    style={{
                      backgroundColor: theme.semanticColors.background.muted,
                    }}
                  >
                    <FluentIcon
                      iconName={VideoIcon}
                      style={{
                        fontSize: '2rem',
                        color: theme.semanticColors.text.muted,
                      }}
                    />
                  </div>
                )}
                {duration && (
                  <div
                    className={styles.videoDuration}
                    style={{
                      backgroundColor: reducedTransparency
                        ? 'rgba(0, 0, 0, 0.95)'
                        : 'rgba(0, 0, 0, 0.85)',
                    }}
                  >
                    {duration}
                  </div>
                )}
              </div>
              <div className={styles.videoBody}>
                <Typography
                  variant='body'
                  className={styles.videoTitle}
                  style={{ color: theme.semanticColors.text.primary }}
                >
                  {video.title}
                </Typography>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function TheResonantIdentityPageClient({
  episodes,
  feedAvailable,
}: TheResonantIdentityPageProps) {
  const { theme, themeMode } = useAppTheme();
  const rssEndpoint = '/api/podcasts/rss';
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = React.useState(false);
  const [selectedEpisode, setSelectedEpisode] =
    React.useState<PodcastEpisode | null>(null);
  const [isPlayNowHovered, setIsPlayNowHovered] = React.useState(false);
  const [isPlayNowPressed, setIsPlayNowPressed] = React.useState(false);

  // Brand colors only in light/dark mode; accessible modes use default secondary styling
  const useBrandColors = themeMode === 'light' || themeMode === 'dark';
  const playNowTypographyStyle = theme.typography.fonts.body;
  const playNowShouldUnderline = theme.themeMode === 'high-contrast';
  const playNowBaseBackgroundColor = theme.palette.themePrimary;
  const playNowBaseTextColor = theme.palette.white;
  const playNowBaseTransform = 'scale(1)';
  const playNowTransitionParts = [
    `color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
    `background-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
    `transform ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
  ];
  const playNowButtonStyles: React.CSSProperties = {
    ...playNowTypographyStyle,
    backgroundColor: isPlayNowPressed
      ? playNowBaseTextColor
      : playNowBaseBackgroundColor,
    color: isPlayNowPressed ? playNowBaseBackgroundColor : playNowBaseTextColor,
    cursor: 'pointer' as React.CSSProperties['cursor'],
    textDecoration: playNowShouldUnderline ? 'underline' : 'none',
    transform: isPlayNowHovered
      ? `${playNowBaseTransform} scale(1.05)`
      : playNowBaseTransform,
    transition: playNowTransitionParts.join(', '),
    border: 'none',
  };

  const mostRecentEpisode = episodes.length > 0 ? episodes[0] : null;

  const handleEpisodeClick = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
    setIsEpisodeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEpisodeModalOpen(false);
  };

  const handleModalExitComplete = () => {
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
      <div className={styles.page}>
        {/* Page Header */}
        <Hero
          title='The Resonant Identity Podcast'
          iconName='MicRegular'
          description='The Resonant Identity is a podcast blending identity architecture, self-improvement, and practical frameworks for navigating transitions with clarity and intention. It is a living extension of the Resonance Core Framework where identity becomes practice and is formed through coherence.'
          backArrow={true}
          backArrowPath='/podcasts'
        >
          <div className={styles.heroExtras}>
            {/* Platform Subscription Icons */}
            <div>
              <Typography
                variant='h3'
                className={styles.subscribeHeading}
                style={{ color: theme.semanticColors.text.primary }}
              >
                Subscribe on Your Favorite Platform
              </Typography>
              <div className={styles.platformIcons}>
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
                className={styles.recentEpisode}
                style={{
                  borderColor: theme.palette.themePrimary,
                  backgroundColor: theme.semanticColors.background.elevated,
                }}
              >
                <Typography
                  variant='h3'
                  className={styles.recentHeading}
                  style={{ color: theme.semanticColors.text.primary }}
                >
                  Listen to the Most Recent Episode
                </Typography>
                <Typography
                  variant='body'
                  style={{ color: theme.semanticColors.text.muted }}
                >
                  {mostRecentEpisode.title}
                </Typography>
                <Typography
                  variant='label'
                  className={styles.recentDate}
                  style={{
                    color: theme.semanticColors.text.muted,
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                  }}
                >
                  {mostRecentEpisode.publishedDate}
                </Typography>
                <br />
                <button
                  type='button'
                  onClick={() => handleEpisodeClick(mostRecentEpisode)}
                  className={styles.playNowBtn}
                  onPointerEnter={(
                    event: React.PointerEvent<HTMLButtonElement>
                  ) => {
                    if (event.pointerType === 'mouse') {
                      setIsPlayNowHovered(true);
                    }
                  }}
                  onPointerLeave={(
                    event: React.PointerEvent<HTMLButtonElement>
                  ) => {
                    if (event.pointerType === 'mouse') {
                      setIsPlayNowHovered(false);
                    }
                    setIsPlayNowPressed(false);
                  }}
                  onPointerDown={() => setIsPlayNowPressed(true)}
                  onPointerUp={() => setIsPlayNowPressed(false)}
                  onPointerCancel={() => setIsPlayNowPressed(false)}
                  style={playNowButtonStyles}
                >
                  Play Now
                  <FluentIcon
                    color={playNowBaseTextColor}
                    iconName={ArrowRightIcon}
                    style={{ marginLeft: '0.5rem' }}
                  />
                </button>
              </div>
            )}
          </div>
        </Hero>

        {/* About TRI CTA */}
        <div
          className={styles.aboutCard}
          style={{
            borderColor: theme.semanticColors.border.default,
            backgroundColor: theme.semanticColors.background.base,
          }}
        >
          <Typography
            variant='h3'
            className={styles.aboutHeading}
            style={{ color: theme.semanticColors.text.primary }}
          >
            About The Resonant Identity Podcast
          </Typography>
          <Typography
            variant='body'
            className={styles.aboutText}
            style={{ color: theme.semanticColors.text.muted }}
          >
            Learn more about the philosophy, community, and mission behind The
            Resonant Identity Podcast.
          </Typography>
          <ThemedLink
            variant='bodySmall'
            hoverScale={1.05}
            invertOnPress
            href={TRI_LINKS.about}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.aboutBtn}
            style={{
              borderColor: theme.semanticColors.border.emphasis,
              color: theme.semanticColors.link.default,
            }}
          >
            About The Resonant Identity
            <FluentIcon
              color={theme.semanticColors.link.default}
              iconName={WindowNewIcon}
              style={{
                marginLeft: theme.spacing.s1,
              }}
            />
          </ThemedLink>
        </div>

        {/* TRI YouTube Videos */}
        <TRIYouTubeVideos />

        {/* Episodes Section */}
        <div className={styles.episodesSection}>
          <Typography
            variant='h3'
            className={styles.episodesHeading}
            style={{ color: theme.semanticColors.text.primary }}
          >
            Episodes ({episodes.length})
          </Typography>

          {!feedAvailable && (
            <div
              className={styles.emptyState}
              style={{ color: theme.semanticColors.text.muted }}
            >
              <Typography variant='body'>
                Episodes are loading or temporarily unavailable.
              </Typography>
            </div>
          )}

          {feedAvailable && episodes.length === 0 && (
            <div
              className={styles.emptyState}
              style={{ color: theme.semanticColors.text.muted }}
            >
              <Typography variant='body'>
                No episodes available yet. Check back soon!
              </Typography>
            </div>
          )}

          {feedAvailable && episodes.length > 0 && (
            <div className={styles.episodesGrid}>
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
      <PodcastEpisodeModal
        isOpen={isEpisodeModalOpen}
        onDismiss={handleCloseModal}
        onExitComplete={handleModalExitComplete}
        episode={selectedEpisode}
      />
    </PageLayout>
  );
}
