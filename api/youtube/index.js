'use strict';

/**
 * Azure Function: api/youtube
 *
 * Fetches videos, live streams, and playlists from a YouTube channel via YouTube Data API v3.
 *
 * Environment variables required:
 *   YOUTUBE_API_KEY  — Your Google/YouTube Data API v3 key
 *
 * Query params:
 *   - type: 'videos' | 'live' | 'playlists' (default: 'videos')
 *   - channel: YouTube channel handle(s) without the @ prefix (optional)
 *              Supports a single handle or a comma-separated list.
 *              Defaults to: 'TerenceRWaters,theresonantidentity'
 *              Allowed values: 'TerenceRWaters', 'theresonantidentity'
 *   - pageToken: pagination token (optional)
 *
 * Deploy to Azure Static Web Apps alongside the Next.js static export.
 * The function will be accessible at /api/youtube.
 */

const https = require('https');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const DEFAULT_CHANNEL_HANDLES = ['TerenceRWaters', 'theresonantidentity'];
// YouTube handles are case-insensitive, but the API forHandle param requires the exact
// handle as registered on the channel. These values match their respective channel URLs.
const ALLOWED_CHANNEL_HANDLES = ['TerenceRWaters', 'theresonantidentity'];

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
 * Parse query channel value into normalized handles.
 * @param {string | undefined} channelQuery
 * @returns {string[]}
 */
function parseChannelHandles(channelQuery) {
  if (!channelQuery) return DEFAULT_CHANNEL_HANDLES;

  const handles = channelQuery
    .split(',')
    .map((handle) => handle.trim())
    .filter(Boolean);

  return handles.length > 0 ? handles : DEFAULT_CHANNEL_HANDLES;
}

/**
 * Resolve channel handle to channel ID.
 * @param {string} apiKey
 * @param {string} channelHandle
 * @returns {Promise<string | null>}
 */
async function getChannelId(apiKey, channelHandle) {
  const url = `${YOUTUBE_API_BASE}/channels?part=id&forHandle=${channelHandle}&key=${apiKey}`;
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
 * @param {import('@azure/functions').InvocationContext} context
 * @param {import('@azure/functions').HttpRequest} req
 */
module.exports = async function (context, req) {
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
  const channelHandles = parseChannelHandles(req.query.channel);

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

  // Validate channel parameter(s)
  if (
    channelHandles.some((handle) => !ALLOWED_CHANNEL_HANDLES.includes(handle))
  ) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        videos: [],
        error:
          'Invalid channel parameter. Allowed values: TerenceRWaters, theresonantidentity',
      }),
    };
  }

  if (pageToken && channelHandles.length > 1) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        videos: [],
        error: 'pageToken is only supported when querying a single channel',
      }),
    };
  }

  try {
    const perChannelResults = [];

    for (const channelHandle of channelHandles) {
      const channelId = await getChannelId(apiKey, channelHandle);
      if (!channelId) {
        context.log(`Channel @${channelHandle} not found`);
        return {
          status: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            videos: [],
            error: `Channel not found: ${channelHandle}`,
          }),
        };
      }

      const channelResult = await fetchVideos(
        apiKey,
        channelId,
        type,
        pageToken
      );
      perChannelResults.push({
        handle: channelHandle,
        ...channelResult,
      });
    }

    const mergedVideos = perChannelResults
      .flatMap((result) =>
        result.videos.map((video) => ({
          ...video,
          channelHandle: result.handle,
        }))
      )
      .sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bTime - aTime;
      });

    const dedupedVideos = [];
    const seen = new Set();
    for (const video of mergedVideos) {
      const key = `${video.type}:${video.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      dedupedVideos.push(video);
    }

    const totalResults = perChannelResults.reduce(
      (sum, result) => sum + (result.totalResults || 0),
      0
    );

    const result = {
      videos: dedupedVideos,
      nextPageToken:
        channelHandles.length === 1
          ? perChannelResults[0]?.nextPageToken
          : undefined,
      totalResults,
    };

    context.log(
      `Successfully fetched ${result.videos.length} ${type} across ${channelHandles.join(', ')}`
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
