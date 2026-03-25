'use client';

import Link from 'next/link';
import React from 'react';
import type { ContentItem } from '@/content/types';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface BlogIndexClientProps {
  posts: ContentItem[];
  allTags: string[];
}

export function BlogIndexClient({ posts, allTags }: BlogIndexClientProps) {
  const { theme } = useAppTheme();
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [hoveredPostSlug, setHoveredPostSlug] = React.useState<string | null>(
    null
  );

  const activeFilterStyle = {
    backgroundColor: theme.semanticColors.link.default,
    color: theme.semanticColors.background.base,
    borderColor: theme.semanticColors.link.default,
  };

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <>
      {/* Category / Tag Filters */}
      {allTags.length > 0 && (
        <div
          className='flex flex-wrap gap-2 mb-8'
          role='group'
          aria-label='Filter by category'
        >
          <button
            onClick={() => setActiveTag(null)}
            className='px-4 py-1.5 rounded-full text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'
            style={activeTag === null ? activeFilterStyle : undefined}
            aria-pressed={activeTag === null ? true : false}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className='px-4 py-1.5 rounded-full text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400'
              style={activeTag === tag ? activeFilterStyle : undefined}
              aria-pressed={activeTag === tag ? true : false}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Post List */}
      {filtered.length === 0 ? (
        <p className='text-gray-500 dark:text-gray-400'>
          No posts found{activeTag ? ` for "${activeTag}"` : ''}.
        </p>
      ) : (
        <div className='space-y-8'>
          {filtered.map((post) => (
            <article
              key={post.slug}
              className='border-b pb-8'
              onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; setHoveredPostSlug(post.slug); }}
              onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; setHoveredPostSlug(null); }}
            >
              {post.tags.length > 0 && (
                <div className='flex gap-2 mb-2 flex-wrap'>
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setActiveTag(activeTag === tag ? null : tag)
                      }
                      className='text-xs uppercase tracking-wide font-semibold hover:underline'
                      style={{ color: theme.semanticColors.link.default }}
                      aria-label={`Filter by ${tag}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              <Link href={`/blog/${post.slug}`}>
                <h2
                  className='text-2xl font-semibold transition-colors'
                  style={{
                    color:
                      hoveredPostSlug === post.slug
                        ? theme.semanticColors.link.hover
                        : undefined,
                  }}
                >
                  {post.title}
                </h2>
              </Link>
              {post.date && (
                <time
                  dateTime={post.date}
                  className='text-sm text-gray-500 dark:text-gray-400 mt-1 block'
                >
                  {post.date}
                </time>
              )}
              {post.excerpt && (
                <p className='mt-3 text-gray-600 dark:text-gray-400'>
                  {post.excerpt}
                </p>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className='inline-block mt-3 text-sm font-medium hover:underline'
                style={{ color: theme.semanticColors.link.default }}
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
