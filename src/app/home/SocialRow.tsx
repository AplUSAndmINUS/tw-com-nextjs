import React from 'react';
import type { HomeSocial } from './homeData';
import styles from './SocialRow.module.scss';

export interface SocialRowProps {
  items: HomeSocial[];
  /** Icon edge length in px. Default 24. */
  size?: number;
  className?: string;
}

/**
 * A row of social links.
 *
 * The icons are single-colour flat SVGs rendered as CSS masks rather than
 * <img> tags, so they inherit `color` and therefore follow the theme tokens —
 * muted at rest, accent on hover. An <img> can't be tinted this way (the SVG is
 * an isolated document), which is why the prototype resorted to a hue-rotate
 * filter; masking is cleaner and token-accurate.
 */
export function SocialRow({ items, size = 24, className }: SocialRowProps) {
  return (
    <div
      className={[styles.row, className].filter(Boolean).join(' ')}
      style={{ '--tw-social-size': `${size}px` } as React.CSSProperties}
    >
      {items.map((item) => (
        <a
          key={item.name + item.href}
          href={item.href}
          className={styles.link}
          aria-label={item.name}
          {...(item.href.startsWith('http')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          <span
            className={styles.icon}
            style={{
              maskImage: `url(/assets/icons/${item.icon}.svg)`,
              WebkitMaskImage: `url(/assets/icons/${item.icon}.svg)`,
            }}
            aria-hidden='true'
          />
        </a>
      ))}
    </div>
  );
}

export default SocialRow;
