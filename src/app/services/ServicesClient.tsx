'use client';

import { motion } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { resolveIconName, type FluentIconName } from '@/utils/iconResolver';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { BaseCard } from '@/components/BaseCard';

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

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };


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
            ? '1fr 1fr'
            : '1fr 1fr 1fr',
        gap: theme.spacing.l,
        width: '100%',
      }}
    >
      {serviceCategories.map((category) => {
        const IconComponent = resolveIconName(category.icon);

        return (

          <BaseCard
            key={category.title}
            title={category.title}
            body={category.description}
            icon={category.icon}
            href={category.href}
            cta={category.cta}
          />
        );
      })}
    </motion.div>
  );
}
