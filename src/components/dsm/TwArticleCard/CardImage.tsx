'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './TwArticleCard.module.scss';

export interface CardImageProps {
  src: string;
  alt: string;
}

export function CardImage({ src, alt }: CardImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <figure className={styles.media}>
      <div className={`${styles.shimmer} ${loaded ? styles.shimmerDone : ''}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        className={`${styles.image} ${loaded ? styles.imageLoaded : ''} tw-media`}
        src={src}
        alt={alt}
        loading='lazy'
        decoding='async'
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </figure>
  );
}
