import type { IconProps } from './types';

export function QuestionCircleIcon({ size = 24, className, style, title, ...rest }: IconProps) {
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
        <path d='M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z' />
        <path d='M9.6 9.4a2.4 2.4 0 1 1 3.15 2.3c-.55.2-.75.68-.75 1.27v.63' />
        <path d='M12 16.5h.01' />
    </svg>
  );
}
