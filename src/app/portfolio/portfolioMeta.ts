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
