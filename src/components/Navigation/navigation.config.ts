/**
 * Navigation Configuration
 * Defines the main navigation menu items for TW.com
 */

import type { NavItem } from './navigation.types';

export const navItems: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    description: 'Return to homepage',
  },
  {
    label: 'Blog',
    path: '/blog',
    description: 'Thoughts on technology, creativity, and the human experience',
  },
  {
    label: 'Essays',
    path: '/essays',
    description: 'Long-form explorations and deep dives',
  },
  {
    label: 'Portfolio',
    path: '/portfolio',
    description: 'Selected work and projects',
  },
  {
    label: 'Case Studies',
    path: '/case-studies',
    description: 'In-depth project breakdowns',
  },
  {
    label: 'Videos',
    path: '/videos',
    description: 'Watch videos on technology, creativity, and personal development',
  },
  {
    label: 'Podcasts',
    path: '/podcasts',
    description: 'Listen to podcast episodes',
  },
  {
    label: 'Content Hub',
    path: '/content',
    description: 'All content in one place — blog, essays, portfolio, case studies, and more',
  },
];
