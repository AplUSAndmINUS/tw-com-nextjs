'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getApiBaseUrl } from '@/lib/environment';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorCircleIcon, VideoIcon } from '@/components/icons';
import {
  VIDEO_TABS,
  formatDuration,
  type VideoType,
  type YouTubeVideo,
} from './types';
import { formatDotDate } from '@/app/home/contentFormat';
import styles from './VideosClient.module.scss';

type LoadState = 'loading' | 'error' | 'ready';

/**
 * Videos — runtime-fetched list on the design system.
 *
 * Unlike Blog/Portfolio, the video list can't be read at build time (the site
 * is a static export and the feed is an Azure Function), so this fetches from
 * `/api/youtube?type=…` on the client and re-fetches when the tab changes.
 *
 * Selecting a video opens a centered modal with the YouTube embed rather than
 * navigating away — matching the previous behaviour, restyled with tokens.
 */
export default function VideosClient() {
  const [tab, setTab] = useState<VideoType>('videos');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [active, setActive] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState('loading');

    (async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/youtube?type=${tab}`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        if (cancelled) return;
        setVideos(Array.isArray(data.videos) ? data.videos : []);
        setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab]);

  return (
    <>
      <div className={styles.tabs} role='tablist' aria-label='Video type'>
        {VIDEO_TABS.map((t) => (
          <button
            key={t.key}
            type='button'
            role='tab'
            aria-selected={tab === t.key}
            className={[styles.tab, tab === t.key ? styles.tabActive : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {state === 'loading' ? (
        <div className={styles.status}>
          <Spinner size='large' label='Loading videos' />
        </div>
      ) : state === 'error' ? (
        <div className={styles.status}>
          <ErrorCircleIcon size={40} className={styles.statusIcon} />
          <p>Unable to load videos at this time.</p>
        </div>
      ) : videos.length === 0 ? (
        <div className={styles.status}>
          <VideoIcon size={40} className={styles.statusIcon} />
          <p>No {tab} found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {videos.map((video, i) => (
            <VideoTile
              key={video.id}
              video={video}
              index={i}
              onOpen={() => setActive(video)}
            />
          ))}
        </div>
      )}

      {active ? (
        <VideoModal video={active} onClose={() => setActive(null)} />
      ) : null}
    </>
  );
}

function VideoTile({
  video,
  index,
  onOpen,
}: {
  video: YouTubeVideo;
  index: number;
  onOpen: () => void;
}) {
  const duration = formatDuration(video.duration);
  return (
    <button
      type='button'
      className={styles.tile}
      style={{ '--tw-reveal-delay': `${Math.min(index * 60, 360)}ms` } as React.CSSProperties}
      onClick={onOpen}
      aria-haspopup='dialog'
    >
      <span className={styles.thumb}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`tw-media ${styles.thumbImg}`}
          src={video.thumbnailUrl}
          alt=''
          loading='lazy'
          decoding='async'
        />
        <span className={styles.play} aria-hidden='true'>
          <svg width='22' height='22' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M8 5v14l11-7z' />
          </svg>
        </span>
        {duration ? <span className={styles.duration}>{duration}</span> : null}
      </span>
      <span className={styles.tileTitle}>{video.title}</span>
      {video.publishedAt ? (
        <span className={styles.tileMeta}>{formatDotDate(video.publishedAt)}</span>
      ) : null}
    </button>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: YouTubeVideo;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const embed =
    video.type === 'playlist'
      ? `https://www.youtube.com/embed/videoseries?list=${video.id}`
      : `https://www.youtube.com/embed/${video.id}?rel=0`;

  return (
    <div className={styles.scrim} onClick={onClose}>
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-label={video.title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHead}>
          <span className={styles.modalTitle}>{video.title}</span>
          <button
            ref={closeRef}
            type='button'
            className={styles.modalClose}
            onClick={onClose}
            aria-label='Close'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              aria-hidden='true'
            >
              <line x1='5' y1='5' x2='19' y2='19' />
              <line x1='19' y1='5' x2='5' y2='19' />
            </svg>
          </button>
        </div>
        <div className={styles.frame}>
          <iframe
            src={embed}
            title={video.title}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
