import type { IconProps } from './types';

export function WindowNewIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M10.5 4.5H6.25a2 2 0 0 0-2 2v11.25a2 2 0 0 0 2 2H17.5a2 2 0 0 0 2-2V13.5' />
        <path d='M14 4.5h5.5V10' />
        <path d='M19.5 4.5 11.25 12.75' />
    </svg>
  );
}
