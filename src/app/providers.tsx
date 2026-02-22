'use client';

import { FluentThemeProvider } from '@/theme/providers/FluentThemeProvider';

export function FluentProvider({ children }: { children: React.ReactNode }) {
  return <FluentThemeProvider>{children}</FluentThemeProvider>;
}
