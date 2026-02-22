import { ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';

interface PortfolioLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function PortfolioLayout({ children, title, description }: PortfolioLayoutProps) {
  return (
    <RootLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">{title}</h1>
          {description && <p className="text-xl text-gray-600 dark:text-gray-400 mt-3">{description}</p>}
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">{children}</div>
      </div>
    </RootLayout>
  );
}
