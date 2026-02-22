/**
 * Social Media Icons Configuration
 *
 * This file defines the social media links for TerenceWaters.com
 *
 * To add custom SVG icons:
 * 1. Create SVG component files in src/assets/svgs/
 * 2. Import them here
 * 3. Replace the placeholder strings with the SVG components
 */

import { SocialIcon } from '@/components/SocialIcons';

// TODO: Replace these icon strings with actual Fluent UI v9 icons or custom SVG components
// Example with Fluent UI v9 icons:
// import { HomeFilled, HomeRegular } from '@fluentui/react-icons';
// iconName: HomeFilled

export const socialMediaLinks: SocialIcon[] = [
  {
    iconName: 'Facebook', // Replace with Facebook SVG component
    url: 'https://www.facebook.com/TerenceRWaters',
    tooltip: 'Facebook',
    isTagline: true,
  },
  {
    iconName: 'Instagram', // Replace with Instagram SVG component
    url: 'https://www.instagram.com/aplusinflux',
    tooltip: 'Instagram',
    isTagline: true,
  },
  {
    iconName: 'Threads', // Replace with Threads SVG component
    url: 'https://www.threads.com/@aplusinflux',
    tooltip: 'Threads',
    isTagline: true,
  },
  {
    iconName: 'LinkedIn', // Replace with LinkedIn SVG component
    url: 'https://www.linkedin.com/in/terencewaters',
    tooltip: 'LinkedIn',
    isTagline: true,
  },
  {
    iconName: 'YouTube', // Replace with YouTube SVG component
    url: 'https://www.youtube.com/@terencewaters',
    tooltip: 'YouTube',
    isTagline: true,
  },
  {
    iconName: 'TikTok', // Replace with TikTok SVG component
    url: 'https://www.tiktok.com/@aplusinflux',
    tooltip: 'TikTok',
    isTagline: false,
  },
  {
    iconName: 'Xbox', // Replace with Microsoft/Xbox SVG component
    url: 'https://www.xbox.com/en-US/play/user/APlusInFLUX',
    tooltip: 'Xbox',
    isTagline: false,
  },
];
