# Content Creation Guide for TW.com

This guide explains how to create and manage content (Blog posts, Portfolio entries, Case Studies, and Podcast episodes) for the TW.com Next.js site.

## Table of Contents

- [Folder Structure](#folder-structure)
- [Content Types](#content-types)
  - [Blog Posts](#blog-posts)
  - [Portfolio Entries](#portfolio-entries)
  - [Case Studies](#case-studies)
  - [Podcasts](#podcasts)
- [Frontmatter Reference](#frontmatter-reference)
- [Working with Images](#working-with-images)
- [Best Practices](#best-practices)

---

## Folder Structure

Content is organized in the `/content` directory:

```
content/
  blog/
    my-post.md                    # Flat file (simple posts)
    my-post-with-images/          # Folder format (with images)
      post.md
      images/
        cover.jpg
        screenshot.png
  portfolio/
    project-name/
      post.md
      images/
        hero.jpg
        screenshot1.png
  case-studies/
    case-study-slug/
      post.md
      images/
  podcasts/
    (managed via Azure Function)
```

### Two Formats Supported

1. **Flat File** - For simple content without local images:

   ```
   content/blog/my-post.md
   ```

2. **Folder Format** - For content with images:
   ```
   content/blog/my-post/
     post.md
     images/
       image1.jpg
       image2.png
   ```

---

## Content Types

### Blog Posts

**Location:** `/content/blog/`

**Example:** `content/blog/my-first-post/post.md`

```yaml
---
title: 'My First Blog Post'
excerpt: 'A brief description of what this post is about.'
author: 'Terence Waters'
publishedDate: '2026-02-15'
category: 'Technology'
tags:
  - 'Next.js'
  - 'React'
  - 'Web Development'
imageUrl: '/blog/my-first-post/images/cover.jpg'
imageAlt: 'Cover image description'
featured: true
seoTitle: 'My First Blog Post | Terence Waters'
seoDescription: 'Learn about Next.js patterns in this comprehensive guide.'
seoKeywords:
  - 'nextjs'
  - 'react'
  - 'tutorial'
gallery:
  - url: '/blog/my-first-post/images/screenshot1.png'
    alt: 'Screenshot of the dashboard'
    caption: 'The main dashboard interface'
  - url: '/blog/my-first-post/images/screenshot2.png'
    alt: 'Settings panel'
    caption: 'Configuration options'
---

## Your Content Here

Write your blog post content using Markdown. You can use:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Images: `![Alt text](path/to/image.jpg)`
- Code blocks
- Lists
- And more!

### Section Heading

More content...
```

**Required Fields:**

- `title` - Post title
- `excerpt` - Short description (used in listings)
- `publishedDate` - ISO date string (YYYY-MM-DD)

**Optional Fields:**

- `author` - Author name (defaults to site owner)
- `category` - Content category
- `tags` - Array of tags for filtering
- `imageUrl` - Featured image URL
- `imageAlt` - Alt text for featured image
- `featured` - Mark as featured content
- `gallery` - Array of images for carousel
- SEO fields (`seoTitle`, `seoDescription`, `seoKeywords`)

---

### Portfolio Entries

**Location:** `/content/portfolio/`

**Example:** `content/portfolio/fluxline-pro/post.md`

```yaml
---
title: 'Fluxline Pro Web Platform'
excerpt: 'A comprehensive business platform with CRM, content management, and AI integration.'
publishedDate: '2026-01-20'
category: 'Web Development'
tags:
  - 'Next.js'
  - 'Azure'
  - 'Full Stack'
imageUrl: '/portfolio/fluxline-pro/images/hero.jpg'
imageAlt: 'Fluxline Pro dashboard screenshot'
featuredImage: 'hero.jpg'
featured: true
gallery:
  - url: '/portfolio/fluxline-pro/images/dashboard.png'
    alt: 'Dashboard overview'
    caption: 'Real-time analytics dashboard'
  - url: '/portfolio/fluxline-pro/images/crm.png'
    alt: 'CRM interface'
    caption: 'Customer relationship management system'
  - url: '/portfolio/fluxline-pro/images/content.png'
    alt: 'Content editor'
    caption: 'Rich content editing interface'
seoTitle: 'Fluxline Pro - Full Stack Web Platform | Portfolio'
seoDescription: 'Case study of building a comprehensive business platform with Next.js, Azure, and AI.'
---

## Project Overview

Describe your project, the problem it solves, your role, and key achievements.

### Technologies Used

- Next.js 15
- Azure Static Web Apps
- Azure Functions
- TypeScript
- Fluent UI

### Challenges & Solutions

...
```

**Portfolio-Specific Notes:**

- Use `gallery` for multiple project screenshots
- `featuredImage` highlights the main project image
- Include technical details and your specific contributions
- Tag with relevant technologies

---

### Case Studies

**Location:** `/content/case-studies/`

**Example:** `content/case-studies/ecommerce-migration/post.md`

```yaml
---
title: 'E-Commerce Platform Migration'
excerpt: 'How we migrated a legacy e-commerce system to modern architecture while maintaining 99.9% uptime.'
publishedDate: '2026-02-01'
category: 'Case Study'
tags:
  - 'Migration'
  - 'E-Commerce'
  - 'Cloud'
imageUrl: '/case-studies/ecommerce-migration/images/before-after.jpg'
imageAlt: 'System architecture comparison'
gallery:
  - url: '/case-studies/ecommerce-migration/images/old-architecture.png'
    alt: 'Legacy architecture diagram'
    caption: 'Original monolithic architecture'
  - url: '/case-studies/ecommerce-migration/images/new-architecture.png'
    alt: 'Modern microservices architecture'
    caption: 'New cloud-native architecture'
  - url: '/case-studies/ecommerce-migration/images/performance.png'
    alt: 'Performance improvements graph'
    caption: '3x performance improvement'
seoTitle: 'E-Commerce Migration Case Study | Zero-Downtime Cloud Migration'
seoDescription: 'Detailed case study on migrating a legacy e-commerce platform to modern cloud infrastructure.'
---

## Background

Describe the client, their challenge, and why they needed your help.

## The Challenge

What specific problems needed solving?

## Our Approach

Step-by-step breakdown of your methodology.

## Results

Quantifiable outcomes, metrics, and impact.

## Lessons Learned

Key takeaways and insights.
```

**Case Study Best Practices:**

- Focus on the problem-solution narrative
- Include measurable results (metrics, KPIs)
- Use `gallery` to show before/after comparisons
- Detail your specific approach and decision-making process

---

### Podcasts

**Note:** Podcasts are managed via Azure Function and Azure Storage, not Markdown files.

**Structure for future reference:**

```typescript
interface PodcastEpisode {
  slug: string;
  title: string;
  description: string;
  audioUrl: string; // Azure Storage blob URL
  publishedDate: string;
  duration: string; // e.g., "45:30"
  tags: string[];
  category: string;
  imageUrl: string; // Episode artwork
  transcript: string; // Optional transcript
  season: number; // Optional
  episode: number; // Optional
}
```

Podcast episodes will be uploaded to Azure Storage and managed through the Azure Function API.

---

## Frontmatter Reference

### Core Fields (All Content Types)

| Field           | Type     | Required | Description                           |
| --------------- | -------- | -------- | ------------------------------------- |
| `title`         | string   | ✅       | Content title                         |
| `excerpt`       | string   | ✅       | Short description (150-200 chars)     |
| `publishedDate` | string   | ✅       | ISO date (YYYY-MM-DD)                 |
| `tags`          | string[] | ❌       | Array of tags for filtering           |
| `content`       | markdown | ✅       | Main body content (below frontmatter) |

### Extended Fields

| Field           | Type    | Required | Description                 |
| --------------- | ------- | -------- | --------------------------- |
| `author`        | string  | ❌       | Author name                 |
| `category`      | string  | ❌       | Content category            |
| `imageUrl`      | string  | ❌       | Featured/cover image URL    |
| `imageAlt`      | string  | ❌       | Alt text for featured image |
| `featured`      | boolean | ❌       | Mark as featured content    |
| `featuredImage` | string  | ❌       | Filename for featured image |

### Gallery

| Field               | Type          | Required | Description               |
| ------------------- | ------------- | -------- | ------------------------- |
| `gallery`           | GalleryItem[] | ❌       | Array of gallery images   |
| `gallery[].url`     | string        | ✅       | Image path/URL            |
| `gallery[].alt`     | string        | ✅       | Accessibility description |
| `gallery[].caption` | string        | ❌       | Caption text              |

**Example Gallery:**

```yaml
gallery:
  - url: '/blog/post-name/images/image1.jpg'
    alt: 'Description of image'
    caption: 'Optional caption text'
  - url: '/blog/post-name/images/image2.jpg'
    alt: 'Another image description'
    caption: 'Another caption'
```

### SEO Fields

| Field            | Type     | Required | Description                      |
| ---------------- | -------- | -------- | -------------------------------- |
| `seoTitle`       | string   | ❌       | Custom title tag (max 60 chars)  |
| `seoDescription` | string   | ❌       | Meta description (max 160 chars) |
| `seoKeywords`    | string[] | ❌       | Array of SEO keywords            |

---

## Working with Images

### Image Organization

1. **Create an images folder** in your content directory:

   ```
   content/blog/my-post/
     post.md
     images/
       cover.jpg
       screenshot1.png
       screenshot2.png
   ```

2. **Reference images** in frontmatter:

   ```yaml
   imageUrl: '/blog/my-post/images/cover.jpg'
   imageAlt: 'Cover image description'
   ```

3. **Use absolute paths** from the public directory:
   ```yaml
   gallery:
     - url: '/blog/my-post/images/screenshot1.png'
       alt: 'Screenshot description'
   ```

### Image Best Practices

- **File formats:** Use JPG for photos, PNG for screenshots/graphics, WebP for best compression
- **Image size:** Optimize images (max 1920px wide, ~200KB per image)
- **Naming:** Use descriptive names (`dashboard-overview.png` not `img1.png`)
- **Alt text:** Always provide descriptive alt text for accessibility
- **Captions:** Use captions to provide context

### Using the Image Carousel

The `ImageCarousel` component automatically displays your `gallery` array:

```tsx
import { ImageCarousel } from '@/components/ui/ImageCarousel';

<ImageCarousel images={post.gallery} />;
```

Features:

- Full-size image display
- Next/Previous navigation
- Thumbnail strip
- Keyboard navigation (arrow keys)
- Click thumbnails to jump
- Captions and alt text

---

## Best Practices

### Content Writing

1. **Use clear, descriptive titles** - Help readers understand the topic immediately
2. **Write compelling excerpts** - 150-200 characters that hook the reader
3. **Structure with headings** - Use H2 (`##`) and H3 (`###`) for organization
4. **Add internal links** - Link to related content on your site
5. **Keep paragraphs short** - 2-4 sentences per paragraph for readability

### Frontmatter

1. **Always include required fields** - title, excerpt, publishedDate
2. **Use consistent dates** - ISO format (YYYY-MM-DD)
3. **Tag appropriately** - 3-7 relevant tags per post
4. **Write for SEO** - Include descriptive SEO fields
5. **Feature strategically** - Only mark your best content as `featured: true`

### Images

1. **Optimize before upload** - Use tools like TinyPNG or ImageOptim
2. **Provide alt text** - Essential for accessibility and SEO
3. **Use responsive images** - Next.js Image component handles this automatically
4. **Organize by content** - Keep images in content-specific folders
5. **Name descriptively** - `project-dashboard.png` not `img123.png`

### File Organization

1. **Use folder format for rich content** - When you have multiple images
2. **Keep flat files for simple posts** - When you have no local images
3. **Name consistently** - Use `kebab-case` for all slugs
4. **One content item per folder** - Don't mix multiple posts

---

## Example: Creating a New Blog Post

### Step 1: Create the folder structure

```bash
mkdir -p content/blog/introduction-to-nextjs/images
```

### Step 2: Add images

```bash
# Copy your images into the images folder
cp ~/Desktop/nextjs-cover.jpg content/blog/introduction-to-nextjs/images/
cp ~/Desktop/screenshot.png content/blog/introduction-to-nextjs/images/
```

### Step 3: Create post.md

```bash
touch content/blog/introduction-to-nextjs/post.md
```

### Step 4: Write your content

```markdown
---
title: 'Introduction to Next.js 15'
excerpt: 'Learn the fundamentals of Next.js 15 and build modern web applications.'
author: 'Terence Waters'
publishedDate: '2026-02-15'
category: 'Web Development'
tags:
  - 'Next.js'
  - 'React'
  - 'Tutorial'
imageUrl: '/blog/introduction-to-nextjs/images/nextjs-cover.jpg'
imageAlt: 'Next.js logo and code editor'
featured: false
gallery:
  - url: '/blog/introduction-to-nextjs/images/screenshot.png'
    alt: 'Next.js app screenshot'
    caption: 'A simple Next.js application'
seoTitle: 'Introduction to Next.js 15 | Complete Guide'
seoDescription: 'Comprehensive guide to Next.js 15 features, setup, and best practices for modern web development.'
seoKeywords:
  - 'nextjs 15'
  - 'react framework'
  - 'web development'
---

## What is Next.js?

Next.js is a powerful React framework that enables you to build fast, production-ready applications...

### Key Features

- Server-side rendering
- Static site generation
- API routes
- TypeScript support

...
```

### Step 5: Preview and publish

1. Run your development server: `yarn dev`
2. Navigate to `/blog` to see your post listed
3. Click through to `/blog/introduction-to-nextjs` to view the full post
4. Commit and push your changes

---

## Troubleshooting

### Post not showing up?

- Check that the file is named `post.md` (in folder format) or has `.md` extension (flat format)
- Verify the frontmatter is valid YAML (proper indentation, quotes, etc.)
- Ensure `publishedDate` is in the correct format (YYYY-MM-DD)
- Check that the file is in the correct directory (`content/blog/`, etc.)

### Images not loading?

- Verify image paths start with `/` (absolute from public directory)
- Check image files exist at the specified path
- Ensure proper file extensions (.jpg, .png, .webp)
- Confirm Next.js Image optimization is working (check console for errors)

### Gallery not displaying?

- Verify `gallery` array is properly formatted in frontmatter
- Ensure each gallery item has `url` and `alt` fields
- Check that image URLs are correct and accessible
- Import and use the `ImageCarousel` component in your template

---

## Need Help?

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review existing content in `/content` for examples
- Ask on the team Slack/Discord
- Submit an issue on GitHub

Happy content creating! 🚀
