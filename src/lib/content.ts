import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentItem } from '@/content/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export async function getAllContent(type: string): Promise<ContentItem[]> {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  const items = files.map((file) => {
    const slug = file.replace(/\.(md|mdx)$/, '');
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      date: data.date ? String(data.date) : '',
      excerpt: data.excerpt ?? data.description ?? '',
      tags: data.tags ?? [],
      content,
    } satisfies ContentItem;
  });

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getContentBySlug(type: string, slug: string): Promise<ContentItem | null> {
  const dir = path.join(CONTENT_DIR, type);
  const extensions = ['md', 'mdx'];

  for (const ext of extensions) {
    const filePath = path.join(dir, `${slug}.${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : '',
        excerpt: data.excerpt ?? data.description ?? '',
        tags: data.tags ?? [],
        content,
      };
    }
  }

  return null;
}
