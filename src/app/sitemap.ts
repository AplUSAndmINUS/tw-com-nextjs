import { MetadataRoute } from 'next';
import { getEnvironment } from '@/lib/environment';
import { getAllContent } from '@/lib/content';

/**
 * Dynamic sitemap generation for TerenceWaters.com
 *
 * Priority guide (for AI/SEO ranking):
 *   1.0 — Homepage + key identity pages (About)
 *   0.9 — Services, Contact
 *   0.8 — Blog posts, Portfolio projects, Case studies (authority content)
 *   0.7 — Content hub, Coaching
 *   0.6 — Videos, Podcasts, Archive
 *
 * Environment behavior:
 * - DEV/TEST: Returns minimal stub to prevent indexing
 * - PROD: Full sitemap with all content
 */

// Required for static export
export const dynamic = 'force-static';

const SITE_URL = process.env.SITE_URL || 'https://terencewaters.com';
const env = getEnvironment();
const isProd = env === 'prod';

/**
 * Safely parse a date string, returning undefined if invalid or empty.
 * This prevents Invalid Date entries in the sitemap.
 */
function safeParseDate(dateStr?: string): Date | undefined {
  if (!dateStr || dateStr.trim() === '') {
    return undefined;
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Non-production: Return minimal stub
  if (!isProd) {
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
    ];
  }

  // Static pages with priorities
  const staticPages: MetadataRoute.Sitemap = [
    // Priority 1.0 — Core identity
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },

    // Priority 0.9 — Services and conversion
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Priority 0.7 — Supporting pages
    {
      url: `${SITE_URL}/coaching`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/content-hub`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Priority 0.6 — Content listings
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/podcasts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic content pages (priority 0.8 — authority content)
  try {
    const [blogPosts, portfolioItems, caseStudies] = await Promise.all([
      getAllContent('blog'),
      getAllContent('portfolio'),
      getAllContent('case-studies'),
    ]);

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified:
        safeParseDate(post.publishedDate) || safeParseDate(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    const portfolioPages: MetadataRoute.Sitemap = portfolioItems.map(
      (item) => ({
        url: `${SITE_URL}/portfolio/${item.slug}`,
        lastModified:
          safeParseDate(item.publishedDate) || safeParseDate(item.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })
    );

    const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((study) => ({
      url: `${SITE_URL}/case-studies/${study.slug}`,
      lastModified:
        safeParseDate(study.publishedDate) || safeParseDate(study.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...blogPages, ...portfolioPages, ...caseStudyPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to static pages only if content loading fails
    return staticPages;
  }
}
