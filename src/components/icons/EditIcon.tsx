import type { IconProps } from './types';

export function EditIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M4 20l.85-3.55a2 2 0 0 1 .53-.95L16.1 4.75a1.95 1.95 0 0 1 2.77 0l.38.38a1.95 1.95 0 0 1 0 2.77L8.5 18.62a2 2 0 0 1-.95.53L4 20Z' />
        <path d='M14.5 6.4l3.1 3.1' />
    </svg>
  );
}
