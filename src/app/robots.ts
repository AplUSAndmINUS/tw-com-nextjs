import { MetadataRoute } from 'next';
import { getEnvironment } from '@/lib/environment';

/**
 * Dynamic robots.txt generation
 *
 * Environment behavior:
 * - DEV/TEST: Disallow all crawlers to prevent staging content from entering AI knowledge bases
 * - PROD: Allow every crawler, and name the major search and AI crawlers
 *   (OpenAI, Anthropic, Perplexity, Google, Microsoft, Apple, Amazon, Meta,
 *   DuckDuckGo, Mistral, Common Crawl, ByteDance) in one explicit allow group.
 *   A bot that matches a named group ignores the `*` group, so the named group
 *   repeats the same disallow list. `/_next/` and `/static/` stay crawlable:
 *   search engines need the CSS and JS to render pages. The sitemap URL is
 *   included for discovery.
 *
 * This replaces static public/robots.txt for environment-aware control.
 */

// Required for static export
export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL || 'https://terencewaters.com';
const env = getEnvironment();
const isProd = env === 'prod';

/** Paths no crawler needs. Shared by every group (see doc comment). */
const DISALLOW = ['/api/'];

/** Search and AI crawlers that are explicitly welcome. */
const NAMED_CRAWLERS = [
  // OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Claude-Web',
  'anthropic-ai',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google (Search, Gemini)
  'Googlebot',
  'Google-Extended',
  // Microsoft (Bing, Copilot)
  'Bingbot',
  // Apple (Search, Apple Intelligence)
  'Applebot',
  'Applebot-Extended',
  // Amazon
  'Amazonbot',
  // Meta
  'Meta-ExternalAgent',
  // DuckDuckGo
  'DuckDuckBot',
  'DuckAssistBot',
  // Mistral
  'MistralAI-User',
  // Common Crawl
  'CCBot',
  // ByteDance (TikTok)
  'Bytespider',
];

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
        disallow: DISALLOW,
      },
      // Explicitly allow major search and AI crawlers
      {
        userAgent: NAMED_CRAWLERS,
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
