'use client';

import React, { useMemo, useState } from 'react';
import { TwSectionHeading } from '../TwSectionHeading';
import { TwFilterChips } from '../TwFilterChips';
import { TwContentGrid } from '../TwContentGrid';
import { TwArticleCard } from '../TwArticleCard';
import styles from './TwListingView.module.scss';

export interface TwListingItem {
  /** Stable key. */
  id: string;
  title: string;
  excerpt?: string;
  /** Shown as a chip on the card, and the value filtered on unless `filter` is set. */
  category?: string;
  /** Value the filter chips match against. Falls back to `category`. */
  filter?: string;
  date?: string;
  image?: string;
  imageAlt?: string;
  /** Destination; when set the whole card is a link. */
  href?: string;
  /** Open the link in a new tab (external targets, e.g. GitHub repos). */
  external?: boolean;
}

export interface TwListingViewProps {
  kicker?: string;
  title: string;
  lede?: string;
  items: TwListingItem[];
  /**
   * Filter chip options. When omitted, they're derived from the items' filter
   * values (or categories), preserving first-seen order. Pass an explicit list
   * to control order/labels.
   */
  filters?: { label: string; value: string }[];
  /** Label for the "show everything" chip. Default "All". */
  allLabel?: string;
  /** Desktop column count. Default 3. */
  cols?: number;
  emptyMessage?: string;
}

/**
 * The shared list view: a heading, format filter chips, and a staggered card
 * grid — the pattern behind Blog, and reused for Portfolio / GitHub / Videos.
 *
 * Filter state is local. The chips filter on each item's `filter` value (or
 * `category`), and the options are derived from the data unless supplied, so a
 * new content type needs no filter config.
 */
export function TwListingView({
  kicker,
  title,
  lede,
  items,
  filters,
  allLabel = 'All',
  cols = 3,
  emptyMessage = 'Nothing here yet — check back soon.',
}: TwListingViewProps) {
  const [active, setActive] = useState<string | null>(null);

  const filterValue = (item: TwListingItem) => item.filter ?? item.category;

  const chipOptions = useMemo(() => {
    if (filters) return filters;
    const seen = new Set<string>();
    const derived: { label: string; value: string }[] = [];
    for (const item of items) {
      const value = filterValue(item);
      if (value && !seen.has(value)) {
        seen.add(value);
        derived.push({ label: value, value });
      }
    }
    return derived;
  }, [filters, items]);

  const shown =
    active === null
      ? items
      : items.filter((item) => filterValue(item) === active);

  return (
    <>
      <section className={styles.head}>
        <div className={styles.headGlow} aria-hidden='true' />
        <div className={styles.container}>
          <TwSectionHeading as='h1' kicker={kicker} title={title} lede={lede} />
          {chipOptions.length > 1 ? (
            <div className={styles.filters}>
              <TwFilterChips
                options={chipOptions}
                value={active}
                onChange={setActive}
                allLabel={allLabel}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.container}>
          {shown.length === 0 ? (
            <p className={styles.empty}>{emptyMessage}</p>
          ) : (
            <TwContentGrid cols={cols} tabletCols={2}>
              {shown.map((item) => (
                <TwArticleCard
                  key={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  category={item.category}
                  date={item.date}
                  href={item.href}
                  external={item.external}
                  image={item.image}
                  imageAlt={item.imageAlt}
                />
              ))}
            </TwContentGrid>
          )}
        </div>
      </section>
    </>
  );
}

export default TwListingView;
