/**
 * Azure Function: api/contact
 *
 * Receives a contact form submission and sends an email via the SMTP2Go REST API.
 *
 * Environment variables required:
 *   SMTP2GO_API_KEY        — Your SMTP2Go API key
 *   CONTACT_FROM_EMAIL     — Sender address (must be verified in SMTP2Go)
 *   CONTACT_TO_EMAIL       — Recipient address for contact form submissions
 *
 * Deploy to Azure Static Web Apps alongside the Next.js static export.
 * The function will be accessible at /api/contact.
 */

'use strict';

const https = require('https');

const SMTP2GO_API_URL = 'https://api.smtp2go.com/v3/email/send';

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
          reject(new Error('Failed to parse SMTP2Go response'));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
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
 * @param {import('@azure/functions').HttpRequest} req
 * @param {import('@azure/functions').InvocationContext} context
 */
module.exports = async function (req, context) {
  context.log('contact function triggered');

  // Only accept POST
  if (req.method !== 'POST') {
    return {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const name = sanitize(body?.name ?? '');
  const email = sanitize(body?.email ?? '');
  const message = sanitize(body?.message ?? '');

  // Validate required fields
  if (!name || !email || !message) {
    return {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: `Name must not exceed ${MAX_NAME_LENGTH} characters`,
      }),
    };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: `Email must not exceed ${MAX_EMAIL_LENGTH} characters`,
      }),
    };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Email service is not configured' }),
    };
  }

  // Build email payload for SMTP2Go
  const emailPayload = {
    api_key: apiKey,
    to: [toEmail],
    sender: fromEmail,
    subject: `Contact form submission from ${name}`,
    text_body: [
      `Name: ${name}`,
      `Email: ${email}`,
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
    const result = await httpPost(SMTP2GO_API_URL, emailPayload);

    if (result.statusCode !== 200 || result.body?.data?.error) {
      context.log('SMTP2Go error:', result.body);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Failed to send email. Please try again later.',
        }),
      };
    }

    context.log('Contact email sent successfully via SMTP2Go');
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Your message has been sent successfully.',
      }),
    };
  } catch (error) {
    context.log('Error calling SMTP2Go:', error);
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to send email. Please try again later.',
      }),
    };
  }
};
