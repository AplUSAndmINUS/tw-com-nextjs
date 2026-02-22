'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to calculate the actual footer height dynamically
 * This ensures proper spacing for layouts where the footer affects content positioning
 *
 * @returns The current footer height as a CSS string (e.g., "200px")
 */
export const useFooterHeight = (): string => {
  const [footerHeight, setFooterHeight] = useState('200px'); // Default fallback

  useEffect(() => {
    // Look for the footer element - try multiple selectors
    const footerElement =
      document.querySelector('footer') ||
      document.querySelector('[role="contentinfo"]') ||
      document.querySelector('[data-footer]');

    const calculateFooterHeight = () => {
      if (footerElement) {
        const height = footerElement.getBoundingClientRect().height;
        setFooterHeight(`${height}px`);
      }
    };

    // Calculate on mount
    calculateFooterHeight();

    // Recalculate on resize
    const handleResize = () => calculateFooterHeight();
    window.addEventListener('resize', handleResize);

    // Use ResizeObserver if available for more accurate detection
    let resizeObserver: ResizeObserver | null = null;

    if (footerElement && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        calculateFooterHeight();
      });
      resizeObserver.observe(footerElement);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return footerHeight;
};
