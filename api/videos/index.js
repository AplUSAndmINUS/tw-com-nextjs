/**
 * Azure Function: api/videos
 *
 * Returns a list of YouTube videos from the @terencewaters channel.
 *
 * Environment variables required:
 *   YOUTUBE_API_KEY  — Your Google/YouTube Data API v3 key
 *   YOUTUBE_CHANNEL_ID — Channel ID (default: @terencewaters)
 *
 * Deploy to Azure Static Web Apps alongside the Next.js static export.
 * The function will be accessible at /api/videos.
 */

const https = require('https');

const YOUTUBE_CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID || 'UCterencewaters'; // Set YOUTUBE_CHANNEL_ID env var in Azure Static Web Apps

const MAX_RESULTS = 20;

/**
 * Performs a simple HTTPS GET and returns parsed JSON.
 * @param {string} url
 * @returns {Promise<unknown>}
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
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * @param {import('@azure/functions').HttpRequest} req
 * @param {import('@azure/functions').InvocationContext} context
 */
module.exports = async function (req, context) {
  context.log('videos function triggered');

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'YOUTUBE_API_KEY is not configured.' }),
    };
  }

  try {
    // Step 1: Get uploads playlist ID for the channel
    const channelUrl =
      `https://www.googleapis.com/youtube/v3/channels` +
      `?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${apiKey}`;

    const channelData = await httpGet(channelUrl);
    const uploadsPlaylistId =
      channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Channel not found or no uploads playlist.' }),
      };
    }

    // Step 2: List videos from the uploads playlist
    const playlistUrl =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${MAX_RESULTS}&key=${apiKey}`;

    const playlistData = await httpGet(playlistUrl);

    const videos = (playlistData?.items ?? []).map((item) => {
      const snippet = item.snippet ?? {};
      const videoId = snippet?.resourceId?.videoId ?? '';
      return {
        id: videoId,
        youtubeId: videoId,
        title: snippet.title ?? '',
        description: snippet.description ?? '',
        thumbnailUrl:
          snippet.thumbnails?.medium?.url ??
          snippet.thumbnails?.default?.url ??
          '',
        publishedAt: snippet.publishedAt
          ? snippet.publishedAt.split('T')[0]
          : '',
        tags: [],
        category: 'YouTube',
      };
    });

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
      body: JSON.stringify({ videos }),
    };
  } catch (error) {
    context.log('Error fetching YouTube videos:', error);
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to fetch videos.' }),
    };
  }
};
