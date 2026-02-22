'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { ContentItem } from '@/content/types';

interface GridViewProps {
  items: ContentItem[];
  baseUrl?: string; // Base URL for linking (e.g., '/blog', '/portfolio')
}

export function GridView({ items, baseUrl = '' }: GridViewProps) {
  if (items.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 dark:text-gray-400'>No content found.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {items.map((item) => {
        const itemUrl = baseUrl
          ? `${baseUrl}/${item.slug}`
          : `/${item.type}/${item.slug}`;

        return (
          <Link
            key={item.slug}
            href={itemUrl}
            className='group block transition-transform duration-200 hover:scale-[1.02]'
          >
            <Card className='h-full flex flex-col overflow-hidden'>
              {item.imageUrl && (
                <div className='relative w-full aspect-video bg-gray-100 dark:bg-gray-800'>
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </div>
              )}

              <div className='flex-1 p-6'>
                {/* Category/Type Badge */}
                {(item.category || item.type) && (
                  <div className='mb-2'>
                    <span className='inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                      {item.category || item.type}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className='text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                  {item.title}
                </h3>

                {/* Excerpt */}
                {item.excerpt && (
                  <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
                    {item.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mt-auto'>
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

                  {item.author && (
                    <>
                      <span>•</span>
                      <span>{item.author}</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-4'>
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className='inline-block px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className='inline-block px-2 py-1 text-xs text-gray-500'>
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
