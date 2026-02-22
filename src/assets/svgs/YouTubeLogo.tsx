import React from 'react';

import { useAppTheme } from '../../theme/hooks/useAppTheme';

interface YouTubeLogoProps {
  isDarkMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const YouTubeLogo: React.FC<YouTubeLogoProps> = ({
  className,
  style,
}) => {
  const { theme } = useAppTheme();
  const rootClass: React.CSSProperties = {
    width: '24px',
    height: '24px',
  };

  return (
    <svg
      className={className}
      style={{ ...rootClass, ...style }}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
    >
      <path
        d='M23 7.926C23 5.024 20.723 3 18.322 3H5.678C3.277 3 1 5.024 1 7.926v8.148C1 18.976 3.277 21 5.678 21h12.644C20.723 21 23 18.976 23 16.074V7.926z'
        fill={theme.colorBrandForeground1}
      />
      <path
        d='M16 12l-6 3.464V8.536L16 12z'
        fill={theme.colorNeutralBackground1}
        fillOpacity='0.85'
      />
    </svg>
  );
};

export default YouTubeLogo;
