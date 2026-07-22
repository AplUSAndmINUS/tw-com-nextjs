import type { IconProps } from './types';

export function SettingsIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M9.46 5.37L9.84 2.65L14.16 2.65L14.54 5.37L14.89 5.51L17.09 3.86L20.14 6.91L18.49 9.11L18.63 9.46L21.35 9.84L21.35 14.16L18.63 14.54L18.49 14.89L20.14 17.09L17.09 20.14L14.89 18.49L14.54 18.63L14.16 21.35L9.84 21.35L9.46 18.63L9.11 18.49L6.91 20.14L3.86 17.09L5.51 14.89L5.37 14.54L2.65 14.16L2.65 9.84L5.37 9.46L5.51 9.11L3.86 6.91L6.91 3.86L9.11 5.51Z' />
        <path d='M12 8.85a3.15 3.15 0 1 1 0 6.3 3.15 3.15 0 0 1 0-6.3Z' />
    </svg>
  );
}
