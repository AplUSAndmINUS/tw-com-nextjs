import React from 'react';

import { useAppTheme } from '../../theme/hooks/useAppTheme';

interface TiktokLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export const TiktokLogo: React.FC<TiktokLogoProps> = ({ className, style }) => {
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
      viewBox='0 0 22 22'
      fill='none'
    >
      <path
        d='M8.5 2c1.1 0 2.2 0 3.3 0c0.1 1.3 0.5 2.5 1.4 3.4c0.9 0.9 2.2 1.3 3.4 1.4v3.2c-1.1 0-2.3-0.3-3.4-0.8c-0.5-0.2-0.9-0.5-1.3-0.7c0 2.3 0 4.7 0 7c-0.1 1.1-0.4 2.2-1.1 3.2c-1.1 1.6-2.9 2.5-4.7 2.6c-1.1 0.1-2.3-0.2-3.3-0.8c-1.7-0.9-2.9-2.6-3.1-4.5c0-0.4 0-0.8 0-1.2c0.1-1.6 0.9-3 2.1-4c1.3-1.1 3.2-1.7 4.9-1.4c0 1.2 0 2.4 0 3.6c-0.8-0.2-1.7-0.2-2.4 0.3c-0.5 0.4-0.9 0.8-1.1 1.4c-0.2 0.4-0.1 0.8-0.1 1.3c0.2 1.3 1.4 2.4 2.8 2.3c0.9 0 1.7-0.5 2.2-1.3c0.2-0.2 0.3-0.5 0.4-0.8c0.1-1.4 0.1-2.9 0.1-4.3C8.5 8.5 8.5 5.2 8.5 2z'
        fill={theme.colorBrandForeground1}
      />
    </svg>
  );

  // return ( old v8 nomenclature
  //   <svg
  //     className={rootClass}
  //     style={style}
  //     xmlns='http://www.w3.org/2000/svg'
  //     viewBox='0 0 22 22'
  //     fill='none'
  //   >
  //     <path
  //       d='M8.5 2c1.1 0 2.2 0 3.3 0c0.1 1.3 0.5 2.5 1.4 3.4c0.9 0.9 2.2 1.3 3.4 1.4v3.2c-1.1 0-2.3-0.3-3.4-0.8c-0.5-0.2-0.9-0.5-1.3-0.7c0 2.3 0 4.7 0 7c-0.1 1.1-0.4 2.2-1.1 3.2c-1.1 1.6-2.9 2.5-4.7 2.6c-1.1 0.1-2.3-0.2-3.3-0.8c-1.7-0.9-2.9-2.6-3.1-4.5c0-0.4 0-0.8 0-1.2c0.1-1.6 0.9-3 2.1-4c1.3-1.1 3.2-1.7 4.9-1.4c0 1.2 0 2.4 0 3.6c-0.8-0.2-1.7-0.2-2.4 0.3c-0.5 0.4-0.9 0.8-1.1 1.4c-0.2 0.4-0.1 0.8-0.1 1.3c0.2 1.3 1.4 2.4 2.8 2.3c0.9 0 1.7-0.5 2.2-1.3c0.2-0.2 0.3-0.5 0.4-0.8c0.1-1.4 0.1-2.9 0.1-4.3C8.5 8.5 8.5 5.2 8.5 2z'
  //       fill={theme.colorBrandForeground1}
  //     />
  //   </svg>
  // );
};

export default TiktokLogo;
