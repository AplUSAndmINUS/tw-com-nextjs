'use client';

import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { useState } from 'react';

export function AboutFluxlineLink() {
  const { theme } = useAppTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href='https://fluxline.pro'
      target='_blank'
      rel='noopener noreferrer'
      style={{
        color: hovered
          ? theme.semanticColors.link.hover
          : theme.semanticColors.link.default,
        textDecoration: 'underline',
        transition: `color ${theme.animations.duration.fast} ${theme.animations.easing.smooth}`,
      }}
      onPointerEnter={(e: React.PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={(e: React.PointerEvent<HTMLAnchorElement>) => {
        if (e.pointerType === 'mouse') setHovered(false);
      }}
    >
      Fluxline Resonance Group
    </a>
  );
}
