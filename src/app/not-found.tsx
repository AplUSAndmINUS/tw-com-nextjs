import Link from 'next/link';
import {
  TwButton,
  TwCard,
  TwPageNav,
  TwReveal,
  TwSectionHeading,
} from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import styles from './not-found.module.scss';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
};

const NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub' },
  { label: 'Portfolio', href: '/portfolio' },
];

const POPULAR = [
  { href: '/blog', label: 'Blog', desc: 'Read articles and insights' },
  { href: '/portfolio', label: 'Portfolio', desc: 'View work and case studies' },
  { href: '/about', label: 'About', desc: 'Learn more about Terence' },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <TwPageNav back={{ label: 'Back to Home', href: '/' }} links={NAV_LINKS} />

      <main className={styles.main}>
        <TwReveal>
          <div className={styles.hero}>
            <span className={styles.code}>404</span>
            <TwSectionHeading
              title='Page not found'
              lede="Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track."
            />
            <div className={styles.actions}>
              <TwButton href='/' size='lg'>
                Go to Home
              </TwButton>
              <TwButton href='/content-hub' size='lg' variant='outline'>
                Browse Content Hub
              </TwButton>
            </div>
          </div>
        </TwReveal>

        <section className={styles.popular}>
          <TwReveal>
            <h2 className={styles.popularHeading}>Popular pages</h2>
          </TwReveal>
          <div className={styles.cardGrid}>
            {POPULAR.map((item, i) => (
              <TwReveal key={item.href} delay={i * 90}>
                <Link href={item.href} className={styles.cardLink}>
                  <TwCard className={styles.card}>
                    <h3 className={styles.cardTitle}>{item.label}</h3>
                    <p className={styles.cardDesc}>{item.desc}</p>
                    <span className={styles.cardArrow}>&#8594;</span>
                  </TwCard>
                </Link>
              </TwReveal>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
