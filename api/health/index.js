'use strict';

const { requestJson, isTimeoutError } = require('../httpClient');

const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0';
const HEALTH_TIMEOUT_MS = 1500;

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
      timeoutMs: HEALTH_TIMEOUT_MS,
      maxRetries: 0,
      label: 'Entra ID token endpoint',
      log,
    }
  );

  if (result.statusCode !== 200 || !result.body.access_token) {
    throw new Error('Failed to acquire token');
  }

  return result.body.access_token;
}

async function checkSharePointReachable(accessToken, siteId, listId, log) {
  const result = await requestJson(
    `${GRAPH_BASE_URL}/sites/${siteId}/lists/${listId}?$select=id`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + accessToken },
      timeoutMs: HEALTH_TIMEOUT_MS,
      maxRetries: 0,
      label: 'Graph SharePoint health check',
      log,
    }
  );

  if (result.statusCode !== 200) {
    throw new Error('SharePoint list check failed');
  }
}

module.exports = async function (context, req) {
  const tenantId = process.env.ENTRAID_TENANT_ID;
  const clientId = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_ID;
  const clientSecret = process.env.ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET;
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SHAREPOINT_LIST_ID;

  if (!tenantId || !clientId || !clientSecret || !siteId || !listId) {
    return {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'error',
        error: 'SharePoint integration is not configured',
      }),
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
    await checkSharePointReachable(accessToken, siteId, listId, log);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok' }),
    };
  } catch (err) {
    if (isTimeoutError(err)) {
      context.log.error(
        `Health check timed out calling ${err.label} after ${err.timeoutMs} ms`
      );
    } else {
      context.log.error(`Health check failed: ${err.message}`);
    }

    return {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', error: 'SharePoint unreachable' }),
    };
  }
};
