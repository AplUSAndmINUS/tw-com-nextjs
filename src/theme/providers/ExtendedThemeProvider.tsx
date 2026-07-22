'use client';

/**
 * Extended Theme Provider
 *
 * This used to strip ten non-serializable keys off the theme and hand the rest
 * to Fluent's `<FluentProvider>`, which generated a block of CSS custom
 * properties from them.
 *
 * That whole mechanism is gone. Colour now lives in real CSS custom properties
 * loaded from styles/tokens/*.css and selected by the `data-theme` attribute on
 * <html>, so nothing needs to generate them at runtime. Fluent was only ever
 * acting as a colour generator here — the sole Fluent component mounted in the
 * app was a single `<Spinner>`, since replaced.
 *
 * The component is kept as the theme boundary rather than deleted, so that
 * `providers.tsx` keeps a stable shape and there is somewhere obvious to hang
 * future theme-scoped context. It calls useAppTheme() for its side effects: the
 * hook is what writes data-theme, the `dark` class, color-scheme and the
 * data-tw-* accessibility attributes onto <html>.
 *
 * Components read theme values with useAppTheme(). Those values are
 * `var(--tw-*)` strings, so they resolve against whichever mode is active.
 */

import { useAppTheme } from '../hooks/useAppTheme';

export function ExtendedThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mounted for its DOM side effects — see the hook's attribute-sync effects.
  useAppTheme();

  return <>{children}</>;
}
