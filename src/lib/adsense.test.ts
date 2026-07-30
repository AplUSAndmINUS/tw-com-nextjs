import { describe, it, expect } from 'vitest';
import { ADSENSE_PUB_ID, ADSENSE_SCRIPT_SRC } from './adsense';

describe('adsense configuration', () => {
  it('exports the configured publisher id', () => {
    expect(ADSENSE_PUB_ID).toBe('ca-pub-7691902367885014');
  });

  it('builds the loader url with the publisher id', () => {
    expect(ADSENSE_SCRIPT_SRC).toBe(
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`
    );
  });
});
