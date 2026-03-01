import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import AboutPortrait from '@/assets/images/AboutMePortrait.jpg';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Author, technologist, and creative thinker. Learn more about Terence Waters.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'About | Terence Waters',
    description:
      'Author, technologist, and creative thinker. Learn more about Terence Waters.',
    url: 'https://terencewaters.com/about',
    siteName: 'Terence Waters',
    type: 'profile',
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

export default function AboutPage() {
  return (
    <PageLayout
      featureImage={{
        src: AboutPortrait.src,
        alt: 'About Me',
        title: 'About Me',
      }}
    >
      <div className='pt-0 pb-8 md:py-8'>
        <Hero
          title='About Me'
          iconName='Person24Regular'
          description='Author, technologist, and creative thinker.'
        />

        <div className='mt-8 prose prose-lg dark:prose-invert max-w-none space-y-8'>
          <section>
            <Typography variant='h2' className='text-2xl font-semibold mb-4'>
              My Story
            </Typography>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300 leading-relaxed'
            >
              I&apos;m Terence Waters — a writer, technologist, and lifelong
              learner based at the intersection of human experience and
              technological possibility. For over two decades I&apos;ve been
              building things, breaking things, and writing about what I find
              along the way.
            </Typography>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300 leading-relaxed mt-4'
            >
              My work spans software development, content creation, coaching,
              and consulting. I believe technology is most powerful when it
              serves people — and that the best ideas are communicated clearly,
              with honesty and purpose.
            </Typography>
          </section>

          <section>
            <Typography variant='h2' className='text-2xl font-semibold mb-4'>
              What I Do
            </Typography>
            <ul className='space-y-3 list-none pl-0'>
              {[
                {
                  title: 'Write',
                  body: 'Long-form articles and guides on technology, creativity, and personal growth.',
                },
                {
                  title: 'Create',
                  body: 'Videos, podcasts, and multimedia content that explores ideas in depth.',
                },
                {
                  title: 'Coach',
                  body: 'One-on-one sessions for creators, technologists, and leaders navigating change.',
                },
                {
                  title: 'Consult',
                  body: 'Strategic and technical advisory for teams building products and platforms.',
                },
              ].map(({ title, body }) => (
                <li key={title} className='flex gap-3'>
                  <span className='font-semibold text-blue-600 dark:text-blue-400 min-w-[80px]'>
                    {title}
                  </span>
                  <Typography
                    variant='body'
                    className='text-gray-700 dark:text-gray-300'
                  >
                    {body}
                  </Typography>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Typography variant='h2' className='text-2xl font-semibold mb-4'>
              Background
            </Typography>
            <Typography
              variant='body'
              className='text-gray-700 dark:text-gray-300 leading-relaxed'
            >
              I&apos;ve worked across industries — from enterprise software and
              cloud architecture to independent media and creative production. I
              hold a passion for education, storytelling, and the ways
              technology reshapes how we learn, connect, and grow.
            </Typography>
          </section>

          <div className='flex gap-4 flex-wrap pt-4'>
            <Link
              href='/contact'
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Get in Touch
            </Link>
            <Link
              href='/services'
              className='px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium'
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
