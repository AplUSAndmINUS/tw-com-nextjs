'use client';

import { HomePageFooter } from './HomePageFooter';

interface StandardFooterProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
}

/**
 * StandardFooter — Delegates to HomePageFooter for unified styling across all pages.
 * @deprecated Use <Footer> or <HomePageFooter> directly. Kept for backward compatibility.
 */
export function StandardFooter({ isCompact = false }: StandardFooterProps) {
  return <HomePageFooter isCompact={isCompact} />;
}
