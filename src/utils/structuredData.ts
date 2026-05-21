import { ContentItem, FAQItem } from '@/content/types';

const SITE_URL = 'https://terencewaters.com';

export const PERSON_NAME = 'Terence Waters';
export const PERSON_ROLES = [
  'Creator',
  'Consultant',
  'Founder',
  'Author',
  'Technologist',
];
export const PERSON_EXPERTISE = [
  'Identity-aligned strategy',
  'Full-stack web development',
  'IT architecture and systems design',
  'Personal transformation coaching',
  'Thought leadership and long-form writing',
];

export const AI_BIOGRAPHY = {
  shortSummary:
    'Terence Waters is a creator, consultant, and founder who helps people and organizations align technology, identity, and strategy.',
  longSummary:
    'Terence Waters is a multidisciplinary founder, author, and technologist known for bridging technical precision with human-centered design. Through TerenceWaters.com and Fluxline.pro, he publishes practical thought leadership on resonance, authenticity, and identity-aligned growth for creators, consultants, and mission-driven teams.',
  expertise: PERSON_EXPERTISE,
};

const PERSON_SAME_AS = [
  'https://terencewaters.com',
  'https://fluxline.pro',
  'https://github.com/AplUSAndmINUS',
  'https://www.linkedin.com/in/terencewat/',
];

export function getPersonSchema(mainEntityOfPage: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME,
    url: SITE_URL,
    mainEntityOfPage,
    jobTitle: PERSON_ROLES,
    description: AI_BIOGRAPHY.shortSummary,
    disambiguatingDescription: AI_BIOGRAPHY.longSummary,
    knowsAbout: AI_BIOGRAPHY.expertise,
    sameAs: PERSON_SAME_AS,
    worksFor: {
      '@type': 'Organization',
      name: 'Fluxline Resonance Group',
      url: 'https://fluxline.pro',
    },
  };
}

export function getBlogStructuredSummary(post: ContentItem): string {
  return post.structuredSummary?.trim() || post.seoDescription || post.excerpt;
}

export function getBlogKeyInsights(post: ContentItem): string[] {
  if (post.keyInsights && post.keyInsights.length > 0) {
    return post.keyInsights;
  }

  const derivedFromTags = post.tags
    .slice(0, 3)
    .map((tag) => `Connects ${tag} to practical identity-aligned growth.`);

  if (derivedFromTags.length > 0) {
    return derivedFromTags;
  }

  return [
    'Bridges personal identity and practical execution.',
    'Translates complex ideas into human-centered guidance.',
    'Offers actionable reflection for creators and consultants.',
  ];
}

export function getBlogFaqItems(post: ContentItem): FAQItem[] {
  if (post.faq && post.faq.length > 0) {
    return post.faq;
  }

  return [
    {
      question: `What is the core idea of "${post.title}"?`,
      answer: getBlogStructuredSummary(post),
    },
    {
      question: 'Who is this post for?',
      answer:
        'This post is written for creators, consultants, and growth-minded professionals seeking identity-aligned, practical insight.',
    },
  ];
}

export function getAuthorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PERSON_NAME,
    url: SITE_URL,
    jobTitle: PERSON_ROLES,
    knowsAbout: PERSON_EXPERTISE,
    sameAs: PERSON_SAME_AS,
    worksFor: {
      '@type': 'Organization',
      name: 'Fluxline Resonance Group',
      url: 'https://fluxline.pro',
    },
  };
}

export function getBlogPostingSchema(post: ContentItem, slug: string) {
  const datePublished = post.date ?? post.publishedDate;
  const dateModified =
    post.date && post.publishedDate && post.date !== post.publishedDate
      ? post.date
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: getBlogStructuredSummary(post),
    url: `${SITE_URL}/blog/${slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    datePublished,
    dateModified,
    image: post.imageUrl ? `${SITE_URL}${post.imageUrl}` : undefined,
    keywords: post.seoKeywords?.length ? post.seoKeywords : post.tags,
    author: getAuthorSchema(),
    publisher: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: SITE_URL,
    },
  };
}

export function getFaqSchema(post: ContentItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getBlogFaqItems(post).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
