'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useCardState } from '@/hooks/useCardState';

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  bullets: string[];
}

interface TimelineCardProps {
  entry: TimelineEntry;
  index: number;
  isLast: boolean;
}

const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    period: '2025 — Present',
    title: 'CEO, Founder & Chief Architect',
    org: 'Fluxline Resonance Group, LLC',
    bullets: [
      'Architects modular systems integrating IT consulting, brand identity, and personal transformation.',
      'Delivers cloud, web, and infrastructure solutions using Azure, M365, Next.js, and DevOps workflows.',
      'Creates curriculum-style documentation, SOPs, and training assets for clients and teams.',
      'Mentors entrepreneurs and small businesses in technical and strategic development.',
      'Integrates AI-assisted tools (GitHub Copilot, VS Code AI) into client workflows and training materials.',
    ],
  },
  {
    period: '2015 — 2025',
    title: 'Senior Software Engineer / Solutions Analyst',
    org: 'Intermountain Healthcare',
    bullets: [
      'Designed and developed enterprise applications including MyHealth+ and Provider Digital Experience.',
      'Led UX/UI initiatives, user testing, and design thinking workshops across multiple departments.',
      'Managed change, knowledge, and ITSM processes for large-scale system implementations.',
      'Served as IT Architecture Liaison and Design Facilitator on platform unification projects.',
    ],
  },
  {
    period: '2016 — 2021',
    title: 'Adjunct Professor',
    org: 'Salt Lake Community College (SATTS)',
    bullets: [
      'Taught JavaScript, W3 development, graphic design, and Adobe Creative Cloud.',
      'Mentored students in front-end/back-end development, Git workflows, and design principles.',
      'Conducted critiques, program reviews, and curriculum evaluations.',
    ],
  },
  {
    period: '2008 — 2022',
    title: 'Founder & CEO',
    org: 'Enteractive Studios, LLC',
    bullets: [
      'Delivered freelance web development, graphic design, tutoring, and creative services.',
      'Built brand identities and digital assets for individuals, nonprofits, and small businesses.',
    ],
  },
];

function TimelineCard({ entry, index, isLast }: TimelineCardProps) {
  const { theme, isDark } = useAppTheme();
  const isMobileHook = useIsMobile();
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobile = isMounted ? isMobileHook : false;
  const { accentColor, isHovered, interactionProps, restStateColor } =
    useCardState({ hoverable: true });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const circleSize = isMobile ? '1.75rem' : '2rem';

  return (
    <div
      style={{ display: 'flex', gap: theme.spacing.l }}
      {...interactionProps}
    >
      {/* Left column: circle + connecting line */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: circleSize,
        }}
      >
        {/* Numbered circle */}
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: '50%',
            backgroundColor: isHovered ? accentColor : restStateColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 0 4px ${accentColor}28`,
            zIndex: 1,
          }}
        >
          <span
            style={{
              color: isDark
                ? theme.colorNeutralBackground2
                : theme.colorNeutralForegroundOnBrand,
              fontSize: isMobile ? '0.625rem' : '0.6875rem',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Connecting line to next entry */}
        <div
          style={{
            width: '2px',
            flex: 1,
            minHeight: '2rem',
            background: isHovered
              ? `linear-gradient(180deg, ${accentColor}60, ${theme.palette.themeSecondary}30)`
              : restStateColor,
            borderRadius: '1px',
            marginTop: '0.25rem',
            transition: 'background 0.3s ease',
          }}
        />
      </div>

      {/* Right column: content */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : theme.spacing.xxl }}>
        {/* Period */}
        <Typography
          variant='caption'
          style={{
            color: isHovered ? accentColor : restStateColor,
            fontWeight: 700,
            fontSize: '0.8125rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: theme.spacing.xs,
            marginTop: '0.2rem',
            transition: 'color 0.2s ease',
          }}
        >
          {entry.period}
        </Typography>

        {/* Role */}
        <Typography
          variant='h4'
          style={{
            color: theme.semanticColors.text.heading,
            margin: 0,
            marginBottom: theme.spacing.xs,
            lineHeight: 1.3,
            fontSize: isMobile ? '1rem' : '1.125rem',
          }}
        >
          {entry.title}
        </Typography>

        {/* Org */}
        <Typography
          variant='body'
          style={{
            color: isHovered ? accentColor : restStateColor,
            fontStyle: 'italic',
            fontSize: '0.875rem',
            display: 'block',
            margin: 0,
            marginBottom: theme.spacing.s1,
            transition: 'color 0.2s ease',
          }}
        >
          {entry.org}
        </Typography>

        {/* Bullets */}
        <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
          {entry.bullets.map((bullet, bi) => (
            <li
              key={bi}
              style={{
                listStyleType: 'disc',
                marginBottom: bi < entry.bullets.length - 1 ? '0.3rem' : 0,
              }}
            >
              <Typography
                variant='body'
                style={{
                  color: isHovered
                    ? theme.semanticColors.text.primary
                    : theme.semanticColors.text.muted,
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                  margin: 0,
                  transition: 'color 0.2s ease',
                }}
              >
                {bullet}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const AboutTimeline: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {TIMELINE_ENTRIES.map((entry, index) => {
        return (
          <TimelineCard
            key={`${entry.org}-${index}`}
            entry={entry}
            index={index}
            isLast={index === TIMELINE_ENTRIES.length - 1}
          />
        );
      })}
    </div>
  );
};
