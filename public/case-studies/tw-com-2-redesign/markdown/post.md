---
title: 'From React to Next.js: Building a Modern Personal Platform with AI-Assisted Development'
date: '2026-02-01'
excerpt: 'A deep dive into migrating TerenceWaters.com from React SPA to Next.js App Router—exploring architecture decisions, AI collaboration with GitHub Copilot, and shipping production-quality code in two weeks.'
author: 'Terence Waters'
publishedDate: '2026-02-01'
category: 'Technical Case Study'
tags:
  - 'Migration'
  - 'Next.js'
  - 'Azure'
  - 'AI Development'
  - 'GitHub Copilot'
  - 'Architecture'
  - 'Performance'
imageUrl: '/case-studies/tw-com-2-redesign/images/TW-com-2-homepage.png'
imageAlt: 'TerenceWaters.com Next.js redesign architecture and implementation'
featured: true
seoTitle: 'React to Next.js Migration Case Study | AI-Assisted Development'
seoDescription: 'Technical deep dive into migrating a React SPA to Next.js App Router using GitHub Copilot. Learn architecture patterns, performance optimizations, and AI collaboration strategies.'
gallery:
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-homepage.png'
    alt: 'Next.js homepage in dark mode'
    caption: 'Final Next.js implementation with enhanced performance'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-initial-homepage.png'
    alt: 'React version homepage'
    caption: 'Original React SPA implementation'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-AboutMe.png'
    alt: 'Next.js About page in dark mode'
    caption: 'Redesigned About page with static generation'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-AboutMeLight.png'
    alt: 'Next.js About page in light mode'
    caption: 'Light mode with accessible color contrast'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-AboutMe.png'
    alt: 'React version About page'
    caption: 'React SPA About page with Fluent UI components'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-Blog.png'
    alt: 'Next.js blog listing in dark mode'
    caption: 'Blog with advanced filtering and search capabilities'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-BlogLight.png'
    alt: 'Next.js blog listing in light mode'
    caption: 'Blog listing optimized for readability'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-HiFiBlogDesktop.jpeg'
    alt: 'Hi-fi mockup of blog listing page'
    caption: 'High-fidelity blog design with content grid layout'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-HiFiBlogDarkMobile.jpeg'
    alt: 'Hi-fi mobile blog design in dark mode'
    caption: 'Dark mode blog experience on mobile devices'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-Connect.png'
    alt: 'Contact page in dark mode'
    caption: 'Contact form with reCAPTCHA and server-side validation'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-ConnectLight.png'
    alt: 'Contact page in light mode'
    caption: 'Contact form with validation and accessibility features'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-HiFiContactDesktopDark.jpeg'
    alt: 'Hi-fi contact page mockup'
    caption: 'Contact experience with Fluent UI design tokens'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-ContentHubLight.png'
    alt: 'Content Hub page in light mode'
    caption: 'Unified Content Hub aggregating all content types'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-SettingsPanelLight.png'
    alt: 'Desktop settings panel'
    caption: 'Settings panel with theme and accessibility controls'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-SettingsPanelMobile.png'
    alt: 'Mobile settings panel'
    caption: 'Mobile-optimized settings with gesture support'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-2-LoFiMobileMenu.jpeg'
    alt: 'Refined lo-fi mobile menu design'
    caption: 'Refined mobile menu structure and interactions'
  - url: '/case-studies/tw-com-2-redesign/images/TW-com-HiFiSettingsMobileDark.jpeg'
    alt: 'Settings panel hi-fi mockup'
    caption: 'Theme switcher with 8 accessible theme variants'
---

# From React to Next.js: Building a Modern Personal Platform with AI-Assisted Development

## Executive Summary

This case study examines the complete architectural migration of TerenceWaters.com from a React SPA to a Next.js App Router static site. The project demonstrates modern web development practices, AI-assisted coding with GitHub Copilot, and infrastructure-as-code principles—all executed in a **two-week sprint** that would typically require 4-6 weeks of traditional development.

**Key Outcomes:**

- 65% improvement in First Contentful Paint (1.2s vs 3.5s)
- 100% static generation for optimal SEO
- 8 accessible theme variants (including colorblind modes)
- Zero production incidents across three environments
- 60% reduction in development time through AI assistance

## The Business Context

### The Problem

My previous website, while functional, had become a technical liability:

1. **Performance Issues**: Client-side rendering meant 3.5s+ initial load times
2. **SEO Limitations**: Search engines struggled with dynamically loaded content
3. **Content Management**: No structured approach to blog posts, portfolio pieces, or case studies
4. **Scalability Concerns**: Monolithic component structure made feature additions risky
5. **Development Friction**: Single environment meant development and production collisions

### The Opportunity

I needed a platform that could:

- Showcase technical depth to potential clients and collaborators
- Serve as a content hub for blog posts, portfolio work, case studies, and multimedia
- Demonstrate modern web development practices and AI collaboration
- Scale effortlessly as content volume grew
- Provide a testing ground for emerging technologies

### Success Criteria

- **Performance**: First Contentful Paint under 1.5s
- **Development Speed**: Operational within two weeks
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Infrastructure**: Multi-environment setup (DEV/TEST/PROD)
- **Content Architecture**: Support blog, portfolio, case studies, videos, and podcasts
- **Maintainability**: Clear component patterns and documentation

## The Technical Challenge

### Migration Constraints

**What Had to Stay:**

- Fluent UI component library and theming
- Azure Static Web Apps hosting
- Existing content and visual design direction
- Social media integrations and external links

**What Had to Change:**

- Client-side rendering → Static Site Generation
- Monolithic structure → Layout-driven architecture
- Manual deployment → CI/CD with GitHub Actions
- Single environment → Multi-environment pipeline
- Ad-hoc content → File-based CMS with structured metadata

### Technical Debt Assessment

The React SPA had accumulated several architectural issues:

```typescript
// Problem: Component coupling
function HomePage() {
  // Navigation, hero, content, footer all in one file
  // 800+ lines of tightly coupled JSX
}

// Problem: Theme state scattered across components
const [theme, setTheme] = useState('light');
// Each component managing its own theme state

// Problem: No content abstraction
const blogPosts = [
  { title: "...", content: "..." } // Hardcoded in component
];

// Problem: API calls on mount
useEffect(() => {
  fetch('/api/data').then(...) // Every page load
}, []);
```

These patterns had to be systematically eliminated.

## The Architecture Solution

### Design System: Layout-Driven Composition

Rather than building pages as monolithic components, I architected a **layout system** that enforces separation of concerns:

```typescript
// src/layouts/
RootLayout      → Global navigation, footer, providers
PageLayout      → Standard page wrapper with max-width
ContentLayout   → Long-form content with typography
ArticleLayout   → Blog posts with metadata header
PortfolioLayout → Portfolio entries with gallery support
CaseStudyLayout → In-depth case studies with TOC
```

**Benefits:**

- Pages become content composition, not layout logic
- Consistent spacing and typography enforcement
- Single source of truth for navigation and footer
- Easy to add new page types by extending layouts

### Content Management: File-Based CMS

Implemented a file-based content system using Markdown/MDX with frontmatter:

```
public/
  blog/
    {slug}/
      markdown/
        post.md
      images/
        *.png
  portfolio/
    {slug}/
      markdown/
        post.md
      images/
        *.png
  case-studies/
    {slug}/
      markdown/
        post.md
      images/
        *.png
```

**Content Loading Pattern:**

```typescript
// src/lib/content.ts
export async function getContentBySlug(
  type: 'blog' | 'portfolio' | 'case-studies',
  slug: string
) {
  const markdownPath = path.join(
    process.cwd(),
    'public',
    type,
    slug,
    'markdown',
    'post.md'
  );

  const fileContents = fs.readFileSync(markdownPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data,
    content,
    type,
  };
}

// Static generation at build time
export async function generateStaticParams() {
  const posts = await getAllContent('blog');
  return posts.map((post) => ({ slug: post.slug }));
}
```

**Advantages:**

- No database overhead or management
- Content versioned alongside code in Git
- Markdown-friendly for writing flow
- MDX support for embedded React components
- Build-time rendering for maximum performance

### Theming: Extended Fluent UI System

Built an **8-variant theme system** for comprehensive accessibility:

```typescript
// src/theme/fluentTheme.ts
export const themeVariants = {
  light: createLightTheme(brandTokens),
  dark: createDarkTheme(brandTokens),
  'high-contrast': createHighContrastTheme(),
  protanopia: createProtanopiaTheme(), // Red-blind
  deuteranopia: createDeuteranopiaTheme(), // Green-blind
  tritanopia: createTritanopiaTheme(), // Blue-blind
  grayscale: createGrayscaleTheme(),
  'grayscale-dark': createGrayscaleDarkTheme(),
};

// Custom context for theme management
export function useAppTheme() {
  const { theme, setTheme } = useContext(ThemeContext);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme, availableThemes: Object.keys(themeVariants) };
}
```

**Extended Theme System:**

Beyond color tokens, I extended Fluent UI with:

- **Spacing system**: Consistent rhythm based on `1rem` units
- **Animation presets**: Easing curves and duration values
- **Border radius system**: Responsive with `clamp()` queries
- **Z-index layering**: Predictable stacking contexts
- **Shadow system**: Depth cues for elevation
- **Typography scale**: Comprehensive font system with Roboto Flex and Proxima Nova

### Multi-Environment Architecture

Implemented **DEV, TEST, and PROD** environments with token-based access control:

```typescript
// src/lib/environment.ts
export function getEnvironment(): Environment {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
  return env === 'dev' || env === 'test' || env === 'prod' ? env : 'prod';
}

export function requiresAuthentication(): boolean {
  const env = getEnvironment();
  return env === 'dev' || env === 'test';
}

// src/components/AccessGate/AccessGate.tsx
export function AccessGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, validateToken } = useAccessControl();

  if (!requiresAuthentication()) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <TokenPrompt onSubmit={validateToken} />;
  }

  return <>{children}</>;
}
```

**Environment Variables Strategy:**

```yaml
# .github/workflows/azure-static-web-apps-dev.yml
env:
  NEXT_PUBLIC_ENVIRONMENT: dev
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: ${{ secrets.RECAPTCHA_SITE_KEY }}
```

**Key Insight:** `NEXT_PUBLIC_*` variables are build-time only in Next.js static exports. They get embedded during `next build` and cannot be changed at runtime. Backend secrets live in Azure Static Web Apps Application Settings.

### Azure Functions: Serverless Backend

Implemented three Azure Functions for backend logic:

**1. Token Validation** (`/api/auth/validate-token`)

```javascript
module.exports = async function (context, req) {
  const { token } = req.body;
  const validToken = process.env.ACCESS_TOKEN;

  if (token === validToken) {
    return { status: 200, body: { valid: true } };
  }

  return { status: 401, body: { valid: false } };
};
```

**2. Contact Form** (`/api/contact`)

```javascript
const https = require('https');

module.exports = async function (context, req) {
  // 1. Verify reCAPTCHA token
  const recaptchaValid = await verifyRecaptcha(req.body.recaptchaToken);
  if (!recaptchaValid) {
    return { status: 400, body: { error: 'Invalid reCAPTCHA' } };
  }

  // 2. Send email via SMTP2GO
  const emailSent = await sendEmail({
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
    subject: `Contact from ${req.body.name}`,
    body: req.body.message,
  });

  return { status: 200, body: { success: true } };
};
```

**3. YouTube API Proxy** (`/api/youtube`)

```javascript
module.exports = async function (context, req) {
  const { type } = req.query; // 'uploads' or 'playlists'
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/${type}?key=${process.env.YOUTUBE_API_KEY}`
  );

  return { status: 200, body: await response.json() };
};
```

### API Routing Pattern

**Critical Learning:** Azure Static Web Apps automatically prefixes Azure Functions routes with `/api/`. This caused a bug where my code was generating `/api/api/contact` URLs.

**Solution:**

```typescript
// src/lib/environment.ts
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  // Local development uses standalone function app
  if (window.location.hostname === 'localhost') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7071';
  }

  // Azure SWA handles /api prefix automatically
  return '';
}

// Usage:
const apiUrl = getApiBaseUrl();
fetch(`${apiUrl}/api/contact`, { ... }); // → /api/contact on Azure
```

## The AI Collaboration Strategy

### GitHub Copilot as Development Partner

Rather than viewing Copilot as a code completion tool, I treated it as a **collaborative coding partner** with specific strengths:

**Where Copilot Excelled:**

1. **Boilerplate Generation**
   - Component scaffolds with TypeScript interfaces
   - Form validation logic
   - API endpoint structure
   - Test setup and mock data

2. **Pattern Recognition**
   - Suggesting Next.js conventions (generateStaticParams, generateMetadata)
   - Proposing accessibility patterns (ARIA attributes, keyboard navigation)
   - Recommending error handling approaches
   - Identifying refactoring opportunities

3. **Problem Solving**
   - Debugging the `/api/api/` routing issue
   - Fixing React hook composition in form components
   - Implementing graceful reCAPTCHA degradation
   - Resolving build-time vs runtime environment variable confusion

4. **Documentation**
   - Generating inline comments explaining complex logic
   - Creating TypeScript type definitions with JSDoc
   - Suggesting descriptive variable names
   - Writing commit messages

**Where Human Oversight Was Critical:**

1. **Architectural Decisions**
   - Layout system design
   - Content file structure
   - Multi-environment strategy
   - Theme system architecture

2. **Business Logic**
   - Access control implementation
   - Content filtering and sorting
   - Form validation rules
   - Error messaging and UX flows

3. **Visual Design**
   - Color palette selection
   - Typography hierarchy
   - Spacing and rhythm
   - Animation timing

4. **Security**
   - Token validation logic
   - Environment variable separation
   - API rate limiting considerations
   - CORS configuration

### Real-World AI Collaboration Examples

**Example 1: Form Validation Race Condition**

**Problem:** Form validation was tracked in `errors` state updated via `useEffect`, which could be stale at submit time.

**My Observation to Copilot:**

```typescript
// This validation can be stale - useEffect runs after render
useEffect(() => {
  setErrors(validateForm(form));
}, [form]);
```

**Copilot's Suggestion:**

```typescript
// Synchronous validation using useMemo
const errors = useMemo(() => validateForm(form), [form]);

// Re-validate on submit to ensure freshness
const handleSubmit = async (e) => {
  const currentErrors = validateForm(form);
  if (Object.keys(currentErrors).length > 0) {
    return; // Don't submit with errors
  }
  // ... submit logic
};
```

**Result:** Eliminated race condition, improved form reliability.

---

**Example 2: Event Handler Composition**

**Problem:** Passing `onBlur` into `<Textarea />` overrode the component's internal `onBlur` handler due to `{...rest}` spread.

**My Diagnostic:**

```typescript
// Problem: {...rest} spread overrides internal onBlur
<textarea onBlur={internalOnBlur} {...rest} />
```

**Copilot's Fix:**

```typescript
export function Textarea({ onBlur, onFocus, ...rest }: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e); // Call external handler
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  return <textarea onBlur={handleBlur} onFocus={handleFocus} {...rest} />;
}
```

**Result:** Composed handlers preserve both internal state management and external callbacks.

---

**Example 3: reCAPTCHA Graceful Degradation**

**Problem:** `GoogleReCaptchaProvider` throws "Context has not yet been implemented" error when site key isn't configured.

**My Context:**

```typescript
// Can't wrap useReCaptcha() in try/catch - React hooks don't work that way
// Need a custom context wrapper
```

**Copilot's Architecture:**

```typescript
// Custom context that can return mock when not configured
const ReCaptchaContext = createContext<{
  executeRecaptcha?: (action?: string) => Promise<string>;
}>({});

export function ReCaptchaProvider({ children }: { children: ReactNode }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // No site key → mock context
  if (!siteKey) {
    return (
      <ReCaptchaContext.Provider value={{}}>
        {children}
      </ReCaptchaContext.Provider>
    );
  }

  // Site key present → use Google provider
  return (
    <GoogleReCaptchaProvider siteKey={siteKey}>
      <ReCaptchaBridge>{children}</ReCaptchaBridge>
    </GoogleReCaptchaProvider>
  );
}

// Bridge component to connect Google context to custom context
function ReCaptchaBridge({ children }: { children: ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  return (
    <ReCaptchaContext.Provider value={{ executeRecaptcha }}>
      {children}
    </ReCaptchaContext.Provider>
  );
}

export function useReCaptcha() {
  return useContext(ReCaptchaContext);
}
```

**Result:** Contact form works with or without reCAPTCHA configuration, no errors thrown.

### GitHub Workflow Integration

**Branch Strategy:**

- `master` → Production deployments
- `test` → Staging/client review
- `develop` → Active development with token gate
- `feature/*` → Individual features with PR workflow

**Pull Request Workflow:**

1. **Feature Development**

   ```bash
   git checkout -b feature/content-hub
   # ... develop with Copilot assistance
   git add .
   git commit -m "Build unified content hub with filtering"
   git push origin feature/content-hub
   ```

2. **PR Creation**
   - GitHub Copilot suggests PR title and description based on commits
   - Automatic CI checks (TypeScript, ESLint, build)
   - Preview deployment to DEV environment

3. **Code Review**
   - Copilot highlights potential issues in PR description
   - Manual review of business logic and UX
   - Approval gates before merge

4. **Deployment**
   - Merge to `develop` → auto-deploy to DEV
   - Merge to `test` → auto-deploy to TEST
   - Merge to `master` → auto-deploy to PROD

**Version Control as Documentation:**

Every architectural decision captured in commit history:

```
feat: implement layout-driven architecture
feat: add file-based content system with MDX support
fix: resolve /api/api/ double prefix in API routes
feat: add 8-variant theme system with colorblind modes
fix: compose Input/Textarea handlers to prevent override
feat: implement graceful reCAPTCHA degradation
```

## The Two-Week Sprint

### Week 1: Foundation (Days 1-7)

**Days 1-2: Project Scaffolding**

- Next.js project initialization
- TypeScript configuration
- Tailwind + Fluent UI integration
- Layout system architecture
- Navigation component

**Days 3-4: Content Architecture**

- File-based CMS design
- Content loading utilities
- Blog page implementation
- Static generation setup
- MDX rendering with next-mdx-remote

**Days 5-7: Core Pages & Theming**

- About page with profile section
- Portfolio and case study pages
- Theme system with 8 variants
- Settings panel component
- Persistent theme storage

### Week 2: Integration & Polish (Days 8-14)

**Days 8-9: Backend Integration**

- Azure Functions setup (contact, YouTube, auth)
- Contact form with validation
- reCAPTCHA integration
- SMTP2GO email delivery
- Error handling and user feedback

**Days 10-11: Content & API Integration**

- YouTube API integration for videos
- GitHub API integration for repositories
- Content Hub aggregation page
- Image optimization and lazy loading

**Days 12-13: Accessibility & Testing**

- Theme variant testing (colorblind modes)
- Keyboard navigation verification
- Screen reader testing
- Mobile responsiveness
- Cross-browser testing

**Day 14: Production Launch**

- DNS configuration
- Production deployment
- Analytics setup
- Final smoke testing
- Documentation

### Development Velocity Metrics

**With AI Assistance (Actual):**

- Total development time: **14 days**
- Average component time: **45 minutes**
- Bug resolution time: **~20 minutes**
- Refactoring time: **~15% of development time**

**Estimated Without AI:**

- Total development time: **28-42 days** (4-6 weeks)
- Average component time: **90-120 minutes**
- Bug resolution time: **~60 minutes**
- Refactoring time: **~30% of development time**

**Time Savings Breakdown:**

- Boilerplate code: **~60% faster**
- Bug identification: **~40% faster**
- Pattern research: **~70% faster**
- Documentation: **~50% faster**

**Overall productivity increase: ~2-3x**

## Performance Results

### Before (React SPA)

```
First Contentful Paint: 3.5s
Largest Contentful Paint: 4.2s
Time to Interactive: 4.8s
Cumulative Layout Shift: 0.18
Total Blocking Time: 890ms

Lighthouse Score:
Performance: 67
Accessibility: 85
Best Practices: 79
SEO: 71
```

### After (Next.js SSG)

```
First Contentful Paint: 1.2s (66% improvement)
Largest Contentful Paint: 1.8s (57% improvement)
Time to Interactive: 2.1s (56% improvement)
Cumulative Layout Shift: 0.02 (89% improvement)
Total Blocking Time: 120ms (87% improvement)

Lighthouse Score:
Performance: 96 (+29)
Accessibility: 98 (+13)
Best Practices: 100 (+21)
SEO: 100 (+29)
```

### Performance Optimizations Implemented

1. **Static Site Generation**
   - All pages pre-rendered at build time
   - Zero client-side data fetching on initial load
   - HTML delivered directly from CDN

2. **Image Optimization**
   - Next.js `<Image />` component with automatic WebP conversion
   - Lazy loading for below-the-fold images
   - Responsive images with srcset

3. **Code Splitting**
   - Automatic route-based code splitting
   - Dynamic imports for heavy components
   - Chunk optimization via Next.js bundler

4. **Animation Performance**
   - Framer Motion with GPU-accelerated transforms
   - `will-change` hints for animated elements
   - Respect `prefers-reduced-motion` for accessibility

5. **Asset Optimization**
   - Font subsetting for Roboto Flex and Proxima Nova
   - SVG sprite sheets for icons
   - Build-time CSS extraction and minification

## Accessibility Achievements

### WCAG 2.1 AA Compliance

✅ **Perceivable**

- Color contrast ratios exceed 4.5:1 (all themes)
- Text content readable without color alone
- All images have alt text
- Video content will include captions

✅ **Operable**

- Full keyboard navigation
- Skip navigation links
- No keyboard traps
- Sufficient touch target sizes (44x44px minimum)

✅ **Understandable**

- Clear page titles and headings
- Consistent navigation
- Error identification and suggestions
- Form labels and instructions

✅ **Robust**

- Semantic HTML throughout
- ARIA attributes where needed
- Screen reader tested

### Colorblind Accessibility

Implemented **5 colorblind-accessible theme variants**:

1. **Protanopia** (Red-Blind)
   - Uses blue/yellow color palette
   - Avoids red/green differentiation

2. **Deuteranopia** (Green-Blind)
   - Uses blue/yellow color palette
   - Most common form of colorblindness

3. **Tritanopia** (Blue-Blind)
   - Uses red/green color palette
   - Rare but supported

4. **Grayscale**
   - Removes all color information
   - Tests contrast-only readability

5. **Grayscale Dark**
   - Grayscale for dark mode users
   - Inverted luminance range

**Testing Process:**

- Automated contrast checking with axe DevTools
- Manual testing with colorblind simulation filters
- User testing with colorblind colleagues
- Feedback incorporation into design tokens

## Technical Lessons Learned

### 1. Build-Time vs Runtime Variables

**The Problem:**
In Next.js static exports (`output: 'export'`), `NEXT_PUBLIC_*` environment variables are embedded during `next build`. They cannot be changed at runtime.

**The Implication:**

- Build-time variables: Set in GitHub Actions workflows
- Runtime variables: Set in Azure Static Web Apps Application Settings (for Azure Functions only)
- Frontend cannot access runtime secrets — they must live in backend functions

**The Pattern:**

```typescript
// ❌ Wrong: Trying to use runtime variable in frontend
const apiKey = process.env.API_KEY; // undefined in static export

// ✅ Right: Backend function reads runtime variable
// api/contact/index.js
const apiKey = process.env.SMTP2GO_API_KEY; // Available at runtime

// ✅ Right: Build-time variable in frontend
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT; // 'dev', 'test', or 'prod'
```

### 2. Azure Static Web Apps Routing

**The Problem:**
Azure SWA automatically prefixes Azure Functions routes with `/api/`. My code was adding `/api` again, resulting in `/api/api/contact`.

**The Solution:**

```typescript
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  // Local dev: point to standalone function app
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:7071';
  }

  // Azure: return empty string, SWA adds /api automatically
  return '';
}

// Usage:
fetch(`${getApiBaseUrl()}/api/contact`); // → /api/contact on Azure
```

### 3. Event Handler Composition in React

**The Problem:**
Using `{...rest}` spread after defining handlers causes the spread to override them.

**The Pattern:**

```typescript
// ❌ Wrong: props.onBlur overrides handleBlur
<textarea onBlur={handleBlur} {...props} />

// ✅ Right: Extract handlers before spread
const { onBlur, onFocus, ...rest } = props;

const composedBlur = (e) => {
  internalHandler(e);
  onBlur?.(e); // Call external handler if provided
};

<textarea onBlur={composedBlur} {...rest} />
```

### 4. Context Wrappers for Graceful Degradation

**The Problem:**
Third-party hooks (like `useGoogleReCaptcha`) throw errors when their provider isn't configured. You can't wrap hooks in try/catch.

**The Solution:**
Create a custom context wrapper that provides a mock when the provider isn't configured:

```typescript
export function ReCaptchaProvider({ children }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    // Return mock context
    return <ReCaptchaContext.Provider value={{}}>{children}</ReCaptchaContext.Provider>;
  }

  // Return real provider
  return (
    <GoogleReCaptchaProvider siteKey={siteKey}>
      <ReCaptchaBridge>{children}</ReCaptchaBridge>
    </GoogleReCaptchaProvider>
  );
}
```

### 5. Synchronous Derived State

**The Problem:**
Using `useEffect` to update derived state means it's always one render behind.

**The Solution:**
Use `useMemo` for synchronous derivation:

```typescript
// ❌ Wrong: Validation lags behind form state
const [errors, setErrors] = useState({});
useEffect(() => {
  setErrors(validateForm(form));
}, [form]);

// ✅ Right: Validation always current
const errors = useMemo(() => validateForm(form), [form]);
```

## Production Deployment Strategy

### Multi-Environment Pipeline

```
Commit → Branch → PR → Merge
   ↓        ↓      ↓      ↓
develop → DEV (token-gated)
   ↓
test → TEST (token-gated)
   ↓
master → PROD (public)
```

### GitHub Actions Configuration

Each environment has its own workflow file:

```yaml
# .github/workflows/azure-static-web-apps-dev.yml
name: DEV-Azure Static Web Apps CI/CD

on:
  push:
    branches: [develop]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_DEV }}
          app_location: '/'
          api_location: 'api'
          output_location: 'out'
        env:
          NEXT_PUBLIC_ENVIRONMENT: dev
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY: ${{ secrets.RECAPTCHA_SITE_KEY }}
```

### Zero-Downtime Deployments

Azure Static Web Apps provides:

- **Blue-green deployments**: New version tested before cutover
- **Instant rollback**: Revert to previous version in seconds via Azure Portal
- **CDN invalidation**: Automatic cache clearing on deployment
- **PR previews**: Every PR gets a unique deployment URL for testing

### Monitoring & Observability

**Application Insights:**

- Request telemetry
- Dependency tracking (email API, YouTube API)
- Exception logging
- Performance metrics

**Custom Logging:**

```typescript
// Azure Function logging
context.log('Contact form submission', {
  timestamp: new Date().toISOString(),
  name: req.body.name,
  email: req.body.email,
});
```

**Error Handling Pattern:**

```typescript
try {
  await sendEmail(formData);
  return { success: true };
} catch (error) {
  context.log.error('Email send failed', error);
  // Don't expose internal errors to client
  return { error: 'Failed to send message. Please try again.' };
}
```

## Future Enhancements

### Phase 2: Content Discovery

- **Full-Text Search**: Implement Algolia or self-hosted search
- **Related Content**: Suggest similar posts based on tags and categories
- **Reading Progress**: Track user position in long articles
- **Bookmark System**: Let users save articles for later

### Phase 3: Multimedia Expansion

- **Podcast Hosting**: Audio player with chapters and transcripts
- **Video Hosting**: Self-hosted videos with adaptive bitrate streaming
- **Interactive Demos**: Embed live code examples
- **Webinar Platform**: Live streaming and recording

### Phase 4: Community Features

- **Newsletter**: Email list management and automated campaigns
- **Comments**: Moderated discussion on blog posts
- **User Profiles**: Let visitors create accounts and save preferences
- **Content Contributions**: Accept guest posts via PR workflow

### Phase 5: Analytics & Personalization

- **Custom Analytics**: Privacy-respecting visitor insights
- **Content Recommendations**: ML-based suggestion engine
- **A/B Testing**: Experiment with layouts and copy
- **Conversion Tracking**: Monitor consultation bookings and downloads

## Conclusion

This project demonstrates that **modern web development can be both rapid and rigorous** when you combine:

1. **Solid Architecture**: Layout-driven design and clear separation of concerns
2. **AI Collaboration**: Leveraging GitHub Copilot for acceleration, not replacement
3. **Modern Tooling**: Next.js, TypeScript, and automated deployment pipelines
4. **Accessibility First**: Building inclusivity into the foundation, not bolting it on
5. **Performance Obsession**: Measuring metrics and optimizing aggressively

The **two-week timeline** wasn't achieved by cutting corners—it was achieved by:

- **Clear constraints**: Knowing exactly what needed to be built
- **Reusable patterns**: Layout system eliminated redundant code
- **AI acceleration**: Copilot handled boilerplate while I focused on architecture
- **Disciplined workflow**: GitHub PRs and CI/CD caught issues early

### Key Takeaways for Technical Leaders

1. **AI amplifies expertise, doesn't replace it**: GitHub Copilot made me 2-3x more productive, but architectural decisions still required human judgment.

2. **Build-time vs runtime variables matter**: In static exports, understand what gets embedded vs what's available at runtime.

3. **Multi-environment pipelines reduce risk**: Token-gated DEV/TEST environments let you iterate without production impact.

4. **Accessibility is a feature, not a checkbox**: Supporting colorblind users isn't hard—it just requires intentionality.

5. **Git history is documentation**: Every commit tells a story. Make it readable.

### Measuring Success

**Performance:** ✅ 1.2s First Contentful Paint (target: &lt;1.5s)  
**Timeline:** ✅ 14 days (target: &lt;14 days)  
**Accessibility:** ✅ WCAG 2.1 AA + colorblind modes (target: AA minimum)  
**Infrastructure:** ✅ DEV/TEST/PROD with zero incidents  
**Content:** ✅ Blog, portfolio, case studies, videos, GitHub  
**Maintainability:** ✅ Clear component patterns and comprehensive documentation

---

**Live Site**: [terencewaters.com](https://terencewaters.com)  
**Repository**: [github.com/AplUSAndmINUS/tw-com-nextjs](https://github.com/AplUSAndmINUS/tw-com-nextjs)  
**Contact**: [terence@terencewaters.com](mailto:terence@terencewaters.com)

---

_This case study was written collaboratively with GitHub Copilot—the same AI assistant that helped build the site it describes._
