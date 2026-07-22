'use client';

/**
 * PodcastEpisodeModal Component
 * Displays detailed podcast episode information in a modal
 */

import React from 'react';
import { Modal } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { LoadingImage } from '@/components/ui/LoadingImage';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { PodcastEpisode } from '@/content/types';
import {
  usePodcastPlayer,
  PlayPauseButton,
  PodcastScrubber,
} from '@/components/PodcastPlayer';

interface PodcastEpisodeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  episode: PodcastEpisode | null;
  onExitComplete?: () => void;
}

export const PodcastEpisodeModal: React.FC<PodcastEpisodeModalProps> = ({
  isOpen,
  onDismiss,
  episode,
  onExitComplete,
}) => {
  const { theme } = useAppTheme();
  const { load, setModalOpen } = usePodcastPlayer();

  // Hand the episode to the shared player and suppress the mini-player while
  // this modal is showing the same controls. Once it closes the mini-player
  // takes over, mid-episode, without a reload.
  React.useEffect(() => {
    if (!episode || !isOpen) return;
    load(episode);
    setModalOpen(true);
    return () => setModalOpen(false);
  }, [episode, isOpen, load, setModalOpen]);

  if (!episode) {
    return null;
  }

  const isDark =
    theme.themeMode === 'dark' ||
    theme.themeMode === 'high-contrast' ||
    theme.themeMode === 'grayscale-dark';

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      onExitComplete={onExitComplete}
      ariaLabel={`${episode.title} - Episode Details`}
      maxWidth='900px'
      showCloseButton={true}
    >
      {/* Header with episode image and info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: theme.spacing.l,
          flexWrap: 'wrap',
          padding: theme.spacing.xl,
        }}
      >
        {/* Episode Image */}
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
            width: '200px',
            height: '200px',
            borderRadius: theme.borderRadius.container.medium,
            overflow: 'hidden',
            backgroundColor: theme.palette.neutralLighter,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {episode.imageUrl ? (
            <LoadingImage
              src={episode.imageUrl}
              alt={episode.title}
              fill
              className='tw-media'
              style={{
                objectFit: 'cover',
              }}
              sizes='200px'
            />
          ) : (
            <span style={{ fontSize: '4rem' }}>🎙</span>
          )}
        </div>

        {/* Episode Info */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <Typography
            variant='h2'
            style={{
              color: theme.palette.neutralPrimary,
              marginBottom: theme.spacing.s1,
            }}
          >
            {episode.title}
          </Typography>

          {/* Metadata */}
          <div style={{ marginBottom: theme.spacing.m }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: theme.spacing.s2,
                color: theme.palette.neutralSecondary,
                fontSize: '0.875rem',
              }}
            >
              {episode.season !== undefined &&
                episode.episode !== undefined && (
                  <span>
                    Season {episode.season} • Episode {episode.episode}
                  </span>
                )}
              {episode.category && (
                <span
                  style={{
                    color: theme.palette.themeSecondary,
                    fontWeight: theme.typography.fontWeights.semiBold,
                  }}
                >
                  {episode.category}
                </span>
              )}
            </div>
            <div
              style={{
                marginTop: theme.spacing.s1,
                color: theme.palette.neutralSecondary,
                fontSize: '0.875rem',
              }}
            >
              {episode.publishedDate && <span>{episode.publishedDate}</span>}
              {episode.duration && <span> • {episode.duration}</span>}
            </div>
          </div>

          {/* Tags */}
          {episode.tags && episode.tags.length > 0 && (
            <div style={{ marginTop: theme.spacing.m }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: theme.spacing.s1,
                }}
              >
                {episode.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: `${theme.spacing.xs} ${theme.spacing.s1}`,
                      borderRadius: theme.borderRadius.container.tiny,
                      backgroundColor: theme.palette.neutralQuaternaryAlt,
                      color: theme.palette.neutralPrimary,
                      fontSize: '0.75rem',
                      fontWeight: theme.typography.fontWeights.semiBold,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Audio player — drives the shared <audio> element so playback carries
              over to the mini-player when this modal closes. */}
          {episode.audioUrl && (
            <div
              style={{
                marginTop: theme.spacing.l,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.s2,
                padding: theme.spacing.s2,
                backgroundColor: theme.palette.neutralLighterAlt,
                border: `1px solid ${theme.semanticColors.border.default}`,
                borderRadius: theme.borderRadius.container.small,
              }}
            >
              <PlayPauseButton size={48} />
              <PodcastScrubber />
            </div>
          )}
        </div>
      </div>

      {/* Description section */}
      {episode.description && (
        <div
          style={{
            backgroundColor: isDark
              ? theme.palette.neutralLighterAlt
              : theme.palette.neutralQuaternaryAlt,
            padding: `${theme.spacing.l} ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.xl}`,
          }}
        >
          <Typography
            variant='h4'
            style={{
              color: theme.palette.themePrimary,
              marginBottom: theme.spacing.s2,
            }}
          >
            About This Episode
          </Typography>
          <Typography
            variant='body'
            style={{
              color: theme.palette.neutralPrimary,
              lineHeight: theme.typography.lineHeights.relaxed,
            }}
          >
            {episode.description}
          </Typography>
        </div>
      )}
    </Modal>
  );
};

export default PodcastEpisodeModal;
