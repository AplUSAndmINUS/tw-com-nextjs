import type { IconProps } from './types';

export function ListIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M8.5 6.25h11' />
        <path d='M8.5 12h11' />
        <path d='M8.5 17.75h11' />
        <path d='M4.6 6.25h.01' />
        <path d='M4.6 12h.01' />
        <path d='M4.6 17.75h.01' />
    </svg>
  );
}
