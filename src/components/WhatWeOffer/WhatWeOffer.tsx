'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { BaseCard } from '../BaseCard';

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
          <BaseCard
            key={index}
            title=''
            subheading={`✓ ${item.text}`}
            hoverable={true}
            className='flex items-start gap-3 rounded-lg border p-4'
          />
        ))}
      </motion.div>
    </div>
  );
};
