import React from 'react';
import { TwGrid, type TwGridProps } from '../TwGrid';
import { TwReveal } from '../TwReveal';

export interface TwContentGridProps extends TwGridProps {
  /**
   * Delay added per child, in ms. The design system's default is 90ms, which
   * makes a row "wake up" left to right rather than popping in at once.
   */
  stagger?: number;
  /**
   * Cap on the cumulative delay. Without this a long list would leave the last
   * card waiting seconds before it appeared — on a 30-item archive at 90ms the
   * final card would be delayed 2.7s after entering view.
   */
  maxStagger?: number;
}

/**
 * TwGrid with staggered scroll reveals.
 *
 * Each direct child is wrapped in a TwReveal whose delay increases by
 * `stagger`. Wrapping happens here rather than at the call site so that a
 * content grid is a drop-in for a plain grid.
 *
 * Children keep their own keys where they have them — React.Children.map
 * prefixes automatically, so reordering does not remount the wrong nodes.
 */
export function TwContentGrid({
  stagger = 90,
  maxStagger = 540,
  children,
  ...gridProps
}: TwContentGridProps) {
  return (
    <TwGrid {...gridProps}>
      {React.Children.map(children, (child, index) => {
        if (child === null || child === undefined || child === false) {
          return child;
        }
        return (
          <TwReveal delay={Math.min(index * stagger, maxStagger)}>
            {child}
          </TwReveal>
        );
      })}
    </TwGrid>
  );
}

export default TwContentGrid;
