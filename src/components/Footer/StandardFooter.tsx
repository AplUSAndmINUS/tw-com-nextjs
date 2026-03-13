'use client';

import { useState, useEffect } from 'react';
import { useAppTheme } from '@/theme/hooks/useAppTheme';
import { FooterContent } from './FooterContent';

interface StandardFooterProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
}

/**
 * StandardFooter — Simple always-visible footer for non-homepage pages
 */
export function StandardFooter({ isCompact = false }: StandardFooterProps) {
  const { reducedTransparency } = useAppTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer
      className={`border-t ${reducedTransparency ? 'bg-slate-100 dark:bg-slate-800' : 'backdrop-blur-md bg-slate-100/80 dark:bg-slate-800/80'} border-gray-200 dark:border-gray-700 mt-auto mb-0`}
      role='contentinfo'
      style={{
        opacity: isMounted ? 1 : 0,
        transition: 'opacity 0.2s ease-in',
      }}
    >
      <FooterContent isCompact={isCompact} />
    </footer>
  );
}
