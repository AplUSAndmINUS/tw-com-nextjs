'use client';

import { useState } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

export interface UseCardStateOptions {
  /** Whether hover/focus events change the card's visual state. Default: true */
  hoverable?: boolean;
  /** Whether press (mousedown/mouseup) events change the card's visual state. Default: false */
  clickable?: boolean;
}

export interface InteractionHandlers {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

export interface CardStateReturn {
  /** True while the card is hovered or focused */
  isHovered: boolean;
  /** True while the card is actively pressed */
  isActive: boolean;
  /** True during any interaction (hover, focus, or press) */
  isInteracting: boolean;
  /** Teal accent — used for interactive state color */
  accentColor: string;
  /** Brand primary — used for resting state color */
  restStateColor: string;
  /** accentColor when interacting, restStateColor otherwise */
  currentColor: string;
  /** True for all light-family themes */
  isLightFamilyMode: boolean;
  /** Base surface background color */
  cardSurfaceColor: string;
  /** Surface color during hover/focus */
  cardHoverSurfaceColor: string;
  /** Border color (accent on interaction, default otherwise) */
  borderColor: string;
  /** Top accent bar color */
  topBarColor: string;
  /** Background image (gradient shimmer) */
  backgroundImage: string;
  /** Background color (swaps on interaction) */
  backgroundColor: string;
  /** Box shadow (elevated on interaction) */
  boxShadow: string;
  /** Spread these onto the card's outer element */
  interactionProps: InteractionHandlers;
}

/**
 * useCardState
 *
 * Centralised hover/focus/press state + derived design tokens for all card components.
 * Provides the accent line colour, gradient shimmer, border, and shadow that are consistent
 * across ServicesClient, ContentHubClient, WhatWeOffer, AboutFeaturedProjects, etc.
 *
 * @example
 * ```tsx
 * const { isHovered, currentColor, topBarColor, backgroundImage,
 *          backgroundColor, borderColor, boxShadow, interactionProps } = useCardState();
 *
 * <div style={{ border: `1px solid ${borderColor}`, backgroundImage, backgroundColor }} {...interactionProps}>
 *   <div style={{ backgroundColor: topBarColor }} />
 *   ...
 * </div>
 * ```
 */
export function useCardState({
  hoverable = true,
  clickable = false,
}: UseCardStateOptions = {}): CardStateReturn {
  const { theme, themeMode } = useAppTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const accentColor = theme.semanticColors.accent.teal;
  const restStateColor = theme.palette.themePrimary;

  const isLightFamilyMode =
    themeMode === 'light' ||
    themeMode === 'protanopia' ||
    themeMode === 'deuteranopia' ||
    themeMode === 'tritanopia' ||
    themeMode === 'grayscale';

  const cardSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.muted
    : theme.semanticColors.background.elevated;

  const cardHoverSurfaceColor = isLightFamilyMode
    ? theme.semanticColors.background.elevated
    : theme.semanticColors.background.muted;

  const isInteracting = isHovered || isActive;
  const currentColor = isInteracting ? accentColor : restStateColor;
  const topBarColor = currentColor;
  const borderColor = isInteracting
    ? accentColor
    : theme.semanticColors.border.default;

  /**
   * Gradient shimmer — toned-down variant of the About FeaturedProjects card.
   *
   * Light mode: accent-tinted shimmer (subtle brand recognition).
   * Dark mode:  white shimmer at reduced opacity (~half of original 0.52).
   * Opacity steps up on interaction to provide clear feedback.
   */
  const backgroundImage = isInteracting
    ? isLightFamilyMode
      ? `linear-gradient(160deg, ${accentColor}40 0%, transparent 55%)`
      : `linear-gradient(160deg, rgba(255,255,255,0.40) 0%, transparent 55%)`
    : isLightFamilyMode
      ? `linear-gradient(160deg, ${accentColor}20 0%, transparent 42%)`
      : `linear-gradient(160deg, rgba(255,255,255,0.26) 0%, transparent 42%)`;

  const backgroundColor = isInteracting
    ? cardHoverSurfaceColor
    : cardSurfaceColor;
  const boxShadow = isInteracting
    ? theme.shadows.cardElevated
    : theme.shadows.card;

  const interactionProps: InteractionHandlers = {};

  if (hoverable) {
    interactionProps.onMouseEnter = () => setIsHovered(true);
    interactionProps.onMouseLeave = () => setIsHovered(false);
    interactionProps.onFocus = () => setIsHovered(true);
    interactionProps.onBlur = () => setIsHovered(false);
  }

  if (clickable) {
    interactionProps.onMouseDown = () => setIsActive(true);
    interactionProps.onMouseUp = () => setIsActive(false);
  }

  return {
    isHovered,
    isActive,
    isInteracting,
    accentColor,
    restStateColor,
    currentColor,
    isLightFamilyMode,
    cardSurfaceColor,
    cardHoverSurfaceColor,
    borderColor,
    topBarColor,
    backgroundImage,
    backgroundColor,
    boxShadow,
    interactionProps,
  };
}
