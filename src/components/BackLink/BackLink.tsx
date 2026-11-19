import Link from 'next/link';
import styles from './BackLink.module.scss';

export interface BackLinkProps {
  href: string;
  label: string;
}

/**
 * "← Back to …" at the top of a detail page (a post, a portfolio entry, a
 * video). It used to live in the old per-page nav; with one SiteNav on every
 * route (redesign Slice 6) it sits at the top of the page instead.
 */
export function BackLink({ href, label }: BackLinkProps) {
  return (
    <div className={styles.row}>
      <Link href={href} className={styles.back}>
        <span aria-hidden='true'>&#8592;</span>
        {label}
      </Link>
    </div>
  );
}

export default BackLink;
