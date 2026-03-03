/**
 * YouTube Video Types
 */

export type VideoType = 'videos' | 'live' | 'playlists';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  type: 'video' | 'live' | 'playlist';
}

export interface VideoTabConfig {
  key: VideoType;
  label: string;
  iconName: string;
}

export const VIDEO_TABS: VideoTabConfig[] = [
  { key: 'videos', label: 'Videos', iconName: 'Video24Regular' },
  { key: 'live', label: 'Live', iconName: 'LiveOff24Regular' },
  { key: 'playlists', label: 'Playlists', iconName: 'List24Regular' },
];

/**
 * Parse ISO 8601 duration (e.g. PT1H2M3S) into a readable string.
 * @example
 * formatDuration('PT1H2M3S') // '1:02:03'
 * formatDuration('PT15M30S') // '15:30'
 * formatDuration('PT45S') // '0:45'
 */
export function formatDuration(iso?: string): string | undefined {
  if (!iso) return undefined;

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;

  const h = match[1] ? parseInt(match[1], 10) : 0;
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const s = match[3] ? parseInt(match[3], 10) : 0;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
