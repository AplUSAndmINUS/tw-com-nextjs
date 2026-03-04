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
import AboutPortrait from '@/assets/images/AboutMePortrait.jpg';

interface AboutPageClientProps {
  children: React.ReactNode;
}

export const AboutPageClient: React.FC<AboutPageClientProps> = ({
  children,
}) => {
  const { layoutPreference } = useAppTheme();
  const isLeftHanded = layoutPreference === 'left-handed';

  // Team member data for Terence Waters
  const teamMember: TeamMember = {
    id: 'terence-waters',
    name: 'Terence Waters',
    role: 'CEO, Founder & Chief Architect',
    bio: 'Visionary technologist and systems thinker, architecting transformative digital experiences and coaching frameworks.',
    photo: AboutPortrait.src,
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/terencewaters',
      instagram: 'https://www.instagram.com/aplusinflux',
      facebook: 'https://www.facebook.com/aplusinflux',
      twitter: 'https://twitter.com/aplusinflux',
      threads: 'https://www.threads.com/@aplusinflux',
      github: 'https://github.com/aplusandminus',
      email: 'mailto:terence@example.com',
    },
  };

  const cardPaneClasses = isLeftHanded
    ? 'md:fixed md:right-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden'
    : 'md:fixed md:left-0 md:top-16 md:bottom-0 md:w-1/2 lg:w-1/3 md:flex md:items-center md:justify-center md:p-4 md:overflow-hidden';

  const contentPaneClasses = isLeftHanded
    ? 'flex-1 md:mr-[50%] lg:mr-[33.333333%] md:h-full md:overflow-y-auto flex flex-col'
    : 'flex-1 md:ml-[50%] lg:ml-[33.333333%] md:h-full md:overflow-y-auto flex flex-col';

  return (
    <SiteLayout showFooter={false}>
      {/* Mobile: normal scrolling with standard footer | Tablet/Desktop: contained viewport with overlay footer */}
      <div className='min-h-[calc(100vh-4rem)] flex flex-col md:flex-row md:h-[calc(100vh-4rem)] md:overflow-hidden'>
        {/* TeamMemberCard pane - fixed and vertically centered on tablet/desktop */}
        {/* Tablet portrait (md): 50% width (6x6) | Tablet landscape+ (lg): 33% width (4x8) */}
        <aside className={cardPaneClasses}>
          <div className='w-full max-w-md h-[33.33vh] md:h-auto px-4 py-6 md:py-0 overflow-hidden flex items-center justify-center'>
            <TeamMemberCard member={teamMember} maxWidth='320px' />
          </div>
        </aside>

        {/* Content pane - scrollable independently with responsive mirrored margins */}
        {/* Tablet portrait (md): 50% reserve | Tablet landscape+ (lg): 33% reserve */}
        <div className={contentPaneClasses}>
          <div className='flex-1 px-4 sm:px-6 lg:px-8 pt-0 pb-8 md:py-8 md:min-h-full md:flex md:flex-col'>
            <div className='md:w-full md:my-auto'>{children}</div>
          </div>

          {/* Mobile: Standard footer always visible (shown only on mobile) */}
          <div className='md:hidden'>
            <Footer isCompact />
          </div>
        </div>
      </div>

      {/* Tablet/Desktop: Interactive footer overlay (client component, hidden on mobile) */}
      <div className='hidden md:block'>
        <FooterOverlay />
      </div>
    </SiteLayout>
  );
};
