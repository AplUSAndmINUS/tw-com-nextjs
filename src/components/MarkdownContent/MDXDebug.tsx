'use client';

import { useEffect } from 'react';

/**
 * MDX Debug Component - helps diagnose MDX rendering issues
 */
export function MDXDebug({ source }: { source: string }) {
  useEffect(() => {
    console.log('MDX Source Length:', source?.length || 0);
    console.log('MDX Source Preview:', source?.substring(0, 200));
  }, [source]);

  return null;
}
