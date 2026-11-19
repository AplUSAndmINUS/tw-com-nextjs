'use client';

import { useEffect } from 'react';
import { PodcastScrubber, usePodcastPlayer } from '@/components/PodcastPlayer';
import type { PodcastEpisode } from '@/content/types';
import { TRI_LOGO_SRC, TRI_SHOW_NAME } from '../podcastFormat';
import { EpisodePlayButton } from './EpisodePlayButton';
import styles from './EpisodePlayer.module.scss';

export interface EpisodePlayerProps {
  episode: PodcastEpisode;
}

/**
 * The episode page's player: cover art, a play button, and (once this episode
 * is loaded) the seek bar. It drives the site's one shared <audio> element, so
 * playback carries on in the mini-player after the visitor leaves the page;
 * while this player has the episode, the mini-player stays hidden.
 */
export function EpisodePlayer({ episode }: EpisodePlayerProps) {
  const { episode: current, setModalOpen } = usePodcastPlayer();
  const isLoaded = current?.slug === episode.slug;

  // While this page's player has the episode, it is the player: keep the
  // mini-player hidden so there are never two sets of controls. Leaving the
  // page (or loading another episode) hands playback back to the mini-player.
  useEffect(() => {
    if (!isLoaded) return;
    setModalOpen(true);
    return () => setModalOpen(false);
  }, [isLoaded, setModalOpen]);

  return (
    <div className={styles.player}>
      {/* eslint-disable-next-line @next/next/no-img-element --
          output:'export' + images.unoptimized, so next/image adds nothing. */}
      <img
        className={`tw-media ${styles.art}`}
        src={episode.imageUrl ?? TRI_LOGO_SRC}
        alt=''
        width={112}
        height={112}
        loading='lazy'
        decoding='async'
      />
      <div className={styles.body}>
        <p className={styles.show}>{TRI_SHOW_NAME}</p>
        <div className={styles.controls}>
          <EpisodePlayButton episode={episode} variant='primary' size='md' />
        </div>
        {isLoaded ? (
          <div className={styles.scrubber}>
            <PodcastScrubber />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EpisodePlayer;
