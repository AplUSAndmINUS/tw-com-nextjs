'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useReducedMotion } from '@/hooks';
import { Hero } from '@/components/Hero';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Form/Button/Button';
import { FluentIcon } from '@/components/FluentIcon';
import { Typography } from '@/components/Typography';
import {
  Video24Regular,
  Play24Filled,
  ErrorCircle24Regular,
  LiveOff24Regular,
  List24Regular,
} from '@fluentui/react-icons';
import {
  YouTubeVideo,
  VideoType,
  VIDEO_TABS,
  formatDuration,
} from '@/app/videos/types';

/**
 * VideoCard Component
 * Displays a YouTube video as a clickable large-tile card
 */
function VideoCard({
  video,
  onClick,
}: {
  video: YouTubeVideo;
  onClick: () => void;
}) {
  const { theme } = useAppTheme();
  const [hovered, setHovered] = useState(false);
  const duration = formatDuration(video.duration);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className='cursor-pointer rounded-lg overflow-hidden border transition-all duration-200'
      style={{
        borderColor: hovered
          ? theme.palette.themePrimary
          : theme.semanticColors.border.default,
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? theme.shadows.l : theme.shadows.s,
        backgroundColor: theme.semanticColors.background.elevated,
      }}
    >
      {/* Thumbnail */}
      <div className='relative' style={{ paddingTop: '56.25%' }}>
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className='absolute top-0 left-0 w-full h-full object-cover'
          />
        ) : (
          <div
            className='absolute top-0 left-0 w-full h-full flex items-center justify-center'
            style={{
              backgroundColor: theme.semanticColors.background.muted,
            }}
          >
            <FluentIcon
              iconName={Video24Regular}
              style={{
                fontSize: '3rem',
                color: theme.semanticColors.text.muted,
              }}
            />
          </div>
        )}

        {/* Play overlay */}
        {hovered && (
          <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40'>
            <FluentIcon
              iconName={Play24Filled}
              style={{
                fontSize: '3rem',
                color: theme.palette.white,
              }}
            />
          </div>
        )}

        {/* Duration badge */}
        {duration && (
          <div
            className='absolute bottom-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded'
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          >
            {duration}
          </div>
        )}

        {/* YouTube badge */}
        <div
          className='absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide'
          style={{ backgroundColor: '#FF0000' }}
        >
          YouTube
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: theme.spacing.m }}>
        <Typography
          variant='h3'
          className='font-semibold line-clamp-2'
          style={{
            color: hovered
              ? theme.palette.themePrimary
              : theme.semanticColors.text.primary,
            fontSize: '1rem',
            marginBottom: theme.spacing.s2,
            transition: 'color 0.2s ease',
          }}
        >
          {video.title}
        </Typography>
      </div>
    </div>
  );
}

/**
 * VideoModal Component
 * Displays embedded YouTube player with video details
 */
function VideoModal({
  video,
  onDismiss,
}: {
  video: YouTubeVideo;
  onDismiss: () => void;
}) {
  const { theme } = useAppTheme();
  const embedUrl =
    video.type === 'playlist'
      ? `https://www.youtube.com/embed/videoseries?list=${video.id}`
      : `https://www.youtube.com/embed/${video.id}?autoplay=1`;
  const watchUrl =
    video.type === 'playlist'
      ? `https://www.youtube.com/playlist?list=${video.id}`
      : `https://www.youtube.com/watch?v=${video.id}`;

  const publishDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  return (
    <Modal
      isOpen={true}
      onDismiss={onDismiss}
      ariaLabel={video.title}
      maxWidth='900px'
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.m,
        }}
      >
        {/* Embedded player */}
        <div
          className='relative rounded-lg overflow-hidden'
          style={{ paddingTop: '56.25%' }}
        >
          <iframe
            src={embedUrl}
            title={video.title}
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='absolute top-0 left-0 w-full h-full'
          />
        </div>

        {/* Video details */}
        <Typography
          variant='h2'
          className='text-2xl font-bold'
          style={{
            color: theme.palette.themePrimary,
          }}
        >
          {video.title}
        </Typography>

        {publishDate && (
          <Typography
            variant='body'
            style={{
              color: theme.semanticColors.text.muted,
              fontSize: '0.9rem',
            }}
          >
            Published: {publishDate}
          </Typography>
        )}

        {video.description && (
          <Typography
            variant='body'
            className='line-clamp-4'
            style={{
              color: theme.semanticColors.text.primary,
              lineHeight: 1.6,
            }}
          >
            {video.description}
          </Typography>
        )}

        {/* View on YouTube button */}
        <div>
          <a
            href={watchUrl}
            target='_blank'
            rel='noopener noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <Button
              type='button'
              variant='primary'
              aria-label='View on YouTube'
            >
              View on YouTube
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}

/**
 * VideoListingClientWrapper Component
 * Main client component for the /videos page - fetches from YouTube API
 */
export function VideoListingClientWrapper() {
  const { theme } = useAppTheme();
  const { shouldReduceMotion } = useReducedMotion();
  const [activeTab, setActiveTab] = useState<VideoType>('videos');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/youtube?type=${activeTab}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        if (!cancelled) {
          setVideos(data.videos || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load videos at this time.');
          setVideos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return (
    <div className='pt-0 pb-8 md:py-8'>
      {/* Page Header */}
      <Hero
        title='Videos'
        iconName='Video24Regular'
        description='Watch videos from the @aplusinflux YouTube channel — tutorials, live streams, playlists, and more.'
      />

      {/* Tab Navigation */}
      <div
        className='flex gap-2 mt-8 mb-8'
        style={{
          borderBottom: `2px solid ${theme.semanticColors.border.default}`,
        }}
      >
        {VIDEO_TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className='flex items-center gap-2 px-4 py-2 border-0 bg-transparent cursor-pointer transition-all duration-200'
              style={{
                borderBottom: `3px solid ${isActive ? theme.palette.themePrimary : 'transparent'}`,
                color: isActive
                  ? theme.palette.themePrimary
                  : theme.semanticColors.text.muted,
                fontWeight: isActive ? 600 : 400,
                fontSize: '1rem',
                marginBottom: '-2px',
              }}
            >
              <FluentIcon
                iconName={
                  tab.key === 'videos'
                    ? Video24Regular
                    : tab.key === 'live'
                      ? LiveOff24Regular
                      : List24Regular
                }
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <div className='flex justify-center items-center min-h-[300px]'>
          <Typography
            variant='body'
            style={{ color: theme.semanticColors.text.muted }}
          >
            Loading videos…
          </Typography>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className='flex justify-center items-center min-h-[300px] flex-col gap-4'>
          <FluentIcon
            iconName={ErrorCircle24Regular}
            style={{
              fontSize: '3rem',
              color: theme.semanticColors.text.muted,
            }}
          />
          <Typography
            variant='body'
            style={{ color: theme.semanticColors.text.muted }}
          >
            {error}
          </Typography>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && videos.length === 0 && (
        <div className='flex justify-center items-center min-h-[300px] flex-col gap-4'>
          <FluentIcon
            iconName={Video24Regular}
            style={{
              fontSize: '3rem',
              color: theme.semanticColors.text.muted,
            }}
          />
          <Typography
            variant='body'
            style={{ color: theme.semanticColors.text.muted }}
          >
            No {activeTab} found.
          </Typography>
        </div>
      )}

      {/* Video Grid */}
      {!loading && !error && videos.length > 0 && (
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : index * 0.05,
                  duration: shouldReduceMotion ? 0 : 0.3,
                }}
              >
                <VideoCard
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onDismiss={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
