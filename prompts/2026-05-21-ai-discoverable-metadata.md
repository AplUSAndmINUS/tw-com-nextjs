# AI-Discoverable Personal Brand Metadata Implementation

**Date:** 2026-05-21  
**Branch:** `copilot/add-person-schema-homepage-about-footer`  
**Issue:** #124 — User Story 2: TerenceWaters.com AI-Discoverable Personal Brand Pages

---

## Overview

Implemented comprehensive AI-discoverability infrastructure for TerenceWaters.com following the pattern established in the Fluxline.pro PR #193. This implementation ensures TW.com content is properly indexed by AI crawlers (GPTBot, PerplexityBot, ClaudeBot, etc.) while blocking non-production environments from being crawled.

---

## What Was Implemented

### 1. Environment-Aware Crawling

**Files Created:**

- `src/app/robots.ts` — Dynamic robots.txt generation
- `src/app/sitemap.ts` — Dynamic sitemap with weighted priorities

**Behavior:**

- **DEV/TEST:** Blocks all crawlers (`Disallow: /`)
- **PROD:** Explicitly allows major AI crawlers and provides sitemap URL

**Key Features:**

- Uses centralized `getEnvironment()` from `src/lib/environment.ts`
- Includes `export const dynamic = 'force-static'` for Next.js static export compatibility
- Sitemap includes weighted priorities (1.0 for homepage/about, 0.9 for services, 0.8 for blog/portfolio/case studies)

### 2. Comprehensive JSON-LD Structured Data

**Updated Files:**

- `src/utils/structuredData.ts` — Added schema generation functions
- `src/app/layout.tsx` — Root-level schemas (Person, Organization, WebSite)
- `src/app/page.tsx` — Homepage Person schema
- `src/app/about/page.tsx` — AboutPage + Person schemas
- `src/app/services/page.tsx` — ItemList schema for services catalog
- `src/app/blog/[slug]/page.tsx` — BlogPosting + Author + FAQ schemas
- `src/app/case-studies/[slug]/page.tsx` — Article schema with CollectionPage reference
- `src/app/portfolio/[slug]/page.tsx` — CreativeWork schema with CollectionPage reference

**Schema Functions Added:**

- `getOrganizationSchema()` — Fluxline Resonance Group organizational context
- `getWebSiteSchema()` — Site-wide identity
- `getAboutPageSchema()` — AboutPage type for /about
- `getCaseStudySchema()` — Article schema for case studies
- `getPortfolioSchema()` — CreativeWork schema for portfolio items
- `getServicesItemListSchema()` — Service catalog with 5 service listings

**Schema Features:**

- All schemas use `@id` for stable entity references (e.g., `https://terencewaters.com/#person`)
- Cross-linking between TW.com and Fluxline.pro (via `sameAs`, `worksFor`, founder relationships)
- Image URLs are absolute (e.g., `${SITE_URL}${post.imageUrl}`)
- Proper use of `isPartOf` for blog/portfolio/case study collection relationships

### 3. Environment-Aware Metadata

**Updated `src/app/layout.tsx`:**

- Reads `NEXT_PUBLIC_ENVIRONMENT` via `getEnvironment()`
- Sets `robots` metadata to `index: true, follow: true` on PROD
- Sets `robots` metadata to `index: false, follow: false` on DEV/TEST
- Embeds Person, Organization, and WebSite schemas in `<head>` using Next.js `<Script>` component

### 4. Removed Visible AI Biography Markup

**Updated `src/app/page.tsx`:**

- Removed the `<section aria-labelledby='ai-bio-summary' className='sr-only'>` block
- AI biography data is now expressed exclusively through JSON-LD schemas
- Cleaner homepage markup without redundant text nodes

### 5. Script Component Consistency

**Pattern Applied Across All Pages:**

- Used Next.js `<Script>` component instead of raw `<script>` tags
- Added unique `id` attributes to all JSON-LD scripts (e.g., `id='homepage-person-schema'`)
- Consistent use of `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}`

**Note:** Following Fluxline PR review feedback, we should consider escaping `<` characters in JSON-LD to prevent XSS if content contains `</script>` sequences. This can be added as a follow-up enhancement.

---

## Files Created

1. `src/app/robots.ts`
2. `src/app/sitemap.ts`
3. `prompts/2026-05-21-ai-discoverable-metadata.md` (this file)

---

## Files Modified

1. `src/utils/structuredData.ts` — Added 6 new schema functions
2. `src/app/layout.tsx` — Environment-aware robots + root schemas
3. `src/app/page.tsx` — Removed visible AI bio section, kept Person schema
4. `src/app/about/page.tsx` — Added AboutPage schema + Script imports
5. `src/app/services/page.tsx` — Added ItemList schema
6. `src/app/blog/[slug]/page.tsx` — Switched to `<Script>` component with unique IDs
7. `src/app/case-studies/[slug]/page.tsx` — Added Article schema
8. `src/app/portfolio/[slug]/page.tsx` — Added CreativeWork schema

---

## Validation

✅ **Build:** `yarn build` completes successfully  
✅ **TypeScript:** No type errors  
✅ **Static Export:** Compatible with `output: 'export'` (added `dynamic = 'force-static'`)  
✅ **Routes Generated:** 55 static pages including dynamic sitemap and robots.txt

---

## Schema Coverage

| Page/Route           | Schemas                               |
| -------------------- | ------------------------------------- |
| Root Layout          | Person, Organization, WebSite         |
| Homepage             | Person (duplicate for emphasis)       |
| /about               | Person, AboutPage                     |
| /services            | ItemList (5 services)                 |
| /blog/[slug]         | BlogPosting, Person (Author), FAQPage |
| /case-studies/[slug] | Article, Person (Author)              |
| /portfolio/[slug]    | CreativeWork, Person (Creator)        |

---

## Environment Detection Pattern

All environment checks now use the centralized `getEnvironment()` utility:

```typescript
import { getEnvironment } from '@/lib/environment';

const env = getEnvironment();
const isProd = env === 'prod';
```

This ensures consistency across:

- `src/app/layout.tsx` (robots metadata)
- `src/app/robots.ts` (crawl rules)
- `src/app/sitemap.ts` (sitemap generation)
- `src/utils/metadata.ts` (`getRobotsConfig()`)

---

## AI Biography Data

The `AI_BIOGRAPHY` object in `src/utils/structuredData.ts` contains:

- `shortSummary` — One-sentence identity statement
- `longSummary` — Expanded narrative
- `expertise` — Bullet-point list of 5 core competencies

This data is surfaced via:

1. JSON-LD `Person.description` and `Person.disambiguatingDescription`
2. JSON-LD `Person.knowsAbout` array
3. Visible section on `/about` page (not screen-reader-only)

---

## Cross-Site Identity Linking

**TW.com → Fluxline.pro:**

- Person schema includes `worksFor: { Organization: "Fluxline Resonance Group" }`
- `sameAs` array includes `https://fluxline.pro`
- Organization schema (in layout) references `founder: { Person: Terence Waters }`

**Fluxline.pro → TW.com:**

- (Implemented in Fluxline PR #193)
- Organization founder references `@id: 'https://terencewaters.com/#person'`

---

## Priority Weighting (Sitemap)

| Priority | Routes                                                         |
| -------- | -------------------------------------------------------------- |
| 1.0      | Homepage, /about                                               |
| 0.9      | /services, /contact                                            |
| 0.8      | /blog/[slug], /portfolio/[slug], /case-studies/[slug]          |
| 0.7      | /coaching, /content-hub                                        |
| 0.6      | /videos, /podcasts, /archive, /blog, /portfolio, /case-studies |
| 0.5      | /archive                                                       |

---

## Acceptance Criteria Status

✅ Person schema added to homepage, About page, and layout  
✅ AI-optimized biography in structured format (short + long + expertise)  
✅ Cross-site identity linking (TW.com ↔ Fluxline.pro)  
✅ Blog structure includes: structured summary, key insights, FAQ block, author schema  
✅ Semantic HTML used (`<article>`, `<section>`, `<Script>` for schemas)  
✅ Knowledge panel support (roles, expertise, organization)  
✅ AI-visibility sitemap with all personal brand pages and blog posts  
✅ DEV/TEST blocks crawling, PROD allows crawling

---

## Follow-Up Recommendations

1. **XSS Safety:** Add JSON-LD escaping helper (replace `<` with `\u003c`) as suggested in Fluxline PR review
2. **Individual Service Pages:** Add Service schema to `/services/[slug]` pages if they exist
3. **FAQ Enhancement:** Add more targeted FAQs to blog posts (currently derived or defaulted)
4. **Image URLs:** Verify all blog/portfolio images have `imageUrl` frontmatter (schemas use absolute URLs)
5. **OpenGraph Images:** Ensure all pages have `og:image` set (currently not explicitly added to metadata)

---

## Testing Checklist

- [ ] Verify robots.txt on DEV deployment (should disallow all)
- [ ] Verify robots.txt on PROD deployment (should allow AI crawlers)
- [ ] Verify sitemap.xml on PROD includes all 55 routes
- [ ] Test structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test structured data with [Schema.org Validator](https://validator.schema.org/)
- [ ] Verify "Who is Terence Waters" query in ChatGPT/Claude (after crawl)
- [ ] Check Lighthouse SEO score (target ≥ 95)

---

## Notes

- All schemas use `https://schema.org` context
- `PERSON_NAME`, `PERSON_ROLES`, `PERSON_EXPERTISE` constants centralized in `structuredData.ts`
- Site URL is hardcoded as `https://terencewaters.com` (could be env var in future)
- Build time is ~10 seconds with TypeScript checking
- Successfully generates 55 static pages

---

**Implementation Complete** ✅
