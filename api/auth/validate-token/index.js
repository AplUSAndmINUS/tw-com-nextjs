/**
 * Azure Function: api/auth/validate-token
 *
 * Validates access tokens for DEV and TEST environments.
 * Compares the provided token against the ACCESS_TOKEN environment variable
 * stored in Azure Static Web Apps configuration.
 *
 * Environment variables required (DEV/TEST only):
 *   ACCESS_TOKEN   — The valid access token for the current environment
 *   ENVIRONMENT    — The current environment (dev, test, or prod)
 *
 * Deploy to Azure Static Web Apps alongside the Next.js static export.
 * The function will be accessible at /api/auth/validate-token.
 */

'use strict';

const crypto = require('crypto');

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {import('@azure/functions').HttpRequest} req
 */
module.exports = async function (context, req) {
  context.log('Token validation request received');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return {
      status: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return {
      status: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
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
        body: JSON.stringify({ valid: false, error: 'Invalid JSON body' }),
      };
    }

    const { token } = body ?? {};

    // Get environment configuration
    const environment = (process.env.ENVIRONMENT || 'prod').toLowerCase();
    const validToken = process.env.ACCESS_TOKEN;

    context.log('Environment:', environment);

    // Production environment does not require a token
    if (environment === 'prod') {
      return {
        status: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          valid: true,
          environment,
          message: 'Production environment - no token required',
        }),
      };
    }

    // Validate token presence in request
    if (!token) {
      return {
        status: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          valid: false,
          error: 'Token is required',
          environment,
        }),
      };
    }

    // Check that a valid token is configured server-side
    if (!validToken) {
      context.log('ACCESS_TOKEN environment variable not configured');
      return {
        status: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          valid: false,
          error: 'Server configuration error',
          environment,
        }),
      };
    }

    // Compare tokens using constant-time equality to prevent timing attacks
    let isValid = false;
    try {
      const tokenBuf = Buffer.from(token);
      const validBuf = Buffer.from(validToken);
      isValid =
        tokenBuf.length === validBuf.length &&
        crypto.timingSafeEqual(tokenBuf, validBuf);
    } catch {
      isValid = false;
    }

    if (isValid) {
      return {
        status: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          valid: true,
          environment,
          message: 'Token validated successfully',
        }),
      };
    }

    return {
      status: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        valid: false,
        error: 'Invalid token',
        environment,
      }),
    };
  } catch (error) {
    context.log('Error validating token:', error);
    return {
      status: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        valid: false,
        error: 'Internal server error',
      }),
    };
  }
};
