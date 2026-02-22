import { ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';

interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  date?: string;
}

export function ContentLayout({ children, title, date }: ContentLayoutProps) {
  return (
    <RootLayout>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          {date && <time className="text-sm text-gray-500 mt-2 block" dateTime={date}>{date}</time>}
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">{children}</div>
      </article>
    </RootLayout>
  );
}
