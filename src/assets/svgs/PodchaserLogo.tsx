import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface PodchaserLogoProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const PodchaserLogo: React.FC<PodchaserLogoProps> = ({
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
      {/* Podchaser logo - play button with search magnifier */}
      <circle
        cx='12'
        cy='12'
        r='9'
        stroke={fillColor}
        strokeWidth='2'
        fill='none'
      />
      <path d='M10 8l6 4-6 4V8z' fill={fillColor} />
      <circle cx='18' cy='18' r='2.5' fill={fillColor} />
      <path
        d='M19.5 19.5L22 22'
        stroke={fillColor}
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
};

export default PodchaserLogo;
