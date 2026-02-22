'use client';

import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FluentIcon } from '@/components/FluentIcon';

export interface SocialIcon {
  iconName: React.ComponentType<any> | string;
  url: string;
  tooltip?: string;
  isTagline?: boolean;
}

interface SocialIconsProps {
  isAuthorTagline?: boolean;
  icons: SocialIcon[];
}

/**
 * SocialIcons component for displaying social media links
 *
 * @example
 * ```tsx
 * import { HomeRegular } from '@fluentui/react-icons';
 *
 * const socialLinks = [
 *   { iconName: HomeRegular, url: 'https://example.com', tooltip: 'Home', isTagline: true }
 * ];
 *
 * <SocialIcons icons={socialLinks} />
 * ```
 */
export const SocialIcons: React.FC<SocialIconsProps> = ({
  isAuthorTagline = false,
  icons,
}) => {
  const { theme } = useAppTheme();
  const [hoveredIcon, setHoveredIcon] = React.useState<string | null>(null);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      justifyContent: isAuthorTagline ? 'flex-start' : 'space-between',
      gap: '1rem',
      padding: isAuthorTagline
        ? 'clamp(0.5rem, 1vh, 0.75rem)'
        : 'clamp(1rem, 2vh, 2rem)',
      width: '100%',
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.container}>
      {icons.map((item) => {
        if (!item.isTagline && isAuthorTagline) return null;
        return (
          <div style={{ position: 'relative' }} key={item.url}>
            <a
              href={item.url}
              target='_blank'
              rel='noreferrer noopener'
              onMouseEnter={() => setHoveredIcon(item.url)}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isAuthorTagline ? '16px' : '24px',
                height: isAuthorTagline ? '16px' : '24px',
                textDecoration: 'none',
              }}
            >
              <FluentIcon
                iconName={item.iconName as any}
                size={isAuthorTagline ? 'small' : 'medium'}
                variant='primary'
                style={{
                  transform: `scale(${hoveredIcon === item.url ? 1.15 : 1})`,
                  transition: 'transform 0.3s ease-in-out',
                }}
              />
              {/* Tooltip */}
              {!isAuthorTagline && item.tooltip && (
                <span
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: hoveredIcon === item.url ? 1 : 0,
                    visibility: hoveredIcon === item.url ? 'visible' : 'hidden',
                    transition:
                      'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                    fontSize: theme.typography.fontSizes.xs,
                    fontWeight: theme.typography.fontWeights.semiBold,
                    color: theme.colorBrandForeground1,
                    textTransform: 'lowercase',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    marginTop: '0.25rem',
                  }}
                >
                  {item.tooltip}
                </span>
              )}
            </a>
          </div>
        );
      })}
    </div>
  );
};
