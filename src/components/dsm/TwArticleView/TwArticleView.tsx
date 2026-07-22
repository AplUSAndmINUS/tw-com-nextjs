import React from 'react';
import Link from 'next/link';
import { TwChip } from '../TwChip';
import { TwButton } from '../TwButton';
import styles from './TwArticleView.module.scss';

export interface TwArticleViewProps {
  category?: string;
  /** Pre-formatted date string. */
  date?: string;
  /** e.g. "6 min read". */
  readTime?: string;
  title: string;
  /** Lede / standfirst under the title. */
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  /** Where "← All posts" and the top nav's back-link point. */
  backHref: string;
  backLabel?: string;
  newsletterHref?: string;
  /** The rendered article body (MDX/markdown) — wrapped in .tw-prose. */
  children: React.ReactNode;
}

/**
 * Long-form article layout: meta row, title, lede, header image, prose body,
 * and a footer with a back-link and a subscribe CTA.
 *
 * Deliberately server-renderable (no client hooks) so a detail route can stream
 * MDX straight in as children. The interactive chrome — the sticky nav with the
 * appearance panel — is a sibling client component the page composes alongside
 * this, not part of it.
 */
export function TwArticleView({
  category,
  date,
  readTime,
  title,
  excerpt,
  image,
  imageAlt,
  backHref,
  backLabel = 'All posts',
  newsletterHref = '/#newsletter',
  children,
}: TwArticleViewProps) {
  const meta = [date, readTime].filter(Boolean).join(' · ');

  return (
    <article className={styles.article}>
      <div className={styles.metaRow}>
        {category ? (
          <TwChip variant='teal' size='sm'>
            {category}
          </TwChip>
        ) : null}
        {meta ? <span className={styles.meta}>{meta}</span> : null}
      </div>

      <h1 className={styles.title}>{title}</h1>
      {excerpt ? <p className={styles.lede}>{excerpt}</p> : null}

      {image ? (
        <div className={styles.hero}>
          {/* eslint-disable-next-line @next/next/no-img-element --
              output:'export' + images.unoptimized, so next/image adds nothing. */}
          <img className='tw-media' src={image} alt={imageAlt ?? ''} />
        </div>
      ) : null}

      <div className='tw-prose'>{children}</div>

      <div className={styles.footer}>
        <Link href={backHref} className={styles.back}>
          <span aria-hidden='true'>&#8592;</span> {backLabel}
        </Link>
        <TwButton variant='outline' href={newsletterHref}>
          Subscribe for more
        </TwButton>
      </div>
    </article>
  );
}

export default TwArticleView;
