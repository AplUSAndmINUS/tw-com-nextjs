'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile } from '@/hooks/useMediaQuery';

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
  const isMobile = useIsMobile();

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

  // Theme-token accents adapt automatically across dark/light/high-contrast and colorblind modes.
  const accentPalette = [
    theme.semanticColors.link.default,
    theme.semanticColors.link.hover,
    theme.semanticColors.link.visited,
    theme.semanticColors.border.emphasis,
    theme.palette.themePrimary,
    theme.palette.themeSecondary,
  ];

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

  const getAccentColor = (index: number) =>
    accentPalette[index % accentPalette.length];

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
            : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: theme.spacing.l,
          width: '100%',
        }}
      >
        {cards.map((card, index) => {
          const accentColor = getAccentColor(index);

          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              initial='hidden'
              animate='visible'
              style={{
                cursor: 'pointer',
                borderRadius: theme.borderRadius.container.medium,
                overflow: 'hidden',
                backgroundColor: cardSurfaceColor,
                backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
                border: `1px solid ${theme.semanticColors.border.default}`,
                borderTop: `4px solid ${accentColor}`,
                transition: 'all 0.2s ease',
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: cardHoverSurfaceColor,
                borderColor: accentColor,
                boxShadow: theme.shadows.card,
              }}
              onClick={() => handleCardClick(card.id)}
            >
              {card.imageUrl && (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    position: 'relative',
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
              <div style={{ padding: theme.spacing.m }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    fontFamily: headingFontFamily,
                    color: theme.semanticColors.text.heading,
                    marginBottom: theme.spacing.s1,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: theme.semanticColors.text.muted,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom:
                      card.tags && card.tags.length > 0 ? theme.spacing.s1 : 0,
                  }}
                >
                  {card.description}
                </p>
                {card.tags && card.tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: theme.spacing.xs,
                      marginTop: theme.spacing.s1,
                    }}
                  >
                    {card.tags.slice(0, 3).map((tag) => (
                      <span
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
                      </span>
                    ))}
                  </div>
                )}
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
        }}
      >
        {cards.map((card, index) => {
          const accentColor = getAccentColor(index);

          return (
            <motion.div
              key={card.id}
              variants={itemVariants}
              initial='hidden'
              animate='visible'
              style={{
                display: 'flex',
                gap: theme.spacing.m,
                cursor: 'pointer',
                borderRadius: theme.borderRadius.container.medium,
                overflow: 'hidden',
                backgroundColor: cardSurfaceColor,
                backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
                border: `1px solid ${theme.semanticColors.border.default}`,
                borderLeft: `4px solid ${accentColor}`,
                padding: theme.spacing.m,
                transition: 'all 0.2s ease',
              }}
              whileHover={{
                backgroundColor: cardHoverSurfaceColor,
                borderColor: accentColor,
                boxShadow: theme.shadows.card,
              }}
              onClick={() => handleCardClick(card.id)}
            >
              {card.imageUrl && (
                <div
                  style={{
                    width: isMobile ? '80px' : '120px',
                    height: isMobile ? '80px' : '120px',
                    flexShrink: 0,
                    borderRadius: theme.borderRadius.container.small,
                    overflow: 'hidden',
                    backgroundColor: theme.semanticColors.background.muted,
                    position: 'relative',
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: isMobile ? '1rem' : '1.125rem',
                    fontWeight: 600,
                    fontFamily: headingFontFamily,
                    color: theme.semanticColors.text.heading,
                    marginBottom: theme.spacing.xs,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: accentColor,
                    fontWeight: 600,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {card.imageText}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: theme.semanticColors.text.muted,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom:
                      card.tags && card.tags.length > 0 ? theme.spacing.xs : 0,
                  }}
                >
                  {card.description}
                </p>
                {card.tags && card.tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: theme.spacing.xs,
                      marginTop: theme.spacing.xs,
                    }}
                  >
                    {card.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.7rem',
                          padding: `2px ${theme.spacing.xs}`,
                          borderRadius: theme.borderRadius.container.small,
                          backgroundColor:
                            theme.semanticColors.background.muted,
                          color: theme.semanticColors.text.muted,
                          border: `1px solid ${theme.semanticColors.border.default}`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
        gap: theme.spacing.xl,
        width: '100%',
      }}
    >
      {cards.map((card, index) => {
        const accentColor = getAccentColor(index);

        return (
          <motion.div
            key={card.id}
            variants={itemVariants}
            initial='hidden'
            animate='visible'
            style={{
              cursor: 'pointer',
              borderRadius: theme.borderRadius.container.medium,
              overflow: 'hidden',
              backgroundColor: cardSurfaceColor,
              backgroundImage: `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
              border: `1px solid ${theme.semanticColors.border.default}`,
              borderTop: `4px solid ${accentColor}`,
              transition: 'all 0.2s ease',
            }}
            whileHover={{
              backgroundColor: cardHoverSurfaceColor,
              borderColor: accentColor,
              boxShadow: theme.shadows.card,
            }}
            onClick={() => handleCardClick(card.id)}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 0 : theme.spacing.l,
              }}
            >
              {card.imageUrl && (
                <div
                  style={{
                    width: isMobile ? '100%' : '320px',
                    height: isMobile ? '200px' : '240px',
                    flexShrink: 0,
                    backgroundColor: theme.semanticColors.background.muted,
                    position: 'relative',
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
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {card.imageText}
                  </div>
                </div>
              )}
              <div
                style={{
                  flex: 1,
                  padding: theme.spacing.l,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '1.5rem' : '1.75rem',
                    fontWeight: 600,
                    fontFamily: headingFontFamily,
                    color: theme.semanticColors.text.heading,
                    marginBottom: theme.spacing.m,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? '0.9375rem' : '1rem',
                    color: theme.semanticColors.text.muted,
                    lineHeight: 1.6,
                    marginBottom:
                      card.tags && card.tags.length > 0 ? theme.spacing.m : 0,
                  }}
                >
                  {card.description}
                </p>
                {card.tags && card.tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: theme.spacing.s1,
                      marginTop: theme.spacing.s1,
                    }}
                  >
                    {card.tags.slice(0, 5).map((tag) => (
                      <span
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
                      </span>
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
};
