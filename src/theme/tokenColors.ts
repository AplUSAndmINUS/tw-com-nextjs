/**
 * Token-backed colors
 * ===================
 *
 * Every color the JS theme exposes is a `var(--tw-*)` reference rather than a
 * hex literal. An inline style like
 *
 *   style={{ color: theme.semanticColors.text.body }}
 *
 * therefore emits `color: var(--tw-text-body)`, which resolves against whatever
 * `data-theme` is currently on <html>.
 *
 * Two consequences worth understanding:
 *
 * 1. There is ONE set of colors, not eight. The CSS custom properties already
 *    vary per mode (see styles/tokens/colors.css and colors-modes.css), so the
 *    JS layer no longer needs a palette per mode — it just names tokens. The
 *    theme objects still differ by `themeMode`, but not by colour.
 *
 * 2. It replaced Fluent's `createLightTheme` / `createDarkTheme` generators.
 *    Fluent was never used as a component library here (a single `<Spinner>`
 *    was the only mounted component) — it was a colour generator, and this is
 *    the thing that generated colours.
 *
 * IMPORTANT for consumers: these are CSS value strings, not colours you can do
 * arithmetic on. Never concatenate an alpha suffix (`${color}80`) or slice a
 * hex — use `withAlpha`/`accentWash` from utils/color, which wrap `color-mix`.
 */

/**
 * The Fluent-native color fields that components still read directly
 * (`theme.colorBrandForeground1` and friends).
 *
 * These are kept because ~24 files reference them; re-pointing each call site
 * is page-migration work, not foundation work. The names are Fluent's, the
 * values are ours.
 */
export interface ITokenColors {
  colorBrandBackground: string;
  colorBrandBackground2: string;
  colorBrandForeground1: string;
  colorBrandForeground2: string;
  colorBrandForegroundLink: string;

  colorNeutralBackground1: string;
  colorNeutralBackground1Hover: string;
  colorNeutralBackground2: string;
  colorNeutralBackground2Hover: string;
  colorNeutralBackground3: string;

  colorNeutralForeground1: string;
  colorNeutralForeground2: string;
  colorNeutralForeground3: string;
  colorNeutralForegroundDisabled: string;
  colorNeutralForegroundOnBrand: string;

  colorNeutralStroke1: string;
  colorNeutralStroke2: string;

  colorPaletteBlueForeground2: string;
  colorPaletteRoyalBlueForeground2: string;

  colorPaletteRedForeground1: string;
  colorPaletteRedForeground3: string;
  colorPaletteRedBackground2: string;

  colorPaletteGreenForeground1: string;
  colorPaletteGreenForeground2: string;
  colorPaletteGreenForeground3: string;

  colorPaletteYellowForeground1: string;
  colorPaletteYellowForeground2: string;
  colorPaletteYellowForeground3: string;
}

export const tokenColors: ITokenColors = {
  colorBrandBackground: 'var(--tw-surface-inset)',
  colorBrandBackground2: 'var(--tw-surface-alt)',
  colorBrandForeground1: 'var(--tw-accent)',
  colorBrandForeground2: 'var(--tw-accent-active)',
  colorBrandForegroundLink: 'var(--tw-accent-hover)',

  colorNeutralBackground1: 'var(--tw-surface-card)',
  colorNeutralBackground1Hover: 'var(--tw-hover-fill)',
  colorNeutralBackground2: 'var(--tw-surface-alt)',
  colorNeutralBackground2Hover: 'var(--tw-hover-fill)',
  colorNeutralBackground3: 'var(--tw-surface-raised)',

  colorNeutralForeground1: 'var(--tw-text-body)',
  colorNeutralForeground2: 'var(--tw-text-muted)',
  colorNeutralForeground3: 'var(--tw-text-faint)',
  colorNeutralForegroundDisabled: 'var(--tw-text-faint)',
  colorNeutralForegroundOnBrand: 'var(--tw-accent-ink)',

  colorNeutralStroke1: 'var(--tw-border)',
  colorNeutralStroke2: 'var(--tw-border-subtle)',

  colorPaletteBlueForeground2: 'var(--tw-info)',
  colorPaletteRoyalBlueForeground2: 'var(--tw-indigo)',

  // Status ramps. Fluent's 1/2/3 suffixes are base / hover / pressed here.
  colorPaletteRedForeground1: 'var(--tw-error)',
  colorPaletteRedForeground3: 'var(--tw-error-border)',
  colorPaletteRedBackground2: 'var(--tw-error-bg)',

  colorPaletteGreenForeground1: 'var(--tw-success)',
  colorPaletteGreenForeground2: 'var(--tw-success)',
  colorPaletteGreenForeground3: 'var(--tw-success-border)',

  colorPaletteYellowForeground1: 'var(--tw-warning)',
  colorPaletteYellowForeground2: 'var(--tw-warning)',
  colorPaletteYellowForeground3: 'var(--tw-warning-border)',
};

/**
 * v8-style palette compatibility layer.
 *
 * `themePrimary` is the most-read key in the codebase (61 sites) and is the
 * resting-state colour for every card, so its mapping matters most.
 */
export const tokenPalette = {
  // Brand
  themePrimary: 'var(--tw-accent)',
  themeLighterAlt: 'var(--tw-surface-inset)',
  themeLighter: 'var(--tw-surface-alt)',
  themeLight: 'var(--tw-accent-hover)',
  themeTertiary: 'var(--tw-accent)',
  themeSecondary: 'var(--tw-accent-hover)',
  themeDarkAlt: 'var(--tw-accent-active)',
  themeDark: 'var(--tw-accent-active)',
  themeDarker: 'var(--tw-accent-active)',

  // Neutrals — surfaces
  neutralLighterAlt: 'var(--tw-surface-card)',
  neutralLighter: 'var(--tw-hover-fill)',
  neutralLight: 'var(--tw-surface-alt)',
  neutralQuaternaryAlt: 'var(--tw-surface-raised)',

  // Neutrals — strokes
  neutralQuaternary: 'var(--tw-border)',
  neutralTertiaryAlt: 'var(--tw-border-subtle)',

  // Neutrals — text
  neutralTertiary: 'var(--tw-text-faint)',
  neutralSecondary: 'var(--tw-text-muted)',
  neutralSecondaryAlt: 'var(--tw-text-muted)',
  neutralPrimaryAlt: 'var(--tw-text-body)',
  neutralPrimary: 'var(--tw-text-body)',
  neutralDark: 'var(--tw-text-faint)',

  // "Fixed" colours — not literal black and white. These followed the surface
  // ladder before this change too (white was colorNeutralBackground1, which is
  // dark in dark mode), so the names are historical rather than descriptive.
  black: 'var(--tw-text-bright)',
  white: 'var(--tw-surface-card)',

  redDark: 'var(--tw-error)',
} as const;

export type ITokenPalette = typeof tokenPalette;
