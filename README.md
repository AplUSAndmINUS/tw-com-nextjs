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

### Local Setup

#### Frontend Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. For local development, only `NEXT_PUBLIC_ENVIRONMENT` is required:
   - `NEXT_PUBLIC_ENVIRONMENT=dev` (enables token gate)
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key` (optional, for reCAPTCHA)

#### Azure Functions Configuration

1. Copy `api/local.sample.settings.json` to `api/local.settings.json`:

   ```bash
   cp api/local.sample.settings.json api/local.settings.json
   ```

2. Fill in your server-side secrets:
   - `ACCESS_TOKEN` — Token for DEV/TEST gate
   - `ENVIRONMENT` — Should match `NEXT_PUBLIC_ENVIRONMENT`
   - `RECAPTCHA_SECRET_KEY` — reCAPTCHA secret (server-side)
   - `SMTP2GO_API_KEY` — Email service API key
   - `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` — Contact form emails
   - `YOUTUBE_API_KEY` — YouTube API key (if needed)
   - `ENTRAID_TENANT_ID` — Entra ID tenant ID (for newsletter SharePoint integration)
   - `ENTRAID_SP_APP_REGISTRATION_CLIENT_ID` — Entra ID App Registration client ID
   - `ENTRAID_SP_APP_REGISTRATION_CLIENT_SECRET` — Entra ID App Registration client secret
   - `SHAREPOINT_SITE_ID` — SharePoint site ID for the newsletter list
   - `SHAREPOINT_LIST_ID` — SharePoint list ID for the Email Distribution List
   - `SHAREPOINT_EMAIL_FIELD` — Internal field name for the email column (default: `Title` - Change in local.settings.json if different)
   - `SHAREPOINT_PLATFORM_FIELD` — Internal field name for the lead platform column (leave empty to skip)
   - `SHAREPOINT_TIMESTAMP_FIELD` — Internal field name for the timestamp column (leave empty to skip)
   - `ALLOWED_ORIGIN_EXTRA` — One additional CORS-allowed origin, e.g. `http://localhost:3000` for local dev or an Azure SWA preview URL

3. Start Azure Functions:
   ```bash
   cd api && func start
   ```

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

## Newsletter Subscribe / Unsubscribe

The `/api/subscribe` and `/api/unsubscribe` Azure Functions handle newsletter signup and removal for the "A+ in FLUX- Mythmaker Drop" mailing list.

### How it works

1. Both functions authenticate against Microsoft Entra ID using client credentials to obtain a Graph API access token.
2. Subscribers are written to / deleted from a SharePoint Online list via the Microsoft Graph API.
3. The SharePoint **Email** column is a display-renamed `Title` built-in — set `SHAREPOINT_EMAIL_FIELD=Title` in application settings.
4. Platform and timestamp columns are optional; leave `SHAREPOINT_PLATFORM_FIELD` or `SHAREPOINT_TIMESTAMP_FIELD` empty to skip those fields.
5. **CORS** is restricted to `terencewaters.com` and its subdomains. Set `ALLOWED_ORIGIN_EXTRA` to permit one additional origin (e.g. `http://localhost:3000` locally or an Azure SWA preview URL).
6. **Front-end rate limiting** is enforced via the `useNewsletterRateLimit` hook: max 3 submissions per rolling 1-hour window, tracked in `localStorage` under key `tw_newsletter_submissions`. This limit is shared across subscribe and unsubscribe forms.

### Key files

| File                                                         | Role                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| `api/subscribe/index.js`                                     | Azure Function — adds email to SharePoint list                |
| `api/unsubscribe/index.js`                                   | Azure Function — finds and deletes email from SharePoint list |
| `src/hooks/useNewsletterRateLimit.ts`                        | Front-end rate limiting hook (3 attempts / 1 hour)            |
| `src/components/NewsletterDrawer/NewsletterDrawer.tsx`       | Slide-up drawer (Framer Motion) with subscribe form           |
| `src/components/NewsletterSignupCTA/NewsletterSignupCTA.tsx` | Inline subscribe CTA (used on /about and /contact)            |
| `src/components/Footer/FooterContent.tsx`                    | Compact footer subscribe form (`FooterNewsletterMini`)        |
| `src/app/unsubscribe/UnsubscribePageClient.tsx`              | Unsubscribe page form                                         |
| `src/store/newsletterStore.ts`                               | Zustand store — persists dismissed/subscribed state           |

---

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
