/**
 * Icon Name Resolver
 *
 * Maps string icon names to components, for cases where the name comes from
 * content or configuration rather than a static import (page frontmatter,
 * navigation config, service definitions).
 *
 * This used to do `import * as FluentIcons from '@fluentui/react-icons'`. A
 * namespace import defeats tree shaking — the bundler must retain the entire
 * package, because any key could be read off the namespace at runtime. The app
 * shipped thousands of glyph modules to service about fifteen string lookups.
 *
 * `ICON_MAP` is an explicit object over the local icon set, so only the glyphs
 * actually referenced are bundled.
 */

import React from 'react';
import { ICON_MAP, type IconProps } from '@/components/icons';

export type FluentIconName = keyof typeof ICON_MAP;

/**
 * Legacy Fluent names encode size in the identifier (`Home32Regular`), while
 * the local icons take a `size` prop. This pulls the number back out so the
 * resolved component renders at the size the old name implied.
 */
const SIZE_IN_NAME = /(\d+)(?:Regular|Filled)$/;

/**
 * Size-bound components are memoised by name.
 *
 * Without this, every call would return a freshly-created component function.
 * React compares component identity to decide whether to update or remount, so
 * a new identity each render would unmount and remount the icon on every parent
 * render — losing any CSS transition and thrashing the DOM.
 */
const resolvedCache = new Map<string, React.ComponentType<IconProps>>();

export function resolveIconName(
  iconName: string | undefined
): React.ComponentType<IconProps> | undefined {
  if (!iconName) return undefined;

  const cached = resolvedCache.get(iconName);
  if (cached) return cached;

  const Base = ICON_MAP[iconName as FluentIconName];

  if (!Base) {
    console.warn(
      `Icon "${iconName}" not found in the local icon set. ` +
        `Add it to src/components/icons and register it in ICON_MAP.`
    );
    return undefined;
  }

  const match = iconName.match(SIZE_IN_NAME);
  const size = match ? Number(match[1]) : 24;

  // Pass size as a default that callers can still override.
  const Bound: React.ComponentType<IconProps> = (props) =>
    React.createElement(Base, { size, ...props });
  Bound.displayName = `ResolvedIcon(${iconName})`;

  resolvedCache.set(iconName, Bound);
  return Bound;
}

/**
 * Common icon name mappings for convenience
 */
export const commonIcons = {
  blog: 'DocumentText32Regular',
  portfolio: 'BriefcaseMedical32Regular',
  video: 'Video32Regular',
  podcast: 'Mic32Regular',
  home: 'Home32Regular',
  search: 'Search32Regular',
  settings: 'Settings32Regular',
  user: 'Person32Regular',
  edit: 'Edit32Regular',
  delete: 'Delete32Regular',
  add: 'Add32Regular',
  close: 'Dismiss32Regular',
  back: 'ArrowLeft32Regular',
  forward: 'ArrowRight32Regular',
} as const;
