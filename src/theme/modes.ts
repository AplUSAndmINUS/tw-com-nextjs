/**
 * Theme mode definitions — the single source of truth
 * ===================================================
 *
 * The eight modes and their light/dark split used to be encoded as hardcoded
 * string lists in three separate places (the ThemeMode union in fluentTheme.ts,
 * `isDark` in hooks/useAppTheme.tsx, and `isLightFamilyMode` in
 * hooks/useCardState.ts). All three happened to agree, but nothing enforced it
 * — adding a ninth mode meant remembering all three sites.
 *
 * They derive from here now. The no-flash script in app/layout.tsx also
 * validates against THEME_MODES, so the CSS, the JS and the pre-hydration
 * script cannot drift apart.
 */

export const THEME_MODES = [
  'light',
  'dark',
  'high-contrast',
  'protanopia',
  'deuteranopia',
  'tritanopia',
  'grayscale',
  'grayscale-dark',
] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

/**
 * Modes that sit on a dark surface ladder.
 *
 * Drives the `dark` class on <html> (which Tailwind's `dark:` variant keys off)
 * and `color-scheme`, so native scrollbars and form controls match.
 */
export const DARK_FAMILY_MODES: readonly ThemeMode[] = [
  'dark',
  'high-contrast',
  'grayscale-dark',
];

/** The default before any preference is stored. Matches defaultUserPreferences. */
export const DEFAULT_THEME_MODE: ThemeMode = 'dark';

/** localStorage key used by the zustand persist middleware. */
export const THEME_STORAGE_KEY = 'tw-user-preferences';

export function isDarkFamily(mode: ThemeMode): boolean {
  return DARK_FAMILY_MODES.includes(mode);
}

/**
 * Inverse of isDarkFamily. Kept as its own named export because card surfaces
 * read more clearly asking "is this a light mode?" than negating.
 */
export function isLightFamily(mode: ThemeMode): boolean {
  return !isDarkFamily(mode);
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    typeof value === 'string' && THEME_MODES.includes(value as ThemeMode)
  );
}
