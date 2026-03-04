# tw-com-nextjs

Next.js rewrite of TW.com
Personal website for Terence Waters — built with Next.js, Tailwind CSS, and Fluent UI.

## Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, static export)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Fluent UI](https://fluent2.microsoft.design/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Content**: File-based Markdown/MDX with [gray-matter](https://github.com/jonschlinkert/gray-matter)
- **Hosting**: [Azure Static Web Apps](https://azure.microsoft.com/en-us/products/app-service/static)
- **Package manager**: Yarn

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/          # Next.js App Router pages
  components/   # Reusable UI components
  layouts/      # Page layout wrappers
  hooks/        # Custom React hooks
  lib/          # Data loaders (content.ts)
  theme/        # Fluent UI extended theme + design tokens
  store/        # Zustand state stores
  content/      # TypeScript types for content models
  utils/        # Utility helpers
public/
  blog/           # Blog posts (Markdown/MDX in {slug}/markdown/post.md)
  portfolio/      # Portfolio entries
  case-studies/   # Case studies
  images/         # Static assets
docs/             # Developer documentation
prompts/        # AI prompt logs
api/            # Azure Functions (v2 model)
```

## Building

```bash
yarn build
```

Generates a fully static export in `out/`.

## Token-Based Access Control

DEV and TEST deployments of this site are protected by a token gate.
Visitors must enter a valid access token before the site content is shown.
PROD is publicly accessible with no token required.

See [TOKEN_ACCESS_README.md](./TOKEN_ACCESS_README.md) for full setup and configuration instructions.

## Documentation

- [Content Creation Guide](docs/CONTENT-CREATION-GUIDE.md)
- [Component Usage Guide](docs/COMPONENTS.md)
- [Semantic Colors](docs/SEMANTIC-COLORS.md)
- [Adobe Fonts Setup](docs/ADOBE-FONTS-SETUP.md)
- [reCAPTCHA Setup](docs/RECAPTCHA-SETUP.md)

## Contributing

This project is primarily AI-driven with [@Aplusandminus](https://github.com/Aplusandminus) directing architecture and front-end build. Prompt logs are stored in `/prompts`.
