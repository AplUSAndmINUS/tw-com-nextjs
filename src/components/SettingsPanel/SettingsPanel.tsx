'use client';

/**
 * SettingsPanel Component
 * Comprehensive settings panel for user preferences.
 * Adapted from fluxline-pro-next's settings-panel component.
 */

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';
import type { ThemeMode } from '@/store/userPreferencesStore';
import { Typography } from '../Typography';
import { Select } from '../Form/Select/Select';
import { Input } from '../Form/Input/Input';
import { FluentIcon } from '../FluentIcon';
import { useForceDarkDetection } from '@/hooks/useForceDarkDetection';
import { DismissIcon } from '@/components/icons';
import styles from './SettingsPanel.module.scss';

interface SettingsPanelProps {
  onClose?: () => void;
}

// Simple row component for each setting
function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.row}>
      {label && description && (
        <div className={styles.rowText}>
          <Typography
            variant='label'
            className={styles.rowLabel}
          >
            {label}
          </Typography>
          {description && (
            <Typography
              variant='label'
              className={styles.rowDescription}
            >
              {description}
            </Typography>
          )}
        </div>
      )}
      <div className={styles.rowControl}>{children}</div>
    </div>
  );
}

// Themes that conflict with Chrome's Auto Dark Mode: they render light colors
// which Chrome then forcibly inverts, producing a visible "flash".
const FORCE_DARK_INCOMPATIBLE_THEMES: ThemeMode[] = [
  'light',
  'grayscale',
  'protanopia',
  'deuteranopia',
  'tritanopia',
];

const ALL_THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'dark', label: 'Dark Mode' },
  { value: 'light', label: 'Light Mode' },
  { value: 'high-contrast', label: 'High Contrast' },
  { value: 'grayscale', label: 'Grayscale Light' },
  { value: 'grayscale-dark', label: 'Grayscale Dark' },
  { value: 'protanopia', label: 'Protanopia (Red-blind)' },
  { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
  { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
];

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const {
    theme,
    themeMode,
    setThemeMode,
    fontScale,
    setFontScale,
    layoutPreference,
    setLayoutPreference,
    reducedMotion,
    setReducedMotion,
    reducedTransparency,
    setReducedTransparency,
  } = useAppTheme();
  const { preferences, resetPreferences } = useUserPreferencesStore();
  const { isForceDarkActive } = useForceDarkDetection();

  // When Chrome's force-dark is active and the user is on an incompatible theme,
  // silently switch to high-contrast before the browser paints so the Select
  // controlled value is never out of sync with the restricted options list.
  React.useLayoutEffect(() => {
    if (
      isForceDarkActive &&
      FORCE_DARK_INCOMPATIBLE_THEMES.includes(themeMode)
    ) {
      setThemeMode('high-contrast');
    }
  }, [isForceDarkActive, themeMode, setThemeMode]);

  const handleResetSettings = () => {
    if (
      window.confirm('Reset all settings to defaults? This cannot be undone.')
    ) {
      resetPreferences();
    }
  };

  // When Chrome's Auto Dark Mode is active, restrict to High Contrast only to
  // prevent the visual flash that occurs when light/colorblind themes are applied.
  const themeOptions = isForceDarkActive
    ? ALL_THEME_OPTIONS.filter((opt) => opt.value === 'high-contrast')
    : ALL_THEME_OPTIONS;

  const isDark =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

  const panelBg = isDark
    ? theme.semanticColors.background.elevated
    : theme.semanticColors.background.base;
  const headerBorderColor = theme.semanticColors.border.default;
  const headingColor = theme.semanticColors.text.heading;
  const textColor = theme.semanticColors.text.primary;
  const labelColor = theme.semanticColors.text.muted;
  const sectionHeadingColor = theme.semanticColors.text.heading;

  return (
    <div
      className={styles.panel}
      style={{ background: panelBg }}
      aria-label='Settings panel'
    >
      {/* Header */}
      <div
        className={styles.header}
        style={{ borderBottom: `1px solid ${headerBorderColor}` }}
      >
        <div className={styles.headerRow}>
          <Typography
            variant='h3'
            className={styles.title}
            style={{ color: headingColor }}
          >
            Settings
          </Typography>
          {onClose && (
            <button
              type='button'
              className={styles.closeBtn}
              onClick={onClose}
              aria-label='Close settings'
              style={{
                color: labelColor,
                cursor: 'pointer',
                fontFamily: theme.typography.fonts.body.fontFamily,
                fontSize: '1.25rem',
                outlineColor: theme.semanticColors.focus.ring,
              }}
            >
              <FluentIcon
                iconName={DismissIcon} size={32}
                color={theme.palette.neutralTertiary}
              />
            </button>
          )}
        </div>
        <Typography
          variant='body'
          className={styles.subtitle}
          style={{ color: labelColor }}
        >
          Customize your experience
        </Typography>
      </div>

      {/* Settings Content */}
      <div
        className={styles.content}
        style={{ color: textColor }}
      >
        {/* Appearance Section */}
        <section className={styles.section}>
          <Typography
            variant='h3'
            className={styles.sectionHeading}
            style={{ color: sectionHeadingColor, marginBottom: 0 }}
          >
            Appearance
          </Typography>

          <SettingRow label='' description=''>
            <Select
              options={themeOptions.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
              className={styles.select}
              style={{
                background: isDark
                  ? theme.semanticColors.background.muted
                  : theme.semanticColors.background.elevated,
                color: textColor,
                border: `1px solid ${theme.semanticColors.border.default}`,
              }}
              aria-label='Select theme'
            />
          </SettingRow>

          {isForceDarkActive && (
            <div
              className={styles.forceDarkNote}
              style={{
                background: isDark
                  ? theme.semanticColors.background.muted
                  : theme.semanticColors.background.elevated,
                border: `1px solid ${theme.semanticColors.border.default}`,
                color: labelColor,
              }}
              role='note'
              aria-label='Chrome Auto Dark Mode notice'
            >
              <span
                className={styles.noteStrong}
                style={{ color: theme.semanticColors.text.primary }}
              >
                Chrome Auto Dark Mode detected.
              </span>{' '}
              Your browser is forcing dark colors on all web content
              (chrome://flags/#enable-force-dark). Theme options are restricted
              to High Contrast to prevent visual flicker.
            </div>
          )}

          <SettingRow
            label='Font Size'
            description={`${Math.round(fontScale * 100)}%`}
          >
            <div className={styles.fontRow}>
              <span
                className={styles.fontSmall}
                style={{ color: labelColor }}
              >
                A
              </span>
              <Input
                type='range'
                min={preferences.minFontScale}
                max={preferences.maxFontScale}
                step={0.05}
                value={fontScale}
                onChange={(e) => setFontScale(parseFloat(e.target.value))}
                className={styles.range}
                style={
                  {
                    accentColor: theme.semanticColors.link.default,
                    background: `linear-gradient(to right, ${theme.semanticColors.link.default} 0%, ${theme.semanticColors.link.default} ${((fontScale - preferences.minFontScale) / (preferences.maxFontScale - preferences.minFontScale)) * 100}%, ${isDark ? theme.semanticColors.background.muted : theme.semanticColors.border.default} ${((fontScale - preferences.minFontScale) / (preferences.maxFontScale - preferences.minFontScale)) * 100}%, ${isDark ? theme.semanticColors.background.muted : theme.semanticColors.border.default} 100%)`,
                  } as React.CSSProperties
                }
                aria-label='Font size'
              />
              <span className={styles.fontLarge} style={{ color: labelColor }}>
                A
              </span>
            </div>
          </SettingRow>
        </section>

        {/* Layout Section */}
        <section className={styles.section}>
          <Typography
            variant='h3'
            className={styles.sectionHeading}
            style={{ color: sectionHeadingColor }}
          >
            Layout
          </Typography>

          <SettingRow
            label='Navigation Side'
            description='Choose navigation panel position'
          >
            <div className={styles.layoutButtons}>
              <button
                className={styles.layoutBtn}
                style={{
                  background:
                    layoutPreference === 'right-handed'
                      ? theme.semanticColors.link.default
                      : 'transparent',
                  color:
                    layoutPreference === 'right-handed'
                      ? theme.semanticColors.background.base
                      : labelColor,
                  border: `1px solid ${theme.semanticColors.border.default}`,
                  fontFamily: theme.typography.fonts.body.fontFamily,
                  outlineColor: theme.semanticColors.focus.ring,
                }}
                onClick={() => setLayoutPreference('right-handed')}
                aria-pressed={layoutPreference === 'right-handed'}
              >
                Right (Default)
              </button>
              <button
                className={styles.layoutBtn}
                style={{
                  background:
                    layoutPreference === 'left-handed'
                      ? theme.semanticColors.link.default
                      : 'transparent',
                  color:
                    layoutPreference === 'left-handed'
                      ? theme.semanticColors.background.base
                      : labelColor,
                  border: `1px solid ${theme.semanticColors.border.default}`,
                  fontFamily: theme.typography.fonts.body.fontFamily,
                  outlineColor: theme.semanticColors.focus.ring,
                }}
                onClick={() => setLayoutPreference('left-handed')}
                aria-pressed={layoutPreference === 'left-handed'}
              >
                Left-handed
              </button>
            </div>
          </SettingRow>
        </section>

        {/* Accessibility Section */}
        <section className={styles.section}>
          <Typography
            variant='h3'
            className={styles.sectionHeading}
            style={{ color: sectionHeadingColor }}
          >
            Accessibility
          </Typography>

          <SettingRow
            label='High Contrast'
            description='Increase contrast for better visibility'
          >
            <button
              type='button'
              role='switch'
              aria-checked={themeMode === 'high-contrast'}
              className={styles.toggle}
              style={{
                background:
                  themeMode === 'high-contrast'
                    ? theme.semanticColors.link.default
                    : isDark
                      ? theme.semanticColors.background.muted
                      : theme.semanticColors.border.default,
                outlineColor: theme.semanticColors.focus.ring,
              }}
              onClick={() =>
                setThemeMode(
                  themeMode === 'high-contrast' ? 'dark' : 'high-contrast'
                )
              }
              aria-label='Toggle high contrast'
            >
              <span
                className={`${styles.knob} ${themeMode === 'high-contrast' ? styles.knobOn : ''}`}
              />
            </button>
          </SettingRow>

          <SettingRow
            label='Reduce Motion'
            description='Minimize animations and transitions'
          >
            <button
              type='button'
              role='switch'
              aria-checked={reducedMotion}
              className={styles.toggle}
              style={{
                background: reducedMotion
                  ? theme.semanticColors.link.default
                  : isDark
                    ? theme.semanticColors.background.muted
                    : theme.semanticColors.border.default,
                outlineColor: theme.semanticColors.focus.ring,
              }}
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-label='Toggle reduced motion'
            >
              <span
                className={`${styles.knob} ${reducedMotion ? styles.knobOn : ''}`}
              />
            </button>
          </SettingRow>

          <SettingRow
            label='Reduce Transparency'
            description='Remove blur and transparency effects'
          >
            <button
              type='button'
              role='switch'
              aria-checked={reducedTransparency}
              className={styles.toggle}
              style={{
                background: reducedTransparency
                  ? theme.semanticColors.link.default
                  : isDark
                    ? theme.semanticColors.background.muted
                    : theme.semanticColors.border.default,
                outlineColor: theme.semanticColors.focus.ring,
              }}
              onClick={() => setReducedTransparency(!reducedTransparency)}
              aria-label='Toggle reduced transparency'
            >
              <span
                className={`${styles.knob} ${reducedTransparency ? styles.knobOn : ''}`}
              />
            </button>
          </SettingRow>
        </section>
      </div>

      {/* Footer */}
      <div
        className={styles.footer}
        style={{ borderTop: `1px solid ${headerBorderColor}` }}
      >
        <button
          type='button'
          className={styles.resetBtn}
          style={{
            color: theme.palette.redDark,
            border: `1px solid ${theme.palette.redDark}`,
            fontFamily: theme.typography.fonts.body.fontFamily,
            outlineColor: theme.semanticColors.focus.ring,
          }}
          onClick={handleResetSettings}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

export default SettingsPanel;
