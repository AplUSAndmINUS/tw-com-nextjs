import type { IconProps } from './types';

export function AccessibilityIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 3.25a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Z' />
        <path d='M4.5 8.5h15' />
        <path d='M12 8.75v6' />
        <path d='M12 14.75 9 20.75' />
        <path d='M12 14.75 15 20.75' />
    </svg>
  );
}
