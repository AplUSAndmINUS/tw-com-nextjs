import React from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';

interface ApplePodcastsLogoProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const ApplePodcastsLogo: React.FC<ApplePodcastsLogoProps> = ({
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
      {/* Apple Podcasts logo - microphone with broadcast waves */}
      <circle cx='12' cy='8' r='2.5' style={{ fill: fillColor }} />
      <path
        d='M12 10.5c-1.38 0-2.5 1.12-2.5 2.5v4c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25v-4c0-1.38-1.12-2.5-2.5-2.5z'
        style={{ fill: fillColor }}
      />
      <path
        d='M7.5 13c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5'
        stroke={fillColor}
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
      <path
        d='M4.5 13c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5'
        stroke={fillColor}
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  );
};

export default ApplePodcastsLogo;
