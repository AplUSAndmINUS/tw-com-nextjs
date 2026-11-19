import { describe, expect, it } from 'vitest';
import {
  CONTACT_NAV_HREF,
  ROUTES,
  SITE_NAV_CTA,
  SITE_NAV_LINKS,
  activeNavHref,
} from './navigation';

describe('site navigation', () => {
  it('is About · The Book · Content · Contact (Decision A: About is /about/)', () => {
    expect(SITE_NAV_LINKS.map((l) => `${l.label} ${l.href}`)).toEqual([
      'About /about/',
      'The Book /resonance-core-framework/',
      'Content /content-hub/',
      'Contact /#contact',
    ]);
  });

  it('lists the content pages under Content, with Content still a link', () => {
    const content = SITE_NAV_LINKS.find((l) => l.label === 'Content');
    expect(content?.href).toBe('/content-hub/');
    expect(content?.children?.map((c) => c.label)).toEqual([
      'Blog',
      'Podcasts',
      'Videos',
      'Portfolio',
      'GitHub',
    ]);
  });

  it('uses trailing slashes on every internal route (before any #anchor)', () => {
    for (const href of Object.values(ROUTES)) {
      expect(href.split('#')[0].endsWith('/')).toBe(true);
    }
  });

  it("sends Contact to the home page's contact section until /contact/ is rebuilt (#281)", () => {
    expect(CONTACT_NAV_HREF).toBe('/#contact');
    // Home has no nav link of its own, so /#contact marks nothing current.
    expect(activeNavHref('/')).toBeUndefined();
    expect(activeNavHref('/#contact')).toBeUndefined();
  });

  it('keeps the /contact/ routes ready for the rebuilt page (Slice 5)', () => {
    expect(ROUTES.contact).toBe('/contact/');
    expect(ROUTES.conversation).toBe('/contact/#conversation');
    expect(ROUTES.message).toBe('/contact/#message');
    expect(ROUTES.newsletter).toBe('/contact/#newsletter');
  });

  it('pins About so it shows at every width; /about-me stays out of the nav', () => {
    expect(SITE_NAV_LINKS.filter((l) => l.pinned).map((l) => l.href)).toEqual([
      '/about/',
    ]);
    expect(SITE_NAV_LINKS.some((l) => l.href.includes('about-me'))).toBe(false);
  });

  it('has "Book a Conversation" as the one button', () => {
    expect(SITE_NAV_CTA.label).toBe('Book a Conversation');
  });

  it('marks the current page, ignoring trailing slashes and hashes', () => {
    expect(activeNavHref('/about/')).toBe('/about/');
    expect(activeNavHref('/about')).toBe('/about/');
    expect(activeNavHref('/resonance-core-framework/#book')).toBe(
      '/resonance-core-framework/'
    );
    expect(activeNavHref('/')).toBeUndefined();
    // Content sub-pages mark Content.
    expect(activeNavHref('/blog/behavioral-gravity/')).toBe('/content-hub/');
    expect(activeNavHref('/portfolio/')).toBe('/content-hub/');
    // /about-me is not /about.
    expect(activeNavHref('/about-me/')).toBeUndefined();
  });
});
