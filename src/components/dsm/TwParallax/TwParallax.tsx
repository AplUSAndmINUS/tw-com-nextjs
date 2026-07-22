'use client';

import React, { useEffect, useRef } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './TwParallax.module.scss';

export interface TwParallaxProps {
  /**
   * Drift distance in pixels across the full scroll of the element past the
   * viewport. Positive drifts down (slower than scroll). Keep it small — the
   * design system asks for "subtle", and anything past ~80 reads as a gimmick.
   */
  strength?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scroll-driven parallax drift, used behind the hero photograph.
 *
 * Three things worth knowing about the implementation:
 *
 * 1. It only ever writes `transform`, which the compositor can handle off the
 *    main thread. Animating `top` or `background-position` here would force
 *    layout on every frame.
 *
 * 2. Scroll events are coalesced into a single rAF callback. Scroll fires far
 *    more often than the browser paints, so writing the transform directly in
 *    the handler is wasted work and can itself cause jank.
 *
 * 3. It reads the reduced-motion preference and does nothing at all when set —
 *    not a smaller drift, none. Parallax is the effect most likely to provoke
 *    vestibular symptoms, so it is the one to drop outright.
 */
export function TwParallax({
  strength = 40,
  children,
  className,
  style,
}: TwParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAppTheme();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || prefersReduced) {
      el.style.transform = '';
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;

      // Skip work entirely when off screen.
      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      // -1 when the element sits just past the bottom of the viewport,
      // +1 when it has scrolled just off the top.
      const progress =
        (viewportHeight - rect.top) / (viewportHeight + rect.height) - 0.5;

      el.style.transform = `translate3d(0, ${(progress * strength).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [strength, reducedMotion]);

  return (
    <div
      ref={ref}
      className={[styles.parallax, className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

export default TwParallax;
