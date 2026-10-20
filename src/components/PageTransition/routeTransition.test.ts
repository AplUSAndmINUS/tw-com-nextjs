import { describe, expect, it } from 'vitest';
import {
  getTransitionHref,
  type AnchorLike,
  type ClickLike,
} from './routeTransition';

const here = { origin: 'https://terencewaters.com', pathname: '/content-hub/' };

const click = (overrides: Partial<ClickLike> = {}): ClickLike => ({
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: false,
  ...overrides,
});

const anchor = (
  href: string,
  {
    target = '',
    attrs = {},
    optedOut = false,
  }: {
    target?: string;
    attrs?: Record<string, string>;
    optedOut?: boolean;
  } = {}
): AnchorLike => ({
  href: new URL(href, here.origin).href,
  target,
  hasAttribute: (name) => name in attrs,
  getAttribute: (name) => attrs[name] ?? null,
  closest: () => (optedOut ? {} : null),
});

describe('getTransitionHref', () => {
  it('transitions a plain click to another page', () => {
    expect(getTransitionHref(anchor('/about/'), click(), here)).toBe('/about/');
  });

  it('keeps the query string and hash', () => {
    expect(getTransitionHref(anchor('/#contact'), click(), here)).toBe(
      '/#contact'
    );
    expect(getTransitionHref(anchor('/blog/?tag=rcf'), click(), here)).toBe(
      '/blog/?tag=rcf'
    );
  });

  it('ignores links to the current page, with or without a trailing slash', () => {
    expect(getTransitionHref(anchor('/content-hub'), click(), here)).toBeNull();
    expect(
      getTransitionHref(anchor('/content-hub/#books'), click(), here)
    ).toBeNull();
  });

  it('ignores modified, non-primary and already-handled clicks', () => {
    const link = anchor('/about/');
    expect(getTransitionHref(link, click({ metaKey: true }), here)).toBeNull();
    expect(getTransitionHref(link, click({ ctrlKey: true }), here)).toBeNull();
    expect(getTransitionHref(link, click({ shiftKey: true }), here)).toBeNull();
    expect(getTransitionHref(link, click({ button: 1 }), here)).toBeNull();
    expect(
      getTransitionHref(link, click({ defaultPrevented: true }), here)
    ).toBeNull();
  });

  it('ignores external links, new tabs, downloads and files', () => {
    expect(
      getTransitionHref(anchor('https://fluxline.pro/'), click(), here)
    ).toBeNull();
    expect(
      getTransitionHref(anchor('/about/', { target: '_blank' }), click(), here)
    ).toBeNull();
    expect(
      getTransitionHref(
        anchor('/about/', { attrs: { download: '' } }),
        click(),
        here
      )
    ).toBeNull();
    expect(getTransitionHref(anchor('/llms.txt'), click(), here)).toBeNull();
    expect(
      getTransitionHref(
        anchor('mailto:terence@terencewaters.com'),
        click(),
        here
      )
    ).toBeNull();
  });

  it('respects the opt-out attribute and disabled links', () => {
    expect(
      getTransitionHref(anchor('/about/', { optedOut: true }), click(), here)
    ).toBeNull();
    expect(
      getTransitionHref(
        anchor('/about/', { attrs: { 'aria-disabled': 'true' } }),
        click(),
        here
      )
    ).toBeNull();
  });
});
