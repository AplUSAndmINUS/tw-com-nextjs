'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { ThemedLink } from '@/components/ThemedLink/ThemedLink';

const FEATURED_PROJECTS = [
  {
    name: 'Fluxline Resonance Group 2.0',
    period: 'Q3 2025–Q1 2026',
    roles: 'CEO · Technical Lead · Main Architect',
    skills: 'Azure, Next.js, C#, CI/CD, Brand Identity',
  },
  {
    name: 'MyIntermountain Unified Intranet',
    period: 'Q1–Q4 2024',
    roles: 'Technical Lead · Sr Developer · Scrum Lead',
    skills: 'IT Architecture, Agile, Cross-team Strategy',
  },
  {
    name: 'Affiliates iLogin Implementation',
    period: 'Q2 2022–Q1 2025',
    roles: 'Project Manager · Technical Lead',
    skills: 'Project Management, Stakeholder Facilitation',
  },
  {
    name: 'Employee Portal .NET SharePoint',
    period: 'Q3 2021–Q4 2022',
    roles: 'Design Lead · Front-end Dev · IT Architecture',
    skills: 'UX Research, Prototyping, Design Systems',
  },
  {
    name: 'Provider Digital Experience',
    period: 'Q3 2020–Q2 2021',
    roles: 'Lead Designer · Front-end Development',
    skills: 'UI/UX, Design Thinking, User Testing',
  },
  {
    name: 'MyHealth+ App & Website',
    period: 'Q2 2019–Q2 2020',
    roles: 'Front-end Dev · Solutions Analyst',
    skills: 'Full-stack, Agile, User Training & Support',
  },
];

export function AboutFeaturedProjects() {
  const { theme } = useAppTheme();

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {FEATURED_PROJECTS.map((project) => (
        <div
          key={project.name}
          className='relative overflow-hidden rounded-xl border p-4 bg-white dark:bg-gray-900/60 bg-[linear-gradient(160deg,rgba(254,254,254,0.52),transparent_42%)] shadow-sm'
          style={{ borderColor: theme.semanticColors.border.default }}
        >
          <div
            className='w-full h-1 rounded-sm mb-4'
            style={{ backgroundColor: theme.palette.themePrimary }}
          />
          <div className='space-y-1'>
            <Typography
              variant='h4'
              className='font-semibold text-gray-900 dark:text-white leading-snug'
              style={{ fontSize: '1.25rem', lineHeight: 1.25 }}
            >
              {project.name}
            </Typography>
            <Typography
              variant='h5'
              className='mb-4'
              style={{
                fontSize: '1rem',
                lineHeight: 1.2,
                color: theme.semanticColors.link.default,
              }}
            >
              {project.period}
            </Typography>
            <Typography
              variant='body'
              className='text-gray-800 dark:text-gray-300'
              style={{ fontSize: '0.875rem', lineHeight: 1.4 }}
            >
              {project.roles}
            </Typography>
            <Typography
              variant='label'
              className='text-xs text-gray-600 dark:text-gray-400'
            >
              {project.skills}
            </Typography>
          </div>
        </div>
      ))}
      <ThemedLink
        href='/portfolio'
        variant='body'
        className='inline-flex items-center justify-center w-full mt-2 px-4 py-2 border-2 border-gray-500 dark:border-white-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
      >
        View Full Portfolio
      </ThemedLink>
    </div>
  );
}
