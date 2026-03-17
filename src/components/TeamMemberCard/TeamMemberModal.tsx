'use client';

/**
 * TeamMemberModal Component
 * Displays detailed team member information in a modal
 */

import React from 'react';
import Image from 'next/image';
import { ContactCard24Regular } from '@fluentui/react-icons';
import { Modal } from '@/components/Modal';
import { Typography } from '@/components/Typography';
import { FluentIcon } from '@/components/FluentIcon';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TeamMember } from './TeamMemberCard';
import { useColorVisionFilter } from '@/hooks/useColorVisionFilter';

interface TeamMemberModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  member: TeamMember;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onDismiss,
  member,
}) => {
  const { theme } = useAppTheme();
  const { filter } = useColorVisionFilter();

  const isDark =
    theme.themeMode === 'dark' ||
    theme.themeMode === 'high-contrast' ||
    theme.themeMode === 'grayscale-dark';

  const socialLinks = member.socialLinks ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      ariaLabel={`${member.name} - Team Member Details`}
      maxWidth='900px'
      showCloseButton={true}
    >
      {/* Header with photo and info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: theme.spacing.l,
          flexWrap: 'wrap',
          padding: theme.spacing.xl,
        }}
      >
        {/* Photo */}
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
            width: '200px',
            height: '200px',
            borderRadius: theme.borderRadius.container.medium,
            overflow: 'hidden',
            backgroundColor: theme.palette.neutralLighter,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              sizes='200px'
            />
          ) : (
            <FluentIcon
              iconName={ContactCard24Regular}
              color={theme.palette.neutralTertiary}
            />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <Typography
            variant='h2'
            style={{
              color: theme.palette.neutralPrimary,
              marginBottom: theme.spacing.s1,
            }}
          >
            {member.name}
          </Typography>

          <div style={{ marginBottom: theme.spacing.l }}>
            <Typography
              variant='label'
              style={{
                color: theme.palette.themeSecondary,
                fontWeight: theme.typography.fontWeights.semiBold,
                fontSize: '1.125rem',
                fontStyle: 'italic',
              }}
            >
              {member.role}
            </Typography>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div style={{ marginTop: theme.spacing.m }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: theme.spacing.m,
                }}
              >
                {socialLinks.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: `${theme.spacing.s1} ${theme.spacing.m}`,
                      borderRadius: theme.borderRadius.container.tiny,
                      backgroundColor: theme.palette.neutralQuaternaryAlt,
                      color: theme.palette.themePrimary,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem',
                      fontWeight: theme.typography.fontWeights.semiBold,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.backgroundColor = `${theme.palette.neutralQuaternary}90`; // Add some transparency on hover
                      el.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.backgroundColor =
                        theme.palette.neutralQuaternaryAlt;
                      el.style.transform = 'translateY(0)';
                    }}
                  >
                    <FluentIcon
                      iconName={item.iconName}
                      color={theme.palette.themePrimary}
                    />
                    {item.tooltip}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bio section */}
      <div
        style={{
          backgroundColor: isDark
            ? theme.palette.neutralLighterAlt
            : theme.palette.neutralQuaternaryAlt,
          padding: `0 ${theme.spacing.xl} ${theme.spacing.l} ${theme.spacing.xl}`,
        }}
      >
        <Typography
          variant='h4'
          style={{
            color: theme.palette.themePrimary,
            marginBottom: theme.spacing.s2,
          }}
        >
          About
        </Typography>
        <Typography
          variant='body'
          style={{
            color: theme.palette.neutralPrimary,
            lineHeight: theme.typography.lineHeights.relaxed,
          }}
        >
          {member.bio}
        </Typography>
      </div>
    </Modal>
  );
};

export default TeamMemberModal;
