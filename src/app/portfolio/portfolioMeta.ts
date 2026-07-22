import type { TwPageNavLink } from '@/components/dsm';

/**
 * Interior-page nav links for the portfolio list and detail pages, sharing the
 * active marker so "Portfolio" stays highlighted across both.
 */
export const PORTFOLIO_NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub' },
  { label: 'Portfolio', href: '/portfolio', active: true },
];

/**
 * Portfolio frontmatter categories are inconsistent slugs ("web",
 * "web-application", "WebDevelopment", "business-intelligence", …). Normalise
 * them to a small set of clean, human labels so the filter chips and card
 * badges read well and collapse duplicates.
 */
export function portfolioCategoryLabel(category?: string): string {
  if (!category) return 'Work';
  const key = category.toLowerCase().replace(/[\s_-]/g, '');
  const map: Record<string, string> = {
    web: 'Web',
    webapplication: 'Web',
    webdevelopment: 'Web',
    businessintelligence: 'Data & BI',
    design: 'Design',
    graphicdesign: 'Design',
    branding: 'Brand',
    coaching: 'Coaching',
    other: 'Work',
  };
  return map[key] ?? category;
}
