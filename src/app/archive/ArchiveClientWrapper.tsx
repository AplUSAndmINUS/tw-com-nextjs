'use client';

import { useRouter } from 'next/navigation';
import { AdaptiveCardGrid, AdaptiveCard } from '@/components/AdaptiveCardGrid';

interface ArchiveClientWrapperProps {
  cards: AdaptiveCard[];
  /** Map of card id to its full href path */
  routingMap: Record<string, string>;
}

/**
 * ArchiveClientWrapper — Client component for handling archive card interactions
 */
export function ArchiveClientWrapper({
  cards,
  routingMap,
}: ArchiveClientWrapperProps) {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    const href = routingMap[id];
    if (href) {
      router.push(href);
    }
  };

  return (
    <AdaptiveCardGrid
      cards={cards}
      basePath=''
      viewType='small'
      onCardClick={handleCardClick}
    />
  );
}
