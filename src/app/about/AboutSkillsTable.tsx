'use client';

import React from 'react';
import {
  Code24Regular,
  People24Regular,
  Heart24Regular,
} from '@fluentui/react-icons';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { FluentIcon } from '@/components/FluentIcon';
import { useIsMobile } from '@/hooks/useMediaQuery';

const SKILL_CATEGORIES = [
  {
    category: 'Technical',
    icon: Code24Regular,
    skills: [
      'React / Next.js / Node.js',
      'TypeScript / JavaScript / C#',
      'SCSS / Tailwind / .NET',
      'Azure Cloud & M365',
      'DevOps / CI-CD / GitHub Actions',
      'UX/UI Design & Research',
      'ServiceNow / ITSM',
      'AI-assisted development',
      'Data analysis & documentation',
    ],
  },
  {
    category: 'Leadership & Strategy',
    icon: People24Regular,
    skills: [
      'Project Management',
      'Agile / Scrum (PSM I)',
      'Stakeholder Facilitation',
      'Curriculum Design',
      'Change Management',
      'KPI Development',
      'Cross-functional Collaboration',
      'IT Architecture & Strategy',
    ],
  },
  {
    category: 'Human-Centered',
    icon: Heart24Regular,
    skills: [
      'Coaching & Mentoring',
      'Communication Strategy',
      'Customer Experience',
      'Instructional Design',
      'Conflict Diffusion',
      'Personal Development',
      'Brand Identity',
      'Storytelling & Copywriting',
    ],
  },
];

export const AboutSkillsTable: React.FC = () => {
  const { theme } = useAppTheme();
  const isMobile = useIsMobile();

  const accentPalette = [
    theme.palette.themePrimary,
    theme.semanticColors.link.default,
    theme.semanticColors.border.emphasis,
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: theme.spacing.m,
      }}
    >
      {SKILL_CATEGORIES.map((cat, index) => {
        const accentColor = accentPalette[index % accentPalette.length];
        return (
          <div
            key={cat.category}
            style={{
              border: `1px solid ${theme.semanticColors.border.default}`,
              borderTop: `4px solid ${accentColor}`,
              borderRadius: theme.borderRadius.container.medium,
              overflow: 'hidden',
              backgroundColor: theme.semanticColors.background.elevated,
              backgroundImage: `linear-gradient(160deg, ${accentColor}0d 0%, transparent 50%)`,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: `${theme.spacing.m} ${theme.spacing.m} ${theme.spacing.s1}`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.s1,
                borderBottom: `1px solid ${theme.semanticColors.border.default}`,
              }}
            >
              <FluentIcon iconName={cat.icon} color={accentColor} />
              <Typography
                variant='h5'
                style={{
                  color: accentColor,
                  margin: 0,
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                }}
              >
                {cat.category}
              </Typography>
            </div>

            {/* Skill chips */}
            <ul
              style={{
                margin: 0,
                padding: theme.spacing.m,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.xs,
              }}
            >
              {cat.skills.map((skill) => (
                <li
                  key={skill}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.s1,
                    paddingBottom: theme.spacing.xs,
                    borderBottom: `1px solid ${theme.semanticColors.border.default}28`,
                  }}
                >
                  <div
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: accentColor,
                      flexShrink: 0,
                      opacity: 0.75,
                    }}
                  />
                  <Typography
                    variant='body'
                    style={{
                      color: theme.semanticColors.text.muted,
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {skill}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
