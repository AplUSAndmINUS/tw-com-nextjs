import type { IconProps } from './types';

export function LocationNotFoundIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 20.75s6.75-6.15 6.75-10.75a6.75 6.75 0 1 0-13.5 0c0 4.6 6.75 10.75 6.75 10.75Z' />
        <path d='M10.05 8.05 13.95 11.95' />
        <path d='M13.95 8.05 10.05 11.95' />
    </svg>
  );
}
