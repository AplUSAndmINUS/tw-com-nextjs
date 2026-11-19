'use client';

import {
  TwButton,
  type TwButtonSize,
  type TwButtonVariant,
} from '@/components/dsm';
import { usePodcastPlayer } from '@/components/PodcastPlayer';
import type { PodcastEpisode } from '@/content/types';
import styles from './EpisodePlayButton.module.scss';

export interface EpisodePlayButtonProps {
  episode: PodcastEpisode;
  variant?: TwButtonVariant;
  size?: TwButtonSize;
  /** Visible label when the episode is not playing. Default "Play episode". */
  label?: string;
}

/**
 * Plays an episode in the site's shared player, so it keeps going in the
 * mini-player while the visitor moves around the site. Pressing it again on
 * the episode that is loaded pauses or resumes it. Renders nothing for an
 * episode with no audio (the placeholder shown when the feed is down).
 */
export function EpisodePlayButton({
  episode,
  variant = 'outline',
  size = 'sm',
  label = 'Play episode',
}: EpisodePlayButtonProps) {
  const {
    episode: current,
    isPlaying,
    hasStarted,
    play,
    toggle,
  } = usePodcastPlayer();

  if (!episode.audioUrl) return null;

  const isLoaded = current?.slug === episode.slug;
  const playing = isLoaded && isPlaying;
  const text = playing ? 'Pause' : isLoaded && hasStarted ? 'Resume' : label;

  return (
    <TwButton
      variant={variant}
      size={size}
      onClick={() => (isLoaded ? toggle() : play(episode))}
      aria-label={`${text}: ${episode.title}`}
    >
      <svg
        className={styles.glyph}
        viewBox='0 0 24 24'
        width='16'
        height='16'
        fill='currentColor'
        aria-hidden='true'
        focusable='false'
      >
        {playing ? (
          <path d='M6 5h4v14H6zM14 5h4v14h-4z' />
        ) : (
          <path d='M8 5v14l11-7z' />
        )}
      </svg>
      {text}
    </TwButton>
  );
}

export default EpisodePlayButton;
