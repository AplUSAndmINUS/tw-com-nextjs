import type { IconProps } from './types';

export function WeatherSunnyIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 7.85a4.15 4.15 0 1 1 0 8.3 4.15 4.15 0 0 1 0-8.3Z' />
        <path d='M12.00 5.40L12.00 2.60M16.67 7.33L18.65 5.35M18.60 12.00L21.40 12.00M16.67 16.67L18.65 18.65M12.00 18.60L12.00 21.40M7.33 16.67L5.35 18.65M5.40 12.00L2.60 12.00M7.33 7.33L5.35 5.35' />
    </svg>
  );
}
