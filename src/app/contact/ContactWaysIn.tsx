'use client';

import { TwLinkStack, type TwLinkStackItem } from '@/components/dsm';
import { useBookingModal } from '@/components/BookingFlow';
import { BOOK_A_CONVERSATION } from '@/content/site/booking';
import { CONTACT } from '@/content/site/contact';

/**
 * The jump list under the /contact intro (user copy): Book a Conversation,
 * Send a message, the newsletter. Book a Conversation opens the full-screen
 * booking dialog, as everywhere else on the site (owner, #295); its href
 * still points at #conversation for visitors without JavaScript.
 */
export function ContactWaysIn() {
  const booking = useBookingModal();
  const items: TwLinkStackItem[] = [
    {
      label: BOOK_A_CONVERSATION.label,
      href: '#conversation',
      tone: 'primary',
      // Outside the booking provider the link simply jumps to #conversation.
      onClick: (event) => {
        if (!booking) return;
        event.preventDefault();
        booking.open();
      },
    },
    { label: CONTACT.message.title, href: '#message' },
    { label: CONTACT.newsletter.title, href: '#newsletter' },
  ];
  return <TwLinkStack label={CONTACT.intro.jumpLabel} items={items} />;
}

export default ContactWaysIn;
