'use client';

import { useRouter } from 'next/navigation';
import { AdaptiveCardGrid, AdaptiveCard } from '@/components/AdaptiveCardGrid';

interface ArchiveClientWrapperProps {
  cards: AdaptiveCard[];
}

/**
 * ArchiveClientWrapper — Client component for handling archive card interactions
 */
export function ArchiveClientWrapper({ cards }: ArchiveClientWrapperProps) {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card) {
      // Determine the href based on the card's tags (content type)
      const type = card.tags?.[0]?.toLowerCase();
      let basePath = '/blog';

      if (type === 'portfolio') {
        basePath = '/portfolio';
      } else if (type === 'case study') {
        basePath = '/case-studies';
      }

      router.push(`${basePath}/${id}`);
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
