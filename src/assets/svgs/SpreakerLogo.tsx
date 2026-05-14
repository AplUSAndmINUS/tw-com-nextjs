import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface SpreakerLogoProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const SpreakerLogo: React.FC<SpreakerLogoProps> = ({
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
      {/* Spreaker microphone/waveform icon */}
      <circle cx='12' cy='12' r='2' fill={fillColor} />
      <rect x='4' y='14' width='2' height='6' rx='1' fill={fillColor} />
      <rect x='8' y='10' width='2' height='10' rx='1' fill={fillColor} />
      <rect x='14' y='10' width='2' height='10' rx='1' fill={fillColor} />
      <rect x='18' y='14' width='2' height='6' rx='1' fill={fillColor} />
    </svg>
  );
};

export default SpreakerLogo;
