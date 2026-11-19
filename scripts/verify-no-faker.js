#!/usr/bin/env node
/**
 * Post-build guard: fail a production build if Faker (or the Instagram mock
 * feed built on it) made it into the static export.
 *
 * Faker is a dev/test tool. It powers the /about-me Instagram grid's mock
 * mode, which next.config.ts compiles out of every build that isn't DEV or
 * TEST (see src/lib/instagramMockMode.ts). This is the backstop: if a future
 * change lets the mock leak into a PROD bundle, the build fails here instead
 * of shipping it.
 *
 * Runs when NEXT_PUBLIC_ENVIRONMENT is 'prod' or unset (which the site treats
 * as prod). DEV and TEST builds, where mock mode is allowed, skip the check.
 *
 * Usage: node scripts/verify-no-faker.js [dir]   (dir defaults to out/; the
 * argument exists for scripts/verify-no-faker.test.ts)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const env = (process.env.NEXT_PUBLIC_ENVIRONMENT ?? '').toLowerCase();

if (['dev', 'development', 'test'].includes(env)) {
  process.exit(0);
}

const outDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'out');

/**
 * Strings that survive minification. The first two come from Faker itself
 * (its docs URL and package name in error text); the third is the mock feed's
 * fake video host in src/lib/instagram.mock.ts.
 */
const MARKERS = ['fakerjs.dev', '@faker-js/faker', 'cdninstagram.invalid'];

const SCANNED = new Set(['.js', '.html', '.txt', '.json']);

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (SCANNED.has(path.extname(entry.name))) yield full;
  }
}

if (!fs.existsSync(outDir)) {
  console.error(
    '\nERROR: verify-no-faker: out/ not found. Run it after `next build`.\n'
  );
  process.exit(1);
}

const hits = [];
let scanned = 0;
for (const file of walk(outDir)) {
  scanned += 1;
  const content = fs.readFileSync(file, 'utf8');
  const found = MARKERS.filter((marker) => content.includes(marker));
  if (found.length)
    hits.push(`${path.relative(outDir, file)} (${found.join(', ')})`);
}

if (hits.length) {
  console.error(
    '\nERROR: Faker / the Instagram mock feed is in the production build.\n' +
      'It is a DEV/TEST tool and must not ship to PROD. Found in:\n' +
      hits.map((hit) => `  - out/${hit}`).join('\n') +
      '\nCheck that the mock import in src/lib/instagram.ts is still guarded\n' +
      'by the process.env.TW_INSTAGRAM_MOCK_BUILD literal (next.config.ts).\n'
  );
  process.exit(1);
}

console.log(
  `verify-no-faker: ${scanned} files in ${path.relative(process.cwd(), outDir) || '.'}/, no Faker. OK`
);
