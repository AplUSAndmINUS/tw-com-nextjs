'use strict';

/**
 * Azure Function: api/podcasts
 *
 * Fetches and parses the Spreaker RSS feed for The Authentic Growth Mythmaker Series
 * (show ID 6933506) and returns episode metadata as JSON.
 *
 * No environment variables required — the Spreaker RSS feed is public.
 *
 * Query params:
 *   (none currently — returns all episodes from the show RSS feed)
 *
 * Deploy to Azure Static Web Apps alongside the Next.js static export.
 * The function will be accessible at /api/podcasts.
 */

const https = require('https');

const SPREAKER_SHOW_ID = '6933506';
const SPREAKER_RSS_URL = `https://www.spreaker.com/show/${SPREAKER_SHOW_ID}/episodes/feed`;
const SPREAKER_SHOW_URL = `https://www.spreaker.com/podcast/a-in-flux-mythmaker-series--${SPREAKER_SHOW_ID}`;

// Matches terencewaters.com and any subdomain (e.g. www., dev., staging.)
const ALLOWED_ORIGIN_RE =
  /^https:\/\/((?:[a-zA-Z0-9-]+\.)?terencewaters\.com)$/;

/** HTTP request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 10000;

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
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    Vary: 'Origin',
  };
}

/**
 * Performs an HTTPS GET and returns the response body as a string.
 * Rejects on non-2xx status codes and enforces a request timeout.
 * @param {string} url
 * @returns {Promise<string>}
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const { statusCode } = res;

      if (statusCode < 200 || statusCode >= 300) {
        res.resume(); // Consume response data to free up memory/socket
        reject(new Error(`Request failed with status code ${statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);

    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error('Request timed out'));
    });
  });
}

/**
 * Extract text content of the first matching XML tag (handles CDATA and plain text).
 * @param {string} xml
 * @param {string} tag
 * @returns {string}
 */
function extractText(xml, tag) {
  const cdataRe = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`
  );
  const plainRe = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = xml.match(cdataRe) ?? xml.match(plainRe);
  return m ? m[1].trim() : '';
}

/**
 * Extract an attribute value from the first matching tag.
 * @param {string} xml
 * @param {string} tag
 * @param {string} attr
 * @returns {string}
 */
function extractAttr(xml, tag, attr) {
  // Use a lazy [^>]*? so the greedy match doesn't consume the target attribute.
  const re = new RegExp(`<${tag}[^>]*?\\s${attr}="([^"]*)"[^>]*/?>`);
  const m = xml.match(re);
  return m ? m[1] : '';
}

/**
 * Produce a URL-safe slug from a string.
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Extract the numeric Spreaker episode ID from a Spreaker episode URL.
 * @param {string} url
 * @returns {string | undefined}
 */
function extractSpreakerEpisodeId(url) {
  const m = url.match(/\/(\d{6,})(?:[/?#]|$)/);
  return m ? m[1] : undefined;
}

/**
 * Parse a single RSS <item> block into a podcast episode object.
 * @param {string} itemXml
 * @returns {object | null}
 */
function parseRssItem(itemXml) {
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
    extractSpreakerEpisodeId(guid) ?? extractSpreakerEpisodeId(link);

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
}

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {import('@azure/functions').HttpRequest} req
 */
module.exports = async function (context, req) {
  context.log('podcasts function triggered');

  const origin = req.headers?.origin || req.headers?.Origin;
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (req.method !== 'GET') {
    return {
      status: 405,
      headers: corsHeaders,
      body: JSON.stringify({ episodes: [], error: 'Method not allowed' }),
    };
  }

  try {
    const xml = await httpGet(SPREAKER_RSS_URL);

    const channelHeader = xml.split('<item>')[0] || '';
    const showTitle =
      extractText(channelHeader, 'title') ||
      'The Authentic Growth Mythmaker Series';
    const showDescription = extractText(channelHeader, 'description') || '';
    const showImageUrl =
      extractAttr(channelHeader, 'itunes:image', 'href') ||
      extractAttr(channelHeader, 'image', 'href') ||
      '';

    const episodes = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRe.exec(xml)) !== null) {
      const ep = parseRssItem(match[1]);
      if (ep) episodes.push(ep);
    }

    context.log(`Fetched ${episodes.length} episodes from Spreaker RSS`);

    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        episodes,
        showTitle,
        showDescription,
        showImageUrl,
        showUrl: SPREAKER_SHOW_URL,
        available: episodes.length > 0,
      }),
    };
  } catch (error) {
    context.log('podcasts function error:', error);
    return {
      status: 503,
      headers: corsHeaders,
      body: JSON.stringify({
        episodes: [],
        showTitle: '`The Authentic Growth Mythmaker Series',
        showDescription: '',
        showImageUrl: '',
        showUrl: SPREAKER_SHOW_URL,
        available: false,
        error: 'Failed to fetch podcast feed',
      }),
    };
  }
};
