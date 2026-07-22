import type { IconProps } from './types';

export function SearchIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M10.5 3.75a6.75 6.75 0 1 1 0 13.5 6.75 6.75 0 0 1 0-13.5Z' />
        <path d='M15.4 15.4l4.85 4.85' />
    </svg>
  );
}
