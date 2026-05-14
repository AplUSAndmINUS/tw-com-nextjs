'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PodcastEpisode } from '@/content/types';
import { ViewType } from '@/store';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { LoadingImage } from '@/components/ui/LoadingImage';
import { Typography } from '../Typography';

interface PodcastCardProps {
  episode: PodcastEpisode;
  viewType?: ViewType;
  onClick?: (episode: PodcastEpisode) => void;
}

export function PodcastCard({
  episode,
  viewType = 'large',
  onClick,
}: PodcastCardProps) {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(episode);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  // Shared article content for grid view
  const gridArticleContent = (
    <article className='border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col'>
      <div className='relative w-full aspect-square bg-gray-100 dark:bg-gray-800'>
        {episode.imageUrl ? (
          <LoadingImage
            src={episode.imageUrl}
            alt={episode.title}
            fill
            sizes='(max-width: 768px) 100vw, 33vw'
            className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
            <Typography variant='caption' className='text-white text-5xl'>🎙</Typography>
          </div>
        )}
      </div>
      <div className='p-4 flex flex-col flex-1'>
        <div className='flex items-center gap-2 text-xs text-gray-400 mb-1'>
          {episode.season !== undefined && episode.episode !== undefined && (
            <Typography variant='caption' className='font-medium' style={{ color: theme.semanticColors.link.default }}>
              S{episode.season}E{episode.episode}
            </Typography>
          )}
          {episode.category && (
            <Typography
              variant='caption'
              className='font-medium'
              style={{ color: theme.semanticColors.link.default }}
            >
              {episode.category}
            </Typography>
          )}
        </div>
        <Typography
          variant='h3'
          className='font-semibold text-base transition-colors line-clamp-3 flex-1'
          style={{
            color: isHovered ? theme.semanticColors.link.default : undefined,
          }}
        >
          {episode.title}
        </Typography>
        {episode.description && (
          <Typography
            variant='body'
            className='mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2'
          >
            {episode.description}
          </Typography>
        )}
        <div className='mt-2 flex items-center gap-2 text-xs text-gray-400'>
          {episode.publishedDate && (
            <time dateTime={episode.publishedDate}>
              {episode.publishedDate}
            </time>
          )}
          {episode.duration && <span>{episode.duration}</span>}
        </div>
      </div>
    </article>
  );

  // Shared article content for small view
  const smallArticleContent = (
    <article className='flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 py-3'>
      <div className='relative flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800'>
        {episode.imageUrl ? (
          <LoadingImage
            src={episode.imageUrl}
            alt={episode.title}
            fill
            sizes='40px'
            className='object-cover'
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
            <Typography variant='caption' className='text-white text-xs'>🎙</Typography>
          </div>
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <Typography
          variant='bodySmall'
          className='text-sm font-semibold transition-colors line-clamp-2'
          style={{
            color: isHovered ? theme.semanticColors.link.default : undefined,
          }}
        >
          {episode.title}
        </Typography>
        <div className='flex items-center gap-2 mt-0.5 text-xs text-gray-400'>
          {episode.category && (
            <Typography variant='caption' className='font-medium' style={{ color: theme.semanticColors.link.default }}>
              {episode.category}
            </Typography>
          )}
          {episode.publishedDate && (
            <Typography variant='caption' className='font-medium' style={{ color: theme.semanticColors.link.default }}>
              <time dateTime={episode.publishedDate}>
                {episode.publishedDate}
              </time>
            </Typography>
          )}
          {episode.duration && (
            <Typography variant='caption' className='font-medium' style={{ color: theme.semanticColors.link.default }}>
              {episode.duration}
            </Typography>
          )}
        </div>
      </div>
    </article>
  );

  // Shared article content for large/list view
  const largeArticleContent = (
    <article className='flex gap-4 border-b border-gray-200 dark:border-gray-700 py-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors rounded-lg px-2 -mx-2'>
      {/* Thumbnail */}
      <div className='relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800'>
        {episode.imageUrl ? (
          <LoadingImage
            src={episode.imageUrl}
            alt={episode.title}
            fill
            sizes='80px'
            className='object-cover'
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700'>
            <Typography variant='caption' className='text-white text-2xl'>🎙</Typography>
          </div>
        )}
      </div>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 text-xs text-gray-400 mb-1'>
          {episode.season !== undefined && episode.episode !== undefined && (
            <Typography variant='label' style={{ color: theme.semanticColors.link.default }}>
              S{episode.season}E{episode.episode}
            </Typography>
          )}
          {episode.category && (
            <Typography variant='label' style={{ color: theme.semanticColors.link.default }}>
              {episode.category}
            </Typography>
          )}
          {episode.publishedDate && (
            <Typography variant='label' style={{ color: theme.semanticColors.link.default }}>
              <time dateTime={episode.publishedDate}>
                {episode.publishedDate}
              </time>
            </Typography>
          )}
          {episode.duration && (
            <Typography variant='label' style={{ color: theme.semanticColors.link.default }}>
              {episode.duration}
            </Typography>
          )}
        </div>
        <Typography variant='h5'
          className='font-semibold text-base transition-colors line-clamp-3'
          style={{
            color: isHovered ? theme.semanticColors.link.default : undefined,
          }}
        >
          {episode.title}
        </Typography>
        {episode.description && (
          <Typography variant='caption' className='mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
            {episode.description}
          </Typography>
        )}
        {episode.tags && episode.tags.length > 0 && (
          <div className='mt-1.5 flex flex-wrap gap-1'>
            {episode.tags.slice(0, 3).map((tag) => (
              <Typography
                key={tag}
                variant='caption'
                className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5'
              >
                {tag}
              </Typography>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  if (viewType === 'grid') {
    if (onClick) {
      return (
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role='button'
          tabIndex={0}
          className='group block cursor-pointer'
          onPointerEnter={(e: React.PointerEvent) => {
            if (e.pointerType === 'mouse') setIsHovered(true);
          }}
          onPointerLeave={(e: React.PointerEvent) => {
            if (e.pointerType === 'mouse') setIsHovered(false);
          }}
        >
          {gridArticleContent}
        </div>
      );
    }

    return (
      <Link
        href={`/podcasts/${episode.slug}`}
        className='group block'
        onPointerEnter={(e: React.PointerEvent) => {
          if (e.pointerType === 'mouse') setIsHovered(true);
        }}
        onPointerLeave={(e: React.PointerEvent) => {
          if (e.pointerType === 'mouse') setIsHovered(false);
        }}
      >
        {gridArticleContent}
      </Link>
    );
  }

  if (viewType === 'small') {
    if (onClick) {
      return (
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role='button'
          tabIndex={0}
          className='group block cursor-pointer'
          onPointerEnter={(e: React.PointerEvent) => {
            if (e.pointerType === 'mouse') setIsHovered(true);
          }}
          onPointerLeave={(e: React.PointerEvent) => {
            if (e.pointerType === 'mouse') setIsHovered(false);
          }}
        >
          {smallArticleContent}
        </div>
      );
    }

    return (
      <Link
        href={`/podcasts/${episode.slug}`}
        className='group block'
        onPointerEnter={(e: React.PointerEvent) => {
          if (e.pointerType === 'mouse') setIsHovered(true);
        }}
        onPointerLeave={(e: React.PointerEvent) => {
          if (e.pointerType === 'mouse') setIsHovered(false);
        }}
      >
        {smallArticleContent}
      </Link>
    );
  }

  // Default: large / list view
  if (onClick) {
    return (
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role='button'
        tabIndex={0}
        className='group block cursor-pointer'
        onPointerEnter={(e: React.PointerEvent) => {
          if (e.pointerType === 'mouse') setIsHovered(true);
        }}
        onPointerLeave={(e: React.PointerEvent) => {
          if (e.pointerType === 'mouse') setIsHovered(false);
        }}
      >
        {largeArticleContent}
      </div>
    );
  }

  return (
    <Link
      href={`/podcasts/${episode.slug}`}
      className='group block'
      onPointerEnter={(e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') setIsHovered(true);
      }}
      onPointerLeave={(e: React.PointerEvent) => {
        if (e.pointerType === 'mouse') setIsHovered(false);
      }}
    >
      {largeArticleContent}
    </Link>
  );
}
