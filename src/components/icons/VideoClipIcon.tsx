import type { IconProps } from './types';

export function VideoClipIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M4.75 5.5h14.5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4.75a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z' />
        <path d='M10.25 9.4l4.75 2.6-4.75 2.6V9.4Z' />
    </svg>
  );
}
