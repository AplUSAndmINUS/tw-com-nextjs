'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';
import { resolveIconName, type FluentIconName } from '@/utils/iconResolver';

const serviceCategories: {
  title: string;
  description: string;
  icon: FluentIconName;
  href: string;
  cta: string;
}[] = [
  {
    title: 'Design',
    description:
      'Interface and experience design for products, content systems, and digital platforms that need clarity and momentum.',
    icon: 'DesignIdeasFilled',
    href: '/services/design',
    cta: 'View Design Service',
  },
  {
    title: 'Development',
    description:
      'Modern web development and implementation support focused on performance, maintainability, and long-term product growth.',
    icon: 'CodeFilled',
    href: '/services/development',
    cta: 'View Development Service',
  },
  {
    title: 'Consulting',
    description:
      'Strategic advisory for founders and teams navigating architecture decisions, product direction, and execution planning.',
    icon: 'PeopleCommunityRegular',
    href: '/services/consulting',
    cta: 'View Consulting Service',
  },
  {
    title: 'Resonance Core',
    description:
      'Identity-centered coaching and guidance for creators and leaders building aligned work, voice, and long-term direction.',
    icon: 'HeartFilled',
    href: '/services/resonance-core',
    cta: 'View Resonance Core Service',
  },
  {
    title: 'Personal Training',
    description:
      "Personalized fitness coaching with emotional intelligence—build strength, reduce pain, and align your physical practice with who you're becoming.",
    icon: 'AccessibilityRegular',
    href: '/services/personal-training',
    cta: 'View Personal Training Service',
  },
];

export function ServicesClient() {
  const { theme, themeMode } = useAppTheme();
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  const accentColor = theme.palette.themePrimary;

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
      {serviceCategories.map((category) => {
        const isFocused = focusedCard === category.title;
        const IconComponent = resolveIconName(category.icon);

        return (
          <motion.div
            key={category.title}
            variants={itemVariants}
            initial='hidden'
            animate='visible'
          >
            <Link
              href={category.href}
              className='block h-full rounded-xl focus-visible:outline-none'
              onFocus={() => setFocusedCard(category.title)}
              onBlur={() => setFocusedCard(null)}
              aria-label={`${category.title}: ${category.description}`}
            >
              <motion.div
                style={{
                  position: 'relative',
                  borderRadius: theme.borderRadius.container.medium,
                  border: `1px solid ${isFocused ? accentColor : theme.semanticColors.border.default}`,
                  backgroundColor: cardSurfaceColor,
                  backgroundImage: isLightFamilyMode
                    ? `linear-gradient(160deg, ${accentColor}30 0%, transparent 52%)`
                    : `linear-gradient(160deg, ${accentColor}14 0%, transparent 42%)`,
                  padding: theme.spacing.m,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  boxShadow: isFocused
                    ? `0 0 0 3px ${theme.semanticColors.focus.ring}`
                    : 'none',
                }}
                whileHover={{
                  scale: 1.02,
                  backgroundColor: cardHoverSurfaceColor,
                  borderColor: accentColor,
                  boxShadow: theme.shadows.card,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    borderRadius: theme.borderRadius.container.small,
                    backgroundColor: accentColor,
                    marginBottom: theme.spacing.m,
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    gap: theme.spacing.m,
                    marginBottom: theme.spacing.m,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '3rem',
                      flexShrink: 0,
                      width: '3rem',
                      height: '3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.palette.themePrimary,
                    }}
                  >
                    {IconComponent && (
                      <FluentIcon
                        iconName={IconComponent}
                        style={{ color: theme.palette.themePrimary }}
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

                <span
                  className='hover:underline'
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: accentColor,
                  }}
                >
                  {category.cta} →
                </span>
              </motion.div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
