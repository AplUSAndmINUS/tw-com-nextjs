'use client';

import { ExtendedThemeProvider } from '@/theme/providers/ExtendedThemeProvider';
import { FontScaleProvider } from '@/theme/providers/FontScaleProvider';
import { StoreHydrator } from '@/components/StoreHydrator';
import { AccessGate } from '@/components/AccessGate';
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';
import { Header } from '@/components/Navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ExtendedThemeProvider>
      <FontScaleProvider>
        <ReCaptchaProvider>
          <StoreHydrator />
          <AccessGate>
            {/* Fixed header stays sticky across all pages */}
            <Header />
            {/* Page content (includes main with PageTransition from RootLayout) */}
            {children}
          </AccessGate>
        </ReCaptchaProvider>
      </FontScaleProvider>
    </ExtendedThemeProvider>
  );
}
