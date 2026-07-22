'use client';

import { ThemedLink } from '@/components/ThemedLink/ThemedLink';
import { BaseCard } from '@/components/BaseCard';
import styles from './AboutFeaturedProjects.module.scss';

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
  return (
    <div className={styles.grid}>
      {FEATURED_PROJECTS.map((project) => {
        return (
          <BaseCard
            key={project.name}
            title={project.name}
            subheading={project.period}
            body={project.roles}
            label={project.skills}
            hoverable={true}
            className={styles.card}
          />
        );
      })}
      <ThemedLink
        href='/portfolio'
        variant='body'
        className={styles.portfolioLink}
      >
        View Full Portfolio
      </ThemedLink>
    </div>
  );
}
