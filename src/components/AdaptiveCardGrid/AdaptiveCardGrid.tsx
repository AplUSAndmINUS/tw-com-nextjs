'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import {
  useIsMobile,
  useIsTablet,
  useIsTabletLandscape,
} from '@/hooks/useMediaQuery';
import { useMouseMultiHoverState } from '@/hooks/useHoverState';
import { Typography } from '../Typography';
import { is } from 'date-fns/locale';

export interface AdaptiveCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt: string;
  imageText: string; // Date or other text overlay
  tags?: string[];
}

export interface AdaptiveCardGridProps {
  cards: AdaptiveCard[];
  basePath: string;
  viewType?: 'grid' | 'small' | 'large';
  onCardClick?: (id: string) => void;
}

/**
 * AdaptiveCardGrid Component
 *
 * Renders cards in different view types (grid, small tile, large tile)
 * with smooth animations and responsive layouts.
 */
export const AdaptiveCardGrid: React.FC<AdaptiveCardGridProps> = ({
  cards,
  basePath,
  viewType = 'grid',
  onCardClick,
}) => {
  const router = useRouter();
  const { theme } = useAppTheme();
  const isMobileHook = useIsMobile();
  const isTabletHook = useIsTablet();
  const isTabletLandscapeHook = useIsTabletLandscape();
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobile = isMounted ? isMobileHook : false;
  const isTablet = isMounted ? isTabletHook || isTabletLandscapeHook : false;
  const isCompactViewport = isMobile || isTablet;
  const { isHovered, getHoverProps } = useMouseMultiHoverState();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCardClick = (id: string) => {
    if (onCardClick) {
      onCardClick(id);
    } else {
      router.push(`${basePath}/${id}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const accentColor = theme.semanticColors.accent.teal;
  const restStateColor = theme.palette.themePrimary;

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
    : theme.semanticColors.background.muted;

  const headingFontFamily =
    theme.typography?.fontFamilies?.heading ??
    'montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const showTags = !isCompactViewport;
  const gridImageHeight = isTablet ? '144px' : '200px';
  const inlineImageWidth = isCompactViewport
    ? 'clamp(120px, 30%, 180px)'
    : 'clamp(180px, 26%, 225px)';
  const smallTileMinHeight = isCompactViewport ? '132px' : '168px';
  const largeTileHeight = isCompactViewport ? '220px' : '260px';

  // Grid View (3 columns on desktop, 2 on tablet, 1 on mobile)
  if (viewType === 'grid') {
    return (
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : isTablet
              ? 'repeat(2, minmax(0, 1fr))'
              : 'repeat(auto-fill, minmax(300px, 1fr))',
          gridAutoRows: '1fr',
          gap: theme.spacing.l,
          width: '100%',
        }}
      >
        {cards.map((card) => {
          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              initial='hidden'
              animate='visible'
              style={{ height: '100%' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer',
                  borderRadius: theme.borderRadius.container.medium,
                  overflow: 'hidden',
                  backgroundColor: isHovered(card.id)
                    ? cardHoverSurfaceColor
                    : cardSurfaceColor,
                  backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
                  border: `1px solid ${isHovered(card.id) ? accentColor : theme.semanticColors.border.default}`,
                  transition: 'all 0.3s ease',
                  transform: isHovered(card.id)
                    ? 'translateY(-4px)'
                    : 'translateY(0)',
                  boxShadow: isHovered(card.id)
                    ? theme.shadows.cardElevated
                    : theme.shadows.card,
                }}
                {...getHoverProps(card.id)}
                onClick={() => handleCardClick(card.id)}
              >
                {card.imageUrl && (
                  <div
                    style={{
                      width: '100%',
                      height: gridImageHeight,
                      position: 'relative',
                      backgroundColor: isHovered(card.id)
                        ? theme.semanticColors.background.elevated
                        : theme.semanticColors.background.muted,
                    }}
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.imageAlt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: theme.spacing.s1,
                        background: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        fontSize: '0.875rem',
                      }}
                    >
                      {card.imageText}
                    </div>
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
                    <Typography
                      variant='h3'
                      style={{
                        fontSize: isCompactViewport
                          ? 'clamp(1rem, 0.85rem + 1vw, 1.125rem)'
                          : '1.5rem',
                        color: theme.semanticColors.text.heading,
                        marginBottom: theme.spacing.s1,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {card.title}
                    </Typography>
                    {!isCompactViewport && (
                      <Typography
                        variant='body'
                        style={{
                          fontSize: '1rem',
                          color: theme.semanticColors.text.muted,
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: isCompactViewport ? 2 : 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          marginBottom:
                            showTags && card.tags && card.tags.length > 0
                              ? theme.spacing.s1
                              : 0,
                        }}
                      >
                        {card.description}
                      </Typography>
                    )}
                  </div>
                  {showTags && card.tags && card.tags.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: theme.spacing.xs,
                        marginTop: theme.spacing.s1,
                      }}
                    >
                      {card.tags.slice(0, 3).map((tag) => (
                        <Typography
                          variant='label'
                          key={tag}
                          style={{
                            fontSize: '0.75rem',
                            padding: `${theme.spacing.xs} ${theme.spacing.s1}`,
                            borderRadius: theme.borderRadius.container.small,
                            backgroundColor: isHovered(card.id)
                              ? theme.semanticColors.background.elevated
                              : theme.semanticColors.background.muted,
                            color: theme.semanticColors.text.muted,
                            border: `1px solid ${theme.semanticColors.border.default}`,
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  // Small Tile View (compact list)
  if (viewType === 'small') {
    return (
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.m,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {cards.map((card) => {
          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              initial='hidden'
              animate='visible'
            >
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  borderRadius: theme.borderRadius.container.medium,
                  overflow: 'hidden',
                  alignItems: 'stretch',
                  minHeight: smallTileMinHeight,
                  backgroundColor: isHovered(card.id)
                    ? cardHoverSurfaceColor
                    : cardSurfaceColor,
                  backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
                  border: `1px solid ${isHovered(card.id) ? accentColor : theme.semanticColors.border.default}`,
                  transition: 'all 0.3s ease',
                  transform: isHovered(card.id)
                    ? 'translateY(-4px)'
                    : 'translateY(0)',
                  boxShadow: isHovered(card.id)
                    ? theme.shadows.cardElevated
                    : theme.shadows.card,
                }}
                {...getHoverProps(card.id)}
                onClick={() => handleCardClick(card.id)}
              >
                {card.imageUrl && (
                  <div
                    style={{
                      width: inlineImageWidth,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      alignSelf: 'stretch',
                      backgroundColor: theme.semanticColors.background.muted,
                    }}
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.imageAlt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                <div
                  className='p-4 items-center justify-center'
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <Typography
                    variant='h3'
                    style={{
                      fontSize: isCompactViewport ? '1.25rem' : '1.5rem',
                      color: theme.semanticColors.text.heading,
                      marginBottom: theme.spacing.xs,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: isCompactViewport ? 3 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant='body'
                    style={{
                      fontSize: '0.875rem',
                      color: isHovered(card.id) ? accentColor : restStateColor,
                      fontWeight: 600,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {card.imageText}
                  </Typography>
                  {!isCompactViewport && (
                    <Typography
                      variant='body'
                      style={{
                        fontSize: '0.875rem',
                        color: theme.semanticColors.text.muted,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom:
                          showTags && card.tags && card.tags.length > 0
                            ? theme.spacing.xs
                            : 0,
                      }}
                    >
                      {card.description}
                    </Typography>
                  )}
                  {showTags && card.tags && card.tags.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: theme.spacing.xs,
                        marginTop: theme.spacing.xs,
                      }}
                    >
                      {card.tags.slice(0, 3).map((tag) => (
                        <Typography
                          variant='label'
                          key={tag}
                          style={{
                            fontSize: '0.7rem',
                            padding: `4px ${theme.spacing.xs}`,
                            borderRadius: theme.borderRadius.container.small,
                            backgroundColor:
                              theme.semanticColors.background.muted,
                            color: theme.semanticColors.text.muted,
                            border: `1px solid ${theme.semanticColors.border.default}`,
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  // Large Tile View (prominent cards)
  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.l,
        width: '100%',
      }}
    >
      {cards.map((card) => {
        return (
          <motion.div
            key={card.id}
            variants={itemVariants}
            initial='hidden'
            animate='visible'
          >
            <div
              style={{
                cursor: 'pointer',
                borderRadius: theme.borderRadius.container.medium,
                overflow: 'hidden',
                backgroundColor: isHovered(card.id)
                  ? cardHoverSurfaceColor
                  : cardSurfaceColor,
                backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
                border: `1px solid ${isHovered(card.id) ? accentColor : theme.semanticColors.border.default}`,
                transition: 'all 0.3s ease',
                transform: isHovered(card.id)
                  ? 'translateY(-4px)'
                  : 'translateY(0)',
                boxShadow: isHovered(card.id)
                  ? theme.shadows.cardElevated
                  : theme.shadows.card,
              }}
              {...getHoverProps(card.id)}
              onClick={() => handleCardClick(card.id)}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: isCompactViewport ? theme.spacing.s1 : theme.spacing.m,
                  height: largeTileHeight,
                }}
              >
                {card.imageUrl && (
                  <div
                    style={{
                      width: inlineImageWidth,
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      alignSelf: 'stretch',
                      backgroundColor: theme.semanticColors.background.muted,
                    }}
                  >
                    <img
                      src={card.imageUrl}
                      alt={card.imageAlt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Typography
                      variant='label'
                      style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        left: '0.5rem',
                        right: 0,
                        padding: theme.spacing.s1,
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      {card.imageText}
                    </Typography>
                  </div>
                )}
                <div
                  style={{
                    flex: 1,
                    padding: isCompactViewport
                      ? theme.spacing.s1
                      : theme.spacing.m,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant='h3'
                    style={{
                      fontSize: isCompactViewport
                        ? isMobile
                          ? '1.25rem'
                          : '1.375rem'
                        : '1.75rem',
                      fontWeight: 600,
                      fontFamily: headingFontFamily,
                      color: theme.semanticColors.text.heading,
                      marginBottom: isCompactViewport
                        ? theme.spacing.xs
                        : theme.spacing.m,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: isCompactViewport ? 2 : undefined,
                      WebkitBoxOrient: isCompactViewport
                        ? 'vertical'
                        : undefined,
                      overflow: isCompactViewport ? 'hidden' : undefined,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant='body'
                    style={{
                      fontSize: isCompactViewport ? '0.875rem' : '1rem',
                      color: theme.semanticColors.text.muted,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: isCompactViewport ? 2 : 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxHeight: isCompactViewport ? '3.2em' : '6.4em',
                      marginBottom:
                        showTags && card.tags && card.tags.length > 0
                          ? theme.spacing.m
                          : 0,
                    }}
                  >
                    {card.description}
                  </Typography>
                  {showTags && card.tags && card.tags.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: theme.spacing.s1,
                        marginTop: theme.spacing.s1,
                      }}
                    >
                      {card.tags.slice(0, 5).map((tag) => (
                        <Typography
                          variant='label'
                          key={tag}
                          style={{
                            fontSize: '0.75rem',
                            padding: `${theme.spacing.xs} ${theme.spacing.s1}`,
                            borderRadius: theme.borderRadius.container.small,
                            backgroundColor:
                              theme.semanticColors.background.muted,
                            color: theme.semanticColors.text.muted,
                            border: `1px solid ${theme.semanticColors.border.default}`,
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
