'use client';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { FluentThemeProvider } from '@/theme/providers/FluentThemeProvider';

export function FluentProvider({ children }: { children: React.ReactNode }) {
  return <FluentThemeProvider><ThemeSwitcher>{children}</ThemeSwitcher></FluentThemeProvider>;
}
