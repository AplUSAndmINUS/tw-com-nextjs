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
 * Validates that the parsed data is a valid array of podcast episodes.
 * @param {any} data - The parsed JSON data
 * @returns {{ valid: boolean, error?: string, episodes?: any[] }}
 */
function validateEpisodes(data) {
  if (!Array.isArray(data)) {
    return {
      valid: false,
      error: 'Invalid episodes data: expected an array',
    };
  }

  const requiredFields = [
    'slug',
    'title',
    'description',
    'audioUrl',
    'publishedDate',
  ];

  for (let i = 0; i < data.length; i++) {
    const episode = data[i];

    if (typeof episode !== 'object' || episode === null) {
      return {
        valid: false,
        error: `Invalid episode at index ${i}: expected an object`,
      };
    }

    for (const field of requiredFields) {
      if (!episode[field] || typeof episode[field] !== 'string') {
        return {
          valid: false,
          error: `Invalid episode at index ${i}: missing or invalid required field "${field}"`,
        };
      }
    }

    // Validate tags is an array
    if (!Array.isArray(episode.tags)) {
      return {
        valid: false,
        error: `Invalid episode at index ${i}: "tags" must be an array`,
      };
    }
  }

  return { valid: true, episodes: data };
}

/**
 * @param {import('@azure/functions').HttpRequest} req
 * @param {import('@azure/functions').InvocationContext} context
 */
module.exports = async function (req, context) {
  context.log('podcasts function triggered');

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.PODCAST_CONTAINER_NAME || 'podcasts';
  const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const episodesIndexUrl = process.env.PODCAST_EPISODES_INDEX_URL;

  // ── Option A: Public episodes.json URL provided directly ──────────────────
  if (episodesIndexUrl) {
    try {
      const raw = await fetchBlob(episodesIndexUrl);

      let parsedData;
      try {
        parsedData = JSON.parse(raw);
      } catch (parseError) {
        context.log('JSON parse error:', parseError);
        return {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid JSON in episodes file',
            details: parseError.message,
          }),
        };
      }

      const validation = validateEpisodes(parsedData);
      if (!validation.valid) {
        context.log('Validation error:', validation.error);
        return {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid episodes data structure',
            details: validation.error,
          }),
        };
      }

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
        },
        body: JSON.stringify({ episodes: validation.episodes }),
      };
    } catch (error) {
      context.log('Error fetching episodes index:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Failed to fetch episodes',
          details: error.message,
        }),
      };
    }
  }

  // ── Option B: Construct URL from storage account + container ──────────────
  if (storageAccountName) {
    const url = `https://${storageAccountName}.blob.core.windows.net/${containerName}/episodes.json`;
    try {
      const raw = await fetchBlob(url);

      let parsedData;
      try {
        parsedData = JSON.parse(raw);
      } catch (parseError) {
        context.log('JSON parse error:', parseError);
        return {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid JSON in episodes file',
            details: parseError.message,
          }),
        };
      }

      const validation = validateEpisodes(parsedData);
      if (!validation.valid) {
        context.log('Validation error:', validation.error);
        return {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'Invalid episodes data structure',
            details: validation.error,
          }),
        };
      }

      return {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800',
        },
        body: JSON.stringify({ episodes: validation.episodes }),
      };
    } catch (error) {
      context.log('Error fetching episodes from storage:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Failed to fetch episodes from storage',
          details: error.message,
        }),
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
