import { describe, expect, it } from 'vitest';
import { getPinReleaseScroll, getRevealProgress } from './scrollRevealProgress';

/**
 * Fixtures are real measurements from /about-me in Chromium
 * (--tw-hero-overlap: 240px, sticky photo pinned at the 76px nav).
 */
const PHONE = {
  viewportHeight: 844,
  heroTop: 175.5,
  heroHeight: 1012,
  photoHeight: 625,
  cardOffset: 385,
};
const TABLET = {
  viewportHeight: 1180,
  heroTop: 138.25,
  heroHeight: 861,
  photoHeight: 680,
  cardOffset: 440,
};
const NAV = 76;

const releaseFor = (m: typeof PHONE) =>
  getPinReleaseScroll(m.heroTop, m.heroHeight, NAV, m.photoHeight);

const progressAt = (m: typeof PHONE, scrollY: number) =>
  getRevealProgress({
    scrollY,
    viewportHeight: m.viewportHeight,
    heroTop: m.heroTop,
    cardOffset: m.cardOffset,
    pinRelease: releaseFor(m),
  });

describe('getPinReleaseScroll', () => {
  it("is where the hero's bottom edge meets the pinned photo's", () => {
    // 175.5 + 1012 - 76 - 625
    expect(releaseFor(PHONE)).toBe(486.5);
    expect(releaseFor(TABLET)).toBe(243.25);
  });
});

describe('getRevealProgress', () => {
  it('starts at 0 with the page at rest and is clamped to 0..1', () => {
    expect(progressAt(PHONE, 0)).toBe(0);
    expect(progressAt(PHONE, -50)).toBe(0);
    expect(progressAt(PHONE, 5000)).toBe(1);
  });

  it('on a phone, ends when the card has risen by its offset', () => {
    // The card offset (385) comes before the pin release (486.5).
    expect(progressAt(PHONE, 385 / 2)).toBeCloseTo(0.5);
    expect(progressAt(PHONE, 385)).toBe(1);
  });

  it('on a tablet, finishes by the pin release so the photo never scrolls away visible', () => {
    // Regression: the fade used to run to the card offset (440) while the
    // pin released at 243, so the photo left at ~46% opacity.
    const release = releaseFor(TABLET);
    expect(release).toBeLessThan(TABLET.cardOffset);
    expect(progressAt(TABLET, release)).toBe(1);
    expect(progressAt(TABLET, release - 1)).toBeLessThan(1);
  });

  it('reverses when scrolling back up (it depends only on position)', () => {
    const down = [0, 100, 200, 300].map((y) => progressAt(PHONE, y));
    const up = [300, 200, 100, 0].map((y) => progressAt(PHONE, y));
    expect(up).toEqual([...down].reverse());
    expect(up.at(-1)).toBe(0);
  });

  it('ignores the release when the photo is not pinned', () => {
    const unpinned = getRevealProgress({
      scrollY: 200,
      viewportHeight: 844,
      heroTop: 175.5,
      cardOffset: 400,
      pinRelease: null,
    });
    expect(unpinned).toBe(0.5);
  });

  it('starts counting once a hero lower on the page enters the viewport', () => {
    const metrics = {
      viewportHeight: 800,
      heroTop: 2000,
      cardOffset: 400,
      pinRelease: null,
    };
    // Starts at 2000 - 800 = 1200.
    expect(getRevealProgress({ ...metrics, scrollY: 1200 })).toBe(0);
    expect(getRevealProgress({ ...metrics, scrollY: 1400 })).toBe(0.5);
  });

  it('never divides by zero when the release comes at the start', () => {
    const progress = getRevealProgress({
      scrollY: 0,
      viewportHeight: 844,
      heroTop: 0,
      cardOffset: 300,
      pinRelease: 0,
    });
    expect(Number.isFinite(progress)).toBe(true);
  });
});
