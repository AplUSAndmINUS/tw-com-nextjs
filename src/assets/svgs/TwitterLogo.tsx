'use client';

import React from 'react';

import { useAppTheme } from '../../theme/hooks/useAppTheme';

interface TwitterLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export const TwitterLogo: React.FC<TwitterLogoProps> = ({
  className,
  style,
}) => {
  const { theme } = useAppTheme();
  const rootClass: React.CSSProperties = {
    width: '32px',
    height: '32px',
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
        d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
        fill={theme.palette.themePrimary}
      />
    </svg>
  );
};

export default TwitterLogo;
