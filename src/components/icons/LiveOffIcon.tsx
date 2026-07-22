import type { IconProps } from './types';

export function LiveOffIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 10.4a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z' />
        <path d='M8.1 15.9a5.5 5.5 0 0 1-.55-7.05' />
        <path d='M15.9 8.1a5.5 5.5 0 0 1 .55 7.05' />
        <path d='M5.15 18.85a9.6 9.6 0 0 1-.8-11.6' />
        <path d='M18.85 5.15a9.6 9.6 0 0 1 .8 11.6' />
        <path d='M4.25 4.25 19.75 19.75' />
    </svg>
  );
}
