import type { IconProps } from './types';

export function CalendarIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M6 5.25h12a2.25 2.25 0 0 1 2.25 2.25v10.25A2.25 2.25 0 0 1 18 20h-12a2.25 2.25 0 0 1-2.25-2.25V7.5A2.25 2.25 0 0 1 6 5.25Z' />
        <path d='M3.75 9.75h16.5' />
        <path d='M8.25 3.5v3.25' />
        <path d='M15.75 3.5v3.25' />
    </svg>
  );
}
