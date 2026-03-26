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
      <div className='relative max-width-content pt-0 pb-8 md:pb-16 md:py-8 flex flex-col gap-8'>
        {/* Let's Connect section */}
        <Hero
          title="Let's Connect!"
          iconName='Mail24Regular'
          description="Let's discuss your needs and goals! Whether you're seeking project estimates, personalized training, strategic consulting, or web development solutions—I'm happy to help. Send me a message or click the button below to get started!"
        >
          <BookingsButton isHero />
        </Hero>

        {/* Contact Me Form section */}
        <div className='flex flex-col gap-4'>
          <Typography
            variant='h2'
            className='text-2xl font-bold uppercase tracking-wide'
          >
            Contact Me Form
          </Typography>
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
