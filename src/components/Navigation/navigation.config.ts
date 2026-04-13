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
    label: 'Services',
    path: '/services',
    description:
      'Explore design, development, consulting, and coaching services',
  },
  {
    label: 'Content Hub',
    path: '/content-hub',
    description: 'All content in one place',
  },
  {
    label: 'Blog',
    path: '/blog',
    description: 'Thoughts on technology, creativity, and the human experience',
  },
  {
    label: 'Portfolio',
    path: '/portfolio',
    description: 'Selected work and projects',
  },
  {
    label: 'GitHub',
    path: '/github',
    description: 'Explore open-source projects and repositories',
  },
  {
    label: 'Podcasts',
    path: '/podcasts',
    description: 'Listen to The Authentic Growth Mythmaker Series podcast',
  },
  {
    label: 'Contact Me',
    path: '/contact',
    description: 'Get in touch with Terence Waters',
  },
];
