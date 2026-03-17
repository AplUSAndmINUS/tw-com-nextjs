'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';

export function PodcastEpisodeLabel() {
  const { theme } = useAppTheme();
  return (
    <span
      className='text-xs font-semibold uppercase tracking-wide'
      style={{ color: theme.semanticColors.link.default }}
    >
      Podcast Episode
    </span>
  );
}
