# Instagram grid: setup guide

How to connect the **On Instagram** section of `/about-me` to your real
Instagram account, in plain terms. It covers what to set up, where each
setting goes in Azure, how to check it works, and what to do when it
doesn't.

> **Right now nothing is connected.** Until you finish the steps below, the
> section shows its heading, the line _"The feed can't be shown right now. The
> latest posts are on Instagram."_, and the _Follow @aplusinflux on Instagram_
> link. Nothing is broken while you set it up.

---

## Contents

1. [How it works, in one picture](#how-it-works-in-one-picture)
2. [Before you start](#before-you-start)
3. [Step 1: Make your Instagram a professional account](#step-1-make-your-instagram-a-professional-account)
4. [Step 2: Connect Instagram to NoCodeAPI](#step-2-connect-instagram-to-nocodeapi)
5. [Step 3: Add the link to Azure (DEV first)](#step-3-add-the-link-to-azure-dev-first)
6. [Step 4: Check that it works](#step-4-check-that-it-works)
7. [Step 5: Repeat for TEST and PROD](#step-5-repeat-for-test-and-prod)
8. [All the settings, in one table](#all-the-settings-in-one-table)
9. [Optional: test mode with placeholder pictures](#optional-test-mode-with-placeholder-pictures)
10. [Running it on your own computer](#running-it-on-your-own-computer)
11. [Troubleshooting](#troubleshooting)
12. [Keeping it safe](#keeping-it-safe)
13. [Things that are changed in code, not settings](#things-that-are-changed-in-code-not-settings)
14. [Glossary](#glossary)

---

## How it works, in one picture

```
 Visitor's browser                 Your Azure site                    Outside services
 ─────────────────                 ───────────────                    ────────────────
 /about-me page  ──asks for──▶  /api/instagram   ──asks for──▶  NoCodeAPI  ──▶  Instagram
 (shows 12 tiles)   16 posts    (a small program     your posts   (holds your
                                 that runs in Azure;              Instagram login)
                                 keeps your secret
                                 link private)
```

- The **page** never talks to Instagram directly. It asks your own site's
  `/api/instagram` address.
- **`/api/instagram`** is a small server program (an _Azure Function_) that
  runs inside your Azure Static Web App. It holds the one secret this feature
  needs, your NoCodeAPI link, and passes back only the post details the grid
  uses.
- **NoCodeAPI** is the service that is logged in to your Instagram and reads
  your latest posts.
- The grid asks for **16** posts and shows the **12** newest that work. The
  other 4 are spares that fill in if a post can't be shown.

---

## Before you start

You'll need:

- [ ] Access to the **Instagram app** for @aplusinflux
- [ ] A **NoCodeAPI** account ([nocodeapi.com](https://nocodeapi.com))
- [ ] Access to the **Azure portal** with rights to change settings on the
      site's Static Web Apps (DEV, TEST and PROD are separate apps, each with
      its own settings)
- [ ] About 20 minutes

You do **not** need to change any code, and you do **not** need to redeploy
the site to connect the feed.

---

## Step 1: Make your Instagram a professional account

Instagram only lets outside services read posts from **professional**
accounts (Business or Creator). The old option for personal accounts (the
"Instagram Basic Display API") was switched off by Meta on 4 December 2024.

1. Open the Instagram app and go to your profile.
2. Open **Settings**, then **Account type and tools** (the wording moves around
   between app versions).
3. If it offers **Switch to professional account**, choose **Creator** (or
   **Business**) and follow the prompts. If it says you're already
   professional, you're done.

Switching is free and doesn't change your posts or followers.

---

## Step 2: Connect Instagram to NoCodeAPI

NoCodeAPI gives you one private web address (a link) that returns your
latest posts.

1. Sign in at [nocodeapi.com](https://nocodeapi.com).
2. Find **Instagram** in its marketplace and add (activate) it.
3. Create a new Instagram API and **log in with Instagram** when asked, using
   the @aplusinflux account from Step 1.
4. When it's done, NoCodeAPI shows an **API endpoint**: a link that looks like
   `https://v1.nocodeapi.com/<your-name>/instagram/<a-long-code>`
5. **Copy that link.** You'll paste it into Azure in Step 3.

> NoCodeAPI's screens change from time to time, so the button names above may
> differ slightly. The thing you need at the end is that one endpoint link.

**Treat this link like a password.** The long code at the end is what lets
anyone read your account's posts through NoCodeAPI. Don't email it, commit it
to GitHub, or paste it anywhere but Azure. See [Keeping it safe](#keeping-it-safe).

**Optional quick check:** open the link in your browser. You should see text
with `"data"` followed by a list of your posts (captions, links and image
addresses). That's what the site will use.

---

## Step 3: Add the link to Azure (DEV first)

The link goes into your Static Web App's settings, where the `/api/instagram`
program can read it but visitors can't see it.

### In the Azure portal

1. Go to [portal.azure.com](https://portal.azure.com) and open the **DEV**
   Static Web App.
2. In the left menu, open **Settings** and then **Environment variables**. (Older
   versions of the portal call this **Configuration**, then **Application
   settings**. Same place.)
3. Click **+ Add** and enter:

   | Name                 | Value                                   |
   | -------------------- | --------------------------------------- |
   | `INSTAGRAM_FEED_URL` | the NoCodeAPI link you copied in Step 2 |

4. Click **Apply** (or **Save**) and confirm.

Type the name exactly as shown, in capitals with underscores. The value must
start with `https://`.

**No redeploy needed for this setting.** It is a server setting, and the
`/api/instagram` program normally picks it up on its own within a few minutes.

**Then turn the section back on.** Since 2026-11-19 (#321) the /about-me
"Off the page" section is hidden by `INSTAGRAM_FEED_ENABLED` in
`src/lib/instagram.ts`, which is fixed at build time. Set it to `true` and
ship that change through develop → test → prod; until then the page shows no
feed even with the setting above in place. If Step 4 still
says "not configured" after about 10 minutes, redeploy that environment once
to be sure it's loaded.

### Or with the Azure command line

If you prefer the terminal (replace the name and the link):

```bash
az staticwebapp appsettings set \
  --name <your-dev-swa-name> \
  --setting-names INSTAGRAM_FEED_URL="https://v1.nocodeapi.com/<your-name>/instagram/<code>"
```

Keep the quotes: links can contain characters the terminal would otherwise
misread. Note that the command, secret included, is saved in your terminal
history.

---

## Step 4: Check that it works

### 1. Look at the page

Open `/about-me` on the DEV site. Scroll to **On Instagram**. You should see
your 12 latest posts as tiles: 3 across on phones and tablets, 4 across on
desktop. Each tile opens the post on Instagram in a new tab.

If you still see _"The feed can't be shown right now"_, wait two minutes and
reload, then see [Troubleshooting](#troubleshooting).

### 2. Check how many posts NoCodeAPI sends (30 seconds)

The grid asks for 16 posts (12 to show and 4 spares). This confirms NoCodeAPI
actually sends that many:

1. On the DEV site, press **F12** (or right-click → **Inspect**) and open the
   **Console** tab.
2. Paste this line and press **Enter**:

   ```js
   fetch('/api/instagram?limit=16')
     .then((r) => r.json())
     .then((d) => d.data.length);
   ```

3. Read the number it prints:

   | You see                 | Meaning                                                                                     |
   | ----------------------- | ------------------------------------------------------------------------------------------- |
   | `16`                    | All good: 12 shown and 4 spares.                                                            |
   | a smaller number        | Still works. It shows up to 12, with fewer spares. See [Troubleshooting](#troubleshooting). |
   | an error or `undefined` | The feed isn't connected. Check Step 3.                                                     |

---

## Step 5: Repeat for TEST and PROD

Each environment is a separate Static Web App with its own settings. Repeat
**Step 3** on the **TEST** app, then the **PROD** app, and check each with
**Step 4**.

You can use the **same** NoCodeAPI link for all three. They read the same
Instagram account. NoCodeAPI plans limit how many requests you can make, so
the site saves each answer and reuses it for 15 minutes instead of asking
NoCodeAPI on every page view. Visitors who arrive at the same moment share
one request too. That keeps the request count low even with busy traffic.
(Azure may run more than one copy of the program, and each copy keeps its
own saved answer.)

**One pipeline check (once, for each environment).** After every build, a
safety check makes sure the placeholder-picture code never ships to PROD. It
runs as part of the site's `build` script. Open each workflow file in
`.github/workflows/` and confirm the build runs `yarn build` (or
`npm run build`), not `next build` directly. If one calls `next build`
directly, add a step after it that runs `yarn verify:no-faker`.

---

## All the settings, in one table

There are two kinds of settings, and they live in different places:

- **Server settings** go in the **Azure portal** (Step 3). They're read by the
  `/api/instagram` program while the site runs, are never sent to visitors,
  and take effect **without** a redeploy.
- **Build settings** go in the **GitHub Actions workflow** files
  (`.github/workflows/`, one per environment), in the same `env:` section where
  `NEXT_PUBLIC_ENVIRONMENT` is already set. They're baked into the site's
  pages when it's built, so a change needs a **redeploy**. Their names start
  with `NEXT_PUBLIC_`. Setting one in the Azure portal does nothing for the
  page.

### Server settings (Azure portal → Static Web App → Environment variables)

| Setting                        | Needed?                | What to put                                             | What it does                                                                                                                                                                                           |
| ------------------------------ | ---------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `INSTAGRAM_FEED_URL`           | **Yes**, to show posts | Your NoCodeAPI link (starts with `https://`)            | Where `/api/instagram` gets your posts. **Secret.** Without it (or if it isn't an `https://` link), the section shows its fallback line.                                                               |
| `INSTAGRAM_CACHE_TTL_MS`       | No                     | A number of milliseconds. Default `900000` (15 minutes) | How long a good answer from NoCodeAPI is reused before asking again. Lower means new posts show sooner but more NoCodeAPI requests; higher means fewer requests. `0` turns the saving off.             |
| `INSTAGRAM_TIMEOUT_MS`         | No                     | Default `4000` (4 seconds)                              | How long `/api/instagram` waits for NoCodeAPI on each try. It tries twice at most, so a stuck NoCodeAPI is given up on in about 9 seconds and visitors see the fallback line instead of waiting.       |
| `ALLOWED_ORIGIN_EXTRA`         | No                     | For example `http://localhost:3000`                     | Shared with the site's other server programs: one extra website address allowed to read `/api/instagram` from a browser. Only needed for local development (see below). Your live sites don't need it. |
| `API_HTTP_RETRY_BASE_DELAY_MS` | No                     | Default `500`                                           | Shared: the pause before a retry.                                                                                                                                                                      |

The last two are shared with the site's other server programs; leave them
unset unless you have a reason. The shared `API_HTTP_TIMEOUT_MS` and
`API_HTTP_MAX_RETRIES` settings **don't** apply to the Instagram feed: it has
its own shorter budget (`INSTAGRAM_TIMEOUT_MS`, one retry), because a page
section is waiting on it.

**If you run the Azure Functions separately** (a standalone Function App
linked to the site, rather than the built-in functions in the repo's `api/`
folder, which is how this project is set up today), put these server
settings on that **Function App** instead: Function App → **Settings** →
**Environment variables**.

### Build settings (GitHub Actions workflow, per environment)

| Setting                      | DEV                 | TEST                 | PROD                 | What it does                                                                                                                                          |
| ---------------------------- | ------------------- | -------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_ENVIRONMENT`    | `dev` (already set) | `test` (already set) | `prod` (already set) | Tells the site which environment it is. Nothing new to do.                                                                                            |
| `NEXT_PUBLIC_INSTAGRAM_MOCK` | optional: `true`    | optional: `true`     | **leave out**        | Test mode with placeholder pictures instead of real posts. See [below](#optional-test-mode-with-placeholder-pictures). Ignored by PROD builds anyway. |

### Don't set these

| Setting                   | Why                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| `TW_INSTAGRAM_MOCK_BUILD` | Worked out automatically during the build from the two build settings above. Setting it has no effect. |

---

## Optional: test mode with placeholder pictures

For checking the layout on DEV or TEST without a real feed, the grid can fill
itself with made-up posts: coloured placeholder tiles in Instagram's real
shapes (tall Reels, square and portrait posts), generated in the visitor's
browser with no outside requests.

- **Turn it on:** add `NEXT_PUBLIC_INSTAGRAM_MOCK: true` to the `env:` section
  of the **DEV** (or **TEST**) workflow and redeploy.
- **Turn it off:** remove that line and redeploy. The real feed (Step 3) is
  then used.
- **PROD can't use it.** A PROD build ignores the setting, and the
  placeholder-picture code (the "Faker" library) is left out of PROD builds
  entirely. A safety check runs after every build and stops a PROD build
  if that code ever sneaks in.

---

## Running it on your own computer

For developers working on the site locally.

**Just the look, with placeholder posts** (no accounts needed):

1. In the project folder, create a file called `.env.local` containing:

   ```
   NEXT_PUBLIC_ENVIRONMENT=dev
   NEXT_PUBLIC_INSTAGRAM_MOCK=true
   ```

2. Run `yarn dev` and open `http://localhost:3000/about-me`.

**With your real feed:**

1. Copy `api/local.sample.settings.json` to `api/local.settings.json`.
2. In `api/local.settings.json`, replace the `INSTAGRAM_FEED_URL` placeholder
   with your NoCodeAPI link. Keep `ALLOWED_ORIGIN_EXTRA` set to
   `http://localhost:3000` (the sample already has it). Without it, the
   browser blocks the local site from reading the local feed.
3. In `.env.local`, remove `NEXT_PUBLIC_INSTAGRAM_MOCK` and add
   `NEXT_PUBLIC_API_URL=http://localhost:7071`.
4. In one terminal: `cd api && yarn start` (needs Microsoft's **Azure
   Functions Core Tools** installed). In another: `yarn dev`.

Both `.env.local` and `api/local.settings.json` are ignored by Git, so your
link can't be committed by accident.

---

## Troubleshooting

`/api/instagram` answers with a short message that says what's wrong. To see
it, open `https://<your-site>/api/instagram?limit=16` in your browser.

| What you see                                                  | What it means                                                                                                      | What to do                                                                                                                                                                                                          |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{"error":"Instagram feed is not configured"}`                | `INSTAGRAM_FEED_URL` is missing, misspelled, or doesn't start with `https://`                                      | Check Step 3 on **this** environment's app. Names must match exactly.                                                                                                                                               |
| `{"error":"Instagram feed unavailable"}`                      | NoCodeAPI answered with an error: the link is wrong, your Instagram login expired, or your plan's limit is used up | Open the NoCodeAPI link directly (Step 2's quick check). If that errors too, reconnect Instagram in NoCodeAPI or check your plan. If you reconnect and get a new link, update the setting.                          |
| `{"error":"Instagram feed timed out"}`                        | NoCodeAPI didn't answer within about 9 seconds (two tries of 4 seconds)                                            | Usually temporary. Reload in a few minutes. If it keeps happening, check NoCodeAPI's status.                                                                                                                        |
| `{"data":[ ... ]}` but the page still shows the fallback line | The feed works, but every post was rejected or failed to load in the browser                                       | Rare. Check the browser console (F12) for blocked images and let your developer know.                                                                                                                               |
| The page shows fewer than 12 tiles                            | More than 4 posts couldn't be shown (or NoCodeAPI sent fewer than 16; see Step 4)                                  | See the next row.                                                                                                                                                                                                   |
| Step 4's check shows fewer than 16                            | NoCodeAPI sends fewer posts per request than the grid asks for                                                     | The grid still works, with fewer spares. If NoCodeAPI offers a "number of posts" option in its link (check its docs), add it to the link in `INSTAGRAM_FEED_URL`; the site passes the whole link through unchanged. |
| A new Instagram post isn't on the site yet                    | The site reuses NoCodeAPI's answer for up to 15 minutes, and browsers may keep it about that long again            | Wait up to about 30 minutes. To shorten it, lower `INSTAGRAM_CACHE_TTL_MS` (at the cost of more NoCodeAPI requests).                                                                                                |
| A Reel's tile is missing and the next post moved up           | Usually the Reel has no cover image (or its image failed to load), so the grid used a spare                        | Add a cover image to the Reel in Instagram.                                                                                                                                                                         |

If a good feed later fails (NoCodeAPI down, plan limit reached), the site
keeps showing the **last posts it successfully loaded** rather than emptying
the grid, until NoCodeAPI answers again. That saved copy only lasts until
Azure restarts the program, which it does from time to time; after a restart
with NoCodeAPI still down, the section shows its fallback line.

---

## Keeping it safe

- **Where the secret lives:** only in Azure (each app's Environment
  variables) and, for local work, in git-ignored files on your own computer.
  Never in code, GitHub, or chat messages.
- **Visitors can't see it.** The page only ever calls `/api/instagram`; the
  NoCodeAPI link stays on the server, and the server never writes it to its
  logs.
- **If the link leaks:** in NoCodeAPI, remove or regenerate that Instagram API
  to get a new link, then update `INSTAGRAM_FEED_URL` on each environment
  (Step 3). Removing it in NoCodeAPI is what switches the old link off. Check
  afterwards that the old link no longer returns your posts.
- **Who can change it:** anyone with settings access to the Static Web Apps in
  Azure. Keep that list short.

---

## Things that are changed in code, not settings

Ask a developer for these. They aren't Azure settings.

| You want to change                              | Where it lives                                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Which Instagram profile the "Follow" link opens | `SOCIAL_URLS.instagram` in `src/lib/socials.ts` (the feed itself comes from NoCodeAPI, Step 2) |
| The section's heading and text                  | `INSTAGRAM_SECTION` in `src/app/about-me/aboutMeData.ts`                                       |
| How many posts show (12) or are fetched (16)    | `INSTAGRAM_POST_LIMIT` and `INSTAGRAM_FETCH_LIMIT` in `src/lib/instagram.ts`                   |
| How tall Reels are cropped (toward the top)     | `$focus-y` in `src/components/InstagramGrid/InstagramGrid.module.scss`                         |

---

## Glossary

- **Azure Static Web App (SWA):** the Azure service that hosts the site.
  DEV, TEST and PROD are three separate ones.
- **Azure Function:** a small server program that runs inside the Static Web
  App. `/api/instagram` is one; the code is in `api/instagram/`.
- **Environment variable / setting:** a named value stored outside the code,
  like `INSTAGRAM_FEED_URL`, so secrets and per-environment choices don't live
  in the code.
- **NoCodeAPI:** a service (with free and paid plans) that logs in to
  Instagram for you and gives you one link that returns your posts.
- **Endpoint / link:** the web address NoCodeAPI gives you. Here it's a
  secret.
- **Redeploy:** publishing the site again, which happens automatically when
  changes are merged to the environment's branch in GitHub.
- **Mock / test mode:** placeholder posts for checking the layout without a
  real feed.

---

_More detail for developers (how it was built, tested and reviewed) is in
[README.md](./README.md) and [CHANGELOG.md](./CHANGELOG.md) in this folder._
