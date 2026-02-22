'use client';

import { FluentProvider as FUIFluentProvider } from '@fluentui/react-components';
import { twTheme } from '@/theme';

export function FluentProvider({ children }: { children: React.ReactNode }) {
  return (
    <FUIFluentProvider theme={twTheme}>
      {children}
    </FUIFluentProvider>
  );
}
