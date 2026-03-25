/**
 * Azure Function: Leads Submission API
 *
 * Receives a consultation leads payload from the front-end stepper application and
 * writes a new item to a SharePoint List using Microsoft Graph API.
 * The function is triggered by an HTTP POST request and expects a
 * JSON payload containing the leads information.
 *
 * Required Environment Variables:
 * - ENTRAID_SP_APP_REGISTRATION_CLIENT_ID          — Entra ID app registration client ID
 * - ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET      — Entra ID app registration client secret
 * - ENTRAID_TENANT_ID                              — Azure AD tenant ID (GUID format)
 * - SHAREPOINT_SITE_ID                             — SharePoint site ID (GUID format)
 * - LEADS_LIST_ID                                  — SharePoint list ID for consultation leads
 *
 * Optional Environment Variables:
 * - LEAD_ALLOWED_ORIGINS                   — Comma-separated allowed browser origins
 * - LEAD_RATE_LIMIT_WINDOW_MS              — Rate-limit window in ms (default: 900000)
 * - LEAD_RATE_LIMIT_MAX_REQUESTS           — Max requests per IP per window (default: 10)
 * - AZURE_QUEUE_CONNECTION_STRING          — Azure Storage connection string for fallback queue
 * - LEAD_QUEUE_NAME                        — Queue name for failed/transient submissions (default: lead-queue)
 *
 * POST /api/leads
 * Body: LeadPayload (see ConsultationStepper/types.ts for structure)
 *
 * Security: Apply origin allowlisting and function-side rate-limiting to mitigate abuse.
 * Implement retry logic for transient failures when writing to SharePoint via Azure Queue Storage
 * as a fallback mechanism.
 */

'use strict';

/* Import consts */
const https = require('https');
const crypto = require('crypto');
const { fieldset } = require('framer-motion/client');
// require('isomorphic-fetch');
// const { Client } = require('@microsoft/microsoft-graph-client');
// const { DefaultAzureCredential } = require('@azure/identity');
// const { QueueServiceClient } = require('@azure/storage-queue');

/* Load configuration from environment variables for Azure and SharePoint */
const clientId = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_ID;
const clientSecret = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET;
const tenantId = process.env.ENTRAID_TENANT_ID;
const sharepointSiteId = process.env.SHAREPOINT_SITE_ID;
const leadsListId = process.env.LEADS_LIST_ID;

/* Optional security and rate-limiting config */
const allowedOrigins = process.env.LEAD_ALLOWED_ORIGINS
  ? process.env.LEAD_ALLOWED_ORIGINS.split(',')
  : [];
const rateLimitWindowMs =
  parseInt(process.env.LEAD_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutes
const rateLimitMaxRequests =
  parseInt(process.env.LEAD_RATE_LIMIT_MAX_REQUESTS) || 10;
const azureQueueConnectionString = process.env.AZURE_QUEUE_CONNECTION_STRING;
const leadQueueName = process.env.LEAD_QUEUE_NAME;

/* Constants */

const CORS_BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/** Maps frontend service keys to display labels in the SharePoint Leads List */
const SERVICE_LABELS = {
  personal_training: 'Personal Training',
  it_consulting: 'IT / Business Consulting',
  graphic_design: 'Graphic Design',
  web_development: 'Web Development',
  resonance_coaching: 'Resonance Core Framework Coaching',
  help_me_choose: "I don't know",
};

const VALID_MEETING_LENGTHS = ['20', '30', '45'];
const DEFAULT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 10;
const leadRateLimitStore = new Map(); // In-memory store for rate-limiting (IP address -> [timestamps])

/** Helper Functions **/

// Generates a unique request ID for logging and tracing purposes
const newRequestId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Validates an email address format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Normalize an Origin header value for exact allowlist matching
const normalizeOrigin = (origin) => {
  return String(origin || '')
    .trim()
    .replace(/\/+$/, '') // Remove trailing slashes for consistency
    .toLowerCase();
};

// Parses a comma-separated allowlist of browser origins
const parseAllowedOrigins = () => {
  return String(process.env.LEAD_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter((origin) => origin.length > 0);
};

// Builds CORS headers for the current request origin
const getCorsHeaders = (origin, allowedOrigins) => {
  const normalizedOrigin = normalizeOrigin(origin);
  const canReflectOrigin =
    normalizedOrigin &&
    (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin));

  return {
    ...CORS_BASE_HEADERS,
    'Access-Control-Allow-Origin': canReflectOrigin ? normalizedOrigin : '*',
  };
};

// Returns true when the request origin is permitted
const isAllowedOrigin = (origin, allowedOrigins) => {
  if (allowedOrigins.length === 0) return true; // Allow all if no origins specified
  const normalizedOrigin = normalizeOrigin(origin);
  return (
    normalizedOrigin &&
    (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin))
  );
};

// Extracts the client IP from common Azure/App Service forwarding headers for rate-limiting purposes
const getClientIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const clientIp = req.headers['x-client-ip'] || req.headers['x-real-ip'];
  return clientIp ? clientIp.trim() : 'unknown';
};

// Consumes one rate-limit slot for the given IP using an in-memory store.
const takeRateLimitToken = (ipAddress) => {
  const windowMs =
    Number(process.env.LEAD_RATE_LIMIT_WINDOW_MS) ||
    DEFAULT_RATE_LIMIT_WINDOW_MS;
  const maxRequests =
    Number(process.env.LEAD_RATE_LIMIT_MAX_REQUESTS) ||
    DEFAULT_RATE_LIMIT_MAX_REQUESTS;
  const now = Date.now();
  const effectiveWindowMs =
    Number.isFinite(windowMs) && windowMs > 0
      ? windowMs
      : DEFAULT_RATE_LIMIT_WINDOW_MS;
  const effectiveMaxRequests =
    Number.isFinite(maxRequests) && maxRequests > 0
      ? maxRequests
      : DEFAULT_RATE_LIMIT_MAX_REQUESTS;
  const key = ipAddress || 'unknown';
  const existing = leadRateLimitStore.get(key) || [];

  if (!existing || now >= existing.resetTime) {
    leadRateLimitStore.set(key, {
      count: 1,
      resetTime: now + effectiveWindowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(effectiveWindowMs / 1000),
    };
  }

  if (existing.count >= effectiveMaxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetTime - now) / 1000)
      ),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((existing.resetTime - now) / 1000)
    ),
  };
};

// Performs an HTTPS request, resolving with { statusCode, body } */
const httpsRequest = (options, requestData) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', (err) => reject(err));
    if (requestData) req.write(requestData);
    req.end();
  });
};

// Obtain a Graph API access token using client credentials flow
const getGraphToken = async (tenantId, clientId, clientSecret) => {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default',
  }).toString();

  const { statusCode, body: responseBody } = await httpsRequest(
    {
      hostname: `login.microsoftonline.com`,
      path: `/${tenantId}/oauth2/v2.0/token`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    },
    body
  );

  if (statusCode >= 200 && statusCode < 300) {
    try {
      const parsed = JSON.parse(responseBody);
      if (parsed.access_token) return parsed.access_token;
    } catch (err) {
      throw new Error(`Failed to parse Graph token response: ${err.message}`);
    }
  } else {
    throw new Error(
      `Failed to obtain Graph token: ${statusCode} - ${responseBody}`
    );
  }
};

// Posts a new item to a SharePoint list via Graph API and returns the created item ID
const createSharePointItem = async (token, siteId, listId, fields, log) => {
  const body = JSON.stringify({ fields });

  const { statusCode, body: responseBody } = await httpsRequest(
    {
      hostname: 'graph.microsoft.com',
      path: `/v1.0/sites/${siteId}/lists/${listId}/items`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(body),
      },
    },
    body
  );

  if (statusCode >= 200 && statusCode < 300) {
    try {
      return JSON.parse(responseBody);
    } catch (err) {
      log(`Failed to parse SharePoint item creation response: ${err.message}`);
      throw new Error(`Failed to parse SharePoint response: ${err.message}`);
    }
  }

  const isTransient = statusCode >= 429 && statusCode < 600;
  const err = new Error(`Graph API error: ${statusCode} - ${responseBody}`);
  err.isTransient = isTransient;
  throw err;
};

// Calls createSharePointItem with expoential-backoff retry (up to three attempts)
const createSharePointItemWithRetry = async (
  token,
  siteId,
  listId,
  fields,
  log
) => {
  const MAX_ATTEMPTS = 3;
  const BASE_DELAY_MS = 1000; // Initial delay of 1 second

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await createSharePointItem(token, siteId, listId, fields, log);
    } catch (err) {
      if (attempt === MAX_ATTEMPTS || !err.isTransient) {
        log(
          `Failed to create SharePoint item after ${attempt} attempts: ${err.message}`
        );
        throw err;
      }

      const delay =
        BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 1000; // Exponential backoff with jitter
      log(
        `Attempt ${attempt} failed with transient error: ${err.message}. Retrying in ${Math.round(delay)} ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Enqueues the payload to an Azure Storage Queue for later retry if SharePoint item creation fails after retries
const enqueuePayload = async (
  payload,
  leadQueueName,
  azureQueueConnectionString,
  log
) => {
  // Parse account name and key from the connection string
  const accountMatch = azureQueueConnectionString.match(/AccountName=([^;]+)/i);
  const keyMatch = azureQueueConnectionString.match(/AccountKey=([^;]+)/i);
  const endpointMatch = azureQueueConnectionString.match(/Endpoint=([^;]+)/i);

  if (!accountMatch || !keyMatch) {
    log(
      `Lead: cannot parse ${azureQueueConnectionString ? 'account name and key' : 'Azure Storage connection string from environment variable'}`
    );
    throw new Error(
      `Invalid Azure Storage connection string: missing ${azureQueueConnectionString ? 'account name and key' : 'connection string'}`
    );
  }

  // Construct the queue service endpoint
  const accountName = accountMatch[1];
  const accountKey = keyMatch[1];
  const endpoint = endpointMatch
    ? new URL(endpointMatch[1]).hostname
    : `https://${accountName}.queue.core.windows.net`;

  // Build the request to create the queue if it doesn't exist (idempotent)
  const messageXml = `<QueueMessage><MessageText>${Buffer.from(JSON.stringify(payload)).toString('base64')}</MessageText></QueueMessage>`;
  const contentLength = Buffer.byteLength(messageXml);
  const date = new Date().toUTCString();

  // The HTTP request path on the Queue service host is /{queueName}/messages.
  // The host already encodes the account (${accountName}.queue.core.windows.net),
  // so prepending the account name again would produce a 404.
  const requestPath = `/${leadQueueName}/messages`;

  // The canonicalized resource used in the Shared Key signature always includes
  // the account name as a prefix, regardless of the actual HTTP path.
  const canonicalizedResource = `/${accountName}/${leadQueueName}/messages`;

  // Build HMAC-SHA256 signature for authentication
  const stringToSign = [
    'POST',
    '', // Content-Encoding
    'application/xml', // Content-Type
    '', // Date (x-ms-date is used instead)
    `x-ms-date:${date}\nx-ms-version:2020-10-02`, // x-ms headers
    canonicalizedResource,
  ].join('\n');

  const signature = crypto
    .createHmac('sha256', Buffer.from(accountKey, 'base64'))
    .update(stringToSign, 'utf8')
    .digest('base64');

  const authHeader = `SharedKey ${accountName}:${signature}`;

  // Enqueue the message
  try {
    const { statusCode } = await httpsRequest(
      {
        hostname: endpoint,
        path: requestPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          'Content-Length': contentLength,
          'x-ms-date': date,
          'x-ms-version': '2020-10-02',
          Authorization: authHeader,
        },
      },
      messageXml
    );

    if (statusCode >= 200 && statusCode < 300) {
      log(
        `Successfully enqueued payload to Azure Queue Storage (queue: ${leadQueueName})`
      );
      return true;
    } else {
      log(`Failed to enqueue payload to Azure Queue Storage: ${statusCode}`);
      return false;
    }
  } catch (err) {
    log(`Failed to enqueue payload to Azure Queue Storage: ${err.message}`);
    throw new Error(`Failed to enqueue payload: ${err.message}`);
  }
};

// Main header Azure Function handler
module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const name = req.query.name || (req.body && req.body.name);
  const responseMessage = name
    ? 'Hello, ' + name + '. This HTTP triggered function executed successfully.'
    : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};
