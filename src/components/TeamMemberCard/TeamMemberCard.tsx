'use client';

/**
 * TeamMemberCard Component
 * Displays individual team member information with clickable modal
 */

import React from 'react';
import Image from 'next/image';
import { ContactCard24Regular } from '@fluentui/react-icons';
import { Typography } from '@/components/Typography';
import { FluentIcon } from '@/components/FluentIcon';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TeamMemberModal } from './TeamMemberModal';
import { useColorVisionFilter } from '@/hooks/useColorVisionFilter';
import { type SocialIcon } from '@/components/SocialIcons/constants';

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
  const [isHovered, setIsHovered] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { filter } = useColorVisionFilter();

  const isDark =
    theme.themeMode === 'dark' ||
    theme.themeMode === 'high-contrast' ||
    theme.themeMode === 'grayscale-dark';

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
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
          cursor: 'pointer',
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

          <Typography
            variant='body'
            style={{
              color: theme.palette.themeSecondary,
              fontWeight: theme.typography.fontWeights.semiBold,
              fontSize: '0.875rem',
              fontStyle: 'italic',
              marginBottom: theme.spacing.m,
            }}
          >
            {member.role}
          </Typography>

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
        </div>

        {/* Click to view details hint */}
        <div
          style={{
            fontSize: '0.75rem',
            color: theme.palette.themeSecondary,
            fontStyle: 'italic',
            opacity: 0.7,
          }}
        >
          Click to view details
        </div>
      </div>

      <TeamMemberModal
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        member={member}
      />
    </>
  );
};

export default TeamMemberCard;
