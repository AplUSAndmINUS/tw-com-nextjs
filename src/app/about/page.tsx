import { Metadata } from 'next';
import Script from 'next/script';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { PercentageBullet } from '@/components/PercentageBullet';
import { AboutSectionWrapper } from '@/components/AboutSectionWrapper';
import { ABOUT_SKILLS } from '@/content/aboutSkills';
import { AboutPageClient } from './AboutPageClient';
import { AboutTimeline } from './AboutTimeline';
import { AboutSkillsTable } from './AboutSkillsTable';
import SectionHeading from './SectionHeading';
import { AboutHeroCTAs } from './AboutHeroCTAs';
import { AboutFeaturedProjects } from './AboutFeaturedProjects';
import { getPersonSchema, getAboutPageSchema } from '@/utils/structuredData';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Terence Waters is a founder, architect, and senior technologist with 15+ years bridging technical precision with human-centered design.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'About | Terence Waters',
    description:
      'Terence Waters is a founder, architect, and senior technologist with 15+ years bridging technical precision with human-centered design.',
    url: 'https://terencewaters.com/about',
    siteName: 'Terence Waters',
    type: 'profile',
  },
  robots: getRobotsConfig(),
};

const EDUCATION = [
  {
    credential: 'Ph.D. – Technology Management, Information Systems',
    school: 'Northcentral University',
    year: '2026-2030 (in progress)',
  },
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
  const personSchema = getPersonSchema('https://terencewaters.com/about');
  const aboutPageSchema = getAboutPageSchema();

  return (
    <AboutPageClient>
      <Script
        id='about-person-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personSchema) }}
      />
      <Script
        id='about-aboutpage-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutPageSchema) }}
      />
      <div className='max-width-content pt-0 xs:pb-0 md:py-8'>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <Hero
          title="Hi! I'm Terence :)"
          iconName='Person24Regular'
          description='Come on in and stay awhile; I have some stories to share.'
        >
          <div className='mt-2' />
          <AboutHeroCTAs />
        </Hero>

        {/* ── Opening Statement ────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='accent' className='mt-10 space-y-6 p-6'>
          <SectionHeading isAccent>Hey...Who's this guy?!</SectionHeading>
          <Typography
            variant='body'
            style={{ lineHeight: 1.75, fontSize: '1.125rem' }}
          >
            I help people and organizations rebuild the parts of themselves they
            thought were permanent.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1.125rem',
            }}
          >
            I’m a systems architect by training, a designer by instinct, and a
            coach by necessity — because most people don’t need more
            information. <br /> We need <strong>clarity</strong>,{' '}
            <strong>structure</strong>, and a way back to ourselves.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1.125rem',
            }}
          >
            For the past 15+ years, I’ve worked across IT architecture,
            full‑stack development, brand identity, curriculum design, and
            personal transformation — translating complexity into clarity for
            individuals, founders, and mission‑driven teams.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1.125rem',
            }}
          >
            If you're here, you're probably in a season of becoming.
          </Typography>
          <Typography
            variant='blockquote'
            style={{
              lineHeight: 1.75,
              fontWeight: 600,
            }}
          >
            <em>You're in the right place.</em>
          </Typography>
        </AboutSectionWrapper>

        {/* ── What I Believe ───────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='subtle' className='mt-10 space-y-4 p-6'>
          <SectionHeading>What I Believe</SectionHeading>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            Identity isn't a mask you wear —{' '}
            <em>
              <strong>it's a frequency you return to.</strong>
            </em>
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            Real transformation isn’t about forcing yourself into a new shape.
            <br />
            <br />
            It’s architectural. <br />
            It’s structural. <br />
            It’s the slow, intentional re-alignment of the internal systems that
            shape how you think, create, and move through the world.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            Whether I’m building a platform, designing a brand, or coaching
            someone through a transition, my work is always about the same
            thing:
          </Typography>
          <Typography
            variant='blockquote'
            style={{
              lineHeight: 1.75,
              fontSize: '1.125rem',
              fontWeight: 600,
            }}
          >
            Helping people return to their resonance.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            Not the version of themselves they were taught to be.{' '}
            <em>
              <strong>The version they actually are.</strong>
            </em>
          </Typography>
        </AboutSectionWrapper>

        {/* ── What I Do ────────────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='default' className='mt-10 space-y-4 p-6'>
          <SectionHeading>What I Do</SectionHeading>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            I build systems — technical, personal, and organizational — that
            help people operate with more clarity, coherence, and confidence.
          </Typography>

          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
              marginTop: '1.5rem',
            }}
          >
            Everything I build is designed to be:
          </Typography>
          <ul
            className='ml-6 mt-2 space-y-1'
            style={{ lineHeight: 1.75 }}
          >
            <li>✨ Human-centered</li>
            <li>✨ Emotionally intelligent</li>
            <li>✨ Technically sound</li>
            <li>✨ Scalable</li>
            <li>✨ Deeply resonant</li>
          </ul>

          <div className='space-y-4 mt-6'>
            <div>
              <Typography
                variant='h4'
                style={{ marginBottom: '0.5rem', fontWeight: 600 }}
              >
                For individuals:
              </Typography>

              <Typography
                variant='body'
                style={{
                  lineHeight: 1.75,
                  fontSize: '1rem',
                }}
              >
                I help you understand your identity architecture, dissolve the
                noise, and rebuild your internal systems so you can move through
                life with more alignment and less friction.
              </Typography>
            </div>

            <div>
              <Typography
                variant='h4'
                style={{ marginBottom: '0.5rem', fontWeight: 600 }}
              >
                For founders & creators:
              </Typography>
              <Typography
                variant='body'
                style={{
                  lineHeight: 1.75,
                  fontSize: '1rem',
                }}
              >
                I design brands, platforms, and workflows that feel like you —
                not the version of you the internet told you to be.
              </Typography>
            </div>

            <div>
              <Typography
                variant='h4'
                style={{ marginBottom: '0.5rem', fontWeight: 600 }}
              >
                For teams & organizations:
              </Typography>
              <Typography
                variant='body'
                style={{
                  lineHeight: 1.75,
                  fontSize: '1rem',
                }}
              >
                I architect modular systems, digital experiences, and strategic
                frameworks that make complexity feel navigable and growth feel
                possible.
              </Typography>
            </div>
          </div>
        </AboutSectionWrapper>

        {/* ── How I Work ───────────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='subtle' className='mt-10 space-y-4 p-6'>
          <SectionHeading>How I Work</SectionHeading>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            I'm a strange mix of:
          </Typography>
          <ul
            className='ml-6 mt-2 space-y-1'
            style={{ lineHeight: 1.75 }}
          >
            <li>✨ Technologist</li>
            <li>✨ Designer</li>
            <li>✨ Strategist</li>
            <li>✨ Educator</li>
            <li>✨ Coach</li>
            <li>✨ Quiet observer of human behavior</li>
          </ul>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            I see patterns quickly. <br />I translate complexity into clarity.{' '}
            <br />
            And I build systems that help people feel more like themselves —
            whether that's through a website, a workflow, a curriculum, or a
            conversation.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            My approach is:
          </Typography>
          <ul
            className='ml-6 mt-2 space-y-1'
            style={{ lineHeight: 1.75 }}
          >
            <li>✨ Warm</li>
            <li>✨ Structured</li>
            <li>✨ Curious</li>
            <li>✨ Iterative</li>
            <li>✨ Grounded in real human experience</li>
          </ul>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            I don't force people into frameworks. <br />
            <em>
              <strong>I design frameworks around people.</strong>
            </em>
          </Typography>
        </AboutSectionWrapper>

        {/* ── Why This Work Matters ────────────────────────────────────────── */}
        <AboutSectionWrapper variant='accent' className='mt-10 space-y-4 p-6'>
          <SectionHeading isAccent>Why This Work Matters to Me</SectionHeading>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            Because I’ve rebuilt myself more than once — professionally,
            personally, creatively.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            Every time, the thing that saved me wasn’t motivation or hustle.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1.125rem',
              fontWeight: 600,
            }}
          >
            It was architecture.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            Structure. <br />
            Clarity. <br />A way to understand who I was becoming and why.
          </Typography>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            <em>
              <strong>Now I help others do the same.</strong>
            </em>
            <br />
            Let me show you how I've done it!
          </Typography>
        </AboutSectionWrapper>

        {/* ── Core Capabilities ────────────────────────────────────────────── */}
        {/* <AboutSectionWrapper variant='accent' className='mt-10 p-6 rounded-lg'>
          <SectionHeading isAccent>
            Core Capabilities &amp; Expertise
          </SectionHeading>
          <AboutCapabilities />
        </AboutSectionWrapper> */}

        {/* ── Work Experience ──────────────────────────────────────────────── */}
        <AboutSectionWrapper variant='default' className='mt-10 p-6 rounded-lg'>
          <SectionHeading>Work Experience</SectionHeading>
          <AboutTimeline />
        </AboutSectionWrapper>

        {/* ── Featured Projects ────────────────────────────────────────────── */}
        <section className='mt-10 md:p-6 rounded-lg'>
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
                      style={{ lineHeight: 1.4 }}
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

        {/* -- If You're here.... ───────────────────────────────────── */}
        <AboutSectionWrapper
          variant='accent'
          className='mt-10 md:p-8 p-6 mb-10 rounded-lg'
        >
          <SectionHeading isAccent>If You're here....</SectionHeading>
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            You’re probably navigating a transition — personal, professional,
            creative, or internal.
          </Typography>
          <br />
          <Typography
            variant='body'
            style={{
              lineHeight: 1.75,
              fontSize: '1rem',
            }}
          >
            You don’t need to have it all figured out. <br />
            You just need a place where you can breathe, think, and rebuild with
            intention.
          </Typography>
          <br />
          <Typography
            variant='blockquote'
            style={{
              lineHeight: 1.75,
            }}
          >
            I’d be honored to walk with you.
          </Typography>
        </AboutSectionWrapper>
      </div>
    </AboutPageClient>
  );
}
