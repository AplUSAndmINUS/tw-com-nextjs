import { getAllLanguages } from './githubLoader';
import { GitHubRepo } from '../types';

const makeRepo = (partial: Partial<GitHubRepo>): GitHubRepo => ({
  name: 'repo',
  full_name: 'org/repo',
  description: null,
  html_url: 'https://github.com/org/repo',
  language: null,
  stargazers_count: 0,
  updated_at: '2024-01-01T00:00:00Z',
  topics: [],
  owner: { login: 'org', type: 'Organization' },
  ...partial,
});

describe('getAllLanguages', () => {
  it('returns an empty array when no repos have languages', () => {
    const repos = [
      makeRepo({ language: null }),
      makeRepo({ language: null }),
    ];
    expect(getAllLanguages(repos)).toEqual([]);
  });

  it('returns unique languages sorted alphabetically', () => {
    const repos = [
      makeRepo({ name: 'a', language: 'TypeScript' }),
      makeRepo({ name: 'b', language: 'JavaScript' }),
      makeRepo({ name: 'c', language: 'TypeScript' }),
      makeRepo({ name: 'd', language: 'Python' }),
    ];
    expect(getAllLanguages(repos)).toEqual([
      'JavaScript',
      'Python',
      'TypeScript',
    ]);
  });

  it('ignores repos with null language', () => {
    const repos = [
      makeRepo({ name: 'a', language: 'TypeScript' }),
      makeRepo({ name: 'b', language: null }),
    ];
    expect(getAllLanguages(repos)).toEqual(['TypeScript']);
  });

  it('returns empty array for empty repo list', () => {
    expect(getAllLanguages([])).toEqual([]);
  });
});
