export interface ContentItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export type ContentType = 'blog' | 'portfolio' | 'case-studies';
