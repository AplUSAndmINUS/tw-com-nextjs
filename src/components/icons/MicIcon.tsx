import type { IconProps } from './types';

export function MicIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 3.5a2.75 2.75 0 0 1 2.75 2.75v5.25a2.75 2.75 0 0 1-5.5 0V6.25A2.75 2.75 0 0 1 12 3.5Z' />
        <path d='M6.5 11a5.5 5.5 0 0 0 11 0' />
        <path d='M12 16.5v4' />
        <path d='M8.75 20.5h6.5' />
    </svg>
  );
}
