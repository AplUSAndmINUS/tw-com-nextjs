import type { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import {
  getBreadcrumbSchema,
  getContactPageSchema,
} from '@/utils/structuredData';
import { Footer } from '@/components/Footer';
import { SiteNav } from '@/components/SiteNav';
import { BookingTrigger } from '@/components/BookingFlow';
import { ContactForm } from '@/components/ContactForm';
import { NewsletterForm } from '@/components/NewsletterForm';
import { SocialRow } from '@/app/home/SocialRow';
import { contactSocials } from '@/app/home/homeData';
import { BOOK_A_CONVERSATION } from '@/content/site/booking';
import { CONTACT } from '@/content/site/contact';
import { MICROCOPY } from '@/content/site/microcopy';
import { ContactWaysIn } from './ContactWaysIn';
import styles from './page.module.scss';

/**
 * /contact metadata. Title and description are placeholders until Slice 8.
 * This page owns "contact Terence Waters", "book a conversation with Terence
 * Waters" and "Terence Waters newsletter" (INITIAL_PLAN §8.1).
 */
export const metadata: Metadata = {
  title: { absolute: CONTACT.meta.title },
  description: CONTACT.meta.description,
  keywords: [
    'contact Terence Waters',
    'book a conversation with Terence Waters',
    'Terence Waters newsletter',
    'Terence Waters email',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: CONTACT.meta.title,
    description: CONTACT.meta.description,
    url: 'https://terencewaters.com/contact/',
    siteName: 'Terence Waters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: CONTACT.meta.title,
    description: CONTACT.meta.description,
  },
  robots: getRobotsConfig(),
  alternates: { canonical: '/contact/' },
};

/**
 * /contact: one place to talk to Terence (INITIAL_PLAN Session 4, Decision
 * B). Intro → #conversation → #message → #newsletter → find me online.
 *
 * #conversation opens the full-screen booking dialog, the same one as on
 * every other page (owner, #295), rather than the steps inline. The forms are
 * the ones that used to sit on the homepage (reCAPTCHA, /api/contact and
 * /api/subscribe unchanged). A server component with client islands (the
 * jump list, the booking button, the forms); words come from
 * src/content/site/contact.ts.
 */
export default function ContactPage() {
  const schemas = [
    getContactPageSchema(CONTACT.meta.name, CONTACT.meta.description),
    getBreadcrumbSchema([{ name: CONTACT.meta.name, path: '/contact/' }]),
  ];

  return (
    <div className={styles.page}>
      {/* The Person entity is emitted once, site-wide, by the root layout. */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
        />
      ))}

      <SiteNav />

      <main id='main'>
        {/* ===== Intro ===== */}
        <section className={styles.intro} aria-labelledby='contact-title'>
          <div className={`${styles.container} ${styles.introGrid}`}>
            <div>
              <p className={styles.kicker}>{CONTACT.intro.kicker}</p>
              <h1 id='contact-title' className={styles.h1}>
                {CONTACT.intro.title}
              </h1>
              <p className={styles.lede}>{CONTACT.intro.body}</p>
            </div>
            <ContactWaysIn />
          </div>
        </section>

        {/* ===== Book a Conversation: opens the booking dialog =====
            (owner, #295). The same steps and TidyCal page, full screen. */}
        <section
          id='conversation'
          className={styles.sectionAlt}
          aria-labelledby='contact-conversation'
        >
          <div className={`${styles.container} ${styles.split}`}>
            <div>
              <h2 id='contact-conversation' className={styles.h2}>
                {BOOK_A_CONVERSATION.label}
              </h2>
              <p className={styles.text}>{CONTACT.conversation.text}</p>
            </div>
            <div className={styles.action}>
              <BookingTrigger size='lg' />
            </div>
          </div>
        </section>

        {/* ===== Send a message ===== */}
        <section
          id='message'
          className={styles.section}
          aria-labelledby='contact-message'
        >
          <div className={`${styles.container} ${styles.split}`}>
            <div>
              <h2 id='contact-message' className={styles.h2}>
                {CONTACT.message.title}
              </h2>
              <p className={styles.text}>{MICROCOPY.readEveryMessage}</p>
            </div>
            <ContactForm />
          </div>
        </section>

        {/* ===== Newsletter: inline, never a pop-up ===== */}
        <section
          id='newsletter'
          className={styles.sectionAlt}
          aria-labelledby='contact-newsletter'
        >
          <div className={`${styles.container} ${styles.split}`}>
            <div>
              <h2 id='contact-newsletter' className={styles.h2}>
                {CONTACT.newsletter.title}
              </h2>
              <p className={styles.text}>{MICROCOPY.newsletter}</p>
            </div>
            <div className={styles.action}>
              <NewsletterForm />
            </div>
          </div>
        </section>

        {/* ===== Find me online: email first, then the socials ===== */}
        <section
          id='elsewhere'
          className={styles.section}
          aria-labelledby='contact-socials'
        >
          <div className={`${styles.container} ${styles.socials}`}>
            <h2 id='contact-socials' className={styles.h2}>
              {CONTACT.socials.title}
            </h2>
            <SocialRow items={contactSocials} size={26} className={styles.socialRow} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
