'use client';

import { useState } from 'react';

// Single item hover state
export const useHoverState = (initialState: boolean = false) => {
  const [isHovered, setIsHovered] = useState(initialState);

  const hoverProps = {
    onFocus: () => setIsHovered(true),
    onBlur: () => setIsHovered(false),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  return [isHovered, hoverProps] as const;
};

// Multiple items hover state
export const useMultiHoverState = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getHoverProps = (id: string) => ({
    onFocus: () => setHoveredId(id),
    onBlur: () => setHoveredId(null),
    onMouseEnter: () => setHoveredId(id),
    onMouseLeave: () => setHoveredId(null),
  });

  const isHovered = (id: string) => hoveredId === id;

  return { isHovered, getHoverProps };
};
