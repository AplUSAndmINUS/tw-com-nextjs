'use client';

import React from 'react';
import { ViewType } from '@/store';
import styles from './ViewSwitcher.module.scss';

interface ViewSwitcherProps {
  current: ViewType;
  onChange: (view: ViewType) => void;
}

const views: { value: ViewType; label: string; icon: string }[] = [
  { value: 'grid', label: 'Grid', icon: '▦' },
  { value: 'large', label: 'List', icon: '☰' },
  { value: 'small', label: 'Compact', icon: '≡' },
];

export function ViewSwitcher({ current, onChange }: ViewSwitcherProps) {
  return (
    <div className={styles.wrap}>
      {views.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          aria-label={`${label} view`}
          title={label}
          className={`${styles.button} ${
            current === value ? styles.active : styles.inactive
          }`}
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.labelText}>{label}</span>
        </button>
      ))}
    </div>
  );
}
