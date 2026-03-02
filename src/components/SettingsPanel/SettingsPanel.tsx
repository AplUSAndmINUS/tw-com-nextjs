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
      {label && description && (
        <div className='flex min-w-0 flex-1 flex-col gap-[0.15rem]'>
          <Typography
            variant='label'
            className='text-[0.9375rem] font-medium leading-[1.3]'
          >
            {label}
          </Typography>
          {description && (
            <Typography
              variant='label'
              className='text-[0.8125rem] leading-[1.4] opacity-80'
            >
              {description}
            </Typography>
          )}
        </div>
      )}
      <div className='flex-shrink-0'>{children}</div>
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
      aria-label='Settings panel'
    >
      {/* Header */}
      <div
        className='shrink-0 px-8 py-6'
        style={{ borderBottom: `1px solid ${headerBorderColor}` }}
      >
        <div className='mb-1 flex items-center justify-between gap-2'>
          <Typography
            variant='h3'
            className='m-0 text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold leading-[1.2]'
            style={{ color: headingColor }}
          >
            Settings
          </Typography>
          {onClose && (
            <button
              type='button'
              className='shrink-0 rounded bg-transparent px-2 py-1 text-lg leading-none transition-opacity duration-150 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-0'
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
              <Typography variant='h3' style={{ color: theme.colorPaletteRedForeground1 }}>X</Typography>
            </button>
          )}
        </div>
        <Typography
          variant='body'
          className='m-0'
          style={{ color: labelColor }}
        >
          Customize your experience
        </Typography>
      </div>

      {/* Settings Content */}
      <div
        className='flex-1 overflow-x-hidden overflow-y-auto px-8 py-6'
        style={{ color: textColor }}
      >
        {/* Appearance Section */}
        <section className='mb-8 last:mb-0'>
          <Typography
            variant='h3'
            className='mb-4 text-[0.9375rem] font-semibold uppercase tracking-[0.05em]'
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
              className='min-w-40 cursor-pointer rounded-md px-[0.6rem] py-[0.4rem] text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
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
              <Input
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
          <Typography
            variant='h3'
            className='mb-4 text-[0.9375rem] font-semibold uppercase tracking-[0.05em]'
            style={{ color: sectionHeadingColor }}
          >
            Layout
          </Typography>

          <SettingRow
            label='Navigation Side'
            description='Choose navigation panel position'
          >
            <div className='flex flex-col gap-2'>
              <button
                className='cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
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
                className='cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
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
        <section className='mb-8 last:mb-0'>
          <Typography
            variant='h3'
            className='mb-4 text-[0.9375rem] font-semibold uppercase tracking-[0.05em]'
            style={{ color: sectionHeadingColor }}
          >
            Accessibility
          </Typography>

          <SettingRow
            label='Reduce Motion'
            description='Minimize animations and transitions'
          >
            <button
              type='button'
              role='switch'
              aria-checked={reducedMotion}
              className='relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-0'
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
                className={`pointer-events-none absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${reducedMotion ? 'translate-x-5' : ''}`}
              />
            </button>
          </SettingRow>

          <SettingRow
            label='High Contrast'
            description='Increase contrast for better visibility'
          >
            <button
              type='button'
              role='switch'
              aria-checked={themeMode === 'high-contrast'}
              className='relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-0'
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
                className={`pointer-events-none absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${themeMode === 'high-contrast' ? 'translate-x-5' : ''}`}
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
          type='button'
          className='w-full cursor-pointer rounded-lg bg-transparent px-4 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-80 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
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
