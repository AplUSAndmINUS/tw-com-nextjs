/**
 * Terence's social profiles — the one list every icon row, the footer and the
 * Person schema read from, so a handle only ever changes in one place.
 */
import { PODCAST_PLATFORMS, SPREAKER_SHOW_ID } from './spreaker';

export const SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/aplusinflux',
  instagram: 'https://www.instagram.com/aplusinflux',
  threads: 'https://www.threads.com/@aplusinflux',
  linkedin: 'https://www.linkedin.com/in/terencewaters',
  github: 'https://github.com/AplUSAndmINUS',
  youtube: 'https://www.youtube.com/@theresonantidentity',
  tiktok: 'https://www.tiktok.com/@aplusinflux',
  twitch: 'https://www.twitch.tv/aplusinflux',
  reddit: 'https://www.reddit.com/user/APlusInFLUX/',
  xbox: 'https://www.xbox.com/en-US/play/user/APlusInFLUX',
  spotify: PODCAST_PLATFORMS.spotify,
  applePodcasts: PODCAST_PLATFORMS.applePodcasts,
  /** The Resonant Identity podcast feed on Spreaker. */
  podcastRss: `https://www.spreaker.com/show/${SPREAKER_SHOW_ID}/episodes/feed`,
  email: 'mailto:terence@terencewaters.com',
} as const;
