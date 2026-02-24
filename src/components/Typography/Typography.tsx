'use client';

import React, { JSX } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { TypographyVariant } from '@/theme/fluentTheme';

type HtmlTag =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'pre'
  | 'blockquote'
  | 'code'
  | 'label'
  | 'span'
  | 'div';

interface TypographyProps {
  children: React.ReactNode;
  variant: TypographyVariant;
  as?: HtmlTag;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  fontWidth?: string;
  fontSize?: string;
  fontVariant?: string;
  fontVariationSettings?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textShadow?: string;
  textTransform?: string;
  opacity?: number;
  noHyphens?: boolean;
  transform?: string;
  animation?: string;
  animationDelay?: string;
  animationDuration?: string;
  animationTimingFunction?: string;
  animationDirection?: string;
  animationFillMode?: string;
  animationPlayState?: string;
  animationIterationCount?: string;
  animationName?: string;
  marginBottom?: string;
  marginTop?: string;
  marginLeft?: string;
  marginRight?: string;
  margin?: string;
  maxWidth?: string;
  paddingBottom?: string;
  paddingTop?: string;
  paddingLeft?: string;
  paddingRight?: string;
  padding?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Typography component that applies theme typography styles
 * Uses the extended theme system from fluentTheme.ts
 */
export const Typography: React.FC<TypographyProps> = ({
  variant,
  as,
  children,
  textAlign,
  backgroundColor,
  color,
  fontFamily,
  fontWeight,
  fontWidth,
  fontSize,
  fontVariant,
  fontVariationSettings,
  lineHeight,
  letterSpacing,
  textShadow,
  textTransform,
  opacity,
  transform,
  noHyphens = false,
  animation,
  animationDelay,
  animationDuration,
  animationTimingFunction,
  animationDirection,
  animationFillMode,
  animationPlayState,
  animationIterationCount,
  animationName,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
  margin,
  maxWidth,
  paddingBottom,
  paddingTop,
  paddingLeft,
  paddingRight,
  padding,
  style,
  className,
}) => {
  const { theme } = useAppTheme();

  // Get theme defaults for the variant
  const themeDefaults = theme.typography.fonts[variant] || {};

  // Default HTML tag mapping if 'as' is not provided
  const getDefaultTag = (variant: TypographyVariant): HtmlTag => {
    if (variant.startsWith('h')) return variant as HtmlTag; // h1-h6
    if (variant === 'pre' || variant === 'code') return variant as HtmlTag;
    if (variant === 'blockquote') return 'blockquote';
    if (variant === 'label') return 'label';
    if (variant === 'caption') return 'span';
    return 'p'; // Default to paragraph for body, small, medium, etc.
  };

  // Use provided 'as' prop or infer from variant
  const tag = as || getDefaultTag(variant);

  // Build the style object, giving precedence to props, then theme defaults
  const typeMergedStyles: React.CSSProperties = {
    ...themeDefaults,
    ...style,
    ...(fontSize ? { fontSize } : {}),
    ...(fontWeight ? { fontWeight } : {}),
    ...(fontWidth ? { fontWidth } : {}),
    ...(fontFamily ? { fontFamily } : {}),
    ...(fontVariant ? { fontVariant } : {}),
    ...(fontVariationSettings ? { fontVariationSettings } : {}),
    ...(lineHeight ? { lineHeight } : {}),
    ...(letterSpacing ? { letterSpacing } : {}),
    ...(textShadow ? { textShadow } : {}),
    ...(typeof textTransform !== 'undefined'
      ? { textTransform: textTransform as React.CSSProperties['textTransform'] }
      : {}),
    ...(typeof textAlign !== 'undefined' ? { textAlign } : {}),
    ...(typeof opacity !== 'undefined' ? { opacity } : {}),
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(color ? { color } : {}),
    ...(transform ? { transform } : {}),
    ...(animation ? { animation } : {}),
    ...(animationDelay ? { animationDelay } : {}),
    ...(animationDuration ? { animationDuration } : {}),
    ...(animationTimingFunction ? { animationTimingFunction } : {}),
    ...(animationDirection ? { animationDirection } : {}),
    ...(animationFillMode ? { animationFillMode } : {}),
    ...(animationPlayState ? { animationPlayState } : {}),
    ...(animationIterationCount ? { animationIterationCount } : {}),
    ...(animationName ? { animationName } : {}),
    ...(maxWidth ? { maxWidth } : {}),
    ...(marginBottom ? { marginBottom } : {}),
    ...(marginTop ? { marginTop } : {}),
    ...(marginLeft ? { marginLeft } : {}),
    ...(marginRight ? { marginRight } : {}),
    ...(margin ? { margin } : {}),
    ...(paddingBottom ? { paddingBottom } : {}),
    ...(paddingTop ? { paddingTop } : {}),
    ...(paddingLeft ? { paddingLeft } : {}),
    ...(paddingRight ? { paddingRight } : {}),
    ...(padding ? { padding } : {}),
    ...(noHyphens
      ? { hyphens: 'none', wordBreak: 'keep-all', overflowWrap: 'normal' }
      : {}),
  };

  return React.createElement(
    tag,
    {
      style: typeMergedStyles,
      className: className,
    },
    children
  );
};
