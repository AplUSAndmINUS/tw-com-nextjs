import localFont from 'next/font/local';

/**
 * Self-hosted brand typefaces
 * ===========================
 *
 * These were previously served from Adobe Typekit via an `@import url(...)` at
 * the top of globals.css — a render-blocking third-party request on every page
 * load, plus an availability dependency on a service outside our control. They
 * are now self-hosted and served same-origin with immutable hashed filenames.
 *
 * Each family exposes a CSS custom property that src/styles/tokens/typography.css
 * reads (--tw-font, --tw-font-body, --tw-font-mono).
 *
 * Preparation (see the notes on sizes below):
 *   - Sourced as variable TTFs from Google Fonts' OFL repository.
 *   - Subset to Latin + Latin Extended.
 *   - Converted to WOFF2.
 *   - Merriweather additionally had its `wdth` and `opsz` axes pinned; we only
 *     ever vary weight, and carrying three axes cost 4.4 MB per face.
 *
 * Total went from 10.59 MB of raw TTF to 1.03 MB.
 *
 * `preload` is deliberately not uniform. Montserrat sets headings and nav, which
 * are the largest above-the-fold text and a likely LCP element, so it is worth
 * the early request. Merriweather is body copy — it swaps in a beat later
 * without blocking first paint, and preloading two thirds of a megabyte would
 * compete with the hero image for bandwidth. `adjustFontFallback` generates a
 * metric-matched fallback so that swap does not shift layout.
 */

export const montserrat = localFont({
  src: [
    {
      path: '../assets/fonts/Montserrat-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Montserrat-Italic-Variable.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
});

export const merriweather = localFont({
  src: [
    {
      path: '../assets/fonts/Merriweather-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
    // Pinned to 400. Bold italic body copy is vanishingly rare, and carrying the
    // full weight axis on the italic face cost an extra 227 KB; the browser
    // synthesises the rare bold-italic from this.
    {
      path: '../assets/fonts/Merriweather-Italic-Variable.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-merriweather',
  display: 'swap',
  preload: false,
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const robotoMono = localFont({
  src: [
    {
      path: '../assets/fonts/RobotoMono-Variable.woff2',
      weight: '100 700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/RobotoMono-Italic-Variable.woff2',
      weight: '100 700',
      style: 'italic',
    },
  ],
  variable: '--font-roboto-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
});

/** Every font variable, for the <html> className. */
export const fontVariables = [
  montserrat.variable,
  merriweather.variable,
  robotoMono.variable,
].join(' ');
