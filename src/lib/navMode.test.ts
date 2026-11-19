import { describe, expect, it } from 'vitest';
import { mainIdFor, navModeFor } from './navMode';

describe('navModeFor (one nav on every route, Slice 6)', () => {
  it.each([
    '/',
    '/about/',
    '/about-me/',
    '/contact/',
    '/blog/',
    '/blog/some-post/',
    '/content-hub/',
    '/portfolio/',
    '/portfolio/x/',
    '/github/',
    '/resonance-core-framework/',
    '/videos/',
    '/videos/abc/',
    '/no-such-page/',
  ])('%s renders SiteNav in the page', (path) => {
    expect(navModeFor(path)).toBe('page');
    expect(mainIdFor(path)).toBe('main');
  });

  it.each([
    '/podcasts/',
    '/podcasts/theresonantid/',
    '/podcasts/episode-1/',
    '/unsubscribe/',
    '/unsubscribe?x=1',
  ])('%s gets SiteNav in the fixed slot (legacy layout)', (path) => {
    expect(navModeFor(path)).toBe('fixed');
    expect(mainIdFor(path)).toBe('main-content');
  });

  it('keeps the old header only on the internal /dsm-preview page', () => {
    expect(navModeFor('/dsm-preview/')).toBe('legacy');
    expect(mainIdFor('/dsm-preview/')).toBeUndefined();
  });
});
