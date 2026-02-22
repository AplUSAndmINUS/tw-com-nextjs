import { ReactNode } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <SiteLayout>
      <div className='max-w-6xl mx-auto w-full'>{children}</div>
    </SiteLayout>
  );
}
