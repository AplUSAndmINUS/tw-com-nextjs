import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AdSenseScript } from './AdSenseScript';
import { ADSENSE_PUB_ID, ADSENSE_SCRIPT_SRC } from '@/lib/adsense';

describe('AdSenseScript', () => {
  it('renders the shared adsense loader attributes for every page head', () => {
    const markup = renderToStaticMarkup(<AdSenseScript />);

    expect(markup).toMatch(/<script[^>]*\sasync(="")?[^>]*>/);
    expect(markup).toMatch(/<script[^>]*\scrossorigin="anonymous"[^>]*>/);
    expect(markup).toContain(`data-ad-client="${ADSENSE_PUB_ID}"`);
    expect(markup).toContain(`src="${ADSENSE_SCRIPT_SRC}"`);
  });
});
