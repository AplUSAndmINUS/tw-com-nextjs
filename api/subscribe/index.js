/**
 * Azure Function: api/subscribe
 *
 * Subscribes an email address to "The Resonant Identity" email newsletter
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
 *   504 { "error": "..." }  Upstream (Entra ID or Graph) timed out.
 */

'use strict';

const { requestJson, isTimeoutError } = require('../httpClient');
const {
  getClientIp,
  takeNewsletterRateLimitToken,
} = require('../newsletterRateLimit');

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
 * Acquires an OAuth2 access token from Microsoft Entra ID (formerly Azure AD)
 * using the client credentials flow.
 * @param {string} tenantId
 * @param {string} clientId
 * @param {string} clientSecret
 * @param {(msg: string) => void} [log]
 * @returns {Promise<string>} access token
 */
async function getAccessToken(tenantId, clientId, clientSecret, log) {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
  }).toString();

  const result = await requestJson(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      label: 'Entra ID token endpoint',
      log,
    }
  );

  if (result.statusCode !== 200 || !result.body.access_token) {
    throw new Error(
      `Failed to acquire token: ${result.body.error_description || 'Unknown error'}`
    );
  }

  return result.body.access_token;
}

/**
 * Adds a new item to the SharePoint Email Distribution List.
 *
 * Note: the email value is sent as a JSON field in the POST body, not
 * embedded in an OData $filter string, so no OData string escaping is
 * required here. See api/unsubscribe/index.js for the escapeODataString
 * helper that protects the filter-based lookup in the unsubscribe path.
 *
 * @param {string} accessToken
 * @param {string} siteId
 * @param {string} listId
 * @param {string} email
 * @param {(msg: string) => void} [log]
 * @returns {Promise<object>} created item
 */
async function addEmailToSharePoint(accessToken, siteId, listId, email, log) {
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

  const result = await requestJson(
    `${GRAPH_BASE_URL}/sites/${siteId}/lists/${listId}/items`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: payload,
      label: 'Graph list item create',
      log,
    }
  );

  if (result.statusCode !== 201) {
    const detail = result.body?.error?.message || JSON.stringify(result.body);
    throw new Error(
      `Failed to add email to SharePoint: HTTP ${result.statusCode} — ${detail}`
    );
  }

  return result.body;
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

  const clientIp = getClientIp(req);
  const rateLimitResult = takeNewsletterRateLimitToken(clientIp);

  if (!rateLimitResult.allowed) {
    context.log.warn(
      `Newsletter subscribe rate limit exceeded for IP ${clientIp}. Violation #${rateLimitResult.violations}. Retry after ${rateLimitResult.retryAfterSeconds} seconds.`
    );
    return {
      status: 429,
      headers: {
        ...corsHeaders,
        'Retry-After': String(rateLimitResult.retryAfterSeconds),
      },
      body: JSON.stringify({
        error: 'Too Many Requests',
        retryAfter: rateLimitResult.retryAfterSeconds,
      }),
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

  const log = (msg) => context.log(msg);

  try {
    const accessToken = await getAccessToken(
      tenantId,
      clientId,
      clientSecret,
      log
    );
    await addEmailToSharePoint(accessToken, siteId, listId, trimmedEmail, log);

    context.log(`Newsletter subscription added for: ${trimmedEmail}`);

    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Subscribed successfully' }),
    };
  } catch (err) {
    if (isTimeoutError(err)) {
      context.log.error(
        `Newsletter subscribe timed out calling ${err.label} after ${err.timeoutMs} ms`
      );
      return {
        status: 504,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'The request timed out. Please try again.',
        }),
      };
    }

    context.log.error('Newsletter subscribe error:', err.message);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
    };
  }
};
