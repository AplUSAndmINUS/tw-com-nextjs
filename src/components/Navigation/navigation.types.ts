/**
 * Navigation Types
 * Type definitions for the TW.com navigation system
 */

export interface NavItem {
  label: string;
  path: string;
  iconName?: string;
  description?: string;
  children?: NavItem[];
}

export interface NavigationMenuProps {
  onClose: () => void;
}
