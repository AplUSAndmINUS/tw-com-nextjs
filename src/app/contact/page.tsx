import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { ContactForm } from '@/components/ContactForm';
import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';
import LinkedInPortrait from '@/assets/images/LinkedInTerenceW1024x1536.jpeg';
import { NewsletterSignupCTA } from '@/components/NewsletterSignupCTA';
import { BookingsButton } from '@/components/BookingsButton/BookingsButton';

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
  robots: getRobotsConfig(),
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
      <div className='relative max-width-content pt-0 pb-8 md:pb-16 md:py-8 flex flex-col gap-10'>
        {/* Primary CTA: Start a Conversation */}
        <Hero
          title='Start a Conversation'
          iconName='CalendarLtr24Regular'
          description="Book a free consultation and let's map out your next move together. Whether you need project estimates, strategic consulting, training, or web development — I'll help you find the right path forward."
          showShadow
        >
          <BookingsButton isHero />
        </Hero>

        {/* Secondary: Contact Form (de-emphasized) */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <hr className='flex-1 border-t border-gray-200 dark:border-gray-700' />
            <Typography
              variant='caption'
              className='text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap'
            >
              Prefer email? Send a note instead
            </Typography>
            <hr className='flex-1 border-t border-gray-200 dark:border-gray-700' />
          </div>
          <ReCaptchaProvider>
            <ContactForm />
          </ReCaptchaProvider>
        </div>

        {/* Newsletter CTA */}
        <NewsletterSignupCTA className='mt-4' />
      </div>
    </PageLayout>
  );
}
