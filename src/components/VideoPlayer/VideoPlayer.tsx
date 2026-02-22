'use client';

import React from 'react';

interface VideoPlayerProps {
  youtubeId?: string;
  videoUrl?: string;
  title: string;
}

export function VideoPlayer({ youtubeId, videoUrl, title }: VideoPlayerProps) {
  if (youtubeId) {
    return (
      <div className='relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg'>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
          title={title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='absolute inset-0 w-full h-full'
        />
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className='relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg'>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={videoUrl}
          controls
          className='absolute inset-0 w-full h-full'
          title={title}
        />
      </div>
    );
  }

  return (
    <div className='w-full aspect-video rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
      <p className='text-gray-500'>No video source available.</p>
    </div>
  );
}
