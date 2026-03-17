'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import { resolveIconName, type FluentIconName } from '@/utils/iconResolver';

const contentCategories: {
  title: string;
  description: string;
  icon: FluentIconName;
  href: string;
  cta: string;
  disabled: boolean;
}[] = [
  {
    title: 'Blog',
    description:
      'Long-form articles on technology, creativity, and the human experience.',
    icon: 'PenRegular',
    href: '/blog',
    cta: 'Read Articles',
    disabled: false,
  },
  {
    title: 'Portfolio',
    description: 'Selected creative work and technical projects.',
    icon: 'DesignIdeasFilled',
    href: '/portfolio',
    cta: 'View Work',
    disabled: false,
  },
  {
    title: 'Case Studies',
    description:
      "Deep dives into specific projects — what worked, what didn't, and what I learned.",
    icon: 'BookRegular',
    href: '/case-studies',
    cta: 'Read Case Studies',
    disabled: false,
  },
  {
    title: 'GitHub',
    description:
      'Open source projects, code samples, and technical experiments.',
    icon: 'CodeFilled',
    href: '/github/',
    cta: 'Explore Code',
    disabled: false,
  },
  {
    title: 'Videos',
    description:
      "In-depth videos, tutorials, and behind-the-scenes looks at what I'm building.",
    icon: 'VideoClipRegular',
    href: '/videos',
    cta: 'Watch Videos',
    disabled: false,
  },
  {
    title: 'Podcasts',
    description:
      'Audio conversations with creators, technologists, and thinkers.',
    icon: 'MicRegular',
    href: '/podcasts',
    cta: 'Listen Now',
    disabled: true,
  },
];

export function ContentHubClient() {
  const { theme, themeMode } = useAppTheme();
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const accentColor = theme.semanticColors.accent.teal;

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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: theme.spacing.l,
        width: '100%',
      }}
    >
      {contentCategories.map((category) => {
        const isFocused = focusedCard === category.title;
        const isHovered = hoveredCard === category.title;
        const isDisabled = category.disabled;
        const IconComponent = resolveIconName(category.icon);

        const cardContent = (
          <motion.div
            style={{
              position: 'relative',
              borderRadius: theme.borderRadius.container.medium,
              border: `1px solid ${isFocused || isHovered ? theme.palette.themePrimary : theme.semanticColors.border.default}`,
              backgroundColor: cardSurfaceColor,
              backgroundImage: isLightFamilyMode
                ? `linear-gradient(160deg, ${accentColor}30 0%, transparent 52%)`
                : `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
              padding: theme.spacing.m,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s ease',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.6 : 1,
              boxShadow: isFocused
                ? `0 0 0 3px ${theme.semanticColors.focus.ring}`
                : 'none',
            }}
            whileHover={
              isDisabled
                ? {}
                : {
                    scale: 1.02,
                    backgroundColor: cardHoverSurfaceColor,
                    borderColor: accentColor,
                    boxShadow: theme.shadows.cardElevated,
                  }
            }
          >
            {/* Coming Soon Badge */}
            {isDisabled && (
              <div
                style={{
                  position: 'absolute',
                  top: theme.spacing.s,
                  right: theme.spacing.s,
                  backgroundColor: theme.colorPaletteRoyalBlueForeground2,
                  color: theme.palette.white,
                  padding: `${theme.spacing.xs} ${theme.spacing.s}`,
                  borderRadius: theme.borderRadius.container.small,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: theme.shadows.button,
                  zIndex: 1,
                  opacity: 1,
                }}
              >
                Coming Soon!
              </div>
            )}

            <div
              style={{
                width: '100%',
                height: '4px',
                borderRadius: theme.borderRadius.container.small,
                backgroundColor:
                  isHovered || isFocused
                    ? accentColor
                    : theme.palette.themePrimary,
                marginBottom: theme.spacing.m,
              }}
            />

            {/* Icon and Title Row */}
            <div
              style={{
                display: 'flex',
                gap: theme.spacing.s,
                marginBottom: theme.spacing.m,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '3rem',
                  height: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.semanticColors.selection.text,
                }}
              >
                {IconComponent && (
                  <FluentIcon
                    iconName={IconComponent}
                    style={{
                      fontSize: '2.5rem',
                      color: accentColor,
                      flexShrink: 0,
                      paddingRight: '0.25rem',
                      width: '48px',
                      height: '48px',
                    }}
                  />
                )}
              </div>
              <Typography
                variant='h3'
                className='text-xl font-semibold'
                style={{
                  color: theme.semanticColors.text.heading,
                  lineHeight: 1.3,
                }}
              >
                {category.title}
              </Typography>
            </div>

            {/* Description */}
            <Typography
              variant='body'
              className='text-sm mb-4 flex-grow'
              style={{
                color: theme.semanticColors.text.muted,
                lineHeight: 1.5,
              }}
            >
              {category.description}
            </Typography>

            {/* CTA */}
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isDisabled
                  ? theme.semanticColors.text.muted
                  : isHovered || isFocused
                    ? accentColor
                    : theme.palette.themePrimary,
              }}
              className={isDisabled ? '' : 'hover:underline'}
            >
              {isDisabled ? 'Coming Soon' : `${category.cta} →`}
            </span>
          </motion.div>
        );

        return (
          <motion.div
            key={category.title}
            variants={itemVariants}
            initial='hidden'
            animate='visible'
          >
            {isDisabled ? (
              <div
                className='block h-full rounded-xl'
                aria-label={`${category.title}: ${category.description} (Coming Soon)`}
              >
                {cardContent}
              </div>
            ) : (
              <Link
                href={category.href}
                className='block h-full rounded-xl focus-visible:outline-none'
                onFocus={() => setFocusedCard(category.title)}
                onBlur={() => setFocusedCard(null)}
                onMouseEnter={() => setHoveredCard(category.title)}
                onMouseLeave={() => setHoveredCard(null)}
                aria-label={`${category.title}: ${category.description}`}
              >
                {cardContent}
              </Link>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
