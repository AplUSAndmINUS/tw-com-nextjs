import type { TwPageNavLink } from '@/components/dsm';

/**
 * Interior-page nav links, shared by the blog list and detail pages so the
 * "Content" item stays marked active across both.
 */
export const BLOG_NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub', active: true },
  { label: 'Portfolio', href: '/portfolio' },
];
