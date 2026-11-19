import React from 'react';
import styles from './TwAside.module.scss';

export interface TwAsideProps {
  children: React.ReactNode;
  /**
   * 'inline' sits in the text flow. 'margin' floats into the right margin from
   * desktop width up (and falls back to inline below it).
   */
  placement?: 'inline' | 'margin';
  /**
   * 'aside' (default) is a complementary landmark. Use 'p' inside a section
   * or a callout, where a nested landmark would be wrong; it renders as a
   * note (role="note").
   */
  as?: 'aside' | 'p';
  className?: string;
}

/**
 * Aside: a parenthetical note in a quieter voice. Terence's humor and
 * personal comments live here (CREATIVE_BRIEF.md §7.3 rule 7), never in the
 * hero or next to heavy story beats. The parentheses are part of the copy.
 */
export function TwAside({
  children,
  placement = 'inline',
  as: Element = 'aside',
  className,
}: TwAsideProps) {
  return (
    <Element
      role={Element === 'p' ? 'note' : undefined}
      className={[
        styles.aside,
        placement === 'margin' ? styles.margin : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Element>
  );
}

export default TwAside;
