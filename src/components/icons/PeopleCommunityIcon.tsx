import type { IconProps } from './types';

export function PeopleCommunityIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 5.25a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z' />
        <path d='M7 20.25c0-2.6 2.25-4.15 5-4.15s5 1.55 5 4.15' />
        <path d='M5.5 8.25a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z' />
        <path d='M18.5 8.25a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z' />
        <path d='M2.75 18.5c0-1.8 1.2-3 2.75-3' />
        <path d='M21.25 18.5c0-1.8-1.2-3-2.75-3' />
    </svg>
  );
}
