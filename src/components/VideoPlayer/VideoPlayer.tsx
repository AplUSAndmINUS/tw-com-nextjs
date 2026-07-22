'use client';

import React from 'react';
import styles from './VideoPlayer.module.scss';

/** YouTube video ID regex — 11 alphanumeric characters / hyphens / underscores */
const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

interface VideoPlayerProps {
  youtubeId?: string;
  videoUrl?: string;
  title: string;
}

export function VideoPlayer({ youtubeId, videoUrl, title }: VideoPlayerProps) {
  const safeYoutubeId = youtubeId && YOUTUBE_ID_RE.test(youtubeId) ? youtubeId : null;

  if (safeYoutubeId) {
    return (
      <div className={styles.frame}>
        <iframe
          src={`https://www.youtube.com/embed/${safeYoutubeId}?rel=0`}
          title={title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className={styles.media}
        />
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className={styles.frame}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={videoUrl}
          controls
          className={styles.media}
          title={title}
        />
      </div>
    );
  }

  return (
    <div className={styles.placeholder}>
      <p className={styles.placeholderText}>No video source available.</p>
    </div>
  );
}
