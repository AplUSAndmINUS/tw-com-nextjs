import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/theme/fluentTheme';

export type { ThemeMode };

export interface UserPreferences {
  fontScale: number;
  minFontScale: number;
  maxFontScale: number;
  reducedMotion: boolean;
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

const defaultPreferences: UserPreferences = {
  fontScale: 1.0,
  minFontScale: 0.8,
  maxFontScale: 1.5,
  reducedMotion: false,
  themeMode: 'dark',
  layoutPreference: 'right-handed',
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),
      resetPreferences: () =>
        set({
          preferences: { ...defaultPreferences },
        }),
    }),
    {
      name: 'tw-user-preferences',
      skipHydration: true,
    }
  )
);
