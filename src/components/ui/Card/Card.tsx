import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

// TODO: Replace this Card component with FluentCard.tsx from TW.com and Fluxline.pro -TW
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
