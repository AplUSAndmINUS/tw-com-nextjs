'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

/**
 * PageTransition - Wraps page content with Framer Motion fade in/out transitions.
 * Uses AnimatePresence with mode='wait' so the old page fades out before the new
 * page fades in. The key={pathname} ensures re-animation on every route change.
 * Respects the OS-level prefers-reduced-motion media query.
 *
 * @example
 * <PageTransition>
 *   {children}
 * </PageTransition>
 */
export function PageTransition({
  children,
  duration = 300,
  className = '',
}: PageTransitionProps) {
  const pathname = usePathname();
  const { shouldReduceMotion } = useReducedMotion();

  const durationSeconds = shouldReduceMotion ? 0 : duration / 1000;

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: durationSeconds, ease: 'easeInOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
