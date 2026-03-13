'use client';

import React from 'react';
import { Tooltip, TooltipProps } from '@fluentui/react-components';
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

export const GeneratedWithAiBadge: React.FC<GeneratedWithAiBadgeProps> = ({
  tooltipText = 'This content was drafted with AI assistance and carefully verified by our team for accuracy. We take full responsibility for what we publish and advocate transparent, responsible AI use.',
  className,
  style,
}) => {
  const { theme, themeMode } = useAppTheme();
  const [tooltipVisible, setTooltipVisible] = React.useState(false);

  // Use solid color for high-contrast and colorblind themes
  const isHighContrastOrColorblind = [
    'high-contrast',
    'protanopia',
    'deuteranopia',
    'tritanopia',
  ].includes(themeMode);

  const gradientBorder = isHighContrastOrColorblind
    ? theme.semanticColors.border.emphasis
    : theme.gradients.ai.linear;

  // Fluent UI fires this for hover in/out and focus in/out
  const handleVisibleChange: NonNullable<TooltipProps['onVisibleChange']> = (
    _,
    data
  ) => {
    setTooltipVisible(data.visible);
  };

  // Toggle on tap / click
  const handleClick = () => {
    setTooltipVisible((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setTooltipVisible(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setTooltipVisible((prev) => !prev);
    }
  };

  return (
    <div
      className={`inline-flex${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Tooltip
        content={tooltipText}
        relationship='description'
        positioning='after'
        visible={tooltipVisible}
        onVisibleChange={handleVisibleChange}
      >
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
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role='button'
          aria-label='Generated with AI'
        >
          <AiGeneratedIcon size={24} />
          <span>Generated with AI</span>
        </div>
      </Tooltip>
    </div>
  );
};
