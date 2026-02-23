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
 * • Primary: Deep navy blues (#1a3667 to #2654a0) for structure and trust
 * • Light Mode: Clean whites and subtle grays for clarity
 * • Dark Mode: Rich darks with subtle gradients for focus
 * • High contrast ratios for accessibility
 *
 * @version 1.0.0 - TerenceWaters.com Design System
 * @author TerenceWaters.com
 */

import {
  BrandVariants,
  createLightTheme,
  createDarkTheme,
  Theme,
} from '@fluentui/react-components';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface IExtendedTheme extends Theme {
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
  s2: string;
  s1: string;
  l1: string;
  l2: string;
}

export type ThemeMode =
  | 'light'
  | 'dark'
  | 'high-contrast'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'grayscale'
  | 'grayscale-dark';

// ============================================================================
// BRAND COLORS
// ============================================================================

// TerenceWaters.com brand palette - deep navy blue primary (Light Mode)
const twBrand: BrandVariants = {
  10: '#020408',
  20: '#0d1a2e',
  30: '#122341',
  40: '#162d54',
  50: '#1a3667',
  60: '#1e407a',
  70: '#224a8d',
  80: '#2654a0',
  90: '#2a5eb3',
  100: '#3269c0',
  110: '#4478c8',
  120: '#5688d0',
  130: '#6898d8',
  140: '#7aa8df',
  150: '#8eb9e7',
  160: '#a3caef',
};

// Dark theme brand palette
const twBrandDark: BrandVariants = {
  10: '#1a2a3f',
  20: '#2d4562',
  30: '#3F5FA1',
  40: '#445F7E',
  50: '#637a99',
  60: '#8295b0',
  70: '#A5C0E1',
  80: '#B8CCEB',
  90: '#CAD9F2',
  100: '#d4e0f5',
  110: '#dee7f7',
  120: '#E2EAF6',
  130: '#e8eef9',
  140: '#EDF2F9',
  150: '#f2f6fb',
  160: '#F5F8FC',
};

// High contrast brand palette
const twBrandHighContrast: BrandVariants = {
  10: '#000000',
  20: '#0a0a0a',
  30: '#121212',
  40: '#1a1a1a',
  50: '#222222',
  60: '#2a2a2a',
  70: '#3399FF',
  80: '#4da6ff',
  90: '#66b3ff',
  100: '#80c0ff',
  110: '#99ccff',
  120: '#b3d9ff',
  130: '#cce6ff',
  140: '#d9ecff',
  150: '#e6f3ff',
  160: '#F8F8F8',
};

// Protanopia (red-blind) brand palette
const twBrandProtanopia: BrandVariants = {
  10: '#001428',
  20: '#002850',
  30: '#003e72',
  40: '#004578',
  50: '#005299',
  60: '#005A9E',
  70: '#0066bb',
  80: '#0078D4',
  90: '#2B88D8',
  100: '#4494dc',
  110: '#5da0e0',
  120: '#71AFE5',
  130: '#8abee9',
  140: '#a3cded',
  150: '#C7E0F4',
  160: '#EFF6FC',
};

// Deuteranopia (green-blind) brand palette
const twBrandDeuteranopia: BrandVariants = {
  10: '#001428',
  20: '#002034',
  30: '#002850',
  40: '#003564',
  50: '#004578',
  60: '#00528c',
  70: '#0063B1',
  80: '#0070c5',
  90: '#2680d9',
  100: '#4894FE',
  110: '#5f9ffe',
  120: '#76aafe',
  130: '#8db5fe',
  140: '#a4c1ff',
  150: '#C7E0F4',
  160: '#EFF6FC',
};

// Tritanopia (blue-blind) brand palette
const twBrandTritanopia: BrandVariants = {
  10: '#1a0505',
  20: '#340a0a',
  30: '#4e0f0f',
  40: '#761721',
  50: '#8f1c28',
  60: '#A4262C',
  70: '#bd2b33',
  80: '#D13438',
  90: '#db4d51',
  100: '#e5666a',
  110: '#ef7f83',
  120: '#f9989c',
  130: '#ffb1b5',
  140: '#ffcace',
  150: '#E8A3A3',
  160: '#FEF4F4',
};

// Grayscale (light) brand palette
const twBrandGrayscale: BrandVariants = {
  10: '#000000',
  20: '#0d0d0d',
  30: '#1A1A1A',
  40: '#262626',
  50: '#333333',
  60: '#404040',
  70: '#4d4d4d',
  80: '#666666',
  90: '#737373',
  100: '#808080',
  110: '#8c8c8c',
  120: '#999999',
  130: '#a6a6a6',
  140: '#b3b3b3',
  150: '#D9D9D9',
  160: '#F8F8F8',
};

// Grayscale dark brand palette
const twBrandGrayscaleDark: BrandVariants = {
  10: '#000000',
  20: '#0d0d0d',
  30: '#1a1a1a',
  40: '#262626',
  50: '#333333',
  60: '#404040',
  70: '#4d4d4d',
  80: '#666666',
  90: '#808080',
  100: '#8c8c8c',
  110: '#999999',
  120: '#a6a6a6',
  130: '#bfbfbf',
  140: '#d9d9d9',
  150: '#e6e6e6',
  160: '#ffffff',
};

// ============================================================================
// SEMANTIC COLORS - Text & Interactive States
// ============================================================================

/**
 * Accessible text and interactive colors for all 8 theme modes
 * Designed for WCAG AAA compliance with book-inspired minimalism
 */

// Light Mode (default light theme)
export const semanticColorsLight = {
  text: {
    primary: '#1a1a1a', // Body text - near black
    heading: '#0d0d0d', // Headings - true black
    muted: '#666666', // Captions, metadata
    disabled: '#999999', // Disabled text
  },
  link: {
    default: '#1a3667', // Deep navy (brand primary)
    hover: '#2654a0', // Lighter navy on hover
    visited: '#224a8d', // Slightly different for visited
    active: '#122341', // Darker on click
    footer: '#4a5568', // Muted gray-blue for footer
  },
  background: {
    base: '#ffffff', // Page background
    elevated: '#f8f8f8', // Cards, elevated surfaces
    muted: '#f0f0f0', // Subtle backgrounds
  },
  border: {
    default: '#e0e0e0', // Default borders
    muted: '#f0f0f0', // Subtle borders
    emphasis: '#1a3667', // Emphasized borders
  },
  selection: {
    background: '#a3caef', // Text selection background
    text: '#0d0d0d', // Text selection color
  },
  focus: {
    ring: '#2654a0', // Focus ring color
    outline: '#1a3667', // Focus outline
  },
};

// Dark Mode (default dark theme - primary mode)
export const semanticColorsDark = {
  text: {
    primary: '#e6e6e6', // Body text - near white
    heading: '#f5f5f5', // Headings - true white
    muted: '#999999', // Captions, metadata
    disabled: '#666666', // Disabled text
  },
  link: {
    default: '#8eb9e7', // Light navy (accessible on dark)
    hover: '#a3caef', // Lighter on hover
    visited: '#7aa8df', // Slightly different for visited
    active: '#b8cceb', // Brighter on click
    footer: '#bec4ce', // Muted gray-blue for footer (lighter on dark)
  },
  background: {
    base: '#1a1a1a', // Page background
    elevated: '#242424', // Cards, elevated surfaces
    muted: '#2a2a2a', // Subtle backgrounds
  },
  border: {
    default: '#404040', // Default borders
    muted: '#333333', // Subtle borders
    emphasis: '#8eb9e7', // Emphasized borders
  },
  selection: {
    background: '#3F5FA1', // Text selection background
    text: '#ffffff', // Text selection color
  },
  focus: {
    ring: '#8eb9e7', // Focus ring color
    outline: '#a3caef', // Focus outline
  },
};

// High Contrast Mode
export const semanticColorsHighContrast = {
  text: {
    primary: '#ffffff', // Pure white on black
    heading: '#ffffff', // Pure white
    muted: '#b3d9ff', // Light blue for muted
    disabled: '#666666', // Gray for disabled
  },
  link: {
    default: '#3399FF', // Bright blue (high contrast)
    hover: '#66b3ff', // Lighter blue on hover
    visited: '#80c0ff', // Even lighter for visited
    active: '#4da6ff', // Active state
    footer: '#99ccff', // Bright but softer for footer
  },
  background: {
    base: '#000000', // Pure black
    elevated: '#121212', // Slightly elevated
    muted: '#1a1a1a', // Muted surfaces
  },
  border: {
    default: '#ffffff', // White borders for contrast
    muted: '#666666', // Gray for subtle
    emphasis: '#3399FF', // Bright blue emphasis
  },
  selection: {
    background: '#3399FF', // Bright blue selection
    text: '#000000', // Black text
  },
  focus: {
    ring: '#66b3ff', // Bright focus ring
    outline: '#3399FF', // Bright outline
  },
};

// Protanopia (Red-Blind) Mode
export const semanticColorsProtanopia = {
  text: {
    primary: '#1a1a1a',
    heading: '#0d0d0d',
    muted: '#666666',
    disabled: '#999999',
  },
  link: {
    default: '#005299', // Strong blue (no red component)
    hover: '#0078D4', // Brighter blue
    visited: '#004578', // Darker blue
    active: '#0066bb', // Active blue
    footer: '#4a7ba7', // Muted blue for footer
  },
  background: {
    base: '#ffffff',
    elevated: '#f8f8f8',
    muted: '#f0f0f0',
  },
  border: {
    default: '#e0e0e0',
    muted: '#f0f0f0',
    emphasis: '#005299',
  },
  selection: {
    background: '#C7E0F4',
    text: '#0d0d0d',
  },
  focus: {
    ring: '#0078D4',
    outline: '#005299',
  },
};

// Deuteranopia (Green-Blind) Mode
export const semanticColorsDeuteranopia = {
  text: {
    primary: '#1a1a1a',
    heading: '#0d0d0d',
    muted: '#666666',
    disabled: '#999999',
  },
  link: {
    default: '#004578', // Blue (no green component)
    hover: '#0070c5', // Brighter blue
    visited: '#00528c', // Different blue shade
    active: '#2680d9', // Active blue
    footer: '#4a6a8a', // Muted blue for footer
  },
  background: {
    base: '#ffffff',
    elevated: '#f8f8f8',
    muted: '#f0f0f0',
  },
  border: {
    default: '#e0e0e0',
    muted: '#f0f0f0',
    emphasis: '#004578',
  },
  selection: {
    background: '#C7E0F4',
    text: '#0d0d0d',
  },
  focus: {
    ring: '#0070c5',
    outline: '#004578',
  },
};

// Tritanopia (Blue-Blind) Mode
export const semanticColorsTritanopia = {
  text: {
    primary: '#1a1a1a',
    heading: '#0d0d0d',
    muted: '#666666',
    disabled: '#999999',
  },
  link: {
    default: '#8f1c28', // Deep red (no blue component)
    hover: '#D13438', // Brighter red
    visited: '#761721', // Darker red
    active: '#db4d51', // Active red
    footer: '#a0555f', // Muted red for footer
  },
  background: {
    base: '#ffffff',
    elevated: '#f8f8f8',
    muted: '#f0f0f0',
  },
  border: {
    default: '#e0e0e0',
    muted: '#f0f0f0',
    emphasis: '#8f1c28',
  },
  selection: {
    background: '#ffcace',
    text: '#0d0d0d',
  },
  focus: {
    ring: '#D13438',
    outline: '#8f1c28',
  },
};

// Grayscale (Light) Mode
export const semanticColorsGrayscale = {
  text: {
    primary: '#1a1a1a',
    heading: '#000000',
    muted: '#666666',
    disabled: '#999999',
  },
  link: {
    default: '#333333', // Dark gray (underline required!)
    hover: '#4d4d4d', // Medium gray
    visited: '#262626', // Darker gray
    active: '#666666', // Lighter on click
    footer: '#737373', // Muted gray for footer
  },
  background: {
    base: '#ffffff',
    elevated: '#f8f8f8',
    muted: '#f0f0f0',
  },
  border: {
    default: '#e0e0e0',
    muted: '#f0f0f0',
    emphasis: '#333333',
  },
  selection: {
    background: '#D9D9D9',
    text: '#000000',
  },
  focus: {
    ring: '#4d4d4d',
    outline: '#333333',
  },
};

// Grayscale Dark Mode
export const semanticColorsGrayscaleDark = {
  text: {
    primary: '#e6e6e6',
    heading: '#ffffff',
    muted: '#999999',
    disabled: '#666666',
  },
  link: {
    default: '#bfbfbf', // Light gray (underline required!)
    hover: '#d9d9d9', // Lighter gray
    visited: '#a6a6a6', // Darker gray
    active: '#e6e6e6', // Brightest on click
    footer: '#999999', // Muted gray for footer
  },
  background: {
    base: '#1a1a1a',
    elevated: '#262626',
    muted: '#333333',
  },
  border: {
    default: '#404040',
    muted: '#333333',
    emphasis: '#bfbfbf',
  },
  selection: {
    background: '#4d4d4d',
    text: '#ffffff',
  },
  focus: {
    ring: '#bfbfbf',
    outline: '#d9d9d9',
  },
};

// Map semantic colors to theme modes
export const semanticColorsMap = {
  light: semanticColorsLight,
  dark: semanticColorsDark,
  'high-contrast': semanticColorsHighContrast,
  protanopia: semanticColorsProtanopia,
  deuteranopia: semanticColorsDeuteranopia,
  tritanopia: semanticColorsTritanopia,
  grayscale: semanticColorsGrayscale,
  'grayscale-dark': semanticColorsGrayscaleDark,
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
  m: '1rem', // Base rhythm unit
  l1: '1.25rem',
  l2: '2rem',

  // TW.com custom spacing system
  none: '0',
  xxs: '0.25rem',
  xs: '0.5rem',
  s: '0.75rem',
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
    solid: '#1F1F1F',
    background:
      '#1F1F1F radial-gradient(circle at 20% 50%, #2A2A2A 0%, #2E2E2E 30%, #1C1C1C 70%, #171717 100%)',
    menu: '#1F1F1F radial-gradient(circle at 80% 50%, #252525 0%, #2A2A2A 30%, #242424 70%, #1A1A1A 100%)',
    radial:
      '#1F1F1F radial-gradient(circle at center, #2A2A2A 0%, #242424 30%, #1F1F1F 70%, #1A1A1A 100%)',
    vignette: 'radial-gradient(circle at center, transparent 0%, #1A1A1A 100%)',
    linear:
      'linear-gradient(90deg, #1F1F1F 0%, #242424 50%, #1F1F1F 100%) no-repeat center',
  },
  light: {
    solid: '#FFFFFF',
    background:
      '#FFFFFF radial-gradient(circle at 20% 50%, #FEFEFE 0%, #F8F8F8 30%, #F2F2F2 70%, #ECECEC 100%)',
    menu: '#FFFFFF radial-gradient(circle at center, #FFFFFF 0%, #F0F0F0 30%, #E8E8E8 70%, #E0E0E0 100%)',
    radial:
      '#FFFFFF radial-gradient(circle at center, #FFFFFF 0%, #F0F0F0 30%, #E8E8E8 70%, #E0E0E0 100%)',
    vignette: 'radial-gradient(circle at center, transparent 0%, #F0F0F0 100%)',
    linear:
      'linear-gradient(90deg, #F8F8F8 0%, #FFFFFF 50%, #F8F8F8 100%) no-repeat center',
  },
  components: {
    card: {
      dark: 'linear-gradient(135deg, #242424 0%, #1F1F1F 100%)',
      light: 'linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 100%)',
    },
    button: {
      dark: 'linear-gradient(90deg, #242424 0%, #1F1F1F 100%)',
      light: 'linear-gradient(90deg, #FFFFFF 0%, #F8F8F8 100%)',
    },
    modal: {
      dark: '#1F1F1F radial-gradient(circle at center, #2A2A2A 0%, #242424 30%, #1F1F1F 100%)',
      light:
        '#FFFFFF radial-gradient(circle at center, #FFFFFF 0%, #F8F8F8 30%, #F5F5F5 100%)',
    },
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

// Create base themes from FluentUI
const baseLightTheme = createLightTheme(twBrand);
const baseDarkTheme = createDarkTheme(twBrandDark);
const baseHighContrastTheme = createDarkTheme(twBrandHighContrast);
const baseProtanopiaTheme = createLightTheme(twBrandProtanopia);
const baseDeuteranopiaTheme = createLightTheme(twBrandDeuteranopia);
const baseTritanopiaTheme = createLightTheme(twBrandTritanopia);
const baseGrayscaleTheme = createLightTheme(twBrandGrayscale);
const baseGrayscaleDarkTheme = createDarkTheme(twBrandGrayscaleDark);

// Extended light theme
export const twLightTheme: IExtendedTheme = {
  ...baseLightTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsLight,
  themeMode: 'light',
};

// Extended dark theme
export const twDarkTheme: IExtendedTheme = {
  ...baseDarkTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsDark,
  themeMode: 'dark',
};

// Extended high-contrast theme
export const twHighContrastTheme: IExtendedTheme = {
  ...baseHighContrastTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsHighContrast,
  themeMode: 'high-contrast',
};

// Extended protanopia theme (red-blind)
export const twProtanopiaTheme: IExtendedTheme = {
  ...baseProtanopiaTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsProtanopia,
  themeMode: 'protanopia',
};

// Extended deuteranopia theme (green-blind)
export const twDeuteranopiaTheme: IExtendedTheme = {
  ...baseDeuteranopiaTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsDeuteranopia,
  themeMode: 'deuteranopia',
};

// Extended tritanopia theme (blue-blind)
export const twTritanopiaTheme: IExtendedTheme = {
  ...baseTritanopiaTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsTritanopia,
  themeMode: 'tritanopia',
};

// Extended grayscale theme
export const twGrayscaleTheme: IExtendedTheme = {
  ...baseGrayscaleTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsGrayscale,
  themeMode: 'grayscale',
};

// Extended grayscale-dark theme
export const twGrayscaleDarkTheme: IExtendedTheme = {
  ...baseGrayscaleDarkTheme,
  spacing,
  animations,
  borderRadius,
  zIndices,
  shadows,
  gradients,
  breakpoints,
  mediaQueries,
  typography,
  semanticColors: semanticColorsGrayscaleDark,
  themeMode: 'grayscale-dark',
};

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
