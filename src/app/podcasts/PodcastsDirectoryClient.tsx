'use client';

import React from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import Image from 'next/image';
import ResonantIdentityLogo from '@/assets/images/ResonantIdentity_logo.png';
import { Typography } from '@/components/Typography/Typography';
import { ThemedLink } from '@/components/ThemedLink/ThemedLink';
import { TRI_LINKS } from './theresonantid/constants';
import { FluentIcon } from '@/components/FluentIcon/FluentIcon';
import { ArrowRightIcon, WindowNewIcon } from '@/components/icons';
import styles from './PodcastsDirectoryClient.module.scss';

/**
 * PodcastsDirectoryClient
 * Directory/index page showing all available podcasts
 * Currently displays The Resonant Identity as a large tile card
 */
export function PodcastsDirectoryClient() {
  const { theme } = useAppTheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <PageLayout>
      <div className={styles.page}>
        {/* Page Header */}
        <Hero
          title='Podcasts'
          iconName='MicRegular'
          description='Long-form audio exploring identity, technology, and transformation.'
        />

        {/* Podcasts Grid - Currently one podcast */}
        <div className={styles.grid}>
          {/* The Resonant Identity Card */}
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={styles.card}
            style={{
              borderColor: hovered
                ? theme.palette.themePrimary
                : theme.semanticColors.border.default,
              transform: hovered ? 'translateY(-4px)' : 'none',
              boxShadow: hovered ? theme.shadows.cardElevated : theme.shadows.card,
              backgroundColor: theme.semanticColors.border.default,
            }}
          >
            {/* Image */}
            <div
              className={styles.image}
              style={{ backgroundColor: theme.palette.neutralLight }}
            >
              <Image
                src={ResonantIdentityLogo}
                alt='The Resonant Identity Logo'
                fill
                style={{ objectFit: 'contain', padding: '2rem' }}
                priority
              />
            </div>

            {/* Card Body */}
            <div className={styles.body}>
              {/* Title */}
              <Typography
                variant='h3'
                className={styles.title}
                style={{
                  color: hovered
                    ? theme.palette.themePrimary
                    : theme.semanticColors.text.primary,
                }}
              >
                The Resonant Identity
              </Typography>

              {/* Description */}
              <Typography
                variant='body'
                className={styles.description}
              >
                A podcast blending identity architecture, self-improvement, and
                practical frameworks for navigating transitions with clarity and
                intention.
              </Typography>

              {/* Action Buttons */}
              <div className={styles.actions}>
                <ThemedLink
                  variant='bodySmall'
                  hoverScale={1.05}
                  invertOnPress
                  href='/podcasts/theresonantid'
                  className={styles.primaryBtn}
                  style={{
                    backgroundColor: theme.palette.themePrimary,
                    color: theme.palette.white,
                    fontSize: '1rem',
                  }}
                >
                  View Episodes
                  <FluentIcon
                    color={theme.palette.white}
                    iconName={ArrowRightIcon}
                    style={{ marginLeft: '0.5rem' }}
                  />
                </ThemedLink>
                <ThemedLink
                  variant='bodySmall'
                  hoverScale={1.05}
                  invertOnPress
                  href={TRI_LINKS.about}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.secondaryBtn}
                  style={{
                    borderColor: theme.semanticColors.border.emphasis,
                    color: theme.palette.neutralSecondary,
                    fontSize: '1rem',
                  }}
                >
                  About The Resonant Identity
                  <FluentIcon
                    color={theme.palette.neutralSecondary}
                    iconName={WindowNewIcon}
                    style={{ marginLeft: '0.5rem' }}
                  />
                </ThemedLink>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state message for future podcasts */}
        {/* <div
          className='flex flex-col items-center mt-16 pt-12 text-center border-t'
          style={{
            borderColor: theme.semanticColors.border.default,
            color: theme.semanticColors.text.muted,
          }}
        >
          <div className='text-5xl mb-4'>🎙️</div>
          <Typography variant='body' style={{ color: theme.semanticColors.text.muted }}>
            More podcasts coming soon.
          </Typography>
        </div> */}
      </div>
    </PageLayout>
  );
}

export default PodcastsDirectoryClient;
