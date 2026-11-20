import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/theme/fluentTheme';
import { FONT_SCALE_MAX, FONT_SCALE_MIN } from '@/theme/fontScale';

export type { ThemeMode };

export interface UserPreferences {
  fontScale: number;
  minFontScale: number;
  maxFontScale: number;
  reducedMotion: boolean;
  reducedTransparency: boolean;
  /**
   * High contrast and colorblind-safe are orthogonal layers applied over the
   * active theme via data-tw-contrast / data-tw-cvd, not discrete themeMode
   * values — so they compose with both dark and light. See
   * styles/tokens/a11y-layers.css.
   */
  highContrast: boolean;
  colorblindSafe: boolean;
  themeMode: ThemeMode;
  layoutPreference: 'left-handed' | 'right-handed';
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

export {
  FONT_SCALE_MAX,
  FONT_SCALE_MIN,
  FONT_SCALE_STEPS,
  clampFontScale,
} from '@/theme/fontScale';

export const defaultUserPreferences: UserPreferences = {
  fontScale: 1.0,
  minFontScale: FONT_SCALE_MIN,
  maxFontScale: FONT_SCALE_MAX,
  reducedMotion: false,
  reducedTransparency: false,
  highContrast: false,
  colorblindSafe: false,
  themeMode: 'dark',
  layoutPreference: 'right-handed',
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultUserPreferences,
      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),
      resetPreferences: () =>
        set({
          preferences: { ...defaultUserPreferences },
        }),
    }),
    {
      name: 'tw-user-preferences',
      skipHydration: true,
    }
  )
);
