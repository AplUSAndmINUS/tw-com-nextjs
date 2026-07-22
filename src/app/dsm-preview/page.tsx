import type { Metadata } from 'next';
import DsmPreviewClient from './DsmPreviewClient';

/**
 * Design system preview.
 *
 * A development and QA surface, not part of the site. It is noindexed and
 * excluded from sitemap.ts. Keeping it in the app (rather than a separate
 * Storybook) means it renders through the real providers, the real token layer
 * and the real theme switching, so what it shows is what ships.
 */
export const metadata: Metadata = {
  title: 'Design System Preview',
  description: 'Internal preview of the TerenceWaters.com design system.',
  robots: { index: false, follow: false },
};

export default function DsmPreviewPage() {
  return <DsmPreviewClient />;
}
