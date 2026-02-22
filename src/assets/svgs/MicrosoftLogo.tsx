import React from 'react';

import { useAppTheme } from '../../theme/hooks/useAppTheme';

interface MicrosoftLogoProps {
  isDarkMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MicrosoftLogo: React.FC<MicrosoftLogoProps> = ({
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
        d='M2 2h9.5v9.5H2V2zm10.5 0H22v9.5h-9.5V2zM2 12.5h9.5V22H2v-9.5zm10.5 0H22V22h-9.5v-9.5z'
        fill={theme.colorBrandForeground1}
      />
    </svg>
  );
};

export default MicrosoftLogo;
