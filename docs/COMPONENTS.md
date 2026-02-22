# Component Usage Guide

This guide shows how to use the newly added components from tw-me-react-fluent-ui.

## Typography Component

The Typography component applies theme typography styles automatically:

```tsx
import { Typography } from '@/components/Typography';

function MyComponent() {
  return (
    <>
      <Typography variant='h1'>Main Heading</Typography>
      <Typography variant='p'>Body paragraph text</Typography>
      <Typography variant='h2' color='#ff0000'>
        Custom colored heading
      </Typography>
      <Typography variant='code'>const example = true;</Typography>
    </>
  );
}
```

### Available Variants

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `p` - Paragraph
- `span` - Inline text
- `label` - Form labels
- `caption` - Small captions
- `code` - Inline code
- `pre` - Preformatted code blocks
- `quote`, `blockquote` - Quotations

### Custom Styling

All typography props accept custom overrides:

```tsx
<Typography
  variant='h3'
  fontSize='2rem'
  fontWeight={700}
  textAlign='center'
  marginBottom='2rem'
>
  Custom Styled Heading
</Typography>
```

## FluentIcon Component

The FluentIcon component renders icons from Fluent UI v9 or custom SVGs:

```tsx
import { FluentIcon } from '@/components/FluentIcon';
import { HomeRegular, PersonRegular } from '@fluentui/react-icons';

function MyComponent() {
  return (
    <>
      {/* Fluent UI v9 icon */}
      <FluentIcon iconName={HomeRegular} size='medium' variant='primary' />

      {/* Custom size and color */}
      <FluentIcon iconName={PersonRegular} size='large' color='#ff0000' />

      {/* With semantic variant */}
      <FluentIcon iconName={HomeRegular} size='small' variant='success' />
    </>
  );
}
```

### Icon Sizes

- `xSmall` - 12px
- `small` - 16px
- `medium` - 24px (default)
- `large` - 32px
- `xLarge` - 48px

### Variants

- `primary` - Brand primary color
- `secondary` - Brand secondary color
- `success` - Green
- `warning` - Yellow
- `error` - Red
- `info` - Blue

## SocialIcons Component

Displays social media links with hover effects and tooltips:

```tsx
import { SocialIcons } from '@/components/SocialIcons';

function Footer() {
  return (
    <footer>
      <SocialIcons />
    </footer>
  );
}
```

### With Custom Icons

```tsx
import { PersonRegular, MailRegular } from '@fluentui/react-icons';

const customLinks = [
  {
    iconName: PersonRegular,
    url: 'https://example.com/profile',
    tooltip: 'Profile',
    isTagline: true,
  },
  {
    iconName: MailRegular,
    url: 'mailto:hello@example.com',
    tooltip: 'Email',
    isTagline: true,
  },
];

<SocialIcons icons={customLinks} isAuthorTagline={true} />;
```

## Layout Hooks

### useHeaderHeight

Tracks the header height dynamically for proper spacing:

```tsx
'use client';

import { useHeaderHeight } from '@/theme';

export function MyComponent() {
  const headerHeight = useHeaderHeight();

  return (
    <main style={{ paddingTop: headerHeight }}>
      Content positioned below fixed header
    </main>
  );
}
```

### useFooterHeight

Tracks the footer height for layouts where footer affects positioning:

```tsx
'use client';

import { useFooterHeight } from '@/theme';

export function HomePage() {
  const footerHeight = useFooterHeight();

  return (
    <div style={{ marginBottom: footerHeight }}>
      Content with space for fixed footer
    </div>
  );
}
```

## Installing Fluent UI Icons

To use Fluent UI v9 icons, install the package:

```bash
yarn add @fluentui/react-icons
```

Then import icons as needed:

```tsx
import {
  HomeRegular,
  HomeFilled,
  PersonRegular,
  MailRegular,
  // ... etc
} from '@fluentui/react-icons';
```

## Adding Custom SVG Icons

1. Create SVG components in `src/assets/svgs/`:

```tsx
// src/assets/svgs/FacebookLogo.tsx
export function FacebookLogo({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox='0 0 24 24' className={className} style={style}>
      {/* Your SVG paths here */}
    </svg>
  );
}
```

2. Use with FluentIcon or SocialIcons:

```tsx
import { FacebookLogo } from '@/assets/svgs/FacebookLogo';

<FluentIcon iconName={FacebookLogo} size='medium' />;
```

## Theme Integration

All components automatically use the current theme from `useAppTheme()`:

- Typography applies theme font styles
- FluentIcon uses theme color tokens
- SocialIcons applies theme spacing and colors
- Components respond to theme mode changes (light/dark/high-contrast/etc.)

No additional configuration needed!
