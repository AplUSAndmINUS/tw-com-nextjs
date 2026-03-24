'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { useIsMobile } from '@/hooks/useMediaQuery';

const CAPABILITIES = [
  {
    title: 'Personable & Approachable',
    body: 'I prioritize human connection and empathy—building systems around how people feel, think, and grow.',
  },
  {
    title: 'Technologically Curious',
    body: 'I integrate emerging trends in design, AI, and backend architecture to fuel innovation and unlock new possibilities.',
  },
  {
    title: 'Intentional Learner',
    body: 'My process is iterative and expansive—driven by a commitment to growth, clarity, and adaptive evolution.',
  },
  {
    title: 'Creative & Modular Thinker',
    body: 'I architect brands and systems that flex, scale, and resonate—balancing creativity with precision.',
  },
  {
    title: 'Detail-Crafted Excellence',
    body: 'Every element I create is designed and crafted with clarity and care, from backend logic to frontend flow to the emotional cadence of copy.',
  },
  {
    title: 'Problem Alchemist',
    body: 'I synthesize complexity from lost-aspect tangled systems into streamlined, actionable solutions.',
  },
  {
    title: 'Proactive Strategist',
    body: "I don't wait for clarity—I design it. I move early, test intelligently, and pivot with intention.",
  },
  {
    title: 'Results + Resonance',
    body: "I deliver outcomes clients can measure and frameworks they can feel. Impact isn't just numeric—it's experiential.",
  },
];

export const AboutCapabilities: React.FC = () => {
  const { theme } = useAppTheme();
  const isMobileHook = useIsMobile();
  const [isMounted, setIsMounted] = React.useState(false);
  const isMobile = isMounted ? isMobileHook : false;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  const accentColor = theme.semanticColors.accent.teal; // Mirrors the accent color used in the Hero section for visual cohesion

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: `${theme.spacing.l} ${theme.spacing.xl}`,
      }}
    >
      {CAPABILITIES.map((cap) => {
        return (
          <div
            key={cap.title}
            style={{
              display: 'flex',
              gap: theme.spacing.m,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '1.125rem',
                height: '1.125rem',
                borderRadius: '50%',
                backgroundColor: accentColor,
                flexShrink: 0,
                marginTop: '0.2rem',
                boxShadow: `0 0 0 4px ${accentColor}28`,
              }}
            />
            <div>
              <Typography
                variant='h5'
                style={{
                  color: theme.semanticColors.text.heading,
                  margin: `0 0 ${theme.spacing.s2} 0`,
                  fontWeight: 600,
                }}
              >
                {cap.title}
              </Typography>
              <Typography
                variant='body'
                style={{
                  color: theme.semanticColors.text.muted,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {cap.body}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};
