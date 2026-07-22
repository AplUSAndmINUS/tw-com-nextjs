import type { IconProps } from './types';

export function BookIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 6.75C10.4 5.2 7.9 4.6 4.25 4.85v12.9c3.65-.25 6.15.35 7.75 1.9' />
        <path d='M12 6.75c1.6-1.55 4.1-2.15 7.75-1.9v12.9c-3.65-.25-6.15.35-7.75 1.9' />
        <path d='M12 6.75v12.9' />
    </svg>
  );
}
