import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { Typography } from '@/components/Typography';
import { Card } from '@/components/ui/Card';
import EducationPortrait from '@/assets/images/EducationTrainingPortrait.jpg';

export const metadata: Metadata = {
  title: 'Coaching',
  description:
    'One-on-one coaching and group offerings for creators, technologists, and leaders.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Coaching | Terence Waters',
    description:
      'One-on-one coaching and group offerings for creators, technologists, and leaders.',
    url: 'https://terencewaters.com/coaching',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const offerings = [
  {
    title: '1:1 Coaching',
    duration: '60 minutes',
    description:
      'A dedicated session to work through your specific challenge — career pivots, creative blocks, technical decisions, or leadership development.',
    highlights: ['Personalized agenda', 'Recorded session (optional)', 'Follow-up notes'],
    icon: '🎯',
  },
  {
    title: 'Creator Accelerator',
    duration: '4-week program',
    description:
      'A structured program for creators ready to grow their audience, refine their content strategy, and build sustainable creative habits.',
    highlights: ['Weekly 1:1 sessions', 'Content review & feedback', 'Growth strategy'],
    icon: '🚀',
  },
  {
    title: 'Tech Career Coaching',
    duration: '8-week program',
    description:
      'For software engineers, technical leads, and those transitioning into tech roles. Covers career strategy, communication, and leadership skills.',
    highlights: ['Resume & portfolio review', 'Interview prep', 'Career roadmap'],
    icon: '💡',
  },
  {
    title: 'Group Workshops',
    duration: 'Custom format',
    description:
      'Interactive workshops for teams and communities on creativity, technology, productivity, and building in public.',
    highlights: ['Team facilitation', 'Custom curriculum', 'Actionable takeaways'],
    icon: '👥',
  },
];

export default function CoachingPage() {
  return (
    <PageLayout
      featureImage={{
        src: EducationPortrait.src,
        alt: 'Terence Waters coaching',
        title: 'Coaching & Offerings',
      }}
    >
      <div className='py-8'>
        <header className='mb-10 border-b pb-8'>
          <Typography variant='h1' className='text-4xl font-bold'>
            Coaching & Offerings
          </Typography>
          <Typography
            variant='body'
            className='text-xl text-gray-600 dark:text-gray-400 mt-3 max-w-2xl'
          >
            I help creators, technologists, and leaders navigate transitions,
            unlock their potential, and build with intention.
          </Typography>
        </header>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12'>
          {offerings.map((offering) => (
            <Card key={offering.title}>
              <div className='flex items-center gap-3 mb-3'>
                <span className='text-3xl'>{offering.icon}</span>
                <div>
                  <Typography variant='h3' className='text-xl font-semibold'>
                    {offering.title}
                  </Typography>
                  <span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>
                    {offering.duration}
                  </span>
                </div>
              </div>
              <Typography
                variant='body'
                className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'
              >
                {offering.description}
              </Typography>
              <ul className='space-y-1 mb-4'>
                {offering.highlights.map((item) => (
                  <li key={item} className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2'>
                    <span className='text-green-500'>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <section className='bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700'>
          <Typography variant='h2' className='text-2xl font-semibold mb-3'>
            Ready to Start?
          </Typography>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 mb-6 max-w-xl'
          >
            Whether you&apos;re navigating a career change, launching a creative
            project, or just need a thought partner — I&apos;m here to help.
          </Typography>
          <Link
            href='/contact'
            className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
          >
            Book a Discovery Call
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
