# Token-Based Access Control

This document describes the token-based access control system used to lock down DEV and TEST deployments of TW.com while keeping PROD publicly accessible.

## Overview

- ✅ Runs entirely within Azure Static Web Apps (no additional infrastructure needed)
- ✅ Uses an Azure Function for **server-side** token validation
- ✅ Tokens are stored **only** in Azure Static Web Apps environment variables — never in source code
- ✅ Compatible with Next.js `output: 'export'` (static export / SSG)
- ✅ Persists authentication in browser `localStorage` so users are not prompted repeatedly
- ✅ Integrated with the existing Fluent UI extended theme and design system

---

## Architecture

### Components

| File                                       | Purpose                                  |
| ------------------------------------------ | ---------------------------------------- |
| `api/validate-token/function.json`         | Azure Function binding configuration     |
| `api/validate-token/index.js`              | Server-side token validation logic       |
| `src/lib/environment.ts`                   | Build-time environment detection utility |
| `src/hooks/useAccessControl.ts`            | Client-side token state management hook  |
| `src/components/AccessGate/AccessGate.tsx` | Full-screen token gate UI component      |
| `src/app/providers.tsx`                    | Wraps the app with `<AccessGate>`        |

### Flow

```
1. User visits the site
      ↓
2. AccessGate checks environment (baked in at build time)
      ↓
3a. PROD → render site immediately
3b. DEV / TEST → check localStorage for a stored token
      ↓
4. If no valid token → show token input form
      ↓
5. User enters token → POST /api/auth/validate-token
      ↓
6. Valid   → store token in localStorage & render site
   Invalid → show error, prompt re-entry
```

---

## Environment Variables

### Build-time (Next.js)

Set in the GitHub Actions workflow — **baked into the static export**.

| Variable                  | Values                    | Purpose                                               |
| ------------------------- | ------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_ENVIRONMENT` | `dev` \| `test` \| `prod` | Tells the frontend which environment it is running in |

### Runtime (Azure Function)

Set as **Application Settings** in the Azure Static Web Apps portal.  
These values are **never** exposed to the browser.

| Variable       | Values                    | Purpose                                                      |
| -------------- | ------------------------- | ------------------------------------------------------------ |
| `ACCESS_TOKEN` | any secure string         | The token users must enter to access the site                |
| `ENVIRONMENT`  | `dev` \| `test` \| `prod` | Tells the Azure Function whether to enforce token validation |

---

## Azure Static Web Apps Configuration

### Setting environment variables in the Azure Portal

1. Open the Azure Portal → navigate to your Static Web App
2. Go to **Settings → Configuration**
3. Under **Application settings**, click **+ Add** and set:

**DEV environment:**

```
ENVIRONMENT = dev
ACCESS_TOKEN = <your-dev-token>
```

**TEST environment:**

```
ENVIRONMENT = test
ACCESS_TOKEN = <your-test-token>
```

**PROD environment:**

```
ENVIRONMENT = prod
```

_(No `ACCESS_TOKEN` needed — PROD is publicly accessible.)_

### Setting variables with Azure CLI

```bash
# DEV
az staticwebapp appsettings set \
  --name <your-dev-swa-name> \
  --setting-names ENVIRONMENT="dev" ACCESS_TOKEN="<dev-token>"

# TEST
az staticwebapp appsettings set \
  --name <your-test-swa-name> \
  --setting-names ENVIRONMENT="test" ACCESS_TOKEN="<test-token>"

# PROD
az staticwebapp appsettings set \
  --name <your-prod-swa-name> \
  --setting-names ENVIRONMENT="prod"
```

---

## GitHub Actions Workflows

Each branch maps to an environment via the `NEXT_PUBLIC_ENVIRONMENT` variable
passed to the build step:

| Branch    | Workflow file                    | Environment |
| --------- | -------------------------------- | ----------- |
| `develop` | `azure-static-web-apps-dev.yml`  | `dev`       |
| `test`    | `azure-static-web-apps-test.yml` | `test`      |
| `master`  | `azure-static-web-apps-prod.yml` | `prod`      |

---

## Generating Secure Tokens

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

**Best practices:**

- Use different tokens for DEV and TEST
- Tokens should be at least 32 characters
- Store tokens in Azure Key Vault for additional security
- Rotate tokens periodically
- Never commit tokens to source control

---

## Local Development

### Testing the token gate locally

1. Create `.env.local` (gitignored):

```bash
NEXT_PUBLIC_ENVIRONMENT=dev
```

2. Start the dev server:

```bash
yarn dev
```

The `AccessGate` component will appear, but API calls to `/api/auth/validate-token`
won't work without the Azure Functions runtime.

### Testing API validation locally

1. Install [Azure Functions Core Tools](https://docs.microsoft.com/azure/azure-functions/functions-run-local)
2. Create `api/local.settings.json` (gitignored):

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "ACCESS_TOKEN": "test-token-12345",
    "ENVIRONMENT": "dev"
  }
}
```

3. Start the Functions runtime from the `api` directory:

```bash
cd api && func start
```

The API will be available at `http://localhost:7071/api/auth/validate-token`.

---

## API Reference

### `POST /api/auth/validate-token`

**Request:**

```json
{ "token": "user-submitted-token" }
```

**Success (200):**

```json
{
  "valid": true,
  "environment": "dev",
  "message": "Token validated successfully"
}
```

**Invalid token (401):**

```json
{ "valid": false, "environment": "dev", "error": "Invalid token" }
```

**Missing token (400):**

```json
{ "valid": false, "environment": "dev", "error": "Token is required" }
```

**Missing server config (500):**

```json
{ "valid": false, "environment": "dev", "error": "Server configuration error" }
```

**Production environment (200):**

```json
{
  "valid": true,
  "environment": "prod",
  "message": "Production environment - no token required"
}
```

---

## Troubleshooting

| Symptom                            | Solution                                                      |
| ---------------------------------- | ------------------------------------------------------------- |
| Token gate appears on PROD         | Verify `NEXT_PUBLIC_ENVIRONMENT=prod` in the PROD workflow    |
| "Server configuration error"       | Set `ACCESS_TOKEN` in Azure SWA Application Settings          |
| Token validation always fails      | Verify the token matches `ACCESS_TOKEN` in Azure SWA settings |
| API returns 404                    | Confirm the `api/auth/validate-token/` function is deployed   |
| Token accepted but gate re-appears | User may have cleared `localStorage`; re-enter the token      |

---

## Security Considerations

- ✅ Tokens validated server-side (Azure Function) — token never verified in client code
- ✅ No tokens in source code
- ✅ HTTPS enforced by Azure Static Web Apps
- ✅ Environment-specific tokens
- ⚠️ Validated token is stored in `localStorage` (client-accessible)
- ⚠️ No rate limiting on the validation endpoint
- ⚠️ No token expiration

For higher security, consider adding Azure API Management for rate limiting,
or replacing this system with Azure Active Directory authentication.

---

_Last updated: March 2026_
