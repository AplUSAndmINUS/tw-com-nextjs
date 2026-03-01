'use client';

import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import {
  ContentListingPage,
  FilterConfig,
} from '@/components/ContentListingPage';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { Typography } from '@/components/Typography';
import { GitHubRepo } from './types';

interface GitHubClientWrapperProps {
  repos: GitHubRepo[];
  allLanguages: string[];
}

/**
 * GitHub Client Wrapper
 * Handles filtering logic and transforms GitHub repository data for the
 * unified ContentListingPage. Card clicks open the repository in a new tab.
 */
export function GitHubClientWrapper({
  repos,
  allLanguages,
}: GitHubClientWrapperProps) {
  const { theme } = useAppTheme();
  const [selectedLanguage, setSelectedLanguage] = React.useState<
    string | undefined
  >();
  const [selectedOwner, setSelectedOwner] = React.useState<
    string | undefined
  >();

  // Get unique owners
  const allOwners = React.useMemo(() => {
    const owners = new Set<string>();
    repos.forEach((repo) => {
      if (repo.owner?.login) owners.add(repo.owner.login);
    });
    return Array.from(owners).sort();
  }, [repos]);

  // Get user owners only (exclude organizations for contributions graph)
  const userOwners = React.useMemo(() => {
    const users = new Set<string>();
    repos.forEach((repo) => {
      if (repo.owner?.login && repo.owner?.type === 'User') {
        users.add(repo.owner.login);
      }
    });
    return Array.from(users).sort();
  }, [repos]);

  // Filter repos by selected language and owner
  const filteredRepos = React.useMemo(() => {
    let filtered = repos;
    if (selectedLanguage) {
      filtered = filtered.filter((repo) => repo.language === selectedLanguage);
    }
    if (selectedOwner) {
      filtered = filtered.filter((repo) => repo.owner?.login === selectedOwner);
    }
    return filtered;
  }, [repos, selectedLanguage, selectedOwner]);

  // Transform repos to card format expected by ContentListingPage
  const cards = React.useMemo(() => {
    return filteredRepos.map((repo) => ({
      id: repo.full_name,
      title: repo.name,
      description: repo.description ?? '',
      imageAlt: repo.name,
      imageText: [
        repo.language,
        repo.updated_at
          ? `Updated ${format(new Date(repo.updated_at), 'MMM d, yyyy')}`
          : null,
        repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    }));
  }, [filteredRepos]);

  // Build a lookup map so onCardClick can open the correct URL
  const repoUrlMap = React.useMemo(() => {
    const map = new Map<string, string>();
    repos.forEach((repo) => map.set(repo.full_name, repo.html_url));
    return map;
  }, [repos]);

  // Open the GitHub repository in a new tab
  const handleCardClick = React.useCallback(
    (id: string) => {
      const url = repoUrlMap.get(id);
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    [repoUrlMap]
  );

  // Configure filters
  const filters: FilterConfig[] = [
    {
      type: 'single',
      label: 'Owner',
      options: [
        { value: '', label: 'All Owners' },
        ...allOwners.map((owner) => ({ value: owner, label: owner })),
      ],
      value: selectedOwner,
      onChange: setSelectedOwner,
    },
    {
      type: 'single',
      label: 'Language',
      options: [
        { value: '', label: 'All Languages' },
        ...allLanguages.map((lang) => ({ value: lang, label: lang })),
      ],
      value: selectedLanguage,
      onChange: setSelectedLanguage,
    },
  ];

  const ownerFilter = selectedOwner ? ` from ${selectedOwner}` : '';
  const languageFilter = selectedLanguage ? ` in ${selectedLanguage}` : '';
  const repoWord = filteredRepos.length === 1 ? 'repository' : 'repositories';
  const resultsMessage = `Showing ${filteredRepos.length} ${repoWord}${ownerFilter}${languageFilter}`;

  // GitHub contributions graph (only for user accounts, not organizations)
  const contributionsSection = React.useMemo(() => {
    if (userOwners.length === 0) return null;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.m,
          padding: theme.spacing.l,
          backgroundColor: theme.palette.neutralLighter,
          borderRadius: theme.borderRadius.m,
          boxShadow: theme.shadows.m,
        }}
      >
        <Typography
          variant='h3'
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: theme.semanticColors.text.primary,
          }}
        >
          GitHub Contributions
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.m,
          }}
        >
          {userOwners.map((owner) => (
            <div
              key={owner}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.s,
              }}
            >
              <Typography
                variant='body'
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: theme.palette.themePrimary,
                }}
              >
                {owner}
              </Typography>
              <Image
                src={`https://ghchart.rshah.org/${owner}`}
                alt={`${owner} GitHub contributions`}
                width={800}
                height={150}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: theme.borderRadius.s,
                }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    );
  }, [userOwners, theme]);

  return (
    <ContentListingPage
      title='GitHub'
      iconName='Code24Regular'
      description='Explore open-source projects, code samples, and technical resources from Terence Waters and Fluxline. Click any repository to view it on GitHub.'
      basePath='/github'
      cards={cards}
      filters={filters}
      resultsMessage={resultsMessage}
      emptyStateTitle='No repositories found'
      emptyStateMessage={
        selectedLanguage || selectedOwner
          ? 'Try adjusting your filters to see more repositories.'
          : 'Check back soon for new repositories.'
      }
      onCardClick={handleCardClick}
      customSection={contributionsSection}
      backArrow={false}
    />
  );
}
