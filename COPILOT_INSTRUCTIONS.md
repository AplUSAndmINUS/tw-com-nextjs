# Copilot Instructions for tw-com-nextjs

## Project Overview
This is TerenceWaters.com rebuilt as a Next.js 15 App Router static site, mirroring the structure of Fluxline.pro's Next.js website but keeping TerenceWaters.com's theming.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Fluent UI (@fluentui/react-components)
- MDX/Markdown for content
- gray-matter for frontmatter
- next-mdx-remote for MDX rendering
- Azure Static Web Apps (output: export)

## Architecture Decisions
- `output: 'export'` for Azure SWA static hosting
- Server Components by default (no `use client` unless necessary)
- Content loaded from `/content` directory at build time
- `@/*` path alias maps to `./src/*`
- TypeScript strict mode enabled

## Directory Structure
- `src/app/` — Next.js App Router pages
- `src/components/` — Reusable UI components
- `src/layouts/` — Page layout wrappers
- `src/theme/` — Fluent UI theme configuration
- `src/hooks/` — Custom React hooks
- `src/utils/` — Utility functions
- `src/lib/` — Core library code (content loading)
- `src/content/` — TypeScript type definitions for content
- `content/` — Markdown/MDX content files
- `prompts/` — AI prompt logs

## Content Structure
All content lives in `/content/{type}/{slug}.md` or `.mdx`.
Content types: blog, essays, portfolio, case-studies.

## Theming
Fluent UI is configured with a custom TerenceWaters.com brand palette (deep navy blue).
Theme is defined in `src/theme/fluentTheme.ts`.

## Coding Conventions
- Use server components by default
- Export named components (not default exports for components)
- Use TypeScript interfaces for props
- Layouts wrap RootLayout which includes Navigation and Footer
- All content reading uses `src/lib/content.ts`
