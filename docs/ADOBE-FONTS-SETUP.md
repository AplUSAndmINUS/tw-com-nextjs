# Adobe Fonts Setup for TW.com

## Font Requirements

To match the book's typography system, you need these fonts from Adobe Fonts:

### 1. **Montserrat** (Headings)

- Weights needed:
  - Light 300 (for H6 chapter-style numbers)
  - Medium 500 (for H5, pull quotes)
  - Semi-Bold 600 (for H3, H4)
  - Bold 700 (for H2)
  - Extra Bold 800 (for H1 chapter titles)
- With **Italic** for pull quotes

### 2. **Merriweather** (Body Text)

- Weights needed:
  - Regular 400 (for body text)
- With **Italic** for blockquotes

### 3. **Roboto Condensed** (Metadata/Captions)

- Weights needed:
  - Light 300 (for captions, dates, metadata)

### 4. **Roboto Mono** (Code)

- Weights needed:
  - Regular 400 (for code blocks)

---

## Adobe Fonts Integration Steps

### Step 1: Create Adobe Fonts Project

1. Go to [Adobe Fonts](https://fonts.adobe.com/)
2. Click "Create a Web Project"
3. Name it: **TerenceWaters.com**

### Step 2: Add Fonts to Project

Add these font families with the specified weights:

**Montserrat:**

- Light 300
- Light 300 Italic
- Medium 500
- Medium 500 Italic
- Semi-Bold 600
- Bold 700
- Extra Bold 800

**Merriweather:**

- Regular 400
- Regular 400 Italic

**Roboto Condensed:**

- Light 300

**Roboto Mono:**

- Regular 400

### Step 3: Get Embed Code

After adding fonts, Adobe will give you a `<link>` tag that looks like:

```html
<link rel="stylesheet" href="https://use.typekit.net/YOUR-PROJECT-ID.css" />
```

### Step 3.5: Configure Font Display (Important!)

**Enable `font-display: swap` to prevent Flash of Invisible Text (FOIT):**

1. In your Adobe Fonts project settings, click "Advanced Settings"
2. Find "Font Display" option
3. Select **"Swap"** instead of "Auto"
4. Save changes

**Why this matters:**

- **Without swap**: Users see invisible text while fonts load (FOIT)
- **With swap**: Users see fallback fonts immediately, then swap to Adobe Fonts when ready
- **Better UX**: Content is readable immediately on slow connections

### Step 4: Add to Your Layout

Add this to your `src/app/layout.tsx` in the `<head>`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* Adobe Fonts */}
        <link
          rel='stylesheet'
          href='https://use.typekit.net/YOUR-PROJECT-ID.css'
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Step 5: Verify Configuration

**Automated Font Verification:**

The project includes a build-time verification script that ensures all required fonts are properly configured before deployment. This prevents font loading issues in production.

**What it checks:**

- ✅ All required font weights are present
- ✅ Both normal and italic styles where needed
- ✅ `font-display: swap` is configured
- ✅ Adobe Fonts project is accessible

**When it runs:**

- Automatically before `yarn dev`
- Automatically before `yarn build`
- Manually with `yarn verify:fonts`

**Expected output:**

```bash
🔍 Verifying Adobe Fonts configuration...

📦 Project ID: dqf8seo
🔗 URL: https://use.typekit.net/dqf8seo.css

✓ Found 11 font face declarations

✓ font-display: swap is configured

✅ All required fonts are configured:

   ✓ Montserrat 300
   ✓ Montserrat 300 italic
   ✓ Montserrat 500
   ✓ Montserrat 500 italic
   ✓ Montserrat 600
   ✓ Montserrat 700
   ✓ Montserrat 800
   ✓ Merriweather 400
   ✓ Merriweather 400 italic
   ✓ Roboto Condensed 300
   ✓ Roboto Mono 400

🎉 Font verification complete!
```

**If verification fails:**

1. Check that all fonts are added to your Adobe Fonts project
2. Ensure the project ID in `src/app/globals.css` matches your project
3. Verify `font-display: swap` is enabled in project settings
4. See the error output for specific missing fonts

---

## Typography System Overview

Your new system mirrors the book's aesthetic:

| Element              | Font             | Weight               | Letter-Spacing | Transform |
| -------------------- | ---------------- | -------------------- | -------------- | --------- |
| **H1** (Chapters)    | Montserrat       | 800 (ExtraBold)      | -0.02em        | UPPERCASE |
| **H2** (Sections)    | Montserrat       | 700 (Bold)           | -0.015em       | UPPERCASE |
| **H3** (Subsections) | Montserrat       | 600 (SemiBold)       | -0.01em        | —         |
| **H4**               | Montserrat       | 600 (SemiBold)       | 0              | —         |
| **H5**               | Montserrat       | 500 (Medium)         | 0.01em         | —         |
| **H6** (Chapter #)   | Montserrat       | 300 (Light)          | 0.15em         | UPPERCASE |
| **Body**             | Merriweather     | 400 (Regular)        | 0              | —         |
| **Blockquote**       | Merriweather     | 400 (Regular) Italic | 0              | —         |
| **Pull Quote**       | Montserrat       | 500 (Medium) Italic  | 0              | —         |
| **Captions**         | Roboto Condensed | 300 (Light)          | 0.02em         | —         |
| **Card Subtitle**    | Montserrat       | 500 (Medium)         | 0.05em         | UPPERCASE |
| **Code**             | Roboto Mono      | 400 (Regular)        | 0              | —         |

---

## Alternative: Google Fonts (Free)

If you prefer not to use Adobe Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;1,400&family=Montserrat:ital,wght@0,300;0,500;0,600;0,700;0,800;1,500&family=Roboto+Condensed:wght@300&family=Roboto+Mono:wght@400&display=swap"
  rel="stylesheet"
/>
```

Update `fluentTheme.ts` font names to match Google Fonts naming:

- `montserrat` → `'Montserrat', sans-serif`
- `merriweather` → `'Merriweather', serif`
- `roboto-condensed` → `'Roboto Condensed', sans-serif`

---

## Design Philosophy

This typography system creates:

✅ **Visual Authority** — Montserrat's geometric forms command attention  
✅ **Reading Comfort** — Merriweather's serifs ease long-form reading  
✅ **Brand Consistency** — Matches book cover and interior design  
✅ **Clear Hierarchy** — Weight and spacing create natural flow  
✅ **Professional Polish** — Wide letter-spacing on labels/metadata (inspired by premium print)

Your website will now feel like an extension of your book brand! 🎉

---

## Fallback Font Strategy

If Adobe Fonts fail to load (network issues, project misconfiguration, etc.), the site gracefully falls back to system fonts:

### Fallback Chain:

| Primary Font         | Fallback Fonts                                          |
| -------------------- | ------------------------------------------------------- |
| **Montserrat**       | -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif |
| **Merriweather**     | Georgia, Times New Roman, serif                         |
| **Roboto Condensed** | Arial Narrow, sans-serif                                |
| **Roboto Mono**      | Courier New, monospace                                  |

### Why These Fallbacks:

- **Georgia** → Close serif alternative to Merriweather, widely available
- **System Sans** → Modern, clean fallback for Montserrat
- **Arial Narrow** → Condensed sans-serif similar to Roboto Condensed
- **Courier New** → Universal monospace for code blocks

### Testing Fallbacks:

To test how the site looks with fallback fonts:

1. Temporarily comment out the Adobe Fonts link in `globals.css`
2. Clear browser cache
3. Reload the site

The design should remain readable and hierarchically clear, though less aligned with the book's aesthetic.

---

## Troubleshooting

### Fonts not loading?

1. **Check browser console** for 404 or CORS errors
2. **Verify project ID** in `src/app/globals.css` (line 1)
3. **Run verification**: `yarn verify:fonts`
4. **Check Adobe Fonts project** is published (not draft)
5. **Clear browser cache** and hard reload

### Verification script fails?

1. **Check internet connection** (script needs to fetch CSS)
2. **Verify Adobe Fonts URL** is accessible
3. **Update missing fonts** in your Adobe Fonts project
4. **Re-publish project** after making changes

### Font weights look wrong?

1. **Verify correct weights** are added in Adobe Fonts project
2. **Check CSS specificity** isn't overriding font-weight
3. **Inspect element** to see computed font-family and font-weight

---

**Need help?** See the [Adobe Fonts documentation](https://helpx.adobe.com/fonts/using/add-fonts-website.html) or reach out to the team.
