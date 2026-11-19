import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * RCF_PREORDERS_OPEN in both states (#273). The other tests run with the
 * switch as committed; these pin what each state renders, so turning the
 * switch on for launch is covered before it ships.
 */
async function withSwitch(open: boolean) {
  vi.resetModules();
  vi.doMock('@/lib/rcf', async (orig) => ({
    ...(await orig<typeof import('@/lib/rcf')>()),
    RCF_PREORDERS_OPEN: open,
  }));
  const [{ FooterContent }, { getRcfBookSchema }] = await Promise.all([
    import('@/components/Footer/FooterContent'),
    import('@/utils/structuredData'),
  ]);
  return { FooterContent, getRcfBookSchema };
}

afterEach(() => {
  vi.doUnmock('@/lib/rcf');
  vi.resetModules();
});

describe('RCF_PREORDERS_OPEN (#273)', () => {
  it('off: no footer store link, and the book description makes no pre-order claim', async () => {
    const { FooterContent, getRcfBookSchema } = await withSwitch(false);
    const html = renderToStaticMarkup(<FooterContent />);
    expect(html).not.toContain('Pre-order the Book');
    expect(html).not.toContain('store.fluxline.pro/book');
    const description = getRcfBookSchema().description;
    expect(description).toMatch(/Targeted for Q1 2027\.$/);
    expect(description).not.toMatch(/pre-?order/i);
  });

  it('on: the footer store link and the pre-order line in the book description come back', async () => {
    const { FooterContent, getRcfBookSchema } = await withSwitch(true);
    const html = renderToStaticMarkup(<FooterContent />);
    expect(html).toContain('Pre-order the Book');
    expect(html).toContain('https://store.fluxline.pro/book');
    expect(getRcfBookSchema().description).toMatch(
      /Targeted for Q1 2027, with pre-orders open on the Fluxline Store\.$/
    );
  });
});

describe('RCF_PREORDERS_OPEN on /about-me (#288)', () => {
  async function aboutMeHtml(open: boolean) {
    vi.resetModules();
    vi.doMock('@/lib/rcf', async (orig) => ({
      ...(await orig<typeof import('@/lib/rcf')>()),
      RCF_PREORDERS_OPEN: open,
    }));
    const { default: AboutMePage } = await import('@/app/about-me/page');
    return renderToStaticMarkup(await AboutMePage());
  }

  it('off: no pre-order quick link, badge, button, fact or store link', async () => {
    const html = await aboutMeHtml(false);
    expect(html).not.toContain('Pre-order my book!');
    expect(html).not.toContain('Pre-orders open');
    expect(html).not.toMatch(/pre-orders open/i);
    expect(html).not.toContain('store.fluxline.pro/book');
    expect(html).toContain('release targeted for Q1 2027');
  });

  it('on: the quick link, badge and author fact come back', async () => {
    const html = await aboutMeHtml(true);
    expect(html).toContain('Pre-order my book!');
    expect(html).toContain('Pre-orders open');
    expect(html).toContain('pre-orders open; release targeted for Q1 2027');
    expect(html).toContain('https://store.fluxline.pro/book');
  });
});
