'use client';

import { ExtendedThemeProvider } from '@/theme/providers/ExtendedThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ExtendedThemeProvider>{children}</ExtendedThemeProvider>;
}
