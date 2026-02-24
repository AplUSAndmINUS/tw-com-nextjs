// src/components/ThemedLink/ThemedLink.tsx
'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TypographyVariant } from '@/theme/fluentTheme';
import Link from 'next/link';
import { useState } from 'react';
import type { LinkProps } from 'next/link';

interface ThemedLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  isFooter?: boolean; // New prop to indicate if this is a footer link
  variant?: Extract<
    TypographyVariant,
    'body' | 'bodySmall' | 'small' | 'caption'
  >; // Typography variants suitable for links
  style?: React.CSSProperties;
}

export const ThemedLink: React.FC<ThemedLinkProps> = ({
  href,
  children,
  className,
  isFooter = false,
  variant = 'body',
  style,
  ...linkProps
}) => {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Get typography defaults - now type-safe!
  const typographyStyle = theme.typography.fonts[variant];

  // Handle grayscale - always underline
  const shouldUnderline = ['grayscale', 'grayscale-dark'].includes(
    theme.themeMode
  );

  // Merge styles
  const mergedStyles: React.CSSProperties = {
    ...typographyStyle,
    color: isHovered
      ? theme.semanticColors.link.hover
      : isFooter
        ? theme.semanticColors.link.footer
        : theme.semanticColors.link.default,
    textDecoration: shouldUnderline ? 'underline' : 'none',
    transition: `color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
    ...style, // User overrides last
  };

  return (
    <Link
      href={href}
      className={className}
      style={mergedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...linkProps}
    >
      {children}
    </Link>
  );
};
