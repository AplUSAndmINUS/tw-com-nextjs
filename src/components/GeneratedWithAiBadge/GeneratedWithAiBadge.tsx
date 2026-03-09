'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { AiGeneratedIcon } from '@/assets/svgs/AiGeneratedIcon';

export interface GeneratedWithAiBadgeProps {
  /**
   * Custom tooltip text describing the AI usage.
   * Defaults to a standard AI disclosure message.
   */
  tooltipText?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles for the badge wrapper */
  style?: React.CSSProperties;
}

/**
 * GeneratedWithAiBadge
 *
 * A badge indicating that content was generated or assisted by AI.
 * Displays a gradient AI icon to the left of "Generated with AI" text,
 * with a hover/focus tooltip for additional context.
 *
 * Uses Fluent UI theme tokens for colors/typography and Tailwind for layout.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GeneratedWithAiBadge />
 *
 * // With custom tooltip
 * <GeneratedWithAiBadge tooltipText="This article was written with AI assistance." />
 * ```
 */
export const GeneratedWithAiBadge: React.FC<GeneratedWithAiBadgeProps> = ({
  tooltipText = 'This content was drafted with AI assistance and carefully verified by our team for accuracy. We take full responsibility for what we publish and advocate transparent, responsible AI use.',
  className,
  style,
}) => {
  const { theme, themeMode } = useAppTheme();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipId = React.useId();

  // Use solid color for high-contrast and colorblind themes
  const isHighContrastOrColorblind = [
    'high-contrast',
    'protanopia',
    'deuteranopia',
    'tritanopia',
  ].includes(themeMode);

  // More stark gradient for better visibility
  const gradientBorder = isHighContrastOrColorblind
    ? theme.semanticColors.border.emphasis
    : theme.gradients.ai.linear;

  const handleToggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowTooltip(false);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleTooltip();
    }
  };

  return (
    <div
      className={`relative inline-flex${className ? ` ${className}` : ''}`}
      style={{ ...style, overflow: 'visible' }}
    >
      {/* Badge pill */}
      <div
        className='inline-flex cursor-default select-none items-center gap-2 rounded-full px-3 py-1.5'
        style={{
          background: isHighContrastOrColorblind
            ? theme.palette.neutralLighterAlt
            : `linear-gradient(${theme.palette.neutralLighterAlt}, ${theme.palette.neutralLighterAlt}) padding-box, ${gradientBorder} border-box`,
          border: isHighContrastOrColorblind
            ? `2px solid ${gradientBorder}`
            : '2px solid transparent',
          fontSize: theme.typography.fontSizes.md,
          fontWeight: theme.typography.fontWeights.semiBold,
          color: theme.palette.neutralPrimary,
          lineHeight: 1,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onClick={handleToggleTooltip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role='button'
        aria-label={`Generated with AI. ${tooltipText}`}
        aria-describedby={tooltipId}
        aria-controls={tooltipId}
      >
        <AiGeneratedIcon size={24} />
        <span>Generated with AI</span>
      </div>

      {/* Tooltip - positioned to the right */}
      <div
        id={tooltipId}
        role='tooltip'
        className='pointer-events-none absolute left-full top-1/2 z-50 ml-3 w-max max-w-xs -translate-y-1/2 rounded-lg px-4 py-2.5'
        style={{
          backgroundColor: theme.semanticColors.background.elevated,
          color: theme.semanticColors.text.primary,
          fontSize: theme.typography.fontSizes.md,
          lineHeight: theme.typography.lineHeights.normal,
          border: `1px solid ${theme.semanticColors.border.default}`,
          boxShadow: theme.shadows.card,
          opacity: showTooltip ? 1 : 0,
          visibility: showTooltip ? 'visible' : 'hidden',
          transition: `opacity ${theme.animations.duration.fast} ${theme.animations.easing.easeInOut}, visibility ${theme.animations.duration.fast} ${theme.animations.easing.easeInOut}`,
        }}
      >
        {tooltipText}
        {/* Tooltip arrow pointing left */}
        <span
          className='absolute right-full top-1/2 -translate-y-1/2'
          aria-hidden='true'
          style={{
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: `6px solid ${theme.semanticColors.background.elevated}`,
          }}
        />
      </div>
    </div>
  );
};
