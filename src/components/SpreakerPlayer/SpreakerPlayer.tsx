'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import {
  SPREAKER_SHOW_ID,
  SPREAKER_SHOW_URL,
} from '@/lib/spreaker';

/** Spreaker iframe player embed base URL */
const WIDGET_PLAYER_URL = 'https://widget.spreaker.com/player';

interface SpreakerPlayerProps {
  /** Spreaker show ID — defaults to The Resonant Identity */
  showId?: string;
  /** Spreaker numeric episode ID; when provided renders an episode-specific player */
  episodeId?: string;
  /** Player height in CSS units (default: 350px) */
  height?: string;
  /** Player colour theme (default: dark) */
  theme?: 'dark' | 'light';
  /** Pass false to show the "unavailable" fallback instead of the player */
  available?: boolean;
}

/**
 * SpreakerPlayer
 *
 * Renders the Spreaker embedded podcast player as an <iframe>.
 * Using the iframe directly (rather than the anchor + widgets.js approach)
 * is the recommended pattern for Next.js SPAs — it avoids the DOM-scanning
 * behaviour of widgets.js that does not re-run on client-side navigation.
 *
 * The iframe src mirrors every data-* attribute from the official JS embed snippet,
 * so the visual result is identical.
 */
export function SpreakerPlayer({
  showId = SPREAKER_SHOW_ID,
  episodeId,
  height = '350px',
  theme = 'dark',
  available = true,
}: SpreakerPlayerProps) {
  const { theme: appTheme, reducedTransparency } = useAppTheme();

  if (!available) {
    return (
      <div
        className='flex items-center justify-center p-8 rounded-lg'
        style={{
          backgroundColor: reducedTransparency
            ? appTheme.palette.neutralLight
            : appTheme.palette.neutralLighterAlt,
        }}
        role='alert'
        aria-live='polite'
      >
        <p
          className='text-sm'
          style={{ color: appTheme.palette.neutralSecondary }}
        >
          This podcast is currently unavailable.{' '}
          <a
            href={SPREAKER_SHOW_URL}
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: appTheme.semanticColors.link.default }}
            className='underline'
          >
            Visit on Spreaker
          </a>
        </p>
      </div>
    );
  }

  const params = new URLSearchParams({
    ...(episodeId ? { episode_id: episodeId } : { show_id: showId }),
    theme,
    playlist: episodeId ? 'false' : 'show',
    'playlist-continuous': 'true',
    'chapters-image': 'true',
    episode_image_position: 'right',
    hide_logo: 'false',
    hide_likes: 'false',
    hide_comments: 'false',
    hide_sharing: 'false',
    hide_download: 'true',
  });

  const iframeSrc = `${WIDGET_PLAYER_URL}?${params.toString()}`;
  const playerTitle = episodeId
    ? 'Spreaker podcast episode player'
    : 'The Resonant Identity podcast player';

  return (
    <iframe
      src={iframeSrc}
      width='100%'
      height={height}
      style={{ border: 0 }}
      title={playerTitle}
      allow='autoplay; clipboard-write'
      aria-label={playerTitle}
      className='rounded-lg'
      loading='lazy'
    />
  );
}
