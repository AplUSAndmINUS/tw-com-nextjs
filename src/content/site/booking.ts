/**
 * Book a Conversation
 * ===================
 *
 * The one booking call to action on TerenceWaters.com (D2: it replaces
 * "Book a free consultation" everywhere). Every button reads label and target
 * from here.
 *
 * The booking flow opens as a full-screen dialog from every button (#278).
 * Without JavaScript the buttons go to /book/ (#306), which links to TidyCal.
 * The steps and questions are the same as before; TidyCal is the last step.
 */

import { approved, draft, existing } from './copy';

export const TIDYCAL_URL = 'https://tidycal.com/terencewaters';

/** Where "send me a message instead" goes when booking fails (#295). */
export const MESSAGE_FALLBACK_HREF = '/contact/#message';

export interface BookingLink {
  label: string;
  href: string;
  /** True while the target is off-site (opens in a new tab, shows ↗). */
  external: boolean;
}

export const BOOK_A_CONVERSATION: BookingLink = {
  label: approved(
    'booking.label',
    'Book a Conversation',
    'D2 (SUGGESTED_CODE_MAPPING decisions log)'
  ),
  // Openers use the full-screen dialog (#278); without JavaScript the link
  // goes to /book/, which opens the dialog on load and offers TidyCal
  // directly (owner, 2026-11-19, as on fluxline.pro/book).
  href: '/book/',
  external: false,
};

const brief = 'CREATIVE_BRIEF §7.5 (/conversation microcopy draft)';
const bookPage = 'Owner, 2026-11-19 (/book like fluxline.pro/book); draft';

/** /book: the dialog opens on load; the page explains the steps. */
export const BOOK_PAGE = {
  metaTitle: draft(
    'book.meta.title',
    'Book a Conversation | Terence Waters',
    bookPage
  ),
  metaDescription: draft(
    'book.meta.description',
    'Book a free conversation with Terence Waters. Tell me what you need, then pick a time on my calendar.',
    bookPage
  ),
  kicker: draft('book.kicker', "Let's talk", bookPage),
  lede: draft(
    'book.lede',
    'Tell me what you need and pick a time: three quick steps, then my calendar. (No sales pitch. Just a conversation.)',
    bookPage
  ),
  stepsTitle: draft('book.steps.title', 'How it works', bookPage),
  steps: [
    draft(
      'book.steps.1',
      "Choose what you'd like to talk about, or pick “Help me choose”.",
      bookPage
    ),
    draft(
      'book.steps.2',
      'Answer a few short questions so we can make the most of our time.',
      bookPage
    ),
    draft(
      'book.steps.3',
      'Add your details and pick a time on my calendar.',
      bookPage
    ),
  ],
} as const;
const stepper = 'Existing ConsultationStepper';

/**
 * The booking flow's own words (its "chrome"). The services, questions,
 * options, meeting lengths and consent text are unchanged and still come from
 * ConsultationStepper/constants.ts (owner: the steps and their content stay
 * the same). Where the old chrome said "we" or "this modal", it is first
 * person now.
 */
export const BOOKING_FLOW = {
  stepLabels: {
    1: existing('booking.step1.label', 'Services', stepper),
    2: existing('booking.step2.label', 'Your Needs', stepper),
    3: existing('booking.step3.label', 'Contact & Schedule', stepper),
  },
  progress: draft('booking.progress', 'Step {n} of 3', 'Progress line; draft'),
  stepsLabel: existing(
    'booking.stepsLabel',
    'Consultation steps',
    `${stepper} (step list name)`
  ),
  step1: {
    title: draft('booking.step1.title', 'What do you need to discuss?', brief),
    text: draft(
      'booking.step1.text',
      "Pick one or more. Not sure? Choose “I don't know / Help me choose” and we'll work it out on the call.",
      `${stepper} help text, first person; draft`
    ),
    next: draft(
      'booking.step1.next',
      'Next: tell me more',
      `${stepper} ("Next: Tell us about your needs"), first person; draft`
    ),
    error: existing(
      'booking.step1.error',
      'Please select at least one option to continue.',
      stepper
    ),
  },
  step2: {
    title: draft('booking.step2.title', 'Want to tell me more?', brief),
    text: draft(
      'booking.step2.text',
      'Answer what you can. It helps me make the most of our time together.',
      `${stepper} help text, first person; draft`
    ),
    helpMeChoose: draft(
      'booking.step2.helpMeChoose',
      "No problem. We'll work out what fits on the call. Just add your details in the next step.",
      `${stepper} help text, without the em dash; draft`
    ),
    required: existing(
      'booking.step2.required',
      'This field is required.',
      stepper
    ),
    next: existing('booking.step2.next', 'Next: Contact & Schedule', stepper),
  },
  step3: {
    nameShort: draft(
      'booking.step3.nameShort',
      'Please enter your full name (at least 2 characters).',
      'Field error; api/leads needs 2+ characters (#303); draft'
    ),
    title: draft(
      'booking.step3.title',
      'Where can I reach you?',
      'Step 3 heading, first person; draft'
    ),
    text: draft(
      'booking.step3.text',
      'Add your details, then choose “Schedule a time” to pick a slot right here on the page.',
      `${stepper} help text ("without leaving this modal"), now inline; draft`
    ),
    submit: existing('booking.step3.submit', 'Schedule a time', stepper),
    submitting: existing(
      'booking.step3.submitting',
      'Opening calendar…',
      stepper
    ),
  },
  back: existing('booking.back', 'Back', stepper),
  errors: {
    generic: draft(
      'booking.error.generic',
      'Something went wrong on my end, and your answers are still here. Try again, or send me a message instead.',
      `${stepper} ("Something went wrong. Please try again or Contact Us Directly"), first person; draft`
    ),
    messageLink: draft(
      'booking.error.messageLink',
      'Send me a message',
      'Link in the booking error; draft'
    ),
    validation: draft(
      'booking.error.validation',
      "Something in the form didn't go through. Check your details and try again.",
      'Booking error for a rejected form (400, #303); draft'
    ),
    tidyCalLink: draft(
      'booking.error.tidyCalLink',
      'Or pick a time on TidyCal',
      'TidyCal fallback when saving the lead fails (#303); draft'
    ),
  },
  schedule: {
    title: draft(
      'booking.schedule.title',
      "Pick a time. I'll see your note before we talk.",
      brief
    ),
    placeholder: draft(
      'booking.schedule.placeholder',
      'The calendar comes from TidyCal. It loads when you ask for it, so nothing from TidyCal runs on this page until then.',
      'Click-to-load placeholder (DESIGN_BRIEF §11 embed pattern); draft'
    ),
    load: draft(
      'booking.schedule.load',
      'Load the calendar',
      'Click-to-load button; draft'
    ),
    newTab: existing('booking.schedule.newTab', 'Open in New Tab', stepper),
    frameTitle: existing(
      'booking.schedule.frameTitle',
      'TidyCal booking calendar',
      stepper
    ),
    done: existing('booking.schedule.done', "I've Scheduled My Time", stepper),
  },
  success: {
    title: draft('booking.success.title', "You're booked.", brief),
    text: draft(
      'booking.success.text',
      "I'm looking forward to it. Check your inbox for the details.",
      brief
    ),
  },
  noScript: draft(
    'booking.noScript',
    'The booking steps need JavaScript. You can book straight on TidyCal instead.',
    'No-JS fallback; draft'
  ),
  noScriptLink: draft(
    'booking.noScriptLink',
    'Book on TidyCal',
    'No-JS fallback link; draft'
  ),
} as const;
