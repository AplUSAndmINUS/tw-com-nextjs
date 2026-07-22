import type { IconProps } from './types';

export function PenIcon({ size = 24, className, style, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      style={style}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable='false'
      {...rest}
    >
      {title ? <title>{title}</title> : null}
        <path d='M20.3 3.7a2.4 2.4 0 0 0-3.4 0L5.1 15.5 3.5 20.5l5-1.6L20.3 7.1a2.4 2.4 0 0 0 0-3.4Z' />
        <path d='M5.1 15.5l3.4 3.4' />
    </svg>
  );
}
