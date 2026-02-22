'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { ContentItem } from '@/content/types';

interface LargeViewProps {
  items: ContentItem[];
  baseUrl?: string;
}

export function LargeView({ items, baseUrl = '' }: LargeViewProps) {
  if (items.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 dark:text-gray-400'>No content found.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      {items.map((item) => {
        const itemUrl = baseUrl
          ? `${baseUrl}/${item.slug}`
          : `/${item.type}/${item.slug}`;

        return (
          <Link
            key={item.slug}
            href={itemUrl}
            className='group block transition-all duration-300 hover:scale-[1.01]'
          >
            <Card className='h-full overflow-hidden hover:shadow-2xl transition-shadow duration-300'>
              {/* Large Featured Image */}
              {item.imageUrl && (
                <div className='relative w-full aspect-[16/10] bg-gray-100 dark:bg-gray-800'>
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt || item.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 1024px) 100vw, 50vw'
                    priority={items.indexOf(item) < 2} // Prioritize first two images
                  />

                  {/* Featured Badge (if applicable) */}
                  {item.featured && (
                    <div className='absolute top-4 right-4'>
                      <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-yellow-400 text-yellow-900 shadow-lg'>
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className='p-8'>
                {/* Category/Type Badge */}
                {(item.category || item.type) && (
                  <div className='mb-3'>
                    <span className='inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                      {item.category || item.type}
                    </span>
                  </div>
                )}

                {/* Title - Larger */}
                <h2 className='text-2xl lg:text-3xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                  {item.title}
                </h2>

                {/* Excerpt - More visible */}
                {item.excerpt && (
                  <p className='text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-6 line-clamp-4'>
                    {item.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  {item.publishedDate && (
                    <time dateTime={item.publishedDate} className='font-medium'>
                      {new Date(item.publishedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </time>
                  )}

                  {item.author && (
                    <>
                      <span>•</span>
                      <span className='font-medium'>{item.author}</span>
                    </>
                  )}
                </div>

                {/* Tags - Full visibility */}
                {item.tags && item.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className='inline-block px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Gallery Indicator */}
                {item.gallery && item.gallery.length > 0 && (
                  <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                      <svg
                        className='w-5 h-5'
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
                      <span>
                        {item.gallery.length} image
                        {item.gallery.length !== 1 ? 's' : ''} in gallery
                      </span>
                    </div>
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
