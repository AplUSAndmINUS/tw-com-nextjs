import path from 'node:path';
import { isInstagramMockBuild } from './src/lib/instagramMockMode';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    // The /about-me Instagram grid's Faker mock mode, decided once per build
    // and compiled in as a literal: 'true' only for DEV/TEST builds that set
    // NEXT_PUBLIC_INSTAGRAM_MOCK=true. Every other build, PROD included, gets
    // 'false', so the bundler drops the mock and Faker entirely. See
    // src/lib/instagramMockMode.ts.
    TW_INSTAGRAM_MOCK_BUILD: isInstagramMockBuild() ? 'true' : 'false',
  },
  sassOptions: {
    // Lets any .module.scss reach the shared mixins with `@use 'abstracts' as *`
    // instead of counting ../ segments back to src/styles.
    loadPaths: [path.join(process.cwd(), 'src', 'styles')],
  },
};

export default nextConfig;
