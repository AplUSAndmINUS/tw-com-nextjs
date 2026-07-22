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
import styles from './page.module.scss';

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
      <div className={`max-width-content ${styles.page}`}>
        {/* Primary CTA: Start a Conversation */}
        <Hero
          title='Start a Conversation'
          iconName='CalendarLtr24Regular'
          description="Book a free consultation and let's map out your next move together. Whether you need project estimates, strategic consulting, training, or web development — I'll help you find the right path forward."
          showShadow
        >
          <BookingsButton isHero />
        </Hero>

        {/* Newsletter CTA */}
        <NewsletterSignupCTA className={styles.newsletter} />

        {/* Secondary: Contact Form (de-emphasized) */}
        <div className={styles.formSection}>
          <div className={styles.noteHeader}>
            <Typography
              variant='h3'
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
              }}
            >
              Prefer to write? Send us a note.
            </Typography>
            <Typography
              variant='body'
              className={styles.noteText}
              style={{
                fontSize: '0.9rem',
                maxWidth: '480px',
              }}
            >
              Feel free to use the form below. I will respond as soon as I can!
            </Typography>
          </div>
          <ReCaptchaProvider>
            <ContactForm />
          </ReCaptchaProvider>
        </div>
      </div>
    </PageLayout>
  );
}
