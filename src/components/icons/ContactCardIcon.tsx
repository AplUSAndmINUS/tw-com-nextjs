import type { IconProps } from './types';

export function ContactCardIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M4.75 4.75h14.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H4.75a2 2 0 0 1-2-2V6.75a2 2 0 0 1 2-2Z' />
        <path d='M8.5 12a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z' />
        <path d='M5.5 16.25c.4-1.65 1.6-2.5 3-2.5s2.6.85 3 2.5' />
        <path d='M14.5 9.75h4.25' />
        <path d='M14.5 13.5h4.25' />
    </svg>
  );
}
