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
import styles from './AboutPageClient.module.scss';

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
    <div className={styles.mediaPane}>
      <div className={styles.mediaInner}>
        <TeamMemberCard member={teamMember} maxWidth='400px' />
      </div>
    </div>
  );

  return (
    <PageLayout
      mediaPane={mediaPane}
      hasMediaPane
      layoutOptions={{
        paneSizeClasses: styles.paneSize,
        contentRightOffsetClasses: styles.contentRightOffset,
        contentLeftOffsetClasses: styles.contentLeftOffset,
      }}
    >
      {children}
    </PageLayout>
  );
};
