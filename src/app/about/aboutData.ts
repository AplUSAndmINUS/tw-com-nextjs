/**
 * /about factual lists
 * ====================
 *
 * The timeline, projects, skills, degrees and certifications: facts, kept as
 * data so the page stays layout-only. The page's narrative copy lives in
 * src/content/site/about.ts (with approval status).
 *
 * Redesign (2026-11) wording fixes, per CREATIVE_BRIEF.md §7.4 (no "CEO", no
 * "stakeholders"): "CEO, Founder & Chief Architect" → "Founder & Chief
 * Architect" (approved); Enteractive "Founder & CEO" → "Founder" and the
 * project role "CEO" → "Founder" (Decision L, owner to confirm);
 * "Stakeholder facilitation/Facilitation" → "Facilitation".
 */

/* ── Experience ────────────────────────────────────────────────────────── */

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  bullets: string[];
}

export const TIMELINE: TimelineEntry[] = [
  {
    period: '2025 — Present',
    title: 'Founder & Chief Architect',
    org: 'Fluxline Resonance Group, LLC',
    bullets: [
      'Modular systems joining IT consulting, brand identity, and personal transformation.',
      'Cloud, web, and infrastructure delivery on Azure, M365, Next.js, and DevOps workflows.',
      'Curriculum-style documentation, SOPs, and AI-assisted workflows for clients and teams.',
    ],
  },
  {
    period: '2015 — 2025',
    title: 'Senior Software Engineer / Solutions Analyst',
    org: 'Intermountain Healthcare',
    bullets: [
      'Built enterprise platforms including MyHealth+ and Provider Digital Experience.',
      'Led UX initiatives, user testing, and design-thinking workshops across departments.',
      'IT Architecture Liaison and Design Facilitator on platform unification programs.',
    ],
  },
  {
    period: '2016 — 2021',
    title: 'Adjunct Professor',
    org: 'Salt Lake Community College (SATTS)',
    bullets: [
      'Taught JavaScript, web development, graphic design, and Adobe Creative Cloud.',
      'Mentored students through front-end, back-end, Git, and design fundamentals.',
    ],
  },
  {
    period: '2008 — 2022',
    title: 'Founder',
    org: 'Enteractive Studios, LLC',
    bullets: [
      'Freelance web development, design, and creative services.',
      'Brand identities and digital assets for individuals, nonprofits, and small businesses.',
    ],
  },
];

/* ── Selected projects ─────────────────────────────────────────────────────── */

export const PROJECTS = [
  {
    name: 'Fluxline Resonance Group 2.0',
    period: 'Q3 2025 — Q1 2026',
    role: 'Founder · Technical Lead · Architect',
    stack: 'Azure · Next.js · C# · CI/CD · Brand',
  },
  {
    name: 'MyIntermountain Unified Intranet',
    period: 'Q1 — Q4 2024',
    role: 'Technical Lead · Scrum Lead',
    stack: 'IT Architecture · Agile · Strategy',
  },
  {
    name: 'Affiliates iLogin Implementation',
    period: 'Q2 2022 — Q1 2025',
    role: 'Project Manager · Technical Lead',
    stack: 'Delivery · Facilitation',
  },
  {
    name: 'Employee Portal (.NET / SharePoint)',
    period: 'Q3 2021 — Q4 2022',
    role: 'Design Lead · Front-end',
    stack: 'UX Research · Prototyping · Design Systems',
  },
  {
    name: 'Provider Digital Experience',
    period: 'Q3 2020 — Q2 2021',
    role: 'Lead Designer · Front-end',
    stack: 'UI/UX · Design Thinking · User Testing',
  },
  {
    name: 'MyHealth+ App & Website',
    period: 'Q2 2019 — Q2 2020',
    role: 'Front-end · Solutions Analyst',
    stack: 'Full-stack · Agile · Training',
  },
];

/* ── Credentials ───────────────────────────────────────────────────────── */

export const SKILL_GROUPS = [
  {
    title: 'Technical',
    skills: [
      'React / Next.js / Node',
      'TypeScript / C# / .NET',
      'Azure Cloud & M365',
      'DevOps / CI-CD',
      'Design systems & SCSS',
      'AI-assisted development',
    ],
  },
  {
    title: 'Leadership',
    skills: [
      'IT architecture & strategy',
      'Agile / Scrum (PSM I)',
      'Project management',
      'Facilitation',
      'Change management',
      'Curriculum design',
    ],
  },
  {
    title: 'Human-centered',
    skills: [
      'Coaching & mentoring',
      'Brand identity',
      'UX research & testing',
      'Communication strategy',
      'Instructional design',
      'Storytelling & copy',
    ],
  },
];

export const EDUCATION = [
  {
    credential:
      'Ph.D. — Technology Information Management, Information Systems emphasis',
    school: 'National University',
    year: '2026 — 2030 (in progress)',
  },
  {
    credential: 'MBA — IT Management',
    school: 'Western Governors University',
    year: '2017 — 2019',
  },
  {
    credential: 'B.S. — Web Design & Development',
    school: 'Independence University',
    year: '2014 — 2017',
  },
  {
    credential: 'Certificate — Web Programming',
    school: 'Salt Lake Community College',
    year: '2015',
  },
];

export const CERTIFICATIONS = [
  { name: 'NASM Certified Personal Trainer', year: '2025 — 2026' },
  { name: 'Google Project Management', year: '2023' },
  { name: 'Professional Scrum Master I (PSM I)', year: '2023' },
  { name: 'Azure Fundamentals, AI & Developer', year: '2021 — 2024' },
  { name: 'M365 Fundamentals & Developer', year: '2021 — 2024' },
  { name: 'ITIL Foundations v3 — AXELOS', year: '2016' },
  { name: 'Adobe Creative Cloud Certified', year: '2017 — 2022' },
  { name: 'A+ Certification — CompTIA', year: '2002' },
];
