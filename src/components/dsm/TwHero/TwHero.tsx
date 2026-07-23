import React, { JSX } from 'react';
import { TwButton } from '../TwButton';
import { TwParallax } from '../TwParallax';
import styles from './TwHero.module.scss';

export interface TwHeroCta {
  label: string;
  href: string;
}

export interface TwHeroProps {
  /**
   * Small line above the title. On the homepage this is the system's one
   * informal typographic moment — sentence case, not an uppercase kicker.
   */
  eyebrow?: string;
  title: string;
  body?: JSX.Element | string;
  quote?: string;
  primaryCta?: TwHeroCta;
  secondaryCta?: TwHeroCta;
  /** Landscape crop. Used at all sizes unless `backgroundImagePortrait` is set. */
  backgroundImage?: string;
  /**
   * Portrait crop, swapped in on tall viewports via <picture>. The design
   * system asks for aspect-ratio-driven crops of real photography rather than
   * one image letterboxed.
   */
  backgroundImagePortrait?: string;
  backgroundAlt?: string;
  /** object-position for the photo, e.g. 'center 20%'. */
  focalPoint?: string;
  /** Short meta lines under the body — role, location. */
  tagline?: string;
  location?: string;
  /** Shorter hero for interior pages so they don't look identical to the homepage. */
  compact?: boolean;
  /** Anchor id, so the nav's brand link can target the top of the page. */
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Full-bleed hero with real photography, a legibility scrim, and a glass copy
 * card.
 *
 * The photo drifts on scroll via TwParallax, which no-ops entirely under
 * reduced motion. Grain (`.tw-grain`) sits on the section for warmth — one of
 * the deliberate departures from Fluxline's flat surfaces.
 *
 * Rendered as a server component: the only interactive piece is TwParallax,
 * which is a client component of its own. Keeping the hero on the server means
 * the title and copy are in the initial HTML, which matters for both LCP and
 * search.
 */
export function TwHero({
  eyebrow,
  title,
  body,
  quote,
  primaryCta,
  secondaryCta,
  backgroundImage,
  backgroundImagePortrait,
  backgroundAlt = '',
  focalPoint,
  tagline,
  location,
  compact = false,
  id,
  className,
  children,
}: TwHeroProps) {
  const heroStyle = {
    ...(focalPoint ? { '--tw-hero-focal': focalPoint } : {}),
    ...(compact ? { '--tw-hero-height': '420px', '--tw-hero-height-mobile': '360px' } : {}),
  } as React.CSSProperties;

  return (
    <section
      id={id}
      className={['tw-grain', styles.hero, className].filter(Boolean).join(' ')}
      style={Object.keys(heroStyle).length ? heroStyle : undefined}
    >
      {backgroundImage ? (
        <TwParallax strength={60} className={styles.media}>
          <picture>
            {backgroundImagePortrait ? (
              <source
                media='(orientation: portrait)'
                srcSet={backgroundImagePortrait}
              />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element --
                the project builds with output:'export' and images.unoptimized,
                so next/image adds no optimisation here and would force explicit
                dimensions on a fill-style background. */}
            <img
              src={backgroundImage}
              alt={backgroundAlt}
              className={`tw-media ${styles.image}`}
              // The hero photo is the LCP element — never lazy-load it.
              loading='eager'
              fetchPriority='high'
              decoding='async'
            />
          </picture>
        </TwParallax>
      ) : null}

      <div className={styles.scrim} aria-hidden='true' />

      <div className={styles.inner}>
        <div className={styles.card}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1 className={styles.title}>{title}</h1>
          {body ? <p className={styles.body}>{body}</p> : null}

          {tagline || location ? (
            <div className={styles.meta}>
              {tagline ? <span>{tagline}</span> : null}
              {location ? <span>{location}</span> : null}
            </div>
          ) : null}

          {quote ? <blockquote className={styles.quote}>{quote}</blockquote> : null}

          {primaryCta || secondaryCta ? (
            <div className={styles.actions}>
              {primaryCta ? (
                <TwButton href={primaryCta.href} size='lg'>
                  {primaryCta.label}
                </TwButton>
              ) : null}
              {secondaryCta ? (
                <TwButton href={secondaryCta.href} size='lg' variant='outline'>
                  {secondaryCta.label}
                </TwButton>
              ) : null}
            </div>
          ) : null}

          {children}
        </div>
      </div>
    </section>
  );
}

export default TwHero;
