export function generateCanonicalUrl(path: string): string {
  const base = 'https://terencewaters.com';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function truncateExcerpt(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
