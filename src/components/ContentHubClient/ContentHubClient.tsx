'use client';

import { motion } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { type FluentIconName } from '@/utils/iconResolver';
import { BaseCard } from '../BaseCard';

const contentCategories: {
  title: string;
  description: string;
  icon: FluentIconName;
  href: string;
  cta: string;
  featured?: boolean;
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
    featured: true,
    disabled: false,
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: theme.spacing.l,
        width: '100%',
      }}
    >
      {contentCategories.map((category) => {
        const isDisabled = category.disabled;

        return (
          <motion.div
            key={category.title}
            variants={itemVariants}
            initial='hidden'
            animate='visible'
          >
            <BaseCard
              title={category.title}
              href={category.href}
              subheading=''
              body={category.description}
              label={category.cta}
              icon={category.icon}
              hoverable={!isDisabled}
              disabled={isDisabled}
              featured={category.featured}
              className='relative overflow-hidden rounded-xl border p-4'
              badge={
                isDisabled
                  ? 'Coming Soon'
                  : category.featured
                    ? 'New!'
                    : undefined
              }
              ariaLabel={`${category.title} - ${category.description} - ${isDisabled ? 'Coming Soon' : category.featured ? 'New!' : category.cta}`}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
