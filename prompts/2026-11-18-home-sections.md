# 2026-11-18: Home page sections (#285)

Part C of the home rebuild (see `2026-11-18-home-rebuild.md`; part B, the
site nav, was #281).

## Ask (Terence)

1. Parallax on scroll as on /about-me ("About-me has it almost perfect").
2. "The card, 'Pre-order the book' should be the card... it's in user-copy."
3. Sections in order:
   1. The book ("I wrote this book…"): eyebrow MY RCF BOOK; subtitle "Because
      I hate self-help books." (with the quotes); his paragraph; everything
      else as in the user copy.
   2. The Shifts: a shorter subheading, then the "Hi! I'm Terence" paragraphs
      and the blockquote changed to "Structure. Clarity…", then the timeline.
      No image or socials.
   3. Humans FIRST, with an animated lines/tech background and glacier-cyan
      periods.
   4. A heading for "It all starts with The Human Element…".
   5. Keep "Design, architecture, and coaching".
   6. Content Hub: three cards with previews, CTA "See what I've been
      building →".
   7. Replace "Get new writing" with "Let's talk". Book a Conversation opens
      the booking stepper full screen, with an X and tap-out.
   8. Keep the quote.
   9. Footer: no "Case Studies"; a bigger newsletter section in a different
      font; simpler on phones.
4. Answers: always show the pre-order card; drop Portfolio and "What I'm
   building". The TW redesign launches on 11/20 with the pre-order, so
   pre-order content comes back on.

## Decisions

- **Hero:** keeps its copy. Its buttons are the user copy's: gold "Pre-order
  the book" and "Read my full story". The old ones pointed at removed
  sections.
- **Book section:** the pre-order card is always shown, as answered.
- **Credo:** `TwCredo animated` draws drifting light traces using
  transform/opacity only. They rest under reduced motion and are hidden
  under reduced transparency and high contrast. The periods use `--tw-line`,
  which is glacier cyan in light and dark and is remapped by the a11y modes.
- **Values:** the visible heading is the already approved "What I stand for".
- **Let's talk:** keeps the message form, because the nav's Contact link and
  the booking flow's "send me a message instead" both land on `#contact`
  until /contact/ exists.
- **Footer:** the newsletter is the lead block (`#newsletter`), set in
  Montserrat.
- **Separate commit:** the pre-order switch is in its own commit, so it can
  ship by itself on 11/20 if needed.

## Draft wording to confirm

- The Shifts subheading: "Each Shift added to who I am. Nothing got replaced."
