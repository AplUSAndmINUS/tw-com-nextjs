'use strict';

/**
 * Azure Function: api/youtube
 *
 * Fetches videos, live streams, and playlists from the @aplusinflux YouTube channel via YouTube Data API v3.
 *
 * Environment variables required:
 *   YOUTUBE_API_KEY  — Your Google/YouTube Data API v3 key
 *
 * Query params:
 *   - type: 'videos' | 'live' | 'playlists' (default: 'videos')
 *   - pageToken: pagination token (optional)
 *
 * Deploy to Azure Static Web Apps alongside the Next.js static export.
 * The function will be accessible at /api/youtube.
 */

const https = require('https');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CHANNEL_HANDLE = 'aplusinflux';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

/**
 * Performs an HTTPS GET and returns parsed JSON.
 * @param {string} url
 * @returns {Promise<any>}
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error(`JSON parse error: ${err.message}`));
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * Resolve @aplusinflux handle to channel ID.
 * @param {string} apiKey
 * @returns {Promise<string | null>}
 */
async function getChannelId(apiKey) {
  const url = `${YOUTUBE_API_BASE}/channels?part=id&forHandle=${CHANNEL_HANDLE}&key=${apiKey}`;
  try {
    const data = await httpGet(url);
    return data.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch videos, live streams, or playlists from the channel.
 * @param {string} apiKey
 * @param {string} channelId
 * @param {string} type - 'videos' | 'live' | 'playlists'
 * @param {string | undefined} pageToken
 * @returns {Promise<{ videos: any[], nextPageToken?: string, totalResults?: number }>}
 */
async function fetchVideos(apiKey, channelId, type, pageToken) {
  // Fetch playlists
  if (type === 'playlists') {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      maxResults: '24',
      key: apiKey,
      ...(pageToken ? { pageToken } : {}),
    });
    const url = `${YOUTUBE_API_BASE}/playlists?${params}`;
    const data = await httpGet(url);

    const videos = (data.items || []).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.default?.url ||
        '',
      publishedAt: item.snippet.publishedAt,
      type: 'playlist',
    }));

    return {
      videos,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo?.totalResults,
    };
  }

  // Fetch videos or live streams
  const params = new URLSearchParams({
    part: 'snippet',
    channelId,
    maxResults: '24',
    order: 'date',
    type: 'video',
    key: apiKey,
    ...(type === 'live' ? { eventType: 'live' } : {}),
    ...(pageToken ? { pageToken } : {}),
  });
  const searchUrl = `${YOUTUBE_API_BASE}/search?${params}`;
  const searchData = await httpGet(searchUrl);

  const videoIds = (searchData.items || [])
    .map((item) => item.id?.videoId)
    .filter(Boolean);

  if (!videoIds.length) {
    return {
      videos: [],
      nextPageToken: searchData.nextPageToken,
      totalResults: searchData.pageInfo?.totalResults,
    };
  }

  // Fetch video details (duration, view count)
  const detailsParams = new URLSearchParams({
    part: 'contentDetails,statistics',
    id: videoIds.join(','),
    key: apiKey,
  });
  const detailsUrl = `${YOUTUBE_API_BASE}/videos?${detailsParams}`;
  const detailsData = await httpGet(detailsUrl);

  const detailsMap = {};
  for (const item of detailsData.items || []) {
    detailsMap[item.id] = item;
  }

  const videos = (searchData.items || [])
    .map((item) => {
      const videoId = item.id?.videoId;
      const detail = detailsMap[videoId];
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url ||
          '',
        publishedAt: item.snippet.publishedAt,
        duration: detail?.contentDetails?.duration,
        viewCount: detail?.statistics?.viewCount,
        type: type === 'live' ? 'live' : 'video',
      };
    })
    .filter((v) => v.id);

  return {
    videos,
    nextPageToken: searchData.nextPageToken,
    totalResults: searchData.pageInfo?.totalResults,
  };
}

/**
 * @param {import('@azure/functions').HttpRequest} req
 * @param {import('@azure/functions').InvocationContext} context
 */
module.exports = async function (req, context) {
  context.log('youtube function triggered');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // Only accept GET
  if (req.method !== 'GET') {
    return {
      status: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        videos: [],
        error: 'Method not allowed',
      }),
    };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    context.log('YOUTUBE_API_KEY not configured');
    return {
      status: 503,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        videos: [],
        error: 'YouTube API key not configured',
      }),
    };
  }

  const type = req.query.type || 'videos';
  const pageToken = req.query.pageToken || undefined;

  // Validate type parameter
  if (!['videos', 'live', 'playlists'].includes(type)) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        videos: [],
        error: 'Invalid type parameter. Must be: videos, live, or playlists',
      }),
    };
  }

  try {
    const channelId = await getChannelId(apiKey);
    if (!channelId) {
      context.log(`Channel @${CHANNEL_HANDLE} not found`);
      return {
        status: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          videos: [],
          error: 'Channel not found',
        }),
      };
    }

    const result = await fetchVideos(apiKey, channelId, type, pageToken);
    context.log(
      `Successfully fetched ${result.videos.length} ${type} from @${CHANNEL_HANDLE}`
    );

    return {
      status: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(result),
    };
  } catch (error) {
    context.log('YouTube function error:', error);
    return {
      status: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        videos: [],
        error: 'Failed to fetch YouTube data',
      }),
    };
  }
};
