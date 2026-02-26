'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useIsMobile } from '@/hooks/useMediaQuery';

export interface UnifiedPageWrapperProps {
  children: React.ReactNode;
  /** Layout type determines max-width and centering */
  layoutType?: 'narrow' | 'standard' | 'wide' | 'full' | 'responsive-grid';
  /** Additional custom class names */
  className?: string;
  /** Additional custom styles */
  style?: React.CSSProperties;
}

/**
 * UnifiedPageWrapper Component
 *
 * Provides consistent page-level layout and spacing.
 * Used by ContentListingPage and other unified components.
 *
 * @example
 * ```tsx
 * <UnifiedPageWrapper layoutType="responsive-grid">
 *   <YourContent />
 * </UnifiedPageWrapper>
 * ```
 */
export const UnifiedPageWrapper: React.FC<UnifiedPageWrapperProps> = ({
  children,
  layoutType = 'standard',
  className = '',
  style,
}) => {
  const { theme } = useAppTheme();
  const isMobile = useIsMobile();

  const getMaxWidth = () => {
    switch (layoutType) {
      case 'narrow':
        return '768px';
      case 'standard':
        return '1024px';
      case 'wide':
        return '1280px';
      case 'full':
        return '100%';
      case 'responsive-grid':
        return '1440px';
      default:
        return '1024px';
    }
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: getMaxWidth(),
        margin: '0 auto',
        padding: isMobile
          ? `${theme.spacing.l} ${theme.spacing.m}`
          : `${theme.spacing.xxl} ${theme.spacing.xl}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
