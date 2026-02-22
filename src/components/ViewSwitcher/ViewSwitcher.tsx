'use client';

import React from 'react';
import { ViewType } from '@/content/types';

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
    <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1'>
      {views.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          aria-label={`${label} view`}
          title={label}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            current === value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <span className='mr-1'>{icon}</span>
          <span className='hidden sm:inline'>{label}</span>
        </button>
      ))}
    </div>
  );
}
