import { TwReveal } from '@/components/dsm';
import { TIMELINE } from './aboutData';
import styles from './page.module.scss';

/**
 * Career timeline.
 *
 * Redesign (2026-11): the "01, 02…" markers (the retired numbered-rail motif)
 * are glowing nodes on a light line, matching the Shift Track.
 *
 * Rewritten off the old inline-styled, theme-hook version: it is now a plain
 * server component built on DSM tokens, with the connecting line drawn by a
 * border on the list rather than a per-entry flex spacer. That drops a client
 * boundary, the `useCardState` hover machinery, and roughly 200 lines of style
 * objects — the hover treatment lives in CSS where the tokens already are.
 */
export function AboutTimeline() {
  return (
    <ol className={styles.timeline}>
      {TIMELINE.map((entry, i) => (
        <TwReveal as='li' key={`${entry.org}-${entry.period}`} delay={i * 90}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineNode} aria-hidden='true' />
            <p className={styles.timelinePeriod}>{entry.period}</p>
            <h3 className={styles.timelineTitle}>{entry.title}</h3>
            <p className={styles.timelineOrg}>{entry.org}</p>
            <ul className={styles.timelineBullets}>
              {entry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </TwReveal>
      ))}
    </ol>
  );
}

export default AboutTimeline;
