import { PageLayout } from '@/layouts/PageLayout';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    default: 'Terence Waters',
    template: '%s | Terence Waters',
  },
  description: 'Author, technologist, and creative thinker.',
  metadataBase: new URL('https://terencewaters.com'),
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

export default function HomePage() {
  return (
    <PageLayout>
      <section className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4'>
        <h1 className='text-5xl font-bold mb-4'>Terence Waters</h1>
        <p className='text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl'>
          Author, technologist, and creative thinker. Writing about technology,
          creativity, and the human experience.
        </p>
        <div className='flex gap-4 flex-wrap justify-center'>
          <Link
            href='/blog'
            className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Read the Blog
          </Link>
          <Link
            href='/portfolio'
            className='px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
          >
            View Portfolio
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
