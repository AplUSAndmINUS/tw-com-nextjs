/**
 * ConsultationStepper Constants
 * Service options and contextual question sets
 */

import { ServiceOption, QuestionSet, ServiceKey } from './types';

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    key: 'personal_training',
    label: 'Personal Training',
    description:
      'Fitness coaching, workout plans, and performance optimization.',
    icon: 'Accessibility28Regular',
  },
  {
    key: 'it_consulting',
    label: 'IT Business Consulting',
    description:
      'Technology strategy, system audits, and digital transformation.',
    icon: 'PeopleCommunity28Regular',
  },
  {
    key: 'graphic_design',
    label: 'Graphic Design',
    description:
      'Brand identity, marketing materials, and visual storytelling.',
    icon: 'DesignIdeas28Filled',
  },
  {
    key: 'web_development',
    label: 'Web Development',
    description: 'Custom websites, web apps, and modern digital experiences.',
    icon: 'Code24Filled',
  },
  {
    key: 'resonance_coaching',
    label: 'Resonance Core Framework Coaching',
    description:
      'Mindset alignment, life strategy, and personal resonance work.',
    icon: 'Heart28Filled',
  },
  {
    key: 'help_me_choose',
    label: "I don't know / Help me choose",
    description:
      "Not sure which service fits? Select this and we'll guide you on the call.",
    icon: 'QuestionCircle28Regular',
  },
];

export const REFERRAL_OPTIONS = [
  { key: 'google', text: 'Google' },
  { key: 'social_media', text: 'Social Media' },
  { key: 'referral', text: 'Referral from a Friend' },
  { key: 'linkedin', text: 'LinkedIn' },
  { key: 'podcast', text: 'Podcast' },
  { key: 'blog', text: 'Blog / Article' },
  { key: 'event', text: 'Event / Conference' },
  { key: 'other', text: 'Other' },
];

export const BUDGET_OPTIONS = [
  { key: 'under_500', text: 'Under $500' },
  { key: '500_1000', text: '$500 – $1,000' },
  { key: '1000_3000', text: '$1,000 – $3,000' },
  { key: '3000_10000', text: '$3,000 – $10,000' },
  { key: '10000_plus', text: '$10,000+' },
  { key: 'not_sure', text: "I'm not sure yet" },
];

export const TIMELINE_OPTIONS = [
  { key: 'immediately', text: 'Immediately' },
  { key: '1_3_months', text: '1–3 months' },
  { key: '3_6_months', text: '3–6 months' },
  { key: '6_plus_months', text: '6+ months' },
];

export const QUESTION_SETS: Record<ServiceKey | 'generic', QuestionSet> = {
  personal_training: {
    serviceKey: 'personal_training',
    questions: [
      {
        id: 'pt_goal',
        label: 'What is your primary fitness goal?',
        type: 'text',
        placeholder: 'e.g. Lose weight, build muscle, improve endurance…',
        required: true,
      },
      {
        id: 'pt_current_level',
        label: 'How would you describe your current fitness level?',
        type: 'dropdown',
        options: [
          { key: 'beginner', text: 'Beginner — just starting out' },
          { key: 'intermediate', text: 'Intermediate — train occasionally' },
          { key: 'advanced', text: 'Advanced — train regularly' },
          { key: 'athlete', text: 'Athlete — competitive or high-performance' },
        ],
        required: true,
      },
      {
        id: 'pt_availability',
        label: 'How many days per week can you commit to training?',
        type: 'dropdown',
        options: [
          { key: '1_2', text: '1–2 days' },
          { key: '3_4', text: '3–4 days' },
          { key: '5_plus', text: '5+ days' },
        ],
        required: true,
      },
      {
        id: 'pt_constraints',
        label:
          'Any injuries, limitations, or health considerations we should know about?',
        type: 'textarea',
        placeholder: 'Optional — share anything relevant to your training.',
        required: false,
      },
      {
        id: 'pt_timeline',
        label: 'What is your timeline for reaching your goal?',
        type: 'dropdown',
        options: TIMELINE_OPTIONS,
        required: true,
      },
    ],
  },
  it_consulting: {
    serviceKey: 'it_consulting',
    questions: [
      {
        id: 'it_challenge',
        label: 'What is the main technology challenge you are facing?',
        type: 'textarea',
        placeholder:
          'e.g. Legacy system migration, security audit, cloud strategy…',
        required: true,
      },
      {
        id: 'it_team_size',
        label: 'What is the size of your organisation / team?',
        type: 'dropdown',
        options: [
          { key: 'solo', text: 'Solo / Freelancer' },
          { key: 'small', text: '2–10 employees' },
          { key: 'medium', text: '11–50 employees' },
          { key: 'large', text: '51–200 employees' },
          { key: 'enterprise', text: '200+ employees' },
        ],
        required: true,
      },
      {
        id: 'it_budget',
        label: 'What is your approximate budget for this project?',
        type: 'dropdown',
        options: BUDGET_OPTIONS,
        required: true,
      },
      {
        id: 'it_timeline',
        label: 'What is your desired timeline?',
        type: 'dropdown',
        options: TIMELINE_OPTIONS,
        required: true,
      },
      {
        id: 'it_constraints',
        label:
          'Are there any regulatory, compliance, or technical constraints?',
        type: 'textarea',
        placeholder:
          'Optional — e.g. HIPAA, GDPR, specific tech stack requirements.',
        required: false,
      },
    ],
  },
  graphic_design: {
    serviceKey: 'graphic_design',
    questions: [
      {
        id: 'gd_project_type',
        label: 'What type of design project do you need?',
        type: 'dropdown',
        options: [
          { key: 'brand_identity', text: 'Brand Identity / Logo' },
          { key: 'marketing', text: 'Marketing Materials' },
          { key: 'social_media', text: 'Social Media Graphics' },
          { key: 'print', text: 'Print Design' },
          { key: 'packaging', text: 'Packaging' },
          { key: 'other', text: 'Other' },
        ],
        required: true,
      },
      {
        id: 'gd_style',
        label: 'How would you describe the style or feel you are going for?',
        type: 'text',
        placeholder:
          'e.g. Modern and minimal, bold and energetic, warm and approachable…',
        required: true,
      },
      {
        id: 'gd_existing_assets',
        label: 'Do you have existing brand assets (colours, fonts, logos)?',
        type: 'dropdown',
        options: [
          { key: 'yes_complete', text: 'Yes — full brand guidelines exist' },
          { key: 'yes_partial', text: 'Yes — but they need updating' },
          { key: 'no', text: 'No — starting from scratch' },
        ],
        required: true,
      },
      {
        id: 'gd_file_upload',
        label:
          'Upload any reference files, inspiration, or existing assets (optional)',
        type: 'file',
        accept: 'image/*,.pdf,.ai,.psd',
        maxSize: 10 * 1024 * 1024,
        required: false,
      },
      {
        id: 'gd_timeline',
        label: 'What is your desired timeline?',
        type: 'dropdown',
        options: TIMELINE_OPTIONS,
        required: true,
      },
    ],
  },
  web_development: {
    serviceKey: 'web_development',
    questions: [
      {
        id: 'wd_project_type',
        label: 'What type of web project are you looking for?',
        type: 'dropdown',
        options: [
          { key: 'marketing_site', text: 'Marketing / Informational Site' },
          { key: 'ecommerce', text: 'E-Commerce Store' },
          { key: 'web_app', text: 'Web Application / SaaS' },
          { key: 'redesign', text: 'Website Redesign' },
          { key: 'landing_page', text: 'Landing Page' },
          { key: 'other', text: 'Other' },
        ],
        required: true,
      },
      {
        id: 'wd_features',
        label: 'What key features or functionality do you need?',
        type: 'textarea',
        placeholder:
          'e.g. User authentication, booking system, payment gateway, CMS…',
        required: true,
      },
      {
        id: 'wd_existing_site',
        label: 'Do you have an existing website?',
        type: 'dropdown',
        options: [
          { key: 'no', text: 'No — this is a new project' },
          { key: 'yes_keep', text: 'Yes — keep and extend it' },
          { key: 'yes_replace', text: 'Yes — replace it entirely' },
        ],
        required: true,
      },
      {
        id: 'wd_file_upload',
        label: 'Upload any wireframes, designs, or reference files (optional)',
        type: 'file',
        accept: 'image/*,.pdf,.fig,.sketch',
        maxSize: 10 * 1024 * 1024,
        required: false,
      },
      {
        id: 'wd_budget',
        label: 'What is your approximate budget?',
        type: 'dropdown',
        options: BUDGET_OPTIONS,
        required: true,
      },
    ],
  },
  resonance_coaching: {
    serviceKey: 'resonance_coaching',
    questions: [
      {
        id: 'rc_focus',
        label:
          'What area of your life or work are you most focused on right now?',
        type: 'text',
        placeholder:
          'e.g. Career clarity, relationships, personal growth, creative direction…',
        required: true,
      },
      {
        id: 'rc_challenge',
        label:
          'What is the biggest challenge or block you are currently experiencing?',
        type: 'textarea',
        placeholder: 'Be as open or as brief as you like.',
        required: true,
      },
      {
        id: 'rc_outcome',
        label: 'What would a successful outcome look like for you?',
        type: 'textarea',
        placeholder: 'Describe the change or result you are hoping to achieve.',
        required: true,
      },
      {
        id: 'rc_experience',
        label:
          'Have you worked with a coach or done personal development work before?',
        type: 'dropdown',
        options: [
          { key: 'yes_extensive', text: 'Yes — extensively' },
          { key: 'yes_some', text: 'Yes — a little' },
          { key: 'no', text: 'No — this is new for me' },
        ],
        required: true,
      },
      {
        id: 'rc_timeline',
        label: 'How soon are you looking to start?',
        type: 'dropdown',
        options: TIMELINE_OPTIONS,
        required: true,
      },
    ],
  },
  help_me_choose: {
    serviceKey: 'help_me_choose',
    questions: [],
  },
  generic: {
    serviceKey: 'generic',
    questions: [
      {
        id: 'g_outcome',
        label: 'What is the primary outcome you are looking for?',
        type: 'text',
        placeholder: 'Describe the result you want to achieve.',
        required: true,
      },
      {
        id: 'g_timeline',
        label: 'What is your desired timeline?',
        type: 'dropdown',
        options: TIMELINE_OPTIONS,
        required: true,
      },
      {
        id: 'g_budget',
        label: 'What is your approximate budget?',
        type: 'dropdown',
        options: BUDGET_OPTIONS,
        required: true,
      },
      {
        id: 'g_decision_maker',
        label: 'Who is the primary decision maker for this project?',
        type: 'text',
        placeholder: 'e.g. Myself, My business partner, The leadership team…',
        required: true,
      },
      {
        id: 'g_constraints',
        label: 'Are there any constraints or risks we should be aware of?',
        type: 'textarea',
        placeholder: 'Optional — share anything that might affect the project.',
        required: false,
      },
    ],
  },
};

/** Returns the question set to show for a given set of selected services */
export function getQuestionSet(services: ServiceKey[]): QuestionSet {
  const realServices = services.filter((s) => s !== 'help_me_choose');

  if (realServices.length === 1) {
    return QUESTION_SETS[realServices[0]];
  }

  return QUESTION_SETS.generic;
}

export const TIDYCAL_BASE_URL = 'https://tidycal.com/terencewaters';

export const TIDYCAL_LINKS: Record<string, string> = {
  '20': `${TIDYCAL_BASE_URL}/20-minute-consultation-client-services`,
  '30': `${TIDYCAL_BASE_URL}/30-minute-consultation-client-services`,
  '45': `${TIDYCAL_BASE_URL}/45-minute-consultation-client-services`,
};

export const LOCAL_STORAGE_KEY = 'fluxline_consultation_draft';
export const LOCAL_STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
