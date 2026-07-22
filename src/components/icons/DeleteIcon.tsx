import type { IconProps } from './types';

export function DeleteIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M4.5 6.5h15' />
        <path d='M9.5 6.5V4.75h5V6.5' />
        <path d='M6.5 6.5l.9 12.4a1.6 1.6 0 0 0 1.6 1.35h6a1.6 1.6 0 0 0 1.6-1.35l.9-12.4' />
        <path d='M10.25 10.25v6.5' />
        <path d='M13.75 10.25v6.5' />
    </svg>
  );
}
