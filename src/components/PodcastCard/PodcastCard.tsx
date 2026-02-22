import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PodcastEpisode } from '@/content/types';

interface PodcastCardProps {
  episode: PodcastEpisode;
}

export function PodcastCard({ episode }: PodcastCardProps) {
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
              unoptimized
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
