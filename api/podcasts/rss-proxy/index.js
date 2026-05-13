'use strict';

/**
 * Podcast RSS Proxy - Azure Function
 * Fetches and parses the Spreaker RSS feed for "The Resonant Identity" podcast,
 * returning episodes in the PodcastEpisode schema consumed by the front-end.
 *
 * Route: GET /api/podcasts/rss-proxy
 */

const SPREAKER_RSS_URL = 'https://www.spreaker.com/show/6933506/episodes/feed';

// Matches terencewaters.com and any subdomain (e.g. www., dev., staging.)
const ALLOWED_ORIGIN_RE =
  /^https:\/\/((?:[a-zA-Z0-9-]+\.)?terencewaters\.com)$/;

/**
 * Returns CORS headers scoped to an allowed origin.
 * Echoes the request origin back instead of '*', blocking disallowed third parties.
 * Set ALLOWED_ORIGIN_EXTRA to permit one additional origin (e.g. Azure SWA preview URLs).
 * @param {string|undefined} origin
 * @returns {object}
 */
function getCorsHeaders(origin) {
  const extra = process.env.ALLOWED_ORIGIN_EXTRA || '';
  const isAllowed =
    (origin && ALLOWED_ORIGIN_RE.test(origin)) || (extra && origin === extra);

  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // Cache for 30 minutes; serve stale for up to 1 hour while revalidating
    'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    Vary: 'Origin',
  };
}

/**
 * Extract the text content of an XML tag.
 * Handles both CDATA-wrapped and plain-text content.
 */
function getTagContent(xml, tag) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // CDATA
  let match = xml.match(
    new RegExp(
      `<${escapedTag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escapedTag}>`,
      'i'
    )
  );
  if (match) return match[1].trim();
  // Plain text
  match = xml.match(
    new RegExp(`<${escapedTag}[^>]*>([^<]*)<\\/${escapedTag}>`, 'i')
  );
  if (match) return match[1].trim();
  return '';
}

/**
 * Get the value of an attribute on an XML tag.
 */
function getAttrValue(xml, tag, attr) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = xml.match(
    new RegExp(`<${escapedTag}[^>]*\\s${attr}="([^"]*)"`, 'i')
  );
  return match ? match[1] : '';
}

/**
 * Convert a duration value (seconds integer or existing HH:MM:SS) to MM:SS or HH:MM:SS.
 * Spreaker RSS sends duration as an integer number of seconds.
 */
function formatDuration(duration) {
  if (!duration) return '';
  // Already formatted as MM:SS or HH:MM:SS — return as-is
  if (/^\d+:\d+/.test(duration)) return duration;
  const seconds = parseInt(duration, 10);
  if (isNaN(seconds)) return duration;
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Strip HTML tags from a string, converting <br> to newlines.
 */
function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Parse all <item> elements from an RSS XML string and return
 * them as PodcastEpisode-shaped objects.
 */
function parseRSSItems(xml) {
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  const episodes = [];
  let match;

  while ((match = itemPattern.exec(xml)) !== null) {
    const item = match[1];

    const title = getTagContent(item, 'title');
    const description = stripHtml(getTagContent(item, 'description'));
    const guid = getTagContent(item, 'guid');
    const pubDate = getTagContent(item, 'pubDate');
    const audioUrl = getAttrValue(item, 'enclosure', 'url');
    const audioLength = getAttrValue(item, 'enclosure', 'length');
    const duration = getTagContent(item, 'itunes:duration');
    const author = getTagContent(item, 'itunes:author');
    const imageHref = getAttrValue(item, 'itunes:image', 'href');
    const episodeNumber = getTagContent(item, 'itunes:episode');
    const keywords = getTagContent(item, 'itunes:keywords');

    // Derive a stable ID from the Spreaker episode URL in the guid
    // e.g. https://api.spreaker.com/episode/71137953 → "71137953"
    const guidMatch = guid.match(/episode\/(\d+)/);
    const episodeId = guidMatch ? guidMatch[1] : String(episodes.length + 1);

    episodes.push({
      id: episodeId,
      slug: episodeId,
      podcast_name: 'The Resonant Identity',
      episode_title: title,
      author_name: author || 'Terence Waters',
      description,
      publish_date: pubDate ? new Date(pubDate).toISOString() : '',
      duration: formatDuration(duration),
      audio_url: audioUrl,
      audio_size_bytes: audioLength ? parseInt(audioLength, 10) : undefined,
      episode_number: episodeNumber ? parseInt(episodeNumber, 10) : undefined,
      tags: keywords
        ? keywords
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      imageUrl: imageHref || undefined,
    });
  }

  return episodes;
}

module.exports = async function (context, req) {
  const origin = req.headers?.origin || req.headers?.Origin;
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: corsHeaders, body: '' };
    return;
  }

  try {
    const rssRes = await fetch(SPREAKER_RSS_URL);
    if (!rssRes.ok) {
      throw new Error(
        `Spreaker RSS fetch failed with status: ${rssRes.status}`
      );
    }

    const xml = await rssRes.text();
    const episodes = parseRSSItems(xml);

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({ episodes }),
    };
  } catch (error) {
    context.log.error('Podcast RSS proxy error:', error.message);
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to fetch podcast episodes from RSS feed.',
        episodes: [],
      }),
    };
  }
};
