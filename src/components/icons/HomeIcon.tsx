import type { IconProps } from './types';

export function HomeIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M3.5 10.5 12 3.75l8.5 6.75' />
        <path d='M5.5 9.15V18.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9.15' />
        <path d='M9.75 20.5v-5.25h4.5v5.25' />
    </svg>
  );
}
