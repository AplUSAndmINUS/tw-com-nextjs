'use client';

import React, { useRef, useState } from 'react';

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
    <div className='w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-3'>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload='metadata'
      />

      <div className='flex items-center gap-4'>
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className='flex-shrink-0 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors shadow'
        >
          {playing ? '⏸' : '▶'}
        </button>

        {/* Track info */}
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium truncate'>{title}</p>
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs text-gray-500'>{formatTime(currentTime)}</span>
            <input
              type='range'
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              aria-label='Seek'
              className='flex-1 h-1 accent-purple-600'
            />
            <span className='text-xs text-gray-500'>{formatTime(duration)}</span>
          </div>
          {/* Progress bar visual */}
          <div className='h-0.5 mt-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden'>
            <div
              className='h-full bg-purple-600 transition-all'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
