// src/components/ThemedLink/ThemedLink.tsx
'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TypographyVariant } from '@/theme/fluentTheme';
import Link from 'next/link';
import { useState } from 'react';
import type { LinkProps } from 'next/link';

interface ThemedLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  target?: string;
  rel?: string;
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
  target,
  rel,
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

  // Underline only in high-contrast mode for accessibility; grayscale relies on color alone
  const shouldUnderline = theme.themeMode === 'high-contrast';

  // Merge styles
  const mergedStyles: React.CSSProperties = {
    ...typographyStyle,
    color: isHovered
      ? theme.semanticColors.link.hover
      : isFooter
        ? theme.colorNeutralForeground2
        : theme.semanticColors.link.default,
    textDecoration: shouldUnderline ? 'underline' : 'none',
    transition: `color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
    ...style, // User overrides last
  };

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={mergedStyles}
      onPointerEnter={(e) => { if (e.pointerType !== 'mouse') return; setIsHovered(true); }}
      onPointerLeave={(e) => { if (e.pointerType !== 'mouse') return; setIsHovered(false); }}
      {...linkProps}
    >
      {children}
    </Link>
  );
};
