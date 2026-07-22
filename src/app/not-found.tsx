import { Hero } from '@/components/Hero';
import { PageLayout } from '@/layouts/PageLayout';
import { NotFoundContent } from './NotFoundContent';
import styles from './not-found.module.scss';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <PageLayout>
      <div className={styles.page}>
        <Hero
          title='404 - Page Not Found'
          iconName='LocationNotFound24Regular'
          description="Sorry, the page you're looking for doesn't exist or has been moved."
        />

        <NotFoundContent />
      </div>
    </PageLayout>
  );
}
