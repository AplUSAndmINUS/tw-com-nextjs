import React from 'react';
import styles from './TwHook.module.scss';

export interface TwHookProps {
  /** The oversized line, e.g. "I hate self-help books." */
  statement: React.ReactNode;
  /** Render the statement as a heading (default h2) or a paragraph. */
  as?: 'h2' | 'h3' | 'p';
  /** Small line above the statement. */
  kicker?: React.ReactNode;
  /**
   * A short, punchy line under the statement (e.g. "I hate self-help
   * books." under a full-sentence heading).
   */
  subtitle?: React.ReactNode;
  /**
   * 'xl' for a few words (the oversized hook), 'lg' for a full-sentence
   * heading, which would overwhelm the page at hook size.
   */
  size?: 'xl' | 'lg';
  /** Follow-up copy and actions, under the statement. */
  children?: React.ReactNode;
  id?: string;
  /** Id for the statement heading, for a section's aria-labelledby. */
  headingId?: string;
  className?: string;
}

/**
 * Hook moment: one oversized typographic statement (DESIGN_BRIEF.md §8.3).
 * One per page at most. It's a "drive" beat in the page rhythm, so it gets
 * room around it and a glowing rule beneath, not a card.
 */
export function TwHook({
  statement,
  as: Heading = 'h2',
  kicker,
  subtitle,
  size = 'xl',
  children,
  id,
  headingId,
  className,
}: TwHookProps) {
  return (
    <div id={id} className={[styles.hook, className].filter(Boolean).join(' ')}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <Heading
        id={headingId}
        className={[styles.statement, size === 'lg' ? styles.statementLg : '']
          .filter(Boolean)
          .join(' ')}
      >
        {statement}
      </Heading>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      <span className={styles.rule} aria-hidden='true' />
      {children ? <div className={styles.follow}>{children}</div> : null}
    </div>
  );
}

export default TwHook;
