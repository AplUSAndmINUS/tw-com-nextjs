import { Metadata } from 'next';
import Link from 'next/link';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { AboutSectionWrapper } from '@/components/AboutSectionWrapper';
import ResonantIdentityLogo from '@/assets/images/ResonantIdentity_logo.png';
import { Hero } from '@/components/Hero/Hero';
import { TiktokLogo } from '@/assets/svgs/TiktokLogo';
import { InstagramIcon } from '@/assets/svgs/InstagramLogo';
import { TwitterLogo } from '@/assets/svgs/TwitterLogo';
import { FacebookIcon } from '@/assets/svgs/FacebookLogo';
import { Typography } from '@/components/Typography/Typography';
import SectionHeading from '@/app/about/SectionHeading';
import { TRI_LINKS } from '../constants';

export const metadata: Metadata = {
  title: 'About The Resonant Identity',
  description:
    'A living extension of the Resonance Core Framework where identity becomes practice.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'About The Resonant Identity | Terence Waters',
    description:
      'Discover The Resonant Identity: the practical, community-based expression of the Resonance Core Framework.',
    url: 'https://terencewaters.com/podcasts/theresonantid/about',
    siteName: 'Terence Waters',
    images: [
      {
        url: 'https://terencewaters.com/images/ResonantIdentity_logo.png',
        alt: 'The Resonant Identity logo',
      },
    ],
    type: 'website',
  },
  robots: getRobotsConfig(),
};

const socialLinks = [
  {
    label: 'Instagram',
    value: '@theresonantid',
    href: TRI_LINKS.instagram,
  },
  { label: 'X', value: '@theresonantid', href: TRI_LINKS.twitter },
  {
    label: 'TikTok',
    value: '@theresonantid',
    href: TRI_LINKS.tiktok,
  },
  {
    label: 'Bluesky',
    value: '@theresonantid',
    href: 'https://bsky.app/profile/theresonantid.bsky.social',
  },
  {
    label: 'Podcast',
    value: 'The Resonant Identity',
    href: TRI_LINKS.podcast,
  },
  {
    label: 'Facebook Group',
    value: 'The Resonant Identity Community',
    href: TRI_LINKS.facebookGroup,
  },
  {
    label: 'Facebook Page',
    value: 'The Resonant Identity',
    href: TRI_LINKS.facebookPage,
  },
];

const howItWorks = [
  {
    title: 'Micro-Lessons',
    description:
      'Short, actionable teachings designed to shift identity through resonance rather than force.',
  },
  {
    title: '7-Day Setup',
    description:
      'A guided onboarding sequence that helps you establish your personal resonance baseline.',
  },
  {
    title: 'Ongoing Practice',
    description:
      'Weekly prompts, reflections, and identity-building exercises that keep you aligned.',
  },
];

function SocialIconLink({
  href,
  label,
  external = true,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        border: '1px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </Link>
  );
}

export default function ResonantIdentityAboutPage() {
  return (
    <PageLayout
      featureImage={{
        src: ResonantIdentityLogo.src,
        alt: 'The Resonant Identity logo',
      }}
    >
      <div className='max-width-content pt-0 xs:pb-0 md:py-8'>
        <Hero
          title='The Resonant Identity Podcast'
          iconName='MicRegular'
          description='A living extension of the Resonance Core Framework where identity becomes practice and is formed through coherence.'
          backArrow={true}
          backArrowPath='/podcasts/theresonantid'
        >
          <Typography
            variant='h5'
            style={{
              textTransform: 'unset',
            }}
          >
            Social Media:
          </Typography>
          <div className='flex flex-wrap items-center gap-3'>
            <SocialIconLink
              href={TRI_LINKS.instagram}
              label='The Resonant Identity on Instagram'
            >
              <InstagramIcon style={{ width: '24px', height: '24px' }} />
            </SocialIconLink>
            <SocialIconLink
              href={TRI_LINKS.twitter}
              label='The Resonant Identity on X'
            >
              <TwitterLogo style={{ width: '24px', height: '24px' }} />
            </SocialIconLink>
            <SocialIconLink
              href={TRI_LINKS.tiktok}
              label='The Resonant Identity on TikTok'
            >
              <TiktokLogo style={{ width: '24px', height: '24px' }} />
            </SocialIconLink>
            <SocialIconLink
              href={TRI_LINKS.facebookGroup}
              label='The Resonant Identity Community Facebook Group'
            >
              <FacebookIcon style={{ width: '24px', height: '24px' }} />
            </SocialIconLink>
          </div>
        </Hero>

        <AboutSectionWrapper
          variant='default'
          className='mt-10 space-y-4 rounded-lg p-6'
        >
          <div aria-labelledby='what-tri-is'>
            <SectionHeading>What The Resonant Identity Is</SectionHeading>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300'
              style={{ lineHeight: 1.75, fontSize: '1rem' }}
            >
              The Resonant Identity began as a question:{' '}
              <em>What does it mean to build a self that feels true?</em> It
              grew out of the Resonance Core Framework and became a living
              rhythm for identity transformation, micro-lessons, and applied
              resonance — helping you build an identity that feels aligned,
              coherent, and grounded in who you&apos;re becoming.
            </Typography>
          </div>
        </AboutSectionWrapper>

        <AboutSectionWrapper variant='accent' className='mt-10 rounded-lg p-6'>
          <div aria-labelledby='how-it-works'>
            <SectionHeading isAccent>How It Works</SectionHeading>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              {howItWorks.map((item) => (
                <div key={item.title} className='rounded-xl border p-4 md:p-5'>
                  <Typography variant='h5' className='text-lg font-semibold'>
                    {item.title}
                  </Typography>
                  <Typography
                    variant='body'
                    className='mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300'
                  >
                    {item.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </AboutSectionWrapper>

        <AboutSectionWrapper variant='default' className='mt-10 rounded-lg p-6'>
          <div aria-labelledby='connection-to-rcf'>
            <SectionHeading>Connection to the RCF</SectionHeading>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300'
              style={{ lineHeight: 1.75, fontSize: '1rem' }}
            >
              The Resonant Identity is built on the foundations of the Resonance
              Core Framework — a model for identity formation rooted in
              coherence, clarity, and intentional self-construction. TRI is the
              practical, community-based expression of that framework.
            </Typography>
          </div>
        </AboutSectionWrapper>

        <AboutSectionWrapper variant='subtle' className='mt-10 rounded-lg p-6'>
          <div aria-labelledby='community-layer'>
            <SectionHeading>Community Layer</SectionHeading>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300'
              style={{ lineHeight: 1.75, fontSize: '1rem' }}
            >
              The Facebook Group is the collaborative heart of TRI. It&apos;s
              where members share reflections, integrate the micro-lessons, and
              support each other through identity shifts. It&apos;s a space for
              resonance, not performance — a place to practice becoming.
            </Typography>
          </div>
        </AboutSectionWrapper>

        <AboutSectionWrapper variant='default' className='mt-10 rounded-lg p-6'>
          <div aria-labelledby='social-links'>
            <SectionHeading>Social Links</SectionHeading>
            <ul className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {socialLinks.map((link) => (
                <li key={link.label} className='rounded-lg border px-4 py-3'>
                  <a
                    href={link.href}
                    className='inline-flex flex-col'
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={
                      link.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    <span className='text-sm font-semibold'>{link.label}</span>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      {link.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </AboutSectionWrapper>

        <AboutSectionWrapper variant='default' className='mt-10 rounded-lg p-6'>
          <div aria-labelledby='personal-note'>
            <SectionHeading>Personal Note</SectionHeading>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300'
              style={{ lineHeight: 1.75, fontSize: '1rem' }}
            >
              TRI is one of the most meaningful things I&apos;ve created.
              It&apos;s the bridge between my philosophical work and the lived
              experience of becoming. I&apos;m glad you&apos;re here.
            </Typography>
          </div>
        </AboutSectionWrapper>

        <AboutSectionWrapper
          variant='accent'
          className='mt-10 mb-10 rounded-lg p-6'
        >
          <div aria-labelledby='call-to-action'>
            <SectionHeading isAccent>Get Started</SectionHeading>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300'
              style={{ lineHeight: 1.75, fontSize: '1rem' }}
            >
              Begin your 7-day setup and start building an identity that
              resonates.
            </Typography>
            <div className='mt-4 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/podcasts/theresonantid'
                className='inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold'
                style={{
                  backgroundColor: 'var(--colorBrandBackground)',
                  color: 'var(--colorNeutralForegroundOnBrand)',
                }}
              >
                Listen to the Podcast
              </Link>
              <a
                href='https://www.facebook.com/groups/theresonantid'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold'
              >
                Join the Community &amp; Start 7-Day Setup
              </a>
            </div>
          </div>
        </AboutSectionWrapper>
      </div>
    </PageLayout>
  );
}
