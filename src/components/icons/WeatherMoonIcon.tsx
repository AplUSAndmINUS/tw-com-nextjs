import type { IconProps } from './types';

export function WeatherMoonIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M20.4 14.35A8.75 8.75 0 0 1 9.65 3.6a8.75 8.75 0 1 0 10.75 10.75Z' />
    </svg>
  );
}
