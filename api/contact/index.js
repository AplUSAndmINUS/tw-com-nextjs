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

const https = require('https');

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
 * @param {string} url
 * @param {object} payload
 * @returns {Promise<{ statusCode: number; body: object }>}
 */
function httpPost(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(responseBody),
          });
        } catch {
          reject(new Error('Failed to parse response'));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Performs an HTTPS POST with URL-encoded form data.
 * @param {string} url
 * @param {object} params - Key-value pairs to encode
 * @returns {Promise<{ statusCode: number; body: object }>}
 */
function httpPostForm(url, params) {
  return new Promise((resolve, reject) => {
    const formData = new URLSearchParams(params).toString();
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(formData),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: JSON.parse(responseBody),
          });
        } catch {
          reject(new Error('Failed to parse reCAPTCHA response'));
        }
      });
    });

    req.on('error', reject);
    req.write(formData);
    req.end();
  });
}

/**
 * Verifies a reCAPTCHA v3 token with Google's API.
 * @param {string} token - The reCAPTCHA token from the client
 * @param {string} secretKey - The reCAPTCHA secret key
 * @returns {Promise<{ success: boolean; score?: number; error?: string }>}
 */
async function verifyRecaptcha(token, secretKey) {
  if (!token) {
    return { success: false, error: 'reCAPTCHA token is required' };
  }

  if (!secretKey) {
    return { success: false, error: 'reCAPTCHA secret key not configured' };
  }

  try {
    const result = await httpPostForm(RECAPTCHA_VERIFY_URL, {
      secret: secretKey,
      response: token,
    });

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
    const recaptchaResult = await verifyRecaptcha(
      recaptchaToken,
      recaptchaSecretKey
    );

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
  const submittedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  // Build email payload for SMTP2Go
  const emailPayload = {
    api_key: apiKey,
    to: [toEmail],
    sender: fromEmail,
    subject: `Contact form submission from ${sanitizedName}`,
    text_body: [
      `Name: ${sanitizedName}`,
      `Email: ${sanitizedEmail}`,
      `Submitted: ${submittedAt}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html_body: `
      <div style="margin:0;padding:24px;background-color:#0f1419;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:700px;margin:0 auto;background:#f8fafc;border:1px solid #dbe6f3;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:0;">
              <div style="background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%);padding:20px 24px;border-bottom:1px solid #1e3a8a;">
                <p style="margin:0;color:#bfdbfe;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">TW.com Contact Intake</p>
                <h2 style="margin:8px 0 0;color:#ffffff;font-size:24px;line-height:1.2;">New Contact Form Submission</h2>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 24px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;border-spacing:0 10px;">
                <tr>
                  <td style="width:120px;color:#475569;font-size:13px;font-weight:700;vertical-align:top;">From</td>
                  <td style="color:#0f172a;font-size:14px;">${htmlEncode(name)}</td>
                </tr>
                <tr>
                  <td style="width:120px;color:#475569;font-size:13px;font-weight:700;vertical-align:top;">Email</td>
                  <td style="color:#0f172a;font-size:14px;">
                    <a href="mailto:${encodeURIComponent(sanitizedEmail)}" style="color:#1d4ed8;text-decoration:none;">${htmlEncode(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="width:120px;color:#475569;font-size:13px;font-weight:700;vertical-align:top;">Submitted</td>
                  <td style="color:#0f172a;font-size:14px;">${htmlEncode(submittedAt)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;">
              <div style="background:#ffffff;border:1px solid #dbe6f3;border-left:4px solid #2563eb;border-radius:12px;padding:16px;">
                <h3 style="margin:0 0 10px;color:#0f172a;font-size:16px;">Message</h3>
                <p style="margin:0;color:#1e293b;font-size:14px;line-height:1.6;white-space:pre-wrap;">${htmlEncode(message)}</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;">
              <a href="mailto:${encodeURIComponent(sanitizedEmail)}?subject=${encodeURIComponent('Re: Your message to TW.com')}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 14px;border-radius:10px;">Reply to Sender</a>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px;background:#f1f5f9;border-top:1px solid #dbe6f3;color:#64748b;font-size:12px;">
              Automated message from the TW.com contact endpoint.
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    const result = await httpPost(SMTP2GO_API_URL, emailPayload);

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
