import { MetadataRoute } from 'next';
import { getEnvironment } from '@/lib/environment';

/**
 * Dynamic robots.txt generation
 *
 * Environment behavior:
 * - DEV/TEST: Disallow all crawlers to prevent staging content from entering AI knowledge bases
 * - PROD: Explicitly allow major AI crawlers (GPTBot, PerplexityBot, ClaudeBot, etc.) and provide sitemap URL
 *
 * This replaces static public/robots.txt for environment-aware control.
 */

// Required for static export
export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL || 'https://terencewaters.com';
const env = getEnvironment();
const isProd = env === 'prod';

export default function robots(): MetadataRoute.Robots {
  if (!isProd) {
    // Block all crawlers on non-production environments
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // Production: Allow all major crawlers including AI bots
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
      // Explicitly allow major AI crawlers
      {
        userAgent: [
          'GPTBot', // OpenAI
          'ChatGPT-User', // OpenAI
          'PerplexityBot', // Perplexity
          'Claude-Web', // Anthropic
          'ClaudeBot', // Anthropic
          'Google-Extended', // Google Bard/Gemini
          'Bytespider', // ByteDance (TikTok)
          'Applebot-Extended', // Apple Intelligence
        ],
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
