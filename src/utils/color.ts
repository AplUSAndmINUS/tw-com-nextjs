/**
 * Color helpers
 * =============
 *
 * Theme colors are CSS custom properties (`var(--tw-accent)`), not hex literals.
 * That means the old trick of suffixing an alpha pair onto a hex string —
 * `` `${accentColor}14` `` — no longer works: it produces `var(--tw-accent)14`,
 * which is an invalid CSS value. The browser drops the whole declaration
 * silently, with no console error, so the element just renders without its
 * background or border.
 *
 * `withAlpha` uses `color-mix()` instead, which composes correctly with `var()`
 * because variable substitution happens before `color-mix` is parsed.
 */

/**
 * Fade a color to a given opacity.
 *
 * Works with any CSS color, including `var(--tw-*)` references.
 *
 * @param color   Any CSS color value.
 * @param percent Opacity, 0–100.
 *
 * @example
 * withAlpha('var(--tw-accent)', 8) // 'color-mix(in srgb, var(--tw-accent) 8%, transparent)'
 */
export function withAlpha(color: string, percent: number): string {
  const clamped = Math.max(0, Math.min(100, percent));
  return `color-mix(in srgb, ${color} ${clamped}%, transparent)`;
}

/**
 * The diagonal shimmer wash used on interactive card surfaces.
 *
 * This exact gradient was duplicated across Hero, PodcastCard, AdaptiveCardGrid
 * (three times), ConsultationCTA and NewsletterSignupCTA. Changing the angle or
 * falloff meant finding all seven copies, so it lives here now.
 *
 * @param color   Wash color — usually the theme accent.
 * @param percent Opacity of the wash at its origin, 0–100.
 * @param stop    Where the wash fades to transparent. Defaults to the 42% used
 *                by resting cards; hover states typically pass 55%.
 */
export function accentWash(
  color: string,
  percent: number,
  stop = 42
): string {
  return `linear-gradient(160deg, ${withAlpha(color, percent)} 0%, transparent ${stop}%)`;
}
