/**
 * Which nav a route gets
 * ======================
 *
 * Redesign Slice 6 (owner, v4): one nav, `SiteNav`, on every route.
 *
 *   'page'    The page renders <SiteNav /> itself, above its <main id="main">.
 *             Every route built on the design system (and the 404 page).
 *   'fixed'   Routes still on the legacy layout (a fixed header, content padded
 *             by --site-header-height): providers.tsx renders SiteNav in a
 *             fixed slot where the legacy Header used to be, so their page
 *             layout is untouched. Their <main> is #main-content.
 *   'legacy'  The old Header. Only the internal /dsm-preview page keeps it.
 *
 * Paths are compared without a trailing slash, query or hash.
 */

export type NavMode = 'page' | 'fixed' | 'legacy';

const clean = (pathname: string) =>
  pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/';

/** Routes on the legacy PageLayout (fixed header + padded content). */
export const FIXED_NAV_PREFIXES = ['/podcasts', '/unsubscribe'];

export function navModeFor(pathname: string): NavMode {
  const path = clean(pathname);
  if (path === '/dsm-preview' || path.startsWith('/dsm-preview/'))
    return 'legacy';
  if (FIXED_NAV_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)))
    return 'fixed';
  return 'page';
}

/** The id of the route's <main>, for the skip link (none on 'legacy'). */
export function mainIdFor(pathname: string): string | undefined {
  const mode = navModeFor(pathname);
  if (mode === 'legacy') return undefined;
  return mode === 'fixed' ? 'main-content' : 'main';
}
