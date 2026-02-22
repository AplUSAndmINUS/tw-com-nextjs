'use client';

import { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navigation />
      <main className='flex-1'>
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <h1 className='text-4xl font-bold mb-8'>
            Hello! Welcome to TerenceWaters.com
          </h1>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
}
