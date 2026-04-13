'use client';

import React from 'react';
import {
  Code24Regular,
  People24Regular,
  Heart24Regular,
} from '@fluentui/react-icons';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useCardState } from '@/hooks/useCardState';
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
  const isMobileHook = useIsMobile();
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobile = isMounted ? isMobileHook : false;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: theme.spacing.m,
      }}
    >
      {SKILL_CATEGORIES.map((cat) => (
        <SkillCard key={cat.category} cat={cat} />
      ))}
    </div>
  );
};

interface SkillCat {
  category: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  skills: string[];
}

function SkillCard({ cat }: { cat: SkillCat }) {
  const { theme } = useAppTheme();
  const {
    isHovered,
    currentColor,
    topBarColor,
    borderColor,
    backgroundImage,
    backgroundColor,
    boxShadow,
    interactionProps,
  } = useCardState({ hoverable: true });

  return (
    <div
      style={{
        borderRadius: theme.borderRadius.container.medium,
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        backgroundColor,
        backgroundImage,
        boxShadow,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        transition:
          'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
      }}
      {...interactionProps}
    >
      {/* Accent bar */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: topBarColor,
          transition: 'background-color 0.2s ease',
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: `${theme.spacing.m} ${theme.spacing.m} ${theme.spacing.s1}`,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.s1,
          borderBottom: `1px solid ${borderColor}`,
          transition: 'border-color 0.2s ease',
        }}
      >
        <FluentIcon iconName={cat.icon} color={currentColor} />
        <Typography
          variant='h5'
          style={{
            color: currentColor,
            margin: 0,
            fontSize: '0.95rem',
            fontWeight: 700,
            transition: 'color 0.2s ease',
          }}
        >
          {cat.category}
        </Typography>
      </div>

      {/* Skill list */}
      <ul
        style={{
          margin: 0,
          padding: theme.spacing.m,
          listStyleType: 'none',
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
                backgroundColor: currentColor,
                flexShrink: 0,
                opacity: isHovered ? 1 : 0.75,
                transition: 'background-color 0.2s ease, opacity 0.2s ease',
              }}
            />
            <Typography
              variant='body'
              style={{
                color: isHovered
                  ? theme.palette.neutralPrimary
                  : theme.palette.neutralSecondary,
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
}
