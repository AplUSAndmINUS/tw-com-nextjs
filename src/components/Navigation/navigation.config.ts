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
    label: 'About',
    path: '/about',
    description: 'Learn more about Terence Waters',
  },
  {
    label: 'Blog',
    path: '/blog',
    description: 'Thoughts on technology, creativity, and the human experience',
  },
  {
    label: 'Videos',
    path: '/videos',
    description: 'Video content and series',
  },
  {
    label: 'Content Hub',
    path: '/content-hub',
    description: 'All content in one place',
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
    label: 'Podcasts',
    path: '/podcasts',
    description: 'Listen to podcast episodes',
  },
  {
    label: 'GitHub',
    path: 'https://github.com/terencewaters',
    description: 'View Terence Waters on GitHub',
  },
  {
    label: 'Contact',
    path: '/contact',
    description: 'Get in touch with Terence Waters',
  },
];
