'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import styles from './TagFilter.module.scss';

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  label?: string;
}

export function TagFilter({
  tags,
  activeTag,
  onTagChange,
  label = 'Filter',
}: TagFilterProps) {
  const { theme } = useAppTheme();
  const activeStyle = {
    backgroundColor: theme.semanticColors.link.default,
    color: theme.semanticColors.background.base,
    borderColor: theme.semanticColors.link.default,
  };

  if (tags.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {label && (
        <span className={styles.label}>
          {label}:
        </span>
      )}
      <button
        onClick={() => onTagChange(null)}
        className={styles.chip}
        style={activeTag === null ? activeStyle : undefined}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag === activeTag ? null : tag)}
          className={styles.chip}
          style={activeTag === tag ? activeStyle : undefined}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
