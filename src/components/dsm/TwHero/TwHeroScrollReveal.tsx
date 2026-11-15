'use client';

import React, { useEffect, useRef } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { getPinReleaseScroll, getRevealProgress } from './scrollRevealProgress';

/**
 * Matches `until('tablet')` in TwHero.module.scss, where the scroll-reveal
 * layout applies. It has to be repeated here because JavaScript cannot read a
 * Sass breakpoint.
 */
const STACKED_QUERY = '(max-width: 1023.98px)';

export interface TwHeroScrollRevealProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Drives TwHero's `scrollReveal` mode on narrow screens.
 *
 * There the hero stacks the photo above the copy card. This component renders
 * the hero's inner wrapper and writes one number to the hero section:
 * `--tw-hero-reveal`, which runs from 0 (page at rest, photo in full) to 1
 * (the card has scrolled up to the top of the viewport). The CSS fades the
 * photo out against it. The copy stays in the server HTML, passed through as
 * children.
 *
 * The same rules as TwParallax apply: scroll events are coalesced into one
 * requestAnimationFrame, only a custom property is written (the CSS animates
 * opacity and transform only), and nothing runs under reduced motion. Without
 * the variable the photo is simply shown in full, so a visitor without
 * JavaScript, or with reduced motion, gets a still, stacked layout.
 */
export function TwHeroScrollReveal({
  className,
  children,
}: TwHeroScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAppTheme();

  useEffect(() => {
    const inner = ref.current;
    const hero = inner?.parentElement;
    if (!inner || !hero) return;

    const clear = () => hero.style.removeProperty('--tw-hero-reveal');

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const stackedQuery = window.matchMedia?.(STACKED_QUERY);
    if (!stackedQuery || reducedMotion || motionQuery?.matches) {
      clear();
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      if (!stackedQuery.matches) {
        clear();
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      // Off screen: keep the last value and skip the work.
      if (heroRect.bottom < 0 || heroRect.top > viewportHeight) return;

      // See getRevealProgress: the fade ends when the card reaches the top,
      // or sooner if the pinned photo would otherwise be carried off with the
      // hero (on wide screens the card is short, so the hero ends early).
      const heroTop = heroRect.top + window.scrollY;
      const progress = getRevealProgress({
        scrollY: window.scrollY,
        viewportHeight,
        heroTop,
        cardOffset: inner.offsetTop + getCardOffset(inner),
        pinRelease: getPinRelease(hero, inner, heroTop, heroRect.height),
      });

      hero.style.setProperty('--tw-hero-reveal', progress.toFixed(3));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    stackedQuery.addEventListener?.('change', schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      stackedQuery.removeEventListener?.('change', schedule);
      clear();
    };
  }, [reducedMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Top padding of the inner wrapper, if any, above the card. */
function getCardOffset(inner: HTMLElement): number {
  return parseFloat(window.getComputedStyle(inner).paddingTop) || 0;
}

/**
 * Scroll position at which the sticky photo stops being pinned: the hero's
 * bottom edge has reached the photo's bottom edge, and from there on the photo
 * moves up with the page. Null when the photo is not sticky (wider screens,
 * or a hero with no image).
 */
function getPinRelease(
  hero: HTMLElement,
  inner: HTMLElement,
  heroTop: number,
  heroHeight: number
): number | null {
  for (const child of Array.from(hero.children)) {
    if (child === inner || !(child instanceof HTMLElement)) continue;
    const style = window.getComputedStyle(child);
    if (style.position !== 'sticky') continue;
    const pinnedAt = parseFloat(style.top) || 0;
    return getPinReleaseScroll(
      heroTop,
      heroHeight,
      pinnedAt,
      child.offsetHeight
    );
  }
  return null;
}

export default TwHeroScrollReveal;
