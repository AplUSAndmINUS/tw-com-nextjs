'use client';

/**
 * AboutPageClient Component
 * Displays the About page with TeamMemberCard on the left
 * and content on the right (with responsive layout)
 */

import React from 'react';
import { SiteLayout } from '@/layouts/SiteLayout';
import { Footer } from '@/components/Footer';
import { FooterOverlay } from '@/components/FooterOverlay';
import { TeamMemberCard, type TeamMember } from '@/components/TeamMemberCard';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import AboutPortrait from '@/assets/images/AboutMePortrait.jpg';
import { getSocialIcons } from '@/components/SocialIcons/constants';

interface AboutPageClientProps {
  children: React.ReactNode;
}

export const AboutPageClient: React.FC<AboutPageClientProps> = ({
  children,
}) => {
  const { layoutPreference } = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const useStackedLayout = isMobile || isTablet;
  const isLeftHanded = layoutPreference === 'left-handed';

  const teamMember: TeamMember = {
    id: 'terence-waters',
    name: 'Terence Waters',
    role: 'CEO, Founder & Chief Architect',
    bio: useStackedLayout
      ? ''
      : 'Visionary technologist and systems thinker, architecting transformative digital experiences and coaching frameworks.',
    photo: AboutPortrait.src,
    socialLinks: getSocialIcons(),
  };

  const cardPaneClasses = useStackedLayout
    ? 'flex items-center justify-center pt-16'
    : isLeftHanded
      ? 'flex items-center justify-center pt-16 md:pt-0 md:fixed md:right-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden'
      : 'flex items-center justify-center pt-16 md:pt-0 md:fixed md:left-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden';

  const contentPaneClasses = useStackedLayout
    ? 'flex-1 flex flex-col'
    : isLeftHanded
      ? 'flex-1 min-w-0 md:mr-[50%] lg:mr-[33.333333%] md:h-full md:overflow-y-auto md:overflow-x-hidden flex flex-col'
      : 'flex-1 min-w-0 md:ml-[50%] lg:ml-[33.333333%] md:h-full md:overflow-y-auto md:overflow-x-hidden flex flex-col';

  return (
    <SiteLayout showFooter={false}>
      {/* Mobile: normal scrolling with standard footer | Tablet/Desktop: contained viewport with overlay footer */}
      <div
        className={
          useStackedLayout
            ? 'flex flex-col min-h-[calc(100vh-4rem)]'
            : 'flex flex-col md:flex-row min-h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] md:overflow-hidden'
        }
      >
        {/* TeamMemberCard pane - fixed and vertically centered on tablet/desktop */}
        {/* Tablet portrait (md): 50% width (6x6) | Tablet landscape+ (lg): 33% width (4x8) */}
        <aside className={cardPaneClasses}>
          <div
            className={
              useStackedLayout
                ? 'w-full max-w-xs aspect-square px-4 flex items-center justify-center'
                : 'w-full max-w-xs aspect-square md:max-w-md md:aspect-auto px-4 md:px-0 md:overflow-hidden flex items-center justify-center'
            }
          >
            <TeamMemberCard member={teamMember} maxWidth='320px' />
          </div>
        </aside>

        {/* Content pane - scrollable independently with responsive mirrored margins */}
        {/* Tablet portrait (md): 50% reserve | Tablet landscape+ (lg): 33% reserve */}
        <div className={contentPaneClasses}>
          <div
            id='content-scroll-pane'
            className={
              useStackedLayout
                ? 'flex-1 px-4 sm:px-6 pt-8 pb-8 mt-8'
                : 'flex-1 px-4 sm:px-6 lg:px-8 pt-0 pb-8 md:py-8 md:min-h-full md:flex md:flex-col'
            }
          >
            <div
              className={useStackedLayout ? 'w-full' : 'md:w-full md:my-auto'}
            >
              {children}
            </div>
          </div>

          {/* Mobile: Standard footer always visible (shown only on mobile) */}
          <div className={useStackedLayout ? 'block' : 'md:hidden'}>
            <Footer isCompact />
          </div>
        </div>
      </div>

      {/* Tablet/Desktop: Interactive footer overlay (client component, hidden on mobile) */}
      <div className={useStackedLayout ? 'hidden' : 'hidden md:block'}>
        <FooterOverlay />
      </div>
    </SiteLayout>
  );
};
