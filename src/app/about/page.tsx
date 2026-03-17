import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { PercentageBullet } from '@/components/PercentageBullet';
import { AboutSectionWrapper } from '@/components/AboutSectionWrapper';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { AboutPageClient } from './AboutPageClient';
import { AboutCapabilities } from './AboutCapabilities';
import { AboutTimeline } from './AboutTimeline';
import { AboutSkillsTable } from './AboutSkillsTable';
import SectionHeading from './SectionHeading';
import { NewsletterSignupCTA } from '@/components/NewsletterSignupCTA';
import { AboutHeroCTAs } from './AboutHeroCTAs';
import { AboutFluxlineLink } from './AboutFluxlineLink';
import { AboutFeaturedProjects } from './AboutFeaturedProjects';

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
  'Professional Scrum Master I — PSM I (2023)',
  'Azure Fundamentals, AI, & Developer (2021–2024)',
  'M365 Fundamentals & Developer (2021–2024)',
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
          <AboutHeroCTAs />
        </Hero>

        {/* ── Professional Summary ─────────────────────────────────────────── */}
        <AboutSectionWrapper
          variant='default'
          className='mt-10 space-y-4 p-6'
        >
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
            creativity. As founder of <AboutFluxlineLink />, I help clients
            build not just solutions — but philosophies, brands, and living
            identities that evolve with them.
          </Typography>
        </AboutSectionWrapper>

        {/* ── Core Capabilities ────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='accent' className='mt-10 p-6 rounded-lg'>
          <SectionHeading isAccent>
            Core Capabilities &amp; Expertise
          </SectionHeading>
          <AboutCapabilities />
        </AboutSectionWrapper>

        {/* ── Work Experience ──────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='default' className='mt-10 p-6 rounded-lg'>
          <SectionHeading>Work Experience</SectionHeading>
          <AboutTimeline />
        </AboutSectionWrapper>

        {/* ── Featured Projects ────────────────────────────────────────────── */}
        <section className='mt-10 p-6 rounded-lg'>
          <SectionHeading>Featured Projects</SectionHeading>
          <AboutFeaturedProjects />
        </section>

        {/* ── Skills ───────────────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='default' className='mt-10 p-6 rounded-lg'>
          <SectionHeading>Skills &amp; Expertise</SectionHeading>
          <AboutSkillsTable />
        </AboutSectionWrapper>

        {/* ── Education & Certifications ───────────────────────────────────── */}
        <AboutSectionWrapper variant='subtle' className='mt-10 p-6 rounded-lg'>
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
                        <Typography
                          variant='label'
                          className='font-semibold text-gray-900 dark:text-white'
                        >
                          <strong>{name}</strong>
                        </Typography>
                        <Typography
                          variant='label'
                          className='text-gray-600 dark:text-gray-400'
                        >
                          {year}
                        </Typography>
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
        </AboutSectionWrapper>

        {/* ── Skills & Expertise Circles ───────────────────────────────────── */}
        <AboutSectionWrapper
          variant='skills'
          className='mt-10 md:p-8 p-6 mb-10 rounded-lg'
        >
          <SectionHeading>Proficiency Levels</SectionHeading>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-start justify-items-baseline'>
            {ABOUT_SKILLS.map((skill) => (
              <PercentageBullet
                key={skill.name}
                name={skill.name}
                percentage={skill.percentage}
              />
            ))}
          </div>
        </AboutSectionWrapper>

        {/* ── Newsletter CTA ───────────────────────────────────────────────── */}
        <div className='mt-10 mb-10'>
          <NewsletterSignupCTA />
        </div>
      </div>
    </AboutPageClient>
  );
}
