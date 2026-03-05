'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile, useIsTablet} from '@/hooks/useMediaQuery';

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
        variant='h2'
        className='text-2xl font-bold mb-6'
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
          gridTemplateColumns: isMobile || isTablet
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
              border: `1px solid ${theme.semanticColors.border.default}`,
              transition: 'all 0.2s ease',
              cursor: 'default',
              transform:
                hoveredIndex === index ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow:
                hoveredIndex === index
                  ? theme.shadows.card
                  : theme.shadows.button,
              backgroundColor:
                hoveredIndex === index ? cardHoverSurfaceColor : cardSurfaceColor,
            }}
          >
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
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.themePrimary,
                  fontSize: '1.25rem',
                  marginTop: '2px',
                }}
              >
                ✓
              </div>
              <Typography
                variant='body'
                style={{
                  color: theme.semanticColors.text.muted,
                  fontSize: '0.9375rem',
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
