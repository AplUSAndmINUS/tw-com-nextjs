import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { UnifiedPageWrapper } from '@/components/UnifiedPageWrapper/UnifiedPageWrapper';
import { ContactForm } from '@/components/ContactForm';
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

export default function ContactPage() {
  return (
    <PageLayout
      featureImage={{
        src: LinkedInPortrait.src,
        alt: 'Terence Waters',
        title: 'Contact Me',
      }}
    >
      <UnifiedPageWrapper layoutType='standard' style={{ padding: 0 }}>
        <div className='pt-0 pb-8 md:py-8 flex flex-col gap-8'>
          {/* Let's Connect section */}
          <Hero
            title="Let's Connect!"
            iconName='Mail24Regular'
            description="Let's discuss your needs and goals! Whether you're seeking project estimates, personalized training, strategic consulting, or web development solutions—I'm happy to help. Send me a message or click the button below to get started!"
          >
            <a
              href='https://calendly.com/terencewaters'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-400 transition-all hover:scale-105 active:scale-95'
              aria-label='Book a free consultation with Terence Waters'
            >
              book a free consultation
            </a>
          </Hero>

          {/* Contact Me Form section */}
          <div className='flex flex-col gap-4'>
            <Typography
              variant='h2'
              className='text-2xl font-bold uppercase tracking-wide'
            >
              Contact Me Form
            </Typography>
            <ContactForm />
          </div>
        </div>
      </UnifiedPageWrapper>
    </PageLayout>
  );
}
