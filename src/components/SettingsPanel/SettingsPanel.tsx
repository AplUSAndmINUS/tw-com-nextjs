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
    <div className='flex items-center justify-between gap-4 py-3 border-t border-[rgba(128,128,128,0.15)] first:border-t-0'>
      <div className='flex min-w-0 flex-1 flex-col gap-[0.15rem]'>
        <span className='text-[0.9375rem] font-medium leading-[1.3]'>
          {label}
        </span>
        {description && (
          <span className='text-[0.8125rem] leading-[1.4] opacity-80'>
            {description}
          </span>
        )}
      </div>
      <div className='shrink-0'>{children}</div>
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
      window.confirm('Reset all settings to defaults? This cannot be undone.')
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
    ? theme.semanticColors.background.elevated
    : theme.semanticColors.background.base;
  const headerBorderColor = theme.semanticColors.border.default;
  const headingColor = theme.semanticColors.text.heading;
  const textColor = theme.semanticColors.text.primary;
  const labelColor = theme.semanticColors.text.muted;
  const sectionHeadingColor = theme.semanticColors.text.heading;

  return (
    <div
      className='h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden'
      style={{ background: panelBg }}
      role='dialog'
      aria-modal='true'
      aria-label='Settings panel'
    >
      {/* Header */}
      <div
        className='shrink-0 px-8 py-6'
        style={{ borderBottom: `1px solid ${headerBorderColor}` }}
      >
        <div className='mb-1 flex items-center justify-between gap-2'>
          <h2
            className='m-0 text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold leading-[1.2]'
            style={{ color: headingColor }}
          >
            Settings
          </h2>
          {onClose && (
            <button
              className='shrink-0 rounded bg-transparent px-2 py-1 text-lg leading-none transition-opacity duration-150 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
              onClick={onClose}
              aria-label='Close settings'
              style={{ color: labelColor }}
            >
              ✕
            </button>
          )}
        </div>
        <p className='m-0 text-sm leading-[1.4]' style={{ color: labelColor }}>
          Customize your experience
        </p>
      </div>

      {/* Settings Content */}
      <div
        className='flex-1 overflow-x-hidden overflow-y-auto px-8 py-6'
        style={{ color: textColor }}
      >
        {/* Appearance Section */}
        <section className='mb-8 last:mb-0'>
          <h3
            className='mb-4 text-[0.9375rem] font-semibold uppercase tracking-[0.05em]'
            style={{ color: sectionHeadingColor }}
          >
            Appearance
          </h3>

          <SettingRow label='Theme' description='Choose your color theme'>
            <select
              value={themeMode}
              onChange={(e) => setThemeMode(e.target.value as ThemeMode)}
              className='min-w-40 cursor-pointer rounded-md px-[0.6rem] py-[0.4rem] text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
              style={{
                background: isDark
                  ? theme.semanticColors.background.muted
                  : theme.semanticColors.background.elevated,
                color: textColor,
                border: `1px solid ${theme.semanticColors.border.default}`,
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
            <div className='flex items-center gap-2'>
              <span
                className='text-xs font-medium'
                style={{ color: labelColor }}
              >
                A
              </span>
              <input
                type='range'
                min={preferences.minFontScale}
                max={preferences.maxFontScale}
                step={0.05}
                value={fontScale}
                onChange={(e) => setFontScale(parseFloat(e.target.value))}
                className='h-[6px] w-[120px] cursor-pointer appearance-none rounded'
                style={
                  {
                    accentColor: theme.semanticColors.link.default,
                    background: `linear-gradient(to right, ${theme.semanticColors.link.default} 0%, ${theme.semanticColors.link.default} ${((fontScale - preferences.minFontScale) / (preferences.maxFontScale - preferences.minFontScale)) * 100}%, ${isDark ? theme.semanticColors.background.muted : theme.semanticColors.border.default} ${((fontScale - preferences.minFontScale) / (preferences.maxFontScale - preferences.minFontScale)) * 100}%, ${isDark ? theme.semanticColors.background.muted : theme.semanticColors.border.default} 100%)`,
                  } as React.CSSProperties
                }
                aria-label='Font size'
              />
              <span className='text-lg font-bold' style={{ color: labelColor }}>
                A
              </span>
            </div>
          </SettingRow>
        </section>

        {/* Layout Section */}
        <section className='mb-8 last:mb-0'>
          <h3
            className='mb-4 text-[0.9375rem] font-semibold uppercase tracking-[0.05em]'
            style={{ color: sectionHeadingColor }}
          >
            Layout
          </h3>

          <SettingRow
            label='Navigation Side'
            description='Choose navigation panel position'
          >
            <div className='flex gap-1'>
              <button
                className='cursor-pointer rounded-md px-[0.6rem] py-[0.35rem] text-[0.8125rem] font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
                style={
                  layoutPreference === 'right-handed'
                    ? {
                        background: theme.semanticColors.link.default,
                        color: theme.semanticColors.selection.text,
                        border: `1px solid ${theme.semanticColors.link.default}`,
                      }
                    : {
                        background: 'transparent',
                        color: labelColor,
                        border: `1px solid ${theme.semanticColors.border.default}`,
                      }
                }
                onClick={() => setLayoutPreference('right-handed')}
                aria-pressed={layoutPreference === 'right-handed'}
              >
                Right (Default)
              </button>
              <button
                className='cursor-pointer rounded-md px-[0.6rem] py-[0.35rem] text-[0.8125rem] font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
                style={
                  layoutPreference === 'left-handed'
                    ? {
                        background: theme.semanticColors.link.default,
                        color: theme.semanticColors.selection.text,
                        border: `1px solid ${theme.semanticColors.link.default}`,
                      }
                    : {
                        background: 'transparent',
                        color: labelColor,
                        border: `1px solid ${theme.semanticColors.border.default}`,
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
        <section className='mb-8 last:mb-0'>
          <h3
            className='mb-4 text-[0.9375rem] font-semibold uppercase tracking-[0.05em]'
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
              className='relative h-6 w-11 shrink-0 cursor-pointer rounded-xl p-0 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
              style={
                reducedMotion
                  ? {
                      background: theme.semanticColors.link.default,
                    }
                  : {
                      background: isDark
                        ? theme.semanticColors.background.muted
                        : theme.semanticColors.border.default,
                    }
              }
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-label='Toggle reduced motion'
            >
              <span
                className={`pointer-events-none absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform duration-200 ${reducedMotion ? 'translate-x-5' : ''}`}
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
              className='relative h-6 w-11 shrink-0 cursor-pointer rounded-xl p-0 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
              style={
                themeMode === 'high-contrast'
                  ? {
                      background: theme.semanticColors.link.default,
                    }
                  : {
                      background: isDark
                        ? theme.semanticColors.background.muted
                        : theme.semanticColors.border.default,
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
                className={`pointer-events-none absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform duration-200 ${themeMode === 'high-contrast' ? 'translate-x-5' : ''}`}
              />
            </button>
          </SettingRow>
        </section>
      </div>

      {/* Footer */}
      <div
        className='shrink-0 px-8 py-5'
        style={{ borderTop: `1px solid ${headerBorderColor}` }}
      >
        <button
          className='w-full cursor-pointer rounded-lg bg-transparent px-4 py-[0.65rem] text-sm font-semibold transition-opacity duration-200 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
          style={{
            color: theme.palette.redDark,
            border: `1px solid ${theme.palette.redDark}`,
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
