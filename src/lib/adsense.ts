/**
 * Google AdSense configuration.
 *
 * Auto ads are enabled site-wide with a small set of route exclusions. The same
 * exclusions are configured in the AdSense console ("Auto ads will not be shown
 * on the following pages and URLs") — Google is the authoritative gate, this
 * list keeps the loader from even running on those routes.
 */

/** Google AdSense publisher ID */
export const ADSENSE_PUB_ID = 'ca-pub-7691902367885014';

/** Loader URL for the Auto ads script. */
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`;

/**
 * Routes where Auto ads must never appear. A path matches if it equals the
 * entry or is nested beneath it (e.g. `/portfolio/some-project`).
 *
 * The home page is excluded exactly (`/`), never as a prefix.
 */
const EXCLUDED_PREFIXES = [
  '/about',
  '/books',
  '/case-studies',
  '/contact',
  '/portfolio',
  '/services',
] as const;

/** True when Auto ads are permitted on `pathname`. */
export function isAdsAllowedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;

  // Normalise a trailing slash so `/about/` matches `/about`
  const path =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;

  if (path === '/') return false;

  return !EXCLUDED_PREFIXES.some(
    prefix => path === prefix || path.startsWith(`${prefix}/`)
  );
}
