'use client';

import { useState } from 'react';
import styles from './TwArticleCard.module.scss';

export interface CardImageProps {
  src: string;
  alt: string;
}

export function CardImage({ src, alt }: CardImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className={styles.media}>
      <div className={`${styles.shimmer} ${loaded ? styles.shimmerDone : ''}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`${styles.image} ${loaded ? styles.imageLoaded : ''} tw-media`}
        src={src}
        alt={alt}
        loading='lazy'
        decoding='async'
        onLoad={() => setLoaded(true)}
      />
    </figure>
  );
}
