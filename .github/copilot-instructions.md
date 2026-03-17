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

---

## 8. Performance & Accessibility

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

## 9. Code Quality

Copilot should:

- Follow ESLint rules
- Follow Prettier formatting
- Avoid unused imports
- Use descriptive variable names
- Write self-documenting code

## 10. Package Management

Copilot should:

- Use **Yarn** as the default package manager for this project
- Run `yarn add <package>` to install dependencies
- Run `yarn remove <package>` to uninstall dependencies
- Run `yarn install` to install all dependencies
- Never use npm commands unless explicitly requested

---

## 11. When Copilot Should Ask for Clarification

Copilot should ask when:

- A feature's purpose is unclear
- A design intent is ambiguous
- A new pattern might conflict with existing architecture

---

## 12. When Copilot Should Proceed Without Asking

Copilot should proceed when:

- The pattern already exists
- The task is a direct extension of an existing feature
- The instructions are explicit

---

## 13. Example Prompts for TW.com

**Add a new blog post type**

> "Extend the blog loader to support a new metadata field and update the article layout."

**Add a new navigation item**

> "Update the navigation config and header component to include a new 'Podcasts' section."

**Create a portfolio card**

> "Create a reusable portfolio card component using Tailwind and Fluent UI theme tokens."

---

## 14. Azure Architecture

- Azure Static Web App fully runs in Azure
- `output: 'export'` in `next.config.ts` for static export
- Free tier on DEV, TEST, and PROD environments
- Configured via `staticwebapp.config.json` at the project root
- More infrastructure details will be added as the project evolves

---

## 15. Newsletter Subscribe / Unsubscribe

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

### NewsletterDrawer animation

The `NewsletterDrawer` uses Framer Motion `AnimatePresence` + `useSlideInOut` (direction: `'up'`) for a slide-up-from-bottom entrance and slide-down exit. The backdrop fades independently. Both respect `useReducedMotion` (duration collapses to `0`).

### Key files

| File                                                         | Role                                       |
| ------------------------------------------------------------ | ------------------------------------------ |
| `api/subscribe/index.js`                                     | Azure Function — subscribe                 |
| `api/unsubscribe/index.js`                                   | Azure Function — unsubscribe               |
| `src/hooks/useNewsletterRateLimit.ts`                        | Front-end rate limiting (3/hour, shared)   |
| `src/components/NewsletterDrawer/NewsletterDrawer.tsx`       | Slide-up drawer with subscribe form        |
| `src/components/NewsletterSignupCTA/NewsletterSignupCTA.tsx` | Inline subscribe CTA                       |
| `src/components/Footer/FooterContent.tsx`                    | `FooterNewsletterMini` compact form        |
| `src/app/unsubscribe/UnsubscribePageClient.tsx`              | Unsubscribe page form                      |
| `src/store/newsletterStore.ts`                               | Zustand store — dismissed/subscribed state |

---

## 16. Token-Based Access Control (DEV / TEST)

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

## 17. Prompt Logging

All AI-assisted development prompts should be logged in the `/prompts` folder for visibility. This project is primarily AI-driven with @Aplusandminus directing architecture and front-end build.

Create a new file per session or feature: `prompts/YYYY-MM-DD-topic.md`

---

## 18. Final Rule

Copilot should prioritize clarity, consistency, and the authorial voice of TW.com.
