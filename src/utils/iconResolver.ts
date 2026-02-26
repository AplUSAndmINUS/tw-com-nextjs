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
  blog: 'DocumentText24Regular',
  portfolio: 'BriefcaseMedical24Regular',
  video: 'Video24Regular',
  podcast: 'Mic24Regular',
  home: 'Home24Regular',
  search: 'Search24Regular',
  settings: 'Settings24Regular',
  user: 'Person24Regular',
  edit: 'Edit24Regular',
  delete: 'Delete24Regular',
  add: 'Add24Regular',
  close: 'Dismiss24Regular',
  back: 'ArrowLeft24Regular',
  forward: 'ArrowRight24Regular',
} as const;
