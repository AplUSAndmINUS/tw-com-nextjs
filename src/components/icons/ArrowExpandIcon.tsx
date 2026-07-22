import type { IconProps } from './types';

export function ArrowExpandIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M14.25 4.25h5.5v5.5' />
        <path d='M19.75 4.25 13.5 10.5' />
        <path d='M9.75 19.75h-5.5v-5.5' />
        <path d='M4.25 19.75 10.5 13.5' />
    </svg>
  );
}
