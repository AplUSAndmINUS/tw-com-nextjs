/**
 * About page skills data
 *
 * Rendered as the proficiency meters in the About page's Credentials section.
 * Names are stored in display case — the meters print them verbatim rather
 * than leaning on a CSS transform, which used to turn "it strategy" into
 * "It Strategy".
 */

export interface AboutSkill {
  name: string;
  percentage: number;
}

export const ABOUT_SKILLS: AboutSkill[] = [
  {
    name: 'Design thinking',
    percentage: 100,
  },
  {
    name: 'Figma prototyping',
    percentage: 100,
  },
  {
    name: 'Relational brand design',
    percentage: 99,
  },
  {
    name: 'Creative direction',
    percentage: 99,
  },
  {
    name: 'Oral & written communication',
    percentage: 99,
  },
  {
    name: 'Personal & business coaching',
    percentage: 98,
  },
  {
    name: 'Experience strategy',
    percentage: 98,
  },
  {
    name: 'Front-end development',
    percentage: 98,
  },
  {
    name: 'Cloud & hybrid solutions',
    percentage: 97,
  },
  {
    name: 'Cross-functional leadership',
    percentage: 96,
  },
  {
    name: 'Systems architecture',
    percentage: 95,
  },
  {
    name: 'IT strategy & consulting',
    percentage: 95,
  },
  {
    name: 'Project management',
    percentage: 95,
  },
  {
    name: 'Back-end development',
    percentage: 94,
  },
  {
    name: 'Business structuring',
    percentage: 94,
  },
  {
    name: 'QA & automation',
    percentage: 92,
  },
  {
    name: 'AI integration',
    percentage: 91,
  },
  {
    name: 'Motion design',
    percentage: 89,
  },
];
