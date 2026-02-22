#!/usr/bin/env node
/**
 * migrate-blog.js
 *
 * Fetches blog entries from the legacy TerenceWaters.com Azure Function API
 * and converts them into Markdown files for the /content/blog directory.
 *
 * Usage:
 *   node scripts/migrate-blog.js [options]
 *
 * Options:
 *   --api-url <url>    Base API URL (default: https://api.terencewaters.com)
 *   --api-key <key>    API key for authentication (optional)
 *   --input   <file>   Path to a local JSON file instead of fetching from API
 *   --output  <dir>    Output directory (default: ./content/blog)
 *   --force            Overwrite existing markdown files
 *   --include-drafts   Include Draft and Archived posts (default: Published only)
 *   --help             Show this help message
 *
 * Examples:
 *   # Fetch from live API and write to ./content/blog
 *   node scripts/migrate-blog.js
 *
 *   # Fetch with an API key
 *   node scripts/migrate-blog.js --api-key my-secret-key
 *
 *   # Use a local JSON export (offline / dry-run)
 *   node scripts/migrate-blog.js --input ./tmp/blog-export.json
 *
 *   # Overwrite existing files
 *   node scripts/migrate-blog.js --force
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1] || null;
}

function hasFlag(flag) {
  return args.includes(flag);
}

if (hasFlag('--help') || hasFlag('-h')) {
  console.log(`
migrate-blog.js — Convert legacy TW.com blog JSON into Markdown files

Usage:
  node scripts/migrate-blog.js [options]

Options:
  --api-url <url>    Base API URL (default: https://api.terencewaters.com)
  --api-key <key>    API key passed as x-api-key header (optional)
  --input   <file>   Path to a local JSON file instead of fetching from API
  --output  <dir>    Output directory (default: ./content/blog)
  --force            Overwrite existing markdown files
  --include-drafts   Include Draft/Archived posts (default: Published only)
  --help             Show this help message
`);
  process.exit(0);
}

const API_BASE_URL = getArg('--api-url') || 'https://api.terencewaters.com';
const API_KEY = getArg('--api-key') || null;
const INPUT_FILE = getArg('--input') || null;
const OUTPUT_DIR = getArg('--output') || path.join(process.cwd(), 'content', 'blog');
const FORCE = hasFlag('--force');
const INCLUDE_DRAFTS = hasFlag('--include-drafts');

// ---------------------------------------------------------------------------
// HTTP helper — returns a Promise resolving to parsed JSON
// ---------------------------------------------------------------------------

function fetchJson(url, headers) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const transport = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'tw-com-migrate-blog/1.0',
        ...headers,
      },
    };

    const req = transport.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(
            new Error(
              `HTTP ${res.statusCode} for ${url}: ${body.slice(0, 200)}`
            )
          );
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error(`Request timed out: ${url}`));
    });
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Fetch all blog posts (handles pagination)
// ---------------------------------------------------------------------------

async function fetchAllPosts() {
  const authHeaders = API_KEY ? { 'x-api-key': API_KEY } : {};
  const allPosts = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url = `${API_BASE_URL}/posts?page=${page}&pageSize=100&status=Published`;
    console.log(`  Fetching page ${page} of ${totalPages}: ${url}`);

    const response = await fetchJson(url, authHeaders);

    // Support both paginated envelope { data: [...], pagination: {...} }
    // and a plain array response
    let posts;
    if (Array.isArray(response)) {
      posts = response;
      totalPages = 1;
    } else if (response && Array.isArray(response.data)) {
      posts = response.data;
      if (response.pagination) {
        totalPages = response.pagination.totalPages || 1;
      }
    } else {
      throw new Error(
        'Unexpected API response shape. Expected array or { data: [...] }.'
      );
    }

    allPosts.push(...posts);
    page += 1;
  } while (page <= totalPages);

  if (INCLUDE_DRAFTS) {
    // Fetch Draft posts as well on a separate call
    page = 1;
    totalPages = 1;
    do {
      const url = `${API_BASE_URL}/posts?page=${page}&pageSize=100&status=Draft`;
      console.log(`  Fetching drafts page ${page} of ${totalPages}: ${url}`);
      const response = await fetchJson(url, authHeaders);
      let posts;
      if (Array.isArray(response)) {
        posts = response;
        totalPages = 1;
      } else if (response && Array.isArray(response.data)) {
        posts = response.data;
        if (response.pagination) {
          totalPages = response.pagination.totalPages || 1;
        }
      } else {
        break;
      }
      allPosts.push(...posts);
      page += 1;
    } while (page <= totalPages);
  }

  return allPosts;
}

// ---------------------------------------------------------------------------
// Load posts from a local JSON file
// ---------------------------------------------------------------------------

function loadPostsFromFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);

  // Support { data: [...] }, { posts: [...] }, or plain array
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.data)) return parsed.data;
  if (Array.isArray(parsed.posts)) return parsed.posts;

  throw new Error(
    'Unexpected JSON structure. Expected an array or { data: [...] } or { posts: [...] }.'
  );
}

// ---------------------------------------------------------------------------
// Slug sanitisation
// ---------------------------------------------------------------------------

function sanitiseSlug(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')          // collapse consecutive hyphens
    .replace(/^-|-$/g, '');       // strip leading/trailing hyphens
}

// ---------------------------------------------------------------------------
// Map authorSlug → display name (best-effort; falls back to slug)
// ---------------------------------------------------------------------------

function resolveAuthorName(authorSlug) {
  const knownAuthors = {
    'terence-waters': 'Terence Waters',
    'tw': 'Terence Waters',
  };
  return knownAuthors[authorSlug] || authorSlug;
}

// ---------------------------------------------------------------------------
// Convert ISO timestamp to YYYY-MM-DD
// ---------------------------------------------------------------------------

function toDateString(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// YAML-safe string: wrap in single quotes, escape inner single quotes
// ---------------------------------------------------------------------------

function yamlString(value) {
  if (!value) return "''";
  const escaped = String(value).replace(/'/g, "''");
  return `'${escaped}'`;
}

// ---------------------------------------------------------------------------
// Build the frontmatter YAML block
// ---------------------------------------------------------------------------

function buildFrontmatter(post) {
  // API field 'publishDate' maps to frontmatter fields 'date' and 'publishedDate'
  const date = toDateString(post.publishDate) || toDateString(post.timestamp) || '';
  const author = resolveAuthorName(post.authorSlug || '');
  const tags = Array.isArray(post.tagsList) ? post.tagsList : [];
  const excerpt = (post.description || '').trim();
  const category = (post.category || '').trim();

  const lines = ['---'];

  lines.push(`title: ${yamlString(post.title || '')}`);
  if (date) {
    lines.push(`date: '${date}'`);
    lines.push(`publishedDate: '${date}'`);
  }
  if (excerpt) {
    lines.push(`excerpt: ${yamlString(excerpt)}`);
  }
  if (author) {
    lines.push(`author: ${yamlString(author)}`);
  }
  if (category) {
    lines.push(`category: ${yamlString(category)}`);
  }
  if (tags.length > 0) {
    lines.push('tags:');
    for (const tag of tags) {
      lines.push(`  - ${yamlString(tag)}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Convert a single BlogPostDTO to a Markdown string
// ---------------------------------------------------------------------------

function postToMarkdown(post) {
  const frontmatter = buildFrontmatter(post);
  const body = (post.content || '').trim();
  return `${frontmatter}\n\n${body}\n`;
}

// ---------------------------------------------------------------------------
// Filter posts
// ---------------------------------------------------------------------------

function shouldInclude(post) {
  if (INCLUDE_DRAFTS) return true;
  const status = (post.status || '').toLowerCase();
  // isPublished may be a boolean or the string "true"
  const isPublished =
    post.isPublished === true ||
    post.isPublished === 'true' ||
    status === 'published';
  return isPublished;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  TW.com Blog Migration — JSON → Markdown ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
  console.log(`Output directory : ${OUTPUT_DIR}`);
  console.log(`Force overwrite  : ${FORCE}`);
  console.log(`Include drafts   : ${INCLUDE_DRAFTS}`);
  if (INPUT_FILE) {
    console.log(`Input file       : ${INPUT_FILE}`);
  } else {
    console.log(`API base URL     : ${API_BASE_URL}`);
  }
  console.log('');

  // Ensure the output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load posts
  let posts;
  if (INPUT_FILE) {
    console.log(`Loading posts from file: ${INPUT_FILE}`);
    posts = loadPostsFromFile(INPUT_FILE);
    console.log(`Loaded ${posts.length} post(s) from file.`);
  } else {
    console.log('Fetching posts from API…');
    posts = await fetchAllPosts();
    console.log(`Fetched ${posts.length} post(s) from API.`);
  }

  console.log('');

  // Filter
  const filtered = posts.filter(shouldInclude);
  if (!INCLUDE_DRAFTS && filtered.length < posts.length) {
    console.log(
      `Skipped ${posts.length - filtered.length} non-published post(s). Use --include-drafts to include them.`
    );
  }

  // Convert and write
  let written = 0;
  let skipped = 0;
  let errors = 0;

  for (const post of filtered) {
    const rawSlug = post.slug || post.id || '';
    if (!rawSlug) {
      console.warn('  [WARN] Post has no slug or id — skipping:', post.title);
      errors += 1;
      continue;
    }

    const slug = sanitiseSlug(rawSlug);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.md`);
    const existed = fs.existsSync(outputPath);

    if (existed && !FORCE) {
      console.log(`  [SKIP] ${slug}.md already exists (use --force to overwrite)`);
      skipped += 1;
      continue;
    }

    try {
      const markdown = postToMarkdown(post);
      fs.writeFileSync(outputPath, markdown, 'utf-8');
      const status = existed ? 'OVERWRITE' : 'CREATE';
      console.log(`  [${status}] ${slug}.md`);
      written += 1;
    } catch (err) {
      console.error(`  [ERROR] Failed to write ${slug}.md:`, err.message);
      errors += 1;
    }
  }

  console.log('');
  console.log('─────────────────────────────────────────');
  console.log(`  Written  : ${written}`);
  console.log(`  Skipped  : ${skipped}`);
  console.log(`  Errors   : ${errors}`);
  console.log('─────────────────────────────────────────');
  console.log('');

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\n[FATAL]', err.message);
  process.exit(1);
});
