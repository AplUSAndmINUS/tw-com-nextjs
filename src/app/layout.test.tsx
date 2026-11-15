import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { ReactElement, ReactNode } from 'react';

// next/font only works inside Next's compiler; the class names are irrelevant.
vi.mock('./fonts', () => ({ fontVariables: 'fonts' }));
// Providers is only referenced as an element type here, never rendered.
// Mocking it keeps the whole app shell out of the import graph, which
// otherwise made each fresh import of the layout take seconds.
vi.mock('./providers', () => ({
  Providers: ({ children }: { children: ReactNode }) => children,
}));

type El = ReactElement<Record<string, unknown> & { children?: ReactNode }>;

const toArray = (node: ReactNode): El[] =>
  ([] as ReactNode[]).concat(node).filter(Boolean) as El[];

/** The elements RootLayout puts in <head>, imported fresh for the given env. */
async function headChildren(gtmId = '') {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_GTM_ID', gtmId);
  const { default: RootLayout } = await import('./layout');
  const html = RootLayout({ children: null }) as El;
  const head = toArray(html.props.children).find((el) => el.type === 'head');
  if (!head) throw new Error('RootLayout rendered no <head>');
  return toArray(head.props.children);
}

const inlineScripts = (children: El[]) =>
  children.filter(
    (el) => el.type === 'script' && 'dangerouslySetInnerHTML' in el.props
  );

// The first import transforms the layout's dependency graph: a one-time cost
// of a few seconds when the whole suite runs in parallel. Paying it here,
// with a generous hook timeout, keeps it out of the individual tests (which
// then re-import from the transform cache in milliseconds).
beforeAll(async () => {
  await import('./layout');
}, 30_000);

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('RootLayout <head> scripts', () => {
  it.each([
    ['without GTM', ''],
    ['with GTM', 'GTM-TEST123'],
  ])(
    'every inline script suppresses hydration warnings (%s)',
    async (_, gtmId) => {
      // Google's loaders insert a script (with no `async` attribute) before
      // the first <script> ahead of hydration. React 19 pairs it with the
      // first head script and shifts the rest, so each one needs the flag,
      // including any added later.
      const scripts = inlineScripts(await headChildren(gtmId));
      expect(scripts.length).toBeGreaterThan(0);
      for (const script of scripts) {
        expect(script.props.suppressHydrationWarning).toBe(true);
      }
    }
  );

  it('renders the GTM snippet only when an ID is set', async () => {
    const ids = async (gtmId: string) =>
      inlineScripts(await headChildren(gtmId)).map((el) => el.props.id);
    expect(await ids('')).not.toContain('gtm-script');
    expect(await ids('GTM-TEST123')).toContain('gtm-script');
  });

  it('keeps the theme script first and the load order unchanged', async () => {
    const children = await headChildren('GTM-TEST123');
    // The theme script must run before first paint.
    const html = (el: El) =>
      (el.props.dangerouslySetInnerHTML as { __html?: string } | undefined)
        ?.__html ?? '';
    expect(children[0].type).toBe('script');
    expect(html(children[0])).toContain('data-theme');

    // Consent Mode defaults before GTM, and the AdSense loader last. The
    // hydration fix must not reorder these.
    const consent = children.findIndex((el) =>
      html(el).includes("gtag('consent', 'default'")
    );
    const gtm = children.findIndex((el) => el.props.id === 'gtm-script');
    const adsense = children.findIndex(
      (el) => typeof el.type === 'function' && el.type.name === 'AdSenseScript'
    );
    expect(consent).toBeGreaterThan(0);
    expect(gtm).toBeGreaterThan(consent);
    expect(adsense).toBe(children.length - 1);
  });
});
