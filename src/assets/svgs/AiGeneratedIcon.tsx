'use client';

import React, { useId } from 'react';
import { gradients } from '@/theme/fluentTheme';

interface AiGeneratedIconProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}

/**
 * AiGeneratedIcon
 *
 * Custom SVG icon representing AI-generated content.
 * Features a rounded-square frame with "AI" lettering and a 4-pointed
 * sparkle star, rendered with a purple-to-blue gradient.
 *
 * @example
 * ```tsx
 * <AiGeneratedIcon size={20} />
 * ```
 */
export const AiGeneratedIcon: React.FC<AiGeneratedIconProps> = ({
  className,
  style,
  size = 24,
}) => {
  const uid = useId();
  const gradientId = `ai-grad-${uid.replace(/:/g, '')}`;

  return (
    <svg
      className={className}
      style={{ width: size, height: size, flexShrink: 0, ...style }}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1='0'
          y1='24'
          x2='22'
          y2='0'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0%' stopColor={gradients.ai.from} />
          <stop offset='100%' stopColor={gradients.ai.to} />
        </linearGradient>
      </defs>

      {/* Rounded square border */}
      <rect
        x='1.5'
        y='3.5'
        width='15'
        height='18'
        rx='3'
        stroke={`url(#${gradientId})`}
        strokeWidth='2'
        fill='none'
      />

      {/* Letter "A" */}
      <path
        d='M5 20L8 9L11 20'
        stroke={`url(#${gradientId})`}
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <line
        x1='6'
        y1='16'
        x2='10'
        y2='16'
        stroke={`url(#${gradientId})`}
        strokeWidth='1.8'
        strokeLinecap='round'
      />

      {/* Letter "I" */}
      <line
        x1='13.5'
        y1='9'
        x2='13.5'
        y2='20'
        stroke={`url(#${gradientId})`}
        strokeWidth='1.8'
        strokeLinecap='round'
      />

      {/* 4-pointed sparkle star at upper-right, overlapping frame corner - larger and more visible */}
      <path
        d='M19.5 0 L21 3 L23.5 4.5 L21 6 L19.5 9 L18 6 L15.5 4.5 L18 3Z'
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth='0.5'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default AiGeneratedIcon;
