import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    // Lets any .module.scss reach the shared mixins with `@use 'abstracts' as *`
    // instead of counting ../ segments back to src/styles.
    loadPaths: [path.join(process.cwd(), 'src', 'styles')],
  },
};

export default nextConfig;
