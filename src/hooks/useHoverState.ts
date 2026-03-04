'use client';

import React, { useState } from 'react';

// Single item hover state (keyboard + mouse)
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

// Multiple items hover state (keyboard + mouse)
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

// Single item hover state — mouse pointer only (excludes keyboard focus and touch)
export const useMouseHoverState = (initialState: boolean = false) => {
  const [isHovered, setIsHovered] = useState(initialState);

  const hoverProps = {
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setIsHovered(true);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setIsHovered(false);
    },
  };

  return [isHovered, hoverProps] as const;
};

// Multiple items hover state — mouse pointer only (excludes keyboard focus and touch)
export const useMouseMultiHoverState = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getHoverProps = (id: string) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setHoveredId(id);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setHoveredId(null);
    },
  });

  const isHovered = (id: string) => hoveredId === id;

  return { isHovered, getHoverProps };
};
