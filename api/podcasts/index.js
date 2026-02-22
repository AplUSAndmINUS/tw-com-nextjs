/**
 * Azure Function: api/podcasts
 *
 * Returns a list of podcast episodes from Azure Blob Storage.
 * Episodes are stored as JSON metadata files alongside audio files.
 *
 * Environment variables required:
 *   AZURE_STORAGE_CONNECTION_STRING — Azure Storage connection string
 *   PODCAST_CONTAINER_NAME          — Blob container name (default: "podcasts")
 *
 * Expected container structure:
 *   podcasts/
 *     episodes.json          ← master episode index (array of PodcastEpisode)
 *     {slug}/
 *       audio.mp3
 *       episode.json         ← per-episode metadata
 *
 * Deploy alongside the Next.js static export in Azure Static Web Apps.
 * The function will be accessible at /api/podcasts.
 */

const https = require('https');

/**
 * Fetches an Azure Blob via its URL using a SAS token or public access.
 * @param {string} url
 */
function fetchBlob(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

/**
 * @param {import('@azure/functions').HttpRequest} req
 * @param {import('@azure/functions').InvocationContext} context
 */
module.exports = async function (req, context) {
  context.log('podcasts function triggered');

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName =
    process.env.PODCAST_CONTAINER_NAME || 'podcasts';
  const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const episodesIndexUrl = process.env.PODCAST_EPISODES_INDEX_URL;

  // ── Option A: Public episodes.json URL provided directly ──────────────────
  if (episodesIndexUrl) {
    try {
      const raw = await fetchBlob(episodesIndexUrl);
      const episodes = JSON.parse(raw);
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
        },
        body: JSON.stringify({ episodes }),
      };
    } catch (error) {
      context.log('Error fetching episodes index:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch episodes.' }),
      };
    }
  }

  // ── Option B: Construct URL from storage account + container ──────────────
  if (storageAccountName) {
    const url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/episodes.json`;
    try {
      const raw = await fetchBlob(url);
      const episodes = JSON.parse(raw);
      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
        },
        body: JSON.stringify({ episodes }),
      };
    } catch (error) {
      context.log('Error fetching episodes from storage:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to fetch episodes from storage.' }),
      };
    }
  }

  // ── Not configured ─────────────────────────────────────────────────────────
  if (!connectionString && !storageAccountName && !episodesIndexUrl) {
    return {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error:
          'Podcast storage is not configured. Set AZURE_STORAGE_CONNECTION_STRING, ' +
          'AZURE_STORAGE_ACCOUNT_NAME, or PODCAST_EPISODES_INDEX_URL.',
      }),
    };
  }

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ episodes: [] }),
  };
};
