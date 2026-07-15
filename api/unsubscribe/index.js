/**
 * Azure Function: api/unsubscribe
 *
 * Unsubscribes an email address from "The Resonant Identity" email newsletter
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
 *   504 { "error": "..." }  Upstream (Entra ID or Graph) timed out.
 */

'use strict';

const { request, requestJson, isTimeoutError } = require('../httpClient');
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
 * Escapes a string value for safe use inside an OData string literal.
 *
 * OData encodes string literals between single quotes, and a literal single
 * quote inside the value must be represented as two consecutive single quotes
 * (e.g. "o'hara@example.com" → "o''hara@example.com"). Without this escaping
 * a value such as "user@x.com' or '1'='1" could manipulate the filter
 * expression and match unintended list items.
 *
 * Reference: OData v4 spec §5.1.1.6.1 "String and Collection Literals"
 *
 * @param {string} value - Raw string to embed in an OData filter literal
 * @returns {string} Escaped string safe for use between single quotes
 */
function escapeODataString(value) {
  return value.replace(/'/g, "''");
}

/**
 * Acquires an OAuth2 access token from Microsoft Entra ID using client credentials.
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
 * Searches the SharePoint list for an item matching the given email.
 * @param {string} accessToken
 * @param {string} siteId
 * @param {string} listId
 * @param {string} email
 * @param {(msg: string) => void} [log]
 * @returns {Promise<string|null>} item ID or null if not found
 */
async function findEmailInSharePoint(accessToken, siteId, listId, email, log) {
  const emailField = process.env.SHAREPOINT_EMAIL_FIELD || 'Title';
  // Escape single quotes in the email before embedding it in the OData filter
  // literal. OData represents a literal ' as '' (doubled), so a malicious
  // value like "x@y.com' or '1'='1" is neutralised to "x@y.com'' or ''1''=''1"
  // and cannot break out of the surrounding string literal.
  const safeEmail = escapeODataString(email);
  const encodedFilter = encodeURIComponent(
    `fields/${emailField} eq '${safeEmail}'`
  );
  // $expand=fields is required for the fields/ filter prefix to resolve.
  // Prefer header allows filtering on non-indexed columns.
  const url = `${GRAPH_BASE_URL}/sites/${siteId}/lists/${listId}/items?$filter=${encodedFilter}&$expand=fields`;

  const result = await requestJson(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'HonorNonIndexedQueriesWarningMayFailRandomly',
    },
    label: 'Graph list item lookup',
    log,
  });

  if (result.statusCode !== 200) {
    const detail = result.body?.error?.message || JSON.stringify(result.body);
    throw new Error(
      `Failed to query SharePoint: HTTP ${result.statusCode} — ${detail}`
    );
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
 * @param {(msg: string) => void} [log]
 * @returns {Promise<void>}
 */
async function deleteEmailFromSharePoint(
  accessToken,
  siteId,
  listId,
  itemId,
  log
) {
  // A successful DELETE returns 204 with no body, so use request() rather than
  // requestJson() — there is nothing to parse.
  const result = await request(
    `${GRAPH_BASE_URL}/sites/${siteId}/lists/${listId}/items/${itemId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      label: 'Graph list item delete',
      log,
    }
  );

  // 404 counts as success: the item is gone, which is all this function
  // promises. That also makes the DELETE safe to retry — a retry after a
  // timeout that actually landed sees 404 on the second attempt, and treating
  // it as a failure would report 500 for a completed unsubscribe.
  if (result.statusCode !== 204 && result.statusCode !== 404) {
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

  const clientIp = getClientIp(req);
  const rateLimitResult = takeNewsletterRateLimitToken(clientIp);

  if (!rateLimitResult.allowed) {
    context.log.warn(
      `Newsletter unsubscribe rate limit exceeded for IP ${clientIp}. Violation #${rateLimitResult.violations}. Retry after ${rateLimitResult.retryAfterSeconds} seconds.`
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
    const itemId = await findEmailInSharePoint(
      accessToken,
      siteId,
      listId,
      trimmedEmail,
      log
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

    await deleteEmailFromSharePoint(accessToken, siteId, listId, itemId, log);
    context.log(`Newsletter unsubscription completed for: ${trimmedEmail}`);

    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Unsubscribed successfully' }),
    };
  } catch (err) {
    if (isTimeoutError(err)) {
      context.log.error(
        `Newsletter unsubscribe timed out calling ${err.label} after ${err.timeoutMs} ms`
      );
      return {
        status: 504,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'The request timed out. Please try again.',
        }),
      };
    }

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

// Named export for unit testing — does not affect the Azure Function binding.
module.exports.escapeODataString = escapeODataString;
