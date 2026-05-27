import { Typography } from '@/components/Typography';
import { CSSProperties, ReactNode } from 'react';

interface AboutParagraphProps {
  children: ReactNode;
  size?: 'base' | 'large';
  weight?: 'normal' | 'semibold';
  variant?: 'body' | 'blockquote';
  className?: string;
  style?: CSSProperties;
}

const PARAGRAPH_STYLES: Record<string, CSSProperties> = {
  base: {
    lineHeight: 1.75,
    fontSize: '1rem',
  },
  large: {
    lineHeight: 1.75,
    fontSize: '1.125rem',
  },
  semibold: {
    lineHeight: 1.75,
    fontSize: '1rem',
    fontWeight: 600,
  },
  largeSemibold: {
    lineHeight: 1.75,
    fontSize: '1.125rem',
    fontWeight: 600,
  },
};

export function AboutParagraph({
  children,
  size = 'base',
  weight = 'normal',
  variant = 'body',
  style,
  className,
}: AboutParagraphProps) {
  const styleKey =
    size === 'large'
      ? weight === 'semibold'
        ? 'largeSemibold'
        : 'large'
      : weight === 'semibold'
        ? 'semibold'
        : 'base';

  return (
    <Typography
      variant={variant}
      style={{ ...PARAGRAPH_STYLES[styleKey], ...style }}
      className={className}
    >
      {children}
    </Typography>
  );
}
