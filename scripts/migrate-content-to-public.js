#!/usr/bin/env node

/**
 * Migration script to move content from /content to /public with new structure:
 * - Markdown: /public/{type}/{slug}/markdown/post.md
 * - Images: /public/{type}/{slug}/images/
 * - Updates frontmatter image paths to be relative to /public
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_TYPES = [
  'blog',
  'portfolio',
  'case-studies',
  'videos',
  'podcasts',
];
const OLD_CONTENT_DIR = path.join(process.cwd(), 'content');
const NEW_CONTENT_DIR = path.join(process.cwd(), 'public');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function updateImagePaths(frontmatter, slug, type) {
  const updated = { ...frontmatter };

  // Update imageUrl
  if (updated.imageUrl) {
    // Convert any old path to new format: /{type}/{slug}/images/filename
    const filename = path.basename(updated.imageUrl);
    updated.imageUrl = `/${type}/${slug}/images/${filename}`;
  }

  // Update featuredImage
  if (updated.featuredImage) {
    const filename = path.basename(updated.featuredImage);
    updated.featuredImage = `/${type}/${slug}/images/${filename}`;
  }

  // Update gallery items
  if (Array.isArray(updated.gallery)) {
    updated.gallery = updated.gallery.map((item) => {
      if (item.url) {
        const filename = path.basename(item.url);
        return {
          ...item,
          url: `/${type}/${slug}/images/${filename}`,
        };
      }
      return item;
    });
  }

  return updated;
}

function migrateContent(type) {
  const oldDir = path.join(OLD_CONTENT_DIR, type);
  const newDir = path.join(NEW_CONTENT_DIR, type);

  if (!fs.existsSync(oldDir)) {
    console.log(`⚠️  No content found in ${oldDir}`);
    return;
  }

  const entries = fs.readdirSync(oldDir, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.isFile() &&
      (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))
    ) {
      // Flat file: content/{type}/slug.md -> public/{type}/slug/markdown/post.md
      const slug = entry.name.replace(/\.(md|mdx)$/, '');
      const ext = entry.name.endsWith('.mdx') ? 'mdx' : 'md';
      const oldFilePath = path.join(oldDir, entry.name);

      console.log(`\n📄 Processing: ${type}/${slug}`);

      // Read and parse markdown
      const raw = fs.readFileSync(oldFilePath, 'utf-8');
      const { data, content } = matter(raw);

      // Update image paths in frontmatter
      const updatedData = updateImagePaths(data, slug, type);

      // Create new markdown content with updated frontmatter
      const newContent = matter.stringify(content, updatedData);

      // Create directories
      const newSlugDir = path.join(newDir, slug);
      const newMarkdownDir = path.join(newSlugDir, 'markdown');
      ensureDir(newMarkdownDir);

      // Write markdown file
      const newMarkdownPath = path.join(newMarkdownDir, `post.${ext}`);
      fs.writeFileSync(newMarkdownPath, newContent, 'utf-8');
      console.log(
        `  ✓ Moved markdown to: /${type}/${slug}/markdown/post.${ext}`
      );
    } else if (entry.isDirectory()) {
      // Folder structure: content/{type}/{slug}/post.md -> public/{type}/{slug}/markdown/post.md
      const slug = entry.name;
      const oldSlugDir = path.join(oldDir, slug);

      console.log(`\n📁 Processing: ${type}/${slug}`);

      // Find markdown file
      let markdownFile = null;
      let ext = 'md';
      for (const possibleExt of ['md', 'mdx']) {
        const testPath = path.join(oldSlugDir, `post.${possibleExt}`);
        if (fs.existsSync(testPath)) {
          markdownFile = testPath;
          ext = possibleExt;
          break;
        }
      }

      if (markdownFile) {
        // Read and parse markdown
        const raw = fs.readFileSync(markdownFile, 'utf-8');
        const { data, content } = matter(raw);

        // Update image paths in frontmatter
        const updatedData = updateImagePaths(data, slug, type);

        // Create new markdown content with updated frontmatter
        const newContent = matter.stringify(content, updatedData);

        // Create directories
        const newSlugDir = path.join(newDir, slug);
        const newMarkdownDir = path.join(newSlugDir, 'markdown');
        ensureDir(newMarkdownDir);

        // Write markdown file
        const newMarkdownPath = path.join(newMarkdownDir, `post.${ext}`);
        fs.writeFileSync(newMarkdownPath, newContent, 'utf-8');
        console.log(
          `  ✓ Moved markdown to: /${type}/${slug}/markdown/post.${ext}`
        );
      }

      // Move images if they exist
      const oldImagesDir = path.join(oldSlugDir, 'images');
      if (fs.existsSync(oldImagesDir)) {
        const newSlugDir = path.join(newDir, slug);
        const newImagesDir = path.join(newSlugDir, 'images');
        ensureDir(newImagesDir);

        const images = fs.readdirSync(oldImagesDir);
        for (const image of images) {
          const oldImagePath = path.join(oldImagesDir, image);
          const newImagePath = path.join(newImagesDir, image);
          fs.copyFileSync(oldImagePath, newImagePath);
          console.log(`  ✓ Copied image: ${image}`);
        }
      }
    }
  }
}

function main() {
  console.log('🚀 Starting content migration to /public structure...\n');

  for (const type of CONTENT_TYPES) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing content type: ${type.toUpperCase()}`);
    console.log('='.repeat(60));
    migrateContent(type);
  }

  console.log('\n\n✅ Migration complete!');
  console.log('\n📝 Next steps:');
  console.log('  1. Verify the content in /public folder');
  console.log('  2. Test your site to ensure images load correctly');
  console.log('  3. Once verified, you can safely remove the /content folder');
  console.log(
    '\n⚠️  Note: The /content folder has NOT been deleted automatically.'
  );
  console.log("   Please review and delete manually once you're satisfied.\n");
}

main();
