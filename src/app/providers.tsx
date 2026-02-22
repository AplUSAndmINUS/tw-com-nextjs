'use client';

import { FluentThemeProvider } from '@/theme/providers/FluentThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <FluentThemeProvider>{children}</FluentThemeProvider>;
}
