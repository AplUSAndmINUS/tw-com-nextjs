'use client';

import React from 'react';
import Link from 'next/link';
import { TwGrid } from '@/components/dsm';
import { useBookingModal } from '@/components/BookingFlow';
import {
  BookIcon,
  CalendarIcon,
  MicIcon,
  PersonIcon,
} from '@/components/icons';
import type { IconProps } from '@/components/icons';
import styles from './QuickLinks.module.scss';

export interface QuickLink {
  label: string;
  href: string;
  icon: 'book' | 'calendar' | 'person' | 'mic' | 'instagram';
  /** Leaves the site: opens in a new tab. */
  external?: boolean;
  /** Opens the full-screen booking dialog instead of following `href`. */
  booking?: boolean;
  /** The one highlighted card: gold and slightly larger (the pre-order). */
  highlight?: boolean;
}

const ICONS: Record<
  Exclude<QuickLink['icon'], 'instagram'>,
  React.ComponentType<IconProps>
> = {
  book: BookIcon,
  calendar: CalendarIcon,
  person: PersonIcon,
  mic: MicIcon,
};

function LinkIcon({ icon }: { icon: QuickLink['icon'] }) {
  if (icon === 'instagram') {
    // The brand mark, tinted like the other icons (a CSS mask over gold).
    return <span className={styles.brandIcon} aria-hidden='true' />;
  }
  const Icon = ICONS[icon];
  return <Icon size={24} className={styles.icon} aria-hidden='true' />;
}

/**
 * /about-me quick links (#288): the user copy's link stack as small cards on
 * one row, each a gold icon over centred text. The pre-order card is gold and
 * slightly larger. On phones the cards stack (TwGrid is one column there).
 *
 * A client component only so Book a Conversation can open the booking dialog
 * (useBookingModal); every card is a real link, so it works without
 * JavaScript too.
 */
export function QuickLinks({
  items,
  label,
}: {
  items: QuickLink[];
  label: string;
}) {
  const booking = useBookingModal();

  return (
    <nav aria-label={label} className={styles.root}>
      <TwGrid
        cols={items.length}
        tabletCols={items.length}
        className={styles.grid}
      >
        {items.map((item) => {
          const className = [
            styles.card,
            item.highlight ? styles.highlight : '',
          ]
            .filter(Boolean)
            .join(' ');
          const content = (
            <>
              <LinkIcon icon={item.icon} />
              <span className={styles.label}>{item.label}</span>
            </>
          );
          if (item.booking) {
            return (
              <a
                key={item.label}
                href={item.href}
                className={className}
                data-no-route-transition=''
                onClick={(event) => {
                  if (!booking) return;
                  event.preventDefault();
                  booking.open();
                }}
              >
                {content}
              </a>
            );
          }
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                className={className}
                target='_blank'
                rel='noopener noreferrer'
              >
                {content}
              </a>
            );
          }
          return (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </TwGrid>
    </nav>
  );
}

export default QuickLinks;
