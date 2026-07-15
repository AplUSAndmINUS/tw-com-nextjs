# Guidelines for AI-Assisted Development in the TW.com Next.js System

## Purpose

These instructions define how GitHub Copilot should assist in building and maintaining the TW.com codebase. The goal is to ensure consistency, architectural integrity, and a clean developer experience while preserving the site's identity as a personal, author-driven platform.

TW.com uses:

- Next.js App Router
- Static Site Generation (SSG)
- Tailwind CSS
- Fluent UI theme integration (extended theme system)
- Framer Motion for animations
- Yarn as the package manager
- A file-based content system (Markdown/MDX)
- A layout-driven design architecture

Copilot should follow these conventions at all times.

---

## 1. Core Principles

### 1.1 — Follow Existing Patterns

Copilot should:

- Mirror the existing folder structure
- Reuse established components, layouts, and utilities
- Follow naming conventions already present in the project
- Extend patterns rather than invent new ones

Consistency is more important than novelty.

### 1.2 — Composition Over Duplication

Copilot should:

- Use shared primitives (buttons, cards, wrappers, grids)
- Avoid recreating components that already exist
- Suggest refactoring when patterns repeat

### 1.3 — Strict TypeScript

Copilot must:

- Use TypeScript everywhere
- Infer types from existing interfaces
- Avoid `any` unless explicitly required
- Prefer typed objects, unions, and discriminated patterns

---

## 2. Project Structure

```
src/
  app/
  components/
  layouts/
  theme/
  hooks/
  utils/
  content/
public/
content/
prompts/
```

When generating new files, Copilot should place them in the correct directory automatically.

---

## 3. Next.js Guidelines

### 3.1 — App Router Defaults

Copilot should:

- Use server components by default
- Use client components only when needed (`'use client'`)
- Use `generateStaticParams` for SSG
- Use `generateMetadata` for SEO

### 3.2 — Routing

Copilot should follow:

- `/app/[slug]/page.tsx` for dynamic routes
- `/app/(group)/page.tsx` for grouped layouts
- `/app/layout.tsx` for global providers

### 3.3 — Data Loading

Copilot should:

- Use file-based content loaders (`src/lib/content.ts`)
- Use async server functions for content retrieval
- Avoid client-side fetching unless interactive

---

## 4. Component Guidelines

### 4.1 — Structure

Components should include:

- A named function component
- Strongly typed props
- Tailwind for layout - do not use Tailwind for colors or typography
- Fluent UI theme tokens for color/typography
- Optional SCSS modules for complex styling
- Accessibility attributes

### 4.2 — File Organization

Each component should include:

- `ComponentName.tsx`
- `ComponentName.module.scss` (only if needed)
- `index.ts` for barrel exports

---

## 5. Layout System

TW.com uses a layout-driven architecture. Copilot should use or extend:

| Layout            | Purpose                                |
| ----------------- | -------------------------------------- |
| `RootLayout`      | Navigation, Footer, global wrappers    |
| `PageLayout`      | Standard page with max-width container |
| `ContentLayout`   | Long-form content (i.e., articles)     |
| `ArticleLayout`   | Blog posts with header/byline          |
| `PortfolioLayout` | Portfolio entries                      |
| `CaseStudyLayout` | In-depth case studies                  |

Layouts handle: structure, spacing, typography, navigation, metadata, and theming. Components should not duplicate layout responsibilities.

---

## 6. Content System

### 6.1 — File-Based Content

Copilot should:

- Use Markdown or MDX in `/public/{type}/{slug}/markdown/post.md`
- Parse frontmatter with `gray-matter`
- Generate SSG pages via `generateStaticParams`
- Use `src/lib/content.ts` for all content loading

### 6.2 — Supported Content Types

| Type              | Directory              |
| ----------------- | ---------------------- |
| Blog posts        | `public/blog/`         |
| Portfolio entries | `public/portfolio/`    |
| Case studies      | `public/case-studies/` |

All content follows the structure: `public/{type}/{slug}/markdown/post.md`

### 6.3 — Rendering

Copilot should:

- Use `next-mdx-remote/rsc` for server-side MDX rendering
- Use semantic HTML (`<article>`, `<section>`, `<header>`)
- Use accessible components with ARIA attributes

---

## 7. Theming

### 7.1 — Fluent UI Theme

Copilot should:

- Use the `FluentProvider` in `src/app/providers.tsx` which wraps `FluentThemeProvider`
- Use the custom TW.com brand theme from `src/theme/fluentTheme.ts`
- Use the `useAppTheme()` hook for theme management and switching
- Support all 8 theme variants for comprehensive accessibility:
  - `light`: Default light mode with deep navy brand
  - `dark`: Default dark mode with inverted palette
  - `high-contrast`: High contrast mode for visual accessibility
  - `protanopia`: Red-blind color mode (for users with red-color deficiency)
  - `deuteranopia`: Green-blind color mode (for users with green-color deficiency)
  - `tritanopia`: Blue-blind color mode (for users with blue-color deficiency)
  - `grayscale`: Grayscale light mode
  - `grayscale-dark`: Grayscale dark mode
- Use the extended theme system with:
  - `spacing`: Consistent rhythm system based on 1rem units
  - `animations`: Smooth easing functions and duration presets
  - `borderRadius`: Responsive container queries with clamp()
  - `zIndices`: Layering system for UI elements
  - `shadows`: Depth system for elevation
  - `gradients`: Subtle visual depth for light/dark modes
  - `breakpoints` & `mediaQueries`: Responsive design system
  - `typography`: Comprehensive font system with Roboto Flex and Proxima Nova
- Use Fluent UI theme tokens for colors and typography
- Avoid hardcoded color values
- Use the `ThemeSwitcher` component from `src/components/ThemeSwitcher` for theme selection UI

### 7.2 — Animations

Copilot should:

- Use Framer Motion for complex animations and transitions
- Use the theme's `animations` object for easing and duration values
- Follow animation best practices:
  - Use `initial`, `animate`, and `exit` props for enter/exit animations
  - Use `variants` for orchestrating complex animations
  - Use `layout` prop for layout animations
  - Respect user's motion preferences with `prefers-reduced-motion`

### 7.3 — Tailwind

Copilot should:

- Use Tailwind for layout, spacing, and responsive behavior
- Use `dark:` variants for dark mode support
- Use custom utilities defined in `tailwind.config`

### 7.4 — Page Transitions

TW.com uses a `PageTransition` component (at `src/components/PageTransition/`) for smooth fade-in/out transitions between all pages. This mirrors the Fluxline.pro approach.

**How it works:**

- `PageTransition` wraps all page content inside `RootLayout` (via `SiteLayout`)
- It uses Framer Motion's `AnimatePresence` with `mode='wait'` so the old page fully fades out before the new page fades in
- `key={pathname}` ensures the animation re-runs on every route change
- Initial page load also fades in from `opacity: 0`, giving every page (including the homepage) a consistent fade-in on first visit
- Respects `prefers-reduced-motion` via the `useReducedMotion` hook — sets duration to `0` when the user prefers reduced motion

**Usage pattern:**

```tsx
// Automatically applied via RootLayout — no manual wrapping needed per page
// src/layouts/RootLayout/RootLayout.tsx
<main id='main-content'>
  <PageTransition duration={300}>{children}</PageTransition>
</main>
```

**Key files:**

| File                                               | Purpose                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `src/components/PageTransition/PageTransition.tsx` | Framer Motion `AnimatePresence` + `motion.div` wrapper             |
| `src/hooks/useFadeInOut.ts`                        | Lower-level CSS-based fade hook (available for non-page use cases) |
| `src/hooks/useReducedMotion.ts`                    | Detects OS `prefers-reduced-motion` preference                     |

Copilot should:

- Never add manual fade animations to individual page components — `RootLayout` handles this globally
- Use `PageTransition` directly only when wrapping content outside of `RootLayout`
- Always respect `useReducedMotion` when building custom animations

### 7.5 — Accessibility Preferences

TW.com supports user-controlled accessibility preferences stored in `userPreferencesStore` and exposed via `useAppTheme()` hook.

#### Reduced Transparency

The `reducedTransparency` preference allows users to disable semi-transparent backgrounds and backdrop blur effects throughout the UI. This improves readability and helps users with visual sensitivities.

**How it works:**

- Preference stored in `src/store/userPreferencesStore.ts` as `reducedTransparency: boolean`
- Persisted to `localStorage` via Zustand middleware
- Accessed via `useAppTheme()` hook: `const { reducedTransparency, setReducedTransparency } = useAppTheme()`
- User toggle available in Settings panel under Accessibility section

**Implementation pattern:**

```tsx
'use client';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

function MyComponent() {
  const { reducedTransparency } = useAppTheme();

  return (
    <div
      className={
        reducedTransparency
          ? 'bg-slate-100 dark:bg-slate-800' // Opaque
          : 'backdrop-blur-md bg-slate-100/80 dark:bg-slate-800/80' // Transparent with blur
      }
    >
      {/* Content */}
    </div>
  );
}
```

**Affected components:**

- Navigation Header (`Header.tsx`) - Fixed background, button styles, modal backdrops
- Footers (`HomePageFooter.tsx`, `StandardFooter.tsx`, `FooterOverlay.tsx`) - Background transparency
- Modals (`Modal.tsx`) - Backdrop opacity
- Hero Cards (`HomePageClient.tsx`) - Card background opacity
- Image Carousel (`ImageCarousel.tsx`) - Navigation buttons and counter badge
- Video Components (`VideoCard.tsx`, `VideoListingClientWrapper.tsx`) - Hover overlays and duration badges
- About Page Sections (`AboutSectionWrapper.tsx`) - Section backgrounds

**Copilot rules:**

- **Always** check `reducedTransparency` when adding semi-transparent backgrounds (e.g., `bg-white/80`, `rgba()` with alpha < 1)
- **Always** make `backdrop-blur` effects conditional on `reducedTransparency` being false
- Provide opaque alternatives with appropriate opacity increase (e.g., 50% → 85%, 60% → 90%)
- Use `useAppTheme()` hook, **not** FluentUI's `useTheme()`, to access the preference
- Apply this preference comprehensively for UI consistency — all transparency effects should respect it

**iOS Safari compatibility note:**

Fixed-position elements with `backdrop-filter` and semi-transparent backgrounds can cause rendering issues on iOS Safari. Always provide opaque fallbacks or use the `reducedTransparency` pattern to ensure the Header and other fixed elements remain visible.

### 7.6 — Hydration Safety For Persisted Preferences

TW.com uses persisted Zustand preferences for theme mode, layout preference, reduced motion, reduced transparency, and other presentation-affecting settings. These preferences can cause full-page hydration mismatches if the client reads persisted values before hydration completes and renders different layout classes than the server.

This is especially important for:

- `layoutPreference` (`left-handed` vs `right-handed`) because it changes split-pane positioning, alignment, and motion direction
- `themeMode` because it changes gradients, theme tokens, and dark-mode class application
- `reducedMotion` because it changes Framer Motion output and transition timing
- Any persisted content/view preference that changes rendered markup or layout structure

**Required pattern:**

- Keep persisted stores that affect SSR-visible layout/theme output on `skipHydration: true`
- Rehydrate them centrally via `StoreHydrator` after mount
- Use deterministic SSR defaults until hydration completes
- Prefer `useAppTheme()` for render-time theme/layout/motion decisions instead of reading `useUserPreferencesStore()` directly in components
- Use `isHydrated` from `useAppTheme()` together with `defaultUserPreferences` to compute resolved values during hydration

**Implementation pattern:**

```tsx
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { defaultUserPreferences } from '@/store/userPreferencesStore';

function Example() {
  const { layoutPreference, isHydrated } = useAppTheme();

  const resolvedLayoutPreference = isHydrated
    ? layoutPreference
    : defaultUserPreferences.layoutPreference;

  const isLeftHanded = resolvedLayoutPreference === 'left-handed';

  return <div>{/* hydration-safe layout */}</div>;
}
```

**Copilot rules:**

- **Never** read persisted user preference values directly from `useUserPreferencesStore()` inside layout-critical render paths unless the component also handles hydration safely
- **Always** use deterministic fallback values for `layoutPreference`, `themeMode`, `reducedMotion`, and similar persisted preferences until hydration completes
- **Always** preserve the `defaultUserPreferences` export in `src/store/userPreferencesStore.ts` because it is the SSR fallback source of truth
- **Always** preserve `StoreHydrator` rehydration for `userPreferencesStore` and other persisted stores that use `skipHydration: true`
- **Do not** remove `suppressHydrationWarning` from shared layout wrappers such as `RootLayout`, `SiteLayout`, or split-pane `PageLayout` containers unless the entire server/client render path has been made deterministic without it
- When updating left-handed/right-handed layout logic, verify that the server render and the first client render both resolve to the same default before persisted preferences are applied
- When updating motion behavior, ensure `useReducedMotion` does not switch to a persisted user preference until hydration has completed

**Affected files and patterns:**

- `src/theme/hooks/useAppTheme.tsx` — exposes `isHydrated` and hydration-safe resolved preferences
- `src/store/userPreferencesStore.ts` — defines `defaultUserPreferences` and persisted user preferences
- `src/components/StoreHydrator/StoreHydrator.tsx` — performs one-time client rehydration
- `src/hooks/useFeatureImageLayout.ts` — must use hydration-safe left/right layout resolution
- `src/layouts/RootLayout/RootLayout.tsx` and `src/layouts/SiteLayout/SiteLayout.tsx` — shared wrappers for hydration-sensitive layout classes
- `src/layouts/PageLayout/StandardPageLayout.tsx` — split-pane layout path most sensitive to left-handed hydration mismatches

This rule exists because removing these safeguards has previously caused hydration failures across multiple routes such as `/services`, `/blog`, `/contact`, and other pages that use `PageLayout` with feature images.

---

## 8. Structured Data & JSON-LD Security

### 8.1 — JSON-LD Schema Usage

TW.com uses structured data (JSON-LD) for SEO and AI discoverability. Schema functions are centralized in `src/utils/structuredData.ts`.

**Available schemas:**

- `getPersonSchema()` — Person entity with stable `@id`
- `getOrganizationSchema()` — Fluxline Resonance Group
- `getWebSiteSchema()` — TW.com site identity
- `getAboutPageSchema()` — About page metadata
- `getBlogPostingSchema()` — Blog posts with author, dates, keywords
- `getFaqSchema()` — FAQ structured data for blog posts
- `getCaseStudySchema()` — Case study articles
- `getPortfolioSchema()` — Portfolio creative works
- `getServicesItemListSchema()` — Services listing

### 8.2 — Safe JSON-LD Injection

**Always use `safeJsonLd()` utility instead of raw `JSON.stringify()`**

The `safeJsonLd()` function in `src/utils/safeJsonLd.ts` prevents XSS vulnerabilities by escaping characters that could break out of script tags:

- `<` becomes `\u003c` (prevents `</script>` tag injection)
- `>` becomes `\u003e` (prevents `<script>` injection)
- `&` becomes `\u0026` (prevents HTML entity issues)

**Required pattern:**

```tsx
import Script from 'next/script';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getPersonSchema } from '@/utils/structuredData';

const personSchema = getPersonSchema('https://terencewaters.com/about');

<Script
  id='person-schema'
  type='application/ld+json'
  dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
/>;
```

**Copilot rules:**

- **Never** use raw `JSON.stringify()` with `dangerouslySetInnerHTML` for JSON-LD
- **Always** use `safeJsonLd()` for all schema injections
- This is critical because user-generated content (frontmatter, blog posts, FAQ answers) might contain `</script>` sequences

### 8.3 — Schema Entity Cross-Linking

All schemas use stable `@id` properties for entity resolution:

- Person: `https://terencewaters.com/#person`
- Organization: `https://fluxline.pro/#organization`
- WebSite: `https://terencewaters.com/#website`

This ensures proper cross-referencing across all pages (e.g., `Organization.founder` references the same Person entity).

---

## 9. Performance & Accessibility

Copilot must:

- Use semantic HTML
- Add ARIA attributes when needed (`aria-label`, `aria-current`, `role`)
- Avoid unnecessary client components
- Use `next/image` (`<Image />`) for all images
- Use lazy loading where appropriate
- Respect user accessibility preferences:
  - `prefers-reduced-motion` for animations (via `useReducedMotion` hook)
  - `reducedTransparency` for semi-transparent backgrounds and blur effects (via `useAppTheme` hook)
- Ensure all interactive elements have sufficient color contrast in all theme modes
- Test fixed-position elements on iOS Safari (backdrop filters can cause rendering issues)

---

## 10. Code Quality

Copilot should:

- Follow ESLint rules
- Follow Prettier formatting
- Avoid unused imports
- Use descriptive variable names
- Write self-documenting code

## 11. Package Management

Copilot should:

- Use **Yarn** as the default package manager for this project
- Run `yarn add <package>` to install dependencies
- Run `yarn remove <package>` to uninstall dependencies
- Run `yarn install` to install all dependencies
- Never use npm commands unless explicitly requested

---

## 12. When Copilot Should Ask for Clarification

Copilot should ask when:

- A feature's purpose is unclear
- A design intent is ambiguous
- A new pattern might conflict with existing architecture

---

## 13. When Copilot Should Proceed Without Asking

Copilot should proceed when:

- The pattern already exists
- The task is a direct extension of an existing feature
- The instructions are explicit

---

## 14. Example Prompts for TW.com

**Add a new blog post type**

> "Extend the blog loader to support a new metadata field and update the article layout."

**Add a new navigation item**

> "Update the navigation config and header component to include a new 'Podcasts' section."

**Create a portfolio card**

> "Create a reusable portfolio card component using Tailwind and Fluent UI theme tokens."

---

## 15. Azure Architecture

- Azure Static Web App fully runs in Azure
- `output: 'export'` in `next.config.ts` for static export
- Free tier on DEV, TEST, and PROD environments
- Configured via `staticwebapp.config.json` at the project root
- More infrastructure details will be added as the project evolves

---

## 16. Newsletter Subscribe / Unsubscribe

The newsletter system connects front-end forms to a SharePoint Online list via Microsoft Graph API Azure Functions.

### Architecture

- `api/subscribe/index.js` — adds an email entry to the SharePoint list
- `api/unsubscribe/index.js` — finds and deletes the matching entry from the SharePoint list
- Both functions authenticate via Entra ID client credentials (never expose credentials to the browser)
- SharePoint field names are configurable via environment variables to handle renamed built-in columns

### SharePoint field name mapping

SharePoint's built-in `Title` column is display-renamed to "Email" in the list UI, but its **internal API name remains `Title`**. Always set:

```
SHAREPOINT_EMAIL_FIELD=Title
```

If the platform or timestamp columns don't exist, leave the corresponding env var empty — the functions skip empty-string field names:

```
SHAREPOINT_PLATFORM_FIELD=   # leave empty to skip
SHAREPOINT_TIMESTAMP_FIELD=  # leave empty to skip
```

### CORS

Both functions use a `getCorsHeaders(origin)` function that validates the request `Origin` header against `/^https:\/\/((?:[a-zA-Z0-9-]+\.)?terencewaters\.com)$/`. Disallowed origins receive `Access-Control-Allow-Origin: null`.

Set `ALLOWED_ORIGIN_EXTRA` to permit one additional origin (e.g. `http://localhost:3000` for local dev, or an Azure SWA preview URL for staging).

### Front-end rate limiting

All newsletter forms (subscribe and unsubscribe) use the `useNewsletterRateLimit` hook at `src/hooks/useNewsletterRateLimit.ts`. It enforces a maximum of 3 submissions per rolling 1-hour window, tracked in `localStorage` under key `tw_newsletter_submissions`.

**Copilot rules:**

- Never bypass or remove the rate limit check in newsletter form `handleSubmit` handlers
- Always call `recordSubmit()` immediately before the API fetch, not after
- The submit button must be `disabled` when `!canSubmit`
- Display `timeUntilReset` in the error message so users know when they can try again
- The limit is intentionally shared across subscribe and unsubscribe (same `localStorage` key)

### Server-side rate limiting

The front-end hook is a courtesy, not a control — `localStorage` is trivially bypassed. Both functions independently enforce the same limit in `api/newsletterRateLimit.js`, keyed on the client IP from `x-forwarded-for` (falling back to `x-client-ip` / `x-real-ip`). Exceeding it returns **429** with a `Retry-After` header, and repeated violations are logged with a running count.

Overridable via `NEWSLETTER_RATE_LIMIT_WINDOW_MS` (default 1 h) and `NEWSLETTER_RATE_LIMIT_MAX_REQUESTS` (default 3).

The store is an in-memory `Map`, so the limit is per Function instance and resets on cold start. That is accepted for a newsletter form; a distributed store would be needed if this ever guarded something costly.

**Copilot rules:**

- Never remove the server-side check on the grounds that the front-end already limits submissions — they defend different threats
- Timeouts and upstream errors must not consume a token silently; the token is taken before validation, so a rejected request still counts

### NewsletterDrawer animation

The `NewsletterDrawer` uses Framer Motion `AnimatePresence` + `useSlideInOut` (direction: `'up'`) for a slide-up-from-bottom entrance and slide-down exit. The backdrop fades independently. Both respect `useReducedMotion` (duration collapses to `0`).

### Key files

| File                                                         | Role                                       |
| ------------------------------------------------------------ | ------------------------------------------ |
| `api/subscribe/index.js`                                     | Azure Function — subscribe                 |
| `api/unsubscribe/index.js`                                   | Azure Function — unsubscribe               |
| `api/httpClient.js`                                          | Shared fetch client — timeout + backoff    |
| `api/newsletterRateLimit.js`                                 | Server-side rate limiting (3/hour per IP)  |
| `src/hooks/useNewsletterRateLimit.ts`                        | Front-end rate limiting (3/hour, shared)   |
| `src/components/NewsletterDrawer/NewsletterDrawer.tsx`       | Slide-up drawer with subscribe form        |
| `src/components/NewsletterSignupCTA/NewsletterSignupCTA.tsx` | Inline subscribe CTA                       |
| `src/components/Footer/FooterContent.tsx`                    | `FooterNewsletterMini` compact form        |
| `src/app/unsubscribe/UnsubscribePageClient.tsx`              | Unsubscribe page form                      |
| `src/store/newsletterStore.ts`                               | Zustand store — dismissed/subscribed state |

---

## 17. Token-Based Access Control (DEV / TEST)

DEV and TEST deployments are protected by a token gate.
PROD is publicly accessible.

### How it works

1. `NEXT_PUBLIC_ENVIRONMENT` is set at **build time** in the GitHub Actions workflow (values: `dev`, `test`, `prod`).
2. The `AccessGate` component (wrapping the entire app in `src/app/providers.tsx`) checks this value.
3. On DEV/TEST, the gate prompts users for an access token.
4. The token is validated by the `/api/auth/validate-token` Azure Function, which reads `ACCESS_TOKEN` from Azure SWA Application Settings — never from the browser.
5. A validated token is stored in `localStorage` so return visits are seamless.

### Key files

| File                                                               | Role                                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `src/lib/environment.ts`                                           | Build-time environment detection (`getEnvironment`, `requiresAuthentication`) |
| `src/hooks/useAccessControl.ts`                                    | Token state management and API validation                                     |
| `src/components/AccessGate/AccessGate.tsx`                         | Full-screen token gate UI                                                     |
| `api/auth/validate-token/index.js`                                 | Server-side token validation Azure Function                                   |
| `.github/workflows/azure-static-web-apps-lively-mud-07cef801e.yml` | DEV deployment (sets `NEXT_PUBLIC_ENVIRONMENT: dev`)                          |
| `.github/workflows/azure-static-web-apps-test.yml`                 | TEST deployment (sets `NEXT_PUBLIC_ENVIRONMENT: test`)                        |
| `.github/workflows/azure-static-web-apps-prod.yml`                 | PROD deployment (sets `NEXT_PUBLIC_ENVIRONMENT: prod`)                        |

### Copilot rules

- Do **not** hardcode tokens or secrets anywhere in source code.
- Do **not** skip the `AccessGate` wrapper in `providers.tsx`.
- The `STORAGE_KEY` in `useAccessControl.ts` is `tw_access_token`.
- Full setup documentation is in `TOKEN_ACCESS_README.md`.

---

## 18. Prompt Logging

All AI-assisted development prompts should be logged in the `/prompts` folder for visibility. This project is primarily AI-driven with @Aplusandminus directing architecture and front-end build.

Create a new file per session or feature: `prompts/YYYY-MM-DD-topic.md`

---

## 19. Outbound HTTP from Azure Functions

Every outbound call from an Azure Function to a third party (Microsoft Graph, Entra ID, SMTP2Go, reCAPTCHA, Azure Queue Storage) goes through the shared client at `api/httpClient.js`. It wraps the global `fetch()` built into Node 18+, so it adds no dependency.

It exists because the hand-rolled `httpsRequest()` helpers it replaced set no timeout: a stalled upstream held the invocation open until the Functions host killed it, and a single transient 5xx surfaced to the caller as a hard failure.

### What it provides

- **Timeout** — 5 s per attempt by default, enforced with `AbortController` and covering the body read as well as the response headers.
- **Retry** — exponential backoff with jitter on 5xx responses and timeouts. 2 retries by default (3 attempts total). 4xx and 429 are **not** retried: a 4xx fails identically on a retry, and 429 carries a `Retry-After` that a blind backoff would ignore.
- **`HttpTimeoutError`** — carries `label` and `timeoutMs` for logging, plus `isTimeout` (so handlers can map to 504) and `isTransient` (so `api/leads/index.js`'s own retry loop treats it as retryable).

### API

```js
const { request, requestJson, isTimeoutError } = require('../httpClient');

// requestJson parses the body; returns {} for an empty or unparseable one.
const { statusCode, body } = await requestJson(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
  label: 'Graph list item create', // appears in timeout and retry logs
  log, // usually (msg) => context.log(msg)
});

// request returns the raw body as `text` — use it for 204s and non-JSON.
const { statusCode, text } = await request(url, { method: 'DELETE' });
```

### Environment overrides

| Variable                       | Default | Purpose                                     |
| ------------------------------ | ------- | ------------------------------------------- |
| `API_HTTP_TIMEOUT_MS`          | `5000`  | Per-attempt timeout                         |
| `API_HTTP_MAX_RETRIES`         | `2`     | Retries after the first attempt (`0` = off) |
| `API_HTTP_RETRY_BASE_DELAY_MS` | `500`   | First backoff delay; doubles per retry      |

### Copilot rules

- Never call `https.request()` or `require('https')` directly in a new Azure Function — use `request`/`requestJson`. (`api/podcasts` and `api/youtube` still do; they predate this client.)
- Always pass a `label` — it is what makes a timeout log identify the endpoint.
- Do not set a `Content-Length` header; `fetch` derives it from the body.
- Map `isTimeoutError(err)` to **504 Gateway Timeout**, not 500, so a slow upstream is distinguishable from a real failure.
- Pass `maxRetries: 0` when an outer layer already retries, so attempts don't multiply.
- **Never retry a non-idempotent write.** A timeout is exactly the case where the upstream most likely _did_ apply the write and was merely slow to say so, so a retry duplicates it — silently, since the caller still sees a success. The write POSTs (`subscribe`'s list-item create, `contact`'s SMTP2Go send, `leads`' list-item create) all pass `maxRetries: 0` and surface 504 instead. Retries are for reads, token calls, and deletes.
- A retryable DELETE must treat **404 as success** (see `unsubscribe`): a retry after a delete that actually landed sees 404, and calling that a failure reports 500 for completed work.
- Don't flatten a timeout into a domain-level failure result. `verifyRecaptcha` rethrows `HttpTimeoutError` rather than folding it into `{ success: false }`, so a Google outage reports 504 instead of telling the user their captcha failed.

---

## 20. Final Rule

Copilot should prioritize clarity, consistency, and the authorial voice of TW.com.
