'use client';

import Link from 'next/link';

const footerLinks = {
  writing: [
    { href: '/blog', label: 'Blog' },
    { href: '/essays', label: 'Essays' },
  ],
  work: [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/case-studies', label: 'Case Studies' },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className='border-t border-gray-200 dark:border-gray-700 mt-auto'
      role='contentinfo'
    >
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          {/* Brand */}
          <div>
            <Link
              href='/'
              className='text-lg font-bold tracking-tight hover:opacity-80 transition-opacity'
            >
              Terence Waters
            </Link>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs'>
              Author, technologist, and creative thinker. Writing about
              technology, creativity, and the human experience.
            </p>
          </div>

          {/* Writing links */}
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3'>
              Writing
            </h3>
            <ul className='space-y-2' role='list'>
              {footerLinks.writing.map(({ href, label }) => (
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
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3'>
              Work
            </h3>
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
        </div>

        {/* Bottom bar */}
        <div className='pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-2'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            &copy; {year} Terence Waters. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

