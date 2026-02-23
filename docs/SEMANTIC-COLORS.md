# Semantic Colors Documentation

## Overview

The TW.com semantic color system provides accessible, theme-aware colors for text, links, and interactive elements across all 8 theme modes. This system ensures WCAG AA compliance and optimal readability in every viewing mode.

---

## Design Philosophy

**Inspiration**: "The Resonance Core Framework" book aesthetic  
**Default Mode**: Dark mode  
**Core Values**:

- Clean black/white text hierarchy
- Professional navy accents for interactive elements
- Comprehensive accessibility (colorblind-safe, high-contrast, grayscale)
- WCAG AAA contrast ratios where possible

---

## Theme Modes

The system supports 8 distinct theme modes:

1. **`light`** - Default light mode with deep navy brand colors
2. **`dark`** - Default dark mode (site default) with light blue accents
3. **`high-contrast`** - Pure black/white/bright blue for maximum readability
4. **`protanopia`** - Red-blind optimized (blue-dominant palette)
5. **`deuteranopia`** - Green-blind optimized (blue-dominant palette)
6. **`tritanopia`** - Blue-blind optimized (red-dominant palette)
7. **`grayscale`** - Pure monochrome light mode
8. **`grayscale-dark`** - Pure monochrome dark mode

---

## Color Categories

### Text Colors

Used for body text, headings, captions, and metadata.

```typescript
theme.semanticColors.text.primary; // Main body text
theme.semanticColors.text.heading; // Headings (slightly more prominent)
theme.semanticColors.text.muted; // Captions, metadata, less important text
theme.semanticColors.text.disabled; // Disabled/inactive text
```

**Dark mode values** (site default):

- `primary`: `#e6e6e6` (near white for comfortable reading)
- `heading`: `#f5f5f5` (true white for headings)
- `muted`: `#999999` (gray for secondary info)
- `disabled`: `#666666` (dark gray for disabled)

**Light mode values**:

- `primary`: `#1a1a1a` (near black for comfortable reading)
- `heading`: `#0d0d0d` (true black for headings)
- `muted`: `#666666` (gray for secondary info)
- `disabled`: `#999999` (light gray for disabled)

### Link Colors

Four states for interactive text links with brand navy accent.

```typescript
theme.semanticColors.link.default; // Normal link state
theme.semanticColors.link.hover; // Hover state
theme.semanticColors.link.visited; // Previously visited links
theme.semanticColors.link.active; // Click/active state
```

**Dark mode values** (optimized for readability):

- `default`: `#8eb9e7` (light navy blue)
- `hover`: `#a3caef` (lighter on hover)
- `visited`: `#7aa8df` (slightly different shade)
- `active`: `#b8cceb` (brightest on click)

**Light mode values**:

- `default`: `#1a3667` (deep navy brand color)
- `hover`: `#2654a0` (lighter navy)
- `visited`: `#224a8d` (visited variant)
- `active`: `#122341` (darker on click)

### Background Colors

Surface colors for page layouts, cards, and elevated elements.

```typescript
theme.semanticColors.background.base; // Page background
theme.semanticColors.background.elevated; // Cards, modals, raised surfaces
theme.semanticColors.background.muted; // Subtle backgrounds for less emphasis
```

**Dark mode values**:

- `base`: `#1a1a1a` (page background)
- `elevated`: `#242424` (cards/surfaces)
- `muted`: `#2a2a2a` (subtle areas)

### Border Colors

Used for dividers, outlines, and component boundaries.

```typescript
theme.semanticColors.border.default; // Standard borders/dividers
theme.semanticColors.border.muted; // Subtle borders (low contrast)
theme.semanticColors.border.emphasis; // Emphasized borders (brand color)
```

### Selection Colors

Text selection highlighting (::selection pseudo-element).

```typescript
theme.semanticColors.selection.background; // Selection background color
theme.semanticColors.selection.text; // Selected text color
```

**Dark mode values**:

- `background`: `#3F5FA1` (navy blue selection)
- `text`: `#ffffff` (white text)

### Focus Colors

Focus indicators for keyboard navigation accessibility.

```typescript
theme.semanticColors.focus.ring; // Focus ring/outline
theme.semanticColors.focus.outline; // Alternative focus outline
```

---

## Usage Examples

### Basic Text Component

```tsx
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export const TextBlock = () => {
  const { theme } = useAppTheme();

  return (
    <article style={{ color: theme.semanticColors.text.primary }}>
      <h1 style={{ color: theme.semanticColors.text.heading }}>
        Chapter Title
      </h1>
      <p>
        Body text content here with{' '}
        <a
          href='/link'
          style={{
            color: theme.semanticColors.link.default,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = theme.semanticColors.link.hover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = theme.semanticColors.link.default)
          }
        >
          inline links
        </a>
        .
      </p>
      <span style={{ color: theme.semanticColors.text.muted }}>
        Published on January 15, 2025
      </span>
    </article>
  );
};
```

### Link Component with All States

```tsx
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import Link from 'next/link';
import { useState } from 'react';

export const ThemedLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        color: isHovered
          ? theme.semanticColors.link.hover
          : theme.semanticColors.link.default,
        textDecoration: 'underline',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
};
```

### Card with Background and Border

```tsx
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export const Card = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const { theme } = useAppTheme();

  return (
    <div
      style={{
        backgroundColor: theme.semanticColors.background.elevated,
        border: `1px solid ${theme.semanticColors.border.default}`,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.l,
        color: theme.semanticColors.text.primary,
      }}
    >
      <h3 style={{ color: theme.semanticColors.text.heading }}>{title}</h3>
      <p>{content}</p>
    </div>
  );
};
```

### Focus Ring for Accessibility

```tsx
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export const FocusableButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { theme } = useAppTheme();

  return (
    <button
      style={{
        padding: theme.spacing.m,
        color: theme.semanticColors.text.primary,
        backgroundColor: theme.semanticColors.background.elevated,
        border: `2px solid ${theme.semanticColors.border.default}`,
        borderRadius: theme.borderRadius.s,
        outline: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.semanticColors.focus.ring}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </button>
  );
};
```

### Global CSS Selection Styling

```css
/* In globals.css or component styles */
::selection {
  background-color: var(--semantic-selection-background);
  color: var(--semantic-selection-text);
}

/* You can set these CSS variables from your theme provider */
```

---

## Accessibility Guidelines

### Contrast Ratios

All semantic colors meet WCAG standards:

- **Text Colors**: Minimum 4.5:1 contrast for body text (WCAG AA)
- **Large Text**: Minimum 3:1 contrast for 18pt+ text
- **Link Colors**: 3:1 minimum against backgrounds
- **Interactive Elements**: Clear hover/focus states

### Colorblind Accessibility

**Protanopia/Deuteranopia** (red/green blind):

- Uses blue-dominant palettes
- No red/green distinction required
- Links are blue-based (#005299, #0078D4)

**Tritanopia** (blue blind):

- Uses red-dominant palette
- Links are red-based (#8f1c28, #D13438)
- No blue/yellow distinction

### Grayscale Modes

**Critical**: In grayscale modes, links **must** be underlined since color alone cannot distinguish them:

```tsx
const linkStyle =
  theme.themeMode === 'grayscale' || theme.themeMode === 'grayscale-dark'
    ? { textDecoration: 'underline' }
    : { textDecoration: 'none' };
```

---

## Best Practices

### 1. Always Use Semantic Colors for Text

❌ **Don't hardcode colors:**

```tsx
<p style={{ color: '#666666' }}>Metadata</p>
```

✅ **Use semantic colors:**

```tsx
<p style={{ color: theme.semanticColors.text.muted }}>Metadata</p>
```

### 2. Provide All Link States

❌ **Don't only style default:**

```tsx
<a style={{ color: theme.semanticColors.link.default }}>Link</a>
```

✅ **Style all interactive states:**

```tsx
<a
  style={{
    color: isHovered
      ? theme.semanticColors.link.hover
      : theme.semanticColors.link.default,
  }}
  className={isVisited ? 'visited' : ''}
>
  Link
</a>
```

### 3. Add Focus Indicators

❌ **Don't suppress focus:**

```css
button:focus {
  outline: none;
}
```

✅ **Provide custom focus ring:**

```tsx
<button
  onFocus={(e) =>
    (e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.semanticColors.focus.ring}`)
  }
>
  Button
</button>
```

### 4. Test All Theme Modes

Ensure your components work in all 8 modes:

- Light/dark for general usage
- High-contrast for visual impairments
- Colorblind modes for accessibility
- Grayscale for monochrome displays

### 5. Underline Links in Grayscale

Always add underlines when color distinction is removed:

```tsx
<a
  style={{
    color: theme.semanticColors.link.default,
    textDecoration: ['grayscale', 'grayscale-dark'].includes(theme.themeMode)
      ? 'underline'
      : 'none',
  }}
>
  Link text
</a>
```

---

## Color Reference Table

### Dark Mode (Default)

| Category   | Token                  | Value     | Usage           |
| ---------- | ---------------------- | --------- | --------------- |
| Text       | `text.primary`         | `#e6e6e6` | Body text       |
| Text       | `text.heading`         | `#f5f5f5` | Headings        |
| Text       | `text.muted`           | `#999999` | Captions        |
| Link       | `link.default`         | `#8eb9e7` | Links           |
| Link       | `link.hover`           | `#a3caef` | Hover state     |
| Background | `background.base`      | `#1a1a1a` | Page            |
| Background | `background.elevated`  | `#242424` | Cards           |
| Border     | `border.default`       | `#404040` | Dividers        |
| Selection  | `selection.background` | `#3F5FA1` | Text selection  |
| Focus      | `focus.ring`           | `#8eb9e7` | Focus indicator |

### Light Mode

| Category   | Token                  | Value     | Usage           |
| ---------- | ---------------------- | --------- | --------------- |
| Text       | `text.primary`         | `#1a1a1a` | Body text       |
| Text       | `text.heading`         | `#0d0d0d` | Headings        |
| Text       | `text.muted`           | `#666666` | Captions        |
| Link       | `link.default`         | `#1a3667` | Links           |
| Link       | `link.hover`           | `#2654a0` | Hover state     |
| Background | `background.base`      | `#ffffff` | Page            |
| Background | `background.elevated`  | `#f8f8f8` | Cards           |
| Border     | `border.default`       | `#e0e0e0` | Dividers        |
| Selection  | `selection.background` | `#a3caef` | Text selection  |
| Focus      | `focus.ring`           | `#2654a0` | Focus indicator |

---

## Migration Guide

### From Hardcoded Colors

**Before:**

```tsx
<div
  style={{
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
  }}
>
  Content
</div>
```

**After:**

```tsx
const { theme } = useAppTheme();

<div
  style={{
    color: theme.semanticColors.text.primary,
    backgroundColor: theme.semanticColors.background.base,
    borderColor: theme.semanticColors.border.default,
  }}
>
  Content
</div>;
```

### From FluentUI Tokens Only

**Before:**

```tsx
<Text style={{ color: theme.colorNeutralForeground1 }}>Content</Text>
```

**After (for semantic clarity):**

```tsx
<Text style={{ color: theme.semanticColors.text.primary }}>Content</Text>
```

---

## TypeScript Support

Full type safety for semantic colors:

```typescript
import { ISemanticColors } from '@/theme/fluentTheme';

// Type-safe color access
const getTextColor = (colors: ISemanticColors): string => {
  return colors.text.primary; // Autocomplete available
};

// Type checking prevents invalid access
colors.text.invalid; // ❌ TypeScript error
```

---

## Testing Checklist

- [ ] Text is readable in light mode
- [ ] Text is readable in dark mode (default)
- [ ] Links are distinguishable in all modes
- [ ] Links have underlines in grayscale modes
- [ ] Focus states are visible for keyboard navigation
- [ ] High-contrast mode has sufficient contrast
- [ ] Colorblind modes are distinguishable
- [ ] Selection highlighting is visible
- [ ] Borders provide clear visual separation

---

## Related Documentation

- [Adobe Fonts Setup](./ADOBE-FONTS-SETUP.md) - Typography system
- [Theme System](../src/theme/fluentTheme.ts) - Complete theme configuration
- [Typography Guide](./COMPONENTS.md) - Component usage patterns

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintained by**: TerenceWaters.com
