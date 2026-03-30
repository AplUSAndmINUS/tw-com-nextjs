/**
 * Azure Function: api/ping
 *
 * Timer-triggered function that runs every 15 minutes to keep the PROD Azure
 * Functions host warm. On the Free Tier, cold starts can take 10–30 seconds;
 * this periodic ping prevents that latency for site visitors.
 *
 * This function intentionally does nothing on DEV and TEST environments — only
 * PROD needs the warm-up keep-alive.
 *
 * Environment variables required:
 *   ENVIRONMENT  — The current environment (dev, test, or prod)
 *
 * Schedule: every 15 minutes ("0 */ //15 * * * *") (without double slashes) */

'use strict';

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {import('@azure/functions').Timer} myTimer
 */
module.exports = async function (context, myTimer) {
  const environment = (process.env.ENVIRONMENT || 'dev').toLowerCase();

  // Non-prod environments should have AzureWebJobs.ping.Disabled=true set as
  // an app setting so this trigger never fires. The early return is a fallback
  // in case that app setting is not in place.
  if (environment !== 'prod') {
    return;
  }

  const timestamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log('Ping timer is running late');
  }

  context.log(`Ping OK — PROD keep-alive at ${timestamp}`);
};
