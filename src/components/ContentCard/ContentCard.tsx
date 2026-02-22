import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ContentItem } from '@/content/types';
import { ViewType } from '@/content/types';

interface ContentCardProps {
  item: ContentItem;
  href: string;
  viewType?: ViewType;
  contentType?: string;
}

export function ContentCard({ item, href, viewType = 'grid', contentType }: ContentCardProps) {
  if (viewType === 'large') {
    return <LargeCard item={item} href={href} contentType={contentType} />;
  }
  if (viewType === 'small') {
    return <SmallCard item={item} href={href} />;
  }
  return <GridCard item={item} href={href} contentType={contentType} />;
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({ item, href, contentType }: { item: ContentItem; href: string; contentType?: string }) {
  return (
    <Link href={href} className='group block'>
      <article className='border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col'>
        {item.imageUrl && (
          <div className='relative w-full aspect-video bg-gray-100 dark:bg-gray-800'>
            <Image
              src={item.imageUrl}
              alt={item.imageAlt ?? item.title}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
            />
          </div>
        )}
        <div className='p-5 flex flex-col flex-1'>
          {(item.category || contentType) && (
            <span className='text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1'>
              {item.category ?? contentType}
            </span>
          )}
          <h2 className='text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2'>
            {item.title}
          </h2>
          {item.excerpt && (
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1'>
              {item.excerpt}
            </p>
          )}
          <div className='mt-3 flex items-center justify-between text-xs text-gray-400'>
            {item.author && <span>{item.author}</span>}
            {item.date && <time dateTime={item.date}>{item.date}</time>}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5'>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Large Card ───────────────────────────────────────────────────────────────

function LargeCard({ item, href, contentType }: { item: ContentItem; href: string; contentType?: string }) {
  return (
    <Link href={href} className='group block'>
      <article className='flex flex-col md:flex-row gap-6 border-b border-gray-200 dark:border-gray-700 py-8'>
        {item.imageUrl && (
          <div className='relative flex-shrink-0 w-full md:w-64 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800'>
            <Image
              src={item.imageUrl}
              alt={item.imageAlt ?? item.title}
              fill
              sizes='(max-width: 768px) 100vw, 256px'
              className='object-cover group-hover:scale-[1.02] transition-transform duration-300'
            />
          </div>
        )}
        <div className='flex flex-col justify-center flex-1'>
          {(item.category || contentType) && (
            <span className='text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1'>
              {item.category ?? contentType}
            </span>
          )}
          <h2 className='text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
            {item.title}
          </h2>
          {item.excerpt && (
            <p className='mt-2 text-gray-600 dark:text-gray-400 line-clamp-4'>
              {item.excerpt}
            </p>
          )}
          <div className='mt-3 flex items-center gap-4 text-sm text-gray-400'>
            {item.author && <span>{item.author}</span>}
            {item.date && <time dateTime={item.date}>{item.date}</time>}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-1'>
              {item.tags.slice(0, 5).map((tag) => (
                <span key={tag} className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5'>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Small Card ───────────────────────────────────────────────────────────────

function SmallCard({ item, href }: { item: ContentItem; href: string }) {
  return (
    <Link href={href} className='group block'>
      <article className='flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 py-3'>
        {item.imageUrl && (
          <div className='relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800'>
            <Image
              src={item.imageUrl}
              alt={item.imageAlt ?? item.title}
              fill
              sizes='64px'
              className='object-cover'
            />
          </div>
        )}
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2'>
            {item.title}
          </h3>
          <div className='flex items-center gap-2 mt-0.5 text-xs text-gray-400'>
            {item.category && <span>{item.category}</span>}
            {item.date && <time dateTime={item.date}>{item.date}</time>}
          </div>
        </div>
      </article>
    </Link>
  );
}
