'use client';

/**
 * TerenceWaters.com Theme Switcher Component
 * ===========================================
 *
 * A dropdown component for switching between all 8 theme variants.
 * Provides accessible theme selection with proper labeling.
 *
 * Usage:
 * ```tsx
 * import { ThemeSwitcher } from '@/components/ThemeSwitcher';
 *
 * function Header() {
 *   return (
 *     <header>
 *       <ThemeSwitcher />
 *     </header>
 *   );
 * }
 * ```
 */

import {
  Dropdown,
  Option,
  makeStyles,
  Text,
  tokens,
} from '@fluentui/react-components';
import { useAppTheme } from '@/theme';
import { ThemeMode } from '@/theme';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  dropdown: {
    minWidth: '200px',
  },
});

// Theme labels for display
const themeLabels: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  'high-contrast': 'High Contrast',
  protanopia: 'Protanopia (Red-Blind)',
  deuteranopia: 'Deuteranopia (Green-Blind)',
  tritanopia: 'Tritanopia (Blue-Blind)',
  grayscale: 'Grayscale',
  'grayscale-dark': 'Grayscale Dark',
};

interface ThemeSwitcherProps {
  /** Optional label for the dropdown */
  label?: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Theme switcher dropdown component
 */
export function ThemeSwitcher({
  label = 'Theme',
  className,
}: ThemeSwitcherProps) {
  const styles = useStyles();
  const { themeMode, setThemeMode } = useAppTheme();

  const handleThemeChange = (_: unknown, data: { optionValue?: string }) => {
    if (data.optionValue && data.optionValue in themeLabels) {
      setThemeMode(data.optionValue as ThemeMode);
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Text weight='semibold'>{label}</Text>
      <Dropdown
        className={styles.dropdown}
        value={themeLabels[themeMode]}
        selectedOptions={[themeMode]}
        onOptionSelect={handleThemeChange}
        aria-label='Select theme'
      >
        {Object.entries(themeLabels).map(([mode, label]) => (
          <Option key={mode} value={mode}>
            {label}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
}
