import { Metadata } from 'next';
import Image from 'next/image';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { ContentDetailNav } from '@/components/ContentDetailNav';
import ResonantIdentityLogo from '@/assets/images/ResonantIdentity_logo.png';
import ResonantIdentityIcon from '@/assets/images/ResonantIdentity_icon.png';

export const metadata: Metadata = {
  title: 'About The Resonant Identity',
  description:
    'A living extension of the Resonance Core Framework where identity becomes practice.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'About The Resonant Identity | Terence Waters',
    description:
      'Discover The Resonant Identity: the practical, community-based expression of the Resonance Core Framework.',
    url: 'https://terencewaters.com/podcasts/theresonantid',
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

const ecosystemLinks = [
  {
    label: 'Instagram',
    value: '@theresonantid',
    href: 'https://instagram.com/theresonantid',
  },
  { label: 'X', value: '@theresonantid', href: 'https://x.com/theresonantid' },
  {
    label: 'TikTok',
    value: '@theresonantid',
    href: 'https://www.tiktok.com/@theresonantid',
  },
  {
    label: 'Bluesky',
    value: '@theresonantid',
    href: 'https://bsky.app/profile/theresonantid.bsky.social',
  },
  {
    label: 'Podcast',
    value: 'The Resonant Identity',
    href: '/podcasts',
  },
  {
    label: 'Facebook Group',
    value: 'The Resonant Identity Community',
    href: 'https://www.facebook.com/groups/theresonantid',
  },
  {
    label: 'Facebook Page',
    value: 'The Resonant Identity',
    href: 'https://facebook.com/theresonantid',
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

export default function ResonantIdentityAboutPage() {
  return (
    <PageLayout
      featureImage={{
        src: ResonantIdentityLogo.src,
        alt: 'The Resonant Identity logo',
      }}
    >
      <div className='mx-auto max-w-3xl py-8 md:py-12'>
        <ContentDetailNav listingPath='/podcasts' listingLabel='Podcasts' />

        <article className='space-y-8 md:space-y-10'>
          <header
            className='rounded-2xl border p-6 md:p-8 text-center'
            style={{ backgroundColor: 'var(--colorNeutralBackground2)' }}
          >
            <Image
              src={ResonantIdentityIcon}
              alt='The Resonant Identity icon'
              width={72}
              height={72}
              className='mx-auto mb-4'
              priority
            />
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight'>
              The Resonant Identity
            </h1>
            <p
              className='mt-3 text-base sm:text-lg'
              style={{ color: 'var(--colorNeutralForeground2)' }}
            >
              A living extension of the Resonance Core Framework — where
              identity becomes practice.
            </p>
          </header>

          <section aria-labelledby='what-tri-is' className='space-y-4'>
            <h2
              id='what-tri-is'
              className='text-2xl font-semibold tracking-tight'
            >
              What The Resonant Identity Is
            </h2>
            <p className='leading-8'>
              The Resonant Identity began as a question:{' '}
              <em>What does it mean to build a self that feels true?</em> It
              grew out of the Resonance Core Framework and became a living
              rhythm for identity transformation, micro-lessons, and applied
              resonance — helping you build an identity that feels aligned,
              coherent, and grounded in who you&apos;re becoming.
            </p>
          </section>

          <section aria-labelledby='how-it-works' className='space-y-4'>
            <h2
              id='how-it-works'
              className='text-2xl font-semibold tracking-tight'
            >
              How It Works
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {howItWorks.map((item) => (
                <div key={item.title} className='rounded-xl border p-4 md:p-5'>
                  <h3 className='text-lg font-semibold'>{item.title}</h3>
                  <p
                    className='mt-2 text-sm leading-6'
                    style={{ color: 'var(--colorNeutralForeground2)' }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby='connection-to-rcf' className='space-y-4'>
            <h2
              id='connection-to-rcf'
              className='text-2xl font-semibold tracking-tight'
            >
              Connection to the RCF
            </h2>
            <p className='leading-8'>
              The Resonant Identity is built on the foundations of the Resonance
              Core Framework — a model for identity formation rooted in
              coherence, clarity, and intentional self-construction. TRI is the
              practical, community-based expression of that framework.
            </p>
          </section>

          <section
            aria-labelledby='community-layer'
            className='space-y-4 rounded-xl border p-5 md:p-6'
            style={{ backgroundColor: 'var(--colorNeutralBackground2)' }}
          >
            <h2
              id='community-layer'
              className='text-2xl font-semibold tracking-tight'
            >
              Community Layer
            </h2>
            <p className='leading-8'>
              The Facebook Group is the collaborative heart of TRI. It&apos;s
              where members share reflections, integrate the micro-lessons, and
              support each other through identity shifts. It&apos;s a space for
              resonance, not performance — a place to practice becoming.
            </p>
          </section>

          <section aria-labelledby='ecosystem-links' className='space-y-4'>
            <h2
              id='ecosystem-links'
              className='text-2xl font-semibold tracking-tight'
            >
              Ecosystem Links
            </h2>
            <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {ecosystemLinks.map((link) => (
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
                    <span
                      className='text-sm'
                      style={{ color: 'var(--colorNeutralForeground2)' }}
                    >
                      {link.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby='personal-note' className='space-y-4'>
            <h2
              id='personal-note'
              className='text-2xl font-semibold tracking-tight'
            >
              Personal Note
            </h2>
            <p className='leading-8'>
              TRI is one of the most meaningful things I&apos;ve created.
              It&apos;s the bridge between my philosophical work and the lived
              experience of becoming. I&apos;m glad you&apos;re here.
            </p>
          </section>

          <section
            aria-labelledby='call-to-action'
            className='rounded-xl border p-5 md:p-6'
          >
            <h2
              id='call-to-action'
              className='text-2xl font-semibold tracking-tight'
            >
              Get Started
            </h2>
            <p className='mt-3 leading-8'>
              Begin your 7-day setup and start building an identity that
              resonates.
            </p>
            <div className='mt-4 flex flex-col sm:flex-row gap-3'>
              <a
                href='/podcasts'
                className='inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold'
                style={{
                  backgroundColor: 'var(--colorBrandBackground)',
                  color: 'var(--colorNeutralForegroundOnBrand)',
                }}
              >
                Explore The Resonant Identity
              </a>
              <a
                href='https://www.facebook.com/groups/theresonantid'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-semibold'
              >
                Start the 7-Day Setup
              </a>
            </div>
          </section>
        </article>
      </div>
    </PageLayout>
  );
}
