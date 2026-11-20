'use client';

import { TwSiteNav } from '@/components/dsm';
import { useBookingModal } from '@/components/BookingFlow';
import { PERSON_NAME } from '@/content/site/identity';
import {
  SITE_NAV_CTA,
  SITE_NAV_LINKS,
  activeNavHref,
} from '@/content/site/navigation';

/**
 * The site nav, bound to the shared nav config (src/content/site): one nav on
 * every route (#281). "Book a Conversation" opens the full-screen booking
 * modal (#278) from the bar, the phone menu and the phone pill; without the
 * modal it is a link to SITE_NAV_CTA.href.
 */
export function SiteNav() {
  const booking = useBookingModal();
  return (
    <TwSiteNav
      brand={PERSON_NAME}
      links={SITE_NAV_LINKS}
      cta={{
        ...SITE_NAV_CTA,
        onClick: booking
          ? (event) => {
              event.preventDefault();
              booking.open();
            }
          : undefined,
      }}
      activeHref={activeNavHref}
    />
  );
}

export default SiteNav;
