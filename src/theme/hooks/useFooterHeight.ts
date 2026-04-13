'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to calculate the actual footer height dynamically
 * This ensures proper spacing for layouts where the footer affects content positioning
 *
 * @returns The current footer height as a CSS string (e.g., "200px")
 */
export const useFooterHeight = (): string => {
  const [footerHeight, setFooterHeight] = useState('0px');

  useEffect(() => {
    let cleanupFn: (() => void) | null = null;

    const findFooter = (): Element | null =>
      document.querySelector('footer') ||
      document.querySelector('[role="contentinfo"]') ||
      document.querySelector('[data-footer]');

    const attachToFooter = (footerElement: Element): (() => void) => {
      let resizeObserver: ResizeObserver | null = null;

      const calculateFooterHeight = () => {
        const height = footerElement.getBoundingClientRect().height;
        setFooterHeight(`${height}px`);
      };

      calculateFooterHeight();
      window.addEventListener('resize', calculateFooterHeight);

      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(calculateFooterHeight);
        resizeObserver.observe(footerElement);
      }

      return () => {
        window.removeEventListener('resize', calculateFooterHeight);
        resizeObserver?.disconnect();
      };
    };

    const footerElement = findFooter();
    if (footerElement) {
      cleanupFn = attachToFooter(footerElement);
      return () => cleanupFn?.();
    }

    // Footer not yet in DOM (e.g. mounted asynchronously via AnimatePresence).
    // Watch for it via MutationObserver, then start measuring once it appears.
    const mutationObserver = new MutationObserver(() => {
      const el = findFooter();
      if (el) {
        mutationObserver.disconnect();
        cleanupFn = attachToFooter(el);
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      cleanupFn?.();
    };
  }, []);

  return footerHeight;
};
