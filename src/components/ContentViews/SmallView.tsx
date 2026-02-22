'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ContentItem } from '@/content/types';

interface SmallViewProps {
  items: ContentItem[];
  baseUrl?: string;
}

export function SmallView({ items, baseUrl = '' }: SmallViewProps) {
  if (items.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 dark:text-gray-400'>No content found.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {items.map((item) => {
        const itemUrl = baseUrl
          ? `${baseUrl}/${item.slug}`
          : `/${item.type}/${item.slug}`;

        return (
          <Link key={item.slug} href={itemUrl} className='group block'>
            <div className='flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900'>
              {/* Thumbnail */}
              {item.imageUrl && (
                <div className='relative w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden'>
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className='object-cover'
                    sizes='96px'
                  />
                </div>
              )}

              <div className='flex-1 min-w-0'>
                {/* Header: Category and Featured */}
                <div className='flex items-center gap-2 mb-1'>
                  {(item.category || item.type) && (
                    <span className='inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                      {item.category || item.type}
                    </span>
                  )}

                  {item.featured && (
                    <span className='inline-block px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800'>
                      Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className='text-lg font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate'>
                  {item.title}
                </h3>

                {/* Excerpt */}
                {item.excerpt && (
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2'>
                    {item.excerpt}
                  </p>
                )}

                {/* Meta and Tags */}
                <div className='flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500'>
                  {/* Date */}
                  {item.publishedDate && (
                    <time dateTime={item.publishedDate}>
                      {new Date(item.publishedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </time>
                  )}

                  {/* Author */}
                  {item.author && (
                    <>
                      <span>•</span>
                      <span>{item.author}</span>
                    </>
                  )}

                  {/* Gallery indicator */}
                  {item.gallery && item.gallery.length > 0 && (
                    <>
                      <span>•</span>
                      <span className='flex items-center gap-1'>
                        <svg
                          className='w-3 h-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                        {item.gallery.length}
                      </span>
                    </>
                  )}

                  {/* Tags - Limited to 2 */}
                  {item.tags && item.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className='flex items-center gap-2'>
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className='inline-block px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className='text-gray-400'>
                            +{item.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
