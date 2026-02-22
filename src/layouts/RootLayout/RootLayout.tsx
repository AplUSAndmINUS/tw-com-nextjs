'use client';

import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ThemeSwitcher, ThemeSelector } from '@/components/ThemeSwitcher';

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ThemeSwitcher>
      <div className='flex flex-col min-h-screen relative'>
        <div className='fixed top-4 right-4 z-50'>
          <ThemeSelector label='' />
        </div>
        <Navigation />
        <main className='flex-1'>{children}</main>
        <Footer />
      </div>
    </ThemeSwitcher>
  );
}
