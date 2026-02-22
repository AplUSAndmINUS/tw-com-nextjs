'use client';

import Link from 'next/link';
import { Typography } from '../Typography';

const footerLinks = {
  content: [
    { href: '/blog', label: 'Blog' },
    { href: '/videos', label: 'Videos' },
    { href: '/podcasts', label: 'Podcasts' },
    { href: '/content-hub', label: 'Content Hub' },
  ],
  work: [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/coaching', label: 'Coaching' },
    { href: '/services', label: 'Services' },
  ],
  connect: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/archive', label: 'Archive' },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className='border-t border-gray-200 dark:border-gray-700 mt-auto mb-3'
      role='contentinfo'
    >
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          {/* Brand */}
          <div>
            <Link
              href='/'
              className='text-xl mb-2 font-bold tracking-tight hover:opacity-80 transition-opacity'
            >
              Terence Waters
            </Link>
            <Typography
              variant='blockquote'
              className='mt-2 text-gray-500 dark:text-gray-400 max-w-xs'
              style={{ fontSize: '0.875rem' }}
            >
              Author, technologist, and creative thinker. Writing about
              technology, creativity, and the human experience.
            </Typography>
          </div>

          {/* Content links */}
          <div className='flex flex-col gap-4 mb-2'>
            <Typography
              variant='h5'
              className='text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500'
              style={{ fontSize: '1.25rem' }}
            >
              Content
            </Typography>
            <ul className='space-y-2' role='list'>
              {footerLinks.content.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className='text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work links */}
          <div className='flex flex-col gap-4 mb-2'>
            <Typography
              variant='h5'
              className='font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3'
              style={{ fontSize: '1.25rem' }}
            >
              Work
            </Typography>
            <ul className='space-y-2' role='list'>
              {footerLinks.work.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className='text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect links */}
          <div className='flex flex-col gap-4 mb-2'>
            <Typography
              variant='h5'
              className='font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3'
              style={{ fontSize: '1.25rem' }}
            >
              Connect
            </Typography>
            <ul className='space-y-2' role='list'>
              {footerLinks.connect.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className='text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-2'>
          <Typography
            variant='blockquote'
            className='text-gray-500 dark:text-gray-300'
            style={{ fontSize: '0.875rem' }}
          >
            &copy; 2025-{year} Terence Waters. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
