/**
 * /contact copy: one place to talk to Terence
 * ===========================================
 *
 * The page's job (INITIAL_PLAN.md Session 4): book, write, or subscribe.
 * Decision B: the full contact form lives here only; Home keeps a short
 * "Let's talk" band (and its #contact / #newsletter anchors) that points here.
 *
 * Order: intro (with a jump list) → #conversation → #message → #newsletter →
 * find me online.
 *
 * The intro and message lines are the homepage contact section's own words,
 * which this page replaces. Search wording is a placeholder until Slice 8.
 */

import { approved, draft, existing } from './copy';

const homeContact = 'Existing homepage contact section';

export const CONTACT = {
  meta: {
    title: draft(
      'contact.meta.title',
      "Contact Terence Waters: Let's Talk",
      'Slice 8: owns "contact Terence Waters" (INITIAL_PLAN §8.1), same pattern as the other titles'
    ),
    description: draft(
      'contact.meta.description',
      'Book a Conversation with Terence Waters, send him a message, or get new writing in your inbox.',
      'Slice 8 (owns "book a conversation with Terence Waters", "Terence Waters newsletter")'
    ),
    /** The breadcrumb and ContactPage name. */
    name: draft('contact.meta.name', 'Contact Terence Waters', 'Schema / breadcrumb name; draft'),
  },

  intro: {
    kicker: existing('contact.intro.kicker', 'Contact', `${homeContact} (kicker)`),
    /**
     * The h1. The same words as Home's "Let's talk" band, so the link from
     * there lands where it says, and the page title matches.
     */
    title: approved('contact.intro.title', "Let's talk", "Approved for Home's band at Checkpoint 2a (home.talk.title)"),
    body: existing(
      'contact.intro.body',
      "Whether it's a platform to architect, an identity to rebuild, or just a conversation about the work — I'd genuinely love to hear from you.",
      `${homeContact} (first paragraph)`
    ),
    /** Accessible name for the jump list. */
    jumpLabel: draft('contact.intro.jumpLabel', 'Ways to reach me', 'Accessible name for the jump list; draft'),
  },

  conversation: {
    text: draft(
      'contact.conversation.text',
      "Tell me a little about what's on your mind, then pick a time that works. (No sales pitch. Just a conversation.)",
      'CREATIVE_BRIEF §7.5 (/conversation intro draft), without its opening "Let\'s talk."'
    ),
  },

  message: {
    title: existing('contact.message.title', 'Send a message', 'Existing /about-me link label'),
  },

  newsletter: {
    title: existing('contact.newsletter.title', 'Get new writing in your inbox', 'Existing home newsletter heading'),
  },

  socials: {
    title: existing('contact.socials.title', 'Find me online', 'Existing /about-me heading'),
  },
} as const;

/**
 * The contact and newsletter forms' own words (moved with the forms from the
 * homepage to src/components in Slice 5a; unchanged). The success line is
 * MICROCOPY.formSuccess.
 */
export const CONTACT_FORM = {
  name: existing('form.contact.name', 'Name', 'Existing contact form label'),
  namePlaceholder: draft(
    'form.contact.namePlaceholder',
    'Your name',
    'Existing placeholder without "(min. 10 characters)": the minimum is 2 now (owner, Checkpoint 5a)'
  ),
  email: existing('form.contact.email', 'Email', 'Existing contact form label'),
  emailPlaceholder: existing('form.contact.emailPlaceholder', 'you@example.com', 'Existing contact form placeholder'),
  message: existing('form.contact.message', 'Message', 'Existing contact form label'),
  messagePlaceholder: existing(
    'form.contact.messagePlaceholder',
    'What are you working on? (min. 15 characters)',
    'Existing contact form placeholder'
  ),
  submit: existing('form.contact.submit', 'Send message', 'Existing contact form button'),
  sending: existing('form.contact.sending', 'Sending…', 'Existing contact form button (busy)'),
  sent: existing('form.contact.sent', 'Message sent', 'Existing contact form success title'),
} as const;

export const NEWSLETTER_FORM = {
  emailLabel: existing('form.newsletter.emailLabel', 'Email address', 'Existing newsletter field label (aria-label)'),
  emailPlaceholder: existing('form.newsletter.emailPlaceholder', 'you@example.com', 'Existing newsletter placeholder'),
  submit: existing('form.newsletter.submit', 'Subscribe', 'Existing newsletter button'),
  submitting: existing('form.newsletter.submitting', 'Subscribing…', 'Existing newsletter button (busy)'),
  success: existing(
    'form.newsletter.success',
    "You're in. Thanks for subscribing — I'll be in touch.",
    'Existing newsletter success line'
  ),
} as const;

/**
 * Friendly lines for failures the API can't word well itself (redesign
 * Slice 6): a server rate limit (its body just says "Too Many Requests") and
 * no connection at all (the browser's "Failed to fetch"). Other API errors are
 * shown as the API words them.
 */
export const FORM_ERRORS = {
  rateLimited: draft(
    'form.error.rateLimited',
    "That's a lot of tries in a short time. Give it a few minutes, then try again.",
    'Slice 6 (form error states); draft'
  ),
  network: draft(
    'form.error.network',
    "I couldn't reach the server. Check your connection and try again.",
    'Slice 6 (form error states); draft'
  ),
} as const;
