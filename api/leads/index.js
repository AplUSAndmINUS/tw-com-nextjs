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
 * - LEADS_LIST_ID or SHAREPOINT_LIST_ID            — SharePoint list ID for consultation leads
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

/* Constants */

const CORS_BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  Vary: 'Origin',
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
    'Access-Control-Allow-Origin': canReflectOrigin ? normalizedOrigin : 'null',
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
  const existing = leadRateLimitStore.get(key);

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

// Normalize request bodies across Azure Functions runtimes that may or may not pre-parse JSON.
const parseJsonBody = async (req) => {
  const rawBody =
    typeof req.body === 'string' ? req.body : ((await req.text?.()) ?? '');

  return rawBody ? JSON.parse(rawBody) : req.body;
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
    : `${accountName}.queue.core.windows.net`;

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
  const requestId = newRequestId();
  const log = (message) => context.log(`[${requestId}] ${message}`);
  log('Received request');

  const logWarn = (message) => context.log.warn(`[${requestId}] ${message}`);
  const logError = (message) => context.log.error(`[${requestId}] ${message}`);

  const origin = req.headers.origin || req.headers.Origin || '';
  const allowedOrigins = parseAllowedOrigins();
  const corsHeaders = getCorsHeaders(origin, allowedOrigins);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (!isAllowedOrigin(origin, allowedOrigins)) {
      logWarn(`CORS preflight request from disallowed origin: ${origin}`);
      context.res = {
        status: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Forbidden origin' }),
      };
      return;
    }

    context.res = { status: 204, headers: corsHeaders, body: '' }; // Default to No Content for non-POST requests
    return;
  }

  // no GET commands should be accepted by this endpoint, only POST for lead submission
  if (req.method !== 'POST') {
    logWarn(`Rejected non-POST request: ${req.method}`);
    context.res = {
      status: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
    return;
  }

  // ---------------------------------------------------------------------------
  // Request protection — best-effort origin allowlist and rate limiting
  // ---------------------------------------------------------------------------
  if (!isAllowedOrigin(origin, allowedOrigins)) {
    logWarn(`Rejected request from disallowed origin: ${origin}`);
    context.res = {
      status: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Forbidden origin' }),
    };
    return;
  }

  // begin lead submission processing
  const clientIp = getClientIp(req);
  const rateLimitResult = takeRateLimitToken(clientIp);

  if (!rateLimitResult.allowed) {
    logWarn(
      `Rate limit exceeded for IP ${clientIp}. Retry after ${rateLimitResult.retryAfterSeconds} seconds.`
    );
    context.res = {
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
    return;
  }

  // Validate the input
  let payload;
  try {
    payload = await parseJsonBody(req);
  } catch {
    logWarn('Invalid request: malformed JSON body');
    context.res = {
      status: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid request: missing or malformed JSON body',
        requestId,
      }),
    };
    return;
  }

  if (!payload || typeof payload !== 'object') {
    logWarn('Invalid request: missing or malformed JSON body');
    context.res = {
      status: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Invalid request: missing or malformed JSON body',
        requestId,
      }),
    };
    return;
  }

  // Review validation errors
  const validationErrors = [];
  if (
    !payload.fullName ||
    typeof payload.fullName !== 'string' ||
    payload.fullName.trim().length < 2
  ) {
    validationErrors.push('fullName is required (minimum 2 characters).');
  }

  if (!payload.email || typeof payload.email !== 'string') {
    validationErrors.push('email is required.');
  } else if (!isValidEmail(payload.email)) {
    validationErrors.push('email must be a valid email address.');
  }

  if (!Array.isArray(payload.services) || payload.services.length === 0) {
    validationErrors.push('services must be a non-empty array.');
  }

  if (!payload.submittedAt || typeof payload.submittedAt !== 'string') {
    validationErrors.push('submittedAt is required (ISO 8601 timestamp).');
  }

  if (!payload.preferredMeetingLength) {
    validationErrors.push('preferredMeetingLength is required.');
  } else if (
    !VALID_MEETING_LENGTHS.includes(String(payload.preferredMeetingLength))
  ) {
    validationErrors.push(
      `preferredMeetingLength must be one of: ${VALID_MEETING_LENGTHS.join(', ')}.`
    );
  }

  // Consent must always be true
  if (payload.consent !== true) {
    validationErrors.push('consent must be true.');
  }

  if (validationErrors.length > 0) {
    logWarn(`Validation failed: ${validationErrors.join(' ')}`);
    context.res = {
      status: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Validation failed',
        details: validationErrors,
        requestId,
      }),
    };
    return;
  }

  // If passed, build SharePoint field values
  const serviceLabels = Array.isArray(payload.services)
    ? payload.services.map((k) => SERVICE_LABELS[k] || k)
    : [];

  // Graph API v1.0 SharePoint list items — field value rules:
  //   Choice (multi-select): array of strings (Graph API v1.0 documented format)
  //   Choice (single-select): plain string
  //   Yes/No: boolean true only (omit false — SharePoint defaults to false)
  //   Date/Time: ISO 8601 without milliseconds, Z suffix
  //   Text: omit empty strings rather than sending ""
  const rawFields = {
    Title: `${payload.fullName.trim()} - ${serviceLabels[0] || 'Enquiry'}`,
    FullName: payload.fullName.trim(),
    Email: payload.email.trim(),
    Phone: payload.phone || '',
    Company: payload.company || '',
    // Multi-select Choice column — Graph API v1.0 requires the @odata.type annotation
    // alongside the array, otherwise it returns invalidRequest 400.
    'ServicesSelected@odata.type': 'Collection(Edm.String)',
    ServicesSelected: serviceLabels,
    AnswersJSON: JSON.stringify(payload.answers || {}),
    PreferredMeetingLength: String(payload.preferredMeetingLength || ''),
    TidyCalBookingID: payload.tidycalBookingId || '',
    ZoomLink: payload.zoomLink || '',
    ReferralSource: payload.referralSource || '',
    ConsentGiven: true,
    // Date and Time — ISO 8601, no milliseconds
    SubmittedAt: (payload.submittedAt || new Date().toISOString()).replace(
      /\.\d{3}Z$/,
      'Z'
    ),
    Status: 'New',
    // NotificationSent omitted — SharePoint Yes/No defaults to false; sending false explicitly
    // can trigger invalidRequest on some tenants
  };

  // Strip empty strings — Graph API returns 400 for empty string on some column types.
  // Arrays (ServicesSelected) are kept as-is.
  const fields = Object.fromEntries(
    Object.entries(rawFields).filter(
      ([, v]) => v !== '' && v !== null && v !== undefined
    )
  );

  // Optionally store raw payload for audit
  const storeRawPayload = process.env.LEAD_STORE_RAW_PAYLOAD === 'true';
  let rawPayloadLength = null;
  if (storeRawPayload) {
    // Redact sensitive-adjacent keys before storing
    const raw = { ...payload };
    delete raw.consent; // stored in ConsentGiven column
    const rawJson = JSON.stringify(raw);
    rawPayloadLength = rawJson.length;
    // Only store if within a safe size limit; omit entirely rather than store malformed data
    if (rawJson.length <= 100000) {
      fields.RawPayload = rawJson;
    } else {
      logWarn(
        'Lead: raw payload exceeds 100 KB limit — RawPayload field omitted'
      );
    }
  }

  if (rawPayloadLength !== null) {
    log(`Storing raw payload with length ${rawPayloadLength} characters`);
  }

  // Get SharePoint and Azure credentials
  const clientId = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_ID;
  const clientSecret = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET;
  const tenantId = process.env.ENTRAID_TENANT_ID;
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.LEADS_LIST_ID;
  const queueConnStr = process.env.AZURE_QUEUE_CONNECTION_STRING;
  const queueName = process.env.LEAD_QUEUE_NAME;

  // If SharePoint config is missing, optionally queue the payload and accept the request.
  if (!clientId || !clientSecret || !tenantId || !siteId || !listId) {
    logWarn(
      'Lead: SharePoint env vars not configured — accepted without persisting'
    );

    if (queueConnStr) {
      const queued = await enqueuePayload(
        { ...fields, _requestId: requestId },
        queueName,
        queueConnStr,
        log
      );

      if (queued) {
        context.res = {
          status: 202,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            requestId,
            note: 'accepted — queued because persistence is unavailable',
          }),
        };
        return;
      }
    }

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        requestId,
        note: 'accepted but not persisted',
      }),
    };
    return;
  }

  try {
    log(`Lead: submitting fields — ${Object.keys(fields).join(', ')}`);
    const token = await getGraphToken(tenantId, clientId, clientSecret);
    const created = await createSharePointItemWithRetry(
      token,
      siteId,
      listId,
      fields,
      log
    );

    log(`Lead: SharePoint item created — webUrl: ${created.webUrl || 'n/a'}`);

    context.res = {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        requestId,
        itemUrl: created.webUrl || null,
      }),
    };
    return;
  } catch (error) {
    logError(`Lead: submission failed — ${error.message}`);

    // On transient errors, attempt to queue the payload for later retry.
    if (error.isTransient && queueConnStr) {
      const queued = await enqueuePayload(
        { ...fields, _requestId: requestId },
        queueName,
        queueConnStr,
        log
      );

      if (queued) {
        context.res = {
          status: 202,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            requestId,
            note: 'accepted — will be retried',
          }),
        };
        return;
      }
    }

    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'An unexpected error occurred. Please try again.',
        requestId,
      }),
    };
    return;
  }
};
