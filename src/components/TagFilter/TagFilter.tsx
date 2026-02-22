'use client';

import React from 'react';

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  label?: string;
}

export function TagFilter({ tags, activeTag, onTagChange, label = 'Filter' }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {label && (
        <span className='text-sm font-medium text-gray-500 dark:text-gray-400 mr-1'>
          {label}:
        </span>
      )}
      <button
        onClick={() => onTagChange(null)}
        className={`px-3 py-1 rounded-full text-sm transition-colors ${
          activeTag === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag === activeTag ? null : tag)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeTag === tag
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
