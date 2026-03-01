'use client';

import { ExtendedThemeProvider } from '@/theme/providers/ExtendedThemeProvider';
import { FontScaleProvider } from '@/theme/providers/FontScaleProvider';
import { StoreHydrator } from '@/components/StoreHydrator';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ExtendedThemeProvider>
      <FontScaleProvider>
        <StoreHydrator />
        {children}
      </FontScaleProvider>
    </ExtendedThemeProvider>
  );
}
