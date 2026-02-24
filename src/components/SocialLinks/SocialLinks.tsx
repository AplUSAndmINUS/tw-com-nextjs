'use client';

import React from 'react';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useMultiHoverState } from '@/hooks/useHoverState';
import { FluentIcon } from '@/components/FluentIcon';
import { getSocialIcons } from '../SocialIcons/constants';

interface SocialLinksProps {
  isAuthorTagline?: boolean;
  isFooter?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  isAuthorTagline = false,
  isFooter = false,
}) => {
  const { theme, isDark } = useAppTheme();
  const { isHovered: isSocialHovered, getHoverProps: getSocialHoverProps } =
    useMultiHoverState();

  const styles = {
    footer: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      justifyContent: isAuthorTagline ? 'flex-start' : 'space-between',
      gap: isFooter ? '0.25rem' : '1rem',
      padding: isFooter
        ? '0'
        : isAuthorTagline
          ? 'clamp(0.5rem, 1vh, 0.75rem)'
          : 'clamp(1rem, 2vh, 1.5rem)',
      backgroundColor: theme.gradients[isDark ? 'dark' : 'light'].menu,
      borderTop: isAuthorTagline
        ? `1px solid ${theme.colorBrandForeground2}`
        : 'none',
      width: isFooter ? '75%' : '100%',
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.footer}>
      {getSocialIcons().map((item) => {
        if (!item.isTagline && (isAuthorTagline || isFooter)) return null;
        return (
          <div style={{ position: 'relative' }} key={item.url}>
            <a
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              {...getSocialHoverProps(item.url)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isAuthorTagline ? '16px' : '24px',
                height: isAuthorTagline ? '16px' : '24px',
              }}
            >
              <FluentIcon
                iconName={item.iconName}
                color={theme.colorBrandForeground1}
                style={{
                  transform: `scale(${isSocialHovered(item.url) ? 1.15 : 1})`,
                  transition: 'transform 0.3s ease-in-out',
                }}
              />
              {/* Social link tooltip */}
              <span
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  opacity: isSocialHovered(item.url) ? 1 : 0,
                  visibility: isSocialHovered(item.url) ? 'visible' : 'hidden',
                  transition:
                    'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                  fontSize: theme.typography.fontSizes.md,
                  letterSpacing: theme.typography.letterSpacing.tight,
                  fontWeight: theme.typography.fontWeights.semiBold,
                  color: theme.colorBrandForeground1,
                  marginTop: '0.25rem',
                  backgroundColor:
                    theme.themeMode === 'high-contrast'
                      ? theme.colorNeutralBackground1
                      : 'transparent',
                  padding:
                    theme.themeMode === 'high-contrast' ? '4px 8px' : '0',
                  whiteSpace: 'nowrap',
                }}
              >
                {isAuthorTagline ? '' : item.tooltip}
              </span>
            </a>
          </div>
        );
      })}
    </div>
  );
};
