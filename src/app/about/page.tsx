import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { PercentageBullet } from '@/components/PercentageBullet';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { AboutPageClient } from './AboutPageClient';
import { AboutCapabilities } from './AboutCapabilities';
import { AboutTimeline } from './AboutTimeline';
import { AboutSkillsTable } from './AboutSkillsTable';
import SectionHeading from './SectionHeading';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Founder, architect, and senior technologist with 15+ years bridging technical precision with human-centered design.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'About | Terence Waters',
    description:
      'Founder, architect, and senior technologist with 15+ years bridging technical precision with human-centered design.',
    url: 'https://terencewaters.com/about',
    siteName: 'Terence Waters',
    type: 'profile',
  },
  robots: getRobotsConfig(),
};

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

const EDUCATION = [
  {
    credential: 'MBA – IT Management',
    school: 'Western Governors University',
    year: '2019',
  },
  {
    credential: 'B.S. – Web Design & Development',
    school: 'Independence University',
    year: '2017',
  },
  {
    credential: 'Certificate – Web Programming',
    school: 'Salt Lake Community College',
    year: '2015',
  },
];

const CERTIFICATIONS = [
  'NASM Certified Personal Trainer (2025-2026)',
  'Google Project Management Certification (2023)',
  'Azure AI & Fundamentals (2021–2024)',
  'M365 Fundamentals & Developer (2021–2024)',
  'Professional Scrum Master I — PSM I (2021)',
  'ITIL Foundations v3 — AXELOS (2016)',
  'Adobe Creative Cloud Certified (2017–2022)',
  'A+ Certification — CompTIA (2002)',
];

export default function AboutPage() {
  return (
    <AboutPageClient>
      <div className='max-width-content pt-0 pb-12 xs:pb-12 md:py-8'>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <Hero
          title='About Me'
          iconName='Person24Regular'
          description='Dynamic, multidisciplinary founder and senior technologist with 15+ years of experience spanning IT architecture, full-stack development, brand identity, curriculum design, and personal transformation coaching — adept at translating complexity into clarity.'
        >
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href='/contact'
              className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
            >
              Book a Consultation
            </Link>
            <Link
              href='https://fluxline.pro'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
            >
              Visit Fluxline.pro
            </Link>
          </div>
        </Hero>

        {/* ── Professional Summary ─────────────────────────────────────────── */}
        <section className='mt-10 space-y-4 p-6 rounded-lg bg-gray-300/90 dark:bg-black/20'>
          <SectionHeading>Professional Summary</SectionHeading>
          <Typography
            variant='body'
            style={{ lineHeight: 1.75, fontSize: '1rem' }}
          >
            Architect of transformative systems, brand experiences, and
            human-centric technology — I specialize in modular web development,
            IT infrastructure, and scalable design ecosystems with a focus on
            emotional clarity, strategic innovation, and long-term impact.
          </Typography>
          <Typography
            variant='body'
            style={{ lineHeight: 1.75, fontSize: '1rem' }}
          >
            Over 15 years as a technologist, educator, and founder have shaped
            someone who bridges enterprise precision with human-centered
            creativity. As founder of{' '}
            <a
              href='https://fluxline.pro'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              Fluxline Resonance Group
            </a>
            , I help clients build not just solutions — but philosophies,
            brands, and living identities that evolve with them.
          </Typography>
        </section>

        {/* ── Core Capabilities ────────────────────────────────────────────── */}
        <section className='mt-12 p-6 rounded-lg'>
          <SectionHeading>Core Capabilities &amp; Expertise</SectionHeading>
          <AboutCapabilities />
        </section>

        {/* ── Work Experience ──────────────────────────────────────────────── */}
        <section className='mt-12 p-6 rounded-lg bg-gray-300/90 dark:bg-black/20'>
          <SectionHeading>Work Experience</SectionHeading>
          <AboutTimeline />
        </section>

        {/* ── Featured Projects ────────────────────────────────────────────── */}
        <section className='mt-12 p-6 rounded-lg'>
          <SectionHeading>Featured Projects</SectionHeading>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {FEATURED_PROJECTS.map((project) => (
              <div
                key={project.name}
                className='relative overflow-hidden rounded-xl border border-gray-500 dark:border-gray-700 p-4 bg-gray-100/70 dark:bg-gray-900/60 bg-[linear-gradient(160deg,rgba(59,130,246,0.08)_0%,transparent_42%)] shadow-sm'
              >
                <div className='w-full h-1 rounded-sm bg-blue-600 dark:bg-blue-400 mb-4' />
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
                    className='text-blue-600 dark:text-blue-300 mb-4'
                    style={{ fontSize: '1rem', lineHeight: 1.2 }}
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
            <Link
              href='/portfolio'
              className='inline-flex items-center justify-center w-full mt-2 px-4 py-2 text-sm font-semibold border-2 border-gray-500 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
            >
              View Full Portfolio
            </Link>
          </div>
        </section>

        {/* ── Skills ───────────────────────────────────────────────────────── */}
        <section className='mt-12 p-6 rounded-lg bg-gray-400/30 dark:bg-black/20'>
          <SectionHeading>Skills</SectionHeading>
          <AboutSkillsTable />
        </section>

        {/* ── Education & Certifications ───────────────────────────────────── */}
        <section className='mt-12 p-6 rounded-lg'>
          <SectionHeading>Education &amp; Certifications</SectionHeading>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <Typography
                variant='h4'
                className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-4'
              >
                Degrees
              </Typography>
              <ul className='space-y-3'>
                {EDUCATION.map((item) => (
                  <li key={item.credential} className='flex flex-col'>
                    <Typography
                      variant='body'
                      className='font-semibold text-gray-900 dark:text-white text-sm'
                    >
                      {item.credential}
                    </Typography>
                    <Typography
                      variant='label'
                      className='text-xs text-gray-500 dark:text-gray-400'
                    >
                      {item.school} · {item.year}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Typography
                variant='h4'
                className='text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-4'
              >
                Certifications
              </Typography>
              <ul className='space-y-2'>
                {CERTIFICATIONS.map((cert) => {
                  const leftParenIndex = cert.indexOf('(');
                  if (leftParenIndex > 0) {
                    const name = cert.substring(0, leftParenIndex).trim();
                    const year = cert.substring(leftParenIndex);
                    return (
                      <li key={cert} className='flex items-start gap-1 text-sm'>
                        <span className='font-semibold text-gray-900 dark:text-white'>
                          {name}
                        </span>
                        <span className='text-gray-600 dark:text-gray-400'>
                          {year}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={cert}
                      className='text-sm text-gray-600 dark:text-gray-300'
                    >
                      {cert}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Skills & Expertise Circles ───────────────────────────────────── */}
        <section className='mt-16 md:p-8 p-6 mb-10 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-400/30 dark:bg-black/20'>
          <SectionHeading>Skills &amp; Expertise</SectionHeading>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-start justify-items-baseline'>
            {ABOUT_SKILLS.map((skill) => (
              <PercentageBullet
                key={skill.name}
                name={skill.name}
                percentage={skill.percentage}
              />
            ))}
          </div>
        </section>
      </div>
    </AboutPageClient>
  );
}
