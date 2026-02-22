import { ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <RootLayout>
      <div className="max-w-6xl mx-auto w-full">{children}</div>
    </RootLayout>
  );
}
