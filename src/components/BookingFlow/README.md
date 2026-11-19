# Book a Conversation (BookingFlow + BookingModal)

The three-step booking stepper (services → your needs → contact & schedule),
which posts the lead to `/api/leads` and then shows the prefilled TidyCal
calendar. It can sit inline (`<BookingFlow />`) or open full screen from any
button (`<BookingTrigger />`, inside `<BookingModalProvider>`).

## Use on this site

- `BookingModalProvider` is mounted once in `src/app/providers.tsx`.
- Any button: `<BookingTrigger variant='primary' />` (label defaults to
  `BOOK_A_CONVERSATION.label`). It is a real link to `BOOK_A_CONVERSATION.href`
  and opens the modal instead when the provider is there.
- Custom opener: `const modal = useBookingModal(); modal?.open();`

## Moving it to another Fluxline app (for example fluxline-pro-next)

Copy these files as they are:

| What                     | Files                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| The flow and the modal   | `src/components/BookingFlow/` (`BookingFlow.tsx`, `BookingModal.tsx`, both `.module.scss`, `index.ts`, the tests) |
| Stepper data and helpers | `src/components/ConsultationStepper/constants.ts`, `lead.ts`, `types.ts`, `useConsultationStorage.ts`             |
| Words                    | `src/content/site/booking.ts`, `contact.ts` (only `FORM_ERRORS` is used), `copy.ts`                               |
| Helpers                  | `src/utils/iconResolver.ts` (service icons), `src/lib/environment.ts` (`getApiBaseUrl`)                           |
| Styles                   | `src/styles/abstracts/_mixins.scss` and `_breakpoints.scss` (for `until()` / `from()`)                            |
| Test harness             | `src/test/formHarness.tsx`                                                                                        |

Then adapt four touch points:

1. **Design tokens and mixins.** The styles use `--tw-*` tokens and the
   `accent-line`, `label`, `focus-ring`, `until`/`from`, `visually-hidden` and
   `motion-safe-only` mixins (`src/styles/abstracts/_mixins.scss`). Map them to
   the target's tokens (on fluxline.pro, `--fx-*`).
2. **Button.** `TwButton` (`@/components/dsm`) renders a link when given an
   `href` and a button otherwise; swap in the target's button with the same
   behaviour (on fluxline.pro, `FxButton`).
3. **Theme hook.** `BookingModal` reads `reducedTransparency` from
   `useAppTheme()`; point it at the target's preference (or drop the opaque
   overlay class).
4. **The API.** `BookingFlow` posts to `${getApiBaseUrl()}/api/leads`
   (`src/lib/environment.ts`). The target needs that endpoint (this repo's
   `api/leads`, with its SharePoint and email settings) or should post to an
   existing one. The consent line links to the Privacy Policy on fluxline.pro
   (`CONTACT_STEP_TEXT.privacyUrl`).

The modal also assumes Next's `usePathname` (it closes on a page change),
this site's `PageTransition` opt-out attribute `data-no-route-transition` on
the trigger (drop it if the target has no link interception), and a z-index
of 1300 above the site's drawers and banners.

Also set `BOOK_A_CONVERSATION.href` (the no-JavaScript fallback) and
`MESSAGE_FALLBACK_HREF` ("send me a message instead") in `booking.ts` to the
target's own pages.
