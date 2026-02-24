import { HomePageFooter } from './HomePageFooter';
import { StandardFooter } from './StandardFooter';

interface FooterProps {
  /** If true, renders a more compact footer with reduced padding and smaller text (used for standard pages) */
  isCompact?: boolean;
  /** If true, enables collapsible footer on mobile (homepage only) */
  isHomePage?: boolean;
}

/**
 * Footer — Main footer router component
 *
 * Delegates to specialized footer components based on page type:
 * - HomePageFooter: Complex mobile toggle + desktop static footer
 * - StandardFooter: Simple always-visible footer
 */
export function Footer({ isCompact = false, isHomePage = false }: FooterProps) {
  // Route to appropriate footer component
  if (isHomePage) {
    return <HomePageFooter />;
  }

  return <StandardFooter isCompact={isCompact} />;
}
