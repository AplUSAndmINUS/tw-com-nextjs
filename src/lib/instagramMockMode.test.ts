import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * next.config.ts wiring: the value it compiles into every bundle as
 * TW_INSTAGRAM_MOCK_BUILD, for each environment. (The rule itself,
 * isInstagramMockBuild, is tested in instagram.test.ts.) If this value were
 * ever not a literal 'true'/'false', PROD builds could keep the Faker chunk.
 */

async function compiledFlag(
  environment: string | undefined,
  mockFlag: string | undefined
) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', environment as string);
  vi.stubEnv('NEXT_PUBLIC_INSTAGRAM_MOCK', mockFlag as string);
  const { default: config } = await import('../../next.config');
  return (config as { env?: Record<string, string> }).env
    ?.TW_INSTAGRAM_MOCK_BUILD;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('next.config.ts: TW_INSTAGRAM_MOCK_BUILD', () => {
  it.each([
    ['dev', 'true', 'true'],
    ['test', 'true', 'true'],
    ['prod', 'true', 'false'],
    ['', 'true', 'false'],
    ['dev', '', 'false'],
    ['prod', '', 'false'],
  ])(
    'environment %j with mock flag %j compiles to %j',
    async (environment, mockFlag, expected) => {
      expect(await compiledFlag(environment, mockFlag)).toBe(expected);
    }
  );

  it('is always a string literal, never undefined', async () => {
    for (const environment of ['dev', 'test', 'prod', '']) {
      expect(typeof (await compiledFlag(environment, ''))).toBe('string');
    }
  });
});
