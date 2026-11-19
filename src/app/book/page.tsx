import type { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { safeJsonLd } from '@/utils/safeJsonLd';
import { getBreadcrumbSchema } from '@/utils/structuredData';
import { Footer } from '@/components/Footer';
import { SiteNav } from '@/components/SiteNav';
import { BookingTrigger } from '@/components/BookingFlow';
import {
  BOOK_A_CONVERSATION,
  BOOK_PAGE,
  BOOKING_FLOW,
  TIDYCAL_URL,
} from '@/content/site/booking';
import { BookAutoOpen } from './BookAutoOpen';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: { absolute: BOOK_PAGE.metaTitle },
  description: BOOK_PAGE.metaDescription,
  keywords: [
    'book a conversation with Terence Waters',
    'Terence Waters coaching call',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: BOOK_PAGE.metaTitle,
    description: BOOK_PAGE.metaDescription,
    url: 'https://terencewaters.com/book/',
    siteName: 'Terence Waters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: BOOK_PAGE.metaTitle,
    description: BOOK_PAGE.metaDescription,
  },
  robots: getRobotsConfig(),
  alternates: { canonical: '/book/' },
};

/**
 * /book: Book a Conversation (owner, 2026-11-19, as on fluxline.pro/book).
 *
 * Every Book a Conversation button links here, so this is where visitors
 * without JavaScript land: the TidyCal link works without it. With
 * JavaScript the buttons open the dialog in place, and this page opens it
 * on load (BookAutoOpen), with a button to reopen it.
 */
export default function BookPage() {
  const breadcrumb = getBreadcrumbSchema([
    { name: BOOK_A_CONVERSATION.label, path: '/book/' },
  ]);

  return (
    <div className={styles.page}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }}
      />

      <SiteNav />
      <BookAutoOpen />

      <main id='main'>
        <section className={styles.intro} aria-labelledby='book-title'>
          <div className={styles.container}>
            <p className={styles.kicker}>{BOOK_PAGE.kicker}</p>
            <h1 id='book-title' className={styles.h1}>
              {BOOK_A_CONVERSATION.label}
            </h1>
            <p className={styles.lede}>{BOOK_PAGE.lede}</p>
            <div className={styles.action}>
              <BookingTrigger size='lg' />
            </div>
            <noscript>
              <p className={styles.text}>
                {BOOKING_FLOW.noScript}{' '}
                <a href={TIDYCAL_URL} target='_blank' rel='noopener noreferrer'>
                  {BOOKING_FLOW.noScriptLink}
                </a>
              </p>
            </noscript>
          </div>
        </section>

        <section className={styles.section} aria-labelledby='book-steps'>
          <div className={styles.container}>
            <h2 id='book-steps' className={styles.h2}>
              {BOOK_PAGE.stepsTitle}
            </h2>
            <ol className={styles.steps}>
              {BOOK_PAGE.steps.map((step) => (
                <li key={step} className={styles.step}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
