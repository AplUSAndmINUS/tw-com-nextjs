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
    <div className={styles.settingRow}>
      <div className={styles.settingLabel}>
        <span className={styles.settingTitle}>{label}</span>
        {description && (
          <span className={styles.settingDesc}>{description}</span>
        )}
      </div>
      <div className={styles.settingControl}>{children}</div>
    </div>
  );
}

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
  } = useAppTheme();
  const { preferences, resetPreferences } = useUserPreferencesStore();

  const handleResetSettings = () => {
    if (
      window.confirm(
        'Reset all settings to defaults? This cannot be undone.'
      )
    ) {
      resetPreferences();
    }
  };

  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'dark', label: 'Dark Mode' },
    { value: 'light', label: 'Light Mode' },
    { value: 'high-contrast', label: 'High Contrast' },
    { value: 'grayscale', label: 'Grayscale Light' },
    { value: 'grayscale-dark', label: 'Grayscale Dark' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  ];

  const isDark =
    themeMode === 'dark' ||
    themeMode === 'high-contrast' ||
    themeMode === 'grayscale-dark';

  const panelBg = isDark
    ? theme.colorNeutralBackground2
    : theme.colorNeutralBackground1;
  const headerBorderColor = theme.colorNeutralStroke2;
  const headingColor = theme.colorBrandForeground1;
  const textColor = theme.colorNeutralForeground1;
  const labelColor = theme.colorNeutralForeground2;
  const sectionHeadingColor = theme.colorNeutralForeground1;

  return (
    <div
      className={styles.settingsPanel}
      style={{ background: panelBg }}
      role='dialog'
      aria-modal='true'
      aria-label='Settings panel'
    >
      {/* Header */}
      <div
        className={styles.settingsHeader}
        style={{ borderBottom: `1px solid ${headerBorderColor}` }}
      >
        <div className={styles.settingsHeaderRow}>
          <h2 className={styles.settingsTitle} style={{ color: headingColor }}>
            Settings
          </h2>
          {onClose && (
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label='Close settings'
              style={{ color: labelColor }}
            >
              ✕
            </button>
          )}
        </div>
        <p className={styles.settingsSubtitle} style={{ color: labelColor }}>
          Customize your experience
        </p>
      </div>

      {/* Settings Content */}
      <div className={styles.settingsContent}>
        {/* Appearance Section */}
        <section className={styles.section}>
          <h3
            className={styles.sectionHeading}
            style={{ color: sectionHeadingColor }}
          >
            Appearance
          </h3>

          <SettingRow
            label='Theme'
            description='Choose your color theme'
          >
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
              className={styles.select}
              style={{
                background: isDark
                  ? theme.colorNeutralBackground3
                  : theme.colorNeutralBackground1,
                color: textColor,
                border: `1px solid ${theme.colorNeutralStroke2}`,
              }}
              aria-label='Select theme'
            >
              {themeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow
            label='Font Size'
            description={`${Math.round(fontScale * 100)}%`}
          >
            <div className={styles.sliderWrapper}>
              <span className={styles.sliderMin} style={{ color: labelColor }}>
                A
              </span>
              <input
                type='range'
                min={preferences.minFontScale}
                max={preferences.maxFontScale}
                step={0.05}
                value={fontScale}
                onChange={(e) => setFontScale(parseFloat(e.target.value))}
                className={styles.slider}
                style={
                  {
                    '--slider-fill': theme.colorBrandBackground,
                    '--slider-track': isDark
                      ? theme.colorNeutralBackground4
                      : theme.colorNeutralStroke2,
                  } as React.CSSProperties
                }
                aria-label='Font size'
              />
              <span className={styles.sliderMax} style={{ color: labelColor }}>
                A
              </span>
            </div>
          </SettingRow>
        </section>

        {/* Layout Section */}
        <section className={styles.section}>
          <h3
            className={styles.sectionHeading}
            style={{ color: sectionHeadingColor }}
          >
            Layout
          </h3>

          <SettingRow
            label='Navigation Side'
            description='Choose navigation panel position'
          >
            <div className={styles.segmentedControl}>
              <button
                className={`${styles.segmentButton} ${layoutPreference === 'right-handed' ? styles.segmentActive : ''}`}
                style={
                  layoutPreference === 'right-handed'
                    ? {
                        background: theme.colorBrandBackground,
                        color: theme.colorNeutralForegroundOnBrand,
                        border: `1px solid ${theme.colorBrandBackground}`,
                      }
                    : {
                        background: 'transparent',
                        color: labelColor,
                        border: `1px solid ${theme.colorNeutralStroke2}`,
                      }
                }
                onClick={() => setLayoutPreference('right-handed')}
                aria-pressed={layoutPreference === 'right-handed'}
              >
                Right (Default)
              </button>
              <button
                className={`${styles.segmentButton} ${layoutPreference === 'left-handed' ? styles.segmentActive : ''}`}
                style={
                  layoutPreference === 'left-handed'
                    ? {
                        background: theme.colorBrandBackground,
                        color: theme.colorNeutralForegroundOnBrand,
                        border: `1px solid ${theme.colorBrandBackground}`,
                      }
                    : {
                        background: 'transparent',
                        color: labelColor,
                        border: `1px solid ${theme.colorNeutralStroke2}`,
                      }
                }
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
          <h3
            className={styles.sectionHeading}
            style={{ color: sectionHeadingColor }}
          >
            Accessibility
          </h3>

          <SettingRow
            label='Reduce Motion'
            description='Minimize animations and transitions'
          >
            <button
              role='switch'
              aria-checked={reducedMotion}
              className={`${styles.toggle} ${reducedMotion ? styles.toggleOn : ''}`}
              style={
                reducedMotion
                  ? {
                      background: theme.colorBrandBackground,
                    }
                  : {
                      background: isDark
                        ? theme.colorNeutralBackground4
                        : theme.colorNeutralStroke2,
                    }
              }
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-label='Toggle reduced motion'
            >
              <span
                className={`${styles.toggleThumb} ${reducedMotion ? styles.toggleThumbOn : ''}`}
              />
            </button>
          </SettingRow>

          <SettingRow
            label='High Contrast'
            description='Increase contrast for better visibility'
          >
            <button
              role='switch'
              aria-checked={themeMode === 'high-contrast'}
              className={`${styles.toggle} ${themeMode === 'high-contrast' ? styles.toggleOn : ''}`}
              style={
                themeMode === 'high-contrast'
                  ? {
                      background: theme.colorBrandBackground,
                    }
                  : {
                      background: isDark
                        ? theme.colorNeutralBackground4
                        : theme.colorNeutralStroke2,
                    }
              }
              onClick={() =>
                setThemeMode(
                  themeMode === 'high-contrast' ? 'dark' : 'high-contrast'
                )
              }
              aria-label='Toggle high contrast'
            >
              <span
                className={`${styles.toggleThumb} ${themeMode === 'high-contrast' ? styles.toggleThumbOn : ''}`}
              />
            </button>
          </SettingRow>
        </section>
      </div>

      {/* Footer */}
      <div
        className={styles.settingsFooter}
        style={{ borderTop: `1px solid ${headerBorderColor}` }}
      >
        <button
          className={styles.resetButton}
          style={{
            color: theme.colorStatusDangerForeground1,
            border: `1px solid ${theme.colorStatusDangerForeground1}`,
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
