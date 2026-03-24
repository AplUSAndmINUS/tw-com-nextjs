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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import AboutPortrait from '@/assets/images/AboutMePortrait.jpg';
import { getSocialIcons } from '@/components/SocialIcons/constants';
import { useFeatureImageLayout } from '@/hooks/useFeatureImageLayout';

interface AboutPageClientProps {
  children: React.ReactNode;
}

export const AboutPageClient: React.FC<AboutPageClientProps> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const isBelowMdHook = useMediaQuery('md', 'less-than');

  // Only use actual hook values after mounting to avoid hydration mismatch
  const useStackedLayout = isMounted ? isBelowMdHook : false;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const { containerClasses, imagePaneClasses, contentPaneClasses } =
    useFeatureImageLayout({
      isStacked: useStackedLayout,
      stackedImagePaneClasses: 'flex items-center justify-center pt-4 md:pt-8',
      stackedContentPaneClasses: 'flex-1 flex flex-col',
      fixedPaneLeadingClasses:
        'flex items-center justify-center pt-[var(--site-header-height)] md:pt-0',
      fixedPaneSizeClasses: 'md:w-[40%] lg:w-1/3',
      fixedContentRightOffsetClasses: 'md:mr-[40%] lg:mr-[33.333333%]',
      fixedContentLeftOffsetClasses: 'md:ml-[40%] lg:ml-[33.333333%]',
    });

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

  return (
    <SiteLayout showFooter={false}>
      {/* Mobile: normal scrolling with standard footer | Tablet/Desktop: contained viewport with overlay footer */}
      <div className={containerClasses}>
        {/* TeamMemberCard pane - fixed and vertically centered on tablet/desktop */}
        {/* Tablet portrait (md): 40%/60% width (4x8) | Tablet landscape+ (lg): 33% width (4x8) */}
        <aside className={imagePaneClasses}>
          <div
            className={
              useStackedLayout
                ? 'w-full max-w-xs px-4 md:px-0 flex items-center justify-center'
                : 'w-full max-w-xs aspect-square md:max-w-md md:aspect-auto px-4 md:px-0 md:overflow-hidden flex items-center justify-center pt-1 pb-1'
            }
          >
            <TeamMemberCard member={teamMember} maxWidth='400px' />
          </div>
        </aside>

        {/* Content pane - scrollable independently with responsive mirrored margins */}
        {/* Tablet portrait (md): 60% reserve | Tablet landscape+ (lg): 67% reserve */}
        <div className={contentPaneClasses}>
          <div
            id='content-scroll-pane'
            className={
              useStackedLayout
                ? 'flex-1 px-4 sm:px-6 xs:pt-0 lg:pb-8 mt-8'
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
