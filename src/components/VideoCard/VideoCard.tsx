import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VideoItem, ViewType } from '@/content/types';

interface VideoCardProps {
  video: VideoItem;
  viewType?: ViewType;
}

export function VideoCard({ video, viewType = 'grid' }: VideoCardProps) {
  const href = video.youtubeId
    ? `/videos/${video.youtubeId}`
    : `/videos/${video.id}`;

  if (viewType === 'small') {
    return (
      <Link href={href} className='group block'>
        <article className='flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 py-3'>
          <div className='relative flex-shrink-0 w-16 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800'>
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                sizes='64px'
                className='object-cover'
                unoptimized
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
                <span className='text-xs'>▶</span>
              </div>
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-sm font-semibold group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2'>
              {video.title}
            </h3>
            <div className='flex items-center gap-2 mt-0.5 text-xs text-gray-400'>
              {video.category && <span>{video.category}</span>}
              {video.publishedAt && (
                <time dateTime={video.publishedAt}>{video.publishedAt}</time>
              )}
              {video.duration && <span>{video.duration}</span>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (viewType === 'large') {
    return (
      <Link href={href} className='group block'>
        <article className='border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow'>
          <div className='relative w-full aspect-[16/10] bg-gray-100 dark:bg-gray-800'>
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
                unoptimized
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-5xl'>▶</span>
              </div>
            )}
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
              <span className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg'>
                ▶
              </span>
            </div>
            {video.duration && (
              <span className='absolute bottom-2 right-2 text-xs text-white bg-black/70 rounded px-1.5 py-0.5'>
                {video.duration}
              </span>
            )}
          </div>
          <div className='p-6'>
            {video.category && (
              <span className='text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide'>
                {video.category}
              </span>
            )}
            <h2 className='mt-1 text-2xl font-bold group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors'>
              {video.title}
            </h2>
            {video.description && (
              <p className='mt-2 text-gray-600 dark:text-gray-400 line-clamp-3'>
                {video.description}
              </p>
            )}
            <time className='block mt-3 text-xs text-gray-400' dateTime={video.publishedAt}>
              {video.publishedAt}
            </time>
          </div>
        </article>
      </Link>
    );
  }

  // Default: grid view
  return (
    <Link href={href} className='group block'>
      <article className='border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow'>
        <div className='relative w-full aspect-video bg-gray-100 dark:bg-gray-800'>
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
              unoptimized
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-4xl'>▶</span>
            </div>
          )}
          {/* Play overlay */}
          <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
            <span className='w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg'>
              ▶
            </span>
          </div>
          {video.duration && (
            <span className='absolute bottom-2 right-2 text-xs text-white bg-black/70 rounded px-1.5 py-0.5'>
              {video.duration}
            </span>
          )}
        </div>
        <div className='p-4'>
          {video.category && (
            <span className='text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide'>
              {video.category}
            </span>
          )}
          <h2 className='mt-1 text-base font-semibold group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2'>
            {video.title}
          </h2>
          {video.description && (
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
              {video.description}
            </p>
          )}
          <time className='block mt-2 text-xs text-gray-400' dateTime={video.publishedAt}>
            {video.publishedAt}
          </time>
        </div>
      </article>
    </Link>
  );
}
