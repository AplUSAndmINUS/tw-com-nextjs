import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface SpotifyLogoProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const SpotifyLogo: React.FC<SpotifyLogoProps> = ({
  className,
  style,
  color,
}) => {
  const { theme } = useAppTheme();
  const fillColor = color || theme.palette.themePrimary;

  return (
    <svg
      className={className}
      style={{ width: '28px', height: '28px', ...style }}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
    >
      {/* Spotify logo - three curved lines */}
      <path
        d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.67 14.43c-.15.24-.42.32-.67.18-1.85-1.13-4.17-1.38-6.91-.76-.27.06-.52-.12-.58-.38-.06-.27.12-.52.38-.58 3-.68 5.53-.39 7.6.88.25.14.33.43.18.66zm.95-2.11c-.19.3-.59.39-.89.2-2.12-1.3-5.35-1.67-7.86-.92-.32.1-.66-.08-.76-.4-.1-.32.08-.66.4-.76 2.87-.86 6.44-.44 8.91 1.05.3.19.39.59.2.83zm.82-2.19c-2.54-1.51-6.73-1.65-9.15-.91-.39.12-.8-.11-.92-.5-.12-.39.11-.8.5-.92 2.77-.84 7.36-.68 10.25 1.06.35.21.47.66.27 1.01-.21.35-.66.47-1.01.27l.06-.01z'
        style={{ fill: fillColor }}
      />
    </svg>
  );
};

export default SpotifyLogo;
