// src/components/ThemedLink/ThemedLink.tsx
'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TypographyVariant } from '@/theme/fluentTheme';
import Link from 'next/link';
import { useState } from 'react';
import type { LinkProps } from 'next/link';

interface ThemedLinkProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<LinkProps, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
  isFooter?: boolean; // New prop to indicate if this is a footer link
  variant?: Extract<
    TypographyVariant,
    'body' | 'bodySmall' | 'small' | 'caption'
  >; // Typography variants suitable for links
  hoverScale?: number;
  invertOnPress?: boolean;
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
  hoverScale,
  invertOnPress = false,
  style,
  ...linkProps
}) => {
  const { theme } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const {
    onPointerEnter: consumerOnPointerEnter,
    onPointerLeave: consumerOnPointerLeave,
    onPointerDown: consumerOnPointerDown,
    onPointerUp: consumerOnPointerUp,
    onPointerCancel: consumerOnPointerCancel,
    onFocus: consumerOnFocus,
    onBlur: consumerOnBlur,
    ...restLinkProps
  } = linkProps;

  // Get typography defaults - now type-safe!
  const typographyStyle = theme.typography.fonts[variant];

  // Underline only in high-contrast mode for accessibility; grayscale relies on color alone
  const shouldUnderline = theme.themeMode === 'high-contrast';
  const explicitTextColor = style?.color;
  const explicitBackgroundColor = style?.backgroundColor;
  const defaultTextColor =
    explicitTextColor ??
    (isFooter
      ? theme.colorNeutralForeground2
      : theme.semanticColors.link.default);
  const hoverTextColor =
    explicitTextColor ??
    (isFooter
      ? theme.colorNeutralForeground1
      : theme.semanticColors.link.hover);
  const pressedBackgroundColor = defaultTextColor;
  const pressedTextColor =
    typeof explicitBackgroundColor === 'string' &&
    explicitBackgroundColor !== 'transparent'
      ? explicitBackgroundColor
      : theme.semanticColors.background.base;
  const baseTransform = style?.transform ? `${style.transform} ` : '';
  const interactiveTransform =
    isHovered && hoverScale
      ? `${baseTransform}scale(${hoverScale})`
      : style?.transform;
  const interactiveTextColor =
    invertOnPress && isPressed
      ? pressedTextColor
      : isHovered
        ? hoverTextColor
        : defaultTextColor;
  const transitionParts = [
    style?.transition,
    `color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
    `background-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
    `transform ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
  ].filter(Boolean);

  // Merge styles
  const mergedStyles: React.CSSProperties = {
    ...typographyStyle,
    ...style, // User overrides last
    color: interactiveTextColor,
    backgroundColor:
      invertOnPress && isPressed
        ? pressedBackgroundColor
        : style?.backgroundColor,
    textDecoration: shouldUnderline ? 'underline' : 'none',
    transform: interactiveTransform,
    transition: transitionParts.join(', '),
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'mouse') {
      setIsHovered(true);
    }
    consumerOnPointerEnter?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'mouse') {
      setIsHovered(false);
    }
    setIsPressed(false);
    consumerOnPointerLeave?.(e);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    setIsPressed(true);
    consumerOnPointerDown?.(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLAnchorElement>) => {
    setIsPressed(false);
    consumerOnPointerUp?.(e);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLAnchorElement>) => {
    setIsPressed(false);
    consumerOnPointerCancel?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    consumerOnFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
    setIsPressed(false);
    consumerOnBlur?.(e);
  };

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={mergedStyles}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...restLinkProps}
    >
      {children}
    </Link>
  );
};
