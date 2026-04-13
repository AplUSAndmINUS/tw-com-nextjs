import type { PodcastEpisode } from '@/content/types';

/** Spreaker show ID for "A+ in FLUX Mythmaker Series" */
export const SPREAKER_SHOW_ID = '6933506';

/** Public RSS feed URL for the show */
const SPREAKER_RSS_URL = `https://www.spreaker.com/show/${SPREAKER_SHOW_ID}/episodes/feed`;

/** Canonical show URL on Spreaker */
export const SPREAKER_SHOW_URL = `https://www.spreaker.com/podcast/a-in-flux-mythmaker-series--${SPREAKER_SHOW_ID}`;

/** Spreaker widget script CDN URL */
export const SPREAKER_WIDGET_SCRIPT = 'https://widget.spreaker.com/widgets.js';

/** Platform URLs for the A+ In FLUX Mythmaker podcast */
export const PODCAST_PLATFORMS = {
  spreaker:
    'https://www.spreaker.com/podcast/a-in-flux-mythmaker-series--6933506',
  applePodcasts:
    'https://podcasts.apple.com/us/podcast/a+-in-flux-mythmaker-series/id1891152754',
  spotify: 'https://open.spotify.com/show/0kmCO10TwluoHUYdD3v4Qe',
  iHeartRadio: 'https://iheart.com/podcast/329383182',
  amazonMusic:
    'https://music.amazon.com/podcasts/b4d2ead1-4aaa-4189-b4bd-bd41141030a7',
  deezer: 'https://www.deezer.com/show/1002848441',
  podchaser:
    'https://www.podchaser.com/podcasts/a-in-flux-mythmaker-series-6436183',
} as const;

export interface SpreakerFeedResult {
  episodes: PodcastEpisode[];
  showTitle: string;
  showDescription: string;
  showImageUrl: string;
  /** True when the feed was fetched successfully and contains episodes */
  available: boolean;
}

// ---------------------------------------------------------------------------
// Minimal XML helpers — avoids a third-party XML parser dependency
// ---------------------------------------------------------------------------

/** Extract text content of the first matching tag (handles CDATA and plain text). */
function extractText(xml: string, tag: string): string {
  const cdataRe = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`
  );
  const plainRe = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(cdataRe) ?? xml.match(plainRe);
  return m ? m[1].trim() : '';
}

/** Extract an attribute value from the first matching self-closing or open tag. */
function extractAttr(xml: string, tag: string, attr: string): string {
  // Use a lazy [^>]*? so the greedy match doesn't consume the target attribute.
  const re = new RegExp(`<${tag}[^>]*?\\s${attr}="([^"]*)"[^>]*/?>`);
  const m = xml.match(re);
  return m ? m[1] : '';
}

/** Produce a URL-safe slug from a string. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Extract the numeric Spreaker episode ID from a Spreaker episode URL. */
function extractSpreakerEpisodeId(url: string): string | undefined {
  const m = url.match(/\/(\d{6,})(?:[/?#]|$)/);
  return m ? m[1] : undefined;
}

/** Parse a single RSS `<item>` block into a `PodcastEpisode`. */
function parseRssItem(itemXml: string): PodcastEpisode | null {
  try {
    const title = extractText(itemXml, 'title');
    if (!title) return null;

    const description =
      extractText(itemXml, 'description') ||
      extractText(itemXml, 'itunes:summary') ||
      '';
    const pubDate = extractText(itemXml, 'pubDate');
    const audioUrl = extractAttr(itemXml, 'enclosure', 'url');
    const duration = extractText(itemXml, 'itunes:duration');
    const episodeNum = extractText(itemXml, 'itunes:episode');
    const seasonNum = extractText(itemXml, 'itunes:season');
    const guid = extractText(itemXml, 'guid');
    const link = extractText(itemXml, 'link');
    const imageUrl = extractAttr(itemXml, 'itunes:image', 'href');

    const spreakerEpisodeId =
      extractSpreakerEpisodeId(guid) || extractSpreakerEpisodeId(link);

    const titleSlug = slugify(title);
    const slug = spreakerEpisodeId
      ? `${titleSlug}--${spreakerEpisodeId}`
      : titleSlug;

    let publishedDate = '';
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d.getTime())) {
        publishedDate = d.toISOString().split('T')[0];
      }
    }

    return {
      slug,
      title,
      description: description.replace(/<[^>]+>/g, '').trim(),
      audioUrl,
      publishedDate,
      duration: duration || undefined,
      tags: [],
      category: 'Podcast',
      imageUrl: imageUrl || undefined,
      episode: episodeNum ? parseInt(episodeNum, 10) : undefined,
      season: seasonNum ? parseInt(seasonNum, 10) : undefined,
      spreakerEpisodeId,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch and parse the Spreaker RSS feed for the A+ in FLUX Mythmaker Series.
 * Returns an empty episode list (with `available: false`) on any error so
 * pages degrade gracefully when the feed is unavailable at build time.
 */
export async function fetchSpreakerEpisodes(): Promise<SpreakerFeedResult> {
  const fallback: SpreakerFeedResult = {
    episodes: [],
    showTitle: 'A+ in FLUX Mythmaker Series',
    showDescription:
      'Audio conversations on technology, creativity, and building meaningful things.',
    showImageUrl: '',
    available: false,
  };

  try {
    const res = await fetch(SPREAKER_RSS_URL, {
      // Cache the RSS response for 1 hour during build
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(
        `[Spreaker] RSS feed returned HTTP ${res.status} — using fallback`
      );
      return fallback;
    }

    const xml = await res.text();

    // Channel-level header text (everything before the first <item>)
    const channelHeader = xml.split('<item>')[0] ?? '';
    const showTitle = extractText(channelHeader, 'title') || fallback.showTitle;
    const showDescription =
      extractText(channelHeader, 'description') || fallback.showDescription;
    const showImageUrl =
      extractAttr(channelHeader, 'itunes:image', 'href') ||
      extractAttr(channelHeader, 'image', 'href');

    const episodes: PodcastEpisode[] = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const ep = parseRssItem(m[1]);
      if (ep) episodes.push(ep);
    }

    return {
      episodes,
      showTitle,
      showDescription,
      showImageUrl,
      available: episodes.length > 0,
    };
  } catch (err) {
    console.warn('[Spreaker] Failed to fetch RSS feed:', err);
    return fallback;
  }
}

/**
 * Fetch podcast episodes from the `/api/podcasts` Azure Function.
 *
 * Intended for **client-side** use — call this from a `useEffect` or SWR/React
 * Query hook. The response shape mirrors `SpreakerFeedResult` so callers can
 * treat build-time and runtime data identically.
 *
 * Returns `available: false` on any network or parse error so the UI degrades
 * gracefully without throwing.
 */
export async function fetchPodcastsFromApi(): Promise<SpreakerFeedResult> {
  const fallback: SpreakerFeedResult = {
    episodes: [],
    showTitle: 'A+ in FLUX Mythmaker Series',
    showDescription:
      'Audio conversations on technology, creativity, and building meaningful things.',
    showImageUrl: '',
    available: false,
  };

  try {
    const res = await fetch('/api/podcasts');

    if (!res.ok) {
      console.warn(`[Spreaker API] /api/podcasts returned HTTP ${res.status}`);
      return fallback;
    }

    const data = (await res.json()) as Partial<SpreakerFeedResult> & {
      error?: string;
    };

    if (data.error) {
      console.warn('[Spreaker API] Server error:', data.error);
      return fallback;
    }

    return {
      episodes: data.episodes ?? [],
      showTitle: data.showTitle ?? fallback.showTitle,
      showDescription: data.showDescription ?? fallback.showDescription,
      showImageUrl: data.showImageUrl ?? '',
      available: data.available ?? (data.episodes?.length ?? 0) > 0,
    };
  } catch (err) {
    console.warn('[Spreaker API] fetch failed:', err);
    return fallback;
  }
}
