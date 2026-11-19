/**
 * When the /about-me Instagram grid may use its Faker mock feed.
 *
 * Mock mode is a DEV/TEST tool. Faker must never reach PROD: not run, and not
 * shipped in the build output either. So the rule is applied at BUILD time:
 *
 *   1. next.config.ts calls `isInstagramMockBuild()` and compiles the answer
 *      into the bundle as the literal `process.env.TW_INSTAGRAM_MOCK_BUILD`
 *      ('true' or 'false', always defined).
 *   2. `loadInstagramPosts()` (instagram.ts) guards the mock's dynamic
 *      `import()` with that literal. In a PROD build the guard is
 *      `'false' === 'true'`, so the bundler drops the branch, and with it the
 *      mock module and Faker. They are not in the output at all.
 *   3. scripts/verify-no-faker.js runs after every build and fails a PROD
 *      build whose output contains Faker anyway.
 *
 * No imports, so next.config.ts can load this without pulling in app code.
 */

/** Same values getEnvironment() (environment.ts) maps to 'dev' and 'test'. */
const MOCK_ENVIRONMENTS = new Set(['dev', 'development', 'test']);

/**
 * Environment variables by name, as in `process.env` (which is the default).
 * The two read here are NEXT_PUBLIC_INSTAGRAM_MOCK and NEXT_PUBLIC_ENVIRONMENT.
 */
export type InstagramMockEnv = Readonly<Record<string, string | undefined>>;

/**
 * True only when NEXT_PUBLIC_INSTAGRAM_MOCK is 'true' AND the build is for
 * DEV or TEST. An unset environment counts as PROD, as in getEnvironment().
 */
export function isInstagramMockBuild(
  env: InstagramMockEnv = process.env
): boolean {
  return (
    env.NEXT_PUBLIC_INSTAGRAM_MOCK === 'true' &&
    MOCK_ENVIRONMENTS.has((env.NEXT_PUBLIC_ENVIRONMENT ?? '').toLowerCase())
  );
}
