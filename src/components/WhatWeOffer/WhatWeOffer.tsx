'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';

export interface OfferItem {
  text: string;
}

interface WhatWeOfferProps {
  items: OfferItem[];
}

export const WhatWeOffer: React.FC<WhatWeOfferProps> = ({ items }) => {
  const { theme, themeMode } = useAppTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const isLightFamilyMode =
    themeMode === 'light' ||
    themeMode === 'protanopia' ||
    themeMode === 'deuteranopia' ||
    themeMode === 'tritanopia' ||
    themeMode === 'grayscale';

  const cardSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.muted
    : theme.semanticColors.background.elevated;

  const cardHoverSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.elevated
    : theme.semanticColors.background.muted;

  const accentColor = theme.semanticColors.accent.teal;
  const restStateColor = theme.palette.themePrimary;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <Typography
        variant='h3'
        className='mb-6'
        style={{ color: theme.semanticColors.text.heading }}
      >
        What I Offer
      </Typography>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : isTablet
              ? '1fr 1fr'
              : '1fr 1fr 1fr',
          gap: theme.spacing.m,
          width: '100%',
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              padding: theme.spacing.l,
              borderRadius: theme.borderRadius.container.medium,
              border: isLightFamilyMode
                ? `1px solid ${hoveredIndex === index ? accentColor : theme.semanticColors.border.emphasis}`
                : `1px solid ${hoveredIndex === index ? accentColor : theme.semanticColors.border.default}`,
              backgroundImage:
                hoveredIndex === index
                  ? isLightFamilyMode
                    ? `linear-gradient(160deg, ${accentColor}48 0%, transparent 55%)`
                    : `linear-gradient(160deg, ${accentColor}28 0%, transparent 55%)`
                  : isLightFamilyMode
                    ? `linear-gradient(160deg, ${accentColor}28 0%, transparent 42%)`
                    : `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
              transition:
                'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              cursor: 'default',
              transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
              boxShadow:
                hoveredIndex === index
                  ? theme.shadows.cardElevated
                  : theme.shadows.card,
              backgroundColor:
                hoveredIndex === index
                  ? cardHoverSurfaceColor
                  : cardSurfaceColor,
            }}
          >
            <div
              className='w-full h-1 rounded-sm mb-4'
              style={{
                backgroundColor:
                  hoveredIndex === index ? accentColor : restStateColor,
              }}
            />
            <div
              style={{
                display: 'flex',
                gap: theme.spacing.m,
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: hoveredIndex === index ? accentColor : restStateColor,
                  fontSize: '1.25rem',
                  marginTop: '2px',
                }}
              >
                ✓
              </div>
              <Typography
                variant='label'
                style={{
                  color: hoveredIndex === index ? accentColor : restStateColor,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                {item.text}
              </Typography>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
