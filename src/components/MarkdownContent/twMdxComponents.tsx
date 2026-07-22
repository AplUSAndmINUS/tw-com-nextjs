import React from 'react';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';

/**
 * Lean MDX component map for design-system article bodies.
 *
 * Unlike the legacy `mdxComponents`, this map sets NO inline styles. Every
 * element is rendered as its plain semantic tag and styled entirely by the
 * `.tw-prose` rules (styles/tw-prose.css), which are token-driven and
 * theme-aware. That also sidesteps a real bug in the legacy map: it colours
 * text with Fluent variables (`--colorNeutralForeground1`, …) that no longer
 * exist, so those declarations are dropped and text falls back to inheritance.
 *
 * The only two elements that need behaviour rather than styling:
 *   - `a`   — internal links use next/link for client navigation; external
 *             links open in a new tab with rel guards.
 *   - `img` — plain <img> (the site is output:'export' with unoptimized
 *             images, so next/image adds nothing) tagged `tw-media` so the
 *             grayscale accessibility mode reaches it.
 */
export const twMdxComponents: MDXComponents = {
  a: ({ href = '', children, ...rest }) => {
    const isInternal = href.startsWith('/') || href.startsWith('#');
    if (isInternal) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target='_blank' rel='noopener noreferrer' {...rest}>
        {children}
      </a>
    );
  },
  img: ({ src = '', alt = '', ...rest }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} className='tw-media' {...rest} />
  ),
};

export default twMdxComponents;
