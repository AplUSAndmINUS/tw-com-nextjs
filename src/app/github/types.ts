/**
 * TypeScript type definitions for the GitHub repositories feature
 */

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    type: string;
  };
}
