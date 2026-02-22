'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/essays', label: 'Essays' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/case-studies', label: 'Case Studies' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className='border-b border-gray-200 dark:border-gray-700'
      aria-label='Main navigation'
    >
      <div className='max-w-6xl mx-auto px-4 flex items-center justify-between h-16'>
        <Link href='/' className='text-xl font-bold tracking-tight'>
          Terence Waters
        </Link>
        <ul className='flex gap-6' role='list'>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === href
                    ? 'text-blue-600'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                aria-current={pathname === href ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
