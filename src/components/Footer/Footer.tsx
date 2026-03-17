import { HomePageFooter } from './HomePageFooter';

interface FooterProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
  /** @deprecated No longer needed — all footers now use the same styling */
  isHomePage?: boolean;
}

/**
 * Footer — Unified footer component
 *
 * All pages now use HomePageFooter styling:
 * glassmorphism background, accent top border, diagonal gradient,
 * mobile slide-in toggle, desktop always-visible.
 */
export function Footer({ isCompact = false }: FooterProps) {
  return <HomePageFooter isCompact={isCompact} />;
}
