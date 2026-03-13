/**
 * Azure Function: api/unsubscribe
 *
 * Unsubscribes an email address from the "A+ in FLUX- Mythmaker Drop" newsletter
 * by finding and deleting the matching entry in the SharePoint Online Email
 * Distribution List via the Microsoft Graph API.
 *
 * Environment variables required:
 *   ENTRAID_SP_APP_REGISTRATION_CLIENT_ID  — Entra ID App Registration Client ID
 *   ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET — Entra ID App Registration Client Secret
 *   ENTRAID_TENANT_ID                      — Azure/Entra tenant ID
 *   SHAREPOINT_SITE_ID                     — SharePoint site ID
 *   SHAREPOINT_LIST_ID                     — SharePoint list ID for the Email Distribution List
 *
 * Request body:
 *   { "email": "user@example.com" }
 *
 * Response:
 *   200 { "message": "Unsubscribed successfully" }
 *   400 { "error": "..." }
 *   404 { "message": "Email not found" }  Returned whether or not the email existed in the list (no user-visible "not found" error — see 4d).
 *   500 { "error": "..." }
 */

'use strict';

const https = require('https');

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0';

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Performs an HTTPS request and returns the parsed JSON response.
 * @param {object} options - Node https.request options
 * @param {string|null} body - Request body (JSON string or null)
 * @returns {Promise<{ statusCode: number; body: object }>}
 */
function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: responseBody ? JSON.parse(responseBody) : {},
          });
        } catch {
          resolve({ statusCode: res.statusCode, body: {} });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

/**
 * Acquires an OAuth2 access token from Microsoft Entra ID using client credentials.
 * @param {string} tenantId
 * @param {string} clientId
 * @param {string} clientSecret
 * @returns {Promise<string>} access token
 */
async function getAccessToken(tenantId, clientId, clientSecret) {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
  }).toString();

  const options = {
    hostname: 'login.microsoftonline.com',
    path: `/${tenantId}/oauth2/v2.0/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const result = await httpsRequest(options, body);

  if (result.statusCode !== 200 || !result.body.access_token) {
    throw new Error(
      `Failed to acquire token: ${result.body.error_description || 'Unknown error'}`
    );
  }

  return result.body.access_token;
}

/**
 * Searches the SharePoint list for an item matching the given email.
 * @param {string} accessToken
 * @param {string} siteId
 * @param {string} listId
 * @param {string} email
 * @returns {Promise<string|null>} item ID or null if not found
 */
async function findEmailInSharePoint(accessToken, siteId, listId, email) {
  const encodedFilter = encodeURIComponent(`fields/Email eq '${email}'`);
  const path = `/v1.0/sites/${siteId}/lists/${listId}/items?$filter=${encodedFilter}&$select=id,fields`;

  const options = {
    hostname: 'graph.microsoft.com',
    path,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  const result = await httpsRequest(options, null);

  if (result.statusCode !== 200) {
    throw new Error(`Failed to query SharePoint: HTTP ${result.statusCode}`);
  }

  const items = result.body.value || [];
  if (items.length === 0) {
    return null;
  }

  return items[0].id;
}

/**
 * Deletes a SharePoint list item by ID.
 * @param {string} accessToken
 * @param {string} siteId
 * @param {string} listId
 * @param {string} itemId
 * @returns {Promise<void>}
 */
async function deleteEmailFromSharePoint(accessToken, siteId, listId, itemId) {
  const options = {
    hostname: 'graph.microsoft.com',
    path: `/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const result = await httpsRequest(options, null);

  if (result.statusCode !== 204) {
    throw new Error(
      `Failed to delete item from SharePoint: HTTP ${result.statusCode}`
    );
  }
}

module.exports = async function (context, req) {
  const origin = req.headers['origin'];
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (req.method !== 'POST') {
    return {
      status: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return {
      status: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Email is required' }),
    };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!isValidEmail(trimmedEmail)) {
    return {
      status: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid email address' }),
    };
  }

  const tenantId = process.env.ENTRAID_TENANT_ID;
  const clientId = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_ID;
  const clientSecret = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET;
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SHAREPOINT_LIST_ID;

  if (!tenantId || !clientId || !clientSecret || !siteId || !listId) {
    context.log.error(
      'Missing required environment variables for SharePoint integration'
    );
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  try {
    const accessToken = await getAccessToken(tenantId, clientId, clientSecret);
    const itemId = await findEmailInSharePoint(
      accessToken,
      siteId,
      listId,
      trimmedEmail
    );

    if (!itemId) {
      // Per AC 4d: log warning but still return success to user
      console.warn(`No email found in distribution list: ${trimmedEmail}`);
      return {
        status: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unsubscribed successfully' }),
      };
    }

    await deleteEmailFromSharePoint(accessToken, siteId, listId, itemId);
    context.log(`Newsletter unsubscription completed for: ${trimmedEmail}`);

    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Unsubscribed successfully' }),
    };
  } catch (err) {
    context.log.error('Newsletter unsubscribe error:', err.message);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to unsubscribe. Please try again.',
      }),
    };
  }
};
