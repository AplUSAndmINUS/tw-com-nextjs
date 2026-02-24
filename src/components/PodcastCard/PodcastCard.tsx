import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PodcastEpisode, ViewType } from '@/content/types';

interface PodcastCardProps {
  episode: PodcastEpisode;
  viewType?: ViewType;
}

export function PodcastCard({ episode, viewType = 'large' }: PodcastCardProps) {
  if (viewType === 'grid') {
    return (
      <Link href={`/podcasts/${episode.slug}`} className='group block'>
        <article className='border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col'>
          <div className='relative w-full aspect-square bg-gray-100 dark:bg-gray-800'>
            {episode.imageUrl ? (
              <Image
                src={episode.imageUrl}
                alt={episode.title}
                fill
                sizes='(max-width: 768px) 100vw, 33vw'
                className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600'>
                <span className='text-white text-5xl'>🎙</span>
              </div>
            )}
          </div>
          <div className='p-4 flex flex-col flex-1'>
            <div className='flex items-center gap-2 text-xs text-gray-400 mb-1'>
              {episode.season !== undefined && episode.episode !== undefined && (
                <span>S{episode.season}E{episode.episode}</span>
              )}
              {episode.category && (
                <span className='text-purple-600 dark:text-purple-400 font-medium'>{episode.category}</span>
              )}
            </div>
            <h2 className='font-semibold text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 flex-1'>
              {episode.title}
            </h2>
            {episode.description && (
              <p className='mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                {episode.description}
              </p>
            )}
            <div className='mt-2 flex items-center gap-2 text-xs text-gray-400'>
              {episode.publishedDate && (
                <time dateTime={episode.publishedDate}>{episode.publishedDate}</time>
              )}
              {episode.duration && <span>{episode.duration}</span>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (viewType === 'small') {
    return (
      <Link href={`/podcasts/${episode.slug}`} className='group block'>
        <article className='flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 py-3'>
          <div className='relative flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800'>
            {episode.imageUrl ? (
              <Image
                src={episode.imageUrl}
                alt={episode.title}
                fill
                sizes='40px'
                className='object-cover'
              />
            ) : (
              <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600'>
                <span className='text-white text-xs'>🎙</span>
              </div>
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-sm font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2'>
              {episode.title}
            </h3>
            <div className='flex items-center gap-2 mt-0.5 text-xs text-gray-400'>
              {episode.category && <span>{episode.category}</span>}
              {episode.publishedDate && (
                <time dateTime={episode.publishedDate}>{episode.publishedDate}</time>
              )}
              {episode.duration && <span>{episode.duration}</span>}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Default: large / list view
  return (
    <Link href={`/podcasts/${episode.slug}`} className='group block'>
      <article className='flex gap-4 border-b border-gray-200 dark:border-gray-700 py-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors rounded-lg px-2 -mx-2'>
        {/* Thumbnail */}
        <div className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800'>
          {episode.imageUrl ? (
            <Image
              src={episode.imageUrl}
              alt={episode.title}
              fill
              sizes='80px'
              className='object-cover'
            />
          ) : (
            <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600'>
              <span className='text-white text-2xl'>🎙</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 text-xs text-gray-400 mb-1'>
            {episode.season !== undefined && episode.episode !== undefined && (
              <span>S{episode.season}E{episode.episode}</span>
            )}
            {episode.category && (
              <span className='text-purple-600 dark:text-purple-400 font-medium'>{episode.category}</span>
            )}
            {episode.publishedDate && (
              <time dateTime={episode.publishedDate}>{episode.publishedDate}</time>
            )}
            {episode.duration && <span>{episode.duration}</span>}
          </div>
          <h2 className='font-semibold text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2'>
            {episode.title}
          </h2>
          {episode.description && (
            <p className='mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
              {episode.description}
            </p>
          )}
          {episode.tags && episode.tags.length > 0 && (
            <div className='mt-1.5 flex flex-wrap gap-1'>
              {episode.tags.slice(0, 3).map((tag) => (
                <span key={tag} className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5'>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
