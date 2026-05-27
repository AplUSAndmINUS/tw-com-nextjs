'use client';

import React from 'react';
import Link from 'next/link';
import { PodcastEpisode } from '@/content/types';
import { ViewType } from '@/store';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { LoadingImage } from '@/components/ui/LoadingImage';
import { Typography } from '../Typography';
import { useMouseMultiHoverState } from '@/hooks/useHoverState';
import { useIsMobile } from '@/hooks/useMediaQuery';

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
  const { isHovered, getHoverProps } = useMouseMultiHoverState();
  const isMobileHook = useIsMobile();
  const isMobile = isMobileHook ? true : false;

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

  // Theme colors matching AdaptiveCardGrid
  const accentColor = theme.semanticColors.accent.teal;
  const isLightFamilyMode =
    theme.themeMode === 'light' ||
    theme.themeMode === 'protanopia' ||
    theme.themeMode === 'deuteranopia' ||
    theme.themeMode === 'tritanopia' ||
    theme.themeMode === 'grayscale';

  const cardSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.muted
    : theme.semanticColors.background.elevated;

  const cardHoverSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.elevated
    : theme.semanticColors.background.base;

  // Image dimensions for grid view
  const gridImageHeight = '200px';

  // Handle image load (can be extended for orientation detection if needed)
  const handleImageLoad =
    (id: string) => (event: React.SyntheticEvent<HTMLImageElement>) => {
      // Image loaded successfully
    };

  // Shared article content for grid view
  const gridArticleContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        borderRadius: theme.borderRadius.container.medium,
        overflow: 'hidden',
        backgroundColor: isHovered(episode.slug)
          ? cardHoverSurfaceColor
          : cardSurfaceColor,
        backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
        border: `1px solid ${isHovered(episode.slug) ? accentColor : theme.semanticColors.border.default}`,
        transition: 'all 0.3s ease',
        transform: isHovered(episode.slug)
          ? 'translateY(-4px)'
          : 'translateY(0)',
        boxShadow: isHovered(episode.slug)
          ? theme.shadows.cardElevated
          : theme.shadows.card,
      }}
    >
      {episode.imageUrl && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: gridImageHeight,
            flexShrink: 0,
          }}
        >
          <LoadingImage
            src={episode.imageUrl}
            alt={episode.title}
            fill
            sizes='(max-width: 768px) 100vw, 33vw'
            style={{ objectFit: 'cover' }}
            onLoad={handleImageLoad(episode.slug)}
          />
        </div>
      )}
      <div
        style={{
          padding: theme.spacing.m,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.s1,
              marginBottom: theme.spacing.xs,
            }}
          >
            {episode.season !== undefined && episode.episode !== undefined && (
              <Typography
                variant='caption'
                style={{
                  fontWeight: 500,
                  color: theme.semanticColors.link.default,
                }}
              >
                S{episode.season}E{episode.episode}
              </Typography>
            )}
            {episode.category && (
              <Typography
                variant='caption'
                style={{
                  fontWeight: 500,
                  color: theme.semanticColors.link.default,
                }}
              >
                {episode.category}
              </Typography>
            )}
          </div>
          <Typography
            variant='h3'
            style={{
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: '1.5',
              color: isHovered(episode.slug)
                ? theme.semanticColors.link.default
                : theme.semanticColors.text.primary,
              transition: 'color 0.3s ease',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: theme.spacing.xs,
            }}
          >
            {episode.title}
          </Typography>
          {episode.description && (
            <Typography
              variant='body'
              style={{
                fontSize: '0.875rem',
                color: theme.semanticColors.text.muted,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {episode.description}
            </Typography>
          )}
        </div>
        <div
          style={{
            marginTop: theme.spacing.s1,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.s1,
          }}
        >
          {episode.publishedDate && (
            <Typography
              variant='caption'
              style={{ color: theme.semanticColors.text.muted }}
            >
              <time dateTime={episode.publishedDate}>
                {episode.publishedDate}
              </time>
            </Typography>
          )}
          {episode.duration && (
            <Typography
              variant='caption'
              style={{ color: theme.semanticColors.text.muted }}
            >
              {episode.duration}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );

  // Shared article content for small view
  const smallArticleContent = (
    <article
      style={{
        display: 'flex',
        alignItems: 'start',
        gap: theme.spacing.m,
        backgroundColor: isHovered(episode.slug)
          ? cardHoverSurfaceColor
          : cardSurfaceColor,
        borderBottom: `1px solid ${theme.semanticColors.border.default}`,
        paddingTop: theme.spacing.m,
        paddingBottom: theme.spacing.m,
      }}
    >
      <div
        style={{
          position: 'relative',
          flexShrink: 0,
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: theme.borderRadius.container.small,
          overflow: 'hidden',
          backgroundColor: theme.semanticColors.background.base,
        }}
      >
        {episode.imageUrl ? (
          <LoadingImage
            src={episode.imageUrl}
            alt={episode.title}
            fill
            sizes='40px'
            className='object-cover'
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.semanticColors.background.elevated,
            }}
          >
            <Typography variant='caption' style={{ fontSize: '0.75rem' }}>
              🎙
            </Typography>
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant='bodySmall'
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: isHovered(episode.slug)
              ? theme.semanticColors.link.default
              : theme.semanticColors.text.primary,
            transition: 'color 0.3s ease',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {episode.title}
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.s1,
            marginTop: theme.spacing.xs,
          }}
        >
          {episode.category && (
            <Typography
              variant='caption'
              style={{
                fontWeight: 500,
                color: theme.semanticColors.link.default,
              }}
            >
              {episode.category}
            </Typography>
          )}
          {episode.publishedDate && (
            <Typography
              variant='caption'
              style={{
                fontWeight: 500,
                color: theme.semanticColors.link.default,
              }}
            >
              <time dateTime={episode.publishedDate}>
                {episode.publishedDate}
              </time>
            </Typography>
          )}
          {episode.duration && (
            <Typography
              variant='caption'
              style={{
                fontWeight: 500,
                color: theme.semanticColors.link.default,
              }}
            >
              {episode.duration}
            </Typography>
          )}
        </div>
      </div>
    </article>
  );

  // Shared article content for large/list view
  const largeArticleContent = (
    <article
      style={{
        display: 'flex',
        gap: theme.spacing.m,
        borderBottom: `1px solid ${theme.semanticColors.border.default}`,
        paddingTop: theme.spacing.l,
        paddingBottom: theme.spacing.l,
        paddingLeft: theme.spacing.m,
        paddingRight: theme.spacing.m,
        marginLeft: `-${theme.spacing.s1}`,
        marginRight: `-${theme.spacing.s1}`,
        borderRadius: theme.borderRadius.container.small,
        minHeight: isMobile ? 'auto' : '200px',
        backgroundColor: isHovered(episode.slug)
          ? cardHoverSurfaceColor
          : theme.semanticColors.background.muted,
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          flexShrink: 0,
          width: '5rem',
          height: '5rem',
          borderRadius: theme.borderRadius.container.small,
          overflow: 'hidden',
          backgroundColor: theme.semanticColors.background.muted,
        }}
      >
        {episode.imageUrl ? (
          <LoadingImage
            src={episode.imageUrl}
            alt={episode.title}
            fill
            sizes='80px'
            className='object-cover'
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.semanticColors.background.elevated,
            }}
          >
            <Typography variant='caption' style={{ fontSize: '1.5rem' }}>
              🎙
            </Typography>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.s1,
            marginBottom: theme.spacing.xs,
          }}
        >
          {episode.season !== undefined && episode.episode !== undefined && (
            <Typography
              variant='label'
              style={{ color: theme.semanticColors.link.default }}
            >
              S{episode.season}E{episode.episode}
            </Typography>
          )}
          {episode.category && (
            <Typography
              variant='label'
              style={{ color: theme.semanticColors.link.default }}
            >
              {episode.category}
            </Typography>
          )}
          {episode.publishedDate && (
            <Typography
              variant='label'
              style={{ color: theme.semanticColors.link.default }}
            >
              <time dateTime={episode.publishedDate}>
                {episode.publishedDate}
              </time>
            </Typography>
          )}
          {episode.duration && (
            <Typography
              variant='label'
              style={{ color: theme.semanticColors.link.default }}
            >
              {episode.duration}
            </Typography>
          )}
        </div>
        <Typography
          variant='h5'
          style={{
            fontWeight: 600,
            fontSize: '1rem',
            color: isHovered(episode.slug)
              ? theme.semanticColors.link.default
              : theme.semanticColors.text.primary,
            transition: 'color 0.3s ease',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {episode.title}
        </Typography>
        {episode.description && (
          <Typography
            variant='bodySmall'
            style={{
              marginTop: theme.spacing.xs,
              fontSize: '0.875rem',
              color: theme.semanticColors.text.muted,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {episode.description}
          </Typography>
        )}
        {episode.tags && episode.tags.length > 0 && (
          <div
            style={{
              marginTop: theme.spacing.s1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing.xs,
            }}
          >
            {episode.tags.slice(0, 3).map((tag) => (
              <Typography
                key={tag}
                variant='caption'
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: theme.semanticColors.background.muted,
                  color: theme.semanticColors.text.muted,
                  borderRadius: theme.borderRadius.container.small,
                  paddingLeft: theme.spacing.s1,
                  paddingRight: theme.spacing.s1,
                  paddingTop: theme.spacing.xs,
                  paddingBottom: theme.spacing.xs,
                }}
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
          style={{ cursor: 'pointer' }}
          {...getHoverProps(episode.slug)}
        >
          {gridArticleContent}
        </div>
      );
    }

    return (
      <Link
        href={`/podcasts/${episode.slug}`}
        style={{ display: 'block' }}
        {...getHoverProps(episode.slug)}
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
          {...getHoverProps(episode.slug)}
        >
          {smallArticleContent}
        </div>
      );
    }

    return (
      <Link
        href={`/podcasts/${episode.slug}`}
        className='group block'
        {...getHoverProps(episode.slug)}
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
        {...getHoverProps(episode.slug)}
      >
        {largeArticleContent}
      </div>
    );
  }

  return (
    <Link
      href={`/podcasts/${episode.slug}`}
      className='group block'
      {...getHoverProps(episode.slug)}
    >
      {largeArticleContent}
    </Link>
  );
}
