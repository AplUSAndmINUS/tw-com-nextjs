export interface GalleryItem {
  url: string;
  alt: string;
  caption?: string;
}

export interface ContentItem {
  slug: string;
  title: string;
  type?: ContentType; // Content type (blog, portfolio, case-studies, etc.)
  /** ISO date string (falls back to publishedDate) */
  date: string;
  publishedDate?: string;
  excerpt: string;
  tags: string[];
  content: string;
  // Rich frontmatter fields
  author?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  featured?: boolean;
  featuredImage?: string;
  gallery?: GalleryItem[];
  // AI disclosure
  /** When true, the content was generated or assisted by AI */
  generatedWithAI?: boolean;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  youtubeId?: string;
  publishedAt: string;
  tags: string[];
  category?: string;
  duration?: string;
}

export interface PodcastEpisode {
  slug: string;
  title: string;
  description: string;
  audioUrl: string;
  publishedDate: string;
  duration?: string;
  tags: string[];
  category?: string;
  imageUrl?: string;
  transcript?: string;
  season?: number;
  episode?: number;
  /** Spreaker numeric episode ID used for episode-specific embed URLs */
  spreakerEpisodeId?: string;
}

export type ContentType =
  | 'blog'
  | 'portfolio'
  | 'case-studies'
  | 'videos'
  | 'podcasts';
