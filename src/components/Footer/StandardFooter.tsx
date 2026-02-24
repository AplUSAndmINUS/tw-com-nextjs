'use client';

import { FooterContent } from './FooterContent';

interface StandardFooterProps {
  /** If true, renders a more compact footer with reduced padding and smaller text */
  isCompact?: boolean;
}

/**
 * StandardFooter — Simple always-visible footer for non-homepage pages
 */
export function StandardFooter({ isCompact = false }: StandardFooterProps) {
  return (
    <footer
      className='border-t backdrop-blur-md bg-slate-100/80 dark:bg-slate-800/80 border-gray-200 dark:border-gray-700 mt-auto mb-0'
      role='contentinfo'
    >
      <FooterContent isCompact={isCompact} />
    </footer>
  );
}
