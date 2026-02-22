'use client';

import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navigation />
      <main className='flex-1'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
