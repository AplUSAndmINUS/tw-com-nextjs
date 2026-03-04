'use client';

import { ExtendedThemeProvider } from '@/theme/providers/ExtendedThemeProvider';
import { FontScaleProvider } from '@/theme/providers/FontScaleProvider';
import { StoreHydrator } from '@/components/StoreHydrator';
import { AccessGate } from '@/components/AccessGate';
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ExtendedThemeProvider>
      <FontScaleProvider>
        <ReCaptchaProvider>
          <StoreHydrator />
          <AccessGate>{children}</AccessGate>
        </ReCaptchaProvider>
      </FontScaleProvider>
    </ExtendedThemeProvider>
  );
}
