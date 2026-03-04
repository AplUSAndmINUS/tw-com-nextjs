# reCAPTCHA Integration Guide

This document explains how to set up and configure Google reCAPTCHA v3 for spam protection on the TW.com contact form.

## Overview

The contact form uses **Google reCAPTCHA v3** to prevent spam submissions. reCAPTCHA v3 is invisible to users and uses a score-based system (0.0 to 1.0) to determine if a submission is likely from a human or a bot.

- **Score threshold**: 0.5 (configured in `api/contact/index.js`)
- **Client-side**: Token generated automatically on form submission
- **Server-side**: Token verified with Google's API before sending email

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **+** to create a new site
3. Configure:
   - **Label**: TW.com Contact Form
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**:
     - `terencewaters.com` (production)
     - `localhost` (local development)
     - Your Azure Static Web Apps domains (dev/test)
4. Accept the terms and submit
5. Copy the **Site Key** and **Secret Key**

### 2. Configure Environment Variables

#### Local Development

Create or update `.env.local`:

```bash
# reCAPTCHA Keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key-here
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

> **Note**: The `NEXT_PUBLIC_` prefix makes the site key available to the browser. The secret key is only used server-side in the Azure Function.

#### Azure Static Web Apps Configuration

Add the following environment variables to your Azure Static Web Apps **Application Settings**:

1. Go to the Azure Portal
2. Navigate to your Static Web App resource
3. Go to **Settings** → **Configuration**
4. Add the following application settings:

| Name                             | Value                     | Environment |
| -------------------------------- | ------------------------- | ----------- |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Your reCAPTCHA site key   | All         |
| `RECAPTCHA_SECRET_KEY`           | Your reCAPTCHA secret key | All         |

> **Important**: The site key must be set at **build time** for static export. Add it to the GitHub Actions workflow environment variables.

### 3. Update GitHub Actions Workflows

Add the reCAPTCHA site key to each deployment workflow (`.github/workflows/`):

```yaml
env:
  NEXT_PUBLIC_ENVIRONMENT: dev
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: ${{ secrets.RECAPTCHA_SITE_KEY }}
```

Then add the secret to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `RECAPTCHA_SITE_KEY`
4. Value: Your reCAPTCHA site key

## How It Works

### Client-Side (ContactForm.tsx)

1. User fills out the contact form
2. On submit, the form generates a reCAPTCHA token using `executeRecaptcha('contact_form_submit')`
3. Token is sent with the form data to `/api/contact`

### Server-Side (api/contact/index.js)

1. Azure Function receives the request
2. Extracts `recaptchaToken` from request body
3. Verifies token with Google's API (`https://www.google.com/recaptcha/api/siteverify`)
4. Checks if the score is ≥ 0.5
5. If verification passes, processes the email
6. If verification fails, returns a 400 error

## Graceful Degradation

The implementation includes graceful degradation:

- **Client**: If `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is not set, the provider renders children without reCAPTCHA (dev warning logged)
- **Server**: If `RECAPTCHA_SECRET_KEY` is not set, verification is skipped (warning logged)

This allows local development without reCAPTCHA if needed, but production should always have it configured.

## Testing

### Local Testing

1. Get test keys from the [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Add them to `.env.local`
3. Start the dev server: `yarn dev`
4. Start Azure Functions locally: `cd api && func start`
5. Test the contact form at `http://localhost:3000/contact`
6. Check the Azure Functions console for reCAPTCHA verification logs

### Production Testing

1. Deploy to your Azure Static Web App
2. Submit a test message through the contact form
3. Check Application Insights or Azure Function logs for verification status
4. Verify you receive the test email

## Troubleshooting

### "Failed to verify reCAPTCHA" Error

**Causes:**

- Site key or secret key incorrect
- Domain not whitelisted in reCAPTCHA admin
- Score below threshold (0.5)
- Network issues reaching Google's API

**Solutions:**

1. Verify keys are correct in environment variables
2. Check domain is whitelisted in reCAPTCHA admin console
3. Check Azure Function logs for specific error message
4. Try lowering `RECAPTCHA_MIN_SCORE` temporarily to test

### reCAPTCHA Badge Not Appearing

**Cause:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` not set or incorrect

**Solution:**

1. Verify the environment variable is set (check browser console for warning)
2. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
3. Check if the reCAPTCHA badge appears in bottom-right corner

### Score Too Low in Production

**Cause:** Legitimate users getting flagged as bots

**Solution:**

1. Review reCAPTCHA admin console analytics
2. Consider lowering `RECAPTCHA_MIN_SCORE` in `api/contact/index.js`
3. Default is 0.5 (recommended: 0.3 - 0.7)

## Security Best Practices

1. **Never commit secret keys** to version control
2. **Rotate keys periodically** (every 6-12 months)
3. **Monitor analytics** in reCAPTCHA admin console
4. **Set appropriate score threshold** (balance security vs. UX)
5. **Use different keys** for dev/test/prod if concerned about abuse
6. **Whitelist only necessary domains** in reCAPTCHA admin

## References

- [Google reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [react-google-recaptcha-v3 NPM Package](https://www.npmjs.com/package/react-google-recaptcha-v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)

## Files Modified

| File                                         | Purpose                                    |
| -------------------------------------------- | ------------------------------------------ |
| `src/components/ReCaptchaProvider/`          | Client-side reCAPTCHA provider wrapper     |
| `src/app/providers.tsx`                      | Added ReCaptchaProvider to app             |
| `src/components/ContactForm/ContactForm.tsx` | Generate and send reCAPTCHA token          |
| `api/contact/index.js`                       | Server-side token verification             |
| `.env.example`                               | Environment variable documentation         |
| `package.json`                               | Added react-google-recaptcha-v3 dependency |

---

**Last Updated**: March 4, 2026  
**Version**: 1.0.0
