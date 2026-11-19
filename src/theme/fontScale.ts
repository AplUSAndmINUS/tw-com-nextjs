/**
 * Text size (root font-size multiplier).
 *
 * The Display panel offers 100% to 150% (owner, Checkpoint 4: the redesign
 * briefly offered 200%, which was too big in practice). Browser zoom still
 * covers larger sizes (WCAG 1.4.4), and the layout was checked at 200%.
 * Shared by the preferences store, FontScaleProvider, the pre-paint theme
 * script and the Display panel.
 */
export const FONT_SCALE_MIN = 0.8;
export const FONT_SCALE_MAX = 1.5;

/** The steps the Display panel offers (100% to 150%). */
export const FONT_SCALE_STEPS = [1, 1.25, 1.5] as const;

/** Keep a scale inside the supported range; anything invalid becomes 1. */
export function clampFontScale(scale: unknown): number {
  if (typeof scale !== 'number' || !Number.isFinite(scale)) return 1;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, scale));
}
