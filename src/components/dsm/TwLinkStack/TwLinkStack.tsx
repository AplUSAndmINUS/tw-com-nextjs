import React from 'react';
import styles from './TwLinkStack.module.scss';

export interface TwLinkStackItem {
  label: string;
  href: string;
  /** A short second line under the label. */
  description?: string;
  /**
   * 'gold' is for the pre-order link only (the CTA hierarchy); 'primary' for
   * Book a Conversation; 'default' for everything else.
   */
  tone?: 'gold' | 'primary' | 'default';
  /** Opens in a new tab and shows ↗ instead of →. */
  external?: boolean;
  /**
   * Handles the click in the page (e.g. opening the booking dialog). The link
   * still has a real `href` for no-JavaScript visitors, and skips the
   * site's route transition. Only usable from a client component.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface TwLinkStackProps {
  items: TwLinkStackItem[];
  /** Accessible name for the list, e.g. "Start here". */
  label: string;
  /**
   * 2: two columns from tablet width up (one on phones, where the stack is a
   * thumb list). The first item spans both columns.
   */
  columns?: 1 | 2;
  className?: string;
}

/**
 * Link stack: a link-in-bio list with big, thumb-friendly rows
 * (DESIGN_BRIEF.md §7.3, §8.3). Order follows the CTA hierarchy; the caller
 * passes the items in that order.
 */
export function TwLinkStack({
  items,
  label,
  columns = 1,
  className,
}: TwLinkStackProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul className={[styles.stack, columns === 2 ? styles.stackTwo : ''].filter(Boolean).join(' ')}>
        {items.map((item) => (
          <li key={item.href + item.label}>
            <a
              href={item.href}
              className={[
                styles.link,
                item.tone === 'gold' ? styles.gold : '',
                item.tone === 'primary' ? styles.primary : '',
              ]
                .filter(Boolean)
                .join(' ')}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              {...(item.onClick
                ? { onClick: item.onClick, 'data-no-route-transition': '' }
                : {})}
            >
              <span className={styles.text}>
                <span className={styles.label}>{item.label}</span>
                {item.description ? (
                  <span className={styles.description}>{item.description}</span>
                ) : null}
              </span>
              <span className={styles.arrow} aria-hidden='true'>
                {item.external ? '↗' : '→'}
              </span>
              {item.external ? (
                <span className={styles.srOnly}> (opens in a new tab)</span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TwLinkStack;
