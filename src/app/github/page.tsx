import { getRobotsConfig } from '@/utils/metadata';
import type { Metadata } from 'next';
import { PageLayout } from '@/layouts/PageLayout';
import { GitHubClientWrapper } from './GitHubClientWrapper';
import { getGitHubRepos, getAllLanguages } from './lib/githubLoader';
import GitHubPortrait from '@/assets/images/GitHubPortrait.jpg';

export const metadata: Metadata = {
  title: 'GitHub',
  description:
    'Explore open-source projects, code samples, and technical resources from Terence Waters on GitHub.',
  metadataBase: new URL('https://terencewaters.com'),
  openGraph: {
    title: 'GitHub | Terence Waters',
    description:
      'Explore open-source projects, code samples, and technical resources from Terence Waters on GitHub.',
    url: 'https://terencewaters.com/github',
    siteName: 'Terence Waters',
    type: 'website',
  },
  robots: getRobotsConfig(),
  alternates: {
    canonical: '/github',
  },
};

/**
 * GitHub Page - Server Component
 *
 * Fetches GitHub repositories from the GitHub API at build time
 * and passes them to the client wrapper for rendering.
 */
export default async function GitHubPage() {
  const repos = await getGitHubRepos();
  const allLanguages = getAllLanguages(repos);

  return (
    <PageLayout
      featureImage={{
        src: GitHubPortrait.src,
        alt: 'GitHub',
        title: 'GitHub',
      }}
    >
      <GitHubClientWrapper repos={repos} allLanguages={allLanguages} />
    </PageLayout>
  );
}
