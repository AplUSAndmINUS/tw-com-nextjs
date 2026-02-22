import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentItem, GalleryItem, ContentType } from '@/content/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

/** Map raw frontmatter data to a strongly-typed ContentItem. */
function mapFrontmatter(
  slug: string,
  data: Record<string, unknown>,
  content: string,
  type?: ContentType
): ContentItem {
  let date = '';
  if (data.date) {
    date = String(data.date);
  } else if (data.publishedDate) {
    date = String(data.publishedDate);
  }

  return {
    slug,
    title: (data.title as string) ?? slug,
    type,
    date,
    publishedDate: data.publishedDate ? String(data.publishedDate) : undefined,
    excerpt: (data.excerpt as string) ?? (data.description as string) ?? '',
    tags: (data.tags as string[]) ?? [],
    content,
    author: (data.author as string) ?? undefined,
    imageUrl: (data.imageUrl as string) ?? undefined,
    imageAlt: (data.imageAlt as string) ?? undefined,
    category: (data.category as string) ?? undefined,
    featured: typeof data.featured === 'boolean' ? data.featured : undefined,
    featuredImage: (data.featuredImage as string) ?? undefined,
    gallery: (data.gallery as GalleryItem[]) ?? undefined,
    seoTitle: (data.seoTitle as string) ?? undefined,
    seoDescription: (data.seoDescription as string) ?? undefined,
    seoKeywords: (data.seoKeywords as string[]) ?? undefined,
  };
}

/**
 * Resolve the markdown file path for a given type + slug.
 *
 * Lookup order:
 *  1. content/{type}/{slug}.md (or .mdx)
 *  2. content/{type}/{slug}/post.md (slug-folder format)
 */
function resolveContentFile(type: string, slug: string): string | null {
  const dir = path.join(CONTENT_DIR, type);

  for (const ext of ['md', 'mdx']) {
    const flat = path.join(dir, `${slug}.${ext}`);
    if (fs.existsSync(flat)) return flat;
  }

  for (const ext of ['md', 'mdx']) {
    const nested = path.join(dir, slug, `post.${ext}`);
    if (fs.existsSync(nested)) return nested;
  }

  return null;
}

export async function getAllContent(type: string): Promise<ContentItem[]> {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items: ContentItem[] = [];
  const contentType = type as ContentType;

  for (const entry of entries) {
    if (
      entry.isFile() &&
      (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))
    ) {
      const slug = entry.name.replace(/\.(md|mdx)$/, '');
      const filePath = path.join(dir, entry.name);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      items.push(mapFrontmatter(slug, data, content, contentType));
    } else if (entry.isDirectory()) {
      // Slug-folder format: content/{type}/{slug}/post.md
      const slug = entry.name;
      for (const ext of ['md', 'mdx']) {
        const nested = path.join(dir, slug, `post.${ext}`);
        if (fs.existsSync(nested)) {
          const raw = fs.readFileSync(nested, 'utf-8');
          const { data, content } = matter(raw);
          items.push(mapFrontmatter(slug, data, content, contentType));
          break;
        }
      }
    }
  }

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getContentBySlug(
  type: string,
  slug: string
): Promise<ContentItem | null> {
  const filePath = resolveContentFile(type, slug);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const contentType = type as ContentType;
  return mapFrontmatter(slug, data, content, contentType);
}
