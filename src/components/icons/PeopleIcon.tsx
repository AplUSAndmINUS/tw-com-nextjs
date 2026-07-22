import type { IconProps } from './types';

export function PeopleIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M9.5 4.75a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5Z' />
        <path d='M3.5 19.75c0-2.9 2.7-4.6 6-4.6s6 1.7 6 4.6' />
        <path d='M16 5.6a3 3 0 0 1 0 5.8' />
        <path d='M17.6 15.5c1.85.6 2.9 1.95 2.9 4.25' />
    </svg>
  );
}
