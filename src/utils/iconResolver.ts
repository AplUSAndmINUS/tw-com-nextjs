/**
 * Icon Name Resolver for Fluent UI Icons
 *
 * Maps string icon names to Fluent UI v9 icon components.
 * This is useful for scenarios where icon names come from configuration or content.
 */

import * as FluentIcons from '@fluentui/react-icons';

export type FluentIconName = keyof typeof FluentIcons;

/**
 * Resolves a string icon name to a Fluent UI icon component
 * @param iconName - String name of the icon (e.g., "DocumentText24Regular")
 * @returns The icon component or undefined if not found
 */
export function resolveIconName(
  iconName: string | undefined
): React.ComponentType<any> | undefined {
  if (!iconName) return undefined;

  // Check if the icon exists in Fluent Icons
  const icon = (FluentIcons as any)[iconName];

  if (!icon) {
    console.warn(`Icon "${iconName}" not found in @fluentui/react-icons`);
    return undefined;
  }

  return icon;
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
