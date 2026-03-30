'use client';

import React, { useState, useEffect } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { AiGeneratedIcon } from '@/assets/svgs/AiGeneratedIcon';
import { Modal } from '@/components/Modal';
import { FluentIcon } from '@/components/FluentIcon';
import { WindowNew20Regular } from '@fluentui/react-icons';
import { useIsMobile } from '@/hooks/useMediaQuery';

export interface GeneratedWithAiBadgeProps {
  /**
   * Custom tooltip text describing the AI usage.
   * Defaults to a standard AI disclosure message.
   * Supports `\n` for line breaks.
   */
  tooltipText?: string;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles for the badge wrapper */
  style?: React.CSSProperties;
  /**
   * When true, the tooltip opens below the badge (suitable for Hero sections).
   * On mobile (`useIsMobile`), tooltip always opens below regardless of this prop.
   */
  isHero?: boolean;
  /**
   * Content to render inside the Responsible AI Usage modal.
   * Pass pre-rendered MDX from a server component using next-mdx-remote/rsc.
   */
  modalContent?: React.ReactNode;
}

const DEFAULT_TOOLTIP =
  'This content was created with AI assistance and reviewed by our team.\nClick the icon to read our Responsible AI Usage guidelines.';

/**
 * GeneratedWithAiBadge
 *
 * A badge indicating that content was generated or assisted by AI.
 * Displays a gradient AI icon to the left of "Generated with AI" text,
 * with a hover/focus tooltip for additional context.
 *
 * Also includes a WindowNew icon button that opens a near-fullscreen modal
 * displaying the Responsible AI Usage guidelines adapted from Fluxline.pro.
 *
 * Uses Fluent UI theme tokens for colors/typography and Tailwind for layout.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GeneratedWithAiBadge />
 *
 * // In a Hero section (tooltip shows below)
 * <GeneratedWithAiBadge isHero />
 * ```
 */
export const GeneratedWithAiBadge: React.FC<GeneratedWithAiBadgeProps> = ({
  tooltipText = DEFAULT_TOOLTIP,
  className,
  style,
  isHero = false,
  modalContent,
}) => {
  const { theme, themeMode } = useAppTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const tooltipId = React.useId();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tooltip goes below if isHero or on mobile (checked only after mount to avoid hydration mismatch)
  const tooltipBelow = isHero || (isMounted && isMobile);

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

  const tooltipLines = tooltipText.split(/\n|\\n/);

  // Tooltip positioning: below when in Hero or mobile, to the right otherwise
  const tooltipPositionClass = tooltipBelow
    ? 'pointer-events-none absolute left-full top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg px-4 py-2.5'
    : 'pointer-events-none absolute left-full top-1/2 z-50 ml-3 w-max max-w-xs -translate-y-1/2 rounded-lg px-4 py-2.5';

  return (
    <div
      className={`relative inline-flex items-center gap-2${className ? ` ${className}` : ''}`}
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
        onPointerEnter={(e) => {
          if (e.pointerType !== 'mouse') return;
          setShowTooltip(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse') return;
          setShowTooltip(false);
        }}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        onClick={handleToggleTooltip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role='button'
        aria-label={`Generated with AI. ${tooltipText.replace(/(\r?\n|\\n)/g, ' ')}`}
        aria-describedby={tooltipId}
        aria-controls={tooltipId}
      >
        <AiGeneratedIcon size={24} />
        <span>Generated with AI</span>
      </div>

      {/* Tooltip */}
      <div
        id={tooltipId}
        role='tooltip'
        className={tooltipPositionClass}
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
        {tooltipLines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < tooltipLines.length - 1 && <br />}
          </React.Fragment>
        ))}
        {/* Arrow: points up when tooltip is below, points left when tooltip is to the right */}
        {tooltipBelow ? (
          <span
            className='absolute bottom-full left-1/2 -translate-x-1/2'
            aria-hidden='true'
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: `6px solid ${theme.semanticColors.background.elevated}`,
            }}
          />
        ) : (
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
        )}
      </div>

      {/* WindowNew icon button — opens Responsible AI Usage modal (only when modalContent is provided) */}
      {modalContent && (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label='View Responsible AI Usage guidelines'
            title='Responsible AI Usage'
            onPointerEnter={(e) => {
              if (e.pointerType !== 'mouse') return;
              setIsButtonHovered(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== 'mouse') return;
              setIsButtonHovered(false);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: theme.borderRadius.container.small,
              border: `1px solid ${theme.semanticColors.border.default}`,
              backgroundColor: isButtonHovered
                ? theme.palette.neutralLighter
                : theme.palette.neutralLighterAlt,
              color: isButtonHovered
                ? theme.semanticColors.text.primary
                : theme.semanticColors.text.muted,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, color 0.2s ease',
              flexShrink: 0,
            }}
          >
            <FluentIcon iconName={WindowNew20Regular} />
          </button>

          {/* Responsible AI Usage Modal which opens at maxWidth 800px */}
          <Modal
            isOpen={isModalOpen}
            onDismiss={() => setIsModalOpen(false)}
            ariaLabel='Responsible AI Usage'
            maxWidth='800px'
            maxHeight='90vh'
            showCloseButton={true}
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
            }}
          >
            {/* Spacer to clear the close button */}
            <div style={{ height: '56px', flexShrink: 0 }} />
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 2rem 2rem',
                minHeight: 0,
              }}
            >
              {modalContent}
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};
