import type { IconProps } from './types';

export function PersonIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z' />
        <path d='M4.5 20.25c0-3.3 3.35-5.25 7.5-5.25s7.5 1.95 7.5 5.25' />
    </svg>
  );
}
