'use client';

import { PODCAST_PLATFORMS } from '@/lib/spreaker';
import SpreakerLogo from '@/assets/svgs/SpreakerLogo';
import SpotifyLogo from '@/assets/svgs/SpotifyLogo';
import ApplePodcastsLogo from '@/assets/svgs/ApplePodcastsLogo';
import IHeartRadioLogo from '@/assets/svgs/IHeartRadioLogo';
import AmazonMusicLogo from '@/assets/svgs/AmazonMusicLogo';
import DeezerLogo from '@/assets/svgs/DeezerLogo';
import PodchaserLogo from '@/assets/svgs/PodchaserLogo';
import RSSLogo from '@/assets/svgs/RSSLogo';
import { NewTabHint } from '@/components/NewTabHint';
import styles from './ListenOn.module.scss';

/** The show's RSS feed (an Azure Function), for any podcast app. */
export const TRI_RSS_PATH = '/api/podcasts/rss';

type Logo = React.ComponentType<{
  color?: string;
  style?: React.CSSProperties;
}>;

const PLATFORMS: { label: string; href: string; Icon: Logo }[] = [
  { label: 'Spreaker', href: PODCAST_PLATFORMS.spreaker, Icon: SpreakerLogo },
  { label: 'Spotify', href: PODCAST_PLATFORMS.spotify, Icon: SpotifyLogo },
  {
    label: 'Apple Podcasts',
    href: PODCAST_PLATFORMS.applePodcasts,
    Icon: ApplePodcastsLogo,
  },
  {
    label: 'iHeartRadio',
    href: PODCAST_PLATFORMS.iHeartRadio,
    Icon: IHeartRadioLogo,
  },
  {
    label: 'Amazon Music',
    href: PODCAST_PLATFORMS.amazonMusic,
    Icon: AmazonMusicLogo,
  },
  { label: 'Deezer', href: PODCAST_PLATFORMS.deezer, Icon: DeezerLogo },
  {
    label: 'Podchaser',
    href: PODCAST_PLATFORMS.podchaser,
    Icon: PodchaserLogo,
  },
];

/**
 * "Listen on": the podcast platforms as labelled pills, plus the RSS feed.
 *
 * A client island only because the platform logos read the theme; they are
 * drawn in currentColor so the pill's token colours apply in every theme mode
 * (the old brand-colour fills are gone with the old design system).
 */
export function ListenOn() {
  return (
    <ul className={styles.list}>
      {PLATFORMS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            className={styles.pill}
            href={href}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Icon color='currentColor' style={{ width: 20, height: 20 }} />
            {label}
            <NewTabHint />
          </a>
        </li>
      ))}
      <li>
        {/* A new tab, as before: the path has no file extension, so as a
            same-tab link PageTransition would treat this Function route as
            a page and client-navigate to it. */}
        <a
          className={styles.pill}
          href={TRI_RSS_PATH}
          target='_blank'
          rel='noopener noreferrer'
        >
          <RSSLogo color='currentColor' style={{ width: 20, height: 20 }} />
          RSS feed
          <NewTabHint />
        </a>
      </li>
    </ul>
  );
}

export default ListenOn;
