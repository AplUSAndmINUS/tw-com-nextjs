'use client';

import Link from 'next/link';
import { Typography } from '../Typography';
import { ThemedLink } from '../ThemedLink';
import { useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

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

interface FooterProps {
  /** If true, renders a more compact footer suitable for contained viewports */
  isCompact?: boolean;
  /** If true, enables collapsible footer on mobile (homepage only) */
  isHomePage?: boolean;
}

export function Footer({ isCompact = false, isHomePage = false }: FooterProps) {
  const year = new Date().getFullYear();
  const { theme } = useAppTheme();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  return (
    <>
      {/* Mobile-only toggle button for homepage */}
      {isHomePage && (
        <div className='lg:hidden flex justify-center py-4'>
          <button
            onClick={() => setIsFooterVisible(!isFooterVisible)}
            className='px-6 py-2 rounded-lg transition-all font-medium'
            style={{
              border: `1px solid ${theme.semanticColors.border.default}`,
              backgroundColor: theme.semanticColors.background.base,
              color: theme.semanticColors.text.primary,
              boxShadow: theme.shadows.button,
              fontFamily: theme.typography.fonts.body.fontFamily,
            }}
            aria-controls='footer-content'
          >
            {isFooterVisible ? 'Hide' : 'Show'} Footer
          </button>
        </div>
      )}

      {/* Footer content */}
      <footer
        id='footer-content'
        className={`border-t bg-slate-100 dark:bg-slate-800 border-gray-200 dark:border-gray-700 mt-auto ${
          isCompact ? 'mb-0' : 'mb-2'
        } ${isHomePage ? 'lg:block' : ''} ${isHomePage && !isFooterVisible ? 'hidden lg:block' : ''}`}
        role='contentinfo'
      >
        <div
          className={`max-w-9xl w-full px-6 lg:pl-12 lg:pr-8 ${isCompact ? 'py-6' : 'py-12'}`}
        >
          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${isCompact ? 'mb-4' : 'mb-8'}`}
          >
            {/* Brand */}
            <div>
              <Link
                href='/'
                className='text-xl font-bold tracking-tight hover:opacity-80 transition-opacity'
              >
                <Typography
                  variant='h4'
                  className='text-gray-500 dark:text-gray-400'
                >
                  Terence Waters
                </Typography>
              </Link>
              <Typography
                variant='blockquote'
                className={`text-gray-500 dark:text-gray-400 max-w-xs ${
                  isCompact ? 'mt-1' : 'mt-2'
                }`}
                style={{ fontSize: isCompact ? '0.75rem' : '0.875rem' }}
              >
                {isCompact
                  ? 'Author, technologist, and creative thinker.'
                  : 'Author, technologist, and creative thinker. Writing about technology, creativity, and the human experience.'}
              </Typography>
            </div>

            {/* Content links */}
            <div
              className={`flex flex-col ${isCompact ? 'gap-2 mb-1' : 'gap-4 mb-2'}`}
            >
              <Typography
                variant='h5'
                className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
                style={{ fontSize: isCompact ? '1rem' : '1.25rem' }}
              >
                Content
              </Typography>
              <ul className={isCompact ? 'space-y-1' : 'space-y-2'} role='list'>
                {footerLinks.content.map(({ href, label }) => (
                  <li key={href}>
                    <ThemedLink href={href} variant='small' isFooter>
                      {label}
                    </ThemedLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Work links */}
            <div
              className={`flex flex-col ${isCompact ? 'gap-2 mb-1' : 'gap-4 mb-2'}`}
            >
              <Typography
                variant='h5'
                className='font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
                style={{
                  fontSize: isCompact ? '1rem' : '1.25rem',
                  marginBottom: isCompact ? '0' : '0.75rem',
                }}
              >
                Work
              </Typography>
              <ul className={isCompact ? 'space-y-1' : 'space-y-2'} role='list'>
                {footerLinks.work.map(({ href, label }) => (
                  <li key={href}>
                    <ThemedLink href={href} variant='small' isFooter>
                      {label}
                    </ThemedLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect links - hidden on mobile */}
            <div
              className={`hidden md:flex flex-col ${isCompact ? 'gap-2 mb-1' : 'gap-4 mb-2'}`}
            >
              <Typography
                variant='h5'
                className='font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
                style={{
                  fontSize: isCompact ? '1rem' : '1.25rem',
                  marginBottom: isCompact ? '0' : '0.75rem',
                }}
              >
                Connect
              </Typography>
              <ul className={isCompact ? 'space-y-1' : 'space-y-2'} role='list'>
                {footerLinks.connect.map(({ href, label }) => (
                  <li key={href}>
                    <ThemedLink href={href} variant='small' isFooter>
                      {label}
                    </ThemedLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-2 ${
              isCompact ? 'pt-3 mt-1' : 'pt-6 mt-2'
            }`}
          >
            <Typography
              variant='blockquote'
              className='text-gray-500 dark:text-gray-400'
              style={{ fontSize: isCompact ? '0.75rem' : '0.875rem' }}
            >
              &copy; 2025-{year} Terence Waters. All rights reserved.
            </Typography>
          </div>
        </div>
      </footer>
    </>
  );
}
