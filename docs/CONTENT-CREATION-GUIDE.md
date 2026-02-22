# Content Creation Guide — TerenceWaters.com

This guide explains how to create new content for **TerenceWaters.com**. The site uses a file-based content system powered by Markdown and MDX, with frontmatter for metadata.

---

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Creating a Blog Post](#creating-a-blog-post)
3. [Creating a Portfolio Entry](#creating-a-portfolio-entry)
4. [Creating a Podcast Episode](#creating-a-podcast-episode)
5. [Creating a Case Study](#creating-a-case-study)
6. [Frontmatter Reference](#frontmatter-reference)
7. [Adding Images](#adding-images)
8. [Using the Gallery](#using-the-gallery)

---

## Folder Structure

Content is organised into two locations:

```
content/                        ← Markdown files (processed at build time)
  blog/
    {slug}.md                   ← Simple flat blog post
    {slug}/
      post.md                   ← Blog post in slug-folder format (preferred)
  portfolio/
    {slug}/
      post.md
  case-studies/
    {slug}/
      post.md

public/                         ← Static assets (images, audio, video)
  blog/
    posts/
      {slug}/
        images/
          hero.jpeg             ← Featured/hero image
          gallery-1.jpeg        ← Gallery images
          gallery-2.jpeg
  portfolio/
    posts/
      {slug}/
        images/
          ...
  podcasts/
    {slug}/
      audio.mp3                 ← Episode audio file
      cover.jpg                 ← Episode artwork
```

---

## Creating a Blog Post

### 1. Create the folder structure

```bash
mkdir -p content/blog/my-new-post
mkdir -p public/blog/posts/my-new-post/images
```

### 2. Add your images to `public/blog/posts/my-new-post/images/`

Upload your hero image and any gallery images. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`.

### 3. Create `content/blog/my-new-post/post.md`

```markdown
---
title: 'My Post Title'
excerpt: 'A brief 1–2 sentence summary of the post shown in listings.'
author: 'Terence Waters'
publishedDate: '2026-03-01'
date: '2026-03-01'
category: 'Technology'
tags:
  - 'AI'
  - 'Innovation'
imageUrl: '/blog/posts/my-new-post/images/hero.jpeg'
imageAlt: 'A descriptive alt text for the hero image'
featured: false
seoTitle: 'My Post Title | Terence Waters'
seoDescription: 'A clear, 150–160 character description for search engines.'
seoKeywords:
  - 'keyword one'
  - 'keyword two'
gallery:
  - url: '/blog/posts/my-new-post/images/hero.jpeg'
    alt: 'Hero image description'
    caption: 'Optional caption text'
  - url: '/blog/posts/my-new-post/images/image-2.jpeg'
    alt: 'Second image description'
    caption: 'Optional caption'
---

Your post content starts here. You can use full **Markdown** and MDX.

## Section Heading

Paragraph text...
```

### 4. The post will automatically appear on `/blog` at the next build.

---

## Creating a Portfolio Entry

### 1. Create the folder structure

```bash
mkdir -p content/portfolio/my-project
mkdir -p public/portfolio/posts/my-project/images
```

### 2. Create `content/portfolio/my-project/post.md`

```markdown
---
title: 'Project Name'
excerpt: 'Short description of the project and its impact.'
author: 'Terence Waters'
date: '2026-02-01'
category: 'Web Development'
tags:
  - 'Next.js'
  - 'Azure'
  - 'TypeScript'
imageUrl: '/portfolio/posts/my-project/images/hero.png'
imageAlt: 'Project hero image'
featured: true
seoTitle: 'Project Name | Portfolio | Terence Waters'
seoDescription: 'Description for search engines.'
---

## Overview

Describe the project, problem, and solution...

## Technology

- Next.js
- Azure Static Web Apps
- TypeScript
```

---

## Creating a Podcast Episode

Podcast episodes are loaded dynamically from Azure Blob Storage via the `/api/podcasts` Azure Function. To add a new episode:

### 1. Upload to Azure Blob Storage

Upload your audio file and artwork to the `podcasts` container:

```
podcasts/
  {slug}/
    audio.mp3
    cover.jpg
```

### 2. Update `episodes.json` in the `podcasts` container

Add an entry to the master episodes index file (`podcasts/episodes.json`):

```json
[
  {
    "slug": "episode-title-kebab-case",
    "title": "Episode Title",
    "description": "What this episode is about.",
    "audioUrl": "https://yourstorageaccount.blob.core.windows.net/podcasts/episode-title-kebab-case/audio.mp3",
    "imageUrl": "https://yourstorageaccount.blob.core.windows.net/podcasts/episode-title-kebab-case/cover.jpg",
    "publishedDate": "2026-03-01",
    "duration": "45:30",
    "season": 1,
    "episode": 1,
    "category": "Technology",
    "tags": ["AI", "Innovation"]
  }
]
```

### 3. The episode will automatically appear on `/podcasts` once the Azure Function is configured.

---

## Creating a Case Study

### 1. Create the folder structure

```bash
mkdir -p content/case-studies/my-case-study
mkdir -p public/case-studies/posts/my-case-study/images
```

### 2. Create `content/case-studies/my-case-study/post.md`

```markdown
---
title: 'Case Study Title'
excerpt: 'What was the challenge and what was achieved?'
author: 'Terence Waters'
date: '2026-01-15'
category: 'Digital Transformation'
tags:
  - 'Enterprise'
  - 'Azure'
imageUrl: '/case-studies/posts/my-case-study/images/hero.jpeg'
imageAlt: 'Case study hero image'
seoTitle: 'Case Study Title | Terence Waters'
seoDescription: 'SEO description for the case study.'
---

## The Challenge

...

## The Solution

...

## Results

...
```

---

## Frontmatter Reference

| Field            | Type       | Required | Description                                                      |
| ---------------- | ---------- | -------- | ---------------------------------------------------------------- |
| `title`          | `string`   | ✅       | Post title shown in headings and browser tab                     |
| `excerpt`        | `string`   | ✅       | Short summary shown in listing cards                             |
| `date`           | `string`   | ✅       | ISO date (YYYY-MM-DD) used for sorting                           |
| `publishedDate`  | `string`   | —        | Human-readable publication date (falls back to `date`)           |
| `author`         | `string`   | —        | Author name shown in byline                                      |
| `category`       | `string`   | —        | Primary category used for filtering                              |
| `tags`           | `string[]` | —        | Array of tags used for filtering                                 |
| `imageUrl`       | `string`   | —        | Path to hero image (relative to `public/`)                       |
| `imageAlt`       | `string`   | —        | Alt text for the hero image (accessibility)                      |
| `featured`       | `boolean`  | —        | `true` to feature in the Content Hub featured section           |
| `featuredImage`  | `string`   | —        | Filename of the featured image (used internally)                 |
| `gallery`        | `object[]` | —        | Array of gallery images (see [Using the Gallery](#using-the-gallery)) |
| `seoTitle`       | `string`   | —        | Override the `<title>` tag for SEO                               |
| `seoDescription` | `string`   | —        | Override the meta description for SEO                            |
| `seoKeywords`    | `string[]` | —        | Keywords for the meta keywords tag                               |

---

## Adding Images

All images should be placed in `public/` so they are served as static assets.

**Naming conventions:**
- Use lowercase kebab-case: `hero-image.jpeg`, `drive-model.jpeg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- Optimise images before uploading (aim for < 500 KB for hero images)

**Referencing images in frontmatter:**
```yaml
imageUrl: '/blog/posts/my-post/images/hero.jpeg'
```

**Referencing images in Markdown content:**
```markdown
![Alt text](/blog/posts/my-post/images/inline-image.jpeg)
```

---

## Using the Gallery

A gallery enables the **ImageCarousel** component on the detail page. Clicking "View Gallery" reveals the carousel with thumbnail navigation.

```yaml
gallery:
  - url: '/blog/posts/my-post/images/image-1.jpeg'
    alt: 'Descriptive alt text (required for accessibility)'
    caption: 'Optional caption shown below the carousel'
  - url: '/blog/posts/my-post/images/image-2.jpeg'
    alt: 'Second image description'
    caption: 'Second caption'
```

> **Tip:** Use absolute paths (starting with `/`) for all image URLs so they work correctly in both development and production.

---

## Build & Preview

After adding content, run:

```bash
yarn dev          # Start the development server
yarn build        # Build the static site
```

Your content will be available at:
- Blog post: `http://localhost:3000/blog/my-new-post`
- Portfolio: `http://localhost:3000/portfolio/my-project`
- Case study: `http://localhost:3000/case-studies/my-case-study`
