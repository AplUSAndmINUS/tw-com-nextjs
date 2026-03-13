/**
 * Azure Function: api/subscribe
 *
 * Subscribes an email address to the "A+ in FLUX- Mythmaker Drop" newsletter
 * by adding an entry to the SharePoint Online Email Distribution List via the
 * Microsoft Graph API.
 *
 * Environment variables required:
 *   ENTRAID_SP_APP_REGISTRATION_CLIENT_ID  — Entra ID App Registration Client ID
 *   ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET — Entra ID App Registration Client Secret
 *   ENTRAID_TENANT_ID                      — Azure/Entra tenant ID
 *   SHAREPOINT_SITE_ID                     — SharePoint site ID (or use SHAREPOINT_SITE_URL)
 *   SHAREPOINT_LIST_ID                     — SharePoint list ID for the Email Distribution List
 *
 * Request body:
 *   { "email": "user@example.com" }
 *
 * Response:
 *   200 { "message": "Subscribed successfully" }
 *   400 { "error": "..." }
 *   500 { "error": "..." }
 */

'use strict';

const https = require('https');

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const LEAD_PLATFORM = 'TW.com';
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
 * Acquires an OAuth2 access token from Microsoft Entra ID (formerly Azure AD)
 * using the client credentials flow.
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
 * Adds a new item to the SharePoint Email Distribution List.
 * @param {string} accessToken
 * @param {string} siteId
 * @param {string} listId
 * @param {string} email
 * @returns {Promise<object>} created item
 */
async function addEmailToSharePoint(accessToken, siteId, listId, email) {
  const emailField = process.env.SHAREPOINT_EMAIL_FIELD || 'Email';
  const platformField =
    process.env.SHAREPOINT_PLATFORM_FIELD || 'Lead_x0020_Platform';
  const timestampField = process.env.SHAREPOINT_TIMESTAMP_FIELD || 'Timestamp';
  const timestamp = new Date().toISOString();

  const fields = {
    [emailField]: email,
  };
  if (platformField) fields[platformField] = LEAD_PLATFORM;
  if (timestampField) fields[timestampField] = timestamp;

  const payload = JSON.stringify({ fields });

  const options = {
    hostname: 'graph.microsoft.com',
    path: `/v1.0/sites/${siteId}/lists/${listId}/items`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const result = await httpsRequest(options, payload);

  if (result.statusCode !== 201) {
    const detail = result.body?.error?.message || JSON.stringify(result.body);
    throw new Error(
      `Failed to add email to SharePoint: HTTP ${result.statusCode} — ${detail}`
    );
  }

  return result.body;
}

module.exports = async function (context, req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (req.method !== 'POST') {
    return {
      status: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Email is required' }),
    };
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!isValidEmail(trimmedEmail)) {
    return {
      status: 400,
      headers: CORS_HEADERS,
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
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  try {
    const accessToken = await getAccessToken(tenantId, clientId, clientSecret);
    await addEmailToSharePoint(accessToken, siteId, listId, trimmedEmail);

    context.log(`Newsletter subscription added for: ${trimmedEmail}`);

    return {
      status: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Subscribed successfully' }),
    };
  } catch (err) {
    context.log.error('Newsletter subscribe error:', err.message);
    return {
      status: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
    };
  }
};
