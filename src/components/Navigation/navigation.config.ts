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
    label: 'Videos',
    path: '/videos',
    description: 'Video content and series',
  },
  {
    label: 'Podcasts',
    path: '/podcasts',
    description: 'Audio conversations and episodes',
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
    label: 'Coaching',
    path: '/coaching',
    description: 'One-on-one coaching and offerings',
  },
  {
    label: 'Services',
    path: '/services',
    description: 'Professional services and consulting',
  },
  {
    label: 'About',
    path: '/about',
    description: 'My story and background',
  },
  {
    label: 'Contact',
    path: '/contact',
    description: 'Get in touch',
  },
  {
    label: 'Archive',
    path: '/archive',
    description: 'Past work and writing',
  },
];
