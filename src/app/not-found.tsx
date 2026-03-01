import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { PageLayout } from '@/layouts/PageLayout';
import { Typography } from '@/components/Typography';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <PageLayout>
      <div className='max-w-4xl mx-auto pt-0 pb-8 md:py-8'>
        <Hero
          title='404 - Page Not Found'
          iconName='LocationNotFound24Regular'
          description="Sorry, the page you're looking for doesn't exist or has been moved."
        />

        <div className='mt-8 space-y-6'>
          <Typography
            variant='body'
            className='text-gray-600 dark:text-gray-400 text-center'
          >
            Let's get you back on track:
          </Typography>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              href='/'
              className='inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors min-w-[200px]'
            >
              ← Go to Home
            </Link>
            <Link
              href='/content-hub'
              className='inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 font-semibold transition-colors min-w-[200px]'
            >
              Browse Content Hub
            </Link>
          </div>

          <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
            <Typography
              variant='h3'
              className='text-xl font-semibold mb-4 text-center'
            >
              Popular Pages
            </Typography>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <Link
                href='/blog'
                className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all'
              >
                <Typography variant='h4' className='font-semibold mb-1'>
                  Blog
                </Typography>
                <Typography
                  variant='caption'
                  className='text-gray-600 dark:text-gray-400 text-sm'
                >
                  Read articles and insights
                </Typography>
              </Link>
              <Link
                href='/portfolio'
                className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all'
              >
                <Typography variant='h4' className='font-semibold mb-1'>
                  Portfolio
                </Typography>
                <Typography
                  variant='caption'
                  className='text-gray-600 dark:text-gray-400 text-sm'
                >
                  View my work and projects
                </Typography>
              </Link>
              <Link
                href='/about'
                className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all'
              >
                <Typography variant='h4' className='font-semibold mb-1'>
                  About
                </Typography>
                <Typography
                  variant='caption'
                  className='text-gray-600 dark:text-gray-400 text-sm'
                >
                  Learn more about me
                </Typography>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
