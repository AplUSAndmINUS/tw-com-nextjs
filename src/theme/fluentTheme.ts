import { BrandVariants, createLightTheme, createDarkTheme, Theme } from '@fluentui/react-components';

// TerenceWaters.com brand palette - deep navy blue primary
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

export const twLightTheme: Theme = {
  ...createLightTheme(twBrand),
};

export const twDarkTheme: Theme = {
  ...createDarkTheme(twBrand),
};

// Default export is the light theme; can be swapped at runtime
export const twTheme = twLightTheme;
