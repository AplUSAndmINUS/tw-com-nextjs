import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

/**
 * The post-build guard, run for real (as `yarn build` runs it) against a
 * throwaway folder standing in for out/: one build with no Faker, one with a
 * chunk carrying each marker the guard looks for.
 */

const SCRIPT = path.join(__dirname, 'verify-no-faker.js');
let dir: string;

function run(environment: string | undefined, target = dir) {
  const env = { ...process.env };
  delete env.NEXT_PUBLIC_ENVIRONMENT;
  if (environment !== undefined) env.NEXT_PUBLIC_ENVIRONMENT = environment;
  return spawnSync(process.execPath, [SCRIPT, target], {
    env,
    encoding: 'utf8',
  });
}

function writeChunk(name: string, content: string) {
  const chunks = path.join(dir, '_next', 'static', 'chunks');
  mkdirSync(chunks, { recursive: true });
  writeFileSync(path.join(chunks, name), content);
}

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'no-faker-'));
  writeFileSync(path.join(dir, 'index.html'), '<html>site</html>');
  writeChunk('app.js', 'console.log("the grid")');
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('verify-no-faker (post-build guard)', () => {
  it('passes a PROD build with no Faker', () => {
    const result = run('prod');
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/no Faker\. OK/);
  });

  it.each([
    ['Faker docs URL', 'see https://fakerjs.dev/api'],
    ['Faker package name', 'from "@faker-js/faker"'],
    ['the mock feed', 'https://video.cdninstagram.invalid/x.mp4'],
  ])('fails a PROD build containing %s', (_label, marker) => {
    writeChunk('leak.js', `var x = ${JSON.stringify(marker)};`);
    const result = run('prod');
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/leak\.js/);
  });

  it('treats an unset environment as PROD, as the site does', () => {
    writeChunk('leak.js', 'fakerjs.dev');
    expect(run(undefined).status).toBe(1);
  });

  it.each(['dev', 'development', 'test'])(
    'skips the check for %s, where mock mode is allowed',
    (environment) => {
      writeChunk('leak.js', 'fakerjs.dev');
      expect(run(environment).status).toBe(0);
    }
  );

  it('fails, rather than passing silently, if the build folder is missing', () => {
    const result = run('prod', path.join(dir, 'does-not-exist'));
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/not found/);
  });
});
