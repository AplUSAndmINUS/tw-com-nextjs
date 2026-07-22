#!/usr/bin/env node
/**
 * Font Verification Script
 *
 * Runs before build and dev (see `prebuild` / `predev` in package.json).
 *
 * This used to fetch the Adobe Typekit stylesheet and parse its @font-face
 * rules, confirming the hosted project still served every family and weight the
 * site expected. Fonts are now self-hosted and vendored into the repo, so the
 * failure it guarded against — a Typekit project changing out from under us —
 * no longer exists.
 *
 * What can still go wrong is a font file being missing or truncated after a bad
 * merge or an incomplete checkout, which would silently fall back to
 * Georgia/Arial in production. So the gate is kept, pointed at the filesystem.
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

interface FontFile {
  /** Filename within the font directory. */
  file: string;
  displayName: string;
  /** Smallest plausible size in KB — a truncated download trips this. */
  minSizeKb: number;
}

const FONT_DIR = join('src', 'assets', 'fonts');

const REQUIRED_FONTS: FontFile[] = [
  {
    file: 'Montserrat-Variable.woff2',
    displayName: 'Montserrat',
    minSizeKb: 100,
  },
  {
    file: 'Montserrat-Italic-Variable.woff2',
    displayName: 'Montserrat Italic',
    minSizeKb: 100,
  },
  {
    file: 'Merriweather-Variable.woff2',
    displayName: 'Merriweather',
    minSizeKb: 300,
  },
  {
    file: 'Merriweather-Italic-Variable.woff2',
    displayName: 'Merriweather Italic',
    minSizeKb: 150,
  },
  {
    file: 'RobotoMono-Variable.woff2',
    displayName: 'Roboto Mono',
    minSizeKb: 30,
  },
  {
    file: 'RobotoMono-Italic-Variable.woff2',
    displayName: 'Roboto Mono Italic',
    minSizeKb: 30,
  },
];

/** WOFF2 files begin with the ASCII signature "wOF2". */
function hasWoff2Signature(absolutePath: string): boolean {
  return readFileSync(absolutePath).subarray(0, 4).toString('ascii') === 'wOF2';
}

function main(): void {
  console.log('Verifying self-hosted fonts...\n');

  const problems: string[] = [];
  let totalKb = 0;

  for (const font of REQUIRED_FONTS) {
    const relativePath = join(FONT_DIR, font.file);
    const absolutePath = join(process.cwd(), relativePath);

    if (!existsSync(absolutePath)) {
      problems.push(`${font.displayName}: missing at ${relativePath}`);
      continue;
    }

    const sizeKb = statSync(absolutePath).size / 1024;

    if (sizeKb < font.minSizeKb) {
      problems.push(
        `${font.displayName}: only ${sizeKb.toFixed(0)} KB, expected at least ` +
          `${font.minSizeKb} KB — likely truncated`
      );
      continue;
    }

    if (!hasWoff2Signature(absolutePath)) {
      problems.push(
        `${font.displayName}: not a valid WOFF2 file (bad signature)`
      );
      continue;
    }

    totalKb += sizeKb;
    console.log(`  ok  ${font.displayName} (${sizeKb.toFixed(0)} KB)`);
  }

  if (problems.length > 0) {
    console.error('\nFont verification failed:\n');
    for (const problem of problems) {
      console.error(`  x  ${problem}`);
    }
    console.error(
      '\nFonts are vendored in this repo rather than fetched at build time. ' +
        'If they are missing the checkout is incomplete — try ' +
        '`git checkout -- src/assets/fonts`.\n'
    );
    process.exit(1);
  }

  console.log(
    `\nAll ${REQUIRED_FONTS.length} fonts present (${(totalKb / 1024).toFixed(2)} MB total).\n`
  );
}

main();
