/**
 * TERENCEWATERS.COM THEME SYSTEM
 * ===============================
 *
 * Philosophy: Professional precision with deep navy brand identity
 * Style: Clean, modern design with sophisticated color palette
 *
 * DESIGN PRINCIPLES:
 * ------------------
 * • Brand consistency: Deep navy blue primary for trust and professionalism
 * • Unified typography: Modern sans-serif stack for clarity
 * • Technical precision: Roboto Mono for code blocks
 * • Smooth animations: Carefully tuned easing for fluid interactions
 *
 * COLOR PHILOSOPHY:
 * -----------------
 * • Primary: Vivid royal blue (#1854b4 light / #5b94ec dark) for energy and trust
 * • Accent Teal: Bright cyan-teal (#0aada0) for highlights and decorative elements
 * • Accent Yellow: Warm golden amber (#a07800) for secondary accents
 * • Light Mode: Clean whites and subtle grays for clarity
 * • Dark Mode: Rich darks with saturated blues for focus
 * • High contrast ratios for accessibility
 *
 * @version 1.0.0 - TerenceWaters.com Design System
 * @author TerenceWaters.com
 */

import {
  tokenColors,
  tokenPalette,
  type ITokenColors,
  type ITokenPalette,
} from './tokenColors';


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type TypographyVariant =
  | 'tiny'
  | 'xSmall'
  | 'small'
  | 'medium'
  | 'mediumPlus'
  | 'large'
  | 'xLarge'
  | 'xxLarge'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'bodySmall'
  | 'label'
  | 'quote'
  | 'blockquote'
  | 'code'
  | 'pre'
  | 'caption'
  | 'cardTitle'
  | 'cardSubtitle'
  | 'cardBody'
  | 'cardMeta';

/**
 * Palette compatibility layer, originally mapping Fluent v8 names onto v9
 * tokens. The v8 names survive because ~200 call sites use them; the values
 * come from the design system now. See theme/tokenColors.ts.
 */
export type IPalette = ITokenPalette;

/**
 * The application theme.
 *
 * This used to extend Fluent's `Theme`, which meant every consumer of
 * `useAppTheme().theme` transitively depended on Fluent's generated shape — the
 * single thing keeping @fluentui/react-components load-bearing. It now extends
 * ITokenColors, which declares just the 28 colour fields the codebase actually
 * reads, with design system tokens behind them.
 */
export interface IExtendedTheme extends ITokenColors {
  spacing: IExtendedSpacing;
  animations: typeof animations;
  borderRadius: typeof borderRadius;
  zIndices: typeof zIndices;
  shadows: typeof shadows;
  gradients: typeof gradients;
  breakpoints: typeof breakpoints;
  mediaQueries: typeof mediaQueries;
  typography: typeof typography;
  semanticColors: ISemanticColors;
  palette: IPalette; // v8 compatibility layer
  themeMode: ThemeMode;
}

export interface ISemanticColors {
  text: {
    primary: string;
    heading: string;
    muted: string;
    disabled: string;
  };
  link: {
    default: string;
    hover: string;
    visited: string;
    active: string;
    footer?: string; // Optional muted color for footer links
  };
  background: {
    base: string;
    elevated: string;
    muted: string;
  };
  border: {
    default: string;
    muted: string;
    emphasis: string;
  };
  selection: {
    background: string;
    text: string;
  };
  focus: {
    ring: string;
    outline: string;
  };
  accent: {
    teal: string; // Bright teal for decorative accents, highlights, badges
    tealSubtle: string; // Soft teal-tinted background
    yellow: string; // Muted golden yellow for secondary accents
    yellowSubtle: string; // Soft amber-tinted background
  };
}

export interface IExtendedSpacing {
  none: string;
  xxs: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
  xxxl: string;
  xxxxl: string;
  menuButton: string;
  // FluentUI compatibility
  base: string;
  s3: string;
  s2: string;
  s1: string;
  l1: string;
  l2: string;
}

// The mode union and the light/dark split live in ./modes so that the CSS
// tokens, the React hooks and the pre-hydration script all derive from one list.
export type { ThemeMode } from './modes';
import type { ThemeMode } from './modes';
// ============================================================================
// SEMANTIC COLORS - Text & Interactive States
// ============================================================================

/**
 * Semantic colour roles, mapped onto design system tokens.
 *
 * There used to be eight of these — one per theme mode — each a full set of hex
 * literals. They are now a single object of `var(--tw-*)` references, because
 * the mode switching happens in CSS. Changing a colour means editing the token,
 * once, and every mode follows.
 */
export const semanticColors: ISemanticColors = {
  text: {
    primary: 'var(--tw-text-body)',
    heading: 'var(--tw-text-heading)',
    muted: 'var(--tw-text-muted)',
    disabled: 'var(--tw-text-faint)',
  },
  link: {
    default: 'var(--tw-accent)',
    hover: 'var(--tw-accent-hover)',
    visited: 'var(--tw-accent-active)',
    active: 'var(--tw-accent-active)',
    footer: 'var(--tw-text-muted)',
  },
  background: {
    base: 'var(--tw-bg-page)',
    elevated: 'var(--tw-surface-card)',
    muted: 'var(--tw-surface-alt)',
  },
  border: {
    default: 'var(--tw-border)',
    muted: 'var(--tw-border-subtle)',
    emphasis: 'var(--tw-border-strong)',
  },
  selection: {
    background: 'var(--tw-accent)',
    text: 'var(--tw-accent-ink)',
  },
  focus: {
    ring: 'var(--tw-accent)',
    outline: 'var(--tw-accent-hover)',
  },
  accent: {
    teal: 'var(--tw-teal)',
    tealSubtle: 'var(--tw-teal-bg)',
    yellow: 'var(--tw-gold)',
    yellowSubtle: 'var(--tw-gold-bg)',
  },
};


// ============================================================================
// CONSTANTS
// ============================================================================

// Base font size for rem calculations (16px)
export const BASE_FONT_SIZE = 16;

// ============================================================================
// BREAKPOINTS & MEDIA QUERIES
// ============================================================================

// Breakpoints in pixels
export const breakpoints = {
  xs: 0, // mobile
  sm: 576, // small tablet
  md: 768, // tablet
  lg: 1024, // small desktop / iPad Pro
  xl: 1366, // large desktop
  xxl: 1920, // high-resolution desktop
};

// Media queries
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px) and (max-width: ${breakpoints.sm - 1}px)`,
  sm: `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  md: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lg: `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  xl: `(min-width: ${breakpoints.xl}px) and (max-width: ${breakpoints.xxl - 1}px)`,
  xxl: `(min-width: ${breakpoints.xxl}px)`,
};

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * TW.com Spacing System - Consistent Rhythm
 *
 * Base unit: 1rem for consistent rhythm throughout the design
 * Philosophy: Balanced spacing creates clarity and hierarchy
 */
export const spacing: IExtendedSpacing = {
  // FluentUI required properties
  s2: '0.125rem',
  s1: '0.25rem',
  s3: '0.5rem',
  m: '1rem', // Base rhythm unit
  l1: '1.25rem',
  l2: '2rem',

  // TW.com custom spacing system
  none: '0',
  xxs: '0.25rem',
  xs: '0.5rem',
  s: '0.75rem',
  base: '1rem',
  l: '1.5rem',
  xl: '2rem',
  xxl: '2.5rem',
  xxxl: '3rem',
  xxxxl: '4rem',
  menuButton: '0.5rem 1rem 0 0',
};

// ============================================================================
// Z-INDEX SYSTEM
// ============================================================================

export const zIndices = {
  hide: -1,
  auto: 0,
  base: 1,
  above: 2,
  dropdown: 3,
  menu: 4,
  tooltip: 5,
  popover: 6,
  modal: 10,
  overlay: 11,
  toast: 16,
  max: 999,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  s: '0.25rem',
  m: '0.5rem',
  l: '1rem',
  xl: '2rem',

  container: {
    tiny: 'clamp(0.25rem, 0.5cqi, 0.25rem)',
    small: 'clamp(0.5rem, 1cqi, 0.5rem)',
    medium: 'clamp(0.75rem, 1.5cqi, 0.75rem)',
    large: 'clamp(1rem, 2cqi, 1rem)',
    xlarge: 'clamp(1.5rem, 3cqi, 1.5rem)',
    xxlarge: 'clamp(2rem, 4cqi, 2rem)',
    huge: 'clamp(3rem, 6cqi, 3rem)',
    xhuge: 'clamp(4rem, 8cqi, 4rem)',

    // Use-case specific
    card: 'clamp(0.5rem, 1cqi, 0.5rem)',
    button: 'clamp(0.25rem, 0.5cqi, 0.25rem)',
    input: 'clamp(0.25rem, 0.5cqi, 0.25rem)',
    tooltip: 'clamp(0.25rem, 0.5cqi, 0.25rem)',
    hero: 'clamp(1.5rem, 3cqi, 1.5rem)',
    modal: 'clamp(2rem, 4cqi, 2rem)',
    toast: 'clamp(0.5rem, 1cqi, 0.5rem)',
  },
};

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  s: '0 1px 3px rgba(0, 0, 0, 0.12)',
  m: '0 2px 6px rgba(0, 0, 0, 0.15)',
  l: '0 4px 12px rgba(0, 0, 0, 0.18)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.24)',

  // Use-case specific
  card: '0 1px 3px rgba(0, 0, 0, 0.12)',
  button: '0 2px 6px rgba(0, 0, 0, 0.15)',
  input: '0 4px 12px rgba(0, 0, 0, 0.18)',
  tooltip: '0 8px 24px rgba(0, 0, 0, 0.24)',
  hero: '0 16px 48px rgba(0, 0, 0, 0.32)',
  modal: '0 32px 96px rgba(0, 0, 0, 0.4)',
  toast: '0 16px 48px rgba(0, 0, 0, 0.32)',
  menu: '0 0 20px rgba(0, 0, 0, 0.15)',
  cardImage: '4px 4px 8px rgba(0, 0, 0, 0.7)',
  cardElevated: '0 8px 16px rgba(0, 0, 0, 0.2)',
};

// ============================================================================
// GRADIENTS
// ============================================================================

/**
 * TW.com Gradients - Subtle Visual Depth
 *
 * Dark mode optimized with rich darks for focused aesthetic
 * Light mode with clean, minimal gradients for clarity
 */
export const gradients = {
  dark: {
    solid: '#121212',
    background:
      '#282828 radial-gradient(circle at 22% 48%, #4D535A 0%, #313132 34%, #3E4145 68%, #2F2F30 100%)',
    menu: '#282828 radial-gradient(circle at 80% 50%, #4D535A 0%, #3E4145 30%, #313132 70%, #2F2F30 100%)',
    radial:
      '#282828 radial-gradient(circle at center, #4D535A 0%, #3E4145 30%, #313132 70%, #2F2F30 100%)',
    vignette: 'radial-gradient(circle at center, transparent 0%, #2F2F30 100%)',
    linear:
      'linear-gradient(90deg, #282828 0%, #4D535A 50%, #282828 100%) no-repeat center',
  },
  grayscaleDark: {
    solid: '#121212',
    background:
      '#282828 radial-gradient(circle at 22% 48%, #616161 0%, #313132 34%, #3E4145 68%, #2F2F30 100%)',
    menu: '#282828 radial-gradient(circle at 80% 50%, #616161 0%, #3E4145 30%, #313132 70%, #2F2F30 100%)',
    radial:
      '#282828 radial-gradient(circle at center, #616161 0%, #3E4145 30%, #313132 70%, #2F2F30 100%)',
    vignette: 'radial-gradient(circle at center, transparent 0%, #2F2F30 100%)',
    linear:
      'linear-gradient(90deg, #282828 0%, #616161 50%, #282828 100%) no-repeat center',
  },
  highContrast: {
    solid: '#000000',
    background: '#000000',
    menu: '#000000',
    radial: '#000000',
    vignette: 'radial-gradient(circle at center, transparent 0%, #000000 100%)',
    linear:
      'linear-gradient(90deg, #000000 0%, #121212 50%, #000000 100%) no-repeat center',
  },
  light: {
    solid: '#DADADA',
    background: '#D7D1D1 radial-gradient(at right bottom, #EFEFEF, #D7D5D5)',
    menu: '#DADADA radial-gradient(at right bottom, #EFEFEF, #D7D5D5)',
    radial:
      '#DADADA radial-gradient(circle at center, #EFEFEF 0%, #E5E3E3 30%, #D7D5D5 70%, #D0CECD 100%)',
    vignette: 'radial-gradient(circle at center, transparent 0%, #D7D5D5 100%)',
    linear:
      'linear-gradient(90deg, #D7D5D5 0%, #EFEFEF 50%, #D7D5D5 100%) no-repeat center',
  },
  components: {
    card: {
      dark: 'linear-gradient(135deg, #242424 0%, #1F1F1F 100%)',
      light: 'linear-gradient(135deg, #FFFFFF 0%, #F5F6F8 100%)',
    },
    button: {
      dark: 'linear-gradient(90deg, #242424 0%, #1F1F1F 100%)',
      light: 'linear-gradient(90deg, #FFFFFF 0%, #F5F6F8 100%)',
    },
    modal: {
      dark: '#1F1F1F radial-gradient(circle at center, #2A2A2A 0%, #242424 30%, #1F1F1F 100%)',
      light:
        '#FFFFFF radial-gradient(circle at center, #FFFFFF 0%, #F8F9FA 30%, #F3F4F6 100%)',
    },
  },
  ai: {
    /** Purple stop of the AI brand gradient */
    from: '#A855F7',
    /** Blue stop of the AI brand gradient */
    to: '#3B82F6',
    /** Ready-to-use CSS linear-gradient string for AI-themed elements */
    linear: 'linear-gradient(135deg, #A855F7, #3B82F6)',
  },
};

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

/**
 * TW.com Animation System - Smooth & Professional
 *
 * Easing: Carefully tuned for smooth, intentional motion
 * Duration: Balanced for responsiveness without jarring transitions
 */
export const animations = {
  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom cubic-bezier for smooth motion
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Duration presets
  duration: {
    instant: '0ms',
    fastest: '100ms',
    faster: '150ms',
    fast: '200ms',
    normal: '300ms',
    slow: '400ms',
    slower: '500ms',
    slowest: '600ms',
  },

  // Common animation patterns
  transition: {
    default: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Typography Configuration - TW.com Professional System
 *
 * Philosophy: Clean, modern sans-serif for readability and professionalism
 * Technical content: Monospace for code blocks
 *
 * Fonts:
 * - Roboto Flex: Modern, flexible sans-serif for all text
 * - Proxima Nova: Premium sans-serif for headings
 * - Roboto Mono: Technical precision for code
 */

export const fontFamily = {
  // Body text - Merriweather for authority and readability (matches book)
  base: 'merriweather, Georgia, "Times New Roman", serif',
  // Headings - Montserrat for modern geometric feel (matches book cover/chapters)
  heading:
    'montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  // Code blocks - Roboto Mono for technical content
  mono: 'Roboto Mono, "Courier New", monospace',
  // Metadata/captions - Roboto Condensed for compact info
  condensed: 'roboto-condensed, "Arial Narrow", sans-serif',
};

export const fontSizes = {
  xs: 'clamp(0.25rem, 0.5cqi, 0.25rem)',
  sm: 'clamp(0.5rem, 1cqi, 0.5rem)',
  md: 'clamp(0.75rem, 1.5cqi, 0.75rem)',
  base: '1rem', // Base rhythm unit
  lg: 'clamp(1.25rem, 2.5cqi, 1.25rem)',
  xl: 'clamp(1.5rem, 3cqi, 1.5rem)',
  xxl: 'clamp(2rem, 4cqi, 2rem)',
  xxxl: 'clamp(3rem, 6cqi, 3rem)',
  xxxxl: 'clamp(4rem, 8cqi, 4rem)',
};

export const typography = {
  fontFamilies: {
    base: fontFamily.base,
    mono: fontFamily.mono,
    heading: fontFamily.heading,
    condensed: fontFamily.condensed,
    h1: fontFamily.heading,
    h2: fontFamily.heading,
    h3: fontFamily.heading,
    h4: fontFamily.heading,
    h5: fontFamily.heading,
    h6: fontFamily.heading,
    p: fontFamily.base,
  },

  // Font sizes with modular scale
  fontSizes: fontSizes,

  fontWeights: {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },

  // Font definitions
  fonts: {
    tiny: {
      fontFamily: fontFamily.condensed,
      fontSize: fontSizes.xs,
      fontWeight: '300' as const,
      letterSpacing: '0.02em',
      lineHeight: '1.4',
    },
    xSmall: {
      fontFamily: fontFamily.base,
      fontSize: 'clamp(0.75rem, 1cqi, 0.875rem)',
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.6',
    },
    small: {
      fontFamily: fontFamily.base,
      fontSize: 'clamp(0.875rem, 1.25cqi, 1rem)',
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.7',
    },
    medium: {
      fontFamily: fontFamily.base,
      fontSize: fontSizes.base,
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.75',
    },
    mediumPlus: {
      fontFamily: fontFamily.base,
      fontSize: 'clamp(1.125rem, 2cqi, 1.375rem)',
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.7',
    },
    large: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(1.25rem, 2.5cqi, 1.75rem)',
      fontWeight: '600' as const,
      letterSpacing: '-0.01em',
      lineHeight: '1.3',
    },
    xLarge: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(1.5rem, 3.5cqi, 2.25rem)',
      fontWeight: '700' as const,
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
    },
    xxLarge: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(2rem, 5cqi, 3.5rem)',
      fontWeight: '800' as const,
      letterSpacing: '-0.02em',
      lineHeight: '1.1',
    },

    // Headings - Montserrat (matching book chapter titles)
    h1: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(2.5rem, 8cqi, 4rem)',
      fontWeight: '800' as const, // Extra Bold like book chapter titles
      letterSpacing: '-0.02em',
      textTransform: 'uppercase' as const, // Like "THE RESONANCE CORE FRAMEWORK"
      lineHeight: '1.1',
    },
    h2: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(2rem, 5cqi, 2.75rem)',
      fontWeight: '700' as const, // Bold
      letterSpacing: '-0.015em',
      textTransform: 'uppercase' as const,
      lineHeight: '1.15',
    },
    h3: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(1.5rem, 3.5cqi, 2rem)',
      fontWeight: '600' as const, // Semi-Bold
      letterSpacing: '-0.01em',
      lineHeight: '1.25',
    },
    h4: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(1.25rem, 2.5cqi, 1.5rem)',
      fontWeight: '600' as const,
      letterSpacing: '0',
      lineHeight: '1.35',
    },
    h5: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(1.125rem, 2cqi, 1.25rem)',
      fontWeight: '500' as const, // Medium
      letterSpacing: '0.01em',
      lineHeight: '1.4',
    },
    h6: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(0.875rem, 1cqi, 1rem)',
      fontWeight: '300' as const, // Light (like book chapter numbers)
      letterSpacing: '0.15em', // Wide tracking like "CHAPTER 1"
      textTransform: 'uppercase' as const,
      lineHeight: '1.5',
    },

    // Body text - Merriweather (matching book body)
    body: {
      fontFamily: fontFamily.base,
      fontSize: 'clamp(1rem, 2cqi, 1.125rem)',
      fontWeight: '400' as const, // Regular like book (10-11pt)
      letterSpacing: '0',
      lineHeight: '1.75', // Comfortable reading
    },
    bodySmall: {
      fontFamily: fontFamily.base,
      fontSize: 'clamp(0.875rem, 1.75cqi, 1rem)',
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.65',
    },

    // Special use cases
    label: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(0.75rem, 1.5cqi, 0.875rem)',
      fontWeight: '500' as const,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      lineHeight: '1.3',
    },
    quote: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(1.25rem, 2.5cqi, 1.5rem)',
      fontWeight: '500' as const, // Medium
      fontStyle: 'italic' as const, // Matching book pull quotes
      letterSpacing: '0',
      lineHeight: '1.6',
    },
    blockquote: {
      fontFamily: fontFamily.base,
      fontSize: 'clamp(1.125rem, 2.25cqi, 1.25rem)',
      fontWeight: '400' as const,
      fontStyle: 'italic' as const,
      letterSpacing: '0',
      lineHeight: '1.75',
    },
    code: {
      fontFamily: fontFamily.mono,
      fontSize: 'clamp(0.875rem, 1.75cqi, 0.9375rem)',
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.5',
    },
    pre: {
      fontFamily: fontFamily.mono,
      fontSize: 'clamp(0.875rem, 1.75cqi, 0.9375rem)',
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.6',
    },
    caption: {
      fontFamily: fontFamily.condensed,
      fontSize: 'clamp(0.75rem, 1.5cqi, 0.875rem)',
      fontWeight: '300' as const, // Light like book captions
      letterSpacing: '0.02em',
      lineHeight: '1.4',
    },

    // Card-specific typography
    cardTitle: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(1.25rem, 2.5cqi, 1.5rem)',
      fontWeight: '700' as const, // Bold for hierarchy
      letterSpacing: '-0.01em',
      lineHeight: '1.3',
    },
    cardSubtitle: {
      fontFamily: fontFamily.heading,
      fontSize: 'clamp(0.875rem, 1.75cqi, 1rem)',
      fontWeight: '500' as const,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      lineHeight: '1.4',
    },
    cardBody: {
      fontFamily: fontFamily.base,
      fontSize: 'clamp(0.9375rem, 1.875cqi, 1rem)',
      fontWeight: '400' as const,
      letterSpacing: '0',
      lineHeight: '1.65',
    },
    cardMeta: {
      fontFamily: fontFamily.condensed,
      fontSize: 'clamp(0.75rem, 1.5cqi, 0.875rem)',
      fontWeight: '300' as const, // Light for metadata
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      lineHeight: '1.3',
    },
  },

  lineHeights: {
    tight: 1.2,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.75,
  },

  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.15em',
  },

  textShadows: {
    h1: '2px 4px 4px rgba(0, 0, 0, 0.5)',
    h2: '1px 2px 3px rgba(0, 0, 0, 0.5)',
    h3: '1px 2px 2px rgba(0, 0, 0, 0.4)',
    h4: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    h5: '1px 1px 1px rgba(0, 0, 0, 0.2)',
    h6: '0px 1px 1px rgba(0, 0, 0, 0.1)',
    light: '0px 3px 6px rgba(0, 0, 0, 0.5)',
    dark: '0px 3px 6px rgba(243, 243, 243, 0.5)',
    text: '1px 2px 3px rgba(0, 0, 0, 0.9)',
    card: '0px 3px 3px 0px rgba(0, 0, 0, 0.5)',
  },
};

// ============================================================================
// THEME CREATION
// ============================================================================


// ============================================================================
// THEME OBJECTS
// ============================================================================

/**
 * Build a theme for a mode.
 *
 * Colour no longer varies here. Every colour value is a `var(--tw-*)`
 * reference, and the CSS custom properties themselves change per mode via the
 * `data-theme` attribute on <html> (see styles/tokens/colors.css and
 * colors-modes.css). So all eight themes share one palette and differ only by
 * `themeMode`.
 *
 * This is what replaced eight `createLightTheme`/`createDarkTheme` calls, eight
 * BrandVariants ramps and eight semanticColors objects — roughly 700 lines of
 * hand-maintained hex that had to be kept in sync with the design system by
 * hand, and wasn't.
 */
const createTheme = (themeMode: ThemeMode): IExtendedTheme => ({
  ...tokenColors,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors,
  palette: tokenPalette,
  themeMode,
});

export const twLightTheme = createTheme('light');
export const twDarkTheme = createTheme('dark');
export const twHighContrastTheme = createTheme('high-contrast');
export const twProtanopiaTheme = createTheme('protanopia');
export const twDeuteranopiaTheme = createTheme('deuteranopia');
export const twTritanopiaTheme = createTheme('tritanopia');
export const twGrayscaleTheme = createTheme('grayscale');
export const twGrayscaleDarkTheme = createTheme('grayscale-dark');


// Theme map for easy access
export const themeMap: Record<ThemeMode, IExtendedTheme> = {
  light: twLightTheme,
  dark: twDarkTheme,
  'high-contrast': twHighContrastTheme,
  protanopia: twProtanopiaTheme,
  deuteranopia: twDeuteranopiaTheme,
  tritanopia: twTritanopiaTheme,
  grayscale: twGrayscaleTheme,
  'grayscale-dark': twGrayscaleDarkTheme,
};

// Default export is the light theme; can be swapped at runtime
export const twTheme = twLightTheme;
