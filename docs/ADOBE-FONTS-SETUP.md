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
