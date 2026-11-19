# 2026-11-18: TW.com home page rebuild (from the user-copy redesign)

Owner (Terence) brief, given in a Claude Code session on 2026-11-18. Source
material: the user-copy and Instagram redesign zips in
`H:\Operation_Lighthouse\TW_New_Website\` (built in a separate copy of the
repo; merged here file by file, keeping develop's later fixes).

## Brief for the home page
1. The scroll parallax treatment from /about-me and /about on the home hero.
2. The "Pre-order the book" card from user-copy (always shown; the TW.com
   redesign launches with pre-orders on 2026-11-20).
3. The user-copy nav on every page: About, The Book, Content (dropdown, the
   link itself goes to /content-hub), Contact; Display and Book a
   Conversation in the bar; the same on phones.
4. Sections, in order: the book hook (eyebrow "MY RCF BOOK", subtitle
   "Because I hate self-help books.", the "self-action" paragraph); The Shifts
   (shorter subheading, the "Hi! I'm Terence" paragraphs, blockquote
   "Structure. Clarity. A way to understand who I was becoming and why.");
   Humans FIRST (animated line background, glacier cyan periods); The Human
   Element (with a heading); Design, architecture, and coaching (unchanged);
   Content Hub (three cards with previews, "See what I've been building →");
   Let's talk (Book a Conversation opens the stepper full screen with an X);
   the closing quote; footer (no Case Studies, a bigger newsletter in a
   different font, simpler on phones). Portfolio and "What I'm building" are
   dropped.
5. Book a Conversation should be easy to move to fluxline-pro-next.

## Split into PRs
- A (#278): BookingFlow + full-screen BookingModal (portable; see
  src/components/BookingFlow/README.md).
- B: the nav on every page.
- C: the home sections and footer.
