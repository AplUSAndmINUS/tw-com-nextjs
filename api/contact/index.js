/**
 * Azure Function: api/contact
 *
 * Receives a contact form submission and sends an email via the SMTP2Go REST API.
 *
 * Environment variables required:
 *   SMTP2GO_API_KEY        — Your SMTP2Go API key
 *   CONTACT_FROM_EMAIL     — Sender address (must be verified in SMTP2Go)
 *   CONTACT_TO_EMAIL       — Recipient address for contact form submissions
 *   RECAPTCHA_SECRET_KEY   — Google reCAPTCHA v3 secret key for spam protection
 *
 * Deploy to Azure Static Web Apps alongside the Next.js static export.
 * The function will be accessible at /api/contact.
 */

'use strict';

const { request, isTimeoutError } = require('../httpClient');

const SMTP2GO_API_URL = 'https://api.smtp2go.com/v3/email/send';
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const RECAPTCHA_MIN_SCORE = 0.5; // Minimum score to accept (0.0 - 1.0)

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Performs an HTTPS POST with a JSON body and returns the parsed response.
 *
 * Parses strictly: an unparseable body rejects rather than resolving with an
 * empty object, so a 200 carrying garbage is reported as a failure instead of
 * being mistaken for a sent email.
 *
 * @param {string} url
 * @param {object} payload
 * @param {(msg: string) => void} [log]
 * @returns {Promise<{ statusCode: number; body: object }>}
 */
async function httpPost(url, payload, log) {
  // maxRetries: 0 — this POST hands a message to SMTP2Go for delivery. If it
  // accepts the mail and then stalls, a retry sends the recipient a second
  // copy. There is no idempotency key to lean on, so prefer a visible failure
  // over a duplicate email.
  const { statusCode, text } = await request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    maxRetries: 0,
    label: 'SMTP2Go send',
    log,
  });

  try {
    return { statusCode, body: JSON.parse(text) };
  } catch {
    throw new Error('Failed to parse response');
  }
}

/**
 * Performs an HTTPS POST with URL-encoded form data.
 * @param {string} url
 * @param {object} params - Key-value pairs to encode
 * @param {(msg: string) => void} [log]
 * @returns {Promise<{ statusCode: number; body: object }>}
 */
async function httpPostForm(url, params, log) {
  const { statusCode, text } = await request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
    label: 'reCAPTCHA verify',
    log,
  });

  try {
    return { statusCode, body: JSON.parse(text) };
  } catch {
    throw new Error('Failed to parse reCAPTCHA response');
  }
}

/**
 * Verifies a reCAPTCHA v3 token with Google's API.
 * @param {string} token - The reCAPTCHA token from the client
 * @param {string} secretKey - The reCAPTCHA secret key
 * @param {(msg: string) => void} [log]
 * @returns {Promise<{ success: boolean; score?: number; error?: string }>}
 */
async function verifyRecaptcha(token, secretKey, log) {
  if (!token) {
    return { success: false, error: 'reCAPTCHA token is required' };
  }

  if (!secretKey) {
    return { success: false, error: 'reCAPTCHA secret key not configured' };
  }

  try {
    const result = await httpPostForm(
      RECAPTCHA_VERIFY_URL,
      {
        secret: secretKey,
        response: token,
      },
      log
    );

    const { success, score, 'error-codes': errorCodes } = result.body;

    if (!success) {
      return {
        success: false,
        error: `reCAPTCHA verification failed: ${errorCodes?.join(', ') || 'unknown error'}`,
      };
    }

    if (typeof score === 'number' && score < RECAPTCHA_MIN_SCORE) {
      return {
        success: false,
        score,
        error: `reCAPTCHA score too low: ${score} (minimum: ${RECAPTCHA_MIN_SCORE})`,
      };
    }

    return { success: true, score };
  } catch (error) {
    // A timeout means Google never answered — that is an upstream outage, not
    // a failed captcha. Rethrow so the handler reports 504 instead of telling
    // the user their verification failed and to try again.
    if (isTimeoutError(error)) {
      throw error;
    }

    return {
      success: false,
      error: `reCAPTCHA verification error: ${error.message}`,
    };
  }
}

/**
 * Sanitizes a string value for safe use in plain-text contexts.
 * Trims whitespace and ensures string type.
 * For HTML output, use htmlEncode() instead.
 * @param {string} value
 * @returns {string}
 */
function sanitize(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

/**
 * Encodes a string for safe HTML interpolation.
 * @param {string} value
 * @returns {string}
 */
function htmlEncode(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {import('@azure/functions').HttpRequest} req
 */
module.exports = async function (context, req) {
  context.log('contact function triggered');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return {
      status: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Parse request body
  let body;
  try {
    const rawBody =
      typeof req.body === 'string' ? req.body : ((await req.text?.()) ?? '');
    body = rawBody ? JSON.parse(rawBody) : req.body;
  } catch {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const name = sanitize(body?.name ?? '');
  const email = sanitize(body?.email ?? '');
  const message = sanitize(body?.message ?? '');
  const recaptchaToken = body?.recaptchaToken;

  // Verify reCAPTCHA token (if configured)
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecretKey) {
    context.log('Verifying reCAPTCHA token');

    let recaptchaResult;
    try {
      recaptchaResult = await verifyRecaptcha(
        recaptchaToken,
        recaptchaSecretKey,
        (msg) => context.log(msg)
      );
    } catch (error) {
      // Only a timeout escapes verifyRecaptcha; everything else is folded into
      // a { success: false } result.
      context.log(
        `Contact form timed out calling ${error.label} after ${error.timeoutMs} ms`
      );
      return {
        status: 504,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'The request timed out. Please try again later.',
        }),
      };
    }

    if (!recaptchaResult.success) {
      context.log('reCAPTCHA verification failed:', recaptchaResult.error);
      return {
        status: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Failed to verify reCAPTCHA. Please try again.',
        }),
      };
    }

    context.log(
      `reCAPTCHA verified successfully (score: ${recaptchaResult.score})`
    );
  } else {
    context.log(
      'Warning: RECAPTCHA_SECRET_KEY not configured. Skipping reCAPTCHA verification.'
    );
  }

  // Validate required fields
  if (!name || !email || !message) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'name, email, and message are required' }),
    };
  }

  // Validate field lengths
  const MAX_NAME_LENGTH = 200;
  const MAX_EMAIL_LENGTH = 254;
  const MAX_MESSAGE_LENGTH = 5000;

  if (name.length > MAX_NAME_LENGTH) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: `Name must not exceed ${MAX_NAME_LENGTH} characters`,
      }),
    };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: `Email must not exceed ${MAX_EMAIL_LENGTH} characters`,
      }),
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`,
      }),
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      status: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid email address' }),
    };
  }

  // Check required environment variables
  const apiKey = process.env.SMTP2GO_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    context.log('Missing required environment variables for contact function');
    return {
      status: 503,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Email service is not configured' }),
    };
  }

  // Strip newlines from single-line fields to prevent email body injection
  const sanitizedName = name.replace(/[\r\n]/g, '');
  const sanitizedEmail = email.replace(/[\r\n]/g, '');

  // Build email payload for SMTP2Go
  const emailPayload = {
    api_key: apiKey,
    to: [toEmail],
    sender: fromEmail,
    subject: `Contact form submission from ${sanitizedName}`,
    text_body: [
      `Name: ${sanitizedName}`,
      `Email: ${sanitizedEmail}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html_body: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${htmlEncode(name)}</p>
      <p><strong>Email:</strong> ${htmlEncode(email)}</p>
      <h3>Message:</h3>
      <p style="white-space: pre-wrap;">${htmlEncode(message)}</p>
    `,
  };

  try {
    const result = await httpPost(SMTP2GO_API_URL, emailPayload, (msg) =>
      context.log(msg)
    );

    if (result.statusCode !== 200 || result.body?.data?.error) {
      context.log('SMTP2Go error:', result.body);
      return {
        status: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Failed to send email. Please try again later.',
        }),
      };
    }

    context.log('Contact email sent successfully via SMTP2Go');
    return {
      status: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: 'Your message has been sent successfully.',
      }),
    };
  } catch (error) {
    if (isTimeoutError(error)) {
      context.log(
        `Contact form timed out calling ${error.label} after ${error.timeoutMs} ms`
      );
      return {
        status: 504,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'The request timed out. Please try again later.',
        }),
      };
    }

    context.log('Error calling SMTP2Go:', error);
    return {
      status: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Failed to send email. Please try again later.',
      }),
    };
  }
};
