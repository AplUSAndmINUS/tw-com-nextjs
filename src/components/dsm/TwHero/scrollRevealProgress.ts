/**
 * The arithmetic behind TwHero's `scrollReveal` fade, kept free of the DOM so
 * it can be unit tested. TwHeroScrollReveal measures the page and calls these
 * on every animation frame.
 */

export interface RevealMetrics {
  /** Current window.scrollY. */
  scrollY: number;
  /** window.innerHeight. */
  viewportHeight: number;
  /** The hero's top edge in document coordinates. */
  heroTop: number;
  /** Distance from the hero's top to the card's top at rest. */
  cardOffset: number;
  /** Scroll position where the sticky photo stops being pinned, if it is. */
  pinRelease: number | null;
}

/**
 * Scroll position at which a sticky photo stops being pinned: the hero's
 * bottom edge has reached the photo's bottom edge, and from there the photo
 * moves up with the page.
 */
export function getPinReleaseScroll(
  heroTop: number,
  heroHeight: number,
  pinnedAt: number,
  photoHeight: number
): number {
  return heroTop + heroHeight - pinnedAt - photoHeight;
}

/**
 * Fade progress, 0 (photo in full) to 1 (photo gone).
 *
 * It starts once the hero is fully in play (scroll 0 for a hero at the top of
 * the page). It ends when the card has risen by its own offset or, if that
 * comes sooner, when the pinned photo is about to be carried off with the
 * hero, so the photo is never seen scrolling away.
 */
export function getRevealProgress({
  scrollY,
  viewportHeight,
  heroTop,
  cardOffset,
  pinRelease,
}: RevealMetrics): number {
  const start = Math.max(0, heroTop - viewportHeight);
  let end = start + cardOffset;
  if (pinRelease !== null) end = Math.min(end, pinRelease);
  const progress = (scrollY - start) / Math.max(1, end - start);
  return Math.min(1, Math.max(0, progress));
}
