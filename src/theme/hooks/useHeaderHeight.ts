'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to calculate the actual header height dynamically
 * This ensures proper spacing regardless of header content changes
 *
 * @returns The current header height as a CSS string (e.g., "4rem" or "64px")
 */
export const useHeaderHeight = (): string => {
  const [headerHeight, setHeaderHeight] = useState('4rem'); // Default fallback

  useEffect(() => {
    // Look for the header/nav element - query once and reuse
    const headerElement =
      document.querySelector('nav') ||
      document.querySelector('header') ||
      document.querySelector('[role="banner"]');

    const calculateHeaderHeight = () => {
      if (headerElement) {
        const height = headerElement.getBoundingClientRect().height;
        setHeaderHeight(`${height}px`);
      }
    };

    // Calculate on mount
    calculateHeaderHeight();

    // Recalculate on resize
    const handleResize = () => calculateHeaderHeight();
    window.addEventListener('resize', handleResize);

    // Use ResizeObserver if available for more accurate detection
    let resizeObserver: ResizeObserver | null = null;

    if (headerElement && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        calculateHeaderHeight();
      });
      resizeObserver.observe(headerElement);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return headerHeight;
};
