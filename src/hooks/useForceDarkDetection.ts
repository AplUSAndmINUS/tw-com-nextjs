'use client';

import React from 'react';

/**
 * Detects whether Chrome's "Auto Dark Mode for Web Contents"
 * (chrome://flags/#enable-force-dark) is active.
 *
 * When this Chrome flag is enabled, Chrome algorithmically forces all web
 * content into dark mode by rewriting light CSS colors to dark equivalents.
 * This causes a visible "flash" when users switch to light or colorblindness
 * themes: the page briefly renders the light colors before Chrome re-applies
 * its forced darkening.
 *
 * Detection technique: appends a hidden element with a known white background
 * (#ffffff) and reads back the computed background color. Chrome's Auto Dark
 * Mode rewrites light colors at the CSS cascade level, so when force-dark is
 * active the computed value will differ from the original white.
 */
export const useForceDarkDetection = () => {
  const [isForceDarkActive, setIsForceDarkActive] = React.useState(false);

  React.useLayoutEffect(() => {
    const detectForceDark = (): boolean => {
      try {
        const el = document.createElement('div');
        el.style.cssText =
          'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;background-color:#ffffff;';
        document.body.appendChild(el);
        const computedBg = window.getComputedStyle(el).backgroundColor;
        document.body.removeChild(el);
        // Chrome's Auto Dark Mode rewrites white (rgb(255,255,255)) to a dark
        // color, so any deviation from pure white indicates force-dark is active.
        return computedBg !== 'rgb(255, 255, 255)';
      } catch {
        return false;
      }
    };

    setIsForceDarkActive(detectForceDark());
  }, []);

  return { isForceDarkActive };
};

export default useForceDarkDetection;
