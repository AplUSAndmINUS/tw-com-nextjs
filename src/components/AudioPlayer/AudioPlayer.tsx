'use client';

import React, { useRef, useState } from 'react';
import styles from './AudioPlayer.module.scss';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

export function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      el.play();
    }
    setPlaying(!playing);
  }

  function handleTimeUpdate() {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }

  function handleEnded() {
    setPlaying(false);
    setCurrentTime(0);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }

  function formatTime(seconds: number): string {
    if (!isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.player}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload='metadata'
      />

      <div className={styles.row}>
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className={styles.playBtn}
        >
          {playing ? '⏸' : '▶'}
        </button>

        {/* Track info */}
        <div className={styles.info}>
          <p className={styles.trackTitle}>{title}</p>
          <div className={styles.seekRow}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <input
              type='range'
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              aria-label='Seek'
              className={styles.seek}
            />
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
          {/* Progress bar visual */}
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
