import { Metadata } from 'next';
import { getRobotsConfig } from '@/utils/metadata';
import { TwButton, TwCard, TwChip, TwHero, TwReveal } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { SiteNav } from '@/components/SiteNav';
import { TRI_LINKS } from './theresonantid/constants';
import { TRI_LOGO_SRC, TRI_SHOW_NAME, TRI_SHOW_PATH } from './podcastFormat';
import styles from './page.module.scss';

const PODCASTS_TITLE = 'Podcasts on Identity and Transformation';
const PODCASTS_DESCRIPTION =
  'Podcasts hosted by Terence Waters, starting with The Resonant Identity: long-form audio on identity, technology, and personal transformation.';

export const metadata: Metadata = {
  title: PODCASTS_TITLE,
  description: PODCASTS_DESCRIPTION,
  keywords: [
    'The Resonant Identity podcast',
    'Terence Waters podcast',
    'identity podcast',
    'identity alignment',
    'personal transformation podcast',
    'Resonance Core Framework',
    'long-form audio',
  ],
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: `${PODCASTS_TITLE} | Terence Waters`,
    description: PODCASTS_DESCRIPTION,
    url: 'https://terencewaters.com/podcasts',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
};

/**
 * /podcasts: the directory of shows. One today, The Resonant Identity, as a
 * card with its episodes on this site and its own site in a new tab. A server
 * component; no client code beyond the shared nav and reveals.
 */
export default function PodcastsPage() {
  return (
    <div className={styles.page}>
      <SiteNav />
      <main id='main'>
        <TwHero
          eyebrow='Listen'
          title='Podcasts'
          body='Long-form audio exploring identity, technology, and transformation.'
          compact
        />

        <section className={styles.section} aria-label='Podcast shows'>
          <div className={styles.container}>
            <TwReveal>
              <TwCard as='article' padded={false} className={styles.show}>
                <div className={styles.art}>
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      output:'export' + images.unoptimized, so next/image adds nothing. */}
                  <img
                    className='tw-media'
                    src={TRI_LOGO_SRC}
                    alt='The Resonant Identity podcast logo'
                    width={2048}
                    height={2048}
                    decoding='async'
                  />
                </div>
                <div className={styles.body}>
                  <TwChip variant='teal' size='sm'>
                    Podcast
                  </TwChip>
                  <h2 className={styles.title}>{TRI_SHOW_NAME}</h2>
                  <p className={styles.text}>
                    A podcast blending identity architecture, self-improvement,
                    and practical frameworks for navigating transitions with
                    clarity and intention.
                  </p>
                  <div className={styles.actions}>
                    <TwButton href={TRI_SHOW_PATH}>View episodes</TwButton>
                    <TwButton
                      href={TRI_LINKS.about}
                      variant='outline'
                      target='_blank'
                      rel='noopener'
                    >
                      About {TRI_SHOW_NAME}
                    </TwButton>
                  </div>
                </div>
              </TwCard>
            </TwReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
