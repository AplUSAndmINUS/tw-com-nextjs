'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import Image from 'next/image';
import ResonantIdentityLogo from '@/assets/images/ResonantIdentity_logo.png';
import { Typography } from '@/components/Typography/Typography';
import { ThemedLink } from '@/components/ThemedLink/ThemedLink';

/**
 * PodcastsDirectoryClient
 * Directory/index page showing all available podcasts
 * Currently displays The Resonant Identity as a large tile card
 */
export function PodcastsDirectoryClient() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <PageLayout>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        {/* Page Header */}
        <Hero
          title='Podcasts'
          iconName='MicRegular'
          description='Long-form audio exploring identity, technology, and transformation.'
        />

        {/* Podcasts Grid - Currently one podcast */}
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* The Resonant Identity Card */}
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className='rounded-lg overflow-hidden border transition-all duration-200 flex flex-col'
            style={{
              borderColor: hovered
                ? theme.palette.themePrimary
                : theme.semanticColors.border.default,
              transform: hovered ? 'translateY(-4px)' : 'none',
              boxShadow: hovered ? theme.shadow16 : theme.shadow4,
              backgroundColor: theme.semanticColors.border.default,
            }}
          >
            {/* Image */}
            <div
              className='relative h-64 overflow-hidden'
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
            <div className='p-6 flex flex-col gap-4 flex-1'>
              {/* Title */}
              <Typography
                variant='h3'
                className='text-2xl font-semibold transition-colors'
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
                className='text-base leading-relaxed flex-1'
              >
                A podcast blending identity architecture, self-improvement, and
                practical frameworks for navigating transitions with clarity and
                intention.
              </Typography>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                <ThemedLink
                  variant='bodySmall'
                  hoverScale={1.05}
                  invertOnPress
                  href='/podcasts/theresonantid'
                  className='inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors'
                  style={{
                    backgroundColor: theme.palette.themePrimary,
                    color: theme.palette.white,
                    fontSize: '1rem',
                  }}
                >
                  <span className='mr-2'>▶</span>
                  View Episodes
                </ThemedLink>
                <ThemedLink
                  variant='bodySmall'
                  hoverScale={1.05}
                  invertOnPress
                  href='/podcasts/theresonantid/about'
                  className='inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold'
                  style={{
                    borderColor: theme.semanticColors.border.emphasis,
                    color: theme.palette.neutralSecondary,
                    fontSize: '1rem',
                  }}
                >
                  <span className='mr-2'>ⓘ</span>
                  About TRI
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
