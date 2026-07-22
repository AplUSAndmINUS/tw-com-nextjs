import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface AmazonMusicLogoProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const AmazonMusicLogo: React.FC<AmazonMusicLogoProps> = ({
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
      {/* Amazon Music logo - musical note with smile */}
      <path
        d='M9 3v11c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c.35 0 .69.06 1 .17V3h2z'
        style={{ fill: fillColor }}
      />
      <path
        d='M16 3v11c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c.35 0 .69.06 1 .17V6h2v8h2V3h-2z'
        style={{ fill: fillColor }}
      />
      <path
        d='M3 19c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z'
        style={{ fill: fillColor }}
      />
      <path
        d='M20 20c-1.5 1.5-3.5 2-5.5 2s-4-.5-5.5-2'
        stroke={fillColor}
        strokeWidth='1.5'
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  );
};

export default AmazonMusicLogo;
