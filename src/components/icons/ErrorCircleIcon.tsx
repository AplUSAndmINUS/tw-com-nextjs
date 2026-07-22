import type { IconProps } from './types';

export function ErrorCircleIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z' />
        <path d='M12 7.75v5' />
        <path d='M12 16.1h.01' />
    </svg>
  );
}
