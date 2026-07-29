#!/usr/bin/env node
/**
 * Pre-build guard: fail a production build if public/ads.txt still contains
 * the placeholder publisher ID instead of a real Google AdSense pub-XXXXXXXXXXXXXXXX.
 *
 * Runs only when NEXT_PUBLIC_ENVIRONMENT is 'prod' (or unset, which defaults to
 * 'prod'). Dev and test builds skip the check so local work and staging deploys
 * are unaffected.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const env = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'prod';

if (env !== 'prod') {
  process.exit(0);
}

const adsPath = path.join(__dirname, '..', 'public', 'ads.txt');

let content;
try {
  content = fs.readFileSync(adsPath, 'utf8');
} catch {
  console.error(
    '\nERROR: public/ads.txt is missing.\n' +
      'Create the file before deploying to production.\n'
  );
  process.exit(1);
}

if (content.includes('pub-XXXXXXXXXXXXXXXX')) {
  console.error(
    '\nERROR: public/ads.txt still contains the placeholder publisher ID.\n' +
      'Replace pub-XXXXXXXXXXXXXXXX with your real Google AdSense publisher ID\n' +
      '(found in AdSense → My Account → Account information → Publisher ID)\n' +
      'before deploying to production.\n'
  );
  process.exit(1);
}
