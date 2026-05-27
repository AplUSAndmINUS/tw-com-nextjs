import { ReactNode } from 'react';

interface AboutBulletListProps {
  children: ReactNode;
  className?: string;
}

export function AboutBulletList({
  children,
  className = '',
}: AboutBulletListProps) {
  return (
    <ul
      className={`ml-6 mt-2 space-y-1 about-lists ${className}`.trim()}
      style={{ lineHeight: 1.75 }}
    >
      {children}
    </ul>
  );
}
