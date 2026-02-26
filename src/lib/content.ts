import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentItem, GalleryItem, ContentType } from '@/content/types';

const CONTENT_DIR = path.join(process.cwd(), 'public');

/**
 * Validates and returns a properly typed array of GalleryItem objects.
 * @param data - Raw data that should be an array of gallery items
 * @returns Validated GalleryItem array or undefined
 */
function validateGalleryItems(data: unknown): GalleryItem[] | undefined {
  if (!data || !Array.isArray(data)) {
    return undefined;
  }

  const validatedItems: GalleryItem[] = [];

  for (const item of data) {
    // Must be an object
    if (typeof item !== 'object' || item === null) {
      console.warn('Invalid gallery item: expected object, got', typeof item);
      continue;
    }

    const obj = item as Record<string, unknown>;

    // Required fields: url and alt must be strings
    if (typeof obj.url !== 'string' || !obj.url) {
      console.warn('Invalid gallery item: missing or invalid "url" field');
      continue;
    }
    if (typeof obj.alt !== 'string' || !obj.alt) {
      console.warn('Invalid gallery item: missing or invalid "alt" field');
      continue;
    }

    // Optional caption must be a string if present
    const caption =
      obj.caption !== undefined && obj.caption !== null
        ? String(obj.caption)
        : undefined;

    validatedItems.push({
      url: obj.url,
      alt: obj.alt,
      caption,
    });
  }

  return validatedItems.length > 0 ? validatedItems : undefined;
}

/**
 * Validates and returns a properly typed array of strings.
 * @param data - Raw data that should be an array of strings
 * @returns Validated string array
 */
function validateStringArray(data: unknown): string[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((item) => typeof item === 'string' && item.length > 0)
    .map((item) => String(item));
}

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
    tags: validateStringArray(data.tags),
    content,
    author: (data.author as string) ?? undefined,
    imageUrl: (data.imageUrl as string) ?? undefined,
    imageAlt: (data.imageAlt as string) ?? undefined,
    category: (data.category as string) ?? undefined,
    featured: typeof data.featured === 'boolean' ? data.featured : undefined,
    featuredImage: (data.featuredImage as string) ?? undefined,
    gallery: validateGalleryItems(data.gallery),
    seoTitle: (data.seoTitle as string) ?? undefined,
    seoDescription: (data.seoDescription as string) ?? undefined,
    seoKeywords: validateStringArray(data.seoKeywords),
  };
}

/**
 * Resolve the markdown file path for a given type + slug.
 *
 * New lookup structure:
 *  1. public/{type}/{slug}/markdown/post.md (or .mdx)
 *  2. Fallback to old structure for backwards compatibility
 */
function resolveContentFile(type: string, slug: string): string | null {
  const dir = path.join(CONTENT_DIR, type);

  // New structure: public/{type}/{slug}/markdown/post.md
  for (const ext of ['md', 'mdx']) {
    const newStructure = path.join(dir, slug, 'markdown', `post.${ext}`);
    if (fs.existsSync(newStructure)) return newStructure;
  }

  // Fallback: old flat structure
  for (const ext of ['md', 'mdx']) {
    const flat = path.join(dir, `${slug}.${ext}`);
    if (fs.existsSync(flat)) return flat;
  }

  // Fallback: old nested structure
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
      // Flat file structure (backwards compatibility)
      const slug = entry.name.replace(/\.(md|mdx)$/, '');
      const filePath = path.join(dir, entry.name);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      items.push(mapFrontmatter(slug, data, content, contentType));
    } else if (entry.isDirectory()) {
      const slug = entry.name;

      // New structure: public/{type}/{slug}/markdown/post.md
      for (const ext of ['md', 'mdx']) {
        const newStructure = path.join(dir, slug, 'markdown', `post.${ext}`);
        if (fs.existsSync(newStructure)) {
          const raw = fs.readFileSync(newStructure, 'utf-8');
          const { data, content } = matter(raw);
          items.push(mapFrontmatter(slug, data, content, contentType));
          break;
        }
      }

      // Fallback: old structure public/{type}/{slug}/post.md
      if (items.findIndex((item) => item.slug === slug) === -1) {
        for (const ext of ['md', 'mdx']) {
          const oldStructure = path.join(dir, slug, `post.${ext}`);
          if (fs.existsSync(oldStructure)) {
            const raw = fs.readFileSync(oldStructure, 'utf-8');
            const { data, content } = matter(raw);
            items.push(mapFrontmatter(slug, data, content, contentType));
            break;
          }
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
