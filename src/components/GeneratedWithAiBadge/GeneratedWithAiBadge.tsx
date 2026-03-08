'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { AiGeneratedIcon } from '@/assets/svgs/AiGeneratedIcon';
import { gradients } from '@/theme/fluentTheme';

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
  tooltipText = 'This content was generated or assisted by artificial intelligence.',
  className,
  style,
}) => {
  const { theme } = useAppTheme();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipId = React.useId();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setShowTooltip(false);
  };

  return (
    <div
      className={`relative inline-flex${className ? ` ${className}` : ''}`}
      style={style}
    >
      {/* Badge pill */}
      <div
        className='inline-flex cursor-default select-none items-center gap-1.5 rounded-full px-3 py-1'
        style={{
          background: `linear-gradient(${theme.palette.neutralLighterAlt}, ${theme.palette.neutralLighterAlt}) padding-box, ${gradients.ai.linear} border-box`,
          border: '1px solid transparent',
          fontSize: theme.typography.fontSizes.md,
          fontWeight: theme.typography.fontWeights.semiBold,
          color: theme.palette.neutralPrimary,
          lineHeight: 1,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role='note'
        aria-label={`Generated with AI. ${tooltipText}`}
        aria-describedby={tooltipId}
      >
        <AiGeneratedIcon size={16} />
        <span>Generated with AI</span>
      </div>

      {/* Tooltip */}
      <div
        id={tooltipId}
        role='tooltip'
        className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-lg px-3 py-2'
        style={{
          backgroundColor: theme.colorNeutralForeground1,
          color: theme.colorNeutralBackground1,
          fontSize: theme.typography.fontSizes.md,
          boxShadow: theme.shadows.tooltip,
          opacity: showTooltip ? 1 : 0,
          visibility: showTooltip ? 'visible' : 'hidden',
          transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
        }}
      >
        {tooltipText}
        {/* Tooltip arrow */}
        <span
          className='absolute left-1/2 top-full -translate-x-1/2'
          aria-hidden='true'
          style={{
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `5px solid ${theme.colorNeutralForeground1}`,
          }}
        />
      </div>
    </div>
  );
};
