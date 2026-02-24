import { useState, useEffect } from 'react';
import type { Transition } from 'framer-motion';

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

interface UseSlideInOutOptions {
  direction?: SlideDirection;
  duration?: number;
  distance?: number;
}

interface SlideInOutReturn {
  isAnimating: boolean;
  animationProps: {
    initial: { opacity: number; x?: number; y?: number };
    animate: { opacity: number; x: number; y: number };
    exit: { opacity: number; x?: number; y?: number };
    transition: Transition;
  };
}

/**
 * Hook for slide in/out animations with Framer Motion.
 * Returns animation props that can be spread onto motion components.
 *
 * @example
 * const { animationProps } = useSlideInOut({ direction: 'up', duration: 0.3 });
 * return (
 *   <AnimatePresence>
 *     {isVisible && (
 *       <motion.div {...animationProps}>
 *         Content
 *       </motion.div>
 *     )}
 *   </AnimatePresence>
 * );
 */
export function useSlideInOut({
  direction = 'up',
  duration = 0.3,
  distance = 100,
}: UseSlideInOutOptions = {}): SlideInOutReturn {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), duration * 1000);
    return () => clearTimeout(timeout);
  }, [duration]);

  const getTransform = (multiplier: number) => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance * multiplier };
      case 'down':
        return { x: 0, y: -distance * multiplier };
      case 'left':
        return { x: distance * multiplier, y: 0 };
      case 'right':
        return { x: -distance * multiplier, y: 0 };
      default:
        return { x: 0, y: distance * multiplier };
    }
  };

  const animationProps = {
    initial: {
      opacity: 0,
      ...getTransform(1), // Start position (e.g., below for 'up')
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: {
      opacity: 0,
      ...getTransform(1), // Exit to same position as initial
    },
    transition: {
      duration,
      ease: [0.42, 0, 0.58, 1], // easeInOut cubic bezier
    } as Transition,
  };

  return {
    isAnimating,
    animationProps,
  };
}
