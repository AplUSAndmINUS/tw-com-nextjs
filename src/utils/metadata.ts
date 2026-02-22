import type { Metadata } from 'next';

const BASE_URL = 'https://terencewaters.com';
const DEFAULT_DESCRIPTION = 'Author, technologist, and creative thinker.';

export function buildMetadata(overrides: Partial<Metadata> = {}): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'Terence Waters',
      template: '%s | Terence Waters',
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: 'website',
      siteName: 'Terence Waters',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@TerenceWaters',
    },
    ...overrides,
  };
}
