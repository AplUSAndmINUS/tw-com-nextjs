/**
 * Site navigation for the redesigned pages
 * ========================================
 *
 * One nav config for every route (rendered by TwSiteNav through SiteNav;
 * redesign Slice 6 retired the per-page TwPageNav and the old Header, which
 * only /dsm-preview keeps). See src/lib/navMode.ts.
 *
 * Labels are the site's existing ones (HomePageClient NAV_LINKS, the book
 * section kicker "The Book"). Decision A: "About" is /about/, the full story,
 * and it is pinned: visible in the bar at every width (owner, 2026-11-18).
 * /about-me/ stays out of the nav: it's the one link Terence hands out, and it
 * links to /about/ as a call to action.
 *
 * Every internal href ends in "/" (next.config.ts sets trailingSlash: true),
 * so no link costs a redirect hop.
 */

import { existing } from './copy';
import { BOOK_A_CONVERSATION } from './booking';

export const ROUTES = {
  home: '/',
  about: '/about/',
  aboutMe: '/about-me/',
  book: '/resonance-core-framework/',
  contentHub: '/content-hub/',
  blog: '/blog/',
  podcasts: '/podcasts/',
  videos: '/videos/',
  portfolio: '/portfolio/',
  github: '/github/',
  /**
   * /contact/ (Slice 5): book, write, or subscribe. Home keeps its #contact
   * and #newsletter anchors for old links.
   */
  contact: '/contact/',
  conversation: '/contact/#conversation',
  message: '/contact/#message',
  newsletter: '/contact/#newsletter',
} as const;

/** Where the nav's Contact link goes until /contact/ is rebuilt (#281). */
export const CONTACT_NAV_HREF = '/#contact';

export interface SiteNavLink {
  label: string;
  href: string;
  /**
   * Stays visible in the bar at every width (the others fold into the menu
   * below tablet). Owner, 2026-11-18: About must always be in the nav.
   */
  pinned?: boolean;
  /**
   * Sub-pages, shown in a dropdown (desktop) or an expandable drawer in the
   * menu (phones and tablets). The link itself stays clickable.
   */
  children?: { label: string; href: string }[];
}

const navSrc = 'Existing nav label';

export const SITE_NAV_LINKS: SiteNavLink[] = [
  {
    label: existing('nav.about', 'About', navSrc),
    href: ROUTES.about,
    pinned: true,
  },
  {
    label: existing('nav.book', 'The Book', 'Home book section kicker'),
    href: ROUTES.book,
  },
  {
    label: existing('nav.content', 'Content', navSrc),
    href: ROUTES.contentHub,
    // Owner, 2026-11-18: Content opens a list of the content pages; the
    // Content link itself still goes to the Content Hub. Labels are the
    // site's existing ones (navigation.config.ts).
    children: [
      {
        label: existing('nav.content.blog', 'Blog', navSrc),
        href: ROUTES.blog,
      },
      {
        label: existing('nav.content.podcasts', 'Podcasts', navSrc),
        href: ROUTES.podcasts,
      },
      {
        label: existing('nav.content.videos', 'Videos', 'Footer link label'),
        href: ROUTES.videos,
      },
      {
        label: existing('nav.content.portfolio', 'Portfolio', navSrc),
        href: ROUTES.portfolio,
      },
      {
        label: existing('nav.content.github', 'GitHub', navSrc),
        href: ROUTES.github,
      },
    ],
  },
  // /contact/ is not rebuilt yet (#281): until it is, Contact goes to the home
  // page's contact section. Switch back to ROUTES.contact when it ships.
  { label: existing('nav.contact', 'Contact', navSrc), href: CONTACT_NAV_HREF },
];

/** The one persistent button in the nav (DESIGN_BRIEF §6.2–6.3). */
export const SITE_NAV_CTA = BOOK_A_CONVERSATION;

/**
 * Which nav link is "current" for a pathname. Trailing slashes and hashes are
 * ignored; Home has no nav link of its own (the brand is the home link).
 */
export function activeNavHref(pathname: string): string | undefined {
  const clean = (p: string) => p.split('#')[0].replace(/\/+$/, '') || '/';
  const path = clean(pathname);
  if (path === '/') return undefined;
  const matches = (href: string) => {
    const target = clean(href);
    return target !== '/' && (path === target || path.startsWith(`${target}/`));
  };
  // A sub-page (e.g. /blog/some-post/) marks its parent (Content).
  return SITE_NAV_LINKS.find(
    (l) => matches(l.href) || l.children?.some((c) => matches(c.href))
  )?.href;
}
