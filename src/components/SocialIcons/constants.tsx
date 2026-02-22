import React from 'react';

import FacebookLogo from '@/assets/svgs/FacebookLogo';
import InstagramLogo from '@/assets/svgs/InstagramLogo';
import ThreadsLogo from '@/assets/svgs/ThreadsLogo';
import LinkedInLogo from '@/assets/svgs/LinkedInLogo';
import MicrosoftLogo from '@/assets/svgs/MicrosoftLogo';
import YouTubeLogo from '@/assets/svgs/YouTubeLogo';
import TiktokLogo from '@/assets/svgs/TiktokLogo';

export interface SocialIcon {
  iconName: string | React.ReactNode;
  url: string;
  tooltip?: string;
  isTagline?: boolean;
}


export const getSocialIcons = (): SocialIcon[] => [
  {
    iconName: <FacebookLogo />,
    url: 'https://www.facebook.com/TerenceRWaters',
    tooltip: 'Facebook',
    isTagline: true,
  },
  {
    iconName: <InstagramLogo />,
    url: 'https://www.instagram.com/aplusinflux',
    tooltip: 'Instagram',
    isTagline: true,
  },
  {
    iconName: <ThreadsLogo />,
    url: 'https://www.threads.com/@aplusinflux',
    tooltip: 'Threads',
    isTagline: true,
  },
  {
    iconName: <LinkedInLogo />,
    url: 'https://www.linkedin.com/in/terencewaters',
    tooltip: 'LinkedIn',
    isTagline: true,
  },
  {
    iconName: <YouTubeLogo />,
    url: 'https://www.youtube.com/@terencewaters',
    tooltip: 'YouTube',
    isTagline: true,
  },
  {
    iconName: <TiktokLogo />,
    url: 'https://www.tiktok.com/@aplusinflux',
    tooltip: 'TikTok',
    isTagline: false,
  },
  {
    iconName: <MicrosoftLogo />,
    url: 'https://www.xbox.com/en-us/players/profile?player=AplUSAndmINUS',
    tooltip: 'Xbox',
    isTagline: false,
  },
];
