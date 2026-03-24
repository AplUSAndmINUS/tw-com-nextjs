'use client';

/**
 * TeamMemberCard Component
 * Displays individual team member information with clickable modal
 */

import React from 'react';
import Image from 'next/image';
import {
  ArrowExpand28Regular,
  ContactCard24Regular,
} from '@fluentui/react-icons';
import { Typography } from '@/components/Typography';
import { FluentIcon } from '@/components/FluentIcon';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TeamMemberModal } from './TeamMemberModal';
import { useColorVisionFilter } from '@/hooks/useColorVisionFilter';
import { type SocialIcon } from '@/components/SocialIcons/constants';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { useCardState } from '@/hooks/useCardState';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  socialLinks?: SocialIcon[];
}

interface TeamMemberCardProps {
  member: TeamMember;
  maxWidth?: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  maxWidth = '350px',
}) => {
  const { theme } = useAppTheme();
  const isMobileHook = useIsMobile();
  const isTabletHook = useIsTablet();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Only use actual hook values after mounting to avoid hydration mismatch
  const isMobile = isMounted ? isMobileHook : false;
  const isTablet = isMounted ? isTabletHook : false;
  const { filter } = useColorVisionFilter();
  const {
    isHovered,
    backgroundColor,
    accentColor,
    restStateColor,
    interactionProps,
  } = useCardState({ hoverable: true, clickable: true });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div
        {...interactionProps}
        onClick={!isMobile || !isTablet ? () => setIsModalOpen(true) : undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: theme.spacing.l,
          borderRadius: theme.borderRadius.container.medium,
          border: `1px solid ${isHovered ? accentColor : restStateColor}`,
          backgroundColor: backgroundColor,
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered
            ? theme.shadows.cardElevated
            : theme.shadows.card,
          cursor: isMobile ? 'default' : 'pointer',
          maxWidth,
          width: '100%',
        }}
      >
        {/* Photo */}
        <div
          style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: theme.borderRadius.container.small,
            backgroundColor: theme.palette.neutralLighter,
            marginBottom: theme.spacing.m,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`${member.name} - ${member.role}`}
              fill
              style={{
                objectFit: 'cover',
                filter: filter,
              }}
              sizes={`(max-width: 768px) 100vw, ${maxWidth}`}
            />
          ) : (
            <FluentIcon
              iconName={ContactCard24Regular}
              color={theme.palette.neutralTertiary}
            />
          )}
        </div>

        {/* Name and Role */}
        <div style={{ marginBottom: theme.spacing.m }}>
          <Typography
            variant='h3'
            style={{
              color: theme.palette.neutralPrimary,
              marginBottom: theme.spacing.s1,
            }}
          >
            {member.name}
          </Typography>

          <div style={{ marginBottom: theme.spacing.m }}>
            <Typography
              variant='label'
              style={{
                color: isHovered ? accentColor : restStateColor,
                fontSize: '1rem',
                fontStyle: 'italic',
                transition: 'color 0.2s ease',
              }}
            >
              {member.role}
            </Typography>
          </div>

          {member.bio && (
            <Typography
              variant='body'
              style={{
                color: isHovered
                  ? theme.semanticColors.text.primary
                  : theme.semanticColors.text.muted,
                fontSize: '0.875rem',
                lineHeight: theme.typography.lineHeights.relaxed,
                marginBottom: theme.spacing.m,
                transition: 'color 0.2s ease',
              }}
            >
              {member.bio}
            </Typography>
          )}
        </div>

        {/* Bottom bar: tagline social icons (left) + expand affordance (right) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: theme.spacing.s1,
          }}
        >
          {/* Social icons — tagline subset only */}
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.m,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {member.socialLinks
              ?.filter((s) => s.isTagline)
              .map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={item.tooltip}
                  onClick={(e) => e.stopPropagation()}
                  className='opacity-85 hover:opacity-100 transition-opacity duration-200'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    marginRight: theme.spacing.s1,
                  }}
                >
                  <FluentIcon
                    iconName={item.iconName}
                    color={isHovered ? accentColor : restStateColor}
                    style={{
                      transition: 'color 0.2s ease',
                    }}
                  />
                </a>
              ))}
          </div>

          {/* Expand icon — signals the card is clickable (desktop only) */}
          {!isMobile && (
            <FluentIcon
              iconName={ArrowExpand28Regular}
              color={theme.palette.themePrimary}
              style={{
                opacity: isHovered ? 0.9 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />
          )}
        </div>
      </div>

      {!isMobile && (
        <TeamMemberModal
          isOpen={isModalOpen}
          onDismiss={() => setIsModalOpen(false)}
          member={member}
        />
      )}
    </>
  );
};

export default TeamMemberCard;
