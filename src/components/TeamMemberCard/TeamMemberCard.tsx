'use client';

/**
 * TeamMemberCard Component
 * Displays individual team member information with clickable modal
 */

import React from 'react';
import Image from 'next/image';
import {
  ArrowExpand20Regular,
  ContactCard24Regular,
} from '@fluentui/react-icons';
import { Typography } from '@/components/Typography';
import { FluentIcon } from '@/components/FluentIcon';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TeamMemberModal } from './TeamMemberModal';
import { useColorVisionFilter } from '@/hooks/useColorVisionFilter';
import { type SocialIcon } from '@/components/SocialIcons/constants';
import { useMouseHoverState } from '@/hooks/useHoverState';
import { useIsMobile } from '@/hooks/useMediaQuery';

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
  const isMobile = useIsMobile();
  const [isHovered, hoverProps] = useMouseHoverState();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { filter } = useColorVisionFilter();

  const isDark =
    theme.themeMode === 'dark' ||
    theme.themeMode === 'high-contrast' ||
    theme.themeMode === 'grayscale-dark';

  return (
    <>
      <div
        {...(!isMobile ? hoverProps : {})}
        onClick={!isMobile ? () => setIsModalOpen(true) : undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: theme.spacing.l,
          borderRadius: theme.borderRadius.container.medium,
          border: `1px solid ${
            isHovered
              ? theme.palette.themePrimary
              : theme.palette.neutralTertiaryAlt
          }`,
          backgroundColor: isHovered
            ? isDark
              ? theme.palette.neutralLighter
              : theme.palette.neutralLighterAlt
            : 'transparent',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered ? theme.shadows.m : 'none',
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
              color: theme.palette.themePrimary,
              marginBottom: theme.spacing.s1,
            }}
          >
            {member.name}
          </Typography>

          <div style={{ marginBottom: theme.spacing.m }}>
            <Typography
              variant='label'
              style={{
                color: theme.palette.themeSecondary,
                fontSize: '1rem',
                fontStyle: 'italic',
              }}
            >
              {member.role}
            </Typography>
          </div>

          {member.bio && (
            <Typography
              variant='body'
              style={{
                color: theme.palette.neutralPrimary,
                fontSize: '0.875rem',
                lineHeight: theme.typography.lineHeights.relaxed,
                marginBottom: theme.spacing.m,
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    opacity: 0.85,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.85';
                  }}
                >
                  <FluentIcon
                    iconName={item.iconName}
                    color={theme.palette.themePrimary}
                  />
                </a>
              ))}
          </div>

          {/* Expand icon — signals the card is clickable (desktop only) */}
          {!isMobile && (
            <FluentIcon
              iconName={ArrowExpand20Regular}
              color={theme.palette.themePrimary}
              style={{
                opacity: isHovered ? 0.9 : 0.5,
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
