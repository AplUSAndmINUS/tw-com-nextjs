import React, { JSX } from 'react';
import { TwButton } from '../TwButton';
import type { TwButtonVariant } from '../TwButton';
import { TwParallax } from '../TwParallax';
import { TwHeroScrollReveal } from './TwHeroScrollReveal';
import styles from './TwHero.module.scss';

export interface TwHeroCta {
  label: string;
  href: string;
  /** Overrides the default (primary for the first CTA, outline for the second). */
  variant?: TwButtonVariant;
  /**
   * Opens in a new tab (links out to our own sites, e.g. the Fluxline Store),
   * with rel="noopener" so the destination still sees the referrer.
   */
  newTab?: boolean;
}

export interface TwHeroProps {
  /**
   * Small line above the title. On the homepage this is the system's one
   * informal typographic moment — sentence case, not an uppercase kicker.
   */
  eyebrow?: string;
  title: string;
  /** Line directly under the H1 — e.g. roles. Rendered in the initial HTML. */
  subtitle?: React.ReactNode;
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
  /**
   * 'card-side' darkens the copy side almost fully and fades out toward the
   * right: for a banner with its own lettering (the RCF banner), so the
   * lettering doesn't show around the card. Default: the photo scrim.
   */
  scrim?: 'photo' | 'card-side';
  /**
   * Below tablet width, place the copy card under the photo instead of over
   * it: the photo is seen first, and the card rises out of its faded lower
   * edge. The photo scrolls normally, with no parallax. Use it where the card
   * would otherwise cover the subject's face on a phone.
   *
   * Needs `backgroundImage`: the card is pulled up over the photo, so without
   * one it would be dragged over the content above the hero. It is ignored
   * when there is no photo.
   */
  stackOnMobile?: boolean;
  /**
   * Everything `stackOnMobile` does, plus the photo stays pinned under the
   * nav while the card scrolls up over it and the photo fades into the page
   * background. It is still under reduced motion. Like `stackOnMobile`, it
   * needs `backgroundImage` and is ignored without one.
   */
  scrollReveal?: boolean;
  /** Anchor id, so the nav's brand link can target the top of the page. */
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Full-bleed hero with real photography, a legibility scrim, and a glass copy
 * card.
 *
 * By default the photo drifts on scroll via TwParallax, which no-ops entirely
 * under reduced motion. With `stackOnMobile` the card sits under the photo on
 * phones (no parallax there); with `scrollReveal` the photo also stays pinned
 * while the card scrolls over it and fades out, driven by TwHeroScrollReveal.
 * Grain (`.tw-grain`) sits on the section for warmth — one of
 * the deliberate departures from Fluxline's flat surfaces.
 *
 * Rendered as a server component. The only client pieces are TwParallax and,
 * when `scrollReveal` is set, TwHeroScrollReveal (which wraps the card).
 * Keeping the hero on the server means the title and copy are in the initial
 * HTML, which matters for both LCP and search.
 */
export function TwHero({
  eyebrow,
  title,
  subtitle,
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
  scrim = 'photo',
  stackOnMobile = false,
  scrollReveal = false,
  id,
  className,
  children,
}: TwHeroProps) {
  // The stacked layouts pull the card up over the photo, so they only apply
  // when there is a photo to pull it over.
  const hasPhoto = Boolean(backgroundImage);
  const stacked = hasPhoto && (stackOnMobile || scrollReveal);
  // The reveal needs a client component to track scroll; the default hero
  // stays entirely on the server.
  const Inner = hasPhoto && scrollReveal ? TwHeroScrollReveal : 'div';

  const heroStyle = {
    ...(focalPoint ? { '--tw-hero-focal': focalPoint } : {}),
    ...(compact
      ? { '--tw-hero-height': '420px', '--tw-hero-height-mobile': '360px' }
      : {}),
  } as React.CSSProperties;

  return (
    <section
      id={id}
      className={[
        'tw-grain',
        styles.hero,
        stacked ? styles.stacked : undefined,
        hasPhoto && scrollReveal ? styles.scrollReveal : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
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

      <div
        className={
          scrim === 'card-side'
            ? `${styles.scrim} ${styles.scrimCardSide}`
            : styles.scrim
        }
        aria-hidden='true'
      />

      <Inner className={styles.inner}>
        <div className={styles.card}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          {body ? <p className={styles.body}>{body}</p> : null}

          {tagline || location ? (
            <div className={styles.meta}>
              {tagline ? <span>{tagline}</span> : null}
              {location ? <span>{location}</span> : null}
            </div>
          ) : null}

          {quote ? (
            <blockquote className={styles.quote}>{quote}</blockquote>
          ) : null}

          {primaryCta || secondaryCta ? (
            <div className={styles.actions}>
              {primaryCta ? (
                <TwButton
                  href={primaryCta.href}
                  size='lg'
                  variant={primaryCta.variant ?? 'primary'}
                  target={primaryCta.newTab ? '_blank' : undefined}
                  rel={primaryCta.newTab ? 'noopener' : undefined}
                >
                  {primaryCta.label}
                </TwButton>
              ) : null}
              {secondaryCta ? (
                <TwButton
                  href={secondaryCta.href}
                  size='lg'
                  variant={secondaryCta.variant ?? 'outline'}
                  target={secondaryCta.newTab ? '_blank' : undefined}
                  rel={secondaryCta.newTab ? 'noopener' : undefined}
                >
                  {secondaryCta.label}
                </TwButton>
              ) : null}
            </div>
          ) : null}

          {children}
        </div>
      </Inner>
    </section>
  );
}

export default TwHero;
