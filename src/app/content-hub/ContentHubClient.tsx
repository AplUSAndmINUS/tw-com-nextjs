'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

const contentCategories = [
  {
    title: 'Blog',
    description:
      'Long-form articles on technology, creativity, and the human experience.',
    icon: '✍️',
    href: '/blog',
    cta: 'Read Articles',
  },
  {
    title: 'Videos',
    description:
      "In-depth videos, tutorials, and behind-the-scenes looks at what I'm building.",
    icon: '🎬',
    href: '/videos',
    cta: 'Watch Videos',
  },
  {
    title: 'Podcasts',
    description:
      'Audio conversations with creators, technologists, and thinkers.',
    icon: '🎙️',
    href: '/podcasts',
    cta: 'Listen Now',
  },
  {
    title: 'Portfolio',
    description: 'Selected creative work and technical projects.',
    icon: '🗂️',
    href: '/portfolio',
    cta: 'View Work',
  },
  {
    title: 'Case Studies',
    description:
      "Deep dives into specific projects — what worked, what didn't, and what I learned.",
    icon: '🔬',
    href: '/case-studies',
    cta: 'Read Case Studies',
  },
  {
    title: 'View All Content',
    description:
      'Browse everything together with advanced filtering by type, tag, and date.',
    icon: '🔍',
    href: '/content/all',
    cta: 'Explore All',
  },
];

export function ContentHubClient() {
  const { theme } = useAppTheme();

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
      {contentCategories.map((category) => (
        <motion.div
          key={category.title}
          variants={itemVariants}
          initial='hidden'
          animate='visible'
        >
          <Link href={category.href} className='block h-full'>
            <motion.div
              style={{
                borderRadius: theme.borderRadius.container.medium,
                border: `1px solid ${theme.palette.neutralQuaternary}`,
                backgroundColor: theme.palette.neutralLighter,
                padding: theme.spacing.m,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: theme.shadows.card,
              }}
            >
              {/* Icon and Title Row */}
              <div
                style={{
                  display: 'flex',
                  gap: theme.spacing.m,
                  marginBottom: theme.spacing.m,
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '2.25rem', flexShrink: 0 }}>
                  {category.icon}
                </div>
                <Typography
                  variant='h3'
                  className='text-xl font-semibold'
                  style={{
                    color: theme.palette.neutralPrimary,
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
                  color: theme.palette.neutralSecondary,
                  lineHeight: 1.5,
                }}
              >
                {category.description}
              </Typography>

              {/* CTA */}
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: theme.palette.themePrimary,
                }}
                className='hover:underline'
              >
                {category.cta} →
              </span>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
