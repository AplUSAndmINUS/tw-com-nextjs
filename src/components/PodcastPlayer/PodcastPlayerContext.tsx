'use client';

/**
 * PodcastPlayerContext
 * Owns the single <audio> element used for all podcast playback on the site.
 *
 * The element is mounted once at the root, outside the page content, so it
 * survives client-side navigation and playback is never interrupted. The play
 * buttons on the podcast pages, the episode page's player and the persistent
 * mini-player all drive this one element rather than rendering <audio> tags
 * of their own — two elements would mean two episodes playing at once, or
 * playback restarting on navigation.
 *
 * Playback position deliberately lives outside this context: `timeupdate` fires
 * several times a second, and every consumer of this context would re-render
 * with it. Components that need the position use `useAudioProgress` instead.
 */

import React from 'react';
import { PodcastEpisode } from '@/content/types';

export interface PodcastPlayerContextValue {
  /** Episode loaded into the shared audio element, or null when nothing is loaded. */
  episode: PodcastEpisode | null;
  isPlaying: boolean;
  /** True once the loaded episode has actually begun playing. Gates the mini-player. */
  hasStarted: boolean;
  /**
   * True while an in-page player shows the loaded episode's controls (the
   * episode page's player); the mini-player stays hidden so there are never
   * two sets of controls on screen. (Named for the episode modal that used to
   * set it.)
   */
  isModalOpen: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  /**
   * Load an episode and start it in one user gesture. It waits for the new
   * source to reach the audio element before calling play(), so a cold start
   * never plays an element that has no source yet. On the episode that is
   * already loaded it resumes without reloading.
   */
  play: (episode: PodcastEpisode) => void;
  toggle: () => void;
  /** Stop playback and tear the player down. */
  close: () => void;
  /** Set by an in-page player while it owns the loaded episode. */
  setModalOpen: (open: boolean) => void;
}

const PodcastPlayerContext =
  React.createContext<PodcastPlayerContextValue | null>(null);

export const usePodcastPlayer = (): PodcastPlayerContextValue => {
  const context = React.useContext(PodcastPlayerContext);
  if (!context) {
    throw new Error(
      'usePodcastPlayer must be used within a PodcastPlayerProvider'
    );
  }
  return context;
};

/**
 * Subscribes to the shared audio element's playback position.
 * Only the components that render a progress bar should call this — it re-renders
 * on every `timeupdate`.
 */
export const useAudioProgress = () => {
  const { audioRef } = usePodcastPlayer();
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const sync = () => {
      setCurrentTime(audio.currentTime);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    sync();
    audio.addEventListener('timeupdate', sync);
    audio.addEventListener('loadedmetadata', sync);
    audio.addEventListener('emptied', sync);
    audio.addEventListener('seeked', sync);

    return () => {
      audio.removeEventListener('timeupdate', sync);
      audio.removeEventListener('loadedmetadata', sync);
      audio.removeEventListener('emptied', sync);
      audio.removeEventListener('seeked', sync);
    };
  }, [audioRef]);

  const seek = React.useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (audio) audio.currentTime = seconds;
      setCurrentTime(seconds);
    },
    [audioRef]
  );

  return { currentTime, duration, seek };
};

export const PodcastPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [episode, setEpisode] = React.useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);

  // Set by play() until the incoming episode's src lands, then consumed.
  const autoPlayRef = React.useRef(false);

  const play = React.useCallback(
    (next: PodcastEpisode) => {
      const audio = audioRef.current;
      if (!audio || !next.audioUrl) return;
      if (episode?.slug === next.slug) {
        void audio.play().catch(() => {});
        return;
      }
      // The audioUrl effect below starts playback once the new src lands.
      autoPlayRef.current = true;
      setEpisode(next);
      setHasStarted(false);
    },
    [episode?.slug]
  );

  const audioUrl = episode?.audioUrl;

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    if (autoPlayRef.current) {
      autoPlayRef.current = false;
      void audio.play().catch(() => {
        // Autoplay can be refused (e.g. no prior user gesture). The user can
        // still press play, so there is nothing to recover from here.
      });
    }
  }, [audioUrl]);

  const toggle = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const close = React.useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    autoPlayRef.current = false;
    setEpisode(null);
    setIsPlaying(false);
    setHasStarted(false);
    setModalOpen(false);
  }, []);

  const value = React.useMemo<PodcastPlayerContextValue>(
    () => ({
      episode,
      isPlaying,
      hasStarted,
      isModalOpen,
      audioRef,
      play,
      toggle,
      close,
      setModalOpen,
    }),
    [episode, isPlaying, hasStarted, isModalOpen, play, toggle, close]
  );

  return (
    <PodcastPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload='metadata'
        onPlay={() => {
          setIsPlaying(true);
          setHasStarted(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </PodcastPlayerContext.Provider>
  );
};

export default PodcastPlayerProvider;
