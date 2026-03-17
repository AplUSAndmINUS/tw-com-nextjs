'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Typography } from '@/components/Typography';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export function NotFoundContent() {
  const { theme } = useAppTheme();
  const [homeBtnHovered, setHomeBtnHovered] = useState(false);
  const [contentBtnHovered, setContentBtnHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const primaryBtnStyle = {
    backgroundColor: homeBtnHovered
      ? theme.semanticColors.link.hover
      : theme.semanticColors.link.default,
    color: theme.semanticColors.background.base,
  };

  const outlineBtnStyle = {
    borderColor: theme.semanticColors.link.default,
    color: contentBtnHovered
      ? theme.semanticColors.background.base
      : theme.semanticColors.link.default,
    backgroundColor: contentBtnHovered
      ? theme.semanticColors.link.default
      : undefined,
  };

  return (
    <div className='mt-8 space-y-6'>
      <Typography
        variant='body'
        className='text-gray-600 dark:text-gray-400 text-center'
      >
        Let&apos;s get you back on track:
      </Typography>

      <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
        <Link
          href='/'
          className='inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors min-w-[200px]'
          style={primaryBtnStyle}
          onMouseEnter={() => setHomeBtnHovered(true)}
          onMouseLeave={() => setHomeBtnHovered(false)}
        >
          ← Go to Home
        </Link>
        <Link
          href='/content-hub'
          className='inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 font-semibold transition-colors min-w-[200px]'
          style={outlineBtnStyle}
          onMouseEnter={() => setContentBtnHovered(true)}
          onMouseLeave={() => setContentBtnHovered(false)}
        >
          Browse Content Hub
        </Link>
      </div>

      <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
        <Typography
          variant='h3'
          className='text-xl font-semibold mb-4 text-center'
        >
          Popular Pages
        </Typography>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[
            {
              href: '/blog',
              label: 'Blog',
              desc: 'Read articles and insights',
            },
            {
              href: '/portfolio',
              label: 'Portfolio',
              desc: 'View my work and projects',
            },
            { href: '/about', label: 'About', desc: 'Learn more about me' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all'
              style={
                hoveredCard === href
                  ? { borderColor: theme.semanticColors.link.default }
                  : undefined
              }
              onMouseEnter={() => setHoveredCard(href)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Typography variant='h4' className='font-semibold mb-1'>
                {label}
              </Typography>
              <Typography
                variant='caption'
                className='text-gray-600 dark:text-gray-400 text-sm'
              >
                {desc}
              </Typography>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
