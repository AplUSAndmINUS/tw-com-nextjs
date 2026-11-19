import styles from './SkipLink.module.scss';

export interface SkipLinkProps {
  /** id of the page's <main>. */
  targetId?: string;
  label?: string;
}

/**
 * "Skip to content": the first focusable element on the page
 * (DESIGN_BRIEF.md §9, WCAG 2.4.1 Bypass Blocks).
 *
 * Rendered by providers.tsx ahead of the site-wide pre-order bar, so the
 * first Tab lands here rather than on the bar's store link. The target is
 * the route's <main> (src/lib/navMode.ts: #main, or #main-content on the
 * legacy-layout routes); /dsm-preview has none.
 */
export function SkipLink({
  targetId = 'main',
  label = 'Skip to content',
}: SkipLinkProps) {
  return (
    <a href={`#${targetId}`} className={styles.skip}>
      {label}
    </a>
  );
}

export default SkipLink;
