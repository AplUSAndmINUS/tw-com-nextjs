'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './TwShiftTrack.module.scss';

export interface TwShiftTrackStep {
  id: string;
  /** "Shift 1", or empty for an unnumbered beat. */
  number: string;
  title: string;
  /** One line under the title. */
  short: string;
  /** Roles this step added. They accumulate along the track. */
  roles: string[];
  /** Optional link to the full telling (e.g. `/about/#shift-build`). */
  href?: string;
  /** Mythic Gold and highlighted (the step that is happening now). */
  highlight?: boolean;
}

export interface TwShiftTrackProps {
  steps: TwShiftTrackStep[];
  /** Accessible name for each step's role list, e.g. "Roles added". */
  rolesLabel: string;
  /**
   * Label for the running total under the track, e.g. "So far". When set, the
   * roles reached so far are listed there, building up as the visitor scrolls.
   */
  stackLabel?: string;
  /** Link text for steps with an `href`. */
  moreLabel?: string;
  headingLevel?: 'h3' | 'h4';
  className?: string;
}

/**
 * Shift Track (DESIGN_BRIEF.md §8.3): Terence's Shifts on a glowing line,
 * with the roles each one added collecting as you scroll. "Author is just now
 * the next piece being added to who I am."
 *
 * Horizontal from tablet width up, vertical below. Content is never hidden:
 * scrolling only brightens each step and its chips as it's reached. The
 * server render (and reduced motion, and no JavaScript) shows every step
 * reached.
 */
export function TwShiftTrack({
  steps,
  rolesLabel,
  stackLabel,
  moreLabel,
  headingLevel: Heading = 'h3',
  className,
}: TwShiftTrackProps) {
  const ref = useRef<HTMLOListElement>(null);
  // Server and first client render: everything reached (no flash of dimming
  // for no-JS visitors and crawlers). Progressive mode starts in the effect.
  const [reached, setReached] = useState(steps.length - 1);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const reduce =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-tw-reduced-motion') ===
        'true';
    if (reduce) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[data-step-index]')
    );
    // Steps already scrolled past (or on screen) count as reached.
    const startAt = items.reduce((max, el, i) => {
      const top = el.getBoundingClientRect().top;
      return top < window.innerHeight * 0.75 ? i : max;
    }, -1);
    setReached(startAt);

    let alive = false;
    const observer = new IntersectionObserver(
      (entries) => {
        alive = true;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = Number((entry.target as HTMLElement).dataset.stepIndex);
          setReached((r) => Math.max(r, i));
        });
      },
      { rootMargin: '0px 0px -25% 0px', threshold: 0.2 }
    );
    items.forEach((el) => observer.observe(el));

    // Fail open, like TwReveal: if the observer never reports, show it all.
    const failsafe = window.setTimeout(() => {
      if (!alive) setReached(steps.length - 1);
    }, 3000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [steps.length]);

  // Vertical layout: the line runs from the first node to the last one, not
  // to the bottom of the last step (owner, 2026-11-19). Measured, because the
  // last step's height depends on its text.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      const nodes = root.querySelectorAll<HTMLElement>('[data-track-node]');
      if (nodes.length < 2) return;
      const top = root.getBoundingClientRect().top;
      const centre = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - top;
      };
      const start = centre(nodes[0]);
      const end = centre(nodes[nodes.length - 1]);
      root.style.setProperty('--tw-track-start', `${start}px`);
      root.style.setProperty('--tw-track-length', `${end - start}px`);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [steps.length]);

  const progress =
    steps.length > 1 ? Math.max(0, reached) / (steps.length - 1) : 1;
  const rolesSoFar = steps.slice(0, reached + 1).flatMap((s) => s.roles);

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <ol
        ref={ref}
        className={styles.track}
        style={
          {
            '--tw-track-progress': progress,
            '--steps': steps.length,
          } as React.CSSProperties
        }
      >
        {steps.map((step, i) => (
          <li
            key={step.id}
            className={styles.step}
            data-step-index={i}
            data-reached={i <= reached ? 'true' : 'false'}
            data-highlight={step.highlight ? 'true' : undefined}
          >
            <span
              className={styles.node}
              aria-hidden='true'
              data-track-node=''
            />
            <div className={styles.body}>
              {step.number ? (
                <p className={styles.number}>{step.number}</p>
              ) : (
                <p
                  className={`${styles.number} ${styles.numberEmpty}`}
                  aria-hidden='true'
                >
                  &nbsp;
                </p>
              )}
              <Heading className={styles.title}>{step.title}</Heading>
              <p className={styles.short}>{step.short}</p>
              {step.roles.length ? (
                <ul className={styles.roles} aria-label={rolesLabel}>
                  {step.roles.map((role) => (
                    <li key={role} className={styles.role}>
                      {role}
                    </li>
                  ))}
                </ul>
              ) : null}
              {step.href && moreLabel ? (
                <a className={styles.more} href={step.href}>
                  {moreLabel} <span aria-hidden='true'>&#8594;</span>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {stackLabel ? (
        <p className={styles.stack}>
          <span className={styles.stackLabel}>{stackLabel}</span>{' '}
          {rolesSoFar.map((role, i) => (
            <span key={`${role}-${i}`} className={styles.stackRole}>
              {role}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

export default TwShiftTrack;
