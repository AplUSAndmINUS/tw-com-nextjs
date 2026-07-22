'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { SettingsIcon } from '@/components/icons';
import { TwSwitch } from '../TwSwitch';
import styles from './TwAppearancePanel.module.scss';

export interface TwAppearancePanelProps {
  className?: string;
}

/**
 * Display & appearance panel.
 *
 * The gear button plus a fixed pop-over exposing the appearance controls the
 * redesign calls for: Dark/Light, reduce motion, reduce transparency, high
 * contrast, colorblind-safe palette.
 *
 * Every control writes to the shared preferences store through useAppTheme, so
 * the panel does not own any of this state — it persists, survives navigation,
 * and drives the same data-theme / data-tw-* attributes the rest of the site
 * reads. That is deliberately different from the prototype, which kept the
 * settings in page-local state.
 *
 * Contrast and colorblind are orthogonal layers here (data-tw-contrast /
 * data-tw-cvd), so they compose with either theme rather than being separate
 * whole-palette modes.
 */
export function TwAppearancePanel({ className }: TwAppearancePanelProps) {
  const {
    themeMode,
    setThemeMode,
    isDark,
    reducedMotion,
    setReducedMotion,
    reducedTransparency,
    setReducedTransparency,
    highContrast,
    setHighContrast,
    colorblindSafe,
    setColorblindSafe,
  } = useAppTheme();

  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Dark/light is a themeMode; the six a11y modes are not exposed here, so
  // "dark" means any dark-family mode and Light switches to plain light.
  const light = themeMode === 'light';

  // Close on Escape or outside click, returning focus to the trigger.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const reset = () => {
    setThemeMode('dark');
    setReducedMotion(false);
    setReducedTransparency(false);
    setHighContrast(false);
    setColorblindSafe(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type='button'
        className={[styles.trigger, className].filter(Boolean).join(' ')}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label='Display and appearance settings'
      >
        <SettingsIcon size={15} />
        <span className={styles.triggerLabel}>Display</span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        className={[
          'tw-blur',
          styles.panel,
          open ? styles.panelOpen : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role='dialog'
        aria-label='Display and appearance'
        aria-hidden={!open}
        // Keep it out of the tab order while closed.
        {...(!open ? { inert: '' as unknown as boolean } : {})}
      >
        <div className={styles.header}>
          <span className={styles.title}>Display &amp; appearance</span>
          <button
            type='button'
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label='Close'
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              aria-hidden='true'
            >
              <line x1='5' y1='5' x2='19' y2='19' />
              <line x1='19' y1='5' x2='5' y2='19' />
            </svg>
          </button>
        </div>

        <div className={styles.groupLabel}>Theme</div>
        <div className={styles.segRow} role='group' aria-label='Theme'>
          <button
            type='button'
            className={[styles.seg, isDark ? styles.segOn : '']
              .filter(Boolean)
              .join(' ')}
            aria-pressed={isDark}
            onClick={() => setThemeMode('dark')}
          >
            Dark
          </button>
          <button
            type='button'
            className={[styles.seg, light ? styles.segOn : '']
              .filter(Boolean)
              .join(' ')}
            aria-pressed={light}
            onClick={() => setThemeMode('light')}
          >
            Light
          </button>
        </div>

        <div className={styles.groupLabel}>Accessibility</div>
        <div className={styles.switches}>
          <TwSwitch
            label='Reduce motion'
            checked={reducedMotion}
            onChange={setReducedMotion}
          />
          <TwSwitch
            label='Reduce transparency'
            checked={reducedTransparency}
            onChange={setReducedTransparency}
          />
          <TwSwitch
            label='High contrast'
            checked={highContrast}
            onChange={setHighContrast}
          />
          <TwSwitch
            label='Colorblind-safe palette'
            checked={colorblindSafe}
            onChange={setColorblindSafe}
          />
        </div>

        <button type='button' className={styles.reset} onClick={reset}>
          Reset to defaults
        </button>
      </div>
    </>
  );
}

export default TwAppearancePanel;
