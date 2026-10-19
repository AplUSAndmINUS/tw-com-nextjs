import React from 'react';

import FacebookLogo from '@/assets/svgs/FacebookLogo';
import InstagramLogo from '@/assets/svgs/InstagramLogo';
import ThreadsLogo from '@/assets/svgs/ThreadsLogo';
import LinkedInLogo from '@/assets/svgs/LinkedInLogo';
import MicrosoftLogo from '@/assets/svgs/MicrosoftLogo';
import YouTubeLogo from '@/assets/svgs/YouTubeLogo';
import TiktokLogo from '@/assets/svgs/TiktokLogo';
import GithubLogo from '@/assets/svgs/GitHubLogo';
import TwitchLogo from '@/assets/svgs/TwitchLogo';
import RedditLogo from '@/assets/svgs/RedditLogo';
import { SOCIAL_URLS } from '@/lib/socials';

export interface SocialIcon {
  iconName: React.ComponentType<{
    style?: React.CSSProperties;
    className?: string;
  }>;
  url: string;
  tooltip?: string;
  isTagline?: boolean;
}

export const getSocialIcons = (): SocialIcon[] => [
  {
    iconName: FacebookLogo,
    url: SOCIAL_URLS.facebook,
    tooltip: 'Facebook',
    isTagline: true,
  },
  {
    iconName: InstagramLogo,
    url: SOCIAL_URLS.instagram,
    tooltip: 'Instagram',
    isTagline: true,
  },
  {
    iconName: ThreadsLogo,
    url: SOCIAL_URLS.threads,
    tooltip: 'Threads',
    isTagline: true,
  },
  {
    iconName: LinkedInLogo,
    url: SOCIAL_URLS.linkedin,
    tooltip: 'LinkedIn',
    isTagline: true,
  },
  {
    iconName: GithubLogo,
    url: SOCIAL_URLS.github,
    tooltip: 'GitHub',
    isTagline: true,
  },
  {
    iconName: YouTubeLogo,
    url: SOCIAL_URLS.youtube,
    tooltip: 'YouTube',
    isTagline: true,
  },
  {
    iconName: TiktokLogo,
    url: SOCIAL_URLS.tiktok,
    tooltip: 'TikTok',
    isTagline: false,
  },
  {
    iconName: TwitchLogo,
    url: SOCIAL_URLS.twitch,
    tooltip: 'Twitch',
    isTagline: false,
  },
  {
    iconName: RedditLogo,
    url: SOCIAL_URLS.reddit,
    tooltip: 'Reddit',
    isTagline: false,
  },
  {
    iconName: MicrosoftLogo,
    url: SOCIAL_URLS.xbox,
    tooltip: 'Xbox',
    isTagline: false,
  },
];
