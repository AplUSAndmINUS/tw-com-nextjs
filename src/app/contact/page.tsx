import { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { Hero } from '@/components/Hero';
import { Typography } from '@/components/Typography';
import { ContactForm } from '@/components/ContactForm';
import LinkedInPortrait from '@/assets/images/LinkedInTerenceW1024x1536.jpeg';
import { Button } from '@/components/Form/Button/Button';

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
      <div className='pt-0 pb-8 md:py-8 flex flex-col gap-8'>
        {/* Let's Connect section */}
        <Hero
          title="Let's Connect!"
          iconName='Mail24Regular'
          description="Let's discuss your needs and goals! Whether you're seeking project estimates, personalized training, strategic consulting, or web development solutions—I'm happy to help. Send me a message or click the button below to get started!"
        >
          <a
            href='https://outlook.office.com/book/Bookings@terencewaters.com/'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Button
              type='button'
              variant='primary'
              aria-label='Book a free consultation with Terence Waters'
            >
              Book a Free Consultation
            </Button>
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
    </PageLayout>
  );
}
