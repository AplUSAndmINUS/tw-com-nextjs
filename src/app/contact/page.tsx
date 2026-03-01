import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { PageHeader } from '@/components/PageHeader';
import { Typography } from '@/components/Typography';
import { Card } from '@/components/ui/Card';
import LinkedInPortrait from '@/assets/images/LinkedInTerenceW1024x1536.jpeg';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Terence Waters.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'Contact | Terence Waters',
    description: 'Get in touch with Terence Waters.',
    url: 'https://terencewaters.com/contact',
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

const contactOptions = [
  {
    title: 'General Inquiries',
    description:
      'For questions, collaboration proposals, or just to say hello.',
    icon: '✉️',
    href: 'mailto:hello@terencewaters.com',
    label: 'hello@terencewaters.com',
  },
  {
    title: 'Speaking & Events',
    description:
      'Interested in having me speak at your event, conference, or workshop?',
    icon: '🎤',
    href: 'mailto:speaking@terencewaters.com',
    label: 'speaking@terencewaters.com',
  },
  {
    title: 'Consulting & Advisory',
    description:
      'For business engagements, technical consulting, and strategic advisory.',
    icon: '⚙️',
    href: 'mailto:consulting@terencewaters.com',
    label: 'consulting@terencewaters.com',
  },
];

export default function ContactPage() {
  return (
    <PageLayout
      featureImage={{
        src: LinkedInPortrait.src,
        alt: 'Terence Waters',
        title: "Let's Talk",
      }}
    >
      <div className='pt-0 pb-8 md:py-8'>
        <PageHeader
          title='Contact'
          subtitle="I'd love to hear from you. Whether you have a question, an opportunity, or just want to connect — reach out."
          subtitleClassName='max-w-2xl'
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          {contactOptions.map((option) => (
            <Card key={option.title}>
              <div className='text-3xl mb-3'>{option.icon}</div>
              <Typography variant='h3' className='text-lg font-semibold mb-2'>
                {option.title}
              </Typography>
              <Typography
                variant='body'
                className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'
              >
                {option.description}
              </Typography>
              <a
                href={option.href}
                className='text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all'
              >
                {option.label}
              </a>
            </Card>
          ))}
        </div>

        <section className='bg-gray-50 dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700'>
          <Typography variant='h2' className='text-2xl font-semibold mb-3'>
            Follow Along
          </Typography>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 mb-2'
          >
            The best way to stay connected is through my newsletter and social
            channels. I share ideas, updates, and behind-the-scenes looks at
            what I&apos;m working on.
          </Typography>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 text-sm'
          >
            Find me on LinkedIn, YouTube, and other platforms via the social
            links in the navigation menu.
          </Typography>
        </section>
      </div>
    </PageLayout>
  );
}
