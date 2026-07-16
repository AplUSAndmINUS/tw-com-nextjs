'use client';

/**
 * PodcastMiniPlayer
 * Persistent bottom bar that keeps the current episode playing while the user
 * browses the rest of the site. Mounted once at the root, outside the page
 * content, so navigation never unmounts it.
 *
 * Appears once an episode has started playing and the detail modal has closed.
 *
 * Rendered into document.body via a portal, mirroring CookieBanner. Any CSS
 * filter on an ancestor (FontScaleProvider applies the color-vision filter to a
 * wrapper div) creates a containing block that breaks position:fixed, and
 * portalling out of the app tree sidesteps it wherever this component is placed.
 *
 * The bar animates in but not out: wrapping it in AnimatePresence ran the exit
 * animation but never fired onExitComplete, so the bar was never unmounted and
 * lingered invisibly with its controls still focusable. Unmounting directly
 * trades the slide-out for a guaranteed teardown.
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usePodcastPlayer } from './PodcastPlayerContext';
import { PlayPauseButton, PodcastScrubber } from './PodcastPlayerControls';

/**
 * Sits above the Header (100) but below the CookieBanner (900), the Modal
 * (1000) and the NewsletterDrawer (1200), so it never covers a dialog.
 */
const MINI_PLAYER_Z_INDEX = 800;

/** Show name used as the mini-player eyebrow — all episodes come from one show. */
const SHOW_NAME = 'The Resonant Identity';

/** Distance (px) the bar slides up from on enter. */
const SLIDE_OFFSET = 140;

/** Decode HTML entities (e.g. &amp; -> &) in RSS-provided episode titles. */
const decodeHtmlEntities = (input: string): string => {
  if (typeof document === 'undefined') return input;
  const el = document.createElement('textarea');
  el.innerHTML = input;
  return el.value;
};

export const PodcastMiniPlayer: React.FC = () => {
  const { theme } = useAppTheme();
  const { episode, hasStarted, isModalOpen, close } = usePodcastPlayer();
  const { shouldReduceMotion } = useReducedMotion();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const visible = Boolean(episode) && hasStarted && !isModalOpen;
  const title = episode ? decodeHtmlEntities(episode.title) : '';

  // Keep the fixed bar from covering the end of the page (footer links, etc.).
  React.useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = isMobile ? '132px' : '88px';
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [visible, isMobile]);

  if (!isMounted || typeof document === 'undefined') return null;
  if (!visible || !episode) return null;

  const playerContent = (
    <motion.div
      role='region'
      aria-label='Podcast mini player'
      initial={{ y: shouldReduceMotion ? 0 : SLIDE_OFFSET, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.28,
        ease: 'easeOut',
      }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: MINI_PLAYER_Z_INDEX,
        backgroundColor: theme.semanticColors.background.elevated,
        borderTop: `1px solid ${theme.semanticColors.border.default}`,
        boxShadow: theme.shadows.l,
        paddingTop: theme.spacing.s1,
        paddingLeft: 'max(12px, env(safe-area-inset-left))',
        paddingRight: 'max(12px, env(safe-area-inset-right))',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
      }}
    >
      <div
        style={{
          maxWidth: 1220,
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? theme.spacing.xs : theme.spacing.m,
        }}
      >
        {/* Artwork + episode identity + (mobile) transport */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.s2,
            minWidth: 0,
            flex: isMobile ? '0 0 auto' : '1 1 auto',
          }}
        >
          {episode.imageUrl && (
            <img
              src={episode.imageUrl}
              alt=''
              aria-hidden='true'
              style={{
                flex: '0 0 auto',
                width: 44,
                height: 44,
                borderRadius: theme.borderRadius.s,
                objectFit: 'cover',
              }}
            />
          )}

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: theme.typography.fontWeights.bold,
                color: theme.palette.themePrimary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {SHOW_NAME}
              {episode.episode !== undefined && ` • Ep. ${episode.episode}`}
            </div>
            <div
              title={title}
              style={{
                fontSize: '0.875rem',
                fontWeight: theme.typography.fontWeights.semiBold,
                color: theme.semanticColors.text.heading,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
          </div>

          {isMobile && (
            <>
              <PlayPauseButton size={40} />
              <CloseButton onClose={close} />
            </>
          )}
        </div>

        {/* Scrubber — full width beneath the identity row on mobile */}
        <div
          style={{
            flex: isMobile ? '0 0 auto' : '1 1 46%',
            minWidth: 0,
          }}
        >
          <PodcastScrubber />
        </div>

        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.s1,
              flex: '0 0 auto',
            }}
          >
            <PlayPauseButton size={44} />
            <CloseButton onClose={close} />
          </div>
        )}
      </div>
    </motion.div>
  );

  return createPortal(playerContent, document.body);
};

const CloseButton: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { theme } = useAppTheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type='button'
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label='Stop playback and close the mini player'
      style={{
        flex: '0 0 auto',
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: `1px solid ${theme.semanticColors.border.default}`,
        backgroundColor: hovered ? theme.palette.neutralLighter : 'transparent',
        color: theme.semanticColors.text.primary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9375rem',
        fontWeight: theme.typography.fontWeights.bold,
        lineHeight: 1,
        padding: 0,
        transition: `background-color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
      }}
    >
      {'✕'}
    </button>
  );
};

export default PodcastMiniPlayer;
