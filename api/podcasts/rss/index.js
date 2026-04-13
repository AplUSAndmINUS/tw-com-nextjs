'use strict';

/**
 * Podcast RSS Feed - Azure Function
 * Generates a valid podcast RSS 2.0 feed from Azure Table Storage episode metadata
 * Compatible with Apple Podcasts, Spotify, and Spreaker's "Import from RSS" workflow
 *
 * Route: /api/podcasts/rss
 */

const PODCAST_NAME = 'The Authentic Growth Mythmaker Series';
const PODCAST_AUTHOR = 'Fluxline';
const PODCAST_DESCRIPTION =
  'The Authentic Growth Mythmaker Series — audio episodes covering transformation, strategy, and personal development by Fluxline.';
const PODCAST_LINK = 'https://www.fluxline.pro/podcasts';
const PODCAST_IMAGE = 'https://www.fluxline.pro/images/FluxlineLogo.png';
const PODCAST_LANGUAGE = 'en-us';
const PODCAST_CATEGORY = 'Business';

const RSS_HEADERS = {
  'Content-Type': 'application/rss+xml; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

async function getAllEpisodes() {
  const tableUrl = process.env.AZURE_TABLE_STORAGE_URL;
  const sasToken = process.env.AZURE_TABLE_SAS_TOKEN;
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || 'prod';
  const tableName =
    env === 'prod'
      ? process.env.AZURE_PODCAST_TABLE_PROD || 'podcasts'
      : process.env.AZURE_PODCAST_TABLE_DEV || 'podcastsdev';

  if (!tableUrl || !sasToken) return [];

  const url = `${tableUrl}/${tableName}?${sasToken}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json;odata=nometadata',
      'x-ms-version': '2020-04-08',
    },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.value || [];
}

/**
 * Escape XML attribute values
 */
function escapeXmlAttr(str) {
  if (!str) return '';
  return String(str).replace(
    /[<>&"']/g,
    (c) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[c] || c
  );
}

/**
 * Validate and sanitize URL for RSS feed
 * Returns the URL if valid, or null if invalid
 */
function validateAudioUrl(url) {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);
    // Only allow HTTPS URLs for security
    if (parsed.protocol !== 'https:') return null;
    return url;
  } catch {
    return null;
  }
}

module.exports = async function (context, req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: RSS_HEADERS, body: '' };
    return;
  }

  try {
    const rows = await getAllEpisodes();

    const sorted = rows.sort((a, b) => {
      const da = a.publish_date ? new Date(a.publish_date).getTime() : 0;
      const db = b.publish_date ? new Date(b.publish_date).getTime() : 0;
      return db - da;
    });

    const items = sorted
      .map((row) => {
        const slug = row.slug || row.RowKey;
        const episodeUrl = `${PODCAST_LINK}/${slug}`;
        const pubDate = row.publish_date
          ? new Date(row.publish_date).toUTCString()
          : new Date().toUTCString();
        const title = escapeXmlAttr(row.episode_title || slug);
        const description = escapeXmlAttr(row.description || '');

        // Validate and escape audio URL
        const audioUrl = validateAudioUrl(row.audio_url);
        const escapedAudioUrl = audioUrl ? escapeXmlAttr(audioUrl) : null;

        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${episodeUrl}</link>
      <guid isPermaLink="true">${episodeUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      ${escapedAudioUrl ? `<enclosure url="${escapedAudioUrl}" type="audio/mpeg" length="${row.audio_size_bytes || 0}" />` : ''}
      ${row.duration ? `<itunes:duration>${row.duration}</itunes:duration>` : ''}
      ${row.episode_number !== undefined ? `<itunes:episode>${row.episode_number}</itunes:episode>` : ''}
      <itunes:author>${PODCAST_AUTHOR}</itunes:author>
      <itunes:summary><![CDATA[${description}]]></itunes:summary>
      <itunes:explicit>false</itunes:explicit>
    </item>`;
      })
      .join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${PODCAST_NAME}]]></title>
    <link>${PODCAST_LINK}</link>
    <description><![CDATA[${PODCAST_DESCRIPTION}]]></description>
    <language>${PODCAST_LANGUAGE}</language>
    <atom:link href="https://www.fluxline.pro/api/podcasts/rss" rel="self" type="application/rss+xml" />
    <itunes:author>${PODCAST_AUTHOR}</itunes:author>
    <itunes:summary><![CDATA[${PODCAST_DESCRIPTION}]]></itunes:summary>
    <itunes:category text="${PODCAST_CATEGORY}" />
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${PODCAST_IMAGE}" />
    <image>
      <url>${PODCAST_IMAGE}</url>
      <title><![CDATA[${PODCAST_NAME}]]></title>
      <link>${PODCAST_LINK}</link>
    </image>
    ${items}
  </channel>
</rss>`;

    context.res = {
      status: 200,
      headers: RSS_HEADERS,
      body: rss,
    };
  } catch (error) {
    context.log.error('RSS feed error:', error);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to generate RSS feed' }),
    };
  }
};
