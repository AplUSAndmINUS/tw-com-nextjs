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
    '@id': `${SITE_URL}/#person`,
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
      '@id': 'https://fluxline.pro/#organization',
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
    '@id': `${SITE_URL}/#person`,
    name: PERSON_NAME,
    url: SITE_URL,
    jobTitle: PERSON_ROLES,
    knowsAbout: PERSON_EXPERTISE,
    sameAs: PERSON_SAME_AS,
    worksFor: {
      '@type': 'Organization',
      '@id': 'https://fluxline.pro/#organization',
      name: 'Fluxline Resonance Group',
      url: 'https://fluxline.pro',
    },
  };
}

export function getBlogPostingSchema(post: ContentItem, slug: string) {
  const datePublished = post.publishedDate ?? post.date;
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

/**
 * Organization schema for Fluxline Resonance Group
 * Used in root layout to establish organizational context
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://fluxline.pro/#organization',
    name: 'Fluxline Resonance Group',
    url: 'https://fluxline.pro',
    logo: 'https://fluxline.pro/images/FluxlineLogo.png',
    founder: {
      '@type': 'Person',
      '@id': 'https://terencewaters.com/#person',
      name: PERSON_NAME,
      url: SITE_URL,
    },
    sameAs: ['https://fluxline.pro', 'https://github.com/Fluxline-Pro'],
  };
}

/**
 * WebSite schema for root layout
 * Establishes site identity and search capabilities
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Terence Waters',
    description:
      'Personal website of Terence Waters — author, technologist, and creative thinker exploring identity, resonance, and human-centered systems.',
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
    },
    inLanguage: 'en-US',
  };
}

/**
 * AboutPage schema for /about
 */
export function getAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${SITE_URL}/about#aboutpage`,
    url: `${SITE_URL}/about`,
    name: 'About Terence Waters',
    description: AI_BIOGRAPHY.longSummary,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: PERSON_NAME,
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

/**
 * Case Study Article schema
 */
export function getCaseStudySchema(caseStudy: ContentItem, slug: string) {
  const datePublished = caseStudy.publishedDate ?? caseStudy.date;
  const dateModified =
    caseStudy.date &&
    caseStudy.publishedDate &&
    caseStudy.date !== caseStudy.publishedDate
      ? caseStudy.date
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/case-studies/${slug}#article`,
    headline: caseStudy.title,
    description: caseStudy.excerpt,
    url: `${SITE_URL}/case-studies/${slug}`,
    mainEntityOfPage: `${SITE_URL}/case-studies/${slug}`,
    datePublished,
    dateModified,
    image: caseStudy.imageUrl ? `${SITE_URL}${caseStudy.imageUrl}` : undefined,
    keywords: caseStudy.seoKeywords?.length
      ? caseStudy.seoKeywords
      : caseStudy.tags,
    author: getAuthorSchema(),
    publisher: {
      '@type': 'Person',
      name: PERSON_NAME,
      url: SITE_URL,
    },
    isPartOf: {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/case-studies#collection`,
      url: `${SITE_URL}/case-studies`,
      name: 'Case Studies',
    },
  };
}

/**
 * Portfolio CreativeWork schema
 */
export function getPortfolioSchema(portfolio: ContentItem, slug: string) {
  const datePublished = portfolio.publishedDate ?? portfolio.date;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/portfolio/${slug}#creativework`,
    name: portfolio.title,
    description: portfolio.excerpt,
    url: `${SITE_URL}/portfolio/${slug}`,
    datePublished,
    image: portfolio.imageUrl ? `${SITE_URL}${portfolio.imageUrl}` : undefined,
    keywords: portfolio.seoKeywords?.length
      ? portfolio.seoKeywords
      : portfolio.tags,
    creator: getAuthorSchema(),
    isPartOf: {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/portfolio#collection`,
      url: `${SITE_URL}/portfolio`,
      name: 'Portfolio',
    },
  };
}

/**
 * Services ItemList schema
 */
export function getServicesItemListSchema() {
  const services = [
    {
      name: 'Design',
      description:
        'Interface and experience design for products, content systems, and digital platforms that need clarity and momentum.',
      url: `${SITE_URL}/services/design`,
    },
    {
      name: 'Development',
      description:
        'Modern web development and implementation support focused on performance, maintainability, and long-term product growth.',
      url: `${SITE_URL}/services/development`,
    },
    {
      name: 'Consulting',
      description:
        'Strategic advisory for founders and teams navigating architecture decisions, product direction, and execution planning.',
      url: `${SITE_URL}/services/consulting`,
    },
    {
      name: 'Resonance Core',
      description:
        'Identity-centered coaching and guidance for creators and leaders building aligned work, voice, and long-term direction.',
      url: `${SITE_URL}/services/resonance-core`,
    },
    {
      name: 'Personal Training',
      description:
        "Personalized fitness coaching with emotional intelligence—build strength, reduce pain, and align your physical practice with who you're becoming.",
      url: `${SITE_URL}/services/personal-training`,
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/services#itemlist`,
    name: 'Terence Waters Services',
    description:
      'Professional services across design, development, consulting, Resonance Core coaching, and personal training.',
    url: `${SITE_URL}/services`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': service.url,
        name: service.name,
        description: service.description,
        url: service.url,
        provider: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: PERSON_NAME,
        },
      },
    })),
  };
}
