'use client';

import Link from 'next/link';
import { Typography } from '../Typography';
import { ThemedLink } from '../ThemedLink';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { useIsTablet } from '@/hooks/useMediaQuery';

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

interface FooterLinkSectionProps {
  title: string;
  links: Array<{ href: string; label: string }>;
  isCompact: boolean;
  className?: string;
}

/**
 * FooterLinkSection — Reusable footer link group component
 */
function FooterLinkSection({
  title,
  links,
  isCompact,
  className = '',
}: FooterLinkSectionProps) {
  return (
    <div
      className={`flex flex-col ${isCompact ? 'gap-2 mb-1' : 'gap-4 mb-2'} ${className}`}
    >
      <Typography
        variant='h5'
        className='font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'
        style={{
          fontSize: isCompact ? '1rem' : '1.25rem',
          marginBottom: isCompact ? '0' : '0.75rem',
        }}
      >
        {title}
      </Typography>
      {title === 'Social' ? (
        <SocialLinks isFooter />
      ) : (
        <ul className={isCompact ? 'space-y-1' : 'space-y-2'} role='list'>
          {links.map(({ href, label }) => (
            <li key={href}>
              <ThemedLink href={href} variant='small' isFooter>
                {label}
              </ThemedLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface FooterContentProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
  /** Optional additional content to prepend (e.g., hide button on mobile) */
  headerContent?: React.ReactNode;
}

/**
 * FooterContent — Shared footer content used by both HomePage and Standard footers
 */
export function FooterContent({
  isCompact = false,
  headerContent,
}: FooterContentProps) {
  const year = new Date().getFullYear();
  const isTablet = useIsTablet();

  return (
    <>
      {headerContent}

      {/* had to set the max-width here instead of on the parent because the parent needs to stretch full width for the backdrop blur effect to cover the entire screen, but the content inside should be constrained to match the max width of the Navigation and main content. -TW */}
      <div
        className={`px-6 lg:pl-12 lg:pr-8 max-width-content ${isCompact ? 'py-6' : 'py-8'}`}
        style={{ margin: '0 auto' }}
      >
        <div
          className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 ${isCompact ? 'mb-4' : 'md:mb-0'}`}
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

          {/* Link sections */}
          <FooterLinkSection
            title='Content'
            links={footerLinks.content}
            isCompact={isCompact}
            className='hidden md:flex'
          />
          <FooterLinkSection
            title='Work'
            links={footerLinks.work}
            isCompact={isCompact}
          />
          {!isTablet && (
            <FooterLinkSection
              title='Connect'
              links={footerLinks.connect}
              isCompact={isCompact}
              className='hidden md:flex'
            />
          )}
          <FooterLinkSection
            title='Social'
            links={[]} // Empty array since SocialLinks component handles rendering
            isCompact={isCompact}
          />
        </div>

        {/* Bottom bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between pb-4 sm:pb-0 md:gap-2 ${
            isCompact ? 'pt-0' : 'pt-1'
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
    </>
  );
}
