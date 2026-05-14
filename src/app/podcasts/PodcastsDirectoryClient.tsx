'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import Image from 'next/image';
import Link from 'next/link';
import ResonantIdentityLogo from '@/assets/images/ResonantIdentity_logo.png';

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
              boxShadow: hovered
                ? theme.effects.elevation16
                : theme.effects.elevation4,
              backgroundColor: theme.semanticColors.card.background,
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
              <h2
                className='text-2xl font-semibold transition-colors'
                style={{
                  color: hovered
                    ? theme.palette.themePrimary
                    : theme.semanticColors.text.primary,
                }}
              >
                The Resonant Identity
              </h2>

              {/* Description */}
              <p
                className='text-base leading-relaxed flex-1'
                style={{ color: theme.semanticColors.text.secondary }}
              >
                A podcast blending identity architecture, self-improvement, and
                practical frameworks for navigating transitions with clarity and
                intention.
              </p>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                <Link
                  href='/podcasts/theresonantid'
                  className='inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors'
                  style={{
                    backgroundColor: theme.palette.themePrimary,
                    color: theme.palette.white,
                  }}
                >
                  <span className='mr-2'>▶</span>
                  View Episodes
                </Link>
                <Link
                  href='/podcasts/theresonantid/about'
                  className='inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold transition-colors'
                  style={{
                    borderColor: theme.semanticColors.border.default,
                    color: theme.semanticColors.link.default,
                  }}
                >
                  <span className='mr-2'>ⓘ</span>
                  About TRI
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Empty state message for future podcasts */}
        <div
          className='flex flex-col items-center mt-16 pt-12 text-center border-t'
          style={{
            borderColor: theme.semanticColors.border.default,
            color: theme.semanticColors.text.tertiary,
          }}
        >
          <div className='text-5xl mb-4'>🎙️</div>
          <p style={{ color: theme.semanticColors.text.secondary }}>
            More podcasts coming soon.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default PodcastsDirectoryClient;
