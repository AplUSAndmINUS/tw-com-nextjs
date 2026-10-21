/**
 * DOM helpers behind PageTransition: which link clicks get a fade-out, and
 * which page blocks get a staggered entrance or a scroll reveal.
 *
 * Everything here is progressive enhancement. The classes it adds are the only
 * thing that ever hides content, they are added by script after the page has
 * rendered, and they are only added to blocks that are off screen (scroll
 * reveal) or for the length of one entrance animation (stagger). With no
 * JavaScript, or for a crawler reading the HTML, nothing is hidden.
 */

/** How long the outgoing page takes to fade before the router navigates. */
export const LEAVE_MS = 180;

/** Delay between consecutive sections in the entrance cascade. */
export const ENTER_STEP_MS = 90;

/** Cap on the cascade so a long page does not keep later sections waiting. */
export const ENTER_MAX_DELAY_MS = 450;

/** Entrance animation length (keep in sync with twRouteRise in effects.css). */
export const ENTER_DURATION_MS = 650;

/** Classes the global stylesheet (styles/tokens/effects.css) animates. */
export const ENTER_CLASS = 'tw-enter';
export const SCROLL_CLASS = 'tw-sr';
export const SCROLL_IN_CLASS = 'tw-sr-in';

/** Elements already animated by TwReveal; blocks containing them are left to it. */
const OWN_REVEAL_SELECTOR = '.tw-rv, .tw-rv-left, .tw-stagger';

/** Opt-out hook for a link or a block. */
const OPT_OUT_SELECTOR = '[data-no-route-transition]';

const SKIPPED_TAGS = new Set([
  'NAV',
  'HEADER',
  'FOOTER',
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEMPLATE',
  'LINK',
  'DIALOG',
]);

/** A path segment that ends in an extension is a file (PDF, RSS, image), not a page. */
const FILE_EXTENSION = /\.[a-z0-9]{1,8}$/i;

const normalizePath = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, '') : path;

/** True when the OS or the in-app setting asks for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  if (
    document.documentElement.getAttribute('data-tw-reduced-motion') === 'true'
  ) {
    return true;
  }
  return (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
}

/** The parts of a click event the link check reads. */
export interface ClickLike {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}

/** The parts of an anchor element the link check reads. */
export interface AnchorLike {
  href: string;
  target: string;
  hasAttribute(name: string): boolean;
  getAttribute(name: string): string | null;
  closest(selector: string): unknown;
}

/**
 * Returns the in-app destination for a click that should fade the page out
 * before navigating, or null to leave the click to the browser / next/link.
 *
 * Only a plain left click on a same-origin link to a different page qualifies.
 * New-tab and download clicks, links to files, in-page anchors and links that
 * opt out with data-no-route-transition all keep their normal behaviour.
 */
export function getTransitionHref(
  anchor: AnchorLike,
  event: ClickLike,
  current: { origin: string; pathname: string }
): string | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return null;
  }
  if (anchor.target && anchor.target !== '_self') return null;
  if (anchor.hasAttribute('download')) return null;
  if (anchor.getAttribute('aria-disabled') === 'true') return null;
  if (anchor.closest(OPT_OUT_SELECTOR)) return null;

  let url: URL;
  try {
    url = new URL(anchor.href, current.origin);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.origin !== current.origin) return null;
  if (normalizePath(url.pathname) === normalizePath(current.pathname)) {
    return null;
  }
  if (FILE_EXTENSION.test(url.pathname)) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

function isContentBlock(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (SKIPPED_TAGS.has(el.tagName)) return false;
  if (el.getAttribute('aria-hidden') === 'true') return false;
  if (el.matches(OPT_OUT_SELECTOR)) return false;
  const { position, display } = window.getComputedStyle(el);
  if (position === 'fixed' || position === 'sticky') return false;
  if (display === 'none') return false;
  return true;
}

/**
 * The page's top-level content blocks: the children of <main>, descending
 * through single-child wrapper divs (layout and background shells) until the
 * level where the page actually splits into sections.
 */
export function findPageBlocks(root: HTMLElement): HTMLElement[] {
  let container: Element = root.querySelector('main') ?? root;
  for (let depth = 0; depth < 4; depth++) {
    const blocks = Array.from(container.children).filter(isContentBlock);
    if (blocks.length !== 1) break;
    container = blocks[0];
  }
  return Array.from(container.children).filter(isContentBlock);
}

const hasOwnReveal = (el: Element) =>
  el.matches(OWN_REVEAL_SELECTOR) ||
  el.querySelector(OWN_REVEAL_SELECTOR) !== null;

/** Sections/articles inside `block` that are not nested in another one. */
function outermostSubsections(block: HTMLElement): HTMLElement[] {
  return Array.from(
    block.querySelectorAll<HTMLElement>('section, article')
  ).filter((el) => {
    const outer = el.parentElement?.closest('section, article');
    return !outer || outer === block || !block.contains(outer);
  });
}

/**
 * Stagger the blocks in view and scroll-reveal the ones below the fold.
 *
 * `stagger` is false on the first page load: those blocks have already been
 * painted from the server HTML, and hiding them now would flash. Below-fold
 * blocks are safe either way because nobody has seen them yet.
 *
 * Returns a cleanup that disconnects the observer and makes anything still
 * hidden visible again.
 */
export function animatePage(
  root: HTMLElement,
  { stagger }: { stagger: boolean }
): () => void {
  const viewportHeight = window.innerHeight;
  const entering: HTMLElement[] = [];
  const pending: HTMLElement[] = [];

  const isBelowFold = (el: Element) =>
    el.getBoundingClientRect().top >= viewportHeight;

  for (const block of findPageBlocks(root)) {
    const rect = block.getBoundingClientRect();
    if (rect.height === 0) continue;

    if (rect.top < viewportHeight && rect.bottom > 0) {
      if (stagger) {
        block.style.setProperty(
          '--tw-enter-delay',
          `${Math.min(entering.length * ENTER_STEP_MS, ENTER_MAX_DELAY_MS)}ms`
        );
        block.classList.add(ENTER_CLASS);
        entering.push(block);
      }
      // A tall block that starts on screen can still have subsections below
      // the fold. Reveal those on scroll, unless TwReveal already does.
      if (!hasOwnReveal(block)) {
        for (const sub of outermostSubsections(block)) {
          if (isBelowFold(sub)) pending.push(sub);
        }
      }
    } else if (rect.top >= viewportHeight && !hasOwnReveal(block)) {
      pending.push(block);
    }
  }

  for (const el of pending) el.classList.add(SCROLL_CLASS);

  const reveal = (el: Element) => el.classList.add(SCROLL_IN_CLASS);
  let observer: IntersectionObserver | null = null;
  let failsafe: number | undefined;

  if (pending.length > 0) {
    if (typeof IntersectionObserver === 'undefined') {
      pending.forEach(reveal);
    } else {
      let observerAlive = false;
      observer = new IntersectionObserver(
        (entries) => {
          observerAlive = true;
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal(entry.target);
              observer?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
      );
      pending.forEach((el) => observer?.observe(el));
      // Fail open, as TwReveal does: if the observer never reports at all
      // (non-compositing renderers, hidden ancestors), show everything rather
      // than leave sections invisible.
      failsafe = window.setTimeout(() => {
        if (!observerAlive) pending.forEach(reveal);
      }, 3000);
    }
  }

  // Drop the entrance classes once the cascade has played, so the DOM goes
  // back to its server-rendered state (and no transform lingers on sections).
  const enterCleanup =
    entering.length > 0
      ? window.setTimeout(
          () => {
            for (const el of entering) {
              el.classList.remove(ENTER_CLASS);
              el.style.removeProperty('--tw-enter-delay');
            }
          },
          ENTER_MAX_DELAY_MS + ENTER_DURATION_MS + 100
        )
      : undefined;

  return () => {
    observer?.disconnect();
    window.clearTimeout(failsafe);
    window.clearTimeout(enterCleanup);
    for (const el of entering) {
      el.classList.remove(ENTER_CLASS);
      el.style.removeProperty('--tw-enter-delay');
    }
    for (const el of pending) {
      el.classList.remove(SCROLL_CLASS, SCROLL_IN_CLASS);
    }
  };
}
