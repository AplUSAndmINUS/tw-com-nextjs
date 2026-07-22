import { getRobotsConfig } from '@/utils/metadata';
import type { Metadata } from 'next';
import { getGitHubRepos } from './lib/githubLoader';
import { TwPageNav, TwListingView, type TwListingItem } from '@/components/dsm';
import type { TwPageNavLink } from '@/components/dsm';
import { Footer } from '@/components/Footer';
import { formatDotDate } from '@/app/home/contentFormat';

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

const NAV_LINKS: TwPageNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Content Hub', href: '/content-hub', active: true },
  { label: 'Portfolio', href: '/portfolio' },
];

/**
 * GitHub — build-time fetch of repositories, rendered on the design system.
 *
 * The repos are read from the GitHub API at build (static export), so the list
 * itself is fully static; TwListingView only adds client-side filtering. Cards
 * link out to each repo (new tab) — there is no per-repo detail page — and the
 * language becomes the filter/badge.
 */
export default async function GitHubPage() {
  const repos = await getGitHubRepos();

  const items: TwListingItem[] = repos.map((repo) => ({
    id: repo.full_name,
    title: repo.name,
    excerpt: repo.description ?? undefined,
    category: repo.language ?? 'Other',
    filter: repo.language ?? 'Other',
    date: repo.updated_at ? `Updated ${formatDotDate(repo.updated_at)}` : undefined,
    href: repo.html_url,
    external: true,
  }));

  return (
    <>
      <TwPageNav back={{ label: 'Back to Content Hub', href: '/content-hub' }} links={NAV_LINKS} />
      <main>
        <TwListingView
          kicker='Open Source'
          title='On GitHub'
          lede='Open-source projects, experiments, and the code behind the work. Filter by language below — each card opens the repository on GitHub.'
          items={items}
          emptyMessage='Repositories are loading — visit github.com/AplUSAndmINUS in the meantime.'
        />
      </main>
      <Footer />
    </>
  );
}
