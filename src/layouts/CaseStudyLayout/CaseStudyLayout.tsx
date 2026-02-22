import { ReactNode } from 'react';
import { RootLayout } from '@/layouts/RootLayout';

interface CaseStudyLayoutProps {
  children: ReactNode;
  title: string;
  date?: string;
}

export function CaseStudyLayout({ children, title, date }: CaseStudyLayoutProps) {
  return (
    <RootLayout>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-10 border-b pb-8">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Case Study</span>
          <h1 className="text-4xl font-bold mt-2">{title}</h1>
          {date && <time className="text-sm text-gray-500 mt-2 block" dateTime={date}>{date}</time>}
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">{children}</div>
      </article>
    </RootLayout>
  );
}
