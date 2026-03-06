'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface AboutSectionWrapperProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'strong';
  className?: string;
}

/**
 * AboutSectionWrapper - Client wrapper for About page sections
 * Applies theme-aware semi-transparent backgrounds that respect reducedTransparency setting
 */
export function AboutSectionWrapper({
  children,
  variant = 'default',
  className = '',
}: AboutSectionWrapperProps) {
  const { reducedTransparency } = useAppTheme();

  // Map variants to opaque and semi-transparent backgrounds
  const backgrounds = {
    default: {
      opaque: 'bg-gray-300 dark:bg-black/90',
      transparent: 'bg-gray-300/90 dark:bg-black/20',
    },
    subtle: {
      opaque: 'bg-gray-400 dark:bg-black/90',
      transparent: 'bg-gray-400/30 dark:bg-black/20',
    },
    strong: {
      opaque: 'bg-gray-100 dark:bg-gray-900',
      transparent: 'bg-gray-100/70 dark:bg-gray-900/60',
    },
  };

  const bgClasses = reducedTransparency
    ? backgrounds[variant].opaque
    : backgrounds[variant].transparent;

  return <section className={`${bgClasses} ${className}`}>{children}</section>;
}
