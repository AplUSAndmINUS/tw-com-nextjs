'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ContentItem } from '@/content/types';
import { ViewType } from '@/store';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { LoadingImage } from '@/components/ui/LoadingImage';
import styles from './ContentCard.module.scss';

interface ContentCardProps {
  item: ContentItem;
  href: string;
  viewType?: ViewType;
  contentType?: string;
}

export function ContentCard({
  item,
  href,
  viewType = 'grid',
  contentType,
}: ContentCardProps) {
  if (viewType === 'large') {
    return <LargeCard item={item} href={href} contentType={contentType} />;
  }
  if (viewType === 'small') {
    return <SmallCard item={item} href={href} />;
  }
  return <GridCard item={item} href={href} contentType={contentType} />;
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({
  item,
  href,
  contentType,
}: {
  item: ContentItem;
  href: string;
  contentType?: string;
}) {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href={href}
      className={styles.cardLink}
      onPointerEnter={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setIsHovered(true); }}
      onPointerLeave={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setIsHovered(false); }}
    >
      <article className={styles.gridArticle}>
        {item.imageUrl && (
          <div className={styles.gridImageWrap}>
            <LoadingImage
              src={item.imageUrl}
              alt={item.imageAlt ?? item.title}
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.gridContent}>
          {(item.category || contentType) && (
            <span
              className={styles.category}
              style={{ color: theme.semanticColors.link.default }}
            >
              {item.category ?? contentType}
            </span>
          )}
          <h2
            className={styles.gridTitle}
            style={{
              color: isHovered ? theme.semanticColors.link.default : undefined,
            }}
          >
            {item.title}
          </h2>
          {item.excerpt && (
            <p className={styles.gridExcerpt}>
              {item.excerpt}
            </p>
          )}
          <div className={styles.gridMeta}>
            {item.author && <span>{item.author}</span>}
            {item.date && <time dateTime={item.date}>{item.date}</time>}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className={styles.tags}>
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={styles.tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Large Card ───────────────────────────────────────────────────────────────

function LargeCard({
  item,
  href,
  contentType,
}: {
  item: ContentItem;
  href: string;
  contentType?: string;
}) {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href={href}
      className={styles.cardLink}
      onPointerEnter={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setIsHovered(true); }}
      onPointerLeave={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setIsHovered(false); }}
    >
      <article className={styles.largeArticle}>
        {item.imageUrl && (
          <div className={styles.largeImageWrap}>
            <LoadingImage
              src={item.imageUrl}
              alt={item.imageAlt ?? item.title}
              fill
              sizes='(max-width: 768px) 100vw, 256px'
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.largeBody}>
          {(item.category || contentType) && (
            <span
              className={styles.category}
              style={{ color: theme.semanticColors.link.default }}
            >
              {item.category ?? contentType}
            </span>
          )}
          <h2
            className={styles.largeTitle}
            style={{
              color: isHovered ? theme.semanticColors.link.default : undefined,
            }}
          >
            {item.title}
          </h2>
          {item.excerpt && (
            <p className={styles.largeExcerpt}>
              {item.excerpt}
            </p>
          )}
          <div className={styles.largeMeta}>
            {item.author && <span>{item.author}</span>}
            {item.date && <time dateTime={item.date}>{item.date}</time>}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className={styles.tags}>
              {item.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className={styles.tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// ─── Small Card ───────────────────────────────────────────────────────────────

function SmallCard({ item, href }: { item: ContentItem; href: string }) {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href={href}
      className={styles.cardLink}
      onPointerEnter={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setIsHovered(true); }}
      onPointerLeave={(e: React.PointerEvent) => { if (e.pointerType === 'mouse') setIsHovered(false); }}
    >
      <article className={styles.smallArticle}>
        {item.imageUrl && (
          <div className={styles.smallImageWrap}>
            <LoadingImage
              src={item.imageUrl}
              alt={item.imageAlt ?? item.title}
              fill
              sizes='64px'
              className={styles.smallImage}
            />
          </div>
        )}
        <div className={styles.smallBody}>
          <h3
            className={styles.smallTitle}
            style={{
              color: isHovered ? theme.semanticColors.link.default : undefined,
            }}
          >
            {item.title}
          </h3>
          <div className={styles.smallMeta}>
            {item.category && <span>{item.category}</span>}
            {item.date && <time dateTime={item.date}>{item.date}</time>}
          </div>
        </div>
      </article>
    </Link>
  );
}
