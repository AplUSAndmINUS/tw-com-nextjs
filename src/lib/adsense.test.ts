import { describe, it, expect } from 'vitest';
import { isAdsAllowedPath } from './adsense';

describe('isAdsAllowedPath', () => {
  it('excludes the home page', () => {
    expect(isAdsAllowedPath('/')).toBe(false);
  });

  it('excludes the configured routes', () => {
    for (const path of [
      '/about',
      '/books',
      '/case-studies',
      '/contact',
      '/portfolio',
      '/services',
    ]) {
      expect(isAdsAllowedPath(path)).toBe(false);
    }
  });

  it('excludes nested pages under an excluded route', () => {
    expect(isAdsAllowedPath('/portfolio/some-project')).toBe(false);
    expect(isAdsAllowedPath('/about/')).toBe(false);
  });

  it('allows everything else, including /github', () => {
    for (const path of [
      '/github',
      '/blog',
      '/blog/some-post',
      '/podcasts',
      '/videos/abc123',
      '/content-hub',
    ]) {
      expect(isAdsAllowedPath(path)).toBe(true);
    }
  });

  it('does not treat an excluded prefix as a substring match', () => {
    expect(isAdsAllowedPath('/about-me')).toBe(true);
    expect(isAdsAllowedPath('/contact-form-notes')).toBe(true);
  });

  it('denies when the pathname is unavailable', () => {
    expect(isAdsAllowedPath(null)).toBe(false);
    expect(isAdsAllowedPath('')).toBe(false);
  });
});
