/**
 * About page content
 * ==================
 *
 * All of the page's copy in one place, so the components stay layout-only.
 *
 * The previous version of this page ran ~1,800 words of prose with no scannable
 * structure. This pass keeps the same substance but cuts it to headline +
 * one-or-two lines per idea: someone skimming the section headers and the stat
 * numbers should come away with the whole picture, and the reader who wants
 * more goes to the drawer copy on the homepage or out to fluxline.pro.
 */

import AboutPortrait from '@/assets/images/AboutMePortrait.jpg';
import BeliefImage from '@/assets/images/Content1280x1815.jpg';
import ConsultingPortrait from '@/assets/images/ConsultingPortrait.jpg';
import GitHubPortrait from '@/assets/images/GitHubPortrait.jpg';
import PortfolioPortrait from '@/assets/images/Portfolio1280x1815.jpg';
import CaseStudyImage from '@/assets/images/CaseStudy1400x1867.jpg';
import EducationPortrait from '@/assets/images/EducationTrainingPortrait.jpg';

export interface AboutSectionMeta {
  /** Two-digit rail number — the page's counting motif. */
  num: string;
  /** Anchor id, also used by the page nav. */
  id: string;
  /** Uppercase rail label. */
  label: string;
  image: { src: string; alt: string };
}

export const SECTIONS = {
  intro: {
    num: '01',
    id: 'intro',
    label: 'The short version',
    image: { src: AboutPortrait.src, alt: 'Terence Waters' },
  },
  believe: {
    num: '02',
    id: 'believe',
    label: 'What I believe',
    image: { src: BeliefImage.src, alt: 'Writing and reflection' },
  },
  work: {
    num: '03',
    id: 'what-i-do',
    label: 'What I do',
    image: { src: ConsultingPortrait.src, alt: 'Consulting and facilitation' },
  },
  how: {
    num: '04',
    id: 'how-i-work',
    label: 'How I work',
    image: { src: GitHubPortrait.src, alt: 'Building and shipping' },
  },
  experience: {
    num: '05',
    id: 'experience',
    label: 'Experience',
    image: { src: PortfolioPortrait.src, alt: 'Fifteen years of work' },
  },
  projects: {
    num: '06',
    id: 'projects',
    label: 'Selected work',
    image: { src: CaseStudyImage.src, alt: 'Selected projects' },
  },
  credentials: {
    num: '07',
    id: 'credentials',
    label: 'Credentials',
    image: { src: EducationPortrait.src, alt: 'Education and certifications' },
  },
} satisfies Record<string, AboutSectionMeta>;

/* ── 01 The short version ─────────────────────────────────────────────────── */

export const INTRO_PARAGRAPHS = [
  'I help people and organizations rebuild the parts of themselves they thought were permanent.',
  'Systems architect by training, designer by instinct, coach by necessity. For 15+ years I have worked across IT architecture, full-stack development, brand identity, curriculum design, and personal transformation — translating complexity into clarity.',
  'If you are here, you are probably in a season of becoming. You are in the right place.',
];

export const STATS = [
  { value: '15+', label: 'Years bridging tech & design' },
  { value: '4', label: 'Degrees & certifications tracks' },
  { value: '3', label: 'Companies founded or led' },
];

/* ── 02 What I believe ────────────────────────────────────────────────────── */

export const BELIEFS = [
  {
    num: '01',
    title: 'Identity is a frequency, not a mask',
    text: 'It is not something you perform. It is something you return to.',
  },
  {
    num: '02',
    title: 'Transformation is architectural',
    text: 'Not force, not hustle — the slow re-alignment of the internal systems that shape how you think and move.',
  },
  {
    num: '03',
    title: 'The goal is resonance',
    text: 'Not the version of you that you were taught to be. The version you actually are.',
  },
];

/* ── 03 What I do ─────────────────────────────────────────────────────────── */

export const AUDIENCES = [
  {
    label: 'For individuals',
    text: 'Understand your identity architecture, clear the noise, and rebuild the internal systems you run on.',
  },
  {
    label: 'For founders & creators',
    text: 'Brands, platforms, and workflows that feel like you — not the version the internet told you to be.',
  },
  {
    label: 'For teams & organizations',
    text: 'Modular systems and strategic frameworks that make complexity navigable and growth possible.',
  },
];

/** Non-negotiables for anything I ship. Rendered as chips. */
export const BUILD_QUALITIES = [
  'Human-centered',
  'Emotionally intelligent',
  'Technically sound',
  'Scalable',
  'Accessible',
  'Deeply resonant',
];

/* ── 04 How I work ────────────────────────────────────────────────────────── */

export const HATS = [
  'Technologist',
  'Designer',
  'Strategist',
  'Educator',
  'Coach',
];

export const APPROACH = [
  {
    title: 'See the pattern first',
    text: 'Before anything gets built, I map what is actually going on underneath the symptom.',
  },
  {
    title: 'Translate, then simplify',
    text: 'Complexity is fine. Confusion is not. The deliverable is always clarity someone can act on.',
  },
  {
    title: 'Frameworks around people',
    text: 'I do not force people into a method. The method gets designed around the person or team in front of me.',
  },
];

/* ── 05 Experience ────────────────────────────────────────────────────────── */

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  bullets: string[];
}

export const TIMELINE: TimelineEntry[] = [
  {
    period: '2025 — Present',
    title: 'CEO, Founder & Chief Architect',
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
    title: 'Founder & CEO',
    org: 'Enteractive Studios, LLC',
    bullets: [
      'Freelance web development, design, and creative services.',
      'Brand identities and digital assets for individuals, nonprofits, and small businesses.',
    ],
  },
];

/* ── 06 Selected work ─────────────────────────────────────────────────────── */

export const PROJECTS = [
  {
    name: 'Fluxline Resonance Group 2.0',
    period: 'Q3 2025 — Q1 2026',
    role: 'CEO · Technical Lead · Architect',
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
    stack: 'Delivery · Stakeholder Facilitation',
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

/* ── 07 Credentials ───────────────────────────────────────────────────────── */

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
      'Stakeholder facilitation',
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
    credential: 'Ph.D. — Technology Management, Information Systems',
    school: 'Northcentral University',
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
