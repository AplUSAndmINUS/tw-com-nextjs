# Guidelines for AI-Assisted Development in the TW.com Next.js System

## Purpose

These instructions define how GitHub Copilot should assist in building and maintaining the TW.com codebase. The goal is to ensure consistency, architectural integrity, and a clean developer experience while preserving the site's identity as a personal, author-driven platform.

TW.com uses:

- Next.js App Router
- Static Site Generation (SSG)
- A custom Design System (DSM) with 25 `Tw*` components in `src/components/dsm/`
- CSS custom properties (`--tw-*`) token system for colors, spacing, typography, and effects
- SCSS Modules for component-scoped styling (no Tailwind CSS)
- CSS-based animations via DSM components (`TwReveal`, `TwParallax`) and Framer Motion for legacy transitions
- Yarn as the package manager
- A file-based content system (Markdown/MDX)
- 8 theme modes: dark (default), light, high-contrast, protanopia, deuteranopia, tritanopia, grayscale, grayscale-dark

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
- SCSS Modules with CSS custom property tokens (`--tw-*`) for all styling
- DSM components (`TwButton`, `TwCard`, `TwReveal`, etc.) for common patterns
- Accessibility attributes

Do **not** use Tailwind CSS classes — Tailwind has been fully removed from the project.

### 4.2 — File Organization

Each component should include:

- `ComponentName.tsx`
- `ComponentName.module.scss` (only if needed)
- `index.ts` for barrel exports

### 4.3 — DSM Components

The design system lives in `src/components/dsm/` and is the preferred building block for all new UI. Import from the barrel:

```tsx
import { TwButton, TwCard, TwReveal, TwSectionHeading } from '@/components/dsm';
```

Key components:

| Component           | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `TwButton`          | Primary, outline, and quiet button variants     |
| `TwCard`            | Surface card with interactive hover states      |
| `TwArticleCard`     | Blog/portfolio card with shimmer image loading  |
| `TwHero`            | Full-bleed hero with background image           |
| `TwPageNav`         | Sticky page navigation bar                      |
| `TwReveal`          | Scroll-triggered fade-in animation              |
| `TwParallax`        | Scroll-driven parallax transform                |
| `TwSectionHeading`  | Section title + lede pair                       |
| `TwListingView`     | Grid listing with filter chips and pagination   |
| `TwAppearancePanel` | Theme/display settings panel                    |
| `TwCTABand`         | Full-width call-to-action banner                |
| `TwChip`            | Tag/label chip (teal, default variants)         |
| `TwDrawer`          | Slide-over panel                                |
| `TwFilterChips`     | Tag filter bar for listings                     |
| `TwRailLayout`      | Numbered image-rail section layout              |
| `TwStatCard`        | Stat display card (value + label)               |

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

### 7.1 — Design System Tokens

TW.com uses a CSS custom property token system defined in `src/styles/tokens/`:

| Token file         | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `colors.css`       | Base palette and semantic color tokens (`--tw-*`)    |
| `colors-modes.css` | Theme-mode overrides via `[data-theme]` selectors    |
| `spacing.css`      | Spacing scale (`--tw-space-*`)                       |
| `typography.css`   | Font families, sizes, weights (`--tw-font-*`, etc.)  |
| `effects.css`      | Shadows, radius, motion, grain (`--tw-shadow-*`, etc.) |
| `a11y-layers.css`  | Orthogonal a11y overlays for contrast and CVD modes  |

Copilot should:

- Use `--tw-*` CSS custom properties for all colors, spacing, and typography
- Support all 8 theme modes via `[data-theme="<mode>"]` on `<html>`:
  - `dark` (default), `light`, `high-contrast`, `protanopia`, `deuteranopia`, `tritanopia`, `grayscale`, `grayscale-dark`
- Use the orthogonal a11y layers: `[data-tw-contrast='high']` and `[data-tw-cvd='on']`
- Use `TwAppearancePanel` for theme selection UI (replaces legacy ThemeSwitcher)
- Avoid hardcoded color values — always use token variables
- Use the `useAppTheme()` hook for programmatic theme management in legacy components

### 7.2 — Animations

New components should use the DSM animation primitives:

- `TwReveal` — IntersectionObserver-based scroll reveal with `up` and `left` variants
- `TwParallax` — rAF-based scroll parallax using `transform` only (compositor-friendly)
- CSS transitions via `--tw-motion-ease` and `--tw-motion-duration` tokens
- `@include motion-safe-only` SCSS mixin to respect `prefers-reduced-motion`

Framer Motion is still used by legacy components (PageTransition, NewsletterDrawer) but should not be introduced into new code.

### 7.3 — SCSS Modules & Mixins

Copilot should:

- Use SCSS Modules (`.module.scss`) for component-scoped styling
- Import shared abstracts via `@use 'abstracts' as *`
- Use provided SCSS mixins: `until($breakpoint)`, `focus-ring`, `card-interactive`, `motion-safe-only`
- Use CSS custom properties for all dynamic values — never hardcode colors or spacing

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
import styles from './MyComponent.module.scss';

function MyComponent() {
  const { reducedTransparency } = useAppTheme();

  return (
    <div className={reducedTransparency ? styles.opaque : styles.transparent}>
      {/* Content */}
    </div>
  );
}
```

```scss
// MyComponent.module.scss
.transparent {
  background: rgba(var(--tw-surface-rgb), 0.8);
  backdrop-filter: blur(12px);
}
.opaque {
  background: var(--tw-surface);
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

> "Create a reusable portfolio card component using DSM tokens and SCSS modules."

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

### Running the API tests

`cd api && yarn test` (or `npm test`) runs the suite on Node's built-in test runner — no test framework is installed.

The script **lists its test files explicitly**. That is deliberate, and both obvious alternatives are wrong here:

- bare `node --test` also matches anything under a `test/` directory, which picks up `api/test/index.js` — a deployed HTTP-triggered Function, not a test — and runs it as a vacuously passing test file;
- `node --test "**/*.test.js"` relies on glob expansion of positional args, which Node only added in **21**. The Functions runtime is Node 18/20 (see `engines`), so on a matching local Node that silently finds zero tests.

**When adding a test file, add it to the `test` script in `api/package.json`** — it will not be picked up automatically.

### Copilot rules

- Never call `https.request()` or `require('https')` directly in a new Azure Function — use `request`/`requestJson`. (`api/podcasts` and `api/youtube` still do; they predate this client.)
- Always pass a `label` — it is what makes a timeout log identify the endpoint.
- Do not set a `Content-Length` header; `fetch` derives it from the body.
- Map `isTimeoutError(err)` to **504 Gateway Timeout**, not 500, so a slow upstream is distinguishable from a real failure.
- Pass `maxRetries: 0` when an outer layer already retries, so attempts don't multiply.
- **Never retry a non-idempotent write.** A timeout is exactly the case where the upstream most likely _did_ apply the write and was merely slow to say so, so a retry duplicates it — silently, since the caller still sees a success. Every write on this path passes `maxRetries: 0` and surfaces 504 instead: `subscribe`'s and `leads`' list-item creates, `contact`'s SMTP2Go send, and `leads`' queue enqueue. Retries are for reads, token calls, and deletes.
- "Write" includes **spending a single-use resource**, not just creating a row. `contact`'s reCAPTCHA verify passes `maxRetries: 0` because the token is one-shot: retrying a token Google already consumed returns `timeout-or-duplicate`, which would surface as the user's captcha failing rather than the upstream timeout it really is.
- A retryable DELETE must treat **404 as success** (see `unsubscribe`): a retry after a delete that actually landed sees 404, and calling that a failure reports 500 for completed work.
- Don't flatten a timeout into a domain-level failure result. `verifyRecaptcha` rethrows `HttpTimeoutError` rather than folding it into `{ success: false }`, so a Google outage reports 504 instead of telling the user their captcha failed.

---

## 20. Final Rule

Copilot should prioritize clarity, consistency, and the authorial voice of TW.com.
