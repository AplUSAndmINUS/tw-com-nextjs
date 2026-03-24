'use client';

/**
 * AboutPageClient Component
 * Renders About content inside the shared PageLayout with a custom media pane.
 */

import React from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { TeamMemberCard, type TeamMember } from '@/components/TeamMemberCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import AboutPortrait from '@/assets/images/AboutMePortrait.jpg';
import { getSocialIcons } from '@/components/SocialIcons/constants';

interface AboutPageClientProps {
  children: React.ReactNode;
}

export const AboutPageClient: React.FC<AboutPageClientProps> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const isBelowMdHook = useMediaQuery('md', 'less-than');

  // Only use actual hook values after mounting to avoid hydration mismatch.
  // Below md, the card uses a shorter bio to keep the stacked layout tighter.
  const isCompactCard = isMounted ? isBelowMdHook : false;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const teamMember: TeamMember = {
    id: 'terence-waters',
    name: 'Terence Waters',
    role: 'CEO, Founder & Chief Architect',
    bio: isCompactCard
      ? ''
      : 'Visionary technologist and systems thinker, architecting transformative digital experiences and coaching frameworks.',
    photo: AboutPortrait.src,
    socialLinks: getSocialIcons(),
  };

  const mediaPane = (
    <div className='flex w-full items-center justify-center pt-4 md:pt-0'>
      <div className='w-full max-w-xs px-4 md:max-w-md md:px-0 md:overflow-hidden md:pt-1 md:pb-1'>
        <TeamMemberCard member={teamMember} maxWidth='400px' />
      </div>
    </div>
  );

  return (
    <PageLayout
      mediaPane={mediaPane}
      layoutOptions={{
        paneSizeClasses: 'md:w-[40%] lg:w-1/3',
        contentRightOffsetClasses: 'md:mr-[40%] lg:mr-[33.333333%]',
        contentLeftOffsetClasses: 'md:ml-[40%] lg:ml-[33.333333%]',
      }}
    >
      {children}
    </PageLayout>
  );
};
