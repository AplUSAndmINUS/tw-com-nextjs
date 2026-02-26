/**
 * MDX Typography Components
 * =========================
 * Server-compatible typography components for MDX rendering.
 * Uses CSS variables directly (set by FluentProvider) without client-side hooks.
 * Matches the typography definitions from fluentTheme.ts.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

// ---------------------------------------------------------------------------
// CSS Variables - automatically updated by FluentProvider
// ---------------------------------------------------------------------------
const cssVars = {
  fg1: 'var(--colorNeutralForeground1)',
  fg2: 'var(--colorNeutralForeground2)',
  brandLink: 'var(--colorBrandForegroundLink)',
  strokeColor: 'var(--colorNeutralStroke1)',
  codeBg: 'var(--colorNeutralBackground3)',
  preBg: 'var(--colorNeutralBackground4)',
  blockquoteBorder: 'var(--colorBrandBackground)',
};

// ---------------------------------------------------------------------------
// Typography Styles - matches fluentTheme.ts definitions
// ---------------------------------------------------------------------------
const typoStyles = {
  h1: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    fontFamily:
      'var(--fontFamilyProximaNova, Montserrat, system-ui, sans-serif)',
  },
  h2: {
    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.015em',
    fontFamily:
      'var(--fontFamilyProximaNova, Montserrat, system-ui, sans-serif)',
  },
  h3: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    fontFamily:
      'var(--fontFamilyProximaNova, Montserrat, system-ui, sans-serif)',
  },
  h4: {
    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
    fontWeight: 600,
    lineHeight: 1.35,
    fontFamily:
      'var(--fontFamilyProximaNova, Montserrat, system-ui, sans-serif)',
  },
  h5: {
    fontSize: 'clamp(1.125rem, 2.25vw, 1.25rem)',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily:
      'var(--fontFamilyProximaNova, Montserrat, system-ui, sans-serif)',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily:
      'var(--fontFamilyProximaNova, Montserrat, system-ui, sans-serif)',
  },
  body: {
    fontSize: '1.0625rem',
    fontWeight: 400,
    lineHeight: 1.7,
    fontFamily: 'var(--fontFamilyMerriweather, Georgia, serif)',
  },
  code: {
    fontSize: '0.9375rem',
    fontWeight: 400,
    fontFamily: 'var(--fontFamilyRobotoMono, "Courier New", monospace)',
    lineHeight: 1.6,
  },
  caption: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: cssVars.fg2,
    fontStyle: 'italic',
  },
};

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------
const headingMargins = {
  h1: { marginTop: '2rem', marginBottom: '1rem' },
  h2: { marginTop: '1.75rem', marginBottom: '0.875rem' },
  h3: { marginTop: '1.5rem', marginBottom: '0.75rem' },
  h4: { marginTop: '1.25rem', marginBottom: '0.625rem' },
  h5: { marginTop: '1rem', marginBottom: '0.5rem' },
  h6: { marginTop: '1rem', marginBottom: '0.5rem' },
};

// ---------------------------------------------------------------------------
// MDX Component Map
// ---------------------------------------------------------------------------
export const mdxComponents: MDXComponents = {
  // Headings
  h1: ({ children }) => (
    <h1
      style={{
        ...typoStyles.h1,
        ...headingMargins.h1,
        color: cssVars.fg1,
      }}
    >
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2
      style={{
        ...typoStyles.h2,
        ...headingMargins.h2,
        color: cssVars.fg1,
      }}
    >
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3
      style={{
        ...typoStyles.h3,
        ...headingMargins.h3,
        color: cssVars.fg1,
      }}
    >
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4
      style={{
        ...typoStyles.h4,
        ...headingMargins.h4,
        color: cssVars.fg1,
      }}
    >
      {children}
    </h4>
  ),

  h5: ({ children }) => (
    <h5
      style={{
        ...typoStyles.h5,
        ...headingMargins.h5,
        color: cssVars.fg2,
      }}
    >
      {children}
    </h5>
  ),

  h6: ({ children }) => (
    <h6
      style={{
        ...typoStyles.h6,
        ...headingMargins.h6,
        color: cssVars.fg2,
      }}
    >
      {children}
    </h6>
  ),

  // Body paragraph
  p: ({ children }) => (
    <p
      style={{
        ...typoStyles.body,
        color: cssVars.fg1,
        marginBottom: '1rem',
      }}
    >
      {children}
    </p>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: `4px solid ${cssVars.blockquoteBorder}`,
        paddingLeft: '1rem',
        marginLeft: 0,
        marginRight: 0,
        marginTop: '1rem',
        marginBottom: '1rem',
        color: cssVars.fg2,
        fontStyle: 'italic',
        fontSize: '1.0625rem',
        lineHeight: 1.7,
      }}
    >
      {children}
    </blockquote>
  ),

  // Code blocks (fenced ```)
  pre: ({ children }) => (
    <pre
      style={{
        ...typoStyles.code,
        background: cssVars.preBg,
        borderRadius: '0.5rem',
        padding: '1rem',
        overflowX: 'auto',
        marginTop: '0.5rem',
        marginBottom: '1.25rem',
        color: cssVars.fg1,
      }}
    >
      {children}
    </pre>
  ),

  // Inline code
  code: ({ children, className }) =>
    className ? (
      // Code block (inside <pre>)
      <code className={className} style={{ color: cssVars.fg1 }}>
        {children}
      </code>
    ) : (
      // Inline code
      <code
        style={{
          ...typoStyles.code,
          color: cssVars.fg1,
          background: cssVars.codeBg,
          borderRadius: '0.25rem',
          padding: '0.125rem 0.375rem',
        }}
      >
        {children}
      </code>
    ),

  // Lists
  ul: ({ children }) => (
    <ul
      style={{
        ...typoStyles.body,
        color: cssVars.fg1,
        paddingLeft: '1.5rem',
        marginBottom: '1rem',
        listStyleType: 'disc',
      }}
    >
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol
      style={{
        ...typoStyles.body,
        color: cssVars.fg1,
        paddingLeft: '1.5rem',
        marginBottom: '1rem',
        listStyleType: 'decimal',
      }}
    >
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li
      style={{
        color: cssVars.fg1,
        marginBottom: '0.25rem',
      }}
    >
      {children}
    </li>
  ),

  // Links
  a: ({ href, children, ...props }) => {
    const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
    const linkStyle: React.CSSProperties = {
      color: cssVars.brandLink,
      textDecoration: 'underline',
    };

    if (isInternal) {
      return (
        <Link href={href} style={linkStyle} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        style={linkStyle}
        target='_blank'
        rel='noopener noreferrer'
        {...props}
      >
        {children}
      </a>
    );
  },

  // Images
  img: ({ src, alt }) =>
    src ? (
      <span style={{ display: 'block', marginBottom: '1.25rem' }}>
        <Image
          src={src}
          alt={alt ?? ''}
          width={800}
          height={450}
          role={alt ? undefined : 'none'}
          style={{ width: '100%', height: 'auto', borderRadius: '0.5rem' }}
          unoptimized
        />
        {alt && (
          <span
            style={{
              ...typoStyles.caption,
              display: 'block',
              textAlign: 'center',
              marginTop: '0.5rem',
            }}
          >
            {alt}
          </span>
        )}
      </span>
    ) : null,

  // Horizontal rule
  hr: () => (
    <hr
      style={{
        border: 'none',
        borderTop: `1px solid ${cssVars.strokeColor}`,
        marginTop: '2rem',
        marginBottom: '2rem',
      }}
    />
  ),

  // Emphasis
  strong: ({ children }) => (
    <strong style={{ color: cssVars.fg1, fontWeight: 700 }}>{children}</strong>
  ),

  em: ({ children }) => (
    <em style={{ color: cssVars.fg1, fontStyle: 'italic' }}>{children}</em>
  ),

  // Tables
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9375rem',
        }}
      >
        {children}
      </table>
    </div>
  ),

  th: ({ children }) => (
    <th
      style={{
        borderBottom: `2px solid ${cssVars.strokeColor}`,
        padding: '0.75rem',
        textAlign: 'left',
        fontWeight: 600,
        color: cssVars.fg1,
        backgroundColor: cssVars.preBg,
      }}
    >
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td
      style={{
        borderBottom: `1px solid ${cssVars.strokeColor}`,
        padding: '0.75rem',
        color: cssVars.fg1,
      }}
    >
      {children}
    </td>
  ),
};
