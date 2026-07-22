'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './PodcastEpisodeLabel.module.scss';

export function PodcastEpisodeLabel() {
  const { theme } = useAppTheme();
  return (
    <span
      className={styles.label}
      style={{ color: theme.semanticColors.link.default }}
    >
      Podcast Episode
    </span>
  );
}
