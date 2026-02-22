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
- Tailwind for layout
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
| `ContentLayout`   | Long-form content (i.e., articles)   |
| `ArticleLayout`   | Blog posts with header/byline          |
| `PortfolioLayout` | Portfolio entries                      |
| `CaseStudyLayout` | In-depth case studies                  |

Layouts handle: structure, spacing, typography, navigation, metadata, and theming. Components should not duplicate layout responsibilities.

---

## 6. Content System

### 6.1 — File-Based Content

Copilot should:

- Use Markdown or MDX in `/content/{type}/{slug}.md`
- Parse frontmatter with `gray-matter`
- Generate SSG pages via `generateStaticParams`
- Use `src/lib/content.ts` for all content loading

### 6.2 — Supported Content Types

| Type              | Directory               |
| ----------------- | ----------------------- |
| Blog posts        | `content/blog/`         |
| Portfolio entries | `content/portfolio/`    |
| Case studies      | `content/case-studies/` |

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

---

## 8. Performance & Accessibility

Copilot must:

- Use semantic HTML
- Add ARIA attributes when needed (`aria-label`, `aria-current`, `role`)
- Avoid unnecessary client components
- Use `next/image` (`<Image />`) for all images
- Use lazy loading where appropriate

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

## 15. Prompt Logging

All AI-assisted development prompts should be logged in the `/prompts` folder for visibility. This project is primarily AI-driven with @Aplusandminus directing architecture and front-end build.

Create a new file per session or feature: `prompts/YYYY-MM-DD-topic.md`

---

## 16. Final Rule

Copilot should prioritize clarity, consistency, and the authorial voice of TW.com.
