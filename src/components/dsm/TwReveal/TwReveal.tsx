'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './TwReveal.module.scss';

export interface TwRevealProps {
  /** 'up' fades in with a 26px rise; 'left' slides in from 46px out. */
  variant?: 'up' | 'left';
  /** Delay in ms. TwContentGrid uses this to stagger a row of cards. */
  delay?: number;
  /** Element to render. Defaults to a div. */
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scroll-reveal wrapper.
 *
 * Fires once when the element first enters the viewport, then disconnects — the
 * content does not re-animate when scrolled back past, which reads as noise on
 * a long single-page scroll.
 *
 * The animation itself lives in CSS (`.tw-rv` / `.in` in styles/tokens/effects.css)
 * so that reduced-motion handling is declarative and applies even before this
 * component hydrates.
 *
 * Elements start at `opacity: 0`. If JavaScript never runs, they would stay
 * invisible — so the observer is set up in a layout-safe way and there is a
 * `noscript` fallback in the stylesheet that forces visibility.
 */
export function TwReveal({
  variant = 'up',
  delay = 0,
  as: Component = 'div',
  children,
  className,
  style,
}: TwRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the browser cannot observe, show the content rather than hide it.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // Slightly inset the bottom edge so the reveal triggers once the element
      // is meaningfully on screen, not the instant its first pixel appears.
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);

    /**
     * Fail open.
     *
     * These elements start at `opacity: 0` and depend on the observer to
     * reveal them, which means any environment where the callback never
     * arrives leaves real content permanently invisible. That has been
     * observed in headless and non-compositing renderers, and would also
     * happen if the element is inside a hidden ancestor when it mounts.
     *
     * A silent, unrecoverable blank section is far worse than a missed
     * animation, so this reveals unconditionally after a grace period. Any
     * genuine intersection fires long before this and clears the timer.
     */
    const failsafe = window.setTimeout(() => {
      setVisible(true);
      observer.disconnect();
    }, 3000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  const baseClass = variant === 'left' ? 'tw-rv-left' : 'tw-rv';
  const classes = [baseClass, visible ? 'in' : '', styles.reveal, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      ref={ref}
      className={classes}
      style={delay ? { animationDelay: `${delay}ms`, ...style } : style}
    >
      {children}
    </Component>
  );
}

export default TwReveal;
