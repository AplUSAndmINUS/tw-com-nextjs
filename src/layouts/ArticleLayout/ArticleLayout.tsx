import { ReactNode } from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';

interface ArticleLayoutProps {
  children: ReactNode;
  title: string;
  date?: string;
}

export function ArticleLayout({ children, title, date }: ArticleLayoutProps) {
  return (
    <SiteLayout>
      <article className='max-w-3xl mx-auto px-4 py-12'>
        <header className='mb-8 border-b pb-6'>
          <h1 className='text-4xl font-bold'>{title}</h1>
          {date && (
            <time className='text-sm text-gray-500 mt-2 block' dateTime={date}>
              {date}
            </time>
          )}
        </header>
        <div className='prose prose-lg dark:prose-invert max-w-none'>
          {children}
        </div>
      </article>
    </SiteLayout>
  );
}
