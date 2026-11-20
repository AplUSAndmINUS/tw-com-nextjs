'use client';

import { useEffect, useState } from 'react';
import {
  TwArticleCard,
  TwContentGrid,
  TwSectionHeading,
} from '@/components/dsm';
import { NewTabHint } from '@/components/NewTabHint';
import { getApiBaseUrl } from '@/lib/environment';
import { formatDotDate } from '@/app/home/contentFormat';
import { formatDuration, type YouTubeVideo } from '@/app/videos/types';
import {
  TRI_LINKS,
  TRI_YOUTUBE_CHANNEL_HANDLES,
} from '../theresonantid/constants';
import styles from './TriVideos.module.scss';

const MAX_VIDEOS = 6;

/**
 * The show's latest YouTube videos, fetched at runtime (the site is a static
 * export and the feed is an Azure Function). Supplemental: while loading, on
 * an error, or with no videos it renders nothing at all.
 */
export function TriVideos() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const channels = TRI_YOUTUBE_CHANNEL_HANDLES.join(',');
        const res = await fetch(
          `${getApiBaseUrl()}/api/youtube?type=videos&channel=${encodeURIComponent(channels)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.videos)) {
          setVideos(data.videos.slice(0, MAX_VIDEOS));
        }
      } catch {
        // Supplemental section: stay hidden on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (videos.length === 0) return null;

  return (
    <section
      id='videos'
      className={styles.section}
      aria-labelledby='tri-videos-title'
    >
      <div className={styles.container}>
        <div className={styles.head}>
          <TwSectionHeading
            kicker='Watch'
            title={<span id='tri-videos-title'>Videos on YouTube</span>}
          />
          <a
            className={styles.viewAll}
            href={TRI_LINKS.youtube}
            target='_blank'
            rel='noopener noreferrer'
          >
            View all on YouTube <span aria-hidden='true'>&#8599;</span>
            <NewTabHint />
          </a>
        </div>
        <TwContentGrid cols={3} tabletCols={2}>
          {videos.map((video) => (
            <TwArticleCard
              key={video.id}
              title={video.title}
              category={formatDuration(video.duration) || undefined}
              date={formatDotDate(video.publishedAt)}
              dateTime={video.publishedAt}
              image={video.thumbnailUrl}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              external
            />
          ))}
        </TwContentGrid>
      </div>
    </section>
  );
}

export default TriVideos;
