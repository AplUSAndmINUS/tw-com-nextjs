import path from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration.
 *
 * The repo previously had a test file but no runner, so `githubLoader.test.ts`
 * never executed and its `describe`/`it`/`expect` calls were nine typecheck
 * errors. This wires up the runner it was always assuming.
 *
 * Notes on the choices here:
 *
 * - `environment: 'node'` (the default) rather than jsdom. Everything under
 *   test today is pure data transformation with no DOM access, and jsdom is a
 *   meaningful startup cost per run. Component tests would need jsdom plus
 *   @vitejs/plugin-react; add those when the first one is written, not before.
 *
 * - Globals are NOT enabled. Enabling them would mean adding
 *   `"types": ["vitest/globals"]` to tsconfig.json, and because that file
 *   currently has no `types` field, introducing one would restrict type
 *   inclusion to just that entry — silently dropping @types/node and
 *   @types/react from the whole project. Tests import from 'vitest' explicitly
 *   instead, which is also clearer about where the helpers come from.
 *
 * - The `@/` alias mirrors tsconfig's `paths` so future tests can use the same
 *   import style as application code.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.join(process.cwd(), 'src'),
    },
  },
});
