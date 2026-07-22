import Image from 'next/image';
import { TwReveal, TwSectionHeading } from '@/components/dsm';
import type { AboutSectionMeta } from './aboutData';
import styles from './page.module.scss';

export interface AboutSectionProps {
  meta: AboutSectionMeta;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Alternate band background, for rhythm down the page. */
  alt?: boolean;
  children?: React.ReactNode;
}

/**
 * One numbered About section: sticky image rail on the left, content on the
 * right — the same shape as fluxline.pro/services and as the homepage's rail
 * sections, so the two sites read as one system.
 *
 * The rail carries the section number and label; the image is the visual anchor
 * that replaces the wall of prose the old page led with. Below `mobile-lg` the
 * grid collapses and the rail simply stacks above the content.
 *
 * Server component — the only client piece is TwReveal, which brings its own
 * boundary.
 */
export function AboutSection({
  meta,
  title,
  lede,
  alt = false,
  children,
}: AboutSectionProps) {
  const classes = [styles.section, alt ? styles.sectionAlt : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={meta.id} className={classes}>
      <div className={styles.container}>
        <div className={styles.railGrid}>
          <div className={styles.rail}>
            <div className={styles.numRow}>
              <span className={styles.secNum}>{meta.num}</span>
              <span className={styles.secLabel}>{meta.label}</span>
            </div>
            <div className={styles.railImage}>
              {/* `fill` rather than intrinsic dimensions: aboutData stores the
                  static import's `.src` string, so width/height metadata isn't
                  available here. The rail is a fixed-height, position:relative
                  box, so fill is the right shape anyway. */}
              <Image
                className='tw-media'
                src={meta.image.src}
                alt={meta.image.alt}
                fill
                sizes='(max-width: 30rem) 100vw, 320px'
              />
            </div>
          </div>

          <div>
            <TwReveal>
              {/* No kicker — the rail's number row already carries the label,
                  and repeating it reads as a stutter on every section. */}
              <TwSectionHeading title={title} lede={lede} />
            </TwReveal>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
